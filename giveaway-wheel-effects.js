/* Voyager wheel spectacle 2.1. Display only: no connection, draw or payout calls. */
(()=>{'use strict';
 const TAU=Math.PI*2,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
 const colours=['#7ddfff','#d5f7ff','#ffcf79','#84a8ff','#ffffff'];
 function path(ctx,points,fill,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
 function glowSprite(colour){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'#ffffff');r.addColorStop(.08,colour);r.addColorStop(.28,colour+'a0');r.addColorStop(1,colour+'00');g.fillStyle=r;g.fillRect(0,0,128,128);return c;}
 function shipSprite(kind){
  const c=document.createElement('canvas');c.width=360;c.height=240;const g=c.getContext('2d');g.translate(185,120);g.lineWidth=1.3;
  const enemy=kind===1,heavy=kind===2,accent=enemy?'#f98058':heavy?'#e4c380':'#83dfff';
  const hull=g.createLinearGradient(0,-72,0,72);hull.addColorStop(0,'#becbd6');hull.addColorStop(.3,'#3c5369');hull.addColorStop(.49,'#9eb3c4');hull.addColorStop(.51,'#23394c');hull.addColorStop(1,'#101e2d');
  const wing=enemy?[[65,0],[3,-18],[-21,-75],[-77,-91],[-56,-20],[-91,0],[-56,20],[-77,91],[-21,75],[3,18]]:heavy?[[91,0],[19,-18],[-14,-75],[-79,-66],[-61,-19],[-88,0],[-61,19],[-79,66],[-14,75],[19,18]]:[[98,0],[12,-15],[-43,-82],[-88,-74],[-58,-17],[-83,0],[-58,17],[-88,74],[-43,82],[12,15]];
  g.shadowColor='#000b';g.shadowBlur=8;g.shadowOffsetY=5;path(g,wing,hull,'#a1b8cb');g.shadowBlur=0;g.shadowOffsetY=0;
  path(g,[[111,0],[21,-20],[-64,-14],[-82,0],[-64,14],[21,20]],hull,'#9cb1c2');
  for(const side of [-1,1]){
   path(g,[[0,side*21],[-32,side*65],[-66,side*62],[-49,side*29]],enemy?'#733a34':heavy?'#6b654d':'#204b70','#849db1');
   path(g,[[-26,side*37],[-39,side*53],[-61,side*54],[-51,side*45]],accent);
   g.fillStyle='#091623';g.fillRect(-71,side*20-7,21,14);g.fillStyle='#a7bfcd';g.fillRect(-56,side*20-4,12,3);
   g.strokeStyle='#d7edff80';g.beginPath();g.moveTo(-46,side*34);g.lineTo(-69,side*58);g.stroke();
   g.fillStyle=accent;g.fillRect(6,side*17-1,24,2);g.fillRect(-71,side*61-2,5,4);
   g.strokeStyle='#071420';g.beginPath();g.moveTo(-12,side*19);g.lineTo(-46,side*57);g.stroke();
  }
  const glass=g.createLinearGradient(15,-10,51,10);glass.addColorStop(0,'#e0fbff');glass.addColorStop(.35,accent);glass.addColorStop(1,'#081d30');
  path(g,[[62,0],[25,-9],[7,-7],[7,7],[25,9]],glass,'#b8dded');
  g.strokeStyle='#dcecff80';g.beginPath();g.moveTo(68,0);g.lineTo(102,0);g.moveTo(-61,0);g.lineTo(0,0);g.stroke();
  g.fillStyle='#07121b';for(let i=0;i<6;i++){g.fillRect(-41+i*6,-8,3,4);g.fillRect(-41+i*6,4,3,4);}
  return c;
 }
 class WheelEffects{
  constructor(canvas,wheel){
   this.canvas=canvas;this.wheel=wheel;this.ctx=canvas.getContext('2d',{alpha:true});this.active=false;this.raf=0;this.clock=0;this.duration=30000;this.offset=0;
   this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.ships=[0,1,2].map(shipSprite);this.glows=['#77dfff','#ffc27c','#ff7653'].map(glowSprite);
   this.sparks=Array.from({length:68},(_,i)=>({angle:i/68*TAU+noise(i)*.12,speed:55+noise(i+91)*150,life:1.3+noise(i+203)*1.5,colour:colours[i%colours.length],width:1+noise(i+55)*1.9}));
   this.resize=()=>{const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5,2560/w,1440/h);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));this.scale=Math.min(w/1920,h/1080);this.dpr=dpr;this.left=(w-1920*this.scale)/2;this.top=(h-1080*this.scale)/2;};
   this.visibility=()=>{if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;this.resetRumble();}else this.start();};
   addEventListener('resize',this.resize);document.addEventListener('visibilitychange',this.visibility);this.resize();canvas.hidden=true;
  }
  sync({active,start,duration=30000,offset=0}){
   if(!active){if(this.active)this.stop();return;}
   this.clock=start;this.duration=duration;this.offset=offset;this.active=true;this.canvas.hidden=false;this.start();
  }
  start(){if(this.active&&!this.raf&&!document.hidden)this.raf=requestAnimationFrame(()=>this.frame());}
  resetRumble(){this.wheel.style.removeProperty('--rumble-x');this.wheel.style.removeProperty('--rumble-y');this.wheel.style.removeProperty('--rumble-roll');}
  stop(){this.active=false;cancelAnimationFrame(this.raf);this.raf=0;this.canvas.hidden=true;this.resetRumble();this.ctx.setTransform(1,0,0,1,0,0);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
  destroy(){this.stop();removeEventListener('resize',this.resize);document.removeEventListener('visibilitychange',this.visibility);}
  glow(x,y,size,index,alpha=1){const g=this.ctx;g.save();g.globalCompositeOperation='lighter';g.globalAlpha=clamp(alpha);g.drawImage(this.glows[index],x-size/2,y-size/2,size,size);g.restore();}
  burst(x,y,age,seed,explosion=false){
   if(age<0||age>3)return;const g=this.ctx,energy=explosion?1.35:1,fade=clamp((3-age)/1.6);
   this.glow(x,y,(explosion?300:150)*(1+age*.7),explosion?1:0,Math.exp(-age*2.7)*(explosion?.7:.35));
   if(explosion&&age<1.9){
    // Offset fireballs grow into a broken cloud, instead of a flat screen flash.
    for(let i=0;i<7;i++){const a=i/7*TAU+seed,spread=(12+age*63)*(1+noise(i+seed)*.4);
     this.glow(x+Math.cos(a)*spread,y+Math.sin(a)*spread*.7,(58+age*80)*(1+noise(i+80)*.4),i%3===0?2:1,Math.exp(-age*2.1)*.8);}
    this.glow(x,y,100+age*60,1,Math.exp(-age*4)*.85);
   }
   g.save();g.globalCompositeOperation='lighter';
   if(explosion){g.globalAlpha=Math.exp(-age*2.1)*.85;g.lineWidth=2.2-age*.5;g.strokeStyle='#a5e8ff';g.beginPath();g.ellipse(x,y,18+age*230,8+age*110,-.2,0,TAU);g.stroke();}
   for(let i=0;i<this.sparks.length;i++){
    const p=this.sparks[i];if(age>p.life)continue;const a=p.angle+seed*1.7,dist=p.speed*energy*(1-Math.exp(-age*1.35))/1.35;
    const x1=x+Math.cos(a)*dist,y1=y+Math.sin(a)*dist+age*age*28,tail=Math.min(22,4+18*age);
    g.globalAlpha=clamp(1-age/p.life)*fade;g.strokeStyle=explosion&&i%3===0?'#ffad68':p.colour;g.lineWidth=p.width;
    g.beginPath();g.moveTo(x1-Math.cos(a)*tail,y1-Math.sin(a)*tail);g.lineTo(x1,y1);g.stroke();
   }
   g.restore();
   if(explosion){
    g.save();for(let i=0;i<12;i++){const a=noise(i+seed*71)*TAU,dist=(85+noise(i+seed)*110)*age,px=x+Math.cos(a)*dist,py=y+Math.sin(a)*dist+age*age*21;
     g.save();g.translate(px,py);g.rotate(age*(noise(i+32)*8-4)+a);g.globalAlpha=clamp(1-age/2.6);g.fillStyle=i%2?'#6f8a9c':'#b4cedd';g.strokeStyle='#ffbe71';g.lineWidth=.8;path(g,[[-9,-3],[8,-2],[3,5],[-5,3]],g.fillStyle,g.strokeStyle);g.restore();}g.restore();
   }
  }
  ship(x,y,heading,size,kind,age){
   const g=this.ctx;g.save();g.translate(x,y);g.rotate(heading);g.scale(size,size);
   const enemy=kind===1,flame=44+Math.sin(age*39)*7;
   g.save();g.globalCompositeOperation='lighter';g.fillStyle=enemy?'#ff996f90':'#69dfff90';
   for(const side of [-1,1]){path(g,[[-65,side*20-5],[-107-flame,side*20],[-65,side*20+5]],g.fillStyle);path(g,[[-65,side*20-2],[-99-flame*.5,side*20],[-65,side*20+2]],'#e5fbff');}g.restore();
   g.drawImage(this.ships[kind],-185,-120);g.restore();
  }
  skirmish(t,at,index){
   const age=t-at;if(age< -3.6||age>3)return 0;
   const side=index%2?-1:1,x=side>0?320+noise(index+15)*75:1525+noise(index+15)*75,y=235+noise(index+74)*580;
   const approach=.35+(noise(index+3)-.5)*1.2,ax=Math.cos(approach),ay=Math.sin(approach);
   if(age<0){
    const distance=-age*225,size=.52+noise(index+17)*.1;
    const x1=x-ax*distance,y1=y-ay*distance,x2=x+ax*distance,y2=y+ay*distance;
    this.ship(x1,y1,approach,size,index%3===0?2:0,t);this.ship(x2,y2,approach+Math.PI,size*.95,1,t);
    const g=this.ctx;g.save();g.globalCompositeOperation='lighter';g.lineWidth=2.5;
    for(let i=0;i<3;i++){const p=(t*2.7+i/3)%1,span=Math.max(0,distance-40),d=span*p;
     g.strokeStyle=i%2?'#ffb485':'#a8f1ff';g.globalAlpha=.6*(1-p);const dir=i%2?-1:1;
     const sx=x-dir*(distance-d)*ax,sy=y-dir*(distance-d)*ay;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+dir*ax*28,sy+dir*ay*28);g.stroke();}g.restore();
   }else this.burst(x,y,age,index,true);
   return age>=0?Math.exp(-age*4):0;
  }
  fireworks(t){
   for(let i=0;i<36;i++){
    const at=1.1+i*.82,age=t-at;if(age< -1||age>2.9)continue;
    const left=i%2===0,x=left?90+noise(i+44)*280:1550+noise(i+44)*280,y=120+noise(i+72)*690;
    if(age<0){const u=age+1,sy=1080+(y-1080)*(1-Math.pow(1-u,2)),g=this.ctx;g.save();g.globalCompositeOperation='lighter';g.strokeStyle=i%3?'#9ae5ff':'#f9d295';g.lineWidth=2;g.globalAlpha=.7;g.beginPath();g.moveTo(x,sy+30);g.lineTo(x,sy);g.stroke();g.restore();this.glow(x,sy,25,0,.55);}
    else this.burst(x,y,age,i);
   }
  }
  frame(){
   this.raf=0;if(!this.active)return;const elapsed=Date.now()+this.offset-this.clock;
   if(elapsed<0||elapsed>=this.duration){this.stop();return;}
   const t=elapsed/1000,g=this.ctx,fade=clamp(t/.45)*clamp((this.duration/1000-t)/.55);
   g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,this.canvas.width,this.canvas.height);g.setTransform(this.dpr*this.scale,0,0,this.dpr*this.scale,this.dpr*this.left,this.dpr*this.top);g.globalAlpha=fade;
   if(this.motion.matches){this.resetRumble();this.glow(280,520,240,0,.16);this.glow(1640,520,240,1,.12);}
   else{
    let kick=0;for(let i=0;i<7;i++)kick=Math.max(kick,this.skirmish(t,3.6+i*3.9,i));this.fireworks(t);
    // Whole wheel and pointer travel together. Small movement eases out before landing.
    const strength=(1+Math.min(1,t/24)+kick*1.1)*fade*this.scale;
    this.wheel.style.setProperty('--rumble-x',((Math.sin(t*47)*.6+Math.sin(t*73)*.4)*strength).toFixed(3)+'px');
    this.wheel.style.setProperty('--rumble-y',((Math.sin(t*59)*.55+Math.sin(t*83)*.3)*strength*.7).toFixed(3)+'px');
    this.wheel.style.setProperty('--rumble-roll',(Math.sin(t*31)*.045*fade).toFixed(4)+'deg');
   }
   // Preserve fade even inside additive particle drawing and stop exactly at the reveal.
   if(fade<1){g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='destination-in';g.globalAlpha=fade;g.fillStyle='#000';g.fillRect(0,0,this.canvas.width,this.canvas.height);g.globalCompositeOperation='source-over';g.globalAlpha=1;}
   this.start();
  }
 }
 window.VoyagerWheelEffects=WheelEffects;
})();
