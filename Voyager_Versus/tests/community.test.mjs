import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Community,weekStart,normalizeMissions,normalizeGoals,DEFAULT_MISSIONS} from '../local/community.mjs';

const DAY=86400000;
async function make(start){
  let now=start;const c=await new Community({dataDir:await mkdtemp(join(tmpdir(),'voyager-community-')),now:()=>now}).load();
  let pilots=[];c.setPilots(()=>pilots);
  return {c,set:t=>{now=t;},pilots:p=>{pilots=p;}};
}
const monday=weekStart(new Date(2026,10,2,12).getTime()); // Monday 2 Nov 2026, local time

test('Weekly missions: stream days, points earned and Versus wins, from data Voyager already has',async()=>{
  const {c,set,pilots}=await make(monday+10*3600000);
  pilots([{login:'nova',name:'Nova',wins:4}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000},{key:'kick:2',name:'Orion',capturedIn:50}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000,vip:true}]);assert.equal(c.state.members['twitch:1'].vip,true,'VIP group flag kept (2.20.28)');
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000,vip:false}]);assert.equal(c.state.members['twitch:1'].vip,undefined,'and dropped when they leave the group');
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000,emerald:true}]);assert.equal(c.state.members['twitch:1'].emerald,true,'Emerald (mods group) flag kept (2.20.29)');
  for(let d=0;d<3;d++){set(monday+d*DAY+20*3600000);c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1100+d*200},{key:'kick:2',name:'Orion',capturedIn:60}]);}
  pilots([{login:'nova',name:'Nova',wins:5}]);
  const v=c.view(),by=Object.fromEntries(v.missions.map(m=>[m.id,m]));
  assert.equal(by.regular.top.find(r=>r.key==='twitch:1').progress,3);assert.equal(by.regular.completed,1);
  assert.equal(by.collector.top.find(r=>r.key==='twitch:1').progress,500,'capped at the goal');assert.equal(by.collector.completed,1);
  assert.equal(by.collector.top.find(r=>r.key==='kick:2').progress,10);
  assert.equal(by.arena.completed,1);assert.equal(by.arena.top[0].key,'twitch:1','Versus pilot matched to the points member by Twitch login');
  assert.equal(c.payables().filter(p=>p.status==='owed').length,3);
});

test('Payouts are recorded once, and last week stays payable after the week rolls over',async()=>{
  const {c,set}=await make(monday+3600000);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:0}]);set(monday+7200000);c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:600}]);
  const owed=c.payables().find(p=>p.missionId==='collector');assert.ok(owed);
  set(monday+8*DAY);c.roll(monday+8*DAY);
  const last=c.payables().find(p=>p.missionId==='collector'&&p.week===monday);assert.equal(last.status,'owed');
  c.recordPayout({week:monday,missionId:'collector',key:'twitch:1',status:'paid'});
  assert.equal(c.recordPayout({week:monday,missionId:'collector',key:'twitch:1',status:'paid'}).already,true);
  assert.equal(c.payables().find(p=>p.missionId==='collector'&&p.week===monday).status,'paid');
  assert.equal(c.view().missions.find(m=>m.id==='collector').completed,0,'new week starts from zero');
});

test('Season standings count points earned since the season began; ending a season fills the Hall of Fame',async()=>{
  const {c,set,pilots}=await make(monday);
  assert.equal(c.standings().length,0,'nothing is counted until a community goal is started');
  pilots([{login:'nova',name:'Nova',wins:10},{login:'rigel',name:'Rigel',wins:2}]);
  c.startSeason({name:'Season 1',endsAt:monday+30*DAY});
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:5000},{key:'youtube:9',name:'Lyra',points:100}]);
  set(monday+DAY);pilots([{login:'nova',name:'Nova',wins:11},{login:'rigel',name:'Rigel',wins:5}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:5300},{key:'youtube:9',name:'Lyra',points:900}]);
  const st=c.standings();assert.deepEqual(st.map(r=>[r.name,r.points]),[['Lyra',800],['Nova',300]]);
  assert.equal(st[1].wins,1);assert.deepEqual(c.topPilot(),{name:'Rigel',wins:3});
  const v=c.endSeason();
  assert.equal(v.season.active,false,'nothing starts by itself');assert.equal(v.hall[0].champion.name,'Lyra');assert.equal(v.hall[0].topPilot.name,'Rigel');
  assert.equal(c.standings().length,0,'idle between community goals');assert.throws(()=>c.endSeason(),/No community goal/);
  assert.equal(c.startSeason({name:'Season 2',endsAt:monday+60*DAY}).season.number,2);
  const pub=c.publicView();assert.equal(pub.hall[0].champion.points,800);assert.equal(JSON.stringify(pub).includes('twitch:1'),false,'no member keys in the public view');
});

