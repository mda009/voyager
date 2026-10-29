import {randomUUID} from 'node:crypto';

export class AvailabilityAnnouncer {
  constructor({store,bot,game,action,now=()=>Date.now()}){
    Object.assign(this,{store,bot,game,action,now});
    this.busy=false;this.nextAttempt=0;this.readyAlert=null;
    this.message='Chat announcement waiting for the arena to become available.';
    this.overlayMessage='Ready alert armed for the next available battle.';
  }
  ready(){return this.game.phase==='lobby'&&this.game.open&&!this.game.paused&&this.game.cooldownRemaining()===0&&this.game.matches.length===0&&this.game.queue.length<2;}
  snapshot(){
    const cue=this.readyAlert;
    const active=cue&&this.now()<cue.startedAt+cue.durationMs&&(cue.test||this.ready()&&this.bot.status.connected&&this.store.data.availability?.id===cue.id);
    return {message:this.message,overlayMessage:this.overlayMessage,status:this.store.data.availability?.status||'waiting',readyAlert:active?{...cue}:null};
  }
  preview(){this.readyAlert={id:randomUUID(),startedAt:this.now(),durationMs:12000,test:true};return {ok:true,message:'Ready overlay test sent. No chat message, cooldown or points were changed.'};}
  confirm(entry){this.store.availability(entry.id,{status:'sent'});this.message='Availability announced in Twitch chat.';}
  async tick(){
    if(this.busy||!this.ready())return;
    if(!this.bot.status.connected){this.message='Availability announcement waiting for Streamer.bot.';this.overlayMessage='Ready alert waiting for the chat connection.';return;}
    if(this.now()<this.nextAttempt)return;
    let entry=this.store.data.availability;
    const needsAlert=!Number.isFinite(entry?.alertStartedAt);
    if(!needsAlert){
      this.overlayMessage='Automatic ready alert already sent for this availability window.';
      if(entry.status==='sent'){this.message='Availability announced in Twitch chat.';return;}
      if(entry.status==='review'){this.message='Announcement unconfirmed. Check Streamer.bot before retrying.';return;}
    }
    this.busy=true;this.nextAttempt=this.now()+3000;
    try{
      const expectedId=entry?.id;
      const unchanged=()=>this.ready()&&this.bot.status.connected&&this.store.data.availability?.id===expectedId;
      let twitchChecked=false;
      if(needsAlert){
        const broadcaster=await this.bot.request('GetBroadcaster');
        if(!unchanged())return;
        if(!broadcaster.connected?.some(p=>p.toLowerCase()==='twitch')){
          this.message='Availability announcement waiting for Twitch to connect.';
          this.overlayMessage='Ready alert waiting for Twitch to connect.';
          return;
        }
        twitchChecked=true;
        const startedAt=this.now();
        if(!entry){this.store.update(d=>d.availability={id:randomUUID(),status:'pending',attemptAt:0,alertStartedAt:startedAt});entry=this.store.data.availability;}
        else this.store.availability(entry.id,{alertStartedAt:startedAt});
        // Persist before broadcasting: reconnects/restarts cannot replay this ready window.
        // OBS readiness is independent of the rewards action's chat receipt.
        this.readyAlert={id:entry.id,startedAt,durationMs:12000,test:false};
        this.overlayMessage='Automatic ready alert sent to the OBS browser source.';
      }
      const current=()=>this.ready()&&this.bot.status.connected&&this.store.data.availability?.id===entry.id;
      if(entry.status==='sent'){this.message='Availability announced in Twitch chat.';return;}
      if(entry.status==='review'){this.message='Announcement unconfirmed. Check Streamer.bot before retrying.';return;}
      if(!this.action()){this.message='Waiting for the verified v2.5 rewards action to enable chat announcements.';return;}
      const response=await this.bot.request('GetGlobal',{variable:'voyagerVersusAnnouncement_'+entry.id,persisted:true});
      if(!current())return;
      const receipt=response.status==='ok'?String(response.variable?.value||''):'';
      if(receipt==='sent'){this.confirm(entry);return;}
      if(receipt){
        if(receipt!=='pending'||this.now()-entry.attemptAt>30000){this.store.availability(entry.id,{status:'review'});this.message='Announcement unconfirmed. Check Streamer.bot before retrying.';}
        return;
      }
      if(entry.attemptAt&&this.now()-entry.attemptAt<30000)return;
      if(!twitchChecked){
        const broadcaster=await this.bot.request('GetBroadcaster');
        if(!current())return;
        if(!broadcaster.connected?.some(p=>p.toLowerCase()==='twitch')){this.message='Availability announcement waiting for Twitch to connect.';return;}
      }
      const actionId=this.action();if(!actionId)return;
      this.store.availability(entry.id,{attemptAt:this.now()});
      const sent=await this.bot.request('DoAction',{action:{id:actionId},args:{vvOperation:'available',vvAnnouncementId:entry.id,vvExpiresAt:this.now()+10000}});
      if(!current())return;
      this.message=sent.status==='ok'?'Availability announcement awaiting confirmation.':'Streamer.bot rejected the announcement. Check the v2.5 action.';
      if(sent.status==='ok'){
        const check=await this.bot.request('GetGlobal',{variable:'voyagerVersusAnnouncement_'+entry.id,persisted:true});
        if(current()&&check.status==='ok'&&String(check.variable?.value||'')==='sent')this.confirm(entry);
      }
    }catch{this.message='Availability announcement pending; waiting to reconnect.';}
    finally{this.busy=false;}
  }
}
