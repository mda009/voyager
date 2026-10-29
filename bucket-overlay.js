/* Read-only OBS display. Uses the existing Points Ledger and existing config.js. */
(()=>{'use strict';
const M=window.VoyagerBucketOverlay,$=id=>document.getElementById(id);
const params=new URLSearchParams(location.search),preview=params.get('preview')==='1';
// Optional presentation setting only; balances and targets stay ledger-owned.
const opacity=params.has('opacity')&&params.get('opacity').trim()!==''?Number(params.get('opacity')):NaN;
if(Number.isFinite(opacity))document.documentElement.style.setProperty('--surface-opacity',String(Math.max(0,Math.min(90,opacity))/100));
const strip=$('goal-strip'),status=$('feed-status'),rows=new Map(M.tiers.map(key=>[key,document.querySelector('[data-tier="'+key+'"]')]));
let data=null,receivedAt=null,connected=false,failed=false,connectionState='connecting',client=null;
function render(){
 const fresh=!!data&&connected&&!failed&&M.freshness(data,receivedAt);
 strip.dataset.fresh=String(!data||fresh);
 for(const key of M.tiers){
  const b=M.bucket(data,key),row=rows.get(key),track=row.querySelector('.track');
  row.classList.toggle('complete',b.complete);row.classList.toggle('unavailable',!b.available);
  row.querySelector('.percentage').textContent=b.percentage;
  row.querySelector('.balance').textContent=b.balance;row.querySelector('.balance').title=b.balance;
  row.querySelector('.goal-note').textContent=b.note;
  row.querySelector('.fill').style.transform='scaleX('+(b.fill/100)+')';
  if(b.available)track.setAttribute('aria-valuenow',String(b.fill));else track.removeAttribute('aria-valuenow');
  track.setAttribute('aria-valuetext',b.available?b.percentage+'; '+b.balance+(fresh?'':'; last known value'):'Points unavailable');
 }
 let state='waiting',label='CONNECTING';
 if(preview){state='preview';label='SAMPLE DATA';}
 else if(connectionState==='error'){state='stale';label=data?'CHECK CONNECTION · LAST KNOWN':'CHECK CONNECTION';}
 else if(!connected){state=data?'stale':'waiting';label=data?'RECONNECTING · LAST KNOWN':'CONNECTING';}
 else if(!data){label=failed?'WAITING FOR LEDGER':'SYNCING';}
 else if(!fresh){state='stale';label='LAST KNOWN · UPDATING';}
 else if(M.tiers.some(key=>!M.bucket(data,key).available)){state='stale';label='PARTIAL DATA';}
 else{state='live';label='POINTS SYNCED';}
 status.dataset.state=state;status.querySelector('span').textContent=label;
}
function accept(snapshot){
 if(snapshot?.ok!==true||snapshot?.schema!==1||!snapshot.buckets||Array.isArray(snapshot.buckets)||typeof snapshot.buckets!=='object')return;
 data=snapshot;receivedAt=Date.now();failed=false;render();
}
if(preview){
 $('strip-title').textContent='DESIGN PREVIEW';
 // Deliberately fictional values. This branch never creates a connection.
 function showExample(name){
  const samples={screenshot:[8400,10800,51000],reference:[5040,138000,57200],dashboard:[3600,3000,51000],complete:[72000,120000,200000],reset:[5040,2400,57200],empty:[0,0,0]};
  if(!Object.prototype.hasOwnProperty.call(samples,name))return;
  const now=Date.now(),targets=[72000,120000,200000];connected=true;
  accept({ok:true,schema:1,serverAt:now,lastScanAt:now,buckets:Object.fromEntries(M.tiers.map((key,i)=>[key,{points:samples[name][i],target:targets[i]}]))});
 }
 showExample('screenshot');
 window.addEventListener('message',e=>{if(e.source===window.parent&&e.data?.type==='voyager.bucket.preview')showExample(e.data.example);});
}else{
 // Even if accidentally called, this display cannot send admin or scan operations.
 class BucketConnection extends window.VoyagerPointsConnection{
  call(operation){if(operation!=='snapshot')return Promise.reject(Error('This overlay only reads points snapshots.'));return super.call('snapshot',{});}
 }
 client=new BucketConnection();
 client.addEventListener('status',e=>{connectionState=e.detail.state;connected=connectionState==='live';if(!connected&&data)failed=true;render();});
 client.addEventListener('points',e=>accept(e.detail));
 client.addEventListener('notice',()=>{failed=true;render();});
 render();client.connect();
}
const freshnessTimer=setInterval(()=>{if(!preview)render();},15000);
// pagehide can precede restoration from browser history; pageshow resumes a stopped source.
window.addEventListener('pagehide',()=>{clearInterval(freshnessTimer);client?.stop();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
