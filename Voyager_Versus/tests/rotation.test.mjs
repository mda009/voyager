import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Rotation,normalizeRotation} from '../local/rotation.mjs';

const dir=()=>mkdtemp(join(tmpdir(),'voyager-rotation-'));

test('Timed sources: settings are checked; a source shows for showSeconds then hides for hideSeconds, repeating from the anchor',async()=>{
  assert.deepEqual(normalizeRotation({items:[{name:' SC Ref ',showSeconds:30,hideSeconds:600}]}).items,[{name:'SC Ref',enabled:true,showSeconds:30,hideSeconds:600}]);
  assert.throws(()=>normalizeRotation({items:[{name:'A',showSeconds:1,hideSeconds:600}]}),/Show for/);
  assert.throws(()=>normalizeRotation({items:[{name:'A',showSeconds:30,hideSeconds:600},{name:'a',showSeconds:30,hideSeconds:600}]}),/twice/);
  let now=1000000;const sent=[];let n=0;
  const r=await new Rotation({dataDir:await dir(),now:()=>now,run:async a=>{sent.push({...a,at:now});return {ok:true,message:'sent'};},uuid:()=>'r'+(++n)}).load();
  assert.equal(r.seeded,true,'no file yet');
  r.configure({items:[{name:'SC Ref',showSeconds:30,hideSeconds:600}]});
  assert.equal(r.wanted(r.settings.items[0]),true,'the cycle starts showing');
  await r.tick({connected:true});assert.equal(sent.length,1);assert.equal(sent[0].stagePhase,'show');assert.deepEqual(JSON.parse(sent[0].stageSources),['SC Ref']);assert.equal(sent[0].stageScene,'');
  await r.tick({connected:true});assert.equal(sent.length,1,'no repeat while nothing changes');
  now+=29000;await r.tick({connected:true});assert.equal(sent.length,1);
  now+=2000;await r.tick({connected:true});assert.equal(sent.length,2);assert.equal(sent[1].stagePhase,'hide','hidden after 30 s');
  now+=598000;await r.tick({connected:true});assert.equal(sent.length,2);
  now+=2000;await r.tick({connected:true});assert.equal(sent.length,3);assert.equal(sent[2].stagePhase,'show','back after 10 minutes');
  const v=r.view();assert.equal(v.items[0].showing,true);assert.ok(v.items[0].nextChange>now&&v.items[0].nextChange<=now+30000);assert.equal(v.items[0].sent,true);
  // the action's answer lands on the item
  r.result({phase:'show',requestId:'r3',ok:false,message:"Not found in 'MDA Solo': SC Ref."});assert.match(r.view().items[0].obs.message,/Not found/);assert.equal(r.view().items[0].obs.ok,false);
  // settings persist; the anchor survives a restart so the cycle does not restart on every host start
  await r.saving;const again=await new Rotation({dataDir:r.dataDir,now:()=>now}).load();assert.equal(again.settings.items[0].hideSeconds,600);assert.equal(again.anchor,r.anchor);assert.equal(again.seeded,false);
});

test('Timed sources: nothing is touched while the stage is up; the current state is sent again when it comes down, and when Streamer.bot returns',async()=>{
  let now=5000;const sent=[];
  const r=await new Rotation({dataDir:await dir(),now:()=>now,run:async a=>{sent.push(a);return {ok:true};}}).load();
  r.configure({items:[{name:'SC Ref',showSeconds:30,hideSeconds:600},{name:'Off one',showSeconds:30,hideSeconds:600,enabled:false}]});
  await r.tick({connected:true});assert.equal(sent.length,1,'disabled items are left alone');
  await r.tick({stageUp:true,connected:true});assert.equal(r.view().suspended,true);
  now+=40000;await r.tick({stageUp:true,connected:true});assert.equal(sent.length,1,'no cue while the stage owns the scene');
  await r.tick({stageUp:false,connected:true});assert.equal(sent.length,2);assert.equal(sent[1].stagePhase,'hide','state said again once the stage is down (it is past the 30 s now)');
  await r.tick({connected:false});assert.equal(sent.length,2,'offline: nothing');
  now+=600000;await r.tick({connected:false});await r.tick({connected:true});assert.equal(sent.length,3);assert.equal(sent[2].stagePhase,'show');
  const t=await r.test('SC Ref',false);assert.equal(t.ok,true);assert.equal(sent[3].stagePhase,'hide');await r.tick({connected:true});assert.equal(sent.length,5,'a test does not move the cycle: the cycle re-asserts itself');
});
