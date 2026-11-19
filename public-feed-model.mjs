// Voyager public website feed: the ONLY data that leaves this PC for the public site.
// Everything is rebuilt field-by-field from an allow-list. Stream statistics (viewers,
// followers, subscriptions, watch time, revenue), user IDs, chat, security data, audit
// logs are never included. Since 2.29.0 a ticketed giveaway can list its ticket holders (display name, tickets, progress
// toward the next ticket) when "Show viewer names" and the "Ticket holders" switch are on; ids, logins and watch totals stay private.

export const SCHEMA=1;
export const LIMITS={title:120,name:60,text:600,short:160,command:40,url:300,giveaways:8,winners:15,leaders:10,tiers:8,commands:12,holders:150};
// Ticketed giveaways: one ticket per 10 minutes watched; a holder counts as "earning now" if time was credited in the last 6 minutes.
const TICKET_MS=600000,TICKET_SEEN_MS=360000;
const PLATFORMS={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const GROUPS={blue:'Blue',silver:'Silver',gold:'Gold',platinum:'Platinum',vip:'Ruby VIP'};
const GOALS=['silver','gold','platinum'];
const KINDS=['impromptu','members','tickets'];
const STATUSES=['open','paused','closed','drawing','winner','ended'];
const VERSUS=['ready','cooldown','live','offline'];

export const DEFAULT_SETTINGS=Object.freeze({
  channelName:'MDA009',
  tagline:'Explore · Earn · Excel. Giveaways, points and Voyager Versus for the MDA009 community.',
  links:{twitch:'',youtube:'',kick:'',discord:'',website:''},
  sections:{giveaways:true,winners:true,goals:true,points:true,pilots:true,versus:true,program:true,missions:true,season:true,live:true,dreadnought:true,ranks:true,medals:true,crew:true,activity:true,squadrons:true,log:true,intel:true,requests:true,quiz:true,tickets:true},
  showNames:true,
  leaderboardSize:10,
  commands:{impromptu:'!enter',tickets:'!entergiveaway',versus:'!versus'},
  goalNames:{silver:'Silver giveaway pool',gold:'Gold giveaway pool',platinum:'Platinum giveaway pool'},
  program:{
    intro:'Voyager is the MDA009 membership program. Take part on stream, earn Voyager points and move up through the membership groups.',
    tiers:[{key:'blue',name:'Blue',description:''},{key:'silver',name:'Silver',description:''},{key:'gold',name:'Gold',description:''},{key:'platinum',name:'Platinum',description:''},{key:'vip',name:'Ruby VIP',description:''}],
    commands:[
      {command:'!enter',description:'Join an open giveaway from chat on Twitch, YouTube or Kick (!ticket also works).'},
      {command:'!entergiveaway',description:'Join a ticketed giveaway and collect tickets while you watch.'},
      {command:'!versus',description:'Call a Voyager Versus battle, or answer one to fly as the challenger.'}
    ]
  },
  publish:{enabled:false,repo:'',siteUrl:''}
});

// ---------- small validators ----------
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const int=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>{const n=Math.round(Number(v));return Number.isFinite(n)?Math.min(max,Math.max(min,n)):null;};
const time=v=>{const n=int(v,0);return n&&n>946684800000&&n<4102444800000?n:null;};
const bool=v=>v===true;
const oneOf=(v,list,fallback=null)=>list.includes(v)?v:fallback;
export function safeUrl(v){
  const s=clean(v,LIMITS.url);if(!s)return '';
  try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}
}
const command=v=>{const s=clean(v,LIMITS.command);return /^![A-Za-z0-9_]{1,30}$/.test(s)?s:'';};
export function initials(name){
  const s=clean(name,LIMITS.name);if(!s)return 'Viewer';
  return s[0].toUpperCase()+'•'.repeat(Math.min(5,Math.max(2,s.length-1)));
}
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h.toString(36);};

// ---------- settings ----------
export function normalizeSettings(raw={}){
  const d=DEFAULT_SETTINGS,r=raw&&typeof raw==='object'?raw:{};
  const pick=(obj,key,fallback)=>obj&&typeof obj==='object'&&key in obj?obj[key]:fallback;
  const s={
    channelName:clean(pick(r,'channelName',d.channelName),LIMITS.name)||d.channelName,
    tagline:clean(pick(r,'tagline',d.tagline),LIMITS.short),
    links:{},sections:{},
    showNames:pick(r,'showNames',d.showNames)!==false,
    leaderboardSize:int(pick(r,'leaderboardSize',d.leaderboardSize),3,LIMITS.leaders)??d.leaderboardSize,
    commands:{},goalNames:{},
    program:{intro:clean(pick(r.program,'intro',d.program.intro),LIMITS.text),tiers:[],commands:[]},
    publish:{enabled:bool(pick(r.publish,'enabled',false)),repo:'',siteUrl:''}
  };
  for(const k of Object.keys(d.links))s.links[k]=safeUrl(pick(r.links,k,''));
  for(const k of Object.keys(d.sections))s.sections[k]=pick(r.sections,k,d.sections[k])!==false;
  for(const k of Object.keys(d.commands))s.commands[k]=command(pick(r.commands,k,d.commands[k]))||d.commands[k];
  for(const k of GOALS)s.goalNames[k]=clean(pick(r.goalNames,k,d.goalNames[k]),LIMITS.name)||d.goalNames[k];
  const tiers=Array.isArray(r.program?.tiers)?r.program.tiers:d.program.tiers;
  for(const t of tiers.slice(0,LIMITS.tiers)){const name=clean(t?.name,LIMITS.name);if(name)s.program.tiers.push({key:oneOf(t?.key,Object.keys(GROUPS),'custom'),name,description:clean(t?.description,LIMITS.short)});}
  const cmds=Array.isArray(r.program?.commands)?r.program.commands:d.program.commands;
  for(const c of cmds.slice(0,LIMITS.commands)){const cmd=command(c?.command);if(cmd)s.program.commands.push({command:cmd,description:clean(c?.description,LIMITS.short)});}
  // Your own address for the site, e.g. https://voyager.theunprofessionalsgroup.com/ (site root only).
  const site=safeUrl(pick(r.publish,'siteUrl',''));
  if(site){const u=new URL(site);s.publish.siteUrl=u.origin+'/';}
  const repo=clean(pick(r.publish,'repo',''),140);
  if(/^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9_.-]{1,100}$/.test(repo))s.publish.repo=repo;
  return s;
}