test('Mission settings are validated',()=>{
  assert.equal(normalizeMissions(DEFAULT_MISSIONS).length,3);
  assert.throws(()=>normalizeMissions([{title:'X',type:'nope',target:1,reward:1}]),/type/);
  assert.throws(()=>normalizeMissions([{title:'X',type:'streamDays',target:9,reward:1}]),/1 to 7/);
  assert.throws(()=>normalizeMissions([{title:'',type:'earnPoints',target:9,reward:1}]),/name/);
});

test('OBS panel: settings are validated, timed panels hide themselves, and the overlay has no member keys',async()=>{
  const {c,set}=await make(monday);c.startSeason({name:'Season 1',endsAt:monday+30*DAY});
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:10},{key:'twitch:2',name:'Orion',login:'orion',capturedIn:10}]);
  set(monday+60000);c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:500},{key:'twitch:2',name:'Orion',login:'orion',capturedIn:20}]);
  assert.throws(()=>c.setPanel({config:{kind:'nope'}}),/Choose/);
  assert.throws(()=>c.setPanel({config:{kind:'season',width:900}}),/width/);
  const p=c.setPanel({config:{kind:'season',limit:5,duration:30},visible:true});
  assert.equal(p.visible,true);assert.equal(p.expiresAt,monday+60000+30000);
  const o=c.overlay();assert.equal(o.panel.config.kind,'season');assert.equal(o.season.standings[0].name,'Nova');
  assert.equal(JSON.stringify(o).includes('twitch:1'),false);
  set(monday+60000+31000);assert.equal(c.overlay().panel.visible,false,'hides after its duration');
  assert.equal(c.setPanel({visible:false}).visible,false);
});

test('Subscriber missions: subscribe or renew, gift subs and long subscriptions, filtered by platform',async()=>{
  const {c,set}=await make(monday+3600000);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:10},{key:'kick:2',name:'Orion',capturedIn:10},{key:'youtube:3',name:'Lyra',capturedIn:10}]);
  // Before this week: Orion had gifted 4 on Kick; Nova renewed last week.
  c.receiveSupport([{key:'kick:2',name:'Orion',gifts:4,giftsAt:monday-DAY},{key:'twitch:1',name:'Nova',months:6,monthsAt:monday-2*DAY}]);
  set(monday+DAY);
  c.receiveSupport([{key:'kick:2',name:'Orion',gifts:7,giftsAt:monday+DAY},{key:'twitch:1',name:'Nova',months:7,monthsAt:monday+DAY},
    {key:'youtube:3',name:'Lyra',months:1,monthsAt:monday+DAY},{key:'twitch:9',name:'NoPoints',months:1,monthsAt:monday+DAY}]);
  const by=Object.fromEntries(c.view().missions.map(m=>[m.id,m]));
  assert.equal(by.supporter.completed,3,'Nova, Lyra and a subscriber without a points account renewed');
  assert.equal(by.gifter.top[0].key,'kick:2');assert.equal(by.gifter.top[0].progress,3);assert.equal(by.gifter.completed,1);
  assert.equal(by.veteran.completed,1,'only Nova is at 6+ months');
  const owed=c.payables().filter(p=>p.missionId==='supporter');
  assert.equal(owed.find(p=>p.key==='twitch:9').payable,false,'no points account, so it cannot be paid yet');
  c.setMissions([{id:'kick-subs',title:'Kick Crew',type:'subscribe',target:1,reward:50,platform:'kick'},{id:'yt',title:'YT',type:'subscribe',target:1,reward:50,platform:'youtube'}]);
  const v=Object.fromEntries(c.view().missions.map(m=>[m.id,m]));
  assert.equal(v['kick-subs'].completed,0);assert.equal(v.yt.completed,1);
  assert.throws(()=>normalizeMissions([{title:'X',type:'subscribe',target:2,reward:1}]),/\(1\)/);
  assert.throws(()=>normalizeMissions([{title:'X',type:'giftSubs',target:5,reward:1,platform:'myspace'}]),/platform/);
});

