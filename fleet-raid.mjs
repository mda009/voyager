import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {mergeGeometries} from './Voyager_Versus/dist/vendor/BufferGeometryUtils.mjs';
import {createVessel,RAIDER_TYPES,FIGHTER_TYPES,bevelBox,strut} from './fleet-vessels.mjs';
import {PulseBattery} from './fleet-gunfire.mjs';
import {buildMissile,impact} from './fleet-ordnance.mjs';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);},V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),X=V(1,0,0),Y=V(0,1,0);
function batch(root){const bins=new Map();return {add(g,m,p=V(),rot=new T.Euler()){g=g.index?g.toNonIndexed():g;g.applyMatrix4(new T.Matrix4().compose(p,new T.Quaternion().setFromEuler(rot),V(1,1,1)));if(!bins.has(m))bins.set(m,[]);bins.get(m).push(g);},finish(){for(const [m,gs]of bins){const mesh=new T.Mesh(mergeGeometries(gs),m);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);gs.forEach(g=>g.dispose());}}};}
function lineMatrix(a,b,r,matrix,scratch){scratch.position.copy(a).add(b).multiplyScalar(.5);scratch.quaternion.setFromUnitVectors(Y,scratch.direction.subVectors(b,a).normalize());scratch.scale.set(r,a.distanceTo(b),r);matrix.compose(scratch.position,scratch.quaternion,scratch.scale);}
function emblemTexture(){
 const canvas=document.createElement('canvas');canvas.width=4096;canvas.height=640;const c=canvas.getContext('2d');
 c.fillStyle='#071827';c.fillRect(0,0,4096,640);c.strokeStyle='#7cd8ff';c.lineWidth=12;c.strokeRect(20,20,4056,600);
 c.fillStyle='#effaff';c.textAlign='center';c.textBaseline='middle';c.font='700 286px Rajdhani, sans-serif';
 c.shadowColor='#57baff';c.shadowBlur=22;c.fillText('THE UNPROFESSIONALS',2048,278,3750);
 c.shadowBlur=0;c.font='600 83px Rajdhani, sans-serif';c.fillStyle='#91d7ff';c.fillText('VOYAGER COMMAND  /  ORBITAL DEFENCE',2048,502);
 const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;
}
// Vessel batches are in local hull coordinates. Exclude animated engine plumes.
function hullBounds(vessel){const bounds=new T.Box3();for(const mesh of vessel.children)if(mesh.isMesh){mesh.geometry.computeBoundingBox();bounds.union(mesh.geometry.boundingBox);}return bounds;}
export class RaidScene{
 constructor(scene,maps,fleetGeometry,glowMap){
 this.root=new T.Group();this.root.name='Unprofessionals base raid / 28 seconds';this.root.visible=false;scene.add(this.root);this.matrix=new T.Matrix4();this.scratch={position:V(),direction:V(),scale:V(),quaternion:new T.Quaternion()};this.point=V();this.tangent=V();this.scale=V();this.quat=new T.Quaternion();this.debrisOffset=V();this.debrisEuler=new T.Euler();this.baseOrigin=V(-28,-9,7);this.baseScale=1.3;
 const pbr=(color,rough=.52,metal=.7)=>new T.MeshStandardMaterial({color,map:maps.map,normalMap:maps.normalMap,normalScale:new T.Vector2(.35,.35),roughnessMap:maps.orm,metalness:metal,roughness:rough,envMapIntensity:.9});
 this.armour=pbr(0xa0b2c0,.65,.5);this.dark=pbr(0x27333e,.6,.8);this.blue=pbr(0x26516b,.58,.65);this.red=pbr(0x60403f,.65,.7);this.warm=new T.MeshBasicMaterial({color:0xff9f50,toneMapped:false});this.cyan=new T.MeshBasicMaterial({color:0x85dfff,toneMapped:false});this.white=new T.MeshBasicMaterial({color:0xe5f5ff,toneMapped:false});
 this.maps=maps;this.makeBase();this.makeFleet(fleetGeometry,glowMap);this.makeWeapons(maps);this.makeExplosions(glowMap);
 this.metrics={raidDuration:28,raidEnemyShips:5,raidInterceptors:6,raidTurrets:this.turrets.length,raidScheduledRounds:this.gunfire.shots.length,raidMissileLaunches:this.shots.length,raidImpactEvents:this.blasts.length,raidEnemyHullLengths:this.enemyHullLengths,raidInterceptorHullLength:this.interceptorHullLength,raidBaseScale:this.baseScale,raidBaseSign:"THE UNPROFESSIONALS",raidDefensiveRounds:this.gunfire.shots.filter(s=>s.side===1).length};
 }
 basePoint(x,y,z,target=V()){return target.set(x,y,z).multiplyScalar(this.baseScale).add(this.baseOrigin);}
 makeBase(){
 this.base=new T.Group();this.base.position.copy(this.baseOrigin);this.base.scale.setScalar(this.baseScale);this.root.add(this.base);const b=batch(this.base),add=(g,m,x,y,z,rot)=>b.add(g,m,V(x,y,z),rot);
 add(new T.CylinderGeometry(18,20,2.3,12),this.armour,0,-2,0);add(new T.CylinderGeometry(16.9,18,1.2,12),this.dark,0,-.3,0);add(new T.CylinderGeometry(12,13.5,2.3,10),this.blue,-2,1.1,-3);
 // Expanded fortress foundation, forward apron and outer defensive bastions.
 add(new T.CylinderGeometry(24,27,2.8,16),this.dark,0,-4.3,0);
 add(new T.CylinderGeometry(23.5,24,1.2,16),this.armour,0,-2.6,0);
 add(bevelBox(47,2.6,21,.5),this.armour,-1,-1.7,23);
 add(bevelBox(45,.3,19,.35),this.dark,-1,-.25,23);
 for(const [x,z]of [[-22,-15],[-23,6],[-17,24],[14,25],[23,7],[22,-17]]){
  add(new T.CylinderGeometry(4,5,2.2,8),this.blue,x,.5,z);
  add(new T.CylinderGeometry(4.1,4.1,.3,8),this.armour,x,1.7,z);
  for(let j=0;j<6;j++){const a=j*Math.PI/3;add(bevelBox(.65,.12,.4),this.cyan,x+Math.cos(a)*3.5,1.9,z+Math.sin(a)*3.5);}
 }
 for(let i=0;i<28;i++){const a=i*Math.PI/14;add(bevelBox(1.6,2.7,1.1),this.blue,Math.cos(a)*24,-3.7,Math.sin(a)*24,new T.Euler(0,-a,0));}
 // Armoured rim, ribs, landing lights and recessed maintenance strips.
 for(let i=0;i<24;i++){const a=i*Math.PI/12,x=Math.cos(a)*18.7,z=Math.sin(a)*18.7;add(new T.BoxGeometry(1.3,2.8,1),i%3?this.dark:this.armour,x,-1.5,z,new T.Euler(0,-a,0));add(new T.BoxGeometry(.9,.11,.22),this.cyan,Math.cos(a)*18.1,.2,Math.sin(a)*18.1,new T.Euler(0,-a,0));}
 for(const side of [-1,1]){add(new T.BoxGeometry(10,1.4,16),this.armour,side*20,-1,2);add(new T.BoxGeometry(8,.3,14),this.dark,side*20,-.1,2);for(let j=0;j<8;j++){add(new T.BoxGeometry(.2,.08,1),this.cyan,side*23,.1,-4+j*1.7);add(new T.BoxGeometry(1,.09,.18),this.warm,side*18,.1,-4+j*1.7);}}
 // Three launch hangars: floor, walls, roof, recessed opening and strip lighting.
 this.hangars=[];
 for(let i=0;i<3;i++){const z=-13+i*13;add(new T.BoxGeometry(26,1,12),this.armour,4,2,z);add(new T.BoxGeometry(26,.6,12.8),this.armour,4,8.8,z);for(const side of [-1,1])add(new T.BoxGeometry(26,5.8,.45),this.blue,4,5.5,z+side*6.2);add(new T.BoxGeometry(.5,5.8,12),this.dark,-9,5.5,z);for(const side of [-1,1]){add(new T.BoxGeometry(24,.09,.12),this.cyan,4,2.6,z+side*5.4);add(new T.BoxGeometry(.18,5.8,.18),this.cyan,17.2,5.5,z+side*5.9);}this.hangars.push(this.basePoint(4,5.3,z));}
 // Tiered command spire, windows, antennae, radar and utility tanks.
 for(let i=0;i<5;i++){const w=7.3-i*.8;add(new T.CylinderGeometry(w*.5,(w+.7)*.5,1.8,6),i%2?this.blue:this.armour,-15,3.5+i*1.9,-6);add(new T.CylinderGeometry(w*.51,w*.51,.15,6),this.cyan,-15,4.15+i*1.9,-6);}
 add(new T.CylinderGeometry(.17,.3,5,8),this.armour,-15,14,-6);add(new T.SphereGeometry(.4,12,8),this.cyan,-15,16.4,-6);
 for(const x of [-19,-16,-13]){add(new T.CylinderGeometry(1,1,3,12),this.dark,x,2.4,8);add(new T.TorusGeometry(1,.12,6,16),this.armour,x,3.7,8,new T.Euler(Math.PI/2,0,0));}
 for(let i=0;i<14;i++){add(new T.BoxGeometry(1.1,.12,3.4),this.dark,-12+i*1.7,.45,13);add(new T.BoxGeometry(.12,.06,2.7),this.armour,-11.6+i*1.7,.53,13);}

 // Independent hardware: pipe runs, inset panels, cooling radiator blades, ladders.
 for(let i=0;i<18;i++){const a=i*Math.PI/9,x=Math.cos(a)*16,z=Math.sin(a)*16;add(bevelBox(2.3,.22,1.3),this.dark,x,.55,z,new T.Euler(0,-a,0));for(let k=0;k<3;k++)add(bevelBox(.12,.12,1.1),this.armour,x+(k-1)*.45,.74,z,new T.Euler(0,-a,0));}
 for(const z of [8.6,10.2])b.add(strut(V(-17,1,z),V(4,1,z),.18),this.armour);
 for(const x of [-16,-13])for(let j=0;j<9;j++)add(new T.BoxGeometry(.1,2.1,4),this.dark,x+j*.24,2.4,-10);
 for(let j=0;j<9;j++)add(new T.BoxGeometry(.9,.08,.15),this.armour,-18,3+j*.8,-6.5);
 // Raised roof plates, vents and conduits break up the larger hangar roofs.
 for(const z of [-13,0,13])for(const x of [-5,3,11]){
  add(bevelBox(6.8,.12,10.4),this.blue,x,9.16,z);
  add(bevelBox(4.6,.15,1.2),this.dark,x,9.3,z-3.5);
  for(let j=0;j<7;j++)add(bevelBox(.16,.14,1.1),this.armour,x-1.8+j*.6,9.45,z-3.5);
 }
 b.finish();
 // A framed illuminated sign stands in front of the hangars, visible to the raid camera.
 this.sign=new T.Group();this.sign.name='THE UNPROFESSIONALS / illuminated base sign';this.sign.position.set(-2,8.5,31);this.sign.rotation.y=0;this.base.add(this.sign);
 const backing=new T.Mesh(bevelBox(44.8,7,.8,.2),this.blue);this.sign.add(backing);
 const sign=new T.Mesh(new T.PlaneGeometry(44,6.875),new T.MeshBasicMaterial({map:emblemTexture(),toneMapped:false}));sign.position.z=.56;this.sign.add(sign);
 for(const x of [-21.8,21.8]){const support=new T.Mesh(bevelBox(.65,8.8,.8),this.armour);support.position.set(x,-5.4,-.2);this.sign.add(support);const beacon=new T.Mesh(new T.SphereGeometry(.2,12,8),this.cyan);beacon.position.set(x,3.7,0);this.sign.add(beacon);}
 this.turrets=[];const mounts=[[-22,2,-15],[-23,2,6],[-17,2,24],[14,2,25],[23,2,7],[22,2,-17],[-2,9.4,-13],[10,9.4,-13],[-2,9.4,0],[10,9.4,0],[-2,9.4,13],[10,9.4,13]];
 for(const [i,p]of mounts.entries()){const g=new T.Group();g.position.set(p[0],p[1]+1,p[2]);this.base.add(g);const pedestal=new T.Mesh(new T.CylinderGeometry(1.8,2.2,1,10),this.dark);g.add(pedestal);const head=new T.Group();head.position.y=1;g.add(head);const armour=new T.Mesh(bevelBox(3,1.7,2.8,.2),this.armour);head.add(armour);const barrels=[],tips=[];for(const side of [-1,1]){const barrel=new T.Mesh(new T.CylinderGeometry(.18,.26,3.9,12),this.dark);barrel.rotation.x=Math.PI/2;barrel.position.set(side*.85,.3,2.5);head.add(barrel);barrels.push(barrel);const tip=new T.Mesh(new T.TorusGeometry(.2,.055,6,10),this.cyan);tip.position.set(side*.85,.3,4.48);head.add(tip);tips.push(tip);}this.turrets.push({g,head,barrels,tips,origin:this.basePoint(p[0],p[1]+2.3,p[2])});}

 this.shutters=[];for(let i=0;i<3;i++){const z=-13+i*13;for(const side of [-1,1]){const door=new T.Mesh(bevelBox(.22,5.8,6),this.dark);door.position.set(17.1,5.5,z+side*3);this.base.add(door);this.shutters.push({door,z,side});}}
 this.radars=[];for(const [x,z]of [[-18,-3],[-13,11]]){const g=new T.Group();g.position.set(x,6,z);const dish=new T.Mesh(new T.SphereGeometry(1.6,20,12,0,Math.PI*2,0,.7),this.armour);dish.rotation.z=.9;g.add(dish);const mast=new T.Mesh(new T.CylinderGeometry(.12,.2,3,8),this.dark);mast.position.y=-1.5;g.add(mast);this.base.add(g);this.radars.push(g);}
 this.shield=new T.Mesh(new T.SphereGeometry(21,40,24),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{power:{value:0}},vertexShader:'varying vec3 vN;varying vec3 vP;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;vN=normalMatrix*normal;gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 vN;varying vec3 vP;uniform float power;void main(){float edge=pow(1.-max(0.,dot(normalize(vN),normalize(-vP))),3.);gl_FragColor=vec4(.16,.6,1.,edge*power*.32);}' }));this.shield.scale.set(1.5,.72,1.5);this.shield.position.y=1.5;this.base.add(this.shield);this.base.updateMatrixWorld(true);
 }
 updateBase(t){const open=ease((t-5.6)/1.25);for(const {door}of this.shutters)door.position.y=5.5+open*6.2;this.radars.forEach((g,i)=>g.rotation.y=t*(.28+i*.1));}
 enemyPosition(i,t,target=V()){const u=ease((t-i*.25)/4),leave=ease((t-21.8-i*.18)/4.4);return target.set(36+i%2*13+(1-u)*(28+i*3)+leave*55,11+i%3*5+Math.sin(t*.31+i)*.55+leave*10,-22+i*8-leave*12);}
 interceptorPosition(i,t,target=V()){return this.fighterPaths[i].getPoint(clamp((t-this.fighterLaunch[i])/15.8),target);}
 interceptorMuzzle(i,t){return this.interceptorPosition(i,t).addScaledVector(this.fighterPaths[i].getTangent(clamp((t-this.fighterLaunch[i])/15.8)).normalize(),this.fighterNoses[i]);}
 makeFleet(geo,glowMap){
 this.enemies=[];
 for(let i=0;i<5;i++){const g=createVessel(RAIDER_TYPES[i],this.maps,{enemy:true,serial:i+1});g.rotation.y=Math.PI;g.scale.setScalar(i===0?.48:.26+i*.025);this.root.add(g);this.enemies.push(g);}
 this.enemyHullLengths=this.enemies.map(g=>hullBounds(g).getSize(V()).x*g.scale.x);
 this.interceptorHullLength=this.enemyHullLengths.reduce((sum,length)=>sum+length,0)/this.enemies.length;
 this.fighters=[];this.fighterPaths=[];this.fighterLaunch=[];this.fighterNoses=[];
 for(let i=0;i<6;i++){
  const g=createVessel(FIGHTER_TYPES[i],this.maps,{serial:i+1}),bounds=hullBounds(g);
  g.scale.setScalar(this.interceptorHullLength/bounds.getSize(V()).x);
  this.fighterNoses.push(bounds.max.x*g.scale.x+.2);this.root.add(g);this.fighters.push(g);
  // Two waves use wider bays and separated flight lanes for the larger hulls.
  const lane=i%3-1,wave=Math.floor(i/3),start=this.hangars[i%3].clone();
  this.fighterLaunch.push(7+i%3*.55+wave*2.8);
  this.fighterPaths.push(new T.CatmullRomCurve3([start,start.clone().add(V(24*this.baseScale,0,0)),V(17,7+wave*5,lane*16+7),V(24+wave*9,10+lane*3+wave*7,lane*16-6),V(39+wave*9,22+lane*2+wave*7,lane*16-4),V(25+wave*4,25+lane*3+wave*7,lane*16+12),V(-3-wave*4,23+lane*2+wave*5,lane*16+25),V(-35,18+wave*5,lane*16+35)],false,'catmullrom',.25));
 }
 }
 turretMuzzle(i,t,b=0){const origin=this.turrets[i].origin.clone(),dir=this.enemyPosition(i%5,t).sub(origin).normalize(),side=V().crossVectors(Y,dir).normalize();return origin.addScaledVector(dir,4.48*this.baseScale).addScaledVector(side,(b%2?.85:-.85)*this.baseScale);}
 baseImpact(i){return i%3===2?this.basePoint(-21+(i%5)*10,2.1,i%2?23:-19):this.basePoint(-5+(i%4)*5.5,9.5,[-13,0,13][i%3]+Math.sin(i*2.4)*3.2);}
 makeWeapons(maps){
 this.shots=[];const add=(launch,travel,start,end,side,bend)=>{const c1=start.clone().add(V(side===0?-5:7,6+bend,side===0?4:-3)),c2=end.clone().add(V(side===0?10:-10,7+bend,-3));this.shots.push({launch,hit:launch+travel,side,curve:new T.CubicBezierCurve3(start,c1,c2,end),end});};
 // Overlapping attack and defence salvos, with impacts on exposed armour and roof sections.
 for(let i=0;i<84;i++){const launch=3.1+i*.23,travel=1.85+(i%4)*.16,source=this.enemyPosition(i%5,launch).add(V(-5,-.5,0)),end=this.baseImpact(i);add(launch,travel,source,end,0,i%4);}
 for(let i=0;i<78;i++){const launch=4.8+i*.22,travel=1.9+(i%3)*.17,start=this.turretMuzzle(i%this.turrets.length,launch),end=this.enemyPosition(i%5,launch+travel);add(launch,travel,start,end,1,i%4);}
 for(let i=0;i<42;i++){const launch=11.3+i*.24,travel=1.5+(i%3)*.15,start=this.interceptorMuzzle(i%6,launch),end=this.enemyPosition((i+1)%5,launch+travel);add(launch,travel,start,end,1,2);}
 const proto=buildMissile(maps);this.missileMeshes=[];for(const child of proto.children)if(child.isMesh&&child.material.isMeshPhysicalMaterial){const mesh=new T.InstancedMesh(child.geometry,child.material,64);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;this.root.add(mesh);this.missileMeshes.push(mesh);}
 const trails=new T.CylinderGeometry(1,1,1,5);this.redTrails=new T.InstancedMesh(trails,new T.MeshBasicMaterial({color:0xff9e5d,transparent:true,opacity:.48,depthWrite:false,toneMapped:false}),768);this.blueTrails=new T.InstancedMesh(trails,new T.MeshBasicMaterial({color:0x8acfff,transparent:true,opacity:.48,depthWrite:false,toneMapped:false}),768);
 for(const mesh of [this.redTrails,this.blueTrails]){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;this.root.add(mesh);}
 this.gunfire=new PulseBattery(this.root,{rounds:384,muzzles:128,hits:192,sparks:1152,calibre:1.7});
 for(let i=0;i<this.turrets.length;i++)this.gunfire.schedule({start:4.3+i*.065,end:22.8,interval:.31,burst:5,spacing:.052,gun:i,side:1,muzzle:(t,b)=>this.turretMuzzle(i,t,b),target:(t,b)=>this.enemyPosition(i%5,t+.65).add(V((b-2)*.5,(i%3-1)*.4,0)),speed:130});
 for(let i=0;i<5;i++)this.gunfire.schedule({start:3.1+i*.12,end:22.2,interval:.39,burst:5,spacing:.06,gun:40+i,side:0,muzzle:t=>this.enemyPosition(i,t).add(V(-5,1.2,0)),target:(t,b)=>this.baseImpact(i*7+b),speed:115});
 for(let i=0;i<6;i++)this.gunfire.schedule({start:11+i*.22,end:22.3,interval:.32,burst:4,spacing:.055,gun:60+i,side:1,muzzle:t=>this.interceptorMuzzle(i,t),target:t=>this.enemyPosition(i%5,t+.45),speed:140});
 this.endPoint=V();this.beginPoint=V();
 }
 makeExplosions(glowMap){
 this.blasts=this.shots.map((s,i)=>({at:s.hit,end:s.end.clone(),scale:s.side===0?1.45:1.9,seed:i}));
 for(let i=0;i<60;i++){const at=8+i*.255,baseHit=i%3===0;this.blasts.push({at,end:baseHit?this.baseImpact(i+11):this.enemyPosition(i%5,at).add(V((i%3-1)*3,1,(i%2?2:-2))),scale:baseHit?1.65:2.5,seed:204+i});}
 // Allocate against the actual scheduled peak; this bounds draw calls and prevents dropped effects.
 this.blastCapacity=Math.max(...this.blasts.map(b=>this.blasts.filter(other=>other.at<=b.at&&other.at>=b.at-2.8).length))+2;
 this.blastPool=[];for(let i=0;i<this.blastCapacity;i++){const g=impact(i*17.3);const flash=new T.Sprite(new T.SpriteMaterial({map:glowMap,color:0xffdab0,transparent:true,depthWrite:false,toneMapped:false}));g.add(flash);const ring=new T.Mesh(new T.TorusGeometry(1,.025,6,48),new T.MeshBasicMaterial({color:0xffc98e,transparent:true,depthWrite:false,toneMapped:false,opacity:0}));g.add(ring);this.root.add(g);this.blastPool.push({g,flash,ring});}
 this.debris=new T.InstancedMesh(new T.IcosahedronGeometry(.15,0),this.dark,this.blastCapacity*12);this.debris.instanceMatrix.setUsage(T.DynamicDrawUsage);this.debris.frustumCulled=false;this.root.add(this.debris);
 this.sparkGeo=new T.BufferGeometry();this.sparkGeo.setAttribute('position',new T.BufferAttribute(new Float32Array(this.blastCapacity*40*3),3));this.sparkGeo.setAttribute('opacity',new T.BufferAttribute(new Float32Array(this.blastCapacity*40),1));this.sparks=new T.Points(this.sparkGeo,new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{height:{value:1080}},vertexShader:'attribute float opacity;varying float a;uniform float height;void main(){a=opacity;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(height*.12/-p.z,1.,5.);}',fragmentShader:'varying float a;void main(){float r=length(gl_PointCoord-.5)*2.;gl_FragColor=vec4(1.,.66,.27,a*max(0.,1.-r));}'}));this.sparks.frustumCulled=false;this.root.add(this.sparks);
 this.lights=[];for(let i=0;i<3;i++){const light=new T.PointLight(0xffb15a,0,35,2);this.root.add(light);this.lights.push(light);}
 }
 shotProgress(s,t){const p=clamp((t-s.launch)/(s.hit-s.launch));return .25*p+.75*p*p;}
 update(t,camera){
 this.root.visible=true;for(const [i,e]of this.enemies.entries()){e.visible=t<26.2;this.enemyPosition(i,t,e.position);e.rotation.set(.018*Math.sin(t*.5+i),Math.PI+ease((t-21.5)/3)*.35,Math.sin(t*.3+i)*.025);e.userData.update(t,.65+ease((t-22)/3)*.5);}
 let fighterCount=0;for(let i=0;i<6;i++){const f=this.fighters[i],age=t-this.fighterLaunch[i],u=clamp(age/15.8);f.visible=age>=0&&u<1;if(!f.visible)continue;fighterCount++;this.interceptorPosition(i,t,f.position);this.tangent.copy(this.fighterPaths[i].getTangent(u)).normalize();f.quaternion.setFromUnitVectors(X,this.tangent);f.rotateX(Math.sin(u*Math.PI*2)*.42*ease((u-.16)/.1));f.userData.update(t,.8);}
 for(const [i,turret]of this.turrets.entries()){const target=this.enemyPosition(i%5,t);turret.head.lookAt(target);}
 let missiles=0,red=0,blue=0;for(const s of this.shots){const p=this.shotProgress(s,t);if(t>=s.launch&&t<s.hit){s.curve.getPoint(p,this.point);this.tangent.copy(s.curve.getTangent(p));this.quat.setFromUnitVectors(X,this.tangent);this.scale.setScalar(.38);this.matrix.compose(this.point,this.quat,this.scale);for(const mesh of this.missileMeshes)mesh.setMatrixAt(missiles,this.matrix);missiles++;}
 if(t<s.launch||t>s.hit+.3)continue;for(let j=0;j<12;j++){const at=Math.min(t,s.hit)-j*.055;if(at<s.launch)break;s.curve.getPoint(this.shotProgress(s,at),this.beginPoint);s.curve.getPoint(this.shotProgress(s,Math.max(s.launch,at-.06)),this.endPoint);lineMatrix(this.beginPoint,this.endPoint,.045*(1-j/14),this.matrix,this.scratch);if(s.side===0)this.redTrails.setMatrixAt(red++,this.matrix);else this.blueTrails.setMatrixAt(blue++,this.matrix);}}
 for(const mesh of this.missileMeshes){mesh.count=missiles;mesh.instanceMatrix.needsUpdate=true;}for(const [mesh,count]of [[this.redTrails,red],[this.blueTrails,blue]]){mesh.count=count;mesh.instanceMatrix.needsUpdate=true;}
 this.gunfire.update(t);
 for(const [i,turret]of this.turrets.entries()){const recoil=this.gunfire.recoil(i,t);for(const barrel of turret.barrels)barrel.position.z=2.5-recoil;for(const tip of turret.tips)tip.position.z=4.48-recoil;}
 this.updateBase(t);
 let impacts=0,debris=0,spark=0,shield=0;this.lights.forEach(l=>l.intensity=0);const pos=this.sparkGeo.attributes.position,opacity=this.sparkGeo.attributes.opacity;
 for(const blast of this.blasts){const age=t-blast.at;if(age<0||age>2.8||impacts>=this.blastCapacity)continue;const life=age/2.8,pool=this.blastPool[impacts++];pool.g.visible=true;pool.g.position.copy(blast.end);for(let k=0;k<4;k++){const puff=pool.g.children[k],size=(.18+ease(life*2.7)*(1.3+k*.35))*blast.scale;puff.scale.set(size,size*(.8+k*.07),size);puff.position.set(Math.sin(k*2.7+blast.seed)*life*blast.scale*1.8,life*(1.2+k*.6),Math.cos(k*2.7+blast.seed)*life*blast.scale*1.4);puff.material.uniforms.age.value=life;puff.material.uniforms.time.value=t;}
 pool.flash.scale.setScalar(blast.scale*(3+age*9));pool.flash.material.opacity=Math.exp(-age*11)*.85;pool.ring.quaternion.copy(camera.quaternion);pool.ring.scale.setScalar((.2+age*7)*blast.scale);pool.ring.material.opacity=Math.exp(-age*5)*.09;
 if(age<.35){const light=this.lights[(impacts-1)%3];light.position.copy(blast.end);light.intensity=Math.max(light.intensity,Math.exp(-age*6)*145);if(blast.end.x<0)shield=Math.max(shield,Math.exp(-age*6)*.18);}
 for(let k=0;k<12;k++){const theta=k*2.39996+blast.seed,speed=1.2+k%5*.7;this.point.copy(blast.end).add(this.debrisOffset.set(Math.cos(theta)*age*speed,Math.sin(theta*2)*age*speed-age*age*.35,Math.sin(theta)*age*speed));this.quat.setFromEuler(this.debrisEuler.set(k+age*(1+k%3),age*.8,k*.7));this.scale.set(.7+k%3,.5,1.7).multiplyScalar(1-ease(life));this.matrix.compose(this.point,this.quat,this.scale);this.debris.setMatrixAt(debris++,this.matrix);}
 for(let k=0;k<40;k++){const theta=k*2.39996+blast.seed*1.9,r=age*(2+k%9*.65);pos.setXYZ(spark,blast.end.x+Math.cos(theta)*r,blast.end.y+Math.sin(k*8.1)*r*.7-age*age*.5,blast.end.z+Math.sin(theta)*r);opacity.setX(spark++,Math.pow(1-life,2)*.9);}}
 for(let i=impacts;i<this.blastPool.length;i++)this.blastPool[i].g.visible=false;this.debris.count=debris;this.debris.instanceMatrix.needsUpdate=true;this.sparkGeo.setDrawRange(0,spark);pos.needsUpdate=true;opacity.needsUpdate=true;this.sparks.material.uniforms.height.value=innerHeight;this.shield.material.uniforms.power.value=shield;this.shield.visible=shield>.005;Object.assign(this.metrics,{raidExplosionCapacity:this.blastCapacity,raidActiveMissiles:missiles,raidActiveImpacts:impacts,raidActiveInterceptors:fighterCount,raidLaserBolts:this.gunfire.rounds.count,raidMuzzleFlashes:this.gunfire.activeMuzzles,raidShipModels:this.enemies.map(e=>e.userData.modelType),interceptorModels:this.fighters.map(f=>f.userData.modelType)});
 }
 diagnostic(){return this.metrics;}
}
