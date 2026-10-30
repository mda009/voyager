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
  pilots([{login:'nova',name:'Nova',wins:10},{login:'rigel',name:'Rigel',wins:2}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:5000},{key:'youtube:9',name:'Lyra',points:100}]);
  set(monday+DAY);pilots([{login:'nova',name:'Nova',wins:11},{login:'rigel',name:'Rigel',wins:5}]);
  c.receive([{key:'twitch:1',name:'Nova',login:'nova',capturedIn:5300},{key:'youtube:9',name:'Lyra',points:900}]);
  const st=c.standings();assert.deepEqual(st.map(r=>[r.name,r.points]),[['Lyra',800],['Nova',300]]);
  assert.equal(st[1].wins,1);assert.deepEqual(c.topPilot(),{name:'Rigel',wins:3});
  const v=c.endSeason();
  assert.equal(v.season.number,2);assert.equal(v.hall[0].champion.name,'Lyra');assert.equal(v.hall[0].topPilot.name,'Rigel');
  assert.equal(c.standings().length,0,'the new season starts from zero');
  const pub=c.publicView();assert.equal(pub.hall[0].champion.points,800);assert.equal(JSON.stringify(pub).includes('twitch:1'),false,'no member keys in the public view');
});

test('Mission settings are validated',()=>{
  assert.equal(normalizeMissions(DEFAULT_MISSIONS).length,3);
  assert.throws(()=>normalizeMissions([{title:'X',type:'nope',target:1,reward:1}]),/type/);
  assert.throws(()=>normalizeMissions([{title:'X',type:'streamDays',target:9,reward:1}]),/1 to 7/);
  assert.throws(()=>normalizeMissions([{title:'',type:'earnPoints',target:9,reward:1}]),/name/);
});

test('OBS panel: settings are validated, timed panels hide themselves, and the overlay has no member keys',async()=>{
  const {c,set}=await make(monday);
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
  c.setMissions([{id:'kick-subs',title:'Kick Crew',type:'subscribe',target:1,reward:100,platform:'kick'},{id:'yt',title:'YT',type:'subscribe',target:1,reward:100,platform:'youtube'}]);
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
  c.configureSeason({goals:[{id:'crew',title:'Grow the Crew',metric:'support',platform:'all',target:5,reward:300},{id:'kick',title:'Kick gifts',metric:'gifts',platform:'kick',target:10,reward:50}],supportBonus:100});
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
  assert.equal(c.view().goals[0].total,0,'the next season starts from zero');
  assert.throws(()=>normalizeGoals([{title:'X',metric:'likes',target:1,reward:1}]),/counts/);
});
