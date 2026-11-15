import test from 'node:test';import assert from 'node:assert/strict';
import worker,{encryptPush,vapidKeys,vapidHeader,validSubscription,topicLetters,diffFeed,drain,tick,wants} from '../../site/worker.mjs';

const b64u=buf=>Buffer.from(buf).toString('base64url'),enc=new TextEncoder();
function fakeKV(){const m=new Map();return {m,
  async get(k,type){const v=m.get(k);if(!v)return null;return type==='json'?JSON.parse(v.value):v.value;},
  async getWithMetadata(k){const v=m.get(k);return {value:v?.value??null,metadata:v?.metadata??null};},
  async put(k,value,opts={}){m.set(k,{value,metadata:opts.metadata||null});},async delete(k){m.delete(k);},
  async list({prefix=''}={}){return {keys:[...m.entries()].filter(([k])=>k.startsWith(prefix)).map(([name,v])=>({name,metadata:v.metadata})),list_complete:true};}};}
async function browser(){ // a pretend browser subscription: its key pair and auth secret
  const pair=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']),auth=crypto.getRandomValues(new Uint8Array(16));
  return {pair,auth,p:b64u(await crypto.subtle.exportKey('raw',pair.publicKey)),a:b64u(auth)};}
async function hkdf(salt,ikm,info,len){const key=await crypto.subtle.importKey('raw',ikm,'HKDF',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},key,len*8));}
async function decrypt(br,body){ // RFC 8291 receiver side
  const salt=body.slice(0,16),idlen=body[20],asPublic=body.slice(21,21+idlen),cipher=body.slice(21+idlen),uaPublic=new Uint8Array(await crypto.subtle.exportKey('raw',br.pair.publicKey));
  const asKey=await crypto.subtle.importKey('raw',asPublic,{name:'ECDH',namedCurve:'P-256'},false,[]),shared=new Uint8Array(await crypto.subtle.deriveBits({name:'ECDH',public:asKey},br.pair.privateKey,256));
  const ikm=await hkdf(br.auth,shared,Buffer.concat([enc.encode('WebPush: info\0'),uaPublic,asPublic]),32),cek=await hkdf(salt,ikm,enc.encode('Content-Encoding: aes128gcm\0'),16),nonce=await hkdf(salt,ikm,enc.encode('Content-Encoding: nonce\0'),12);
  const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:nonce},await crypto.subtle.importKey('raw',cek,'AES-GCM',false,['decrypt']),cipher));
  assert.equal(plain.at(-1),2,'last-record delimiter');return new TextDecoder().decode(plain.slice(0,-1));}
const sub=(br,n,t='ldgw',name='')=>({e:'https://fcm.googleapis.com/fcm/send/'+n,p:br.p,a:br.a,t,n:name});

test('a pushed message decrypts with the browser\'s keys (RFC 8291) and the VAPID token verifies (RFC 8292)',async()=>{
  const br=await browser(),body=await encryptPush({p:br.p,a:br.a},JSON.stringify({title:'MDA009 is live'}));
  assert.equal(body[20],65);assert.deepEqual(JSON.parse(await decrypt(br,body)),{title:'MDA009 is live'});
  const env={PUSH:fakeKV()},keys=await vapidKeys(env);assert.deepEqual(await vapidKeys(env),keys,'generated once, then kept');
  const h=await vapidHeader(keys,'https://fcm.googleapis.com/fcm/send/abc','https://voyagercommand.com',1e12),[,t,k]=h.match(/^vapid t=(.+), k=(.+)$/),[head,claims,sig]=t.split('.');
  assert.equal(k,keys.publicKey);assert.deepEqual(JSON.parse(Buffer.from(claims,'base64url')),{aud:'https://fcm.googleapis.com',exp:1e9+43200,sub:'https://voyagercommand.com'});
  const pub=await crypto.subtle.importKey('raw',Buffer.from(keys.publicKey,'base64url'),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
  assert.equal(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},pub,Buffer.from(sig,'base64url'),enc.encode(head+'.'+claims)),true);
});

