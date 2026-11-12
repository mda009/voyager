import test from 'node:test';import assert from 'node:assert/strict';
import {reloadState} from '../dist/reload-state.mjs';

test('2.21.14 stage reload bars: fill over the cooldown, READY flashes for 1.5 s once both weapons are back, stunned and lobby override',()=>{
  const d={phase:'battle',cooldown:6},f={wasReloading:false,readyUntil:0};
  const p={name:'Ace',stunned:false,fireAt:10000+6000,shootAt:6000}; // fired at t=10000; never used the cannon
  let r=reloadState(p,d,f,10000);assert.equal(r.reloading,true);assert.equal(r.laser,0);assert.equal(r.cannon,1);assert.equal(r.text,'Ace');
  r=reloadState(p,d,f,13000);assert.equal(r.laser,.5);assert.equal(r.reloading,true);
  r=reloadState(p,d,f,16000);assert.equal(r.reloading,false);assert.equal(r.ready,true);assert.equal(r.text,'Ace · READY');
  r=reloadState(p,d,f,17400);assert.equal(r.ready,true);r=reloadState(p,d,f,17600);assert.equal(r.ready,false);assert.equal(r.text,'Ace');
  p.shootAt=18000+6000;r=reloadState(p,d,f,18000);assert.equal(r.reloading,true);assert.equal(r.cannon,0);assert.equal(r.laser,1);
  r=reloadState({...p,stunned:true},d,f,19000);assert.equal(r.reloading,false);assert.equal(r.text,'Ace · SYSTEMS DOWN');
  r=reloadState(p,{phase:'lobby',cooldown:6},{wasReloading:false,readyUntil:0},18000);assert.equal(r.reloading,false,'nothing reloads in the lobby');
  r=reloadState({name:'Old',stunned:false},{phase:'battle'},{wasReloading:false,readyUntil:0},5);assert.equal(r.reloading,false,'older host without timers: never reloading');
});
