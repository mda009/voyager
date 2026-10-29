/* Points ledger connection. Admin writes require an explicit preview and confirmation. It never invokes a draw. */
(()=>{'use strict';
class PointsConnection extends VoyagerConnection{
 async initialize(msg,gen){if(this.initializing)return;this.initializing=true;clearTimeout(this.helloTimer);
  try{await this.authenticate(msg,gen,'Enter your Streamer.bot WebSocket password in config.js.');
   await this.request('Subscribe',{events:{General:['Custom']}},gen);const actions=(await this.request('GetActions',{},gen)).actions||[];if(gen!==this.generation)return;const matches=actions.filter(a=>a.name===(this.config.pointsActionName||'Voyager - Points Ledger')&&a.enabled!==false);if(matches.length!==1)throw Error('Create and enable one action named Voyager - Points Ledger. See Points setup.');
   this.engine=matches[0].id;this.transportReady=true;this.ready=true;this.retry=0;this.status('live','Connected to the points ledger');this.scheduleHeartbeat(gen);this.sync().catch(()=>{});
  }catch(e){if(gen!==this.generation)return;if(e.code==='TIMEOUT'||e.code==='CLOSED')this.recover(e.message,gen);else{this.stop();this.status('error',e.message);}}
 }
 message(e,gen){if(gen!==this.generation)return;let msg;try{msg=JSON.parse(e.data);}catch{return;}let data=msg;for(let i=0;i<5;i++){if(typeof data==='string'){try{data=JSON.parse(data);}catch{break;}}if(data?.type==='voyager.points.v1')break;data=data?.data;}
  if(this.transportReady&&data?.type==='voyager.points.v1'){this.lastMessageAt=Date.now();if(this.waiters.get(data.requestId)?.kind==='points')this.finishResult(data.requestId,'points',data,data.ok&&data.schema===1?null:Object.assign(Error(data.error||'Invalid points response.'),{response:data}));return;}super.message(e,gen);
 }
 call(operation,args={}){if(!['repair_history','history','snapshot','scan','admin_preview','admin_apply','admin_status'].includes(operation))return Promise.reject(Error('Unknown points operation.'));const gen=this.generation;if(!this.transportReady)return Promise.reject(Error('Connect to Streamer.bot first.'));const requestId=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();return new Promise((resolve,reject)=>{const deadline={timer:setTimeout(()=>this.finishResult(requestId,'points',null,Error('No points response. Check compilation and the Voyager Points queue.')),operation==='repair_history'?180000:operation.startsWith('admin_')?150000:45000)};this.waiters.set(requestId,{kind:'points',deadline,resolve,reject});this.request('DoAction',{action:{id:this.engine},args:{...args,requestId,pointsOperation:operation}},gen).catch(e=>{if(e.code!=='TIMEOUT')this.finishResult(requestId,'points',null,e);});});}
 sync(operation='snapshot'){if(this.syncFlight)return this.syncFlight;if(!this.transportReady)return Promise.reject(Error('Connect to Streamer.bot first.'));const gen=this.generation;clearTimeout(this.syncTimer);const flight=this.call(operation).then(data=>{if(gen===this.generation)this.emit('points',data);return data;}).catch(e=>{if(gen===this.generation)this.emit('notice',e.message);throw e;}).finally(()=>{if(gen===this.generation&&this.syncFlight===flight){this.syncFlight=null;this.scheduleSync(gen,120000);}});this.syncFlight=flight;return flight;}
 command(){return Promise.reject(Error('Use the member controls to preview a points or group change.'))}
}
window.VoyagerPointsConnection=PointsConnection;
})();
