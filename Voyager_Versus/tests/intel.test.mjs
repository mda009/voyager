import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {parseRsiHtml,parsePatchTitle,parseSpectrumThreads,parseGameVersions,mergeNews,buildPatches,buildReleases,spotlights,gather,cmpVersion,RSI_COMMLINK_URL,RSI_PATCH_URL,VERSIONS_URL,SPECTRUM_URL,EVENT_CALENDAR} from '../local/intel-sources.mjs';
import {projectCompanion} from '../../public-feed-model.mjs';
import {intelTick,intelApi} from '../../site/worker.mjs';
import {Intel,tagNews,parseNewsApi,parseNewsRss,parseSales,normalizeDeals,normalizeIntelSettings,NEWS_URL,SALES_URL,NEWS_RSS} from '../local/intel.mjs';

const DAY=86400000,T0=Date.UTC(2026,10,14,0,0,0);
const wiki={data:[
  {id:20992,title:'Star Citizen Alpha 4.4.0 Patch Notes',rsi_url:'https://robertsspaceindustries.com/en/comm-link/transmission/20992-Star-Citizen-Alpha-440',channel:'Transmission',created_at:new Date(T0-DAY).toISOString(),images:[{rsi_url:'https://robertsspaceindustries.com/media/x.jpg'}]},
  {id:20991,title:'This Week in Star Citizen',rsi_url:'https://robertsspaceindustries.com/en/comm-link/citizens/20991-This-Week-In-Star-Citizen',channel:'Citizens',created_at:new Date(T0-2*DAY).toISOString(),images:[]},
  {id:20985,title:'Intergalactic Aerospace Expo 2956 — Free Fly Begins',rsi_url:'https://robertsspaceindustries.com/en/comm-link/transmission/20985-IAE',channel:'Transmission',created_at:new Date(T0-3*DAY).toISOString(),images:[]},
  {id:20980,title:'Warbond CCU Weekend',rsi_url:'https://robertsspaceindustries.com/en/comm-link/transmission/20980-Warbond',channel:'Transmission',created_at:new Date(T0-40*DAY).toISOString(),images:[]},
  {id:1,title:'Evil',rsi_url:'https://example.com/phish',channel:'Transmission',created_at:new Date(T0).toISOString(),images:[]}]};
const fy=[
  {name:'Polaris',slug:'polaris',manufacturer:{name:'Roberts Space Industries',code:'RSI'},pledgePrice:825,pledgePriceLabel:'$825.00',productionStatus:'flight-ready',links:{storeUrl:'https://robertsspaceindustries.com/pledge/ships/rsi-polaris/Polaris'},media:{storeImage:{smallUrl:'https://fleetyards.net/polaris.jpg'}},lastUpdatedAt:new Date(T0-DAY).toISOString()},
  {name:'Carrack',slug:'carrack',manufacturer:{name:'Anvil Aerospace',code:'ANVL'},pledgePrice:600,pledgePriceLabel:'$600.00',productionStatus:'flight-ready',links:{storeUrl:'https://robertsspaceindustries.com/pledge/ships/anvil-carrack/Carrack'},media:{},lastUpdatedAt:new Date(T0-9*DAY).toISOString()},
  {name:'Ghost',slug:'ghost',manufacturer:{name:'X'},pledgePrice:0,links:{},media:{},lastUpdatedAt:new Date(T0).toISOString()}];
const rss='<rss><channel><item><title><![CDATA[Star Citizen Live: Ships & Vehicles]]></title><link>https://robertsspaceindustries.com/comm-link/transmission/20995-Live</link><pubDate>'+new Date(T0).toUTCString()+'</pubDate><category>Transmission</category></item><item><title>Bad</title><link>https://evil.example/x</link></item></channel></rss>';

