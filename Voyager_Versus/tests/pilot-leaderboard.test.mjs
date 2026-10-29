import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotLeaderboard,pilotSnapshot,PILOT_STORE} from '../local/pilot-leaderboard.mjs';
const pilot=(login,wins=3,losses=1,draws=0)=>({login,name:login,wins,losses,draws,battles:wins+losses+draws});
test('Saved rankings: ties, invalid records and top 100',()=>{
 const s=pilotSnapshot([pilot('alpha',4,3),pilot('bravo',4,1),pilot('third',2),{...pilot('bad'),wins:-1},pilot('alpha')]);
 assert.deepEqual(s.rows.map(p=>p.login),['bravo','alpha','third']);assert.equal(s.invalidRecords,2);
 const many=pilotSnapshot(Array.from({length:130},(_,i)=>pilot('pilot'+i,i,1)));assert.equal(many.rows.length,100);assert.equal(many.totalRecords,130);assert.equal(many.rows[0].wins,129);assert.equal(many.rows.at(-1).wins,30);
 assert.throws(()=>pilotSnapshot([{login:'invalid'}]),/retained/);assert.equal(pilotSnapshot([]).rows.length,0);
});
test('Publish, confirm, heartbeat, match changes and reconnect independent of rewards',async()=>{
 let now=100000,global,calls=[];const records=[pilot('alpha')];
 const bot={generation:1,status:{connected:true},request:async(type,data)=>{calls.push(type);
  if(type==='GetActions')return{status:'ok',actions:[{enabled:true,name:'Voyager - Leaderboard Panel',id:'panel'}]};
  if(type==='DoAction'){assert.equal(data.args.leaderboardPanelOperation,'publishPilots');global={schema:1,requestId:data.args.requestId,...JSON.parse(data.args.pilotLeaderboardJson)};return{status:'ok'};}
  if(type==='GetGlobal'){assert.equal(data.variable,PILOT_STORE);assert.equal(data.persisted,true);return{status:'ok',variable:{value:JSON.stringify(global)}};}throw Error(type);
 }};
 const p=new PilotLeaderboard({bot,records:()=>records,now:()=>now,pollMs:1,timeout:5});await p.tick();assert.equal(p.lastSync,now);assert.match(p.message,/1 pilots synced/);assert.equal(calls.length,3);
 await p.tick();assert.equal(calls.length,3);records.push(pilot('bravo',10));p.changed();await p.tick();assert.equal(global.rows[0].login,'bravo');
 now+=60001;await p.tick();assert.equal(p.lastSync,now);bot.status.connected=false;await p.tick();assert.match(p.message,/disconnected/);bot.status.connected=true;await p.tick();assert.match(p.message,/2 pilots synced/);
});
test('Missing history cannot clear rankings; missing action and unconfirmed saves visible',async()=>{
 let calls=0;const bot={status:{connected:true},request:async(type)=>{calls++;return type==='GetActions'?{status:'ok',actions:[]}:{status:'ok'};}};
 const p=new PilotLeaderboard({bot,records:()=>null});await p.tick();assert.equal(calls,0);assert.match(p.message,/restore/);
 const missing=new PilotLeaderboard({bot,records:()=>[pilot('alpha')]});await missing.tick();assert.match(missing.message,/Install one enabled/);
 bot.request=async(type)=>type==='GetActions'?{status:'ok',actions:[{enabled:true,name:'Voyager - Leaderboard Panel',id:'panel'}]}:{status:'ok'};
 const unconfirmed=new PilotLeaderboard({bot,records:()=>[pilot('alpha')],pollMs:1,timeout:3});await unconfirmed.tick();assert.equal(unconfirmed.lastSync,0);assert.match(unconfirmed.message,/not confirmed/);
});
