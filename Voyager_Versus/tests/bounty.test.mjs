import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {BountyHunt,normalizeBountySettings,RULES,TARGETS} from '../local/bounty.mjs';

async function make(settings={}){const dir=await mkdtemp(join(tmpdir(),'voyager-bounty-'));let now=1e12;const said=[],grants=[],results=[];
  const g=await new BountyHunt({dataDir:dir,now:()=>now,random:()=>0,say:t=>said.push(t),onTickets:x=>grants.push(x),onResult:x=>results.push(x)}).load();g.configure({cooldownSeconds:0,...settings});
  const run=ms=>{const end=now+ms;while(now<end&&g.hunt){now+=100;g.tick();}},skip=ms=>{now+=ms;};
  return {g,said,grants,results,run,skip,now:()=>now};}
const msg=(name,text='!track',platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});
const cheer=(name,amount)=>({kind:'bits',platform:'twitch',userId:'id-'+name,login:name.toLowerCase(),name,amount});
const gift=(name,amount,extra={})=>({kind:'gift',platform:'twitch',userId:'id-'+name,login:name.toLowerCase(),name,amount,...extra});

test('a hunt: lobby, tracking once every 8 seconds closes the ring, capture pays every hunter and the MVP a little more',async()=>{
  const {g,said,grants,results,run,skip}=await make();
  assert.equal(g.chat(msg('Early')),null,'nothing happens with no hunt');
  g.start();assert.equal(g.hunt.phase,'lobby');assert.equal(g.hunt.target,TARGETS[0]);assert.match(said[0],/BOUNTY POSTED.*!track/);
  assert.deepEqual(g.chat(msg('Ada')),{ok:true,joined:true,counted:false});g.chat(msg('Bo','!hunt'));g.chat(msg('Cy','!TRACK now'));
  assert.equal(g.overlay().hunt.hunters,3);assert.equal(g.overlay().hunt.fix,0);
  run(30000);assert.equal(g.hunt.phase,'hunt');assert.match(said[1],/THE HUNT IS ON/);
  assert.equal(g.goal(),RULES.base+RULES.perHunter*3);
  assert.equal(g.chat(msg('Ada')).counted,true);assert.equal(g.chat(msg('Ada')).counted,false,'one count every 8 seconds');
  // Ada tracks every time, Bo every other time, Cy once.
  g.chat(msg('Cy'));let rounds=0;
  while(g.hunt.phase==='hunt'&&rounds<60){skip(RULES.pace);g.chat(msg('Ada'));if(g.hunt.phase==='hunt'&&rounds%2===0)g.chat(msg('Bo'));rounds++;}
  assert.equal(g.hunt.phase,'result');const r=g.hunt.result;assert.equal(r.outcome,'captured');assert.equal(r.hunters,3);assert.equal(r.fix,100);
  assert.equal(r.mvp.name,'Ada');assert.equal(r.tickets,5);assert.equal(r.mvpTickets,2);
  assert.equal(grants.length,1);assert.match(grants[0].id,/^bounty-/);
  assert.deepEqual(grants[0].grants.map(x=>[x.name,x.tickets]).sort(),[['Ada',7],['Bo',5],['Cy',5]]);
  assert.equal(results[0].crewList.find(x=>x.name==='Ada').mvp,true);assert.match(said.at(-1),/BOUNTY CLAIMED.*MVP: Ada/);
  run(RULES.result+200);assert.equal(g.hunt,null);assert.equal(g.stats.captured,1);assert.equal(g.history[0].outcome,'captured');
});

test('cheers and gifted subs help the crew but cannot land the final fix, earn tickets or (by default) win MVP',async()=>{
  const {g,grants,run,skip}=await make();g.start();run(30000);
  assert.equal(g.support(cheer('Whale',50)).ignored,true,'under 100 bits does nothing');
  g.chat(msg('Free'));assert.equal(g.support(cheer('Whale',100000)).units,RULES.bitsCap,'capped per cheer');
  for(let i=0;i<20;i++)g.support(cheer('Whale',5000));
  assert.equal(g.hunt.phase,'hunt','a cheer never completes the hunt');assert.ok(g.hunt.fix<1&&g.hunt.fix>.9);
  assert.equal(g.support(gift('Gifter',3)).wingmen,3);assert.equal(g.overlay().hunt.wingmen,3);
  assert.equal(g.support(gift('Gifter',2,{receipts:['a','b']})).wingmen,2);assert.equal(g.support(gift('Gifter',2,{receipts:['a','b']})).ignored,true,'the same Kick gifts count once');
  run(RULES.wingEvery*3);assert.equal(g.hunt.phase,'hunt','wingmen never complete it either');
  skip(RULES.pace);assert.equal(g.chat(msg('Free')).captured,true);
  const r=g.hunt.result;assert.equal(r.mvp.name,'Free');assert.equal(r.finalFix,'Free');assert.equal(r.hunters,1,'only people who tracked are hunters');
  assert.deepEqual(grants[0].grants.map(x=>[x.name,x.tickets]),[['Free',7]]);
  assert.deepEqual(g.overlay().hunt.leaders.map(x=>x.name)[0],'Free');
});

test('time runs out: the target jumps and nothing is paid; practice hunts and the off switch pay nothing either',async()=>{
  const {g,said,grants,results,run}=await make({huntSeconds:60});g.start();g.chat(msg('Ada'));run(30000);g.chat(msg('Ada'));run(61000);
  assert.equal(g.hunt.result.outcome,'escaped');assert.equal(grants.length,0);assert.equal(results.length,1);assert.match(said.at(-1),/jumped away/);run(RULES.result+200);
  g.start();run(30000+61000);assert.equal(g.hunt.result.outcome,'empty');run(RULES.result+200);
  g.configure({huntSeconds:240});g.start({practice:true});run(30000);g.chat(msg('Ada'));for(let i=0;i<30&&g.hunt.phase==='hunt';i++){run(RULES.pace);g.chat(msg('Ada'));}
  assert.equal(g.hunt.result.outcome,'captured');assert.equal(g.hunt.result.tickets,0);assert.equal(grants.length,0);assert.equal(results.length,2,'practice is not counted');run(RULES.result+200);
  g.start();g.configure({enabled:false});assert.equal(g.hunt,null);assert.throws(()=>g.start(),/Turn Bounty Hunt on/);assert.deepEqual(g.overlay().hunt,null);assert.equal(g.share(),null);
});

test('settings are checked; the cooldown holds; with mvpFreeOnly off paid help counts toward MVP; the website share has no ticket counts per person',async()=>{
  assert.throws(()=>normalizeBountySettings({huntSeconds:5}),/Hunt seconds must be 60 to 600/);assert.equal(normalizeBountySettings({}).mvpFreeOnly,true);
  const {g,run,skip}=await make({mvpFreeOnly:false,cooldownSeconds:120});g.start();run(30000);
  g.chat(msg('Payer'));g.chat(msg('Free'));g.support(cheer('Payer',600));skip(RULES.pace);g.chat(msg('Free'));
  const sh=g.share();assert.equal(sh.phase,'hunt');assert.equal(sh.hunters,2);assert.ok(sh.fix>0);
  while(g.hunt.phase==='hunt'){skip(RULES.pace);g.chat(msg('Free'));}
  assert.equal(g.hunt.result.mvp.name,'Payer');assert.deepEqual(Object.keys(g.share().result).sort(),['hunters','mvp','mvpTickets','outcome','tickets']);
  run(RULES.result+200);assert.throws(()=>g.start(),/Cooling down/);
});
