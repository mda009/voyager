// Voyager Dreadnought OBS overlay (2.17; 2.17.2 adds image-based space lighting and SSAO; 2.17.1 adds the 4K PBR capital ship, HDR bloom, shadows, backdrop and a 60 fps governor). Reads /api/boss/overlay from the local Voyager host and renders the
// fight with the same ships, hull materials and lighting as Voyager Versus.
import * as T from './vendor/three.module.min.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.mjs';
import {createShip,animateShip,shipMeshesReady,materialsReady} from './ship-models.mjs?v=2.3.0';
import {buildDreadnought} from './dreadnought-model.mjs?v=2.17.2';

const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
if(params.get('backdrop')==='0')document.body.classList.add('backdrop-off');
const W=1920,H=1080,KEYS=['interceptor','sentinel','phantom'];
const stage=$('stage');
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`translate(${(innerWidth-W*s)/2}px,${(innerHeight-H*s)/2}px) scale(${s})`;}
addEventListener('resize',fit);fit();

// ---------- quality ----------
// ?quality=ultra (4K textures, default) | balanced (2K) | low (1K) · ?res=1 (1080p) … 2 (4K canvas) · ?fps=1 shows a frame counter.
const QUALITY=['ultra','balanced','low'].includes(params.get('quality'))?params.get('quality'):'ultra',TEX=QUALITY==='low'?1024:QUALITY==='balanced'?2048:4096;
const MAX_RES=Math.min(2,Math.max(.25,Number(params.get('res'))||1)),BACKDROP=params.get('backdrop')!=='0';
let res=MAX_RES;

// ---------- renderer and HDR pipeline ----------
const canvas=$('gl');
const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance',stencil:false});
renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NoToneMapping;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();
{const pm=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pm.fromScene(room,.04).texture;scene.environmentIntensity=.25;room.dispose();pm.dispose();}
const camera=new T.PerspectiveCamera(32,W/H,10,60000);
const CAM=new T.Vector3(-160,430,2850),LOOK=new T.Vector3(-40,-30,0);camera.position.copy(CAM);camera.lookAt(LOOK);

// Scene → MSAA half-float target → bright pass → 5-level blurred bloom → ACES tone map, vignette, grain, sRGB.
const quad=new T.Mesh(new T.PlaneGeometry(2,2)),postScene=new T.Scene(),postCam=new T.OrthographicCamera(-1,1,1,-1,0,1);postScene.add(quad);quad.frustumCulled=false;
const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const rt=(w,h,samples=0)=>new T.WebGLRenderTarget(w,h,{type:T.HalfFloatType,samples,depthBuffer:samples>0,colorSpace:T.LinearSRGBColorSpace});
const brightMat=new T.ShaderMaterial({uniforms:{src:{value:null},threshold:{value:1.15}},vertexShader:VS,fragmentShader:'uniform sampler2D src;uniform float threshold;varying vec2 vUv;void main(){vec4 c=texture2D(src,vUv);float l=max(c.r,max(c.g,c.b));float k=smoothstep(threshold,threshold*1.8,l);gl_FragColor=vec4(c.rgb*k,1.);}',depthTest:false,depthWrite:false});
const blurMat=new T.ShaderMaterial({uniforms:{src:{value:null},dir:{value:new T.Vector2()}},vertexShader:VS,fragmentShader:'uniform sampler2D src;uniform vec2 dir;varying vec2 vUv;void main(){vec3 c=texture2D(src,vUv).rgb*.227027;c+=texture2D(src,vUv+dir*1.384615).rgb*.316216;c+=texture2D(src,vUv-dir*1.384615).rgb*.316216;c+=texture2D(src,vUv+dir*3.230769).rgb*.070270;c+=texture2D(src,vUv-dir*3.230769).rgb*.070270;gl_FragColor=vec4(c,1.);}',depthTest:false,depthWrite:false});
const finalMat=new T.ShaderMaterial({uniforms:{tAO:{value:null},aoAmount:{value:QUALITY==='low'?0:.85},src:{value:null},b0:{value:null},b1:{value:null},b2:{value:null},b3:{value:null},b4:{value:null},strength:{value:.85},exposure:{value:1.12},t:{value:0},flash:{value:0},alphaOut:{value:BACKDROP?0:1}},vertexShader:VS,
  fragmentShader:`uniform sampler2D src,b0,b1,b2,b3,b4,tAO;uniform float strength,exposure,t,flash,alphaOut,aoAmount;varying vec2 vUv;
  vec3 aces(vec3 x){const float a=2.51,b=.03,c=2.43,d=.59,e=.14;return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.,1.);}
  vec3 toSRGB(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+t)*43758.5453);}
  void main(){vec2 o=(vUv-.5)*.0012;vec4 base=texture2D(src,vUv);vec3 c=vec3(texture2D(src,vUv+o).r,base.g,texture2D(src,vUv-o).b);
    c*=mix(1.,texture2D(tAO,vUv).r,aoAmount);
    vec3 bloom=texture2D(b0,vUv).rgb*.30+texture2D(b1,vUv).rgb*.25+texture2D(b2,vUv).rgb*.2+texture2D(b3,vUv).rgb*.15+texture2D(b4,vUv).rgb*.1;
    c=(c+bloom*strength)*exposure+flash;vec3 m=aces(c);float v=smoothstep(1.25,.35,length(vUv-.5)*1.45);m*=mix(1.,v,1.-alphaOut*.85);
    m+=(h(vUv*913.)-.5)*.012*(1.-alphaOut);vec3 outc=toSRGB(m);
    float a=alphaOut>.5?clamp(max(base.a,max(max(bloom.r,bloom.g),bloom.b)*strength*1.2+flash),0.,1.):1.;
    gl_FragColor=vec4(outc*(alphaOut>.5?1.:1.),a);}`,depthTest:false,depthWrite:false,transparent:true});