async function make(opts={}){const dir=await mkdtemp(join(tmpdir(),'voyager-intel-'));let now=T0+3600000;const said=[];
  const fetchJson=opts.fetchJson||(async url=>{if(url===NEWS_URL)return wiki;if(url===SALES_URL)return fy;throw new Error('404 '+url);});
  const fetchText=opts.fetchText||(async()=>{throw new Error('404');}); // RSI pages and RSS down by default: the wiki list alone
  const postJson=opts.postJson||(async()=>{throw new Error('404');});
  const i=await new Intel({dataDir:dir,now:()=>now,say:(t,p)=>{said.push([t,p]);return {ok:true,message:'sent'};},fetchJson,fetchText,postJson}).load();
  return {i,dir,said,at:ms=>{now+=ms;},now:()=>now};}

test('tags Comm-Links from their titles',()=>{
  assert.equal(tagNews('Star Citizen Alpha 4.4.0 Patch Notes'),'patch');assert.equal(tagNews('Intergalactic Aerospace Expo 2956 — Free Fly Begins'),'freefly');
  assert.equal(tagNews('Warbond CCU Weekend'),'ccu');assert.equal(tagNews('Luminalia 2956'),'event');assert.equal(tagNews('This Week in Star Citizen'),'show');
  assert.equal(tagNews('Anvil Paladin Concept Sale'),'sale');assert.equal(tagNews('Portfolio: Crusader Industries','Spectrum Dispatch'),'lore');assert.equal(tagNews('Monthly Report'),'news');
});

test('parsers keep only RSI links, newest first; Fleetyards ships need a price',()=>{
  const n=parseNewsApi(wiki);assert.equal(n.length,4,'phishing row dropped');assert.equal(n[0].id,20992);assert.equal(n[0].tag,'patch');assert.equal(n[0].image,'https://robertsspaceindustries.com/media/x.jpg');
  const r=parseNewsRss(rss);assert.equal(r.length,1);assert.equal(r[0].title,'Star Citizen Live: Ships & Vehicles');assert.equal(r[0].id,20995);assert.equal(r[0].tag,'show');
  const s=parseSales(fy);assert.equal(s.length,2);assert.equal(s[0].name,'Polaris');assert.equal(s[0].maker,'RSI');assert.equal(s[0].price,825);assert.equal(s[1].name,'Carrack');
  assert.deepEqual(parseSales({items:fy,meta:{}}).map(x=>x.name),['Polaris','Carrack'],'Fleetyards wraps the list as {items, meta}');assert.deepEqual(parseSales({data:fy}).map(x=>x.name),['Polaris','Carrack']);
  assert.ok(!/sorts/.test(SALES_URL),'no sorts param: Fleetyards validates it against a fixed list');assert.ok(/q\[onSaleEq\]=true/.test(SALES_URL));
});

test('fetches on tick, caches to disk, falls back to the RSS feed, and keeps the last good list on failure',async()=>{
  const {i,dir,at}=await make();
  await i.tick();assert.equal(i.news.ok,true);assert.equal(i.news.items.length,4);assert.equal(i.news.source,'api.star-citizen.wiki');assert.equal(i.sales.ok,true);assert.equal(i.sales.items.length,2);
  const again=await new Intel({dataDir:dir,now:()=>T0+2*DAY,fetchJson:async()=>{throw new Error('offline');},fetchText:async()=>{throw new Error('offline');},postJson:async()=>{throw new Error('offline');}}).load();
  assert.equal(again.news.items.length,4,'cache survives a restart');assert.equal(again.sales.items.length,2);
  await again.tick();assert.equal(again.news.ok,false,'failure recorded');assert.equal(again.news.items.length,4,'last good list kept');
  // API down, RSS up → RSS source
  const j=await make({fetchJson:async url=>{if(url===SALES_URL)return fy;throw new Error('500');},fetchText:async url=>{if(url===NEWS_RSS)return rss;throw new Error('404');}});await j.i.tick();
  assert.equal(j.i.news.ok,true);assert.equal(j.i.news.source,'RSI Comm-Link RSS');assert.equal(j.i.news.items[0].title,'Star Citizen Live: Ships & Vehicles');
  // not refetched inside 20 min, refetched after
  let calls=0;const k=await make({fetchJson:async url=>{calls++;if(url===NEWS_URL)return wiki;return fy;}});await k.i.tick();assert.equal(calls,3,'Comm-Links, game versions, ships');await k.i.tick();assert.equal(calls,3);k.at(21*60000);await k.i.tick();assert.equal(calls,5,'news again after 20 min, ships not yet (60 min)');
});

