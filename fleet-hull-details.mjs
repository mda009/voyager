import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {mergeGeometries} from './Voyager_Versus/dist/vendor/BufferGeometryUtils.mjs';
import anchors from './fleet-assets/hull-anchors.mjs';
const UP=new T.Vector3(0,1,0);
function armourPlate(w,h,d){const a=w/2,b=d/2,c=.08,shape=new T.Shape();shape.moveTo(-a+c,-b);shape.lineTo(a-c,-b);shape.lineTo(a,-b+c);shape.lineTo(a,b-c);shape.lineTo(a-c,b);shape.lineTo(-a+c,b);shape.lineTo(-a,b-c);shape.lineTo(-a,-b+c);shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelThickness:.013,bevelSize:.014,bevelSegments:2,steps:1});g.rotateX(-Math.PI/2);g.translate(0,-h/2,0);return g;}

function bucket(p){return Math.min(7,Math.max(0,Math.floor((p.x+20)/5)))+8*(p.z<-1.8?0:p.z>1.8?2:1)+24*(p.y>.8?1:0);}
export function buildHullDetails(hero,parts,maps){
 const materials=[new T.MeshPhysicalMaterial({color:0x8996a2,metalness:.88,roughness:.31,normalMap:maps.normalMap,normalScale:new T.Vector2(.25,.25),envMapIntensity:.9}),new T.MeshStandardMaterial({color:0x263340,metalness:.65,roughness:.57}),new T.MeshPhysicalMaterial({color:0xa8b8c5,metalness:.12,roughness:.42,clearcoat:.3,normalMap:maps.normalMap,normalScale:new T.Vector2(.35,.35)}),new T.MeshStandardMaterial({color:0x86c9e5,emissive:0x4886b3,emissiveIntensity:1.3,roughness:.25,metalness:.25})];
 const full=new Map(),pieces=new Map();let triangles=0;
 function add(g,mat,pos,rotation,anchor){
  const object=new T.Object3D();object.position.copy(pos);object.quaternion.copy(rotation);object.updateMatrix();g=g.index?g.toNonIndexed():g;g.applyMatrix4(object.matrix);triangles+=g.attributes.position.count/3;
  if(!full.has(mat))full.set(mat,[]);full.get(mat).push(g);
  const key=bucket(anchor);if(!pieces.has(key))pieces.set(key,new Map());const bin=pieces.get(key);if(!bin.has(mat))bin.set(mat,[]);bin.get(mat).push(g);
 }
 for(const [i,a]of anchors.entries()){
  const pos=new T.Vector3(...a.p),normal=new T.Vector3(...a.n),q=new T.Quaternion().setFromUnitVectors(UP,normal),local=(x,y,z)=>new T.Vector3(x,y,z).applyQuaternion(q).add(pos);
  const box=(w,h,d,x,y,z,mat)=>add(new T.BoxGeometry(w,h,d),mat,local(x,y,z),q,pos);
  box(1.6,.07,.78,0,.05,0,1);add(armourPlate(1.48,.055,.67),i%5===0?0:2,local(0,.11,0),q,pos);
  for(const x of [-.64,.64])for(const z of [-.25,.25])add(new T.CylinderGeometry(.038,.042,.035,8),0,local(x,.155,z),q,pos);
  if(a.kind==='vent'){
   box(.95,.045,.46,0,.155,0,1);
   for(let j=0;j<8;j++)box(.055,.055,.4,-.39+j*.11,.195,0,0);
  }else if(a.kind==='turret'&&a.p[0]!==-7&&a.p[0]!==-4){
   add(new T.CylinderGeometry(.27,.34,.2,24),0,local(0,.24,0),q,pos);box(.52,.18,.46,0,.4,0,1);
   const axis=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),-Math.PI/2),rot=q.clone().multiply(axis);
   for(const z of [-.135,.135]){add(new T.CylinderGeometry(.036,.052,.85,12),0,local(.46,.4,z),rot,pos);add(new T.CylinderGeometry(.052,.052,.18,12),1,local(.87,.4,z),rot,pos);}
  }else if(i%4===0){box(.58,.025,.025,0,.16,.22,3);}
 }
 const assembled=new T.Group();assembled.name='Physical hull fittings';hero.add(assembled);
 for(const [mat,list]of full){const mesh=new T.Mesh(mergeGeometries(list),materials[mat]);mesh.castShadow=mat!==3;mesh.receiveShadow=true;assembled.add(mesh);}
 for(const [key,byMat]of pieces){const part=parts.find(p=>p.key===key);if(!part)continue;for(const [mat,list]of byMat){const geo=mergeGeometries(list);geo.translate(-part.center.x,-part.center.y,-part.center.z);const mesh=new T.Mesh(geo,materials[mat]);mesh.castShadow=mat!==3;mesh.receiveShadow=true;part.mesh.add(mesh);}}
 // One extra instanced metal batch gives escorts the same fittings at low draw cost.
 const escortGeometry=mergeGeometries([...full].filter(([m])=>m!==3).flatMap(([,list])=>list));
 for(const list of full.values())list.forEach(g=>g.dispose());
 return {assembled,escortGeometry,escortMaterial:materials[0],anchors:anchors.length,triangles};
}
