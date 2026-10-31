// Voyager Dreadnought capital ship (2.17.1): a procedural, high-detail model with 4K PBR materials.
// Geometry: lofted, faceted armour hull in three tiers, ventral keel, command tower, 8 twin turrets, 5 engine bells
// with volumetric plumes, prow spikes, swept fins, comms dishes, hangar bays, ~2,000 hull greebles, ~700 lit windows
// and running lights. All surfaces get world-space box-projected UVs so the 4K panel textures keep one even density.
import * as T from './vendor/three.module.min.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.mjs';

const TILE=360;// world units covered by one repeat of the 4K hull texture
let seed=1717;const rnd=()=>((seed=(seed*16807)%2147483647)/2147483647);

// World-space box projection: every triangle takes UVs from the plane its normal faces most.
export function boxUV(geo,tile=TILE){
  geo=geo.index?geo.toNonIndexed():geo;geo.computeVertexNormals();
  const p=geo.attributes.position,uv=new Float32Array(p.count*2),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),n=new T.Vector3();
  for(let i=0;i<p.count;i+=3){
    a.fromBufferAttribute(p,i);b.fromBufferAttribute(p,i+1);c.fromBufferAttribute(p,i+2);n.subVectors(c,b).cross(new T.Vector3().subVectors(a,b)).normalize();
    const ax=Math.abs(n.x),ay=Math.abs(n.y),az=Math.abs(n.z);
    for(let j=0;j<3;j++){const v=j===0?a:j===1?b:c;let u,w;if(ay>=ax&&ay>=az){u=v.x;w=v.z;}else if(ax>=az){u=v.z;w=v.y;}else{u=v.x;w=v.y;}uv[(i+j)*2]=u/tile;uv[(i+j)*2+1]=w/tile;}
  }
  geo.setAttribute('uv',new T.BufferAttribute(uv,2));return geo;
}

// A faceted armour section lofted through stations {x, w (half width), top, bot, ch (chamfer)}.
function loft(st){
  const ring8=s=>{const w=s.w,ch=s.ch??Math.min(s.w*.35,(s.top-s.bot)*.35);return [[s.top,-w*.58],[s.top,w*.58],[s.top-ch*.8,w],[s.bot+ch*.55,w],[s.bot,w*.62],[s.bot,-w*.62],[s.bot+ch*.55,-w],[s.top-ch*.8,-w]];};
  // Chamfer every corner so hard edges catch a thin highlight, as machined armour does.
  const ring=s=>{const R=ring8(s),bev=Math.min(5,s.w*.05),out=[];for(let i=0;i<8;i++){const p=R[i],a=R[(i+7)%8],b=R[(i+1)%8];const da=Math.hypot(a[0]-p[0],a[1]-p[1])||1,db=Math.hypot(b[0]-p[0],b[1]-p[1])||1,ka=Math.min(bev,da*.3)/da,kb=Math.min(bev,db*.3)/db;out.push([p[0]+(a[0]-p[0])*ka,p[1]+(a[1]-p[1])*ka],[p[0]+(b[0]-p[0])*kb,p[1]+(b[1]-p[1])*kb]);}return out;};
  const pos=[];const quad=(p1,p2,p3,p4)=>{pos.push(...p1,...p4,...p3,...p1,...p3,...p2);};
  for(let i=0;i<st.length-1;i++){
    const A=ring(st[i]),B=ring(st[i+1]),xa=st[i].x,xb=st[i+1].x;
    for(let k=0;k<16;k++){const k2=(k+1)%16;quad([xa,A[k][0],A[k][1]],[xb,B[k][0],B[k][1]],[xb,B[k2][0],B[k2][1]],[xa,A[k2][0],A[k2][1]]);}
  }
  for(const [s,flip] of [[st[0],true],[st[st.length-1],false]]){const R=ring(s),cy=(s.top+s.bot)/2;for(let k=0;k<16;k++){const k2=(k+1)%16;const t=[[s.x,cy,0],[s.x,R[k][0],R[k][1]],[s.x,R[k2][0],R[k2][1]]];if(flip)t.reverse();pos.push(...t.flat());}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));
  return boxUV(g);
}
const lerpStations=(st,x)=>{for(let i=0;i<st.length-1;i++)if(x>=st[i].x&&x<=st[i+1].x){const u=(x-st[i].x)/(st[i+1].x-st[i].x),A=st[i],B=st[i+1];return {w:A.w+(B.w-A.w)*u,top:A.top+(B.top-A.top)*u,bot:A.bot+(B.bot-A.bot)*u};}return null;};

