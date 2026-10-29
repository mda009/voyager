/* Shared display rules: source timestamps are never replaced by relay heartbeats. */
(()=>{'use strict';
const platforms=['twitch','youtube','kick'],names={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const valid=n=>Number.isSafeInteger(n)&&n>=0;
function capture(model,settings,now=Date.now()){
 const result={schema:1,connected:model.connected,platforms:{}};
 for(const p of platforms){const ch=model.platforms[p],viewer=model.current(p,now),metrics={viewers:{value:viewer?.value??null,at:viewer?.at||0}};
  for(const k of ['followers','subscriptions']){const m=model.metric(p,k,settings,now);metrics[k]={value:m.value,at:m.at||0,manual:m.status==='manual',stale:!!m.stale};}
  result.platforms[p]={live:ch.live,liveAt:ch.liveAt,metrics,goals:settings.goals[p]};
 }
 return result;
}
function view(packet,now=Date.now()){
 const feed=packet?.feed,age=now-(packet?.receivedAt||0),fresh=!!feed&&age>=-60000&&age<30000,connected=fresh&&feed.connected===true;
 const result={fresh,connected,coverage:0,total:null,platforms:{},state:!feed?'waiting':!fresh?'dashboard-offline':!connected?'reconnecting':'ready'};
 for(const p of platforms){const input=feed?.platforms?.[p]||{},metrics={};
  for(const k of ['viewers','followers','subscriptions']){const m=input.metrics?.[k]||{},available=valid(m.value),manual=k!=='viewers'&&m.manual===true,stale=available&&!manual&&(!connected||m.stale===true||!m.at||now-m.at>(k==='viewers'?300000:150000)||m.at>now+60000);
   metrics[k]={value:k==='viewers'&&stale?null:available?m.value:null,stale,manual,available:available&&!stale};
  }
  if(metrics.viewers.value!==null){result.total=(result.total||0)+metrics.viewers.value;result.coverage++;}
  const liveFresh=input.liveAt&&now-input.liveAt<300000;
  const state=!connected?'waiting':metrics.viewers.value!==null?(input.live===false?'offline':'live'):liveFresh&&input.live===false?'offline':'waiting';
  result.platforms[p]={metrics,goals:input.goals||{},state};
 }
 return result;
}
function demo(now=Date.now()){const feed={connected:true,platforms:{}};platforms.forEach((p,i)=>{feed.platforms[p]={live:true,liveAt:now,metrics:Object.fromEntries(['viewers','followers','subscriptions'].map((k,j)=>[k,{value:[[176,48,23],[2737,840,156],[379,24,18]][j][i],at:now}])),goals:{viewers:[200,100,50][i],followers:[3000,1000,200][i],subscriptions:[800,50,50][i]}};});return {schema:1,serverAt:now,receivedAt:now,config:{visible:true,opacity:35,goal:'followers'},feed};}
window.VoyagerLiveOverlayModel={platforms,names,capture,view,demo};
})();