// Screen-space ambient occlusion from a linear-depth pre-pass of the solid geometry (layer 1).
const depthMat=new T.ShaderMaterial({vertexShader:'#include <common>\nvarying float vD;\nvoid main(){\n#include <begin_vertex>\n#include <project_vertex>\nvD=-mvPosition.z;}',fragmentShader:'varying float vD;void main(){gl_FragColor=vec4(vD,0.,0.,1.);}'});
const kernel=Array.from({length:16},(_,i)=>{const v=new T.Vector3(Math.random()*2-1,Math.random()*2-1,Math.random()*.9+.1).normalize().multiplyScalar(Math.random());const k=i/16;return v.multiplyScalar(.1+.9*k*k);});
const aoMat=new T.ShaderMaterial({uniforms:{tDepth:{value:null},res:{value:new T.Vector2()},tanH:{value:0},aspect:{value:W/H},radius:{value:55},kernel:{value:kernel}},vertexShader:VS,depthTest:false,depthWrite:false,
  fragmentShader:`uniform sampler2D tDepth;uniform vec2 res;uniform float tanH,aspect,radius;uniform vec3 kernel[16];varying vec2 vUv;
  vec3 vp(vec2 uv){float z=texture2D(tDepth,uv).r;vec2 n=uv*2.-1.;return vec3(n.x*tanH*aspect*z,n.y*tanH*z,-z);}
  void main(){float z=texture2D(tDepth,vUv).r;if(z>40000.){gl_FragColor=vec4(1.);return;}
    vec3 P=vp(vUv);vec3 N=normalize(cross(dFdx(P),dFdy(P)));if(dot(N,-P)<0.)N=-N;
    float a=fract(sin(dot(floor(vUv*res),vec2(12.9898,78.233)))*43758.5453)*6.2831853;vec3 r=vec3(cos(a),sin(a),0.);
    vec3 Tg=normalize(r-N*dot(r,N));mat3 tbn=mat3(Tg,cross(N,Tg),N);float occ=0.;
    for(int i=0;i<16;i++){vec3 s=P+tbn*kernel[i]*radius;vec2 su=vec2(s.x/(-s.z*tanH*aspect),s.y/(-s.z*tanH))*.5+.5;float sz=texture2D(tDepth,su).r;
      float range=smoothstep(0.,1.,radius/max(1.,abs(-s.z-sz)));occ+=step(sz,-s.z-3.)*range;}
    gl_FragColor=vec4(vec3(pow(clamp(1.-occ/16.,0.,1.),1.6)),1.);}`});
const white=new T.DataTexture(new Uint8Array([255,255,255,255]),1,1);white.needsUpdate=true;finalMat.uniforms.tAO.value=white;
let depthRT,aoA,aoB;
let sceneRT,mips=[];
function sizeTargets(){
  const w=Math.round(W*res),h=Math.round(H*res);renderer.setSize(w,h,false);
  sceneRT?.dispose();for(const m of mips){m.a.dispose();m.b.dispose();}
  sceneRT=rt(w,h,QUALITY==='low'?0:4);sceneRT.depthBuffer=true;mips=[];let mw=w>>1,mh=h>>1;
  for(let i=0;i<5;i++){mips.push({a:rt(mw,mh),b:rt(mw,mh),w:mw,h:mh});mw=Math.max(8,mw>>1);mh=Math.max(8,mh>>1);}
  depthRT?.dispose();aoA?.dispose();aoB?.dispose();const aw=w>>1,ah=h>>1;
  depthRT=new T.WebGLRenderTarget(aw,ah,{type:T.FloatType,depthBuffer:true});aoA=rt(aw,ah);aoB=rt(aw,ah);aoMat.uniforms.res.value.set(aw,ah);
}
sizeTargets();
function pass(mat,target){quad.material=mat;renderer.setRenderTarget(target);renderer.render(postScene,postCam);}
let flashLevel=0;
const farColor=new T.Color(60000,0,0),clearCol=new T.Color();
function renderFrame(t){
  if(finalMat.uniforms.aoAmount.value>0){
    renderer.getClearColor(clearCol);const ca=renderer.getClearAlpha();renderer.setClearColor(farColor,1);
    camera.layers.set(1);scene.overrideMaterial=depthMat;renderer.setRenderTarget(depthRT);renderer.clear();renderer.render(scene,camera);scene.overrideMaterial=null;camera.layers.enableAll();
    renderer.setClearColor(clearCol,ca);
    aoMat.uniforms.tDepth.value=depthRT.texture;aoMat.uniforms.tanH.value=Math.tan(T.MathUtils.degToRad(camera.fov/2));pass(aoMat,aoA);
    blurMat.uniforms.src.value=aoA.texture;blurMat.uniforms.dir.value.set(1/aoA.width,0);pass(blurMat,aoB);
    blurMat.uniforms.src.value=aoB.texture;blurMat.uniforms.dir.value.set(0,1/aoA.height);pass(blurMat,aoA);
    finalMat.uniforms.tAO.value=aoA.texture;
  }
  renderer.setRenderTarget(sceneRT);renderer.clear();renderer.render(scene,camera);
  brightMat.uniforms.src.value=sceneRT.texture;pass(brightMat,mips[0].a);
  for(let i=0;i<mips.length;i++){const m=mips[i];if(i>0){blurMat.uniforms.src.value=mips[i-1].a.texture;blurMat.uniforms.dir.value.set(0,0);pass(blurMat,m.a);}
    blurMat.uniforms.src.value=m.a.texture;blurMat.uniforms.dir.value.set(1.5/m.w,0);pass(blurMat,m.b);
    blurMat.uniforms.src.value=m.b.texture;blurMat.uniforms.dir.value.set(0,1.5/m.h);pass(blurMat,m.a);}
  const u=finalMat.uniforms;u.src.value=sceneRT.texture;['b0','b1','b2','b3','b4'].forEach((k,i)=>u[k].value=mips[i].a.texture);u.t.value=t%100;u.flash.value=flashLevel;
  renderer.setRenderTarget(null);renderer.clear();quad.material=finalMat;renderer.render(postScene,postCam);
}

