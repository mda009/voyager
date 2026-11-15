import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Requests,normalizeRequestSettings} from '../local/requests.mjs';
import {requestApi} from '../../site/worker.mjs';
import {projectCompanion} from '../../public-feed-model.mjs';

async function make(extra={}){const dir=await mkdtemp(join(tmpdir(),'voyager-req-'));let now=1e12,round=5,live=true;const said=[];let remote=[];
  const crew=['AuroraFox','NovaCaptain','Quasar'];
  const r=await new Requests({dataDir:dir,now:()=>now,round:()=>round,onAir:()=>live,siteUrl:()=>'https://voyagercommand.com/',known:n=>crew.find(c=>c.toLowerCase()===String(n).toLowerCase())||null,say:t=>{said.push(t);},
    fetchJson:async url=>{assert.match(url,/^https:\/\/voyagercommand\.com\/api\/requests\?after=\d+$/);const after=Number(url.split('=')[1]);return {requests:remote.filter(x=>x.at>after)};},...extra}).load();
  return {r,dir,said,at:ms=>{now+=ms;},now:()=>now,push:x=>remote.push(x),setRound:v=>{round=v;},setLive:v=>{live=v;}};}
const tick=()=>new Promise(r=>setTimeout(r,5));

test('a request from the website is accepted once per person per stream, announced in chat and queued for the overlay',async()=>{
  const {r,said,push,now,at,setRound}=await make();
  push({id:'a1',name:'aurorafox',key:'quiz',at:now()+1});push({id:'a2',name:'AuroraFox',key:'dreadnought',at:now()+2});push({id:'b1',name:'Stranger',key:'quiz',at:now()+3});push({id:'c1',name:'Quasar',key:'bogus',at:now()+4});push({id:'d1',name:'NovaCaptain',key:'quiz',at:now()+5});
  const res=await r.poll();assert.deepEqual(res,{taken:2,seen:5});await tick();
  assert.deepEqual(r.view().items.map(i=>i.name+':'+i.label),['NovaCaptain:Bridge Quiz','AuroraFox:Bridge Quiz'],'crew spelling used; second ask, stranger and unknown option dropped');
  assert.deepEqual(said,['📨 Request from AuroraFox: Bridge Quiz (1 asking this stream)','📨 Request from NovaCaptain: Bridge Quiz (2 asking this stream)']);
  assert.equal(r.tally().find(t=>t.key==='quiz').count,2);assert.deepEqual(await r.poll(),{taken:0,seen:0},'nothing is read twice');
  const o=r.overlay();assert.equal(o.alert.name,'AuroraFox');assert.equal(o.alert.label,'Bridge Quiz');assert.equal(o.waiting,1);assert.equal(r.overlay().alert.name,'AuroraFox','stays for its time');
  at(12001);assert.equal(r.overlay().alert.name,'NovaCaptain','then the next one');at(12001);assert.equal(r.overlay().alert,null);
  r.mark('a1','done');assert.equal(r.share().recent.find(x=>x.name==='AuroraFox').done,true);r.mark('d1','dismissed');assert.equal(r.tally().find(t=>t.key==='quiz').count,1);
  setRound(6);push({id:'a3',name:'AuroraFox',key:'frenzy',at:now()+1});assert.equal((await r.poll()).taken,1,'a new stream: they may ask again');assert.equal(r.view().items.length,1);assert.equal(r.view().older,2);
});

test('closed when off, or off air with "only while live"; settings validate; a test alert is not announced',async()=>{
  const {r,said,push,now,setLive}=await make();
  setLive(false);assert.equal(r.open(),false);push({id:'x1',name:'Quasar',key:'quiz',at:now()+1});assert.equal((await r.poll()).taken,0);
  r.configure({onlyLive:false});assert.equal(r.open(),true);r.configure({enabled:false});assert.equal(r.open(),false);assert.equal(await r.poll(),null);assert.deepEqual(r.share().options,[]);
  r.configure({enabled:true,options:[{label:'Marbles on Stream'},{label:'Bridge Quiz',key:'quiz',enabled:false}]});assert.deepEqual(r.share().options,[{key:'marblesonstream',label:'Marbles on Stream'}]);
  r.test('marblesonstream');await tick();assert.equal(said.length,0);assert.equal(r.overlay().alert.name,'Sample Viewer');assert.equal(r.share().recent.length,0,'tests never reach the website');
  assert.throws(()=>normalizeRequestSettings({overlaySeconds:2}),/4 to 60/);assert.throws(()=>normalizeRequestSettings({options:[{label:'A'},{label:'a'}]}),/twice/);assert.throws(()=>normalizeRequestSettings({options:Array.from({length:11},(_,i)=>({label:'o'+i}))}),/Up to 10/);
});

