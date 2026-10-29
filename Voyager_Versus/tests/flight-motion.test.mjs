import test from 'node:test';
import assert from 'node:assert/strict';
import {FlightMotion,damp,ease} from '../dist/flight-motion.mjs';

test('flight damping is independent of the rendering frame rate',()=>{
  let at30=0,at120=0;
  for(let i=0;i<30;i++)at30=damp(at30,10,4,1/30);
  for(let i=0;i<120;i++)at120=damp(at120,10,4,1/120);
  assert.ok(Math.abs(at30-at120)<1e-10);
});
test('pause freezes position, roll and the visual clock, then resumes without a jump',()=>{
  const m=new FlightMotion();m.event({type:'dodge',pilot:0});
  for(let i=0;i<20;i++)m.advance(1/60,'battle');
  const before=structuredClone(m.pilots),time=m.time;
  for(let i=0;i<120;i++)m.advance(1/60,'battle',true);
  assert.deepEqual(m.pilots,before);assert.equal(m.time,time);
  m.advance(1/60,'battle');assert.ok(Math.abs(m.pilots[0].y-before[0].y)<4);
});
test('barrel roll completes a full turn with soft acceleration and returns to stable flight',()=>{
  const m=new FlightMotion();m.event({type:'dodge',pilot:0});
  m.advance(.01,'battle');assert.ok(m.pilots[0].roll<.001);
  for(let i=0;i<67;i++)m.advance(.02,'battle');
  assert.ok(m.pilots[0].roll===0||m.pilots[0].roll>6.28);
  m.advance(.02,'battle');assert.equal(m.pilots[0].roll,0);assert.equal(m.pilots[0].dodge,null);
  assert.equal(ease(-1),0);assert.equal(ease(2),1);
});
test('changing phases keeps ship positions continuous and a suspended tab cannot leap ahead',()=>{
  const m=new FlightMotion();for(let i=0;i<60;i++)m.advance(1/60,'lobby');
  const before=structuredClone(m.pilots),time=m.time;m.advance(10,'battle');
  assert.ok(m.time-time<=.050001);
  for(let i=0;i<2;i++)assert.ok(Math.hypot(m.pilots[i].x-before[i].x,m.pilots[i].y-before[i].y)<4);
});
