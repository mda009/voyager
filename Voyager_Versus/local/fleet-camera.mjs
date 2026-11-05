// Camera spotlight cues from the host (2.20.61). The Fleet overlay in OBS sends the start/end cues for each alert, but an OBS
// source may be an old copy (cached, or loaded from an old folder) that never sends them. The host hears the same alert queue
// from the Fleet Alerts broadcasts, so it sends the cues too: start when an alert begins, end after the alert plus the hold.
// The Streamer.bot action ignores a second start for the same alert and a second hide, so both senders can run at once.
import {randomUUID} from 'node:crypto';
export class FleetCamera{
  constructor({run,now=()=>Date.now(),uuid=randomUUID,log=()=>{}}={}){
    this.run=run;this.now=now;this.uuid=uuid;this.log=log;this.state=null;this.offset=0;this.at=0;this.started=new Map();this.ended=new Set();this.last=null;this.sending=false;
  }
  receive(ev){if(!ev||ev.state?.schema!==1)return;this.state=ev.state;this.at=this.now();this.offset=(Number(ev.serverAt)||this.now())-this.now();}
  get active(){const s=this.state;return !!(s&&s.enabled&&s.camera?.enabled&&s.camera.source&&Number(s.backendVersion||0)>=1.7);}
  // Alerts the host should cue now: [{id,phase:'start'|'end'}]
  due(){
    if(!this.active||this.now()-this.at>60000)return [];
    const now=this.now()+this.offset,hold=Math.max(0,Math.min(30,Number(this.state.camera.hold)||0))*1000,out=[];
    for(const e of this.state.queue||[]){const id=String(e.id||'');if(!id)continue;const startAt=Number(e.startAt)||0,endAt=Number(e.endAt)||0;
      if(!this.started.has(id)&&startAt<=now&&now<endAt&&now-startAt<=5000)out.push({id,phase:'start'});
      if(this.started.has(id)&&!this.ended.has(id)&&now>=endAt+hold)out.push({id,phase:'end'});}
    for(const [id,t] of this.started)if(this.now()-t>600000){this.started.delete(id);this.ended.delete(id);}
    return out;
  }
  async tick(){
    if(this.sending)return;const due=this.due();if(!due.length)return;this.sending=true;
    try{for(const d of due){if(d.phase==='start')this.started.set(d.id,this.now());else this.ended.add(d.id);
      const args={fleetOperation:'playback',fleetEventId:d.id,fleetExpiresAt:this.now()+this.offset+15000,requestId:this.uuid()};if(d.phase==='end')args.fleetPhase='end';
      let r;try{r=await this.run(args);}catch(e){r={ok:false,message:e.message};}
      this.last={at:this.now(),id:d.id,phase:d.phase,ok:!!r?.ok,message:String(r?.message||'')};this.log(`camera ${d.phase} cue for ${d.id}: ${r?.ok?'sent':r?.message}`);}}
    finally{this.sending=false;}
  }
  view(){return {active:this.active,last:this.last,pending:this.started.size-this.ended.size};}
}
