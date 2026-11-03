// Voyager Fleet Alerts hero ship (2.20.46): the "Sovereign", an original Voyager carrier-cruiser built from
// primitives at load time. It replaces the third-party capital-ship mesh used until 2.20.45.
// Frame (unchanged, so the choreography, dock and cameras still fit): bow +X, stern -X, +Y up, about 40 units
// long, 10 tall and 21 wide. Hard points the rest of the overlay relies on are kept: four engine exits at the stern
// (outer pair z ±4.7, y -.35; inner pair z ±1.25, y -.6) and a flat dorsal deck around x -8…-2 at y ≈ 2.5–2.8 for
// the articulated batteries. Fittings, breach sites and lights find the surface by raycast, so nothing is baked.
import * as T from './Voyager_Versus/dist/vendor/three.module.min.js';
import {mergeGeometries} from './Voyager_Versus/dist/vendor/BufferGeometryUtils.mjs';

export const HERO={name:'Voyager Sovereign-class carrier',source:'Original Voyager design (fleet-hero.mjs)'};
// Paint ids read by the renderer's painted(): 0 white hull, 1 Voyager blue, 2 graphite, 3 glass, 4 engine metal.
const WHITE=0,BLUE=1,GRAPHITE=2,GLASS=3,METAL=4;
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);

