import {createHash} from 'node:crypto';
export function authentication(password,salt,challenge){const secret=createHash('sha256').update(password+salt).digest('base64');return createHash('sha256').update(secret+challenge).digest('base64');}
export function parseStreamOnline(payload){
  if(payload?.event?.source!=='Twitch'||payload?.event?.type!=='StreamOnline')return null;
  const d=payload.data;if(!d||d.isTest||d.isFromSharedChatGuest||d.meta?.isTest||d.meta?.internal)return null;
  const channelId=String(d.channelId||d.broadcaster?.id||''),startedAt=Date.parse(d.startedAt);
  if(!/^\d{1,25}$/.test(channelId)||!Number.isFinite(startedAt)||startedAt<=0)return null;
  return {key:`twitch:${channelId}:${startedAt}`,channelId,startedAt};
}
export function parseChat(payload){
  if(payload?.event?.source!=='Twitch'||payload?.event?.type!=='ChatMessage')return null;
  const d=payload.data;if(!d||d.isTest||d.isInternal||d.isFromSharedChatGuest||d.meta?.internal||d.meta?.isTest)return null;
  // Current Streamer.bot 1.x schema, plus the earlier nested-message format.
  const m=d.message&&typeof d.message==='object'?d.message:null;
  if(m?.isTest||m?.isInternal||m?.isFromSharedChatGuest)return null;
  const user=d.user||m?.user;
  const login=user?.login||m?.username||m?.userName||d.username;
  const name=user?.name||m?.displayName||d.displayName||login;
  const text=d.text??m?.message??(typeof d.message==='string'?d.message:null);
  if(!login||typeof text!=='string')return null;
  return {userId:String(user?.id||user?.userId||m?.userId||d.userId||''),login:String(login).toLowerCase(),name:String(name),text,messageId:d.messageId||m?.msgId||m?.messageId||null,demo:false};
}
export class StreamerBot {
  constructor({onChat=()=>{},onStatus=()=>{},onStreamOnline=()=>{},WebSocketImpl=globalThis.WebSocket,retryMs=3000}={}){
    this.onStreamOnline=onStreamOnline;this.rewardResponses=new Map();
    this.pending=new Map();this.requestSequence=0;this.onChat=onChat;this.onStatus=onStatus;this.WebSocketImpl=WebSocketImpl;this.retryMs=retryMs;this.generation=0;this.socket=null;this.timer=null;this.handshake=null;this.wanted=false;this.seen=new Map();this.status={connected:false,message:'Streamer.bot disconnected'};
  }
  statusUpdate(connected,message){this.status={connected,message};this.onStatus(this.status);}
  connect({url,password=''}){
    const parsed=new URL(url);if(!['ws:','wss:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error('Use a ws:// or wss:// address without embedded credentials.');
    this.disconnect(false);this.url=parsed.href;this.password=String(password);this.wanted=true;this.open();
  }
  open(){
    if(!this.wanted)return;const gen=++this.generation;let ws;
    this.statusUpdate(false,'Connecting to Streamer.bot…');
    try{ws=new this.WebSocketImpl(this.url);}catch{this.statusUpdate(false,'Connection failed. Check the WebSocket address.');this.schedule();return;}
    this.socket=ws;let authenticated=false,subscribed=false;
    const send=value=>ws.readyState===1&&ws.send(JSON.stringify(value));
    const subscribe=()=>send({request:'Subscribe',id:'vv-subscribe',events:{Twitch:['ChatMessage','StreamOnline'],General:['Custom']}});
    this.handshake=setTimeout(()=>{if(gen===this.generation&&!subscribed){this.statusUpdate(false,'Handshake timed out. Check Streamer.bot server and password.');ws.close();}},12000);this.handshake.unref?.();
    ws.addEventListener('message',event=>{
      if(gen!==this.generation)return;
      let data;try{data=JSON.parse(event.data);}catch{return;}
      if(data.request==='Hello'){
        if(data.authentication){
          if(!this.password){this.wanted=false;this.statusUpdate(false,'Password required. Enter your Streamer.bot WebSocket password.');ws.close();return;}
          send({request:'Authenticate',id:'vv-auth',authentication:authentication(this.password,data.authentication.salt,data.authentication.challenge)});
        }else{authenticated=true;subscribe();}
        return;
      }
      if(data.id==='vv-auth'){
        if(data.status!=='ok'){this.wanted=false;this.statusUpdate(false,'Authentication failed. Check your WebSocket password.');ws.close();return;}
        authenticated=true;subscribe();return;
      }
      if(data.id==='vv-subscribe'){
        if(data.status!=='ok'){this.wanted=false;this.statusUpdate(false,'Chat subscription rejected by Streamer.bot.');ws.close();return;}
        subscribed=true;clearTimeout(this.handshake);this.statusUpdate(true,'Streamer.bot connected · Twitch chat ready');return;
      }
      if(!authenticated||!subscribed)return;
      if(data.id&&this.pending.has(data.id)){const p=this.pending.get(data.id);clearTimeout(p.timer);this.pending.delete(data.id);p.resolve(data);return;}
      // C# broadcasts can arrive before the DoAction acknowledgement. Retain only
      // bounded, correlated rewards replies; the dispatcher still verifies IDs.
      let reply=data.event?.type==='Custom'?data.data:data;
      if(typeof reply==='string'){try{reply=JSON.parse(reply);}catch{reply=null;}}
      if(reply?.type==='voyager.versus.reward.response'&&reply.protocol===2&&typeof reply.requestId==='string'&&typeof reply.clientId==='string'){
        this.rewardResponses.set(reply.requestId,{reply,at:Date.now()});
        for(const[key,value]of this.rewardResponses)if(Date.now()-value.at>60000)this.rewardResponses.delete(key);
        while(this.rewardResponses.size>128)this.rewardResponses.delete(this.rewardResponses.keys().next().value);
        return;
      }
      const online=parseStreamOnline(data);if(online){this.onStreamOnline(online);return;}
      const chat=parseChat(data);if(!chat)return;
      if(chat.messageId){if(this.seen.has(chat.messageId))return;this.seen.set(chat.messageId,Date.now());if(this.seen.size>3000)this.seen.delete(this.seen.keys().next().value);}
      this.onChat(chat);
    });
    ws.addEventListener('close',()=>{if(gen!==this.generation)return;clearTimeout(this.handshake);this.rejectPending();if(this.wanted){this.statusUpdate(false,'Streamer.bot disconnected · retrying in 3s');this.schedule();}});
    ws.addEventListener('error',()=>{if(gen!==this.generation)return;this.statusUpdate(false,'Cannot reach Streamer.bot. Check host, port and server.');try{ws.close();}catch{};});
  }
  request(request,values={},timeout=8000){
    if(!this.status.connected||this.socket?.readyState!==1)return Promise.reject(new Error('Streamer.bot is disconnected.'));
    const id=`vv-request-${++this.requestSequence}`;
    return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('Streamer.bot request timed out.'));},timeout);timer.unref?.();this.pending.set(id,{resolve,reject,timer});try{this.socket.send(JSON.stringify({...values,request,id}));}catch(e){clearTimeout(timer);this.pending.delete(id);reject(e);}});
  }
  takeRewardResponse(requestId,clientId){const entry=this.rewardResponses.get(requestId);if(!entry||entry.reply.clientId!==clientId)return null;this.rewardResponses.delete(requestId);return Date.now()-entry.at<60000?entry.reply:null;}
  rejectPending(){for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(new Error('Streamer.bot disconnected.'));}this.pending.clear();this.rewardResponses.clear();}
  schedule(){clearTimeout(this.timer);if(this.wanted){this.timer=setTimeout(()=>this.open(),this.retryMs);this.timer.unref?.();}}
  disconnect(report=true){this.rejectPending();this.wanted=false;this.generation++;clearTimeout(this.timer);clearTimeout(this.handshake);try{this.socket?.close();}catch{}this.socket=null;this.password='';if(report)this.statusUpdate(false,'Streamer.bot disconnected');}
}
