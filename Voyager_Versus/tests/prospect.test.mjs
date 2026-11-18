import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {ProspectRun,normalizeProspectSettings,priceAt,RULES} from '../local/prospect.mjs';

async function make(settings={}){const dir=await mkdtemp(join(tmpdir(),'voyager-prospect-'));let now=1e12;const said=[],grants=[],results=[];
  const g=await new ProspectRun({dataDir:dir,now:()=>now,random:()=>.25,say:t=>said.push(t),onTickets:x=>grants.push(x),onResult:x=>results.push(x)}).load();g.configure({cooldownSeconds:0,...settings});
  const run=(ms,each)=>{const end=now+ms;while(now<end){now+=100;if(each)each();g.tick();}};
  return {g,dir,said,grants,results,run,at:ms=>{now+=ms;},now:()=>now};}
const msg=(name,text,platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});
const NAMES=['Ace','Nova','Zed','Kit'];
// A crew that types at a steady pace: everyone every `every` ms, staggered.
const pace=(g,now,cmd,every,names=NAMES)=>()=>{names.forEach((n,i)=>{if((now()+i*Math.round(every/names.length/100)*100)%every===0)g.chat(msg(n,cmd));});};

test('a full run: mine in the window, shoot down the pirate, sell on the votes; everyone who flew gets the same tickets',async()=>{
  const {g,said,grants,results,run,now}=await make();
  assert.equal(g.chat(msg('Early','!mine')),null,'no run: commands do nothing');
  g.start();assert.throws(()=>g.start(),/already under way/);assert.equal(g.overlay().run.phase,'contract');
  assert.deepEqual(g.chat(msg('Kit','!sell')),{ok:true,crew:true,counted:false},'typing any command during the run puts you on the crew');
  run(20000);assert.equal(g.overlay().run.phase,'mine');
  // four miners taking turns: one !mine each every 20 s keeps two lasers on, which holds the charge in the window
  const mining=pace(g,now,'!mine',20000);for(let i=0;i<600&&g.run.phase==='mine';i++)run(100,mining);
  let o=g.overlay().run;assert.equal(o.phase,'haul');assert.equal(g.run.cracked,true,'the rock cracked');assert.ok(now()-g.run.startedAt<20000+50000,'and the phase ended early');assert.ok(o.ore>180&&o.ore<=220,'most of the 220 CU: '+o.ore);
  assert.equal(g.chat(msg('Ace','!fire')).counted,false,'nothing to shoot while the drive spools');
  run(10000);o=g.overlay().run;assert.deepEqual(o.pirate,{hp:12,max:12},'three hits per crew member');
  const firing=pace(g,now,'!fire',6000);for(let i=0;i<500&&g.run.phase==='haul';i++)run(100,firing);o=g.overlay().run;
  assert.equal(o.phase,'sell');assert.ok(g.run.killedAt>0);assert.ok(o.lost>0&&o.lost<40,'some cargo shot loose: '+o.lost);assert.equal(o.need,2,'half the crew must agree');
  run(3000);assert.equal(g.chat(msg('Ace','!sell')).counted,true);assert.equal(g.chat(msg('Ace','!sell')).counted,false,'one vote each');assert.equal(g.overlay().run.soldAt,0);
  g.chat(msg('Nova','!sell','youtube'));run(200);o=g.overlay().run;assert.ok(o.soldAt>0);const price=o.price;assert.ok(price>=.55&&price<=1.45);
  run(5000);o=g.overlay().run;assert.equal(o.phase,'result');const r=o.result;assert.equal(r.score,Math.round(r.cargo*price));assert.equal(r.crew,5,'Ace Nova Zed Kit + Nova on YouTube');assert.equal(r.pirate,'destroyed');
  assert.equal(grants.length,1);assert.equal(grants[0].id,'prospect-'+o.id);assert.equal(grants[0].grants.length,5);assert.ok(grants[0].grants.every(x=>x.tickets===r.tickets&&x.key&&x.name));
  assert.equal(r.tickets,{gold:8,silver:5,bronze:3}[r.grade]);
  assert.equal(results[0].crewList.find(c=>c.name==='Ace').mine>0,true);assert.equal(results[0].crewList.find(c=>c.name==='Kit').sell,false);
  assert.ok(said[0].startsWith('⛏ PROSPECT RUN!'));assert.ok(said.some(t=>/INTERDICTED/.test(t)));assert.ok(said.some(t=>/PROSPECT RUN OVER: (GOLD|SILVER|BRONZE) HAUL/.test(t)));assert.ok(said.length<=7,'chat is not flooded: '+said.length);
  run(20000);assert.equal(g.overlay().run,null);assert.equal(g.view().stats.runs,1);assert.equal(g.view().history[0].score,r.score);
});

