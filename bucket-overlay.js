/* Read-only OBS display. Uses the existing Points Ledger and existing config.js. */
(()=>{'use strict';
const M=window.VoyagerBucketOverlay,$=id=>document.getElementById(id);
const params=new URLSearchParams(location.search),preview=params.get('preview')==='1';
// Optional presentation setting only; balances and targets stay ledger-owned.
const opacity=params.has('opacity')&&params.get('opacity').trim()!==''?Number(params.get('opacity')):NaN;
if(Number.isFinite(opacity))document.documentElement.style.setProperty('--surface-opacity',String(Math.max(0,Math.min(90,opacity))/100));
const strip=$('goal-strip'),status=$('feed-status'),rows=new Map(M.tiers.map(key=>[key,document.querySelector('[data-tier="'+key+'"]')]));
let data=null,receivedAt=null,connected=false,failed=false,connectionState='connecting',client=null;
// 2.20.31: shown on a cycle. ?every=300&show=30 (seconds) are the defaults; ?always=1 keeps the strip on screen as before.
const num=(k,d,min,max)=>{const n=Number(params.get(k));return Number.isFinite(n)&&params.has(k)?Math.max(min,Math.min(max,n)):d;};
const always=params.get('always')==='1'||(preview&&params.get('cycle')!=='1'),everyMs=num('every',300,45,86400)*1000,showMs=num('show',30,8,600)*1000;
let visible=always,cycleTimer=0,hideTimer=0,shownOnce=false,hideAt=0;
// 2.20.38: goal met. The alert sound and a flare on the tile when a tier crosses its threshold while this source is open.
// Off unless ?goalfx=1: your separate full-screen "Voyager Goal FX" source (Streamer.bot reader + Voyager_Goal_Overlay.html) already celebrates a met goal.
const goalFx=params.get('goalfx')==='1',soundOn=goalFx&&params.get('sound')!=='0',volume=Math.max(0,Math.min(100,num('volume',80,0,100)))/100,ALERT_MS=24000;
const alertAudio=new Audio('Voyager_Versus/dist/sounds/tierup.mp3?v=2.20.37');alertAudio.preload='auto';
const wasComplete=new Map(); // per tier: last seen complete flag (undefined until the first live snapshot)
function hold(ms){if(always||!visible)return;const until=Date.now()+ms;if(until<=hideAt)return;clearTimeout(hideTimer);hideAt=until;
 hideTimer=setTimeout(()=>{strip.classList.add('out');setTimeout(()=>{strip.classList.remove('on','out');visible=false;hideAt=0;render();},700);},ms);}
function celebrate(key){
 const row=rows.get(key);if(!row)return;
 if(!visible&&!always){show();}hold(ALERT_MS+2000);
 row.classList.remove('met');void row.offsetWidth;row.classList.add('met');
 const ring=document.createElement('i');ring.className='ring';row.append(ring);setTimeout(()=>ring.remove(),1400);
 for(let i=0;i<26;i++){const sp=document.createElement('i');sp.className='spark';const a=Math.random()*Math.PI*2,d=60+Math.random()*160;sp.style.setProperty('--dx','calc('+Math.round(Math.cos(a)*d)+' * var(--u))');sp.style.setProperty('--dy','calc('+Math.round(Math.sin(a)*d*.6)+' * var(--u))');sp.style.animationDelay=(Math.random()*.2).toFixed(2)+'s';row.append(sp);setTimeout(()=>sp.remove(),1800);}
 const stamp=document.createElement('div');stamp.className='stamp';stamp.innerHTML='<b>GOAL MET</b><span>'+key.toUpperCase()+' GIVEAWAY UNLOCKED · STELLAR SUNDAY</span>';row.append(stamp);setTimeout(()=>stamp.remove(),6400);
 if(soundOn&&volume>0){try{alertAudio.currentTime=0;alertAudio.volume=volume;const p=alertAudio.play();if(p?.catch)p.catch(()=>{});}catch{}}
}
if(!always)document.body.classList.add('cycle');
function show(){if(visible||always)return;visible=true;shownOnce=true;strip.classList.remove('out');strip.classList.add('on');render();hideAt=Date.now()+showMs;
 hideTimer=setTimeout(()=>{strip.classList.add('out');setTimeout(()=>{strip.classList.remove('on','out');visible=false;hideAt=0;render();},700);},showMs);}
function startCycle(){if(always||cycleTimer)return;show();cycleTimer=setInterval(show,everyMs);}
function render(){
 const fresh=!!data&&connected&&!failed&&M.freshness(data,receivedAt);
 strip.dataset.fresh=String(!data||fresh);
 for(const key of M.tiers){
  const b=M.bucket(data,key),row=rows.get(key),track=row.querySelector('.track');
  row.classList.toggle('complete',b.complete);row.classList.toggle('unavailable',!b.available);
  if(b.available){const prev=wasComplete.get(key);if(goalFx&&prev===false&&b.complete)setTimeout(()=>celebrate(key),0);wasComplete.set(key,b.complete);}
  row.querySelector('.percentage').textContent=b.percentage;
  row.querySelector('.balance').textContent=b.balance;row.querySelector('.balance').title=b.balance;
  row.querySelector('.goal-note').textContent=b.note;
  row.querySelector('.fill').style.transform='scaleX('+(visible?b.fill/100:0)+')';
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
 startCycle(); // the first appearance waits for real figures, then every ${every} seconds
}
if(preview){
 $('strip-title').textContent='DESIGN PREVIEW';
 // Deliberately fictional values. This branch never creates a connection.
 function showExample(name){
  const samples={screenshot:[8400,10800,51000],reference:[5040,138000,57200],dashboard:[3600,3000,51000],complete:[72000,120000,200000],reset:[5040,2400,57200],empty:[0,0,0]};
  if(name==='goalmet'){const now=Date.now(),targets=[72000,120000,200000];connected=true;accept({ok:true,schema:1,serverAt:now,lastScanAt:now,buckets:Object.fromEntries(M.tiers.map((key,i)=>[key,{points:key==='gold'?119400:[8400,0,51000][i],target:targets[i]}]))});
   setTimeout(()=>accept({ok:true,schema:1,serverAt:Date.now(),lastScanAt:Date.now(),buckets:Object.fromEntries(M.tiers.map((key,i)=>[key,{points:key==='gold'?120000:[8400,0,51000][i],target:targets[i]}]))}),900);return;}
  if(name==='replay'){if(always){document.body.classList.add('cycle');strip.classList.remove('on','out');void strip.offsetWidth;strip.classList.add('on');setTimeout(()=>{strip.classList.add('out');setTimeout(()=>{strip.classList.remove('on','out');document.body.classList.remove('cycle');},700);},showMs);}else show();return;}
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
window.addEventListener('pagehide',()=>{clearInterval(freshnessTimer);clearInterval(cycleTimer);clearTimeout(hideTimer);client?.stop();});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
