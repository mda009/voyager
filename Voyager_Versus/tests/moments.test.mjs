import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Moments,normalizeSettings,DEFAULTS} from '../local/moments.mjs';
async function make(){let now=1_700_000_000_000;let boss=null,recent=[],promos=[];
  const m=await new Moments({dataDir:await mkdtemp(join(tmpdir(),'voyager-moments-')),now:()=>now,boss:()=>boss,medals:()=>recent,promotions:()=>promos}).load();
  return {m,at:ms=>{now+=ms;},setBoss:b=>{boss=b;},medals:l=>{recent=l;},promos:l=>{promos=l;}};}
const q=(...ids)=>({state:{queue:ids.map(id=>({id,stage:3,name:'Gifter '+id,amount:1}))}});
test('fleet queue entries become support events after the first sync, and a pile-up starts a crew surge',async()=>{
  const {m,at}=await make();m.fleet(q('a'));assert.equal(m.events.length,0,'first sync only primes');
  m.fleet(q('a','b'));assert.equal(m.events.length,1);assert.equal(m.events[0].kind,'support');assert.equal(m.events[0].sub,'gift');assert.equal(m.events[0].name,'Gifter b');
  m.fleet(q('a','b'));assert.equal(m.events.length,1,'no repeats');
  for(const id of ['c','d','e'])m.fleet(q(id));assert.equal(m.surge().active,false,'4 supports is not a surge');
  m.fleet(q('f'));assert.equal(m.surge().active,true);assert.equal(m.surge().count,5);
  at(4*60000);m.fleet(q('g'));assert.equal(m.surge().active,true,'a new support tops the surge up');assert.equal(m.surge().count,6);
  at(5*60000+1);assert.equal(m.surge().active,false);
  at(0);const o=m.overlay();assert.equal(o.events[0].name,'Gifter g');assert.ok(o.events.length<=DEFAULTS.tickerCount);
});
test('test alerts in the fleet queue are ignored and the support window expires',async()=>{
  const {m,at}=await make();m.fleet(q());m.fleet({state:{queue:[{id:'t',stage:1,name:'Tester',test:true}]}});assert.equal(m.events.length,0);
  for(const id of ['a','b','c','d'])m.fleet(q(id));at(4*60000);m.fleet(q('e'));assert.equal(m.surge().active,false,'old supports fell out of the 3-minute window');
});
test('medals, promotions, Versus results and Dreadnought results feed the ticker',async()=>{
  const {m,at,medals,promos,setBoss}=await make();medals([{id:1,name:'Old',medal:'x',title:'Old',grade:0}]);m.tick();
  medals([{id:2,name:'Nova',platform:'twitch',medal:'watch',title:'Night Watch',grade:0},{id:1,name:'Old',medal:'x',title:'Old',grade:0}]);m.tick();
  assert.equal(m.events.length,1,'only ids above the primed one');assert.equal(m.events[0].kind,'medal');assert.equal(m.events[0].title,'Night Watch');
  promos([{at:1_700_000_000_500,name:'Quillon',platform:'twitch',from:7,to:8}]);m.tick();assert.equal(m.events[0].kind,'promo');assert.equal(m.events[0].to,8);
  m.versus({type:'finish',players:[{name:'Lyra'},{name:'Corvid'}],winner:0,duration:40});assert.equal(m.events[0].kind,'versus');assert.equal(m.events[0].winner,'Lyra');assert.equal(m.events[0].loser,'Corvid');
  m.versus({type:'finish',demo:true,players:[{name:'A'},{name:'B'}],winner:1});assert.equal(m.events[0].winner,'Lyra','demo matches are ignored');
  setBoss({phase:'fight',id:'b1',hp:50,maxHp:100,leaders:[{name:'Nova',damage:9}]});m.tick();assert.equal(m.events[0].kind,'versus');
  setBoss({phase:'result',id:'b1',outcome:'victory',speed:'hero',elapsed:98,bonus:10,leaders:[{name:'Nova',damage:9}],pilots:3});m.tick();m.tick();
  assert.equal(m.events[0].kind,'dread');assert.equal(m.events[0].top,'Nova');assert.equal(m.events.filter(e=>e.kind==='dread').length,1,'one event per result');
  const o=m.overlay();assert.equal(o.dread.phase,'result');assert.equal(o.dread.leaders[0].name,'Nova');
});
test('next-celebration chip reads the goal samples and goes stale after two minutes',async()=>{
  const {m,at}=await make();assert.equal(m.nextCelebration(),null);
  m.goalsReading({samples:{silver:{points:22,targetPoints:25},gold:{points:22,targetPoints:50},platinum:{points:22,targetPoints:100}}});
  const n=m.nextCelebration();assert.equal(n.tier,'silver');assert.equal(n.remaining,3);assert.equal(n.next.tier,'gold');
  m.goalsReading({samples:{silver:{points:30,targetPoints:25},gold:{points:30,targetPoints:50},platinum:{points:30,targetPoints:100}}});assert.equal(m.nextCelebration().tier,'gold');
  m.goalsReading({samples:{silver:{points:120,targetPoints:25},gold:{points:120,targetPoints:50},platinum:{points:120,targetPoints:100}}});assert.equal(m.nextCelebration().done,true);
  at(121000);assert.equal(m.nextCelebration(),null);
});
test('settings validate, persist and toggle elements; command use quiets the hints',async()=>{
  const {m,at}=await make();assert.throws(()=>m.configure({hintSeconds:1}),/hintSeconds/);assert.throws(()=>m.configure({surge:{count:1}}),/count/);
  m.configure({hints:[{cmd:'!voyager',text:'Your card'},{cmd:'',text:'dropped'}],surge:{count:3,label:''},promoMin:5});
  assert.equal(m.settings.hints.length,1);assert.equal(m.settings.surge.label,'CREW SURGE');assert.equal(m.settings.promoMin,5);
  m.setElement('ticker',false);assert.equal(m.overlay().elements.ticker,false);assert.throws(()=>m.setElement('nope',true),/Unknown/);
  await m.saving;const again=await new Moments({dataDir:m.dataDir,now:()=>0}).load();assert.equal(again.settings.surge.count,3);assert.equal(again.settings.elements.ticker,false);
  m.commandSeen();assert.equal(m.overlay().hintsQuietUntil,1_700_000_000_000+10*60000);
  assert.equal(normalizeSettings({}).elements.toast,false,'medal toasts are off by default (medals.html has its own)');
  assert.equal(m.test('surge').kind,'surge');assert.equal(m.surge().active,true);m.clearSurge();assert.equal(m.surge().active,false);
});
test('points added and stream streaks become batch events, largest first, with the small ones only counted (2.20.65)',async()=>{
  const {m}=await make();
  const e=m.points([{name:'A',platform:'twitch',amount:10,total:100},{name:'B',platform:'kick',amount:150,total:900},{name:'C',platform:'twitch',amount:2,total:50},{name:'D',amount:0}]);
  assert.equal(e.kind,'points');assert.deepEqual(e.items.map(x=>x.name),['B','A'],'2 points is below pointsMin');assert.equal(e.count,3);assert.equal(e.sum,162);assert.equal(e.top.name,'B');
  assert.equal(m.points([]),null);
  const s=m.streaks([{name:'A',platform:'twitch',streak:1,best:4},{name:'B',platform:'twitch',streak:5,best:5},{name:'C',platform:'twitch',streak:2,best:2}]);
  assert.equal(s.kind,'streak');assert.deepEqual(s.items.map(x=>x.streak),[5,2],'a single day is not a streak');assert.equal(s.count,2);
  m.configure({pointsMax:1,streakMax:1,pointsMin:1});const e2=m.points([{name:'A',amount:3},{name:'B',amount:7}]);assert.equal(e2.items.length,1);assert.equal(e2.items[0].name,'B');
  assert.equal(m.overlay().elements.points,true);assert.equal(m.overlay().pointsSeconds,4);assert.equal(m.test('points').kind,'points');assert.equal(m.test('streak').items[0].streak,5);
});
test('screen layout: positions validate, the streak spans the width, the ticker keeps its width, markers toggle (2.20.66)',async()=>{
  const {m}=await make();assert.equal(m.overlay().layout.hints.x,28);
  m.configure({layout:{hints:{x:100,y:200},ticker:{x:40,y:1000,w:900},streak:{x:700,y:300}},markers:{camera:{x:1400,y:700,w:400,h:230,on:false},goals:{on:true}}});
  const o=m.overlay();assert.deepEqual(o.layout.hints,{x:100,y:200,w:420,h:58});assert.deepEqual(o.layout.ticker,{x:40,y:1000,w:900,h:44});assert.equal(o.layout.streak.x,0,'the streak always spans the width');
  assert.deepEqual(m.settings.markers.camera,{x:1400,y:700,w:400,h:230,on:false});assert.equal(m.settings.markers.goals.on,true);
  assert.throws(()=>m.configure({layout:{hints:{x:5000}}}),/Command hints/);assert.throws(()=>m.configure({markers:{camera:{w:1}}}),/Camera/);
  await m.saving;const again=await new Moments({dataDir:m.dataDir,now:()=>0}).load();assert.equal(again.settings.layout.hints.x,100);assert.equal(again.view().layoutDefaults.hints.x,28);
});
test('Voyager goals strip: tiers with progress from the reading, reached flag, stale after two minutes (2.20.67)',async()=>{
  const {m,at}=await make();assert.equal(m.overlay().goals,null);assert.equal(m.overlay().elements.goals,true);assert.equal(m.overlay().layout.goals.w,1120);
  m.goalsReading({samples:{silver:{points:30,targetPoints:25},gold:{points:30,targetPoints:50},platinum:{points:30,targetPoints:100}}});
  const g=m.overlay().goals;assert.deepEqual(g.tiers.map(t=>[t.tier,t.points,t.target,t.reached]),[['silver',30,25,true],['gold',30,50,false],['platinum',30,100,false]]);
  m.configure({layout:{goals:{x:100,y:900,w:800}}});assert.deepEqual(m.overlay().layout.goals,{x:100,y:900,w:800,h:54});
  at(121000);assert.equal(m.overlay().goals,null);
});
