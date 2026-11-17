/* Voyager SC Intel sources (2.31.0): where the Star Citizen news, patch notes, game versions and events come from.
   Pure functions and one gather() — no Node APIs — so the same code runs in the host on the streamer's PC and in the
   website's Cloudflare Worker (which refreshes on its own a few times a day, so the website stays current between streams).

   Why several sources: the Star Citizen Wiki API's Comm-Link list runs days to weeks behind RSI and skips some posts
   (patch notes among them), and its created_at is the import time, not the publish time. So RSI's own Comm-Link pages are
   read first, and everything is merged by Comm-Link number (RSI numbers them in publishing order):
     1. RSI Comm-Link page (robertsspaceindustries.com/en/comm-link)        news, newest first
     2. RSI Patch Notes page (…/en/patch-notes)                              LIVE patch notes
     3. Spectrum "Patch Notes" forum (channel 190048)                        PTU / EPTU / LIVE notes with build numbers
     4. Star Citizen Wiki API /api/comm-links and /api/game-versions         back-fill and the current game builds
     5. RSI Comm-Link RSS                                                    only if the Comm-Link page did not answer
   Each source reports its own status; one failing never empties the lists. */

const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const RSI='https://robertsspaceindustries.com';
export const NEWS_URL='https://api.star-citizen.wiki/api/comm-links?page[size]=15';
export const NEWS_RSS=RSI+'/comm-link/rss';
export const RSI_COMMLINK_URL=RSI+'/en/comm-link';
export const RSI_PATCH_URL=RSI+'/en/patch-notes';
export const VERSIONS_URL='https://api.star-citizen.wiki/api/game-versions?page[size]=30';
export const SPECTRUM_URL=RSI+'/api/spectrum/forum/channel/threads';
export const SPECTRUM_PATCH_CHANNEL='190048';
export const SPECTRUM_THREAD=RSI+'/spectrum/community/SC/forum/'+SPECTRUM_PATCH_CHANNEL+'/thread/';
export const SOURCE_LABELS={rsi:'RSI Comm-Links',notes:'RSI patch notes',spectrum:'Spectrum patch notes',wiki:'Star Citizen Wiki API',versions:'Game versions (Wiki API)',rss:'RSI Comm-Link RSS'};

// What a Comm-Link is about, from its title (and channel). Used for the chips and to pull events into !events.
export function tagNews(title='',channel=''){
  const t=String(title).toLowerCase(),c=String(channel).toLowerCase();
  if(/patch[ -]?notes/.test(c))return 'patch';
  if(/free[ -]?fly/.test(t))return 'freefly';
  if(/warbond|\bccu\b|cross[ -]chassis|upgrade/.test(t))return 'ccu';
  if(/\bon sale\b|\bsale\b|\bsales\b|pledge|\bdeal\b|concept/.test(t))return 'sale';
  if(/invictus|\biae\b|intergalactic aerospace|citizencon|luminalia|alien week|ship showdown|day of vara|stella fortuna|coramor|pirate week|red festival|foundation festival|\bevent\b|anniversary/.test(t))return 'event';
  if(/\bpatch\b|\balpha\s*\d|\b\d\.\d+(\.\d+)?\b|patch notes|roadmap|\bptu\b|\blive\b.*release/.test(t))return 'patch';
  if(/this week in|inside star citizen|star citizen live|calling all devs|roadmap roundup|jump point|galactic tour|loremakers/.test(t))return 'show';
  if(/spectrum dispatch|portfolio|galactapedia|lore/.test(c))return 'lore';
  return 'news';
}
export const TAG_LABELS={freefly:'FREE FLY',ccu:'UPGRADES',sale:'SALE',event:'EVENT',patch:'PATCH',show:'SHOW',lore:'LORE',news:'NEWS'};

