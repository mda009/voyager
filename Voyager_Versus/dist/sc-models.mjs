import * as T from './vendor/three.module.min.js';
import CTM from './vendor/ctm.mjs';
const geometries=new Map();
export const names={interceptor:'gladius',sentinel:'paladin',phantom:'sabre'};
let pending;
export function shipMeshesReady(){
 return pending??=Promise.all(Object.entries(names).map(async([key,name])=>{
  const response=await fetch(new URL(`./ships/${name}.ctm`,import.meta.url));if(!response.ok)throw new Error(`${name} mesh: HTTP ${response.status}`);
  const file=new CTM.File(new CTM.Stream(new Uint8Array(await response.arrayBuffer()))),b=file.body;
  // Remove duplicate and collapsed faces in the public viewer meshes before lighting.
  const canonical=new Uint32Array(b.vertices.length/3),vertices=new Map(),seen=new Set(),clean=[];
  for(let i=0;i<canonical.length;i++){const k=[0,1,2].map(a=>Math.round(b.vertices[i*3+a]*1000)).join(',');if(!vertices.has(k))vertices.set(k,vertices.size);canonical[i]=vertices.get(k);}
  for(let i=0;i<b.indices.length;i+=3){const a=b.indices[i],c=b.indices[i+1],d=b.indices[i+2],ids=[canonical[a],canonical[c],canonical[d]].sort((x,y)=>x-y);if(ids[0]===ids[1]||ids[1]===ids[2])continue;const k=ids.join(',');if(seen.has(k))continue;seen.add(k);clean.push(a,c,d);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(b.vertices,3));geo.setIndex(new T.BufferAttribute(new Uint32Array(clean),1));
  // Rebuild normals from the triangles for consistent lighting across the three meshes.
  geo.computeVertexNormals();
  if(b.uvMaps?.[0])geo.setAttribute('uv',new T.BufferAttribute(b.uvMaps[0].uv,2));
  geo.computeBoundingBox();const box=geo.boundingBox,size=box.getSize(new T.Vector3());geo.center();geo.scale(300/size.z,300/size.z,300/size.z);geo.rotateY(-Math.PI/2);geo.computeBoundingBox();
  geometries.set(key,geo);
 }));
}
export function rawShip(key){return geometries.get(key);}
