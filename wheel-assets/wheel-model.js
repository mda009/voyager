/* Voyager wheel 2.0.1. Equal account segments or saved ticket weights.
   2.20.9: entrants who can't be drawn (won an impromptu giveaway in the last 30 days, noWin) are left off the wheel, exactly as
   the Giveaway Engine leaves them out of the draw; before, they made the wheel's pool differ from the draw and it never appeared. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VoyagerWheelModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TAU=Math.PI*2,DURATION=30000,IDLE_SPEED=.035,mod=n=>((n%TAU)+TAU)%TAU;
 function current(s){return (s?.draws||[]).find(d=>d.id===s.currentDrawId)||null;}
 function normalize(s,d){const index=d?(s.draws||[]).findIndex(x=>x.id===d.id):-1,used=new Set((d?(s.draws||[]).slice(0,Math.max(0,index)):s.draws||[]).map(x=>x.winner?.key)),seen=new Set();return(s?.pool||[]).filter(u=>u&&typeof u.key==='string'&&u.key&&typeof u.name==='string'&&u.name&&u.noWin!==true&&!used.has(u.key)&&!seen.has(u.key)&&seen.add(u.key));}
 function segments(pool){let total=0;for(const u of pool){const w=Number(u.weight??1);if(!Number.isSafeInteger(w)||w<=0)return null;total+=w;}if(!Number.isSafeInteger(total)||total<1)return null;let n=0;return pool.map(u=>{const start=n/total*TAU;n+=Number(u.weight??1);const end=n/total*TAU;return{start,end,center:(start+end)/2,weight:Number(u.weight??1)};});}
 function idleAngle(s,at){return mod((at-(Number(s?.createdAt)||at))/1000*IDLE_SPEED);}
 function plan(s,d,at){const pool=normalize(s,d),index=pool.findIndex(u=>u.key===d?.winner?.key),arcs=segments(pool);if(!d||index<0||!arcs||!Number.isFinite(at)||at<=0||!Number.isFinite(Number(d.at))||!d.id)return null;if(Number.isFinite(d.eligibleCount)&&d.eligibleCount!==pool.length)return null;const start=idleAngle(s,at),target=mod(-arcs[index].center);return{pool,index,arcs,at,start,end:start+12*TAU+mod(target-start),duration:Number(d.sequenceVersion)===2?DURATION:20000,draw:d};}
 function angle(p,now){const t=Math.max(0,Math.min(1,(now-p.at)/p.duration));return p.start+(p.end-p.start)*(1-Math.pow(1-t,4));}
 function pointerIndex(rotation,pool){if(typeof pool==='number')return pool?Math.min(pool-1,Math.floor(mod(-rotation)/TAU*pool)):-1;const a=segments(pool);if(!a)return-1;const p=mod(-rotation);return a.findIndex(s=>p>=s.start&&p<s.end);}
 function phase(state,now){
  const s=state?.session;if(!s||state.view==='hidden'||!['reveal','celebration'].includes(state.view))return{visible:false};
  if(state.view==='reveal'&&state.reveal?.test)return{visible:false,test:true};
  const d=current(s),r=state.reveal;if(!d)return{visible:false};if(state.view==='reveal'&&r?.drawId!==d.id)return{visible:false,error:'Waiting for the matching saved draw.'};
  const origin=state.view==='reveal'?Number(r.at):Number(d.at),at=origin+(Number(d.sequenceVersion)===2?20000:0);
  if(!Number.isFinite(at)||origin>now+5000)return{visible:false,error:'Invalid draw time.'};
  if(now<at)return{visible:false,waiting:true,wakeAt:at};const spin=plan(s,d,at);if(!spin)return{visible:false,error:'Winner or eligible pool does not match. Refresh the saved giveaway.'};
  const drawing=now<at+spin.duration,result={visible:true,session:s,draw:d,plan:spin,pool:spin.pool,drawing,at,duration:spin.duration};
  if(drawing)return{...result,status:'drawing',label:'Spinning',winner:null,remaining:Math.max(0,Math.ceil((at+spin.duration-now)/1000))};
  const confirmed=d.status==='confirmed',expired=!confirmed&&Number(d.claimDeadline)>0&&now>=Number(d.claimDeadline);
  return{...result,status:confirmed?'confirmed':expired?'expired':'drawn',label:confirmed?'Claimed':expired?'RE-ROLL':'Winner drawn',winner:d.winner};
 }
 class Store{constructor(){this.state=null;this.offset=0;}accept(s,offset=0){if(!s||s.schema!==1||!Number.isFinite(s.revision))return false;if(this.state&&this.state.session?.id===s.session?.id&&s.revision<this.state.revision)return false;this.state=s;this.offset=Number.isFinite(offset)?offset:0;return true;}frame(now=Date.now()){return phase(this.state,now+this.offset);}}
 return{TAU,DURATION,mod,current,normalize,segments,idleAngle,plan,angle,pointerIndex,phase,Store};
});