// ---------- projections from the saved engine states (run in the control page) ----------
const list=v=>Array.isArray(v)?v:[];
function platformsText(keys){const names=keys.map(k=>PLATFORMS[k]).filter(Boolean);return names.length?names.length>1?names.slice(0,-1).join(', ')+' or '+names.at(-1):names[0]:'';}
function groupsText(keys){const names=keys.map(k=>GROUPS[k]).filter(Boolean);return names.length?(names.length>1?names.slice(0,-1).join(', ')+' and '+names.at(-1):names[0])+' members':'Voyager members';}
function winnerOf(draw){
  // Only confirmed winners are public, so the site never spoils an on-stream reveal or shows a re-rolled pick.
  if(!draw||draw.status!=='confirmed'||!draw.winner)return null;
  const name=clean(draw.winner.name,LIMITS.name);return name?{name,platform:oneOf(draw.winner.platform,Object.keys(PLATFORMS),'')}:null;
}

// ---------- fair-draw proof (Giveaway Engine v9) ----------
// Published only after a pick is settled, so the site can never reveal a winner before the on-stream reveal.
// Entrant names are published only when "Show viewer names" is on (they are needed to re-check the draw).
const HEX64=/^[0-9a-f]{64}$/,PROOF_LIST=5000,PROOF_DRAWS=64;
const proofText=(v,max)=>typeof v==='string'&&v.length<=max&&!/[\u0000-\u001f\u007f-\u009f]/.test(v)?v:null;
export function projectProof(session,settings=DEFAULT_SETTINGS){
  const p=session?.proof;if(!p||(p.version!==1&&p.version!==2)||!HEX64.test(p.commitment||''))return null;
  const seeds=list(p.seeds),names=settings.showNames===true;
  const draws=list(session.draws).filter(d=>d?.proof&&Number.isInteger(d.proof.n)).map(d=>{
    if(d.status==='selected')return {n:d.proof.n,seed:null,index:null,winner:null,status:'pending'};
    const confirmed=d.status==='confirmed';
    return {n:d.proof.n,seed:seeds[d.proof.n-1]||null,index:d.proof.index,winner:confirmed&&names?d.winner?.name??null:null,status:confirmed?'confirmed':'redrawn'};
  });
  return {version:p.version,committedAt:p.committedAt,commitment:p.commitment,poolHash:p.poolHash,size:p.size,noWin:p.noWin||0,entrants:names&&Array.isArray(p.entrants)?p.entrants:null,draws};
}
export function sanitizeProof(p){
  if(!p||(p.version!==1&&p.version!==2)||!HEX64.test(p.commitment||'')||!HEX64.test(p.poolHash||''))return null;
  const size=int(p.size,0,50000);if(size===null)return null;
  // v2: an entry [platform, name, 1] entered but could not be drawn (won an impromptu giveaway recently).
  const v2=p.version===2,noWin=v2?int(p.noWin,0,size)??0:0;
  let entrants=null;
  if(Array.isArray(p.entrants)&&p.entrants.length===size&&size<=PROOF_LIST){
    entrants=p.entrants.map(e=>Array.isArray(e)&&(e.length===2||v2&&e.length===3&&e[2]===1)&&proofText(e[0],20)!==null&&proofText(e[1],100)!==null?(e.length===3?[e[0],e[1],1]:[e[0],e[1]]):null);
    if(entrants.some(e=>!e))entrants=null;
  }
  const draws=list(p.draws).slice(0,PROOF_DRAWS).map(d=>{
    const n=int(d?.n,1,PROOF_DRAWS),status=oneOf(d?.status,['confirmed','redrawn','pending']);if(n===null||!status)return null;
    if(status==='pending')return {n,seed:null,index:null,winner:null,status};
    const seed=HEX64.test(d.seed||'')?d.seed:null,index=int(d.index,0,50000);if(!seed||index===null)return null;
    return {n,seed,index,winner:status==='confirmed'?proofText(d.winner,100):null,status};
  });
  if(draws.some(d=>!d))return null;
  return {version:v2?2:1,committedAt:time(p.committedAt),commitment:p.commitment,poolHash:p.poolHash,size,...(v2?{noWin}:{}),entrants,draws};
}
// Hides names in a stored proof when "Show viewer names" is off.
export function publicProof(p,settings){const s=normalizeSettings(settings);return s.showNames?p:{...p,entrants:null,draws:p.draws.map(d=>({...d,winner:null}))};}

export function projectGiveaway(state,settings=DEFAULT_SETTINGS,now=Date.now()){
  const session=state?.session||state?.preview;if(!session)return null;
  const preview=!state.session,chat=session.mode==='chat';
  const draws=list(session.draws),draw=draws.find(d=>d.id===session.currentDrawId)||draws.at(-1)||null;
  const winner=winnerOf(draw);
  let status,label;
  if(winner){status='winner';label='Winner confirmed';}
  else if(draw&&['selected','rerolled','not_confirmed','pending','submitted'].includes(draw.status)){status='drawing';label='Winner being drawn on stream';}
  else if(chat){status=session.entriesOpen?'open':'closed';label=session.entriesOpen?'Entries open':'Entries closed';}
  else{status=preview?'open':'closed';label=preview?'Members entered automatically':'Pool locked';}
  const pool=list(session.pool);
  return {
    id:'g'+hash(session.id||session.createdAt||'giveaway'),kind:chat?'impromptu':'members',
    title:clean(session.title,LIMITS.title)||'Voyager giveaway',status,label,
    enter:chat&&status==='open'?settings.commands.impromptu:'',
    eligibility:chat?'Everyone in chat on '+platformsText(['twitch','youtube','kick']):groupsText(list(session.groups)),
    entrants:pool.length,tickets:null,startedAt:time(session.createdAt),closesAt:null,winner,
    proof:preview?null:projectProof(session,settings)
  };
}

