(()=>{'use strict';
const preview=new URLSearchParams(location.search).get('preview')==='1';
const pool=document.getElementById('pool'),reveal=document.getElementById('reveal');let currentEvent='',state=null,offset=0,returnTimer=null,previewConnectionIssue='';
function sendPanel(){
 let panelState=state;const s=state?.session||state?.preview;
 // Member pools already contain one record per eligible account. Keep that
 // combined list and exclude past picks, without changing the saved session.
 if(s&&s.mode!=='chat'&&Array.isArray(s.pool)){const used=new Set((s.draws||[]).map(d=>d.winner.key));panelState={...state,session:{...s,pool:s.pool.filter(u=>!used.has(u.key)),error:s.preview?(previewConnectionIssue||s.error||''):s.error}};}
 pool.contentWindow.postMessage({type:'voyager.panel.state.v1',state:panelState,offset},'*');
}
function stopReveal(){reveal.hidden=true;if(reveal.getAttribute('src')!=='about:blank')reveal.src='about:blank';currentEvent='';}
function finishReveal(eventId){if(state?.view!=='reveal'||state.reveal?.id!==eventId)return;stopReveal();if(state.session?.mode==='chat'){pool.hidden=false;sendPanel();}}
pool.addEventListener('load',sendPanel);
function apply(next,clockOffset=0){if(!next)return;if(state?.revision!=null&&next.revision!=null&&next.revision<state.revision)return;state=next;offset=clockOffset;clearTimeout(returnTimer);sendPanel();
 if(state.view==='pool'&&(state.session||state.preview)){stopReveal();pool.hidden=false;return;}
 pool.hidden=true;
 if(state.view==='celebration'&&state.celebration){
  const c=state.celebration,at=Number(c.at)-offset,end=at+8000,eventId='congrats:'+c.id;
  // Use the committed claim time so syncs cannot restart an expired alert.
  if(!c.id||!Number.isFinite(at)||at>Date.now()+5000||Date.now()>=end){stopReveal();return;}
  returnTimer=setTimeout(()=>{if(state?.view==='celebration'&&state.celebration?.id===c.id)stopReveal();},Math.max(0,end-Date.now()));
  if(currentEvent===eventId)return;
  currentEvent=eventId;reveal.title='Congratulations to the confirmed winner';
  const q=new URLSearchParams({name:c.winner||'',at:String(at),event:c.id});
  reveal.src='Voyager_Congratulations.html?'+q;reveal.hidden=false;return;
 }
 if(state.view==='reveal'&&state.reveal){const r=state.reveal,at=r.at-offset,deadline=r.claimDeadline?r.claimDeadline-offset:0,end=deadline>0?Math.max(at+55000,deadline+11000):at+55000;
  // Group reveals retain their original lifecycle; only chat draws return to a panel.
  if(state.session?.mode!=='chat'&&currentEvent===r.id)return;
  if(Date.now()>=end){finishReveal(r.id);return;}
  if(state.session?.mode==='chat')returnTimer=setTimeout(()=>finishReveal(r.id),end-Date.now());if(currentEvent===r.id)return;currentEvent=r.id;
  const q=new URLSearchParams({winner:r.winner+(r.platform?' · '+({twitch:'Twitch',youtube:'YouTube',kick:'Kick'}[r.platform]||r.platform):''),title:r.title,at:String(at),draw:r.id,requiresClaim:String(deadline>0),claimDeadline:String(deadline),volume:String(window.VOYAGER_CONFIG?.giveawayVolume??.75)});
  if(preview)q.set('mute','1');reveal.title='GiveawayOS winner reveal';reveal.src='GiveawayOS_Reveal.html?'+q;reveal.hidden=false;return;
 }
 stopReveal();
}
// Only the embedding control preview may supply local preview events.
if(preview){addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='voyager.preview.state')apply(e.data.state,e.data.offset||0);});parent.postMessage({type:'voyager.preview.ready'},'*');}
else{const connection=new VoyagerConnection();connection.addEventListener('state',e=>{if(e.detail.ok&&e.detail.state)apply(e.detail.state,connection.offset);});connection.addEventListener('status',e=>{previewConnectionIssue=e.detail.state==='live'?'':'Membership updates paused while reconnecting.';sendPanel();});setInterval(()=>{if(connection.ready&&state?.preview&&!state?.session)connection.sync().catch(()=>{});},15000);connection.connect();}
})();
