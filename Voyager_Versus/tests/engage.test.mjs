import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Engage,normalizeEngageSettings} from '../local/engage.mjs';
import {BossFight} from '../local/boss.mjs';
import {Community} from '../local/community.mjs';

async function make(extra={}){
  let now=new Date(2026,10,3,20,0,0).getTime();const said=[];said.to=[];const dir=await mkdtemp(join(tmpdir(),'voyager-engage-'));
  const boss=await new BossFight({dataDir:dir,now:()=>now,random:()=>0.5}).load();
  const e=await new Engage({dataDir:dir,now:()=>now,say:(t,p='')=>{said.push(t);said.to.push(p);},boss:()=>boss,random:()=>0,...extra}).load();
  return {e,boss,said,at:ms=>{now+=ms;},now:()=>now};
}
const msg=(name,text,platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});

test('Comms Relay: plain chat during a fight fires a fleet barrage at the threshold; one message per viewer per few seconds',async()=>{
  const {e,boss,said,at}=await make();
  e.configure({relay:{threshold:5,damagePct:10,perUserSeconds:5}});
  boss.configure({lobbySeconds:10,baseHp:1000,hpPerPilot:0,lateJoinHp:0});boss.call();boss.receive({kind:'join',platform:'twitch',userId:'1',login:'a',name:'A'});at(10000);boss.tick();
  e.chat(msg('A','hello'));e.chat(msg('A','spam'));assert.equal(e.relayView().count,1,'same viewer within 5 s counts once');
  e.chat(msg('A','!fire'));assert.equal(e.relayView().count,1,'commands do not charge it');
  for(const n of ['B','C','D'])e.chat(msg(n,'go fleet',n==='C'?'kick':'twitch'));
  const hp=boss.battle.hp;e.chat(msg('E','charge'));
  assert.equal(boss.battle.hp,hp-100,'10% of the hull');assert.equal(e.relayView().count,0);assert.equal(e.relayView().fired,1);
  assert.match(said.at(-1),/COMMS RELAY at 5! 5 crew/);assert.equal(boss.overlay().effects.at(-1).kind,'relay');
});

test('!report: once a stream, grouped chat line, streaks across streams, and a points reward listed for payment',async()=>{
  const {e,said,at}=await make();
  assert.equal(e.chat(msg('Nova','!report')).ok,true);assert.equal(e.chat(msg('Nova','!report')).already,true);e.chat(msg('Rook','!report','kick'));
  at(21000);e.tick();assert.match(said.at(-2),/Reporting for duty: Nova · \+2 Voyager points each/);assert.equal(said.to.at(-2),'twitch');
  assert.match(said.at(-1),/Reporting for duty: Rook · \+2/);assert.equal(said.to.at(-1),'kick','Kick reports are announced on Kick only');
  at(5*3600000);assert.equal(e.chat(msg('Nova','!report')).streak,2,'next stream in a row');
  const batches=e.rewardBatches();assert.equal(batches.length,2);assert.equal(batches[1].pilots.length,2);assert.equal(batches[0].reward,2);
  assert.throws(()=>normalizeEngageSettings({report:{reward:3}}),/0 to 2/);assert.equal(normalizeEngageSettings({report:{reward:2}}).report.reward,2);
});