test('Someone seen for the first time this week counts as one gift, not their lifetime total',async()=>{
  const {c,set}=await make(monday+3600000);
  set(monday+2*DAY);c.receiveSupport([{key:'twitch:5',name:'Big',gifts:250,giftsAt:monday+2*DAY}]);
  assert.equal(c.view().missions.find(m=>m.id==='gifter').top[0].progress,1);
  c.receiveSupport([{key:'twitch:5',name:'Big',gifts:255,giftsAt:monday+2*DAY+60000}]);
  assert.equal(c.view().missions.find(m=>m.id==='gifter').top[0].progress,3,'capped at the goal (6 gifted this week)');
});

test('Season sub goals pay everyone who helped once reached; the supporter bonus lifts season scores',async()=>{
  const {c,set}=await make(monday);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:0},{key:'kick:2',name:'Orion',capturedIn:0}]);
  c.receiveSupport([{key:'twitch:1',name:'Nova',months:3,monthsAt:monday-DAY},{key:'kick:2',name:'Orion',gifts:0,giftsAt:0,months:1,monthsAt:monday-DAY}]);
  c.startSeason({name:'Christmas 2026',endsAt:monday+50*DAY,goals:[{id:'crew',title:'Grow the Crew',metric:'support',platform:'all',target:5,reward:300},{id:'kick',title:'Kick gifts',metric:'gifts',platform:'kick',target:10,reward:50}],supportBonus:100});
  set(monday+DAY);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:250},{key:'kick:2',name:'Orion',capturedIn:100}]);
  c.receiveSupport([{key:'twitch:1',name:'Nova',months:4,monthsAt:monday+DAY},{key:'kick:2',name:'Orion',months:1,gifts:4,giftsAt:monday+DAY}]);
  let goals=Object.fromEntries(c.view().goals.map(g=>[g.id,g]));
  assert.equal(goals.crew.total,5);assert.equal(goals.crew.reached,true);assert.equal(goals.kick.total,4);assert.equal(goals.kick.reached,false);
  const owed=c.payables().filter(p=>p.scope==='season');
  assert.deepEqual(owed.map(p=>[p.key,p.reward]).sort(),[['kick:2',300],['twitch:1',300]]);
  const st=c.standings();assert.deepEqual(st.map(r=>[r.name,r.score]),[['Orion',500],['Nova',350]],'100 points earned + 4 gifts x 100 beats 250 + 1 renewal x 100');
  const pub=c.publicView();assert.equal(pub.season.goals[0].helpers,2);assert.equal(JSON.stringify(pub).includes('kick:2'),false);
  c.endSeason(monday+2*DAY);
  assert.equal(c.payables().filter(p=>p.scope==='season'&&p.status==='owed').length,2,'reached goals stay payable after the season ends');
  assert.equal(c.view().goals[0].total,0,'idle: nothing counts until the next community goal starts');assert.equal(c.view().goals[0].status,'waiting');
  assert.throws(()=>normalizeGoals([{title:'X',metric:'likes',target:1,reward:1}]),/counts/);
});

