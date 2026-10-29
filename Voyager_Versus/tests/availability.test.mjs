import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {Arena} from '../dist/engine.mjs';
import {EconomyStore} from '../local/rewards.mjs';
import {AvailabilityAnnouncer} from '../local/availability.mjs';

function fixture(t){
  const dir=mkdtempSync(join(tmpdir(),'voyager-availability-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const f={dir,now:1000000,store:new EconomyStore(dir),receipts:new Map(),sends:[],twitch:true,action:'action'};
  f.game=new Arena({now:()=>f.now,onCooldown:until=>f.store.cooldown(until)});
  f.bot={status:{connected:true},request:async(type,args)=>{
    if(type==='GetGlobal'){const value=f.receipts.get(args.variable);return value?{status:'ok',variable:{value}}:{status:'error'};}
    if(type==='GetBroadcaster')return {connected:f.twitch?['twitch']:[]};
    assert.equal(type,'DoAction');assert.equal(args.action.id,'action');assert.equal(args.args.vvOperation,'available');
    assert.ok(args.args.vvExpiresAt>f.now&&args.args.vvExpiresAt<=f.now+10000);
    f.sends.push(args.args);f.receipts.set('voyagerVersusAnnouncement_'+args.args.vvAnnouncementId,'sent');return {status:'ok'};
  }};
  f.announcer=()=>new AvailabilityAnnouncer({store:f.store,bot:f.bot,game:f.game,action:()=>f.action,now:()=>f.now});
  return f;
}

test('Availability announces at the 45-minute boundary once, survives restart, and rearms on the next live call',async t=>{
  const f=fixture(t);let announcer=f.announcer();
  f.game.command({login:'alpha',name:'Alpha',text:'!versus'});f.game.control('cancel');
  f.now=f.game.cooldownUntil-1;await announcer.tick();assert.equal(f.sends.length,0);
  f.now++;await announcer.tick();assert.equal(f.sends.length,1);assert.equal(f.store.data.availability.status,'sent');
  assert.equal(announcer.snapshot().readyAlert.id,f.sends[0].vvAnnouncementId);assert.equal(f.game.phase,'lobby');assert.equal(f.game.round,0);
  // A restarted host confirms the receipt instead of sending again.
  f.store=new EconomyStore(f.dir);announcer=f.announcer();await announcer.tick();assert.equal(f.store.data.availability.status,'sent');assert.equal(announcer.snapshot().readyAlert,null);
  f.now+=60000;await announcer.tick();assert.equal(f.sends.length,1);
  const firstId=f.sends[0].vvAnnouncementId;
  f.game.command({login:'bravo',name:'Bravo',text:'!versus'});f.game.control('cancel');
  f.now=f.game.cooldownUntil;await announcer.tick();assert.equal(f.sends.length,2);assert.notEqual(f.sends[1].vvAnnouncementId,firstId);
});

test('Ready audio is automatic even when chat delivery is slow or ambiguous; confirmation never replays it',async t=>{
  const f=fixture(t),request=f.bot.request;
  f.bot.request=async(type,args)=>{
    if(type==='DoAction'){f.sends.push(args.args);return {status:'ok'};}
    return request(type,args);
  };
  const a=f.announcer(),startedAt=f.now;await a.tick();
  const id=f.sends[0].vvAnnouncementId;
  assert.deepEqual(a.snapshot().readyAlert,{id,startedAt,durationMs:12000,test:false});
  f.receipts.set('voyagerVersusAnnouncement_'+id,'pending');
  f.now+=3001;await a.tick();assert.equal(a.snapshot().readyAlert.startedAt,startedAt);
  f.now=startedAt+12000;assert.equal(a.snapshot().readyAlert,null);
  f.receipts.set('voyagerVersusAnnouncement_'+id,'sent');f.now+=3001;await a.tick();
  assert.equal(f.store.data.availability.status,'sent');assert.equal(a.snapshot().readyAlert,null);
  assert.equal(f.sends.length,1);
});

test('A saved ready cue never replays when a pending receipt is confirmed after a host restart',async t=>{
  const f=fixture(t);f.store.update(d=>d.availability={id:'old',status:'pending',attemptAt:f.now-1000,alertStartedAt:f.now-1000});
  f.receipts.set('voyagerVersusAnnouncement_old','sent');const a=f.announcer();await a.tick();
  assert.equal(f.store.data.availability.status,'sent');assert.equal(a.snapshot().readyAlert,null);assert.equal(f.sends.length,0);
});

test('An existing ready window from the old version gets one automatic cue after upgrading, without resending chat',async t=>{
  const f=fixture(t);f.store.update(d=>d.availability={id:'old',status:'sent',attemptAt:f.now-60000});
  let a=f.announcer();await a.tick();assert.equal(a.snapshot().readyAlert.id,'old');assert.equal(f.sends.length,0);
  f.store=new EconomyStore(f.dir);a=f.announcer();await a.tick();assert.equal(a.snapshot().readyAlert,null);assert.equal(f.sends.length,0);
});

test('Rewards verification can be unavailable without blocking OBS; chat sends once verification succeeds',async t=>{
  const f=fixture(t);f.action=null;const a=f.announcer();await a.tick();
  const cue=a.snapshot().readyAlert;assert.ok(cue);assert.equal(f.sends.length,0);
  assert.equal(f.game.phase,'lobby');assert.equal(f.game.round,0);assert.equal(f.store.data.cooldownUntil,0);assert.deepEqual(f.store.data.rewards,[]);
  f.action='action';f.now+=3001;await a.tick();assert.equal(f.sends.length,1);assert.deepEqual(a.snapshot().readyAlert,cue);
});

test('Ready preview creates an OBS cue without chat, game transitions, cooldown or points changes',t=>{
  const f=fixture(t),a=f.announcer(),before=JSON.stringify(f.store.data),game=JSON.stringify(f.game.snapshot());
  assert.equal(a.preview().ok,true);const first=a.snapshot().readyAlert;assert.equal(first.test,true);
  assert.equal(JSON.stringify(f.store.data),before);assert.equal(JSON.stringify(f.game.snapshot()),game);assert.equal(f.sends.length,0);
  a.preview();assert.notEqual(a.snapshot().readyAlert.id,first.id);
});

test('Closed, paused, occupied and disconnected arenas never announce or cue OBS',async t=>{
  const f=fixture(t),a=f.announcer();
  for(const [object,key,value] of [[f.game,'open',false],[f.game,'paused',true],[f.game,'phase','calling'],[f.game,'matches',[{}]],[f.game,'queue',[{},{}]],[f.bot.status,'connected',false]]){
    const previous=object[key];object[key]=value;await a.tick();object[key]=previous;
  }
  assert.equal(f.sends.length,0);assert.equal(f.store.data.availability,null);assert.equal(a.snapshot().readyAlert,null);
  f.twitch=false;await a.tick();assert.equal(f.sends.length,0);
  f.twitch=true;f.now+=30001;await a.tick();assert.equal(f.sends.length,1);
});

test('Lost action acknowledgment is confirmed from its receipt without a duplicate announcement',async t=>{
  const f=fixture(t),request=f.bot.request;
  f.bot.request=async(type,args)=>{const result=await request(type,args);if(type==='DoAction')throw new Error('Connection lost');return result;};
  const a=f.announcer();await a.tick();f.now+=3001;await a.tick();
  assert.equal(f.sends.length,1);assert.equal(f.store.data.availability.status,'sent');
});

test('Ambiguous pending chat receipt requires review instead of repeated sends',async t=>{
  const f=fixture(t),request=f.bot.request;
  f.bot.request=async(type,args)=>{
    if(type==='DoAction'){f.sends.push(args.args);f.receipts.set('voyagerVersusAnnouncement_'+args.args.vvAnnouncementId,'pending');throw new Error('Connection lost');}
    return request(type,args);
  };
  const a=f.announcer();await a.tick();f.now+=3001;await a.tick();assert.equal(f.store.data.availability.status,'pending');
  f.now+=30001;await a.tick();assert.equal(f.store.data.availability.status,'review');
  f.now+=60000;await a.tick();assert.equal(f.sends.length,1);
});

test('A live call arriving while readiness is checked suppresses a stale announcement',async t=>{
  const f=fixture(t),request=f.bot.request;
  f.bot.request=async(type,args)=>{
    if(type==='GetBroadcaster')f.game.command({login:'alpha',name:'Alpha',text:'!versus'});
    return request(type,args);
  };
  await f.announcer().tick();assert.equal(f.game.phase,'calling');assert.equal(f.sends.length,0);assert.equal(f.store.data.availability,null);
});

test('The automatic cue ends when a viewer calls versus, and reconnecting during cooldown cannot trigger it',async t=>{
  const f=fixture(t),a=f.announcer();await a.tick();assert.ok(a.snapshot().readyAlert);
  f.game.command({login:'alpha',name:'Alpha',text:'!versus'});
  assert.equal(a.snapshot().readyAlert,null);assert.equal(f.game.phase,'calling');
  f.bot.status.connected=false;await a.tick();f.bot.status.connected=true;f.now+=3001;await a.tick();
  assert.equal(a.snapshot().readyAlert,null);assert.equal(f.sends.length,1);
});

test('Concurrent ticks cannot duplicate readiness and a disconnected Twitch connection is retried automatically',async t=>{
  const f=fixture(t),a=f.announcer();f.twitch=false;await Promise.all([a.tick(),a.tick()]);
  assert.equal(a.snapshot().readyAlert,null);assert.equal(f.store.data.availability,null);
  f.twitch=true;f.now+=3001;await Promise.all([a.tick(),a.tick(),a.tick()]);
  assert.ok(a.snapshot().readyAlert);assert.equal(f.sends.length,1);
});

test('Disconnect or a new stream while checking readiness cannot publish a stale cue',async t=>{
  for(const change of ['disconnect','newStream']){
    const f=fixture(t),request=f.bot.request;
    f.bot.request=async(type,args)=>{if(type==='GetBroadcaster'){
      if(change==='disconnect')f.bot.status.connected=false;
      else f.store.update(d=>d.availability={id:'replacement',status:'pending',attemptAt:0});
    }return request(type,args);};
    const a=f.announcer();await a.tick();assert.equal(a.snapshot().readyAlert,null);assert.equal(f.sends.length,0);
  }
});
