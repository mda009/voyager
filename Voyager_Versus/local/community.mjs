// Voyager community programme (2.13): weekly missions and seasons with a Hall of Fame.
// 2.15: subscriber missions, season sub goals and a supporter bonus (Twitch subs, YouTube memberships, Kick subs).
// Works only from data Voyager already has: points ledger members (sent by the Public website publisher page
// every minute) and Voyager Versus pilot records. It never changes points itself; mission rewards are paid
// from Voyager Control > Missions through the Points Ledger's own audited preview/apply path.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';

const FILE='community.json',DAY=86400000;
export const TYPES={
  streamDays:{label:'Earn points on different stream days',unit:'days'},
  earnPoints:{label:'Earn Voyager points',unit:'points'},
  versusWins:{label:'Win Voyager Versus battles',unit:'wins'},
  // 2.15 subscriber missions. Data: Voyager - Community Tracker (sub/member/gift events), sent by the publisher page.
  subscribe:{label:'Subscribe or renew (sub / membership)',unit:'sub',support:true,max:1},
  giftSubs:{label:'Gift subs or memberships',unit:'gifts',support:true,max:1000},
  loyalSub:{label:'Renew with a long subscription',unit:'months',support:true,max:120},
  // 2.20.21 medal missions: each one counts this week's progress on the same counter a medal uses (Voyager Medals data).
  watchHours:{label:'Watch the stream live',unit:'hours',medal:'watch',counter:'watch',scale:3600,max:40},
  chatMessages:{label:'Chat on stream',unit:'messages',medal:'comms',counter:'msgs',max:2000},
  streamStreak:{label:'Twitch watch streak (as shared in chat)',unit:'streams in a row',medal:'streak',streak:true,max:7},
  dreadFights:{label:'Fight the Dreadnought',unit:'fights',medal:'slayer',counter:'fights',max:20},
  dreadVictory:{label:'Win against the Dreadnought',unit:'victories',medal:'slayer',counter:'slayer',max:20},
  dreadDamage:{label:'Deal Dreadnought damage',unit:'damage',medal:'topgun',counter:'damage',max:100000},
  dreadMvp:{label:'Finish a fight as top damage (MVP)',unit:'MVPs',medal:'topgun',counter:'topgun',max:10},
  torpedo:{label:'Fire a torpedo (gift a sub in a fight)',unit:'torpedoes',medal:'torpedo',counter:'torpedo',max:20,support:false}
};
// Which medal each mission type works toward (shown in Voyager Control, on stream and on the public site).
export const MISSION_MEDALS={streamDays:'regular',earnPoints:'points',versusWins:'versus',subscribe:'subs',giftSubs:'gifter',loyalSub:'substreak',
  ...Object.fromEntries(Object.entries(TYPES).filter(([,t])=>t.medal).map(([k,t])=>[k,t.medal]))};
