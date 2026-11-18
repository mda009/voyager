/* Voyager Prospect Run (2.33.0): a crew contract only the streamer can start. Chat mines a rock, jumps the cargo home
   through a pirate interdiction and sells it at the peak — three commands, one per phase:
     1 · MINE  !mine   each one keeps that miner's laser on for 10 s and the charge cools by itself; hold it in the optimal
                       window until the rock breaks. Everyone firing at once overcharges it and ore is lost.
     2 · HAUL  !fire   the jump drive spools, pirates pull the freighter out of the jump; every !fire hits the pirate and
                       the longer it lives the more cargo is shot loose.
     3 · SELL  !sell   the price swings; the cargo sells the moment enough of the crew has typed !sell.
   Cargo delivered × sale price = haul score → Gold / Silver / Bronze. Everyone who typed a command during the run gets the
   same number of tickets for the active ticketed giveaway (onTickets), and the result feeds Voyager Medals (onResult).
   Free only: cheers and gifts do nothing here. The feel is borrowed from space-sim mining and hauling; the names (Lumenite,
   the Marrow Belt, Halcyon Exchange, CU) and the ships are Voyager's own. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const COMMANDS=['mine','fire','sell'];
export const PROSPECT_DEFAULTS={enabled:true,announce:true,practice:false,contractSeconds:20,mineSeconds:60,haulSeconds:60,sellSeconds:30,cooldownSeconds:120,
  ticketsGold:8,ticketsSilver:5,ticketsBronze:3,ticketsFail:1,scoreGold:260,scoreSilver:180};
// The rock holds 220 CU. Window = where the laser breaks rock. One command per person every 6 s (chat-safe, like the Dreadnought preset).
// Laser charge heads for 1.15 × the share of miners who typed !mine in the last 10 s, so the window needs about half to
// two-thirds of the miners keeping it up: not everyone at once.
export const RULES={ore:220,window:[.55,.78],pace:6000,peak:1.15,active:10000,rate:.2,overLoss:.015,overCap:.6,spool:10000,grace:4000,cargoLoss:.006,cargoCap:.3,escapeLoss:.15,result:20000};
const LIMITS={contractSeconds:[5,60],mineSeconds:[30,120],haulSeconds:[30,120],sellSeconds:[15,60],cooldownSeconds:[0,3600],ticketsGold:[0,100],ticketsSilver:[0,100],ticketsBronze:[0,100],ticketsFail:[0,100],scoreGold:[1,400],scoreSilver:[1,400]};
const LABELS={contractSeconds:'Contract card seconds',mineSeconds:'Mining seconds',haulSeconds:'Hauling seconds',sellSeconds:'Selling seconds',cooldownSeconds:'Cooldown between runs',ticketsGold:'Tickets for Gold',ticketsSilver:'Tickets for Silver',ticketsBronze:'Tickets for Bronze',ticketsFail:'Tickets when the cargo is lost',scoreGold:'Haul score for Gold',scoreSilver:'Haul score for Silver'};
const GRADE={gold:'Gold haul',silver:'Silver haul',bronze:'Bronze haul',fail:'Cargo lost'};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));

export function normalizeProspectSettings(raw={},base=PROSPECT_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},out={};
  for(const k of ['enabled','announce','practice'])out[k]=r[k]===undefined?!!base[k]:!!r[k];
  for(const [k,[min,max]] of Object.entries(LIMITS)){const n=Number(r[k]===undefined?base[k]:r[k]);if(!Number.isInteger(n)||n<min||n>max)throw new Error(LABELS[k]+' must be '+min+' to '+max+'.');out[k]=n;}
  if(out.scoreSilver>=out.scoreGold)throw new Error('The Silver score must be lower than the Gold score.');
  return out;
}
// The sale price at x (0…1 through the selling phase): a slow swing with a faster ripple, between about ×0.6 and ×1.4.
export function priceAt(x,seed){const p=1+.3*Math.sin(Math.PI*2*(x*1.3+seed))+.08*Math.sin(Math.PI*2*(x*4.1+seed*3));return Math.round(cl(p,.55,1.45)*100)/100;}

export class ProspectRun{
  // say(text): chat. key(chat): the viewer's key. onTickets({id,reason,grants}): hand out giveaway tickets. onResult(result): medals.
  constructor({dataDir,say=()=>{},key=c=>(c?.platform||'twitch')+':'+String(c?.userId||c?.login||'').toLowerCase(),onTickets=()=>{},onResult=()=>{},now=Date.now,random=Math.random}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'prospect.json');this.say=say;this.key=key;this.onTickets=onTickets;this.onResult=onResult;this.now=now;this.random=random;
    this.settings=normalizeProspectSettings({});this.stats={runs:0,gold:0,silver:0,bronze:0,fail:0,best:0,delivered:0};this.history=[];this.run=null;this.lastEndedAt=0;this.lastTick=0;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeProspectSettings(raw.settings||{});this.stats={...this.stats,...(raw.stats||{})};this.history=Array.isArray(raw.history)?raw.history.slice(0,20):[];}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,stats:this.stats,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  configure(raw={}){this.settings=normalizeProspectSettings({...this.settings,...raw});void this.persist();return this.view();}
  cooldownLeft(now=this.now()){return Math.max(0,this.lastEndedAt+this.settings.cooldownSeconds*1000-now);}
  start({practice=false}={}){
    const s=this.settings,now=this.now();
    if(!s.enabled)throw new Error('Turn Prospect Run on first.');if(this.run)throw new Error('A run is already under way.');
    const left=this.cooldownLeft(now);if(left>0)throw new Error('Cooling down: '+Math.ceil(left/1000)+' seconds until the next run.');
    this.run={id:randomUUID().slice(0,8),practice:!!(practice||s.practice),startedAt:now,phase:'contract',phaseAt:now,phaseEndsAt:now+s.contractSeconds*1000,crew:new Map(),feed:[],
      charge:0,crack:0,over:0,cracked:false,crackedAt:0,ore:0,cargo:0,lost:0,pirate:null,interdictedAt:0,killedAt:0,shot:0,seed:this.random(),series:[],votes:new Set(),need:1,soldAt:0,price:0,result:null};
    this.lastTick=now;
    if(s.announce)this.say('⛏ PROSPECT RUN! Contract: haul Lumenite to Halcyon Exchange. Three commands, one per phase: !mine, then !fire, then !sell. Type any of them to fly with the crew.'+(this.run.practice?' (Practice run: no tickets.)':''));
    return this.view();
  }
  stop(){if(!this.run)return this.view();this.run=null;this.lastEndedAt=0;if(this.settings.announce)this.say('⛏ Prospect Run called off.');return this.view();}
  member(chat){const key=this.key(chat);if(!key)return null;const r=this.run;let m=r.crew.get(key);
    if(!m){if(r.crew.size>=2000)return null;m={key,name:clean(chat.name||chat.login,60)||'Crew',login:clean(chat.login,60).toLowerCase(),platform:String(key).split(':')[0],mine:0,fire:0,sell:false,last:0};r.crew.set(key,m);}return m;}
  chat(chat){
    const r=this.run;if(!r||r.phase==='result')return null;const word=clean(chat?.text,40).toLowerCase().split(' ')[0],cmd=word.startsWith('!')?word.slice(1):'';if(!COMMANDS.includes(cmd))return null;
    const m=this.member(chat);if(!m)return null;const now=this.now();
    // Typing any of the three puts you on the crew; a command only does something in its own phase, once every six seconds.
    const live=cmd==='mine'?r.phase==='mine'&&!r.cracked:cmd==='fire'?r.phase==='haul'&&!!r.pirate&&r.pirate.hp>0:r.phase==='sell'&&!r.soldAt;
    if(!live)return {ok:true,crew:true,counted:false};
    if(cmd==='sell'){if(m.sell)return {ok:true,counted:false};m.sell=true;r.votes.add(m.key);}
    else{if(now-m.last<RULES.pace)return {ok:true,counted:false,wait:RULES.pace-(now-m.last)};m.last=now;
      if(cmd==='mine'){m.mine++;m.mineAt=now;}
      else{m.fire++;r.pirate.hp=Math.max(0,r.pirate.hp-1);}}
    r.feed.push({name:m.name,cmd:'!'+cmd,at:now});if(r.feed.length>12)r.feed.shift();
    return {ok:true,counted:true,cmd};
  }
  // Called every 100 ms or so by the host.
  tick(){
    const r=this.run,now=this.now();if(!r)return null;const s=this.settings,dt=cl((now-this.lastTick)/1000,0,1);this.lastTick=now;
    const go=(phase,sec)=>{r.phase=phase;r.phaseAt=now;r.phaseEndsAt=now+sec*1000;return phase;},tell=t=>{if(s.announce)this.say(t);};
    if(r.phase==='contract'){if(now<r.phaseEndsAt)return null;tell('⛏ Phase 1 · MINE: type !mine to charge the laser. Keep it in the green window until the rock breaks. Everyone spamming at once overcharges it and loses ore.');return go('mine',s.mineSeconds);}
    if(r.phase==='mine'){
      if(!r.cracked){
        const all=[...r.crew.values()].filter(x=>x.mine>0),miners=all.length,active=all.filter(x=>now-x.mineAt<RULES.active).length;
        // With three or more aboard the share is of at least three, so the first miner in does not overcharge it alone.
        r.charge+=((miners?RULES.peak*active/Math.max(miners,Math.min(r.crew.size,3)):0)-r.charge)*(1-Math.exp(-RULES.rate*dt));
        if(r.charge>RULES.window[1])r.over+=dt;else if(r.charge>=RULES.window[0]&&miners)r.crack=Math.min(1,r.crack+dt/cl(8+2*miners,10,24));
        if(r.crack>=1){r.cracked=true;r.crackedAt=now;r.phaseEndsAt=Math.min(r.phaseEndsAt,now+6000);}
      }
      const kept=1-Math.min(RULES.overCap,r.over*RULES.overLoss);r.ore=Math.round(RULES.ore*(r.cracked?1:r.crack*.5)*kept);
      if(now<r.phaseEndsAt)return null;
      if(r.ore<=0){tell('⛏ The rock held. No ore, no haul.');return this.finish(now);}
      r.cargo=r.ore;tell('⛏ '+(r.cracked?'Rock cracked':'Time is up')+': '+r.ore+' CU of Lumenite aboard. Phase 2 · HAUL: the jump drive is spooling. When pirates hit, type !fire.');return go('haul',s.haulSeconds);
    }
    if(r.phase==='haul'){
      if(!r.pirate&&now-r.phaseAt>=RULES.spool){const hp=Math.max(3,Math.ceil(r.crew.size*3));r.pirate={hp,max:hp};r.interdictedAt=now;tell('🚨 INTERDICTED! A pirate has pulled the freighter out of the jump. Type !fire to drive it off before it shoots the cargo loose.');}
      if(r.pirate&&!r.killedAt){
        if(r.pirate.hp<=0){r.killedAt=now;r.phaseEndsAt=Math.min(r.phaseEndsAt,now+7000);}
        else if(now-r.interdictedAt>RULES.grace)r.shot=Math.min(RULES.cargoCap,r.shot+RULES.cargoLoss*dt);
      }
      r.lost=Math.round(r.ore*r.shot);r.cargo=r.ore-r.lost;
      if(now<r.phaseEndsAt)return null;
      if(!r.killedAt){r.shot=Math.min(.6,r.shot+RULES.escapeLoss);r.lost=Math.round(r.ore*r.shot);r.cargo=r.ore-r.lost;}
      r.need=cl(Math.ceil(r.crew.size*.5),1,20);
      tell((r.killedAt?'💥 Pirate destroyed. ':'The pirate got away with a full hold. ')+r.cargo+' CU reached Halcyon Exchange. Phase 3 · SELL: the price is moving. Type !sell when it is high; '+r.need+' vote'+(r.need===1?'':'s')+' sells the lot.');
      return go('sell',s.sellSeconds);
    }
    if(r.phase==='sell'){
      const x=cl((now-r.phaseAt)/(s.sellSeconds*1000));
      if(!r.soldAt){r.price=priceAt(x,r.seed);const last=r.series[r.series.length-1];if(!last||x-last[0]>=.012)r.series.push([Math.round(x*1000)/1000,r.price]);
        if(r.votes.size>=r.need||now>=r.phaseEndsAt){r.soldAt=now;r.phaseEndsAt=now+5000;}}
      if(now<r.phaseEndsAt)return null;return this.finish(now);
    }
    if(r.phase==='result'&&now>=r.phaseEndsAt){this.run=null;this.lastEndedAt=now;return 'done';}
    return null;
  }
  finish(now){
    const r=this.run,s=this.settings,score=Math.round(r.cargo*(r.price||0)),grade=r.cargo<=0||score<=0?'fail':score>=s.scoreGold?'gold':score>=s.scoreSilver?'silver':'bronze';
    const each=r.practice?0:{gold:s.ticketsGold,silver:s.ticketsSilver,bronze:s.ticketsBronze,fail:s.ticketsFail}[grade],crew=[...r.crew.values()];
    r.result={grade,title:GRADE[grade],score,ore:r.ore,lost:r.lost,cargo:r.cargo,price:r.price||0,crew:crew.length,tickets:each,practice:r.practice,cracked:r.cracked,pirate:r.killedAt?'destroyed':r.pirate?'escaped':'none',clean:grade==='gold'&&r.lost===0&&r.over===0};
    r.phase='result';r.phaseAt=now;r.phaseEndsAt=now+RULES.result;
    if(!r.practice){
      const st=this.stats;st.runs++;st[grade]++;st.best=Math.max(st.best,score);st.delivered+=r.cargo;
      this.history.unshift({id:r.id,at:now,...r.result});this.history=this.history.slice(0,20);void this.persist();
      if(each>0&&crew.length)try{this.onTickets({id:'prospect-'+r.id,reason:'Prospect Run: '+GRADE[grade],grants:crew.map(m=>({key:m.key,name:m.name,login:m.login,tickets:each}))});}catch{}
      try{this.onResult({id:r.id,...r.result,crewList:crew.map(m=>({key:m.key,name:m.name,platform:m.platform,mine:m.mine,fire:m.fire,sell:m.sell}))});}catch{}
    }
    if(s.announce)this.say('⛏ PROSPECT RUN OVER: '+GRADE[grade].toUpperCase()+(grade==='fail'?'.':' · '+r.cargo+' CU sold at ×'+r.result.price.toFixed(2)+' = haul score '+score+'.')+
      (r.practice?' Practice run, no tickets.':each>0&&crew.length?' Everyone who flew ('+crew.length+') earns '+each+' giveaway ticket'+(each===1?'':'s')+'.':''));
    return 'result';
  }
  // What the overlay draws. No names beyond the chat feed's display names.
  overlay(){
    const r=this.run,now=this.now();if(!r||!this.settings.enabled)return {serverAt:now,run:null};const s=this.settings;
    return {serverAt:now,run:{id:r.id,practice:r.practice,phase:r.phase,phaseAt:r.phaseAt,phaseEndsAt:r.phaseEndsAt,crew:r.crew.size,feed:r.feed.slice(-8).map(f=>({name:f.name,cmd:f.cmd})),
      charge:Math.round(r.charge*1000)/1000,window:RULES.window,crack:Math.round(r.crack*1000)/1000,cracked:r.cracked,crackedAt:r.crackedAt,ore:r.ore,oreMax:RULES.ore,over:r.over>0,
      cargo:r.cargo,lost:r.lost,spool:r.phase==='haul'?cl((now-r.phaseAt)/RULES.spool):0,pirate:r.pirate?{hp:r.pirate.hp,max:r.pirate.max}:null,interdictedAt:r.interdictedAt,killedAt:r.killedAt,
      price:r.price,series:r.series,votes:r.votes.size,need:r.need,soldAt:r.soldAt,result:r.result,tickets:{gold:s.ticketsGold,silver:s.ticketsSilver,bronze:s.ticketsBronze}}};
  }
  // For the public website: only that a run is on, its phase and the numbers on screen.
  share(){const r=this.run;if(!r||!this.settings.enabled)return null;return {phase:r.phase,phaseEndsAt:r.phaseEndsAt,crew:r.crew.size,ore:r.ore,cargo:r.cargo,price:r.price,practice:r.practice,result:r.result?{grade:r.result.grade,title:r.result.title,score:r.result.score,cargo:r.result.cargo,tickets:r.result.tickets,crew:r.result.crew}:null};}
  view(){const now=this.now();return {settings:this.settings,rules:RULES,stats:this.stats,history:this.history,cooldownLeft:this.cooldownLeft(now),running:!!this.run,...this.overlay()};}
}
