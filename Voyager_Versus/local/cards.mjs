// Voyager membership cards (2.19): the !voyager glass card in the viewer's tier colour, its two back sides
// (!voyager stats, !voyager badges) and the tier-up ceremony when someone joins Silver, Gold or Platinum.
// Tiers and upgrades are unchanged: the "Voyager - Membership Card" action reads your BLUE/SILVER/GOLD/PLATINUM GROUP
// and the "points" balance; !upgrade and the purchase actions keep doing the buying. Voyager adds the rest from what it
// already tracks (medals, watch time, subs, Versus, the Dreadnought, missions and seasons).
// Never shown: giveaway ticket balances.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {MEDALS,MEDAL_ICONS,GRADE_NAMES,medalById} from './medals.mjs';

const FILE='cards.json',DAY=86400000;
// The rank insignia (sleeve lace) drawn on the card, reused on the Ranks page.
const INSIGNIA={};
try{const t=readFileSync(new URL('../dist/card-template.mjs',import.meta.url),'utf8');
  for(const m of t.matchAll(/<span style="display: \$\{e\(k\.s_(\w+)\)\}">(<svg[\s\S]*?<\/svg>)<\/span>/g))INSIGNIA[m[1]]=m[2];}catch{}
export const TIER_ORDER=['blue','silver','gold','platinum'];
export const TIER_INFO={blue:{title:'BLUE EXPLORER',tier:'TIER 1'},silver:{title:'SILVER SENTINEL',tier:'TIER 2'},gold:{title:'GOLD COMMANDER',tier:'TIER 3'},platinum:{title:'PLATINUM VANGUARD',tier:'TIER VANGUARD'}};
// Upgrade prices from your Streamer.bot actions: Silver Membership Purchase 1,200, Silver > Gold Logic 1,800, Gold > Platinum Logic 17,000.
export const CARD_DEFAULTS={enabled:true,seconds:12,cooldown:60,chat:true,costs:{silver:1200,gold:1800,platinum:17000},
  ranks:true,promoChat:true,promoMin:4,rankPoints:[0,5000,15000,40000,80000,150000,300000,600000,1000000,2000000,3500000,10000000],
  // 2.20.23: cards after Fleet alerts. welcome = a new follower's card is presented; support = a member's card shows the
  // sub, resub, gift subs or bits landing on it. points = what your Streamer.bot currency pays for each (0 hides the points line).
  fleet:{welcome:true,support:true,points:{follow:50,sub:250,resub:5,gift:100,bits:1}},
  // 2.20.37: the tier-up alert sound (sounds/tierup.mp3) when someone upgrades. volume 0–100.
  sound:{tierUp:true,volume:80}};
const FLEET_KINDS=['','follow','sub','gift','resub','bits'];
// Naval ranks (2.20): earned by lifetime Voyager points (never reduced by spending) and the all-time leaderboard of them.
// top = also needs this all-time place. Royal Australian Navy officer ranks and sleeve lace.
export const RANKS=[
  {id:'mid',name:'Midshipman',abbr:'MIDN',top:0},{id:'aslt',name:'Acting Sub-Lieutenant',abbr:'ASLT',top:0},{id:'slt',name:'Sub-Lieutenant',abbr:'SBLT',top:0},
  {id:'lt',name:'Lieutenant',abbr:'LEUT',top:0},{id:'lcdr',name:'Lieutenant Commander',abbr:'LCDR',top:0},{id:'cdr',name:'Commander',abbr:'CMDR',top:0},
  {id:'capt',name:'Captain',abbr:'CAPT',top:0},{id:'cdre',name:'Commodore',abbr:'CDRE',top:0},{id:'radm',name:'Rear Admiral',abbr:'RADM',top:0},
  {id:'vadm',name:'Vice Admiral',abbr:'VADM',top:10},{id:'adml',name:'Admiral',abbr:'ADML',top:3},{id:'af',name:'Admiral of the Fleet',abbr:'AF',top:1}];
const BUCKETS=new Set(['mdavoyagersilver','mdavoyagergold','mdavoyagerplatinum']);
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0;};
const fmt=n=>Math.round(num(n)).toLocaleString('en');
const KEY=/^(twitch|youtube|kick):[^\s]{1,128}$/;
// 2.20.15: lifetime points are what Voyager has seen earned, but never less than the points someone holds right now
// (balances from before Voyager started counting were earned too).
const lifetimeOf=m=>m?Math.max(num(m.value),num(m.balance)):0;
// Medal grade metals for the card's medal row.
const GRADE_LOOK=[
  {metal:'linear-gradient(180deg,#ffe6cc 0%,#f0a868 30%,#a5582a 52%,#6e3510 60%,#d68a4c 84%,#ffd9b0 100%)',ink:'#fff3e6',tag:'#f0b07a'},
  {metal:'linear-gradient(180deg,#ffffff 0%,#eef2f6 26%,#9aa6b4 50%,#55606d 58%,#cfd8e2 84%,#ffffff 100%)',ink:'#ffffff',tag:'#dfe6ee'},
  {metal:'linear-gradient(180deg,#fffbe0 0%,#ffe07a 26%,#e0a420 48%,#7a4d00 56%,#ffcf4a 82%,#fff3b8 100%)',ink:'#fff8dc',tag:'#ffd257'},
  {metal:'linear-gradient(135deg,#8ff6ff 0%,#9fb4ff 30%,#c58bff 52%,#ff8fe0 74%,#ffe28a 100%)',ink:'#ffffff',tag:'#d6a8ff'}];