test('2.20.48 community goals: started by hand, points and Versus goals, per-goal due dates and minimums, nothing automatic',async()=>{
  const {c,set,pilots}=await make(monday);
  assert.deepEqual(c.view().goals,[]);assert.equal(c.view().season.active,false);
  assert.throws(()=>c.startSeason({name:'',endsAt:monday+DAY}),/name/);assert.throws(()=>c.startSeason({name:'X',endsAt:monday-DAY}),/future/);
  const xmas=new Date(2026,11,25,23,59).getTime();
  const v=c.startSeason({name:'Christmas 2026',endsAt:xmas,goals:[
    {id:'crew',title:'Crew points',metric:'points',target:1000,reward:100,minimum:200,description:'Earn 1,000 points together'},
    {id:'ace',title:'Versus wins',metric:'versus',target:3,reward:50,dueAt:monday+2*DAY},
    {id:'gifts',title:'Gift drive',metric:'gifts',target:5,reward:75}]});
  assert.equal(v.season.active,true);assert.equal(v.season.name,'Christmas 2026');assert.equal(v.season.endsAt,xmas);assert.throws(()=>c.startSeason({name:'Again',endsAt:xmas}),/still running/);
  pilots([{login:'nova',name:'Nova',wins:10}]);c.notePilots();
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:0},{key:'youtube:9',name:'Lyra',points:0}]);
  set(monday+DAY);pilots([{login:'nova',name:'Nova',wins:12}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:900},{key:'youtube:9',name:'Lyra',points:150}]);
  let g=Object.fromEntries(c.view().goals.map(x=>[x.id,x]));
  assert.equal(g.crew.total,1050);assert.equal(g.crew.reached,true);assert.deepEqual(g.crew.helpers.map(h=>h.name),['Nova'],'Lyra is under the 200-point minimum');assert.equal(g.crew.contributors,2);
  assert.equal(g.ace.total,2);assert.equal(g.ace.status,'open');assert.equal(g.ace.dueAt,monday+2*DAY);assert.equal(g.gifts.dueAt,xmas,'goals without their own date are due with the community goal');
  assert.deepEqual(c.payables().filter(p=>p.scope==='season').map(p=>[p.key,p.reward,p.title]),[['twitch:1',100,'Community goal: Crew points']]);
  set(monday+3*DAY);g=Object.fromEntries(c.view().goals.map(x=>[x.id,x]));assert.equal(g.ace.status,'missed');assert.equal(g.ace.missed,true);
  c.roll(monday+3*DAY);assert.equal(c.view().season.active,true,'still running before the due date');
  c.roll(xmas+1);assert.equal(c.view().season.active,false,'ends on its due date and does not restart');assert.equal(c.view().hall[0].name,'Christmas 2026');
  assert.equal(c.view().goalLimit,8);assert.equal(normalizeGoals(Array.from({length:12},(_,i)=>({id:'g'+i,title:'G'+i,metric:'subs',target:1,reward:1}))).length,8);
});

test('2.20.48 migration: an older save gets its goals switched off and no running season',async()=>{
  const {mkdtemp:mk}=await import('node:fs/promises');const {writeFile}=await import('node:fs/promises');
  const dir=await mk(join(tmpdir(),'voyager-community-'));
  await writeFile(join(dir,'community.json'),JSON.stringify({schema:1,missions:[],members:{},support:{},goals:[{id:'crew',title:'Grow the Crew',metric:'support',platform:'all',target:50,reward:250}],supportBonus:100,
    week:{id:monday,baseline:{},days:{},versus:{},gifts:{},medal:{}},previous:null,payouts:{},season:{number:3,name:'Season 3',startedAt:monday-DAY,endsAt:monday+30*DAY,weeks:13,baseline:{},versus:{},support:{}},hall:[]}));
  let now=monday;const c=await new Community({dataDir:dir,now:()=>now}).load();
  assert.deepEqual(c.view().goals,[],'all goals off');assert.equal(c.view().season.active,false,'no season running');assert.equal(c.view().season.number,3);
  assert.equal(c.startSeason({name:'Christmas 2026',endsAt:monday+40*DAY}).season.number,4);
});

test('2.16.1 lowers untouched 2.15 subscriber rewards once, and keeps rewards you changed',async()=>{
  const {writeFile}=await import('node:fs/promises');
  const dir=await mkdtemp(join(tmpdir(),'voyager-community-'));
  const c0=new Community({dataDir:dir,now:()=>monday});const old=c0.fresh();delete old.rewards2161;
  old.missions=old.missions.map(m=>m.id==='supporter'?{...m,reward:500}:m.id==='gifter'?{...m,reward:999}:m.id==='veteran'?{...m,reward:300}:m);
  old.goals=[{id:'crew',title:'Grow the Crew',metric:'support',platform:'all',target:50,reward:300},{id:'gift-fleet',title:'Gift Fleet',metric:'gifts',platform:'all',target:25,reward:200}];
  await writeFile(join(dir,'community.json'),JSON.stringify(old));
  const c=await new Community({dataDir:dir,now:()=>monday}).load(),r=Object.fromEntries([...c.state.missions,...c.state.goals].map(x=>[x.id,x.reward]));
  assert.deepEqual([r.supporter,r.gifter,r.veteran,r.crew,r['gift-fleet']],[50,50,50,250,200],'2.20.21: missions are capped at 50; season goals keep theirs');
});

