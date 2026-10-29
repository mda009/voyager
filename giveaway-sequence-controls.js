/* Keep the existing controller and transport; extend its presentation to Engine 8. */
(()=>{'use strict';
 const Base=window.VoyagerConnection;if(typeof Base!=='function')return;
 let client=null,detail=null,wasBuilding=false;const $=id=>document.getElementById(id);
 function preview(){if(detail?.state)$('preview')?.contentWindow?.postMessage({type:'voyager.preview',state:detail.state,offset:client?.offset||0,muted:true},'*');}
 window.VoyagerConnection=class extends Base{
  constructor(...args){super(...args);this.addEventListener('state',e=>{if(e.detail?.ok&&e.detail.state){client=this;detail=e.detail;queueMicrotask(()=>{paint();preview();});}});}
 };
 function paint(){
  const s=detail?.state;if(!s||Number(s.engineVersion)<8)return;
  if($('claim')){$('claim').checked=true;$('claim').disabled=true;}
  if($('claim-seconds')){$('claim-seconds').value='60';$('claim-seconds').readOnly=true;}
  if($('claim-setting'))$('claim-setting').hidden=false;
  if($('claim-help'))$('claim-help').textContent='All new draws: original countdown and buildup → 30-second wheel → winner reveal → 60-second claim timer.';
  const e=s.reveal,now=Date.now()+(client?.offset||0),building=e&&now<Number(e.at)+(Number(e.sequenceVersion)===2?50000:20000);
  const released=wasBuilding&&!building;wasBuilding=!!building;
  if(released)client.dispatchEvent(new CustomEvent('state',{detail}));
  if(building){
   for(const id of ['main-action','confirm','reroll','replay','new-session','test-reveal','show-pool'])if($(id))$(id).disabled=true;
   const original=s.session?.draws?.find(x=>x.id===s.session.currentDrawId);
   // Replaying the animation must not remove an already-earned claim window.
   if($('confirm')&&original?.status==='selected'&&now>=Number(original.at)+(Number(original.sequenceVersion)===2?50000:20000)&&Number(original.claimDeadline)>now)$('confirm').disabled=false;
   const elapsed=now-e.at;
   if($('winner-state'))$('winner-state').textContent=elapsed<10000?'COUNTDOWN':elapsed<20000?'BUILDUP · GOOD LUCK':'WHEEL SPINNING';
   if($('winner-name'))$('winner-name').textContent='Drawing your winner…';
   if($('winner-caption'))$('winner-caption').textContent=elapsed<20000?'Your original reveal buildup is playing.':'Wheel lands in '+Math.max(0,Math.ceil((e.at+50000-now)/1000))+' seconds.';
   if($('draw-progress'))$('draw-progress').style.width=Math.max(0,Math.min(100,elapsed/50000*100))+'%';
  }else{
   const d=s.session?.draws?.find(x=>x.id===s.session.currentDrawId);
   if(d?.status==='selected'&&d.sequenceVersion===2){
    const expired=now>=d.claimDeadline;
    if(expired&&$('confirm'))$('confirm').disabled=true;
    if($('winner-state'))$('winner-state').textContent=expired?'RE-ROLL':'WINNER DRAWN';
    if($('winner-name'))$('winner-name').textContent=d.winner.name;
    if($('winner-caption'))$('winner-caption').textContent=expired?'Unclaimed · use Re-roll to choose the next winner.':now<d.claimStartsAt?'60-second claim timer starts in '+Math.ceil((d.claimStartsAt-now)/1000)+'s.':'Claim within '+Math.max(0,Math.ceil((d.claimDeadline-now)/1000))+'s.';
   }
  }
 }
 $('preview')?.addEventListener('load',preview);
 const timer=setInterval(paint,100);addEventListener('pagehide',()=>clearInterval(timer));
})();
