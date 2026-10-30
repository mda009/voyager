// Voyager public website feed: the ONLY data that leaves this PC for the public site.
// Everything is rebuilt field-by-field from an allow-list. Stream statistics (viewers,
// followers, subscriptions, watch time, revenue), user IDs, chat, security data, audit
// logs and per-viewer ticket balances are never included.

export const SCHEMA=1;
export const LIMITS={title:120,name:60,text:600,short:160,command:40,url:300,giveaways:8,winners:15,leaders:10,tiers:8,commands:12};
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
  sections:{giveaways:true,winners:true,goals:true,points:true,pilots:true,versus:true,program:true,missions:true,season:true},
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
  const p=session?.proof;if(!p||p.version!==1||!HEX64.test(p.commitment||''))return null;
  const seeds=list(p.seeds),names=settings.showNames===true;
  const draws=list(session.draws).filter(d=>d?.proof&&Number.isInteger(d.proof.n)).map(d=>{
    if(d.status==='selected')return {n:d.proof.n,seed:null,index:null,winner:null,status:'pending'};
    const confirmed=d.status==='confirmed';
    return {n:d.proof.n,seed:seeds[d.proof.n-1]||null,index:d.proof.index,winner:confirmed&&names?d.winner?.name??null:null,status:confirmed?'confirmed':'redrawn'};
  });
  return {version:1,committedAt:p.committedAt,commitment:p.commitment,poolHash:p.poolHash,size:p.size,entrants:names&&Array.isArray(p.entrants)?p.entrants:null,draws};
}
export function sanitizeProof(p){
  if(!p||p.version!==1||!HEX64.test(p.commitment||'')||!HEX64.test(p.poolHash||''))return null;
  const size=int(p.size,0,50000);if(size===null)return null;
  let entrants=null;
  if(Array.isArray(p.entrants)&&p.entrants.length===size&&size<=PROOF_LIST){
    entrants=p.entrants.map(e=>Array.isArray(e)&&e.length===2&&proofText(e[0],20)!==null&&proofText(e[1],100)!==null?[e[0],e[1]]:null);
    if(entrants.some(e=>!e))entrants=null;
  }
  const draws=list(p.draws).slice(0,PROOF_DRAWS).map(d=>{
    const n=int(d?.n,1,PROOF_DRAWS),status=oneOf(d?.status,['confirmed','redrawn','pending']);if(n===null||!status)return null;
    if(status==='pending')return {n,seed:null,index:null,winner:null,status};
    const seed=HEX64.test(d.seed||'')?d.seed:null,index=int(d.index,0,50000);if(!seed||index===null)return null;
    return {n,seed,index,winner:status==='confirmed'?proofText(d.winner,100):null,status};
  });
  if(draws.some(d=>!d))return null;
  return {version:1,committedAt:time(p.committedAt),commitment:p.commitment,poolHash:p.poolHash,size,entrants,draws};
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
  return {
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

export function buildFeed({collected,settings,pilots=[],versus=null,winners=[],online=true,now=Date.now(),proofIds=new Set(),community=null}){
  const s=normalizeSettings(settings),c=sanitizeCollected(collected),show=s.sections;
  const name=n=>s.showNames?n:initials(n);
  const feed={schema:SCHEMA,generatedAt:now,online:online===true,
    channel:{name:s.channelName,tagline:s.tagline,links:Object.fromEntries(Object.entries(s.links).filter(([,v])=>v))},
    sections:{...show},giveaways:[],winners:[],goals:[],leaderboards:{points:[],pilots:[]},versus:null,program:null,missions:null,season:null};
  // The full proof is uploaded as its own file (proofs/<id>.json); the feed carries a short summary.
  if(show.giveaways)feed.giveaways=c.giveaways.map(({proof,...g})=>({...g,winner:g.winner?{...g.winner,name:name(g.winner.name)}:null,
    fairDraw:proof?{id:g.id,commitment:proof.commitment,committedAt:proof.committedAt,size:proof.size}:null}));
  if(show.winners)feed.winners=list(winners).slice(0,LIMITS.winners).map(w=>({title:clean(w?.title,LIMITS.title),name:name(clean(w?.name,LIMITS.name)),platform:oneOf(w?.platform,Object.keys(PLATFORMS),''),at:time(w?.at),
    proof:typeof w?.gid==='string'&&proofIds.has(w.gid)?w.gid:null})).filter(w=>w.name&&w.at);
  if(show.goals)feed.goals=c.points.goals;
  if(show.points)feed.leaderboards.points=c.points.leaders.slice(0,s.leaderboardSize).map((l,i)=>({rank:i+1,name:name(l.name),platform:l.platform,value:l.value}));
  if(show.pilots)feed.leaderboards.pilots=projectPilots(pilots,s.leaderboardSize).map((p,i)=>({rank:i+1,...p,name:name(p.name)}));
  if(show.versus&&versus){const st=oneOf(versus.status,VERSUS,'offline');feed.versus={status:st,cooldownUntil:st==='cooldown'?time(versus.cooldownUntil):null,command:s.commands.versus,winnerPoints:int(versus.winnerPoints,0,1e6)};}
  // Missions and seasons (2.13): counts and top-10 standings only; names follow "Show viewer names".
  if(community&&typeof community==='object'){
    const person=p=>p&&clean(p.name,LIMITS.name)?{name:name(clean(p.name,LIMITS.name)),platform:oneOf(p.platform,Object.keys(PLATFORMS),'')}:null;
    if(show.missions&&Array.isArray(community.missions))feed.missions={endsAt:time(community.weekEndsAt),list:community.missions.slice(0,8).map(m=>({title:clean(m.title,40),type:oneOf(m.type,['streamDays','earnPoints','versusWins','subscribe','giftSubs','loyalSub'],'earnPoints'),platform:oneOf(m.platform,['all','twitch','youtube','kick'],'all'),target:int(m.target,1,1e7)??1,reward:int(m.reward,0,1e6)??0,completed:int(m.completed,0,1e7)??0})).filter(m=>m.title)};
    if(show.season&&community.season)feed.season={name:clean(community.season.name,40),endsAt:time(community.season.endsAt),
      standings:list(community.season.standings).slice(0,10).map((r,i)=>({rank:i+1,...person(r),points:int(r.points,0,1e12)??0,support:int(r.support,0,1e9)??0,wins:int(r.wins,0,1e9)??0})).filter(r=>r.name),
      supportBonus:int(community.season.supportBonus,0,1e5)??0,
      // Sub goals: community totals and how many people helped (never who).
      goals:list(community.season.goals).slice(0,4).map(g=>({title:clean(g.title,40),metric:oneOf(g.metric,['support','subs','gifts'],'support'),platform:oneOf(g.platform,['all','twitch','youtube','kick'],'all'),target:int(g.target,1,1e5)??1,total:int(g.total,0,1e9)??0,reward:int(g.reward,0,1e6)??0,reached:g.reached===true,helpers:int(g.helpers,0,1e7)??0})).filter(g=>g.title),
      hall:list(community.hall).slice(0,6).map(h=>({name:clean(h.name,40),endedAt:time(h.endedAt),champion:h.champion?{...person(h.champion),points:int(h.champion.points,0,1e12)??0}:null,topPilot:h.topPilot?{name:name(clean(h.topPilot.name,LIMITS.name)),wins:int(h.topPilot.wins,0,1e9)??0}:null}))};
  }
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