// ---------- parsers ----------
export function parseNewsApi(json){
  const rows=Array.isArray(json?.data)?json.data:[];
  return rows.map(d=>({id:Number(d.id)||0,title:clean(d.title,140),url:clean(d.rsi_url||'',300),at:Date.parse(d.created_at)||0,channel:clean(d.channel||'',40),image:clean(d.images?.[0]?.rsi_url||'',300)}))
    .filter(n=>n.title&&n.url.startsWith(RSI+'/')).map(n=>({...n,tag:tagNews(n.title,n.channel)})).sort((a,b)=>b.at-a.at||b.id-a.id).slice(0,15);
}
const entities=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#0?39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(m,n)=>{try{return String.fromCodePoint(Number(n));}catch{return ' ';}});
export function parseNewsRss(xml){
  const out=[];const items=String(xml||'').split(/<item[\s>]/).slice(1);
  const field=(s,tag)=>{const m=s.match(new RegExp('<'+tag+'[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</'+tag+'>','i'));return m?entities(m[1]).trim():'';};
  for(const it of items){const url=clean(field(it,'link'),300),title=clean(field(it,'title'),140);if(!title||!url.startsWith(RSI+'/'))continue;
    out.push({id:Number((url.match(/\/(\d+)-/)||[])[1])||0,title,url,at:Date.parse(field(it,'pubDate'))||0,channel:clean(field(it,'category'),40),image:'',tag:tagNews(title,field(it,'category'))});}
  return out.sort((a,b)=>b.at-a.at||b.id-a.id).slice(0,15);
}
const UNIT={minute:60000,hour:3600000,day:86400000,week:7*86400000,month:30*86400000,year:365*86400000};
const text=html=>clean(entities(String(html).replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')),600);
// RSI's Comm-Link and Patch Notes pages: every entry is a link to /comm-link/<channel>/<number>-<slug> holding a type word,
// the title, a comment count and "Posted: <time>" (a timestamp in UTC, or "5 days ago"). Read loosely so a restyle does not break it.
export function parseRsiHtml(html,now=Date.now()){
  const out=[],seen=new Set(),re=/<a\b[^>]*\bhref="(?:https:\/\/robertsspaceindustries\.com)?\/(?:[a-z]{2}\/)?comm-link\/([A-Za-z][A-Za-z-]{1,30})\/(\d{4,6})-([^"?#\s]{0,160})"[^>]*>([\s\S]*?)<\/a>/g;
  for(let m;(m=re.exec(String(html||'')));){
    const id=Number(m[2]);if(seen.has(id))continue;
    const flat=text(m[4]);let title='';
    const t=m[4].match(/class="(?:[^"]*\s)?title(?:\s[^"]*)?"[^>]*>([\s\S]*?)<\/(?:div|span|h\d|p)>/i);if(t)title=text(t[1]);
    if(!title){const f=flat.match(/^(?:(?:post|video|patchnotes|slideshow|audio|pdf|image)\s+)?(.*?)(?:\s+\d+)?\s+Posted:/i);title=f?f[1]:'';}
    title=clean(title,140);if(!title||/^(read more|view|more)$/i.test(title))continue; // an image or "read more" link for the same post: wait for the titled one
    seen.add(id);
    let at=0,approx=false;const abs=flat.match(/(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/),rel=flat.match(/\b(\d+|an?)\s+(minute|hour|day|week|month|year)s?\s+ago\b/i);
    if(abs)at=Date.parse(abs[1]+'T'+abs[2]+(abs[2].length===5?':00':'')+'Z')||0;
    else if(rel){at=now-(/^an?$/i.test(rel[1])?1:Number(rel[1]))*UNIT[rel[2].toLowerCase()];approx=true;}
    else if(/\bjust now\b|\bmoments? ago\b/i.test(flat)){at=now;approx=true;}
    const channel=clean(m[1].replace(/-/g,' ').replace(/\b[a-z]/g,c=>c.toUpperCase()),40);
    out.push({id,title,url:RSI+'/comm-link/'+m[1]+'/'+m[2]+'-'+m[3],at,approx,channel,image:'',tag:tagNews(title,channel)});
  }
  return out.sort((a,b)=>b.id-a.id).slice(0,40);
}
// "[Wave 1] Star Citizen Alpha 5.0 PTU Patch Notes 13201184" → {version:'5.0',channel:'PTU',build:'13201184',audience:'Wave 1'}
export function parsePatchTitle(title,fallback=''){
  const t=String(title||''),v=t.match(/\bAlpha\s+(?:Patch\s+)?(\d+\.\d+(?:\.\d+)?[a-z]?)/i);if(!v)return null;
  const channel=/\bEPTU\b/i.test(t)?'EPTU':/\bPTU\b/i.test(t)?'PTU':/\bLIVE\b/i.test(t)?'LIVE':/tech[- ]preview/i.test(t)?'TECH':fallback;
  return {version:v[1],channel,build:(t.replace(v[0],' ').match(/\b(\d{7,9})\b/)||[])[1]||'',audience:clean((t.match(/^\s*\[([^\]]{2,30})\]/)||[])[1]||'',30)};
}
// Spectrum's forum list: {data:{threads:[{subject,slug,time_created(seconds)…}]}}
export function parseSpectrumThreads(json){
  const rows=Array.isArray(json?.data?.threads)?json.data.threads:Array.isArray(json?.threads)?json.threads:[];
  const out=[];
  for(const r of rows){const title=clean(r?.subject||r?.title,140),slug=clean(r?.slug,160),p=parsePatchTitle(title);if(!p||!p.channel||!/^[a-z0-9-]+$/i.test(slug))continue;
    const sec=Number(r.time_created||r.time_modified)||0;out.push({title,url:SPECTRUM_THREAD+slug,at:sec>1e12?sec:sec*1000,approx:false,source:'spectrum',...p});}
  return out.sort((a,b)=>b.at-a.at).slice(0,30);
}
// Wiki API game versions: {data:[{code:'4.10.3-LIVE.13165946',channel:'live',released_at…}]}
export function parseGameVersions(json){
  const rows=Array.isArray(json?.data)?json.data:[];const out=[];
  for(const r of rows){const m=String(r?.code||'').match(/^(\d+\.\d+(?:\.\d+)?)-([A-Za-z]+)\.(\d{6,9})$/);if(!m)continue;const ch=m[2].toUpperCase();if(!['LIVE','PTU','EPTU'].includes(ch))continue;
    out.push({version:m[1],channel:ch,build:m[3],at:Date.parse(r.released_at||r.release_date||r.created_at||'')||0,code:clean(r.code,40)});}
  return out;
}

// ---------- merging ----------
// Comm-Links from several lists, one row per Comm-Link number, newest number first. Earlier lists win (RSI before the wiki).
export function mergeNews(lists,limit=20){
  const by=new Map(),loose=[];
  for(const list of lists)for(const n of list||[]){if(!n||!n.title||!n.url)continue;if(!n.id){if(!loose.some(x=>x.url===n.url))loose.push(n);continue;}
    const have=by.get(n.id);if(!have)by.set(n.id,{...n});else{if(!have.image&&n.image)have.image=n.image;if((!have.at||have.approx)&&n.at&&!n.approx&&Math.abs(n.at-have.at)<3*86400000){have.at=n.at;have.approx=false;}}}
  const rows=[...by.values()].sort((a,b)=>b.id-a.id);
  for(const n of loose){const i=rows.findIndex(r=>(r.at||0)<(n.at||0));rows.splice(i<0?rows.length:i,0,n);}
  return rows.slice(0,limit).map(({approx,...n})=>n);
}
export const versionParts=v=>String(v||'').split('.').map(x=>parseInt(x,10)||0).concat(0,0,0).slice(0,3);
export const cmpVersion=(a,b)=>{const x=versionParts(a),y=versionParts(b);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2];};
const sameVersion=(a,b)=>cmpVersion(a,b)===0;
// Patch notes, newest first: LIVE notes from RSI's Patch Notes page plus Spectrum threads (PTU waves, LIVE release notes).
export function buildPatches({notes=[],threads=[]}={},limit=10){
  const rows=[];
  for(const n of notes){const p=parsePatchTitle(n.title,'LIVE');if(!p)continue;rows.push({title:n.title,url:n.url,at:n.at||0,id:n.id||0,version:p.version,channel:p.channel||'LIVE',build:p.build,audience:p.audience,source:'rsi'});}
  for(const t of threads){if(t.channel==='LIVE'&&rows.some(r=>r.channel==='LIVE'&&sameVersion(r.version,t.version)))continue;rows.push({title:t.title,url:t.url,at:t.at||0,id:0,version:t.version,channel:t.channel,build:t.build,audience:t.audience,source:'spectrum'});}
  return rows.sort((a,b)=>(b.at||0)-(a.at||0)||cmpVersion(b.version,a.version)).slice(0,limit);
}
// What is playable right now: the newest LIVE build, and a PTU / EPTU build when one is newer than LIVE (and recent).
export function buildReleases({patches=[],versions=[],manual={},now=Date.now()}={}){
  const best={};
  const offer=(c,src)=>{if(!['LIVE','PTU','EPTU'].includes(c.channel))return;const cur=best[c.channel];
    const newer=!cur||cmpVersion(c.version,cur.version)>0||(sameVersion(c.version,cur.version)&&(Number(c.build)||0)>(Number(cur.build)||0));
    if(newer){const same=cur&&sameVersion(c.version,cur.version);best[c.channel]={channel:c.channel,version:c.version,build:c.build||'',audience:c.audience||(same?cur.audience:''),at:c.at||(same?cur.at:0),url:c.url||(same?cur.url:''),source:src};}
    else if(sameVersion(c.version,cur.version)){if(!cur.url&&c.url)cur.url=c.url;if(!cur.at&&c.at)cur.at=c.at;if(!cur.build&&c.build)cur.build=c.build;}};
  for(const p of patches)offer(p,p.source);for(const v of versions)offer(v,'versions');
  const live=best.LIVE,out=[];
  const man=(k,ch)=>{const t=clean(manual?.[k],24).replace(/^alpha\s+/i,'');if(t)best[ch]={channel:ch,version:t,build:'',audience:'',at:0,url:best[ch]&&sameVersion(best[ch].version,t)?best[ch].url:'',source:'manual'};};
  man('live','LIVE');man('ptu','PTU');
  if(best.LIVE)out.push(best.LIVE);
  for(const ch of ['PTU','EPTU']){const c=best[ch];if(!c)continue;if(c.source==='manual'){out.push(c);continue;}
    const ahead=!best.LIVE||cmpVersion(c.version,best.LIVE.version)>0||(sameVersion(c.version,best.LIVE.version)&&c.at>(live?.at||0));
    if(ahead&&(!c.at||now-c.at<45*86400000))out.push(c);}
  return out;
}

// ---------- events ----------
// The recurring Star Citizen events, recognised in Comm-Link titles.
export const EVENT_CATALOGUE=[
  {key:'iae',name:'Intergalactic Aerospace Expo',short:'IAE',re:/\biae\b|intergalactic aerospace/i,blurb:'The biggest ship show of the year: a different manufacturer on the show floor each day, ships to test fly and new reveals.'},
  {key:'invictus',name:'Invictus Launch Week',short:'Invictus',re:/invictus/i,blurb:'The UEE Navy opens its doors: military ships on show, fleet fly-bys and free test flights.'},
  {key:'citizencon',name:'CitizenCon',short:'CitizenCon',re:/citizencon/i,blurb:'The yearly Star Citizen convention: keynotes, panels and what is coming next.'},
  {key:'luminalia',name:'Luminalia',short:'Luminalia',re:/luminalia/i,blurb:'The Banu festival of light: daily gifts and seasonal items.'},
  {key:'pirateweek',name:'Pirate Week',short:'Pirate Week',re:/pirate week/i,blurb:'A week for outlaws: pirate-themed ships, paints and missions.'},
  {key:'alienweek',name:'Alien Week',short:'Alien Week',re:/alien week/i,blurb:'Banu, Xi\'an, Tevarin and Vanduul ships in the spotlight.'},
  {key:'showdown',name:'Ship Showdown',short:'Ship Showdown',re:/ship showdown/i,blurb:'The community votes for its favourite ship, round by round.'},
  {key:'vara',name:'Day of the Vara',short:'Day of the Vara',re:/day of (the )?vara/i,blurb:'Star Citizen\'s Halloween: masks, pumpkins and tricks.'},
  {key:'stella',name:'Stella Fortuna',short:'Stella Fortuna',re:/stella fortuna/i,blurb:'A day for luck and green paint.'},
  {key:'coramor',name:'Coramor',short:'Coramor',re:/coramor/i,blurb:'The \'verse\'s festival of love, in pink.'},
  {key:'redfestival',name:'Red Festival',short:'Red Festival',re:/red festival|lunar new year/i,blurb:'New year in the \'verse: red envelopes and festive paints.'},
  {key:'foundation',name:'Foundation Festival',short:'Foundation Festival',re:/foundation festival/i,blurb:'Citizens helping citizens: a welcome for new players.'},
  {key:'freefly',name:'Free Fly',short:'Free Fly',re:/free[ -]?fly/i,blurb:'Star Citizen is free to play for a limited time.'}];
const H=3600000,utc=(y,m,d,h=16)=>Date.UTC(y,m-1,d,h);
const day=(label,y,m,d,note='')=>({label,note,start:utc(y,m,d),end:utc(y,m,d+1)});
// Events with known dates. IAE 2956 from RSI's "Free Fly and Manufacturer Schedule" (Comm-Link 21386): each hall day runs 16:00 UTC to 16:00 UTC.
export const EVENT_CALENDAR=[
  {id:'iae2956',key:'iae',name:'Intergalactic Aerospace Expo 2956',start:utc(2026,11,13),end:utc(2026,11,27,20),location:'Tobin Expo Center · New Babbage, microTech',freefly:true,
    url:RSI+'/en/comm-link/transmission/21386-Intergalactic-Aerospace-Expo-2956-Free-Fly-And-Manufacturer-Schedule',
    blurb:'Star Citizen is free to play for the whole expo. A different manufacturer takes the show floor each day; test fly their ships from the rental kiosks.',
    days:[day('Roberts Space Industries',2026,11,13),day('Origin Jumpworks',2026,11,14),day('Anvil Aerospace',2026,11,15),day('Crusader Industries · Tumbril',2026,11,16),day('Drake Interplanetary',2026,11,17),
      day('Argo · Consolidated Outland · Greycat · Grey\'s Market',2026,11,18),day('MISC · Mirai · Kruger',2026,11,19),day('Aegis Dynamics',2026,11,20),day('Aopoa · Banu · Esperia · Gatac',2026,11,21),
      day('Best in Show',2026,11,22,'The four Ship Showdown finalists'),{label:'Finale',note:'Every ship from the show returns to the kiosks',start:utc(2026,11,23),end:utc(2026,11,27,20)}]}];
const SOON_MS=4*86400000,AUTO_MS=10*86400000,RELATED_MS=30*86400000;
// The event sections: calendar events that are on (or start within four days), then events that are only "in the news"
// (a recent Comm-Link names them), then the streamer's own event rows.
export function spotlights({news=[],own=[],now=Date.now(),calendar=EVENT_CALENDAR}={}){
  const out=[],used=new Set();
  const related=cat=>news.filter(n=>cat.re.test(n.title)&&(!n.at||now-n.at<RELATED_MS)).slice(0,4).map(n=>({title:n.title,url:n.url,at:n.at||0}));
  for(const c of calendar){if(now>=c.end||now<c.start-SOON_MS)continue;const cat=EVENT_CATALOGUE.find(e=>e.key===c.key);used.add(c.key);if(c.freefly)used.add('freefly');
    out.push({id:c.id,key:c.key,name:c.name,status:now>=c.start?'live':'soon',start:c.start,end:c.end,location:c.location||'',freefly:!!c.freefly,url:c.url||'',blurb:c.blurb||cat?.blurb||'',days:(c.days||[]).map(d=>({...d})),news:cat?related(cat):[]});}
  for(const cat of EVENT_CATALOGUE){if(used.has(cat.key))continue;const hits=news.filter(n=>cat.re.test(n.title)&&n.at&&now-n.at<AUTO_MS);if(!hits.length)continue;
    out.push({id:'news-'+cat.key,key:cat.key,name:cat.name,status:'news',start:0,end:0,location:'',freefly:cat.key==='freefly',url:hits[0].url,blurb:cat.blurb,days:[],news:related(cat)});}
  for(const d of own){const cat=EVENT_CATALOGUE.find(e=>e.re.test(d.title));if(cat&&out.some(s=>s.key===cat.key&&s.status!=='news'))continue; // already has its own section
    out.push({id:'own-'+d.id,key:cat?.key||'own',name:d.title,status:'live',start:0,end:d.until?Date.parse(d.until+'T23:59:59Z')||0:0,location:'',freefly:d.kind==='freefly',url:d.url||'',blurb:d.detail||cat?.blurb||'',days:[],news:cat?related(cat):[]});}
  return out.slice(0,4);
}

// ---------- fetching everything ----------
// fetchText(url) → string, fetchJson(url) → object, postJson(url,body) → object. Returns the merged lists and a status per source.
export async function gather({fetchText,fetchJson,postJson,now=Date.now()}={}){
  const status={};
  const run=async(key,fn)=>{try{const v=await fn();if(!v.length)throw new Error('answered with nothing to read');status[key]={ok:true,count:v.length};return v;}catch(e){status[key]={ok:false,count:0,message:clean(e?.message||e||'failed',120)};return [];}};
  const [rsi,notes,threads,wiki,versions]=await Promise.all([
    run('rsi',async()=>parseRsiHtml(await fetchText(RSI_COMMLINK_URL),now)),
    run('notes',async()=>parseRsiHtml(await fetchText(RSI_PATCH_URL),now).filter(n=>/patch/i.test(n.channel))),
    run('spectrum',async()=>parseSpectrumThreads(await postJson(SPECTRUM_URL,{channel_id:SPECTRUM_PATCH_CHANNEL,page:1,sort:'newest',label_id:null}))),
    run('wiki',async()=>parseNewsApi(await fetchJson(NEWS_URL))),
    run('versions',async()=>parseGameVersions(await fetchJson(VERSIONS_URL)))]);
  const rss=rsi.length?[]:await run('rss',async()=>parseNewsRss(await fetchText(NEWS_RSS)));
  const recentNotes=notes.filter(n=>n.at&&now-n.at<45*86400000);
  const news=mergeNews([rsi,rss,recentNotes,wiki]);
  return {news,patches:buildPatches({notes,threads}),versions,status,newsOk:news.length>0,
    source:[rsi.length&&'robertsspaceindustries.com',rss.length&&'RSI Comm-Link RSS',wiki.length&&'api.star-citizen.wiki'].filter(Boolean).join(' + ')};
}