test('2.20.21 medal missions: weekly progress on medal counters, linked medals, ideas and the 50-point cap',async()=>{
  const {MISSION_MEDALS,MISSION_IDEAS,MISSION_REWARD_MAX,TYPES}=await import('../local/community.mjs');
  assert.equal(MISSION_REWARD_MAX,50);
  assert.throws(()=>normalizeMissions([{title:'Big',type:'earnPoints',target:5,reward:51}]),/0 to 50/);
  for(const i of MISSION_IDEAS){assert.ok(i.reward<=50,i.title);assert.ok(TYPES[i.type],i.type);assert.ok(MISSION_MEDALS[i.type],i.type+' links a medal');}
  assert.doesNotThrow(()=>normalizeMissions(MISSION_IDEAS.slice(0,8)));
  const dir=await mkdtemp(join(tmpdir(),'voyager-community-'));let now=monday+DAY;
  const viewers={'twitch:1':{name:'Nova',platform:'twitch',first:monday-30*DAY,c:{watch:10*3600,msgs:40,fights:1,slayer:0,streak:2}},'kick:2':{name:'Rook',platform:'kick',first:monday+2*3600000,c:{msgs:12}}};
  const c=await new Community({dataDir:dir,now:()=>now}).load();c.setMedals(()=>({state:{viewers}}));
  c.setMissions([{id:'watch',title:'Night Shift',type:'watchHours',target:3,reward:30},{id:'chat',title:'Comms Check',type:'chatMessages',target:25,reward:20},{id:'fight',title:'Boarding Party',type:'dreadFights',target:2,reward:25}]);
  viewers['twitch:3']={name:'Old',platform:'twitch',first:monday-60*DAY,c:{}};
  viewers['twitch:3'].c.msgs=26;
  viewers['twitch:1'].c.watch+=3*3600+5;viewers['twitch:1'].c.msgs+=30;viewers['twitch:1'].c.fights+=2;viewers['kick:2'].c.msgs+=20;
  const p=id=>c.progressFor(c.state.missions.find(m=>m.id===id));
  assert.deepEqual(p('watch').map(r=>[r.name,r.progress,r.done]),[['Nova',3,true]],'only this week counts (10 h before the week ignored)');
  assert.deepEqual(p('chat').map(r=>[r.name,r.progress,r.done]),[['Nova',25,true],['Old',25,true],['Rook',20,false]],'counts from the snapshot (when the mission was added); anyone not in it counts from 0');
  assert.deepEqual(p('fight').map(r=>[r.name,r.done]),[['Nova',true]]);
  assert.equal(c.view().missionMedals.watchHours,'watch');assert.equal(c.publicView().missions[0].medal,'watch');
});

test('contributors panel: the overlay lists who helped each goal and by how much (2.20.62)',async()=>{
  const monday=weekStart(Date.UTC(2026,10,2)),{c,set}=await make(monday);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:10},{key:'kick:2',name:'Orion',capturedIn:10}]);
  c.receiveSupport([{key:'kick:2',name:'Orion',gifts:0,giftsAt:0},{key:'twitch:1',name:'Nova',gifts:0,giftsAt:0}]);
  c.startSeason({name:'Christmas 2026',endsAt:monday+50*DAY,goals:[{id:'gifts',title:'Gift 10 subs',metric:'gifts',platform:'all',target:10,reward:100,minimum:2}]});
  set(monday+DAY);c.receiveSupport([{key:'kick:2',name:'Orion',gifts:3,giftsAt:monday+DAY},{key:'twitch:1',name:'Nova',gifts:1,giftsAt:monday+DAY}]);
  const g=c.overlay().season.goals[0];
  assert.deepEqual(g.people,[{name:'Orion',platform:'kick',count:3}],'below the minimum is not listed');assert.equal(g.contributors,2);assert.equal(g.minimum,2);assert.equal(g.total,4);
  assert.equal(c.publicView().season.goals[0].people,undefined,'the website only gets counts');
  assert.equal(c.setPanel({config:{kind:'helpers',limit:5}}).config.kind,'helpers');
});

