import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Intel,tagNews,parseNewsApi,parseNewsRss,parseSales,normalizeDeals,normalizeIntelSettings,NEWS_URL,SALES_URL,NEWS_RSS} from '../local/intel.mjs';

const DAY=86400000,T0=Date.UTC(2026,10,14,0,0,0);
const wiki={data:[
  {id:20990,title:'Star Citizen Alpha 4.4.0 Patch Notes',rsi_url:'https://robertsspaceindustries.com/en/comm-link/transmission/20990-Star-Citizen-Alpha-440',channel:'Transmission',created_at:new Date(T0-DAY).toISOString(),images:[{rsi_url:'https://robertsspaceindustries.com/media/x.jpg'}]},
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
  const fetchText=opts.fetchText||(async url=>{if(url===NEWS_RSS)return rss;throw new Error('404');});
  const i=await new Intel({dataDir:dir,now:()=>now,say:(t,p)=>{said.push([t,p]);return {ok:true,message:'sent'};},fetchJson,fetchText}).load();
  return {i,dir,said,at:ms=>{now+=ms;},now:()=>now};}

test('tags Comm-Links from their titles',()=>{
  assert.equal(tagNews('Star Citizen Alpha 4.4.0 Patch Notes'),'patch');assert.equal(tagNews('Intergalactic Aerospace Expo 2956 — Free Fly Begins'),'freefly');
  assert.equal(tagNews('Warbond CCU Weekend'),'ccu');assert.equal(tagNews('Luminalia 2956'),'event');assert.equal(tagNews('This Week in Star Citizen'),'show');
  assert.equal(tagNews('Anvil Paladin Concept Sale'),'sale');assert.equal(tagNews('Portfolio: Crusader Industries','Spectrum Dispatch'),'lore');assert.equal(tagNews('Monthly Report'),'news');
});

test('parsers keep only RSI links, newest first; Fleetyards ships need a price',()=>{
  const n=parseNewsApi(wiki);assert.equal(n.length,4,'phishing row dropped');assert.equal(n[0].id,20990);assert.equal(n[0].tag,'patch');assert.equal(n[0].image,'https://robertsspaceindustries.com/media/x.jpg');
  const r=parseNewsRss(rss);assert.equal(r.length,1);assert.equal(r[0].title,'Star Citizen Live: Ships & Vehicles');assert.equal(r[0].id,20995);assert.equal(r[0].tag,'show');
  const s=parseSales(fy);assert.equal(s.length,2);assert.equal(s[0].name,'Polaris');assert.equal(s[0].maker,'RSI');assert.equal(s[0].price,825);assert.equal(s[1].name,'Carrack');
  assert.deepEqual(parseSales({data:fy}).map(x=>x.name),['Polaris','Carrack'],'wrapped or bare list');
});

test('fetches on tick, caches to disk, falls back to the RSS feed, and keeps the last good list on failure',async()=>{
  const {i,dir,at}=await make();
  await i.tick();assert.equal(i.news.ok,true);assert.equal(i.news.items.length,4);assert.equal(i.news.source,'api.star-citizen.wiki');assert.equal(i.sales.ok,true);assert.equal(i.sales.items.length,2);
  const again=await new Intel({dataDir:dir,now:()=>T0+2*DAY,fetchJson:async()=>{throw new Error('offline');},fetchText:async()=>{throw new Error('offline');}}).load();
  assert.equal(again.news.items.length,4,'cache survives a restart');assert.equal(again.sales.items.length,2);
  await again.tick();assert.equal(again.news.ok,false,'failure recorded');assert.equal(again.news.items.length,4,'last good list kept');
  // API down, RSS up → RSS source
  const j=await make({fetchJson:async url=>{if(url===SALES_URL)return fy;throw new Error('500');}});await j.i.tick();
  assert.equal(j.i.news.ok,true);assert.equal(j.i.news.source,'RSI Comm-Link RSS');assert.equal(j.i.news.items[0].title,'Star Citizen Live: Ships & Vehicles');
  // not refetched inside 20 min, refetched after
  let calls=0;const k=await make({fetchJson:async url=>{calls++;if(url===NEWS_URL)return wiki;return fy;}});await k.i.tick();assert.equal(calls,2);await k.i.tick();assert.equal(calls,2);k.at(21*60000);await k.i.tick();assert.equal(calls,3,'news again after 20 min, ships not yet (60 min)');
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
