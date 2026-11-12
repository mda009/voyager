import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {BossFight,normalizeBossSettings} from '../local/boss.mjs';

async function make(settings={}){
  let now=1_800_000_000_000;const said=[];
  const b=await new BossFight({dataDir:await mkdtemp(join(tmpdir(),'voyager-boss-')),now:()=>now,random:()=>0.5,say:t=>said.push(t)}).load();
  if(Object.keys(settings).length)b.configure(settings);
  return {b,said,at:ms=>{now+=ms;b.tick();},now:()=>now};
}
const ev=(kind,id,extra={})=>({kind,platform:extra.platform||'twitch',userId:id,login:id,name:id.toUpperCase(),...extra});

test('Only joined pilots can fire, !fire is free and rate-limited, and the fight starts after the countdown',async()=>{
  const {b,said,at}=await make({lobbySeconds:30,baseHp:1000,hpPerPilot:100});
  b.call();assert.match(said[0],/!join/);
  assert.equal(b.receive(ev('fire','nova')).ignored,true,'no firing before the battle');
  b.receive(ev('join','nova'));b.receive(ev('join','lyra',{platform:'kick'}));b.receive(ev('join','nova'));
  at(30000);let o=b.overlay();assert.equal(o.phase,'battle');assert.equal(o.maxHp,1200);assert.equal(o.pilots,2);
  assert.equal(b.receive(ev('fire','orion')).ignored,true,'must !join first');
  const first=b.receive(ev('fire','nova'));assert.ok(first.ok&&first.damage>=15&&first.damage<=30);
  assert.equal(b.receive(ev('fire','nova')).ignored,true,'cooldown');
  at(3000);assert.equal(b.receive(ev('fire','nova')).ok,true);
  // 2.21.11 !shoot: a second free command on its own cooldown, half the damage, a cannon on screen
  assert.equal(b.receive(ev('shoot','orion')).ignored,true,'must !join first');
  const shot=b.receive(ev('shoot','nova'));assert.equal(shot.ok,true,'usable right after !fire: separate cooldown');assert.ok(shot.damage>=8&&shot.damage<=15,'half of 15–30: '+shot.damage);assert.equal(shot.kind,'shoot');
  assert.equal(b.receive(ev('shoot','nova')).ignored,true,'its own cooldown');assert.equal(b.receive(ev('fire','nova')).ignored,true,'!fire still cooling');
  at(3000);assert.equal(b.receive(ev('shoot','nova')).ok,true);
  const fx=b.overlay().effects;assert.ok(fx.some(e=>e.kind==='cannon'),'cannon effect for the overlay');assert.ok(fx.some(e=>e.kind==='laser'));
  assert.equal(b.battle.pilots.get('twitch:nova').shots,2);
  b.receive(ev('join','late'));assert.equal(b.overlay().maxHp,1275,'late pilots add hull');
});

test('Cheers hit harder than !fire and gifted subs hardest; paid support boards automatically',async()=>{
  const {b,at}=await make({lobbySeconds:10,baseHp:100000});
  b.call();b.receive(ev('join','nova'));at(10000);
  const fire=b.receive(ev('fire','nova')).damage,bits=b.receive(ev('bits','orion',{amount:100})).damage,gift=b.receive(ev('gift','lyra',{amount:1,platform:'youtube'})).damage;
  assert.ok(fire<bits&&bits<gift,[fire,bits,gift].join(' < '));assert.equal(bits,250);assert.equal(gift,600);
  assert.equal(b.overlay().pilots,3,'cheering and gifting join the fleet');
  assert.equal(b.receive(ev('gift','kick1',{platform:'kick',amount:5,receipts:['kick:a:1','kick:b:1']})).damage,1200,'counted by receipts');
  assert.equal(b.receive(ev('gift','kick1',{platform:'kick',amount:1,receipts:['kick:a:1']})).ignored,true,'a single gift already counted in the mass gift');
});

