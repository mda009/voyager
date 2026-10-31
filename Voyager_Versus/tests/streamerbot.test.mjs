import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {StreamerBot,authentication,parseChat,parseStreamOnline} from '../local/streamerbot.mjs';
import {Arena} from '../dist/engine.mjs';
class FakeSocket {
  static all=[];
  constructor(url){this.url=url;this.readyState=1;this.listeners={};this.sent=[];FakeSocket.all.push(this);}
  addEventListener(n,f){(this.listeners[n]??=[]).push(f);}
  emit(n,event={}){for(const f of this.listeners[n]||[])f(event);}
  receive(obj){this.emit('message',{data:JSON.stringify(obj)});}
  send(s){this.sent.push(JSON.parse(s));}
  close(){this.readyState=3;this.emit('close');}
}
const current={event:{source:'Twitch',type:'ChatMessage'},data:{user:{id:'12345',login:'MDA009',name:'MDA009'},text:'!join',messageId:'m-1'}};
test('Subscribed chat needs two explicit viewer calls; test/internal events, duplicates and reconnects do not launch matches',()=>{
  const game=new Arena(),bot=new StreamerBot({WebSocketImpl:FakeSocket,onChat:c=>game.command(c)});
  const event=(login,text,id,extra={})=>({event:{source:'Twitch',type:'ChatMessage'},data:{user:{id:login==='alpha'?'111':'222',login,name:login},text,messageId:id,...extra}});
  bot.connect({url:'ws://localhost:8080'});let socket=FakeSocket.all.at(-1);
  socket.receive({request:'Hello'});socket.receive({id:'vv-subscribe',status:'ok'});
  for(const [i,text] of ['hello','!join','!duel @bravo','!accept','!versus is ready'].entries())socket.receive(event('alpha',text,'noise-'+i));
  for(const flag of ['isTest','isInternal','isFromSharedChatGuest'])socket.receive(event('alpha','!versus','test-'+flag,{[flag]:true}));
  socket.receive({...current,data:{message:{username:'alpha',userId:'111',message:'!versus',isInternal:true}}});
  game.tick(3600);assert.equal(game.phase,'lobby');assert.equal(game.round,0);
  socket.receive(event('alpha','!versus','first-call'));assert.equal(game.phase,'calling');
  socket.receive(event('alpha','!versus','first-call'));assert.equal(game.phase,'calling');
  const old=socket;bot.connect({url:'ws://localhost:8080'});socket=FakeSocket.all.at(-1);
  old.receive(event('bravo','!versus','stale-socket'));assert.equal(game.phase,'calling');
  socket.receive({request:'Hello'});socket.receive({id:'vv-subscribe',status:'ok'});
  socket.receive(event('bravo','!versus','first-call'));assert.equal(game.phase,'calling');
  socket.receive(event('bravo','!versus','second-call'));assert.equal(game.phase,'countdown');
  assert.deepEqual(game.players.map(p=>p.userId),['111','222']);bot.disconnect();
});
test('Rewards broadcasts correlate client/request IDs, support direct and Custom wrappers, and clear on disconnect',()=>{
 const b=new StreamerBot({WebSocketImpl:FakeSocket});b.connect({url:'ws://localhost:8080'});const w=FakeSocket.all.at(-1),reply={type:'voyager.versus.reward.response',protocol:2,requestId:'req-1',clientId:'client-1',ok:true};
 w.receive(reply);assert.equal(b.takeRewardResponse('req-1','client-1'),null);
 w.receive({request:'Hello'});w.receive({id:'vv-subscribe',status:'ok'});w.receive(reply);
 assert.equal(b.takeRewardResponse('req-1','another-client'),null);assert.deepEqual(b.takeRewardResponse('req-1','client-1'),reply);assert.equal(b.takeRewardResponse('req-1','client-1'),null);
 w.receive({event:{source:'General',type:'Custom'},data:reply});assert.deepEqual(b.takeRewardResponse('req-1','client-1'),reply);
 w.receive(reply);b.disconnect();assert.equal(b.takeRewardResponse('req-1','client-1'),null);
});
test('Parses current and legacy Twitch events; ignores non-chat and guest shared chat',()=>{assert.equal(parseChat(current).login,'mda009');assert.equal(parseChat({event:current.event,data:{message:{username:'alpha',displayName:'Alpha',message:'!fire',msgId:'old'}}}).text,'!fire');assert.equal(parseChat({event:{source:'YouTube',type:'Message'},data:{}}),null);assert.equal(parseChat({...current,data:{...current.data,isFromSharedChatGuest:true}}),null);});
test('Protocol uses salted SHA256 auth and subscribes after success only',()=>{const b=new StreamerBot({WebSocketImpl:FakeSocket});b.connect({url:'ws://localhost:8080',password:'example'});const w=FakeSocket.all.at(-1);w.receive({request:'Hello',authentication:{salt:'abc',challenge:'xyz'}});assert.equal(w.sent[0].request,'Authenticate');const secret=createHash('sha256').update('exampleabc').digest('base64');assert.equal(w.sent[0].authentication,createHash('sha256').update(secret+'xyz').digest('base64'));w.receive({id:'vv-auth',status:'ok'});assert.deepEqual(w.sent[1],{request:'Subscribe',id:'vv-subscribe',events:{Twitch:['ChatMessage','StreamOnline'],General:['Custom']}});w.receive({id:'vv-subscribe',status:'ok'});assert.equal(b.status.connected,true);b.disconnect();});
test('Missing/bad password fails without repeated auth attempts',()=>{const b=new StreamerBot({WebSocketImpl:FakeSocket});b.connect({url:'ws://localhost:8080'});const w=FakeSocket.all.at(-1);w.receive({request:'Hello',authentication:{salt:'a',challenge:'b'}});assert.equal(b.wanted,false);assert.match(b.status.message,/Password required/);assert.equal(w.sent.length,0);b.disconnect();});
test('Events accepted only after subscription and duplicate message IDs ignored',()=>{const received=[];const b=new StreamerBot({WebSocketImpl:FakeSocket,onChat:x=>received.push(x)});b.connect({url:'ws://localhost:8080'});const w=FakeSocket.all.at(-1);w.receive(current);assert.equal(received.length,0);w.receive({request:'Hello'});w.receive({id:'vv-subscribe',status:'ok'});w.receive(current);w.receive(current);assert.equal(received.length,1);b.disconnect();});
test('Rejected subscriptions never report connected; stale sockets cannot inject events',()=>{const b=new StreamerBot({WebSocketImpl:FakeSocket});b.connect({url:'ws://localhost:8080'});const old=FakeSocket.all.at(-1);b.connect({url:'ws://localhost:8081'});old.receive({id:'vv-subscribe',status:'ok'});assert.equal(b.status.connected,false);const w=FakeSocket.all.at(-1);w.receive({request:'Hello'});w.receive({id:'vv-subscribe',status:'error'});assert.equal(b.status.connected,false);assert.equal(b.wanted,false);b.disconnect();});