export function normalizeCardSettings(raw={},base=CARD_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},s=structuredClone(base);
  for(const k of ['enabled','chat'])if(r[k]!==undefined)s[k]=r[k]===true;
  for(const [k,min,max] of [['seconds',5,60],['cooldown',0,3600]]){if(r[k]===undefined)continue;const n=Number(r[k]);if(!Number.isInteger(n)||n<min||n>max)throw new Error(k==='seconds'?'Show the card for 5 to 60 seconds.':'The cooldown must be 0 to 3,600 seconds.');s[k]=n;}
  for(const k of ['ranks','promoChat'])if(r[k]!==undefined)s[k]=r[k]===true;
  if(r.promoMin!==undefined){const n=Number(r.promoMin);if(!Number.isInteger(n)||n<1||n>12)throw new Error('Choose the lowest rank whose promotion shows on stream.');s.promoMin=n;}
  if(r.rankPoints!==undefined){
    const v=Array.isArray(r.rankPoints)?r.rankPoints.map(Number):[];
    if(v.length!==12||v[0]!==0||v.some((x,i)=>!Number.isInteger(x)||x<0||x>1e12||(i&&x<=v[i-1])))throw new Error('Rank points must start at 0 and go up at every rank.');
    s.rankPoints=v;
  }
  if(r.costs!==undefined){for(const k of ['silver','gold','platinum']){if(r.costs?.[k]===undefined)continue;const n=Number(r.costs[k]);if(!Number.isInteger(n)||n<0||n>1e9)throw new Error('Upgrade prices must be whole numbers of points.');s.costs[k]=n;}}
  if(r.sound!==undefined){const so=r.sound&&typeof r.sound==='object'?r.sound:{};if(so.tierUp!==undefined)s.sound.tierUp=so.tierUp===true;
    if(so.volume!==undefined){const n=Number(so.volume);if(!Number.isInteger(n)||n<0||n>100)throw new Error('Volume must be 0 to 100.');s.sound.volume=n;}}
  if(r.fleet!==undefined){
    const fl=r.fleet&&typeof r.fleet==='object'?r.fleet:{};
    for(const k of ['welcome','support'])if(fl[k]!==undefined)s.fleet[k]=fl[k]===true;
    for(const k of ['follow','sub','resub','gift','bits']){if(fl.points?.[k]===undefined)continue;const n=Number(fl.points[k]);if(!Number.isInteger(n)||n<0||n>1e6)throw new Error('Fleet points must be whole numbers from 0 to 1,000,000.');s.fleet.points[k]=n;}
  }
  return s;
}
export function memberId(key,since){
  const h=parseInt(createHash('sha256').update(key).digest('hex').slice(0,8),16)%10000;
  return 'UNP-'+new Date(since).getFullYear()+'-'+String(h).padStart(4,'0');
}

// Sample member for the control page previews.
const SAMPLE_VIEWER=now=>({name:'NebulaKnight',login:'nebulaknight',platform:'twitch',first:now-596*DAY,
  c:{watch:312*3600,days:96,streak:41,bestStreak:58,months:14,gifts:31,slayer:12,fights:23,topgun:3,torpedo:11,damage:184220,missions:64,mtypes:['streamDays','earnPoints','versusWins','subscribe','giftSubs'],podium:1,goals:4,lucky:2},
  m:{slayer:{g:1,at:now-1000},watch:{g:1,at:now-2000},subs:{g:1,at:now-3000},versus:{g:1,at:now-4000},topgun:{g:1,at:now-5000},gifter:{g:0,at:now-6000},
    streak:{g:2,at:now-7000},regular:{g:1,at:now-8000},founding:{g:0,at:now-9000},missions:{g:1,at:now-10000},elder:{g:1,at:now-11000},torpedo:{g:1,at:now-12000}}});