export function projectTicket(state,settings=DEFAULT_SETTINGS,now=Date.now()){
  const c=state?.campaign;if(!c)return null;
  const saved=c.status||'unknown',endsAt=time(c.endsAt);
  const expired=['open','paused'].includes(saved)&&endsAt&&now>=endsAt;
  const draws=list(c.draws),draw=draws.at(-1)||null,winner=winnerOf(draw);
  const confirmed=[...draws].reverse().find(d=>d.status==='confirmed');
  let status,label;
  if(saved==='completed'){
    // Keep a finished campaign visible for two days, then it lives on in Recent winners only.
    const ended=time(confirmed?.at)||endsAt||0;if(ended&&now-ended>2*86400000)return null;
    status='ended';label='Giveaway ended';
  }
  else if(winner){status='winner';label='Winner confirmed';}
  else if(draw&&['selected','rerolled'].includes(draw.status)){status='drawing';label='Winner being drawn on stream';}
  else if(expired||saved==='locked'||saved==='drawn'){status='closed';label='Ticket collection closed';}
  else if(saved==='paused'){status='paused';label='Ticket collection paused';}
  else if(saved==='open'){status='open';label='Collecting tickets';}
  else return null;
  const users=Object.values(c.users&&typeof c.users==='object'?c.users:{});
  // 2.29.0 ticket holders: who has entered, how many tickets each holds and how far each is toward the next one — the same
  // time bar as the Ticket Giveaway page. Only with "Show viewer names" and the "Ticket holders" switch on. Display name,
  // platform, ticket count and progress only: never an account id, login or total watch time.
  let holders=null,holdersMore=0;
  if(settings.showNames===true&&settings.sections?.tickets!==false){
    const collecting=status==='open';
    const rows=users.filter(u=>u&&!u.blocked&&clean(u.name||u.login,LIMITS.name)).map(u=>{
      const credited=time(u.watchUpdatedAt)||0,on=collecting&&credited>0&&now-credited<TICKET_SEEN_MS&&now>=credited;
      return {name:clean(u.name||u.login,LIMITS.name),platform:oneOf(u.platform,Object.keys(PLATFORMS),''),tickets:int(u.tickets,0)||0,
        ms:(int(u.watchMs,0)||0)%TICKET_MS+(on?now-credited:0),on};
    }).sort((x,y)=>y.tickets-x.tickets||x.name.localeCompare(y.name));
    holders=rows.slice(0,LIMITS.holders);holdersMore=rows.length-holders.length;
  }
  return {
    rateMs:TICKET_MS,asOf:now,holders,holdersMore,
    id:'t'+hash(c.id||c.startedAt||'tickets'),kind:'tickets',
    title:clean(c.title,LIMITS.title)||'Voyager ticket giveaway',status,label,
    enter:status==='open'?settings.commands.tickets:'',
    eligibility:'Viewers on '+(platformsText(list(c.platforms))||'stream'),
    entrants:users.length,tickets:users.reduce((a,u)=>a+(int(u?.tickets,0)||0),0),
    startedAt:time(c.startedAt),closesAt:['open','paused'].includes(status)?endsAt:null,
    winner:status==='ended'?winnerOf(confirmed):winner
  };
}

export function projectPoints(data,settings=DEFAULT_SETTINGS){
  const leaders=list(data?.users)
    .filter(u=>u&&u.pointsFresh!==false&&Number.isFinite(Number(u.points))&&Number(u.points)>0)
    .sort((a,b)=>Number(b.points)-Number(a.points)||String(a.name).localeCompare(String(b.name)))
    .slice(0,settings.leaderboardSize)
    .map(u=>({name:clean(u.name||u.login,LIMITS.name),platform:oneOf(u.platform,Object.keys(PLATFORMS),''),value:int(u.points,0)}));
  const goals=[];
  for(const k of GOALS){const b=data?.buckets?.[k];const points=int(b?.points,0),target=int(b?.target,1);if(b&&!b.error&&points!==null&&target)goals.push({key:k,name:settings.goalNames[k],points,target});}
  return {leaders,goals};
}

export function projectPilots(records,size=10){
  return list(records).filter(p=>p&&Number.isSafeInteger(p.battles)&&p.battles>0)
    .sort((a,b)=>b.wins-a.wins||a.losses-b.losses||String(a.name).localeCompare(String(b.name)))
    .slice(0,size).map(p=>({name:clean(p.name||p.login,LIMITS.name),wins:int(p.wins,0),losses:int(p.losses,0),draws:int(p.draws,0),battles:int(p.battles,0)}));
}

// ---------- strict re-validation (run on the host before anything is stored or uploaded) ----------
function cleanWinner(w){if(!w)return null;const name=clean(w.name,LIMITS.name);return name?{name,platform:oneOf(w.platform,Object.keys(PLATFORMS),'')}:null;}
export function sanitizeGiveaway(g){
  if(!g||typeof g!=='object')return null;
  const status=oneOf(g.status,STATUSES),kind=oneOf(g.kind,KINDS);if(!status||!kind)return null;
  return {id:clean(g.id,16).replace(/[^a-z0-9]/gi,'')||'g',kind,title:clean(g.title,LIMITS.title)||'Voyager giveaway',status,label:clean(g.label,LIMITS.name),
    enter:status==='open'?command(g.enter):'',eligibility:clean(g.eligibility,LIMITS.short),
    entrants:int(g.entrants,0,1e7)??0,tickets:kind==='tickets'?int(g.tickets,0,1e12)??0:null,
    startedAt:time(g.startedAt),closesAt:time(g.closesAt),winner:['winner','ended'].includes(status)?cleanWinner(g.winner):null,
    ...(kind==='tickets'&&Array.isArray(g.holders)?{rateMs:TICKET_MS,asOf:time(g.asOf),holdersMore:int(g.holdersMore,0,1e7)??0,
      holders:g.holders.slice(0,LIMITS.holders).map(h=>({name:clean(h?.name,LIMITS.name),platform:oneOf(h?.platform,Object.keys(PLATFORMS),''),tickets:int(h?.tickets,0,1e9)??0,
        ms:int(h?.ms,0,TICKET_MS+TICKET_SEEN_MS)??0,on:status==='open'&&h?.on===true})).filter(h=>h.name)}:{}),
    proof:sanitizeProof(g.proof)};
}
// What the control page may send: giveaways and points only. Everything else is added by the host.
export function sanitizeCollected(raw){
  const r=raw&&typeof raw==='object'?raw:{};
  const giveaways=list(r.giveaways).slice(0,LIMITS.giveaways).map(sanitizeGiveaway).filter(Boolean);
  const leaders=list(r.points?.leaders).slice(0,LIMITS.leaders).map(l=>({name:clean(l?.name,LIMITS.name),platform:oneOf(l?.platform,Object.keys(PLATFORMS),''),value:int(l?.value,0)??0})).filter(l=>l.name);
  const goals=list(r.points?.goals).filter(g=>GOALS.includes(g?.key)).slice(0,3).map(g=>({key:g.key,name:clean(g.name,LIMITS.name),points:int(g.points,0)??0,target:int(g.target,1)??1}));
  return {giveaways,points:{available:r.points?.available===true,leaders,goals},sources:{giveaway:r.sources?.giveaway===true,tickets:r.sources?.tickets===true,points:r.sources?.points===true}};
}

