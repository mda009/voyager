import {test} from 'node:test';
import assert from 'node:assert/strict';
import '../../giveaway-eligibility.js';
const E=globalThis.VoyagerEligibility,DAY=86400000,now=Date.UTC(2026,9,30);

const giveaway={audit:[
  {status:'confirmed',confirmedAt:now-5*DAY,winner:{platform:'twitch',login:'recentwin',id:'111',name:'RecentWin'}},
  {status:'confirmed',confirmedAt:now-40*DAY,winner:{platform:'twitch',login:'oldwin',id:'222',name:'OldWin'}},
  {status:'rerolled',at:now-1*DAY,winner:{platform:'kick',login:'rerolled',id:'k1',name:'Rerolled'}},
  {status:'confirmed',confirmedAt:now-2*DAY,winner:{platform:'youtube',login:'',id:'UCcaseSensitive',name:'Tuber'}}
]};
const security={users:{
  '333':{login:'botty',name:'Botty',review:{status:'confirmed_bot'}},
  '444':{login:'watched',name:'Watched',review:{status:'watchlist'}},
  '555':{login:'trusted',name:'Trusted',review:{status:'trusted'},createdAt:now-2*DAY},
  '666':{login:'fresh',name:'Fresh',review:{status:'unreviewed'},createdAt:now-3*DAY}
}};

test('Rules find recent winners and Security flags, with reasons',()=>{
  const rows=E.compute(E.normalize({}),giveaway,security,now);
  const by=Object.fromEntries(rows.map(r=>[r.name,r.reason]));
  assert.equal(by.RecentWin,'won 5 days ago');assert.equal(by.Tuber,'won 2 days ago');
  assert.equal(by.OldWin,undefined,'outside the 30-day window');assert.equal(by.Rerolled,undefined,'only confirmed wins count');
  assert.equal(by.Botty,'confirmed bot');assert.equal(by.Watched,'on the Security watchlist');
  assert.equal(by.Trusted,undefined);assert.equal(by.Fresh,undefined,'account age is off by default');
});

test('Account age rule and switching rules off',()=>{
  const rows=E.compute({recentWin:false,flagged:false,accountAge:true,accountDays:7},giveaway,security,now);
  assert.deepEqual(rows.map(r=>r.name).sort(),['Fresh','Trusted']);
  assert.equal(E.compute({recentWin:false,flagged:false},giveaway,security,now).length,0);
  assert.equal(E.compute({},giveaway,null,now).length,2,'without Security data only past winners apply');
});

test('Exclusions use logins for member pools and exact IDs for chat giveaways',()=>{
  const rows=E.compute({},giveaway,security,now);
  const groups=E.exclusions(rows,false),chat=E.exclusions(rows,true);
  assert.ok(groups.includes('recentwin')&&groups.includes('botty'));assert.ok(!groups.some(x=>x.includes(':')));
  assert.ok(chat.includes('twitch:id:111')&&chat.includes('youtube:id:UCcaseSensitive'));
  assert.equal(E.merge('myBot, Other',['other','botty']),'myBot, Other, botty');
});