export class Cards{
  constructor({dataDir,now=Date.now,say=()=>{},medals=null,community=()=>null,rankings=()=>[]}={}){
    Object.assign(this,{dataDir,now,say,medals,community,rankings});
    this.state={schema:1,settings:structuredClone(CARD_DEFAULTS),members:{},queue:[],recent:[],seq:0,ranks:{},ranksPrimed:false,promoChat:[],promotions:[]};this.lastChatAt=0;this.saving=Promise.resolve();this.lastEvent=null;
  }
  async load(){try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));if(raw?.schema===1){this.state={...this.state,...raw};this.state.settings={...structuredClone(CARD_DEFAULTS),...raw.settings};try{this.state.settings=normalizeCardSettings(raw.settings||{});}catch{this.state.settings=structuredClone(CARD_DEFAULTS);}}}catch{}return this;}
  persist(){if(!this.dataDir)return this.saving;const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  member(key){const m=this.state.members;if(!m[key]){m[key]={};const keys=Object.keys(m);if(keys.length>50000)delete m[keys[0]];}return m[key];}

  // ---------- events from the "Voyager - Membership Card" action ----------
  // Twitch chat seen directly by Voyager (fallback when the Streamer.bot action can't be reached): tier and points from the
  // Points Ledger members Voyager already has.
  fromChat(chat){
    const platform=PLATFORM[chat.platform]?chat.platform:'twitch',key=platform+':'+clean(chat.userId,128),m=this.community()?.state?.members?.[key];
    const balances=Object.values(this.community()?.state?.members||{}).filter(x=>!BUCKETS.has(x.login)&&Number.isFinite(x.balance));
    const points=Number.isFinite(m?.balance)?m.balance:-1;
    return {type:'voyager.card.event',v:1,kind:'card',platform,userId:chat.userId,login:chat.login,name:chat.name,tier:m?.tier||this.state.members[key]?.tier||'blue',
      points,rank:points>=0?balances.filter(x=>x.balance>points).length+1:0,members:balances.length,input:clean(String(chat.text).trim().replace(/^!voyager\b/i,''),80)};
  }
  requestedSince(key,at){return (this.requests?.get(key)?.at||0)>=at;}
  receive(ev){
    if(!ev||ev.type!=='voyager.card.event'||ev.v!==1)return null;
    const platform=clean(ev.platform,10).toLowerCase();if(!PLATFORM[platform])return null;
    const id=clean(ev.userId,128),login=clean(ev.login,60).toLowerCase(),name=clean(ev.name||ev.login,60)||login;
    const tier=TIER_ORDER.includes(ev.tier)?ev.tier:'blue',key=id?platform+':'+id:this.findKey(platform,login);
    this.lastEvent={at:this.now(),kind:clean(ev.kind,10),platform};
    if(!key||!KEY.test(key)||!this.state.settings.enabled)return null;
    const who={key,platform,login,name,tier,points:num(ev.points),rank:num(ev.rank),members:num(ev.members),hasPoints:num(ev.points)>=0};
    if(ev.kind==='tierup')return this.tierUp(who);
    if(ev.kind==='card'){
      // The same !voyager can arrive twice (Streamer.bot trigger and Voyager's own chat fallback): use the first.
      const sig=who.key+'|'+clean(ev.input,80).toLowerCase(),now=this.now();
      this.requests||=new Map();const prev=this.requests.get(who.key);
      if(prev&&prev.sig===sig&&now-prev.at<8000)return null;
      this.requests.set(who.key,{sig,at:now});if(this.requests.size>500)this.requests.delete(this.requests.keys().next().value);
      return this.command(who,clean(ev.input,80));
    }
    return null;
  }
  findKey(platform,login){
    if(!login)return '';
    const v=this.medals?.state?.viewers||{};for(const [k,x] of Object.entries(v))if(x.platform===platform&&x.login===login)return k;
    const c=this.community()?.state?.members||{};for(const [k,x] of Object.entries(c))if(x.platform===platform&&x.login===login)return k;
    return '';
  }
  reply(who,text){if(!this.state.settings.chat)return;try{this.say((who.platform==='twitch'&&who.login?'@'+who.login:who.name)+' '+text);}catch{}}
  command(who,input){
    const [word,...rest]=input.toLowerCase().split(/\s+/).filter(Boolean),m=this.member(who.key);
    if(word==='private'||word==='public'){m.private=word==='private';this.persist();this.reply(who,m.private?'your card now hides time watched and months subscribed.':'your card shows time watched and months subscribed again.');return {ok:true};}
    if(word==='title'||word==='callsign'){
      const options=this.callsigns(who.key),want=rest.join(' ').trim();
      if(!want){this.reply(who,options.length?'your callsigns: '+options.map(o=>o.name).join(', ')+'. Type !voyager title <name>.':'earn a medal to unlock a callsign. Type !medals to see your progress.');return {ok:true};}
      const pick=options.find(o=>o.name.toLowerCase()===want)||options.find(o=>o.name.toLowerCase().startsWith(want));
      if(!pick){this.reply(who,'you have not earned "'+clean(rest.join(' '),40)+'" yet. Your callsigns: '+(options.map(o=>o.name).join(', ')||'none yet')+'.');return {ok:false};}
      m.title=pick.id;this.persist();this.reply(who,'your callsign is now ★ '+pick.name.toUpperCase()+'.');return {ok:true};
    }
    const side=word==='stats'?'stats':word==='badges'||word==='medals'?'badges':'front';
    const now=this.now(),cool=this.state.settings.cooldown*1000;
    if(cool&&now-(m.shownAt||0)<cool)return {ok:false,cooldown:true};
    m.shownAt=now;return this.enqueue(who,side,null);
  }
  tierUp(who){
    const m=this.member(who.key),to=TIER_ORDER.indexOf(who.tier);
    let from=TIER_ORDER.indexOf(m.tier||'');if(from<0||from>=to)from=Math.max(0,to-1);
    if(m.tierUpTo===who.tier&&this.now()-(m.tierUpAt||0)<10*60000)return null; // the same promotion arrives once per group event
    m.tierUpTo=who.tier;m.tierUpAt=this.now();
    return this.enqueue(who,'front',TIER_ORDER[from]);
  }
  enqueue(who,side,fromTier,fromRank=null){
    const card=this.build(who,side,fromTier,false,fromRank),item={id:++this.state.seq,at:this.now(),seconds:this.state.settings.seconds,card};
    this.member(who.key).tier=who.tier;
    this.state.queue=[...this.state.queue.filter(x=>this.now()-x.at<10*60000),item].slice(-20);
    this.state.recent=[{id:item.id,at:item.at,name:who.name,platform:who.platform,tier:who.tier,side,tierUp:!!fromTier,promotion:fromRank!==null?card.k.name:''},...this.state.recent].slice(0,30);
    this.persist();return item;
  }

  // ---------- naval ranks ----------
  // All-time leaderboard of lifetime points (Points Ledger "captured in"), bucket accounts left out.
  board(){
    if(this.memo?.board)return this.memo.board;
    const members=this.community()?.state?.members||{};
    const rows=Object.entries(members).filter(([,m])=>!BUCKETS.has(m.login)&&lifetimeOf(m)>0).map(([key,m])=>({key,value:lifetimeOf(m)})).sort((a,b)=>b.value-a.value);
    const place=new Map();rows.forEach((r,i)=>place.set(r.key,i+1));
    const out={rows,place};if(this.memo)this.memo.board=out;return out;
  }
  rankOf(lifetime,place){
    const pts=this.state.settings.rankPoints;let i=0;
    for(let k=RANKS.length-1;k>=0;k--){if(lifetime>=pts[k]&&(!RANKS[k].top||(place&&place<=RANKS[k].top))){i=k;break;}}
    return i;
  }
  rankView(key,lifetime,place){
    const on=this.state.settings.ranks,i=this.rankOf(lifetime,place),rk=RANKS[i],next=RANKS[i+1],pts=this.state.settings.rankPoints;
    const k={show:on?'flex':'none',roleShow:on?'none':'inline',name:rk.name.toUpperCase(),place:(place?'#'+fmt(place)+' ALL-TIME · ':'')+fmt(lifetime)+' POINTS EARNED'};
    for(const x of RANKS)k['s_'+x.id]=on&&x.id===rk.id?'inline-flex':'none';
    let sub='Highest rank in the Voyager fleet';
    if(next){const need=Math.max(0,pts[i+1]-lifetime);sub=need?fmt(need)+' to '+next.name+(next.top?' (and top '+next.top+')':''):'Needs top '+next.top+' all-time for '+next.name;}
    return {k,index:i,rank:rk,sub};
  }
  // Promotions: checked with the medals tick. The first check only records everyone's rank (no flood of promotions).
  tickRanks(){
    const s=this.state.settings;if(!s.ranks||!s.enabled)return [];
    const {rows,place}=this.board();if(!rows.length)return [];
    const members=this.community()?.state?.members||{},out=[];
    for(const r of rows){
      const i=this.rankOf(r.value,place.get(r.key)),was=this.state.ranks[r.key];
      if(this.state.ranksPrimed&&was!==undefined&&i>was)out.push({key:r.key,from:was,to:i});
      if(was===undefined||i>was)this.state.ranks[r.key]=i;
    }
    this.state.ranksPrimed=true;
    for(const p of out){
      const m=members[p.key],platform=p.key.split(':')[0],name=m?.name||p.key;
      this.state.promotions=[{at:this.now(),key:p.key,name,platform,from:p.from,to:p.to},...(this.state.promotions||[])].slice(0,200);
      if(s.promoChat)this.state.promoChat.push({at:this.now(),text:name+' is now '+RANKS[p.to].name});
      if(p.to>=s.promoMin){
        const who={key:p.key,platform,login:m?.login||'',name,tier:this.member(p.key).tier||'blue',points:-1,rank:0,members:0,hasPoints:false};
        this.enqueue(who,'front',null,p.from);
      }
    }
    this.state.promoChat=this.state.promoChat.filter(c=>this.now()-c.at<10*60000).slice(-40);
    if(out.length)this.persist();
    return out;
  }
  tickChat(){
    const now=this.now(),q=this.state.promoChat;if(!q.length||now-this.lastChatAt<20000)return null;
    const batch=q.splice(0,4);this.lastChatAt=now;
    const text='⚓ Promotions: '+batch.map(b=>b.text).join(' · ')+(q.length?' · and more':'')+'! Type !voyager to see your rank.';
    try{this.say(text.slice(0,450));}catch{}return text;
  }

  // ---------- what the card shows ----------
  callsigns(key){
    const v=this.medals?.state?.viewers?.[key];if(!v)return [];
    return Object.entries(v.m||{}).map(([id,e])=>({id,g:e.g,m:medalById(id)})).filter(x=>x.m).sort((a,b)=>b.g-a.g||a.m.name.localeCompare(b.m.name)).map(x=>({id:x.id,name:x.m.name}));
  }
  build(who,side,fromTier,sample=false,fromRank=null,over=null){
    const now=this.now(),s=this.state.settings,m=sample?{}:(this.state.members[who.key]||{}),medals=this.medals;
    let v=sample?SAMPLE_VIEWER(now):medals?.state?.viewers?.[who.key]||null;
    if(over)v={name:who.name,login:who.login,platform:who.platform,first:now,...v,c:{...(v?.c||{}),...(over.c||{})},m:{...(v?.m||{}),...(over.m||{})}};
    const c=v?.c||{};
    const community=this.community(),cm=sample?{value:214560}:community?.state?.members?.[who.key]||null;
    const since=Math.min(v?.first||now,now),hidden=!!m.private;
    const balance=who.hasPoints?who.points:num(cm?.balance);
    const lifetime=sample?num(cm?.value):over?Math.max(lifetimeOf(cm),balance):lifetimeOf(cm);
    const allTime=sample?6:this.board().place.get(who.key)||0;
    const rv=this.rankView(who.key,lifetime,allTime);
    // Versus
    const pilots=sample?[{login:who.login,wins:27,losses:9,draws:0},{login:'x',wins:40}]:(this.rankings()||[]).filter(p=>p&&p.login),pilot=who.platform==='twitch'?pilots.find(p=>String(p.login).toLowerCase()===who.login):null;
    const vRank=pilot?[...pilots].sort((a,b)=>num(b.wins)-num(a.wins)).findIndex(p=>p===pilot)+1:0;
    const wins=num(pilot?.wins),losses=num(pilot?.losses),draws=num(pilot?.draws),battles=wins+losses+draws,vs=sample?{best:7}:medals?.state?.versus?.[who.login];
    // Season
    let standings=this.memo?.standings||[];if(!this.memo?.standings){try{standings=community?.standings(1000)||[];}catch{}if(this.memo)this.memo.standings=standings;}
    const season=sample?{rank:2,score:18940}:standings.find(r=>r.key===who.key),seasonName=community?.state?.season?.name||'Season';
    // Medals
    const earned=Object.entries(v?.m||{}).map(([id,e])=>({id,g:e.g,at:e.at,m:medalById(id)})).filter(x=>x.m);
    const order=(a,b)=>b.g-a.g||(b.m.cat==='honour')-(a.m.cat==='honour')||b.at-a.at;
    earned.sort(order);
    const honour=v&&medals?medals.honour(v):0;
    const title=m.title&&v?.m?.[m.title]?medalById(m.title).name:earned[0]?.m.name||'';
    const total=MEDALS.length;
    // Next tier: your upgrade prices, measured against the points balance.
    const ti=TIER_ORDER.indexOf(who.tier),next=TIER_ORDER[ti+1];
    let nextT={next:'MAX TIER REACHED',pct:'100%',need:'Vanguard of the fleet'+(earned.length?' · '+earned.length+' medals · ★ '+honour+' honour':'')};
    if(next){const cost=s.costs[next],have=Math.max(0,balance),pct=cost?Math.min(100,Math.floor(have/cost*100)):100;
      const label={silver:'Silver',gold:'Gold',platinum:'Platinum'}[next];
      nextT={next:TIER_INFO[next].title,pct:pct+'%',need:have>=cost?'Ready: type !upgrade to become '+label+' ('+fmt(cost)+' Voyager points)':label+' for '+fmt(cost)+' Voyager points · '+fmt(cost-have)+' to go · then type !upgrade'};}
    const watchH=Math.floor(num(c.watch)/3600);
    const t={...TIER_INFO[who.tier],...nextT};
    const fields=[
      {label:'MEMBER NAME',value:who.name,icon:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'},
      {label:'MEMBER ID',value:memberId(who.key,since),icon:'M3 5h18v14H3z M7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4 M14 9h4 M14 13h4'},
      {label:'MEMBER SINCE',value:new Date(since).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'}),icon:'M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5 M8 14h2 M12 14h2 M16 14h2 M8 17h2 M12 17h2'}];
    const stats=[
      {label:'VOYAGER POINTS',value:balance>=0?fmt(balance):'—',sub:this.state.settings.ranks?'Balance for !upgrade':lifetime?fmt(lifetime)+' earned all-time':'Points balance'},
      this.state.settings.ranks?{label:'LIFETIME POINTS',value:fmt(lifetime),sub:rv.sub}:{label:'LEADERBOARD',value:who.rank?'#'+fmt(who.rank):'—',sub:who.members?'of '+fmt(who.members)+' members':'Points leaderboard'},
      {label:'TIME WATCHED',value:hidden?'Private':fmt(watchH)+' h',sub:c.streak?fmt(c.streak)+'-stream streak · best '+fmt(c.bestStreak):fmt(c.days||0)+' streams attended'},
      {label:'VOYAGER VERSUS',value:battles?fmt(wins)+'–'+fmt(losses):'—',sub:battles?Math.round(wins/battles*100)+'% win rate'+(vRank?' · #'+vRank:''):'Type !versus to battle'}];
    const extras=[
      {label:seasonName.toUpperCase(),value:season?'#'+season.rank+' · '+fmt(season.score):'Unranked'},
      {label:'DREADNOUGHT',value:c.topgun?'MVP ×'+c.topgun:c.slayer?fmt(c.slayer)+' victories':c.fights?fmt(c.fights)+' fights':'—'},
      {label:'SUBSCRIBED',value:hidden?'Private':c.months?fmt(c.months)+' months':'—'},
      {label:'HONOUR',value:'★ '+fmt(honour)+(earned.length?' · '+earned.length+' medals':'')}];
    const badge=e=>{const look=e.m.grades?GRADE_LOOK[Math.max(0,Math.min(3,e.g|0))]:null;
      return {icon:MEDAL_ICONS[e.id]||MEDAL_ICONS.spectrum,name:e.m.name,sub:e.m.grades?GRADE_NAMES[e.g]:'Special',op:'1',filter:'none',metal:look?.metal||'',ink:look?.ink||'',tag:look?.tag||''};};
    const equipped=earned.slice(0,6).map(badge);
    const x=v&&medals?medals.metrics(v,now):{};
    const locked=MEDALS.filter(md=>!v?.m?.[md.id]&&md.kind!=='secret').map(md=>{
      const tg=md.grades?(medals?medals.grades(md):md.grades):null,progress=tg?num(x[md.id])/tg[0]:0;
      return {md,progress,sub:md.kind==='rank'?'Top '+tg[0]+' to unlock':tg?fmt(Math.min(num(x[md.id]),tg[0]))+' / '+fmt(tg[0])+' '+md.unit:md.kind==='special'?'Special':''};
    }).sort((a,b)=>b.progress-a.progress);
    const wall=[...earned.map(badge),...locked.map(l=>({icon:MEDAL_ICONS[l.md.id]||MEDAL_ICONS.spectrum,name:l.md.name,sub:l.sub,op:'.34',filter:'grayscale(1)'}))].slice(0,24);
    const mtypes=(c.mtypes||[]).length;
    const d={fields,stats,extras,equipped,badges:wall,
      dread:[{label:'Damage dealt',value:fmt(c.damage||0)},{label:'Fights joined',value:fmt(c.fights||0)},{label:'Victories',value:fmt(c.slayer||0)},{label:'Torpedoes fired',value:fmt(c.torpedo||0)},{label:'MVP awards',value:'×'+fmt(c.topgun||0)}],
      versus:[{label:'Record',value:battles?fmt(wins)+'–'+fmt(losses)+(draws?'–'+fmt(draws):''):'—'},{label:'Win rate',value:battles?Math.round(wins/battles*100)+'%':'—'},{label:'Battles',value:fmt(battles)},{label:'Best win streak',value:fmt(vs?.best||0)},{label:'Versus rank',value:vRank?'#'+vRank:'—'}],
      missions:[{label:'Missions completed',value:fmt(c.missions||0)},{label:'Mission types',value:fmt(mtypes)},{label:seasonName+' rank',value:season?'#'+season.rank:'—'},{label:'Season points',value:season?fmt(season.score):'—'},{label:'Season podiums',value:fmt(c.podium||0)}],
      community:[
        {label:'WATCH STREAK',value:hidden?'Private':fmt(c.streak||0)+' streams',sub:hidden?'':'Best ever '+fmt(c.bestStreak||0)},
        {label:'SEASON GOALS HELPED',value:fmt(c.goals||0),sub:'Gifts toward sub goals'},
        {label:'GIVEAWAYS WON',value:fmt(c.lucky||0),sub:'Wins only, never tickets'},
        {label:'SUBSCRIBED',value:hidden?'Private':fmt(c.months||0)+' months',sub:PLATFORM[who.platform]},
        {label:'HONOUR',value:'★ '+fmt(honour),sub:earned.length+' of '+total+' medals'}]};
    const NAME=who.name.toUpperCase();
    const cc={callsign:title?title.toUpperCase():'NEW RECRUIT',badgeCount:'MEDALS · '+earned.length+' OF '+total,
      statsEyebrow:'!voyager stats · '+NAME+' · '+memberId(who.key,since),badgesEyebrow:'!voyager badges · '+NAME+' · '+earned.length+' OF '+total+' UNLOCKED',
      alsoEarned:earned.length>1?'Also earned: '+earned.slice(1,4).map(e=>e.m.name).join(' · '):'Earn medals to unlock more callsigns',
      promoted:who.name+' has been promoted · welcome to '+TIER_INFO[who.tier].title};
    const promo=fromRank!==null&&fromRank!==undefined&&!fromTier;
    if(promo)cc.promoted=who.name+' has been promoted · '+RANKS[fromRank].name+' to '+rv.rank.name;
    const vip=sample?!!who.vip:cm?.vip===true; // Ruby VIP ribbon (2.20.28): VIP GROUP members, via the Points Ledger
    const emerald=sample?!!who.emerald:cm?.emerald===true; // Emerald Elite ribbon (2.20.29): the moderators' group
    const vv={front:side==='front'?'block':'none',stats:side==='stats'?'block':'none',badges:side==='badges'?'block':'none',banner:fromTier||promo?'flex':'none',vip:vip?'flex':'none',emerald:emerald&&!vip?'flex':'none',ribbonPad:vip||emerald?'160px':'0',
      // Both: one ribbon, red into green, so neither covers the title or the rank shield.
      vipText:vip&&emerald?'★ RUBY VIP · EMERALD ★':'★ RUBY VIP ★',vipFont:vip&&emerald?'15px':'17px',vipSpacing:vip&&emerald?'3px':'5px',
      vipBg:vip&&emerald?'linear-gradient(90deg, #e0313f 0%, #e0313f 44%, #22b04c 56%, #22b04c 100%)':'linear-gradient(90deg, #e0313f, #e0313f)',
      bannerEyebrow:promo?'★ PROMOTED ★':'★ TIER UP ★',
      bannerText:fromTier?TIER_INFO[fromTier].title+' → '+TIER_INFO[who.tier].title:promo?RANKS[fromRank].name.toUpperCase()+' → '+rv.rank.name.toUpperCase():''};
    return {tier:who.tier,vip,emerald,fromTier:fromTier||'',promotion:promo,fromRankId:promo?RANKS[fromRank].id:'',fromRankName:promo?RANKS[fromRank].name.toUpperCase():'',side,name:who.name,platform:who.platform,t,v:vv,c:cc,d,k:rv.k,rank:rv.rank.id};
  }

  // ---------- control page and OBS ----------
  preview({tier='gold',side='front',tierUp=false,promotion=false,fleet='',vip=false,emerald=false}={}){
    if(fleet){const stage=FLEET_KINDS.indexOf(fleet);if(stage<1)throw new Error('Unknown fleet preview.');
      const e={id:'preview',stage,name:fleet==='follow'?'StarboundAce':'NebulaKnight',platform:'twitch',userId:fleet==='follow'?'preview-new':'preview',amount:fleet==='gift'?5:fleet==='bits'?500:1,months:fleet==='resub'?14:1,tier:fleet==='sub'?'Tier 1':'',test:true};
      // A new follower has no record yet: their card is built from nothing, like the real thing.
      return this.fleetCard(e,this.now(),fleet!=='follow');}
    if(!TIER_ORDER.includes(tier)||!['front','stats','badges'].includes(side))throw new Error('Unknown card preview.');
    const who={key:'twitch:preview',platform:'twitch',login:'nebulaknight',name:'NebulaKnight',tier,points:1450,rank:4,members:312,hasPoints:true,vip:vip===true,emerald:emerald===true};
    const card=this.build(who,side,tierUp&&tier!=='blue'?TIER_ORDER[TIER_ORDER.indexOf(tier)-1]:null,true,promotion?4:null);
    const item={id:++this.state.seq,at:this.now(),seconds:this.state.settings.seconds,card,preview:true};
    this.state.queue=[...this.state.queue,item].slice(-20);return item;
  }
  configure(raw){this.state.settings=normalizeCardSettings({...this.state.settings,...raw},this.state.settings);this.persist();return this.view();}
  overlay(){const now=this.now();return {serverAt:now,sound:this.state.settings.sound,items:this.state.queue.filter(x=>x.at<=now&&now-x.at<10*60000)};}

  // ---------- after Fleet alerts (2.20.23) ----------
  // The "Voyager - Fleet Alerts" action broadcasts its queue (startAt/endAt per alert, serial). Each follow, sub, gift,
  // resub or bits alert gets a card that plays once the Fleet animation (and any alerts queued right behind it) has ended:
  // a new follower's card is presented; a member's card shows the support landing on it live.
  fromFleet(state,serverAt){
    const s=this.state.settings;if(!s.enabled||!state||!Array.isArray(state.queue))return [];
    const now=this.now(),skew=Number.isFinite(Number(serverAt))&&serverAt>0?now-Number(serverAt):0;
    this.fleetSeen||=new Map();
    const queue=state.queue.filter(e=>e&&typeof e.id==='string'&&e.status==='queued'&&Number.isFinite(Number(e.startAt))&&Number.isFinite(Number(e.endAt))).sort((a,b)=>a.startAt-b.startAt);
    const made=[];
    queue.forEach((e,i)=>{
      let end=Number(e.endAt);for(let j=i+1;j<queue.length;j++){if(Number(queue[j].startAt)-end>2500)break;end=Number(queue[j].endAt);}
      const at=end+skew+500,prev=this.fleetSeen.get(e.id);
      if(prev!==undefined){const it=this.state.queue.find(x=>x.id===prev);if(it&&it.at>now&&it.at!==at){it.at=at;this.persist();}return;}
      this.fleetSeen.set(e.id,0);if(this.fleetSeen.size>600)this.fleetSeen.delete(this.fleetSeen.keys().next().value);
      if(Number(e.endAt)+skew<now-30000)return; // already over before Voyager heard of it
      const stage=Number(e.stage);if(!(stage>=1&&stage<=5))return; // raids have no supporter
      if(stage===1?!s.fleet.welcome:!s.fleet.support)return;
      const item=this.fleetCard(e,at);if(!item)return;
      this.fleetSeen.set(e.id,item.id);made.push(item);
    });
    return made;
  }
  fleetCard(e,at,sample=false){
    const platform=clean(e.platform||'twitch',10).toLowerCase();if(!PLATFORM[platform])return null;
    const id=clean(e.userId,128),name=clean(e.name,60),login=clean(e.login,60).toLowerCase()||name.toLowerCase();if(!name)return null;
    const key=id?platform+':'+id:this.findKey(platform,login)||platform+':fleet-'+login.replace(/[^a-z0-9_]/g,'').slice(0,40);
    if(!KEY.test(key))return null;
    const stage=Number(e.stage),kind=FLEET_KINDS[stage],amount=Math.max(0,Math.round(num(e.amount))),months=Math.max(0,Math.round(num(e.months)));
    const medals=this.medals,v=sample?SAMPLE_VIEWER(this.now()):medals?.state?.viewers?.[key],c=v?.c||{},cm=sample?{tier:'gold',balance:2380}:this.community()?.state?.members?.[key];
    const tier=TIER_ORDER.includes(cm?.tier)?cm.tier:TIER_ORDER.includes(this.state.members[key]?.tier)?this.state.members[key].tier:'blue';
    const balance=Number.isFinite(cm?.balance)?num(cm.balance):-1,P=this.state.settings.fleet.points;
    const over={c:{},m:{}};let points=0,text='',note='',eyebrow='★ FLEET SUPPORT ★',unit=platform==='kick'?'KICKS':platform==='youtube'?'SUPER CHAT':'BITS';
    if(kind==='follow'){points=P.follow;eyebrow='★ NEW FOLLOWER ★';text='WELCOME ABOARD';note=name+' joined the fleet · Blue Explorer · type !voyager any time to show your card';}
    if(kind==='sub'){over.c.months=(c.months||0)+1;points=P.sub;text='SUBSCRIBED'+(e.tier?' · '+clean(e.tier,20).toUpperCase():'');note='Thank you for the subscription, '+name+' · you are a legend';}
    if(kind==='resub'){over.c.months=Math.max((c.months||0)+1,months);points=P.resub;text='RESUBSCRIBED · '+fmt(over.c.months)+' MONTHS';note='Welcome back to the fleet, '+name;}
    if(kind==='gift'){over.c.gifts=(c.gifts||0)+amount;over.c.giftMax=Math.max(c.giftMax||0,amount);points=P.gift*amount;text=fmt(amount)+' GIFT SUB'+(amount===1?'':'S');note='Thank you for growing the fleet, '+name;}
    if(kind==='bits'){const k=platform==='kick'?'kicks':platform==='youtube'?'sc':'bits';over.c[k]=(c[k]||0)+amount;points=P.bits*amount;text=fmt(amount)+' '+unit;note='Thank you for powering the fleet, '+name;}
    // A medal the support just earned or upgraded (Loyal Subscriber, Fleet Gifter, Gift Bomb, Power Supply).
    let medal=null;
    if(medals){const x={subs:over.c.months,gifter:over.c.gifts,giftbomb:over.c.giftMax,power:over.c.bits!==undefined||over.c.kicks!==undefined||over.c.sc!==undefined?(over.c.bits??c.bits??0)+(over.c.kicks??c.kicks??0)+(over.c.sc??c.sc??0):undefined};
      for(const [mid,val] of Object.entries(x)){if(val===undefined)continue;const md=medalById(mid);if(!md?.grades)continue;const t=medals.grades(md);let g=-1;for(let i=3;i>=0;i--)if(val>=t[i]){g=i;break;}
        const had=v?.m?.[mid]?.g??-1;if(g>had){over.m[mid]={g,at:this.now()};if(!medal||g>medal.grade)medal={id:mid,name:md.name,grade:g,gradeName:GRADE_NAMES[g],upgrade:had>=0};}}}
    const who={key,platform,login,name,tier,points:balance,rank:0,members:0,hasPoints:balance>=0};
    const before=this.build(who,'front',null,sample,null);
    const after=this.build({...who,points:balance<0?points:balance+points,hasPoints:balance>=0||points>0},'front',null,sample,null,over);
    // The medal just earned always makes the card's medal row, so the ceremony can pop it in.
    if(medal&&!after.d.equipped.some(b=>b.name===medal.name)){const b=after.d.badges.find(x=>x.name===medal.name);if(b){after.d.equipped.splice(Math.min(5,after.d.equipped.length),0,b);after.d.equipped.length=Math.min(after.d.equipped.length,6);}}
    const delta=[];
    before.d.stats.forEach((st,i)=>{if(after.d.stats[i]&&after.d.stats[i].value!==st.value)delta.push({kind:'stat',i,label:st.label,from:st.value,to:after.d.stats[i].value});});
    before.d.extras.forEach((ex,i)=>{if(after.d.extras[i]&&after.d.extras[i].value!==ex.value)delta.push({kind:'extra',i,label:ex.label,from:ex.value,to:after.d.extras[i].value});});
    const title=kind==='follow'?{eyebrow:'★ VOYAGER FLEET ★',word:'WELCOME',sub:name+' · NEW RECRUIT · BLUE EXPLORER'}:null;
    const item={id:++this.state.seq,at,seconds:this.state.settings.seconds,card:before,live:{kind,eyebrow,text,note,points,delta,medal,title,test:e.test===true,after},preview:sample||e.id==='preview'||undefined};
    if(item.preview){this.state.queue=[...this.state.queue,item].slice(-20);return item;}
    this.member(key).tier=tier;
    this.state.queue=[...this.state.queue.filter(x=>this.now()-x.at<10*60000),item].slice(-20);
    this.state.recent=[{id:item.id,at,name,platform,tier,side:'front',tierUp:false,promotion:'',fleet:kind},...this.state.recent].slice(0,30);
    this.persist();return item;
  }
  // 2.20.17: rows for the public site's crew lookup (crew.json): name, platform, tier, rank, all-time place, lifetime points and medals.
  crewRows(limit=2000){
    this.memo={};try{return this.crewRowsInner(limit);}finally{this.memo=null;}
  }
  crewRowsInner(limit){
    const viewers=this.medals?.state?.viewers||{},members=this.community()?.state?.members||{};
    const pilots=new Map((this.rankings()||[]).filter(p=>p&&p.login).map(p=>[String(p.login).toLowerCase(),p]));
    let standings=[];try{standings=this.community()?.standings(1000)||[];}catch{}
    const season=new Map(standings.map(r=>[r.key,r]));
    // 2.20.34: the top `limit` by lifetime points, plus every Kick and YouTube member and every Silver+ member, so a
    // viewer whose Kick or YouTube account has fewer points than their Twitch one still finds that card on the site.
    const all=this.ranksView(Infinity).members,picked=all.slice(0,limit),seen=new Set(picked.map(m=>m.key));
    for(const m of all.slice(limit))if(m.platform!=='twitch'||m.tier!=='blue'){picked.push(m);seen.add(m.key);}
    return picked.map(m=>{const v=viewers[m.key],c=v?.c||{},login=String(members[m.key]?.login||'').toLowerCase(),p=m.platform==='twitch'?pilots.get(login):null,sr=season.get(m.key);
      return {name:m.name,platform:m.platform,tier:m.tier,rank:m.rank,place:m.place,lifetime:m.lifetime,
        medals:Object.entries(v?.m||{}).sort((a,b)=>b[1].g-a[1].g||b[1].at-a[1].at).map(([id,e])=>[id,e.g]),
        // 2.20.18: the back of the card (service record). Games, missions, season and wins only: never watch time, subs, gifts or Bits.
        record:{honour:v&&this.medals?this.medals.honour(v):0,fights:c.fights||0,victories:c.slayer||0,mvp:c.topgun||0,damage:c.damage||0,
          wins:num(p?.wins),losses:num(p?.losses),missions:c.missions||0,giveaways:c.lucky||0,podiums:c.podium||0,seasonPlace:sr?.rank||0,seasonPoints:sr?.score||0,
          since:v?.first?new Date(v.first).toISOString().slice(0,7):'',
          // 2.20.19 (asked for): activity. Members who typed !voyager private keep hours watched and months subscribed hidden, as on their card.
          ...(()=>{const x=v&&this.medals?this.medals.metrics(v,this.now()):{},priv=!!this.state.members[m.key]?.private;
            return {private:priv,hours:priv?0:Math.floor(x.watch||0),months:priv?0:c.months||0,subBest:priv?0:c.subBest||0,gifts:c.gifts||0,streams:c.days||0,streak:c.streak||0,bestStreak:c.bestStreak||0,
              messages:c.msgs||0,followDays:x.follow||0,versusBest:num(this.medals?.state?.versus?.[login]?.best),points:num(members[m.key]?.balance)};})()},
        // 2.20.20: the front exactly as the !voyager card shows it on stream (same builder), for the public site.
        front:(()=>{try{const cm=members[m.key]||{};return this.publicFront(this.build({key:m.key,platform:m.platform,login,name:m.name,tier:m.tier,points:num(cm.balance),hasPoints:Number.isFinite(cm.balance),rank:0,members:0},'front',null));}catch{return null;}})()};});
  }
  // The front of a built card, trimmed to what the template draws (no medal icons or tier styling: the site has those).
  publicFront(card){
    return {tier:card.tier,next:card.t.next,pct:card.t.pct,need:card.t.need,callsign:card.c.callsign,badgeCount:card.c.badgeCount,
      fields:card.d.fields.map(f=>f.value),stats:card.d.stats.map(x=>[x.label,x.value,x.sub]),extras:card.d.extras.map(x=>[x.label,x.value]),equipped:card.d.equipped.map(b=>[b.name,b.sub]),
      rank:card.k.show==='none'?null:{id:card.rank,name:card.k.name,place:card.k.place}};
  }
  // 2.20.13: the Ranks page in Voyager Control. Everyone with lifetime points, their rank, all-time place and progress.
  ranksView(limit=1000){
    const {rows,place}=this.board(),members=this.community()?.state?.members||{},pts=this.state.settings.rankPoints,count=new Array(RANKS.length).fill(0);
    const roster=rows.map(r=>{const m=members[r.key]||{},pl=place.get(r.key),i=this.rankOf(r.value,pl),next=RANKS[i+1];count[i]++;
      const need=next?Math.max(0,pts[i+1]-r.value):0,span=next?pts[i+1]-pts[i]:0;
      return {key:r.key,name:clean(m.name||m.login||r.key,60),platform:r.key.split(':')[0],tier:m.tier||this.state.members[r.key]?.tier||'blue',lifetime:r.value,place:pl,rank:i,
        next:next?i+1:null,need,gated:!!next&&need===0&&!!next.top,progress:next?Math.max(0,Math.min(1,span?(r.value-pts[i])/span:1)):1};});
    return {settings:{ranks:this.state.settings.ranks,promoChat:this.state.settings.promoChat,promoMin:this.state.settings.promoMin,rankPoints:pts,enabled:this.state.settings.enabled},
      defaults:CARD_DEFAULTS.rankPoints,ranks:RANKS.map((x,i)=>({...x,points:pts[i],holders:count[i]})),insignia:INSIGNIA,total:roster.length,
      lifetime:rows.reduce((a,r)=>a+r.value,0),members:roster.slice(0,limit),promotions:(this.state.promotions||[]).slice(0,50)};
  }
  view(){const {rows,place}=this.board(),count=new Array(RANKS.length).fill(0);for(const r of rows)count[this.rankOf(r.value,place.get(r.key))]++;
    return {settings:this.state.settings,defaults:CARD_DEFAULTS,recent:this.state.recent,lastEvent:this.lastEvent,tiers:TIER_INFO,ranks:RANKS.map((x,i)=>({...x,points:this.state.settings.rankPoints[i],holders:count[i]}))};}
}
