// Shared photoreal lighting for Voyager's 3D scenes (2.17.3): image-based lighting from the space backdrop,
// and screen-space ambient occlusion that multiplies over an already rendered frame.
import * as T from './vendor/three.module.min.js';

const loader=new T.TextureLoader();
const load=url=>new Promise(ok=>{const t=loader.load(url,()=>ok(t),undefined,()=>ok(null));t.colorSpace=T.SRGBColorSpace;});

// A PMREM environment built from the nebula, a bright star in the key light's direction, the gas giant,
// and soft cool/warm fill, so metal and paint reflect the space around them.
export async function spaceEnvironment(renderer,{sunDirection=new T.Vector3(-.5,.6,.6),size=2048}={}){
  const base=new URL('./materials/',import.meta.url).href;
  const [space,planet]=await Promise.all([load(base+'space-'+size+'.webp?v=2.17.3'),load(base+'planet-'+size+'.webp?v=2.17.3')]);
  const env=new T.Scene();
  if(space){const m=new T.Mesh(new T.SphereGeometry(1000,64,32),new T.MeshBasicMaterial({map:space,side:T.BackSide}));m.material.color.setScalar(.55);env.add(m);}
  const dir=sunDirection.clone().normalize();
  const sun=new T.Mesh(new T.SphereGeometry(38,24,12),new T.MeshBasicMaterial({color:new T.Color(1,.95,.85).multiplyScalar(140)}));sun.position.copy(dir).multiplyScalar(900);env.add(sun);
  const halo=new T.Mesh(new T.SphereGeometry(120,24,12),new T.MeshBasicMaterial({color:new T.Color(1,.8,.6).multiplyScalar(1.4),transparent:true,opacity:.35}));halo.position.copy(sun.position);env.add(halo);
  if(planet){const p=new T.Mesh(new T.SphereGeometry(420,64,32),new T.MeshBasicMaterial({map:planet}));p.material.color.setScalar(.35);p.position.set(-520,-620,-300);env.add(p);}
  for(const [color,k,pos] of [[new T.Color(.25,.55,1),.8,[-900,150,-500]],[new T.Color(1,.25,.3),.35,[900,-250,-300]]]){const m=new T.Mesh(new T.PlaneGeometry(900,500),new T.MeshBasicMaterial({color:color.multiplyScalar(k),side:T.DoubleSide}));m.position.set(...pos);m.lookAt(0,0,0);env.add(m);}
  const pm=new T.PMREMGenerator(renderer);const tex=pm.fromScene(env,0).texture;pm.dispose();
  env.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.();});
  return tex;
}

