import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

const clean=s=>String(s??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim();
const pilot=p=>/^\w{1,25}$/.test(p?.login||'')?'@'+p.login:clean(p?.name).slice(0,25);
export function matchSummary(event,reward){
  const [a,b]=event.players,heading=`Voyager Versus | ${pilot(a)} vs ${pilot(b)}`;
  if(event.cancelled)return `${heading} | Match cancelled. No Voyager points awarded.`;
  if(event.winner===null)return `${heading} | DRAW after ${event.duration}s. ${clean(event.reason)}. No Voyager points awarded.`;
  const winner=event.players[event.winner],loser=event.players[1-event.winner];
  const outcome=`Voyager Versus | WINNER: ${pilot(winner)} defeats ${pilot(loser)} | ${clean(event.reason)} | ${event.duration}s | Winner hull: ${Math.max(0,Math.ceil(winner.hull/winner.maxHull*100))}%.`;
  if(!event.rewards?.length)return `${outcome} No points awarded: battle ended before launch.`;
  const payment=reward?.status==='credited'?'50 Voyager points credited':reward?.status==='review'?'50 Voyager points earned; credit needs review':'50 Voyager points earned; credit pending';
  return `${outcome} ${payment}. Runner-up: 0 points.`;
}

// One durable outbox per host. Chat delivery cannot change match or reward state.
export class MatchChat {
  constructor({directory,game,bot,action,protocol=()=>0,reward=()=>null,now=()=>Date.now()}){
    Object.assign(this,{game,bot,action,protocol,reward,now});this.path=join(directory,'chat-announcements.json');
    this.rows=[];this.busy=false;this.nextAttempt=0;this.error='';this.message='Match chat ready.';
    try{const saved=JSON.parse(readFileSync(this.path,'utf8'));if(saved.schema!==1||!Array.isArray(saved.messages)||saved.messages.some(x=>!x.id||!x.key))throw new Error('Invalid chat outbox');this.rows=saved.messages;}
    catch(e){if(e.code!=='ENOENT'){this.error='Cannot load chat-announcements.json. Restore its backup before using match chat.';this.message=this.error;}}
  }
  save(fn){if(this.error)return;const next=structuredClone(this.rows);fn(next);const retained=next.filter((x,i)=>i>=next.length-300||x.status==='pending');writeFileSync(this.path+'.tmp',JSON.stringify({schema:1,messages:retained},null,2));renameSync(this.path+'.tmp',this.path);this.rows=retained;}
  patch(id,patch){this.save(rows=>{const row=rows.find(x=>x.id===id);if(row)Object.assign(row,patch);});}
  add(key,kind,data,ttl=600000){
    if(this.rows.some(x=>x.key===key))return;
    this.save(rows=>rows.push({id:randomUUID(),key,kind,data:structuredClone(data),createdAt:this.now(),expiresAt:this.now()+ttl,status:'pending',attemptAt:0}));
  }
  capture(event){
    if(event.demo)return;
    try{
      if(event.type==='calling')this.add('call:'+event.callId,'calling',event,45*60*1000);
      if(event.type==='start')this.add('start:'+event.matchId,'start',event,180000);
      if(event.type==='finish')this.add('finish:'+event.matchId,'finish',event);
      if(event.type==='call_cancelled')this.add('cancel:'+event.callId,'cancel',event);
    }catch{this.message='Cannot save match chat. Check that the Voyager data folder is writable.';}
  }
  credit(reward){
    // A historical repair is not a new live match result.
    const result=this.rows.find(x=>x.kind==='finish'&&x.data.rewards?.some(r=>r.id===reward.id));
    if(!result||result.expiresAt<=this.now()||reward.amount!==50)return;
    try{this.add('credit:'+reward.id,'credit',reward);}catch{this.message='Cannot save the reward chat confirmation.';}
  }
  current(row){
    if(row.expiresAt<=this.now())return false;
    if(row.kind==='calling')return this.game.phase==='calling'&&this.game.callId===row.data.callId;
    if(row.kind==='start')return ['countdown','battle'].includes(this.game.phase)&&this.game.matchId===row.data.matchId;
    return true;
  }
  text(row){
    const e=row.data;
    if(row.kind==='calling')return `Voyager Versus | INITIATOR: ${pilot(e.pilot)}. Challenger wanted! The next eligible viewer to type !versus joins the battle.`;
    if(row.kind==='start')return `Voyager Versus | INITIATOR: ${pilot(e.players[0])} | CHALLENGER: ${pilot(e.players[1])}. ${this.game.paused?'Arena paused by the host.':this.game.phase==='countdown'?`Launch in ${Math.ceil(this.game.remaining)} seconds!`:'Battle is underway!'} Use !fire, !missile, !shield and !dodge.`;
    if(row.kind==='finish')return matchSummary(e,this.reward(e.rewards?.[0]?.id));
    if(row.kind==='credit')return `Voyager Versus | Reward confirmed: ${pilot(e)} +50 Voyager points credited for the win.`;
    return `Voyager Versus | ${pilot(e.pilot)}'s challenger call was cancelled. No match played; no points awarded.`;
  }
  snapshot(){return {message:this.error||this.message,pending:this.rows.filter(x=>x.status==='pending').length,review:this.rows.filter(x=>x.status==='review').length};}
  async tick(){
    if(this.busy||this.error||this.now()<this.nextAttempt)return;
    if(!this.bot.status.connected){this.message='Match chat waiting for Streamer.bot.';return;}
    if(!this.action()||this.protocol()!==1){this.message='Match chat is waiting for the verified Voyager Versus Rewards v2.5 action.';return;}
    this.busy=true;this.nextAttempt=this.now()+1500;
    try{
      // Also recover a verified payment whose original response was lost.
      for(const row of [...this.rows])if(row.kind==='finish'&&row.expiresAt>this.now()){
        const reward=this.reward(row.data.rewards?.[0]?.id);
        if(reward?.status==='credited')this.credit(reward);
      }
      const expired=this.rows.filter(x=>x.status==='pending'&&!this.current(x));
      if(expired.length)this.save(rows=>{for(const x of rows)if(expired.some(e=>e.id===x.id))x.status='expired';});
      const row=this.rows.find(x=>x.status==='pending');
      if(!row){this.message=this.rows.some(x=>x.status==='review')?'Match chat has an unconfirmed send; check Twitch chat and Streamer.bot logs.':'Match chat ready · initiator, challenger and results enabled.';return;}
      const response=await this.bot.request('GetGlobal',{variable:'voyagerVersusChat_'+row.id,persisted:true});
      const receipt=response.status==='ok'?String(response.variable?.value||''):'';
      if(receipt==='sent'){this.patch(row.id,{status:'sent'});this.message='Match update sent to Twitch chat.';return;}
      if(receipt){if(receipt!=='pending'||this.now()-row.attemptAt>30000)this.patch(row.id,{status:'review'});return;}
      if(row.attemptAt&&this.now()-row.attemptAt<15000)return;
      const broadcaster=await this.bot.request('GetBroadcaster');
      if(!this.current(row))return;
      if(!broadcaster.connected?.some(p=>p.toLowerCase()==='twitch')){this.message='Match chat waiting for Twitch to connect.';return;}
      const action=this.action();if(!action)return;
      const text=clean(this.text(row)).slice(0,450);
      this.patch(row.id,{attemptAt:this.now()});
      const sent=await this.bot.request('DoAction',{action:{id:action},args:{vvOperation:'chat',vvAnnouncementId:row.id,vvChatText:text,vvExpiresAt:String(Math.min(row.expiresAt,this.now()+10000))}});
      this.message=sent.status==='ok'?'Match chat awaiting Streamer.bot confirmation.':'Match chat action rejected. Check the updated C# action.';
    }catch{this.message='Match chat pending; waiting for connection or writable storage.';}
    finally{this.busy=false;}
  }
}
