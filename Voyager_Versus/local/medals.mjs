// Voyager Medals (2.18): medals viewers earn for time with the crew, support and taking part.
// Prestige only: medals never pay points or tickets and never change giveaway odds. Once earned, a medal is kept.
// Every medal has four grades (Bronze, Silver, Gold, Legend); Time & loyalty, Subs & support and the Hall of Honour
// count double towards each viewer's Honour rating.
// Data: the "Voyager - Medals" Streamer.bot action exports (read-only) Community Tracker watch time, months and gifts,
// Fleet Alerts Bits/Kicks/follows/gift drops/Super Chats and confirmed giveaway winners; the host adds points earned
// (Points Ledger via the community module), Voyager Versus records, Dreadnought fights, missions and seasons.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';

const FILE='medals.json',DAY=86400000,HOUR=3600000;
export const GRADE_NAMES=['Bronze','Silver','Gold','Legend'];
export const STARS=[1,2,4,8];
export const SPECIAL_STARS=4;
export const CATEGORIES={
  loyalty:{label:'Time & loyalty',featured:true},support:{label:'Subs & support',featured:true},honour:{label:'Hall of Honour',featured:true},
  games:{label:'Versus & Dreadnought',featured:false},community:{label:'Community',featured:false},special:{label:'Special',featured:false}
};
// kind: count (higher is better), rank (top N viewers; grades are N for Bronze..Legend), special (one-off), secret (one-off, hidden until earned)
export const MEDALS=[
  {id:'watch',name:'Time Watched',cat:'loyalty',kind:'count',unit:'hours',grades:[10,100,500,1500],desc:'Hours watched live (Community Tracker presence)'},
  {id:'follow',name:'Follower Since',cat:'loyalty',kind:'count',unit:'days',grades:[90,365,730,1460],desc:'Days since following, or since Voyager first saw you'},
  {id:'streak',name:'Unbreakable',cat:'loyalty',kind:'count',unit:'streams in a row',grades:[5,15,30,60],desc:'Best run of streams attended in a row'},
  {id:'regular',name:'Regular Pilot',cat:'loyalty',kind:'count',unit:'streams',grades:[10,50,150,400],desc:'Stream days you earned Voyager points'},
  {id:'subs',name:'Loyal Subscriber',cat:'support',kind:'count',unit:'months',grades:[3,12,24,48],desc:'Months subscribed, all time (any platform)'},
  {id:'substreak',name:'Sub Streak',cat:'support',kind:'count',unit:'months in a row',grades:[3,6,12,24],desc:'Months renewed without a lapse'},
  {id:'gifter',name:'Fleet Gifter',cat:'support',kind:'count',unit:'gifted subs',grades:[5,50,250,1000],desc:'Subs or memberships gifted, all time'},
  {id:'giftbomb',name:'Gift Bomb',cat:'support',kind:'count',unit:'subs in one drop',grades:[5,10,25,50],desc:'Most subs gifted in a single drop'},
  {id:'power',name:'Power Supply',cat:'support',kind:'count',unit:'Bits',grades:[1000,10000,50000,250000],desc:'Bits, Kicks and Super Chats (1.00 = 100 Bits)'},
  {id:'goals',name:'Goal Breaker',cat:'support',kind:'count',unit:'season goals',grades:[1,3,10,25],desc:'Season sub goals helped to unlock'},
  {id:'patron',name:'Fleet Patron',cat:'honour',kind:'rank',unit:'rank',grades:[50,25,10,1],desc:'All-time top supporters (months + gifts + Bits ÷ 500)'},
  {id:'elder',name:'Elder of the Fleet',cat:'honour',kind:'rank',unit:'rank',grades:[50,25,10,1],desc:'Longest-serving viewers (hours watched + weeks with the crew)'},
  {id:'seasonpatron',name:'Season Patron',cat:'honour',kind:'count',unit:'seasons',grades:[1,2,4,8],desc:'Top supporter of a season'},
  {id:'versus',name:'Versus Ace',cat:'games',kind:'count',unit:'wins',grades:[1,10,50,200],desc:'Voyager Versus battles won'},
  {id:'hotstreak',name:'Hot Streak',cat:'games',kind:'count',unit:'wins in a row',grades:[3,5,10,15],desc:'Versus wins in a row'},
  {id:'slayer',name:'Dreadnought Slayer',cat:'games',kind:'count',unit:'victories',grades:[1,10,25,50],desc:'Dreadnought victories fought in'},
  {id:'torpedo',name:'Torpedo Run',cat:'games',kind:'count',unit:'torpedoes',grades:[1,10,50,100],desc:'Gifted subs fired as torpedoes in a fight'},
  {id:'topgun',name:'Top Gun',cat:'games',kind:'count',unit:'MVPs',grades:[1,3,10,25],desc:'Fights finished as top damage'},
  {id:'points',name:'Point Collector',cat:'community',kind:'count',unit:'points',grades:[1000,10000,50000,250000],desc:'Voyager points earned, all time'},
  {id:'missions',name:'Mission Runner',cat:'community',kind:'count',unit:'missions',grades:[5,25,100,250],desc:'Weekly missions completed'},
  {id:'spectrum',name:'Full Spectrum',cat:'community',kind:'count',unit:'mission types',grades:[2,3,4,6],desc:'Different mission types completed'},
  {id:'podium',name:'Season Podium',cat:'community',kind:'count',unit:'top-3 finishes',grades:[1,2,4,8],desc:'Seasons finished in the top 3'},
  {id:'champion',name:'Season Champion',cat:'community',kind:'count',unit:'#1 finishes',grades:[1,2,3,5],desc:'Seasons finished at #1'},
  {id:'lucky',name:'Lucky Star',cat:'community',kind:'count',unit:'giveaway wins',grades:[1,3,5,10],desc:'Giveaways won and confirmed'},
  {id:'founding',name:'Founding Crew',cat:'special',kind:'special',desc:'With the crew before Season 2 ends. Can never be earned later.'},
  {id:'firstcontact',name:'First Contact',cat:'special',kind:'special',desc:'Typed !medals for the first time'},
  {id:'laststand',name:'Last Stand',cat:'special',kind:'secret',desc:'Landed the killing blow on the Dreadnought with 15 seconds or less left'},
  {id:'nightwatch',name:'Night Watch',cat:'special',kind:'secret',desc:'Earned Voyager points between midnight and 5 am on five different nights'}
];
// Line icons (24 × 24) for each medal, shared with the membership card's badge wall.
export const MEDAL_ICONS={watch:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v5l3 2',follow:'M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5 M8 14h2 M12 14h2 M16 14h2',
  streak:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 2 3 1-2 1-4 1-7z',regular:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  subs:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',substreak:'M13 2L4 14h7l-1 8 9-12h-7z',
  gifter:'M4 10h16v11H4z M3 7h18v3H3z M12 7v14 M12 7c-2-4-6-3-5 0 M12 7c2-4 6-3 5 0',giftbomb:'M12 2c3 3 4 7 4 11l-4 4-4-4c0-4 1-8 4-11z M8 13l-3 3v3l3-2 M16 13l3 3v3l-3-2',
  power:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v10 M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.2-3 1-3 2.3 1.3 2 3 2 3-.8 3-2',goals:'M5 21V4 M5 4h12l-2 4 2 4H5',
  patron:'M3 8l4 4 5-7 5 7 4-4-2 11H5z',elder:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',seasonpatron:'M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4 M12 14v4 M8 21h8',
  versus:'M4 4l9 9 M4 4h4 M4 4v4 M20 4l-9 9 M20 4h-4 M20 4v4 M7 17l-3 3 M17 17l3 3 M9 15l-2 2 M15 15l2 2',hotstreak:'M13 2L4 14h7l-1 8 9-12h-7z',
  slayer:'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M12 2v4 M12 18v4 M2 12h4 M18 12h4',
  torpedo:'M12 2c3 3 4 7 4 11l-4 4-4-4c0-4 1-8 4-11z M8 13l-3 3v3l3-2 M16 13l3 3v3l-3-2 M12 9v.01',topgun:'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
  points:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v10',missions:'M4 6h16v14H4z M8 12l3 3 5-6',spectrum:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  podium:'M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4 M12 14v4 M8 21h8 M10 18h4',champion:'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
  lucky:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',founding:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',
  firstcontact:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',laststand:'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 8v5 M12 16v.01',
  nightwatch:'M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z',secret:'M9 9a3 3 0 1 1 4 2.8c-.8.4-1 1-1 2v.7 M12 18v.01'};