// ---------- lighting ----------
scene.add(new T.HemisphereLight(0x9fb8d6,0x0d0a12,.28));
const sun=new T.DirectionalLight(0xfff0dc,6.5);sun.position.set(-2400,2600,2600);sun.target.position.set(0,0,0);scene.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(QUALITY==='low'?1024:4096,QUALITY==='low'?1024:4096);Object.assign(sun.shadow.camera,{left:-2200,right:2200,top:1400,bottom:-1400,near:100,far:9000});sun.shadow.bias=-.0004;sun.shadow.normalBias=1.5;
const rim=new T.DirectionalLight(0x72d8ff,1.1);rim.position.set(-2000,300,-1600);scene.add(rim);
const redRim=new T.DirectionalLight(0xff4050,.6);redRim.position.set(2400,-500,-800);scene.add(redRim);

// ---------- textures ----------
const loader=new T.TextureLoader(),maxAniso=renderer.capabilities.getMaxAnisotropy();
const tex=(name,srgb)=>new Promise(ok=>{const t=loader.load(`materials/${name}.webp?v=2.17.2`,()=>ok(t),undefined,()=>ok(null));if(srgb)t.colorSpace=T.SRGBColorSpace;t.anisotropy=maxAniso;});

// ---------- backdrop: 4K nebula, gas giant with atmosphere, drifting dust ----------
const dust=(()=>{const n=900,g=new T.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*7000;p[i*3+1]=(Math.random()-.5)*3600;p[i*3+2]=-2600+Math.random()*4400;}g.setAttribute('position',new T.BufferAttribute(p,3));
  const m=new T.PointsMaterial({color:0x9fb6d0,size:3.2,sizeAttenuation:true,transparent:true,opacity:.45,depthWrite:false});const pts=new T.Points(g,m);scene.add(pts);return pts;})();