test('the public feed carries options, open state and tally; names only when viewer names are shown',()=>{
  const raw={requests:{open:true,round:7,options:[{key:'quiz',label:'Bridge Quiz'},{key:'<x>',label:''}],recent:[{name:'AuroraFox',label:'Bridge Quiz',at:1e12,done:true}],tally:[{label:'Bridge Quiz',count:3}]}};
  const out=projectCompanion(raw,{showNames:true},1e12);assert.deepEqual(out.requests,{open:true,round:7,options:[{key:'quiz',label:'Bridge Quiz'}],recent:[{name:'AuroraFox',label:'Bridge Quiz',at:1e12,done:true}],tally:[{label:'Bridge Quiz',count:3}]});
  assert.deepEqual(projectCompanion(raw,{showNames:false},1e12).requests.recent,[]);assert.equal(projectCompanion(raw,{sections:{requests:false}},1e12).requests,undefined);
});

test('the website Worker: one request per name and per device each stream, only while open, only listed options',async()=>{
  const m=new Map(),kv={async get(k,t){const v=m.get(k);return v==null?null:t==='json'?JSON.parse(v):v;},async put(k,v){m.set(k,v);}};const now=1e12;
  let feed={schema:1,generatedAt:now,requests:{open:true,round:9,options:[{key:'quiz',label:'Bridge Quiz'},{key:'marbles',label:'Marbles'}]}};
  const env={PUSH:kv,FEED_URL:'https://raw.example/feed.json'},fetcher=async()=>({ok:true,json:async()=>feed});
  const post=async(body,ip='1.1.1.1')=>{const r=await requestApi(new Request('https://voyagercommand.com/api/request',{method:'POST',body:JSON.stringify(body),headers:{'cf-connecting-ip':ip}}),env,new URL('https://voyagercommand.com/api/request'),fetcher,now);return {status:r.status,data:await r.json()};};
  const dev=n=>String(n).repeat(32).slice(0,32).replace(/[^a-f0-9]/g,'a');
  assert.equal((await post({name:'AuroraFox',key:'quiz',device:dev('a')})).status,200);
  assert.equal((await post({name:'aurorafox',key:'marbles',device:dev('b')})).status,409,'same name');assert.equal((await post({name:'Quasar',key:'marbles',device:dev('a')})).status,409,'same device');
  assert.equal((await post({name:'Quasar',key:'nope',device:dev('c')})).status,400);assert.equal((await post({name:'',key:'quiz',device:dev('c')})).status,400);assert.equal((await post({name:'Quasar',key:'quiz',device:'zz'})).status,400);
  for(const [i,n] of ['N1','N2','N3'].entries())assert.equal((await post({name:n,key:'quiz',device:dev(String(i+1))})).status,200);
  assert.equal((await post({name:'N4',key:'quiz',device:dev('9')})).status,429,'four per network per day');assert.equal((await post({name:'N4',key:'quiz',device:dev('9')},'2.2.2.2')).status,200);
  feed={...feed,requests:{...feed.requests,open:false}};assert.equal((await post({name:'Late',key:'quiz',device:dev('d')},'3.3.3.3')).status,409,'closed');
  const get=await requestApi(new Request('https://voyagercommand.com/api/requests?after=0'),env,new URL('https://voyagercommand.com/api/requests?after=0'),fetcher,now);const list=(await get.json()).requests;
  assert.equal(list.length,5);assert.deepEqual(Object.keys(list[0]).sort(),['at','id','key','name','round'],'device and network marks never leave the Worker');
});