test('receive reports points added since the last ledger (2.20.65)',async()=>{
  const monday=weekStart(Date.UTC(2026,10,2)),{c}=await make(monday);const got=[];c.onPoints=l=>got.push(l);
  c.receive([{key:'twitch:1',name:'Nova',capturedIn:100,points:80},{key:'kick:2',name:'Orion',capturedIn:50}]);assert.equal(got.length,0,'the first ledger is a baseline');
  c.receive([{key:'twitch:1',name:'Nova',capturedIn:160,points:140},{key:'kick:2',name:'Orion',capturedIn:50}]);
  assert.equal(got.length,1);assert.deepEqual(got[0],[{key:'twitch:1',name:'Nova',platform:'twitch',amount:60,total:160,balance:140}]);
  c.receive([{key:'twitch:1',name:'Nova',capturedIn:160,points:40}]);assert.equal(got.length,1,'spending is not a gain');
});

test('contributions (2.20.71): a new gifter is credited with the whole last gift, a member first seen during a goal counts all their points, and explain() says why',async()=>{
  const monday=weekStart(Date.UTC(2026,10,2)),{c,set}=await make(monday);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:100}]);c.receiveSupport([{key:'twitch:1',name:'Nova',gifts:2,giftsAt:monday-DAY}]);
  c.startSeason({name:'Christmas 2026',endsAt:monday+50*DAY,goals:[{id:'g',title:'Gift 10 subs',metric:'gifts',platform:'all',target:10,reward:100,minimum:1},{id:'p',title:'5,000 points',metric:'points',platform:'all',target:5000,reward:50,minimum:1}]});
  set(monday+DAY);
  c.receiveSupport([{key:'twitch:1',name:'Nova',gifts:5,giftsAt:monday+DAY},{key:'kick:9',name:'Bomber',gifts:5,giftsAt:monday+DAY,giftsLast:5},{key:'youtube:7',name:'Old',gifts:3,giftsAt:monday+DAY}]);
  const g=c.goalProgress()[0];assert.equal(g.total,3+5+1,'Nova +3, Bomber the whole bomb of 5, Old (no size known) 1');
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:400},{key:'twitch:2',name:'Newbie',login:'newbie',capturedIn:250}]);
  const p=c.goalProgress()[1];assert.equal(p.total,300+250,'the new member counts from zero');
  const e=c.explain('bomber');assert.equal(e.matches.length,1);assert.equal(e.matches[0].support.season.gifts,5);assert.equal(e.matches[0].goals[0].counts,true);assert.equal(e.matches[0].goals[1].counts,false);assert.match(e.matches[0].goals[1].why,/Not in the points ledger/);
  assert.equal(c.explain('nobody').matches.length,0);assert.equal(c.view().feed.supporters,3);assert.ok(c.view().feed.supportAt>0);
});

