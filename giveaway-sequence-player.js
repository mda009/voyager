(()=>{'use strict';
 const S=window.VoyagerGiveawaySequence,$=id=>document.getElementById(id),animation=$('animation'),wheel=$('wheel');
 const effects=new VoyagerWheelEffects($('wheel-effects'),wheel);
 let state=null,offset=0,volume=.75,muted=false,key='',wheelReady=false,lastRevision=-1,lastStateType='',lastPhase='';
 function postWheel(){if(!state||!wheelReady)return;const normalized=S.wheelState(state);if(normalized)wheel.contentWindow.postMessage({type:'voyager.wheel.preview.v1',state:normalized,offset},'*');}
 function render(){
  const now=Date.now()+offset,v=S.phase(state,now),e=S.event(state),t=e?S.timeline(e):null;
  document.body.dataset.phase=v.phase;
  // Re-sync at phase boundaries as well as state changes. This also handles
  // OBS waking a suspended browser source after the buildup has finished.
  if(v.phase!==lastPhase){lastPhase=v.phase;postWheel();}
  const playing=v.phase!=='hidden';animation.hidden=!playing;
  const hasWheel=playing&&state?.view==='reveal'&&t?.v2;
  wheel.hidden=!hasWheel;
  const validPool=!hasWheel||S.wheelState(state)?.session;
  effects.sync({active:v.phase==='wheel'&&!!validPool,start:t?.spinAt||0,duration:t?.spinMs||30000,offset});
  $('notice').hidden=!!validPool||v.phase!=='wheel';
  $('notice').textContent='Waiting for the saved draw pool. No replacement winner will be selected.';
  const next=playing?state.view+':'+e.id:'';
  if(next!==key){
   key=next;
   if(!playing){animation.removeAttribute('src');return;}
   const q=new URLSearchParams({at:String(e.at-offset),event:e.id,mute:muted?'1':'0',volume:String(volume)});
   if(state.view==='celebration'){q.set('name',e.winner||'');animation.src='Voyager_Congratulations.html?'+q;}
   else{
    q.set('winner',e.winner||'');q.set('platform',S.winnerPlatform(state));q.set('v','2.1.3');q.set('title',e.title||'');q.set('draw',e.drawId||e.id);q.set('requiresClaim',t.deadline>0?'true':'false');
    q.set('claimDeadline',String(t.deadline>0?t.deadline-offset:0));q.set('wheelSeconds',t.v2?'30':'0');q.set('claimSeconds','60');
    animation.src='GiveawayOS_Reveal.html?'+q;
   }
  }
 }
 function accept(data){
  const s=data.state,type=s?.campaign?'tickets':'groups';if(!s||s.schema!==1||!Number.isFinite(s.revision))return;
  if(type===lastStateType&&s.revision<lastRevision)return;
  state=s;lastRevision=s.revision;lastStateType=type;offset=Number.isFinite(data.offset)?data.offset:0;
  volume=Math.max(0,Math.min(1,Number.isFinite(data.volume)?data.volume:.75));muted=data.muted===true;
  postWheel();render();
 }
 addEventListener('message',e=>{
  if(e.source===parent&&parent!==window&&e.data?.type==='voyager.giveaway.sequence')accept(e.data);
  else if(e.source===wheel.contentWindow&&e.data?.type==='voyager.wheel.preview.ready.v1'){wheelReady=true;postWheel();}
 });
 wheel.addEventListener('load',()=>{wheelReady=true;postWheel();});
 if(parent!==window)parent.postMessage({type:'voyager.giveaway.sequence.ready'},'*');
 const timer=setInterval(render,50);addEventListener('pagehide',()=>{clearInterval(timer);effects.destroy();animation.removeAttribute('src');});
})();