test('spamming overcharges the laser and loses ore; six seconds between counted commands',async()=>{
  const {g,run,now}=await make();g.start();run(20000);
  assert.equal(g.chat(msg('Ace','!mine')).counted,true);const again=g.chat(msg('Ace','!mine'));assert.equal(again.counted,false);assert.ok(again.wait>5000);
  // twelve people hammering it as fast as it counts
  const many=Array.from({length:12},(_,i)=>'P'+i);run(60000,pace(g,now,'!mine',6000,many));
  const o=g.overlay().run;assert.equal(o.over,true);assert.ok(o.ore<200,'ore lost to overcharge: '+o.ore);
});

test('nobody mines: no ore, the run ends as cargo lost with the consolation ticket; a silent sell phase sells at the closing price',async()=>{
  const a=await make();a.g.start();a.g.chat(msg('Ace','!fire'));a.run(20000);a.run(60000);
  let o=a.g.overlay().run;assert.equal(o.phase,'result');assert.equal(o.result.grade,'fail');assert.equal(a.grants[0].grants[0].tickets,1);assert.ok(a.said.some(t=>/CARGO LOST/.test(t)));
  const b=await make();b.g.start();b.run(20000);const mining=pace(b.g,b.now,'!mine',20000);while(b.g.run.phase==='mine')b.run(100,mining);while(b.g.run.phase==='haul')b.run(100);
  o=b.g.overlay().run;assert.equal(o.phase,'sell');assert.equal(b.g.run.killedAt,0,'nobody fired');assert.ok(o.lost>=Math.round(o.ore*.3),'the pirate took its share: '+o.lost);
  b.run(30000);b.run(5000);o=b.g.overlay().run;assert.equal(o.phase,'result');assert.equal(o.result.pirate,'escaped');assert.equal(o.result.price,priceAt(1,.25));
});

test('practice runs pay nothing and are not counted; cooldown, stop and settings',async()=>{
  const {g,grants,results,run,at}=await make({cooldownSeconds:120});
  g.start({practice:true});g.chat(msg('Ace','!mine'));run(20000);run(60000);run(20000);assert.equal(grants.length,0);assert.equal(results.length,0);assert.equal(g.view().stats.runs,0);
  assert.throws(()=>g.start(),/Cooling down: 120 seconds/);at(120000);g.start();assert.equal(g.view().running,true);g.stop();assert.equal(g.view().running,false);g.start();g.stop();
  g.configure({enabled:false});assert.throws(()=>g.start(),/Turn Prospect Run on/);
  assert.throws(()=>normalizeProspectSettings({ticketsGold:101}),/Tickets for Gold must be 0 to 100/);assert.throws(()=>normalizeProspectSettings({scoreSilver:300}),/Silver score must be lower/);
  assert.equal(normalizeProspectSettings({mineSeconds:45}).mineSeconds,45);
});

test('the price stays between ×0.55 and ×1.45 and settings survive a restart',async()=>{
  for(let i=0;i<=100;i++){const p=priceAt(i/100,.37);assert.ok(p>=.55&&p<=1.45);}
  const {g,dir}=await make({ticketsGold:10});await g.persist();const again=await new ProspectRun({dataDir:dir}).load();assert.equal(again.settings.ticketsGold,10);
  assert.equal(RULES.pace,6000);
});

test('the website feed carries a run only while it is on and the stream is live: phase and numbers, no names',async()=>{
  const {projectCompanion}=await import('../../public-feed-model.mjs');
  const {g,run}=await make();g.start();g.chat(msg('Ace','!mine'));run(20000);
  const out=projectCompanion({prospect:g.share()},{},true).prospect;assert.deepEqual(Object.keys(out).sort(),['cargo','crew','ore','phase','phaseEndsAt','practice','price','result']);assert.equal(out.phase,'mine');assert.equal(out.crew,1);assert.equal(out.result,null);
  assert.doesNotMatch(JSON.stringify(out),/Ace|id-Ace/);
  assert.equal(projectCompanion({prospect:g.share()},{},false).prospect,undefined,'not while offline');assert.equal(projectCompanion({prospect:g.share()},{sections:{live:false}},true).prospect,undefined);
  assert.equal(projectCompanion({prospect:null},{},true).prospect,undefined);g.stop();assert.equal(g.share(),null);
  const bad=projectCompanion({prospect:{phase:'<x>',crew:-4,price:'99',result:{grade:'x',title:'<b>T</b>',tickets:5000}}},{},true).prospect;assert.equal(bad.phase,'contract');assert.equal(bad.crew,0);assert.equal(bad.price,0);assert.equal(bad.result.grade,'fail');assert.equal(bad.result.tickets,100,'capped');
});