test('only real push services are accepted as subscriptions',async()=>{
  const br=await browser(),ok={endpoint:'https://fcm.googleapis.com/fcm/send/x',keys:{p256dh:br.p,auth:br.a}};
  assert.ok(validSubscription(ok));assert.ok(validSubscription({...ok,endpoint:'https://web.push.apple.com/abc'}));assert.ok(validSubscription({...ok,endpoint:'https://updates.push.services.mozilla.com/wpush/v2/x'}));
  assert.equal(validSubscription({...ok,endpoint:'https://evil.example/fcm.googleapis.com'}),null);assert.equal(validSubscription({...ok,endpoint:'http://fcm.googleapis.com/x'}),null);
  assert.equal(validSubscription({...ok,keys:{p256dh:'short',auth:br.a}}),null);assert.equal(validSubscription(null),null);
  assert.equal(topicLetters(['live','win','bogus','live']),'lw');
});

test('feed changes become notifications: on air, Dreadnought boarding, a new giveaway, a confirmed winner — never on the first look',()=>{
  const now=1e12,feed=(x={})=>({schema:1,online:true,generatedAt:now,channel:{name:'MDA009'},live:{onAir:false},dreadnought:{phase:'idle'},giveaways:[],winners:[],...x});
  let r=diffFeed(feed({live:{onAir:true},giveaways:[{id:'g1',status:'open',title:'Gold drop'}]}),null,now);assert.equal(r.events.length,0,'first look only records');assert.equal(r.next.onAir,true);
  r=diffFeed(feed(),{seen:true,onAir:false,phase:'idle',open:[],winAt:0},now);assert.equal(r.events.length,0);
  r=diffFeed(feed({live:{onAir:true},dreadnought:{phase:'lobby'},giveaways:[{id:'g1',status:'open',title:'Gold drop',eligibility:'Gold members'},{id:'g0',status:'closed',title:'Old'}],winners:[{name:'AuroraFox',title:'Gold drop',at:now-1000}]}),{seen:true,onAir:false,phase:'idle',open:[],winAt:now-5000},now);
  assert.deepEqual(r.events.map(e=>e.topic),['live','dread','giveaway','win']);assert.equal(r.events[0].payload.title,'MDA009 is live');assert.equal(r.events[2].payload.title,'Giveaway open: Gold drop');assert.equal(r.events[2].payload.body,'Gold members · Enter in stream chat.');
  assert.deepEqual(r.events[3].names,['aurorafox']);assert.equal(r.next.winAt,now-1000);
  const again=diffFeed(feed({live:{onAir:true},dreadnought:{phase:'battle'},giveaways:[{id:'g1',status:'open',title:'Gold drop'}],winners:[{name:'AuroraFox',title:'Gold drop',at:now-1000}]}),r.next,now+60000);assert.equal(again.events.length,0,'nothing twice; lobby → battle is the same fight');
  const flap=diffFeed(feed({live:{onAir:true}}),{...r.next,onAir:false},now+600000);assert.equal(flap.events.length,0,'on air again within 3 hours: no second alert');
  const stale=diffFeed({...feed({live:{onAir:true}}),generatedAt:now-10*60000},{seen:true,onAir:false,phase:'',open:[],winAt:0},now);assert.equal(stale.events.length,0,'a stale feed never alerts');
});

