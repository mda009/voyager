// Streamer.bot actions (2.20.41): run Voyager's Streamer.bot actions and Goal FX plays from Voyager Control.
// `bot` is the host's StreamerBot client (request('GetActions'), request('DoAction')). Nothing here throws to the
// caller: every run resolves to {ok,message} and is kept in a short history for the page.
import {randomUUID} from 'node:crypto';

const PLATFORMS=['twitch','kick','youtube'];
const cut=(text,max)=>String(text??'').replace(/\s+/g,' ').trim().slice(0,max);
const num=(v,min,max,d)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):d;};
const platform=v=>PLATFORMS.includes(String(v||'').toLowerCase())?String(v).toLowerCase():'';

// Presets: the runs that mean something when started by hand. `args` builds the Streamer.bot arguments from the
// page input; `ctx` gives the host's own state (medal export cursor). Names must match the actions exactly.
export const PRESETS={
  'goals.read':{action:'Voyager - Read OBS Percentages',group:'Giveaway goals',label:'Read the goal percentages now',note:'Reads the Silver, Gold and Platinum text sources from OBS and sends a fresh reading to the goals strip and Goal FX.'},
  'goals.check':{action:'THRESHOLD POINT CHECK',group:'Giveaway goals',label:'Run the giveaway threshold check',note:'Your existing threshold action: giveaway chat announcements and the upgrade media groups when a goal is met.'},
  'upgrade.silver':{action:'Upgrade Animation Silver',group:'Giveaway goals',label:'Play the Silver upgrade animation',note:'Plays the Silver media group in OBS with the upgrade hold, exactly as a real upgrade does.'},
  'upgrade.gold':{action:'Upgrade Animation Gold',group:'Giveaway goals',label:'Play the Gold upgrade animation',note:'Plays the Gold media group in OBS with the upgrade hold.'},
  'points.scan':{action:'Voyager - Points Ledger',group:'Points',label:'Scan the tier groups now',note:'Re-reads the Silver, Gold, Platinum, VIP and mods groups and broadcasts a fresh ledger snapshot.',args:()=>({pointsOperation:'scan',requestId:randomUUID()})},
  'points.snapshot':{action:'Voyager - Points Ledger',group:'Points',label:'Broadcast a ledger snapshot',note:'Sends the current ledger without re-scanning (a scan still happens if the last one is older than 2 minutes).',args:()=>({pointsOperation:'snapshot',requestId:randomUUID()})},
  'medals.export':{action:'Voyager - Medals',group:'Chat',label:'Export medal data to Voyager now',note:'The same export Voyager asks for every few minutes: watch time, subs and gifts for the Medals page.',args:(i,ctx)=>({medalExport:'1',since:String(ctx.medalsSince?.()??0),requestId:'medals-'+Date.now()})},
  'medals.say':{action:'Voyager - Medals',group:'Chat',label:'Post a chat message through "Voyager - Medals"',note:'Posts to all platforms, or one platform only. This is the route !report, !medals and quiz replies use.',input:['text','platform'],args:i=>({medalSay:cut(i.text,450)||'Voyager check: the "Voyager - Medals" action is posting to chat.',medalSayPlatform:platform(i.platform)})},
  'card.say':{action:'Voyager - Membership Card',group:'Chat',label:'Post a chat message through "Voyager - Membership Card"',note:'The route !voyager replies and tier-up announcements use.',input:['text'],args:i=>({cardSay:cut(i.text,450)||'Voyager check: the "Voyager - Membership Card" action is posting to chat.'})},
  'boss.say':{action:'Voyager - Dreadnought',group:'Chat',label:'Post a chat message through "Voyager - Dreadnought"',note:'The route Dreadnought fight messages use.',input:['text'],args:i=>({bossSay:cut(i.text,450)||'Voyager check: the "Voyager - Dreadnought" action is posting to chat.'})},
  'fleet.test':{action:'Voyager - Fleet Alerts',group:'Support alerts',label:'Send a test support alert to OBS',note:'Queues a test alert (fleet alerts must be enabled). Stage 1 follow · 2 sub · 3 gift · 4 resub · 5 bits · 6 raid.',input:['stage','name','amount','months','platform'],
    args:i=>({fleetOperation:'test',requestId:randomUUID(),fleetStage:String(num(i.stage,1,6,1)),fleetName:cut(i.name,80)||'MDA009',fleetAmount:String(num(i.amount,1,1000000,1)),fleetMonths:String(num(i.months,1,1200,1)),fleetPlatform:platform(i.platform)||'twitch'})}
};
export const GOAL_TIERS=['silver','gold','platinum'];

