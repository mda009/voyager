// Voyager stage (2.20.84 Dreadnought; 2.20.91 Voyager Versus too). When the Dreadnought is called, one full-screen OBS browser source (stage.html) takes
// over the screen: the Dreadnought scene in the middle, stream panels in the slots around it, the streamer's own scene shrunk
// to a corner. The host decides when the stage is up (boarding, battle and the battle report), keeps the slot layout the
// streamer chose, keeps a short multichat feed for the chat slot, and sends the shrink / restore cue to the
// "Voyager - Dreadnought Stage" Streamer.bot action (which animates the OBS scene item). Everything here is also usable with
// the Streamer.bot action missing: the stage still draws, the game simply stays where it is behind the picture-in-picture frame.
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const SLOT_KINDS={none:'Nothing',leaderboard:'Leaderboard panel',standings:'Community goal standings',goals:'Community goals',helpers:'Community goal contributors',hall:'Hall of Fame',missions:"This week's missions",christmas:'Christmas goal panel',chat:'Chat (Twitch · YouTube · Kick)',squadron:'Squadron war panel',dread:'Dreadnought damage HUD',camera:'Camera window (transparent)'};
export const STACK_KINDS={bucket:'Giveaway goals strip',ticker:'Right now ticker',moments:'Command hints & medal toasts',dread:'Dreadnought damage HUD'};
export const SLOTS=['left','right','bottomLeft'];
export const STAGE_DEFAULTS={enabled:true,slots:{left:'leaderboard',right:'helpers',bottomLeft:'chat'},stack:['bucket','ticker','moments'],pip:'br',scene:'',source:'',hide:[],resultSeconds:20,splashSeconds:6,mvpSeconds:10,animationMs:1200,chat:{twitch:true,youtube:true,kick:true,commands:false,names:true},versus:{enabled:true,splashSeconds:6,winnerSeconds:10,winnerBonus:0}}; // 2.20.92: a Versus win stays 50 points; the champion bonus is off unless set
const CHAT_MAX=80,CHAT_SHOW=40;
const clean=(v,n)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,n);
export function normalizeSettings(raw={},prev=STAGE_DEFAULTS){
  const s=JSON.parse(JSON.stringify(prev)),r=raw&&typeof raw==='object'?raw:{};
  if(r.enabled!==undefined)s.enabled=!!r.enabled;
  if(r.slots&&typeof r.slots==='object')for(const k of SLOTS){if(r.slots[k]===undefined)continue;if(!Object.hasOwn(SLOT_KINDS,r.slots[k]))throw new Error('Unknown panel for the '+k+' slot.');s.slots[k]=r.slots[k];}
  if(r.stack!==undefined){if(!Array.isArray(r.stack))throw new Error('Stack must be a list.');const out=[];for(const k of r.stack){if(!Object.hasOwn(STACK_KINDS,k))throw new Error('Unknown item in the bottom stack.');if(!out.includes(k))out.push(k);}s.stack=out.slice(0,4);}
  if(r.pip!==undefined){if(!['br','bl'].includes(r.pip))throw new Error('Picture-in-picture corner must be bottom-right or bottom-left.');s.pip=r.pip;}
  if(r.scene!==undefined)s.scene=clean(r.scene,120);
  if(r.source!==undefined)s.source=clean(r.source,120);
  if(r.hide!==undefined){const list=Array.isArray(r.hide)?r.hide:String(r.hide).split(/[,\n]/);s.hide=[...new Set(list.map(x=>clean(x,120)).filter(Boolean))].slice(0,12);}
  if(r.resultSeconds!==undefined){const n=Number(r.resultSeconds);if(!Number.isFinite(n)||n<5||n>60)throw new Error('Battle report hold must be 5 to 60 seconds.');s.resultSeconds=Math.round(n);}
  if(r.splashSeconds!==undefined){const n=Number(r.splashSeconds);if(!Number.isFinite(n)||n<0||n>30)throw new Error('Splash hold must be 0 to 30 seconds.');s.splashSeconds=Math.round(n);}
  if(r.mvpSeconds!==undefined){const n=Number(r.mvpSeconds);if(!Number.isFinite(n)||n<0||n>60)throw new Error('MVP celebration must be 0 to 60 seconds.');s.mvpSeconds=Math.round(n);}
  if(r.animationMs!==undefined){const n=Number(r.animationMs);if(!Number.isFinite(n)||n<200||n>4000)throw new Error('Animation must be 200 to 4000 ms.');s.animationMs=Math.round(n);}
  if(r.chat&&typeof r.chat==='object')for(const k of ['twitch','youtube','kick','commands','names'])if(r.chat[k]!==undefined)s.chat[k]=!!r.chat[k];
  if(r.versus&&typeof r.versus==='object'){const v=r.versus;if(v.enabled!==undefined)s.versus.enabled=!!v.enabled;
    for(const [k,min,max,label] of [['splashSeconds',0,30,'Versus splash hold'],['winnerSeconds',0,60,'Versus winner celebration'],['winnerBonus',0,100000,'Versus winner bonus']])if(v[k]!==undefined){const n=Number(v[k]);if(!Number.isFinite(n)||n<min||n>max)throw new Error(label+' must be '+min+' to '+max+'.');s.versus[k]=Math.round(n);}}
  return s;
}
// The picture-in-picture window and the main feature on the 1920 x 1080 canvas; stage.html and the OBS cue share these numbers.
export const GEOMETRY={main:{x:384,y:20,w:1152,h:648},pip:{w:640,h:360,y:704,br:{x:1252},bl:{x:28}},columns:{w:346,h:648,y:20,left:20,right:1554},bottomLeft:{w:300,h:372,y:690,br:{x:20},bl:{x:1600}},stack:{x:340,y:690,w:892,h:372}};
export class Stage{
  constructor({dataDir='.',now=()=>Date.now(),run=null,uuid=randomUUID,log=()=>{},version=''}={}){this.version=String(version||'');
    this.dataDir=dataDir;this.file=join(dataDir,'stage.json');this.now=now;this.run=run;this.uuid=uuid;this.log=log;
    this.settings=normalizeSettings({});this.revision=0;this.messages=[];this.saving=Promise.resolve();
    this.cue={on:false,sending:false,last:null,battleId:0,dueAt:0};this.forcedUntil=0;this.forcedMode='dread';this.lastResult=null;this.lastVersus=null;this.versusRewards=[];
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeSettings(raw.settings||{});this.revision=Number(raw.revision)||0;this.versusRewards=Array.isArray(raw.versusRewards)?raw.versusRewards.slice(-20):[];
    // 2.20.92: 2.20.91 shipped a 25-point champion bonus by default; a Versus win is back to 50 points, so clear that default and any rows it created.
    if((Number(raw.schema)||1)<2){if(this.settings.versus.winnerBonus===25)this.settings.versus.winnerBonus=0;this.versusRewards=[];void this.persist();}}catch{}return this;}
  persist(){const data=JSON.stringify({schema:2,settings:this.settings,revision:this.revision,versusRewards:this.versusRewards});this.saving=this.saving.then(async()=>{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,data);await rename(tmp,this.file);}).catch(e=>this.log('stage save failed: '+e.message));return this.saving;}
  configure(raw){this.settings=normalizeSettings(raw,this.settings);this.revision++;void this.persist();return this.view();}
  // Chat feed for the chat slot: every platform the host already hears from Streamer.bot.
  chat({platform='twitch',userId='',login='',name='',text='',color='',role=0,sub=false,messageId=null}={}){
    const t=clean(text,400);if(!t||!clean(name,60))return null;
    const m={id:messageId?String(messageId).slice(0,80):'m'+this.now().toString(36)+Math.random().toString(36).slice(2,6),at:this.now(),platform:['twitch','youtube','kick'].includes(platform)?platform:'twitch',userId:clean(userId,64),login:clean(login,60).toLowerCase(),name:clean(name,60),text:t,color:/^#[0-9a-f]{6}$/i.test(String(color||''))?String(color).toLowerCase():'',role:Math.max(0,Math.min(4,Number(role)||0)),sub:!!sub};
    if(this.messages.some(x=>x.id===m.id))return null;
    this.messages.push(m);if(this.messages.length>CHAT_MAX)this.messages.splice(0,this.messages.length-CHAT_MAX);return m;
  }
  chatFeed(){const c=this.settings.chat;return this.messages.filter(m=>c[m.platform]!==false&&(c.commands||!/^!/.test(m.text))).slice(-CHAT_SHOW);}
  // Up while the fight is being boarded, fought and reported (the report for resultSeconds), or forced from the control page.
  // Remember the battle report (the boss overlay goes idle before the MVP celebration is over).
  observe(boss){if(boss&&boss.phase==='result'){const id=String(boss.id||('r'+(boss.endedAt||0)));if(this.lastResult&&this.lastResult.id===id)return;const top=boss.leaders?.[0]||null;
    this.lastResult={id,endedAt:Number(boss.endedAt)||this.now(),outcome:boss.outcome||'',name:boss.name||'The Dreadnought',demo:!!boss.demo,damage:Math.max(0,(boss.maxHp||0)-(boss.hp||0)),pilots:boss.pilots||0,mvp:top&&top.damage>0?{name:top.name,platform:top.platform,damage:top.damage}:null,bonus:boss.outcome==='victory'?Number(boss.mvpBonus)||0:0};}}
  // Battle report for resultSeconds, then the MVP celebration for mvpSeconds (when someone dealt damage).
  window(){const r=this.lastResult;if(!r)return null;const now=this.now(),since=now-r.endedAt,report=this.settings.resultSeconds*1000,mvp=r.mvp?this.settings.mvpSeconds*1000:0;
    if(since<report)return 'result';if(since<report+mvp)return 'mvp';return null;}
  // Voyager Versus (2.20.91): remember the result (the arena returns to the lobby 8 s later); a real win earns the winner bonus.
  observeVersus(v){if(!v||v.phase!=='result'||!v.result)return;const id=String(v.matchId||('m'+(v.result.at||0)));if(this.lastVersus&&this.lastVersus.id===id)return;
    const r=v.result,players=Array.isArray(v.players)?v.players:[],win=r.winner===0||r.winner===1?players[r.winner]:null,lose=win?players[1-r.winner]:null;
    this.lastVersus={id,endedAt:this.now(),cancelled:!!r.cancelled,demo:!!r.demo,duration:Number(r.duration)||0,reason:String(r.reason||''),rewardAmount:Number(r.rewards?.find?.(x=>x.role==='winner')?.amount)||0,
      winner:win&&!r.cancelled?{name:String(win.name||win.login||'Pilot'),login:String(win.login||'').toLowerCase(),userId:String(win.userId||''),platform:'twitch'}:null,loser:lose?String(lose.name||lose.login||''):''};
    const bonus=this.settings.versus.winnerBonus;if(this.lastVersus.winner&&!r.demo&&bonus>0&&!this.versusRewards.some(x=>x.id===id)){const w=this.lastVersus.winner;
      this.versusRewards.push({id,at:this.now(),bonus,winner:{...w,key:/^\d{1,25}$/.test(w.userId)?'twitch:'+w.userId:''},loser:this.lastVersus.loser,duration:this.lastVersus.duration});this.versusRewards=this.versusRewards.slice(-20);void this.persist();}}
  versusWindow(){const r=this.lastVersus;if(!r)return null;const since=this.now()-r.endedAt,report=8000,win=r.winner?this.settings.versus.winnerSeconds*1000:0;if(since<report)return 'result';if(since<report+win)return 'winner';return null;}
  // Which takeover is on: the Dreadnought first, then a Versus call / battle / result / winner, then a forced showing.
  mode(boss,versus){
    this.observe(boss);this.observeVersus(versus);const s=this.settings,now=this.now();
    if(s.enabled&&((boss&&(boss.phase==='lobby'||boss.phase==='battle'))||this.window()))return 'dread';
    if(s.versus.enabled&&versus&&(['calling','countdown','battle'].includes(versus.phase)||this.versusWindow()))return 'versus';
    if(this.forcedUntil>now)return this.forcedMode;
    return '';
  }
  active(boss,versus){return !!this.mode(boss,versus);}
  // Winner bonuses as payables (Missions › Points owed), like the crew surge and Dreadnought rewards.
  bonusPayables(){return this.versusRewards.map(r=>({missionId:'versus-stage-'+r.id,title:'Versus champion'+(r.loser?' · beat '+r.loser:'')+(r.duration?' in '+Math.floor(r.duration/60)+':'+String(r.duration%60).padStart(2,'0'):''),reward:r.bonus,key:r.winner.key,name:r.winner.name,platform:'twitch',week:r.at,scope:'versus',label:'Versus stage',...(r.winner.key?{}:{account:false})}));}
  force(seconds,mode='dread'){const n=Math.max(0,Math.min(600,Number(seconds)||0));this.forcedUntil=n?this.now()+n*1000:0;this.forcedMode=mode==='versus'?'versus':'dread';if(n&&!this.messages.length)this.sampleChat();return {ok:true,until:this.forcedUntil,mode:this.forcedMode};}
  // Fictional sample lines for a test showing, so the chat window is not empty before anyone has typed.
  sampleChat(){const now=this.now();[['twitch','StarNova','#9fd4ff','o7 fleet, boarding now',0,true],['youtube','Quillon','','!join',2,false],['kick','PixelDrift','','that hull bar is huge',0,false],['twitch','Ashgrove','#ffd56a','!fire !fire !fire',3,true],['twitch','Lumen_7','#7ff0b5','gifted 5 subs, torpedoes away 🚀',0,true],['youtube','Tamsin','','gg pilots',0,false]].forEach(([platform,name,color,text,role,sub],i)=>this.chat({platform,name,login:name.toLowerCase(),text,color,role,sub,messageId:'sample'+i}));}
  layout(){const s=this.settings,g=GEOMETRY;return {slots:s.slots,stack:s.stack,pip:s.pip,geometry:{main:g.main,pip:{x:g.pip[s.pip].x,y:g.pip.y,w:g.pip.w,h:g.pip.h},left:{x:g.columns.left,y:g.columns.y,w:g.columns.w,h:g.columns.h},right:{x:g.columns.right,y:g.columns.y,w:g.columns.w,h:g.columns.h},bottomLeft:{x:g.bottomLeft[s.pip].x,y:g.bottomLeft.y,w:g.bottomLeft.w,h:g.bottomLeft.h},stack:g.stack}};}
  overlay(boss,versus){const now=this.now(),mode=this.mode(boss,versus),s=this.settings,common={serverAt:now,version:this.version,active:!!mode,mode,forced:this.forcedUntil>now,...this.layout(),chat:this.chatFeed(),chatNames:s.chat.names,animationMs:s.animationMs,cue:this.cue.last};
    if(mode==='versus'){const w=this.versusWindow(),r=this.lastVersus,live=versus&&['calling','countdown','battle'].includes(versus.phase),phase=live?versus.phase:w==='winner'?'winner':w==='result'?'result':'idle',caller=versus?.caller?.name||'',players=(versus?.players||[]).map(p=>p.name||p.login).filter(Boolean);
      const amount=(r?.rewardAmount||0)+(r&&!r.demo?s.versus.winnerBonus:0);
      return {...common,phase,demo:!!(versus?.players?.some?.(p=>p.demo)||(w&&r?.demo)),splashMs:s.versus.splashSeconds*1000,splashOn:phase==='calling'||(this.forcedUntil>now&&phase==='idle'),
        main:{url:'/index.html?overlay=1&stage=1&hideIdle=0',label:'VOYAGER VERSUS · LIVE',accent:'#7de0ff'},
        splash:{eyebrow:'⚔ VERSUS CHALLENGE',title:caller?caller.toUpperCase()+' CALLS':players.length===2?players[0].toUpperCase()+' VS '+players[1].toUpperCase():'VERSUS CALLED',chips:['!VERSUS']},
        celebrate:w==='winner'&&r?.winner?{eyebrow:'★ VERSUS CHAMPION ★',name:r.winner.name,line:(r.loser?'DEFEATED '+r.loser.toUpperCase():'VICTORY')+(r.duration?' · '+Math.floor(r.duration/60)+':'+String(r.duration%60).padStart(2,'0'):''),points:amount,pointsLabel:'VOYAGER POINTS',sub:(r.reason||'Hull destroyed')+(r.demo?' · training battle, no points':s.versus.winnerBonus&&r.rewardAmount?' · '+r.rewardAmount+' winner reward + '+s.versus.winnerBonus+' champion bonus':r.rewardAmount?' · Versus winner reward':''),until:r.endedAt+8000+s.versus.winnerSeconds*1000}:null};}
    const w=this.window(),r=this.lastResult,live=boss&&(boss.phase==='lobby'||boss.phase==='battle'),phase=mode?(live?boss.phase:w==='mvp'?'mvp':w==='result'?'result':boss?.phase||'idle'):(boss?.phase||'idle');
    return {...common,phase,demo:!!(boss?.demo||(w&&r?.demo)),splashMs:s.splashSeconds*1000,splashOn:phase==='lobby'||(this.forcedUntil>now&&phase==='idle'),mvpMs:s.mvpSeconds*1000,
      main:{url:'/dreadnought.html?stage=1',label:'VOYAGER DREADNOUGHT · LIVE',accent:'#ff7b8c'},
      splash:{eyebrow:'⚠ INCOMING CAPITAL SHIP',title:'DREADNOUGHT CALLED',chips:['!JOIN','!FIRE']},
      celebrate:w==='mvp'&&r?.mvp?{eyebrow:'★ DREADNOUGHT MVP ★',name:r.mvp.name,line:Number(r.mvp.damage).toLocaleString('en')+' DAMAGE · MOST OF THE FLEET',points:r.bonus,pointsLabel:'VOYAGER POINTS',sub:(r.outcome==='victory'?r.name+' destroyed':r.name+' escaped')+' · '+r.pilots+' pilot'+(r.pilots===1?'':'s')+' · '+Number(r.damage).toLocaleString('en')+' damage dealt',until:r.endedAt+(s.resultSeconds+s.mvpSeconds)*1000}:null,
      // kept for older stage pages
      mvp:w==='mvp'&&r?.mvp?{...r.mvp,bonus:r.bonus,outcome:r.outcome,boss:r.name,damageTotal:r.damage,pilots:r.pilots,until:r.endedAt+(s.resultSeconds+s.mvpSeconds)*1000}:null};}
  // Send the cue for the current state again (the control page's "Move my scene again" after fixing the action or the names).
  async resend(boss,versus){this.cue.on=!this.active(boss,versus);this.cue.dueAt=this.cue.on?0:1;return this.tick(boss,versus);}
  // What OBS did, reported by the Streamer.bot action.
  result(r){this.cue.obs={at:Number(r.at)||this.now(),phase:String(r.phase||''),ok:!!r.ok,message:String(r.message||'').slice(0,300),version:String(r.backendVersion||'')};return this.cue.obs;}
  view(){return {settings:this.settings,defaults:STAGE_DEFAULTS,slotKinds:SLOT_KINDS,stackKinds:STACK_KINDS,geometry:GEOMETRY,cue:this.cue.last,obs:this.cue.obs||null,forced:this.forcedUntil>this.now(),forcedMode:this.forcedMode,chatCount:this.messages.length,versusRewards:this.versusRewards.slice(-5)};}
  // Shrink / restore cue to Streamer.bot: once when the stage comes up, once when it goes down. Needs the scene and the
  // nested scene / group that holds the streamer's game, named on the Dreadnought page.
  async tick(boss,versus){
    const mode=this.mode(boss,versus),want=!!mode,s=this.settings;if(want===this.cue.on||this.cue.sending)return null;
    // Coming up: wait out the splash first, so the game shrinks when the panels arrive, not under the "called" slam.
    if(want){if(!this.cue.dueAt)this.cue.dueAt=this.now()+(mode==='versus'?s.versus.splashSeconds:s.splashSeconds)*1000;if(this.now()<this.cue.dueAt)return null;}
    this.cue.dueAt=0;this.cue.on=want;if(!this.run||!s.scene||!s.source)return null;
    this.cue.sending=true;const g=GEOMETRY,pip=g.pip[s.pip];
    try{const args={stagePhase:want?'on':'off',stageScene:s.scene,stageSource:s.source,stageX:pip.x,stageY:g.pip.y,stageW:g.pip.w,stageH:g.pip.h,stageMs:s.animationMs,stageHide:JSON.stringify(s.hide),requestId:this.uuid()};
      let r;try{r=await this.run(args);}catch(e){r={ok:false,message:e.message};}
      this.cue.last={at:this.now(),phase:args.stagePhase,ok:!!r?.ok,message:String(r?.message||'')};this.log('stage '+args.stagePhase+' cue: '+(r?.ok?'sent':r?.message));return this.cue.last;}
    finally{this.cue.sending=false;}
  }
}
