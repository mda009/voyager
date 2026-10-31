// Voyager Dreadnought OBS overlay (2.17). Reads /api/boss/overlay from the local Voyager host and renders the
// fight with the same ships, hull materials and lighting as Voyager Versus.
import * as T from './vendor/three.module.min.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.mjs';
import {createShip,animateShip,shipMeshesReady,materialsReady,surfaceMaps} from './ship-models.mjs?v=2.3.0';

const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
if(params.get('backdrop')==='0')document.body.classList.add('backdrop-off');
const W=1920,H=1080,KEYS=['interceptor','sentinel','phantom'];
const stage=$('stage');
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);stage.style.transform=`translate(${(innerWidth-W*s)/2}px,${(innerHeight-H*s)/2}px) scale(${s})`;}
addEventListener('resize',fit);fit();

// ---------- starfield backdrop ----------
(function space(){
  const c=$('space'),x=c.getContext('2d');const g=x.createRadialGradient(1300,420,40,1300,420,1300);g.addColorStop(0,'#2a0f1e');g.addColorStop(.35,'#120b1f');g.addColorStop(1,'#04070d');x.fillStyle=g;x.fillRect(0,0,W,H);
  const n=x.createRadialGradient(420,760,10,420,760,700);n.addColorStop(0,'rgba(40,110,170,.35)');n.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=n;x.fillRect(0,0,W,H);
  let seed=7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let i=0;i<900;i++){const a=r()*.8+.1,s=r()<.04?2.2:r()*1.3+.3;x.fillStyle=`rgba(${200+r()*55|0},${210+r()*45|0},255,${a})`;x.beginPath();x.arc(r()*W,r()*H,s,0,7);x.fill();}
})();

// ---------- renderer ----------
const renderer=new T.WebGLRenderer({canvas:$('gl'),alpha:true,antialias:true,powerPreference:'high-performance'});
const RES=Math.min(1,Math.max(.25,Number(params.get('res'))||1));renderer.setSize(W*RES,H*RES,false);renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new T.Scene();
{const pm=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pm.fromScene(room,.03).texture;scene.environmentIntensity=.55;room.dispose();pm.dispose();}
const camera=new T.PerspectiveCamera(34,W/H,10,20000);camera.position.set(-120,420,2500);camera.lookAt(-60,-20,0);
scene.add(new T.HemisphereLight(0xc5d8ed,0x15101a,.45));
const key=new T.DirectionalLight(0xffe6d0,3.0);key.position.set(-900,1200,1400);scene.add(key);
const rim=new T.DirectionalLight(0x72d8ff,1.6);rim.position.set(-1600,200,-600);scene.add(rim);
const redRim=new T.DirectionalLight(0xff4050,1.4);redRim.position.set(1600,-300,-400);scene.add(redRim);

