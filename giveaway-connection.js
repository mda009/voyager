/* Shared local Streamer.bot connection. Connection recovery update, 18 Oct 2026.
   Heartbeats never run actions. Recovery only reads state; it never repeats a draw. */
(()=>{'use strict';
const defaults={host:'127.0.0.1',port:8080,password:'',path:'/',secure:false,actionName:'Voyager - Broadcast Members',giveawayActionName:'Voyager - Giveaway Engine'};
const HEARTBEAT=20000, REQUEST_TIMEOUT=15000, ENGINE_TIMEOUT=30000, STATE_INTERVAL=60000;
function failure(message,code){return Object.assign(new Error(message),{code});}
// A suspended browser may resume with overdue timers before it delivers queued messages.
// Allow one fresh response window instead of immediately declaring that socket dead.
function deadline(fn,ms){
 const task={timer:null};let due=Date.now()+ms,grace=false;
 const expire=()=>{if(!grace&&Date.now()-due>5000){grace=true;due=Date.now()+ms;task.timer=setTimeout(expire,ms);}else fn();};
 task.timer=setTimeout(expire,ms);return task;
}
class VoyagerConnection extends EventTarget{
 constructor(options={}){
  super();this.config={...defaults,...(window.VOYAGER_CONFIG||{}),...options};
  this.pending=new Map();this.waiters=new Map();this.seq=0;this.generation=0;
  this.ready=false;this.transportReady=false;this.active=false;this.offset=0;this.retry=0;
  this.wake=()=>{if(!this.active||document.hidden)return;
   if(this.reconnect){this.connect();return;}
   if(!this.transportReady)return;
   if(Date.now()-this.lastMessageAt>=HEARTBEAT){this.checkHealth();this.sync().catch(()=>{});}
  };
 }
 emit(name,detail){this.dispatchEvent(new CustomEvent(name,{detail}));}
 status(state,message){this.emit('status',{state,message});}
 async hash(text){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return btoa(String.fromCharCode(...new Uint8Array(b)));}
 listen(enabled){
  if(this.listening===enabled)return;this.listening=enabled;
  const method=enabled?'addEventListener':'removeEventListener';
  window[method]('online',this.wake);window[method]('pageshow',this.wake);window[method]('focus',this.wake);
  document[method]('visibilitychange',this.wake);
 }
 clearConnection(reason){
  this.generation++;
  for(const name of ['reconnect','heartbeatTimer','syncTimer','helloTimer']){clearTimeout(this[name]);this[name]=null;}
  this.ready=false;this.transportReady=false;this.initializing=false;this.engine=null;this.snapshot=null;
  this.syncFlight=null;this.healthFlight=null;this.membersFlight=null;
  const socket=this.socket;this.socket=null;
  if(socket){socket.onopen=socket.onmessage=socket.onclose=socket.onerror=null;try{socket.close();}catch{}}
  for(const p of [...this.pending.values(),...this.waiters.values()]){clearTimeout(p.deadline.timer);p.reject(failure(reason,'CLOSED'));}
  this.pending.clear();this.waiters.clear();
 }
 stop(){this.active=false;this.listen(false);this.clearConnection('Connection changed. Reload the saved state before drawing again.');}
 recover(reason,gen){
  if(gen!==this.generation||!this.active)return;
  this.clearConnection('Connection interrupted. The saved result will be recovered; no draw will be repeated.');
  const delay=Math.min(15000,1500*++this.retry);
  this.status('offline',reason+' Reconnecting in '+Math.ceil(delay/1000)+'s…');
  this.reconnect=setTimeout(()=>{this.reconnect=null;if(this.active)this.connect();},delay);
 }
 connect(){
  this.active=true;this.listen(true);this.clearConnection('Connection changed. Reload the saved state before drawing again.');
  const gen=this.generation;this.status('connecting','Connecting to Streamer.bot…');
  let socket;
  try{
   let h=String(this.config.host).trim();if(h.includes(':')&&!h.startsWith('['))h='['+h+']';
   const path=String(this.config.path||'/');
   socket=this.socket=new WebSocket((this.config.secure?'wss://':'ws://')+h+':'+this.config.port+(path.startsWith('/')?path:'/'+path));
  }catch{this.stop();this.status('error','Check the host and port in Connection settings.');return;}
  this.lastMessageAt=Date.now();
  socket.onmessage=e=>this.message(e,gen);
  socket.onerror=()=>{}; // Close or the greeting/heartbeat deadline handles transport errors once.
  socket.onclose=e=>this.recover('Streamer.bot disconnected (code '+e.code+(e.reason?': '+e.reason:'')+').',gen);
  this.helloTimer=setTimeout(()=>this.recover('Streamer.bot did not send its greeting.',gen),30000);
 }
 request(request,body={},gen=this.generation){
  return new Promise((resolve,reject)=>{
   if(gen!==this.generation||this.socket?.readyState!==1)return reject(failure('Streamer.bot is disconnected.','CLOSED'));
   const id='vg-'+(++this.seq)+'-'+Date.now();
   const task=deadline(()=>{this.pending.delete(id);reject(failure(request+' timed out.','TIMEOUT'));},REQUEST_TIMEOUT);
   this.pending.set(id,{resolve,reject,deadline:task});
   try{this.socket.send(JSON.stringify({request,id,...body}));}
   catch{clearTimeout(task.timer);this.pending.delete(id);reject(failure('Could not send to Streamer.bot.','CLOSED'));}
  });
 }
 // Shared Streamer.bot handshake used by every Voyager connection.
 // Without WebSocket authentication any web page open on this PC could ask Streamer.bot
 // to run Voyager actions (points changes, draws). Set requireAuthentication:true in
 // config.js once a password is turned on in Streamer.bot to refuse unprotected servers.
 async authenticate(msg,gen,missingPassword){
  if(msg.authentication){
   if(!this.config.password)throw failure(missingPassword||'Streamer.bot requires its WebSocket password. Open Connection settings.','SETUP');
   const secret=await this.hash(this.config.password+msg.authentication.salt);
   await this.request('Authenticate',{authentication:await this.hash(secret+msg.authentication.challenge)},gen);
   this.authenticated=true;window.VoyagerAuthNotice?.(true);return;
  }
  this.authenticated=false;
  if(this.config.requireAuthentication===true)throw failure('Streamer.bot WebSocket authentication is turned off, and config.js requires it. In Streamer.bot open Servers/Clients > WebSocket Server, turn on Authentication, set the same password in config.js, then reconnect.','SETUP');
  window.VoyagerAuthNotice?.(false);
 }
 async initialize(msg,gen){
  if(this.initializing)return;this.initializing=true;clearTimeout(this.helloTimer);this.helloTimer=null;
  try{
   await this.authenticate(msg,gen,'Streamer.bot requires its WebSocket password. Open Connection settings.');
   await this.request('Subscribe',{events:{General:['Custom']}},gen);
   const actions=(await this.request('GetActions',{},gen)).actions||[];
   if(gen!==this.generation)return;
   const engine=actions.filter(a=>a.name===this.config.giveawayActionName&&a.enabled!==false);
   if(engine.length!==1)throw failure('Create and enable exactly one action named '+this.config.giveawayActionName+'.','SETUP');
   this.engine=engine[0].id;this.snapshot=actions.find(a=>a.name===this.config.actionName&&a.enabled!==false)?.id;
   this.transportReady=true;this.status('recovering','Streamer.bot connected. Loading the saved giveaway…');
   // The health check must keep running even if the action queue is paused or slow.
   this.scheduleHeartbeat(gen);
   this.sync().catch(()=>{});
  }catch(e){
   if(gen!==this.generation)return;
   if(e.code==='TIMEOUT'||e.code==='CLOSED')this.recover(e.message,gen);
   else{this.stop();this.status('error',e.message);}
  }
 }
 message(e,gen){
  if(gen!==this.generation)return;let msg;try{msg=JSON.parse(e.data);}catch{return;}
  if(!msg||typeof msg!=='object')return;this.lastMessageAt=Date.now();
  if(msg.id&&this.pending.has(msg.id)){
   const p=this.pending.get(msg.id);clearTimeout(p.deadline.timer);this.pending.delete(msg.id);
   msg.status==='error'?p.reject(failure(msg.error||msg.message||'Streamer.bot request failed.','SERVER')):p.resolve(msg);return;
  }
  if(msg.request==='Hello'){this.initialize(msg,gen);return;}
  if(!this.transportReady)return;
  let data=msg;
  for(let i=0;i<5;i++){
   if(typeof data==='string'){try{data=JSON.parse(data);}catch{return;}}
   if(typeof data?.type==='string'&&data.type.startsWith('voyager.'))break;
   data=data?.data;
  }
  if(data?.type==='voyager.members.v1'){
   this.emit('members',data);this.finishResult(data.requestId,'members',data);return;
  }
  if(data?.type==='voyager.giveaway.state.v1'){
   if(Number.isFinite(data.serverAt))this.offset=data.serverAt-Date.now();
   this.emit('state',data);
   const error=!data.ok?failure(data.error||'Giveaway action failed.','ENGINE'):
    !data.state||data.state.schema!==1||!Number.isFinite(data.state.revision)?failure('The giveaway action returned an invalid saved state.','ENGINE'):null;
   this.finishResult(data.requestId,'engine',data.state,error);
  }
 }
 finishResult(id,kind,result,error){
  const p=this.waiters.get(id);if(!p||p.kind!==kind)return;
  clearTimeout(p.deadline.timer);this.waiters.delete(id);error?p.reject(error):p.resolve(result);
 }
 actionResult(action,args,kind,gen){
  const requestId=crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=crypto.getRandomValues(new Uint8Array(1))[0]&15;return(c==='x'?r:(r&3)|8).toString(16)});
  return new Promise((resolve,reject)=>{
   if(gen!==this.generation||!this.transportReady)return reject(failure('Connect to Streamer.bot first.','CLOSED'));
   const task=deadline(()=>this.finishResult(requestId,kind,null,failure(kind==='members'?
    'No member snapshot received. Check the Broadcast Members action and its queue.':
    'No engine result received. Checking the saved result; do not repeat the draw. Check that the Voyager Giveaways queue is running.','TIMEOUT')),ENGINE_TIMEOUT);
   this.waiters.set(requestId,{kind,resolve,reject,deadline:task});
   this.request('DoAction',{action:{id:action},args:{...args,...(kind==='members'?{voyagerRequestId:requestId}:{requestId})}},gen).catch(e=>{
    // The correlated broadcast is the result. A late DoAction acknowledgement alone
    // must not discard a winner which is still executing in Streamer.bot's queue.
    if(e.code!=='TIMEOUT')this.finishResult(requestId,kind,null,e);
   });
  });
 }
 command(operation,args={}){
  if(operation==='sync')return this.sync();
  if(!this.ready)return Promise.reject(failure('Wait for the saved giveaway to reconnect before drawing.','CLOSED'));
  const gen=this.generation;
  return this.actionResult(this.engine,{...args,operation},'engine',gen).catch(e=>{
   if(gen===this.generation&&this.transportReady&&e.code!=='ENGINE'){
    this.ready=false;this.status('recovering','Checking the saved result. No draw will be repeated.');
    this.sync().catch(()=>{});
   }
   throw e;
  });
 }
 sync(){
  if(this.syncFlight)return this.syncFlight;
  if(!this.transportReady)return Promise.reject(failure('Connect to Streamer.bot first.','CLOSED'));
  const gen=this.generation;clearTimeout(this.syncTimer);this.syncTimer=null;
  const flight=this.actionResult(this.engine,{operation:'sync'},'engine',gen).then(state=>{
   if(gen!==this.generation)throw failure('Connection changed.','CLOSED');
   const recovered=!this.ready;this.ready=true;this.retry=0;
   if(recovered){
    this.status('live','Connected to Streamer.bot · automatic recovery active');this.emit('ready',{});
    if(this.snapshot)this.refreshMembers().catch(e=>{if(gen===this.generation)this.emit('notice',e.message);});
   }
   return state;
  }).catch(e=>{
   if(gen===this.generation&&this.transportReady){this.ready=false;this.status('recovering','WebSocket connected; waiting for the giveaway engine. Check its queue. Retrying automatically.');}
   throw e;
  }).finally(()=>{
   if(gen===this.generation&&this.syncFlight===flight){this.syncFlight=null;this.scheduleSync(gen,this.ready?STATE_INTERVAL:15000);}
  });
  this.syncFlight=flight;return flight;
 }
 scheduleSync(gen,delay){
  clearTimeout(this.syncTimer);
  this.syncTimer=setTimeout(()=>{this.syncTimer=null;if(gen===this.generation&&this.transportReady)this.sync().catch(()=>{});},delay);
 }
 scheduleHeartbeat(gen){
  clearTimeout(this.heartbeatTimer);
  this.heartbeatTimer=setTimeout(()=>{this.heartbeatTimer=null;if(gen===this.generation)this.checkHealth();},HEARTBEAT);
 }
 checkHealth(){
  if(this.healthFlight)return this.healthFlight;
  if(!this.transportReady)return Promise.resolve();
  const gen=this.generation;clearTimeout(this.heartbeatTimer);this.heartbeatTimer=null;
  // GetInfo is a small, read-only WebSocket request; no C# action or queue is involved.
  const flight=this.request('GetInfo',{},gen).catch(e=>{
   if(e.code!=='SERVER')this.recover('Streamer.bot stopped responding to the connection check.',gen);
  }).finally(()=>{
   if(gen===this.generation&&this.healthFlight===flight){this.healthFlight=null;this.scheduleHeartbeat(gen);}
  });
  this.healthFlight=flight;return flight;
 }
 refreshMembers(){
  if(this.membersFlight)return this.membersFlight;
  if(!this.snapshot)return Promise.reject(Error('Add the Voyager - Broadcast Members action to load the group counts.'));
  const gen=this.generation;
  const flight=this.actionResult(this.snapshot,{},'members',gen).finally(()=>{if(gen===this.generation&&this.membersFlight===flight)this.membersFlight=null;});
  this.membersFlight=flight;return flight;
 }
}
// One shared warning, shown on control pages only (never inside OBS browser sources).
window.VoyagerAuthNotice=protectedServer=>{
 const id='voyager-auth-notice',old=document.getElementById(id);
 if(protectedServer||window.obsstudio||!document.body){old?.remove();return;}
 if(old)return;
 const bar=document.createElement('div');bar.id=id;bar.setAttribute('role','alert');
 bar.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;padding:10px 14px;border-radius:8px;background:#3a1d08;color:#ffd9a8;border:1px solid #c7782d;font:600 13px/1.4 system-ui,sans-serif;display:flex;gap:12px;align-items:center';
 const text=document.createElement('span');text.style.flex='1';
 text.textContent='Streamer.bot WebSocket authentication is off. Any web page open on this PC could run Voyager actions such as points changes or draws. Turn on Authentication in Streamer.bot and put the password in config.js.';
 const close=document.createElement('button');close.type='button';close.textContent='Dismiss';close.style.cssText='font:inherit;background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;padding:4px 10px;cursor:pointer';
 close.onclick=()=>bar.remove();bar.append(text,close);document.body.append(bar);
};
window.VoyagerConnection=VoyagerConnection;
window.VoyagerGroups={keys:['blue','silver','gold','platinum','vip'],names:{blue:'Blue',silver:'Silver',gold:'Gold',platinum:'Platinum',vip:'Ruby VIP'},colours:{blue:'#59baff',silver:'#d4dfeb',gold:'#f2cd73',platinum:'#c6baff',vip:'#ff709b'}};
})();
