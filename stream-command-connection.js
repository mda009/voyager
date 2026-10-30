/* Separate connection for the command center. It never calls the Giveaway Engine. */
(()=>{'use strict';
const wanted={Twitch:['ViewerCountUpdate','PresentViewers','StreamOnline','StreamOffline','StreamUpdate','Follow','Sub','ReSub','GiftSub','GiftBomb','Cheer','Raid'],YouTube:['StatisticsUpdated','BroadcastStarted','BroadcastEnded','BroadcastMonitoringEnded','BroadcastUpdated','NewSubscriber','NewSponsor','MemberMileStone','MembershipGift','SuperChat','SuperSticker'],Kick:['ViewerCountUpdate','StreamOnline','StreamOffline','ChannelUpdate','Follow','Subscription','Resubscription','GiftSubscription','MassGiftSubscription']};
class StreamConnection extends VoyagerConnection{
 constructor(options={}){super(options);this.sources={};}
 async initialize(msg,gen){
  if(this.initializing)return;this.initializing=true;clearTimeout(this.helloTimer);
  try{
   await this.authenticate(msg,gen,'Enter your Streamer.bot WebSocket password in Settings.');
   if(this.config.readStats===false){this.transportReady=true;this.ready=true;this.retry=0;this.status('live','Connected to Streamer.bot');this.scheduleHeartbeat(gen);return;}
   const available=(await this.request('GetEvents',{},gen)).events||{},events={General:['Custom']};
   for(const [platform,names]of Object.entries(wanted)){const key=Object.keys(available).find(k=>k.toLowerCase()===platform.toLowerCase());if(key)events[key]=names.filter(n=>(available[key]||[]).includes(n));}
   await this.request('Subscribe',{events},gen);
   const actions=(await this.request('GetActions',{},gen)).actions||[];if(gen!==this.generation)return;
   const matches=actions.filter(a=>a.name===this.config.statsActionName&&a.enabled!==false);this.engine=matches.length===1?matches[0].id:null;
   this.transportReady=true;this.ready=true;this.retry=0;this.status('live','Live event connection ready');this.emit('capabilities',{events,stats:!!this.engine});this.scheduleHeartbeat(gen);
   if(!this.engine)this.emit('notice',matches.length>1?'More than one enabled stats action has that name. Give it a unique name.':'Add the Voyager - Stream Stats action to load follower totals, subscriptions and leaderboards. Viewer events can connect without it.');
   this.request('GetBroadcaster',{},gen).then(data=>{if(gen===this.generation)this.emit('broadcasters',data.platforms||{});}).catch(()=>{});
   this.sync().catch(()=>{});
  }catch(e){if(gen!==this.generation)return;if(e.code==='TIMEOUT'||e.code==='CLOSED')this.recover(e.message,gen);else{this.stop();this.status('error',e.message);}}
 }
 message(e,gen){
  if(gen!==this.generation)return;let msg;try{msg=JSON.parse(e.data);}catch{return;}
  if(this.transportReady&&msg.event?.source&&msg.event?.type&&msg.event.type!=='Custom')this.emit('platform-event',{event:msg.event,data:msg.data||{},timeStamp:msg.timeStamp});
  let data=msg;for(let i=0;i<5;i++){if(typeof data==='string'){try{data=JSON.parse(data);}catch{break;}}if(data?.type==='voyager.stream.stats.v1')break;data=data?.data;}
  if(this.transportReady&&data?.type==='voyager.stream.stats.v1'){
   this.lastMessageAt=Date.now();
   // Only apply the snapshot requested by this dock; other docks may use other mappings.
   if(this.waiters.get(data.requestId)?.kind==='stats'){this.finishResult(data.requestId,'stats',data,data.ok&&data.schema===1?null:Error(data.error||'Invalid stats snapshot.'));}
   return;
  }
  super.message(e,gen);
 }
 statsResult(gen){
  const requestId=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
  return new Promise((resolve,reject)=>{
   const deadline={timer:setTimeout(()=>this.finishResult(requestId,'stats',null,Error('No stats snapshot received. Check the Voyager Stats queue and compile the new stats action.')),30000)};
   this.waiters.set(requestId,{kind:'stats',deadline,resolve,reject});
   this.request('DoAction',{action:{id:this.engine},args:{...(this.extraArgs||{}),requestId,ccSources:JSON.stringify(this.sources)}},gen).catch(e=>{if(e.code!=='TIMEOUT')this.finishResult(requestId,'stats',null,e);});
  });
 }
 sync(){
  if(this.syncFlight)return this.syncFlight;
  if(!this.transportReady)return Promise.reject(Error('Connect to Streamer.bot first.'));
  const gen=this.generation;clearTimeout(this.syncTimer);
  if(!this.engine){this.scheduleSync(gen,60000);return Promise.resolve(null);}
  const flight=this.statsResult(gen).then(data=>{if(gen===this.generation)this.emit('stats',data);return data;}).catch(e=>{if(gen===this.generation)this.emit('notice',e.message);throw e;}).finally(()=>{if(gen===this.generation&&this.syncFlight===flight){this.syncFlight=null;this.scheduleSync(gen,60000);}});this.syncFlight=flight;return flight;
 }
 command(){return Promise.reject(Error('Use Giveaway Control to operate a giveaway.'));}
}
window.VoyagerStreamConnection=StreamConnection;
})();