const BY_ID=Object.fromEntries(MEDALS.map(m=>[m.id,m]));
export function medalById(id){return BY_ID[id]||null;}
export const MEDAL_DEFAULTS={enabled:true,chat:true,toastMin:1,off:[],grades:{}};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0&&n<9e15?n:0;};
const KEY=/^(twitch|youtube|kick):[^\s]{1,128}$/;
export function dayId(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

export function normalizeMedalSettings(raw={},base=MEDAL_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},s=structuredClone(base);
  for(const k of ['enabled','chat'])if(r[k]!==undefined)s[k]=r[k]===true;
  if(r.toastMin!==undefined){const t=Number(r.toastMin);if(![0,1,2,3,4].includes(t))throw new Error('Choose which grades show on stream.');s.toastMin=t;}
  if(r.off!==undefined){if(!Array.isArray(r.off))throw new Error('Unknown medal list.');s.off=[...new Set(r.off.filter(id=>BY_ID[id]))];}
  if(r.grades!==undefined){
    if(!r.grades||typeof r.grades!=='object')throw new Error('Unknown medal grades.');
    const out={};
    for(const [id,g] of Object.entries(r.grades)){
      const m=BY_ID[id];if(!m||!m.grades)continue;
      if(!Array.isArray(g)||g.length!==4)throw new Error(m.name+': give four grade targets.');
      const v=g.map(Number);
      if(v.some(x=>!Number.isInteger(x)||x<1||x>1e9))throw new Error(m.name+': grade targets must be whole numbers from 1.');
      if(m.kind==='rank'?v.some((x,i)=>i&&x>=v[i-1]):v.some((x,i)=>i&&x<=v[i-1]))throw new Error(m.name+(m.kind==='rank'?': each grade needs a smaller top-N than the one before (e.g. 50, 25, 10, 1).':': each grade needs a bigger target than the one before.'));
      if(v.join()!==m.grades.join())out[id]=v;
    }
    s.grades=out;
  }
  return s;
}

