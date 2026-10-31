import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const W=createRequire(import.meta.url)('../../wheel-assets/wheel-model.js');

// A live impromptu giveaway with one recent winner who could enter but not be drawn (Giveaway Engine v10).
function state(now){
  const pool=['a','b','c','d'].map((n,i)=>({key:'twitch:id:'+n,id:n,name:n.toUpperCase(),platform:'twitch',weight:1,...(i===1?{noWin:true}:{})}));
  const draw={id:'d1',at:now-25000,sequenceVersion:2,eligibleCount:3,winner:pool[2],status:'selected'};
  return {schema:1,revision:4,view:'reveal',reveal:{id:'r1',drawId:'d1',at:now-25000,sequenceVersion:2},session:{id:'s1',mode:'chat',createdAt:now-90000,pool,draws:[draw],currentDrawId:'d1'}};
}
test('The wheel appears for a draw where some entrants could enter but not be drawn',()=>{
  const now=Date.now(),v=W.phase(state(now),now);
  assert.equal(v.visible,true,v.error);assert.equal(v.pool.length,3);assert.ok(!v.pool.some(u=>u.noWin));
  assert.equal(v.pool[v.plan.index].key,'twitch:id:c','spins to the drawn winner');
});
test('Rerolls leave earlier winners off, and older sessions without noWin are unchanged',()=>{
  const now=Date.now(),s=state(now);s.session.pool.forEach(u=>delete u.noWin);
  const first={...s.session.draws[0],status:'rerolled'},second={id:'d2',at:now-25000,sequenceVersion:2,eligibleCount:3,winner:s.session.pool[0],status:'selected'};
  s.session.draws=[first,second];s.session.currentDrawId='d2';s.reveal={id:'r2',drawId:'d2',at:now-25000,sequenceVersion:2};
  const v=W.phase(s,now);assert.equal(v.visible,true,v.error);assert.equal(v.pool.length,3);assert.ok(!v.pool.some(u=>u.key==='twitch:id:c'));
});
