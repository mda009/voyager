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

test('a request from the website is accepted once per option per person per stream, announced in chat and queued for the overlay',async()=>{
  const {r,said,push,now,at,setRound}=await make();
  push({id:'a1',name:'aurorafox',key:'quiz',at:now()+1});push({id:'a2',name:'AuroraFox',key:'quiz',at:now()+2});push({id:'b1',name:'Stranger',key:'quiz',at:now()+3});push({id:'c1',name:'Quasar',key:'bogus',at:now()+4});push({id:'d1',name:'NovaCaptain',key:'quiz',at:now()+5});
  const res=await r.poll();assert.deepEqual(res,{taken:2,seen:5});await tick();
  assert.deepEqual(r.view().items.map(i=>i.name+':'+i.label),['NovaCaptain:Bridge Quiz','AuroraFox:Bridge Quiz'],'crew spelling used; a second ask for the same option, a stranger and an unknown option dropped');
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

test('the website Worker: one request per option per name and per device each stream, only while open, only listed options',async()=>{
  const m=new Map(),kv={async get(k,t){const v=m.get(k);return v==null?null:t==='json'?JSON.parse(v):v;},async put(k,v){m.set(k,v);}};const now=1e12;
  let feed={schema:1,generatedAt:now,requests:{open:true,round:9,options:[{key:'quiz',label:'Bridge Quiz'},{key:'marbles',label:'Marbles'}]}};
  const env={PUSH:kv,FEED_URL:'https://raw.example/feed.json'},fetcher=async()=>({ok:true,json:async()=>feed});
  const post=async(body,ip='1.1.1.1')=>{const r=await requestApi(new Request('https://voyagercommand.com/api/request',{method:'POST',body:JSON.stringify(body),headers:{'cf-connecting-ip':ip}}),env,new URL('https://voyagercommand.com/api/request'),fetcher,now);return {status:r.status,data:await r.json()};};
  const dev=n=>String(n).repeat(32).slice(0,32).replace(/[^a-f0-9]/g,'a');
  assert.equal((await post({name:'AuroraFox',key:'quiz',device:dev('a')})).status,200);
  assert.equal((await post({name:'aurorafox',key:'quiz',device:dev('b')})).status,409,'same name, same option');assert.equal((await post({name:'Quasar',key:'quiz',device:dev('a')})).status,409,'same device, same option');
  assert.equal((await post({name:'AuroraFox',key:'marbles',device:dev('a')})).status,200,'2.30.0: a different option is fine');assert.equal((await post({name:'AuroraFox',key:'marbles',device:dev('a')})).status,409);
  assert.equal((await post({name:'Quasar',key:'nope',device:dev('c')})).status,400);assert.equal((await post({name:'',key:'quiz',device:dev('c')})).status,400);assert.equal((await post({name:'Quasar',key:'quiz',device:'zz'})).status,400);
  for(let i=0;i<38;i++)assert.equal((await post({name:'N'+i,key:'quiz',device:(i+1000).toString(16).padStart(32,'0')})).status,200);
  assert.equal((await post({name:'N99',key:'quiz',device:dev('9')})).status,429,'forty per network per day');assert.equal((await post({name:'N99',key:'quiz',device:dev('9')},'2.2.2.2')).status,200);
  feed={...feed,requests:{...feed.requests,open:false}};assert.equal((await post({name:'Late',key:'quiz',device:dev('d')},'3.3.3.3')).status,409,'closed');
  const get=await requestApi(new Request('https://voyagercommand.com/api/requests?after=0'),env,new URL('https://voyagercommand.com/api/requests?after=0'),fetcher,now);const list=(await get.json()).requests;
  assert.equal(list.length,41);assert.deepEqual(Object.keys(list[0]).sort(),['at','id','key','name','round'],'device and network marks never leave the Worker');
});

test('2.26.1 the public feed carries the Bridge Quiz leaderboard, only with viewer names shown',()=>{
  const raw={quiz:{all:[{place:1,name:'AuroraFox',platform:'twitch',correct:14,points:70},{name:'',correct:3,points:5},{name:'Zero',correct:0,points:0}],stream:[{name:'Quasar',platform:'youtube',correct:2,points:10}]}};
  assert.deepEqual(projectCompanion(raw,{showNames:true},1e12).quiz,{all:[{rank:1,name:'AuroraFox',platform:'twitch',correct:14,points:70}],stream:[{rank:1,name:'Quasar',platform:'youtube',correct:2,points:10}]});
  assert.equal(projectCompanion(raw,{showNames:false},1e12).quiz,undefined);assert.equal(projectCompanion(raw,{showNames:true,sections:{quiz:false}},1e12).quiz,undefined);
});

test('2.30.0 each option once per person per stream; one-click switches; the log keeps everything; the in-app alert',async()=>{
  const {r,said,push,now,at,setRound}=await make();
  push({id:'a1',name:'AuroraFox',key:'quiz',at:now()+1});push({id:'a2',name:'AuroraFox',key:'dreadnought',at:now()+2});push({id:'a3',name:'AuroraFox',key:'quiz',at:now()+3});push({id:'a4',name:'AuroraFox',key:'marbles',at:now()+4});
  assert.equal((await r.poll()).taken,3,'three different options, the repeat dropped');await tick();assert.equal(said.length,3);
  assert.deepEqual(r.view().items.map(i=>i.label),['Marbles','Dreadnought','Bridge Quiz']);
  // the in-app alert: the newest request, with how many are asking
  let l=r.latest();assert.equal(l.enabled,true);assert.equal(l.sound,true);assert.deepEqual([l.last.name,l.last.label,l.last.count,l.waiting],['AuroraFox','Marbles',1,3]);
  assert.equal(r.overlay().alert.count,1);assert.equal(r.overlay().sound,true);
  r.configure({appAlert:false,sound:false});assert.equal(r.latest().enabled,false);assert.equal(r.overlay().sound,false);
  // switch an option off straight away: turned away, gone from the website, still listed for the streamer
  assert.equal(r.toggle('frenzy',false).all.find(o=>o.key==='frenzy').enabled,false);assert.equal(r.share().options.some(o=>o.key==='frenzy'),false);
  push({id:'q1',name:'Quasar',key:'frenzy',at:now()+5});assert.equal((await r.poll()).taken,0);
  r.toggle('frenzy',true);push({id:'q2',name:'Quasar',key:'frenzy',at:now()+6});assert.equal((await r.poll()).taken,1);assert.throws(()=>r.toggle('nope',true),/no longer listed/);
  assert.equal(r.view().all.find(o=>o.key==='frenzy').count,1);
  // the log: everything, newest first, with outcomes; clearing the queue keeps the log and lets people ask again
  r.mark('a1','done');r.test('quiz');
  let log=r.history();assert.equal(log.total,4,'tests are not logged');assert.deepEqual(log.rows.map(x=>x.name+':'+x.label+':'+x.status),['Quasar:Frenzy:new','AuroraFox:Marbles:new','AuroraFox:Dreadnought:new','AuroraFox:Bridge Quiz:done']);
  assert.equal(r.history({q:'quasar'}).total,1);assert.equal(r.history({q:'marb'}).total,1);
  r.clear();assert.equal(r.view().items.length,0);assert.equal(r.history().total,4);assert.equal(r.history().rows[0].status,'cleared');assert.equal(r.history().rows[3].status,'done');
  push({id:'a9',name:'AuroraFox',key:'quiz',at:now()+9});assert.equal((await r.poll()).taken,1,'after a clear they may ask again');
  const csv=r.csv().split('\r\n');assert.equal(csv[0],'When,Viewer,Request,Outcome,Stream');assert.equal(csv.length,7);assert.match(csv[1],/^\d{4}-\d\d-\d\dT.*,AuroraFox,Bridge Quiz,new,5$/);
  // a new stream; the log survives a restart; old streams can be deleted
  setRound(6);push({id:'b1',name:'NovaCaptain',key:'quiz',at:now()+20});await r.poll();await r.persist();
  const again=await new Requests({dataDir:r.dataDir,round:()=>6}).load();assert.equal(again.history().total,6);assert.equal(again.view().items.length,1);assert.equal(again.view().older,5);
  r.clearLog();assert.equal(r.history().total,1);assert.equal(r.view().items.length,1);
});
test('2.30.0 a name that looks like a formula is made safe in the spreadsheet',async()=>{
  const {r}=await make({known:n=>n});r.accept({id:'f1',name:'=SUM(A1)',key:'quiz',at:1e12});assert.match(r.csv(),/,'=SUM\(A1\),Bridge Quiz,/);
});
