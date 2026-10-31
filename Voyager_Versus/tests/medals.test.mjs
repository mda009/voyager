import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Medals,MEDALS,normalizeMedalSettings,STARS} from '../local/medals.mjs';
import {BossFight} from '../local/boss.mjs';

const DAY=86400000,HOUR=3600000;
async function make(){
  let now=new Date(2026,9,31,20,0,0).getTime();const said=[];const dir=await mkdtemp(join(tmpdir(),'voyager-medals-'));
  const m=await new Medals({dataDir:dir,now:()=>now,say:t=>said.push(t)}).load();
  return {m,said,dir,at:ms=>{now+=ms;},now:()=>now};
}
const exportOf=(extra={})=>({type:'voyager.medals.data',v:1,at:Date.now(),users:[],crew:[],giftEvents:[],superChats:[],wins:[],...extra});
// A tiny stand-in for the community module (members are Points Ledger lifetime points).
function fakeCommunity(members={}){
  return {state:{members,week:{id:1},missions:[{id:'regular',type:'streamDays'},{id:'arena',type:'versusWins'}],season:{number:1,startedAt:1}},
    completions(){return this._done||[];},goalCompletions(){return this._goals||[];},standings(){return this._stand||[];}};
}

test('History is awarded quietly once, then new medals are announced in grouped chat lines and on stream',async()=>{
  const {m,said,at}=await make();
  m.ingestExport(exportOf({users:[{key:'twitch:1',name:'Nova',login:'nova',watchSeconds:120*HOUR/1000,months:13,gifts:60,firstSeenAt:Date.now()-400*DAY}]}));
  const c=fakeCommunity({'twitch:1':{name:'Nova',login:'nova',platform:'twitch',value:12000}});m.observeCommunity(c);
  const first=m.evaluate();
  const got=Object.fromEntries(first.map(a=>[a.medal,a.grade]));
  assert.equal(got.watch,1,'120 h is Silver Time Watched');assert.equal(got.subs,1,'13 months is Silver');assert.equal(got.gifter,1,'60 gifts is Silver');
  assert.equal(got.points,1,'12,000 points is Silver');assert.equal(got.founding,0,'Founding Crew during Season 1');
  assert.equal(m.state.toasts.length,0,'history is quiet on stream');
  at(25000);assert.match(m.tickChat(),/Voyager Medals are live! 1 viewer earned/);
  // New progress after the backfill is announced.
  m.ingestExport(exportOf({users:[{key:'twitch:1',name:'Nova',login:'nova',watchSeconds:520*HOUR/1000,months:13,gifts:60}]}));
  const next=m.evaluate();assert.deepEqual(next.map(a=>[a.medal,a.grade]),[['watch',2]]);
  assert.equal(m.state.toasts.at(-1).gradeName,'Gold');assert.equal(m.state.toasts.at(-1).upgrade,true);assert.match(m.state.toasts.at(-1).next,/Legend at 1,500 hours/);
  assert.equal(m.tickChat(),null,'at most one chat line every 20 seconds');
  at(21000);assert.match(m.tickChat(),/Nova earned Time Watched Gold/);
  assert.equal(m.evaluate().length,0,'a grade is only awarded once');
});

test('Loyalty, support and Hall of Honour medals count double for Honour; specials count 4',async()=>{
  const {m}=await make();m.state.backfilled=true;
  const v=m.viewer('twitch:9',{name:'Lyra'});v.m={watch:{g:2,at:1},versus:{g:2,at:1},founding:{g:0,at:1}};
  assert.equal(m.honour(v),STARS[2]*2+STARS[2]+4);
});

test('Stream streaks follow stream days, and nights after midnight count towards Night Watch',async()=>{
  const {m,at}=await make();m.state.backfilled=true;
  const members={};for(const k of ['twitch:1','twitch:2','twitch:3','twitch:4'])members[k]={name:k,platform:'twitch',value:0};
  const c=fakeCommunity(members);m.observeCommunity(c);
  for(let d=0;d<6;d++){
    for(const k of Object.keys(members)){if(d===3&&k==='twitch:3')continue;members[k].value+=10;}
    m.observeCommunity(c);at(DAY);
  }
  assert.equal(m.state.viewers['twitch:1'].c.bestStreak,6);assert.equal(m.state.viewers['twitch:1'].c.days,6);
  assert.equal(m.state.viewers['twitch:3'].c.streak,2,'missing a stream day resets the streak');
  assert.equal(m.state.viewers['twitch:3'].c.bestStreak,3);
});

test('Rank medals go to the biggest supporters and longest-serving viewers, and the best grade is kept',async()=>{
  const {m}=await make();m.state.backfilled=true;m.state.exportAt=1;
  const users=[];for(let i=0;i<60;i++)users.push({key:'twitch:'+i,name:'V'+i,watchSeconds:(20+i)*3600,months:i,gifts:0});
  m.ingestExport(exportOf({users}));m.primed=false;
  m.evaluate();
  assert.equal(m.state.viewers['twitch:59'].m.patron.g,3,'#1 supporter is Legend');
  assert.equal(m.state.viewers['twitch:50'].m.patron.g,2,'top 10 is Gold');
  assert.equal(m.state.viewers['twitch:15'].m.patron?.g,0,'top 50 is Bronze');assert.equal(m.state.viewers['twitch:5'].m.patron,undefined,'outside the top 50');
  assert.equal(m.state.viewers['twitch:0'].m.patron,undefined,'no score, no rank medal');
  assert.equal(m.state.viewers['twitch:59'].m.elder.g,3);
  m.ingestExport(exportOf({users:[{key:'twitch:0',watchSeconds:9999*3600,months:999,gifts:0}]}));m.evaluate();
  assert.equal(m.state.viewers['twitch:0'].m.patron.g,3);assert.equal(m.state.viewers['twitch:59'].m.patron.g,3,'a grade is never taken away');
});

