// 2.35.2: a Tier 2 / Tier 3 sub or resub must not move a member in a higher Voyager tier down. Both fast-track actions
// start with "User in Group" checks that Break before anything is changed.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const load=async f=>{const raw=Buffer.from((await readFile(new URL('../'+f,import.meta.url),'utf8')).trim(),'base64');assert.equal(raw.subarray(0,4).toString(),'SBAE');return JSON.parse(gunzipSync(raw.subarray(4)).toString('utf8').replace(/^﻿/,''));};
const guards=a=>{const out=[];for(let i=0;i<a.subActions.length;i+=2){const c=a.subActions[i],f=a.subActions[i+1];if(c.type!==558)break;
  assert.equal(c.userLogin,'%user%');assert.equal(f.type,120);assert.equal(f.input,'%inGroup%');assert.equal(f.operation,0);assert.equal(f.value,'True');
  assert.equal(f.subActions[0].type,99901);assert.equal(f.subActions[0].subActions[0].type,124,'the true branch breaks');assert.equal(f.subActions[1].type,99902);assert.equal(f.subActions[1].subActions.length,0);out.push(c.groupName);}
  return out;};
for(const file of ['Voyager_Fast_Track_Keep_Tier_Update.sb','Voyager_Points_Tracking_Update.sb'])test(file+': fast tracks stop for members already in a higher tier',async()=>{
  const d=await load(file),by=n=>d.data.actions.find(a=>a.name===n),silver=by('SILVER FAST TRACK'),gold=by('GOLD FAST TRACK');
  assert.deepEqual(guards(silver),['GOLD GROUP','PLATINUM GROUP']);assert.deepEqual(guards(gold),['PLATINUM GROUP']);
  for(const [a,n,group] of [[silver,4,'SILVER GROUP'],[gold,2,'GOLD GROUP']]){
    assert.deepEqual(a.subActions.map(s=>s.index),a.subActions.map((_,i)=>i),'indexes run in order');
    assert.equal(a.subActions[n].type,123);assert.equal(a.subActions[n].value,'fast_track');assert.equal(a.subActions[n+1].type,553);assert.equal(a.subActions[n+1].groupName,group,'the group is only joined after the checks');
    assert.deepEqual(a.triggers.filter(t=>t.enabled).map(t=>t.type).sort(),[103,104],'still Twitch Sub and Resub');}
  if(file.startsWith('Voyager_Fast'))assert.deepEqual(d.data.actions.map(a=>a.name).sort(),['GOLD FAST TRACK','SILVER FAST TRACK']);
  else assert.equal(d.data.actions.length,17);
});