test('a run that counts from an earlier date credits subs and gifts since then from the tracker\'s per-day counts, and contributors accrue a points multiplier bonus (2.20.74)',async()=>{
  const nov1=Date.UTC(2026,10,1),nov7=Date.UTC(2026,10,7),{c,set}=await make(nov7);set(nov7);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000,points:1000},{key:'twitch:2',name:'Orion',login:'orion',capturedIn:500,points:500}]);
  c.receiveSupport([{key:'twitch:1',name:'Nova',months:12,monthsAt:nov1+2*DAY,gifts:40,giftsAt:nov1+3*DAY,giftsLast:5,giftsByDay:{'2026-10-20':10,'2026-11-02':20,'2026-11-04':5},subsByDay:{'2026-11-03':1}},
    {key:'twitch:2',name:'Orion',months:3,monthsAt:nov1-DAY,gifts:0,giftsAt:0},{key:'kick:3',name:'Lyra',months:1,monthsAt:nov1+DAY,gifts:2,giftsAt:nov1+DAY,giftsLast:2}]);
  c.startSeason({name:'Christmas 2026',startsAt:nov1,endsAt:Date.UTC(2026,11,25),goals:[{id:'subs',title:'1,000 subs',metric:'support',platform:'all',target:1000,reward:0,minimum:1,multiplier:1.5}]});
  assert.equal(c.view().season.startedAt,nov1);assert.equal(c.view().season.openedAt,nov7);
  let g=c.goalProgress()[0];const by=Object.fromEntries(g.helpers.map(h=>[h.name,h.count]));
  assert.equal(by.Nova,25+1,'per-day counts since 1 Nov: 20 + 5 gifts and 1 sub');assert.equal(by.Lyra,1+2,'no per-day log: the latest sub and the whole last gift fell in the window');assert.equal(by.Orion,undefined,'last renewal before 1 Nov');
  assert.equal(g.total,29);assert.equal(by.Nova>0&&g.helpers.find(h=>h.name==='Nova').bonus,0,'no points earned yet');
  set(nov7+DAY);c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1400,points:1400},{key:'twitch:2',name:'Orion',login:'orion',capturedIn:900,points:900}]);
  g=c.goalProgress()[0];assert.equal(g.helpers.find(h=>h.name==='Nova').bonus,200,'400 points earned x 0.5');
  const acc=c.payables().filter(r=>r.status==='accruing');assert.equal(acc.length,1);assert.equal(acc[0].reward,200);assert.equal(acc[0].payable,false);
  c.endSeason();const owed=c.payables().filter(r=>r.missionId==='bonus-subs');assert.equal(owed.length,1);assert.equal(owed[0].status,'owed');assert.equal(owed[0].reward,200);
  assert.throws(()=>c.startSeason({name:'x',startsAt:nov7+2*DAY,endsAt:Date.UTC(2026,11,25)}),/future/);assert.throws(()=>c.startSeason({name:'x',endsAt:Date.UTC(2026,11,25),goals:[{title:'g',metric:'gifts',target:5,reward:0,multiplier:9}]}),/multiplier/);
});

test('imported past subs and gifts credit the run and hand over to automatic counting from the import time (2.20.76)',async()=>{
  const nov1=Date.UTC(2026,10,1),nov7=Date.UTC(2026,10,7),{c,set}=await make(nov7);set(nov7);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:1000}]);c.receiveSupport([{key:'twitch:1',name:'Nova',months:12,monthsAt:nov1-5*DAY,gifts:40,giftsAt:nov1-5*DAY}]);
  c.startSeason({name:'Christmas 2026',startsAt:nov1,endsAt:Date.UTC(2026,11,25),goals:[{id:'s',title:'1,000 subs',metric:'support',platform:'all',target:1000,reward:0}]});
  assert.equal(c.goalProgress()[0].total,0);
  const rows=Community.parseSupportText('2026-11-02,nova,gift,10\n2026-11-03 Nova subscribed\n2026-11-04,Ghost,gift,4\n2026-10-20,nova,gift,99');
  const r=c.importSupport({rows,until:nov7});assert.equal(r.imported,3,'the October row is outside the run');
  let g=c.goalProgress()[0];assert.equal(g.total,15);assert.deepEqual(g.helpers.map(h=>[h.name,h.count,h.key]),[['Nova',11,'twitch:1'],['Ghost',4,'manual:ghost']]);
  assert.equal(c.view().season.manual.viewers,2);
  // after the import, a gift logged by the tracker on 8 Nov adds to the imported credit; the 2 Nov gift in the log is not counted twice
  set(nov7+DAY);c.receiveSupport([{key:'twitch:1',name:'Nova',months:13,monthsAt:nov7+DAY,gifts:55,giftsAt:nov7+DAY,giftsLast:5,giftsByDay:{'2026-11-02':10,'2026-11-08':5},subsByDay:{'2026-11-03':1,'2026-11-08':1}}]);
  g=c.goalProgress()[0];assert.equal(g.helpers.find(h=>h.name==='Nova').count,11+5+1);
  c.clearImport();assert.equal(c.goalProgress()[0].helpers.find(h=>h.name==='Nova').count,15+2,'without the import, the per-day counts since 1 Nov stand on their own');
});