export function buildFeed({collected,settings,pilots=[],versus=null,winners=[],online=true,now=Date.now(),proofIds=new Set(),community=null,companion=null,crewCount=0,crewAt=0}){
  const s=normalizeSettings(settings),c=sanitizeCollected(collected),show=s.sections;
  const name=n=>s.showNames?n:initials(n);
  const feed={schema:SCHEMA,generatedAt:now,online:online===true,
    channel:{name:s.channelName,tagline:s.tagline,links:Object.fromEntries(Object.entries(s.links).filter(([,v])=>v))},
    sections:{...show},giveaways:[],winners:[],goals:[],leaderboards:{points:[],pilots:[]},versus:null,program:null,missions:null,season:null};
  // The full proof is uploaded as its own file (proofs/<id>.json); the feed carries a short summary.
  // Ticket holders are names, so the host drops them again here if names or the switch were turned off after the page collected them.
  if(show.giveaways)feed.giveaways=c.giveaways.map(({proof,holders,holdersMore,rateMs,asOf,...g})=>({...g,...(holders&&s.showNames&&show.tickets?{holders,holdersMore,rateMs,asOf}:{}),winner:g.winner?{...g.winner,name:name(g.winner.name)}:null,
    fairDraw:proof?{id:g.id,commitment:proof.commitment,committedAt:proof.committedAt,size:proof.size}:null}));
  if(show.winners)feed.winners=list(winners).slice(0,LIMITS.winners).map(w=>({title:clean(w?.title,LIMITS.title),name:name(clean(w?.name,LIMITS.name)),platform:oneOf(w?.platform,Object.keys(PLATFORMS),''),at:time(w?.at),
    proof:typeof w?.gid==='string'&&proofIds.has(w.gid)?w.gid:null})).filter(w=>w.name&&w.at);
  if(show.goals)feed.goals=c.points.goals;
  if(show.points)feed.leaderboards.points=c.points.leaders.slice(0,s.leaderboardSize).map((l,i)=>({rank:i+1,name:name(l.name),platform:l.platform,value:l.value}));
  // 2.35.0: when the host knows lifetime points, the points board is ranked by lifetime (what naval ranks use) and carries
  // the balance (what can be spent) beside it. `value` stays the ranking number for older copies of the page.
  if(show.points){const top=list(companion?.ranks?.top).map(x=>({n:clean(x?.name,LIMITS.name),platform:oneOf(x?.platform,Object.keys(PLATFORMS),''),lifetime:int(x?.lifetime,0,1e12)??0,balance:Number.isFinite(Number(x?.balance))&&x?.balance!==null?int(x.balance,0,1e12):null})).filter(x=>x.n&&x.lifetime>0);
    if(top.length)feed.leaderboards.points=top.slice(0,s.leaderboardSize).map((x,i)=>({rank:i+1,name:name(x.n),platform:x.platform,value:x.lifetime,lifetime:x.lifetime,balance:x.balance}));}
  if(show.pilots)feed.leaderboards.pilots=projectPilots(pilots,s.leaderboardSize).map((p,i)=>({rank:i+1,...p,name:name(p.name)}));
  if(show.versus&&versus){const st=oneOf(versus.status,VERSUS,'offline');feed.versus={status:st,cooldownUntil:st==='cooldown'?time(versus.cooldownUntil):null,command:s.commands.versus,winnerPoints:int(versus.winnerPoints,0,1e6)};}
  // Missions and seasons (2.13): counts and top-10 standings only; names follow "Show viewer names".
  if(community&&typeof community==='object'){
    const person=p=>p&&clean(p.name,LIMITS.name)?{name:name(clean(p.name,LIMITS.name)),platform:oneOf(p.platform,Object.keys(PLATFORMS),'')}:null;
    if(show.missions&&Array.isArray(community.missions))feed.missions={endsAt:time(community.weekEndsAt),list:community.missions.slice(0,8).map(m=>({title:clean(m.title,40),type:oneOf(m.type,['streamDays','earnPoints','versusWins','subscribe','giftSubs','loyalSub','watchHours','chatMessages','streamStreak','dreadFights','dreadVictory','dreadDamage','dreadMvp','torpedo','prospectRuns','prospectGold','prospectRocks','bountyHunts','bountyCaptures'],'earnPoints'),medal:typeof m.medal==='string'&&/^[a-z]{2,20}$/.test(m.medal)?m.medal:'',platform:oneOf(m.platform,['all','twitch','youtube','kick'],'all'),target:int(m.target,1,1e7)??1,reward:int(m.reward,0,50)??0,completed:int(m.completed,0,1e7)??0})).filter(m=>m.title)};
    if(show.season&&community.season)feed.season={name:clean(community.season.name,40),endsAt:time(community.season.endsAt),startedAt:time(community.season.startedAt),active:community.season.active!==false,
      standings:list(community.season.standings).slice(0,10).map((r,i)=>({rank:i+1,...person(r),points:int(r.points,0,1e12)??0,support:int(r.support,0,1e9)??0,wins:int(r.wins,0,1e9)??0})).filter(r=>r.name),
      supportBonus:int(community.season.supportBonus,0,1e5)??0,
      // Sub goals: community totals and how many people helped (never who).
      goals:list(community.season.goals).slice(0,8).map(g=>({title:clean(g.title,40),description:clean(g.description,120),metric:oneOf(g.metric,['support','subs','gifts','points','versus'],'support'),platform:oneOf(g.platform,['all','twitch','youtube','kick'],'all'),target:int(g.target,1,1e9)??1,total:int(g.total,0,1e12)??0,reward:int(g.reward,0,1e6)??0,reached:g.reached===true,missed:g.missed===true,dueAt:time(g.dueAt),helpers:int(g.helpers,0,1e7)??0})).filter(g=>g.title),
      hall:list(community.hall).slice(0,6).map(h=>({name:clean(h.name,40),endedAt:time(h.endedAt),champion:h.champion?{...person(h.champion),points:int(h.champion.points,0,1e12)??0}:null,topPilot:h.topPilot?{name:name(clean(h.topPilot.name,LIMITS.name)),wins:int(h.topPilot.wins,0,1e9)??0}:null}))};
  }
  if(companion&&typeof companion==='object')Object.assign(feed,projectCompanion(companion,s,online===true,crewCount,crewAt));
  if(show.program)feed.program={intro:s.program.intro,tiers:s.program.tiers.map(t=>({key:t.key,name:t.name,description:t.description})),commands:s.program.commands.map(c=>({...c}))};
  return feed;
}

