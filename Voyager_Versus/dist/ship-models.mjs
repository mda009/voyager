import * as T from './vendor/three.module.min.js';
import {rawShip,shipMeshesReady} from './voyager-ships.mjs?v=2.20.45';
export {shipMeshesReady};
export const quality=new URLSearchParams(globalThis.location?.search||'').get('quality')||'ultra';
export const textureResolution=quality==='low'?1024:quality==='balanced'?2048:4096;
const texture=(canvas,color=false)=>{const t=new T.CanvasTexture(canvas);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(color)t.colorSpace=T.SRGBColorSpace;return t;};
let maps,ready;
export function surfaceMaps(){
  if(maps)return maps;
  const loader=new T.TextureLoader(),loads=[];
  const load=(name,color=false)=>{let resolve,reject;loads.push(new Promise((a,b)=>{resolve=a;reject=b;}));const t=loader.load(new URL(`./materials/${name}-${textureResolution}.webp`,import.meta.url).href,resolve,undefined,reject);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(color)t.colorSpace=T.SRGBColorSpace;return t;};
  maps={map:load('hull-basecolor',true),normalMap:load('hull-normal'),roughnessMap:load('hull-orm')};maps.metalnessMap=maps.roughnessMap;maps.aoMap=maps.roughnessMap;
  ready=Promise.all(loads);ready.catch(()=>{});return maps;
}
export function materialsReady(){surfaceMaps();return ready;}

