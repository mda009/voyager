/* Voyager viewer requests (2.24.0). Viewers ask for something from the companion website — Bridge Quiz, the Dreadnought,
   Frenzy, Marbles… — one request per person per stream. The streamer is told by an overlay alert and a chat line.

   How a request travels: the website posts it to the site's own Cloudflare Worker (site/worker.mjs, /api/request), which
   keeps a short list. This host reads that list every few seconds (poll), checks each new entry itself — the option is
   one of yours and switched on, the name is someone on the crew list, that person has not already asked this stream —
   and only then accepts it. Accepted requests are published back in the public feed so the website can show them.
   The website cannot prove who is typing: a request carries the card name the viewer picked. The limits (one per name,
   one per device, a few per network per day, known crew names only, fixed options, no free text) keep that harmless. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';

export const REQUEST_DEFAULTS={enabled:true,onlyLive:true,chat:true,overlay:true,overlaySeconds:12,
  options:[{key:'quiz',label:'Bridge Quiz',enabled:true},{key:'dreadnought',label:'Dreadnought',enabled:true},{key:'frenzy',label:'Frenzy',enabled:true},{key:'marbles',label:'Marbles',enabled:true},{key:'versus',label:'Voyager Versus',enabled:true}]};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const STATUS=['new','done','dismissed'];

export function normalizeRequestSettings(raw={},base=REQUEST_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},sec=Number(r.overlaySeconds??base.overlaySeconds);
  if(!Number.isFinite(sec)||sec<4||sec>60)throw new Error('The alert stays on screen for 4 to 60 seconds.');
  let options=base.options;
  if(r.options!==undefined){if(!Array.isArray(r.options))throw new Error('Options must be a list.');const seen=new Set();options=[];
    for(const o of r.options){const label=clean(o?.label,30);if(!label)continue;let key=clean(o?.key,20).toLowerCase().replace(/[^a-z0-9]/g,'')||label.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,20);if(!key)continue;
      if(seen.has(key))throw new Error('"'+label+'" is listed twice.');seen.add(key);options.push({key,label,enabled:o.enabled!==false});}
    if(options.length>10)throw new Error('Up to 10 things viewers can request.');}
  return {enabled:r.enabled===undefined?base.enabled:!!r.enabled,onlyLive:r.onlyLive===undefined?base.onlyLive:!!r.onlyLive,chat:r.chat===undefined?base.chat:!!r.chat,overlay:r.overlay===undefined?base.overlay:!!r.overlay,overlaySeconds:Math.round(sec),options:options.map(o=>({...o}))};
}

export class Requests{
  // siteUrl(): the public website (https://…/) or ''. known(name): the crew display name for a typed name, or null.
  // round(): the current stream id. onAir(): is the stream live. say(text): chat. fetchJson: the network (injected in tests).
  constructor({dataDir,siteUrl=()=>'',known=()=>null,round=()=>0,onAir=()=>false,say=()=>{},now=Date.now,fetchJson=null,log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'requests.json');this.siteUrl=siteUrl;this.known=known;this.round=round;this.onAir=onAir;this.say=say;this.now=now;this.log=log;
    this.fetchJson=fetchJson||(async url=>{const r=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
    this.settings=normalizeRequestSettings({});this.items=[];this.cursor=0;this.seen=new Set();this.alerts=[];this.alert=null;this.status={ok:null,at:0,message:'Not checked yet'};this.busy=false;this.seq=0;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeRequestSettings(raw.settings||{});this.items=(Array.isArray(raw.items)?raw.items:[]).filter(i=>i&&i.id&&i.name).slice(0,200);this.cursor=Number(raw.cursor)||0;for(const i of this.items)this.seen.add(i.id);}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,items:this.items.slice(0,200),cursor:this.cursor},null,1));await rename(tmp,this.file);}catch{}}
  configure(raw={}){this.settings=normalizeRequestSettings({...this.settings,...raw});void this.persist();return this.view();}
  open(){return this.settings.enabled&&(!this.settings.onlyLive||!!this.onAir());}
  current(){const round=this.round();return this.items.filter(i=>i.round===round);}
  // One incoming request (from the Worker list, or a test). Returns {ok} or {ok:false,reason}.
  accept(r,{test=false}={}){
    const id=clean(r?.id,40);if(!id||this.seen.has(id))return {ok:false,reason:'seen'};this.seen.add(id);
    const opt=this.settings.options.find(o=>o.key===clean(r.key,20).toLowerCase());if(!opt||!opt.enabled)return {ok:false,reason:'option'};
    if(!test&&!this.open())return {ok:false,reason:'closed'};
    const typed=clean(r.name,60),name=test?typed:this.known(typed);if(!name)return {ok:false,reason:'unknown name'};
    const round=this.round(),who=name.toLowerCase();if(!test&&this.items.some(i=>i.round===round&&i.who===who&&!i.test))return {ok:false,reason:'already asked'};
    const item={id,name,who,key:opt.key,label:opt.label,at:Number(r.at)||this.now(),round,status:'new',test:!!test};
    this.items.unshift(item);this.items=this.items.slice(0,200);
    if(this.settings.overlay)this.alerts.push({id:++this.seq,name,label:opt.label,key:opt.key});
    if(this.settings.chat&&!test){const line='📨 Request from '+name+': '+opt.label+' ('+this.tally().find(t=>t.key===opt.key).count+' asking this stream)';Promise.resolve().then(()=>this.say(line)).catch(()=>{});}
    this.log('request: '+name+' → '+opt.label);void this.persist();return {ok:true,item};
  }
  // Read the Worker's list. Every 10 s from the host tick while requests are on and a site address is set.
  async poll(){
    if(this.busy||!this.settings.enabled)return null;const site=this.siteUrl();if(!site){this.status={ok:null,at:this.now(),message:'No website address set (Public website)'};return null;}
    this.busy=true;try{const d=await this.fetchJson(site.replace(/\/+$/,'')+'/api/requests?after='+this.cursor);const list=Array.isArray(d?.requests)?d.requests:[];let taken=0;
      for(const r of list.sort((a,b)=>(a.at||0)-(b.at||0))){if(this.accept(r).ok)taken++;this.cursor=Math.max(this.cursor,Number(r.at)||0);}
      this.status={ok:true,at:this.now(),message:'Connected to the website'};if(list.length)void this.persist();return {taken,seen:list.length};
    }catch(e){this.status={ok:false,at:this.now(),message:/404|503/.test(e.message)?'The website has no request service yet (it deploys with the site)':'Could not reach the website: '+(e.message||'failed')};return null;}
    finally{this.busy=false;}
  }
  mark(id,status){if(!STATUS.includes(status))throw new Error('Unknown status.');const i=this.items.find(x=>x.id===id);if(!i)throw new Error('That request is no longer listed.');i.status=status;void this.persist();return this.view();}
  clear(){const round=this.round();this.items=this.items.filter(i=>i.round!==round);this.alerts=[];this.alert=null;void this.persist();return this.view();}
  test(key){const opt=this.settings.options.find(o=>o.key===key)||this.settings.options[0];if(!opt)throw new Error('Add something to request first.');const r=this.accept({id:'test-'+this.now(),name:'Sample Viewer',key:opt.key,at:this.now()},{test:true});if(!r.ok)throw new Error('Could not show the test ('+r.reason+').');return this.view();}
  tally(){const cur=this.current().filter(i=>i.status!=='dismissed'&&!i.test);return this.settings.options.filter(o=>o.enabled).map(o=>({key:o.key,label:o.label,count:cur.filter(i=>i.key===o.key).length}));}
  // The OBS overlay: one alert at a time, each for overlaySeconds.
  overlay(){const now=this.now();if(this.alert&&now>=this.alert.until)this.alert=null;if(!this.alert&&this.alerts.length){const a=this.alerts.shift();this.alert={...a,at:now,until:now+this.settings.overlaySeconds*1000};}
    return {serverAt:now,enabled:this.settings.enabled&&this.settings.overlay,alert:this.alert,waiting:this.alerts.length,tally:this.tally().filter(t=>t.count)};}
  // What the public website gets.
  share(){const open=this.open(),cur=this.current().filter(i=>!i.test&&i.status!=='dismissed');
    return {open,round:this.round(),options:this.settings.enabled?this.settings.options.filter(o=>o.enabled).map(o=>({key:o.key,label:o.label})):[],
      recent:cur.slice(0,12).map(i=>({name:i.name,label:i.label,at:i.at,done:i.status==='done'})),tally:this.tally().filter(t=>t.count).map(t=>({label:t.label,count:t.count}))};}
  view(){return {settings:this.settings,open:this.open(),round:this.round(),status:this.status,siteUrl:this.siteUrl(),items:this.current().slice(0,60),tally:this.tally(),older:this.items.filter(i=>i.round!==this.round()).length};}
}