function glowTexture(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,255,255,.75)');g.addColorStop(.45,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
const GLOW=glowTexture();
const sprite=(color,size,opacity=1)=>{const s=new T.Sprite(new T.SpriteMaterial({map:GLOW,color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));s.scale.setScalar(size);return s;};

// ---------- the Dreadnought ----------
const boss=new T.Group();scene.add(boss);
const bossParts={core:null,coreGlow:null,engines:[],turrets:[],shield:null,strips:[]};
function hullMat(color,repeat){
  const maps=surfaceMaps(),m={};
  for(const k of ['map','normalMap','roughnessMap']){const t=maps[k].clone();t.repeat.set(repeat,repeat);t.needsUpdate=true;m[k]=t;}
  return new T.MeshPhysicalMaterial({...m,color,metalness:.72,roughness:.5,normalScale:new T.Vector2(.35,.35),clearcoat:.2,clearcoatRoughness:.4,envMapIntensity:.9});
}
function buildBoss(){
  const dark=hullMat(0x3a4048,1/110),plate=hullMat(0x4c535c,1.6),trim=new T.MeshPhysicalMaterial({color:0x1d2127,metalness:.85,roughness:.4});
  const redLit=new T.MeshBasicMaterial({color:0xff3344,toneMapped:false});
  const outline=[[-680,0],[-420,70],[-240,150],[60,240],[420,290],[640,250],[700,120],[700,-120],[640,-250],[420,-290],[60,-240],[-240,-150],[-420,-70]];
  const shape=s=>{const sh=new T.Shape();outline.forEach(([x,y],i)=>i?sh.lineTo(x*s,y*s):sh.moveTo(x*s,y*s));sh.closePath();return sh;};
  const deck=(s,depth,y,mat)=>{const g=new T.ExtrudeGeometry(shape(s),{depth,bevelEnabled:true,bevelThickness:18,bevelSize:16,bevelSegments:2});g.rotateX(Math.PI/2);g.translate(0,y+depth/2,0);const m=new T.Mesh(g,mat);boss.add(m);return m;};
  deck(1,110,-40,dark);deck(.78,70,70,dark);deck(.52,60,150,plate);
  const box=(w,h,d,x,y,z,mat=plate)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);boss.add(m);return m;};
  // Command tower near the stern: low and wide, with a lit bridge band.
  box(240,80,170,360,215,0);box(150,60,130,380,285,0);box(40,22,300,390,325,0,trim);box(10,90,10,410,370,0,trim);
  const bridge=new T.Mesh(new T.BoxGeometry(154,10,134),redLit);bridge.position.set(372,292,0);boss.add(bridge);
  // Prow spikes and swept wings.
  for(const side of [-1,1]){
    const spike=new T.Mesh(new T.ConeGeometry(26,420,10),trim);spike.rotation.z=Math.PI/2;spike.position.set(-760,10,side*60);boss.add(spike);
    const wing=new T.Shape();wing.moveTo(0,0);wing.lineTo(520,0);wing.lineTo(640,240);wing.lineTo(420,240);wing.closePath();
    const wg=new T.ExtrudeGeometry(wing,{depth:22,bevelEnabled:true,bevelThickness:6,bevelSize:6,bevelSegments:1});wg.rotateX(-Math.PI/2*side);
    const w=new T.Mesh(wg,dark);w.position.set(-40,-20,side*240);w.rotation.x=side*.22;boss.add(w);
  }
  // Rows of lit windows give the hull its scale.
  const win=new T.InstancedMesh(new T.BoxGeometry(10,5,2),new T.MeshBasicMaterial({color:0xbfe8ff,toneMapped:false}),220);let wi=0;const mm=new T.Matrix4();
  for(const side of [-1,1])for(const [y,x0,x1,zf] of [[-5,-300,560,.92],[95,-180,480,.74]])for(let x=x0;x<x1&&wi<220;x+=26+((x*7)%17)){if((x*13)%5===0)continue;const half=(x<60?150+(x+300)/360*90:240+(x-60)/360*50)*zf;mm.makeTranslation(x,y,side*(half+14));win.setMatrixAt(wi++,mm);}
  win.count=wi;boss.add(win);
  // Hangar pods and armour ribs along both flanks.
  for(const side of [-1,1]){box(420,70,90,200,0,side*270,dark);for(let i=0;i<6;i++)box(26,120,40,-200+i*120,10,side*(150+i*22),trim);
    const strip=new T.Mesh(new T.BoxGeometry(520,6,6),redLit);strip.position.set(120,20,side*(265+40));boss.add(strip);bossParts.strips.push(strip);}
  // Dorsal spine and prow.
  box(900,24,40,-80,210,0,trim);box(260,40,60,-560,40,0,trim);
  // Turrets along the spine.
  for(const [x,z] of [[-380,-70],[-380,70],[-120,-110],[-120,110],[140,-150],[140,150]]){
    const t=new T.Group();t.position.set(x,(x<-200?95:x<0?150:120),z);
    const base=new T.Mesh(new T.CylinderGeometry(34,40,28,16),plate);t.add(base);
    for(const o of [-10,10]){const b=new T.Mesh(new T.CylinderGeometry(5,6,110,8),trim);b.rotation.z=Math.PI/2;b.position.set(-55,14,o);t.add(b);}
    boss.add(t);bossParts.turrets.push(t);
  }
  // Engines.
  for(const [y,z] of [[20,-150],[20,150],[110,-70],[110,70]]){
    const e=new T.Mesh(new T.CylinderGeometry(62,74,170,20),trim);e.rotation.z=Math.PI/2;e.position.set(740,y,z);boss.add(e);
    const g=sprite(0xff6a3a,260,.9);g.position.set(840,y,z);boss.add(g);bossParts.engines.push(g);
    const inner=sprite(0xffd2a0,110,1);inner.position.set(835,y,z);boss.add(inner);bossParts.engines.push(inner);
  }
  // Reactor core under the belly.
  const core=new T.Mesh(new T.SphereGeometry(70,32,16),new T.MeshBasicMaterial({color:0xff2840,toneMapped:false}));core.position.set(20,-70,0);boss.add(core);bossParts.core=core;
  const cg=sprite(0xff3050,420,.85);cg.position.copy(core.position);boss.add(cg);bossParts.coreGlow=cg;
  const light=new T.PointLight(0xff3344,4,1600,1.4);light.position.set(20,-160,120);boss.add(light);bossParts.light=light;
  // Shield bubble (shown while shields are up).
  const sm=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{t:{value:0},a:{value:0}},
    vertexShader:'varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}',
    fragmentShader:'uniform float t;uniform float a;varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){float f=pow(1.-abs(dot(vN,vV)),2.4);float hex=.5+.5*sin(vP.x*.05+t*3.)*sin(vP.y*.06-t*2.)*sin(vP.z*.05);gl_FragColor=vec4(vec3(.45,.85,1.)*(f*1.6+hex*.12),(f*.9+hex*.08)*a);}'});
  const sh=new T.Mesh(new T.SphereGeometry(1,48,24),sm);sh.scale.set(860,330,420);sh.position.set(30,70,0);boss.add(sh);bossParts.shield=sh;
  boss.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=false;});
}
const BOSS_HOME=new T.Vector3(430,-10,-120);
boss.rotation.set(.05,.32,-.03);

