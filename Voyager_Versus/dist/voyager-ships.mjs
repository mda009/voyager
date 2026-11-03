// Voyager fleet (2.20.45): three original fighters built from primitives, replacing the earlier third-party meshes.
// Frame shared with ship-models.mjs: nose +X, tail -X, wings along ±Z, +Y up, about 300 units long.
// Every part carries a material slot (per-vertex "slot" attribute):
//   0 hull (vertex-painted)  1 accent paint  2 dark metal (engines, guns, intakes)  3 canopy glass  4 trim
import * as T from './vendor/three.module.min.js';

const geometries=new Map();
const deg=d=>d*Math.PI/180;

// ---------- helpers ----------
function part(geo,slot,{pos=[0,0,0],rot=[0,0,0],scale=[1,1,1],order='XYZ'}={}){
  const g=geo.index?geo.toNonIndexed():geo;
  const m=new T.Matrix4().compose(new T.Vector3(...pos),new T.Quaternion().setFromEuler(new T.Euler(...rot,order)),new T.Vector3(...scale));
  g.applyMatrix4(m);if(!g.attributes.normal)g.computeVertexNormals();return {g,slot};
}
function merge(parts){
  let count=0;for(const p of parts)count+=p.g.attributes.position.count;
  const pos=new Float32Array(count*3),nor=new Float32Array(count*3),slot=new Float32Array(count);let o=0;
  for(const p of parts){const a=p.g.attributes.position,n=p.g.attributes.normal;pos.set(a.array,o*3);nor.set(n.array,o*3);slot.fill(p.slot,o,o+a.count);o+=a.count;p.g.dispose();}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setAttribute('normal',new T.BufferAttribute(nor,3));geo.setAttribute('slot',new T.BufferAttribute(slot,1));
  geo.computeBoundingBox();return geo;
}
// A body of revolution along X from a profile of [x, radius] pairs (nose first). `flat` squashes it vertically; `facets` makes it angular.
function body(profile,{flat=1,facets=24,roll=0}={}){
  const pts=profile.map(([x,r])=>new T.Vector2(Math.max(r,.001),x));
  const g=new T.LatheGeometry(pts,facets);g.rotateZ(-Math.PI/2);if(roll)g.rotateX(roll);g.scale(1,flat,1);return g;
}
// A thin plate in the XZ plane from [x,z] outline points, `thick` tall. Mirrored with z→-z when `mirror`.
function plate(outline,thick,{y=0,mirror=false,tilt=0}={}){
  const shape=new T.Shape(outline.map(([x,z])=>new T.Vector2(x,mirror?-z:z)));
  const g=new T.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:true,bevelThickness:1.2,bevelSize:1.2,bevelSegments:1});
  g.rotateX(Math.PI/2);g.translate(0,y+thick/2,0);if(tilt)g.rotateX(mirror?tilt:-tilt);return g; // positive tilt lifts the tips
}
// A fin in the XY plane from [x,y] outline points, `thick` wide, placed at z and canted outward by `cant` radians.
function fin(outline,thick,{z=0,cant=0}={}){
  const shape=new T.Shape(outline.map(([x,y])=>new T.Vector2(x,y)));
  const g=new T.ExtrudeGeometry(shape,{depth:thick,bevelEnabled:true,bevelThickness:.8,bevelSize:.8,bevelSegments:1});
  g.translate(0,0,-thick/2);g.rotateX(z<0?-cant:cant);g.translate(0,0,z);return g;
}
const tube=(r1,r2,len,seg=16)=>{const g=new T.CylinderGeometry(r1,r2,len,seg);g.rotateZ(-Math.PI/2);return g;}; // along X, r1 at +X end
const box=(w,h,d)=>new T.BoxGeometry(w,h,d);
const ball=(r,w=18,h=12)=>new T.SphereGeometry(r,w,h);

// ---------- VX-01 Interceptor: slim dart, swept delta wings, twin engines, V-tail ----------
function interceptor(){
  const P=[];
  P.push(part(body([[150,0],[142,4],[125,10],[100,15],[65,19],[25,21],[-30,20],[-85,17],[-125,14],[-150,12]],{flat:.82}),0));
  P.push(part(body([[-146,11.5],[-150,11.5],[-152,8]],{flat:.82,facets:20}),2)); // tail cap
  P.push(part(ball(1),3,{pos:[58,13,0],scale:[36,11,13]})); // canopy
  P.push(part(body([[98,0],[96,4],[20,6],[16,0]]),4,{pos:[0,16,0],scale:[1,.5,1.1]})); // canopy spine
  for(const mirror of [false,true]){
    const s=mirror?-1:1;
    P.push(part(plate([[34,14],[-64,126],[-108,131],[-98,14]],6,{y:-5,mirror,tilt:deg(3)}),0)); // delta wing
    P.push(part(plate([[40,13],[-58,126],[-66,126],[30,15]],5.5,{y:-4.8,mirror,tilt:deg(3)}),1)); // leading edge stripe
    P.push(part(tube(5,5,62),2,{pos:[-74,-2,s*127]})); // wingtip pod
    P.push(part(tube(2.2,2.6,36),2,{pos:[-25,-2,s*127]})); // wingtip gun
    P.push(part(tube(9.5,10.5,72),2,{pos:[-112,-2,s*27]})); // engine
    P.push(part(tube(7,10.5,14),4,{pos:[-154,-2,s*27]})); // nozzle ring
    P.push(part(box(56,10,9),2,{pos:[-42,-4,s*24]})); // side intake
    P.push(part(box(50,3,8),1,{pos:[-40,2,s*24]})); // intake lip
    P.push(part(fin([[-92,0],[-150,0],[-150,26],[-128,38],[-110,36]],3,{z:s*17,cant:deg(32)}),0)); // V-tail
    P.push(part(fin([[-128,30],[-150,22],[-150,26],[-128,38]],3.2,{z:s*17,cant:deg(32)}),1)); // tail tip stripe
    P.push(part(tube(2.5,2.5,34),2,{pos:[-60,-9,s*60]})); // missile rail
  }
  P.push(part(tube(2.4,3,28),4,{pos:[160,-2,0]})); // nose cannon
  return merge(P);
}

