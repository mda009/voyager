// Cosmetic flight only. Combat timing, damage, rewards and hit tests stay in engine.mjs.
export const ease = u => { u=Math.max(0,Math.min(1,u)); return u*u*u*(u*(u*6-15)+10); };
export const damp = (value,target,rate,dt) => target+(value-target)*Math.exp(-rate*dt);
export class FlightMotion {
  constructor(){this.time=0;this.activity=0;this.pilots=[0,1].map(i=>({x:i?1200:400,y:490,pitch:0,bank:0,roll:0,recoil:0,dodge:null}));}
  event(e){const p=this.pilots[e.pilot];if(!p)return;if(e.type==='dodge')p.dodge=this.time;if(e.type==='shot')p.recoil=e.kind==='missile'?11:4;}
  reset(){for(const p of this.pilots){p.dodge=null;p.roll=0;p.recoil=0;}}
  advance(dt,phase,paused=false){
    if(paused)return this.pilots;
    dt=Math.max(0,Math.min(dt,.05));this.time+=dt;
    this.activity=damp(this.activity,phase==='battle'?1:0,2.8,dt);
    for(let i=0;i<2;i++){
      const p=this.pilots[i],t=this.time+i*2.7,a=this.activity;
      const u=p.dodge===null?0:Math.min(1,(this.time-p.dodge)/1.35);
      const evade=p.dodge===null?0:Math.sin(Math.PI*u)**2;
      p.roll=p.dodge===null?0:ease(u)*Math.PI*2;
      if(u===1){p.dodge=null;p.roll=0;}
      const x=(i?1200:400)+Math.sin(t*.51)*(11+24*a)+(i?1:-1)*p.recoil;
      const y=490+Math.sin(t*.73)*(9+9*a)+Math.sin(t*.31)*5-evade*52;
      p.x=damp(p.x,x,4.5,dt);p.y=damp(p.y,y,5,dt);
      p.pitch=damp(p.pitch,Math.cos(t*.73)*(.035+.04*a),3,dt);
      p.bank=damp(p.bank,Math.sin(t*.51)*(.055+.08*a),3,dt);
      p.recoil=damp(p.recoil,0,9,dt);
    }
    return this.pilots;
  }
}