// ---------- the fleet ----------
const SLOTS=Array.from({length:12},(_,i)=>{const col=i%3,row=Math.floor(i/3);return new T.Vector3(-1150+col*230+(row%2)*110,190-row*135,-40+(col-1)*170);});
const fleet=new Map();// slot -> {ship, pilot, born, flash}
function shipFor(slot){
  let f=fleet.get(slot);if(f)return f;
  const ship=createShip(KEYS[slot%3]);ship.scale.setScalar(.78);ship.position.copy(SLOTS[slot]).add(new T.Vector3(-900,0,0));ship.rotation.set(0,-.18,0);
  scene.add(ship);const warp=sprite(0x72d8ff,600,1);warp.position.copy(SLOTS[slot]);scene.add(warp);
  f={ship,born:performance.now(),warp,stunned:false,label:document.createElement('div')};f.label.className='label';$('labels').append(f.label);fleet.set(slot,f);return f;
}
function clearFleet(){for(const f of fleet.values()){scene.remove(f.ship);scene.remove(f.warp);f.label.remove();}fleet.clear();}

// ---------- effects ----------
const fx=[];// {update(dt,age)->bool alive}
const v=(x,y,z)=>new T.Vector3(x,y,z);
function bossPoint(){const p=v(-480+Math.random()*1050,-20+Math.random()*190,(Math.random()-.5)*360);return boss.localToWorld(p);}
function gunPoint(slot){const f=fleet.get(slot);if(!f)return v(-1100,200,0);const s=f.ship;const g=s.userData.cannons?.[Math.floor(Math.random()*s.userData.cannons.length)]||v(150,0,0);return s.localToWorld(g.clone());}
function beam(from,to,color,width,life){
  const len=from.distanceTo(to),geo=new T.CylinderGeometry(width,width,len,6,1,true);geo.translate(0,len/2,0);geo.rotateX(Math.PI/2);
  const m=new T.Mesh(geo,new T.MeshBasicMaterial({color,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));
  m.position.copy(from);m.lookAt(to);scene.add(m);
  fx.push({update:(dt,age)=>{m.material.opacity=Math.max(0,1-age/life);if(age>life){scene.remove(m);geo.dispose();m.material.dispose();return false;}return true;}});
}
function burst(at,color,size,life=.5){const s=sprite(color,size*.3,1);s.position.copy(at);scene.add(s);fx.push({update:(dt,age)=>{const u=age/life;s.scale.setScalar(size*(.3+u*.9));s.material.opacity=Math.max(0,1-u);if(u>=1){scene.remove(s);s.material.dispose();return false;}return true;}});}
function ring(at,color,size,life=1){
  const geo=new T.RingGeometry(.8,1,64),m=new T.Mesh(geo,new T.MeshBasicMaterial({color,transparent:true,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));
  m.position.copy(at);m.lookAt(camera.position);scene.add(m);fx.push({update:(dt,age)=>{const u=age/life;m.scale.setScalar(20+size*u);m.material.opacity=Math.max(0,1-u);if(u>=1){scene.remove(m);geo.dispose();m.material.dispose();return false;}return true;}});
}
function projectile(from,to,color,size,life,arc,onHit){
  const head=sprite(color,size,1),trail=[];scene.add(head);const mid=from.clone().lerp(to,.5).add(v(0,arc,(Math.random()-.5)*arc));let last=0;
  fx.push({update:(dt,age)=>{const u=Math.min(1,age/life),a=1-u;const p=from.clone().multiplyScalar(a*a).add(mid.clone().multiplyScalar(2*a*u)).add(to.clone().multiplyScalar(u*u));head.position.copy(p);
    if(u<1&&age-last>.04){last=age;const t=sprite(color,size*.6,.6);t.position.copy(p);scene.add(t);trail.push({s:t,at:age});}
    for(const t of trail){const k=(age-t.at)/.45;t.s.material.opacity=Math.max(0,.6*(1-k));t.s.scale.setScalar(size*.6*(1-k*.5));}
    while(trail.length&&age-trail[0].at>.45){const t=trail.shift().s;scene.remove(t);t.material.dispose();}
    if(u>=1){if(head.parent){scene.remove(head);head.material.dispose();}onHit?.(to);onHit=null;if(!trail.length)return false;}return true;}});
}
let shake=0;
function flash(opacity){const f=$('flash');f.style.transition='none';f.style.opacity=opacity;requestAnimationFrame(()=>{f.style.transition='opacity .6s';f.style.opacity=0;});}
function banner(text){const b=$('banner');b.textContent=text;b.classList.remove('go');void b.offsetWidth;b.classList.add('go');}
function number(at,text,cls){const p=at.clone().project(camera);const d=document.createElement('div');d.className='num '+cls;d.textContent=text;d.style.left=((p.x+1)/2*W+(Math.random()-.5)*60)+'px';d.style.top=((1-p.y)/2*H)+'px';$('nums').append(d);setTimeout(()=>d.remove(),1400);}
function play(e){
  if(e.kind==='laser'){
    const from=gunPoint(e.slot),to=bossPoint();beam(from,to,e.crit?0xffe56b:0x72d8ff,e.crit?5:3,.22);burst(to,0x9fe6ff,e.crit?260:160,.4);number(to,(e.crit?'CRIT ':'')+e.damage,e.crit?'crit':'');
  }else if(e.kind==='missile'){
    const n=Math.min(6,2+Math.floor(e.damage/250));
    for(let i=0;i<n;i++)setTimeout(()=>{const to=bossPoint();projectile(e.slot>=0?gunPoint(e.slot):v(-1500,600,200),to,0xff9a4a,70,.9,260,p=>{burst(p,0xff8a3a,380,.6);ring(p,0xffb070,260,.6);});},i*110);
    setTimeout(()=>number(bossPoint(),'-'+e.damage.toLocaleString('en'),'missile'),1000);banner('MISSILE BARRAGE · '+e.name.toUpperCase());
  }else if(e.kind==='torpedo'){
    const to=boss.localToWorld(v(20,-40,0));banner('GIFTED SUB TORPEDO · '+e.name.toUpperCase());
    projectile(e.slot>=0?gunPoint(e.slot):v(-1500,700,300),to,0xf2cd73,220,1.25,120,p=>{burst(p,0xfff0c0,1400,1);ring(p,0xf2cd73,1600,1.2);ring(p,0xffffff,900,.8);shake=1;flash(.55);number(p,'-'+e.damage.toLocaleString('en'),'torpedo');
      for(let i=0;i<6;i++)setTimeout(()=>burst(bossPoint(),0xffc080,500,.7),i*90);});
  }else if(e.kind==='boss'){
    for(const slot of e.slots||[]){const f=fleet.get(slot);if(!f)continue;const t=bossParts.turrets[Math.floor(Math.random()*bossParts.turrets.length)];const from=t?t.localToWorld(v(-110,14,0)):boss.localToWorld(v(-600,60,0));
      const to=f.ship.position.clone();beam(from,to,0xff2e4d,7,.5);burst(to,0xff4050,420,.6);}
    burst(bossParts.core.getWorldPosition(v(0,0,0)),0xff3050,900,.5);shake=Math.max(shake,.4);
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
    const mvp=d.leaders[0];$('resultline').textContent=win?(mvp?'MVP '+mvp.name+' · ':'')+(d.victoryPoints&&!d.demo?'Every pilot who fought earns '+d.victoryPoints+' Voyager points':'Great work, pilots'):d.outcome==='empty'?'Nobody boarded the fleet this time.':'It escaped with '+Math.ceil(d.hp/d.maxHp*100)+'% hull left. It will be back.';
    const st=$('resultstats');st.replaceChildren();for(const [label,value] of [['PILOTS',d.pilots],['DAMAGE',(d.maxHp-d.hp).toLocaleString('en')],['!FIRE SHOTS',d.damage.fire.toLocaleString('en')],['GIFTED SUBS',d.damage.gifts]]){const x=document.createElement('div');const b=document.createElement('b');b.textContent=value;x.append(b,label);st.append(x);}
    if(win)victory();else if(d.outcome==='escaped')escape();
  }
}
// ---------- boss motion ----------
let anim={mode:'idle',start:0};
function victory(){anim={mode:'explode',start:performance.now()};flash(.8);shake=1.2;for(let i=0;i<26;i++)setTimeout(()=>{const p=bossPoint();burst(p,i%3?0xff9a4a:0xfff0c0,500+Math.random()*700,.9);if(i%7===0)ring(p,0xffc080,600,1);},i*110);setTimeout(()=>{burst(boss.localToWorld(v(20,40,0)),0xffffff,3600,1.4);ring(boss.position.clone(),0xf2cd73,1800,1.6);flash(1);},2900);}
function escape(){anim={mode:'escape',start:performance.now()};}
function resetBoss(duration=3000){boss.visible=true;boss.rotation.set(.05,.32,-.03);for(const g of bossParts.engines)if(g.userData.base)g.scale.setScalar(g.userData.base);boss.position.copy(BOSS_HOME).add(v(2200,0,-400));anim={mode:'arrive',start:performance.now(),duration};}

// ---------- main loop ----------
let ready=false,last=performance.now();
function frame(now){
  requestAnimationFrame(frame);const dt=Math.min(.1,(now-last)/1000);last=now;
  hud(Date.now());if(!ready||!data||data.phase==='idle')return;
  const t=now/1000,d=data;
  // Boss arrival/hover/explosion/escape.
  if(anim.mode==='arrive'){const u=Math.min(1,(now-anim.start)/anim.duration);const e=1-Math.pow(1-u,3);boss.position.copy(BOSS_HOME).add(v(2200*(1-e),0,-400*(1-e)));if(u>=1)anim.mode='hover';}
  else if(anim.mode==='explode'){const u=(now-anim.start)/3200;if(u>.9){boss.visible=false;}else{boss.position.y=BOSS_HOME.y-u*u*220;boss.rotation.z=-.03-u*.25;}}
  else if(anim.mode==='escape'){const u=Math.min(1,(now-anim.start)/4000);boss.position.copy(BOSS_HOME).add(v(u*u*2600,u*120,-u*u*900));for(const g of bossParts.engines)g.scale.setScalar((g.userData.base||(g.userData.base=g.scale.x))*(1+u*1.6));}
  else if(anim.mode==='hover'){boss.position.y=BOSS_HOME.y+Math.sin(t*.6)*14;boss.rotation.z=-.03+Math.sin(t*.4)*.012;}
  const pulse=.75+.25*Math.sin(t*(d.enraged?9:3));bossParts.coreGlow.material.opacity=.55+.4*pulse;bossParts.coreGlow.scale.setScalar((d.enraged?560:420)*(.9+.15*pulse));bossParts.light.intensity=(d.enraged?7:4)*pulse;
  for(const s of bossParts.strips)s.material.color.setHex(d.enraged&&Math.sin(t*12)>0?0xffb0b8:0xff3344);
  for(const g of bossParts.engines)if(anim.mode!=='escape')g.material.opacity=.75+.25*Math.sin(t*14+g.id);
  const sm=bossParts.shield.material.uniforms;sm.t.value=t;sm.a.value+=((d.shield?1:0)-sm.a.value)*Math.min(1,dt*5);
  bossParts.turrets.forEach((tr,i)=>{tr.rotation.y=Math.sin(t*.7+i)*.35;});
  // Fleet.
  const want=new Map(d.fleet.map(p=>[p.slot,p]));
  for(const [slot,f] of fleet)if(!want.has(slot)){scene.remove(f.ship);scene.remove(f.warp);f.label.remove();fleet.delete(slot);}
  for(const p of d.fleet){
    const f=shipFor(p.slot),age=(now-f.born)/1000,home=SLOTS[p.slot],e=1-Math.pow(1-Math.min(1,age/1.1),4);
    f.ship.position.set(home.x-900*(1-e)+Math.sin(t*.9+p.slot)*8,home.y+Math.sin(t*1.3+p.slot*1.7)*10,home.z);
    f.ship.rotation.x=Math.sin(t*1.1+p.slot)*.06+(p.stunned?Math.sin(t*20)*.08:0);f.ship.rotation.z=(p.stunned?-.35:0)+Math.sin(t*.8+p.slot)*.03;
    animateShip(f.ship,t,p.stunned?.05:.45);
    f.warp.material.opacity=Math.max(0,1-age*1.4);f.warp.scale.setScalar(200+age*700);
    const sp=f.ship.position.clone().add(v(0,-80,0)).project(camera);f.label.style.left=((sp.x+1)/2*W)+'px';f.label.style.top=((1-sp.y)/2*H)+'px';
    f.label.textContent=p.stunned?p.name+' · SYSTEMS DOWN':p.name;f.label.classList.toggle('down',p.stunned);f.label.style.opacity=p.stunned||age<4||d.phase==='lobby'?1:0;
  }
  // New effects from the host.
  let played=0;for(const e of d.effects){if(seen.has(e.id))continue;seen.add(e.id);if(Date.now()+offset-e.at<2500&&(e.kind!=='laser'||fx.length<160)&&played++<8)play(e);}
  if(seen.size>500)seen=new Set([...seen].slice(-200));
  for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.age=(f.age||0)+dt;if(!f.update(dt,f.age))fx.splice(i,1);}
  // Camera shake.
  shake=Math.max(0,shake-dt*1.6);camera.position.set(-120+(Math.random()-.5)*shake*30,420+(Math.random()-.5)*shake*30,2500);camera.lookAt(-60,-20,0);
  renderer.render(scene,camera);
}
async function poll(){
  try{const t=Date.now(),r=await fetch('/api/boss/overlay',{cache:'no-store'});const next=await r.json();offset=next.serverAt-(t+Date.now())/2;
    if(next.id!==lastId&&next.phase!=='idle'){lastId=next.id;seen=new Set((next.effects||[]).map(e=>e.id));clearFleet();outcomeShown=null;hpShown=1;if(ready)resetBoss(next.phase==='lobby'?Math.min(20000,Math.max(4000,next.lobbyEndsAt-next.serverAt-2000)):2500);}
    data=next;}catch{}
  setTimeout(poll,250);
}
(async()=>{
  try{await Promise.all([shipMeshesReady(),materialsReady()]);}catch(e){console.warn('Dreadnought assets:',e);}
  buildBoss();resetBoss();ready=true;
})();
poll();requestAnimationFrame(frame);
