import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Arena} from '../dist/engine.mjs';
const user=(login,text,demo=false)=>({login,name:login,text,demo});
function advance(g,sec){for(let i=0;i<Math.ceil(sec*10);i++)g.tick(.1);}
function battle(){const g=new Arena({now:()=>1000000});g.command(user('alpha','!versus'));g.command(user('bravo','!versus'));advance(g,10.1);assert.equal(g.phase,'battle');g.autoFire=false;return g;}
test('Versus calls, case normalization and duplicate prevention',()=>{const g=new Arena();assert.equal(g.command(user('Alpha','!versus')).ok,true);advance(g,1);assert.equal(g.command(user('ALPHA','!versus')).ok,false);g.command(user('bravo','!versus'));assert.equal(g.phase,'countdown');assert.deepEqual(g.players.map(p=>p.login),['alpha','bravo']);});
test('Only active pilots can attack, cooldowns and energy gate repeated actions',()=>{const g=battle();assert.equal(g.command(user('spectator','!missile')).ok,false);assert.equal(g.command(user('alpha','!missile')).ok,true);assert.equal(g.players[0].energy,65);advance(g,1.2);assert.equal(g.players[1].shield,18);assert.equal(g.command(user('alpha','!missile')).ok,false);g.players[0].energy=0;advance(g,.7);assert.equal(g.command(user('alpha','!fire')).ok,false);});
test('Dodge avoids an incoming missile; shield restore caps at ship max',()=>{const g=battle();g.command(user('alpha','!missile'));g.command(user('bravo','!dodge'));advance(g,1.2);assert.equal(g.players[1].shield,50);g.players[1].shield=40;assert.equal(g.command(user('bravo','!shield')).ok,true);assert.equal(g.players[1].shield,50);assert.ok(g.events.some(e=>e.type==='miss'));});
test('Pause freezes countdown, projectiles, energy, deadlines and cooldowns',()=>{const g=battle();g.command(user('alpha','!missile'));g.control('pause');const before=JSON.stringify(g.snapshot());advance(g,20);assert.equal(JSON.stringify(g.snapshot()),before);g.control('pause');advance(g,1.2);assert.equal(g.players[1].shield,18);});
test('Legacy entry commands cannot open or queue a match',()=>{const g=new Arena();for(const text of ['!join','!duel @bravo','!accept','!decline'])assert.equal(g.command(user('alpha',text)).ok,false);advance(g,3600);assert.equal(g.phase,'lobby');assert.equal(g.queue.length+g.matches.length+g.invites.length,0);assert.equal(g.cooldownUntil,0);assert.equal(g.entryUsage.size,0);});
test('Ship loadouts total 150, cannot switch after entry, and reject prototype names',()=>{const g=new Arena();assert.equal(g.command(user('alpha','!ship sentinel')).ok,true);advance(g,1);g.command(user('alpha','!versus'));advance(g,1);assert.equal(g.command(user('alpha','!ship phantom')).ok,false);g.command(user('bravo','!versus'));assert.equal(g.players[0].hull,120);assert.equal(g.players[0].shield,30);assert.equal(g.command(user('charlie','!ship __proto__')).ok,false);});
test('Timeouts draw when armour is equal; hull destruction records exactly once',()=>{let saves=0;const g=battle();g.onSave=()=>saves++;g.remaining=.01;g.tick(.1);assert.equal(g.result.winner,null);assert.equal(g.snapshot().leaderboard[0].draws,1);assert.equal(saves,1);const h=battle();h.players[1].hull=1;h.players[1].shield=0;h.command(user('alpha','!fire'));advance(h,.5);assert.equal(h.result.winner,0);assert.equal(h.stats.get('alpha').wins,1);advance(h,2);assert.equal(h.stats.get('alpha').wins,1);});
test('Demo and cancelled battles never enter the leaderboard',()=>{const g=new Arena({training:true});assert.equal(g.control('demo').ok,true);advance(g,14.2);g.finish(0);assert.equal(g.stats.size,0);const h=battle();h.control('cancel');assert.equal(h.stats.size,0);assert.equal(h.result.cancelled,true);});
test('Host settings reject invalid duration and closed entries reject joins',()=>{const g=new Arena();g.control('settings',{roundLength:'1',autoFire:false});assert.equal(g.roundLength,30);assert.equal(g.autoFire,false);g.control('open');assert.equal(g.command(user('alpha','!versus')).ok,false);});
test('Cooldown expiry after a battle waits for a new explicit call',()=>{const g=battle();assert.equal(g.command(user('charlie','!join')).ok,false);assert.equal(g.command(user('delta','!duel @charlie')).ok,false);g.command(user('alpha','!leave'));advance(g,8.1);g.now=()=>3700000;g.tick(.1);assert.equal(g.phase,'lobby');assert.equal(g.players.length,0);assert.equal(g.command(user('charlie','!versus')).ok,true);assert.equal(g.phase,'calling');assert.equal(g.command(user('delta','!versus')).ok,true);assert.deepEqual(g.players.map(p=>p.login),['charlie','delta']);});
test('Spectator spam and simulation cannot control a live active pilot',()=>{const g=battle();assert.equal(g.command(user('alpha','!fire',true)).ok,false);assert.equal(g.players[0].energy,100);for(let i=0;i<100;i++)g.command(user('noise','hello world'));assert.equal(g.profiles.has('noise'),false);});
test('A full simulated battle completes without corrupting armour or ranks',()=>{const g=new Arena({training:true});g.control('demo');advance(g,100);assert.equal(g.phase,'lobby');assert.equal(g.stats.size,0);assert.ok(g.events.some(e=>e.type==='finish'));});

