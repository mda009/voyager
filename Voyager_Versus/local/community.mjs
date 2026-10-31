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
  loyalSub:{label:'Renew with a long subscription',unit:'months',support:true,max:120}
};
export const PLATFORM_OPTIONS={all:'All platforms',twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
// Season goals (2.15): one shared target for the whole community; everyone who helped is rewarded once it's reached.
export const GOAL_METRICS={support:'Subs, renewals and gifted subs',subs:'Subs and renewals',gifts:'Gifted subs'};
export const DEFAULT_MISSIONS=[
  {id:'regular',title:'Regular Pilot',type:'streamDays',target:3,reward:250,enabled:true},
  {id:'collector',title:'Point Collector',type:'earnPoints',target:500,reward:150,enabled:true},
  {id:'arena',title:'Ace of the Arena',type:'versusWins',target:1,reward:400,enabled:true}
];
export const SUB_MISSIONS=[
  {id:'supporter',title:'Crew Supporter',type:'subscribe',target:1,reward:250,platform:'all',enabled:true},
  {id:'gifter',title:'Fleet Gifter',type:'giftSubs',target:3,reward:250,platform:'all',enabled:true},
  {id:'veteran',title:'Veteran Crew',type:'loyalSub',target:6,reward:125,platform:'all',enabled:true}
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
export const PANEL_KINDS={season:'Season standings',goals:'Season sub goals',hall:'Hall of Fame',missions:"This week's missions"};
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
    const reward=int(m.reward,0,1e6);if(reward===null)throw new Error(title+': the reward must be 0 to 1,000,000 points.');
    const platform=Object.hasOwn(PLATFORM_OPTIONS,m.platform??'all')?(m.platform??'all'):null;if(!platform)throw new Error(title+': unknown platform.');
    out.push({id,title,type,target,reward,platform,enabled:m.enabled!==false});
  }
  return out;
}

export function normalizeGoals(raw){
  const out=[],seen=new Set();
  for(const g of Array.isArray(raw)?raw.slice(0,4):[]){
    const id=clean(g?.id,24).toLowerCase().replace(/[^a-z0-9-]/g,'')||'g'+out.length;if(seen.has(id))continue;seen.add(id);
    const title=clean(g.title,40);if(!title)throw new Error('Every season goal needs a name.');
    const metric=Object.hasOwn(GOAL_METRICS,g.metric)?g.metric:null;if(!metric)throw new Error(title+': choose what the goal counts.');
    const platform=Object.hasOwn(PLATFORM_OPTIONS,g.platform??'all')?(g.platform??'all'):null;if(!platform)throw new Error(title+': unknown platform.');
    const target=int(g.target,1,100000);if(target===null)throw new Error(title+': the target must be 1 to 100,000.');
    const reward=int(g.reward,0,1e6);if(reward===null)throw new Error(title+': the reward must be 0 to 1,000,000 points.');
    out.push({id,title,metric,platform,target,reward});
  }
  return out;
}
const onPlatform=(want,platform)=>!want||want==='all'||want===platform;

