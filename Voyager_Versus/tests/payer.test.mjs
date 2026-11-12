import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Payer} from '../local/payer.mjs';

const dir=()=>mkdtemp(join(tmpdir(),'voyager-payer-'));
function fakeCommunity(rows){const payouts={};return {rows,payouts,payKey:(w,m,k)=>w+'|'+m+'|'+k,payables(){return rows.map(r=>({...r,status:payouts[w(r)]?.status||r.status||'owed'}));},recordPayout({week,missionId,key,status,note}){payouts[week+'|'+missionId+'|'+key]={status,note};return {ok:true};}};function w(r){return r.week+'|'+r.missionId+'|'+r.key;}}

test('Auto-pay: every owed, payable row is previewed and applied through the Points Ledger, then marked paid with the reason',async()=>{
  let now=1000;let n=0;const sent=[];let answer=null;
  const c=fakeCommunity([
    {week:100,missionId:'muster-1',key:'twitch:1',name:'Nova',reward:2,title:'Daily muster',label:'Muster',scope:'engage',payable:true},
    {week:100,missionId:'boss',key:'twitch:2',name:'Rook',reward:100,title:'Dreadnought victory',label:'Dreadnought',scope:'boss',payable:true},
    {week:100,missionId:'m1',key:'twitch:3',name:'NoAccount',reward:25,title:'Mission',label:'this week',scope:'week',payable:false},
    {week:100,missionId:'g1',key:'twitch:4',name:'Later',reward:500,title:'Goal',label:'Christmas',scope:'season',payable:false,status:'accruing'}]);
  const p=new Payer({dataDir:await dir(),community:c,now:()=>now,uuid:()=>'q'+(++n),run:async a=>{sent.push(a);answer=a;setTimeout(()=>p.resolve(a.pointsOperation==='admin_preview'?{type:'voyager.points.v1',requestId:a.requestId,ok:true,planId:'plan-'+a.requestId}:{type:'voyager.points.v1',requestId:a.requestId,ok:true,operation:'admin_apply'}),1);return {ok:true};}});
  await p.load();assert.equal(p.view().pending,2,'two rows are payable and owed');assert.equal(p.view().pendingPoints,102);
  const r=await p.tick({connected:true});assert.equal(r.paid,2);assert.equal(r.failed,0);
  assert.equal(sent.length,4);assert.equal(sent[0].pointsOperation,'admin_preview');assert.equal(sent[0].adminUserKey,'twitch:1');assert.equal(sent[0].adminDelta,'2');assert.match(sent[0].adminReason,/Daily muster \(Muster\)/);
  assert.equal(sent[1].pointsOperation,'admin_apply');assert.equal(sent[1].adminPlanId,'plan-q1');assert.equal(sent[1].adminConfirm,'APPLY');
  assert.match(sent[2].adminReason,/Voyager Dreadnought: Dreadnought victory/);
  assert.equal(c.payouts['100|muster-1|twitch:1'].status,'paid');assert.match(c.payouts['100|muster-1|twitch:1'].note,/Auto-paid/);assert.equal(c.payouts['100|boss|twitch:2'].status,'paid');
  assert.equal(c.payouts['100|m1|twitch:3'],undefined,'no points account: left for the streamer');assert.equal(c.payouts['100|g1|twitch:4'],undefined,'accruing goals wait for the run to end');
  assert.equal(await p.tick({connected:true}),null,'nothing left');assert.equal(p.view().pending,0);assert.equal(p.view().history.length,2);
});

test('Auto-pay: a refused row is marked failed with the reason and retried after 10 minutes; a dead Streamer.bot stops the run; it can be switched off',async()=>{
  let now=5000;let n=0;let mode='refuse';const sent=[];
  const c=fakeCommunity([{week:1,missionId:'a',key:'twitch:1',name:'A',reward:10,title:'T',label:'L',scope:'week',payable:true},{week:1,missionId:'b',key:'twitch:2',name:'B',reward:10,title:'T',label:'L',scope:'week',payable:true}]);
  const p=new Payer({dataDir:await dir(),community:c,now:()=>now,uuid:()=>'r'+(++n),run:async a=>{sent.push(a);if(mode==='down')return {ok:false,message:'Voyager is not connected to Streamer.bot.'};setTimeout(()=>p.resolve(mode==='refuse'?{requestId:a.requestId,ok:false,error:'Unknown user.'}:a.pointsOperation==='admin_preview'?{requestId:a.requestId,ok:true,planId:'p'}:{requestId:a.requestId,ok:true}),1);return {ok:true};}});
  let r=await p.tick({connected:true});assert.equal(r.failed,2);assert.equal(c.payouts['1|a|twitch:1'].status,'failed');assert.match(c.payouts['1|a|twitch:1'].note,/Unknown user/);
  assert.equal(p.view().pending,0,'not retried straight away');now+=RETRY();assert.equal(p.view().pending,2,'retried after 10 minutes');
  mode='down';sent.length=0;r=await p.tick({connected:true});assert.equal(r.failed,1,'stops after the first row when Streamer.bot cannot be reached');assert.equal(sent.length,1);
  now+=RETRY();mode='ok';r=await p.tick({connected:true});assert.equal(r.paid,2);
  assert.equal(await p.tick({connected:false}),null,'offline: nothing');
  p.configure({enabled:false});assert.equal(p.view().enabled,false);await p.saving;const again=await new Payer({dataDir:p.dataDir,community:c,now:()=>now}).load();assert.equal(again.enabled,false,'the switch persists');
  function RETRY(){return 10*60*1000+1;}
});