test('chat commands answer once per cooldown on the asking platform; events merge the curated list with event Comm-Links',async()=>{
  const {i,said,at}=await make();await i.tick();
  i.setDeals([{kind:'ccu',title:'Warbond CCUs 10% off',detail:'Carrack to Polaris $185',until:'2026-11-30'},{kind:'event',title:'IAE 2956 at New Babbage',detail:'All week',url:'https://robertsspaceindustries.com/iae'},{kind:'sale',title:'Expired deal',until:'2026-11-01'}]);
  const r=i.chat({text:'!news',platform:'twitch',name:'Ace'});assert.equal(r.ok,true);assert.match(r.text,/^📰 Star Citizen news: 1\. Star Citizen Alpha 4\.4\.0 Patch Notes \(yesterday\) · 2\. This Week in Star Citizen/);assert.ok(r.text.length<=450);
  await new Promise(r=>setTimeout(r,5));assert.deepEqual(said[0][1],'twitch');assert.equal(i.chatOut[0].ok,true);
  assert.equal(i.chat({text:'!news',platform:'youtube'}).ignored,true,'cooling down');at(31000);assert.equal(i.chat({text:'!scnews',platform:'youtube'}).ok,true,'alias, after the cooldown');
  const s=i.chat({text:'!ships'});assert.match(s.text,/🛒 In the pledge store now \(2 ships, newest first\): Polaris \$825, Carrack \$600 — robertsspaceindustries\.com\/pledge\/ships/);
  const d=i.chat({text:'!CCU'});assert.match(d.text,/💸 Deals: Warbond CCUs 10% off — Carrack to Polaris \$185 \(until 30 Nov\)/);assert.ok(!/Expired/.test(d.text),'expired deal left out');
  const e=i.chat({text:'!events'});assert.match(e.text,/📅 Events: IAE 2956 at New Babbage — All week · FREE FLY · Intergalactic Aerospace Expo 2956 — Free Fly Begins/);assert.ok(!/Warbond CCU Weekend/.test(e.text),'40-day-old Comm-Link is not an event any more');
  assert.match(i.chat({text:'!intel'}).text,/!news .* · !sales .* · !deals .* · !events/);
  assert.equal(i.chat({text:'!fire'}).ignored,true);assert.equal(i.chat({text:'hello'}).ignored,true);
  i.configure({commands:{enabled:false}});at(60000);assert.equal(i.chat({text:'!news'}).ignored,true,'switched off');
  const p=i.panel();assert.equal(p.news.length,4);assert.equal(p.news[0].label,'PATCH');assert.equal(p.sales[0].name,'Polaris');assert.equal(p.deals.length,1);assert.equal(p.events.length,2);assert.equal(p.events[1].label,'FREE FLY');
});

test('deals and settings validate',()=>{
  assert.throws(()=>normalizeDeals([{title:'x',url:'javascript:alert(1)'}]),/http/);assert.throws(()=>normalizeDeals([{title:'x',until:'next week'}]),/YYYY-MM-DD/);
  assert.throws(()=>normalizeDeals(Array.from({length:21},(_,k)=>({title:'d'+k}))),/Up to 20/);
  const d=normalizeDeals([{kind:'bogus',title:'  Hi  ',id:'zz'},{title:''}]);assert.equal(d.length,1);assert.equal(d[0].kind,'note');assert.equal(d[0].title,'Hi');assert.match(d[0].id,/^[a-f0-9]{8}$/);
  assert.throws(()=>normalizeIntelSettings({panel:{cycleSeconds:2}}),/5 to 120/);assert.equal(normalizeIntelSettings({commands:{cooldownSeconds:'45'}}).commands.cooldownSeconds,45);
});

