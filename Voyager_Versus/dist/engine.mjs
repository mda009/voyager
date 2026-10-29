export const CALL_COOLDOWN_MS = 45 * 60 * 1000;
export const REWARDS = {winner:50, runnerUp:0};
export const SHIPS = {
  interceptor: {name:'Interceptor', role:'Balanced fighter', hull:100, shield:50, image:'ships/interceptor-3d.png', model:'VX-01', accent:'#68e7ff'},
  sentinel: {name:'Sentinel', role:'Heavy defender', hull:120, shield:30, image:'ships/sentinel-3d.png', model:'VX-02', accent:'#ffbe72'},
  phantom: {name:'Phantom', role:'Shield specialist', hull:85, shield:65, image:'ships/phantom-3d.png', model:'VX-03', accent:'#b99aff'}
};
export const ACTIONS = {
  fire:{cost:10, cooldown:2, damage:14},
  missile:{cost:35, cooldown:10, damage:32},
  shield:{cost:30, cooldown:12},
  dodge:{cost:25, cooldown:9}
};
const clean = s => String(s || '').replace(/^@/,'').trim().toLowerCase();
const valid = s => /^[a-z0-9_]{1,25}$/.test(s);
export class Arena {
  constructor({training=false, stats=[], onSave=()=>{}, now=()=>Date.now(), cooldownUntil=0, onCooldown=()=>{}, onRewards=()=>{}, entryGate=null, onEvent=()=>{}}={}) {
    this.training=training===true;this.onEvent=onEvent;this.entryGate=entryGate;this.entryUsage=new Map();
    this.now=now;this.cooldownUntil=Number(cooldownUntil)||0;this.onCooldown=onCooldown;this.onRewards=onRewards;
    this.time=0; this.phase='lobby'; this.paused=false; this.open=true;
    this.queue=[]; this.matches=[]; this.invites=[]; this.players=[]; this.profiles=new Map();
    this.caller=null; this.callStarted=0; this.demoChallenger=null; this.countdownLength=10; this.countdownMark=10;
    this.events=[]; this.sequence=0; this.shots=[]; this.round=0; this.totalBattles=0;
    this.roundLength=30; this.autoFire=true; this.remaining=0; this.result=null;
    this.stats=new Map(stats.filter(p=>p && valid(p.login)).map(p=>[p.login,p]));
    this.onSave=onSave; this.rates=new Map(); this.demoNext=0;
  }
  emit(type,data={}) { const e={id:++this.sequence,t:this.time,type,...data}; this.events.push(e); if(this.events.length>60)this.events.shift(); this.onEvent(e); return e; }
  note(text,kind='system') {this.emit('log',{text,kind});}
  profile(login, name, demo=false, userId='') {
    if (!this.profiles.has(login)) {
      if(this.profiles.size>5000) { for(const key of this.profiles.keys()) { if(!this.busy(key)){this.profiles.delete(key); break;} } }
      this.profiles.set(login,{login,name:String(name||login).slice(0,25),ship:'interceptor',demo});
    }
    const p=this.profiles.get(login); p.name=String(name||p.name).slice(0,25); p.demo=demo;p.userId=!demo&&/^\d{1,25}$/.test(String(userId))?String(userId):''; return p;
  }
  busy(login) {return this.caller?.login===login||this.queue.some(p=>p.login===login)||this.matches.some(m=>m.some(p=>p.login===login))||(['battle','countdown'].includes(this.phase)&&this.players.some(p=>p.login===login));}
  invited(login) {return this.invites.some(i=>i.from.login===login||i.to===login);}
  claimEntry(p,role) {
    if(p.demo)return {ok:true};
    if(this.entryGate)return this.entryGate(p,role);
    const key=p.userId||p.login,used=this.entryUsage.get(key)||new Set();
    if(used.has(role))return {ok:false,entryLimit:true,message:`You have already used your ${role} entry this stream. One initiator and one challenger entry per viewer.`};
    used.add(role);this.entryUsage.set(key,used);return {ok:true};
  }
  command({login, name, text, demo=false, userId=''}) {
    login=clean(login); if(!valid(login)||typeof text!=='string'||text.length>200)return {ok:false,message:'Invalid command.'};
    const input=text.trim(),[raw,arg] = input.split(/\s+/); let cmd=raw?.toLowerCase();
    if(demo!==this.training)return {ok:false,message:'Use !versus in live Twitch chat. Simulations run only in the separate training preview.'};
    if(['!join','!duel','!accept','!decline'].includes(cmd))return {ok:false,message:'Use !versus to call or join a battle. Automatic queues and direct duels are disabled.'};
    if(cmd==='!versus'&&input.toLowerCase()!=='!versus')return {ok:false,message:'Type !versus by itself to call or join a battle.'};
    const known=['!versus','!leave','!ship','!fire','!missile','!shield','!dodge','!help'];
    if(!known.includes(cmd))return {ok:false,ignored:true};
    if(this.rates.has(login)&&this.time-this.rates.get(login)<0.65)return {ok:false,message:'Wait a moment before your next command.'};
    this.rates.set(login,this.time);
    const fail=message=>({ok:false,message});
    if(cmd==='!help')return {ok:true,message:'!versus • !ship • !fire • !missile • !shield • !dodge • !leave'};
    if(this.paused)return fail('Arena paused by the host.');
    const existing=this.caller?.login===login?this.caller:this.players.find(x=>x.login===login);
    if(existing&&['calling','countdown','battle'].includes(this.phase)&&existing.demo!==demo)return fail('Simulated commands cannot control a live pilot.');
    const p=this.profile(login,name,demo,userId);
    if(cmd==='!ship') {
      const ship=arg?.toLowerCase();
      if(!Object.hasOwn(SHIPS,ship))return fail('Choose !ship interceptor, sentinel or phantom.');
      if(this.busy(login)||this.invited(login))return fail('Choose your ship before joining or challenging.');
      p.ship=ship; this.note(`${p.name} selected ${SHIPS[ship].name}.`);return {ok:true,message:`${SHIPS[ship].name} selected.`};
    }
    if(cmd==='!leave') {
      if(this.caller?.login===login){this.cancelCall(`${p.name} cancelled the challenger call.`);return {ok:true,message:'Your challenger call has been cancelled.'};}
      if(['battle','countdown'].includes(this.phase)&&this.players.some(x=>x.login===login)) {
        this.finish(1-this.players.findIndex(x=>x.login===login),'Opponent forfeited');
      } else {
        this.queue=this.queue.filter(x=>x.login!==login);
        const released=this.matches.filter(m=>m.some(x=>x.login===login)).flat().filter(x=>x.login!==login);
        this.matches=this.matches.filter(m=>!m.some(x=>x.login===login));
        this.queue.push(...released);
        this.invites=this.invites.filter(i=>i.from.login!==login&&i.to!==login);
        this.note(`${p.name} left the queue.`);
      }
      return {ok:true,message:'You have left the arena.'};
    }
    if(cmd==='!versus') {
      if(!this.open)return fail('New entries are closed.');
      if(this.caller?.login===login)return fail('You are Pilot 1. Waiting for another viewer to type !versus.');
      if(!['lobby','calling'].includes(this.phase))return fail('A battle is already in progress. Type !versus after the winner screen.');
      if(this.busy(login))return fail('You are already queued. Type !leave before starting a challenger call.');
      if(this.invited(login))return fail('Accept, decline or leave your pending challenge first.');
      if(this.phase==='calling'){
        if(this.caller.demo!==demo)return fail('Training and live pilots cannot share a challenger call.');
        if(p.userId&&p.userId===this.caller.userId)return fail('You are already Pilot 1. A different viewer must join.');
        const entry=this.claimEntry(p,'challenger');if(!entry.ok)return entry;
        const first=this.caller;this.#start([first,{...p}]);
        return {ok:true,message:`${p.name} is Pilot 2. Battle starts in ${this.countdownLength} seconds.`};
      }
      if(!demo&&this.cooldownRemaining()>0)return fail(`Global battle cooldown: ${this.cooldownText()} remaining. A new call opens every 45 minutes.`);
      const entry=this.claimEntry(p,'initiator');if(!entry.ok)return entry;
      this.#beginCall(p);return {ok:true,message:'You are Pilot 1. Calling for a challenger — the next viewer to type !versus joins you.'};
    }
    if(this.phase!=='battle')return fail('Weapons unlock when the battle begins.');
    const index=this.players.findIndex(x=>x.login===login);
    if(index===-1)return fail('Only the two active pilots can use battle commands.');
    return this.action(index,cmd.slice(1));
  }
  cooldownRemaining(){return Math.max(0,Math.ceil((this.cooldownUntil-this.now())/1000));}
  cooldownText(){const n=this.cooldownRemaining();return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
  reserveCooldown(){const until=this.now()+CALL_COOLDOWN_MS;this.onCooldown(until);this.cooldownUntil=until;}
  #beginCall(p) {
    if(!p.demo)this.reserveCooldown();
    this.callId=globalThis.crypto.randomUUID();this.phase='calling';this.caller={...p};this.callStarted=this.time;this.players=[];this.result=null;this.remaining=0;this.shots=[];this.demoChallenger=null;
    this.emit('calling',{callId:this.callId,pilot:{...p},name:p.name,ship:p.ship,demo:p.demo});
    this.note(`${p.name} is calling for a challenger. Next viewer: type !versus!`,'challenge');
  }
  cancelCall(reason='Challenger call cancelled by the host.') {
    if(this.phase!=='calling')return;
    this.emit('call_cancelled',{callId:this.callId,pilot:{...this.caller},demo:this.caller?.demo});
    this.caller=null;this.demoChallenger=null;this.callStarted=0;this.phase='lobby';this.remaining=0;this.note(reason,'system');
  }
  #start(pair) {
    if(this.phase!=='calling'&&!pair.every(p=>p.demo))this.reserveCooldown();
    this.matchId=globalThis.crypto.randomUUID();
    this.round++;this.phase='countdown';this.remaining=this.countdownLength;this.countdownMark=this.countdownLength;this.result=null;this.shots=[];this.caller=null;this.demoChallenger=null;
    this.players=pair.map((p,i)=>({...p,...{maxHull:SHIPS[p.ship].hull,maxShield:SHIPS[p.ship].shield,hull:SHIPS[p.ship].hull,shield:SHIPS[p.ship].shield,energy:100,cooldowns:{},dodgeUntil:0,damage:0,nextAuto:this.time+this.countdownLength+4+i*.35}}));
    this.demoNext=this.time+this.countdownLength+1;
    this.emit('start',{matchId:this.matchId,players:pair.map(p=>({...p})),names:pair.map(p=>p.name),demo:pair.some(p=>p.demo)});
    this.emit('countdown',{remaining:this.countdownLength});
    this.note(`${pair[0].name} vs ${pair[1].name} — launch in ${this.countdownLength} seconds.`,'match');
  }
  action(i,kind,automatic=false) {
    if(this.phase!=='battle'||this.paused)return {ok:false,message:'Battle not active.'};
    const p=this.players[i], rule=ACTIONS[kind];
    if(!p||!rule)return {ok:false,message:'Unknown action.'};
    if(!automatic&&(p.cooldowns[kind]||0)>this.time)return {ok:false,message:`${kind} recharging: ${Math.ceil(p.cooldowns[kind]-this.time)}s.`};
    if(!automatic&&p.energy<rule.cost)return {ok:false,message:'Not enough energy. Reactor recharges automatically.'};
    if(!automatic){p.energy-=rule.cost;p.cooldowns[kind]=this.time+rule.cooldown;}
    if(kind==='shield') {p.shield=Math.min(p.maxShield,p.shield+30);this.emit('shield',{pilot:i});this.note(`${p.name} boosted shields.`,'action');}
    else if(kind==='dodge') {p.dodgeUntil=this.time+2.5;this.emit('dodge',{pilot:i});this.note(`${p.name} initiated evasive roll.`,'action');}
    else {
      const shot={pilot:i,target:1-i,kind,damage:automatic?8:rule.damage,at:this.time+(kind==='missile'?1.05:.4)};
      this.shots.push(shot);this.emit('shot',{...shot,automatic});
      if(!automatic)this.note(`${p.name} fired ${kind==='missile'?'a plasma missile':'pulse lasers'}.`,'action');
    }
    return {ok:true,message:`${kind} activated.`};
  }
  finish(winner,reason='Hull destroyed',cancelled=false) {
    if(!['battle','countdown'].includes(this.phase))return;
    const launched=this.phase==='battle';
    this.phase='result';this.remaining=8;this.shots=[];
    const demo=this.players.some(p=>p.demo);
    this.result={winner,reason,cancelled,demo,duration:launched?Math.max(0,Math.round(this.time-this.battleStarted)):0,rewards:[],name:winner===null?null:this.players[winner].name};
    if(!cancelled&&!demo) {
      this.totalBattles++;
      this.players.forEach((p,i)=>{
        const s=this.stats.get(p.login)||{login:p.login,name:p.name,wins:0,losses:0,draws:0,battles:0};
        s.name=p.name;s.battles++;if(winner===null)s.draws++;else if(winner===i)s.wins++;else s.losses++;
        this.stats.set(p.login,s);
      });this.onSave([...this.stats.values()]);
    }
    if(launched&&!cancelled&&!demo&&winner!==null){
      this.result.rewards=this.players.map((p,i)=>({id:`${this.matchId}_${i}`,userId:p.userId,login:p.login,name:p.name,role:i===winner?'winner':'runnerUp',amount:i===winner?REWARDS.winner:REWARDS.runnerUp,status:'pending'})).filter(r=>r.amount>0);
      try{this.onRewards(this.result.rewards);}catch{this.result.rewards.forEach(r=>r.status='review');this.note('Rewards could not be saved. Check host storage before continuing.');this.paused=true;}
    }
    this.emit('finish',{...this.result,matchId:this.matchId,players:this.players.map(p=>({...p}))});
    this.note(cancelled?'Battle cancelled by the host.':winner===null?'Battle drawn.':`${this.players[winner].name} wins! ${reason}.`,'result');
  }
  tick(dt) {
    if(!Number.isFinite(dt)||dt<=0)return;
    // Pausing freezes gameplay; the shared call cooldown uses the wall clock.
    if(this.paused)return;
    this.time+=dt;
    this.invites=this.invites.filter(i=>i.expires>this.time);
    for(const [key,t] of this.rates)if(this.time-t>120)this.rates.delete(key);
    // Reaching READY never creates a match. Only a new !versus can open a call.
    if(this.phase==='lobby')return;
    if(this.phase==='calling'){
      if(this.training&&this.demoChallenger&&this.time>=this.demoChallenger.at)this.#start([this.caller,this.demoChallenger.pilot]);
      return;
    }
    this.remaining=Math.max(0,this.remaining-dt);
    if(this.phase==='countdown'){
      const seconds=Math.ceil(this.remaining-1e-8);
      if(seconds>0&&seconds!==this.countdownMark){this.countdownMark=seconds;this.emit('countdown',{remaining:seconds});}
      if(this.remaining<=1e-8){
        this.phase='battle';this.battleStarted=this.time;this.remaining=this.roundLength;this.players.forEach((p,i)=>p.nextAuto=this.time+4+i*.35);this.demoNext=this.time+1;
        this.emit('launch');this.note('Weapons free. Battle has begun.','match');
      }
    }
    else if(this.phase==='result'&&this.remaining<=0){this.phase='lobby';this.players=[];this.result=null;}
    else if(this.phase==='battle') {
      for(const p of this.players)p.energy=Math.min(100,p.energy+8*dt);
      if(this.autoFire) this.players.forEach((p,i)=>{if(this.time>=p.nextAuto){this.action(i,'fire',true);p.nextAuto=this.time+4;}});
      if(this.time>=this.demoNext) {
        this.players.forEach((p,i)=>{if(p.demo){const acts=['fire','fire','missile','shield','dodge'];this.action(i,acts[Math.floor(this.time/2+i*2)%acts.length]);}});
        this.demoNext=this.time+2.7;
      }
      const due=this.shots.filter(s=>s.at<=this.time);this.shots=this.shots.filter(s=>s.at>this.time);
      for(const shot of due) {
        if(this.phase!=='battle')break;
        const p=this.players[shot.target],a=this.players[shot.pilot];
        if(p.dodgeUntil>this.time){this.emit('miss',{pilot:shot.target});continue;}
        const absorbed=Math.min(p.shield,shot.damage);p.shield-=absorbed;
        const hullDamage=Math.min(p.hull,shot.damage-absorbed);p.hull-=hullDamage;a.damage+=absorbed+hullDamage;
        this.emit('hit',{pilot:shot.target,shield:absorbed,damage:shot.damage,kind:shot.kind});
        if(p.hull<=0)this.finish(shot.pilot);
      }
      if(this.phase==='battle'&&this.remaining<=0){
        const scores=this.players.map(p=>(p.hull+p.shield)/(p.maxHull+p.maxShield));
        this.finish(Math.abs(scores[0]-scores[1])<0.0001?null:scores[0]>scores[1]?0:1,'Time limit · remaining armour');
      }
    }
  }
  control(type,value) {
    if(type==='pause'){this.paused=!this.paused;return {ok:true};}
    if(type==='open'){this.open=!this.open;return {ok:true};}
    if(type==='cancel'){if(this.phase==='calling')this.cancelCall();else this.finish(null,'Host cancelled',true);return {ok:true};}
    if(type==='clear'){this.queue=[];this.matches=[];this.invites=[];this.cancelCall('Challenger call cleared by the host.');this.note('Waiting queue cleared.');return {ok:true};}
    if(type==='settings') {
      if(['30','45','60','75','90','120'].includes(String(value?.roundLength)))this.roundLength=Number(value.roundLength);
      if(typeof value?.autoFire==='boolean')this.autoFire=value.autoFire;
      return {ok:true};
    }
    if(type==='demo') {
      if(!this.training)return {ok:false,message:'Open the separate training preview to test a battle. Live matches require !versus in Twitch chat.'};
      if(this.phase!=='lobby'||this.queue.length||this.matches.length)return {ok:false,message:'Finish the current battle and clear the queue before running a demo.'};
      if(this.paused)return {ok:false,message:'Resume the arena first.'};
      this.#beginCall({login:'demo_nova',name:'NOVA',ship:'interceptor',demo:true});
      this.demoChallenger={at:this.time+4,pilot:{login:'demo_reaper',name:'REAPER',ship:'sentinel',demo:true}};
      return {ok:true,message:'Training call launched. A challenger joins in 4 seconds, followed by the 10-second countdown.'};
    }
    return {ok:false,message:'Unknown control.'};
  }
  snapshot() {return JSON.parse(JSON.stringify({cooldownUntil:this.cooldownUntil,cooldownRemaining:this.cooldownRemaining(),rewardAmounts:REWARDS,time:this.time,phase:this.phase,caller:this.caller,callStarted:this.callStarted,countdownLength:this.countdownLength,paused:this.paused,open:this.open,queue:this.queue,matches:this.matches,invites:this.invites,players:this.players,round:this.round,totalBattles:this.totalBattles,remaining:Math.max(0,this.remaining),result:this.result,events:this.events,roundLength:this.roundLength,autoFire:this.autoFire,leaderboard:[...this.stats.values()].sort((a,b)=>b.wins-a.wins||a.losses-b.losses).slice(0,50)}));}
}