test('Bridge Quiz: first correct answer wins, answers are forgiving, time runs out with no winner',async()=>{
  const {e,said,at}=await make();
  e.setBank([{q:'Which planet has the Great Red Spot?',a:['Jupiter']},{q:'Closest star?',a:'Proxima Centauri|Proxima'}]);
  const q=e.ask(e.state.quiz.bank[0].id);assert.match(said.at(-1),/BRIDGE QUIZ: Which planet/);assert.equal(said.to.at(-1),'','the quiz is for everyone: all platforms');assert.throws(()=>e.ask(),/already running/);
  e.chat(msg('Rook','saturn?'));assert.equal(e.state.quiz.active.winner,null);
  e.chat(msg('Nova','it is JUPITER!!'));assert.equal(e.state.quiz.active.winner.name,'Nova');e.chat(msg('Rook','jupiter'));assert.equal(e.state.quiz.active.winner.name,'Nova');
  assert.equal(e.overlay().quiz?.winner?.name,'Nova','the winner shows on screen');at(9000);assert.ok(e.overlay().quiz,'still showing the winner at 9 s');at(1500);assert.equal(e.overlay().quiz,null,'2.21.6: the question leaves 10 s after a correct answer, not at the end of the clock');
  assert.equal(e.rewardBatches()[0].pilots[0].name,'Nova');assert.equal(e.rewardBatches()[0].reward,5,'2.20.94: 5 points a correct answer');
  e.ask(e.state.quiz.bank[1].id);at(61000);e.tick();assert.match(said.at(-1),/Nobody got it\. The answer was Proxima Centauri/);
  assert.equal(e.overlay().quiz?.answer,'Proxima Centauri');assert.equal(q.reward,5);
});

test('Squadrons: enlist, chat counts per stream up to the cap, missions, damage and Versus wins add up; switching waits 30 days',async()=>{
  const missions=[{key:'twitch:id-Nova'},{key:'twitch:id-Nova'}];let wins=3;
  const {e,said,at}=await make({community:()=>({completions:()=>missions,state:{members:{}}}),pilots:()=>[{login:'nova',wins}]});
  e.configure({squadrons:{chatCap:2}});
  e.chat(msg('Nova','!squadron gold'));assert.match(said.at(-1),/welcome to Gold Wing/);assert.equal(said.to.at(-1),'twitch');e.chat(msg('Rook','!squadron red wing','kick'));assert.equal(said.to.at(-1),'kick','replies go to the viewer\'s platform');
  for(let i=0;i<5;i++)e.chat(msg('Nova','hi '+i));
  e.observePilots();wins=5;e.observePilots();
  e.observeBoss({pilots:[{key:'twitch:id-Nova',damage:300},{key:'kick:id-Rook',damage:45},{key:'twitch:id-Zed',damage:999}]});
  const st=Object.fromEntries(e.standings().map(x=>[x.id,x]));
  assert.equal(st.gold.score,2*1+2*25+30+2*50,'2 chats (cap) + 2 missions + 300/10 damage + 2 Versus wins');assert.equal(st.red.score,4);assert.equal(st.blue.crew,0);
  assert.equal(e.standings()[0].id,'gold');
  e.chat(msg('Nova','!squadron blue'));assert.match(said.at(-1),/once every 30 days/);
  at(31*86400000);e.chat(msg('Nova','!squadron blue'));assert.match(said.at(-1),/welcome to Blue Wing/);
  assert.equal(e.state.squadrons.history[0].winner,'gold','the old week is archived');
});

test('Arrival cards: first chat each stream for Silver and up, or after a promotion; Captain\'s Log limits and moderation',async()=>{
  const members={'twitch:id-Nova':{tier:'gold',value:52000},'twitch:id-Bob':{tier:'blue',value:4000}};let rank=0;
  const cards={state:{settings:{ranks:true},members:{}},board:()=>({place:new Map()}),rankOf:v=>v>=40000?3:rank};
  const {e,at}=await make({cards:()=>cards,community:()=>({state:{members},completions:()=>[]})});
  e.chat(msg('Nova','evening'));e.chat(msg('Nova','again'));e.chat(msg('Bob','hi'));
  let t=e.overlay().toasts.filter(x=>x.kind==='arrival');assert.deepEqual(t.map(x=>[x.name,x.tier,x.rankName]),[['Nova','gold','Lieutenant']],'blue members only arrive after a promotion');
  at(5*3600000);rank=1;e.chat(msg('Bob','back'));t=e.overlay().toasts.filter(x=>x.kind==='arrival');assert.equal(t.at(-1).name,'Bob');assert.equal(t.at(-1).promoted,true);
  assert.equal(e.chat(msg('Nova','!log that torpedo was massive')).ok,true);assert.equal(e.chat(msg('Nova','!log another one')).cooldown,true);
  assert.equal(e.chat(msg('Rook','!log see https://spam.example')).link,true);
  const id=e.state.log[0].id;e.moderateLog(id,{pinned:true});assert.equal(e.publicView().log.entries[0].text,'that torpedo was massive');
  e.moderateLog(id,{hidden:true});assert.equal(e.publicView().log,null);
});

