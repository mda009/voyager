import test from 'node:test';
import assert from 'node:assert/strict';
import {WeaponFX,projectilePoint,shotDuration} from '../dist/weapon-fx.mjs';
import {FlightMotion} from '../dist/flight-motion.mjs';

test('projectiles start at the gun mount and reach the target at combat resolution time',()=>{
 for(const kind of ['fire','missile'])for(const pilot of [0,1]){
  const shot={kind,pilot,from:{x:pilot?1100:500,y:470},to:{x:pilot?400:1200,y:500}};
  assert.deepEqual(projectilePoint(shot,0),{...shot.from,u:0});
  const p=projectilePoint(shot,shotDuration(kind));assert.equal(p.x,shot.to.x);assert.ok(Math.abs(p.y-shot.to.y)<1e-8);assert.equal(p.u,1);
  const later=projectilePoint(shot,10);assert.equal(later.x,shot.to.x);
 }
});
test('a guided missile accelerates away from its rack and follows a moving target',()=>{
 const shot={kind:'missile',pilot:0,from:{x:0,y:0},to:{x:800,y:100}};
 const a=projectilePoint(shot,.2),b=projectilePoint(shot,.4),c=projectilePoint(shot,.6);
 assert.ok(c.x-b.x>b.x-a.x);assert.ok(a.y<0);
 const end=projectilePoint(shot,1.05,{x:810,y:110});assert.equal(end.x,810);assert.ok(Math.abs(end.y-110)<1e-8);
});
test('pause freezes projectile travel and the launch mount never follows the firing ship',()=>{
 const m=new FlightMotion(),fx=new WeaponFX(),origin={x:500,y:490};
 fx.fire({kind:'missile',pilot:0,target:1},m.time,origin,m.pilots[1]);origin.x=0;
 m.advance(.04,'battle');const before=fx.samples(m.time,m.pilots);
 for(let i=0;i<60;i++)m.advance(.02,'battle',true);
 assert.deepEqual(fx.samples(m.time,m.pilots),before);assert.equal(before[0].from.x,500);
 m.advance(.02,'battle');assert.ok(fx.samples(m.time,m.pilots)[0].x>before[0].x);
 assert.equal(fx.samples(2,m.pilots).length,0);
});
test('effects have bounded storage and clearing a round removes old projectiles',()=>{
 const fx=new WeaponFX();for(let i=0;i<80;i++){fx.fire({kind:'fire',pilot:0,target:1},0,{x:0,y:0},{x:100,y:0});fx.impact({pilot:0},0,{x:0,y:0});}
 assert.equal(fx.shots.length,40);assert.equal(fx.impacts.length,24);fx.clear();assert.equal(fx.shots.length,0);assert.equal(fx.impacts.length,0);
});
