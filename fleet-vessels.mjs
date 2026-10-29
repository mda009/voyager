import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {mergeGeometries,toCreasedNormals} from './Voyager_Versus/dist/vendor/BufferGeometryUtils.mjs';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z), UP=V(0,1,0), X=V(1,0,0);
export const ESCORT_TYPES=['corvette','frigate','carrier','lancer','tender'];
export const RAIDER_TYPES=['siege','raider','marauder','destroyer','torpedo'];
export const FIGHTER_TYPES=['needle','scout','interceptor','bomber','dart','raptor'];
export function geometryBatch(root){
 const bins=new Map();return {add(g,m,p=V(),r=new T.Euler(),s=V(1,1,1)){if(g.index){const old=g;g=g.toNonIndexed();old.dispose();}g.applyMatrix4(new T.Matrix4().compose(p,new T.Quaternion().setFromEuler(r),s));if(!bins.has(m))bins.set(m,[]);bins.get(m).push(g);},finish(){let triangles=0;for(const [m,gs]of bins){const g=mergeGeometries(gs);const mesh=new T.Mesh(g,m);mesh.castShadow=!m.isMeshBasicMaterial;mesh.receiveShadow=true;root.add(mesh);triangles+=g.attributes.position.count/3;gs.forEach(g=>g.dispose());}return triangles;}};
}
export function strut(a,b,r=.1){const g=new T.CylinderGeometry(r,r,a.distanceTo(b),8);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(UP,b.clone().sub(a).normalize()));g.translate(...a.clone().add(b).multiplyScalar(.5).toArray());return g;}
export function bevelBox(w,h,d,bevel=.07){const s=new T.Shape(),a=w/2,b=d/2,c=Math.min(bevel,w*.12,d*.12);s.moveTo(-a+c,-b);s.lineTo(a-c,-b);s.lineTo(a,-b+c);s.lineTo(a,b-c);s.lineTo(a-c,b);s.lineTo(-a+c,b);s.lineTo(-a,b-c);s.lineTo(-a,-b+c);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelThickness:c*.45,bevelSize:c*.45,bevelSegments:1,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return g;}
function swept(points,depth){const s=new T.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.08,bevelThickness:.055,bevelSegments:1,steps:1});g.rotateX(Math.PI/2);g.translate(0,depth/2,0);return g;}
function hull(sections){const pos=[],uv=[],ix=[];for(let j=0;j<sections.length;j++){const [x,w,h,y=0]=sections[j];for(let k=0;k<8;k++){const a=k*Math.PI/4+Math.PI/8;pos.push(x,y+Math.sin(a)*h,Math.cos(a)*w);uv.push(x/9,k/4);}}for(let j=0;j<sections.length-1;j++)for(let k=0;k<8;k++){let a=j*8+k,b=j*8+(k+1)%8,c=a+8,d=b+8;ix.push(a,c,b,b,c,d);}for(let k=1;k<7;k++){ix.push(0,k,k+1);let o=(sections.length-1)*8;ix.push(o,o+k+1,o+k);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const smooth=toCreasedNormals(g,.45);g.dispose();return smooth;}
const profiles={
 corvette:[[-18,1.9,1.7],[-14,3.8,2.3],[-4,4.6,2.5],[7,3.4,1.7],[19,.18,.3]],
 frigate:[[-18,4,2],[-11,5,2.5],[5,5,2.5],[14,3,2],[20,.7,.7]],
 carrier:[[-18,7,2.8],[-13,7.8,3],[11,7.8,3],[18,5,2.6],[20,3,1.8]],
 lancer:[[-18,2.2,1.5],[-9,2.7,1.9],[9,1.8,1.5],[21,.04,.04]],
 tender:[[-18,4.8,2.8],[-11,5.3,3.4],[7,4.6,3.4],[17,3,2.2],[19,2.3,1.5]],
 siege:[[-21,7,3.4],[-12,8.5,4.2],[4,8.2,4.2],[17,6,3],[21,2,2]],
 raider:[[-19,3,1.7],[-9,4,2.8],[3,3,2.6],[16,1,1.2],[20,.05,.15]],
 marauder:[[-18,3.5,3],[-9,6.4,3.7],[7,6,3.2],[18,.5,1]],
 destroyer:[[-20,2.6,2.2],[-13,4.5,2.4],[8,4,2.6],[21,.9,.8]],
 torpedo:[[-18,4,2.2],[-10,5,2.6],[7,3,1.6],[19,.25,.45]]
};

const LIVERIES={corvette:[0x2476d6,0xc3d8ea,'Cobalt'],frigate:[0xce6332,0xd9c4a1,'Copper'],carrier:[0x7552b4,0xc8bfdc,'Violet'],lancer:[0x268e82,0xa7d5ce,'Teal'],tender:[0xc39d35,0xd9d0a8,'Gold'],siege:[0x9f3f41,0x323c49,'Crimson'],raider:[0xa27035,0x303b43,'Bronze'],marauder:[0x65508a,0x343d4d,'Plum'],destroyer:[0x48725d,0x283a39,'Olive'],torpedo:[0x3d718b,0x2e3847,'Steel blue'],needle:[0x44a8c3,0xb7d8e3,'Ice blue'],scout:[0xe6a43c,0x485365,'Amber'],interceptor:[0xc85650,0xd2bdb9,'Scarlet'],bomber:[0x62a27d,0xc4d1bf,'Jade'],dart:[0x8a70ca,0xd2c6e5,'Lilac'],raptor:[0xd978a2,0xd8c3d3,'Rose']};
export function createVessel(type,maps,{enemy=false,serial=1}={}){
 const root=new T.Group();root.name=type+' / '+serial;const fighter=FIGHTER_TYPES.includes(type),variant=fighter?FIGHTER_TYPES.indexOf(type):0;
 const sections=profiles[type]||[[-17,1.9,1.4],[-8,2.8,2],[5,2.2,1.7],[20,.08,.2]];
 const pbr=(color,rough=.44,metal=.68)=>new T.MeshPhysicalMaterial({color,map:maps.map,normalMap:maps.normalMap,normalScale:new T.Vector2(.32,.32),roughnessMap:maps.orm,roughness:rough,metalness:metal,clearcoat:.17,clearcoatRoughness:.4,envMapIntensity:1.05});
 const livery=LIVERIES[type]||LIVERIES.corvette,armour=pbr(livery[0],.7,.3),trim=pbr(livery[1],.62,.5),metal=pbr(0x7d8b98,.52,.92),dark=pbr(0x17232d,.9,.65),glass=new T.MeshPhysicalMaterial({color:0x0b2130,roughness:.12,metalness:.55,clearcoat:1,clearcoatRoughness:.08}),lit=new T.MeshBasicMaterial({color:enemy?0xffad77:0xa7e8ff,toneMapped:false});
 const b=geometryBatch(root),add=(g,m,x=0,y=0,z=0,r)=>b.add(g,m,V(x,y,z),r),box=(w,h,d,m,x,y,z)=>add(bevelBox(w,h,d),m,x,y,z);
 add(hull(sections),armour);
 const top=(x)=>{for(let i=1;i<sections.length;i++)if(x<=sections[i][0]){const a=sections[i-1],c=sections[i],u=(x-a[0])/(c[0]-a[0]);return {w:T.MathUtils.lerp(a[1],c[1],u),h:T.MathUtils.lerp(a[2],c[2],u)*.924};}return {w:1,h:1};};
 // Actual overlapping plates, inset service channels and raised heat sinks create parallax.
 for(let x=-13;x<12;x+=3.4){const {w,h}=top(x);for(const s of [-1,1]){box(3.1,.14,Math.max(.55,w*.52),trim,x,h+.03,s*w*.48);box(2.35,.09,.42,dark,x,h+.16,s*w*.48);for(let j=0;j<5;j++)box(.1,.12,.38,metal,x-.9+j*.44,h+.24,s*w*.48);box(.11,.07,.11,metal,x-1.3,h+.2,s*w*.75);box(.11,.07,.11,metal,x+1.3,h+.2,s*w*.75);}}
 const wing=(s,points,y=0)=>add(swept(points.map(([x,z])=>[x,z*s]),.38),armour,0,y,0);
 const engines=[];
 const engine=(x,y,z,r)=>{let g=new T.CylinderGeometry(r*.85,r,3.4,20);g.rotateZ(Math.PI/2);add(g,dark,x+1,y,z);for(const dx of [-.6,.1,1.8]){g=new T.TorusGeometry(r,.14,6,24);g.rotateY(Math.PI/2);add(g,metal,x+dx,y,z);}g=new T.CylinderGeometry(r*.72,r*.64,.1,20);g.rotateZ(Math.PI/2);add(g,lit,x-.62,y,z);engines.push({p:V(x-.8,y,z),r});};
 if(fighter){
  for(const s of [-1,1]){
   const wings=[[[7,1],[-10,10],[-16,9],[-9,1]],[[3,1],[-6,13],[-10,12],[-14,1]],[[9,1],[-5,8],[-15,7],[-10,1]],[[2,1],[-3,9],[-15,9],[-16,1]],[[13,1],[-12,7],[-16,4],[-8,1]],[[7,1],[-9,11],[-6,6],[-14,2]]];
   wing(s,wings[variant],variant===5?.6:0);engine(-15,0,s*(variant===3?6:3),variant===3?1.2:.9);
   box(6,.6,.65,dark,-3,.25,s*(variant===3?8:6));box(3,.3,.3,metal,1,.25,s*(variant===3?8:6));
   if(variant===1||variant===5){const fin=swept([[-13,0],[-8,0],[-13,5],[-16,3]],.22);fin.rotateX(Math.PI/2);add(fin,trim,0,1,s*3);}
  }
 }else if(['frigate','destroyer'].includes(type)){
  for(const s of [-1,1]){wing(s,[[7,2],[0,10],[-14,10],[-18,4]],-.5);box(17,2.5,2.7,trim,-6,0,s*8);engine(-17,0,s*8,1.3);box(14,1,1,dark,12,1,s*4);}
 }else if(['carrier','siege'].includes(type)){
  for(const s of [-1,1]){box(34,1,2,trim,-1,3.1,s*6.7);box(17,1.8,2.6,dark,1,1.1,s*7.6);for(let i=0;i<8;i++)box(.22,1.4,2.8,metal,-6+i*2,1.2,s*7.7);engine(-20,0,s*5,1.7);engine(-20,0,s*1.7,1.35);}
  box(6,2.5,3,trim,-8,4.2,-2);box(3.9,1.1,2.4,glass,-6.6,5.5,-2);
  if(type==='siege'){for(const s of [-1,1]){box(13,2.5,4,trim,13,0,s*6);box(9,.7,.8,dark,20,.5,s*6);}}
 }else if(['tender','torpedo'].includes(type)){
  for(const s of [-1,1]){b.add(strut(V(-12,0,s*3),V(4,0,s*9),.3),metal);for(let i=0;i<3;i++){box(6,2.6,2.8,i%2?trim:armour,-10+i*7,0,s*7);for(const dx of [-2,2])box(.2,2.8,3,metal,-10+i*7+dx,0,s*7);}engine(-18,0,s*3,1.5);}
 }else if(type==='marauder'){
  for(const s of [-1,1]){wing(s,[[15,1],[2,14],[-14,12],[-10,4]],-.7);box(11,2,2,trim,-9,0,s*10);engine(-17,0,s*10,1.3);}engine(-18,0,0,2);
 }else if(type==='raider'){
  for(const s of [-1,1]){wing(s,[[12,1],[-5,13],[-15,12],[-10,3]],-1);const fin=swept([[-13,0],[-4,0],[-14,6],[-18,3]],.35);fin.rotateX(Math.PI/2);add(fin,trim,0,2,s*3);engine(-18,-.5,s*4,1.4);}
 }else{
  for(const s of [-1,1]){wing(s,[[6,1],[-9,type==='lancer'?8:11],[-17,9],[-11,2]],-.6);engine(-18,0,s*4,1.3);box(10,.65,.6,metal,5,-.4,s*3.5);}if(type==='lancer'){box(15,.9,.9,dark,14,-.5,0);}
 }
 // Side belts are separate armour plates over recessed mechanical bays.
 for(let x=-12;x<12;x+=4){const {w,h}=top(x);for(const side of [-1,1]){
  box(3.7,h*.65,.22,dark,x,-.1,side*(w*.92+.04));box(3.25,h*.43,.18,trim,x,.12,side*(w*.92+.2));
  for(const dx of [-1.4,1.4])box(.11,h*.5,.21,metal,x+dx,.1,side*(w*.92+.32));
  box(2.2,.07,.06,lit,x,-h*.17,side*(w*.92+.32));
 }}
 if(!fighter){for(const side of [-1,1]){const {w,h}=top(-3);add(swept([[-13,w*.7],[-7,w+1.1],[8,w*.8],[13,w*.45]],.2),trim,0,h*.5,0,side===-1?new T.Euler(Math.PI,0,0):undefined);}}
 // Separate canopy, frames, sensor mast, missile cells and recessed gun muzzles.
 const cx=fighter?4:-6,cy=top(cx).h+.4;add(hull([[cx-3,1.3,.4,cy],[cx-1,1.5,.9,cy],[cx+4,.3,.2,cy]]),glass);
 for(const z of [-1.3,1.3])b.add(strut(V(cx-3,cy+.2,z),V(cx+3,cy+.3,z*.28),.07),metal);
 if(!fighter){box(4,.6,1.5,trim,-12,top(-12).h+.55,0);b.add(strut(V(-12,3.3,0),V(-12,6,0),.09),metal);box(.8,.12,3,metal,-12,6,0);}
 for(const s of [-1,1]){const x=fighter?-3:4,y=top(x).h+.55,z=s*(fighter?2:2.4);add(new T.CylinderGeometry(.6,.8,.45,16),metal,x,y,z);box(1.7,.65,1.1,dark,x,y+.45,z);for(const dz of [-.32,.32]){const g=new T.CylinderGeometry(.11,.15,3.1,12);g.rotateZ(-Math.PI/2);add(g,metal,x+1.7,y+.5,z+dz);const ring=new T.TorusGeometry(.14,.035,6,12);ring.rotateY(Math.PI/2);add(ring,dark,x+3.25,y+.5,z+dz);}box(.55,.07,.13,lit,-10,top(-10).h+.3,s*top(-10).w*.85);}
 const triangles=b.finish();
 const plumeGeo=new T.ConeGeometry(1,1,16,3,true);plumeGeo.rotateZ(Math.PI/2);plumeGeo.translate(-.5,0,0);
 const plumeMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{power:{value:.5},time:{value:0},tint:{value:new T.Color(enemy?0xffa471:0x98dfff)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;uniform float power;uniform float time;uniform vec3 tint;void main(){float a=pow(1.-vUv.y,1.7)*(.67+.13*cos(vUv.y*42.-time*9.))*power;gl_FragColor=vec4(mix(tint,vec3(1.),pow(1.-vUv.y,6.)),a*.48);}'});
 const exhaust=new T.Group();root.add(exhaust);for(const {p,r}of engines){const m=new T.Mesh(plumeGeo,plumeMat);m.position.copy(p);m.scale.set(6,r*.78,r*.78);exhaust.add(m);}
 root.userData={modelType:type,livery:livery[2],paintColour:livery[0],triangles,engines:exhaust,update:(t,power=.7)=>{plumeMat.uniforms.time.value=t;plumeMat.uniforms.power.value=power;for(const m of exhaust.children)m.scale.x=3+power*6+.1*Math.sin(t*11);}};
 return root;
}