test('Muster and quiz rewards appear in Missions › Points owed',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-engage-c-'));const c=await new Community({dataDir:dir}).load();
  const {e}=await make();c.setEngage(()=>e.rewardBatches());c.state.members['twitch:id-Nova']={name:'Nova',login:'nova',platform:'twitch',value:10};
  e.chat(msg('Nova','!report'));
  const rows=c.payables().filter(r=>r.scope==='engage');assert.equal(rows.length,1);assert.equal(rows[0].reward,2);assert.equal(rows[0].payable,true);assert.equal(rows[0].label,'Muster');
  c.recordPayout({week:rows[0].week,missionId:rows[0].missionId,key:rows[0].key,status:'paid'});assert.equal(c.payables().find(r=>r.scope==='engage').status,'paid');
});

test('!report: accounts are per platform, and a saved reward above the 2-point cap is brought down on load',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-engage-cap-'));
  const {writeFile}=await import('node:fs/promises');
  await writeFile(join(dir,'engage.json'),JSON.stringify({schema:1,settings:{report:{enabled:true,reward:5},quiz:{reward:40}}}));
  const e=await new Engage({dataDir:dir,say:()=>{},boss:()=>null}).load();
  assert.equal(e.state.settings.report.reward,2,'5 becomes 2');assert.equal(e.state.settings.quiz.reward,40,'other settings survive (a hand-set quiz reward is kept by the 2.20.94 bank migration)');
  // The same person on Twitch and Kick is two accounts: two musters, 2 points each.
  assert.equal(e.chat(msg('Nova','!report','twitch')).ok,true);assert.equal(e.chat(msg('Nova','!report','kick')).ok,true);assert.equal(e.chat(msg('Nova','!report','twitch')).already,true);
  assert.deepEqual(e.rewardBatches()[0].pilots.map(p=>p.key),['twitch:id-Nova','kick:id-Nova']);assert.equal(e.rewardBatches()[0].reward,2);
});

test('Reset for a new stream (2.20.35): everyone can !report again; owed rewards stay',async()=>{
  const {e}=await make();
  assert.equal(e.chat(msg('Nova','!report')).ok,true);assert.equal(e.chat(msg('Nova','!report')).already,true);
  const owed=e.rewardBatches().length;e.newStream();
  assert.equal(e.chat(msg('Nova','!report')).ok,true,'reports again after the reset');assert.equal(e.rewardBatches().length,owed+1,'the earlier muster is still owed');
});

