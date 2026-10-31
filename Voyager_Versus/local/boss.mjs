// Voyager Dreadnought (2.17): a chat co-op boss fight.
// The streamer calls the boss (Voyager Control, or !dreadnought from a moderator/broadcaster); chat types !join to
// board the fleet, then !fire (free) to attack. Cheers / Super Chats deal more damage and gifted subs the most.
// Events arrive from the "Voyager - Dreadnought" Streamer.bot action as voyager.boss.event broadcasts.
// Paid support only ever changes damage: the victory reward is the same points for every pilot who joined.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';

const FILE='dreadnought.json';
export const BOSS_DEFAULTS={name:'The Dreadnought',lobbySeconds:60,battleSeconds:180,baseHp:4000,hpPerPilot:350,lateJoinHp:150,
  fireMin:12,fireMax:22,fireCooldown:4,bitDamage:2.5,giftDamage:600,victoryPoints:100,chatCall:true,announce:true};
const LIMITS={lobbySeconds:[10,300],battleSeconds:[60,900],baseHp:[500,1e6],hpPerPilot:[0,1e5],lateJoinHp:[0,1e5],fireMin:[1,1000],fireMax:[1,2000],
  fireCooldown:[1,60],bitDamage:[0,100],giftDamage:[0,1e5],victoryPoints:[0,1e6]};
const RESULT_MS=25000,FEED=12,EFFECTS=40;
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const PLATFORMS=['twitch','youtube','kick'];

export function normalizeBossSettings(raw={}){
  const r=raw&&typeof raw==='object'?raw:{},s={...BOSS_DEFAULTS};
  for(const [k,[min,max]] of Object.entries(LIMITS)){if(r[k]===undefined)continue;const n=Number(r[k]);if(!Number.isFinite(n)||n<min||n>max)throw new Error(k+' must be between '+min+' and '+max+'.');s[k]=k==='bitDamage'?Math.round(n*100)/100:Math.round(n);}
  if(s.fireMax<s.fireMin)throw new Error('The most !fire damage must be at least the least damage.');
  if(r.name!==undefined){const n=clean(r.name,40);if(!n)throw new Error('Give the boss a name.');s.name=n;}
  for(const k of ['chatCall','announce'])if(r[k]!==undefined)s[k]=r[k]===true;
  return s;
}