// SSAO: depth pre-pass of objects on `layer`, 16-sample hemisphere occlusion at half resolution, blurred,
// then multiplied over whatever is already in the canvas (background pixels are untouched).
export class SSAO{
  constructor(renderer,{layer=1,radius=20,strength=.85}={}){
    this.renderer=renderer;this.layer=layer;this.strength=strength;
    this.depthMat=new T.ShaderMaterial({vertexShader:'#include <common>\nvarying float vD;\nvoid main(){\n#include <begin_vertex>\n#include <project_vertex>\nvD=-mvPosition.z;}',fragmentShader:'varying float vD;void main(){gl_FragColor=vec4(vD,0.,0.,1.);}'});
    const kernel=Array.from({length:16},(_,i)=>{const v=new T.Vector3(Math.random()*2-1,Math.random()*2-1,Math.random()*.9+.1).normalize().multiplyScalar(Math.random());const k=i/16;return v.multiplyScalar(.1+.9*k*k);});
    const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
    this.aoMat=new T.ShaderMaterial({uniforms:{tDepth:{value:null},res:{value:new T.Vector2()},halfSize:{value:new T.Vector2()},tanH:{value:0},aspect:{value:1},ortho:{value:0},radius:{value:radius},far:{value:1e5},kernel:{value:kernel}},vertexShader:VS,depthTest:false,depthWrite:false,
      fragmentShader:`uniform sampler2D tDepth;uniform vec2 res,halfSize;uniform float tanH,aspect,ortho,radius,far;uniform vec3 kernel[16];varying vec2 vUv;
      vec3 vp(vec2 uv){float z=texture2D(tDepth,uv).r;vec2 n=uv*2.-1.;return ortho>.5?vec3(n*halfSize,-z):vec3(n.x*tanH*aspect*z,n.y*tanH*z,-z);}
      vec2 proj(vec3 s){return (ortho>.5?s.xy/halfSize:vec2(s.x/(-s.z*tanH*aspect),s.y/(-s.z*tanH)))*.5+.5;}
      void main(){float z=texture2D(tDepth,vUv).r;if(z>far*.5){gl_FragColor=vec4(1.);return;}
        vec3 P=vp(vUv);vec3 N=normalize(cross(dFdx(P),dFdy(P)));if(dot(N,ortho>.5?vec3(0.,0.,1.):-P)<0.)N=-N;
        float a=fract(sin(dot(floor(vUv*res),vec2(12.9898,78.233)))*43758.5453)*6.2831853;vec3 r=vec3(cos(a),sin(a),0.);
        vec3 Tg=normalize(r-N*dot(r,N));mat3 tbn=mat3(Tg,cross(N,Tg),N);float occ=0.;
        for(int i=0;i<16;i++){vec3 s=P+tbn*kernel[i]*radius;float sz=texture2D(tDepth,proj(s)).r;occ+=step(sz,-s.z-radius*.05)*smoothstep(0.,1.,radius/max(.001,abs(-s.z-sz)));}
        gl_FragColor=vec4(vec3(pow(clamp(1.-occ/16.,0.,1.),1.6)),1.);}`});
    this.blurMat=new T.ShaderMaterial({uniforms:{src:{value:null},dir:{value:new T.Vector2()}},vertexShader:VS,depthTest:false,depthWrite:false,fragmentShader:'uniform sampler2D src;uniform vec2 dir;varying vec2 vUv;void main(){float c=texture2D(src,vUv).r*.227027;c+=texture2D(src,vUv+dir*1.384615).r*.316216;c+=texture2D(src,vUv-dir*1.384615).r*.316216;c+=texture2D(src,vUv+dir*3.230769).r*.07027;c+=texture2D(src,vUv-dir*3.230769).r*.07027;gl_FragColor=vec4(vec3(c),1.);}'});
    // Multiply over the frame: dst.rgb *= mix(1, ao, strength); alpha unchanged.
    this.applyMat=new T.ShaderMaterial({uniforms:{src:{value:null},strength:{value:strength}},vertexShader:VS,depthTest:false,depthWrite:false,transparent:true,
      blending:T.CustomBlending,blendEquation:T.AddEquation,blendSrc:T.ZeroFactor,blendDst:T.SrcColorFactor,blendSrcAlpha:T.ZeroFactor,blendDstAlpha:T.OneFactor,
      fragmentShader:'uniform sampler2D src;uniform float strength;varying vec2 vUv;void main(){gl_FragColor=vec4(vec3(mix(1.,texture2D(src,vUv).r,strength)),1.);}'});
    this.quad=new T.Mesh(new T.PlaneGeometry(2,2));this.quad.frustumCulled=false;this.post=new T.Scene();this.post.add(this.quad);this.postCam=new T.OrthographicCamera(-1,1,1,-1,0,1);
    this.size=[0,0];this.farColor=new T.Color(1e5,0,0);this.keep=new T.Color();
  }
  setSize(w,h){
    w=Math.max(8,w>>1);h=Math.max(8,h>>1);if(this.size[0]===w&&this.size[1]===h)return;this.size=[w,h];
    for(const t of [this.depth,this.a,this.b])t?.dispose();
    this.depth=new T.WebGLRenderTarget(w,h,{type:T.FloatType,depthBuffer:true});
    this.a=new T.WebGLRenderTarget(w,h,{type:T.HalfFloatType,depthBuffer:false});this.b=new T.WebGLRenderTarget(w,h,{type:T.HalfFloatType,depthBuffer:false});
    this.aoMat.uniforms.res.value.set(w,h);
  }
  pass(mat,target){this.quad.material=mat;this.renderer.setRenderTarget(target);this.renderer.render(this.post,this.postCam);}
  // Compute occlusion for `scene` as seen by `camera` into an internal texture.
  compute(scene,camera){
    const r=this.renderer,size=r.getDrawingBufferSize(new T.Vector2());this.setSize(size.x,size.y);
    const prev=r.getRenderTarget(),alpha=r.getClearAlpha();r.getClearColor(this.keep);const mask=camera.layers.mask,bg=scene.background,ov=scene.overrideMaterial;
    r.setClearColor(this.farColor,1);camera.layers.set(this.layer);scene.overrideMaterial=this.depthMat;scene.background=null;
    r.setRenderTarget(this.depth);r.clear();r.render(scene,camera);
    camera.layers.mask=mask;scene.overrideMaterial=ov;scene.background=bg;r.setClearColor(this.keep,alpha);
    const u=this.aoMat.uniforms;u.tDepth.value=this.depth.texture;u.far.value=camera.far;
    if(camera.isOrthographicCamera){u.ortho.value=1;u.halfSize.value.set((camera.right-camera.left)/2/camera.zoom,(camera.top-camera.bottom)/2/camera.zoom);}
    else{u.ortho.value=0;u.tanH.value=Math.tan(T.MathUtils.degToRad(camera.fov/2));u.aspect.value=camera.aspect;}
    this.pass(this.aoMat,this.a);
    this.blurMat.uniforms.src.value=this.a.texture;this.blurMat.uniforms.dir.value.set(1/this.size[0],0);this.pass(this.blurMat,this.b);
    this.blurMat.uniforms.src.value=this.b.texture;this.blurMat.uniforms.dir.value.set(0,1/this.size[1]);this.pass(this.blurMat,this.a);
    r.setRenderTarget(prev);return this.a.texture;
  }
  // Multiply the occlusion over the frame currently in the canvas (call right after rendering it).
  apply(){const r=this.renderer,auto=r.autoClear;r.autoClear=false;this.applyMat.uniforms.src.value=this.a.texture;this.pass(this.applyMat,null);r.autoClear=auto;}
}