test('Victory pays every pilot who fought the same points; the boss escapes when time runs out',async()=>{
  const {b,said,at}=await make({lobbySeconds:10,battleSeconds:60,baseHp:500,hpPerPilot:0,lateJoinHp:0,victoryPoints:100,legendarySeconds:0,heroSeconds:0});
  b.call();b.receive(ev('join','nova'));b.receive(ev('join','idle'));at(10000);
  b.receive(ev('fire','nova'));b.receive(ev('gift','orion',{amount:1}));
  assert.equal(b.overlay().phase,'result');assert.equal(b.overlay().outcome,'victory');
  const [batch,mvpBatch]=b.rewardBatches();assert.equal(batch.reward,100);assert.deepEqual(batch.pilots.map(p=>p.key).sort(),['twitch:nova','twitch:orion'],'pilots who never fired get nothing');
  assert.equal(mvpBatch.reward,25,'2.20.90: the MVP bonus is a second batch');assert.equal(mvpBatch.pilots.length,1);assert.equal(mvpBatch.pilots[0].key,b.history[0].mvp.key);assert.match(mvpBatch.title,/MVP/);
  assert.match(said.at(-1),/MVP: ORION/);
  b.tick();at(30000);assert.equal(b.overlay().phase,'idle');
  b.call();b.receive(ev('join','nova'));at(10000);at(61000);
  assert.equal(b.history[0].outcome,'escaped');assert.equal(b.rewardBatches().length,2,'no reward for an escape (the two batches are the earlier victory and its MVP bonus)');
});

test('2.20.44 speed goals: a kill within the Legendary or Hero time adds a bonus to the victory points and is announced',async()=>{
  const {b,said,at}=await make({lobbySeconds:10,battleSeconds:240,baseHp:500,hpPerPilot:0,lateJoinHp:0,victoryPoints:100});
  assert.equal(b.settings.legendarySeconds,60);assert.equal(b.settings.heroSeconds,120);assert.equal(b.settings.speedBonusPct,10);
  // Legendary: destroyed 45 s into the battle.
  b.call();b.receive(ev('join','nova'));at(10000);at(45000);b.receive(ev('gift','nova',{amount:1}));
  let h=b.history[0];assert.equal(h.outcome,'victory');assert.equal(h.speed,'legendary');assert.equal(h.elapsed,45000);assert.equal(h.base,100);assert.equal(h.bonus,10);assert.equal(h.reward,110);
  let [batch]=b.rewardBatches();assert.equal(batch.reward,110);assert.match(batch.title,/Legendary kill in 0:45 \(\+10 bonus\)/);
  assert.match(said.at(-1),/LEGENDARY: destroyed in 0:45/);assert.match(said.at(-1),/Legendary Strike medal and 110 Voyager points \(\+10% speed bonus\)/);
  const o=b.overlay();assert.equal(o.speed,'legendary');assert.equal(o.bonus,10);assert.equal(o.victoryPoints,110);assert.deepEqual(o.goals,{legendary:60,hero:120,bonusPct:10});
  b.tick();at(30000);
  // Hero: destroyed 90 s in.
  b.call();b.receive(ev('join','nova'));at(10000);at(90000);b.receive(ev('gift','nova',{amount:1}));
  h=b.history[0];assert.equal(h.speed,'hero');assert.equal(h.reward,110);assert.match(said.at(-1),/HEROIC: destroyed in 1:30/);assert.match(said.at(-1),/Hero of the Fleet medal/);
  b.tick();at(30000);
  // Too slow: 150 s in, plain victory points, no bonus.
  b.call();b.receive(ev('join','nova'));at(10000);at(150000);b.receive(ev('gift','nova',{amount:1}));
  h=b.history[0];assert.equal(h.speed,'');assert.equal(h.bonus,0);assert.equal(h.reward,100);assert.match(said.at(-1),/earns 100 Voyager points\./);assert.doesNotMatch(said.at(-1),/medal/);
  assert.equal(b.rewardBatches().length,6,'three victories, each with a victory batch and an MVP batch');
  // Goals off and limits.
  b.tick();at(30000);b.configure({legendarySeconds:0,heroSeconds:0});
  b.call();b.receive(ev('join','nova'));at(10000);at(5000);b.receive(ev('gift','nova',{amount:1}));assert.equal(b.history[0].speed,'');assert.equal(b.history[0].reward,100);
  b.tick();at(30000);assert.throws(()=>b.configure({legendarySeconds:120,heroSeconds:60}),/Hero time/);
  assert.throws(()=>normalizeBossSettings({speedBonusPct:600}),/between/);
});

