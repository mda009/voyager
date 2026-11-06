// On-screen moments (2.20.64): one OBS overlay with seven small elements fed by what Voyager already knows.
//   hints   command hints chip (top-left)            surge   crew surge chip (top-right, when supports pile up)
//   dread   Dreadnought live HUD (right)             promo   promotion ceremony (centre-top, rank-ups from a chosen rank)
//   next    next-celebration chip (above the goals strip)   ticker   "Right now" strip (bottom)   toast   medal toasts (optional; medals.html has its own)
// Events feed the ticker: support alerts (Fleet Alerts queue), medals (Medals recent list), Versus results, promotions, Dreadnought results.
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
export const ELEMENTS={hints:'Command hints',surge:'Crew surge',dread:'Dreadnought live HUD',promo:'Promotion ceremony',next:'Next-celebration chip',ticker:'Right now ticker',toast:'Medal toasts',points:'Points added',streak:'Stream streak',goals:'Voyager goals strip'};
export const RANK_NAMES=['Midshipman','Acting Sub-Lieutenant','Sub-Lieutenant','Lieutenant','Lieutenant Commander','Commander','Captain','Commodore','Rear Admiral','Vice Admiral','Admiral','Admiral of the Fleet'];
export const RANK_ABBR=['MIDN','ASLT','SBLT','LEUT','LCDR','CMDR','CAPT','CDRE','RADM','VADM','ADML','AF'];
const STAGE={1:'follow',2:'sub',3:'gift',4:'resub',5:'bits',6:'raid'};
const TIERS=['silver','gold','platinum'],TIER_LABEL={silver:'Silver',gold:'Gold',platinum:'Platinum'};
// 2.20.66 Screen layout: where each moment sits on the 1920 x 1080 canvas (top-left corner; the ticker also has a width), and
// reference boxes for the other OBS overlays so they can be arranged around each other on the Screen layout page.
export const LAYOUT_DEFAULTS={hints:{x:28,y:28,w:420,h:58},surge:{x:1532,y:28,w:360,h:70},dread:{x:1512,y:120,w:380,h:300},promo:{x:640,y:150,w:640,h:150},next:{x:744,y:890,w:460,h:40},
  ticker:{x:28,y:1012,w:1864,h:56},toast:{x:28,y:838,w:420,h:92},points:{x:28,y:480,w:420,h:300},streak:{x:0,y:380,w:1920,h:160},goals:{x:400,y:944,w:1120,h:54}};
export const LAYOUT_FIXED={streak:'x',ticker:''}; // streak always spans the width; the ticker's width can change
export const MARKERS={camera:{label:'Camera (Brio) + frame',x:1512,y:716,w:380,h:214,on:true,setup:'Support alerts › Camera spotlight',src:'obs'},
  goals:{label:'Goals strip (StreamUP, if still used)',x:400,y:944,w:1120,h:54,on:false,setup:'Goal FX setup',src:'obs'},
  community:{label:'Community panel',x:1548,y:132,w:356,h:420,on:true,setup:'Community goals › OBS panel',src:'community'},
  leaderboard:{label:'Leaderboard panel',x:1548,y:132,w:356,h:420,on:false,setup:'Leaderboard panel setup',src:'obs'},
  medals:{label:'Medal toast (medals.html)',x:56,y:826,w:680,h:164,on:true,setup:'Medals setup',src:'obs'},
  card:{label:'Membership card',x:700,y:260,w:520,h:560,on:false,setup:'Membership card setup',src:'obs'},
  fleet:{label:'Support alerts (Fleet overlay)',x:0,y:0,w:1920,h:1080,on:false,setup:'Fleet alerts setup',src:'obs'},
  stats:{label:'Live stats strip',x:0,y:0,w:1920,h:64,on:false,setup:'Live dashboard',src:'obs'},
  christmas:{label:'Christmas goal panel',x:1500,y:560,w:400,h:300,on:false,setup:'Community goals',src:'obs'},
  dreadnought:{label:'Dreadnought overlay',x:0,y:0,w:1920,h:1080,on:false,setup:'Dreadnought setup',src:'obs'},
  versus:{label:'Versus arena',x:0,y:0,w:1920,h:1080,on:false,setup:'Voyager Versus',src:'obs'}};