// Records newly confirmed winners from incoming giveaways (kept by the host, newest first).
export function mergeWinners(previous,giveaways,now=Date.now()){
  const out=list(previous).slice(),seen=new Set(out.map(w=>w.key));
  for(const g of giveaways){
    if(!g.winner)continue;const key=g.id+':'+g.winner.name;
    if(seen.has(key))continue;seen.add(key);
    out.unshift({key,gid:g.id,title:g.title,name:g.winner.name,platform:g.winner.platform,at:now});
  }
  return out.slice(0,LIMITS.winners);
}

// Code to paste into a website builder's custom-code section (e.g. Fourthwall > Custom code).
// The frame grows to fit the Voyager site; messages from any other origin are ignored.
export function embedSnippet(siteUrl){
  const site=safeUrl(siteUrl);if(!site)return '';
  const origin=new URL(site).origin,src=origin+new URL(site).pathname.replace(/\/?$/,'/')+'?embed=1';
  return `<div style="max-width:1100px;margin:0 auto;padding:0 12px">
  <iframe id="voyager-frame" src="${src}" title="Voyager giveaways, winners and leaderboards" loading="lazy" style="display:block;width:100%;height:1600px;border:0;border-radius:14px;background:#070d16"></iframe>
  <p style="text-align:center;font-size:14px;margin:10px 0 0"><a href="${origin+new URL(site).pathname}" target="_blank" rel="noopener" style="color:#92d0ff">Open the Voyager page in a new tab</a></p>
</div>
<script>
window.addEventListener('message',function(e){
  if(e.origin!=='${origin}'||!e.data||e.data.type!=='voyager:height')return;
  var h=Number(e.data.height);if(h>200&&h<20000)document.getElementById('voyager-frame').style.height=Math.ceil(h)+'px';
});
</script>`;
}


