/* Shared, display-only timeline. Winner selection remains in Streamer.bot. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VoyagerGiveawaySequence=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const LEAD=20000,SPIN=30000,HOLD=10000,CLAIM=60000,REROLL=11000;
 function event(state){return state?.view==='celebration'?state.celebration:state?.view==='reveal'?state.reveal:null;}
 function current(state){return state?.campaign?.draws?.at(-1)||(state?.session?.draws||[]).find(d=>d.id===state.session.currentDrawId)||null;}
 function winnerPlatform(state){
  const e=event(state);if(!e)return '';
  const platform=value=>{const p=String(value||'').trim().toLowerCase();return ['twitch','youtube','kick'].includes(p)?p:'';};
  // Match the reveal's exact saved draw, including replays. Display names are
  // not account identities and may be identical on different platforms.
  if(e.test)return platform(e.platform);
  const draws=state?.campaign?.draws||state?.session?.draws||[];
  const draw=draws.find(d=>d.id===(e.drawId||e.id)),winner=draw?.winner;
  return platform(winner?.platform)||platform(String(winner?.key||'').split(':')[0])||platform(e.platform);
 }
 function timeline(e){
  if(!e||!Number.isFinite(Number(e.at))||Number(e.at)<=0)return null;
  const at=Number(e.at),v2=Number(e.sequenceVersion)===2,spinMs=v2?SPIN:0;
  const winnerAt=at+LEAD+spinMs,claimAt=Number(e.claimStartsAt)||winnerAt+HOLD,deadline=Number(e.claimDeadline)||0;
  return {at,v2,spinAt:at+LEAD,spinMs,winnerAt,claimAt,deadline,expiresAt:deadline>0?Math.max(winnerAt+HOLD,deadline)+REROLL:at+55000+spinMs};
 }
 function phase(state,now){
  const e=event(state);if(!e||state.view==='hidden')return {phase:'hidden'};
  if(state.view==='celebration')return {phase:now>=e.at&&now<e.at+8000?'celebration':'hidden',event:e,expiresAt:e.at+8000};
  const t=timeline(e);if(!t||now<t.at||now>=t.expiresAt)return {phase:'hidden',event:e,timeline:t};
  const p=now<t.at+10000?'countdown':now<t.spinAt?'buildup':now<t.winnerAt?'wheel':t.deadline>0&&now>=t.deadline?'reroll':now<t.winnerAt+HOLD?'winner':'claim';
  return {phase:p,event:e,timeline:t,remaining:p==='wheel'?Math.ceil((t.winnerAt-now)/1000):p==='countdown'?Math.ceil((t.at+10000-now)/1000):p==='claim'?Math.max(0,Math.ceil((t.deadline-now)/1000)):0};
 }
 function wheelState(state){
  if(state?.reveal?.test){
   const sample=previewState('chat',Number(state.reveal.at)),d=sample.session.draws[0];
   d.winner.name=state.reveal.winner||'MDA009 · TEST';
   sample.revision=state.revision;sample.reveal={...sample.reveal,id:state.reveal.id,test:false};
   sample.session.title=state.reveal.title||'TEST REVEAL';return sample;
  }
  if(!state?.campaign)return state;
  const c=state.campaign,d=current(state);if(!d)return null;
  const seen=new Set();let total=0;const pool=[];
  for(const w of d.weights||[]){
   const u=c.users?.[w.key],weight=Number(w.tickets);
   if(!u||u.key!==w.key||seen.has(w.key)||!Number.isSafeInteger(weight)||weight<=0)return null;
   seen.add(w.key);total+=weight;pool.push({...u,weight});
  }
  if(total!==Number(d.totalTickets)||pool.length!==Number(d.eligibleAccounts)||!seen.has(d.winner?.key))return null;
  const draw={...d,eligibleCount:pool.length};
  return {schema:1,revision:state.revision,view:state.view,reveal:state.reveal,celebration:state.celebration,
   session:{id:c.id,mode:'tickets',title:c.title,createdAt:c.startedAt,pool,draws:[draw],currentDrawId:d.id,entriesOpen:false}};
 }
 function previewState(mode='chat',at=Date.now()){
  const names=['AuroraPilot','NebulaRunner','OrbitKeeper','StarboundAce','NovaCaptain','CometRider','LunarScout','VoidWalker','AetherFox','StellarEcho','QuantumAce','SilverFox'];
  const pool=names.map((name,i)=>({key:['twitch','youtube','kick'][i%3]+':id:preview'+i,id:'preview'+i,name,platform:['twitch','youtube','kick'][i%3],weight:mode==='tickets'?(i+1)*7:1,tickets:(i+1)*7,blocked:false}));
  const draw={id:'preview-draw',at,sequenceVersion:2,wheelMs:SPIN,revealDelayMs:LEAD+SPIN,claimStartsAt:at+LEAD+SPIN+HOLD,claimDeadline:at+LEAD+SPIN+HOLD+CLAIM,status:'selected',winner:pool[5],eligibleCount:pool.length,eligibleAccounts:pool.length};
  const state={schema:1,revision:1,view:'reveal',reveal:{...draw,drawId:draw.id,winner:draw.winner.name,title:'VOYAGER · SEQUENCE PREVIEW',test:false}};
  if(mode==='tickets'){
   draw.totalTickets=pool.reduce((n,u)=>n+u.tickets,0);draw.winningTicket=pool.slice(0,5).reduce((n,u)=>n+u.tickets,0)+1;draw.weights=pool.map(u=>({key:u.key,tickets:u.tickets}));
   state.campaign={id:'preview',title:state.reveal.title,startedAt:at-100000,status:'drawn',users:Object.fromEntries(pool.map(u=>[u.key,u])),draws:[draw]};
  }else state.session={id:'preview',mode,title:state.reveal.title,createdAt:at-100000,pool,draws:[draw],currentDrawId:draw.id,entriesOpen:false};
  return state;
 }
 return {LEAD,SPIN,HOLD,CLAIM,REROLL,event,current,winnerPlatform,timeline,phase,wheelState,previewState};
});
