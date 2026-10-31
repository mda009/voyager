import * as T from './vendor/three.module.min.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.mjs';
import {createShip,animateShip,quality,textureResolution,materialsReady,shipMeshesReady} from './ship-models.mjs?v=2.3.0';
import {spaceEnvironment,SSAO} from './space-lighting.mjs?v=2.17.3';

// One WebGL context is shared by the arena, challenger splash and hangar.
// Compositing into the existing transparent canvas keeps HUD/weapon coordinates aligned.
export class ShipRenderer {
  constructor(){
    this.ready=false;this.low=quality==='low';this.quality=quality;this.models=new Map();this.activeModels=[];this.portraitStamps=new WeakMap();this.views=[];this.lastPreviews=-Infinity;this.flashes=[];this.missileModels=[];this.mountIndex=[0,0];
    const canvas=document.createElement('canvas');this.canvas=canvas;
    this.renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance',premultipliedAlpha:true});
    const r=this.renderer;r.setClearColor(0,0);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.12;
    r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
    this.scene=new T.Scene();this.scene.background=null;
    const pmrem=new T.PMREMGenerator(r),room=new RoomEnvironment();this.env=pmrem.fromScene(room,.025);this.scene.environment=this.env.texture;this.scene.environmentIntensity=.65;room.dispose();pmrem.dispose();
    this.scene.add(new T.HemisphereLight(0xc5d8ed,0x111823,.35));
    const key=new T.DirectionalLight(0xffead3,3.2);key.position.set(240,650,450);key.castShadow=true;key.shadow.mapSize.set(this.low?1024:2048,this.low?1024:2048);key.shadow.camera.left=-1000;key.shadow.camera.right=1000;key.shadow.camera.top=650;key.shadow.camera.bottom=-650;key.shadow.camera.near=1;key.shadow.camera.far=2000;key.shadow.normalBias=.6;key.shadow.bias=-.0002;this.scene.add(key);
    const rim=new T.DirectionalLight(0x98cfff,2.6);rim.position.set(-350,-200,-450);this.scene.add(rim);
    const fill=new T.DirectionalLight(0xc9dbf3,.75);fill.position.set(-250,-70,580);this.scene.add(fill);
    this.camera=new T.OrthographicCamera(-800,800,450,-450,1,4000);this.camera.position.set(0,0,1600);this.camera.lookAt(0,0,0);
    // 2.17.3: reflections from the space scene instead of a studio box, plus ambient occlusion on the ships.
    this.ao=this.low?null:new SSAO(r,{radius:22,strength:.85});
    spaceEnvironment(r,{sunDirection:key.position,size:2048}).then(t=>{if(!t)return;this.scene.environment=t;this.scene.environmentIntensity=1.15;this.env?.dispose?.();}).catch(()=>{});
    this.stage=new T.Group();this.scene.add(this.stage);
    this.weaponStage=new T.Group();this.scene.add(this.weaponStage);
    this.flashLights=[0,1].map(()=>{const light=new T.PointLight(0xffba76,0,650,2);this.scene.add(light);return light;});
    this.ready=false;this.assetsLoaded=false;this.contextLost=false;
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;this.ready=false;this.status('3D graphics interrupted · compatibility ships active');});
    canvas.addEventListener('webglcontextrestored',()=>{this.contextLost=false;this.ready=this.assetsLoaded;this.status(this.ready?'RSI fleet restored':'Loading RSI fleet…');});
    this.status('Loading RSI ship meshes and '+(textureResolution/1024)+'K materials…');
    this.loaded=Promise.all([materialsReady(),shipMeshesReady()]).then(()=>{this.assetsLoaded=true;this.ready=!this.contextLost;this.status((textureResolution/1024)+'K materials · RSI fleet: Gladius / Paladin / Sabre');return this.ready;}).catch(error=>{this.fail(error);return false;});
  }
  status(message){document.body.classList.toggle('ships-3d-ready',this.ready);const el=document.getElementById('graphics-status');if(el)el.textContent=message;}
  fail(error){this.ready=false;this.status('Compatibility ships · 3D rendering unavailable');console.warn('3D rendering stopped; compatibility artwork is active.',error);}
  model(key,slot){const id=key+':'+slot;if(!this.models.has(id)){const g=createShip(key);g.traverse(o=>{const m=[].concat(o.material||[]);if(o.isMesh&&!m.some(x=>x.transparent))o.layers.enable(1);});this.models.set(id,g);this.stage.add(g);}return this.models.get(id);}
  clearModels(){for(const g of this.models.values())g.visible=false;}
  resize(width,height,vw=1600,vh=900){
    const max=this.low?1280:this.quality==='balanced'?1920:3840,factor=Math.min(1,max/Math.max(width,height));width=Math.max(1,Math.round(width*factor));height=Math.max(1,Math.round(height*factor));
    if(this.canvas.width!==width||this.canvas.height!==height)this.renderer.setSize(width,height,false);
    this.camera.left=-vw/2;this.camera.right=vw/2;this.camera.top=vh/2;this.camera.bottom=-vh/2;this.camera.updateProjectionMatrix();
  }
  arena(c,width,height,pilots,poses,state,time,activity,projectiles=[]){
    if(!this.ready)return false;
    this.clearModels();this.resize(width,height);
    for(let i=0;i<2;i++){
      const dead=state?.phase==='result'&&state.result?.winner===1-i&&!state.result?.cancelled;if(dead)continue;
      const key=pilots?.[i]?.ship||['interceptor','sentinel'][i],g=this.model(key,i),p=poses[i];g.visible=true;this.activeModels[i]=g;
      g.position.set(p.x-800,450-p.y,0);g.scale.setScalar(1.32);
      g.rotation.set(.88+p.bank+p.roll,.16+(.1*Math.sin(time*.29+i)),p.pitch,'ZYX');
      // Models face +X with +Y up. Turn the challenger around its local up
      // axis so the nose faces left without inverting the cockpit or dorsal side.
      if(i===1)g.rotateY(Math.PI);
      animateShip(g,time,activity,p);
    }
    this.weapons(projectiles,time);if(this.ao)try{this.ao.compute(this.scene,this.camera);}catch{this.ao=null;}this.renderer.render(this.scene,this.camera);if(this.ao)this.ao.apply();c.drawImage(this.canvas,0,0,1600,900);return true;
  }
  portrait(target,key,time,{still=false}={}){
    if(!this.ready)return false;
    const rect=target.getBoundingClientRect();if(!rect.width||!rect.height)return false;
    const ratio=Math.min(window.devicePixelRatio||1,1.5),w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
    const stamp=[key,still?0:time,w,h,still].join(':');
    if(this.portraitStamps.get(target)===stamp)return true;
    if(target.width!==w||target.height!==h){target.width=w;target.height=h;}
    this.clearModels();this.weaponStage.visible=false;this.flashLights.forEach(l=>l.intensity=0);this.resize(w,h,390,390*h/w);
    const g=this.model(key,'portrait');g.visible=true;g.position.set(0,-2,0);g.scale.setScalar(.98*Math.min(1,(390*h/w)/260));
    g.rotation.set(.78+(still?0:Math.sin(time*.3)*.065),-.33+(still?0:Math.sin(time*.23)*.16),.11+(still?0:Math.sin(time*.21)*.035),'ZYX');animateShip(g,time,.12);
    this.renderer.render(this.scene,this.camera);const c=target.getContext('2d',{alpha:true});c.clearRect(0,0,w,h);c.drawImage(this.canvas,0,0,w,h);this.portraitStamps.set(target,stamp);return true;
  }
  muzzle(pilot,kind,pose){
    const group=this.activeModels[pilot];
    if(group){const mounts=kind==='missile'?group.userData.missiles:group.userData.cannons;
      if(mounts?.length){group.updateMatrixWorld(true);const point=mounts[this.mountIndex[pilot]++%mounts.length].clone().applyMatrix4(group.matrixWorld);return {x:point.x+800,y:450-point.y};}}
    return {x:pose.x+(pilot?-115:115),y:pose.y};
  }
  flash(pilot,time,position,hit=false){this.flashes.push({pilot,at:time,x:position.x,y:position.y,hit});this.flashes=this.flashes.slice(-8);}
  weapons(shots,time){
    this.weaponStage.visible=true;this.flashes=this.flashes.filter(f=>time-f.at<.22);
    this.flashLights.forEach((light,i)=>{const f=this.flashes.filter(f=>f.pilot===i).at(-1);light.intensity=f?(f.hit?85000:45000)*(1-(time-f.at)/.22)**2:0;if(f){light.position.set(f.x-800,450-f.y,55);light.color.setHex(f.hit?0x7bcaff:0xffbd78);}});
    for(const m of this.missileModels)m.visible=false;let index=0;
    for(const shot of shots){if(shot.kind!=='missile'||!shot.alive)continue;
      let model=this.missileModels[index];if(!model){
        model=new T.Group();const body=new T.MeshStandardMaterial({color:0xb3bdc2,metalness:.7,roughness:.35}),dark=new T.MeshStandardMaterial({color:0x27343d,metalness:.6,roughness:.46});
        const cylinder=new T.Mesh(new T.CylinderGeometry(2.2,2.2,26,16),body);cylinder.rotation.z=-Math.PI/2;model.add(cylinder);
        const cone=new T.Mesh(new T.ConeGeometry(2.2,8,16),dark);cone.rotation.z=-Math.PI/2;cone.position.x=17;model.add(cone);
        for(const angle of [0,Math.PI/2]){const fin=new T.Mesh(new T.BoxGeometry(8,.6,13),dark);fin.position.x=-9;fin.rotation.x=angle;model.add(fin);}
        this.weaponStage.add(model);this.missileModels.push(model);
      }
      model.visible=true;model.position.set(shot.x-800,450-shot.y,35);model.rotation.set(time*4,0,-shot.angle,'ZYX');model.scale.setScalar(1.15);index++;
    }
  }
  previews(time,now=performance.now()/1000){
    if(!this.ready||now-this.lastPreviews<1/24)return;this.lastPreviews=now;
    try{
    const calling=document.getElementById('call-screen');
    if(calling&&!calling.hidden){const target=document.getElementById('call-ship-3d');if(target)this.portrait(target,target.dataset.ship||'interceptor',time);}
    const hangar=document.getElementById('tab-hangar');
    if(hangar&&!hangar.hidden){for(const target of hangar.querySelectorAll('canvas[data-model]'))this.portrait(target,target.dataset.model,time);}
    }catch(error){this.fail(error);}
  }
}