// ---------- VX-02 Sentinel: broad gunship, straight wings, four engines, dorsal turret ----------
function sentinel(){
  const P=[];
  P.push(part(body([[150,0],[136,9],[112,19],[72,27],[20,31],[-50,30],[-110,26],[-150,22]],{flat:.68}),0));
  P.push(part(body([[-146,21],[-150,21],[-153,15]],{flat:.68,facets:20}),2));
  P.push(part(ball(1),3,{pos:[72,15,0],scale:[34,10.5,15]})); // canopy
  P.push(part(ball(1),4,{pos:[-22,22,0],scale:[13,10,13]})); // turret
  P.push(part(tube(2,2,32),2,{pos:[-2,25,-5]}));P.push(part(tube(2,2,32),2,{pos:[-2,25,5]})); // turret guns
  P.push(part(fin([[-98,0],[-150,0],[-150,34],[-126,43],[-108,41]],4,{z:0}),0)); // tail fin
  P.push(part(fin([[-126,35],[-150,26],[-150,34],[-126,43]],4.2,{z:0}),1));
  for(const mirror of [false,true]){
    const s=mirror?-1:1;
    P.push(part(plate([[44,30],[-18,112],[-72,116],[-104,30]],9,{y:-2,mirror}),0)); // wing
    P.push(part(plate([[50,29],[-12,112],[-20,112],[40,31]],8.5,{y:-1.8,mirror}),1)); // leading edge
    P.push(part(box(92,5,30),1,{pos:[0,18,s*22]})); // dorsal armour plate
    P.push(part(tube(12,13,82),2,{pos:[-118,-2,s*40]})); // inboard engine
    P.push(part(tube(9,13,14),4,{pos:[-164,-2,s*40]}));
    P.push(part(tube(9,9.5,68),2,{pos:[-98,0,s*103]})); // outboard engine pod
    P.push(part(tube(6.5,9.5,12),4,{pos:[-136,0,s*103]}));
    P.push(part(tube(4,4.5,72),2,{pos:[64,-10,s*19]})); // chin cannons
    P.push(part(box(30,6,10),2,{pos:[-50,-8,s*76]})); // missile rack
    P.push(part(tube(2.5,2.5,30),2,{pos:[-48,-13,s*76]}));
  }
  return merge(P);
}

// ---------- VX-03 Phantom: faceted stealth wedge, blended wings, canted fins, slot exhaust ----------
function phantom(){
  const P=[];
  P.push(part(body([[150,0],[128,8],[90,16],[40,22],[-30,22],[-100,19],[-150,15]],{flat:.5,facets:6,roll:Math.PI/6}),0));
  P.push(part(ball(1,6,5),3,{pos:[62,9,0],rot:[Math.PI/6,0,0],scale:[36,8,13]})); // faceted canopy
  P.push(part(box(42,9,46),2,{pos:[-138,-1,0]})); // exhaust block
  for(const mirror of [false,true]){
    const s=mirror?-1:1;
    P.push(part(plate([[60,20],[-60,118],[-96,118],[-112,20]],5,{y:-3,mirror,tilt:deg(-5)}),0)); // blended wing
    P.push(part(plate([[-70,24],[-98,114],[-96,118],[-62,22]],5.5,{y:-3.2,mirror,tilt:deg(-5)}),1)); // trailing stripe
    P.push(part(fin([[-70,0],[-116,0],[-122,30],[-96,34]],3,{z:s*42,cant:deg(35)}),0)); // canted fin
    P.push(part(box(24,8,8),4,{pos:[-158,-1,s*14]})); // slot nozzles
    P.push(part(box(26,5,7),2,{pos:[96,-4,s*20]})); // recessed guns
    P.push(part(box(34,4,6),2,{pos:[0,-8,s*50]})); // missile bay doors
  }
  P.push(part(box(30,4,5),4,{pos:[150,-5,0]})); // chin gun
  return merge(P);
}

const builders={interceptor,sentinel,phantom};
let pending;
export function shipMeshesReady(){
  return pending??=Promise.resolve().then(()=>{for(const [key,build] of Object.entries(builders))geometries.set(key,build());});
}
export function rawShip(key){return geometries.get(key);}