function mirrorZ(geo){geo=geo.index?geo.toNonIndexed():geo.clone();geo.scale(1,1,-1);const p=geo.attributes.position;for(let i=0;i<p.count;i+=3){const x=p.getX(i+1),y=p.getY(i+1),z=p.getZ(i+1);p.setXYZ(i+1,p.getX(i+2),p.getY(i+2),p.getZ(i+2));p.setXYZ(i+2,x,y,z);}return boxUV(geo);}
function lathe(profile,segments=32){return boxUV(new T.LatheGeometry(profile.map(([r,y])=>new T.Vector2(r,y)),segments));}
function box(w,h,d,x,y,z,ry=0){const g=new T.BoxGeometry(w,h,d);if(ry)g.rotateY(ry);g.translate(x,y,z);return boxUV(g);}
function cyl(rt,rb,h,seg,x,y,z,axis='y'){const g=new T.CylinderGeometry(rt,rb,h,seg);if(axis==='x')g.rotateZ(Math.PI/2);if(axis==='z')g.rotateX(Math.PI/2);g.translate(x,y,z);return boxUV(g);}

function plumeMaterial(color){
  return new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,toneMapped:false,
    uniforms:{t:{value:0},color:{value:new T.Color(color)},power:{value:1}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform float t;uniform vec3 color;uniform float power;varying vec2 vUv;
      float h(float n){return fract(sin(n)*43758.5453);}
      void main(){float along=1.-vUv.y;float core=pow(1.-abs(vUv.x*2.-1.),2.);
        float flick=.85+.15*sin(t*40.+along*30.)+.08*h(floor(t*60.)+along);
        float a=pow(1.-along,1.6)*core*flick*power;vec3 c=mix(color,vec3(1.),pow(1.-along,6.)*.8);
        float diamonds=.25*pow(max(0.,sin(along*55.-t*8.)),8.)*(1.-along);
        gl_FragColor=vec4(c*(a+diamonds)*2.2,a);}`});
}

// Painted markings (hull number, class name, hazard stencils), worn so the plating shows through.
function decalTexture(w,h,draw){
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);
  x.globalCompositeOperation='destination-out';for(let i=0;i<w*h/900;i++){x.fillStyle=`rgba(0,0,0,${.25+Math.random()*.75})`;const r=Math.random()**3*7+.6;x.beginPath();x.arc(Math.random()*w,Math.random()*h,r,0,7);x.fill();}
  for(let i=0;i<w/12;i++){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,8+Math.random()*60);}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;
}
function decal(group,st,x0,x1,side,yf0,yf1,tex,opts={}){
  const a=lerpStations(st,x0),b=lerpStations(st,x1);if(!a||!b)return;
  const yr=s=>{const ch=Math.min(s.w*.35,(s.top-s.bot)*.35);return [s.bot+ch*.55,s.top-ch*.8];};
  const [ya0,ya1]=yr(a),y0=ya0+(ya1-ya0)*yf0,y1=ya0+(ya1-ya0)*yf1,za=side*(a.w+.7),zb=side*(b.w+.7);
  const g=new T.PlaneGeometry(1,1);const m=new T.Mesh(g,new T.MeshPhysicalMaterial({map:tex,transparent:true,roughness:opts.rough??.62,metalness:0,clearcoat:.1,polygonOffset:true,polygonOffsetFactor:-4,depthWrite:false,envMapIntensity:.8}));
  const len=Math.hypot(x1-x0,zb-za);m.scale.set(len,y1-y0,1);m.position.set((x0+x1)/2,(y0+y1)/2,(za+zb)/2);m.rotation.y=Math.atan2(-(zb-za),(x1-x0))+(side<0?Math.PI:0);
  if(side<0){m.scale.x*=-1;m.material.side=T.DoubleSide;}
  m.receiveShadow=true;m.renderOrder=2;group.add(m);
}

export function buildDreadnought({maps,anisotropy=8}){
  seed=1717;const group=new T.Group(),parts={turrets:[],engines:[],plumes:[],lights:[],core:null,coreGlow:null,shield:null,strips:[],windows:null,dishes:[]};
  for(const t of Object.values(maps))if(t){t.anisotropy=anisotropy;t.wrapS=t.wrapT=T.RepeatWrapping;}
  const hull=new T.MeshPhysicalMaterial({map:maps.base,normalMap:maps.normal,aoMap:maps.orm,roughnessMap:maps.orm,metalnessMap:maps.orm,emissiveMap:maps.emissive,emissive:0xffffff,emissiveIntensity:2.2,
    color:0xffffff,metalness:1,roughness:1,normalScale:new T.Vector2(1.1,1.1),clearcoat:.12,clearcoatRoughness:.5,envMapIntensity:1});
  const dark=hull.clone();dark.color.setHex(0x8a9099);dark.emissiveIntensity=0;
  const trim=new T.MeshPhysicalMaterial({map:maps.base,normalMap:maps.normal,roughnessMap:maps.orm,metalnessMap:maps.orm,color:0x5d636b,metalness:1,roughness:.9,normalScale:new T.Vector2(.7,.7),envMapIntensity:1.1});
  const engineMetal=new T.MeshPhysicalMaterial({color:0x8a8478,metalness:1,roughness:.32,anisotropy:.7,iridescence:.85,iridescenceIOR:1.6,iridescenceThicknessRange:[260,720],envMapIntensity:1.2,normalMap:maps.normal,normalScale:new T.Vector2(.25,.25)});
  const heat=new T.MeshBasicMaterial({color:0xff8040,toneMapped:false});
  const red=new T.MeshBasicMaterial({color:0xff2a3a,toneMapped:false});
  const add=(geo,mat)=>{const m=new T.Mesh(geo,mat);m.castShadow=m.receiveShadow=true;group.add(m);return m;};

  // ---- hull tiers ----
  const main=[{x:-800,w:8,top:10,bot:-6,ch:3},{x:-700,w:52,top:34,bot:-30},{x:-520,w:120,top:56,bot:-62},{x:-260,w:205,top:76,bot:-92},{x:40,w:272,top:92,bot:-112},{x:360,w:318,top:102,bot:-124},{x:600,w:334,top:98,bot:-116},{x:735,w:300,top:84,bot:-96}];
  const mid=[{x:-470,w:18,top:70,bot:50},{x:-300,w:96,top:118,bot:60},{x:0,w:170,top:150,bot:70},{x:360,w:210,top:168,bot:80},{x:640,w:206,top:160,bot:80},{x:720,w:176,top:140,bot:80}];
  const upper=[{x:60,w:20,top:170,bot:140},{x:200,w:118,top:226,bot:150},{x:480,w:140,top:246,bot:150},{x:660,w:120,top:232,bot:150}];
  const keel=[{x:-360,w:10,top:-80,bot:-96},{x:-150,w:70,top:-90,bot:-176},{x:250,w:96,top:-100,bot:-206},{x:560,w:84,top:-100,bot:-190},{x:640,w:50,top:-100,bot:-150}];
  const tower=[{x:380,w:78,top:330,bot:230,ch:22},{x:470,w:96,top:350,bot:230,ch:26},{x:560,w:84,top:330,bot:230,ch:22}];
  add(mergeGeometries([loft(main),loft(keel)]),hull);
  const number=decalTexture(1024,256,(x,w,h)=>{x.fillStyle='#d9d4c8';x.font='900 210px "Arial Black",Impact,sans-serif';x.textBaseline='middle';x.fillText('XV-07',30,h/2+8);x.fillRect(w-150,30,14,h-60);x.fillRect(w-110,30,14,h-60);});
  const cls=decalTexture(1024,128,(x,w,h)=>{x.fillStyle='#c9c4b8';x.font='700 74px "Arial Narrow",Arial,sans-serif';x.textBaseline='middle';x.fillText('DREADNOUGHT CLASS  ·  HOSTILE',20,h/2+4);});
  const hazard=decalTexture(512,96,(x,w,h)=>{for(let i=-2;i<w/36+2;i++){x.fillStyle=i%2?'#d8a51c':'#141414';x.beginPath();x.moveTo(i*36,0);x.lineTo(i*36+36,0);x.lineTo(i*36+6,h);x.lineTo(i*36-30,h);x.fill();}});
  const warn=decalTexture(512,128,(x,w,h)=>{x.fillStyle='#d8a51c';x.fillRect(0,0,w,10);x.fillRect(0,h-10,w,10);x.font='800 46px Arial,sans-serif';x.textBaseline='middle';x.fillText('⚠ THRUSTER WASH',18,h/2+2);});
  for(const s of [-1,1]){decal(group,main,-500,-280,s,.18,.86,number);decal(group,main,-240,20,s,.62,.86,cls);decal(group,main,420,580,s,.15,.38,warn);decal(group,main,-30,110,s,.06,.2,hazard);}add(loft(mid),hull);add(loft(upper),dark);add(loft(tower),dark);
  add(mergeGeometries([box(70,30,150,470,368,0),box(14,110,14,500,430,0),box(8,70,8,450,410,-30),box(180,10,10,470,388,0),box(60,30,60,390,250,0)]),trim);
  // Bridge glazing band and lit tower slits.
  const glass=new T.MeshPhysicalMaterial({color:0x0a1820,metalness:.2,roughness:.05,clearcoat:1,emissive:0x5fb8ff,emissiveIntensity:.35,envMapIntensity:1.6});
  add(mergeGeometries([box(196,9,4,470,318,-96.5),box(196,9,4,470,318,96.5),box(4,9,180,567,318,0)]),glass);
  const bridgeLight=add(mergeGeometries([box(150,3,2,470,300,-97.5),box(150,3,2,470,300,97.5)]),red);parts.strips.push(bridgeLight);

  // ---- prow spikes, fins, side sponsons ----
  const spikes=[];for(const s of [-1,1]){const g=new T.ConeGeometry(18,460,12);g.rotateZ(Math.PI/2);g.translate(-860,6,s*44);spikes.push(boxUV(g));}
  add(mergeGeometries(spikes),trim);
  for(const s of [-1,1]){
    const fin=new T.Shape();fin.moveTo(0,0);fin.lineTo(560,0);fin.lineTo(700,250);fin.lineTo(470,250);fin.closePath();
    const fg=new T.ExtrudeGeometry(fin,{depth:16,bevelEnabled:true,bevelThickness:5,bevelSize:5,bevelSegments:1});fg.rotateX(Math.PI/2);fg.rotateX(-.18);fg.translate(-20,-40,290);
    add(s>0?boxUV(fg):mirrorZ(fg),dark);
    add(mergeGeometries([box(460,62,70,170,-10,s*305),box(420,20,20,170,30,s*342),box(380,8,8,170,-30,s*343)]),trim);
    // Hangar bay: a recessed dark mouth with amber deck lights.
    add(box(150,48,6,40,-6,s*346),new T.MeshStandardMaterial({color:0x050608,roughness:1}));
    const bay=add(mergeGeometries([box(140,2,3,40,-28,s*348),box(140,2,3,40,16,s*348)]),new T.MeshBasicMaterial({color:0xffb050,toneMapped:false}));parts.strips.push(bay);
    // Red warning stripe running the flank.
    const strip=add(box(560,4,3,120,40,s*(lerpStations(main,120).w+2)),red);parts.strips.push(strip);
  }

  // ---- armour ribs along the dorsal spine and flanks ----
  const ribs=[];for(let i=0;i<9;i++){const x=-420+i*110,st=lerpStations(mid,x);if(!st)continue;for(const s of [-1,1])ribs.push(box(26,st.top-st.bot+16,22,x,(st.top+st.bot)/2,s*(st.w+4)));}
  ribs.push(box(1000,16,30,-40,lerpStations(mid,0).top+8,0));add(mergeGeometries(ribs),trim);

  // ---- greebles: instanced detail blocks scattered over the top and flanks ----
  const greebleGeo=(()=>{const sh=new T.Shape();sh.moveTo(-.42,-.42);sh.lineTo(.42,-.42);sh.lineTo(.42,.42);sh.lineTo(-.42,.42);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:.84,bevelEnabled:true,bevelThickness:.08,bevelSize:.08,bevelSegments:2});g.translate(0,0,-.42);return boxUV(g,1/3);})();
  const greebleMat=new T.MeshPhysicalMaterial({map:maps.base,roughnessMap:maps.orm,metalnessMap:maps.orm,normalMap:maps.normal,color:0xffffff,metalness:1,roughness:1,normalScale:new T.Vector2(.5,.5),envMapIntensity:1});
  const N=2200,greebles=new T.InstancedMesh(greebleGeo,greebleMat,N),m4=new T.Matrix4(),q=new T.Quaternion(),sc=new T.Vector3(),ps=new T.Vector3();let gi=0;
  const place=(st,count,onSide)=>{for(let i=0;i<count&&gi<N;i++){
    const x=st[0].x+rnd()*(st[st.length-1].x-st[0].x),s=lerpStations(st,x);if(!s||s.w<30)continue;
    const w=5+rnd()**2.5*34,h=2+rnd()**3*13,d=5+rnd()**2.5*30;
    if(!onSide){ps.set(x,s.top+h/2-1,(rnd()*2-1)*s.w*.55);q.identity();}
    else{const side=rnd()<.5?-1:1,ch=Math.min(s.w*.35,(s.top-s.bot)*.35);ps.set(x,s.bot+ch*.6+rnd()*((s.top-ch*.8)-(s.bot+ch*.6)),side*(s.w+h/2-1));q.setFromAxisAngle(new T.Vector3(1,0,0),side*Math.PI/2);}
    sc.set(w,h,d);m4.compose(ps,q,sc);greebles.setMatrixAt(gi++,m4);}};
  place(main,700,false);place(main,450,true);place(mid,520,false);place(mid,240,true);place(upper,220,false);place(keel,120,true);
  greebles.count=gi;greebles.castShadow=greebles.receiveShadow=true;group.add(greebles);

  // ---- lit windows: rows along the flanks ----
  const winN=760,wins=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({toneMapped:false}),winN),col=new T.Color();let wi=0;
  for(const [st,rows] of [[main,[.15,.38]],[mid,[.35,.62]],[upper,[.45]]])for(const fr of rows)for(const s of [-1,1]){
    for(let x=st[0].x+60;x<st[st.length-1].x-40&&wi<winN;x+=9+rnd()*14){if(rnd()<.32)continue;const t=lerpStations(st,x);if(!t||t.w<40)continue;
      const ch=Math.min(t.w*.35,(t.top-t.bot)*.35),y=t.bot+ch*.55+fr*((t.top-ch*.8)-(t.bot+ch*.55));
      ps.set(x,y,s*(t.w+.6));q.setFromAxisAngle(new T.Vector3(0,1,0),s>0?0:Math.PI);sc.set(5+rnd()*4,2.6,1);m4.compose(ps,q,sc);wins.setMatrixAt(wi,m4);
      col.setHex(rnd()<.12?0xffc27a:rnd()<.08?0xff6060:0xbfe4ff).multiplyScalar(1.4+rnd()*1.6);wins.setColorAt(wi++,col);}
  }
  wins.count=wi;group.add(wins);parts.windows=wins;

  // ---- turrets: base dome, armoured housing, twin barrels with muzzle brakes ----
  const turretGeo=(()=>{const parts=[lathe([[0,0],[40,0],[44,6],[40,14],[30,20],[0,22]],28)];
    const hs=new T.Shape();hs.moveTo(-34,0);hs.lineTo(40,0);hs.lineTo(30,24);hs.lineTo(-20,30);hs.closePath();const hg=new T.ExtrudeGeometry(hs,{depth:52,bevelEnabled:true,bevelThickness:3,bevelSize:3,bevelSegments:1});hg.translate(0,18,-26);parts.push(boxUV(hg));
    for(const z of [-12,12]){parts.push(cyl(5,6.5,150,12,-110,34,z,'x'),cyl(8,8,16,12,-190,34,z,'x'),cyl(9,9,20,12,-30,34,z,'x'));}
    return mergeGeometries(parts);})();
  for(const [x,s] of [[-430,0],[-250,-1],[-250,1],[-60,-1],[-60,1],[160,-1],[160,1],[640,0]]){
    const st=lerpStations(s===0?main:mid,x)||lerpStations(main,x),t=new T.Mesh(turretGeo,trim);t.castShadow=true;
    t.position.set(x,(s===0?lerpStations(main,x).top:st.top)-2,s*(s===0?0:st.w*.45));if(x===640)t.position.y=lerpStations(mid,x).top-2;
    group.add(t);parts.turrets.push(t);
  }

  // ---- comms dishes and masts ----
  const dish=lathe([[0,0],[6,0],[30,-8],[54,-22],[58,-26]],32);
  for(const [x,y,z,ry] of [[620,240,-70,.6],[620,240,70,-.6],[300,230,0,0]]){const d=new T.Mesh(dish,trim);d.position.set(x,y,z);d.rotation.set(-1.0,ry,0);group.add(d);parts.dishes.push(d);}
  add(mergeGeometries([cyl(3,4,140,8,660,300,0),cyl(2,2,90,6,300,270,0),box(40,4,4,660,350,0)]),trim);

  // ---- engines: bells, heat rings, volumetric plumes ----
  const bell=lathe([[44,0],[60,30],[78,90],[86,130],[84,136],[60,120],[40,40],[36,0]],36);bell.rotateZ(-Math.PI/2);
  const throat=new T.CircleGeometry(58,32);throat.rotateY(Math.PI/2);
  for(const [y,z,s] of [[-10,-170,1],[-10,170,1],[70,-90,.9],[70,90,.9],[20,0,1.15]]){
    const g=new T.Group();g.position.set(735,y,z);g.scale.setScalar(s);
    g.add(new T.Mesh(cyl(70,76,60,28,-20,0,0,'x'),engineMetal));const b=new T.Mesh(bell,engineMetal);b.position.x=0;g.add(b);
    const ring=new T.Mesh(new T.TorusGeometry(50,4,8,32),heat);ring.rotation.y=Math.PI/2;ring.position.x=60;g.add(ring);
    const th=new T.Mesh(throat,new T.MeshBasicMaterial({color:0xffd9a0,toneMapped:false}));th.position.x=40;g.add(th);
    for(const k of [0,1]){const pg=new T.CylinderGeometry(58,22,620,24,1,true);pg.rotateZ(Math.PI/2);pg.translate(450,0,0);const pm=new T.Mesh(pg,plumeMaterial(k?0xffa060:0xff5a30));pm.scale.setScalar(k?.7:1);pm.renderOrder=5;g.add(pm);parts.plumes.push(pm);}
    group.add(g);parts.engines.push(g);
  }

  // ---- reactor core under the keel ----
  const core=new T.Mesh(new T.SphereGeometry(46,32,16),new T.MeshBasicMaterial({color:0xff2a40,toneMapped:false}));core.position.set(180,-200,0);group.add(core);parts.core=core;
  add(mergeGeometries([lathe([[0,-30],[70,-24],[84,-6],[78,6],[60,10]],32).translate(180,-180,0)]),engineMetal);
  const light=new T.PointLight(0xff3344,8,2200,1.3);light.position.set(180,-260,120);group.add(light);parts.light=light;

  // ---- running lights ----
  for(const [x,y,z,c] of [[-1090,6,-44,0xff3040],[-1090,6,44,0x40ff80],[505,486,0,0xff3040],[700,-40,-430,0xffffff],[700,-40,430,0xffffff],[735,98,0,0xff3040]]){parts.lights.push({pos:new T.Vector3(x,y,z),color:c});}

  // ---- shield bubble ----
  const sm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,uniforms:{t:{value:0},a:{value:0},hit:{value:new T.Vector3()},hitT:{value:-10}},
    vertexShader:'varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}',
    fragmentShader:`uniform float t;uniform float a;uniform vec3 hit;uniform float hitT;varying vec3 vN;varying vec3 vV;varying vec3 vP;
      vec2 hexd(vec2 p){p*=vec2(1.,1.1547);p.x+=mod(floor(p.y),2.)*.5;vec2 f=fract(p)-.5;return f;}
      void main(){float f=pow(1.-abs(dot(vN,vV)),2.6);vec2 h=hexd(vec2(atan(vP.z,vP.x)*9.,vP.y*7.));float edge=smoothstep(.40,.48,max(abs(h.x)*1.15+abs(h.y)*.6,abs(h.y)*1.2));
        float scan=.5+.5*sin(vP.y*12.-t*3.);float ripple=0.;float d=distance(normalize(vP),normalize(hit));float age=t-hitT;if(age<1.2)ripple=smoothstep(.06,0.,abs(d-age*.9))*(1.-age/1.2)*2.;
        vec3 c=vec3(.4,.82,1.)*(f*1.5+edge*(.05+.12*f)*scan+ripple);gl_FragColor=vec4(c*a,(f*.7+edge*.04+ripple*.5)*a);}`});
  const sh=new T.Mesh(new T.SphereGeometry(1,96,48),sm);sh.scale.set(1050,380,520);sh.position.set(-20,40,0);sh.renderOrder=10;group.add(sh);parts.shield=sh;
  return {group,parts,materials:{hull,dark,trim,engineMetal}};
}