test('Default battle ends at 30 seconds after its launch countdown',()=>{const g=battle();assert.equal(g.roundLength,30);assert.ok(g.remaining<=30&&g.remaining>29.8);advance(g,29.7);assert.equal(g.phase,'battle');advance(g,.4);assert.equal(g.phase,'result');assert.equal(g.result.reason,'Time limit · remaining armour');});

test('First !versus starts a persistent calling screen; next distinct chatter locks both pilots',()=>{
  const g=new Arena();assert.equal(g.command(user('Alpha','!VeRsUs')).ok,true);
  assert.equal(g.phase,'calling');assert.equal(g.snapshot().caller.login,'alpha');assert.equal(g.round,0);assert.equal(g.players.length,0);
  advance(g,70);assert.equal(g.phase,'calling');assert.equal(g.command(user('ALPHA','!versus')).ok,false);
  assert.equal(g.command(user('bravo','!versus')).ok,true);assert.equal(g.phase,'countdown');assert.equal(g.remaining,10);
  assert.equal(g.caller,null);assert.deepEqual(g.players.map(p=>p.login),['alpha','bravo']);
  assert.equal(g.command(user('charlie','!versus')).ok,false);assert.deepEqual(g.players.map(p=>p.login),['alpha','bravo']);
});
test('Calling splash survives a snapshot refresh and other queue entries cannot take the seat',()=>{
  const g=new Arena();g.command(user('alpha','!versus'));g.command(user('bravo','!join'));g.command(user('charlie','!join'));advance(g,2);
  assert.equal(g.phase,'calling');const reconnect=JSON.parse(JSON.stringify(g.snapshot()));assert.equal(reconnect.caller.name,'alpha');assert.equal(reconnect.countdownLength,10);
  assert.equal(g.command(user('delta','!versus')).ok,true);assert.deepEqual(g.players.map(p=>p.login),['alpha','delta']);assert.equal(g.queue.length,0);
});
test('No weapons fire during the 10-second countdown; battle receives its own 30-second timer',()=>{
  const g=new Arena();g.command(user('alpha','!versus'));g.command(user('bravo','!versus'));
  advance(g,9.9);assert.equal(g.phase,'countdown');assert.equal(g.shots.length,0);assert.ok(g.remaining>.09);
  assert.equal(g.command(user('alpha','!fire')).ok,false);g.tick(.1);assert.equal(g.phase,'battle');assert.equal(g.remaining,30);assert.equal(g.shots.length,0);
  assert.deepEqual(g.events.filter(e=>e.type==='countdown').map(e=>e.remaining),[10,9,8,7,6,5,4,3,2,1]);
  advance(g,3.8);assert.equal(g.shots.length,0);advance(g,.3);assert.ok(g.shots.length>0);
});
test('Calling pilot can leave, host can cancel, and neither action records a result',()=>{
  const g=new Arena();g.command(user('alpha','!versus'));advance(g,1);g.command(user('alpha','!leave'));assert.equal(g.phase,'lobby');assert.equal(g.stats.size,0);
  g.now=()=>g.cooldownUntil;assert.equal(g.command(user('bravo','!versus')).ok,true);g.control('cancel');assert.equal(g.phase,'lobby');assert.equal(g.caller,null);assert.equal(g.stats.size,0);
  g.now=()=>g.cooldownUntil;assert.equal(g.command(user('charlie','!versus')).ok,true);g.control('clear');assert.equal(g.phase,'lobby');assert.equal(g.caller,null);
});
test('Entry and pause controls apply to calling; pilot cannot change ships while reserved',()=>{
  const g=new Arena();g.control('open');assert.equal(g.command(user('alpha','!versus')).ok,false);g.control('open');advance(g,1);
  g.command(user('alpha','!versus'));advance(g,1);assert.equal(g.command(user('alpha','!ship phantom')).ok,false);
  g.control('pause');const time=g.time;advance(g,10);assert.equal(g.time,time);assert.equal(g.command(user('bravo','!versus')).ok,false);
  g.control('pause');advance(g,1);g.control('open');assert.equal(g.command(user('bravo','!versus')).ok,false);assert.equal(g.phase,'calling');
  g.control('open');advance(g,1);assert.equal(g.command(user('bravo','!versus')).ok,true);
});
test('Training and live chatter cannot claim one another’s call',()=>{
  const g=new Arena({training:true});g.command(user('alpha','!versus',true));assert.equal(g.command(user('bravo','!versus')).ok,false);assert.equal(g.phase,'calling');
  advance(g,1);assert.equal(g.command(user('bravo','!versus',true)).ok,true);g.finish(0);assert.equal(g.stats.size,0);
});
test('Demo previews the call before its automatic challenger and can be cancelled',()=>{
  const g=new Arena({training:true});g.control('demo');assert.equal(g.phase,'calling');assert.equal(g.caller.name,'NOVA');advance(g,4.1);assert.equal(g.phase,'countdown');assert.equal(g.players[1].name,'REAPER');
  const h=new Arena({training:true});h.control('demo');h.control('cancel');advance(h,20);assert.equal(h.phase,'lobby');assert.equal(h.players.length,0);
});