// ---------- 2.31.0: RSI first, patch notes, releases, event sections ----------
const NOW=Date.UTC(2026,10,17,7,0,0);
// The shape RSI's Comm-Link and Patch Notes pages have: a link per post with a type word, the title, a count and "Posted:".
const rsiPage=`<div class="hub-blocks"><a href="/comm-link/transmission/21445-This-Week-In-Star-Citizen" class="content-block2 content-block"><div class="background"><img src="/media/x.jpg"></div><div class="type">post</div><div class="title trans-03s">This Week in Star Citizen</div><div class="comments">12</div><div class="time_ago"><span class="label">Posted:</span> <span class="value">2026-11-16 20:00:11</span></div></a>
<a href="/en/comm-link/transmission/21440-IAE-2956-Day-Four" class="content-block2"><div class="type">video</div><div class="title">IAE 2956: Crusader &amp; Tumbril Take the Floor</div><div class="comments">3</div><div class="time_ago"><span class="value">17 hours ago</span></div></a>
<a href="/comm-link/Patch-Notes/21429-Star-Citizen-Alpha-4103" class="x"><span>patchnotes</span> <b>Star Citizen Alpha 4.10.3</b> <i>0</i> <span>Posted: 5 days ago</span></a>
<a href="/comm-link/transmission/21445-This-Week-In-Star-Citizen"><img src="dup.jpg"></a><a href="https://evil.example/comm-link/transmission/99999-Phish">Phish Posted: now</a><a href="/pledge">Store</a></div>`;
const notesPage=`<a href="/comm-link/Patch-Notes/21429-Star-Citizen-Alpha-4103"><div class="title">Star Citizen Alpha 4.10.3</div><div class="time_ago">Posted: 5 days ago</div></a><a href="/comm-link/Patch-Notes/21351-Star-Citizen-Alpha-4102"><div class="title">Star Citizen Alpha 4.10.2</div><div class="time_ago">Posted: 2 months ago</div></a>`;
const threads={success:1,data:{threads:[{id:1,subject:'[Wave 1] Star Citizen Alpha 5.0 PTU Patch Notes 13201184',slug:'star-citizen-alpha-5-0-ptu-patch-notes-1',time_created:Math.floor((NOW-14*3600000)/1000)},
  {id:2,subject:'[All Waves] Star Citizen Alpha 4.10.3 PTU Patch Notes 13145606',slug:'star-citizen-alpha-4-10-3-ptu-patch-notes-5',time_created:Math.floor((NOW-8*DAY)/1000)},
  {id:3,subject:'Star Citizen Alpha 4.10.3 LIVE Release Notes',slug:'star-citizen-alpha-4-10-3-live-release-notes',time_created:Math.floor((NOW-5*DAY)/1000)},
  {id:4,subject:'Patch Notes feedback megathread',slug:'feedback',time_created:1},{id:5,subject:'Star Citizen Alpha 5.0 PTU',slug:'bad slug!',time_created:1}]}};
const versions={data:[{code:'4.10.3-LIVE.13165946',channel:'live',is_default:true},{code:'4.10.2-LIVE.12881860',channel:'live'},{code:'nonsense'}]};
const net=(over={})=>({fetchText:async url=>{if(url===RSI_COMMLINK_URL)return rsiPage;if(url===RSI_PATCH_URL)return notesPage;if(url===NEWS_RSS)return rss;throw new Error('404 '+url);},
  fetchJson:async url=>{if(url===NEWS_URL)return wiki;if(url===VERSIONS_URL)return versions;if(url===SALES_URL)return fy;throw new Error('404 '+url);},
  postJson:async(url,body)=>{assert.equal(url,SPECTRUM_URL);assert.equal(body.channel_id,'190048');return threads;},...over});

