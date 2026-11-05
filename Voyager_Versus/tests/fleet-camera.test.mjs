import test from 'node:test';import assert from 'node:assert/strict';
import {FleetCamera} from '../local/fleet-camera.mjs';
function make(){let t=1_000_000;const sent=[];const c=new FleetCamera({run:async a=>{sent.push(a);return {ok:true,message:'Sent'};},now:()=>t,uuid:()=>'11111111-2222-3333-4444-555555555555'});return {c,sent,tick:async ms=>{t+=ms;await c.tick();},set:ms=>{t=ms;}};}
const state=(over={})=>({schema:1,enabled:true,backendVersion:'1.8',camera:{enabled:true,source:'Brio cam',scene:'',hold:1.5},queue:[{id:'e1',stage:6,startAt:1_000_500,endAt:1_010_500}],...over});
test('sends a start cue when an alert begins and an end cue after the alert plus the hold',async()=>{
  const {c,sent,tick}=make();c.receive({serverAt:1_000_000,state:state()});
  await c.tick();assert.equal(sent.length,0,'not started yet');
  await tick(600);assert.equal(sent.length,1);assert.equal(sent[0].fleetOperation,'playback');assert.equal(sent[0].fleetEventId,'e1');assert.equal(sent[0].fleetPhase,undefined);assert.match(sent[0].requestId,/^[0-9a-f-]{36}$/);
  await tick(5000);assert.equal(sent.length,1,'no repeat');
  await tick(5000);assert.equal(sent.length,1,'hold not over');
  await tick(1500);assert.equal(sent.length,2);assert.equal(sent[1].fleetPhase,'end');
  await tick(5000);assert.equal(sent.length,2,'end sent once');assert.equal(c.view().last.phase,'end');assert.equal(c.view().pending,0);
});
test('does nothing when the camera spotlight is off, alerts are disabled, the C# is old or the state is stale',async()=>{
  for(const over of [{camera:{enabled:false,source:'Brio cam'}},{enabled:false},{backendVersion:'1.6'},{camera:{enabled:true,source:''}}]){const {c,sent,tick}=make();c.receive({serverAt:1_000_000,state:state(over)});await tick(600);assert.equal(sent.length,0,JSON.stringify(over));}
  const {c,sent,tick}=make();c.receive({serverAt:1_000_000,state:state()});await tick(61_000);assert.equal(sent.length,0,'stale state');
});
test('skips alerts that started more than 5 s ago (the camera was never shown) and uses the server clock offset',async()=>{
  const {c,sent,tick}=make();c.receive({serverAt:1_000_000+30_000,state:state({queue:[{id:'late',startAt:1_020_000,endAt:1_040_000},{id:'fresh',startAt:1_029_000,endAt:1_045_000}]})});
  await tick(100);assert.deepEqual(sent.map(a=>a.fleetEventId),['fresh']);
});
test('reports a failed cue and keeps going',async()=>{
  let t=1_000_000;const c=new FleetCamera({run:async()=>{throw new Error('Voyager is not connected to Streamer.bot.');},now:()=>t});c.receive({serverAt:t,state:state()});t+=600;await c.tick();
  assert.equal(c.view().last.ok,false);assert.match(c.view().last.message,/not connected/);
});