// ---------- stream companion (2.20.17) ----------
// What viewers follow on their phone during the stream: whether we're on air, the Dreadnought fight,
// naval ranks, medals and a lookup of each member's card (tier, rank and medals; never watch time, tickets or IDs).
const RANK_COUNT=12,MEDAL_CATS=['loyalty','support','honour','games','community','special'],TIERS_ALL=['blue','silver','gold','platinum'];
const medalId=v=>typeof v==='string'&&/^[a-z]{2,20}$/.test(v)?v:null;
export function projectCompanion(raw,settings=DEFAULT_SETTINGS,online=true,crewCount=0,crewAt=0){
  const s=normalizeSettings(settings),show=s.sections,name=n=>s.showNames?n:initials(n),out={};
  const person=p=>{const n=clean(p?.name,LIMITS.name);return n?{name:name(n),platform:oneOf(p?.platform,Object.keys(PLATFORMS),'')}:null;};
  if(show.live)out.live={onAir:online&&raw.live?.onAir===true};
  // 2.34.0 Raffle: open or drawing, time left, how many are in, and the winners once they have been shown on stream (names only with Show viewer names).
  if(show.live&&online&&raw.raffle&&typeof raw.raffle==='object'){const r=raw.raffle;
    out.raffle={phase:oneOf(r.phase,['intro','open','drawing','result'],'open'),endsAt:time(r.endsAt),count:int(r.count,0,1e5)??0,want:int(r.want,1,5)??1,prize:int(r.prize,0,100)??0,
      winners:settings.showNames===false?[]:list(r.winners).slice(0,5).map(w=>({name:clean(w?.name,LIMITS.name),platform:oneOf(w?.platform,Object.keys(PLATFORMS),''),ticket:int(w?.ticket,0,9999)??0})).filter(w=>w.name)};}
  // 2.40.0 Battleship: only while a battle is on. How many ships are sunk and the outcome; never where the ships are.
  if(show.live&&online&&raw.battleship&&typeof raw.battleship==='object'){const b=raw.battleship,r=b.result&&typeof b.result==='object'?b.result:null;
    out.battleship={phase:oneOf(b.phase,['lobby','battle','result'],'lobby'),phaseEndsAt:time(b.phaseEndsAt),size:int(b.size,0,10)??0,players:int(b.players,0,1e5)??0,sunk:int(b.sunk,0,10)??0,ships:int(b.ships,0,10)??0,practice:b.practice===true,tickets:int(b.tickets,0,100)??0,
      result:r?{outcome:oneOf(r.outcome,['victory','defeat','empty'],'defeat'),players:int(r.players,0,1e5)??0,sunk:int(r.sunk,0,10)??0,ships:int(r.ships,0,10)??0,tickets:int(r.tickets,0,100)??0,mvpTickets:int(r.mvpTickets,0,100)??0,mvp:person(r.mvp)}:null};}
  // 2.37.0 Bounty Hunt: only while a hunt is on. The target's (invented) name, how close the crew is and the outcome; the MVP's name follows "Show viewer names".
  if(show.live&&online&&raw.bounty&&typeof raw.bounty==='object'){const b=raw.bounty,r=b.result&&typeof b.result==='object'?b.result:null;
    out.bounty={phase:oneOf(b.phase,['lobby','hunt','result'],'lobby'),phaseEndsAt:time(b.phaseEndsAt),target:clean(b.target,60),hunters:int(b.hunters,0,1e5)??0,fix:int(b.fix,0,100)??0,practice:b.practice===true,tickets:int(b.tickets,0,100)??0,
      result:r?{outcome:oneOf(r.outcome,['captured','escaped','empty'],'escaped'),hunters:int(r.hunters,0,1e5)??0,tickets:int(r.tickets,0,100)??0,mvpTickets:int(r.mvpTickets,0,100)??0,mvp:person(r.mvp)}:null};}
  // 2.33.0 Prospect Run: only while a run is on (the same switch as the on-air badge). Phase and the numbers on screen; no names.
  if(show.live&&online&&raw.prospect&&typeof raw.prospect==='object'){const p=raw.prospect,r=p.result&&typeof p.result==='object'?p.result:null,num2=v=>{const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=10?Math.round(n*100)/100:0;};
    out.prospect={phase:oneOf(p.phase,['contract','mine','haul','sell','result'],'contract'),phaseEndsAt:time(p.phaseEndsAt),crew:int(p.crew,0,1e5)??0,ore:int(p.ore,0,1e4)??0,cargo:int(p.cargo,0,1e4)??0,price:num2(p.price),practice:p.practice===true,
      result:r?{grade:oneOf(r.grade,['gold','silver','bronze','fail'],'fail'),title:clean(r.title,30),score:int(r.score,0,1e5)??0,cargo:int(r.cargo,0,1e4)??0,tickets:int(r.tickets,0,100)??0,crew:int(r.crew,0,1e5)??0}:null};}
  if(show.dreadnought&&raw.dreadnought){const d=raw.dreadnought,phase=oneOf(d.phase,['idle','lobby','battle','result'],'idle');
    out.dreadnought={phase:online?phase:'idle',name:clean(d.name,40)||'The Dreadnought',hp:int(d.hp,0,1e9)??0,maxHp:int(d.maxHp,0,1e9)??0,lobbyEndsAt:time(d.lobbyEndsAt),endsAt:time(d.endsAt),endedAt:time(d.endedAt),
      outcome:oneOf(d.outcome,['victory','escaped'],null),pilots:int(d.pilots,0,1e5)??0,victoryPoints:int(d.victoryPoints,0,1e6)??0,victoryTickets:int(d.victoryTickets,0,1000)??0,
      leaders:list(d.leaders).slice(0,5).map(l=>({...person(l),damage:int(l?.damage,0,1e9)??0})).filter(l=>l.name),
      history:list(d.history).slice(0,6).map(h=>({outcome:oneOf(h?.outcome,['victory','escaped'],'escaped'),endedAt:time(h?.endedAt),pilots:int(h?.pilots,0,1e5)??0,mvp:h?.mvp?{...person(h.mvp),damage:int(h.mvp.damage,0,1e9)??0}:null})).filter(h=>h.endedAt)};}
  if(show.ranks&&raw.ranks){const r=raw.ranks;
    out.ranks={ladder:list(r.ladder).slice(0,RANK_COUNT).map(x=>({id:clean(x?.id,8),name:clean(x?.name,30),abbr:clean(x?.abbr,6),points:int(x?.points,0,1e12)??0,top:int(x?.top,0,100)??0,holders:int(x?.holders,0,1e7)??0})).filter(x=>x.name),
      top:list(r.top).slice(0,25).map((x,i)=>({place:i+1,...person(x),rank:int(x?.rank,0,RANK_COUNT-1)??0,lifetime:int(x?.lifetime,0,1e12)??0,balance:show.points&&i<LIMITS.leaders&&Number.isFinite(Number(x?.balance))&&x?.balance!==null?int(x.balance,0,1e12):null})).filter(x=>x.name),
      promotions:list(r.promotions).slice(0,12).map(x=>({...person(x),rank:int(x?.rank,0,RANK_COUNT-1)??0,at:time(x?.at)})).filter(x=>x.name&&x.at)};}
  if(show.medals&&raw.medals){const m=raw.medals;
    out.medals={catalogue:list(m.catalogue).filter(x=>medalId(x?.id)).slice(0,40).map(x=>({id:x.id,name:clean(x.name,30),cat:oneOf(x.cat,MEDAL_CATS,'community'),kind:oneOf(x.kind,['count','rank','special','secret'],'count'),unit:clean(x.unit,30),icon:typeof x.icon==='string'&&/^[MLHVCSQTAZmlhvcsqtaz0-9 .,-]{1,600}$/.test(x.icon)?x.icon:'',
        // Secret medals keep their secret: the name shows (it appears on cards) but not how to earn it.
        desc:x.kind==='secret'?'Secret medal. How to earn it is for you to discover.':clean(x.desc,160),
        grades:Array.isArray(x.grades)?x.grades.slice(0,4).map(g=>int(g,0,1e9)??0):null,earned:Array.isArray(x.earned)?x.earned.slice(0,4).map(g=>int(g,0,1e7)??0):[0,0,0,0]})),
      honour:list(m.honour).slice(0,10).map((x,i)=>({place:i+1,...person(x),honour:int(x?.honour,0,1e6)??0,medals:int(x?.medals,0,100)??0})).filter(x=>x.name),
      recent:list(m.recent).slice(0,12).map(x=>({...person(x),medal:medalId(x?.medal),grade:int(x?.grade,0,3)??0,special:x?.special===true,at:time(x?.at)})).filter(x=>x.name&&x.medal&&x.at)};}
  // 2.20.22 chat engagement: squadron standings (names of top pilots follow "Show viewer names") and pinned Captain's Log entries.
  if(show.squadrons&&raw.squadrons){const q=raw.squadrons;
    out.squadrons={weekEndsAt:time(q.weekEndsAt),standings:list(q.standings).slice(0,3).map(x=>({id:oneOf(x?.id,['red','gold','blue'],'red'),name:clean(x?.name,24),score:int(x?.score,0,1e12)??0,crew:int(x?.crew,0,1e6)??0,
        top:list(x?.top).slice(0,5).map(p=>({...person(p),score:int(p?.score,0,1e12)??0})).filter(p=>p.name)})).filter(x=>x.name),
      history:list(q.history).slice(0,6).map(h=>({week:time(h?.week),winner:oneOf(h?.winner,['red','gold','blue'],null)})).filter(h=>h.week&&h.winner)};}
  if(show.log&&s.showNames&&raw.log){out.log={stream:time(raw.log.stream),entries:list(raw.log.entries).slice(0,12).map(e=>({...person(e),text:clean(e?.text,140),at:time(e?.at)})).filter(e=>e.name&&e.text&&e.at&&!/(https?:\/\/|www\.)/i.test(e.text))};}
  // 2.21.15 SC Intel: Star Citizen news (RSI links only), ships in the pledge store, the streamer's deals and events. No viewer data at all.
  if(show.intel&&raw.intel&&typeof raw.intel==='object'){const x=raw.intel,rsi=u=>typeof u==='string'&&/^https:\/\/robertsspaceindustries\.com\//.test(u)?u.slice(0,300):'',img=u=>typeof u==='string'&&/^https:\/\/([a-z0-9-]+\.)*(fleetyards\.net|robertsspaceindustries\.com)\//.test(u)?u.slice(0,400):'';
    const TAGS=['freefly','ccu','sale','event','patch','show','lore','news'],KINDS=['ccu','sale','event','freefly','note'],day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'';
    const item=d=>({kind:oneOf(d?.kind,KINDS,'note'),title:clean(d?.title,80),detail:clean(d?.detail,160),url:safeUrl(d?.url||''),until:day(d?.until)});
    out.intel={at:time(x.at),commands:list(x.commands).slice(0,6).map(c=>clean(c,16)).filter(c=>/^![a-z]+$/.test(c)),
      news:list(x.news).slice(0,12).map(n=>({title:clean(n?.title,140),url:rsi(n?.url),at:time(n?.at),tag:oneOf(n?.tag,TAGS,'news')})).filter(n=>n.title&&n.url),
      sales:list(x.sales).slice(0,10).map(m=>({name:clean(m?.name,60),maker:clean(m?.maker,20),price:Number.isFinite(Number(m?.price))&&Number(m.price)>0?Math.round(Number(m.price)*100)/100:0,status:clean(m?.status,30),url:rsi(m?.url),image:img(m?.image)})).filter(m=>m.name&&m.price),salesTotal:int(x.salesTotal,0,1e4)??0,
      deals:list(x.deals).slice(0,12).map(item).filter(d=>d.title),events:list(x.events).slice(0,12).map(item).filter(d=>d.title),
      // 2.31.0: what is playable now (LIVE / PTU builds), the newest patch notes, and a section per active event.
      releases:list(x.releases).slice(0,3).filter(r=>['LIVE','PTU','EPTU'].includes(r?.channel)).map(r=>({channel:r.channel,version:clean(r.version,24),build:clean(r.build,12).replace(/\D/g,''),audience:clean(r.audience,30),at:time(r.at),url:rsi(r.url)})).filter(r=>r.version),
      patches:list(x.patches).slice(0,8).map(p=>({title:clean(p?.title,140),url:rsi(p?.url),at:time(p?.at),version:clean(p?.version,24),channel:oneOf(p?.channel,['LIVE','PTU','EPTU','TECH'],''),audience:clean(p?.audience,30)})).filter(p=>p.title&&p.url),
      spotlights:list(x.spotlights).slice(0,4).map(e=>({id:clean(e?.id,40).replace(/[^a-z0-9-]/gi,''),key:clean(e?.key,20).replace(/[^a-z]/gi,''),name:clean(e?.name,80),status:oneOf(e?.status,['live','soon','news'],'news'),start:time(e?.start),end:time(e?.end),
        location:clean(e?.location,80),freefly:e?.freefly===true,url:safeUrl(e?.url||''),blurb:clean(e?.blurb,240),
        days:list(e?.days).slice(0,20).map(d=>({label:clean(d?.label,80),note:clean(d?.note,80),start:time(d?.start),end:time(d?.end)})).filter(d=>d.label&&d.start&&d.end&&d.end>d.start),
        news:list(e?.news).slice(0,4).map(n=>({title:clean(n?.title,140),url:rsi(n?.url),at:time(n?.at)})).filter(n=>n.title&&n.url)})).filter(e=>e.id&&e.name)};}
  // 2.26.1 Bridge Quiz leaderboard: correct answers and points awarded, all-time and this stream. Names, so only with viewer names shown.
  if(show.quiz&&s.showNames&&raw.quiz&&typeof raw.quiz==='object'){const row=(r,i)=>({rank:i+1,name:clean(r?.name,LIMITS.name),platform:oneOf(r?.platform,Object.keys(PLATFORMS),''),correct:int(r?.correct,0,1e6)??0,points:int(r?.points,0,1e9)??0});
    const all=list(raw.quiz.all).slice(0,LIMITS.leaders).map(row).filter(r=>r.name&&r.correct),stream=list(raw.quiz.stream).slice(0,LIMITS.leaders).map(row).filter(r=>r.name&&r.correct);
    if(all.length||stream.length)out.quiz={all,stream};}
  // 2.24.0 viewer requests: what can be asked for, whether asking is open, and (with names shown) who has asked this stream.
  if(show.requests&&raw.requests&&typeof raw.requests==='object'){const x=raw.requests,opts=list(x.options).slice(0,10).map(o=>({key:clean(o?.key,20).toLowerCase().replace(/[^a-z0-9]/g,''),label:clean(o?.label,30)})).filter(o=>o.key&&o.label);
    if(opts.length)out.requests={open:x.open===true,round:int(x.round,0,1e15)??0,options:opts,
      recent:s.showNames?list(x.recent).slice(0,30).map(r=>({name:clean(r?.name,LIMITS.name),label:clean(r?.label,30),at:time(r?.at),done:r?.done===true})).filter(r=>r.name&&r.label):[],
      tally:list(x.tally).slice(0,10).map(t=>({label:clean(t?.label,30),count:int(t?.count,0,1e5)??0})).filter(t=>t.label&&t.count)};}
  if(show.crew&&s.showNames&&crewCount>0)out.crew={file:'crew.json',count:int(crewCount,0,1e5)??0,at:time(crewAt)}; // at: when a card last changed, so the site reloads them straight away
  return out;
}
// The back of the card: [honour, fights, victories, MVPs, damage, Versus wins, losses, missions, giveaways won, season podiums, season place, season points, 'YYYY-MM' first seen,
//   then (2.20.19, "Activity" switch) hours watched, months subscribed, best sub streak, gifted subs, streams attended, watch streak, best watch streak, chat messages, days with the crew, best Versus streak, points balance, private (1/0)].
// Never Bits or other money. A member who typed !voyager private keeps hours watched and months subscribed hidden.
function record(x,activity){if(!x||typeof x!=='object')return null;const n=(k,max=1e9)=>int(x[k],0,max)??0;
  const base=[n('honour',1e6),n('fights',1e6),n('victories',1e6),n('mvp',1e6),n('damage',1e12),n('wins',1e6),n('losses',1e6),n('missions',1e6),n('giveaways',1e6),n('podiums',1e4),n('seasonPlace',1e6),n('seasonPoints',1e12),
    typeof x.since==='string'&&/^20\d\d-(0[1-9]|1[0-2])$/.test(x.since)?x.since:''];
  if(!activity)return base;const priv=x.private===true;
  return base.concat([priv?0:n('hours',1e6),priv?0:n('months',1e4),priv?0:n('subBest',1e4),n('gifts',1e6),n('streams',1e5),n('streak',1e5),n('bestStreak',1e5),n('messages',1e8),n('followDays',1e5),n('versusBest',1e4),n('points',1e12),priv?1:0]);}
