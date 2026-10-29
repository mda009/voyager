/* Read-only public analytics via an isolated Streamer.bot action. */
(()=>{'use strict';
const INTERVAL=30*60*1000;
class ExternalAnalyticsConnection extends VoyagerConnection{
 constructor(options={}){super(options);this.lastSyncAt=0;this.wake=()=>{if(!this.active||document.hidden)return;if(this.reconnect){this.connect();return;}if(!this.transportReady)return;this.checkHealth();if(Date.now()-this.lastSyncAt>=INTERVAL)this.sync().catch(()=>{});};}
 async initialize(msg,gen){
  if(this.initializing)return;this.initializing=true;clearTimeout(this.helloTimer);
  try{
   await this.authenticate(msg,gen,'Enter the Streamer.bot password in Connection settings.');
   await this.request('Subscribe',{events:{General:['Custom']}},gen);
   const actions=(await this.request('GetActions',{},gen)).actions||[];if(gen!==this.generation)return;
   const found=actions.filter(a=>a.name==='Voyager - External Analytics'&&a.enabled!==false);
   if(found.length!==1)throw Error('Import and enable one Voyager - External Analytics action. Open External refresh setup below.');
   this.engine=found[0].id;this.transportReady=true;this.ready=true;this.retry=0;
   this.status('live','Automatic checks on page load and every 30 minutes.');this.scheduleHeartbeat(gen);this.sync().catch(()=>{});
  }catch(e){if(gen!==this.generation)return;if(['TIMEOUT','CLOSED'].includes(e.code))this.recover(e.message,gen);else{this.stop();this.status('error',e.message);}}
 }
 message(e,gen){
  if(gen!==this.generation)return;let data;try{data=JSON.parse(e.data);}catch{return;}
  for(let i=0;i<5;i++){if(typeof data==='string'){try{data=JSON.parse(data);}catch{break;}}if(data?.type==='voyager.external.analytics.v1')break;data=data?.data;}
  if(this.transportReady&&data?.type==='voyager.external.analytics.v1'){this.lastMessageAt=Date.now();this.finishResult(data.requestId,'external',data,data.ok&&data.schema===1&&data.sources?null:Error(data.error||'Invalid external analytics response.'));return;}
  super.message(e,gen);
 }
 sync(){
  if(this.syncFlight)return this.syncFlight;if(!this.transportReady)return Promise.reject(Error('Connect to Streamer.bot to refresh external data.'));
  const gen=this.generation;clearTimeout(this.syncTimer);this.emit('loading',{});
  const requestId=crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=crypto.getRandomValues(new Uint8Array(1))[0]&15;return(c==='x'?r:(r&3)|8).toString(16);});
  const flight=new Promise((resolve,reject)=>{
   const deadline={timer:setTimeout(()=>this.finishResult(requestId,'external',null,Error('No external analytics response. Check the new action compiled and its queue is running.')),75000)};
   this.waiters.set(requestId,{kind:'external',deadline,resolve,reject});
   this.request('DoAction',{action:{id:this.engine},args:{requestId,externalOperation:'refresh'}},gen).catch(e=>{if(e.code!=='TIMEOUT')this.finishResult(requestId,'external',null,e);});
  }).then(data=>{if(gen===this.generation)this.emit('external',data);return data;}).catch(e=>{if(gen===this.generation)this.emit('notice',e.message);throw e;}).finally(()=>{if(gen===this.generation&&this.syncFlight===flight){this.syncFlight=null;this.lastSyncAt=Date.now();this.emit('idle',{});this.scheduleSync(gen,INTERVAL);}});
  this.syncFlight=flight;return flight;
 }
 command(){return Promise.reject(Error('External analytics only reads public figures.'));}
}
window.VoyagerExternalAnalyticsConnection=ExternalAnalyticsConnection;
})();