function tag(g,paint){const n=g.attributes.position.count,a=new Float32Array(n).fill(paint);g.setAttribute('paint',new T.BufferAttribute(a,1));return g;}
function place(g,{pos=[0,0,0],rot=[0,0,0],scale=[1,1,1]}={}){g.applyMatrix4(new T.Matrix4().compose(V(...pos),new T.Quaternion().setFromEuler(new T.Euler(...rot)),V(...scale)));return g;}
// Loft along X: sections of [x, halfWidth(z), halfHeight(y), yOffset, squareness 0..1]. Rounded-rectangle cross-sections
// give a capital-ship read (flat decks, chamfered flanks) rather than a tube.
function loft(sections,sides=24){
  const pos=[],ix=[];
  for(const [x,w,h,y=0,sq=.55] of sections){
    for(let k=0;k<sides;k++){const a=k/sides*Math.PI*2;const c=Math.cos(a),s=Math.sin(a);
      // blend a circle with a superellipse (n≈4) for squarer sections
      const r=1/Math.pow(Math.pow(Math.abs(c),4)+Math.pow(Math.abs(s),4),.25);const m=1+(r-1)*sq;
      pos.push(x,y+s*h*m,c*w*m);}
  }
  const n=sections.length;
  for(let j=0;j<n-1;j++)for(let k=0;k<sides;k++){const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;ix.push(a,b,c,b,d,c);}
  // caps
  const first=pos.length/3,last=first+1;pos.push(sections[0][0],sections[0][3]||0,0,sections[n-1][0],sections[n-1][3]||0,0);
  for(let k=0;k<sides;k++){ix.push(first,(k+1)%sides,k);const o=(n-1)*sides;ix.push(last,o+k,o+(k+1)%sides);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();return g.toNonIndexed();
}
function box(w,h,d,paint,opts){return tag(place(new T.BoxGeometry(w,h,d).toNonIndexed(),opts),paint);}
function cyl(r1,r2,len,paint,opts,seg=20){const g=new T.CylinderGeometry(r1,r2,len,seg);g.rotateZ(-Math.PI/2);return tag(place(g.toNonIndexed(),opts),paint);} // along X, r1 at +X
function wedge(outline,thick,paint,opts){const s=new T.Shape(outline.map(([x,z])=>new T.Vector2(x,z)));const g=new T.ExtrudeGeometry(s,{depth:thick,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:1});g.rotateX(Math.PI/2);g.translate(0,thick/2,0);return tag(place(g,opts),paint);}
function finXY(outline,thick,paint,opts){const s=new T.Shape(outline.map(([x,y])=>new T.Vector2(x,y)));const g=new T.ExtrudeGeometry(s,{depth:thick,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:1});g.translate(0,0,-thick/2);return tag(place(g,opts),paint);}

export function buildHero(){
  const P=[];
  // Main hull: a long chamfered hull, widest amidships, with a tapered prow and a squared stern.
  P.push(tag(loft([[20,.5,.35,-.2,.2],[17.5,1.6,1,-.1,.4],[13,3,1.9,0,.55],[7,4.3,2.5,0,.6],[0,4.8,2.7,0,.65],[-8,4.8,2.6,0,.7],[-15,4.2,2.4,0,.7],[-19.4,3.4,2.1,-.1,.75]],28),WHITE));
  // Keel: a darker underslung spine with sensor blisters.
  P.push(tag(loft([[14,1.4,.6,-2.4,.6],[4,2.4,1,-2.9,.7],[-10,2.4,1,-2.9,.7],[-17,1.6,.7,-2.6,.6]],16),GRAPHITE));
  for(const x of [8,-2,-12])P.push(cyl(.55,.55,1.2,METAL,{pos:[x,-3.9,0],rot:[0,0,Math.PI/2]},16));
  // Dorsal deck: a flat raised plateau amidships that carries the batteries (top at y ≈ 2.75 around x -9…-1).
  P.push(box(13,.9,6.4,WHITE,{pos:[-5,2.3,0]}));
  P.push(box(12.2,.14,5.6,BLUE,{pos:[-5,2.8,0]}));
  // Bridge tower forward of the deck, with a glass band and a mast.
  P.push(box(5,2,3.6,WHITE,{pos:[2.5,3.4,0]}));P.push(box(4.6,.5,3.7,GLASS,{pos:[2.6,3.95,0]}));P.push(box(3.4,.6,2.4,GRAPHITE,{pos:[2.6,4.7,0]}));
  P.push(cyl(.08,.14,1.6,METAL,{pos:[1.6,5.6,0],rot:[0,0,Math.PI/2]},8));
  // Sponsons: wide flat side decks that give the ship its beam, with angled leading edges (hangar flight decks).
  for(const s of [-1,1]){
    P.push(wedge([[9,4.2],[4,8.9],[-13,9.4],[-17,8.6],[-17,4.2]].map(([x,z])=>[x,z*s]),1.5,WHITE,{pos:[0,.1,0]}));
    P.push(wedge([[8,4.3],[3.4,8.6],[-12.6,9.1],[-16.4,8.3],[-16.4,4.3]].map(([x,z])=>[x,z*s]),.18,BLUE,{pos:[0,.95,0]}));
    // hangar mouths on the sponson's forward edge and a lit deck strip
    P.push(box(2.2,1.1,2.6,GRAPHITE,{pos:[5.2,.1,s*6.5],rot:[0,s*-.62,0]}));
    P.push(box(14,.08,.2,GLASS,{pos:[-6,.98,s*8.9]}));
    // Upper nacelles: raised engine housings on each sponson (their roofs become turret/fitting ground).
    P.push(tag(loft([[-4,1.5,1.1,2.4,.7],[-8,1.9,1.45,2.4,.75],[-16,1.9,1.45,2.4,.75],[-18.6,1.6,1.2,2.3,.75]],18).applyMatrix4(new T.Matrix4().makeTranslation(0,0,s*7)),WHITE));
    P.push(box(9,.12,2.6,BLUE,{pos:[-12,3.9,s*7]}));
    P.push(cyl(1.05,1.15,1.6,METAL,{pos:[-19.2,2.3,s*7]},18));P.push(cyl(.8,1.05,.5,GRAPHITE,{pos:[-20,2.3,s*7]},18));
    // Main engines (kept at the stern hard points): outer pair and inner pair.
    P.push(cyl(1.55,1.75,5.2,GRAPHITE,{pos:[-17.4,-.35,s*4.7]},24));P.push(cyl(1.35,1.55,.9,METAL,{pos:[-19.5,-.35,s*4.7]},24));
    P.push(cyl(.95,1.05,3.6,GRAPHITE,{pos:[-18.2,-.6,s*1.25]},20));P.push(cyl(.82,.95,.7,METAL,{pos:[-19.9,-.6,s*1.25]},20));
    // Engine pylons and cooling fins
    P.push(box(5,1.2,1.4,WHITE,{pos:[-16,.9,s*4.7]}));
    for(let i=0;i<4;i++)P.push(box(3.2,.05,.9,GRAPHITE,{pos:[-16.5+i*.1,1.7+i*.22,s*(6.2+i*.1)],rot:[s*.35,0,0]}));
    // Ventral stabilisers
    P.push(finXY([[-12,-2.2],[-18.8,-2.2],[-19.6,-4.9],[-15,-4.6]],.3,WHITE,{pos:[0,0,s*2.6],rot:[s*.55,0,0]}));
    // Forward sensor fins and prow greebles
    P.push(finXY([[15.5,.4],[11.5,.4],[11,2.1],[14.4,1.9]],.22,WHITE,{pos:[0,0,s*2.3],rot:[s*-.5,0,0]}));
    for(let i=0;i<6;i++)P.push(box(1.6,.22,.5,GRAPHITE,{pos:[12-i*2.3,-1.5,s*(2.2+i*.3)]}));
    // Surface detail rows along the hull flanks and deck
    for(let i=0;i<9;i++){P.push(box(1.1,.6,.12,GRAPHITE,{pos:[9-i*2.9,.6,s*4.72]}));P.push(box(1.1,.12,.12,GLASS,{pos:[9-i*2.9,1.1,s*4.74]}));}
    for(let i=0;i<5;i++)P.push(box(.5,.2,1.6,GRAPHITE,{pos:[-2-i*2.4,2.9,s*2.1]}));
  }
  // Prow: a chin sensor array and a dorsal spine running to the bridge.
  P.push(box(6,.45,1.2,GRAPHITE,{pos:[14,-1.2,0]}));P.push(box(10,.5,1.4,WHITE,{pos:[8.5,2.3,0]}));P.push(box(9,.12,.9,BLUE,{pos:[8.5,2.58,0]}));
  // Stern: a central exhaust housing and communications dish.
  P.push(box(2.8,3.6,4.2,GRAPHITE,{pos:[-19.2,-.4,0]}));
  P.push(tag(place(new T.SphereGeometry(.9,16,8,0,Math.PI*2,0,Math.PI/2).toNonIndexed(),{pos:[-14,4.2,0],rot:[0,0,Math.PI/2]}),METAL));
  const geo=mergeGeometries(P.map(g=>{const p=g.attributes.position.count;if(!g.attributes.paint)tag(g,WHITE);if(!g.attributes.normal)g.computeVertexNormals();for(const k of Object.keys(g.attributes))if(!['position','normal','paint'].includes(k))g.deleteAttribute(k);return g;}),false);
  geo.computeBoundingBox();geo.computeVertexNormals();
  return geo;
}
// A coarse wireframe silhouette for the assembly "ghost".
export function buildHeroLod(){
  const P=[tag(loft([[20,.5,.35,-.2,.2],[13,3,1.9,0,.55],[0,4.8,2.7,0,.65],[-15,4.2,2.4,0,.7],[-19.4,3.4,2.1,-.1,.75]],12),WHITE),box(13,.9,6.4,WHITE,{pos:[-5,2.3,0]}),box(5,2,3.6,WHITE,{pos:[2.5,3.4,0]})];
  for(const s of [-1,1]){P.push(wedge([[9,4.2],[4,8.9],[-13,9.4],[-17,8.6],[-17,4.2]].map(([x,z])=>[x,z*s]),1.5,WHITE,{pos:[0,.1,0]}));P.push(cyl(1.55,1.75,5.2,GRAPHITE,{pos:[-17.4,-.35,s*4.7]},10));}
  const geo=mergeGeometries(P.map(g=>{for(const k of Object.keys(g.attributes))if(!['position','normal','paint'].includes(k))g.deleteAttribute(k);return g;}),false);geo.computeVertexNormals();return geo;
}
// Surface probe: find the hull point under (x,z) looking down from above (or up from below when `below`), with its normal.
export function surfacePoints(geometry,points){
  const mesh=new T.Mesh(geometry,new T.MeshBasicMaterial({side:T.DoubleSide})),ray=new T.Raycaster(),out=[];
  for(const q of points){
    const from=V(q.x,q.below?-30:30,q.z),dir=V(0,q.below?1:-1,0);ray.set(from,dir);
    const hit=ray.intersectObject(mesh,false)[0];
    if(hit){const n=hit.face.normal.clone();if(n.y<0&&!q.below)n.negate();out.push({...q,hit:true,p:[hit.point.x,hit.point.y,hit.point.z],n:[n.x,n.y,n.z]});}
    else out.push({...q,hit:false,p:[q.x,q.fallbackY??0,q.z],n:[0,1,0]});
  }
  mesh.material.dispose();return out;
}
