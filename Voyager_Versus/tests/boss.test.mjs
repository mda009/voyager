import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
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
  const first=b.receive(ev('fire','nova'));assert.ok(first.ok&&first.damage>=12&&first.damage<=22);
  assert.equal(b.receive(ev('fire','nova')).ignored,true,'cooldown');
  at(4000);assert.equal(b.receive(ev('fire','nova')).ok,true);
  b.receive(ev('join','late'));assert.equal(b.overlay().maxHp,1350,'late pilots add hull');
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
  const {b,said,at}=await make({lobbySeconds:10,battleSeconds:60,baseHp:500,hpPerPilot:0,lateJoinHp:0,victoryPoints:100});
  b.call();b.receive(ev('join','nova'));b.receive(ev('join','idle'));at(10000);
  b.receive(ev('fire','nova'));b.receive(ev('gift','orion',{amount:1}));
  assert.equal(b.overlay().phase,'result');assert.equal(b.overlay().outcome,'victory');
  const [batch]=b.rewardBatches();assert.equal(batch.reward,100);assert.deepEqual(batch.pilots.map(p=>p.key).sort(),['twitch:nova','twitch:orion'],'pilots who never fired get nothing');
  assert.match(said.at(-1),/MVP: ORION/);
  b.tick();at(30000);assert.equal(b.overlay().phase,'idle');
  b.call();b.receive(ev('join','nova'));at(10000);at(61000);
  assert.equal(b.history[0].outcome,'escaped');assert.equal(b.rewardBatches().length,1,'no reward for an escape');
});

test('Shields halve !fire at 50% hull, the boss knocks pilots out, and only moderators can call it from chat',async()=>{
  const {b,at}=await make({lobbySeconds:10,baseHp:1000,hpPerPilot:0,lateJoinHp:0});
  assert.equal(b.receive(ev('call','viewer',{role:1})).ignored,true);
  assert.equal(b.receive(ev('call','mod',{role:3})).ok,true);
  for(const n of ['a','b','c','d','e','f'])b.receive(ev('join',n));at(10000);
  b.receive(ev('bits','x',{amount:200}));assert.equal(b.overlay().shield,true);
  assert.equal(b.receive(ev('fire','a')).damage,9,'17 halved');
  at(15000);assert.ok(b.overlay().fleet.some(p=>p.stunned),'boss attack');
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