test('2.21.13 quiz bank 3: the harder Star Citizen & general knowledge set replaces the 2.20.22 and 2.20.94 starters, keeps the streamer\'s own questions and sets a 25-point default reward to 5',async()=>{
  const {mkdtemp,writeFile}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
  const dir=await mkdtemp(join(tmpdir(),'voyager-quiz-'));
  await writeFile(join(dir,'engage.json'),JSON.stringify({schema:1,settings:{quiz:{reward:25}},quiz:{bank:[{id:'a1',q:'Which planet has the Great Red Spot?',a:['jupiter']},{id:'a2',q:'What chat command shows your Voyager membership card?',a:['!voyager']},{id:'a3',q:'Which studio develops Star Citizen?',a:['cig']},{id:'m1',q:'What is my cat called?',a:['nova']}],active:null,history:[],lastAutoAt:0}}));
  const e=await new Engage({dataDir:dir,now:()=>1000,say:()=>{}}).load();
  const qs=e.state.quiz.bank.map(x=>x.q);
  assert.ok(qs.includes('What does CIG call its fork of CryEngine that runs Star Citizen?'),'new set loaded');assert.ok(!qs.includes('Which studio develops Star Citizen?'),'2.20.94 starter replaced');assert.ok(qs.includes('What is my cat called?'),'own question kept');
  assert.ok(!qs.includes('What chat command shows your Voyager membership card?'),'old Voyager-command starter replaced');
  assert.ok(!qs.includes('Which planet has the Great Red Spot?'),'2.20.22 starter replaced');assert.equal(new Set(qs).size,qs.length,'no duplicates');
  assert.equal(e.state.settings.quiz.reward,5);assert.equal(e.state.quiz.bankVersion,3);
  assert.ok(e.state.quiz.bank.length>=120);
  e.loadStarters();assert.ok(!e.state.quiz.bank.some(x=>x.q==='What is my cat called?'),'reload replaces everything');
});

test('2.21.4: a saved quiz reward of 10 (the old manual figure) becomes 5 once; a hand-set 40 is kept',async()=>{
  const {mkdtemp,writeFile}=await import('node:fs/promises'),{tmpdir}=await import('node:os'),{join}=await import('node:path');
  const dir=await mkdtemp(join(tmpdir(),'voyager-quiz5-'));
  await writeFile(join(dir,'engage.json'),JSON.stringify({schema:1,settings:{quiz:{reward:10}},quiz:{bank:[],bankVersion:2}}));
  const e=await new Engage({dataDir:dir,now:()=>1000,say:()=>{}}).load();
  assert.equal(e.state.settings.quiz.reward,5);assert.equal(e.state.quizReward5,true);
  e.configure({quiz:{reward:40}});await e.persist(true);
  const again=await new Engage({dataDir:dir,now:()=>2000,say:()=>{}}).load();assert.equal(again.state.settings.quiz.reward,40,'only once');
});

test('2.21.5: every chat line Voyager tries to post is remembered with whether Streamer.bot took it',async()=>{
  const {mkdtemp}=await import('node:fs/promises'),{tmpdir}=await import('node:os'),{join}=await import('node:path');
  let fail=false;const e=await new Engage({dataDir:await mkdtemp(join(tmpdir(),'voyager-out-')),now:()=>5000,say:async()=>fail?{ok:false,message:'"Voyager - Medals" is not in Streamer.bot'}:{ok:true,message:'sent to Streamer.bot'}}).load();
  e.chat({platform:'twitch',userId:'1',login:'nova',name:'Nova',text:'!report'});e.now=()=>12000;e.tick();await new Promise(r=>setTimeout(r,5));
  let v=e.view();assert.equal(v.chatOut.length,1);
  e.chat({platform:'twitch',userId:'1',login:'nova',name:'Nova',text:'!report'});e.chat({platform:'twitch',userId:'1',login:'nova',name:'Nova',text:'!report'});await new Promise(r=>setTimeout(r,5));
  v=e.view();assert.equal(v.chatOut.length,2,'a repeat !report is answered once');assert.match(v.chatOut[0].text,/already reported for duty/);
  assert.equal(v.chatOut[1].ok,true);assert.match(v.chatOut[1].text,/Reporting for duty: Nova/);assert.equal(v.chatOut[1].platform,'twitch');
  fail=true;e.chat({platform:'youtube',userId:'UC1',login:'',name:'Tube',text:'!report'});e.now=()=>20000;e.tick();await new Promise(r=>setTimeout(r,5));
  v=e.view();assert.equal(v.chatOut[0].ok,false);assert.match(v.chatOut[0].message,/not in Streamer.bot/);assert.equal(v.chatOut[0].platform,'youtube');
});
