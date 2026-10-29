// Visual projectile paths follow the game's unchanged 400 / 1050 ms hit timing.
export const shotDuration=kind=>kind==='missile'?1.05:.4;
export function projectilePoint(shot,age,target=shot.to){
  const u=Math.min(1,Math.max(0,age/shotDuration(shot.kind))),v=shot.kind==='missile'?.32*u+.68*u*u:u;
  const arch=shot.kind==='missile'?-Math.sin(Math.PI*v)*(shot.pilot?95:125):0;
  return {x:shot.from.x+(target.x-shot.from.x)*v,y:shot.from.y+(target.y-shot.from.y)*v+arch,u};
}
const glow=(c,x,y,r,color,alpha=1)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,245,225,${alpha})`);g.addColorStop(.15,color.replace('ALPHA',String(alpha*.7)));g.addColorStop(1,color.replace('ALPHA','0'));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);};
export class WeaponFX {
  constructor(){this.shots=[];this.impacts=[];this.sequence=0;}
  clear(){this.shots=[];this.impacts=[];}
  fire(event,time,from,to){this.shots.push({...event,born:time,from:{...from},to:{...to},seed:++this.sequence});this.shots=this.shots.slice(-40);}
  impact(e,time,pos){this.impacts.push({...e,born:time,x:pos.x,y:pos.y});this.impacts=this.impacts.slice(-24);}
  samples(time,positions){
    this.shots=this.shots.filter(s=>time-s.born<shotDuration(s.kind)+.28);
    return this.shots.map(s=>{const age=time-s.born,to=positions[s.target]||s.to,p=projectilePoint(s,age,to),prev=projectilePoint(s,Math.max(0,age-.012),to);return {...s,...p,age,to,angle:Math.atan2(p.y-prev.y,p.x-prev.x),alive:age<shotDuration(s.kind)};});
  }
  draw(c,time,samples,has3D=true){
    c.save();c.globalCompositeOperation='lighter';
    for(const s of samples){
      const duration=shotDuration(s.kind),alpha=Math.min(1,Math.max(0,(duration+.25-s.age)/.25));
      if(s.kind==='missile'){
        // A continuous curved contrail with smooth opacity falloff, without dotted segments.
        const tailAge=Math.max(0,s.age-.28),headAge=Math.min(duration,s.age);
        if(tailAge<headAge){
          const tail=projectilePoint(s,tailAge,s.to),head=projectilePoint(s,headAge,s.to),trail=c.createLinearGradient(tail.x,tail.y,head.x,head.y);
          trail.addColorStop(0,'#a6b4be00');trail.addColorStop(.6,'#a6b4be44');trail.addColorStop(1,'#ffe1b699');
          c.globalAlpha=alpha;c.strokeStyle=trail;c.lineCap='round';c.lineJoin='round';c.beginPath();
          for(let k=0;k<=28;k++){const p=projectilePoint(s,tailAge+(headAge-tailAge)*k/28,s.to);k?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);}
          c.lineWidth=3;c.stroke();c.globalAlpha=alpha*.18;c.lineWidth=9;c.stroke();
        }
        if(s.alive){
          const x=s.x-Math.cos(s.angle)*15,y=s.y-Math.sin(s.angle)*15;c.globalAlpha=1;glow(c,x,y,24,'rgba(255,130,45,ALPHA)',.8);
          c.save();c.translate(x,y);c.rotate(s.angle);const fire=c.createLinearGradient(-44,0,3,0);fire.addColorStop(0,'#ff5e1200');fire.addColorStop(.55,'#ff9731aa');fire.addColorStop(1,'#fff4dc');c.fillStyle=fire;c.beginPath();c.moveTo(3,-3);c.lineTo(-40-4*Math.sin(time*60),0);c.lineTo(3,3);c.fill();c.restore();
          if(!has3D){c.save();c.globalCompositeOperation='source-over';c.translate(s.x,s.y);c.rotate(s.angle);c.fillStyle='#a6b2b8';c.fillRect(-14,-3,25,6);c.fillStyle='#dde5ea';c.beginPath();c.moveTo(11,-3);c.lineTo(19,0);c.lineTo(11,3);c.fill();c.fillStyle='#566872';c.fillRect(-12,-7,7,14);c.restore();}
        }
      }else if(s.alive){
        // Alternating repeaters: luminous core, warm plasma envelope and fast falloff.
        const back=projectilePoint(s,Math.max(0,s.age-.055),s.to);
        c.globalAlpha=1;for(const [width,color] of [[12,'#ff78251d'],[6,'#ffb45b66'],[2.5,'#fff7dd']]){c.lineWidth=width;c.strokeStyle=color;c.lineCap='round';c.beginPath();c.moveTo(back.x,back.y);c.lineTo(s.x,s.y);c.stroke();}
        glow(c,s.x,s.y,13,'rgba(255,159,65,ALPHA)',.65);
      }
      if(s.age<.1){const a=(1-s.age/.1)**2;c.globalAlpha=1;glow(c,s.from.x,s.from.y,s.kind==='missile'?32:45,'rgba(255,176,85,ALPHA)',a*.85);c.save();c.translate(s.from.x,s.from.y);c.rotate(s.pilot?Math.PI:0);c.globalAlpha=a;c.strokeStyle='#ffefc7';c.lineWidth=2;c.beginPath();c.moveTo(-7,0);c.lineTo(38,0);c.moveTo(0,-12);c.lineTo(0,12);c.stroke();c.restore();}
    }
    this.impacts=this.impacts.filter(e=>time-e.born<.75);
    for(const e of this.impacts){const age=time-e.born,u=age/.75,a=(1-u)**2;c.globalAlpha=1;
      glow(c,e.x,e.y,(e.kind==='missile'?110:55)*(1+.5*u),e.shield?'rgba(78,183,255,ALPHA)':'rgba(255,134,46,ALPHA)',a*.75);
      if(e.shield){c.globalAlpha=a*.6;c.strokeStyle='#abe7ff';c.lineWidth=1.2;for(let k=0;k<3;k++){c.beginPath();c.ellipse(e.x,e.y,22+u*100+k*9,14+u*70+k*6,0,0,Math.PI*2);c.stroke();}}
      // Hot material fragments stretch into velocity-aligned sparks.
      for(let k=0;k<(e.kind==='missile'?22:10);k++){const theta=k*2.399+e.pilot,speed=55+(k%7)*28,r=age*speed;c.globalAlpha=a;c.strokeStyle=e.shield?'#bde8ff':k%3?'#ffb557':'#fff7df';c.lineWidth=k%3?1:2;c.beginPath();c.moveTo(e.x+Math.cos(theta)*r,e.y+Math.sin(theta)*r);c.lineTo(e.x+Math.cos(theta)*(r+12*(1-u)),e.y+Math.sin(theta)*(r+12*(1-u)));c.stroke();}
    }
    c.restore();
  }
}