export class Actions{
  constructor({bot,medalsSince=()=>0,now=()=>Date.now()}={}){
    this.bot=bot;this.ctx={medalsSince};this.now=now;this.history=[];this.list=[];this.listAt=0;this.goalCommands=[];this.goalSeq=0;this.epoch=now();
  }
  // Every action in Streamer.bot (cached 20 s): the page lists them all with a Run button.
  async actions(force=false){
    if(!this.bot?.status?.connected)return {connected:false,actions:[]};
    if(force||!this.listAt||this.now()-this.listAt>20000){
      try{const r=await this.bot.request('GetActions');this.list=(r.actions||[]).map(a=>({id:String(a.id),name:String(a.name||''),group:String(a.group||''),enabled:a.enabled!==false,subactions:Number(a.subaction_count)||0})).sort((a,b)=>a.group.localeCompare(b.group)||a.name.localeCompare(b.name));this.listAt=this.now();}
      catch(e){return {connected:true,actions:this.list,error:e.message};}
    }
    return {connected:true,actions:this.list};
  }
  presets(){
    const byName=new Map(this.list.map(a=>[a.name,a]));
    return Object.entries(PRESETS).map(([key,p])=>{const all=this.list.filter(a=>a.name===p.action),on=all.filter(a=>a.enabled);
      return {key,action:p.action,group:p.group,label:p.label,note:p.note,input:p.input||[],state:!this.bot?.status?.connected?'offline':on.length===1?'found':on.length>1?'duplicate':all.length?'disabled':'missing',id:on.length===1?on[0].id:byName.get(p.action)?.id||null};});
  }
  record(entry){this.history.unshift({at:this.now(),...entry});this.history.length=Math.min(this.history.length,40);return entry;}
  // Run a preset by key, or any listed action by id (no arguments: the same as "Run" in Streamer.bot without a test flag).
  async run(input={}){
    const key=String(input.key||'');
    if(key){
      const p=PRESETS[key];if(!p)return this.record({ok:false,label:key,action:'',message:'Unknown preset.'});
      const r=await this.doAction(p.action,p.args?p.args(input,this.ctx):{});
      return this.record({ok:r.ok,key,label:p.label,action:p.action,message:r.message});
    }
    const id=String(input.id||'');await this.actions();const a=this.list.find(x=>x.id===id);
    if(!a)return this.record({ok:false,label:'Run action',action:String(input.name||id).slice(0,80),message:'That action is not in Streamer.bot any more. Refresh the list.'});
    if(!a.enabled)return this.record({ok:false,label:'Run action',action:a.name,message:'That action is disabled in Streamer.bot.'});
    const r=await this.doActionById(a.id,{});return this.record({ok:r.ok,label:'Run action',action:a.name,message:r.message});
  }
  async doAction(name,args){
    if(!this.bot?.status?.connected)return {ok:false,message:'Voyager is not connected to Streamer.bot.'};
    await this.actions();const all=this.list.filter(a=>a.name===name),on=all.filter(a=>a.enabled);
    if(on.length!==1)return {ok:false,message:on.length>1?`There are ${on.length} enabled actions called "${name}". Keep one.`:all.length?`"${name}" is disabled in Streamer.bot.`:`"${name}" is not in Streamer.bot. Check the action name.`};
    return this.doActionById(on[0].id,args);
  }
  async doActionById(id,args){
    try{const r=await this.bot.request('DoAction',{action:{id},args});return r?.status==='error'?{ok:false,message:r.error||'Streamer.bot refused the request.'}:{ok:true,message:'Sent to Streamer.bot.'};}
    catch(e){return {ok:false,message:e.message};}
  }
  // Goal FX: Voyager queues a play or re-arm; the overlay polls /api/goalfx/overlay and performs it.
  goalFx(input={}){
    const kind=String(input.kind||'');const tier=String(input.tier||'').toLowerCase();
    if(!['play','rearm'].includes(kind))return {ok:false,message:'Choose play or rearm.'};
    if(kind==='play'&&!GOAL_TIERS.includes(tier))return {ok:false,message:'Choose Silver, Gold or Platinum.'};
    const cmd={id:++this.goalSeq,kind,tier:kind==='play'?tier:'',at:this.now()};this.goalCommands.push(cmd);
    this.goalCommands=this.goalCommands.filter(c=>this.now()-c.at<60000).slice(-20);
    this.record({ok:true,key:'goalfx.'+kind,label:kind==='play'?`Play the ${tier[0].toUpperCase()+tier.slice(1)} goal celebration`:'Re-arm the goal celebrations',action:'Voyager Goal FX overlay',message:'Queued for the Goal FX overlay (it picks it up within 2 seconds while open in OBS).'});
    return {ok:true,message:'Queued for the Goal FX overlay.',command:cmd};
  }
  goalOverlay(since=0){const s=Number(since)||0;this.goalPollAt=this.now();return {serverAt:this.now(),epoch:this.epoch,commands:this.goalCommands.filter(c=>c.id>s&&this.now()-c.at<60000)};}
  view(){return {history:this.history.slice(0,40),presets:this.presets(),goalFx:{pollAt:this.goalPollAt||0,polling:!!this.goalPollAt&&this.now()-this.goalPollAt<6000}};}
}