// The front of the card exactly as it shows on stream (built by the same code), as text only. With Activity off,
// time watched and months subscribed are replaced by "Hidden".
const TIER_KEYS=['blue','silver','gold','platinum'];
function front(f,activity){if(!f||typeof f!=='object')return null;const t=(v,max=90)=>clean(v,max);
  const stats=list(f.stats).slice(0,4).map(x=>[t(x?.[0],30),t(x?.[1],30),t(x?.[2],90)]),extras=list(f.extras).slice(0,4).map(x=>[t(x?.[0],30),t(x?.[1],40)]);
  if(!activity){for(const x of stats)if(x[0]==='TIME WATCHED'){x[1]='Hidden';x[2]='';}for(const x of extras)if(x[0]==='SUBSCRIBED')x[1]='Hidden';}
  return {tier:oneOf(f.tier,TIER_KEYS,'blue'),next:t(f.next,40),pct:/^\d{1,3}%$/.test(f.pct)?f.pct:'0%',need:t(f.need,120),callsign:t(f.callsign,40),badgeCount:t(f.badgeCount,40),
    fields:list(f.fields).slice(0,3).map(x=>t(x,60)),stats,extras,equipped:list(f.equipped).slice(0,6).map(x=>[t(x?.[0],40),t(x?.[1],20)]),
    rank:f.rank&&typeof f.rank==='object'?{id:typeof f.rank.id==='string'&&/^[a-z]{2,5}$/.test(f.rank.id)?f.rank.id:'mid',name:t(f.rank.name,30),place:t(f.rank.place,80)}:null,vip:f.vip===true,emerald:f.emerald===true};}
