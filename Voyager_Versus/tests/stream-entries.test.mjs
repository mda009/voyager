import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {Arena,CALL_COOLDOWN_MS} from '../dist/engine.mjs';
import {StreamEntries} from '../local/stream-entries.mjs';
const ids={alpha:'111',bravo:'222',charlie:'333',delta:'444'};
const chat=(login,text='!versus',more={})=>({login,name:login,userId:ids[login],text,...more});
function advance(game,seconds=1){for(let i=0;i<Math.ceil(seconds*10);i++)game.tick(.1);}
function fixture(t){const dir=mkdtempSync(join(tmpdir(),'voyager-entry-limits-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));let now=1800000000000;const time=()=>now;const store=new StreamEntries(dir,{now:time});const game=new Arena({now:time,entryGate:(p,r)=>store.claim(p,r)});return {dir,time,store,game,skip:(ms=CALL_COOLDOWN_MS)=>now+=ms};}
function idle(g){g.control('cancel');advance(g,8.1);}
test('One initiator and one challenger per viewer, either order; a third entry is rejected',t=>{
 const {store,game:g,skip}=fixture(t);
 assert.equal(g.command(chat('alpha')).ok,true);assert.equal(g.command(chat('bravo')).ok,true);idle(g);skip();
 assert.equal(g.command(chat('bravo')).ok,true);assert.equal(g.command(chat('alpha')).ok,true);idle(g);skip();
 assert.match(g.command(chat('alpha')).message,/both Versus entries/);advance(g);
 assert.equal(g.command(chat('charlie')).ok,true);assert.match(g.command(chat('alpha')).message,/both Versus entries/);assert.equal(g.phase,'calling');
 assert.deepEqual(store.snapshot().users.filter(u=>u.userId!=='333').map(u=>[u.initiator!=null,u.challenger!=null]),[[true,true],[true,true]]);
});
test('Accepted cancelled calls stay used through restart and a renamed Twitch account',t=>{
 const {dir,time,store,game:g,skip}=fixture(t);g.command(chat('alpha'));g.control('cancel');skip();
 const restored=new StreamEntries(dir,{now:time}),h=new Arena({now:time,entryGate:(p,r)=>restored.claim(p,r)});
 assert.match(h.command(chat('renamed','!versus',{userId:'111'})).message,/already used your initiator/);
 h.command(chat('bravo'));advance(h);assert.equal(h.command(chat('renamed','!versus',{userId:'111'})).ok,true);
 assert.equal(restored.snapshot().users.find(u=>u.userId==='111').name,'renamed');assert.equal(store.data.id,restored.data.id);
});
test('Rejected calls, cooldown attempts, invalid duels, own-seat repeats and training do not consume another entry',t=>{
 const {store,game:g}=fixture(t);g.control('open');assert.equal(g.command(chat('alpha')).ok,false);assert.equal(store.data.users.length,0);g.control('open');advance(g);
 assert.equal(g.command(chat('alpha')).ok,true);advance(g);assert.equal(g.command(chat('alpha')).ok,false);assert.equal(store.data.users[0].challenger,null);
 g.control('cancel');assert.equal(g.command(chat('bravo')).ok,false);assert.equal(store.data.users.length,1);advance(g);
 assert.equal(g.command(chat('bravo','!duel @bravo')).ok,false);g.control('demo');assert.equal(store.data.users.length,1);
});
test('Live limits require a Twitch ID; training never reserves live entries',t=>{
 const {store,game:g}=fixture(t);assert.match(g.command(chat('alpha','!versus',{userId:''})).message,/account ID/);assert.equal(store.data.users.length,0);advance(g);
 assert.equal(g.command(chat('alpha','!versus',{demo:true})).ok,false);const training=new Arena({training:true,entryGate:(p,r)=>store.claim(p,r)});assert.equal(training.command(chat('alpha','!versus',{demo:true})).ok,true);assert.equal(training.command(chat('bravo','!versus',{demo:true})).ok,true);assert.equal(store.data.users.length,0);
});
test('Legacy queue and duel commands never consume live role allowances',t=>{
 const {store,game:g}=fixture(t);
 for(const [who,text] of [['alpha','!join'],['alpha','!duel @bravo'],['bravo','!accept']])assert.equal(g.command(chat(who,text)).ok,false);
 assert.equal(store.data.users.length,0);assert.equal(g.queue.length+g.matches.length+g.invites.length,0);
 assert.equal(g.command(chat('alpha')).ok,true);assert.equal(g.command(chat('bravo')).ok,true);
 assert.ok(store.data.users.find(u=>u.userId==='111').initiator);assert.ok(store.data.users.find(u=>u.userId==='222').challenger);
});
test('Stream-online reset ignores duplicate/stale events and preserves entries accepted after actual stream start',t=>{
 const {store,skip,time}=fixture(t);store.claim(chat('alpha'),'initiator');skip(10000);const startedAt=time();skip(1000);store.claim(chat('bravo'),'challenger');
 const event={key:'stream-2',channelId:'999',startedAt};assert.equal(store.observe(event),true);assert.deepEqual(store.data.users.map(u=>u.login),['bravo']);
 store.claim(chat('alpha'),'initiator');assert.equal(store.observe(event),false);assert.equal(store.observe({...event,key:'old',startedAt:startedAt-5000}),false);assert.equal(store.data.users.length,2);
});
test('Manual new stream clears usage only; late older online events and restart preserve new usage',t=>{
 const {dir,store,skip,time}=fixture(t);const oldStart=time()-5000;store.claim(chat('alpha'),'initiator');skip(1000);store.newStream();store.claim(chat('alpha'),'initiator');
 assert.equal(store.observe({key:'late-event',channelId:'999',startedAt:oldStart}),true);assert.equal(store.data.users.length,1);
 const reopened=new StreamEntries(dir,{now:time});assert.equal(reopened.claim(chat('alpha'),'initiator').ok,false);assert.equal(reopened.claim(chat('alpha'),'challenger').ok,true);
});
test('Malformed saved usage fails closed rather than granting everyone fresh entries',t=>{
 const {dir,store}=fixture(t);writeFileSync(store.path,'{"schema":1,"users":[]}');assert.throws(()=>new StreamEntries(dir),/Invalid stream-entries/);writeFileSync(store.path,'broken');assert.throws(()=>new StreamEntries(dir),/Cannot read/);
});
