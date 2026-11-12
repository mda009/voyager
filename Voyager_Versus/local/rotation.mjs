/* Voyager timed OBS sources (2.21.10). A source that should come and go on a clock — the Star Citizen referral code for 30 s every
   10 minutes, say — without a Streamer.bot timer per source. Voyager works out, every second, whether each named source should be
   showing right now (a fixed cycle: show for showSeconds, hide for hideSeconds, repeat) and, when that changes, asks the
   "Voyager - Dreadnought Stage" action (v1.4+, stagePhase show|hide) to flip it in the current OBS scene. The action answers with
   voyager.stage.result like the stage cue does, so the Screen layout page can say "shown 12 s ago" or "not found in 'MDA Solo'".
   While the Dreadnought / Versus stage is up nothing is touched (the stage hides and restores its own list); when it comes down
   the cycle sends the current state again. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';

const LIMITS={showSeconds:[5,3600],hideSeconds:[5,86400]};
export const ROTATION_DEFAULTS={items:[]};

export function normalizeRotation(raw={}){
  const r=raw&&typeof raw==='object'?raw:{},items=[];
  if(r.items!==undefined&&!Array.isArray(r.items))throw new Error('Timed sources must be a list.');
  for(const it of r.items||[]){
    if(!it||typeof it!=='object')continue;
    const name=String(it.name||'').trim();if(!name)continue;if(name.length>120)throw new Error('Source name too long.');
    if(items.some(x=>x.name.toLowerCase()===name.toLowerCase()))throw new Error('"'+name+'" is listed twice.');
    const out={name,enabled:it.enabled!==false};
    for(const [k,[min,max]] of Object.entries(LIMITS)){const n=Number(it[k]);if(!Number.isFinite(n)||n<min||n>max)throw new Error(k==='showSeconds'?'Show for must be '+min+' to '+max+' seconds.':'Hide for must be '+min+' to '+max+' seconds.');out[k]=Math.round(n);}
    items.push(out);
  }
  if(items.length>12)throw new Error('Up to 12 timed sources.');
  return {items};
}

export class Rotation{
  constructor({dataDir,now=Date.now,run=null,uuid=()=>Math.random().toString(16).slice(2)}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'rotation.json');this.now=now;this.run=run;this.uuid=uuid;
    this.settings=structuredClone(ROTATION_DEFAULTS);this.anchor=now();this.state={};this.suspended=false;this.saving=null;this.seeded=false;
  }
  async load(){
    try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeRotation(raw.settings||{});this.anchor=Number(raw.anchor)||this.now();}
    catch{this.seeded=true;}
    return this;
  }
  async persist(){await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,anchor:this.anchor},null,1));await rename(tmp,this.file);}
  configure(raw){const next=normalizeRotation(raw);const changed=JSON.stringify(next)!==JSON.stringify(this.settings);this.settings=next;if(changed){this.anchor=this.now();this.state={};}this.saving=this.persist().catch(()=>{});return this.view();}
  // Should this item be showing right now? A fixed cycle from the anchor: show, then hide, repeat.
  wanted(item,now=this.now()){const period=(item.showSeconds+item.hideSeconds)*1000,pos=((now-this.anchor)%period+period)%period;return pos<item.showSeconds*1000;}
  nextChange(item,now=this.now()){const period=(item.showSeconds+item.hideSeconds)*1000,pos=((now-this.anchor)%period+period)%period;return now+(pos<item.showSeconds*1000?item.showSeconds*1000-pos:period-pos);}
  // Called every second. stageUp: the Dreadnought / Versus stage owns the scene; connected: Streamer.bot is reachable.
  async tick({stageUp=false,connected=true}={}){
    const now=this.now();
    if(stageUp){this.suspended=true;return [];}
    if(this.suspended){this.suspended=false;for(const s of Object.values(this.state))s.sent=null;} // the stage restored its own list: say ours again
    if(!connected||!this.run)return [];
    const sent=[];
    for(const item of this.settings.items){
      if(!item.enabled)continue;
      const want=this.wanted(item,now),s=this.state[item.name]||(this.state[item.name]={sent:null});
      if(s.sent===want||s.sending)continue;
      s.sending=true;const requestId=this.uuid();
      try{const r=await this.run({stagePhase:want?'show':'hide',stageSources:JSON.stringify([item.name]),stageScene:'',requestId});
        Object.assign(s,{sent:want,at:now,requestId,ok:r?.ok!==false,message:r?.message||'',obs:null});}
      catch(e){Object.assign(s,{sent:want,at:now,requestId,ok:false,message:e?.message||'failed',obs:null});}
      finally{s.sending=false;}
      sent.push({name:item.name,show:want,ok:s.ok});
    }
    return sent;
  }
  // The action's answer (voyager.stage.result with phase show|hide).
  result(r){const names=(()=>{try{return JSON.parse(r?.sources||'[]');}catch{return [];}})();
    for(const [name,s] of Object.entries(this.state)){if(r?.requestId&&s.requestId===r.requestId||(!r?.requestId&&names.some(n=>String(n).toLowerCase()===name.toLowerCase()))){s.obs={ok:!!r.ok,message:String(r.message||''),at:this.now()};return s;}}
    return null;}
  // A one-off show or hide from the control page (does not move the cycle).
  async test(name,show){if(!this.run)throw new Error('Not connected to Streamer.bot.');const r=await this.run({stagePhase:show?'show':'hide',stageSources:JSON.stringify([name]),stageScene:'',requestId:this.uuid()});const s=this.state[name]||(this.state[name]={sent:null});s.sent=null;return r;}
  view(){const now=this.now();return {settings:this.settings,anchor:this.anchor,suspended:this.suspended,items:this.settings.items.map(it=>{const s=this.state[it.name]||{};return {...it,showing:it.enabled?this.wanted(it,now):null,nextChange:it.enabled?this.nextChange(it,now):0,sent:s.sent??null,at:s.at||0,ok:s.ok??null,message:s.message||'',obs:s.obs||null};})};}
}
