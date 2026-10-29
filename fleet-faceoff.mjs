import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {createVessel,RAIDER_TYPES} from './fleet-vessels.mjs';

const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
const mix=T.MathUtils.lerp;
const alliedSlots=[[-27,11,-1],[-36,10,19],[-39,16,-16],[-39,7,29],[-46,18,9]];
const enemySlots=[[30,12,-20],[42,7,-5],[44,18,-38],[54,11,-18],[53,24,-51]];

// Gift-sub stage: a quiet approach to battle. All transforms depend on the
// event clock, so skipping, seeking, replaying and returning from a raid reset.
export class FleetFaceoff {
 constructor(scene,maps){
  this.root=new T.Group();this.root.name='Gift subscriptions / approaching enemy fleet';
  this.root.visible=false;scene.add(this.root);
  this.enemies=RAIDER_TYPES.map((type,i)=>{
   const ship=createVessel(type,maps,{enemy:true,serial:i+1});
   ship.scale.setScalar([.49,.32,.37,.34,.32][i]);
   this.root.add(ship);return ship;
  });
  this.phase='idle';this.visibleEnemies=0;
 }
 update(t,hero,escorts,amount){
  this.root.visible=true;
  const join=ease(t/6),ready=ease((t-6)/6),settle=ease((t-11)/4);
  const heading=.55;
  hero.scale.setScalar(.78);
  hero.position.set(mix(-30,-12,join),6+Math.sin(t*.3)*.25,6);
  hero.rotation.set(Math.sin(t*.3)*.008,mix(-.08,heading,ready),-.045*Math.sin(ready*Math.PI));
  const count=Math.min(5,Math.max(2,Math.ceil(Math.sqrt(Math.max(1,Number(amount)||1)))+1));
  escorts.forEach((ship,i)=>{
   ship.visible=i<count;if(!ship.visible)return;
   const p=ease((t-.9-i*.55)/6.4),turn=ease((t-6.4-i*.25)/5.6),slot=alliedSlots[i],side=i%2?1:-1;
   ship.scale.setScalar([.38,.36,.37,.34,.32][i]);
   ship.position.set(mix(-84-i*7,slot[0],p),mix(slot[1]+4,slot[1],p)+Math.sin(t*.35+i)*.16,mix(slot[2]+10,slot[2],p));
   ship.rotation.set(side*.025*(1-turn),mix(-.08,heading,turn),side*.13*Math.sin(turn*Math.PI));
   ship.userData.update(t+i,mix(1.05,.3,settle));
  });
  this.visibleEnemies=0;
  this.enemies.forEach((ship,i)=>{
   const start=2.5+i*.4,p=ease((t-start)/10.2),slot=enemySlots[i];
   ship.visible=t>=start;if(!ship.visible)return;
   this.visibleEnemies++;
   ship.position.set(mix(slot[0]+67+i*5,slot[0],p),mix(slot[1]+9,slot[1],p)+Math.sin(t*.22+i)*.12,mix(slot[2]-58-i*5,slot[2],p));
   // Hulls face the approaching direction, then settle on the hero's position.
   const dx=hero.position.x-ship.position.x,dz=hero.position.z-ship.position.z;
   ship.rotation.set(.018*Math.sin(t*.25+i)*(1-settle),Math.atan2(-dz,dx),.035*Math.sin(t*.4+i)*(1-settle));
   ship.userData.update(t+i*.6,mix(.95,.27,ease((t-12-i*.15)/3.5)));
  });
  this.phase=t<3?'assembling':t<11?'enemy-approach':t<14.5?'forming-battle-line':'ready-to-face-off';
  // A restrained dolly back keeps both formations in frame as the gap closes.
  return {camera:[mix(31,38,ease((t-2)/9)),mix(37,43,ease((t-2)/9)),mix(124,143,ease((t-2)/9))],look:[0,5,-9],thrust:mix(.8,.28,settle)};
 }
 diagnostic(){return {giftBackdrop:'enemy-fleet',faceoffVisible:this.root.visible,faceoffPhase:this.root.visible?this.phase:'idle',approachingEnemyModels:this.enemies.map(s=>s.userData.modelType),approachingEnemyColours:this.enemies.map(s=>s.userData.livery),approachingEnemies:this.root.visible?this.visibleEnemies:0};}
}