test('Shields halve !fire at 50% hull, the boss knocks pilots out, and only moderators can call it from chat',async()=>{
  const {b,at}=await make({lobbySeconds:10,baseHp:1000,hpPerPilot:0,lateJoinHp:0});
  assert.equal(b.receive(ev('call','viewer',{role:1})).ignored,true);
  assert.equal(b.receive(ev('call','mod',{role:3})).ok,true);
  for(const n of ['a','b','c','d','e','f'])b.receive(ev('join',n));at(10000);
  b.receive(ev('bits','x',{amount:200}));assert.equal(b.overlay().shield,true);
  assert.equal(b.receive(ev('fire','a')).damage,12,'random 0.5 → 23, halved');
  at(20000);assert.ok(b.overlay().fleet.some(p=>p.stunned),'boss attack');
  assert.throws(()=>b.configure({fireMin:50,fireMax:10}),/between fights|at least/);
  assert.throws(()=>normalizeBossSettings({fireMin:50,fireMax:10}),/at least/);
});

test('A preview fight simulates chat and is never rewarded or announced',async()=>{
  const {b,said,at}=await make({lobbySeconds:10,battleSeconds:60});
  b.call({demo:true});for(let i=0;i<40;i++)at(400);
  assert.ok(b.overlay().pilots>0);for(let i=0;i<200;i++)at(400);
  assert.equal(said.length,0);assert.equal(b.history.length,0);
});

test('Dreadnought victories appear in Missions › Points owed, payable once per pilot',async()=>{
  const {Community}=await import('../local/community.mjs');
  const c=await new Community({dataDir:await mkdtemp(join(tmpdir(),'voyager-c-')),now:()=>1_800_000_000_000}).load();
  c.setBoss(()=>[{id:42,title:'The Dreadnought defeated',reward:100,pilots:[{key:'twitch:1',name:'Nova',platform:'twitch'},{key:'kick:2',name:'Orion',platform:'kick'}]}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:5}]);
  const rows=c.payables().filter(p=>p.scope==='boss');
  assert.deepEqual(rows.map(r=>[r.key,r.payable,r.status]),[['twitch:1',true,'owed'],['kick:2',false,'owed']]);
  c.recordPayout({week:42,missionId:'boss',key:'twitch:1',status:'paid'});
  assert.equal(c.payables().find(p=>p.key==='twitch:1'&&p.scope==='boss').status,'paid');
});

test('An escape (or a fight ended early) never awards points',async()=>{
  const {b,said,at}=await make({lobbySeconds:10,battleSeconds:60,baseHp:100000,hpPerPilot:0});
  b.call();b.receive(ev('join','nova'));at(10000);b.receive(ev('fire','nova'));b.receive(ev('gift','orion',{amount:3}));
  at(61000);
  assert.equal(b.history[0].outcome,'escaped');assert.deepEqual(b.history[0].rewarded,[]);assert.equal(b.rewardBatches().length,0);
  assert.match(said.at(-1),/No points/);assert.match(b.overlay().feed[0].text,/No points awarded/);
  at(30000);b.call();b.receive(ev('join','nova'));at(10000);b.receive(ev('fire','nova'));b.cancel();
  assert.equal(b.rewardBatches().length,0,'cancelled fights pay nothing');
});

test('!join and !fire still work when the chat event has no user ID (keyed by login)',async()=>{
  let now=1_800_000_000_000;
  const b=await new BossFight({dataDir:await mkdtemp(join(tmpdir(),'voyager-boss-')),now:()=>now,random:()=>0.5}).load();
  b.configure({lobbySeconds:10});b.call();
  assert.equal(b.receive({kind:'join',platform:'twitch',userId:'',login:'nova',name:'Nova'}).ok,true);
  assert.equal(b.receive({kind:'join',platform:'twitch',userId:'',login:'nova',name:'Nova'}).ignored,true,'boards once');
  now+=10000;b.tick();assert.equal(b.receive({kind:'fire',platform:'twitch',userId:'',login:'nova'}).ok,true);
});

test('2.20.12 balance: saved settings on the old defaults move to the easier ones; your own changes stay',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-boss-'));
  await writeFile(join(dir,'dreadnought.json'),JSON.stringify({schema:1,settings:{baseHp:4000,hpPerPilot:350,lateJoinHp:150,fireMin:12,fireMax:22,fireCooldown:4,battleSeconds:300,victoryPoints:250},history:[]}));
  const b=await new BossFight({dataDir:dir}).load();
  assert.equal(b.settings.baseHp,1000);assert.equal(b.settings.hpPerPilot,150);assert.equal(b.settings.fireMin,15);assert.equal(b.settings.fireCooldown,3);
  assert.equal(b.settings.battleSeconds,300,'changed by the streamer, kept');assert.equal(b.settings.victoryPoints,250);
  b.configure({baseHp:4000});await b.saving;
  assert.equal((await new BossFight({dataDir:dir}).load()).settings.baseHp,4000,'choosing the old value again after the update sticks');
});