// 2.20.45: Voyager's own fighters (voyager-ships.mjs). Positions are in the model frame: nose +X, wings ±Z, +Y up.
export const fleet={
 interceptor:{name:'VX-01 DART',short:'Dart',source:'Voyager original design',accent:0x75d9ff,
  nozzles:[[-158,-2,-27,7],[-158,-2,27,7]],guns:[[174,-2,0],[-7,-2,-127],[-7,-2,127]],missiles:[[-43,-9,-60],[-43,-9,60]],rcs:[[88,-3,-20],[88,-3,20]]},
 sentinel:{name:'VX-02 BULWARK',short:'Bulwark',source:'Voyager original design',accent:0xffc083,
  nozzles:[[-168,-2,-40,9],[-168,-2,40,9],[-140,0,-103,6],[-140,0,103,6]],guns:[[100,-10,-19],[100,-10,19],[14,25,-5],[14,25,5]],missiles:[[-33,-13,-76],[-33,-13,76]],rcs:[[112,-6,-28],[112,-6,28]]},
 phantom:{name:'VX-03 WRAITH',short:'Wraith',source:'Voyager original design',accent:0x9fc9ff,
  nozzles:[[-162,-1,-14,6],[-162,-1,14,6]],guns:[[165,-5,0],[109,-4,-20],[109,-4,20]],missiles:[[0,-10,-50],[0,-10,50]],rcs:[[94,-2,-22],[94,-2,22]]}
};
const geometryCache=new Map();
// Material slot per part comes with the geometry (voyager-ships.mjs): 0 hull, 1 accent paint, 2 dark metal, 3 canopy, 4 trim.
function materialIndex(slot){return Math.max(0,Math.min(4,Math.round(slot)));}
const smooth=(a,b,v)=>{const u=Math.max(0,Math.min(1,(v-a)/(b-a)));return u*u*(3-2*u);};
// Vertex paint on the hull material: a darker band across the wings and a nose stripe, per ship.
function paintWeight(key,x,y,z){
 const az=Math.abs(z);
 if(key==='interceptor')return Math.max(smooth(55,70,az)*(1-smooth(92,104,az))*.85,smooth(96,112,x)*.55);
 if(key==='sentinel')return Math.max(smooth(48,60,az)*(1-smooth(84,96,az))*.8,(1-smooth(-70,-40,x))*smooth(12,30,az)*.4);
 return smooth(44,56,az)*(1-smooth(88,100,az))*.55+smooth(100,130,x)*.5;
}
function hullGeometry(key){
 if(geometryCache.has(key))return geometryCache.get(key);
 const source=rawShip(key);if(!source)throw new Error('Ship meshes are still loading.');
 const geo=source.index?source.toNonIndexed():source.clone(),p=geo.attributes.position,slots=geo.attributes.slot,index=Uint32Array.from({length:p.count},(_,i)=>i),buckets=Array.from({length:5},()=>[]);
 const colors=new Float32Array(p.count*3),base=new T.Color(key==='interceptor'?0x89978a:key==='sentinel'?0x8c9893:0x3c4c57),paint=new T.Color(key==='interceptor'?0x364b36:key==='sentinel'?0x35443b:0x18252e),color=new T.Color();
 for(let i=0;i<p.count;i++){color.copy(base).lerp(paint,paintWeight(key,p.getX(i),p.getY(i),p.getZ(i)));colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;}geo.setAttribute('color',new T.BufferAttribute(colors,3));
 const uv=new Float32Array(p.count*2),v1=new T.Vector3(),v2=new T.Vector3(),a0=new T.Vector3(),b0=new T.Vector3(),c0=new T.Vector3();
 for(let i=0;i<index.length;i+=3){const a=index[i],b=index[i+1],c=index[i+2];const x=(p.getX(a)+p.getX(b)+p.getX(c))/3,y=(p.getY(a)+p.getY(b)+p.getY(c))/3,z=(p.getZ(a)+p.getZ(b)+p.getZ(c))/3;
  const slot=materialIndex(slots?slots.getX(a):0);buckets[slot].push(a,b,c);
  a0.fromBufferAttribute(p,a);b0.fromBufferAttribute(p,b);c0.fromBufferAttribute(p,c);v1.subVectors(b0,a0);v2.subVectors(c0,a0);v1.cross(v2).normalize();
  const axis=Math.abs(v1.y)>=Math.max(Math.abs(v1.x),Math.abs(v1.z))?'y':Math.abs(v1.x)>Math.abs(v1.z)?'x':'z';
  for(const j of [a,b,c]){uv[j*2]=(axis==='x'?p.getZ(j):p.getX(j))/170+.5;uv[j*2+1]=(axis==='y'?p.getZ(j):p.getY(j))/170+.5;}
 }
 const grouped=new Uint32Array(index.length);let offset=0;geo.clearGroups();buckets.forEach((list,slot)=>{grouped.set(list,offset);geo.addGroup(offset,list.length,slot);offset+=list.length;});geo.setIndex(new T.BufferAttribute(grouped,1));
 // Uniform surface density avoids stretching the original multi-material UV layout.
 geo.setAttribute('uv',new T.BufferAttribute(uv,2));geometryCache.set(key,geo);return geo;
}
function hullMaterials(key){
 const maps=surfaceMaps();
 const paint=(color,metalness=.28,roughness=.9)=>new T.MeshPhysicalMaterial({...maps,color,metalness,roughness,normalScale:new T.Vector2(.16,.16),clearcoat:.12,clearcoatRoughness:.4,envMapIntensity:.75,side:T.DoubleSide});
 const hues=key==='interceptor'?[0x929f96,0x475c48]:key==='sentinel'?[0x9fa8a3,0x37433b]:[0x445159,0x202c32];
 const hull=paint(0xffffff);hull.vertexColors=true;
 return [hull,paint(hues[1]),paint(0x1c2429,.72,.78),
  new T.MeshPhysicalMaterial({color:0x102f3b,metalness:.35,roughness:.13,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.4,side:T.DoubleSide}),
  paint(key==='sentinel'?0xaa9865:key==='interceptor'?0x6b7e83:0x536f82,.5,.72)];
}
function plumeTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');
  for(let x=0;x<256;x++){const u=x/255,spread=4+u*14;const gr=ctx.createLinearGradient(0,32-spread,0,32+spread);gr.addColorStop(0,'#ffffff00');gr.addColorStop(.35,`rgba(255,255,255,${(1-u)**1.5*.35})`);gr.addColorStop(.5,`rgba(255,255,255,${(1-u)**1.4})`);gr.addColorStop(.65,`rgba(255,255,255,${(1-u)**1.5*.35})`);gr.addColorStop(1,'#ffffff00');ctx.fillStyle=gr;ctx.fillRect(255-x,0,1,64);}
  return texture(c);
}
let exhaustMap,glowMap;
export function createShip(key='interceptor'){
 if(!fleet[key])key='interceptor';const spec=fleet[key],g=new T.Group();
 const hull=new T.Mesh(hullGeometry(key),hullMaterials(key));hull.castShadow=true;hull.receiveShadow=true;g.add(hull);
 g.userData.key=key;g.userData.source=spec.source;g.userData.cannons=spec.guns.map(p=>new T.Vector3(...p));g.userData.missiles=spec.missiles.map(p=>new T.Vector3(...p));g.userData.rcs=spec.rcs.map(p=>new T.Vector3(...p));g.userData.nozzles=spec.nozzles.map(([x,y,z,r])=>({x,y,z,r}));
  const thrusters=new T.Group();g.add(thrusters);exhaustMap ||= plumeTexture();
  if(!glowMap){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),gr=ctx.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#ffffffee');gr.addColorStop(.12,'#ffffff99');gr.addColorStop(.4,'#ffffff22');gr.addColorStop(1,'#ffffff00');ctx.fillStyle=gr;ctx.fillRect(0,0,64,64);glowMap=texture(c);}
  for(const nozzle of g.userData.nozzles){
    const flame=new T.Group();flame.position.set(nozzle.x,nozzle.y,nozzle.z);
    const mat=new T.MeshBasicMaterial({map:exhaustMap,color:spec.accent,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false,opacity:.65});
    for(const angle of [0,Math.PI/2]){const p=new T.Mesh(new T.PlaneGeometry(95,nozzle.r*1.65),mat);p.position.x=-47.5;p.rotation.x=angle;flame.add(p);}
    const glow=new T.Sprite(new T.SpriteMaterial({map:glowMap,color:spec.accent,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,opacity:.6}));glow.scale.setScalar(nozzle.r*4);glow.position.x=-2;flame.add(glow);
    thrusters.add(flame);
  }
  const manoeuvring=new T.Group();g.add(manoeuvring);
  for(const point of g.userData.rcs){
    const jet=new T.Group();jet.position.copy(point);jet.rotation.y=-Math.sign(point.z)*Math.PI/2;
    const mat=new T.MeshBasicMaterial({map:exhaustMap,color:0xc4e9ff,transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false,opacity:0});
    for(const angle of [0,Math.PI/2]){const p=new T.Mesh(new T.PlaneGeometry(23,5),mat);p.position.x=11.5;p.rotation.set(angle,Math.PI,0);jet.add(p);}
    manoeuvring.add(jet);
  }
  g.userData.manoeuvring=manoeuvring;
  g.userData.thrusters=thrusters;g.userData.key=key;return g;
}
export function animateShip(ship,time,thrust=0,pose=null){
  ship.userData.thrusters.children.forEach((flame,i)=>{const pulse=1+Math.sin(time*11+i*1.7)*.055+Math.sin(time*19+i)*.025;flame.scale.set((.64+thrust*.6)*pulse,1,1);});
  ship.userData.manoeuvring.children.forEach((jet,i)=>{
    const correction=pose?Math.abs(pose.bank)*.6+Math.abs(Math.sin(pose.roll))*.55+pose.recoil*.015:0;
    jet.children[0].material.opacity=Math.min(.65,correction)*(.75+.25*Math.sin(time*9+i));
    jet.scale.set(.75+correction*.7,1,1);
  });
}