export class Community{
  constructor({dataDir,now=Date.now}){this.dataDir=dataDir;this.now=now;this.state=this.fresh();this.saving=Promise.resolve();this.pilots=()=>[];this.boss=()=>[];}
  fresh(){
    const now=this.now();
    return {schema:1,missions:normalizeMissions([...DEFAULT_MISSIONS,...SUB_MISSIONS]),subSeeded:true,rewards2161:true,members:{},support:{},supportAt:0,
      goals:DEFAULT_GOALS.map(g=>({...g})),supportBonus:DEFAULT_SUPPORT_BONUS,previousSeason:null,
      week:{id:weekStart(now),baseline:{},days:{},versus:{},gifts:{}},previous:null,payouts:{},
      season:this.newSeason(now,1,13),hall:[],panel:{config:{...PANEL_DEFAULTS},visible:false,expiresAt:0,revision:0}};
  }
  newSeason(now,number,weeks){return {number,name:'Season '+number,startedAt:now,endsAt:now+weeks*7*DAY,weeks,baseline:{},versus:{},support:{}};}
  async load(){
    try{
      const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));
      if(raw?.schema===1){
        const s=this.state={...this.fresh(),...raw};s.missions=normalizeMissions(raw.missions);
        // 2.15: add the subscriber missions once to an existing programme (room permitting; they can be switched off).
        if(!raw.subSeeded){for(const m of SUB_MISSIONS)if(s.missions.length<8&&!s.missions.some(x=>x.id===m.id||x.type===m.type))s.missions.push({...m});s.subSeeded=true;}
        try{s.goals=normalizeGoals(s.goals);}catch{s.goals=DEFAULT_GOALS.map(g=>({...g}));}
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

  // Called with the points ledger members (from the publisher page) about once a minute.
  receive(list){
    const now=this.now(),s=this.state;this.roll(now);
    const today=dayId(now);let changed=false;
    for(const m of Array.isArray(list)?list.slice(0,20000):[]){
      const key=clean(m?.key,120);if(!/^(twitch|youtube|kick):/.test(key))continue;
      const value=metric(m);if(value===null)continue;
      const prev=s.members[key];
      const balance=Number(m.points);
      s.members[key]={name:clean(m.name||m.login,60)||key,login:clean(m.login,60).toLowerCase(),platform:key.split(':')[0],value,...(Number.isFinite(balance)&&balance>=0?{balance}:{}),...(['blue','silver','gold','platinum'].includes(m.tier)?{tier:m.tier}:{}),seen:now};
      if(s.week.baseline[key]===undefined){s.week.baseline[key]=value;changed=true;}
      if(s.season.baseline[key]===undefined){s.season.baseline[key]=value;changed=true;}
      if(prev&&value>prev.value){const d=s.week.days[key]||(s.week.days[key]=[]);if(!d.includes(today)){d.push(today);changed=true;}}
      if(!prev||prev.value!==value)changed=true;
    }
    this.notePilots();
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
      const months=int(r.months,0,1e9)??0,gifts=int(r.gifts,0,1e9)??0,monthsAt=int(r.monthsAt,0,1e15)??0,giftsAt=int(r.giftsAt,0,1e15)??0;
      const prev=s.support[key],first=(v,at,since)=>at>=since&&v>0?v-1:v;
      if(s.week.gifts[key]===undefined){s.week.gifts[key]=prev?prev.gifts:first(gifts,giftsAt,s.week.id);changed=true;}
      if(s.season.support[key]===undefined){s.season.support[key]={months:prev?prev.months:first(months,monthsAt,s.season.startedAt),gifts:prev?prev.gifts:first(gifts,giftsAt,s.season.startedAt)};changed=true;}
      const next={name:clean(r.name||r.login,60)||s.members[key]?.name||key,login:clean(r.login,60).toLowerCase(),platform:key.split(':')[0],
        months:Math.max(prev?.months||0,months),monthsAt:Math.max(prev?.monthsAt||0,monthsAt),gifts:Math.max(prev?.gifts||0,gifts),giftsAt:Math.max(prev?.giftsAt||0,giftsAt)};
      if(!prev||prev.months!==next.months||prev.gifts!==next.gifts||prev.monthsAt!==next.monthsAt||prev.name!==next.name)changed=true;
      s.support[key]=next;
    }
    s.supportAt=now;
    if(changed)this.persist();
    return this.view();
  }
  // Subs/renewals and gifted subs since the season began, per supporter.
  seasonSupport(key){
    const v=this.state.support[key],b=this.state.season.support?.[key];if(!v||!b)return {subs:0,gifts:0};
    return {subs:Math.max(0,v.months-b.months),gifts:Math.max(0,v.gifts-b.gifts)};
  }
  notePilots(){
    const s=this.state;
    for(const p of this.pilotList()){if(s.week.versus[p.login]===undefined)s.week.versus[p.login]=p.wins;if(s.season.versus[p.login]===undefined)s.season.versus[p.login]=p.wins;}
  }
  pilotList(){let raw=[];try{raw=this.pilots()||[];}catch{}return raw.filter(p=>p&&p.login).map(p=>({login:String(p.login).toLowerCase(),name:clean(p.name||p.login,60),wins:int(p.wins,0,1e9)??0}));}
  // New week: keep last week's completions so they can still be paid. Season end: archive to the Hall of Fame.
  roll(now){
    const s=this.state,w=weekStart(now);
    if(w!==s.week.id){s.previous={id:s.week.id,completions:this.completions()};s.week={id:w,baseline:{},days:{},versus:{},gifts:{}};this.persist();}
    if(now>=s.season.endsAt)this.endSeason(now);
  }
  progressFor(m){
    const s=this.state,rows=[];
    if(m.type==='versusWins'){
      if(!onPlatform(m.platform,'twitch'))return rows;
      const byLogin=new Map(Object.entries(s.members).filter(([k])=>k.startsWith('twitch:')).map(([k,v])=>[v.login,k]));
      for(const p of this.pilotList()){const base=s.week.versus[p.login];if(base===undefined)continue;const n=Math.max(0,p.wins-base);if(n>0)rows.push({key:byLogin.get(p.login)||'',name:p.name,platform:'twitch',progress:n});}
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
    // Season goals use the season's start time in place of a week, so their payouts never clash with missions.
    for(const [week,list,scope,label] of [[s.week.id,this.completions(),'week','this week'],[s.previous?.id,s.previous?.completions||[],'week','last week'],
      [s.season.startedAt,this.goalCompletions(),'season',s.season.name],[s.previousSeason?.id,s.previousSeason?.completions||[],'season',s.previousSeason?.name||'last season']]){
      if(!week)continue;
      for(const c of list){if(!c.reward)continue;const k=this.payKey(week,c.missionId,c.key);rows.push({...c,week,scope,label,payable:!!c.key&&c.account!==false,status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});}
    }
    // Voyager Dreadnought victories (2.17): the same points for every pilot who fought.
    let batches=[];try{batches=this.boss()||[];}catch{}
    for(const b of batches)for(const p of b.pilots||[]){
      const key=clean(p.key,120);if(!key)continue;const k=this.payKey(b.id,'boss',key);
      rows.push({missionId:'boss',title:b.title,reward:b.reward,key,name:s.members[key]?.name||p.name,platform:p.platform,week:b.id,scope:'boss',label:'Dreadnought',payable:!!s.members[key],status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});
    }
    return rows;
  }
  // Season goals: community totals, and who helped.
  goalProgress(){
    const s=this.state;
    return (s.goals||[]).map(g=>{
      const helpers=[];let total=0;
      for(const [key,v] of Object.entries(s.support||{})){
        if(!onPlatform(g.platform,v.platform))continue;
        const u=this.seasonSupport(key),n=g.metric==='subs'?u.subs:g.metric==='gifts'?u.gifts:u.subs+u.gifts;
        if(n>0){total+=n;helpers.push({key,name:s.members[key]?.name||v.name,platform:v.platform,count:n,account:!!s.members[key]});}
      }
      helpers.sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
      return {...g,label:GOAL_METRICS[g.metric],total,reached:total>=g.target,helpers};
    });
  }
  goalCompletions(){
    const out=[];
    for(const g of this.goalProgress().filter(x=>x.reached))for(const h of g.helpers)out.push({missionId:'goal-'+g.id,title:'Season goal: '+g.title,reward:g.reward,key:h.key,name:h.name,platform:h.platform,...(h.account?{}:{account:false})});
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
  setMissions(list){this.state.missions=normalizeMissions(list);this.persist();return this.view();}
  standings(limit=50){
    const s=this.state,wins=new Map();
    for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b!==undefined&&p.wins>b)wins.set(p.login,p.wins-b);}
    const bonus=s.supportBonus??DEFAULT_SUPPORT_BONUS,keys=new Set([...Object.keys(s.members),...Object.keys(s.support||{})]);
    // Season score = points earned this season + a bonus for every sub, renewal or gifted sub this season.
    const rows=[...keys].map(key=>{const v=s.members[key],sup=s.support?.[key],u=this.seasonSupport(key),support=u.subs+u.gifts,
        points=v?Math.max(0,v.value-(s.season.baseline[key]??v.value)):0,platform=(v||sup).platform;
      return {key,name:v?.name||sup?.name||key,platform,points,support,score:points+support*bonus,wins:platform==='twitch'?wins.get(v?.login||sup?.login)||0:0};})
      .filter(r=>r.score>0||r.wins>0).sort((a,b)=>b.score-a.score||b.wins-a.wins||a.name.localeCompare(b.name));
    return rows.slice(0,limit).map((r,i)=>({rank:i+1,...r}));
  }
  topPilot(){const s=this.state;let best=null;for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b===undefined)continue;const n=p.wins-b;if(n>0&&(!best||n>best.wins))best={name:p.name,wins:n};}return best;}
  endSeason(now=this.now()){
    const s=this.state,top=this.standings(5),goals=this.goalProgress();
    s.hall.unshift({number:s.season.number,name:s.season.name,startedAt:s.season.startedAt,endedAt:now,champion:top[0]?{name:top[0].name,platform:top[0].platform,points:top[0].score}:null,topPilot:this.topPilot(),top:top.map(r=>({name:r.name,platform:r.platform,points:r.score})),
      goals:goals.map(g=>({title:g.title,total:g.total,target:g.target,reached:g.reached}))});
    s.hall=s.hall.slice(0,20);
    // Season goals that were reached stay payable after the season ends.
    s.previousSeason={id:s.season.startedAt,name:s.season.name,completions:this.goalCompletions()};
    s.season=this.newSeason(now,s.season.number+1,s.season.weeks);this.persist();return this.view();
  }
  configureSeason({name,weeks,goals,supportBonus}){
    const st=this.state,s=st.season;
    if(weeks!==undefined||name!==undefined){const w=int(weeks??s.weeks,1,52);if(w===null)throw new Error('A season lasts 1 to 52 weeks.');const n=clean(name,40);if(n)s.name=n;s.weeks=w;s.endsAt=s.startedAt+w*7*DAY;}
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
  overlay(){this.roll(this.now());return {serverAt:this.now(),panel:this.panelView(),...this.publicView()};}
  view(){
    const s=this.state,missions=s.missions.map(m=>{const p=this.progressFor(m);return {...m,typeLabel:TYPES[m.type].label,unit:TYPES[m.type].unit,started:p.length,completed:p.filter(x=>x.done).length,top:p.slice(0,8)};});
    return {missions,week:{id:s.week.id,endsAt:s.week.id+7*DAY},members:Object.keys(s.members).length,payables:this.payables(),
      season:{number:s.season.number,name:s.season.name,startedAt:s.season.startedAt,endsAt:s.season.endsAt,weeks:s.season.weeks},standings:this.standings(),topPilot:this.topPilot(),hall:s.hall,types:TYPES,panel:this.panelView(),panelKinds:PANEL_KINDS,
      platforms:PLATFORM_OPTIONS,goalMetrics:GOAL_METRICS,goals:this.goalProgress().map(g=>({...g,helpers:g.helpers.slice(0,10)})),supportBonus:s.supportBonus??DEFAULT_SUPPORT_BONUS,
      support:{tracked:Object.keys(s.support||{}).length,updatedAt:s.supportAt||0}};
  }
  // What the public site may show (names are masked later if "Show viewer names" is off).
  publicView(){
    const v=this.view();
    return {season:{name:v.season.name,endsAt:v.season.endsAt,supportBonus:v.supportBonus,standings:v.standings.slice(0,10).map(r=>({rank:r.rank,name:r.name,platform:r.platform,points:r.score,earned:r.points,support:r.support,wins:r.wins})),
        goals:v.goals.map(g=>({title:g.title,metric:g.metric,platform:g.platform,target:g.target,total:g.total,reward:g.reward,reached:g.reached,helpers:g.helpers.length}))},
      hall:v.hall.slice(0,6).map(h=>({name:h.name,endedAt:h.endedAt,champion:h.champion,topPilot:h.topPilot})),
      missions:v.missions.filter(m=>m.enabled).map(m=>({title:m.title,type:m.type,platform:m.platform,target:m.target,reward:m.reward,completed:m.completed})),weekEndsAt:v.week.endsAt};
  }
}
