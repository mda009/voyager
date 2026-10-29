(()=>{'use strict';
const M=window.VoyagerLiveOverlayModel,$=id=>document.getElementById(id),params=new URLSearchParams(location.search),preview=params.get('preview')==='1',monitor=params.get('monitor')==='1';
const fmt=n=>n===null||n===undefined?'—':n.toLocaleString('en-AU');
const icons={twitch:'<path d="M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z"/>',youtube:'<path d="M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.3 1.4-.5 3.4-.5 5s.2 3.6.5 5c.3 1.4 1.2 2.3 2.6 2.5 1.9.3 5.4.5 7.4.5s5.5-.2 7.4-.5c1.4-.2 2.3-1.1 2.6-2.5.3-1.4.5-3.4.5-5s-.2-3.6-.5-5z"/><path fill="#15202d" d="m10 8 6 4-6 4z"/>',kick:'<path d="M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z"/>'};
const label=(p,k)=>k==='viewers'?'VIEWERS':k==='followers'?(p==='youtube'?'SUBSCRIBERS':'FOLLOWERS'):(p==='youtube'?'PAID MEMBERS':'ACTIVE SUBS');
let packet=null,offset=0,hostError=false,active=true,timer,abort;
for(const p of M.platforms){const card=document.createElement('section');card.className='platform';card.dataset.platform=p;card.setAttribute('aria-label',M.names[p]);card.innerHTML=`<div class="platform-heading"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icons[p]}</svg><strong>${M.names[p]}</strong><span class="platform-state" id="${p}-state">WAITING</span></div><div class="numbers">${['viewers','followers','subscriptions'].map(k=>`<div class="metric" id="${p}-${k}"><b>—</b><small>${label(p,k)}</small><span class="metric-note"></span></div>`).join('')}</div><div class="goal" id="${p}-goal"><div class="goal-meta"><span></span><b></b></div><div class="goal-track" role="progressbar"><i class="goal-fill"></i></div></div>`;$('platform-strip').append(card);}
function fit(){const s=Math.min(innerWidth/1200,innerHeight/230);$('live-strip').style.transform='scale('+s+')';}
function render(){
 const effective=hostError&&packet?{...packet,receivedAt:0}:packet,v=M.view(effective,Date.now()+offset),c=packet?.config||{visible:true,opacity:35,goal:'followers'};
 $('live-strip').hidden=!preview&&!monitor&&!c.visible;$('live-strip').style.setProperty('--panel-alpha',String(c.opacity/100));
 $('combined-value').textContent=fmt(v.total);$('combined-label').textContent=v.coverage===3?'VIEWERS NOW':v.coverage?'VIEWERS · PARTIAL':'VIEWERS NOW';
 const state=$('strip-state');state.dataset.state=v.state;state.textContent=preview?'DESIGN PREVIEW · SAMPLE DATA':monitor?'CONTROL PREVIEW · '+(c.visible?'SHOWN':'HIDDEN'):hostError?'LOCAL HOST UNAVAILABLE':({waiting:'WAITING FOR DASHBOARD','dashboard-offline':'DASHBOARD OFFLINE',reconnecting:'RECONNECTING',ready:v.coverage===3?'LIVE DATA':v.coverage?'PARTIAL DATA':'WAITING FOR VIEWERS'})[v.state];
 $('feed-note').textContent=preview?'FICTIONAL FIGURES · PREVIEW ONLY':hostError?'Start Voyager Control to reconnect.':!packet?.feed?'Open the Live dashboard in a browser or OBS dock.':!v.fresh?'Live dashboard feed paused · current audience unavailable.':!v.connected?'Streamer.bot disconnected · totals are last known.':v.coverage+' / 3 AUDIENCES REPORTING · PLATFORM COUNTS MAY OVERLAP';
 for(const p of M.platforms){const row=v.platforms[p];$(p+'-state').textContent=row.state.toUpperCase();$(p+'-state').dataset.state=row.state;
  for(const k of ['viewers','followers','subscriptions']){const m=row.metrics[k],el=$(p+'-'+k);el.querySelector('b').textContent=fmt(m.value);el.dataset.stale=String(m.stale);el.querySelector('.metric-note').textContent=m.manual?'MANUAL':m.stale&&m.value!==null?'LAST KNOWN':'';}
  const box=$(p+'-goal');box.hidden=c.goal==='none';if(box.hidden)continue;
  const m=row.metrics[c.goal],target=row.goals[c.goal],value=m?.available?m.value:null,valid=Number.isSafeInteger(target)&&target>0,percent=valid&&value!==null?Math.min(100,value/target*100):0;
  box.querySelector('.goal-meta span').textContent=label(p,c.goal)+' GOAL';box.querySelector('.goal-meta b').textContent=!valid?'NOT SET':fmt(value)+' / '+fmt(target)+(value!==null?' · '+Math.round(percent)+'%':'');
  const track=box.querySelector('.goal-track');track.setAttribute('aria-label',M.names[p]+' '+label(p,c.goal)+' goal');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(target||100));track.removeAttribute('aria-valuenow');if(valid&&value!==null)track.setAttribute('aria-valuenow',String(Math.min(value,target)));track.setAttribute('aria-valuetext',!valid?'Goal not set':value===null?'Current value unavailable':fmt(value)+' of '+fmt(target)+(m.manual?' (manual)':''));box.querySelector('.goal-fill').style.width=percent+'%';
 }
 fit();
}
async function poll(){if(!active)return;abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),4000);try{const response=await fetch('/api/live-overlay',{cache:'no-store',signal:abort.signal});if(!response.ok)throw Error();const next=await response.json();if(next.schema!==1)throw Error();packet=next;offset=next.serverAt-Date.now();hostError=false;}catch{hostError=true;}finally{clearTimeout(timeout);if(active){render();timer=setTimeout(poll,2000);}}}
if(preview){packet=M.demo();render();window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='voyager.live.preview')return;packet={...M.demo(),config:{...M.demo().config,...e.data.config}};render();});}
else{render();poll();}
window.addEventListener('resize',fit);window.addEventListener('pagehide',()=>{active=false;clearTimeout(timer);abort?.abort();});window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