test('2.31.0 RSI Comm-Link pages are read loosely: titles, numbers, UTC and "ago" times; only RSI links',()=>{
  const rows=parseRsiHtml(rsiPage,NOW);assert.deepEqual(rows.map(r=>r.id),[21445,21440,21429]);
  assert.equal(rows[0].title,'This Week in Star Citizen');assert.equal(rows[0].at,Date.UTC(2026,10,16,20,0,11));assert.equal(rows[0].url,'https://robertsspaceindustries.com/comm-link/transmission/21445-This-Week-In-Star-Citizen');
  assert.equal(rows[1].title,'IAE 2956: Crusader & Tumbril Take the Floor');assert.equal(rows[1].at,NOW-17*3600000);assert.equal(rows[1].tag,'event');
  assert.equal(rows[2].title,'Star Citizen Alpha 4.10.3','no class names: read from the flat text');assert.equal(rows[2].channel,'Patch Notes');assert.equal(rows[2].tag,'patch');assert.equal(rows[2].at,NOW-5*DAY);
  assert.deepEqual(parseRsiHtml('<html>nothing</html>',NOW),[]);
});
test('2.31.0 patch titles, Spectrum threads and game versions',()=>{
  assert.deepEqual(parsePatchTitle('[Wave 1] Star Citizen Alpha 5.0 PTU Patch Notes 13201184'),{version:'5.0',channel:'PTU',build:'13201184',audience:'Wave 1'});
  assert.deepEqual(parsePatchTitle('Star Citizen Alpha 4.10.3','LIVE'),{version:'4.10.3',channel:'LIVE',build:'',audience:''});assert.equal(parsePatchTitle('[Evocati] Star Citizen Alpha 5.0 EPTU Patch Notes').channel,'EPTU');assert.equal(parsePatchTitle('Server maintenance'),null);
  const t=parseSpectrumThreads(threads);assert.equal(t.length,3,'non-patch threads and odd slugs dropped');assert.equal(t[0].url,'https://robertsspaceindustries.com/spectrum/community/SC/forum/190048/thread/star-citizen-alpha-5-0-ptu-patch-notes-1');assert.equal(t[0].at,Math.floor((NOW-14*3600000)/1000)*1000);
  assert.deepEqual(parseGameVersions(versions).map(v=>v.version+':'+v.channel+':'+v.build),['4.10.3:LIVE:13165946','4.10.2:LIVE:12881860']);
  assert.ok(cmpVersion('4.10.3','4.9')>0);assert.equal(cmpVersion('5.0','5.0.0'),0);assert.ok(cmpVersion('5.0','4.10.3')>0);
});
test('2.31.0 gather: RSI first, merged with the wiki by Comm-Link number; patches and releases; one source down never empties the rest',async()=>{
  const g=await gather({...net(),now:NOW});
  assert.deepEqual(g.news.slice(0,4).map(n=>n.id),[21445,21440,21429,20992],'RSI newest, then the wiki back-fill');assert.equal(g.source,'robertsspaceindustries.com + api.star-citizen.wiki');
  assert.deepEqual(Object.entries(g.status).map(([k,v])=>k+':'+v.ok),['rsi:true','notes:true','spectrum:true','wiki:true','versions:true'],'RSS not needed');
  assert.deepEqual(g.patches.map(p=>p.channel+' '+p.version),['PTU 5.0','LIVE 4.10.3','PTU 4.10.3','LIVE 4.10.2'],'the Spectrum LIVE duplicate of 4.10.3 is dropped');
  const rel=buildReleases({patches:g.patches,versions:g.versions,now:NOW});
  assert.deepEqual(rel.map(r=>[r.channel,r.version,r.build,r.audience]),[['LIVE','4.10.3','13165946',''],['PTU','5.0','13201184','Wave 1']]);assert.match(rel[0].url,/Patch-Notes\/21429/);assert.equal(rel[0].at,NOW-5*DAY);
  assert.equal(buildReleases({patches:g.patches.filter(p=>p.version!=='5.0'),versions:g.versions,now:NOW}).length,1,'a PTU build that is not ahead of LIVE is not listed');
  assert.deepEqual(buildReleases({patches:g.patches,versions:g.versions,manual:{live:'Alpha 4.10.4',ptu:'5.0 Wave 2'},now:NOW}).map(r=>r.channel+' '+r.version),['LIVE 4.10.4','PTU 5.0 Wave 2'],'typed versions win');
  // RSI down: the RSS and the wiki carry the news; Spectrum down: patch notes still come from RSI's page
  const down=await gather({...net({fetchText:async url=>{if(url===NEWS_RSS)return rss;throw new Error('HTTP 403');},postJson:async()=>{throw new Error('HTTP 403');}}),now:NOW});
  assert.equal(down.status.rsi.ok,false);assert.match(down.status.rsi.message,/403/);assert.equal(down.status.rss.ok,true);assert.equal(down.news[0].title,'Star Citizen Live: Ships & Vehicles');assert.equal(down.patches.length,0);
  const none=await gather({fetchText:async()=>{throw new Error('x');},fetchJson:async()=>{throw new Error('x');},postJson:async()=>{throw new Error('x');},now:NOW});assert.equal(none.newsOk,false);
});
test('2.31.0 event sections: IAE 2956 from the calendar with today on the show floor; events in the news; the streamer\'s own rows',()=>{
  const news=parseRsiHtml(rsiPage,NOW);
  let s=spotlights({news,now:NOW});assert.equal(s.length,1);assert.equal(s[0].id,'iae2956');assert.equal(s[0].status,'live');assert.equal(s[0].freefly,true);assert.equal(s[0].days.length,11);
  const today=s[0].days.find(d=>NOW>=d.start&&NOW<d.end);assert.equal(today.label,'Crusader Industries · Tumbril','17 Nov 07:00 UTC is still the hall day that began 16 Nov 16:00 UTC');
  assert.deepEqual(s[0].news.map(n=>n.title),['IAE 2956: Crusader & Tumbril Take the Floor']);
  assert.equal(spotlights({news:[],now:Date.UTC(2026,10,10)})[0].status,'soon','three days before');assert.equal(spotlights({news:[],now:Date.UTC(2026,10,1)}).length,0);assert.equal(spotlights({news:[],now:Date.UTC(2026,10,28)}).length,0,'over');
  s=spotlights({news:[{title:'Luminalia 2956 Gift Calendar',url:'https://robertsspaceindustries.com/comm-link/transmission/21500-L',at:Date.UTC(2026,11,12)},{title:'Free Fly this weekend',url:'https://robertsspaceindustries.com/x',at:Date.UTC(2026,7,1)}],now:Date.UTC(2026,11,14)});
  assert.deepEqual(s.map(x=>x.id+':'+x.status),['news-luminalia:news'],'named in a Comm-Link from the last ten days; the old Free Fly post is ignored');
  s=spotlights({news,own:[{id:'ab12cd34',kind:'event',title:'IAE watch party',detail:'x'},{id:'ef56ab78',kind:'event',title:'Org race night',detail:'Saturday 8pm',until:'2026-11-22',url:'https://example.com/r'}],now:NOW});
  assert.deepEqual(s.map(x=>x.id),['iae2956','own-ef56ab78'],'an own row about an event that already has a section is not doubled');assert.equal(s[1].blurb,'Saturday 8pm');
  assert.ok(EVENT_CALENDAR.every(c=>c.days.every((d,i,a)=>d.end>d.start&&(!i||d.start===a[i-1].end))),'calendar days run back to back');
});
test('2.31.0 the host: !patch, the website share and the feed carry releases, patch notes and event sections',async()=>{
  const {i,said}=await make({...net()});i.now=()=>NOW;await i.tick();
  assert.equal(i.news.source,'robertsspaceindustries.com + api.star-citizen.wiki');assert.equal(i.news.items[0].id,21445);
  const r=i.chat({text:'!patch',platform:'kick'});assert.equal(r.text,'🛠 Star Citizen: LIVE Alpha 4.10.3 · 5 days ago · PTU Alpha 5.0 (Wave 1) · today — notes: robertsspaceindustries.com/comm-link/Patch-Notes/21429-Star-Citizen-Alpha-4103');
  assert.equal(i.chat({text:'!version'}).ignored,true,'same command, cooling down');
  i.configure({releases:{live:'4.10.4'}});assert.equal(i.releases()[0].version,'4.10.4');i.configure({releases:{live:''}});assert.equal(i.releases()[0].version,'4.10.3');
  const v=i.view();assert.deepEqual(v.news.sources.map(x=>x.key+':'+x.ok),['rsi:true','notes:true','spectrum:true','wiki:true','versions:true']);assert.equal(v.spotlights[0].id,'iae2956');
  const out=projectCompanion({intel:i.share()},{showNames:true},NOW).intel;
  assert.deepEqual(out.releases.map(x=>x.channel+' '+x.version),['LIVE 4.10.3','PTU 5.0']);assert.equal(out.patches[0].title,'[Wave 1] Star Citizen Alpha 5.0 PTU Patch Notes 13201184');assert.match(out.patches[0].url,/^https:\/\/robertsspaceindustries\.com\/spectrum\//);
  assert.equal(out.spotlights[0].name,'Intergalactic Aerospace Expo 2956');assert.equal(out.spotlights[0].days.length,11);assert.equal(out.spotlights[0].news.length,2,'the RSI post and the wiki back-fill');assert.equal(out.news.length,7);
  const bad=projectCompanion({intel:{at:NOW,news:[],releases:[{channel:'HACK',version:'<b>'},{channel:'LIVE',version:'4.10.3',url:'https://evil.example/x'}],patches:[{title:'x',url:'javascript:alert(1)'}],spotlights:[{id:'x y',name:'<img>',status:'weird',url:'javascript:alert(1)',days:[{label:'A',start:1,end:0}]}]}},{},NOW).intel;
  assert.deepEqual(bad.releases,[{channel:'LIVE',version:'4.10.3',build:'',audience:'',at:null,url:''}]);assert.deepEqual(bad.patches,[]);assert.equal(bad.spotlights[0].url,'');assert.equal(bad.spotlights[0].status,'news');assert.deepEqual(bad.spotlights[0].days,[]);
});
test('2.31.0 the website Worker refreshes SC Intel on its own every six hours and serves it',async()=>{
  const m=new Map(),kv={async get(k,t){const v=m.get(k);return v==null?null:t==='json'?JSON.parse(v):v;},async put(k,v){m.set(k,v);}};const env={PUSH:kv};let calls=0;
  const n=net(),fetcher=async(url,init)=>{calls++;const u=String(url);try{if(init?.method==='POST')return {ok:true,json:async()=>n.postJson(u,JSON.parse(init.body))};
    if(/api\.star-citizen\.wiki/.test(u))return {ok:true,json:async()=>n.fetchJson(u)};const t=await n.fetchText(u);return {ok:true,text:async()=>t};}catch{return {ok:false,status:404};}};
  assert.deepEqual(await intelTick(env,fetcher,NOW),{refreshed:true,news:7});assert.equal(calls,5);
  assert.deepEqual(await intelTick(env,fetcher,NOW+3600000),{skipped:'fresh'});assert.equal(calls,5);assert.equal((await intelTick(env,fetcher,NOW+6*3600000+1)).refreshed,true);
  const res=await intelApi(env);assert.equal(res.status,200);const d=await res.json();assert.equal(d.news[0].id,undefined,'only what the page shows');assert.equal(d.news[0].title,'This Week in Star Citizen');
  assert.deepEqual(d.releases.map(x=>x.channel+' '+x.version),['LIVE 4.10.3','PTU 5.0']);assert.equal(d.spotlights[0].id,'iae2956');assert.equal(d.patches.length,4);
  // every source down: the last good copy is kept, and tried again after an hour rather than every tick
  const dead=async()=>({ok:false,status:500});assert.deepEqual(await intelTick(env,dead,NOW+13*3600000),{failed:true});assert.equal((await (await intelApi(env)).json()).news.length,7);
  assert.deepEqual(await intelTick(env,dead,NOW+13*3600000+60000),{skipped:'fresh'});
  assert.equal((await intelApi({PUSH:{async get(){return null;}}})).status,404);
});