// Image-based lighting from the same space scene: nebula, the star, the gas giant. Metal and paint now
// reflect what is actually around them instead of a studio light box.
function spaceEnvironment(space,planet){
  const env=new T.Scene();
  if(space){const m=new T.Mesh(new T.SphereGeometry(1000,64,32),new T.MeshBasicMaterial({map:space,side:T.BackSide}));m.material.color.setScalar(.55);env.add(m);}
  const sunBall=new T.Mesh(new T.SphereGeometry(38,24,12),new T.MeshBasicMaterial({color:new T.Color(1,.95,.85).multiplyScalar(140)}));sunBall.position.copy(sun.position).normalize().multiplyScalar(900);env.add(sunBall);
  const halo=new T.Mesh(new T.SphereGeometry(120,24,12),new T.MeshBasicMaterial({color:new T.Color(1,.8,.6).multiplyScalar(1.4),transparent:true,opacity:.35}));halo.position.copy(sunBall.position);env.add(halo);
  if(planet){const p=new T.Mesh(new T.SphereGeometry(420,64,32),new T.MeshBasicMaterial({map:planet}));p.material.color.setScalar(.35);p.position.set(-520,-620,-300);env.add(p);}
  const cool=new T.Mesh(new T.PlaneGeometry(900,500),new T.MeshBasicMaterial({color:new T.Color(.25,.55,1).multiplyScalar(.8),side:T.DoubleSide}));cool.position.set(-900,150,-500);cool.lookAt(0,0,0);env.add(cool);
  const warm=new T.Mesh(new T.PlaneGeometry(900,500),new T.MeshBasicMaterial({color:new T.Color(1,.25,.3).multiplyScalar(.35),side:T.DoubleSide}));warm.position.set(900,-250,-300);warm.lookAt(0,0,0);env.add(warm);
  const pm=new T.PMREMGenerator(renderer);const old=scene.environment;scene.environment=pm.fromScene(env,0).texture;scene.environmentIntensity=1;pm.dispose();old?.dispose?.();
}
async function backdrop(){
  const [space,planet]=await Promise.all([tex('space-'+(TEX>=4096?4096:2048),true),tex('planet-'+(TEX>=4096?4096:2048),true)]);
  try{spaceEnvironment(space,planet);}catch(e){console.warn('Environment:',e);}
  if(!BACKDROP)return;
  if(space){const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:space,depthWrite:false,fog:false}));m.material.color.setScalar(.9);
    const d=30000,hh=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*d*1.15;m.scale.set(hh*16/9,hh,1);m.position.copy(camera.position).add(new T.Vector3().subVectors(LOOK,CAM).normalize().multiplyScalar(d));m.lookAt(camera.position);m.renderOrder=-10;scene.add(m);}
  if(planet){const g=new T.Group();const pm=new T.Mesh(new T.SphereGeometry(5200,128,64),new T.MeshStandardMaterial({map:planet,roughness:1,metalness:0,color:0x6a7078}));pm.rotation.set(.35,2.2,.25);g.add(pm);
    const atm=new T.Mesh(new T.SphereGeometry(5200*1.035,96,48),new T.ShaderMaterial({transparent:true,side:T.BackSide,blending:T.AdditiveBlending,depthWrite:false,uniforms:{sun:{value:sun.position.clone().normalize()}},
      vertexShader:'varying vec3 vN;varying vec3 vW;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader:'uniform vec3 sun;varying vec3 vN;varying vec3 vW;void main(){vec3 v=normalize(cameraPosition-vW);float rimv=pow(1.-abs(dot(vN,v)),3.);float lit=clamp(dot(-vN,sun)*.5+.6,0.,1.);gl_FragColor=vec4(vec3(.35,.65,1.)*rimv*lit*2.2,rimv*lit);}'}));
    g.add(atm);g.scale.setScalar(1.1);g.position.set(-15800,-15600,-38000);scene.add(g);}
}

// ---------- shared sprite textures ----------
function glowTexture(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.15,'rgba(255,255,255,.8)');g.addColorStop(.42,'rgba(255,255,255,.16)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function smokeTexture(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');for(let i=0;i<28;i++){const r=14+Math.random()*30,px=64+(Math.random()-.5)*50,py=64+(Math.random()-.5)*50,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
const GLOW=glowTexture(),SMOKE=smokeTexture();
// Sprite pool: no allocation during the fight (steady frame times).
const spritePool=[];for(let i=0;i<420;i++){const s=new T.Sprite(new T.SpriteMaterial({map:GLOW,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));s.visible=false;s.renderOrder=20;scene.add(s);spritePool.push(s);}
const sprite=(color,size,opacity=1,smoke=false)=>{const s=spritePool.find(x=>!x.visible)||spritePool[0];const m=s.material;m.map=smoke?SMOKE:GLOW;m.blending=smoke?T.NormalBlending:T.AdditiveBlending;m.color.set(color);m.opacity=opacity;m.rotation=Math.random()*6.28;m.needsUpdate=true;s.scale.setScalar(size);s.visible=true;if(s.parent!==scene)scene.add(s);return s;};
const freeSprite=s=>{s.visible=false;if(s.parent!==scene)scene.add(s);};
// Impact lights: a few point lights that flash on hits so explosions light the hull.
const flashes=Array.from({length:6},()=>{const l=new T.PointLight(0xffffff,0,900,1.6);scene.add(l);return {l,until:0,peak:0};});
function lightFlash(at,color,intensity,ms=220){const f=flashes.reduce((a,b)=>a.until<b.until?a:b);f.l.position.copy(at);f.l.color.set(color);f.peak=intensity;f.l.intensity=intensity;f.until=performance.now()+ms;f.ms=ms;}

// ---------- the Dreadnought ----------
const boss=new T.Group();scene.add(boss);
let bossParts={core:null,engines:[],turrets:[],shield:null,strips:[],plumes:[],lights:[]},damageFx=[],runLights=[],coreGlow=null;
async function buildBoss(){
  const [base,normal,orm,emissive]=await Promise.all([tex('dreadnought-basecolor-'+TEX,true),tex('dreadnought-normal-'+TEX,false),tex('dreadnought-orm-'+TEX,false),tex('dreadnought-emissive-'+TEX,true)]);
  const {group,parts}=buildDreadnought({maps:{base,normal,orm,emissive},anisotropy:maxAniso});
  group.scale.setScalar(.82);boss.add(group);bossParts=parts;
  group.traverse(o=>{if(o.isMesh&&!o.material.transparent&&!o.material.isShaderMaterial&&!o.material.isMeshBasicMaterial)o.layers.enable(1);});
  coreGlow=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:0xff3050,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));coreGlow.position.copy(parts.core.position);group.add(coreGlow);
  for(const l of parts.lights){const s=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:l.color,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));s.position.copy(l.pos);s.scale.setScalar(60);group.add(s);runLights.push(s);}
  for(const e of parts.engines){const s=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:0xff9050,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.9}));s.position.set(70,0,0);s.scale.setScalar(300);e.add(s);e.userData.glow=s;}
}
const BOSS_HOME=new T.Vector3(470,-30,-160);
boss.rotation.set(.06,.34,-.03);
// Battle damage: fires and smoke appear on the hull as it loses health.
function updateDamage(frac,t){
  const want=frac<.75?(frac<.5?(frac<.25?9:6):3):0;
  while(damageFx.length<want){const p=new T.Vector3(-600+Math.random()*1100,40+Math.random()*120,(Math.random()-.5)*360);damageFx.push({p,seed:Math.random()*10,fire:null,smoke:[]});}
  while(damageFx.length>want){const d=damageFx.pop();if(d.fire)freeSprite(d.fire);for(const s of d.smoke)freeSprite(s.s);}
  for(const d of damageFx){const w=boss.localToWorld(d.p.clone());
    if(!d.fire)d.fire=sprite(0xff7a30,90,1);d.fire.position.copy(w);d.fire.scale.setScalar(70+30*Math.sin(t*13+d.seed)+20*Math.random());d.fire.material.opacity=.75+.25*Math.random();
    if(Math.random()<.18&&d.smoke.length<7){d.smoke.push({s:sprite(0x2a2a30,80,.55,true),born:t,drift:new T.Vector3(40+Math.random()*30,60+Math.random()*40,(Math.random()-.5)*30),from:w.clone()});}
    for(let i=d.smoke.length-1;i>=0;i--){const s=d.smoke[i],age=t-s.born;if(age>2.4){freeSprite(s.s);d.smoke.splice(i,1);continue;}s.s.position.copy(s.from).addScaledVector(s.drift,age);s.s.scale.setScalar(80+age*120);s.s.material.opacity=.55*(1-age/2.4);}
  }
}
// ---------- the fleet ----------
const SLOTS=Array.from({length:12},(_,i)=>{const col=i%3,row=Math.floor(i/3);return new T.Vector3(-1150+col*230+(row%2)*110,190-row*135,-40+(col-1)*170);});
const fleet=new Map();// slot -> {ship, pilot, born, flash}
function shipFor(slot){
  let f=fleet.get(slot);if(f)return f;
  const ship=createShip(KEYS[slot%3]);ship.scale.setScalar(.78);ship.traverse(o=>{const mats=[].concat(o.material||[]);if(o.isMesh&&!mats.some(m=>m.transparent)){o.castShadow=true;o.receiveShadow=true;o.layers.enable(1);}});ship.position.copy(SLOTS[slot]).add(new T.Vector3(-900,0,0));ship.rotation.set(0,-.18,0);
  scene.add(ship);const warp=new T.Sprite(new T.SpriteMaterial({map:GLOW,color:0x9fe6ff,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));warp.position.copy(SLOTS[slot]);scene.add(warp);
  f={ship,born:performance.now(),warp,stunned:false,label:document.createElement('div')};f.label.className='label';$('labels').append(f.label);fleet.set(slot,f);return f;
}
function clearFleet(){for(const f of fleet.values()){scene.remove(f.ship);scene.remove(f.warp);f.label.remove();}fleet.clear();}

// ---------- effects (pooled) ----------
const fx=[];// {update(dt,age)->bool}
const v=(x,y,z)=>new T.Vector3(x,y,z);
function bossPoint(){const p=v(-650+Math.random()*1250,10+Math.random()*170,(Math.random()-.5)*420);return boss.children[0]?boss.children[0].localToWorld(p):boss.localToWorld(p);}
function gunPoint(slot){const f=fleet.get(slot);if(!f)return v(-1300,200,0);const s=f.ship;const g=s.userData.cannons?.[Math.floor(Math.random()*s.userData.cannons.length)]||v(150,0,0);return s.localToWorld(g.clone());}
const beamGeo=new T.CylinderGeometry(1,1,1,8,1,true);beamGeo.translate(0,.5,0);beamGeo.rotateX(Math.PI/2);
const beamPool=Array.from({length:80},()=>{const m=new T.Mesh(beamGeo,new T.MeshBasicMaterial({transparent:true,blending:T.AdditiveBlending,depthWrite:false}));m.visible=false;m.renderOrder=21;m.frustumCulled=false;scene.add(m);return m;});
function beam(from,to,color,width,life,boost=3){
  const m=beamPool.find(x=>!x.visible);if(!m)return;m.visible=true;m.material.color.set(color).multiplyScalar(boost);m.position.copy(from);m.lookAt(to);m.scale.set(width,width,from.distanceTo(to));
  const core=beamPool.find(x=>!x.visible);if(core){core.visible=true;core.material.color.setRGB(boost,boost,boost);core.position.copy(from);core.lookAt(to);core.scale.set(width*.35,width*.35,from.distanceTo(to));}
  fx.push({update:(dt,age)=>{const k=Math.max(0,1-age/life);m.material.opacity=k;if(core)core.material.opacity=k;if(age>life){m.visible=false;if(core)core.visible=false;return false;}return true;}});
}
function burst(at,color,size,life=.5,intensity=2){const s=sprite(color,size*.3,1);s.material.color.multiplyScalar(intensity);s.position.copy(at);fx.push({update:(dt,age)=>{const u=age/life;s.scale.setScalar(size*(.3+u*.9));s.material.opacity=Math.max(0,1-u*u);if(u>=1){freeSprite(s);return false;}return true;}});}
const ringPool=Array.from({length:24},()=>{const m=new T.Mesh(new T.RingGeometry(.86,1,96),new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}));m.visible=false;m.renderOrder=22;scene.add(m);return m;});
function ring(at,color,size,life=1){const m=ringPool.find(x=>!x.visible);if(!m)return;m.visible=true;m.material.color.set(color).multiplyScalar(2.5);m.position.copy(at);m.lookAt(camera.position);fx.push({update:(dt,age)=>{const u=age/life;m.scale.setScalar(20+size*(1-Math.pow(1-u,3)));m.material.opacity=Math.max(0,1-u);if(u>=1){m.visible=false;return false;}return true;}});}
function sparks(at,color,n=14,speed=600){const list=[];for(let i=0;i<n;i++){const s=sprite(color,18+Math.random()*16,1);s.material.color.multiplyScalar(3);s.position.copy(at);list.push({s,vel:v((Math.random()-.5),(Math.random()-.3),(Math.random()-.5)).normalize().multiplyScalar(speed*(.4+Math.random()*.8))});}
  fx.push({update:(dt,age)=>{for(const p of list){p.s.position.addScaledVector(p.vel,dt);p.vel.multiplyScalar(.96);p.s.material.opacity=Math.max(0,1-age/.7);}if(age>.7){for(const p of list)freeSprite(p.s);return false;}return true;}});}
