import {CALL_COOLDOWN_MS} from './engine.mjs';

export function formatCooldown(seconds){
  const value=Math.max(0,Math.ceil(seconds));
  return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
}

// The host owns the deadline. Only interpolate between fresh snapshots; never
// announce readiness from an expired, disconnected or stale browser timer.
export function cooldownView(packet,{elapsedMs=0,connected=true}={}){
  const game=packet?.game;
  if(!connected||!game||!Number.isFinite(game.cooldownRemaining)||!Number.isFinite(game.cooldownUntil)||elapsedMs>5000){
    return {mode:'offline',label:'NEXT VOYAGER BATTLE',value:'--:--',hint:'Reconnecting to Voyager…',progress:0,ready:false};
  }
  const elapsed=Math.max(0,elapsedMs)/1000;
  const atReceipt=Number.isFinite(packet.serverTime)?Math.max(0,(game.cooldownUntil-packet.serverTime)/1000):game.cooldownRemaining;
  const remaining=Math.max(0,Math.ceil(atReceipt-elapsed));
  const progress=Math.max(0,Math.min(1,1-remaining/(CALL_COOLDOWN_MS/1000)));
  const chat=packet.connection?.connected===true;
  const training=game.caller?.demo||game.players?.some(p=>p.demo);
  let hold='';
  if(game.paused)hold='Arena paused · waiting for the host';
  else if(!game.open)hold='Entries closed · waiting for the host';
  else if(!chat)hold='Chat offline · waiting to reconnect';

  if(remaining>0){
    let hint=hold||'Next battle call opens when the timer ends';
    if(!hold&&game.phase==='calling'&&!training)hint='Challenger wanted now · type !versus to join';
    else if(!hold&&training)hint='Training in progress · live cooldown continues';
    else if(!hold&&['countdown','battle','result'].includes(game.phase))hint='Current battle in progress · next call counting down';
    return {mode:'cooldown',label:'NEXT CALL IN',value:formatCooldown(remaining),hint,progress,ready:false};
  }
  if(hold)return {mode:'hold',label:'COOLDOWN COMPLETE',value:'ON HOLD',hint:hold,progress:1,ready:false};
  if(training)return {mode:'busy',label:'NEXT LIVE CALL',value:'TRAINING',hint:'Waiting for the training session to finish',progress:1,ready:false};
  if(game.phase==='calling')return {mode:'join',label:'CHALLENGER WANTED',value:'JOIN NOW',hint:'Type !versus to join the waiting pilot',progress:1,ready:false};
  if(game.phase!=='lobby')return {mode:'busy',label:'NEXT CALL AFTER THIS BATTLE',value:'IN BATTLE',hint:'The arena will reopen after the winner screen',progress:1,ready:false};
  if(game.matches?.length||game.queue?.length>=2)return {mode:'busy',label:'NEXT BATTLE',value:'QUEUED',hint:'Waiting pilots are next to launch',progress:1,ready:false};
  // Wait for a fresh host confirmation at the boundary, including after sleep.
  if(game.cooldownRemaining>0)return {mode:'hold',label:'COOLDOWN COMPLETE',value:'SYNCING',hint:'Confirming the next call with Voyager…',progress:1,ready:false};
  return {mode:'ready',label:'BATTLE CALL AVAILABLE',value:'READY',hint:'Type !versus to call for a challenger',progress:1,ready:true};
}
