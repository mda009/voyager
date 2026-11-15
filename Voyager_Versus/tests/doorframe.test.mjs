import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Doorframe,BUILTIN,normalizeDoorframeSettings} from '../local/doorframe.mjs';

async function make(settings={}){const dir=await mkdtemp(join(tmpdir(),'voyager-door-'));let now=1e12,stream=1;const said=[],owed=[];
  const d=await new Doorframe({dataDir:dir,now:()=>now,random:()=>0,stream:()=>stream,say:t=>said.push(t),reward:(id,title,points,label,who)=>owed.push([id,points,who.name])}).load();d.configure(settings);
  const run=ms=>{const end=now+ms;while(now<end){now+=100;d.tick();}};
  return {d,dir,said,owed,run,at:ms=>{now+=ms;},setStream:v=>{stream=v;}};}
const msg=(name,text,platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});

test('a round: a new obstacle at each door, the most-typed command decides, right voters earn points, a clean run pays the bonus',async()=>{
  const {d,said,owed,run}=await make({doors:2,seconds:5,reward:5,cleanBonus:10});
  assert.equal(d.chat(msg('Early','!hop')),null,'no round: commands do nothing');
  d.start();assert.throws(()=>d.start(),/already running/);assert.equal(d.overlay().round.phase,'approach');assert.equal(d.overlay().round.item.cmd,undefined,'the overlay never gives the answer away before the vote closes');
  run(1700);let o=d.overlay().round;assert.equal(o.phase,'vote');const first=d.round.item;
  const wrong=['duck','hop','squeeze'].find(c=>c!==first.cmd);
  d.chat(msg('Ace','!'+first.cmd));d.chat(msg('Nova','!'+first.cmd,'youtube'));d.chat(msg('Zed','!'+wrong));d.chat(msg('Zed','!'+wrong));d.chat(msg('Ace','hello'));
  assert.deepEqual(Object.values(d.tally()).reduce((a,b)=>a+b,0),3,'one vote per viewer');
  run(5000);o=d.overlay().round;assert.equal(o.phase,'pass');assert.equal(o.ok,true);assert.equal(o.choice,first.cmd);assert.equal(o.item.cmd,first.cmd);
  assert.deepEqual(owed.map(x=>x[2]).sort(),['Ace','Nova']);assert.ok(owed.every(x=>x[1]===5));
  run(1400);run(1600);o=d.overlay().round;assert.equal(o.phase,'approach');assert.equal(o.door,1);assert.notEqual(d.round.item.id,first.id,'a different obstacle at the next door');
  run(1700);d.chat(msg('Ace','!'+d.round.item.cmd));run(5000);assert.equal(d.overlay().round.ok,true);run(1400);run(1600);
  o=d.overlay().round;assert.equal(o.phase,'result');assert.deepEqual([o.result.cleared,o.result.bones,o.result.clean,o.result.players,o.result.title],[2,0,true,2,'Flawless!']);
  assert.deepEqual(owed.filter(x=>x[0].endsWith('-clean')).map(x=>[x[1],x[2]]).sort(),[[10,'Ace'],[10,'Nova']],'bonus to everyone who typed a right command');
  assert.ok(said[0].startsWith('🚪 DOORFRAME!'));assert.ok(said.some(t=>/Doorframe over: 2 of 2 doors, 0 bones broken/.test(t)));
  run(9000);assert.equal(d.overlay().round,null);assert.equal(d.view().stats.rounds,1);assert.equal(d.view().stats.clean,1);
});

test('wrong, tied or silent chat is a bonk: a bone breaks, the stream tally counts, no bonus; she still goes on',async()=>{
  const {d,said,owed,run,setStream}=await make({doors:3,seconds:4,cleanBonus:10});
  d.start();run(1700);const it=d.round.item,wrong=['duck','hop','squeeze'].find(c=>c!==it.cmd);
  d.chat(msg('A','!'+wrong));d.chat(msg('B','!'+wrong));d.chat(msg('C','!'+it.cmd));run(4000);
  let o=d.overlay().round;assert.equal(o.phase,'bonk');assert.equal(o.ok,false);assert.equal(o.bone.name,'Funny bone');assert.equal(o.bone.line,it.oops);assert.equal(o.bones,1);
  assert.deepEqual(owed.map(x=>x[2]),['C'],'the one who was right still earns');assert.ok(said.some(t=>t.includes('BONK!')&&t.includes('Broken: Funny bone')));
  run(2600);run(1600);run(1700);const it2=d.round.item,w2=['duck','hop','squeeze'].filter(c=>c!==it2.cmd);d.chat(msg('A','!'+it2.cmd));d.chat(msg('B','!'+w2[0]));run(4000);assert.equal(d.overlay().round.phase,'bonk','a tie is a bonk');assert.equal(d.overlay().round.choice,null);
  run(2600);run(1600);run(1700);run(4000);assert.equal(d.overlay().round.phase,'bonk','silence is a bonk');
  run(2600);run(1600);const res=d.overlay().round.result;assert.deepEqual([res.cleared,res.bones,res.clean,res.title],[0,3,false,'Straight to hospital']);assert.equal(owed.some(x=>x[0].endsWith('-clean')),false);
  assert.equal(d.overlay().streamBones,3);setStream(2);assert.equal(d.overlay().streamBones,0,'a new stream starts the on-screen tally again');assert.equal(d.view().stats.bones,3);
});

test('obstacles: none repeats until all have been used; your own are added, built-ins can be switched off; settings validate; stop',async()=>{
  const {d,run}=await make({doors:5,seconds:4});
  const seen=[];for(let r=0;r<2;r++){d.start();for(let i=0;i<5;i++){run(1700);seen.push(d.round.item.id);run(4000);run(2600);run(1600);}run(9000);}
  assert.equal(new Set(seen).size,10,'ten doors, ten different obstacles');
  d.configure({off:BUILTIN.map(b=>b.id).filter(id=>id!=='cat'),custom:[{name:'A wet floor sign',cmd:'squeeze',oops:'Read the sign. Slipped anyway.'}]});
  const items=d.items();assert.deepEqual(items.map(i=>i.name).sort(),['A cat','A wet floor sign']);assert.equal(items.find(i=>i.name==='A wet floor sign').art,'crate');assert.equal(items.find(i=>i.id==='cat').kind,'floor');
  d.configure({off:BUILTIN.map(b=>b.id),custom:[]});assert.throws(()=>d.start(),/at least one obstacle/);
  assert.throws(()=>normalizeDoorframeSettings({doors:9}),/1 to 5/);assert.throws(()=>normalizeDoorframeSettings({custom:[{name:'X',cmd:'fly'}]}),/!duck, !hop or !squeeze/);
  d.configure({off:[],enabled:false});assert.throws(()=>d.start(),/Turn Doorframe on/);d.configure({enabled:true});d.start();d.stop();assert.equal(d.overlay().round,null);assert.throws(()=>d.stop(),/No round/);
});
