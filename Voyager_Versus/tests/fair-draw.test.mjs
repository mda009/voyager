import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash,createHmac,randomBytes} from 'node:crypto';
import '../../site/viewer/fair-draw.js';
import * as M from '../../public-feed-model.mjs';

const F=globalThis.VoyagerFairDraw;
const zero='0'.repeat(64),mixed='0123456789abcdef'.repeat(4);

test('Verifier matches the Giveaway Engine test vectors (also checked in C# CI)',async()=>{
  assert.equal(await F.proofIndex(zero,1),0);
  assert.equal(await F.proofIndex(zero,7),2);
  assert.equal(await F.proofIndex(zero,48),13);
  assert.equal(await F.proofIndex(mixed,48),20);
  assert.equal(await F.proofIndex(mixed,50000),29044);
  assert.equal(await F.sha256Hex(F.hexToBytes(mixed)),'4884fdaafea47c29fea7159d0daddd9c085d6200e1359e85bb81736af6b7c837');
  assert.equal(await F.poolHash([['twitch','Alpha'],['youtube','Béta ✦']]),'317925846afc26dabc308b10f107fb222ac635c616c0bd527444dc3d8d5ca29b');
});

// Mirrors MakeProof and the draw in Voyager_Giveaway_Engine.cs (the C# CI run checks the engine itself).
function engineProof(pool){
  let s=randomBytes(32);const chain=[s.toString('hex')];
  for(let i=0;i<64;i++){s=createHash('sha256').update(s).digest();chain.push(s.toString('hex'));}
  chain.reverse();
  const lines=pool.map(e=>e.platform+'\t'+e.name).join('\n');
  return {version:1,committedAt:Date.now()-60000,commitment:chain[0],poolHash:createHash('sha256').update(lines).digest('hex'),size:pool.length,entrants:pool.map(e=>[e.platform,e.name]),seeds:chain.slice(1)};
}
function index(seed,count){const limit=2**32-(2**32%count);for(let c=0;;c++){const v=createHmac('sha256',Buffer.from(seed,'hex')).update('voyager-draw-v1:'+c).digest().readUInt32BE(0);if(v<limit)return v%count;}}
function session(){
  const pool=Array.from({length:30},(_,i)=>({key:'twitch:id:'+i,name:'Viewer '+i,platform:i%3?'twitch':'youtube'}));
  const proof=engineProof(pool),draws=[];let left=pool.slice();
  for(const [n,status] of [[1,'rerolled'],[2,'confirmed'],[3,'selected']]){
    const i=index(proof.seeds[n-1],left.length);draws.push({id:'d'+n,status,winner:left[i],proof:{n,index:i}});left.splice(i,1);
  }
  return {id:'s1',mode:'groups',title:'Prize',createdAt:Date.now()-90000,groups:['silver'],pool,draws,currentDrawId:'d3',proof};
}

test('Published proof re-checks in the browser, and never reveals a pick awaiting confirmation',async()=>{
  const s=session(),settings=M.normalizeSettings({showNames:true});
  const projected=M.projectProof(s,settings);
  assert.equal(projected.draws[2].status,'pending');assert.equal(projected.draws[2].seed,null);assert.equal(projected.draws[2].index,null);
  assert.equal(projected.draws[0].winner,null,'a re-drawn pick is not named');assert.equal(projected.draws[1].winner,s.draws[1].winner.name);
  assert.equal(JSON.stringify(projected).includes(s.proof.seeds[2]),false,'the next seed is never published');
  const clean=M.sanitizeProof(JSON.parse(JSON.stringify(projected)));
  const result=await F.verify(clean);
  assert.equal(result.ok,true,JSON.stringify(result.steps));
  assert.equal(result.steps.filter(x=>x.ok===true).length,5);
});

test('A tampered proof fails the check',async()=>{
  const s=session(),p=M.sanitizeProof(M.projectProof(s,M.normalizeSettings({showNames:true})));
  const swapped={...p,entrants:p.entrants.map((e,i)=>i===0?[e[0],'Someone else']:e)};
  assert.equal((await F.verify(swapped)).ok,false);
  const forged={...p,draws:p.draws.map(d=>d.n===2?{...d,winner:'Viewer 99'}:d)};
  assert.equal((await F.verify(forged)).ok,false);
  const wrongSeed={...p,draws:p.draws.map(d=>d.n===1?{...d,seed:mixed}:d)};
  assert.equal((await F.verify(wrongSeed)).ok,false);
});

test('With viewer names hidden, entrant names stay off the site',()=>{
  const s=session(),p=M.projectProof(s,M.normalizeSettings({showNames:false}));
  assert.equal(p.entrants,null);assert.ok(p.draws.every(d=>d.winner===null));
  const stored=M.sanitizeProof(M.projectProof(s,M.normalizeSettings({showNames:true})));
  const shown=M.publicProof(stored,{showNames:false});assert.equal(shown.entrants,null);assert.ok(shown.draws.every(d=>d.winner===null));
});

test('Feed carries a short fair-draw summary; the full proof stays out of feed.json',()=>{
  const s=session(),settings=M.normalizeSettings({showNames:true});
  const g=M.projectGiveaway({session:s},settings);
  const c=M.sanitizeCollected({giveaways:[g]});
  assert.ok(c.giveaways[0].proof);
  const feed=M.buildFeed({collected:c,settings,winners:[{gid:g.id,title:'Prize',name:'Viewer 1',platform:'twitch',at:Date.now()}],proofIds:new Set([g.id])});
  assert.deepEqual(Object.keys(feed.giveaways[0].fairDraw).sort(),['commitment','committedAt','id','size']);
  assert.equal(JSON.stringify(feed).includes('"entrants":['),false);
  assert.equal(feed.winners[0].proof,g.id);
  assert.equal(M.sanitizeProof({...g.proof,commitment:'nothex'}),null);
});