export class Medals{
  constructor({dataDir,now=Date.now,say=()=>{}}={}){
    this.dataDir=dataDir;this.now=now;this.say=say;this.state=this.fresh();this.saving=Promise.resolve();this.dirty=false;this.savedAt=0;
    this.community=null;this.startedAt=now();this.lastChatAt=0;this.replyAt=new Map();this.lastReplyAt=0;
  }
  fresh(){return {schema:1,settings:structuredClone(MEDAL_DEFAULTS),viewers:{},pv:{},days:{},versus:{},seen:{},season:{n:0,last:[]},
    foundingOpen:true,backfilled:false,exportAt:0,exportWarnings:[],firstExportSeen:false,recent:[],toasts:[],chat:[],seq:0,createdAt:this.now()};}
  async load(){
    try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));if(raw?.schema===1){this.state={...this.fresh(),...raw};
      try{this.state.settings=normalizeMedalSettings(raw.settings||{});}catch{this.state.settings=structuredClone(MEDAL_DEFAULTS);}}}catch{}
    return this;
  }
  persist(force=false){
    if(!this.dataDir)return this.saving;
    if(!force&&this.now()-this.savedAt<30000){this.dirty=true;return this.saving;}
    this.dirty=false;this.savedAt=this.now();
    const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');
    this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;
  }
  flush(){if(this.dirty)return this.persist(true);return this.saving;}
  grades(m){return this.state.settings.grades[m.id]||m.grades;}
  on(m){return this.state.settings.enabled&&!this.state.settings.off.includes(m.id);}

  // ---------- viewers ----------
  viewer(key,{name='',login='',platform=''}={}){
    if(!KEY.test(key))return null;
    let v=this.state.viewers[key];
    if(!v){v=this.state.viewers[key]={name:clean(name,60)||clean(login,60)||key,login:clean(login,60).toLowerCase(),platform:platform||key.split(':')[0],first:this.now(),c:{},m:{}};}
    if(name)v.name=clean(name,60);if(login)v.login=clean(login,60).toLowerCase();
    return v;
  }
  first(v,at){at=num(at);if(at&&at<v.first)v.first=at;}
  max(v,k,value){value=num(value);if(value>(v.c[k]||0)){v.c[k]=value;return true;}return false;}
  inc(v,k,by=1){v.c[k]=(v.c[k]||0)+by;}
  seen(kind,id,limit=5000){
    const s=this.state.seen[kind]||(this.state.seen[kind]=[]);if(!id||s.includes(id))return true;
    s.push(id);if(s.length>limit)s.splice(0,s.length-limit);return false;
  }

  // ---------- data from the "Voyager - Medals" action ----------
  ingestExport(d){
    if(!d||d.type!=='voyager.medals.data'||d.v!==1)return false;
    const now=this.now();
    for(const r of Array.isArray(d.users)?d.users.slice(0,30000):[]){
      const v=this.viewer(clean(r?.key,140),r);if(!v)continue;this.first(v,r.firstSeenAt);
      this.max(v,'watch',r.watchSeconds);this.max(v,'gifts',r.gifts);
      const months=Math.floor(num(r.months));
      if(months>(v.c.months||0)){
        // Sub streak: renewals that arrive within 45 days of the last one keep the run going.
        const gap=v.c.subAt?now-v.c.subAt:Infinity;
        v.c.substreak=v.c.subAt&&gap<=45*DAY?(v.c.substreak||1)+(months-(v.c.months||0)):1;
        v.c.subBest=Math.max(v.c.subBest||0,v.c.substreak);v.c.months=months;v.c.subAt=now;
      }else if(v.c.subAt&&now-v.c.subAt>45*DAY&&v.c.substreak)v.c.substreak=0;
    }
    for(const r of Array.isArray(d.crew)?d.crew.slice(0,30000):[]){
      const v=this.viewer(clean(r?.key,140),r);if(!v)continue;this.first(v,r.firstSeenAt);
      this.max(v,'bits',r.bits);this.max(v,'kicks',r.kicks);if(num(r.follow))v.c.followed=1;
    }
    for(const g of Array.isArray(d.giftEvents)?d.giftEvents.slice(0,1000):[]){
      if(this.seen('gift',clean(g?.id,80)))continue;const v=this.viewer(clean(g.key,140));if(v)this.max(v,'giftMax',Math.min(num(g.amount),10000));
    }
    for(const c of Array.isArray(d.superChats)?d.superChats.slice(0,1000):[]){
      if(this.seen('sc',clean(c?.id,80)))continue;const v=this.viewer(clean(c.key,140));if(v)this.inc(v,'sc',Math.floor(num(c.micro)/10000));
    }
    for(const w of Array.isArray(d.wins)?d.wins.slice(0,1000):[]){
      if(this.seen('win',clean(w?.id,80)))continue;
      const platform=clean(w.platform,10).toLowerCase(),id=clean(w.userId,128),login=clean(w.login,60).toLowerCase();
      let v=id?this.viewer(platform+':'+id,{name:w.name,login}):null;
      if(!v&&login)v=Object.values(this.state.viewers).find(x=>x.platform===platform&&x.login===login)||null;
      if(v)this.inc(v,'lucky');
    }
    this.state.exportWarnings=(Array.isArray(d.warnings)?d.warnings:[]).slice(0,5).map(w=>clean(w,200));
    if(!this.state.firstExportSeen){this.state.firstExportSeen=true;this.primed=true;}
    this.state.exportAt=num(d.at)||now;this.persist();return true;
  }
  exportSince(){return this.state.exportAt?Math.max(0,this.state.exportAt-10*60000):0;}

  // ---------- data from the host ----------
  observeCommunity(community){
    if(!community?.state)return;this.community=community;const s=community.state,now=this.now();
    // The first time points data arrives, everything it unlocks is history: award it quietly.
    if(!Object.keys(this.state.pv).length&&Object.keys(s.members||{}).length)this.primed=true;
    for(const [key,m] of Object.entries(s.members||{})){
      const v=this.viewer(key,m);if(!v)continue;
      const value=num(m.value),prev=this.state.pv[key];
      this.max(v,'points',value);
      if(prev!==undefined&&value>prev)this.attended(v,now);
      this.state.pv[key]=value;
    }
    // Weekly missions completed (each mission counts once per week).
    let completions=[];try{completions=community.completions();}catch{}
    for(const c of completions){
      if(!c.key||this.seen('mission',s.week.id+'|'+c.missionId+'|'+c.key,50000))continue;
      const v=this.viewer(c.key,{name:c.name});if(!v)continue;this.inc(v,'missions');
      const type=s.missions.find(x=>x.id===c.missionId)?.type;if(type){v.c.mtypes=[...new Set([...(v.c.mtypes||[]),type])];}
    }
    let goals=[];try{goals=community.goalCompletions();}catch{}
    for(const g of goals){if(!g.key||this.seen('goal',s.season.startedAt+'|'+g.missionId+'|'+g.key,20000))continue;const v=this.viewer(g.key,{name:g.name});if(v)this.inc(v,'goals');}
    // Seasons: keep the latest standings; when a new season starts, the last standings of the old one are final.
    const n=s.season.number;
    if(this.state.season.n&&n>this.state.season.n){
      const last=this.state.season.last||[];
      last.forEach((r,i)=>{const v=this.state.viewers[r.key];if(!v)return;if(i<3)this.inc(v,'podium');if(i===0)this.inc(v,'champion');});
      const patron=last.filter(r=>r.support>0).sort((a,b)=>b.support-a.support)[0];
      if(patron&&this.state.viewers[patron.key])this.inc(this.state.viewers[patron.key],'seasonPatron');
    }
    let standings=[];try{standings=community.standings(50);}catch{}
    this.state.season={n,last:standings.slice(0,50).map(r=>({key:r.key,support:r.support||0}))};
    if(n>2)this.state.foundingOpen=false;
  }
  // A viewer earned points today: one stream day. Streaks follow "stream days" (days at least 3 viewers earned points).
  attended(v,now){
    const day=dayId(now),days=this.state.days;
    if(new Date(now).getHours()<5&&v.c.lastNight!==day){v.c.lastNight=day;this.inc(v,'nights');}
    if(v.c.lastDay===day)return;
    days[day]=(days[day]||0)+1;
    const keys=Object.keys(days).sort();if(keys.length>400)for(const k of keys.slice(0,keys.length-400))delete days[k];
    const prev=Object.keys(days).filter(k=>k<day&&days[k]>=3).sort().pop();
    const recent=v.c.ad||[];
    v.c.streak=prev&&recent.includes(prev)?(v.c.streak||0)+1:1;
    v.c.bestStreak=Math.max(v.c.bestStreak||0,v.c.streak);
    v.c.ad=[...recent,day].slice(-6);v.c.lastDay=day;this.inc(v,'days');
  }
  observePilots(rankings){
    for(const p of Array.isArray(rankings)?rankings:[]){
      const login=clean(p?.login,60).toLowerCase();if(!login)continue;
      const wins=Math.floor(num(p.wins)),losses=Math.floor(num(p.losses))+Math.floor(num(p.draws));
      const r=this.state.versus[login];
      if(!r){this.state.versus[login]={wins,losses,streak:0,best:0};continue;}
      if(losses>r.losses)r.streak=0;
      if(wins>r.wins){r.streak+=wins-r.wins;r.best=Math.max(r.best,r.streak);}
      r.wins=wins;r.losses=losses;
    }
  }
  // Called when a real (not preview) Dreadnought fight ends.
  observeBoss(result){
    if(!result||result.demo)return;
    for(const p of Array.isArray(result.pilots)?result.pilots:[]){
      const v=this.viewer(clean(p.key,140),{name:p.name,platform:p.platform});if(!v)continue;
      const fought=p.fires>0||p.bits>0||p.gifts>0;
      if(fought){this.inc(v,'fights');this.inc(v,'damage',Math.floor(num(p.damage)));}
      if(result.outcome==='victory'&&fought)this.inc(v,'slayer');
      if(p.gifts>0)this.inc(v,'torpedo',Math.floor(p.gifts));
      if(result.mvpKey&&result.mvpKey===p.key)this.inc(v,'topgun');
      if(result.outcome==='victory'&&result.lastHit?.key===p.key&&result.endsAt-result.lastHit.at<=15000)v.c.laststand=1;
    }
    this.persist();
  }

  // ---------- working out medals ----------
  metrics(v,now){
    const c=v.c,versus=v.platform==='twitch'&&v.login?this.state.versus[v.login]:null;
    return {watch:(c.watch||0)/3600,follow:Math.floor((now-v.first)/DAY),streak:c.bestStreak||0,regular:c.days||0,subs:c.months||0,substreak:c.subBest||0,
      gifter:c.gifts||0,giftbomb:c.giftMax||0,power:(c.bits||0)+(c.kicks||0)+(c.sc||0),goals:c.goals||0,seasonpatron:c.seasonPatron||0,
      versus:versus?.wins||0,hotstreak:versus?.best||0,slayer:c.slayer||0,torpedo:c.torpedo||0,topgun:c.topgun||0,points:c.points||0,
      missions:c.missions||0,spectrum:(c.mtypes||[]).length,podium:c.podium||0,champion:c.champion||0,lucky:c.lucky||0};
  }
  scores(v,x){return {patron:(v.c.months||0)+(v.c.gifts||0)+Math.floor(x.power/500),elder:x.watch>=10?x.watch+x.follow/7:0};}
  evaluate(){
    const now=this.now(),st=this.state,quiet=!st.backfilled||this.primed;
    if(!st.settings.enabled)return [];
    // Give the first data a couple of minutes to arrive, so history is awarded quietly in one pass.
    if(!st.backfilled&&now-this.startedAt<120000&&(!st.exportAt||!Object.keys(st.pv).length))return [];
    const awarded=[],all=Object.entries(st.viewers),scored=[];
    for(const [key,v] of all){
      const x=this.metrics(v,now);
      for(const m of MEDALS){
        if(!this.on(m)||m.kind==='rank')continue;
        let g=-1;
        if(m.kind==='count'){const t=this.grades(m);for(let i=3;i>=0;i--)if(x[m.id]>=t[i]){g=i;break;}}
        else if(m.id==='founding')g=st.foundingOpen&&(v.c.points||v.c.watch||v.c.months||v.c.days)?0:-1;
        else if(m.id==='firstcontact')g=v.c.fc?0:-1;
        else if(m.id==='laststand')g=v.c.laststand?0:-1;
        else if(m.id==='nightwatch')g=(v.c.nights||0)>=5?0:-1;
        if(g>=0&&(v.m[m.id]?.g??-1)<g)awarded.push(this.award(key,v,m,g,x,now));
      }
      scored.push([key,v,this.scores(v,x)]);
    }
    for(const id of ['patron','elder']){
      const m=BY_ID[id];if(!this.on(m))continue;const t=this.grades(m);
      scored.filter(r=>r[2][id]>0).sort((a,b)=>b[2][id]-a[2][id]).forEach(([key,v],i)=>{
        const rank=i+1;let g=-1;for(let k=3;k>=0;k--)if(rank<=t[k]){g=k;break;}
        if(g>=0&&(v.m[id]?.g??-1)<g)awarded.push(this.award(key,v,m,g,null,now,rank));
      });
    }
    if(awarded.length)this.announce(awarded,quiet);
    if(!st.backfilled){st.backfilled=true;if(awarded.length&&st.settings.chat){const people=new Set(awarded.map(a=>a.key)).size;
      this.queueChat('🏅 Voyager Medals are live! '+people+' viewer'+(people===1?'':'s')+' earned '+awarded.length+' medal'+(awarded.length===1?'':'s')+' from their time with the crew. Type !medals to see yours.');}}
    this.primed=false;
    if(awarded.length)this.persist();else if(this.dirty)this.persist();
    return awarded;
  }
  award(key,v,m,g,x,now,rank){
    v.m[m.id]={g,at:now};
    return {id:++this.state.seq,key,name:v.name,platform:v.platform,medal:m.id,title:m.name,grade:g,special:m.kind==='special'||m.kind==='secret',at:now,rank:rank||0};
  }
  label(a){const m=BY_ID[a.medal];return m.kind==='special'||m.kind==='secret'?m.name:m.name+' '+GRADE_NAMES[a.grade];}
  announce(list,quiet){
    const st=this.state;
    st.recent=[...list.slice().reverse(),...st.recent].slice(0,100);
    if(quiet)return;
    for(const a of list){
      if(st.settings.chat)st.chat.push({at:a.at,text:a.name+' earned '+this.label(a)});
      if(st.settings.toastMin<4&&(a.special||a.grade>=st.settings.toastMin))st.toasts.push(this.toastOf(a));
    }
    st.chat=st.chat.slice(-60);st.toasts=st.toasts.slice(-40);
  }
  toastOf(a){
    const m=BY_ID[a.medal],v=this.state.viewers[a.key],t=m.grades?this.grades(m):null;
    let next='';
    if(m.kind==='count'&&a.grade<3&&v){const x=this.metrics(v,this.now())[m.id],need=t[a.grade+1]-x;next='Next: '+GRADE_NAMES[a.grade+1]+' at '+t[a.grade+1].toLocaleString('en')+' '+m.unit+(need>0?' · '+Math.ceil(need).toLocaleString('en')+' to go':'');}
    if(m.kind==='rank')next='#'+a.rank+' in the Hall of Honour';
    return {id:a.id,at:a.at,name:a.name,platform:a.platform,medal:m.id,title:m.name,cat:m.cat,grade:a.grade,gradeName:a.special?'Special':GRADE_NAMES[a.grade],special:a.special,upgrade:a.grade>0&&!a.special,desc:m.desc,next};
  }
  queueChat(text){this.state.chat.push({at:this.now(),text:clean(text,440),raw:true});}
  // Chat: grouped, at most one line every 20 seconds; anything older than 10 minutes is dropped.
  tickChat(){
    const st=this.state,now=this.now();if(now-this.lastChatAt<20000||!st.chat.length)return null;
    st.chat=st.chat.filter(c=>now-c.at<10*60000);if(!st.chat.length)return null;
    let text;
    if(st.chat[0].raw)text=st.chat.shift().text;
    else{const batch=[];while(st.chat.length&&!st.chat[0].raw&&batch.length<4)batch.push(st.chat.shift().text);
      text='🏅 '+batch.join(' · ')+(st.chat.some(c=>!c.raw)?' · and more':'')+'! Type !medals to see yours.';}
    this.lastChatAt=now;try{this.say(text.slice(0,450));}catch{}
    return text;
  }

  // ---------- viewers asking ----------
  honour(v){
    let total=0;
    for(const [id,e] of Object.entries(v.m||{})){const m=BY_ID[id];if(!m)continue;total+=m.kind==='special'||m.kind==='secret'?SPECIAL_STARS:STARS[e.g]*(CATEGORIES[m.cat].featured?2:1);}
    return total;
  }
  leaderboard(limit=25){
    return Object.entries(this.state.viewers).map(([key,v])=>({key,name:v.name,platform:v.platform,honour:this.honour(v),medals:Object.keys(v.m).length,legend:Object.values(v.m).filter((e,i)=>e.g===3).length}))
      .filter(r=>r.honour>0).sort((a,b)=>b.honour-a.honour||b.medals-a.medals||a.name.localeCompare(b.name)).slice(0,limit).map((r,i)=>({rank:i+1,...r}));
  }
  summary(key){
    const v=this.state.viewers[key];if(!v)return null;const now=this.now(),x=this.metrics(v,now);
    const list=Object.entries(v.m).map(([id,e])=>({id,...e,m:BY_ID[id]})).filter(e=>e.m);
    const counts=[0,0,0,0];for(const e of list)if(e.m.grades)counts[e.g]++;
    const latest=list.sort((a,b)=>b.at-a.at)[0];
    let best=null;
    for(const m of MEDALS){if(m.kind!=='count'||!this.on(m))continue;const t=this.grades(m),g=v.m[m.id]?.g??-1;if(g>=3)continue;
      const target=t[g+1],progress=x[m.id]/target;if(!best||progress>best.progress)best={m,grade:g+1,need:Math.ceil(target-x[m.id]),progress};}
    const board=this.leaderboard(1000),place=board.find(r=>r.key===key)?.rank||0;
    return {v,count:list.length,counts,latest,best,honour:this.honour(v),place};
  }
  command(ev){
    if(!ev||ev.kind!=='medals'||!this.state.settings.enabled)return null;
    const platform=clean(ev.platform,10).toLowerCase();if(!['twitch','youtube','kick'].includes(platform))return null;
    const id=clean(ev.userId,128),login=clean(ev.login,60).toLowerCase(),name=clean(ev.name||ev.login,60);
    let key=id?platform+':'+id:'';
    if(!key||!this.state.viewers[key]){const found=Object.entries(this.state.viewers).find(([,v])=>v.platform===platform&&login&&v.login===login);if(found)key=found[0];}
    if(!key)return null;
    const now=this.now();if(now-(this.replyAt.get(key)||0)<30000||now-this.lastReplyAt<3000)return null;
    this.replyAt.set(key,now);this.lastReplyAt=now;if(this.replyAt.size>2000)this.replyAt.delete(this.replyAt.keys().next().value);
    const v=this.viewer(key,{name,login,platform});if(!v.c.fc){v.c.fc=1;this.persist();}
    const s=this.summary(key),who=platform==='twitch'&&login?'@'+login:name;
    const next=s.best?' · closest next: '+s.best.m.name+' '+GRADE_NAMES[s.best.grade]+' ('+s.best.need.toLocaleString('en')+' '+s.best.m.unit+' to go)':'';
    let text;
    if(!s.count)text=who+' 🏅 no medals yet. Watch, take part and support the stream to earn them'+next+'.';
    else{const parts=[];for(let g=3;g>=0;g--)if(s.counts[g])parts.push(s.counts[g]+' '+GRADE_NAMES[g]);
      text=who+' 🏅 '+s.count+' medal'+(s.count===1?'':'s')+(parts.length?' ('+parts.join(', ')+')':'')+' · ★ '+s.honour+' honour'+(s.place?', #'+s.place+' in the Hall of Honour':'')+
        (s.latest?' · latest: '+(s.latest.m.grades?s.latest.m.name+' '+GRADE_NAMES[s.latest.g]:s.latest.m.name):'')+next;}
    try{this.say(text.slice(0,450));}catch{}
    return text;
  }

  // ---------- control page and OBS ----------
  configure(raw){this.state.settings=normalizeMedalSettings({...this.state.settings,...raw},this.state.settings);this.persist(true);return this.view();}
  preview(){
    const toast={id:++this.state.seq,at:this.now(),name:'NebulaKnight',platform:'twitch',medal:'slayer',title:'Dreadnought Slayer',cat:'games',grade:1,gradeName:'Silver',special:false,upgrade:true,
      desc:BY_ID.slayer.desc,next:'Next: Gold at 25 victories · 15 to go',preview:true};
    this.state.toasts.push(toast);this.state.toasts=this.state.toasts.slice(-40);return toast;
  }
  overlay(){const now=this.now();return {serverAt:now,toasts:this.state.toasts.filter(t=>now-t.at<5*60000)};}
  catalogue(){
    const counts={};for(const v of Object.values(this.state.viewers))for(const [id,e] of Object.entries(v.m)){(counts[id]||(counts[id]=[0,0,0,0]))[e.g]++;}
    return MEDALS.map(m=>({id:m.id,name:m.name,cat:m.cat,category:CATEGORIES[m.cat].label,featured:CATEGORIES[m.cat].featured,kind:m.kind,unit:m.unit||'',desc:m.desc,
      defaults:m.grades||null,grades:m.grades?this.grades(m):null,on:!this.state.settings.off.includes(m.id),earned:counts[m.id]||[0,0,0,0]}));
  }
  view(){
    const st=this.state,viewers=Object.values(st.viewers);
    return {settings:st.settings,catalogue:this.catalogue(),gradeNames:GRADE_NAMES,stars:STARS,categories:CATEGORIES,
      recent:st.recent.slice(0,30).map(a=>({...a,label:this.label(a)})),leaderboard:this.leaderboard(25),
      stats:{viewers:viewers.length,withMedals:viewers.filter(v=>Object.keys(v.m).length).length,medals:viewers.reduce((n,v)=>n+Object.keys(v.m).length,0)},
      sources:{exportAt:st.exportAt,warnings:st.exportWarnings,community:!!this.community,members:Object.keys(st.pv).length},backfilled:st.backfilled,foundingOpen:st.foundingOpen};
  }
  publicView(){return {leaderboard:this.leaderboard(10).map(({key,...r})=>r)};}
}