test('Gift drops, Super Chats, Bits and giveaway wins are counted once each',async()=>{
  const {m}=await make();
  const d=exportOf({crew:[{key:'twitch:7',name:'Orion',login:'orion',bits:1500,kicks:0,follow:1,firstSeenAt:1}],
    giftEvents:[{id:'g1',key:'twitch:7',amount:20},{id:'g2',key:'twitch:7',amount:5}],superChats:[{id:'s1',key:'twitch:7',micro:5000000}],
    wins:[{id:'w1',platform:'twitch',userId:'7',login:'orion',name:'Orion'}]});
  m.ingestExport(d);m.ingestExport(d);
  const c=m.state.viewers['twitch:7'].c;
  assert.equal(c.giftMax,20);assert.equal(c.sc,500,'5.00 of Super Chat is 500 Bits');assert.equal(c.bits,1500);assert.equal(c.lucky,1);
  assert.equal(m.metrics(m.state.viewers['twitch:7'],Date.now()).power,2000);
});

test('Dreadnought results feed Slayer, Torpedo Run, Top Gun and the secret Last Stand',async()=>{
  const {m}=await make();m.state.backfilled=true;
  let now=1_800_000_000_000;
  const b=await new BossFight({dataDir:await mkdtemp(join(tmpdir(),'voyager-boss-')),now:()=>now,random:()=>0.5,onResult:r=>m.observeBoss(r)}).load();
  b.configure({lobbySeconds:10,battleSeconds:60,baseHp:600,hpPerPilot:0,lateJoinHp:0});
  b.call();b.receive({kind:'join',platform:'twitch',userId:'1',login:'nova',name:'Nova'});now+=10000;b.tick();
  now+=50000;b.tick();
  b.receive({kind:'gift',platform:'twitch',userId:'2',login:'lyra',name:'Lyra',amount:1});
  const lyra=m.state.viewers['twitch:2'].c;
  assert.equal(lyra.slayer,1);assert.equal(lyra.torpedo,1);assert.equal(lyra.topgun,1);assert.equal(lyra.laststand,1,'killing blow with 10 s left');
  assert.equal(m.state.viewers['twitch:1']?.c.slayer,undefined,'joined but never fired');
});

test('!medals replies with counts, Honour and the closest next grade, once per 30 seconds per viewer',async()=>{
  const {m,said,at}=await make();m.state.backfilled=true;
  m.ingestExport(exportOf({users:[{key:'kick:5',name:'Vex',login:'vex',watchSeconds:12*3600,months:2,gifts:0}]}));m.primed=false;m.evaluate();
  const text=m.command({kind:'medals',platform:'kick',userId:'5',login:'vex',name:'Vex'});
  assert.match(text,/^Vex 🏅 \d+ medals? \(.*Bronze.*\) · ★ \d+ honour, #1 in the Hall of Honour · latest: .* · closest next: Loyal Subscriber Bronze \(1 months to go\)/);
  assert.equal(m.state.viewers['kick:5'].c.fc,1,'First Contact');
  assert.equal(m.command({kind:'medals',platform:'kick',userId:'5',login:'vex',name:'Vex'}),null);
  at(31000);assert.ok(m.command({kind:'medals',platform:'kick',userId:'5',login:'vex',name:'Vex'}));
  assert.equal(said.length,2);
});

test('Season endings award Podium, Champion and Season Patron from the final standings',async()=>{
  const {m}=await make();m.state.backfilled=true;
  const c=fakeCommunity({});c._stand=[{key:'twitch:a',support:0},{key:'twitch:b',support:6},{key:'twitch:c',support:2},{key:'twitch:d',support:1}];
  for(const k of ['a','b','c','d'])m.viewer('twitch:'+k,{name:k});
  m.observeCommunity(c);c.state.season.number=2;c._stand=[];m.observeCommunity(c);
  const v=k=>m.state.viewers['twitch:'+k].c;
  assert.equal(v('a').champion,1);assert.equal(v('a').podium,1);assert.equal(v('c').podium,1);assert.equal(v('d').podium,undefined);assert.equal(v('b').seasonPatron,1);
  c.state.season.number=3;m.observeCommunity(c);assert.equal(m.state.foundingOpen,false,'Founding Crew closes after Season 2');
});

test('Settings validate grade targets; switched-off medals are not awarded; settings persist',async()=>{
  assert.throws(()=>normalizeMedalSettings({grades:{watch:[10,5,20,30]}}),/bigger target/);
  assert.throws(()=>normalizeMedalSettings({grades:{patron:[10,25,5,1]}}),/smaller top-N/);
  assert.deepEqual(normalizeMedalSettings({grades:{watch:[1,2,3,4]}}).grades,{watch:[1,2,3,4]});
  const {m,dir}=await make();m.state.backfilled=true;
  m.configure({off:['watch'],grades:{subs:[1,2,3,4]}});
  m.ingestExport(exportOf({users:[{key:'twitch:1',name:'Nova',watchSeconds:999*3600,months:2}]}));m.primed=false;
  const got=m.evaluate().map(a=>a.medal);assert.ok(!got.includes('watch'));assert.ok(got.includes('subs'));
  await m.flush();await m.saving;
  const saved=JSON.parse(await readFile(join(dir,'medals.json'),'utf8'));assert.deepEqual(saved.settings.off,['watch']);
  assert.equal(MEDALS.filter(x=>x.grades).length,24);
});
