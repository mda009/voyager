import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.min.js';
import {ShipRenderer} from '../dist/ships-3d.mjs';
import {FlightMotion} from '../dist/flight-motion.mjs';

// Exercise the production arena transforms without creating a WebGL context.
function renderer(){
  const models=new Map();
  return {
    ready:true,activeModels:[],mountIndex:[0,0],canvas:{},scene:{},camera:{},
    clearModels(){},resize(){},weapons(){},renderer:{render(){}},
    model(key,slot){
      const id=key+':'+slot;
      if(!models.has(id)){
        const g=new T.Group();
        g.userData={thrusters:new T.Group(),manoeuvring:new T.Group(),
          cannons:[new T.Vector3(149,20,0)],missiles:[new T.Vector3(80,0,0)]};
        models.set(id,g);
      }
      return models.get(id);
    }
  };
}
function draw(r,m,key='interceptor'){
  ShipRenderer.prototype.arena.call(r,{drawImage(){}},1600,900,
    [{ship:key},{ship:key}],m.pilots,{phase:'battle'},m.time,m.activity);
}
function checkUpright(r){
  for(let i=0;i<2;i++){
    const q=r.activeModels[i].quaternion;
    const nose=new T.Vector3(1,0,0).applyQuaternion(q);
    const up=new T.Vector3(0,1,0).applyQuaternion(q);
    assert.ok((i===0?nose.x:-nose.x)>.9,'nose must point toward the opponent');
    assert.ok(up.y>.4,'cockpit and dorsal side must remain above the belly');
    assert.ok(up.z>.5,'both ships must show their dorsal side to the camera');
  }
}
test('all three ship types face each other upright throughout normal flight',()=>{
  const r=renderer(),m=new FlightMotion();
  for(let frame=0;frame<3600;frame++){
    m.advance(1/60,'battle');
    if(frame%30===0)for(const key of ['interceptor','sentinel','phantom']){
      draw(r,m,key);checkUpright(r);
    }
  }
});
test('challenger dodge returns upright and rendering does not accumulate half-turns',()=>{
  const r=renderer(),m=new FlightMotion();m.event({type:'dodge',pilot:1});
  for(let i=0;i<120;i++){m.advance(1/60,'battle');draw(r,m);}
  checkUpright(r);const q=r.activeModels[1].quaternion.clone();
  for(let i=0;i<100;i++)draw(r,m);
  assert.ok(q.angleTo(r.activeModels[1].quaternion)<1e-7);
});
test('weapon mounts follow the turned challenger and keep their top-side offset',()=>{
  const r=renderer(),m=new FlightMotion();draw(r,m);
  for(let i=0;i<2;i++){
    const pose=m.pilots[i],gun=ShipRenderer.prototype.muzzle.call(r,i,'fire',pose);
    assert.ok((i===0?gun.x-pose.x:pose.x-gun.x)>150);
    assert.ok(gun.y<pose.y,'a dorsal gun mount must remain above the ship centre');
  }
});