export const DEFAULTS={
  elements:{hints:true,surge:true,dread:true,promo:true,next:true,ticker:true,toast:false,points:true,streak:true,goals:true},
  hints:[{cmd:'!voyager',text:'Shows your membership card'},{cmd:'!versus',text:'Challenge a pilot in the arena'},{cmd:'!report',text:'Report for duty and earn points'},{cmd:'!medals',text:'See the medals you have earned'}],
  hintSeconds:20,hintQuietMinutes:10,
  surge:{count:5,windowMinutes:3,durationMinutes:5,label:'CREW SURGE'},
  promoMin:7,promoSeconds:9,tickerCount:10,tickerMinutes:30,toastSeconds:6,
  pointsMin:5,pointsMax:6,pointsSeconds:4,streakMin:2,streakMax:5,streakSeconds:4,
  goalsStripTop:1010,
  layout:Object.fromEntries(Object.entries(LAYOUT_DEFAULTS).map(([k,v])=>[k,{...v}])),
  markers:Object.fromEntries(Object.entries(MARKERS).map(([k,v])=>[k,{x:v.x,y:v.y,w:v.w,h:v.h,on:v.on}])),
};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const int=(v,min,max)=>{const n=Number(v);return Number.isInteger(n)&&n>=min&&n<=max?n:null;};
export function normalizeSettings(raw,base=DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},s=structuredClone(base);
  if(r.elements&&typeof r.elements==='object')for(const k of Object.keys(ELEMENTS))if(r.elements[k]!==undefined)s.elements[k]=r.elements[k]===true;
  if(r.hints!==undefined){if(!Array.isArray(r.hints)||r.hints.length>12)throw new Error('Up to 12 hints.');
    s.hints=r.hints.map(h=>({cmd:clean(h?.cmd,24),text:clean(h?.text,60)})).filter(h=>h.cmd&&h.text);}
  for(const [k,min,max] of [['hintSeconds',5,120],['hintQuietMinutes',0,60],['promoMin',0,11],['promoSeconds',4,30],['tickerCount',3,20],['tickerMinutes',5,240],['toastSeconds',3,20],['goalsStripTop',0,1080],['pointsMin',1,100000],['pointsMax',1,12],['pointsSeconds',2,12],['streakMin',2,100],['streakMax',1,12],['streakSeconds',2,12]])
    if(r[k]!==undefined){const n=int(r[k],min,max);if(n===null)throw new Error(k+' must be a whole number between '+min+' and '+max+'.');s[k]=n;}
  if(r.surge&&typeof r.surge==='object'){for(const [k,min,max] of [['count',2,20],['windowMinutes',1,30],['durationMinutes',1,60]])if(r.surge[k]!==undefined){const n=int(r.surge[k],min,max);if(n===null)throw new Error('Crew surge '+k+' must be a whole number between '+min+' and '+max+'.');s.surge[k]=n;}
    if(r.surge.label!==undefined)s.surge.label=clean(r.surge.label,24)||'CREW SURGE';}
  if(r.layout&&typeof r.layout==='object')for(const k of Object.keys(LAYOUT_DEFAULTS)){const b=r.layout[k];if(!b||typeof b!=='object')continue;const d=LAYOUT_DEFAULTS[k],cur=s.layout[k];
    const x=LAYOUT_FIXED[k]==='x'?0:int(b.x??cur.x,-200,1920),y=int(b.y??cur.y,-200,1080),w=k==='ticker'||k==='goals'?int(b.w??cur.w,300,1920):d.w,h=d.h;if(x===null||y===null||w===null)throw new Error(ELEMENTS[k]+': the position must be whole pixels on the 1920 x 1080 canvas.');s.layout[k]={x,y,w,h};}
  if(r.markers&&typeof r.markers==='object')for(const k of Object.keys(MARKERS)){const b=r.markers[k];if(!b||typeof b!=='object')continue;const cur=s.markers[k];
    const x=int(b.x??cur.x,-200,1920),y=int(b.y??cur.y,-200,1080),w=int(b.w??cur.w,40,1920),h=int(b.h??cur.h,24,1080);if(x===null||y===null||w===null||h===null)throw new Error(MARKERS[k].label+': the box must be whole pixels on the 1920 x 1080 canvas.');s.markers[k]={x,y,w,h,on:b.on===undefined?cur.on:b.on===true};}
  return s;
}
export class Moments{
  constructor({dataDir,now=()=>Date.now(),boss=()=>null,medals=()=>[],promotions=()=>[],medalToasts=()=>[],medalIcon=()=>''}={}){
    Object.assign(this,{dataDir,now,bossView:boss,medalsRecent:medals,promotionsList:promotions,medalToasts,medalIcon});
    this.settings=structuredClone(DEFAULTS);this.events=[];this.seq=0;this.seenFleet=new Set();this.fleetPrimed=false;this.medalSeen=0;this.medalPrimed=false;this.promoSeen=0;this.promoPrimed=false;
    this.supports=[];this.surgeUntil=0;this.surgeCount=0;this.surgeStartedAt=0;this.goals=null;this.goalsAt=0;this.lastBossPhase='';this.lastBossId='';this.lastCommandAt=0;this.revision=0;this.saving=Promise.resolve();
  }
  get file(){return join(this.dataDir,'moments.json');}
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeSettings(raw.settings||{});this.revision=Number(raw.revision)||0;}catch{}return this;}
  persist(){const data=JSON.stringify({schema:1,settings:this.settings,revision:this.revision});this.saving=this.saving.then(async()=>{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,data);await rename(tmp,this.file);}).catch(()=>{});return this.saving;}
  configure(raw){this.settings=normalizeSettings(raw,this.settings);this.revision++;void this.persist();return this.view();}
  setElement(key,on){if(!Object.hasOwn(ELEMENTS,key))throw new Error('Unknown element.');this.settings.elements[key]=!!on;this.revision++;void this.persist();return this.view();}
  // ---------- events ----------
  push(e){const ev={id:++this.seq,at:this.now(),...e};this.events=[ev,...this.events].slice(0,60);return ev;}
  support(kind,name,extra={}){const s=this.settings.surge,now=this.now();this.supports=[...this.supports.filter(t=>now-t<=s.windowMinutes*60000),now];
    if(this.supports.length>=s.count){if(now>=this.surgeUntil){this.surgeStartedAt=now;this.surgeCount=this.supports.length;}else this.surgeCount++;this.surgeUntil=now+s.durationMinutes*60000;}
    else if(now<this.surgeUntil){this.surgeCount++;this.surgeUntil=now+s.durationMinutes*60000;}
    return this.push({kind:'support',sub:kind,name:clean(name,40),...extra});}
  // Fleet Alerts queue: every new entry is a support event (follow, sub, gift, resub, bits, raid). The first sync only primes.
  fleet(ev){const q=Array.isArray(ev?.state?.queue)?ev.state.queue:[];if(!this.fleetPrimed){for(const e of q)this.seenFleet.add(String(e.id));this.fleetPrimed=true;return;}
    for(const e of q){const id=String(e.id||'');if(!id||this.seenFleet.has(id))continue;this.seenFleet.add(id);if(e.test)continue;const kind=STAGE[Number(e.stage)]||'support';
      this.support(kind,e.name,{amount:Number(e.amount)||0,months:Number(e.months)||0,tier:clean(e.tier,16)});}
    if(this.seenFleet.size>500)this.seenFleet=new Set([...this.seenFleet].slice(-250));}
  // Medals: new awards since the last look (recent[] is newest first with increasing ids).
  pollMedals(){const list=this.medalsRecent()||[];if(!this.medalPrimed){this.medalSeen=list.reduce((a,x)=>Math.max(a,Number(x.id)||0),0);this.medalPrimed=true;return;}
    const fresh=list.filter(x=>Number(x.id)>this.medalSeen).sort((a,b)=>a.id-b.id);for(const a of fresh){this.medalSeen=Number(a.id);this.push({kind:'medal',name:clean(a.name,40),platform:a.platform,medal:a.medal,title:clean(a.title,40),grade:a.grade,gradeName:a.gradeName||'',special:!!a.special});}}
  pollPromotions(){const list=this.promotionsList()||[];if(!this.promoPrimed){this.promoSeen=list.reduce((a,x)=>Math.max(a,Number(x.at)||0),0);this.promoPrimed=true;return;}
    const fresh=list.filter(x=>Number(x.at)>this.promoSeen).sort((a,b)=>a.at-b.at);for(const p of fresh){this.promoSeen=Number(p.at);this.push({kind:'promo',name:clean(p.name,40),platform:p.platform,from:Number(p.from)||0,to:Number(p.to)||0,place:Number(p.place)||0});}}
  pollBoss(){const b=this.bossView();if(!b)return;const phase=b.phase||'idle',id=String(b.id||'');if(phase==='result'&&(this.lastBossPhase!=='result'||this.lastBossId!==id)&&!b.demo){const top=b.leaders?.[0];this.push({kind:'dread',outcome:b.outcome||'',speed:b.speed||'',elapsed:Number(b.elapsed)||0,bonus:Number(b.bonus)||0,top:top?clean(top.name,40):'',pilots:Number(b.pilots)||0});}
    this.lastBossPhase=phase;this.lastBossId=id;}
  versus(event){if(!event||event.demo||event.type!=='finish')return;const [a,b]=event.players||[];const name=p=>clean(p?.name||p?.login,25);
    if(event.cancelled)return;if(event.winner===null){this.push({kind:'versus',draw:true,a:name(a),b:name(b),duration:Number(event.duration)||0});return;}
    this.push({kind:'versus',winner:name(event.players[event.winner]),loser:name(event.players[1-event.winner]),duration:Number(event.duration)||0});}
  // Giveaway goals reading (Streamer.bot "Voyager - Read OBS Percentages", channel mda009.voyager.goals).
  goalsReading(packet){const s=packet?.samples;if(!s||typeof s!=='object')return;const out={};for(const t of TIERS){const x=s[t];if(x&&typeof x.points==='number')out[t]={points:Math.max(0,x.points),target:Number(x.targetPoints)>0?Number(x.targetPoints):0};}
    if(Object.keys(out).length){this.goals=out;this.goalsAt=this.now();}}
  // 2.20.65: points added to members' accounts since the last ledger (every ~30 s) become one batch event; the overlay
  // floats up to pointsMax chips (largest first) and sums the rest. Below pointsMin a gain is only counted in the batch.
  points(list){const s=this.settings,items=(Array.isArray(list)?list:[]).filter(x=>Number(x?.amount)>0).map(x=>({name:clean(x.name,40),platform:x.platform,amount:Math.round(Number(x.amount)),total:Math.round(Number(x.total)||0)})).sort((a,b)=>b.amount-a.amount);
    if(!items.length)return null;const shown=items.filter(x=>x.amount>=s.pointsMin).slice(0,s.pointsMax);const sum=items.reduce((a,x)=>a+x.amount,0);
    return this.push({kind:'points',items:shown,count:items.length,sum,top:items[0]});}
  // Stream streaks kept today (a viewer earned points on consecutive stream days): one batch event per scan.
  streaks(list){const s=this.settings,items=(Array.isArray(list)?list:[]).filter(x=>Number(x?.streak)>=s.streakMin).map(x=>({name:clean(x.name,40),platform:x.platform,streak:Number(x.streak),best:Number(x.best)||0})).sort((a,b)=>b.streak-a.streak);
    if(!items.length)return null;return this.push({kind:'streak',items:items.slice(0,s.streakMax),count:items.length,top:items[0]});}
  commandSeen(){this.lastCommandAt=this.now();}
  nextCelebration(){const g=this.goals;if(!g||this.now()-this.goalsAt>120000)return null;const order=TIERS.filter(t=>g[t]&&g[t].target>0);
    const open=order.filter(t=>g[t].points<g[t].target);if(!open.length)return {done:true,tier:'platinum',label:'ALL CELEBRATIONS REACHED',remaining:0};
    const t=open[0],after=open[1];return {done:false,tier:t,label:TIER_LABEL[t],remaining:g[t].target-g[t].points,points:g[t].points,target:g[t].target,next:after?{tier:after,label:TIER_LABEL[after],target:g[after].target}:null};}
  // 2.20.67: the goals strip drawn by Voyager (Silver / Gold / Platinum from the same reading the next-celebration chip uses).
  goalsStrip(){const g=this.goals;if(!g||this.now()-this.goalsAt>120000)return null;return {at:this.goalsAt,tiers:TIERS.filter(t=>g[t]).map(t=>({tier:t,label:TIER_LABEL[t],points:g[t].points,target:g[t].target,reached:g[t].target>0&&g[t].points>=g[t].target}))};}
  surge(){const now=this.now();return {active:now<this.surgeUntil,until:this.surgeUntil,startedAt:this.surgeStartedAt,count:this.surgeCount,recent:this.supports.filter(t=>now-t<=this.settings.surge.windowMinutes*60000).length,label:this.settings.surge.label};}
  tick(){this.pollMedals();this.pollPromotions();this.pollBoss();}
  // Test buttons on the control page push a sample event (marked test, shown like a real one).
  test(kind){const samples={support:()=>this.support('gift','Sample Gifter',{amount:3,test:true}),medal:()=>this.push({kind:'medal',name:'Sample Pilot',platform:'twitch',medal:'watch',title:'Night Watch',grade:0,gradeName:'Bronze',test:true}),
    promo:()=>this.push({kind:'promo',name:'Sample Pilot',platform:'twitch',from:7,to:8,place:4,test:true}),versus:()=>this.push({kind:'versus',winner:'Sample Pilot',loser:'Sample Rival',duration:38,test:true}),
    dread:()=>this.push({kind:'dread',outcome:'victory',speed:'hero',elapsed:98,bonus:10,top:'Sample Pilot',pilots:7,test:true}),surge:()=>{const now=this.now();this.surgeStartedAt=now;this.surgeCount=this.settings.surge.count;this.surgeUntil=now+this.settings.surge.durationMinutes*60000;return {kind:'surge',test:true};},
    points:()=>this.points([{name:'Sample Pilot',platform:'twitch',amount:150,total:12650},{name:'Sample Rival',platform:'kick',amount:40,total:3200},{name:'Sample Scout',platform:'youtube',amount:10,total:410}]),
    streak:()=>this.streaks([{name:'Sample Pilot',platform:'twitch',streak:5,best:5},{name:'Sample Rival',platform:'twitch',streak:2,best:9}]),
    goals:()=>{this.goalsReading({samples:{silver:{points:22,targetPoints:25},gold:{points:22,targetPoints:50},platinum:{points:22,targetPoints:100}}});return {kind:'goals',test:true};}};
    if(!samples[kind])throw new Error('Unknown test.');return samples[kind]();}
  clearSurge(){this.surgeUntil=0;this.supports=[];}
  overlay(){const now=this.now(),s=this.settings,b=this.bossView();
    const dread=b&&b.phase&&b.phase!=='idle'?{phase:b.phase,hp:b.hp,maxHp:b.maxHp,startedAt:b.startedAt,endsAt:b.endsAt,lobbyEndsAt:b.lobbyEndsAt,outcome:b.outcome||'',speed:b.speed||'',bonus:b.bonus||0,elapsed:b.elapsed||0,endedAt:b.endedAt||0,shield:!!b.shield,goals:b.goals,leaders:(b.leaders||[]).slice(0,5),pilots:b.pilots||0,name:b.name,demo:!!b.demo}:null;
    return {serverAt:now,revision:this.revision,elements:s.elements,hints:s.hints,hintSeconds:s.hintSeconds,hintsQuietUntil:this.lastCommandAt?this.lastCommandAt+s.hintQuietMinutes*60000:0,
      layout:s.layout,surge:this.surge(),dread,next:this.nextCelebration(),goals:this.goalsStrip(),promoMin:s.promoMin,promoSeconds:s.promoSeconds,toastSeconds:s.toastSeconds,goalsStripTop:s.goalsStripTop,pointsSeconds:s.pointsSeconds,streakSeconds:s.streakSeconds,
      events:this.events.filter(e=>now-e.at<=s.tickerMinutes*60000).slice(0,s.tickerCount),toasts:s.elements.toast?(this.medalToasts()||[]).filter(t=>now-t.at<5*60000).slice(-10).map(t=>({...t,icon:this.medalIcon(t.medal)||''})):[]};}
  view(){return {settings:this.settings,defaults:DEFAULTS,elements:ELEMENTS,layoutDefaults:LAYOUT_DEFAULTS,markerInfo:MARKERS,ranks:RANK_NAMES,revision:this.revision,surge:this.surge(),next:this.nextCelebration(),goalsAt:this.goalsAt,events:this.events.slice(0,20),dread:this.bossView()?.phase||'idle'};}
}
