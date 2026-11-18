/* Voyager Bounty Hunt (2.37.0): a crew search only the streamer can start. A wanted ship is hiding in a sector; chat closes a
   search ring onto it before it jumps away. Three ways to help, the same shape as the Dreadnought:
     FREE       !track   one count per hunter every 8 seconds; each one tightens the ring a little
     CHEERS     bits / Super Chats   a scanner pulse that tightens the ring faster (capped per cheer)
     GIFT SUBS  each gifted sub launches a wingman that keeps tightening the ring until the hunt ends
   Capture: every hunter who tracked at least once gets the same number of tickets for the active ticketed giveaway
   (onTickets), and the MVP a few more. Cheers and gifts help the whole crew but never earn the payer tickets by themselves:
   only !track puts someone on the ticket list, only a !track can land the final fix, and by default the MVP is the hunter
   with the most !track counts (setting mvpFreeOnly). Names (the targets, their ships, the sectors) are Voyager's own. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const WORDS=['!track','!hunt'];
export const BOUNTY_DEFAULTS={enabled:true,announce:true,practice:false,mvpFreeOnly:true,lobbySeconds:30,huntSeconds:240,cooldownSeconds:120,tickets:5,mvpTickets:2};
// goal = base + perHunter × hunters, in "fixes". A !track is 1 fix; 100 bits is 2 (up to bitsCap a cheer); a wingman adds 1 every 6 s.
export const RULES={pace:8000,base:10,perHunter:8,bitsMin:100,bitsPer:50,bitsCap:12,wingEvery:6000,wingCap:30,result:25000};
const LIMITS={lobbySeconds:[10,120],huntSeconds:[60,600],cooldownSeconds:[0,3600],tickets:[0,100],mvpTickets:[0,100]};
const LABELS={lobbySeconds:'Seconds to join before the hunt',huntSeconds:'Hunt seconds',cooldownSeconds:'Cooldown between hunts',tickets:'Tickets for each hunter',mvpTickets:'Extra tickets for the MVP'};
export const TARGETS=[
  {name:'“Nine-Tails” Marrow',ship:'Marauder gunship',zone:'the Kessel Drift'},
  {name:'Captain Ilse Varn',ship:'Blockade runner',zone:'the Ashfall Reach'},
  {name:'“Quiet” Tobin Rake',ship:'Stealth cutter',zone:'the Pale Verge'},
  {name:'The Widow Okonjo',ship:'Armed salvage barge',zone:'the Thorn Shallows'},
  {name:'Dr. Halden Crowe',ship:'Stolen survey frigate',zone:'the Lantern Deep'},
  {name:'“Lucky” Sable Dross',ship:'Smuggler’s skiff',zone:'the Glass Narrows'}];
const PLATFORMS=['twitch','youtube','kick'];
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);

export function normalizeBountySettings(raw={},base=BOUNTY_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},out={};
  for(const k of ['enabled','announce','practice','mvpFreeOnly'])out[k]=r[k]===undefined?!!base[k]:!!r[k];
  for(const [k,[min,max]] of Object.entries(LIMITS)){const n=Number(r[k]===undefined?base[k]:r[k]);if(!Number.isInteger(n)||n<min||n>max)throw new Error(LABELS[k]+' must be '+min+' to '+max+'.');out[k]=n;}
  return out;
}

export class BountyHunt{
  // say(text): chat. key(chat): the viewer's key. onTickets({id,reason,grants}): giveaway tickets. onResult(result): medals.
  constructor({dataDir,say=()=>{},key=c=>(c?.platform||'twitch')+':'+String(c?.userId||c?.login||'').toLowerCase(),onTickets=()=>{},onResult=()=>{},now=Date.now,random=Math.random}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'bounty.json');this.say=say;this.key=key;this.onTickets=onTickets;this.onResult=onResult;this.now=now;this.random=random;
    this.settings=normalizeBountySettings({});this.stats={hunts:0,captured:0,escaped:0,hunters:0};this.history=[];this.hunt=null;this.lastEndedAt=0;this.receipts=new Map();this.seq=0;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeBountySettings(raw.settings||{});this.stats={...this.stats,...(raw.stats||{})};this.history=Array.isArray(raw.history)?raw.history.slice(0,20):[];}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,stats:this.stats,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  // Switching the game off also calls off a hunt that is under way (nothing is paid).
  configure(raw={}){this.settings=normalizeBountySettings({...this.settings,...raw});if(!this.settings.enabled&&this.hunt)this.stop();void this.persist();return this.view();}
  cooldownLeft(now=this.now()){return Math.max(0,this.lastEndedAt+this.settings.cooldownSeconds*1000-now);}
  active(){return !!this.hunt&&this.hunt.phase!=='result';}
  start({practice=false}={}){
    const s=this.settings,now=this.now();
    if(!s.enabled)throw new Error('Turn Bounty Hunt on first.');if(this.hunt)throw new Error('A hunt is already under way.');
    const left=this.cooldownLeft(now);if(left>0)throw new Error('Cooling down: '+Math.ceil(left/1000)+' seconds until the next hunt.');
    const target=TARGETS[Math.min(TARGETS.length-1,Math.floor(this.random()*TARGETS.length))];
    this.hunt={id:randomUUID().slice(0,8),practice:!!(practice||s.practice),startedAt:now,phase:'lobby',phaseAt:now,phaseEndsAt:now+s.lobbySeconds*1000,target,angle:this.random()*Math.PI*2,
      hunters:new Map(),units:0,fix:0,wingmen:0,wingAt:0,feed:[],events:[],lastFix:'',told:false,result:null};
    if(s.announce)this.say('🎯 BOUNTY POSTED: '+target.name+', '+target.ship+', last seen in '+target.zone+'. Type !track in the next '+s.lobbySeconds+' seconds to join the hunt.'+(this.hunt.practice?' (Practice hunt: no tickets.)':''));
    return this.view();
  }
  stop(){if(!this.hunt)return this.view();this.hunt=null;this.lastEndedAt=0;if(this.settings.announce)this.say('🎯 Bounty Hunt called off.');return this.view();}
  goal(){return RULES.base+RULES.perHunter*Math.max(1,this.hunt.hunters.size);}
  hunter(key,name,login,platform){const h=this.hunt;let m=h.hunters.get(key);
    if(!m){if(h.hunters.size>=2000)return null;m={key,name:clean(name||login,60)||'Hunter',login:clean(login,60).toLowerCase(),platform,tracks:0,paid:0,bits:0,gifts:0,last:0,joinedAt:this.now(),n:h.hunters.size};h.hunters.set(key,m);
      this.note('join',m.name,0);}return m;}
  note(kind,name,amount){const h=this.hunt;h.events.push({seq:++this.seq,kind,name,amount,at:this.now()});if(h.events.length>24)h.events.shift();
    if(kind!=='track'){h.feed.push({kind,name,amount});if(h.feed.length>10)h.feed.shift();}}
  // Paid help can bring the ring right to the edge, but the final fix is always a !track.
  add(units){const h=this.hunt,goal=this.goal();h.units=Math.min(h.units+units,goal-.5);h.fix=Math.max(h.fix,Math.min(.995,h.units/goal));}
  chat(chat){
    const h=this.hunt;if(!h||h.phase==='result')return null;const word=clean(chat?.text,40).toLowerCase().split(' ')[0];if(!WORDS.includes(word))return null;
    const key=this.key(chat);if(!key)return null;const now=this.now(),m=this.hunter(key,chat.name,chat.login,String(key).split(':')[0]);if(!m)return null;
    if(h.phase==='lobby')return {ok:true,joined:true,counted:false};
    if(now-m.last<RULES.pace)return {ok:true,counted:false,wait:RULES.pace-(now-m.last)};
    m.last=now;m.tracks++;h.lastFix=m.key;h.units+=1;const goal=this.goal();this.note('track',m.name,m.tracks);
    if(h.units>=goal){h.fix=1;this.finish(true,now);return {ok:true,counted:true,captured:true};}
    h.fix=Math.max(h.fix,h.units/goal);return {ok:true,counted:true};
  }
  // Cheers and gifted subs (the same event the Dreadnought reads): {kind:'bits'|'gift', platform, userId, login, name, amount, receipts?}.
  support(ev){
    const h=this.hunt;if(!h||h.phase!=='hunt'||!ev||typeof ev!=='object')return {ok:false,ignored:true};
    const kind=ev.kind,platform=String(ev.platform||'').toLowerCase();if(!PLATFORMS.includes(platform)||(kind!=='bits'&&kind!=='gift'))return {ok:false,ignored:true};
    let amount=Math.floor(Number(ev.amount));if(!Number.isFinite(amount)||amount<=0)return {ok:false,ignored:true};
    const userId=clean(ev.userId,128),name=clean(ev.name||ev.login,60)||'Anonymous';if(!userId)return {ok:false,ignored:true};
    if(kind==='gift'&&Array.isArray(ev.receipts)&&ev.receipts.length){ // Kick can report the same gifts twice: count each recipient once
      const fresh=ev.receipts.map(r=>clean(r,200)).filter(r=>r&&!this.receipts.has(r));for(const r of fresh)this.receipts.set(r,this.now());
      while(this.receipts.size>5000)this.receipts.delete(this.receipts.keys().next().value);amount=fresh.length;if(!amount)return {ok:false,ignored:true};}
    const m=this.hunter(this.key({platform,userId,login:ev.login})||platform+':'+userId,name,ev.login,platform);if(!m)return {ok:false,ignored:true};
    if(kind==='bits'){if(amount<RULES.bitsMin)return {ok:false,ignored:true};const units=Math.min(RULES.bitsCap,Math.floor(amount/RULES.bitsPer));m.bits+=amount;m.paid+=units;this.add(units);this.note('scan',m.name,amount);return {ok:true,units};}
    const n=Math.min(amount,Math.max(0,RULES.wingCap-h.wingmen));m.gifts+=amount;if(!h.wingmen)h.wingAt=this.now();h.wingmen+=n;this.note('wing',m.name,amount);return {ok:true,wingmen:n};
  }
  // Called every 100 ms or so by the host.
  tick(){
    const h=this.hunt,now=this.now();if(!h)return null;const s=this.settings,tell=t=>{if(s.announce)this.say(t);};
    if(h.phase==='lobby'){if(now<h.phaseEndsAt)return null;h.phase='hunt';h.phaseAt=now;h.phaseEndsAt=now+s.huntSeconds*1000;
      const m=Math.floor(s.huntSeconds/60),sec=s.huntSeconds%60;
      tell('🎯 THE HUNT IS ON! Type !track (once every '+RULES.pace/1000+' seconds) to close the search ring on '+h.target.name+' before they jump in '+m+':'+String(sec).padStart(2,'0')+'. Cheers fire a scanner pulse; gifted subs launch wingmen.');return 'hunt';}
    if(h.phase==='hunt'){
      while(h.wingmen&&now-h.wingAt>=RULES.wingEvery){h.wingAt+=RULES.wingEvery;for(const m of h.hunters.values())if(m.gifts)m.paid+=Math.min(m.gifts,RULES.wingCap);this.add(h.wingmen);}
      if(!h.told&&h.phaseEndsAt-now<=60000&&s.huntSeconds>90){h.told=true;tell('🎯 One minute before '+h.target.name+' jumps. Position fix at '+Math.floor(h.fix*100)+'%. Keep typing !track.');}
      if(now>=h.phaseEndsAt)return this.finish(false,now);return null;}
    if(h.phase==='result'&&now>=h.phaseEndsAt){this.hunt=null;this.lastEndedAt=now;return 'done';}
    return null;
  }
  // The MVP: the most !track counts (or, with mvpFreeOnly off, the most fixes including cheers and wingmen). First to join wins a tie.
  mvp(){const s=this.settings,rows=[...this.hunt.hunters.values()].filter(m=>m.tracks>0).map(m=>({m,score:m.tracks+(s.mvpFreeOnly?0:m.paid)}));
    rows.sort((a,b)=>b.score-a.score||a.m.joinedAt-b.m.joinedAt||a.m.n-b.m.n);return rows[0]||null;}
  finish(win,now=this.now()){
    const h=this.hunt,s=this.settings,all=[...h.hunters.values()],crew=all.filter(m=>m.tracks>0),top=this.mvp();
    const outcome=win?'captured':crew.length||all.length?'escaped':'empty',each=h.practice||!win?0:s.tickets,extra=h.practice||!win?0:s.mvpTickets,last=h.hunters.get(h.lastFix);
    h.result={outcome,target:h.target.name,hunters:crew.length,tracks:crew.reduce((a,m)=>a+m.tracks,0),bits:all.reduce((a,m)=>a+m.bits,0),gifts:all.reduce((a,m)=>a+m.gifts,0),
      fix:win?100:Math.floor(h.fix*100),secondsLeft:Math.max(0,Math.round((h.phaseEndsAt-now)/1000)),tickets:each,mvpTickets:extra,practice:h.practice,
      mvp:top?{name:top.m.name,platform:top.m.platform,tracks:top.m.tracks,score:top.score}:null,finalFix:win&&last?last.name:''};
    h.phase='result';h.phaseAt=now;h.phaseEndsAt=now+RULES.result;
    if(!h.practice){
      const st=this.stats;st.hunts++;st[win?'captured':'escaped']++;st.hunters+=crew.length;
      this.history.unshift({id:h.id,at:now,...h.result});this.history=this.history.slice(0,20);void this.persist();
      if(win&&crew.length&&(each>0||extra>0))try{this.onTickets({id:'bounty-'+h.id,reason:'Bounty Hunt: '+h.target.name+' captured',
        grants:crew.map(m=>({key:m.key,name:m.name,login:m.login,tickets:each+(top&&m.key===top.m.key?extra:0)})).filter(g=>g.tickets>0)});}catch{}
      try{this.onResult({id:h.id,...h.result,crewList:crew.map(m=>({key:m.key,name:m.name,platform:m.platform,tracks:m.tracks,mvp:!!top&&m.key===top.m.key}))});}catch{}
    }
    if(s.announce)this.say(win?'🎯 BOUNTY CLAIMED! '+h.target.name+' is in custody.'+(top?' MVP: '+top.m.name+' ('+top.m.tracks+' tracks).':'')+
        (h.practice?' Practice hunt, no tickets.':each>0?' Every hunter who tracked ('+crew.length+') earns '+each+' giveaway ticket'+(each===1?'':'s')+(extra>0&&top?', and the MVP '+extra+' more.':'.'):'')
      :outcome==='empty'?'🎯 Nobody took the bounty on '+h.target.name+' this time.':'🎯 '+h.target.name+' jumped away with the fix at '+h.result.fix+'%. No tickets this time.');
    return 'result';
  }
  leaders(limit=5){const s=this.settings;return [...this.hunt.hunters.values()].map(m=>({name:m.name,platform:m.platform,tracks:m.tracks,score:m.tracks+(s.mvpFreeOnly?0:m.paid),joinedAt:m.joinedAt,n:m.n}))
    .sort((a,b)=>b.score-a.score||a.joinedAt-b.joinedAt||a.n-b.n).slice(0,limit).map(({joinedAt,n,...r})=>r);}
  // What the overlay draws: display names only.
  overlay(){
    const h=this.hunt,now=this.now();if(!h||!this.settings.enabled)return {serverAt:now,hunt:null};const s=this.settings;
    return {serverAt:now,hunt:{id:h.id,practice:h.practice,phase:h.phase,phaseAt:h.phaseAt,phaseEndsAt:h.phaseEndsAt,target:h.target,angle:h.angle,hunters:h.hunters.size,wingmen:h.wingmen,
      fix:Math.round(h.fix*1000)/1000,pace:RULES.pace,leaders:this.leaders(5),ships:[...h.hunters.values()].slice(0,40).map(m=>({n:m.n,name:m.name,platform:m.platform})),
      events:h.events.slice(-16),feed:h.feed.slice(-6),result:h.result,tickets:s.tickets,mvpTickets:s.mvpTickets}};
  }
  // For the public website: that a hunt is on, how close it is, and the outcome.
  share(){const h=this.hunt;if(!h||!this.settings.enabled)return null;const r=h.result;
    return {phase:h.phase,phaseEndsAt:h.phaseEndsAt,target:h.target.name,hunters:h.hunters.size,fix:Math.floor(h.fix*100),practice:h.practice,tickets:this.settings.tickets,
      result:r?{outcome:r.outcome,hunters:r.hunters,tickets:r.tickets,mvpTickets:r.mvpTickets,mvp:r.mvp?{name:r.mvp.name,platform:r.mvp.platform}:null}:null};}
  view(){const now=this.now();return {settings:this.settings,rules:RULES,stats:this.stats,history:this.history,cooldownLeft:this.cooldownLeft(now),running:!!this.hunt,...this.overlay()};}
}