function projectile(from,to,color,size,life,arc,onHit){
  const head=sprite(color,size,1);head.material.color.multiplyScalar(3);const trail=[];const mid=from.clone().lerp(to,.5).add(v(0,arc,(Math.random()-.5)*arc));let last=0,done=false;
  fx.push({update:(dt,age)=>{const u=Math.min(1,age/life),a=1-u;const p=from.clone().multiplyScalar(a*a).add(mid.clone().multiplyScalar(2*a*u)).add(to.clone().multiplyScalar(u*u));
    if(!done){head.position.copy(p);if(age-last>.025){last=age;const t=sprite(color,size*.55,.6);t.position.copy(p);trail.push({s:t,at:age});const sm=sprite(0x3a3a44,size*.7,.3,true);sm.position.copy(p);trail.push({s:sm,at:age,smoke:true});}}
    for(const t of trail){const k=(age-t.at)/(t.smoke?1.1:.4);t.s.material.opacity=Math.max(0,(t.smoke?.3:.6)*(1-k));t.s.scale.setScalar(size*(t.smoke?.7+k*1.4:.55*(1-k*.5)));}
    while(trail.length&&(age-trail[0].at)>(trail[0].smoke?1.1:.4))freeSprite(trail.shift().s);
    if(u>=1&&!done){done=true;freeSprite(head);onHit?.(to);}
    return !(done&&!trail.length);}});
}
let shake=0;
function flash(level){flashLevel=Math.max(flashLevel,level);}
function banner(text){const b=$('banner');b.textContent=text;b.classList.remove('go');void b.offsetWidth;b.classList.add('go');}
function number(at,text,cls){const p=at.clone().project(camera);const d=document.createElement('div');d.className='num '+cls;d.textContent=text;d.style.left=((p.x+1)/2*W+(Math.random()-.5)*60)+'px';d.style.top=((1-p.y)/2*H)+'px';$('nums').append(d);setTimeout(()=>d.remove(),1400);}
function shieldHit(at){const sh=bossParts.shield;if(!sh||sh.material.uniforms.a.value<.2)return;const local=sh.worldToLocal(at.clone());sh.material.uniforms.hit.value.copy(local);sh.material.uniforms.hitT.value=performance.now()/1000;}
function play(e){
  const shielded=data?.shield;
  if(e.kind==='laser'){
    const from=gunPoint(e.slot),to=bossPoint();beam(from,to,e.crit?0xffe56b:0x72d8ff,e.crit?4:2.4,.2,e.crit?6:4);burst(from,0x9fe6ff,60,.15,3);
    setTimeout(()=>{burst(to,shielded?0x72d8ff:0xffc08a,e.crit?280:170,.35,3);if(!shielded)sparks(to,0xffb070,e.crit?18:8,500);shieldHit(to);lightFlash(to,shielded?0x72d8ff:0xffa060,e.crit?6e5:2.5e5,160);},60);
    number(to,(e.crit?'CRIT ':'')+e.damage,e.crit?'crit':'');
  }else if(e.kind==='missile'){
    const n=Math.min(8,2+Math.floor(e.damage/200));
    for(let i=0;i<n;i++)setTimeout(()=>{const to=bossPoint();projectile(e.slot>=0?gunPoint(e.slot):v(-1700,700,300),to,0xffa050,46,.95,300,p=>{burst(p,0xff8a3a,420,.7,3);burst(p,0xffe0b0,160,.25,4);ring(p,0xffb070,240,.6);sparks(p,0xffc080,14,700);lightFlash(p,0xff8040,1.2e6,300);shieldHit(p);});},i*95);
    setTimeout(()=>number(bossPoint(),'-'+e.damage.toLocaleString('en'),'missile'),1050);banner('MISSILE BARRAGE · '+e.name.toUpperCase());
  }else if(e.kind==='torpedo'){
    const to=(boss.children[0]||boss).localToWorld(v(180,-120,0));banner('GIFTED SUB TORPEDO · '+e.name.toUpperCase());
    projectile(e.slot>=0?gunPoint(e.slot):v(-1700,800,400),to,0xf2cd73,170,1.3,140,p=>{burst(p,0xfff0c0,1700,1.1,4);ring(p,0xf2cd73,1800,1.3);ring(p,0xffffff,900,.8);sparks(p,0xffe0a0,40,1400);shake=1.1;flash(.9);lightFlash(p,0xffd890,6e6,700);number(p,'-'+e.damage.toLocaleString('en'),'torpedo');shieldHit(p);
      for(let i=0;i<7;i++)setTimeout(()=>{const q=bossPoint();burst(q,0xffa050,600,.8,3);lightFlash(q,0xff8040,1.5e6,250);},i*85);});
  }else if(e.kind==='boss'){
    for(const slot of e.slots||[]){const f=fleet.get(slot);if(!f)continue;const t=bossParts.turrets[Math.floor(Math.random()*bossParts.turrets.length)];const from=t?t.localToWorld(v(-196,34,0)):boss.localToWorld(v(-700,60,0));
      const to=f.ship.position.clone();beam(from,to,0xff2e4d,9,.55,6);burst(from,0xff5060,160,.3,4);setTimeout(()=>{burst(to,0xff4050,480,.6,3);sparks(to,0xff8080,16,700);lightFlash(to,0xff3040,2e6,300);},80);}
    if(bossParts.core)burst(bossParts.core.getWorldPosition(v(0,0,0)),0xff3050,900,.5,3);shake=Math.max(shake,.45);
  }
}

