/* Voyager SC Intel (2.21.15): Star Citizen news, ships in the pledge store, deals and events — on an OBS panel and in chat.
   Two live sources, read by the host on the streamer's PC (nothing is published anywhere):
     · Comm-Links from the Star Citizen Wiki API (api.star-citizen.wiki, newest first, links back to RSI) — with the RSI
       Comm-Link RSS feed as the fallback. Each is tagged (patch, event, free fly, sale, CCU, show) from its title.
     · Ships currently buyable in the pledge store from the Fleetyards API (api.fleetyards.net, onSale with the pledge price
       and the RSI store link). "On sale" here means in the store right now, which is how limited and concept sales show up;
       warbond and CCU discounts are not published by any API, so those are curated below.
   Deals & events are the streamer's own list (kind, title, detail, link, until). Chat: !news, !sales (!ships), !deals (!ccu,
   !upgrades), !events (!freefly), !intel — answered once per cooldown per command, on the platform the question came from.
   Credits: api.star-citizen.wiki and fleetyards.net (non-commercial use).
   2.31.0: news now comes from RSI's own Comm-Link pages first (the wiki list runs weeks behind), merged with the wiki list;
   patch notes (RSI Patch Notes page + Spectrum) and the current LIVE / PTU builds are read too (!patch); active events get
   their own section (the built-in calendar, events named in recent Comm-Links, and the streamer's own event rows).
   The sources and parsers live in intel-sources.mjs, shared with the website's Worker. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {tagNews,TAG_LABELS,parseNewsApi,parseNewsRss,NEWS_URL,NEWS_RSS,gather,buildReleases,spotlights,SOURCE_LABELS} from './intel-sources.mjs';
export {tagNews,TAG_LABELS,parseNewsApi,parseNewsRss,NEWS_URL,NEWS_RSS};

export const INTEL_DEFAULTS={enabled:true,panel:{cycleSeconds:12,news:true,sales:true,deals:true,events:true,newsCount:5,shipsCount:4},commands:{enabled:true,cooldownSeconds:30},releases:{live:'',ptu:''}};
export const INTEL_COMMANDS=[
  {word:'!news',also:['!scnews'],kind:'news',text:'The three newest Comm-Links with a link to the rest'},
  {word:'!sales',also:['!ships','!store'],kind:'sales',text:'Ships in the pledge store right now, newest first, with prices'},
  {word:'!deals',also:['!ccu','!upgrades','!warbond'],kind:'deals',text:'Your listed CCU, warbond and ship deals'},
  {word:'!events',also:['!freefly','!event'],kind:'events',text:'Your listed events plus event and Free Fly Comm-Links from the last three weeks'},
  {word:'!patch',also:['!patchnotes','!version','!ptu'],kind:'patch',text:'The current LIVE and PTU versions with a link to the newest patch notes'},
  {word:'!intel',also:['!sc'],kind:'intel',text:'Lists these commands'}];
export const DEAL_KINDS={ccu:'CCU / upgrade',sale:'Ship deal',event:'Event',freefly:'Free Fly',note:'Note'};
export const SALES_URL='https://api.fleetyards.net/v1/models?q[onSaleEq]=true&perPage=100'; // 2.21.16: no sorts param (Fleetyards validates it against a fixed list); sorted here by lastUpdatedAt
const NEWS_MS=20*60*1000,SALES_MS=60*60*1000,RETRY_MS=5*60*1000,EVENT_WINDOW_MS=21*24*3600*1000,SAY_MAX=450;
const UA='Mozilla/5.0 (compatible; Voyager/2.31.0; +https://voyagercommand.com)';
const LIMITS={cycleSeconds:[5,120],newsCount:[1,8],shipsCount:[1,8],cooldownSeconds:[5,600]};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const num=(v,[min,max],label)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new Error(label+' must be '+min+' to '+max+'.');return Math.round(n);};

export function parseSales(json){
  const rows=Array.isArray(json)?json:Array.isArray(json?.items)?json.items:Array.isArray(json?.data)?json.data:[]; // Fleetyards wraps the list as {items, meta}
  return rows.map(m=>({name:clean(m.name,60),slug:clean(m.slug,80),maker:clean(m.manufacturer?.code||m.manufacturer?.shortName||m.manufacturer?.name||'',20),makerName:clean(m.manufacturer?.name||'',60),
      price:Number(m.pledgePrice)||0,priceLabel:clean(m.pledgePriceLabel||'',20),status:clean(m.productionStatus||'',30),url:clean(m.links?.storeUrl||'',300),image:clean(m.media?.storeImage?.smallUrl||m.media?.storeImage?.url||'',400),updated:Date.parse(m.lastUpdatedAt)||0}))
    .filter(s=>s.name&&s.price>0&&(!s.url||/^https:\/\/robertsspaceindustries\.com\//.test(s.url))).sort((a,b)=>b.updated-a.updated||a.name.localeCompare(b.name)).slice(0,60);
}
export function normalizeIntelSettings(raw={},base=INTEL_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},p={...base.panel,...(r.panel||{})},c={...base.commands,...(r.commands||{})};
  return {enabled:r.enabled===undefined?base.enabled:!!r.enabled,
    panel:{cycleSeconds:num(p.cycleSeconds,LIMITS.cycleSeconds,'Seconds per section'),news:!!p.news,sales:!!p.sales,deals:!!p.deals,events:!!p.events,newsCount:num(p.newsCount,LIMITS.newsCount,'News items'),shipsCount:num(p.shipsCount,LIMITS.shipsCount,'Ships shown')},
    commands:{enabled:!!c.enabled,cooldownSeconds:num(c.cooldownSeconds,LIMITS.cooldownSeconds,'Reply cooldown')},
    // Typed by the streamer when the sources have it wrong: "4.10.3" replaces the LIVE version shown, "5.0 Wave 1" the PTU one.
    releases:{live:clean((r.releases||base.releases)?.live,24),ptu:clean((r.releases||base.releases)?.ptu,24)}};
}
export function normalizeDeals(raw){
  if(raw!==undefined&&!Array.isArray(raw))throw new Error('Deals must be a list.');
  const out=[];
  for(const d of raw||[]){if(!d||typeof d!=='object')continue;const title=clean(d.title,80);if(!title)continue;
    const kind=DEAL_KINDS[d.kind]?d.kind:'note',url=clean(d.url,200);if(url&&!/^https?:\/\//i.test(url))throw new Error('"'+title+'": the link must start with http:// or https://.');
    let until='';if(d.until){const m=String(d.until).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m||!Number.isFinite(Date.parse(m[0])))throw new Error('"'+title+'": until must be a date (YYYY-MM-DD).');until=m[0];}
    out.push({id:/^[a-f0-9]{8}$/.test(String(d.id||''))?d.id:randomUUID().slice(0,8),kind,title,detail:clean(d.detail,160),url,until,enabled:d.enabled!==false});}
  if(out.length>20)throw new Error('Up to 20 deals and events.');
  return out;
}
const untilMs=until=>until?Date.parse(until+'T23:59:59'):Infinity; // local end of day
export const dealActive=(d,now=Date.now())=>d.enabled&&untilMs(d.until)>=now;
const short=(t,n)=>t.length>n?t.slice(0,n-1).trimEnd()+'…':t;
const when=(at,now)=>{if(!at)return '';const d=Math.floor((now-at)/86400000);return d<=0?'today':d===1?'yesterday':d<7?d+' days ago':d<30?Math.floor(d/7)+' wk ago':new Date(at).toLocaleDateString('en-AU',{day:'numeric',month:'short'});};
const money=p=>'$'+(Math.round(p)===p?p:p.toFixed(2));
const untilText=d=>d.until?' (until '+new Date(d.until+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'short'})+')':'';

export class Intel{
  // say(text,platform) posts to chat; fetchJson/fetchText are the network (injected in tests).
  constructor({dataDir,say=()=>{},now=Date.now,fetchJson=null,fetchText=null,postJson=null,log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'intel.json');this.cacheFile=join(dataDir,'intel-cache.json');this.say=say;this.now=now;this.log=log;
    this.fetchJson=fetchJson||(async url=>{const r=await fetch(url,{headers:{'user-agent':UA,accept:'application/json'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
    this.postJson=postJson||(async(url,body)=>{const r=await fetch(url,{method:'POST',headers:{'user-agent':UA,accept:'application/json','content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
    this.fetchText=fetchText||(async url=>{const r=await fetch(url,{headers:{'user-agent':UA,accept:'text/html, application/rss+xml, application/xml, text/xml'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('HTTP '+r.status);return r.text();});
    this.settings=normalizeIntelSettings({});this.deals=[];
    this.news={items:[],patches:[],versions:[],sources:{},at:0,ok:null,message:'Not fetched yet',source:'',tried:0};this.sales={items:[],at:0,ok:null,message:'Not fetched yet',source:'',tried:0};
    this.cooldowns=new Map();this.chatOut=[];this.busy={news:false,sales:false};this.saving=null;
  }
  async load(){
    try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeIntelSettings(raw.settings||{});this.deals=normalizeDeals(raw.deals||[]);}catch{}
    try{const c=JSON.parse(await readFile(this.cacheFile,'utf8'));
      if(Array.isArray(c.news?.items))this.news={...this.news,items:c.news.items.slice(0,20),patches:Array.isArray(c.news.patches)?c.news.patches.slice(0,10):[],versions:Array.isArray(c.news.versions)?c.news.versions.slice(0,30):[],at:Number(c.news.at)||0,ok:c.news.items.length?true:null,message:c.news.items.length?'From the last fetch':'Not fetched yet',source:c.news.source||''};
      if(Array.isArray(c.sales?.items))this.sales={...this.sales,items:c.sales.items.slice(0,60),at:Number(c.sales.at)||0,ok:c.sales.items.length?true:null,message:c.sales.items.length?'From the last fetch':'Not fetched yet',source:c.sales.source||''};
    }catch{}
    return this;
  }
  async persist(){await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,deals:this.deals},null,1));await rename(tmp,this.file);}
  async persistCache(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.cacheFile+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,news:{items:this.news.items,patches:this.news.patches,versions:this.news.versions,at:this.news.at,source:this.news.source},sales:{items:this.sales.items,at:this.sales.at,source:this.sales.source}}));await rename(tmp,this.cacheFile);}catch{}}
  configure(raw={}){this.settings=normalizeIntelSettings({...this.settings,...raw,panel:{...this.settings.panel,...(raw.panel||{})},commands:{...this.settings.commands,...(raw.commands||{})},releases:{...this.settings.releases,...(raw.releases||{})}});this.saving=this.persist().catch(()=>{});return this.view();}
  setDeals(raw){this.deals=normalizeDeals(raw);this.saving=this.persist().catch(()=>{});return this.view();}

  // Fetching. News: wiki API, then the RSI RSS. Ships: Fleetyards. A failure keeps the last good list and retries in 5 min.
  async refreshNews(force=false){
    const now=this.now(),n=this.news;if(this.busy.news)return n;if(!force&&now-n.at<NEWS_MS&&n.ok)return n;if(!force&&n.ok===false&&now-n.tried<RETRY_MS)return n;
    this.busy.news=true;n.tried=now;
    try{const g=await gather({fetchText:this.fetchText,fetchJson:this.fetchJson,postJson:this.postJson,now});
      for(const [k,v] of Object.entries(g.status))if(!v.ok)this.log('intel source '+k+': '+v.message);
      n.sources=g.status;
      // Patch notes and versions keep their last good list when their sources are down this time.
      if(g.patches.length)n.patches=g.patches;if(g.versions.length)n.versions=g.versions;
      if(!g.news.length)throw new Error('Neither RSI nor the Star Citizen Wiki API answered with news.');
      Object.assign(n,{items:g.news,at:now,ok:true,message:g.news.length+' Comm-Links · '+g.source,source:g.source});await this.persistCache();
    }catch(e){Object.assign(n,{ok:false,message:e.message||'failed'});}
    finally{this.busy.news=false;}
    return n;
  }
  async refreshSales(force=false){
    const now=this.now(),s=this.sales;if(this.busy.sales)return s;if(!force&&now-s.at<SALES_MS&&s.ok)return s;if(!force&&s.ok===false&&now-s.tried<RETRY_MS)return s;
    this.busy.sales=true;s.tried=now;
    try{const items=parseSales(await this.fetchJson(SALES_URL));if(!items.length)throw new Error('Fleetyards listed no ships in the store (API change?).');
      Object.assign(s,{items,at:now,ok:true,message:items.length+' ships in the store · fleetyards.net',source:'fleetyards.net'});await this.persistCache();
    }catch(e){Object.assign(s,{ok:false,message:e.message||'failed'});this.log('ships: '+(e.message||'failed'));}
    finally{this.busy.sales=false;}
    return s;
  }
  async tick(){if(!this.settings.enabled)return;await Promise.all([this.refreshNews(),this.refreshSales()]);}
  async refresh(){await Promise.all([this.refreshNews(true),this.refreshSales(true)]);return this.view();}

  releases(now=this.now()){return buildReleases({patches:this.news.patches,versions:this.news.versions,manual:this.settings.releases,now});}
  spotlights(now=this.now()){return spotlights({news:this.news.items,own:this.activeDeals(now).filter(d=>d.kind==='event'||d.kind==='freefly'),now});}
  // What the panel and chat show.
  activeDeals(now=this.now()){return this.deals.filter(d=>dealActive(d,now));}
  events(now=this.now()){
    const own=this.activeDeals(now).filter(d=>d.kind==='event'||d.kind==='freefly').map(d=>({kind:d.kind,title:d.title,detail:d.detail,url:d.url,until:d.until,at:0}));
    const auto=this.news.items.filter(n=>(n.tag==='event'||n.tag==='freefly')&&now-n.at<EVENT_WINDOW_MS).map(n=>({kind:n.tag,title:n.title,detail:'Comm-Link · '+when(n.at,now),url:n.url,until:'',at:n.at}));
    return [...own,...auto].slice(0,8);
  }
  reply(kind,now=this.now()){
    const p=this.settings.panel;
    if(kind==='intel')return '🛰 SC Intel — '+INTEL_COMMANDS.filter(c=>c.kind!=='intel').map(c=>c.word+' '+({news:'latest Comm-Links',sales:'ships in the pledge store',deals:'CCU & warbond deals',events:'events & Free Fly',patch:'game version & patch notes'})[c.kind]).join(' · ');
    if(kind==='patch'){const rel=this.releases(now),notes=this.news.patches;if(!rel.length&&!notes.length)return '🛠 Patch notes not loaded yet — try again in a minute. robertsspaceindustries.com/patch-notes';
      const one=r=>r.channel+' Alpha '+r.version+(r.audience?' ('+r.audience+')':'')+(r.at?' · '+when(r.at,now):'');const link=(rel.find(r=>r.channel==='LIVE'&&r.url)||notes.find(p=>p.channel==='LIVE')||notes[0])?.url||'robertsspaceindustries.com/patch-notes';
      return '🛠 Star Citizen: '+(rel.length?rel.map(one).join(' · '):short(notes[0].title,80))+' — notes: '+link.replace(/^https:\/\//,'');}
    if(kind==='news'){const it=this.news.items.slice(0,3);if(!it.length)return '📰 No Star Citizen news loaded yet — try again in a minute. robertsspaceindustries.com/comm-link';
      return '📰 Star Citizen news: '+it.map((n,i)=>(i+1)+'. '+short(n.title,70)+' ('+when(n.at,now)+')').join(' · ')+' — more: robertsspaceindustries.com/comm-link';}
    if(kind==='sales'){const it=this.sales.items;if(!it.length)return '🛒 Ship list not loaded yet — try again in a minute. robertsspaceindustries.com/pledge/ships';
      const top=it.slice(0,Math.max(3,p.shipsCount));return '🛒 In the pledge store now ('+it.length+' ships, newest first): '+top.map(s=>s.name+' '+money(s.price)).join(', ')+(it.length>top.length?' +'+(it.length-top.length)+' more':'')+' — robertsspaceindustries.com/pledge/ships';}
    if(kind==='deals'){const it=this.activeDeals(now).filter(d=>d.kind==='ccu'||d.kind==='sale'||d.kind==='note');if(!it.length)return '💸 No CCU, warbond or ship deals listed right now — the next sale will be here. !sales shows what is in the store.';
      return '💸 Deals: '+it.slice(0,4).map(d=>d.title+(d.detail?' — '+short(d.detail,60):'')+untilText(d)).join(' · ')+(it.length>4?' +'+(it.length-4)+' more':'');}
    if(kind==='events'){const it=this.events(now);if(!it.length)return '📅 Nothing on the Star Citizen events calendar right now. !news has the latest Comm-Links.';
      return '📅 Events: '+it.slice(0,4).map(e=>(e.kind==='freefly'?'FREE FLY · ':'')+short(e.title,60)+(e.until?untilText(e):e.detail&&!e.at?' — '+short(e.detail,50):'')).join(' · ')+(it.length>4?' +'+(it.length-4)+' more':'');}
    return '';
  }
  // A chat line. Returns {ok,kind,text} when it answered, {ok:false,ignored:true} when it was not a command or is cooling down.
  chat(chat){
    const text=clean(chat?.text,200),word=text.toLowerCase().split(' ')[0];if(!word.startsWith('!'))return {ok:false,ignored:true};
    const cmd=INTEL_COMMANDS.find(c=>c.word===word||c.also.includes(word));if(!cmd)return {ok:false,ignored:true};
    if(!this.settings.enabled||!this.settings.commands.enabled)return {ok:false,ignored:true,message:'SC Intel commands are off'};
    const now=this.now(),last=this.cooldowns.get(cmd.kind)||0;if(now-last<this.settings.commands.cooldownSeconds*1000)return {ok:false,ignored:true,message:'cooling down'};
    this.cooldowns.set(cmd.kind,now);
    const reply=this.reply(cmd.kind,now).slice(0,SAY_MAX),platform=['twitch','kick','youtube'].includes(chat?.platform)?chat.platform:'';
    const entry={at:now,kind:cmd.kind,word,by:clean(chat?.name||chat?.login,40),platform,text:reply,ok:null,message:'sending'};this.chatOut.unshift(entry);this.chatOut=this.chatOut.slice(0,12);
    Promise.resolve().then(()=>this.say(reply,platform)).then(r=>{entry.ok=r?.ok!==false;entry.message=r?.message||(entry.ok?'sent':'failed');}).catch(e=>{entry.ok=false;entry.message=e?.message||'failed';});
    return {ok:true,kind:cmd.kind,text:reply};
  }
  panel(){const now=this.now(),p=this.settings.panel;
    return {serverAt:now,enabled:this.settings.enabled,panel:p,commands:INTEL_COMMANDS.map(c=>c.word),
      news:this.news.items.slice(0,p.newsCount).map(n=>({title:n.title,at:n.at,tag:n.tag,label:TAG_LABELS[n.tag]||'NEWS',when:when(n.at,now),image:n.image})),
      sales:this.sales.items.slice(0,p.shipsCount).map(s=>({name:s.name,maker:s.maker,price:s.price,priceLabel:s.priceLabel||money(s.price),status:s.status,image:s.image,updated:s.updated})),salesTotal:this.sales.items.length,
      deals:this.activeDeals(now).filter(d=>d.kind!=='event'&&d.kind!=='freefly').map(d=>({kind:d.kind,label:DEAL_KINDS[d.kind],title:d.title,detail:d.detail,until:d.until})),
      events:this.events(now).map(e=>({kind:e.kind,label:e.kind==='freefly'?'FREE FLY':'EVENT',title:e.title,detail:e.detail,until:e.until})),
      status:{news:{ok:this.news.ok,at:this.news.at},sales:{ok:this.sales.ok,at:this.sales.at}}};}
  // 2.21.15: what the public website gets (Public website › SC Intel switch): more rows than the panel, same public-only data.
  share(){const now=this.now();if(!this.settings.enabled)return null;
    return {at:Math.max(this.news.at,this.sales.at),commands:INTEL_COMMANDS.map(c=>c.word),
      news:this.news.items.slice(0,12).map(n=>({title:n.title,url:n.url,at:n.at,tag:n.tag})),
      sales:this.sales.items.slice(0,10).map(s=>({name:s.name,maker:s.maker,price:s.price,status:s.status,url:s.url,image:s.image})),salesTotal:this.sales.items.length,
      deals:this.activeDeals(now).filter(d=>d.kind!=='event'&&d.kind!=='freefly').map(d=>({kind:d.kind,title:d.title,detail:d.detail,url:d.url,until:d.until})),
      events:this.events(now).map(e=>({kind:e.kind,title:e.title,detail:e.detail,url:e.url,until:e.until})),
      releases:this.releases(now).map(({source,...r})=>r),patches:this.news.patches.slice(0,8).map(p=>({title:p.title,url:p.url,at:p.at,version:p.version,channel:p.channel,audience:p.audience})),
      spotlights:this.spotlights(now)};}
  view(){const now=this.now();return {settings:this.settings,deals:this.deals.map(d=>({...d,active:dealActive(d,now)})),commands:INTEL_COMMANDS,
      news:{ok:this.news.ok,at:this.news.at,message:this.news.message,source:this.news.source,items:this.news.items.slice(0,12).map(n=>({...n,label:TAG_LABELS[n.tag]||'NEWS',when:when(n.at,now)})),
        sources:Object.entries(this.news.sources||{}).map(([k,v])=>({key:k,label:SOURCE_LABELS[k]||k,ok:!!v.ok,count:v.count||0,message:v.message||''}))},
      releases:this.releases(now),patches:this.news.patches.slice(0,8).map(p=>({...p,when:when(p.at,now)})),spotlights:this.spotlights(now),
      sales:{ok:this.sales.ok,at:this.sales.at,message:this.sales.message,source:this.sales.source,count:this.sales.items.length,items:this.sales.items.slice(0,12)},
      chatOut:this.chatOut,preview:Object.fromEntries(['news','patch','sales','deals','events','intel'].map(k=>[k,this.reply(k,now)]))};}
}
