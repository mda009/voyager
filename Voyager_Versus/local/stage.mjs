// Voyager Dreadnought stage (2.20.84). When the Dreadnought is called, one full-screen OBS browser source (stage.html) takes
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
export const STAGE_DEFAULTS={enabled:true,slots:{left:'leaderboard',right:'helpers',bottomLeft:'chat'},stack:['bucket','ticker','moments'],pip:'br',scene:'',source:'',hide:[],resultSeconds:20,splashSeconds:6,mvpSeconds:10,animationMs:1200,chat:{twitch:true,youtube:true,kick:true,commands:false,names:true}};
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
  return s;
}
// The picture-in-picture window and the main feature on the 1920 x 1080 canvas; stage.html and the OBS cue share these numbers.
export const GEOMETRY={main:{x:384,y:20,w:1152,h:648},pip:{w:640,h:360,y:704,br:{x:1252},bl:{x:28}},columns:{w:346,h:648,y:20,left:20,right:1554},bottomLeft:{w:300,h:372,y:690,br:{x:20},bl:{x:1600}},stack:{x:340,y:690,w:892,h:372}};
export class Stage{
  constructor({dataDir='.',now=()=>Date.now(),run=null,uuid=randomUUID,log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'stage.json');this.now=now;this.run=run;this.uuid=uuid;this.log=log;
    this.settings=normalizeSettings({});this.revision=0;this.messages=[];this.saving=Promise.resolve();
    this.cue={on:false,sending:false,last:null,battleId:0,dueAt:0};this.forcedUntil=0;this.lastResult=null;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeSettings(raw.settings||{});this.revision=Number(raw.revision)||0;}catch{}return this;}
  persist(){const data=JSON.stringify({schema:1,settings:this.settings,revision:this.revision});this.saving=this.saving.then(async()=>{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,data);await rename(tmp,this.file);}).catch(e=>this.log('stage save failed: '+e.message));return this.saving;}
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
  active(boss){
    this.observe(boss);if(!this.settings.enabled)return false;const now=this.now();if(this.forcedUntil>now)return true;
    if(boss&&(boss.phase==='lobby'||boss.phase==='battle'))return true;
    return !!this.window();
  }
  force(seconds){const n=Math.max(0,Math.min(600,Number(seconds)||0));this.forcedUntil=n?this.now()+n*1000:0;if(n&&!this.messages.length)this.sampleChat();return {ok:true,until:this.forcedUntil};}
  // Fictional sample lines for a test showing, so the chat window is not empty before anyone has typed.
  sampleChat(){const now=this.now();[['twitch','StarNova','#9fd4ff','o7 fleet, boarding now',0,true],['youtube','Quillon','','!join',2,false],['kick','PixelDrift','','that hull bar is huge',0,false],['twitch','Ashgrove','#ffd56a','!fire !fire !fire',3,true],['twitch','Lumen_7','#7ff0b5','gifted 5 subs, torpedoes away 🚀',0,true],['youtube','Tamsin','','gg pilots',0,false]].forEach(([platform,name,color,text,role,sub],i)=>this.chat({platform,name,login:name.toLowerCase(),text,color,role,sub,messageId:'sample'+i}));}
  layout(){const s=this.settings,g=GEOMETRY;return {slots:s.slots,stack:s.stack,pip:s.pip,geometry:{main:g.main,pip:{x:g.pip[s.pip].x,y:g.pip.y,w:g.pip.w,h:g.pip.h},left:{x:g.columns.left,y:g.columns.y,w:g.columns.w,h:g.columns.h},right:{x:g.columns.right,y:g.columns.y,w:g.columns.w,h:g.columns.h},bottomLeft:{x:g.bottomLeft[s.pip].x,y:g.bottomLeft.y,w:g.bottomLeft.w,h:g.bottomLeft.h},stack:g.stack}};}
  overlay(boss){const now=this.now(),active=this.active(boss),w=this.window(),live=boss&&(boss.phase==='lobby'||boss.phase==='battle'),phase=live?boss.phase:w==='mvp'?'mvp':w==='result'?'result':boss?.phase||'idle',r=this.lastResult;
    return {serverAt:now,active,phase,demo:!!(boss?.demo||(w&&r?.demo)),forced:this.forcedUntil>now,...this.layout(),chat:this.chatFeed(),chatNames:this.settings.chat.names,animationMs:this.settings.animationMs,splashMs:this.settings.splashSeconds*1000,mvpMs:this.settings.mvpSeconds*1000,
      mvp:w==='mvp'&&r?.mvp?{...r.mvp,bonus:r.bonus,outcome:r.outcome,boss:r.name,damageTotal:r.damage,pilots:r.pilots,until:r.endedAt+(this.settings.resultSeconds+this.settings.mvpSeconds)*1000}:null,cue:this.cue.last};}
  // Send the cue for the current state again (the control page's "Move my scene again" after fixing the action or the names).
  async resend(boss){this.cue.on=!this.active(boss);this.cue.dueAt=this.cue.on?0:1;return this.tick(boss);}
  // What OBS did, reported by the Streamer.bot action.
  result(r){this.cue.obs={at:Number(r.at)||this.now(),phase:String(r.phase||''),ok:!!r.ok,message:String(r.message||'').slice(0,300),version:String(r.backendVersion||'')};return this.cue.obs;}
  view(){return {settings:this.settings,defaults:STAGE_DEFAULTS,slotKinds:SLOT_KINDS,stackKinds:STACK_KINDS,geometry:GEOMETRY,cue:this.cue.last,obs:this.cue.obs||null,forced:this.forcedUntil>this.now(),chatCount:this.messages.length};}
  // Shrink / restore cue to Streamer.bot: once when the stage comes up, once when it goes down. Needs the scene and the
  // nested scene / group that holds the streamer's game, named on the Dreadnought page.
  async tick(boss){
    const want=this.active(boss),s=this.settings;if(want===this.cue.on||this.cue.sending)return null;
    // Coming up: wait out the splash first, so the game shrinks when the panels arrive, not under the "Dreadnought called" slam.
    if(want){if(!this.cue.dueAt)this.cue.dueAt=this.now()+s.splashSeconds*1000;if(this.now()<this.cue.dueAt)return null;}
    this.cue.dueAt=0;this.cue.on=want;if(!this.run||!s.scene||!s.source)return null;
    this.cue.sending=true;const g=GEOMETRY,pip=g.pip[s.pip];
    try{const args={stagePhase:want?'on':'off',stageScene:s.scene,stageSource:s.source,stageX:pip.x,stageY:g.pip.y,stageW:g.pip.w,stageH:g.pip.h,stageMs:s.animationMs,stageHide:JSON.stringify(s.hide),requestId:this.uuid()};
      let r;try{r=await this.run(args);}catch(e){r={ok:false,message:e.message};}
      this.cue.last={at:this.now(),phase:args.stagePhase,ok:!!r?.ok,message:String(r?.message||'')};this.log('stage '+args.stagePhase+' cue: '+(r?.ok?'sent':r?.message));return this.cue.last;}
    finally{this.cue.sending=false;}
  }
}