// 2.20.47: the back of the card (fleet record) and the medal wall, as the stream card draws them. With Activity off,
// the stream streak and months subscribed are replaced by "Hidden" (as the front does for time watched).
function back(b,activity){if(!b||typeof b!=='object')return null;const t=(v,max=60)=>clean(v,max),pairs=v=>list(v).slice(0,6).map(x=>[t(x?.[0],40),t(x?.[1],40)]);
  const community=list(b.community).slice(0,6).map(x=>[t(x?.[0],30),t(x?.[1],40),t(x?.[2],90)]);
  if(!activity)for(const x of community)if(x[0]==='STREAM STREAK'||x[0]==='SUBSCRIBED'){x[1]='Hidden';x[2]='';}
  return {statsEyebrow:t(b.statsEyebrow,120),dread:pairs(b.dread),versus:pairs(b.versus),missions:pairs(b.missions),community,
    badgesEyebrow:t(b.badgesEyebrow,120),badges:list(b.badges).slice(0,24).map(x=>[t(x?.[0],40),t(x?.[1],40),x?.[2]===1?1:0]),alsoEarned:t(b.alsoEarned,160)};}
// crew.json: one compact row per member for "find your card". Names only with "Show viewer names" on.
export function buildCrew(rows,settings=DEFAULT_SETTINGS,now=Date.now(),limit=2000){
  const s=normalizeSettings(settings);if(!s.sections.crew||!s.showNames)return null;
  const members=list(rows).slice(0,limit).map(r=>{const n=clean(r?.name,LIMITS.name);if(!n)return null;
    return [n,oneOf(r.platform,Object.keys(PLATFORMS),''),oneOf(r.tier,TIERS_ALL,'blue'),int(r.rank,0,RANK_COUNT-1)??0,int(r.place,0,1e6)??0,int(r.lifetime,0,1e12)??0,
      list(r.medals).filter(m=>medalId(m?.[0])).slice(0,40).map(m=>[m[0],int(m[1],0,3)??0]),record(r.record,s.sections.activity),front(r.front,s.sections.activity),back(r.back,s.sections.activity),
      ...(s.sections.activity&&r.balance!==null&&r.balance!==undefined&&Number.isFinite(Number(r.balance))?[int(r.balance,0,1e12)]:[])];}).filter(Boolean);
  return {schema:1,generatedAt:now,members};
}
