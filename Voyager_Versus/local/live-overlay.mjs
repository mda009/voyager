// Public, aggregate-only bridge from the existing Live dashboard to OBS.
// It never connects to chat, operates a giveaway or changes a points balance.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
const platforms=['twitch','youtube','kick'];
const count=x=>Number.isSafeInteger(x)&&x>=0?x:null;
const stamp=x=>typeof x==='number'&&Number.isFinite(x)&&x>0&&x<=Date.now()+60000?x:0;
export class LiveOverlay {
  constructor(directory){this.path=join(directory,'live-overlay.json');this.config={visible:true,opacity:35,goal:'followers'};this.feed=null;this.receivedAt=0;this.saving=Promise.resolve();}
  async load(){try{this.config=this.cleanConfig(JSON.parse(await readFile(this.path,'utf8')));}catch(e){if(e.code!=='ENOENT')console.warn('Live overlay settings could not be read; using defaults.');}return this;}
  cleanConfig(raw={}){return {visible:raw.visible!==false,opacity:Number.isFinite(raw.opacity)?Math.max(0,Math.min(90,Math.round(raw.opacity))):35,goal:['viewers','followers','subscriptions','none'].includes(raw.goal)?raw.goal:'followers'};}
  snapshot(){return {schema:1,serverAt:Date.now(),receivedAt:this.receivedAt,config:{...this.config},feed:this.feed};}
  async configure(raw){const operation=this.saving.catch(()=>{}).then(async()=>{const next=this.cleanConfig({...this.config,...raw});await writeFile(this.path+'.tmp',JSON.stringify(next));await rename(this.path+'.tmp',this.path);this.config=next;});this.saving=operation;await operation;return this.snapshot();}
  publish(raw){
    if(raw?.schema!==1||!raw.platforms||raw.demo===true)throw new Error('Invalid live feed.');
    const feed={connected:raw.connected===true,platforms:{}};
    for(const p of platforms){const input=raw.platforms[p]||{},out={live:typeof input.live==='boolean'?input.live:null,liveAt:stamp(input.liveAt),metrics:{},goals:{}};
      for(const k of ['viewers','followers','subscriptions']){const m=input.metrics?.[k]||{};out.metrics[k]={value:count(m.value),at:stamp(m.at),manual:k!=='viewers'&&m.manual===true,stale:m.stale===true};const goal=count(input.goals?.[k]);out.goals[k]=goal>0?goal:null;}
      feed.platforms[p]=out;
    }
    this.feed=feed;this.receivedAt=Date.now();return {ok:true,receivedAt:this.receivedAt};
  }
}