// ---------- HUD ----------
const fmtTime=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
let data=null,offset=0,seen=new Set(),lastId=null,outcomeShown=null,hpShown=1;
function hud(now){
  const d=data,live=d&&d.phase!=='idle';stage.classList.toggle('on',!!live);if(!live)return;
  const t=now+offset;$('preview-tag').hidden=!d.demo;
  $('bossbar').hidden=d.phase==='lobby';$('clock').hidden=d.phase!=='battle';$('fleet').hidden=false;$('legend').hidden=d.phase!=='battle'&&d.phase!=='lobby';
  $('bossname').textContent=d.name;const frac=Math.max(0,d.hp/d.maxHp);
  $('hp').querySelector('i').style.transform=`scaleX(${frac})`;if(frac<hpShown||frac>hpShown+.01){$('hp').querySelector('b').style.transform=`scaleX(${frac})`;hpShown=frac;}
  $('hptext').textContent=d.hp.toLocaleString('en')+' / '+d.maxHp.toLocaleString('en')+' HULL · '+Math.ceil(frac*100)+'%';
  const tags=[];if(d.shield&&d.phase==='battle')tags.push('<span class="tag shield">◈ SHIELDS UP · !FIRE HALVED</span>');if(d.enraged&&d.phase==='battle')tags.push('<span class="tag rage">▲ ENRAGED</span>');$('tags').innerHTML=tags.join('');
  const left=d.endsAt-t;$('clocktime').textContent=fmtTime(left);$('clock').classList.toggle('low',left<30000);
  $('pilotcount').textContent=d.pilots+' pilot'+(d.pilots===1?'':'s');
  const ol=$('leaders');ol.replaceChildren();
  (d.leaders.length?d.leaders:d.fleet.slice(0,5).map(p=>({...p,damage:null}))).forEach((p,i)=>{const li=document.createElement('li');const r=document.createElement('span');r.className='r';r.textContent=p.damage===null?'·':String(i+1);
    const dot=document.createElement('span');dot.className='p '+p.platform;const n=document.createElement('span');n.className='n';n.textContent=p.name;const dm=document.createElement('span');dm.className='d';dm.textContent=p.damage===null?'READY':p.damage.toLocaleString('en');li.append(r,dot,n,dm);ol.append(li);});
  const feed=$('feed'),key=d.feed.map(f=>f.id).join(',');if(feed.dataset.key!==key){feed.dataset.key=key;feed.replaceChildren(...d.feed.slice(0,5).map(f=>{const x=document.createElement('div');x.className=f.kind;x.textContent=f.text;return x;}));}
  $('lobby').hidden=d.phase!=='lobby';
  if(d.phase==='lobby'){$('lobbytitle').textContent=d.name+' approaches';$('lobbytime').textContent=Math.max(0,Math.ceil((d.lobbyEndsAt-t)/1000));$('lobbycount').textContent=d.pilots+' pilot'+(d.pilots===1?'':'s')+' boarded';}
  $('result').hidden=d.phase!=='result';
  if(d.phase==='result'&&outcomeShown!==d.id+d.outcome){
    outcomeShown=d.id+d.outcome;const win=d.outcome==='victory',r=$('result');r.classList.toggle('win',win);
    $('resulteyebrow').textContent=win?'★ VICTORY':d.outcome==='empty'?'NO PILOTS':'☠ BATTLE LOST';
    $('resulttitle').textContent=win?d.name+' destroyed':d.outcome==='empty'?d.name+' moved on':d.name+' escaped';
    const mvp=d.leaders[0];$('resultline').textContent=win?(mvp?'MVP '+mvp.name+' · ':'')+(d.victoryPoints&&!d.demo?'Every pilot who fought earns '+d.victoryPoints+' Voyager points':'Great work, pilots'):d.outcome==='empty'?'Nobody boarded the fleet this time.':'It escaped with '+Math.ceil(d.hp/d.maxHp*100)+'% hull left. No points are awarded. It will be back.';
    const st=$('resultstats');st.replaceChildren();for(const [label,value] of [['PILOTS',d.pilots],['DAMAGE',(d.maxHp-d.hp).toLocaleString('en')],['!FIRE SHOTS',d.damage.fire.toLocaleString('en')],['GIFTED SUBS',d.damage.gifts]]){const x=document.createElement('div');const b=document.createElement('b');b.textContent=value;x.append(b,label);st.append(x);}
    if(win)victory();else if(d.outcome==='escaped')escape();
  }
}
// ---------- boss motion ----------
let anim={mode:'idle',start:0};
const debris=(()=>{const n=140,m=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:0x26292e,metalness:.6,roughness:.55}),n);m.visible=false;m.frustumCulled=false;m.castShadow=true;m.layers.enable(1);scene.add(m);return {m,n,parts:[]};})();
function victory(){
  anim={mode:'explode',start:performance.now()};flash(.6);shake=1.2;
  for(let i=0;i<34;i++)setTimeout(()=>{const p=bossPoint();burst(p,i%3?0xff9a4a:0xfff0c0,500+Math.random()*800,.95,3);sparks(p,0xffc080,18,900);lightFlash(p,0xff8040,3e6,350);if(i%6===0)ring(p,0xffc080,700,1);shake=Math.max(shake,.5);},i*95);
  setTimeout(()=>{const c=(boss.children[0]||boss).localToWorld(v(100,40,0));burst(c,0xffffff,4200,1.6,6);ring(c,0xf2cd73,2600,1.8);ring(c,0x72d8ff,1600,1.2);flash(2.2);shake=1.6;lightFlash(c,0xfff0d0,2e7,900);
    debris.m.visible=true;debris.parts=[];const q=new T.Quaternion(),mm=new T.Matrix4();
    for(let i=0;i<debris.n;i++){const pos=bossPoint(),vel=pos.clone().sub(c).normalize().multiplyScalar(300+Math.random()*900).add(v(0,80,0));debris.parts.push({pos,vel,rot:new T.Euler(Math.random()*6,Math.random()*6,Math.random()*6),spin:v(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(4),size:v(10+Math.random()*60,6+Math.random()*30,10+Math.random()*50)});}
    for(const d of damageFx)if(d.fire)d.fire.visible=false;},3200);
}
function escape(){anim={mode:'escape',start:performance.now()};}
function resetBoss(duration=3000){boss.visible=true;boss.rotation.set(.06,.34,-.03);boss.position.copy(BOSS_HOME).add(v(2600,0,-500));anim={mode:'arrive',start:performance.now(),duration};debris.m.visible=false;debris.parts=[];
  while(damageFx.length){const d=damageFx.pop();if(d.fire)freeSprite(d.fire);for(const x of d.smoke)freeSprite(x.s);}}

// ---------- 60 fps governor ----------
// Lowers the render resolution if frames run slow, and raises it again when there is headroom.
const perf={frames:0,since:performance.now(),good:0,fps:0};
const fpsBox=params.get('fps')==='1'?Object.assign(document.createElement('div'),{style:'position:absolute;left:12px;top:8px;font:700 16px monospace;color:#7ce1cb;z-index:9;text-shadow:0 1px 2px #000'}):null;if(fpsBox)document.body.append(fpsBox);
function governor(now){
  perf.frames++;if(now-perf.since<1000)return;perf.fps=perf.frames*1000/(now-perf.since);perf.frames=0;perf.since=now;
  if(fpsBox)fpsBox.textContent=perf.fps.toFixed(0)+' fps · '+Math.round(W*res)+'×'+Math.round(H*res)+' · '+QUALITY;
  if(data?.phase==='idle')return;
  if(perf.fps<50&&res>.55){res=Math.max(.5,+(res-.15).toFixed(2));sizeTargets();perf.good=0;}
  else if(perf.fps>58.5&&res<MAX_RES){if(++perf.good>=4){res=Math.min(MAX_RES,+(res+.1).toFixed(2));sizeTargets();perf.good=0;}}else perf.good=0;
}

// ---------- main loop ----------
let ready=false,last=performance.now();const mm=new T.Matrix4(),qq=new T.Quaternion(),one=new T.Vector3();
function frame(now){
  requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
  hud(Date.now());if(!ready||!data||data.phase==='idle')return;
  governor(now);
  const t=now/1000,d=data,frac=Math.max(0,d.hp/d.maxHp);
  if(anim.mode==='arrive'){const u=Math.min(1,(now-anim.start)/anim.duration);const e=1-Math.pow(1-u,3);boss.position.copy(BOSS_HOME).add(v(2600*(1-e),0,-500*(1-e)));if(u>=1)anim.mode='hover';}
  else if(anim.mode==='explode'){const u=(now-anim.start)/3400;if(u>.97)boss.visible=false;else{boss.position.y=BOSS_HOME.y-u*u*260;boss.rotation.z=-.03-u*u*.32;boss.rotation.x=.06+u*.12;}}
  else if(anim.mode==='escape'){const u=Math.min(1,(now-anim.start)/4200);boss.position.copy(BOSS_HOME).add(v(u*u*u*4200,u*160,-u*u*1600));if(u>.92&&!anim.warp){anim.warp=true;const p=(boss.children[0]||boss).localToWorld(v(0,0,0));burst(p,0x9fe6ff,2600,.8,5);ring(p,0x72d8ff,1400,.9);lightFlash(p,0x9fe6ff,4e6,500);}if(u>=1)boss.visible=false;}
  else if(anim.mode==='hover'){boss.position.y=BOSS_HOME.y+Math.sin(t*.55)*14;boss.rotation.z=-.03+Math.sin(t*.4)*.012;boss.rotation.y=.34+Math.sin(t*.23)*.015;}
  // Ship systems: reactor pulse, engines, running lights, turrets tracking the fleet, shield.
  const pulse=.75+.25*Math.sin(t*(d.enraged?9:3));
  if(coreGlow){coreGlow.material.opacity=.6+.35*pulse;coreGlow.scale.setScalar((d.enraged?720:520)*(.9+.15*pulse));coreGlow.material.color.setHex(0xff3050).multiplyScalar(2.5);}
  if(bossParts.light)bossParts.light.intensity=(d.enraged?8e4:3e4)*pulse;
  for(const st of bossParts.strips)st.material.color.setHex(d.enraged&&Math.sin(t*12)>0?0xffc0c8:st.userData.base??(st.userData.base=st.material.color.getHex())).multiplyScalar(2.4);
  const thrust=anim.mode==='escape'?2.4:anim.mode==='arrive'?1.4:1;
  for(const p of bossParts.plumes){p.material.uniforms.t.value=t;p.material.uniforms.power.value=thrust;p.scale.x=(p.userData.sx??(p.userData.sx=p.scale.x))*(.8+.2*thrust);}
  for(const e of bossParts.engines)if(e.userData.glow){e.userData.glow.material.opacity=.8+.2*Math.sin(t*23+e.id);e.userData.glow.scale.setScalar(150*thrust);e.userData.glow.material.color.setHex(0xff9050).multiplyScalar(1.6);}
  runLights.forEach((s,i)=>{const on=Math.sin(t*3.2+i*1.7)>.6;s.material.opacity=on?1:.06;s.material.color.setHex(bossParts.lights[i].color).multiplyScalar(on?4:1);});
  bossParts.turrets.forEach((tr,i)=>{tr.rotation.y=Math.sin(t*.5+i*1.3)*.28-.05;});
  bossParts.dishes?.forEach((dsh,i)=>{dsh.rotation.y+=dt*(.25+i*.1);});
  if(bossParts.shield){const sm=bossParts.shield.material.uniforms;sm.t.value=performance.now()/1000;sm.a.value+=((d.shield&&d.phase==='battle'?1:0)-sm.a.value)*Math.min(1,dt*5);bossParts.shield.visible=sm.a.value>.01;}
  if(anim.mode!=='explode')updateDamage(frac,t);
  for(const f of flashes){const k=Math.max(0,(f.until-now)/(f.ms||1));f.l.intensity=f.peak*k*k;}
  // Debris after destruction.
  if(debris.m.visible){debris.parts.forEach((p,i)=>{p.pos.addScaledVector(p.vel,dt);p.vel.multiplyScalar(.995);p.rot.x+=p.spin.x*dt;p.rot.y+=p.spin.y*dt;p.rot.z+=p.spin.z*dt;qq.setFromEuler(p.rot);mm.compose(p.pos,qq,p.size);debris.m.setMatrixAt(i,mm);});debris.m.instanceMatrix.needsUpdate=true;}
  // Fleet.
  const want=new Map(d.fleet.map(p=>[p.slot,p]));
  for(const [slot,f] of fleet)if(!want.has(slot)){scene.remove(f.ship);scene.remove(f.warp);f.label.remove();fleet.delete(slot);}
  for(const p of d.fleet){
    const f=shipFor(p.slot),age=(now-f.born)/1000,home=SLOTS[p.slot],e=1-Math.pow(1-Math.min(1,age/1.1),4);
    f.ship.position.set(home.x-1100*(1-e)+Math.sin(t*.9+p.slot)*8,home.y+Math.sin(t*1.3+p.slot*1.7)*10,home.z);
    f.ship.rotation.x=Math.sin(t*1.1+p.slot)*.06+(p.stunned?Math.sin(t*20)*.08:0);f.ship.rotation.z=(p.stunned?-.35:0)+Math.sin(t*.8+p.slot)*.03;
    animateShip(f.ship,t,p.stunned?.05:.45+(age<1.2?1:0));
    f.warp.material.opacity=Math.max(0,1-age*1.4);f.warp.material.color.setHex(0x9fe6ff).multiplyScalar(3);f.warp.scale.setScalar(200+age*800);
    if(p.stunned&&Math.random()<.25)burst(f.ship.position.clone().add(v((Math.random()-.5)*80,0,0)),0xff6040,50,.3,3);
    const sp=f.ship.position.clone().add(v(0,-80,0)).project(camera);f.label.style.left=((sp.x+1)/2*W)+'px';f.label.style.top=((1-sp.y)/2*H)+'px';
    f.label.textContent=p.stunned?p.name+' · SYSTEMS DOWN':p.name;f.label.classList.toggle('down',p.stunned);f.label.style.opacity=p.stunned||age<4||d.phase==='lobby'?1:0;
  }
  // New effects from the host.
  let played=0;for(const e of d.effects){if(seen.has(e.id))continue;seen.add(e.id);if(Date.now()+offset-e.at<2500&&(e.kind!=='laser'||fx.length<140)&&played++<8)play(e);}
  if(seen.size>500)seen=new Set([...seen].slice(-200));
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.age=(f.age||0)+dt;if(!f.update(dt,f.age))fx.splice(i,1);}
  dust.position.x=-((t*22)%600);
  shake=Math.max(0,shake-dt*1.5);flashLevel=Math.max(0,flashLevel-dt*2.4);
  camera.position.set(CAM.x+(Math.random()-.5)*shake*26+Math.sin(t*.13)*30,CAM.y+(Math.random()-.5)*shake*26+Math.sin(t*.17)*14,CAM.z);camera.lookAt(LOOK);
  renderFrame(t);
}
async function poll(){
  try{const t=Date.now(),r=await fetch('/api/boss/overlay',{cache:'no-store'});const next=await r.json();offset=next.serverAt-(t+Date.now())/2;
    if(next.id!==lastId&&next.phase!=='idle'){lastId=next.id;seen=new Set((next.effects||[]).map(e=>e.id));clearFleet();outcomeShown=null;hpShown=1;if(ready)resetBoss(next.phase==='lobby'?Math.min(20000,Math.max(4000,next.lobbyEndsAt-next.serverAt-2000)):2500);}
    data=next;}catch{}
  setTimeout(poll,250);
}
(async()=>{
  try{await Promise.all([shipMeshesReady(),materialsReady(),buildBoss(),backdrop()]);}catch(e){console.warn('Dreadnought assets:',e);}
  // Compile every shader once up front so the first shots don't stutter.
  try{renderer.compile(scene,camera);}catch{}
  resetBoss();ready=true;
})();
poll();requestAnimationFrame(frame);