// 2.20.21: mission rewards are capped at 50 Voyager points (asked for); bigger rewards stay with season goals and the Dreadnought.
export const MISSION_REWARD_MAX=50;
// Ready-made ideas, each tied to a medal. Add them from Voyager Control > Missions.
export const MISSION_IDEAS=[
  {id:'night-shift',title:'Night Shift',type:'watchHours',target:3,reward:30,blurb:'Watch 3 hours live this week.'},
  {id:'comms-check',title:'Comms Check',type:'chatMessages',target:25,reward:20,blurb:'Send 25 chat messages on stream this week.'},
  {id:'hold-the-line',title:'Hold the Line',type:'streamStreak',target:3,reward:40,blurb:'Be at 3 streams in a row.'},
  {id:'boarding-party',title:'Boarding Party',type:'dreadFights',target:2,reward:25,blurb:'Join 2 Dreadnought fights with !join.'},
  {id:'dreadnought-down',title:'Dreadnought Down',type:'dreadVictory',target:1,reward:50,blurb:'Be in the fleet when the Dreadnought is destroyed.'},
  {id:'heavy-hitter',title:'Heavy Hitter',type:'dreadDamage',target:500,reward:40,blurb:'Deal 500 damage to the Dreadnought this week.'},
  {id:'top-gun',title:'Top Gun',type:'dreadMvp',target:1,reward:50,blurb:'Finish a Dreadnought fight as MVP.'},
  {id:'torpedo-run',title:'Torpedo Run',type:'torpedo',target:1,reward:50,blurb:'Gift a sub during a Dreadnought fight.'},
  {id:'arena-rookie',title:'Arena Rookie',type:'versusWins',target:1,reward:40,blurb:'Win a Voyager Versus battle.'},
  {id:'shore-leave-cancelled',title:'Shore Leave Cancelled',type:'streamDays',target:4,reward:35,blurb:'Earn points on 4 different stream days.'},
  {id:'quartermaster',title:'Quartermaster',type:'earnPoints',target:300,reward:25,blurb:'Earn 300 Voyager points this week.'},
  {id:'care-package',title:'Care Package',type:'giftSubs',target:1,reward:50,blurb:'Gift a sub or membership.'},
  {id:'re-enlist',title:'Re-enlist',type:'subscribe',target:1,reward:50,blurb:'Subscribe or renew this week.'}
];
export const PLATFORM_OPTIONS={all:'All platforms',twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
// Season goals (2.15): one shared target for the whole community; everyone who helped is rewarded once it's reached.
// 2.20.48 "Community goals": seasons are now campaigns you start and end yourself (nothing runs on its own), every goal
// has its own points reward and optional due date, and goals can also count Voyager points earned or Versus wins.
export const GOAL_METRICS={support:'Subs, renewals and gifted subs',subs:'Subs and renewals',gifts:'Gifted subs',activeSubs:'Twitch active subscribers (live count)',points:'Voyager points earned by the crew',versus:'Voyager Versus wins'};
export const GOAL_LIMIT=8;
export const DEFAULT_MISSIONS=[
  {id:'regular',title:'Regular Pilot',type:'streamDays',target:3,reward:35,enabled:true},
  {id:'collector',title:'Point Collector',type:'earnPoints',target:500,reward:25,enabled:true},
  {id:'arena',title:'Ace of the Arena',type:'versusWins',target:1,reward:40,enabled:true}
];
export const SUB_MISSIONS=[
  {id:'supporter',title:'Crew Supporter',type:'subscribe',target:1,reward:50,platform:'all',enabled:true},
  {id:'gifter',title:'Fleet Gifter',type:'giftSubs',target:3,reward:50,platform:'all',enabled:true},
  {id:'veteran',title:'Veteran Crew',type:'loyalSub',target:6,reward:40,platform:'all',enabled:true}
];
export const DEFAULT_GOALS=[
  {id:'crew',title:'Grow the Crew',metric:'support',platform:'all',target:50,reward:250},
  {id:'gift-fleet',title:'Gift Fleet',metric:'gifts',platform:'all',target:25,reward:200}
];
export const DEFAULT_SUPPORT_BONUS=100;
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const int=(v,min,max)=>{const n=Number(v);return Number.isSafeInteger(n)&&n>=min&&n<=max?n:null;};
const metric=m=>{const c=Number(m.capturedIn);if(Number.isFinite(c)&&c>=0)return c;const p=Number(m.points);return Number.isFinite(p)&&p>=0?p:null;};
// Weeks start Monday 00:00 in the streaming PC's own time zone.
export function weekStart(now){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime();}
export function dayId(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

// On-stream panel (2.14): same look and placement options as the OBS leaderboard panel.
export const PANEL_KINDS={season:'Community goal standings',goals:'Community goals',bar:'Goal progress bar (compact)',helpers:'Community goal contributors',hall:'Hall of Fame',missions:"This week's missions"};
export const PANEL_DEFAULTS={kind:'season',limit:10,speed:14,width:356,top:132,right:16,opacity:40,duration:0,title:''};
export function normalizePanel(raw){
  const r=raw&&typeof raw==='object'?raw:{},c={};
  if(!Object.hasOwn(PANEL_KINDS,r.kind??PANEL_DEFAULTS.kind))throw new Error('Choose what the panel shows.');c.kind=r.kind??PANEL_DEFAULTS.kind;
  for(const [k,[min,max]] of Object.entries({limit:[3,10],speed:[0,40],width:[320,480],top:[0,600],right:[0,1440],opacity:[0,95],duration:[0,600]})){
    const v=r[k]===undefined?PANEL_DEFAULTS[k]:Number(r[k]);if(!Number.isInteger(v)||v<min||v>max)throw new Error(k+' must be a whole number between '+min+' and '+max+'.');c[k]=v;}
  if(c.right+c.width>1920)throw new Error('The panel must fit inside the canvas.');
  const t=typeof r.title==='string'?r.title.trim():'';if(t.length>80||/[\u0000-\u001f\u007f]/.test(t))throw new Error('Panel title must be a single line of up to 80 characters.');c.title=t;
  return c;
}

export function normalizeMissions(raw){
  const out=[],seen=new Set();
  for(const m of Array.isArray(raw)?raw.slice(0,8):[]){
    const id=clean(m?.id,24).toLowerCase().replace(/[^a-z0-9-]/g,'')||'m'+out.length;if(seen.has(id))continue;seen.add(id);
    const type=Object.hasOwn(TYPES,m?.type)?m.type:null;if(!type)throw new Error('Unknown mission type.');
    const title=clean(m.title,40);if(!title)throw new Error('Every mission needs a name.');
    const max=type==='earnPoints'?1e7:TYPES[type].max||7;
    const target=int(m.target,1,max);if(target===null)throw new Error(title+': the goal must be a whole number'+(type==='earnPoints'?'.':max===1?' (1).':' from 1 to '+max+'.'));
    const reward=int(m.reward,0,MISSION_REWARD_MAX);if(reward===null)throw new Error(title+': the reward must be 0 to '+MISSION_REWARD_MAX+' points (missions are capped at '+MISSION_REWARD_MAX+').');
    const platform=Object.hasOwn(PLATFORM_OPTIONS,m.platform??'all')?(m.platform??'all'):null;if(!platform)throw new Error(title+': unknown platform.');
    out.push({id,title,type,target,reward,platform,enabled:m.enabled!==false});
  }
  return out;
}

export function normalizeGoals(raw){
  const out=[],seen=new Set();
  for(const g of Array.isArray(raw)?raw.slice(0,GOAL_LIMIT):[]){
    const id=clean(g?.id,24).toLowerCase().replace(/[^a-z0-9-]/g,'')||'g'+out.length;if(seen.has(id))continue;seen.add(id);
    const title=clean(g.title,40);if(!title)throw new Error('Every community goal needs a name.');
    const metric=Object.hasOwn(GOAL_METRICS,g.metric)?g.metric:null;if(!metric)throw new Error(title+': choose what the goal counts.');
    const platform=Object.hasOwn(PLATFORM_OPTIONS,g.platform??'all')?(g.platform??'all'):null;if(!platform)throw new Error(title+': unknown platform.');
    const target=int(g.target,1,metric==='points'?1e9:100000);if(target===null)throw new Error(title+': the target must be 1 to '+(metric==='points'?'1,000,000,000':'100,000')+'.');
    const reward=int(g.reward,0,1e6);if(reward===null)throw new Error(title+': the reward must be 0 to 1,000,000 points.');
    const minimum=g.minimum===undefined||g.minimum===null||g.minimum===''?1:int(g.minimum,1,1e9);if(minimum===null)throw new Error(title+': the minimum contribution must be at least 1.');
    let dueAt=0;if(g.dueAt!==undefined&&g.dueAt!==null&&g.dueAt!==''){dueAt=Number(g.dueAt);if(!Number.isFinite(dueAt)||dueAt<0)throw new Error(title+': the due date is not valid.');dueAt=Math.round(dueAt);}
    // 2.20.74: contributors earn their Voyager points times this during the run (1 = no bonus, 1.5 = half as much again), paid when it ends.
    let multiplier=1;if(g.multiplier!==undefined&&g.multiplier!==null&&g.multiplier!==''){multiplier=Math.round(Number(g.multiplier)*100)/100;if(!Number.isFinite(multiplier)||multiplier<1||multiplier>5)throw new Error(title+': the points multiplier must be between 1 and 5.');}
    out.push({id,title,metric,platform,target,reward,minimum,dueAt,description:clean(g.description,120),multiplier});
  }
  return out;
}
const onPlatform=(want,platform)=>!want||want==='all'||want===platform;

export class Community{
  constructor({dataDir,now=Date.now}){this.dataDir=dataDir;this.now=now;this.state=this.fresh();this.saving=Promise.resolve();this.pilots=()=>[];this.boss=()=>[];this.onPoints=()=>{};}
  fresh(){
    const now=this.now();
    return {schema:1,missions:normalizeMissions([...DEFAULT_MISSIONS,...SUB_MISSIONS]),subSeeded:true,rewards2161:true,members:{},support:{},supportAt:0,
      goals:[],goalsOff2048:true,supportBonus:DEFAULT_SUPPORT_BONUS,previousSeason:null,
      week:{id:weekStart(now),baseline:{},days:{},versus:{},gifts:{},medal:{}},previous:null,payouts:{},
      season:this.idleSeason(0),hall:[],panel:{config:{...PANEL_DEFAULTS},visible:false,expiresAt:0,revision:0}};
  }
  // 2.20.48: between campaigns the "season" is idle. Nothing is counted and nothing starts by itself.
  idleSeason(number){return {number,name:'',startedAt:0,endsAt:0,weeks:0,active:false,baseline:{},versus:{},support:{}};}
  newSeason(now,number,weeks){return {number,name:'Season '+number,startedAt:now,endsAt:now+weeks*7*DAY,weeks,active:true,baseline:{},versus:{},support:{}};}
  async load(){
    try{
      const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));
      if(raw?.schema===1){
        const s=this.state={...this.fresh(),...raw};s.missions=normalizeMissions((Array.isArray(raw.missions)?raw.missions:[]).map(m=>m&&typeof m==='object'?{...m,reward:Math.min(MISSION_REWARD_MAX,Math.max(0,Math.round(Number(m.reward)||0)))}:m));
        // 2.15: add the subscriber missions once to an existing programme (room permitting; they can be switched off).
        if(!raw.subSeeded){for(const m of SUB_MISSIONS)if(s.missions.length<8&&!s.missions.some(x=>x.id===m.id||x.type===m.type))s.missions.push({...m});s.subSeeded=true;}
        // 2.21.7: a goal called "Sub Goal" that counted sub events now tracks Twitch's live subscriber count (asked for 9 Nov 2026). Once.
        if(!raw.subGoalLive2217){for(const g of s.goals||[])if(/\bsub\s*goal\b/i.test(g.title||'')&&['support','subs'].includes(g.metric))g.metric='activeSubs';s.subGoalLive2217=true;}
        try{s.goals=normalizeGoals(s.goals);}catch{s.goals=[];}
        // 2.20.48 (asked for): every goal off and no campaign running until one is started by hand. The previous season's
        // reached goals stay payable; its standings are archived to the Hall of Fame if anyone scored.
        if(!raw.goalsOff2048){s.goals=[];if(s.season?.active!==false){if(s.season&&this.standings(1).length)this.endSeason(this.now(),true);else s.season=this.idleSeason(s.season?.number||0);}s.goalsOff2048=true;}
        if(s.season&&s.season.active===undefined)s.season.active=s.season.endsAt>this.now();
        // 2.16.1: lower the 2.15 subscriber rewards that were never edited (Missions can then match them to the Currency System).
        if(!raw.rewards2161){
          const OLD={supporter:500,gifter:750,veteran:300,crew:300,'gift-fleet':200},NEW=Object.fromEntries([...SUB_MISSIONS,...DEFAULT_GOALS].map(x=>[x.id,x.reward]));
          for(const x of [...s.missions,...s.goals])if(OLD[x.id]!==undefined&&x.reward===OLD[x.id])x.reward=NEW[x.id];
          s.rewards2161=true;
        }
        s.week.gifts||={};s.season.support||={};s.support||={};
      }
    }catch{}
    return this;
  }
  persist(){const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  setPilots(fn){this.pilots=fn;}
  setBoss(fn){this.boss=fn;}
  setEngage(fn){this.engage=fn;}
  setMedals(fn){this.medals=fn;}

  // Called with the points ledger members (from the publisher page) about once a minute.
  receive(list){
    const now=this.now(),s=this.state;this.roll(now);
    const today=dayId(now);let changed=false;const gained=[]; // 2.20.65: points added since the last ledger, for the on-screen animation
    for(const m of Array.isArray(list)?list.slice(0,20000):[]){
      const key=clean(m?.key,120);if(!/^(twitch|youtube|kick):/.test(key))continue;
      const value=metric(m);if(value===null)continue;
      const prev=s.members[key];
      const balance=Number(m.points);
      s.members[key]={name:clean(m.name||m.login,60)||key,login:clean(m.login,60).toLowerCase(),platform:key.split(':')[0],value,...(Number.isFinite(balance)&&balance>=0?{balance}:{}),...(['blue','silver','gold','platinum'].includes(m.tier)?{tier:m.tier}:{}),...(m.vip===true?{vip:true}:{}),...(m.emerald===true?{emerald:true}:{}),seen:now};
      if(s.week.baseline[key]===undefined){s.week.baseline[key]=value;changed=true;}
      // 2.20.71: the ledger lists every member with points, so a member first seen while a goal runs is new: all their points count.
      if(s.season.baseline[key]===undefined){s.season.baseline[key]=!prev&&s.season.active&&s.season.startedAt<now?0:value;changed=true;}
      if(prev&&value>prev.value){const d=s.week.days[key]||(s.week.days[key]=[]);if(!d.includes(today)){d.push(today);changed=true;}gained.push({key,name:s.members[key].name,platform:s.members[key].platform,amount:value-prev.value,total:value,balance:s.members[key].balance});}
      if(!prev||prev.value!==value)changed=true;
    }
    s.membersAt=now;
    this.notePilots();this.noteMedals();
    if(gained.length)try{this.onPoints(gained);}catch{}
    if(changed)this.persist();
    return this.view();
  }
  // Called with recent subscriber/member and gifted-sub records (Voyager - Stream Stats v6, via the publisher page).
  // months = subscription length the platform reported; gifts = gifted subs/memberships (Twitch: the shared lifetime
  // total; YouTube/Kick: counted by Voyager). Someone seen for the first time is counted conservatively (one sub/gift).
  receiveSupport(list){
    const now=this.now(),s=this.state;this.roll(now);let changed=false;
    for(const r of Array.isArray(list)?list.slice(0,5000):[]){
      const key=clean(r?.key,120);if(!/^(twitch|youtube|kick):/.test(key))continue;
      const months=int(r.months,0,1e9)??0,gifts=int(r.gifts,0,1e9)??0,monthsAt=int(r.monthsAt,0,1e15)??0,giftsAt=int(r.giftsAt,0,1e15)??0,giftsLast=int(r.giftsLast,0,1e9)??0;
      // A supporter first seen after the season (or week) started is credited with their latest event: the whole last gift when the
      // tracker reports its size (2.20.71), else one; a first sub month counts as one.
      const prev=s.support[key],first=(v,at,since,last)=>at>=since&&v>0?Math.max(0,v-(last>0?Math.min(last,v):1)):v;
      if(s.week.gifts[key]===undefined){s.week.gifts[key]=prev?prev.gifts:first(gifts,giftsAt,s.week.id,giftsLast);changed=true;}
      if(s.season.support[key]===undefined){s.season.support[key]={months:prev?prev.months:first(months,monthsAt,s.season.startedAt,0),gifts:prev?prev.gifts:first(gifts,giftsAt,s.season.startedAt,giftsLast)};changed=true;}
      const days=m=>{if(!m||typeof m!=='object')return undefined;const o={};for(const [d,n] of Object.entries(m).sort().slice(-200)){if(!/^\d{4}-\d{2}-\d{2}$/.test(d))continue;const v=int(n,0,1e6);if(v)o[d]=v;}return Object.keys(o).length?o:undefined;};
      const next={name:clean(r.name||r.login,60)||s.members[key]?.name||key,login:clean(r.login,60).toLowerCase(),platform:key.split(':')[0],
        months:Math.max(prev?.months||0,months),monthsAt:Math.max(prev?.monthsAt||0,monthsAt),gifts:Math.max(prev?.gifts||0,gifts),giftsAt:Math.max(prev?.giftsAt||0,giftsAt),giftsLast:giftsLast||prev?.giftsLast||0,
        ...(days(r.giftsByDay)?{giftsByDay:days(r.giftsByDay)}:prev?.giftsByDay?{giftsByDay:prev.giftsByDay}:{}),...(days(r.subsByDay)?{subsByDay:days(r.subsByDay)}:prev?.subsByDay?{subsByDay:prev.subsByDay}:{})};
      if(!prev||prev.months!==next.months||prev.gifts!==next.gifts||prev.monthsAt!==next.monthsAt||prev.name!==next.name)changed=true;
      s.support[key]=next;
    }
    s.supportAt=now;s.supportCount=Object.keys(s.support).length;
    if(changed)this.persist();
    return this.view();
  }
  // Subs/renewals and gifted subs since the season began, per supporter.
  // Subs and gifts during the run. Three lower-bound readings, the largest wins: the tracker's per-day counts from the run's start date
  // (exact from Community Tracker v2 on), the change since the run was opened (baseline), and the latest event's time (one event, or the
  // whole last gift) when it fell inside the window. So a run that counts from 1 November credits what the tracker knows about since then.
  seasonSupport(key){
    const s=this.state,v=s.support[key],b=s.season.support?.[key];if(!v||!s.season.active)return {subs:0,gifts:0};
    const man=this.manualFor(key),since=Math.max(s.season.startedAt||0,man?s.season.manualUntil||0:0),day=dayId(since),sum=m=>m?Object.entries(m).reduce((a,[d,n])=>d>=day?a+n:a,0):0;
    // The change-since-opened reading overlaps an import (its baseline predates the imported events), so it only counts without one.
    const useBase=!!b&&(!man||(s.season.openedAt||0)>(s.season.manualUntil||0));const base={subs:useBase?Math.max(0,v.months-b.months):0,gifts:useBase?Math.max(0,v.gifts-b.gifts):0};
    const late={subs:v.monthsAt>=since?1:0,gifts:v.giftsAt>=since?Math.max(1,Math.min(v.gifts,v.giftsLast||1)):0};
    return {subs:(man?.subs||0)+Math.max(sum(v.subsByDay),base.subs,late.subs),gifts:(man?.gifts||0)+Math.max(sum(v.giftsByDay),base.gifts,late.gifts)};
  }
  // Medal missions: snapshot each counter the first time it's seen this week (0 for viewers who first appeared this week).
  medalViewers(){try{return this.medals?.()?.state?.viewers||{};}catch{return {};}}
  // One snapshot per counter per week (taken when the week starts or the mission is added). Anyone missing from it had 0 then.
  noteMedals(){
    const s=this.state,need=[...new Set(s.missions.filter(m=>m.enabled&&TYPES[m.type]?.counter).map(m=>TYPES[m.type].counter))];
    const base=s.week.medal||(s.week.medal={}),at=s.week.medalAt||(s.week.medalAt={});let changed=false;
    const viewers=this.medalViewers();if(!Object.keys(viewers).length)return false;
    for(const c of need){if(at[c])continue;const b=base[c]={};for(const [key,v] of Object.entries(viewers)){const n=Number(v.c?.[c])||0;if(n)b[key]=n;}at[c]=this.now();changed=true;}
    return changed;
  }
  notePilots(){
    const s=this.state;
    for(const p of this.pilotList()){if(s.week.versus[p.login]===undefined)s.week.versus[p.login]=p.wins;if(s.season.versus[p.login]===undefined)s.season.versus[p.login]=p.wins;}
  }
  pilotList(){let raw=[];try{raw=this.pilots()||[];}catch{}return raw.filter(p=>p&&p.login).map(p=>({login:String(p.login).toLowerCase(),name:clean(p.name||p.login,60),wins:int(p.wins,0,1e9)??0}));}
  // New week: keep last week's completions so they can still be paid. Season end: archive to the Hall of Fame.
  roll(now){
    const s=this.state,w=weekStart(now);
    if(w!==s.week.id){s.previous={id:s.week.id,completions:this.completions()};s.week={id:w,baseline:{},days:{},versus:{},gifts:{},medal:{},medalAt:{}};this.noteMedals();this.persist();}
    if(s.season.active&&s.season.endsAt&&now>=s.season.endsAt)this.endSeason(now);
  }
  progressFor(m){
    const s=this.state,rows=[];
    if(m.type==='versusWins'){
      if(!onPlatform(m.platform,'twitch'))return rows;
      const byLogin=new Map(Object.entries(s.members).filter(([k])=>k.startsWith('twitch:')).map(([k,v])=>[v.login,k]));
      for(const p of this.pilotList()){const base=s.week.versus[p.login];if(base===undefined)continue;const n=Math.max(0,p.wins-base);if(n>0)rows.push({key:byLogin.get(p.login)||'',name:p.name,platform:'twitch',progress:n});}
    }else if(TYPES[m.type].counter||TYPES[m.type].streak){
      const t=TYPES[m.type],base=s.week.medal?.[t.counter]||{};
      for(const [key,v] of Object.entries(this.medalViewers())){
        if(!onPlatform(m.platform,v.platform))continue;
        let n=0;
        if(t.streak){if((s.week.days[key]||[]).length)n=Number(v.c?.streak)||0;}
        else{if(!s.week.medalAt?.[t.counter])continue;const now=Number(v.c?.[t.counter])||0,b=base[key]??0;n=Math.floor(Math.max(0,now-b)/(t.scale||1));}
        if(n>0)rows.push({key,name:s.members[key]?.name||v.name,platform:v.platform,progress:n,account:!!s.members[key]});
      }
    }else if(TYPES[m.type].support){
      for(const [key,v] of Object.entries(s.support||{})){
        if(!onPlatform(m.platform,v.platform))continue;
        const renewed=v.monthsAt>=s.week.id&&v.months>0;
        const n=m.type==='subscribe'?(renewed?1:0):m.type==='loyalSub'?(renewed?v.months:0):Math.max(0,v.gifts-(s.week.gifts?.[key]??v.gifts));
        if(n>0)rows.push({key,name:s.members[key]?.name||v.name,platform:v.platform,progress:n,account:!!s.members[key]});
      }
    }else for(const [key,v] of Object.entries(s.members)){
      if(!onPlatform(m.platform,v.platform))continue;
      const n=m.type==='earnPoints'?Math.max(0,v.value-(s.week.baseline[key]??v.value)):(s.week.days[key]||[]).length;
      if(n>0)rows.push({key,name:v.name,platform:v.platform,progress:n});
    }
    return rows.map(r=>({...r,progress:Math.min(r.progress,m.target),done:r.progress>=m.target})).sort((a,b)=>b.progress-a.progress||a.name.localeCompare(b.name));
  }
  completions(){
    const out=[];
    for(const m of this.state.missions.filter(x=>x.enabled))for(const r of this.progressFor(m).filter(x=>x.done))out.push({missionId:m.id,title:m.title,reward:m.reward,key:r.key,name:r.name,platform:r.platform,...(r.account===false?{account:false}:{})});
    return out;
  }
  payKey(week,missionId,key){return week+'|'+missionId+'|'+key;}
  // Who is owed what, this week and last week, with payment status.
  payables(){
    const s=this.state,rows=[];
    // 2.20.79: rows other modules owe (crew surge bonuses), paid and recorded like the rest.
    for(const c of (this.extraPayables?.()||[])){if(!c.reward)continue;const k=this.payKey(c.week,c.missionId,c.key);rows.push({...c,payable:!!c.key&&c.account!==false,status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});}
    // Season goals use the season's start time in place of a week, so their payouts never clash with missions.
    for(const [week,list,scope,label] of [[s.week.id,this.completions(),'week','this week'],[s.previous?.id,s.previous?.completions||[],'week','last week'],
      [s.season.startedAt,this.goalCompletions(),'season',s.season.name],[s.previousSeason?.id,s.previousSeason?.completions||[],'season',s.previousSeason?.name||'last season']]){
      if(!week)continue;
      for(const c of list){if(!c.reward)continue;const k=this.payKey(week,c.missionId,c.key);rows.push({...c,week,scope,label,payable:!!c.key&&c.account!==false,status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});}
    }
    // Multiplier bonuses accrue while the run is on and become payable when it ends.
    if(s.season.active)for(const c of this.goalBonuses())rows.push({...c,week:s.season.startedAt,scope:'season',label:s.season.name,payable:false,status:'accruing',paidAt:0,note:'Paid when '+s.season.name+' ends'});
    // Voyager Dreadnought victories (2.17): the same points for every pilot who fought.
    let batches=[];try{batches=this.boss()||[];}catch{}
    for(const b of batches)for(const p of b.pilots||[]){
      const key=clean(p.key,120);if(!key)continue;const k=this.payKey(b.id,'boss',key);
      rows.push({missionId:'boss',title:b.title,reward:b.reward,key,name:s.members[key]?.name||p.name,platform:p.platform,week:b.id,scope:'boss',label:'Dreadnought',payable:!!s.members[key],status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});
    }
    // Chat engagement (2.20.22): daily muster (!report) and Bridge Quiz winners.
    let engage=[];try{engage=this.engage?.()||[];}catch{}
    for(const b of engage)for(const p of b.pilots||[]){
      const key=clean(p.key,120);if(!key||!b.reward)continue;const k=this.payKey(b.stamp,b.missionId,key);
      rows.push({missionId:b.missionId,title:b.title,reward:b.reward,key,name:s.members[key]?.name||p.name,platform:p.platform,week:b.stamp,scope:'engage',label:b.label,payable:!!s.members[key],status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});
    }
    return rows;
  }
  // 2.21.7: Twitch's live subscriber count, heard from the "Voyager - Stream Stats" broadcast (its Get Subscriber Count sub-action).
  twitchSubs(input){const v=Number(input?.value);if(!Number.isFinite(v)||v<0)return false;const at=Number(input?.at)||this.now();const prev=this.state.twitchSubs;if(prev&&prev.at>at)return false;if(prev&&prev.value===Math.round(v)){prev.at=at;return true;}this.state.twitchSubs={value:Math.round(v),at};this.persist();return true;}
  // Season goals: community totals, and who helped.
  goalProgress(){
    const s=this.state,now=this.now(),active=!!s.season.active,rows=active&&(s.goals||[]).some(g=>g.metric==='points'||g.metric==='versus')?this.standings(100000):[];
    return (s.goals||[]).map(g=>{
      const helpers=[];let total=0,contributors=0;const minimum=g.minimum||1;
      const pts=new Map(rows.length?rows.map(r=>[r.key,r.points]):[]),bonusOf=key=>g.multiplier>1?Math.round((pts.size?pts.get(key)||0:this.seasonPointsOf(key))*(g.multiplier-1)):0;
      const add=(key,name,platform,n,account)=>{if(n<=0)return;total+=n;contributors++;if(n>=minimum)helpers.push({key,name,platform,count:n,account,bonus:bonusOf(key)});};
      if(active&&g.metric==='activeSubs'){
        // 2.21.7: the goal IS Twitch's current subscriber count (Get Subscriber Count via Voyager - Stream Stats), not a tally of
        // events. Helpers are the Twitch accounts that subscribed or renewed this season; their counts do not add up to the total.
        for(const [key,v] of Object.entries(s.support||{})){if(v.platform!=='twitch')continue;const u=this.seasonSupport(key);if(u.subs>0&&u.subs>=minimum)helpers.push({key,name:s.members[key]?.name||v.name,platform:'twitch',count:u.subs,account:!!s.members[key],bonus:bonusOf(key)});}
        contributors=helpers.length;total=Math.max(0,Math.round(Number(s.twitchSubs?.value)||0));
      }else if(active&&(g.metric==='points'||g.metric==='versus')){
        for(const r of rows){if(!onPlatform(g.platform,r.platform))continue;add(r.key,r.name,r.platform,g.metric==='points'?r.points:r.wins,!!s.members[r.key]);}
      }else if(active){
        const seen=new Set();
        for(const [key,v] of Object.entries(s.support||{})){
          if(!onPlatform(g.platform,v.platform))continue;
          const u=this.seasonSupport(key),n=g.metric==='subs'?u.subs:g.metric==='gifts'?u.gifts:u.subs+u.gifts;const man=this.manualFor(key);if(man)seen.add(man);
          add(key,s.members[key]?.name||v.name,v.platform,n,!!s.members[key]);
        }
        // Imported credits for viewers the tracker has no record of: matched to a member by name when possible (so bonuses can be paid).
        for(const man of Object.values(s.season.manual||{})){if(seen.has(man))continue;const n=g.metric==='subs'?man.subs:g.metric==='gifts'?man.gifts:man.subs+man.gifts;
          const mk=Object.keys(s.members).find(k=>s.members[k].login===man.name.toLowerCase()||s.members[k].name.toLowerCase()===man.name.toLowerCase());const platform=man.platform||(mk?mk.split(':')[0]:'twitch');
          if(!onPlatform(g.platform,platform))continue;add(mk||'manual:'+man.name.toLowerCase(),mk?s.members[mk].name:man.name,platform,n,!!mk);}
      }
      helpers.sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
      const dueAt=g.dueAt||s.season.endsAt||0,reached=total>=g.target,missed=!reached&&!!dueAt&&now>dueAt;
      return {...g,label:GOAL_METRICS[g.metric],total,reached,missed,dueAt,status:reached?'reached':missed?'missed':active?'open':'waiting',helpers,contributors};
    });
  }
  // 2.20.71: why a viewer does or does not count towards each goal (Community goals › Check a viewer).
  explain(query){
    const s=this.state,q=clean(query,60).toLowerCase();if(!q)return {query:'',matches:[]};
    const keys=new Set();for(const [k,m] of Object.entries(s.members))if(m.name.toLowerCase()===q||m.login===q||k===q)keys.add(k);
    for(const [k,v] of Object.entries(s.support||{}))if(String(v.name||'').toLowerCase()===q||v.login===q||k===q)keys.add(k);
    if(!keys.size){for(const [k,m] of Object.entries(s.members))if(m.name.toLowerCase().includes(q)||m.login.includes(q))keys.add(k);for(const [k,v] of Object.entries(s.support||{}))if(String(v.name||'').toLowerCase().includes(q)||String(v.login||'').includes(q))keys.add(k);}
    const rows=this.standings(100000),active=!!s.season.active;
    const matches=[...keys].slice(0,5).map(key=>{const m=s.members[key],sup=s.support?.[key],u=this.seasonSupport(key),st=rows.find(r=>r.key===key);
      return {key,name:m?.name||sup?.name||key,platform:key.split(':')[0],member:!!m,points:m?{lifetime:m.value,baseline:s.season.baseline[key]??null,season:st?.points??0}:null,
        support:sup?{months:sup.months,monthsAt:sup.monthsAt,gifts:sup.gifts,giftsAt:sup.giftsAt,baseline:s.season.support?.[key]||null,season:u}:null,
        goals:(s.goals||[]).map(g=>{const n=!active?0:g.metric==='points'?(st?.points||0):g.metric==='versus'?(st?.wins||0):g.metric==='subs'||g.metric==='activeSubs'?u.subs:g.metric==='gifts'?u.gifts:u.subs+u.gifts;const on=g.metric==='activeSubs'?key.startsWith('twitch:'):onPlatform(g.platform,key.split(':')[0]);
          return {id:g.id,title:g.title,metric:g.metric,count:on?n:0,minimum:g.minimum||1,counts:on&&n>0,earns:on&&n>=(g.minimum||1),why:!active?'No community goal is running.':!on?'Goal is for '+g.platform+' only.':n>0?'':g.metric==='points'?(m?'No Voyager points earned since the goal started (baseline '+(s.season.baseline[key]??'none')+').':'Not in the points ledger yet.'):g.metric==='versus'?'No Versus wins since the goal started.':sup?'No '+(g.metric==='gifts'?'gifts':g.metric==='subs'?'subs or renewals':'subs or gifts')+' recorded since the goal started (tracker total '+(g.metric==='gifts'?sup.gifts:sup.months)+', baseline '+(s.season.support?.[key]?(g.metric==='gifts'?s.season.support[key].gifts:s.season.support[key].months):'none')+').':'No support record from Voyager - Stream Stats for this viewer (the Community Tracker has not recorded a sub or gift for them, or the support feed has not arrived).'};})};});
    return {query:q,matches,feed:this.feed()};
  }
  feed(){const s=this.state;return {supportAt:s.supportAt||0,supporters:Object.keys(s.support||{}).length,membersAt:s.membersAt||0,members:Object.keys(s.members).length,seasonStartedAt:s.season.startedAt||0,active:!!s.season.active};}
  // 2.20.76: past subs and gifts pasted in (Streamer.bot logs, a Twitch export, a CSV) for the part of the run before Voyager was counting.
  // Rows: {at,name,platform?,kind:'sub'|'gift',count}. Credited per viewer; from the import time on, the automatic counting takes over.
  static parseSupportText(text){
    const rows=[],lines=String(text||'').split(/\r?\n/).slice(0,5000);
    const dateIn=l=>{const m=/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/.exec(l)||/(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(l);if(!m)return 0;
      if(m[0].includes('/')){const d=Date.UTC(Number(m[3]),Number(m[2])-1,Number(m[1]));return Number.isFinite(d)?d:0;}return Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(m[4]||0),Number(m[5]||0));};
    for(const raw of lines){const l=raw.trim();if(!l||/^(date|time|when)[,;\t]/i.test(l))continue;
      const parts=l.split(/[,;\t]/).map(x=>x.trim());
      if(parts.length>=3&&/^(sub|subs|resub|gift|gifts|gifted|giftsub|giftbomb|bomb)$/i.test(parts[parts.length-2]||'')&&/^\d+$/.test(parts[parts.length-1])){
        const kind=/gift|bomb/i.test(parts[parts.length-2])?'gift':'sub';rows.push({at:dateIn(parts[0])||0,name:parts.length>=4?parts[1]:parts[0],kind,count:Number(parts[parts.length-1])});continue;}
      let m=/([A-Za-z0-9_]{3,25})\s+(?:has\s+)?gift(?:ed|s)?\s+(?:a\s+|an\s+)?(\d+)?\s*(?:x\s*)?(?:tier\s*\d\s*)?(?:community\s+)?sub/i.exec(l)||/gift(?:ed)?\s*(?:bomb|subs?)?[^A-Za-z0-9_]+([A-Za-z0-9_]{3,25})[^0-9]*(\d+)?/i.exec(l);
      if(m&&/gift/i.test(l)){rows.push({at:dateIn(l),name:m[1],kind:'gift',count:Math.max(1,Number(m[2])||1)});continue;}
      m=/([A-Za-z0-9_]{3,25})\s+(?:just\s+)?(?:re)?subscribed/i.exec(l)||/(?:sub|resub)(?:scription)?[^A-Za-z0-9_]+([A-Za-z0-9_]{3,25})/i.exec(l);
      if(m&&/sub/i.test(l)&&!/gift/i.test(l)){rows.push({at:dateIn(l),name:m[1],kind:'sub',count:1});continue;}}
    return rows;
  }
  importSupport({rows,until,replace=true}={}){
    const s=this.state,sea=s.season;if(!sea.active)throw new Error('Start the run first, then import.');
    const upto=Number(until)||this.now();const by=replace?{}:(sea.manual||{});let n=0;
    for(const r of Array.isArray(rows)?rows.slice(0,5000):[]){const name=clean(r?.name,40);const count=int(r?.count,1,100000);const kind=r?.kind==='gift'?'gifts':r?.kind==='sub'?'subs':null;if(!name||!count||!kind)continue;
      const at=Number(r.at)||0;if(at&&(at<sea.startedAt-DAY||at>upto+DAY))continue;const k=name.toLowerCase();by[k]=by[k]||{name,platform:['twitch','youtube','kick'].includes(r.platform)?r.platform:'',subs:0,gifts:0};by[k][kind]+=count;n++;}
    sea.manual=by;sea.manualUntil=upto;this.persist();return {imported:n,viewers:Object.keys(by).length,...this.view()};
  }
  clearImport(){const sea=this.state.season;delete sea.manual;delete sea.manualUntil;this.persist();return this.view();}
  manualFor(key){const m=this.state.season.manual;if(!m)return null;const v=this.state.members[key],sup=this.state.support?.[key];for(const c of [v?.login,v?.name,sup?.login,sup?.name])if(c&&m[String(c).toLowerCase()])return m[String(c).toLowerCase()];return null;}
  seasonPointsOf(key){const s=this.state,v=s.members[key];return v?Math.max(0,v.value-(s.season.baseline[key]??v.value)):0;}
  // 2.20.74: points bonus for every contributor of a goal with a multiplier (x1.5 = half their run points again), paid when the run ends.
  goalBonuses(){const out=[];for(const g of this.goalProgress().filter(x=>x.multiplier>1))for(const h of g.helpers)if(h.bonus>0)out.push({missionId:'bonus-'+g.id,title:'Points x'+g.multiplier+' · '+g.title,reward:h.bonus,key:h.key,name:h.name,platform:h.platform,bonus:true,...(h.account?{}:{account:false})});return out;}
  goalCompletions(){
    const out=[];
    for(const g of this.goalProgress().filter(x=>x.reached))for(const h of g.helpers)out.push({missionId:'goal-'+g.id,title:'Community goal: '+g.title,reward:g.reward,key:h.key,name:h.name,platform:h.platform,...(h.account?{}:{account:false})});
    return out;
  }
  recordPayout({week,missionId,key,status,note}){
    if(!['paid','failed'].includes(status))throw new Error('Unknown payout status.');
    const k=this.payKey(int(week,0,1e15),clean(missionId,32),clean(key,120));
    if(this.state.payouts[k]?.status==='paid')return {ok:true,already:true};
    this.state.payouts[k]={status,at:this.now(),note:clean(note,200)};
    const keys=Object.keys(this.state.payouts);if(keys.length>5000)for(const old of keys.slice(0,keys.length-5000))delete this.state.payouts[old];
    this.persist();return {ok:true};
  }
  setMissions(list){this.state.missions=normalizeMissions(list);this.noteMedals();this.persist();return this.view();}
  standings(limit=50){
    const s=this.state,wins=new Map();if(!s.season.active)return [];
    for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b!==undefined&&p.wins>b)wins.set(p.login,p.wins-b);}
    const bonus=s.supportBonus??DEFAULT_SUPPORT_BONUS,keys=new Set([...Object.keys(s.members),...Object.keys(s.support||{})]);
    // Season score = points earned this season + a bonus for every sub, renewal or gifted sub this season.
    const rows=[...keys].map(key=>{const v=s.members[key],sup=s.support?.[key],u=this.seasonSupport(key),support=u.subs+u.gifts,
        points=v?Math.max(0,v.value-(s.season.baseline[key]??v.value)):0,platform=(v||sup).platform;
      return {key,name:v?.name||sup?.name||key,platform,points,support,score:points+support*bonus,wins:platform==='twitch'?wins.get(v?.login||sup?.login)||0:0};})
      .filter(r=>r.score>0||r.wins>0).sort((a,b)=>b.score-a.score||b.wins-a.wins||a.name.localeCompare(b.name));
    return rows.slice(0,limit).map((r,i)=>({rank:i+1,...r}));
  }
  topPilot(){const s=this.state;if(!s.season.active)return null;let best=null;for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b===undefined)continue;const n=p.wins-b;if(n>0&&(!best||n>best.wins))best={name:p.name,wins:n};}return best;}
  // End the running community goal: top five into the Hall of Fame, reached goals stay payable, then idle until the next one is started.
  endSeason(now=this.now(),quiet=false){
    const s=this.state;if(!s.season.active&&!quiet)throw new Error('No community goal is running.');
    const top=this.standings(5),goals=this.goalProgress();
    if(s.season.active||top.length)s.hall.unshift({number:s.season.number,name:s.season.name||'Season '+s.season.number,startedAt:s.season.startedAt,endedAt:now,champion:top[0]?{name:top[0].name,platform:top[0].platform,points:top[0].score}:null,topPilot:this.topPilot(),top:top.map(r=>({name:r.name,platform:r.platform,points:r.score})),
      goals:goals.map(g=>({title:g.title,total:g.total,target:g.target,reached:g.reached}))});
    s.hall=s.hall.slice(0,20);
    s.previousSeason={id:s.season.startedAt,name:s.season.name||'Season '+s.season.number,completions:[...this.goalCompletions(),...this.goalBonuses()]};
    s.season=this.idleSeason(s.season.number||0);if(!quiet)this.persist();return this.view();
  }
  // Start a community goal (2.20.48): a name, a due date and the goals to aim for. Standings and goal counts start from zero now.
  startSeason({name,startsAt,endsAt,goals,supportBonus}={}){
    const st=this.state,now=this.now();if(st.season.active)throw new Error(st.season.name+' is still running. End it first.');
    const n=clean(name,40);if(!n)throw new Error('Give the community goal a name, for example Christmas 2026.');
    const due=Number(endsAt);if(!Number.isFinite(due)||due<=now+60000)throw new Error('Choose a due date in the future.');if(due>now+366*DAY*2)throw new Error('The due date must be within two years.');
    // 2.20.74: the run can count from an earlier date (up to 120 days back): subs and gifts from the tracker's records since then; points from now.
    let from=now;if(startsAt!==undefined&&startsAt!==null&&startsAt!==''){from=Number(startsAt);if(!Number.isFinite(from))throw new Error('The start date is not valid.');if(from>now)throw new Error('The start date cannot be in the future.');if(from<now-120*DAY)throw new Error('The start date can be at most 120 days ago.');from=Math.round(from);}
    if(goals!==undefined)st.goals=normalizeGoals(goals);
    if(supportBonus!==undefined){const b=int(supportBonus,0,100000);if(b===null)throw new Error('The supporter bonus must be 0 to 100,000 points.');st.supportBonus=b;}
    // Points earned from this moment count: today's balances are the baseline. Support and Versus baselines follow on the next read.
    const baseline={};for(const [key,v] of Object.entries(st.members||{}))if(Number.isFinite(v?.value))baseline[key]=v.value;
    st.season={number:(st.season.number||0)+1,name:n,startedAt:from,openedAt:now,endsAt:Math.round(due),weeks:Math.max(1,Math.round((due-from)/(7*DAY))),active:true,baseline,versus:{},support:{}};
    this.notePilots();this.persist();return this.view();
  }
  configureSeason({name,weeks,startsAt,endsAt,goals,supportBonus}){
    const st=this.state,s=st.season;
    if(s.active&&(name!==undefined||weeks!==undefined||endsAt!==undefined||startsAt!==undefined)){
      const n=clean(name,40);if(n)s.name=n;
      if(startsAt!==undefined&&startsAt!==null&&startsAt!==''){const from=Number(startsAt);const opened=s.openedAt||s.startedAt;if(!Number.isFinite(from)||from>opened||from<opened-120*DAY)throw new Error('The start date must be within the 120 days before the run was opened.');s.startedAt=Math.round(from);}
      if(endsAt!==undefined){const due=Number(endsAt);if(!Number.isFinite(due)||due<=s.startedAt)throw new Error('The due date must be after the start.');s.endsAt=Math.round(due);}
      else if(weeks!==undefined){const w=int(weeks,1,104);if(w===null)throw new Error('A community goal lasts 1 to 104 weeks.');s.endsAt=s.startedAt+w*7*DAY;}
      s.weeks=Math.max(1,Math.round((s.endsAt-s.startedAt)/(7*DAY)));
    }
    if(goals!==undefined)st.goals=normalizeGoals(goals);
    if(supportBonus!==undefined){const b=int(supportBonus,0,100000);if(b===null)throw new Error('The supporter bonus must be 0 to 100,000 points.');st.supportBonus=b;}
    this.persist();return this.view();
  }
  setPanel({config,visible}){
    const p=this.state.panel||(this.state.panel={config:{...PANEL_DEFAULTS},visible:false,expiresAt:0,revision:0});
    if(config!==undefined)p.config=normalizePanel(config);
    if(visible!==undefined){p.visible=visible===true;p.expiresAt=p.visible&&p.config.duration?this.now()+p.config.duration*1000:0;}
    p.revision=(p.revision||0)+1;this.persist();return this.panelView();
  }
  panelView(){const p=this.state.panel||{config:{...PANEL_DEFAULTS},visible:false,expiresAt:0,revision:0};return {config:p.config,visible:p.visible&&(!p.expiresAt||this.now()<p.expiresAt),expiresAt:p.expiresAt,revision:p.revision||0};}
  // What the OBS panel reads (local only). Real names: it's shown on your own stream, like the other panels.
  overlay(){this.roll(this.now());const pv=this.publicView(),full=this.goalProgress();
    // 2.20.62: the contributors panel lists who helped each goal and by how much (top 25 per goal), with the goal's minimum and reward.
    return {serverAt:this.now(),panel:this.panelView(),...pv,season:{...pv.season,goals:pv.season.goals.map((g,i)=>({...g,contributors:full[i]?.contributors||0,minimum:full[i]?.minimum||1,people:(full[i]?.helpers||[]).slice(0,25).map(h=>({name:h.name,platform:h.platform,count:h.count}))}))}};}
  view(){
    const s=this.state,missions=s.missions.map(m=>{const p=this.progressFor(m);return {...m,typeLabel:TYPES[m.type].label,unit:TYPES[m.type].unit,started:p.length,completed:p.filter(x=>x.done).length,top:p.slice(0,8)};});
    return {missions,week:{id:s.week.id,endsAt:s.week.id+7*DAY},members:Object.keys(s.members).length,payables:this.payables(),
      season:{number:s.season.number,name:s.season.name,startedAt:s.season.startedAt,openedAt:s.season.openedAt||s.season.startedAt,endsAt:s.season.endsAt,weeks:s.season.weeks,active:!!s.season.active,manual:s.season.manual?{viewers:Object.keys(s.season.manual).length,subs:Object.values(s.season.manual).reduce((a,x)=>a+x.subs,0),gifts:Object.values(s.season.manual).reduce((a,x)=>a+x.gifts,0),until:s.season.manualUntil||0}:null},feed:this.feed(),standings:this.standings(),topPilot:this.topPilot(),hall:s.hall,types:TYPES,goalLimit:GOAL_LIMIT,missionMedals:MISSION_MEDALS,ideas:MISSION_IDEAS,rewardMax:MISSION_REWARD_MAX,panel:this.panelView(),panelKinds:PANEL_KINDS,
      platforms:PLATFORM_OPTIONS,goalMetrics:GOAL_METRICS,twitchSubs:s.twitchSubs||null,goals:this.goalProgress().map(g=>({...g,helpers:g.helpers.slice(0,10),contributorsList:g.helpers.slice(0,500)})),supportBonus:s.supportBonus??DEFAULT_SUPPORT_BONUS,
      support:{tracked:Object.keys(s.support||{}).length,updatedAt:s.supportAt||0}};
  }
  // What the public site may show (names are masked later if "Show viewer names" is off).
  publicView(){
    const v=this.view();
    return {season:{name:v.season.name,endsAt:v.season.endsAt,startedAt:v.season.startedAt,active:v.season.active,supportBonus:v.supportBonus,standings:v.standings.slice(0,10).map(r=>({rank:r.rank,name:r.name,platform:r.platform,points:r.score,earned:r.points,support:r.support,wins:r.wins})),
        goals:v.goals.map(g=>({title:g.title,metric:g.metric,platform:g.platform,target:g.target,total:g.total,reward:g.reward,multiplier:g.multiplier||1,reached:g.reached,missed:g.missed,dueAt:g.dueAt,description:g.description||'',helpers:g.helpers.length}))},
      hall:v.hall.slice(0,6).map(h=>({name:h.name,endedAt:h.endedAt,champion:h.champion,topPilot:h.topPilot})),
      missions:v.missions.filter(m=>m.enabled).map(m=>({title:m.title,type:m.type,platform:m.platform,target:m.target,reward:m.reward,completed:m.completed,medal:MISSION_MEDALS[m.type]||''})),weekEndsAt:v.week.endsAt};
  }
}