test('Chat parser preserves user IDs, and requests correlate responses and reject on disconnect',async()=>{
  assert.equal(parseChat(current).userId,'12345');
  assert.equal(parseChat({event:current.event,data:{message:{username:'alpha',displayName:'Alpha',userId:'67890',message:'!fire'}}}).userId,'67890');
  const b=new StreamerBot({WebSocketImpl:FakeSocket});b.connect({url:'ws://localhost:8080'});const w=FakeSocket.all.at(-1);
  w.receive({request:'Hello'});w.receive({id:'vv-subscribe',status:'ok'});
  const first=b.request('GetGlobal',{variable:'receipt',persisted:true});const sent=w.sent.at(-1);
  w.receive({id:sent.id,status:'ok',variable:{value:'credited'}});assert.equal((await first).variable.value,'credited');
  const pending=b.request('GetActions');b.disconnect();await assert.rejects(pending,/disconnected/);
});

test('Stream-online parser accepts dated Twitch streams and ignores tests, guests and malformed events',()=>{
 const event={event:{source:'Twitch',type:'StreamOnline'},data:{channelId:'123',startedAt:'2026-10-21T07:00:00Z'}};
 assert.equal(parseStreamOnline(event).key,'twitch:123:'+Date.parse(event.data.startedAt));
 for(const extra of [{isTest:true},{isFromSharedChatGuest:true},{startedAt:'invalid'},{channelId:'invalid'}])assert.equal(parseStreamOnline({...event,data:{...event.data,...extra}}),null);
 assert.equal(parseStreamOnline({...event,event:{source:'Kick',type:'StreamOnline'}}),null);
 const streams=[],b=new StreamerBot({WebSocketImpl:FakeSocket,onStreamOnline:e=>streams.push(e)});b.connect({url:'ws://localhost:8080'});const w=FakeSocket.all.at(-1);w.receive(event);assert.equal(streams.length,0);w.receive({request:'Hello'});w.receive({id:'vv-subscribe',status:'ok'});w.receive(event);assert.equal(streams.length,1);b.disconnect();
});

test('Kick and YouTube chat are read from Streamer.bot events (2.20.8)',async()=>{
  const {parseOtherChat}=await import('../local/streamerbot.mjs');
  const kick=parseOtherChat({event:{source:'Kick',type:'ChatMessage'},data:{user:{id:'123',login:'vex',name:'Vex'},text:'!join',messageId:'k1'}});
  assert.deepEqual([kick.platform,kick.userId,kick.login,kick.text],['kick','123','vex','!join']);
  const nested=parseOtherChat({event:{source:'Kick',type:'ChatMessage'},data:{message:{id:'k2',content:'!voyager stats',sender:{id:'9',username:'Orion'}}}});
  assert.deepEqual([nested.userId,nested.login,nested.text],['9','orion','!voyager stats']);
  const yt=parseOtherChat({event:{source:'YouTube',type:'Message'},data:{user:{id:'UC1',name:'Lyra'},message:'!fire'}});
  assert.deepEqual([yt.platform,yt.userId,yt.text],['youtube','UC1','!fire']);
  assert.equal(parseOtherChat({event:{source:'Twitch',type:'ChatMessage'},data:{}}),null);
  assert.equal(parseOtherChat({event:{source:'Kick',type:'Follow'},data:{user:{id:'1'}}}),null);
});