export class BossFight{
  constructor({dataDir,now=Date.now,random=Math.random,say=()=>{},onResult=()=>{}}={}){
    this.onResult=onResult;this.dataDir=dataDir;this.now=now;this.random=random;this.say=say;this.settings={...BOSS_DEFAULTS};this.history=[];this.battle=null;
    this.receipts=new Map();this.saving=Promise.resolve();this.seq=0;
  }
  async load(){try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));this.settings=normalizeBossSettings(raw.settings||{});this.history=Array.isArray(raw.history)?raw.history.slice(0,30):[];}catch{}return this;}
  persist(){if(!this.dataDir)return this.saving;const data=JSON.stringify({schema:1,settings:this.settings,history:this.history}),tmp=join(this.dataDir,FILE+'.tmp');this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  configure(raw){if(this.active())throw new Error('Change settings between fights.');this.settings=normalizeBossSettings({...this.settings,...raw});this.persist();return this.view();}
  active(){return !!this.battle&&['lobby','battle'].includes(this.battle.phase);}
  busy(){return !!this.battle&&this.battle.phase!=='done';}
  announce(text){if(this.settings.announce&&!this.battle?.demo)try{this.say(text);}catch{}}
  note(text,kind='system'){const b=this.battle;if(!b)return;b.feed.unshift({id:++this.seq,at:this.now(),text,kind});b.feed.length=Math.min(b.feed.length,FEED);}

  // ---------- streamer controls ----------
  call({demo=false,by='Voyager Control'}={}){
    if(this.active())throw new Error(this.settings.name+' is already here.');
    const now=this.now(),s=this.settings;
    this.battle={id:now,demo,phase:'lobby',calledBy:clean(by,60),calledAt:now,lobbyEndsAt:now+s.lobbySeconds*1000,startedAt:0,endsAt:0,
      hp:s.baseHp,maxHp:s.baseHp,pilots:new Map(),feed:[],effects:[],shieldUntil:0,shieldsUsed:0,enraged:false,nextAttackAt:0,outcome:null,endedAt:0,anonymous:{damage:0,bits:0,gifts:0},demoAt:0};
    this.note(s.name+' is approaching! Type !join to board the fleet.','alert');
    this.announce('⚠ '+s.name+' is approaching! Type !join in the next '+s.lobbySeconds+' seconds to board the Voyager fleet, then !fire to attack. Cheers and gifted subs hit harder.');
    return this.view();
  }
  start(){const b=this.battle;if(!b||b.phase!=='lobby')throw new Error('Call the boss first.');this.begin(this.now());return this.view();}
  cancel(){if(!this.busy())throw new Error('No fight is running.');const demo=this.battle.demo;this.battle=null;if(!demo)this.announce('The Dreadnought has withdrawn. Stand down, pilots.');return this.view();}
  begin(now){
    const b=this.battle,s=this.settings;b.phase='battle';b.startedAt=now;b.endsAt=now+s.battleSeconds*1000;
    b.maxHp=b.hp=s.baseHp+s.hpPerPilot*b.pilots.size;b.nextAttackAt=now+15000;
    this.note('Battle stations! '+b.pilots.size+' pilot'+(b.pilots.size===1?'':'s')+' engage '+s.name+'.','alert');
    this.announce('🚀 '+b.pilots.size+' pilot'+(b.pilots.size===1?'':'s')+' engage '+s.name+'! Type !fire to attack. '+Math.round(s.battleSeconds/60*10)/10+' minutes on the clock. Late pilots can still !join.');
  }

  // ---------- chat events (from the Streamer.bot action) ----------
  receive(ev){
    if(!ev||typeof ev!=='object')return {ok:false,ignored:true};
    const kind=ev.kind,platform=String(ev.platform||'').toLowerCase();if(!PLATFORMS.includes(platform))return {ok:false,ignored:true};
    this.lastEvent={at:this.now(),kind:clean(kind,10),platform};
    const userId=clean(ev.userId,128),name=clean(ev.name||ev.login,60)||'Anonymous',login=clean(ev.login,60).toLowerCase(),key=userId?platform+':'+userId:login&&(kind==='join'||kind==='fire')?platform+':@'+login:'';
    if(kind==='call'){
      if(!this.settings.chatCall||!(Number(ev.role)>=3||ev.broadcaster===true))return {ok:false,ignored:true};
      if(this.active())return {ok:false,message:'Already here.'};
      this.call({by:name});return {ok:true};
    }
    const b=this.battle;if(!b||!['lobby','battle'].includes(b.phase))return {ok:false,ignored:true};
    if(kind==='join')return this.join(key,name,login,platform);
    if(kind==='fire')return this.fire(key);
    if(kind==='bits'||kind==='gift'){
      let amount=Math.floor(Number(ev.amount));if(!Number.isFinite(amount)||amount<=0)return {ok:false,ignored:true};
      amount=Math.min(amount,kind==='gift'?1000:1e6);
      // The same Kick gift can arrive as a mass gift and as single gifts: count each recipient receipt once.
      if(kind==='gift'&&Array.isArray(ev.receipts)&&ev.receipts.length){
        const fresh=ev.receipts.map(r=>clean(r,200)).filter(r=>r&&!this.receipts.has(r));
        for(const r of fresh)this.receipts.set(r,this.now());while(this.receipts.size>5000)this.receipts.delete(this.receipts.keys().next().value);
        amount=fresh.length;if(!amount)return {ok:false,ignored:true};
      }
      return this.support(kind,key,name,login,platform,amount);
    }
    return {ok:false,ignored:true};
  }
  join(key,name,login,platform){
    const b=this.battle;if(!key)return {ok:false,ignored:true};
    if(b.pilots.has(key))return {ok:false,ignored:true};
    if(b.pilots.size>=500)return {ok:false,message:'The fleet is full.'};
    const p={key,name,login,platform,slot:b.pilots.size,damage:0,fires:0,bits:0,gifts:0,joinedAt:this.now(),stunnedUntil:0,lastFire:0};b.pilots.set(key,p);
    if(b.phase==='battle'&&this.settings.lateJoinHp){b.maxHp+=this.settings.lateJoinHp;b.hp+=this.settings.lateJoinHp;}
    this.note(name+' boarded the fleet.','join');return {ok:true};
  }
  fire(key){
    const b=this.battle,now=this.now(),s=this.settings,p=b.pilots.get(key);
    if(b.phase!=='battle'||!p)return {ok:false,ignored:true};
    if(now-p.lastFire<s.fireCooldown*1000)return {ok:false,ignored:true};
    p.lastFire=now;
    if(p.stunnedUntil>now)return {ok:false,ignored:true};
    let dmg=s.fireMin+Math.floor(this.random()*(s.fireMax-s.fireMin+1));const crit=this.random()<.06;if(crit)dmg*=3;
    if(b.shieldUntil>now)dmg=Math.max(1,Math.round(dmg/2));
    p.fires++;this.hit(p,dmg,'laser',crit);return {ok:true,damage:dmg};
  }
  support(kind,key,name,login,platform,amount){
    const b=this.battle,s=this.settings;let p=key?b.pilots.get(key):null;
    if(key&&!p){this.join(key,name,login,platform);p=b.pilots.get(key);}
    const dmg=Math.round(kind==='gift'?amount*s.giftDamage:amount*s.bitDamage);
    if(p){p[kind==='gift'?'gifts':'bits']+=amount;}else{b.anonymous[kind==='gift'?'gifts':'bits']+=amount;}
    const label=kind==='gift'?amount+' gifted sub'+(amount===1?'':'s'):amount.toLocaleString('en')+(platform==='youtube'?' Super Chat power':' bits');
    if(b.phase==='lobby'){
      // Support during the countdown is stored as a strike that lands the moment battle starts.
      b.pending=(b.pending||[]).concat({key,dmg,kind,name:p?.name||name});this.note((p?.name||name)+' loaded '+label+' of firepower!',kind);return {ok:true,damage:dmg};
    }
    this.hit(p,dmg,kind==='gift'?'torpedo':'missile',false,p?null:name);this.note((p?.name||name)+' unleashed '+label+' · '+dmg.toLocaleString('en')+' damage!',kind);
    return {ok:true,damage:dmg};
  }
  hit(p,dmg,kind,crit,anonName){
    const b=this.battle,now=this.now();if(b.phase!=='battle')return;
    const real=Math.min(dmg,b.hp);b.hp-=real;if(p)p.damage+=real;else b.anonymous.damage+=real;
    if(real>0&&b.hp<=0)b.lastHit={key:p?.key||'',at:now};
    b.effects.push({id:++this.seq,at:now,kind,damage:dmg,crit,slot:p?p.slot:-1,name:p?.name||anonName||'Anonymous'});if(b.effects.length>EFFECTS)b.effects.splice(0,b.effects.length-EFFECTS);
    const frac=b.hp/b.maxHp;
    if(b.shieldsUsed===0&&frac<=.5&&b.hp>0){b.shieldsUsed=1;b.shieldUntil=now+8000;this.note('SHIELDS UP! !fire damage is halved for 8 seconds. Missiles and torpedoes punch through.','alert');}
    if(!b.enraged&&frac<=.2&&b.hp>0){b.enraged=true;b.nextAttackAt=Math.min(b.nextAttackAt,now+4000);this.note(this.settings.name+' is ENRAGED! It attacks faster.','alert');this.announce('🔥 '+this.settings.name+' is down to 20% and ENRAGED! Keep firing!');}
    if(b.hp<=0)this.finish('victory');
  }
  bossAttack(now){
    const b=this.battle,ready=[...b.pilots.values()].filter(p=>p.stunnedUntil<=now);if(!ready.length)return;
    const n=Math.max(1,Math.min(5,Math.floor(ready.length/5)+(b.enraged?1:0))),hits=[];
    for(let i=0;i<n&&ready.length;i++){const p=ready.splice(Math.floor(this.random()*ready.length),1)[0];p.stunnedUntil=now+10000;hits.push(p);}
    b.effects.push({id:++this.seq,at:now,kind:'boss',slots:hits.map(p=>p.slot),names:hits.map(p=>p.name)});
    this.note(this.settings.name+' hit '+hits.map(p=>p.name).join(', ')+'! Systems down for 10 seconds.','boss');
  }
  finish(outcome){
    const b=this.battle,now=this.now(),s=this.settings;if(!b||b.phase!=='battle')return;
    b.phase='result';b.outcome=outcome;b.endedAt=now;
    const pilots=[...b.pilots.values()].sort((a,c)=>c.damage-a.damage||a.joinedAt-c.joinedAt),mvp=pilots[0]&&pilots[0].damage>0?pilots[0]:null;
    const total=b.maxHp-b.hp;
    this.note(outcome==='victory'?s.name+' destroyed! Victory, pilots!':s.name+' escaped with '+Math.ceil(b.hp/b.maxHp*100)+'% hull left. No points awarded.','alert');
    if(!b.demo){
      const rewarded=outcome==='victory'&&s.victoryPoints>0?pilots.filter(p=>p.fires>0||p.bits>0||p.gifts>0):[];
      this.history.unshift({id:b.id,name:s.name,outcome,startedAt:b.startedAt,endedAt:now,maxHp:b.maxHp,damage:total,pilots:pilots.length,
        mvp:mvp?{name:mvp.name,platform:mvp.platform,damage:mvp.damage}:null,top:pilots.slice(0,5).map(p=>({name:p.name,platform:p.platform,damage:p.damage})),
        reward:s.victoryPoints,rewarded:rewarded.map(p=>({key:p.key,name:p.name,platform:p.platform}))});
      this.history=this.history.slice(0,30);this.persist();
      // Voyager Medals (2.18): who fought, torpedoes fired, the MVP and the killing blow.
      try{this.onResult({id:b.id,outcome,endsAt:b.endsAt,endedAt:now,mvpKey:mvp?.key||'',lastHit:b.lastHit||null,
        pilots:pilots.map(p=>({key:p.key,name:p.name,platform:p.platform,damage:p.damage,fires:p.fires,bits:p.bits,gifts:p.gifts}))});}catch{}
      this.announce(outcome==='victory'
        ?'💥 '+s.name+' is destroyed! '+pilots.length+' pilots dealt '+total.toLocaleString('en')+' damage.'+(mvp?' MVP: '+mvp.name+' ('+mvp.damage.toLocaleString('en')+').':'')+(rewarded.length?' Every pilot who fought earns '+s.victoryPoints+' Voyager points.':'')
        :'☠ '+s.name+' escaped with '+Math.ceil(b.hp/b.maxHp*100)+'% hull left. No points this time. Regroup, pilots: it will be back.');
    }
  }
  // Called about ten times a second by the host.
  tick(){
    const b=this.battle;if(!b)return;const now=this.now();
    if(b.demo)this.demoStep(now);
    if(b.phase==='lobby'&&now>=b.lobbyEndsAt){
      if(!b.pilots.size&&!(b.pending||[]).length){this.note('Nobody boarded. '+this.settings.name+' moves on.','alert');b.phase='result';b.outcome='empty';b.endedAt=now;if(!b.demo)this.announce('Nobody boarded the fleet. '+this.settings.name+' drifts away… for now.');return;}
      this.begin(now);for(const x of b.pending||[])this.hit(x.key?b.pilots.get(x.key):null,x.dmg,x.kind==='gift'?'torpedo':'missile',false,x.name);b.pending=[];
    }
    if(b.phase==='battle'){
      if(now>=b.nextAttackAt){this.bossAttack(now);b.nextAttackAt=now+(b.enraged?8000:15000);}
      if(now>=b.endsAt)this.finish('escaped');
    }
    if(b.phase==='result'&&now-b.endedAt>RESULT_MS)b.phase='done';
  }
  // Preview with simulated chat (never rewarded, never announced).
  demoStep(now){
    const b=this.battle;if(now-b.demoAt<350)return;b.demoAt=now;
    const names=['NebulaKnight','AuroraFox','StarDrifter','Lyra','OrbitKeeper','CometRider','NovaCaptain','LunarScout','VoidRunner','Quasar','Halcyon','Ion'];
    const i=Math.floor(this.random()*names.length),platform=PLATFORMS[i%3],key=platform+':demo'+i;
    if(b.phase==='lobby'&&b.pilots.size<names.length)this.join(key,names[i],names[i].toLowerCase(),platform);
    if(b.phase==='battle'){const r=this.random();if(r<.03)this.support('gift',key,names[i],'',platform,1+Math.floor(this.random()*3));else if(r<.08)this.support('bits',key,names[i],'',platform,100*(1+Math.floor(this.random()*5)));else{const p=b.pilots.get(key);if(p)p.lastFire=0;this.fire(key);}}
  }
  // Victory rewards for Missions › Points owed (same points for every pilot who fought).
  rewardBatches(){return this.history.filter(h=>h.outcome==='victory'&&h.reward>0&&h.rewarded?.length).slice(0,10).map(h=>({id:h.id,title:h.name+' defeated',reward:h.reward,pilots:h.rewarded}));}
  overlay(){
    const b=this.battle,now=this.now(),s=this.settings;
    if(!b||b.phase==='done')return {serverAt:now,phase:'idle',name:s.name};
    const pilots=[...b.pilots.values()];
    return {serverAt:now,phase:b.phase,id:b.id,demo:b.demo,name:s.name,hp:b.hp,maxHp:b.maxHp,lobbyEndsAt:b.lobbyEndsAt,endsAt:b.endsAt,startedAt:b.startedAt,endedAt:b.endedAt,
      outcome:b.outcome,shield:b.shieldUntil>now,shieldUntil:b.shieldUntil,enraged:b.enraged,victoryPoints:s.victoryPoints,
      pilots:pilots.length,fleet:pilots.slice(0,12).map(p=>({slot:p.slot,name:p.name,platform:p.platform,stunned:p.stunnedUntil>now})),
      leaders:pilots.filter(p=>p.damage>0).sort((a,c)=>c.damage-a.damage).slice(0,5).map(p=>({name:p.name,platform:p.platform,damage:p.damage})),
      feed:b.feed.slice(0,6),effects:b.effects.filter(e=>now-e.at<6000),
      damage:{fire:pilots.reduce((a,p)=>a+p.fires,0),bits:pilots.reduce((a,p)=>a+p.bits,0)+b.anonymous.bits,gifts:pilots.reduce((a,p)=>a+p.gifts,0)+b.anonymous.gifts}};
  }
  view(){return {settings:this.settings,defaults:BOSS_DEFAULTS,live:this.overlay(),lastEvent:this.lastEvent||null,history:this.history.slice(0,10).map(({rewarded,...h})=>({...h,rewardedCount:rewarded?.length||0}))};}
}