test('sends go to the viewers who asked, 40 at a time, and dead subscriptions are removed',async()=>{
  const br=await browser(),kv=fakeKV(),env={PUSH:kv};
  for(let i=0;i<95;i++)await kv.put('sub:'+String(i).padStart(3,'0'),'',{metadata:sub(br,i,i%5===0?'d':'ldgw',i===7?'aurorafox':'')});
  assert.equal(wants(sub(br,1,'d'),{topic:'live'}),false);assert.equal(wants(sub(br,1,'w','aurorafox'),{topic:'win',names:['aurorafox']}),true);assert.equal(wants(sub(br,1,'w',''),{topic:'win',names:['aurorafox']}),false);
  const hits=[];const fetcher=async(url,init)=>{hits.push(url);assert.equal(init.headers['content-encoding'],'aes128gcm');assert.match(init.headers.authorization,/^vapid t=/);return {status:url.endsWith('/3')?410:201,ok:true};};
  let r=await drain(env,{topic:'live',payload:{title:'x'}},0,fetcher);assert.equal(r.targets,76);assert.equal(hits.length,40);assert.equal(r.next,40);assert.ok(kv.m.get('job'),'the rest is queued when the Worker cannot call itself');assert.equal(kv.m.has('sub:003'),false,'410 Gone: removed');
  const t=await tick(env,fetcher);assert.equal(t.resumed,true);assert.equal(hits.length,75,'the next tick carries on where it stopped');assert.equal(kv.m.has('job'),false);
  hits.length=0;r=await drain(env,{topic:'win',names:['aurorafox'],payload:{title:'You won'}},0,fetcher);assert.deepEqual(hits,['https://fcm.googleapis.com/fcm/send/7']);
  // with the self binding the next batch is handed over at once
  hits.length=0;const calls=[];env.SELF={fetch:async(url,init)=>{calls.push(JSON.parse(init.body).from);assert.ok(init.headers['x-voyager-drain']);return new Response('{}');}};
  await drain(env,{topic:'dread',payload:{title:'x'}},0,fetcher);assert.deepEqual(calls,[40]);assert.equal(kv.m.has('job'),false);
});

test('the Worker API: key, subscribe, change topics, test, unsubscribe; everything else is the static site',async()=>{
  const br=await browser(),kv=fakeKV(),env={PUSH:kv,ASSETS:{fetch:async()=>new Response('site')}};
  const call=async(path,body,headers={})=>{const r=await worker.fetch(new Request('https://voyagercommand.com'+path,body?{method:'POST',body:JSON.stringify(body),headers:{'content-type':'application/json',...headers}}:{}),env);return {status:r.status,data:r.headers.get('content-type')?.includes('json')?await r.json():await r.text()};};
  assert.equal((await call('/index.html')).data,'site');
  const k=await call('/api/push/key');assert.equal(k.status,200);assert.equal(Buffer.from(k.data.key,'base64url').length,65);assert.deepEqual(k.data.topics,['live','dread','giveaway','win']);
  const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/me',keys:{p256dh:br.p,auth:br.a}};
  assert.equal((await call('/api/push/subscribe',{subscription:{endpoint:'https://evil.example/x',keys:subscription.keys},topics:['live']})).status,400);
  let s=await call('/api/push/subscribe',{subscription,topics:['live','win'],name:' AuroraFox '});assert.deepEqual(s.data.topics,['live','win']);
  const stored=[...kv.m.entries()].find(([key])=>key.startsWith('sub:'))[1].metadata;assert.equal(stored.t,'lw');assert.equal(stored.n,'aurorafox');assert.equal(stored.e,subscription.endpoint);
  s=await call('/api/push/subscribe',{subscription,topics:['dread']});assert.equal([...kv.m.keys()].filter(key=>key.startsWith('sub:')).length,1,'same browser: one row');
  assert.equal((await call('/api/push/drain',{event:{topic:'live',payload:{title:'spoof'}}})).status,403,'nobody outside can send');
  assert.equal((await call('/api/push/test',{endpoint:'https://fcm.googleapis.com/fcm/send/nobody'})).status,404);
  await call('/api/push/unsubscribe',{endpoint:subscription.endpoint});assert.equal([...kv.m.keys()].filter(key=>key.startsWith('sub:')).length,0);
  assert.equal((await worker.fetch(new Request('https://voyagercommand.com/api/push/key'),{ASSETS:env.ASSETS})).status,503,'no storage bound: reported, site still served');
});
