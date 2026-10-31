import {SHIPS} from './engine.mjs';
import {FlightMotion} from './flight-motion.mjs';
import {ShipRenderer} from './ships-3d.mjs?v=2.17.3';
import {WeaponFX} from './weapon-fx.mjs';
import {fleet} from './ship-models.mjs?v=2.3.0';
const C=['#74cfff','#dce9f2'];
const poly=(c,points,fill,stroke)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}};
export class ArenaView {
  constructor(canvas,{onEvent=()=>{}}={}) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});this.onEvent=onEvent;
    this.motion=new FlightMotion();this.weapons=new WeaponFX();
    try{this.ships3d=new ShipRenderer();document.body.classList.add('ships-3d-ready');}
    catch(error){console.warn('3D ships unavailable; using compatibility artwork.',error);const status=document.getElementById('graphics-status');if(status)status.textContent='Compatibility ships · enable browser hardware acceleration for 3D';}
    this.shipImages=Object.fromEntries(Object.entries(SHIPS).map(([key,spec])=>{const image=new Image();image.src=new URL(spec.image,import.meta.url).href;return [key,image];}));
    this.state=null;this.lastId=null;this.particles=[];this.effects=[];this.shots=[];this.shake=0;this.received=0;this.flash=[0,0];this.roll=[0,0];this.lastFrame=0;
    this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
  }
  update(state) {
    this.state=state;this.received=performance.now();
    if(this.lastId===null){this.lastId=state.events.at(-1)?.id||0;return;}
    for(const e of state.events)if(e.id>this.lastId){this.event(e);this.lastId=e.id;}
  }
  position(i,t=0) {
    return this.motion.pilots[i];
  }
  burst(x,y,color,n=30,power=200) {
    for(let j=0;j<n;j++){const angle=Math.random()*Math.PI*2,speed=power*(.2+Math.random());this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.5+Math.random()*.8,max:1.3,color,size:1+Math.random()*4});}
    this.particles=this.particles.slice(-600);
  }
  event(e) {
    const pos=this.position(e.pilot??0,this.state?.time||0);
    if(e.type==='start'||e.type==='calling'){this.effects=[];this.shots=[];this.particles=[];this.weapons.clear();this.motion.reset();if(this.ships3d)this.ships3d.flashes=[];}
    this.motion.event(e);
    if(e.type==='shot'){
      const from=this.ships3d?.muzzle(e.pilot,e.kind,pos)||{x:pos.x+(e.pilot?-115:115),y:pos.y};
      this.weapons.fire(e,this.motion.time,from,this.position(e.target));this.ships3d?.flash(e.pilot,this.motion.time,from);
    }
    if(e.type==='hit'){this.flash[e.pilot]=.22;this.shake=e.kind==='missile'?6:2;this.weapons.impact(e,this.motion.time,pos);this.ships3d?.flash(e.pilot,this.motion.time,pos,true);}
    if(e.type==='shield')this.effects.push({type:'shield',...pos,pilot:e.pilot,life:1.2,max:1.2,color:C[e.pilot]});
    if(e.type==='dodge')this.roll[e.pilot]=.85;
    if(e.type==='miss')this.effects.push({type:'text',text:'EVADED',...pos,y:pos.y-120,life:1.2,max:1.2,color:C[e.pilot]});
    if(e.type==='finish'&&e.winner!==null&&!e.cancelled) {
      const p=this.position(1-e.winner,this.state?.time||0);this.burst(p.x,p.y,'#ffb866',150,450);this.burst(p.x,p.y,'#d8f9ff',80,300);this.shake=18;
      this.effects.push({type:'explosion',...p,life:1.6,max:1.6,color:'#fff0d0'});
    }
    this.onEvent(e);
  }
  ship(c,x,y,i,ship,scale,time,dead=false,thumbnail=false) {
    if(dead)return;
    const spec=SHIPS[ship]||SHIPS.interceptor, col=spec.accent;
    c.save();c.translate(x,y);c.scale(i?-scale:scale,scale);
    if(!thumbnail&&this.roll[i]>0)c.scale(1,Math.cos(this.roll[i]*Math.PI*2)*.65+.35);
    const engines=ship==='sentinel'?[-57,-20,20,57]:ship==='phantom'?[-22,22]:[-25,25];
    const tail=ship==='sentinel'?-115:-109;
    const flame=24+Math.sin(time*30)*7;
    const glow=c.createLinearGradient(tail,0,tail-flame-32,0);glow.addColorStop(0,col);glow.addColorStop(.35,col+'88');glow.addColorStop(1,col+'00');
    c.shadowColor=col;c.shadowBlur=15;
    for(const yy of engines)poly(c,[[tail,yy-6],[tail-flame-30,yy],[tail,yy+6]],glow);
    c.shadowBlur=0;
    const image=this.shipImages[ship]||this.shipImages.interceptor;
    if(image.complete&&image.naturalWidth)c.drawImage(image,-160,-125,320,250);
    else poly(c,[[-80,-30],[100,0],[-80,30],[-50,0]],'#344b62',col);

    if(!thumbnail&&this.flash[i]>0){c.globalAlpha=this.flash[i]*2;c.fillStyle='#ffffff';c.beginPath();c.ellipse(5,0,110,80,0,0,Math.PI*2);c.fill();}
    c.restore();
  }
  frame(now) {
    const dt=Math.min(.05,(now-this.lastFrame)/1000||.016);this.lastFrame=now;
    const rect=this.canvas.getBoundingClientRect();const ratio=Math.min(devicePixelRatio||1,2);
    if(!rect.width||!rect.height||document.body.classList.contains('idle-hidden')){this.motion.advance(dt,this.state?.phase,this.state?.paused);this.ships3d?.previews(this.motion.time);requestAnimationFrame(this.frame);return;}
    const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    const c=this.ctx;c.setTransform(w/1600,0,0,h/900,0,0);c.clearRect(0,0,1600,900);
    const s=this.state;this.motion.advance(dt,s?.phase,s?.paused);const t=this.motion.time,projectiles=this.weapons.samples(t,this.motion.pilots);
    c.save();if(this.shake>.1&&!s?.paused){c.translate((Math.random()-.5)*this.shake,(Math.random()-.5)*this.shake);this.shake*=.88;}
    const showShips=s?.phase!=='calling';let rendered3d=false;
    if(this.ships3d){
      document.body.classList.toggle('ships-3d-ready',this.ships3d.ready);
      try{if(showShips)rendered3d=this.ships3d.arena(c,w,h,s?.players,this.motion.pilots,s,t,this.motion.activity,projectiles);}
      catch(error){this.ships3d.fail(error);}
    }
    for(let i=0;i<(s?.phase==='calling'?0:2);i++) {
      const p=this.position(i,t);const pilot=s?.players[i];const dead=s?.phase==='result'&&s.result?.winner===1-i&&!s.result?.cancelled;
      if(!dead&&pilot?.shield>0){c.save();c.globalAlpha=.035+pilot.shield/pilot.maxShield*.045;c.strokeStyle=C[i];c.lineWidth=1;c.beginPath();c.ellipse(p.x,p.y,175,115,0,0,7);c.stroke();c.restore();}
      if(!rendered3d)this.ship(c,p.x,p.y,i,pilot?.ship||(['interceptor','sentinel'][i]),1.36,t,dead);
      if(!s?.paused){this.flash[i]=Math.max(0,this.flash[i]-dt);this.roll[i]=Math.max(0,this.roll[i]-dt);}
      if(!dead){c.textAlign='center';c.font='600 17px Rajdhani, sans-serif';c.fillStyle=C[i];c.fillText(pilot?.name||(['PILOT 01','PILOT 02'][i]),p.x,p.y+157);c.font='11px Rajdhani, sans-serif';c.fillStyle='#7690a7';c.fillText(fleet[pilot?.ship||['interceptor','sentinel'][i]].name,p.x,p.y+179);c.textAlign='left';}
    }
    this.weapons.draw(c,t,projectiles,rendered3d);
    for(const p of this.particles){if(!s?.paused){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-.6*dt);p.vy*=Math.exp(-.6*dt);}c.globalAlpha=Math.max(0,p.life/p.max);c.strokeStyle=p.color;c.lineWidth=p.size*.45;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);c.stroke();}c.globalAlpha=1;this.particles=this.particles.filter(p=>p.life>0);
    for(const e of this.effects){if(!s?.paused)e.life-=dt;const a=Math.max(0,e.life/e.max),u=1-a;c.save();c.globalAlpha=a;c.strokeStyle=e.color;c.fillStyle=e.color;c.shadowColor=e.color;c.shadowBlur=25;
      if(e.type==='text'){c.font='bold 22px Rajdhani, sans-serif';c.textAlign='center';c.fillText(e.text,e.x,e.y-u*25);}
      else if(e.type==='explosion'){
        c.globalCompositeOperation='lighter';c.shadowBlur=0;
        for(let k=0;k<9;k++){const theta=k*2.4,r=45+u*135,x=e.x+Math.cos(theta)*u*100,y=e.y+Math.sin(theta)*u*80,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,244,213,${a*a*.6})`);g.addColorStop(.2,`rgba(255,167,62,${a*a*.4})`);g.addColorStop(.6,`rgba(161,45,12,${a*.2})`);g.addColorStop(1,'rgba(80,25,10,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
        c.globalAlpha=a*a*.5;c.strokeStyle='#ffcc8b';c.lineWidth=1.5;c.beginPath();c.ellipse(e.x,e.y,30+u*400,10+u*140,0,0,Math.PI*2);c.stroke();
      }else{c.lineWidth=1.5;c.beginPath();c.ellipse(e.x,e.y,(e.type==='shield'?145:10)+u*180,(e.type==='shield'?105:10)+u*120,0,0,7);c.stroke();}
      c.restore();}
    this.effects=this.effects.filter(e=>e.life>0);c.restore();
    if(!s?.paused&&(!s||s.phase==='lobby')){
      c.textAlign='center';c.fillStyle='#92b9d080';c.font='12px Rajdhani, sans-serif';c.fillText('YOUR CHAT. YOUR SHIP. YOUR BATTLE.',800,300);c.fillStyle='#e8f7ff';c.font='700 42px Rajdhani, sans-serif';c.fillText('THE VOID IS CALLING',800,350);c.font='17px Rajdhani, sans-serif';c.fillStyle='#789ab3';c.fillText('!versus  to call for a challenger',800,715);
      c.font='700 64px Rajdhani, sans-serif';c.fillStyle='#9db7ce25';c.fillText('VS',800,512);
    }
    if(s?.phase==='countdown'&&!s.paused){
      c.save();c.strokeStyle='#7de0ff20';c.lineWidth=3;c.beginPath();c.arc(800,450,135,0,Math.PI*2);c.stroke();
      c.strokeStyle='#8ee7ff';c.shadowColor='#7de0ff';c.shadowBlur=18;c.beginPath();c.arc(800,450,135,-Math.PI/2,-Math.PI/2+Math.PI*2*s.remaining/(s.countdownLength||10));c.stroke();c.restore();
      c.textAlign='center';c.font='700 26px Rajdhani, sans-serif';c.fillStyle='#c9f0ff';c.fillText('BOTH PILOTS LOCKED IN',800,250);
      c.font='14px Rajdhani, sans-serif';c.fillStyle='#729bb7';c.fillText(`${s.players[0].name}  VS  ${s.players[1].name}`,800,282,1100);
      c.textAlign='center';c.shadowColor='#6bdfff';c.shadowBlur=35;c.fillStyle='#e9faff';c.font='700 142px Rajdhani, sans-serif';c.fillText(Math.ceil(s.remaining-1e-8),800,495);c.shadowBlur=0;c.font='14px Rajdhani, sans-serif';c.fillStyle='#7ac6e5';c.fillText('BATTLE STARTS IN',800,625);
    }
    if(s?.phase==='result'&&!s.paused){
      const r=s.result;c.textAlign='center';c.fillStyle='#89a9c2';c.font='14px Rajdhani, sans-serif';c.fillText(r.cancelled?'HOST CONTROL':r.demo?'TRAINING BATTLE COMPLETE':'BATTLE COMPLETE',800,345);
      c.fillStyle=r.winner===null?'#dcefff':C[r.winner];c.shadowColor=c.fillStyle;c.shadowBlur=25;c.font='700 76px Rajdhani, sans-serif';c.fillText(r.cancelled?'BATTLE CANCELLED':r.winner===null?'DRAW':`${r.name.toUpperCase()} WINS`,800,445,1400);c.shadowBlur=0;
      c.font='18px Rajdhani, sans-serif';c.fillStyle='#d4e2ee';c.fillText(r.reason,800,500);c.font='13px Rajdhani, sans-serif';c.fillStyle='#7694ad';if(r.rewards?.length){c.font='16px Rajdhani, sans-serif';c.fillStyle='#9eeaff';const awards=[...r.rewards].sort((a,b)=>b.amount-a.amount);c.fillText(awards.map(a=>`${a.name}: +${a.amount} VP (${a.status==='credited'?'credited':a.status==='review'?'needs review':'pending'})`).join('   /   '),800,550,1400);}
      c.font='13px Rajdhani, sans-serif';c.fillStyle='#7694ad';c.fillText(`RESULT CLOSES IN ${Math.ceil(s.remaining)}s`+(s.cooldownRemaining>0?` · NEXT CALL IN ${Math.floor(s.cooldownRemaining/60)}:${String(s.cooldownRemaining%60).padStart(2,'0')}`:''),800,600);
    }
    if(s?.paused&&s.phase!=='calling'){c.textAlign='center';c.fillStyle='#eaf9ff';c.font='700 48px Rajdhani, sans-serif';c.fillText('ARENA PAUSED',800,470);}
    c.textAlign='left';this.ships3d?.previews(t);requestAnimationFrame(this.frame);
  }
}
export class SoundFX {
  constructor(){this.enabled=false;this.ctx=null;}
  async toggle(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();await this.ctx.resume();this.enabled=!this.enabled;return this.enabled;}
  play(e){if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;const map={calling:[520,.8],countdown:[e.remaining<=3?660:330,.12],shot:[e.kind==='missile'?120:700,.16],hit:[60,.18],shield:[440,.3],dodge:[220,.2],launch:[300,.5],finish:[85,1.1]};if(!map[e.type])return;const[f,d]=map[e.type],ctx=this.ctx,osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=e.type==='hit'||e.type==='finish'?'sawtooth':'sine';osc.frequency.setValueAtTime(f,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(Math.max(25,f/5),ctx.currentTime+d);gain.gain.setValueAtTime(.055,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+d);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+d);}
}
