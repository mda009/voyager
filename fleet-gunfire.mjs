import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {lowerBound,upperBound} from './fleet-performance.mjs';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),Y=V(0,1,0);
// Deterministic, finite-speed rounds: the flash, recoil and impact share one shot clock.
export class PulseBattery {
 constructor(parent,{rounds=160,muzzles=64,hits=96,sparks=512,calibre=1}={}){this.calibre=calibre;this.root=new T.Group();this.root.name='Ballistic rounds / timed muzzle and hull impacts';parent.add(this.root);this.shots=[];this.m=new T.Matrix4();this.q=new T.Quaternion();this.p=V();this.s=V();this.dir=V();this.activeMuzzles=0;this.activeHits=0;this.indexDirty=true;this.sortedShots=[];this.gunShots=new Map();this.maxFlight=0;this.colours=[new T.Color(0xffd29c),new T.Color(0xaedfff)];
 const batch=(geo,color,n,transparent=false,opacity=1)=>{const m=new T.InstancedMesh(geo,new T.MeshBasicMaterial({color,toneMapped:false,transparent,opacity,depthWrite:!transparent}),n);m.instanceMatrix.setUsage(T.DynamicDrawUsage);m.frustumCulled=false;m.count=0;this.root.add(m);return m;};
 const tube=new T.CylinderGeometry(1,1,1,8),cone=new T.ConeGeometry(1,1,12),orb=new T.SphereGeometry(1,12,8);
 this.rounds=batch(tube,0xfff5d7,rounds);this.halo=batch(tube,0xffaa61,rounds,true,.26);this.flashes=batch(cone,0xffedc8,muzzles,true,.8);this.hitFlashes=batch(orb,0xffd09a,hits,true,.8);this.sparks=batch(tube,0xffc483,sparks,true,.8);
 this.lights=[0,1].map(()=>{const l=new T.PointLight(0xffc68c,0,15,2);this.root.add(l);return l;});
 }
 schedule({start,end,interval=.7,burst=3,spacing=.085,muzzle,target,speed=95,side=0,gun=0}){
  this.indexDirty=true;
  for(let t=start;t<end;t+=interval)for(let b=0;b<burst;b++){const at=t+b*spacing;if(at>=end)continue;const from=muzzle(at,b).clone(),to=target(at,b).clone(),direction=to.clone().sub(from),distance=direction.length();direction.normalize();this.shots.push({at,hit:at+distance/speed,from,to,direction,speed,side,gun});}
 }
 index(){if(!this.indexDirty)return;this.sortedShots=this.shots.slice().sort((a,b)=>a.at-b.at);this.gunShots.clear();this.maxFlight=0;for(const s of this.sortedShots){if(!this.gunShots.has(s.gun))this.gunShots.set(s.gun,[]);this.gunShots.get(s.gun).push(s);this.maxFlight=Math.max(this.maxFlight,s.hit-s.at);}this.indexDirty=false;}
 recoil(gun,t){this.index();let r=0;const shots=this.gunShots.get(gun);if(!shots)return r;const end=upperBound(shots,t);for(let i=lowerBound(shots,t-.17);i<end;i++){const a=t-shots[i].at;if(a<.17)r=Math.max(r,Math.exp(-a*22)*.25);}return r;}
 put(mesh,index,p,d,w,l){this.q.setFromUnitVectors(Y,d);this.s.set(w,l,w);this.m.compose(p,this.q,this.s);mesh.setMatrixAt(index,this.m);}
 update(t){let n=0,f=0,h=0,k=0;this.lights.forEach(l=>l.intensity=0);this.root.visible=true;
 this.index();const start=lowerBound(this.sortedShots,t-this.maxFlight-.38),end=upperBound(this.sortedShots,t);this.scannedShots=end-start;
 for(let i=start;i<end;i++){const shot=this.sortedShots[i],age=t-shot.at,life=shot.hit-shot.at;if(age<0||age>life+.38)continue;
  if(age<life&&n<this.rounds.instanceMatrix.count){const length=Math.min(1.6*this.calibre,shot.speed*life*.09),d=Math.max(.03,age*shot.speed);this.p.copy(shot.from).addScaledVector(shot.direction,d);this.put(this.rounds,n,this.p,shot.direction,.026*this.calibre,length);this.put(this.halo,n,this.p,shot.direction,.09*this.calibre,length*1.18);const c=this.colours[shot.side?1:0];this.rounds.setColorAt(n,c);this.halo.setColorAt(n,c);n++;}
  if(age<.065&&f<this.flashes.instanceMatrix.count){const fade=1-age/.065;this.p.copy(shot.from).addScaledVector(shot.direction,.32);this.put(this.flashes,f++,this.p,shot.direction,.2*fade*this.calibre,.7*fade*this.calibre);const light=this.lights[shot.side%2];light.position.copy(shot.from);light.intensity=Math.max(light.intensity,fade*24);}
  const since=t-shot.hit;if(since>=0&&since<.38&&h<this.hitFlashes.instanceMatrix.count){const fade=1-since/.38;this.put(this.hitFlashes,h++,shot.to,shot.direction,.1+since*.4,.15+since*.6);for(let j=0;j<6&&k<this.sparks.instanceMatrix.count;j++){const a=j*2.3999+shot.at*8;this.dir.set(Math.cos(a),Math.sin(a*1.7),Math.sin(a)).addScaledVector(shot.direction,-1.3).normalize();this.p.copy(shot.to).addScaledVector(this.dir,since*(2+j*.8));this.put(this.sparks,k++,this.p,this.dir,.012*fade,.1+fade*.22);}}
 }
 for(const [mesh,count]of [[this.rounds,n],[this.halo,n],[this.flashes,f],[this.hitFlashes,h],[this.sparks,k]]){mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
 this.activeMuzzles=f;this.activeHits=h;
 }
 hide(){this.root.visible=false;this.lights.forEach(l=>l.intensity=0);}
 diagnostic(){return {gunRounds:this.rounds.count,muzzleFlashes:this.activeMuzzles,gunImpacts:this.activeHits,weaponTiming:'finite-speed / muzzle-to-impact',scheduledRounds:this.shots.length,scannedRounds:this.scannedShots||0};}
}

export class HeroWeapons {
 constructor(hero,maps){this.root=new T.Group();this.root.name='Polaris articulated dorsal batteries';hero.add(this.root);this.mounts=[V(-7,2.8,-1.4),V(-4,2.53,1.4)];this.heads=[];this.barrels=[];
 const steel=new T.MeshPhysicalMaterial({color:0x85939f,metalness:.87,roughness:.35,normalMap:maps.normalMap,normalScale:new T.Vector2(.3,.3)}),dark=new T.MeshStandardMaterial({color:0x23323f,metalness:.7,roughness:.55});
 for(const p of this.mounts){const base=new T.Mesh(new T.CylinderGeometry(.6,.75,.3,24),steel);base.position.copy(p);this.root.add(base);const head=new T.Group();head.position.copy(p).add(V(0,.34,0));this.root.add(head);const housing=new T.Mesh(new T.BoxGeometry(1,.55,1.05),dark);head.add(housing);const pair=[];for(const z of [-.23,.23]){const g=new T.Group();g.position.z=z;head.add(g);const barrel=new T.Mesh(new T.CylinderGeometry(.08,.13,1.65,16),steel);barrel.rotation.z=-Math.PI/2;barrel.position.x=.95;g.add(barrel);for(const x of [.4,1.66]){const collar=new T.Mesh(new T.TorusGeometry(.12,.035,8,16),dark);collar.rotation.y=Math.PI/2;collar.position.x=x;g.add(collar);}const opening=new T.Mesh(new T.CircleGeometry(.08,12),dark);opening.rotation.y=Math.PI/2;opening.position.x=1.79;g.add(opening);pair.push(g);}this.heads.push(head);this.barrels.push(pair);}
 }
 pose(t){return {position:V(-4+Math.sin(t*.28)*.9,Math.sin(t*.38)*.35,0),q:new T.Quaternion().setFromEuler(new T.Euler(Math.sin(t*.35)*.012,-.08+Math.sin(t*.23)*.025,Math.sin(t*.3)*.018))};}
 muzzleAt(i,t,b=0){const {position,q}=this.pose(t),target=V(25,2,-12).sub(position).applyQuaternion(q.clone().invert()),mount=this.mounts[i].clone().add(V(0,.34,0)),aim=new T.Quaternion().setFromUnitVectors(V(1,0,0),target.sub(mount).normalize());return V(1.8,0,b%2?.23:-.23).applyQuaternion(aim).add(mount).applyQuaternion(q).add(position);}
 update(stage,t,hero,battery){this.root.visible=stage!==1||t>=11;if(!this.root.visible)return;const target=hero.worldToLocal(V(25,2,-12));this.heads.forEach((head,i)=>{head.quaternion.setFromUnitVectors(V(1,0,0),stage===4?target.clone().sub(head.position).normalize():V(1,0,0));this.barrels[i].forEach(b=>b.position.x=stage===4?-battery.recoil(i,t):0);});}
}
