import * as T from './vendor/three.module.min.js';
import {rawShip,shipMeshesReady} from './sc-models.mjs?v=2.3.0';
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

export const fleet={
 interceptor:{name:'AEGIS GLADIUS',short:'Gladius',source:'RSI Gladius holoviewer',accent:0x75d9ff,
  nozzles:[[-148,-3,-24,5],[-148,-3,24,5]],guns:[[-16,3,-126],[-16,3,126],[149,-21,0]],missiles:[[-22,-4,-57],[-22,-4,57]],rcs:[[90,-3,-32],[90,-3,32]]},
 sentinel:{name:'ANVIL PALADIN',short:'Paladin',source:'RSI Paladin holoviewer',accent:0xffc083,
  nozzles:[[-148,-5,-40,7],[-148,-5,40,7],[-57,-10,-8,4],[-57,-10,8,4]],guns:[[23,30,-8],[23,30,8],[21,34,-4],[21,34,4],[10,9,-100],[10,9,100]],missiles:[[-48,8,-69],[-48,8,69]],rcs:[[115,-9,-23],[115,-9,23]]},
 phantom:{name:'AEGIS SABRE',short:'Sabre',source:'RSI Sabre holoviewer',accent:0x9fc9ff,
  nozzles:[[-119,-3,-32,7],[-119,-3,32,7]],guns:[[149,-2,-20],[149,-2,20],[40,-5,-64],[40,-5,64]],missiles:[[4,-12,-44],[4,-12,44]],rcs:[[89,-4,-26],[89,-4,26]]}
};
const geometryCache=new Map();
function materialIndex(key,x,y,z){
 const az=Math.abs(z);
 if(key==='interceptor'){
  if(x>71&&x<136&&y>2&&((x-103)/34)**2+(z/12)**2<1)return 3;
  if(az>123||x<-135&&az>15&&az<32)return 2;
 }else if(key==='sentinel'){
  if(x>135&&y>-5&&az<14||x>121&&x<137&&y>3&&y<9&&az<9)return 3;
  if(y>24&&x>-16&&x<36||az>99||x<-143)return 2;
 }else{
  if(x>90&&x<141&&y>7&&((x-112)/28)**2+(z/10)**2<1)return 3;
  if(x>133&&az>16||x>30&&x<46&&az>59&&az<69)return 2;
 }
 return 0;
}
const smooth=(a,b,v)=>{const u=Math.max(0,Math.min(1,(v-a)/(b-a)));return u*u*(3-2*u);};
function paintWeight(key,x,y,z){
 const az=Math.abs(z);
 if(key==='interceptor')return Math.max(smooth(27,47,az)*(1-smooth(35,70,x)),(1-smooth(8,20,az))*(1-smooth(42,71,x)))*.75;
 if(key==='sentinel')return smooth(22,44,az)*(1-smooth(65,108,x))*.72;
 return smooth(40,85,az)*.5+(1-smooth(10,23,az))*(1-smooth(60,90,x))*.35;
}
function hullGeometry(key){
 if(geometryCache.has(key))return geometryCache.get(key);
 const source=rawShip(key);if(!source)throw new Error('Ship meshes are still loading.');
 const geo=source.toNonIndexed(),p=geo.attributes.position,n=geo.attributes.normal,index=Uint32Array.from({length:p.count},(_,i)=>i),buckets=Array.from({length:5},()=>[]);
 const colors=new Float32Array(p.count*3),base=new T.Color(key==='interceptor'?0x89978a:key==='sentinel'?0x8c9893:0x3c4c57),paint=new T.Color(key==='interceptor'?0x364b36:key==='sentinel'?0x35443b:0x18252e),color=new T.Color();
 for(let i=0;i<p.count;i++){color.copy(base).lerp(paint,paintWeight(key,p.getX(i),p.getY(i),p.getZ(i)));colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;}geo.setAttribute('color',new T.BufferAttribute(colors,3));
 const uv=new Float32Array(p.count*2),v1=new T.Vector3(),v2=new T.Vector3(),a0=new T.Vector3(),b0=new T.Vector3(),c0=new T.Vector3();
 for(let i=0;i<index.length;i+=3){const a=index[i],b=index[i+1],c=index[i+2];const x=(p.getX(a)+p.getX(b)+p.getX(c))/3,y=(p.getY(a)+p.getY(b)+p.getY(c))/3,z=(p.getZ(a)+p.getZ(b)+p.getZ(c))/3;
  const slot=materialIndex(key,x,y,z,{y:(n.getY(a)+n.getY(b)+n.getY(c))/3});buckets[slot].push(a,b,c);
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