test('45-minute cooldown is global, challenger-exempt and survives cancellation/restart',()=>{
  let now=1000000,saved=0;const g=new Arena({now:()=>now,onCooldown:until=>saved=until});
  assert.equal(g.command(user('alpha','!versus')).ok,true);assert.equal(saved,3700000);
  assert.equal(g.command(user('bravo','!versus')).ok,true);assert.equal(saved,3700000);
  g.control('cancel');advance(g,8.1);assert.match(g.command(user('charlie','!versus')).message,/45 minutes/);
  const h=new Arena({now:()=>now,cooldownUntil:saved});h.control('pause');now+=1800000;
  assert.equal(h.snapshot().cooldownRemaining,900);now+=899999;
  assert.equal(h.snapshot().cooldownRemaining,1);h.control('pause');assert.equal(h.command(user('delta','!versus')).ok,false);
  now++;assert.equal(h.command(user('echo','!versus')).ok,true);assert.equal(h.cooldownUntil,6400000);
});
test('Cancelling a call retains cooldown; training never consumes it',()=>{
  const g=new Arena({now:()=>1000000});g.command(user('alpha','!versus'));g.control('cancel');
  assert.equal(g.command(user('bravo','!versus')).ok,false);const until=g.cooldownUntil;
  assert.equal(g.control('demo').ok,false);const training=new Arena({training:true});training.control('demo');advance(training,14.1);training.finish(0);assert.equal(g.cooldownUntil,until);assert.equal(training.cooldownUntil,0);assert.equal(training.result.rewards.length,0);
});
test('Live winner receives 50 once and runner-up creates no payment, bound to captured Twitch IDs',()=>{
  const awards=[];const g=new Arena({onRewards:r=>awards.push(...r)});
  g.command({...user('alpha','!versus'),userId:'111'});g.command({...user('bravo','!versus'),userId:'222'});advance(g,10.1);
  g.finish(1);g.finish(1);assert.deepEqual(awards.map(r=>[r.userId,r.role,r.amount]),[['222','winner',50]]);
  assert.equal(new Set(awards.map(r=>r.id)).size,1);assert.ok(awards.every(r=>r.status==='pending'));
});
test('Draws, host cancellation and pre-launch forfeits never create payouts',()=>{
  for(const kind of ['draw','cancel','prelaunch']){const awards=[];const g=new Arena({onRewards:r=>awards.push(...r)});
    g.command({...user('alpha','!versus'),userId:'111'});g.command({...user('bravo','!versus'),userId:'222'});
    if(kind!=='prelaunch')advance(g,10.1);if(kind==='cancel')g.control('cancel');else g.finish(kind==='draw'?null:0);
    assert.equal(awards.length,0);
  }
});

test('Only a standalone !versus starts a live call; timers and unrelated text stay idle',()=>{
 const g=new Arena({now:()=>1000});
 for(const text of ['hello','!versus is ready','!versus @alpha','!versus!','say !versus','!fire','!shield']){g.command(user('alpha',text));advance(g,1);assert.equal(g.phase,'lobby');}
 g.tick(7200);assert.equal(g.phase,'lobby');assert.equal(g.round,0);
 assert.equal(g.command(user('alpha','  !VeRsUs  ')).ok,true);g.tick(7200);assert.equal(g.phase,'calling');assert.equal(g.round,0);
 assert.equal(g.command(user('bravo','!versus')).ok,true);assert.equal(g.phase,'countdown');
});
test('Legacy pending queues, accepted matches and demo timers cannot launch live matches',()=>{
 let now=1000;const g=new Arena({now:()=>now,cooldownUntil:2000});
 const pair=[{login:'alpha',ship:'interceptor',demo:false},{login:'bravo',ship:'sentinel',demo:false}];
 g.queue=pair;g.matches=[pair];now=10000;g.tick(100);assert.equal(g.phase,'lobby');assert.equal(g.round,0);
 assert.equal(g.control('demo').ok,false);assert.equal(g.command(user('fake','!versus',true)).ok,false);
 g.control('clear');assert.equal(g.command(user('real','!versus')).ok,true);
 g.demoChallenger={at:0,pilot:{login:'fake',ship:'sentinel',demo:true}};g.tick(100);assert.equal(g.phase,'calling');assert.equal(g.players.length,0);
});
