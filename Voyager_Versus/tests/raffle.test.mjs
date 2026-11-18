import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Raffle,normalizeRaffleSettings,TIMING} from '../local/raffle.mjs';

async function make(settings={},picks=null){const dir=await mkdtemp(join(tmpdir(),'voyager-raffle-'));let now=1e12,i=0;const said=[],grants=[];
  const pick=picks?n=>picks[i++%picks.length]%n:n=>(i++*7919+13)%n;
  const g=await new Raffle({dataDir:dir,now:()=>now,pick,say:t=>said.push(t),onTickets:x=>grants.push(x)}).load();g.configure(settings);
  const run=ms=>{const end=now+ms;while(now<end){now+=100;g.tick();}};
  return {g,dir,said,grants,run,now:()=>now};}
const msg=(name,text='!raffle',platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});

test('a raffle: ten minutes to join, one random ticket each, entries confirmed in chat, five winners drawn one by one, ten giveaway tickets each',async()=>{
  const {g,said,grants,run,now}=await make();
  assert.equal(g.chat(msg('Early')),null,'no raffle: the command does nothing');
  g.start();assert.throws(()=>g.start(),/already running/);let o=g.overlay().raffle;assert.equal(o.phase,'intro');assert.equal(o.endsAt-o.opensAt,600000);
  const a=g.chat(msg('Ace'));assert.equal(a.ok,true);assert.ok(a.ticket>=1000&&a.ticket<=9999,'entries count during the opening animation too');
  run(TIMING.intro);assert.equal(g.overlay().raffle.phase,'open');
  const names=['Nova','Zed','Kit','Lyra','Orin','Pax','Quill'];for(const n of names)assert.equal(g.chat(msg(n,n==='Zed'?'!joinraffle':'!raffle',n==='Kit'?'youtube':'twitch')).ok,true);
  const again=g.chat(msg('Ace'));assert.deepEqual(again,{ok:true,already:true,ticket:a.ticket},'one ticket each');assert.equal(g.chat(msg('Ace','hello')),null);
  o=g.overlay().raffle;assert.equal(o.count,8);assert.equal(new Set(g.view().entries.map(e=>e.ticket)).size,8,'every number is different');assert.equal(o.recent[0].name,'Quill','newest first');
  run(9000);const conf=said.filter(t=>t.startsWith('🎟 Raffle tickets:'));assert.ok(conf.length>=1&&conf.length<=2,'confirmed in batches');assert.match(conf.join(' '),new RegExp('@Ace #'+a.ticket));assert.match(conf.join(' '),/@Quill #\d{4}/);
  run(300000);assert.ok(said.some(t=>/5 minutes left to join the raffle/.test(t)));run(240000);assert.ok(said.some(t=>/1 minute left/.test(t)));
  assert.equal(g.overlay().raffle.phase,'open');run(51000);o=g.overlay().raffle;assert.equal(o.phase,'drawing');assert.equal(o.total,5);assert.equal(o.winners.length,0);assert.equal(o.drawing.index,0);
  assert.equal(g.chat(msg('Late')),null,'closed');
  const first=o.drawing.name;run(TIMING.reveal);o=g.overlay().raffle;assert.deepEqual(o.winners.map(w=>w.name),[first],'one revealed at a time');assert.equal(o.drawing.index,1);
  assert.equal(grants.length,0,'nothing is granted until every winner has been shown');
  run(TIMING.reveal*4);o=g.overlay().raffle;assert.equal(o.phase,'result');assert.equal(o.winners.length,5);assert.equal(new Set(o.winners.map(w=>w.name)).size,5,'five different winners');
  assert.equal(grants.length,1);assert.equal(grants[0].id,'raffle-'+o.id);assert.deepEqual(grants[0].grants.map(x=>x.tickets),[10,10,10,10,10]);assert.ok(grants[0].grants.every(x=>x.key&&x.name));
  assert.ok(said.some(t=>t.startsWith('🏆 RAFFLE WINNERS:')&&/Each wins 10 giveaway tickets/.test(t)));
  run(TIMING.result);assert.equal(g.overlay().raffle,null);assert.equal(g.overlay().last.winners.length,5);assert.deepEqual([g.view().stats.raffles,g.view().stats.entries,g.view().stats.winners],[1,8,5]);
  assert.doesNotMatch(JSON.stringify(g.overlay()),/id-Ace|twitch:id/,'no account ids on screen');
});

test('fewer entrants than winners, nobody at all, closing early and calling it off',async()=>{
  const a=await make({minutes:2,winners:5,prize:10});a.g.start();a.g.chat(msg('Ace'));a.g.chat(msg('Nova'));a.run(TIMING.intro+1000);
  a.g.closeNow();let o=a.g.overlay().raffle;assert.equal(o.phase,'drawing');assert.equal(o.total,2,'everyone who entered wins when there are fewer than five');
  a.run(TIMING.reveal*2);assert.deepEqual(a.grants[0].grants.map(x=>x.name).sort(),['Ace','Nova']);
  const b=await make({minutes:1});b.g.start();b.run(TIMING.intro+60000);o=b.g.overlay().raffle;assert.equal(o.phase,'result');assert.equal(o.total,0);assert.equal(b.grants.length,0);assert.ok(b.said.some(t=>/closed with no entries/.test(t)));
  b.run(8000);assert.equal(b.g.overlay().raffle,null);
  const c=await make();c.g.start();c.g.chat(msg('Ace'));c.g.cancel();assert.equal(c.g.view().running,false);assert.equal(c.grants.length,0);assert.equal(c.g.view().stats.raffles,0);assert.throws(()=>c.g.closeNow(),/No raffle/);
  c.g.start();c.g.configure({enabled:false});assert.equal(c.g.view().running,false,'switching it off calls it off');assert.throws(()=>c.g.start(),/Turn the raffle on/);
});

test('settings: up to five winners, the prize, confirmations off; the website sees winners only once they are shown',async()=>{
  assert.throws(()=>normalizeRaffleSettings({winners:6}),/Winners must be 1 to 5/);assert.throws(()=>normalizeRaffleSettings({minutes:0}),/Minutes to join must be 1 to 60/);assert.equal(normalizeRaffleSettings({prize:25}).prize,25);
  const {g,said,grants,run,dir}=await make({minutes:1,winners:1,prize:0,confirm:false});g.start();g.chat(msg('Ace'));g.chat(msg('Nova'));run(TIMING.intro+20000);
  assert.equal(said.some(t=>t.startsWith('🎟 Raffle tickets:')),false);assert.deepEqual(Object.keys(g.share()).sort(),['count','endsAt','phase','prize','want','winners']);assert.equal(g.share().count,2);
  run(40000);assert.equal(g.share().phase,'drawing');assert.deepEqual(g.share().winners,[]);run(TIMING.reveal);assert.equal(g.share().winners.length,1);assert.equal(grants.length,0,'a prize of 0 grants nothing');
  await g.persist();const again=await new Raffle({dataDir:dir}).load();assert.equal(again.settings.winners,1);assert.equal(again.history.length,1);
});
