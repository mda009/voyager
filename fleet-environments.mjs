import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {geometryBatch,bevelBox,strut,createVessel} from './fleet-vessels.mjs';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),Y=V(0,1,0),clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
function connect(mesh,a,b,r=1){mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(Y,b.clone().sub(a).normalize());mesh.scale.set(r,a.distanceTo(b),r);}
export class Shipyard {
 constructor(scene,maps,glow){
 this.root=new T.Group();this.root.name='Orbital construction drydock';scene.add(this.root);this.arms=[];this.cranes=[];this.clamps=[];
 const mat=(color,rough=.65)=>new T.MeshPhysicalMaterial({color,map:maps.map,normalMap:maps.normalMap,normalScale:new T.Vector2(.23,.23),roughness:rough,metalness:.75,clearcoat:.12});
 const steel=mat(0x8d9ca9),dark=mat(0x24313e),blue=mat(0x304e65),yellow=mat(0xb89b53),glass=new T.MeshPhysicalMaterial({color:0x102e42,roughness:.15,metalness:.55}),lamp=new T.MeshBasicMaterial({color:0xd4edff,toneMapped:false}),warm=new T.MeshBasicMaterial({color:0xffc779,toneMapped:false});
 const b=geometryBatch(this.root),box=(w,h,d,m,x,y,z)=>b.add(bevelBox(w,h,d),m,V(x,y,z));
 for(const s of [-1,1]){
  box(56,.8,3,dark,0,-7,s*13);box(55,.16,.25,steel,0,-6.4,s*12.2);box(55,.16,.25,steel,0,-6.4,s*13.8);
  // Open lattice beneath each maintenance walkway, balustrades and deck seams.
  for(let x=-27;x<=27;x+=3){box(.12,.1,2.6,steel,x,-6.52,s*13);box(.12,1.2,.12,steel,x,-5.9,s*14.3);b.add(strut(V(x,-7,s*13),V(x+2.8,-9,s*13),.1),steel);b.add(strut(V(x,-9,s*13),V(x+2.8,-7,s*13),.1),steel);box(.6,.06,.15,x%2?lamp:warm,x,-6.48,s*11.7);}
  box(56,.1,.1,steel,0,-5.3,s*14.3);box(55,.25,.4,steel,0,-9,s*13);
  for(const x of [-24,24]){box(1,20,1,blue,x,3,s*13);box(1.3,.5,1.3,yellow,x,12.9,s*13);b.add(strut(V(x,-6,s*13),V(x-5*Math.sign(x),4,s*13),.18),steel);for(let y=-6;y<12;y+=2)box(.15,.08,.9,steel,x+.6,y,s*13);}
  box(50,.6,.7,steel,0,13,s*13);box(50,.18,.18,lamp,0,13.4,s*13);
  for(const x of [-17,18]){box(3.8,2,2,blue,x,-5.8,s*13);box(2.5,.25,2.1,dark,x,-4.75,s*13);for(let j=0;j<7;j++)box(.15,1.4,.12,steel,x-1.2+j*.4,-5.8,s*11.94);}
 }
 for(const x of [-23,0,23]){box(1.3,.65,26,dark,x,-7,0);for(const s of [-1,1])b.add(strut(V(x,-7,s*12),V(x,-3,s*7),.25),steel);}
 // Crane crossbeams have visible trusses, trolley wheels, winches and cable drums.
 for(let i=0;i<2;i++){
  const g=new T.Group();this.root.add(g);const cb=geometryBatch(g),add=(geo,m,p)=>cb.add(geo,m,p);
  add(bevelBox(1.1,.6,27),blue,V(0,13,0));add(bevelBox(.45,.3,27),steel,V(0,15,0));
  for(let z=-13;z<13;z+=2){add(strut(V(0,13,z),V(0,15,z+2),.12),steel);add(strut(V(0,15,z),V(0,13,z+2),.12),steel);}
  for(const s of [-1,1]){add(bevelBox(2.5,1.2,2),yellow,V(0,13,s*13));for(const dx of [-.8,.8]){const wheel=new T.CylinderGeometry(.42,.42,.25,16);wheel.rotateX(Math.PI/2);add(wheel,dark,V(dx,12.6,s*13));}}
  cb.finish();const trolley=new T.Group();g.add(trolley);const tb=geometryBatch(trolley);tb.add(bevelBox(2.8,1.1,2.2),yellow,V(0,12.6,0));tb.add(new T.CylinderGeometry(.55,.55,1.6,20),steel,V(0,12.1,0),new T.Euler(Math.PI/2,0,0));tb.add(bevelBox(1.4,1,1.3),glass,V(1.6,12.1,0));tb.finish();
  const cables=[];for(let k=0;k<2;k++){const c=new T.Mesh(new T.CylinderGeometry(1,1,1,6),dark);c.castShadow=true;this.root.add(c);cables.push(c);}const yoke=new T.Mesh(bevelBox(.7,.24,1.6),yellow);this.root.add(yoke);this.cranes.push({g,trolley,cables,yoke,index:i});
 }
 // Four articulated welding manipulators. Links are driven by the actual end-effector position.
 for(let i=0;i<4;i++){
  const g=new T.Group(),s=i%2?1:-1;g.position.set(i<2?-11:10,-5.7,s*11);this.root.add(g);
  const base=new T.Mesh(new T.CylinderGeometry(.85,1.1,1,20),blue);g.add(base);
  const links=[];for(let j=0;j<2;j++){const m=new T.Mesh(new T.CylinderGeometry(1,1,1,10),j?steel:blue);m.castShadow=true;g.add(m);links.push(m);}
  const elbow=new T.Mesh(new T.SphereGeometry(.55,16,12),yellow);g.add(elbow);const tip=new T.Sprite(new T.SpriteMaterial({map:glow,color:0xe3f5ff,transparent:true,depthWrite:false,toneMapped:false}));tip.scale.setScalar(1.1);g.add(tip);
  const nozzle=new T.Mesh(new T.ConeGeometry(.22,.8,12),dark);g.add(nozzle);const cable=new T.Mesh(new T.CylinderGeometry(1,1,1,6),dark);g.add(cable);this.arms.push({g,tip,links,elbow,nozzle,cable,s});
 }
 for(let i=0;i<6;i++){const s=i%2?1:-1,g=new T.Group();g.position.set(-14+Math.floor(i/2)*14,-4.4,s*8.3);this.root.add(g);const mesh=new T.Mesh(bevelBox(3,1.2,2),yellow);g.add(mesh);const pad=new T.Mesh(bevelBox(2,.6,1.5),dark);pad.position.set(0,.8,-s*.4);g.add(pad);this.clamps.push({g,s});}
 b.finish();this.tugs=[];for(let i=0;i<2;i++){const g=createVessel(i?'scout':'tender',maps,{serial:90+i});g.scale.setScalar(.095);this.root.add(g);this.tugs.push(g);}
 }
 update(stage,t,parts,hero){
 const release=stage===2?ease((t-.8)/3):ease((t-10.5)/2);this.root.updateMatrixWorld(true);hero.updateMatrixWorld(true);
 this.clamps.forEach(({g,s})=>{g.position.z=s*(8.3+release*4);g.rotation.x=s*release*.45;});
 for(const [i,c]of this.cranes.entries()){
  const moving=parts.filter(p=>p.mesh.visible&&p.progress>0&&p.progress<.98&&p.center.y>0).sort((a,b)=>a.center.x-b.center.x),part=moving[i?moving.length-1:0];
  let target=V(i?8:-10,3,0);if(stage===1&&t<10.6&&part){part.mesh.getWorldPosition(target);this.root.worldToLocal(target);}
  c.g.position.x=T.MathUtils.lerp(target.x,i?23:-23,release);c.trolley.position.z=T.MathUtils.lerp(target.z,0,release);
  for(let k=0;k<2;k++){const a=V(c.g.position.x,12.2,c.trolley.position.z+(k?-.5:.5)),to=target.clone().add(V(0,.3,k?-.5:.5));to.lerp(V(a.x,11,a.z),release);c.yoke.position.copy(to).add(V(0,-.2,k?0.5:-.5));connect(c.cables[k],a,to,.035);c.cables[k].visible=stage===1||release<1;}
 }
 for(const [i,a]of this.arms.entries()){
  a.g.position.x=(i<2?-15:1)+ease(t/10)*8;const reach=1-release,s=a.s,work=V(Math.sin(t*.7+i)*2.5,5.6+Math.sin(t*.9+i)*.5,-s*(4.9+Math.sin(t*.4+i)*.8));work.lerp(V(0,2,-s),release);
  const elbow=V(-1.4+Math.sin(t*.6+i)*.5,4.6,-s*2.1);elbow.lerp(V(0,2.8,-s*.8),release);a.elbow.position.copy(elbow);connect(a.links[0],V(0,.4,0),elbow,.28);connect(a.links[1],elbow,work,.2);connect(a.cable,V(.4,.7,s*.3),elbow.clone().add(V(.4,.2,0)),.065);a.tip.position.copy(work);a.nozzle.position.copy(work).add(V(0,.25,0));a.nozzle.quaternion.setFromUnitVectors(Y,work.clone().sub(elbow).normalize());a.tip.material.opacity=stage===1&&t>1&&t<10?reach*(.45+.25*Math.sin(t*39+i)**2):0;
 }
 this.tugs.forEach((g,i)=>{g.position.set(-19+t*.7,-3.3+Math.sin(t*.8+i)*.4,(i?1:-1)*(17+release*9));g.rotation.y=i?.22:-.22;g.userData.update(t,.3+release*.5);});
 }
 diagnostic(){return {constructionCranes:2,weldingArms:4,releaseClamps:6,serviceTugs:2};}
}
export class SupportSystems{
 constructor(scene,maps){this.root=new T.Group();this.root.name='Shield service and navigation hardware';scene.add(this.root);this.nodes=[];this.rotors=[];
 const metal=new T.MeshStandardMaterial({color:0x9db2c4,metalness:.8,roughness:.48,normalMap:maps.normalMap,normalScale:new T.Vector2(.3,.3)}),dark=new T.MeshStandardMaterial({color:0x243c4d,metalness:.65,roughness:.55}),light=new T.MeshBasicMaterial({color:0x8de4ff,toneMapped:false});
 for(let i=0;i<4;i++){const g=new T.Group(),b=geometryBatch(g);this.root.add(g);b.add(bevelBox(3,1.5,3),metal);b.add(bevelBox(2.3,1,2.3),dark,V(0,1,0));b.add(new T.CylinderGeometry(.8,1.15,2,16),metal,V(0,2,0));for(let j=0;j<6;j++)b.add(bevelBox(.1,1.4,.6),dark,V(Math.cos(j*Math.PI/3)*1.1,2,Math.sin(j*Math.PI/3)*1.1),new T.Euler(0,-j*Math.PI/3,0));b.finish();const rotor=new T.Mesh(new T.TorusGeometry(1.55,.09,8,32),light);rotor.rotation.x=Math.PI/2;rotor.position.y=2.8;g.add(rotor);this.nodes.push(g);this.rotors.push(rotor);}
 const count=4*40,pos=new Float32Array(count*6),geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));this.arcs=new T.LineSegments(geo,new T.LineBasicMaterial({color:0xa6e9ff,transparent:true,opacity:.4,depthWrite:false}));this.root.add(this.arcs);
 }
 update(stage,t){this.root.visible=stage===5;if(!this.root.visible)return;const charge=stage===5?Math.sin(Math.PI*Math.max(0,Math.min(1,(t-1.5)/10))):0;
 const pos=this.arcs.geometry.attributes.position;this.nodes.forEach((g,i)=>{const a=i*Math.PI/2+.6;g.position.set(Math.cos(a)*24,-5+Math.sin(t*.5+i)*.3,Math.sin(a)*15);g.scale.setScalar(stage===5?1:.35);this.rotors[i].rotation.set(Math.PI/2+Math.sin(t*.4)*.3,t*.7+i,0);for(let j=0;j<40;j++)for(let k=0;k<2;k++){const u=(j+k)/40,fall=Math.sin(u*Math.PI);pos.setXYZ((i*40+j)*2+k,g.position.x*(1-u),g.position.y+2.8+(2-g.position.y)*u+fall*Math.sin(u*28+t*5+i)*.14*charge,g.position.z*(1-u)+fall*Math.cos(u*23-t*4)*.13*charge);}});pos.needsUpdate=true;this.arcs.visible=stage===5&&charge>.08;this.arcs.material.opacity=charge*.4;
 }
}
