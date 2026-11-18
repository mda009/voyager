/* Voyager Raffle (2.34.0): a ten-minute raffle only the streamer can start. Everyone who types !raffle is given one raffle
   ticket with a random four-digit number. The panel shows the time left and the entries; chat confirms each entry (in
   batches, so chat is not flooded). When the time is up, up to five winning tickets are drawn one by one on screen and each
   winner is given giveaway tickets (10 by default) for the active ticketed giveaway through onTickets.
   Free to enter, one ticket per person; subs, gifts, Bits and points change nothing. The draw uses crypto randomness. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID,randomInt} from 'node:crypto';

export const RAFFLE_DEFAULTS={enabled:true,announce:true,confirm:true,minutes:10,winners:5,prize:10};
const LIMITS={minutes:[1,60],winners:[1,5],prize:[0,100]},LABELS={minutes:'Minutes to join',winners:'Winners',prize:'Giveaway tickets per winner'};
// Screen timing: the opening animation, each winner's reveal, and how long the winners stay up.
export const TIMING={intro:7000,reveal:7000,result:25000,confirmEvery:8000};
export const WORDS=['!raffle','!joinraffle'];
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);

export function normalizeRaffleSettings(raw={},base=RAFFLE_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},out={};
  for(const k of ['enabled','announce','confirm'])out[k]=r[k]===undefined?!!base[k]:!!r[k];
  for(const [k,[min,max]] of Object.entries(LIMITS)){const n=Number(r[k]===undefined?base[k]:r[k]);if(!Number.isInteger(n)||n<min||n>max)throw new Error(LABELS[k]+' must be '+min+' to '+max+'.');out[k]=n;}
  return out;
}

export class Raffle{
  // say(text): chat. key(chat): the viewer's key. onTickets({id,reason,grants}): hand out giveaway tickets. pick(n): 0…n-1, uniformly.
  constructor({dataDir,say=()=>{},key=c=>(c?.platform||'twitch')+':'+String(c?.userId||c?.login||'').toLowerCase(),onTickets=()=>{},now=Date.now,pick=n=>randomInt(n)}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'raffle.json');this.say=say;this.key=key;this.onTickets=onTickets;this.now=now;this.pick=pick;
    this.settings=normalizeRaffleSettings({});this.stats={raffles:0,entries:0,winners:0};this.history=[];this.raffle=null;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeRaffleSettings(raw.settings||{});this.stats={...this.stats,...(raw.stats||{})};this.history=Array.isArray(raw.history)?raw.history.slice(0,20):[];}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,stats:this.stats,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  configure(raw={}){this.settings=normalizeRaffleSettings({...this.settings,...raw});if(!this.settings.enabled&&this.raffle)this.cancel();void this.persist();return this.view();}
  start(){
    const s=this.settings,now=this.now();if(!s.enabled)throw new Error('Turn the raffle on first.');if(this.raffle)throw new Error('A raffle is already running.');
    this.raffle={id:randomUUID().slice(0,8),startedAt:now,phase:'intro',phaseAt:now,opensAt:now+TIMING.intro,endsAt:now+TIMING.intro+s.minutes*60000,minutes:s.minutes,want:s.winners,prize:s.prize,
      entries:new Map(),numbers:new Set(),pending:[],confirmAt:0,told:{},winners:[],revealAt:0,doneAt:0};
    if(s.announce)this.say('🎟 RAFFLE! Open for '+s.minutes+' minute'+(s.minutes===1?'':'s')+'. Type !raffle to get your ticket: one each, with a random number. Up to '+s.winners+' winner'+(s.winners===1?'':'s')+(s.prize?', '+s.prize+' giveaway tickets each':'')+'.');
    return this.view();
  }
  cancel(){if(!this.raffle)return this.view();this.raffle=null;if(this.settings.announce)this.say('🎟 The raffle was called off. Nobody wins this one.');return this.view();}
  // Close entries now and draw (the streamer's button).
  closeNow(){const r=this.raffle;if(!r)throw new Error('No raffle is running.');if(r.phase==='intro'||r.phase==='open'){r.endsAt=this.now();this.tick();}return this.view();}
  // A four-digit ticket number nobody else in this raffle holds.
  number(r){for(let i=0;i<50;i++){const n=1000+this.pick(9000);if(!r.numbers.has(n))return n;}for(let n=1000;n<=9999;n++)if(!r.numbers.has(n))return n;return 0;}
  chat(chat){
    const r=this.raffle;if(!r||!['intro','open'].includes(r.phase))return null;const word=clean(chat?.text,40).toLowerCase().split(' ')[0];if(!WORDS.includes(word))return null;
    const key=this.key(chat);if(!key)return null;const have=r.entries.get(key);if(have)return {ok:true,already:true,ticket:have.ticket};
    if(r.entries.size>=5000)return {ok:false,full:true};const ticket=this.number(r);if(!ticket)return {ok:false,full:true};
    const e={key,name:clean(chat.name||chat.login,60)||'Crew',login:clean(chat.login,60).toLowerCase(),platform:String(key).split(':')[0],ticket,at:this.now(),seq:r.entries.size+1};
    r.entries.set(key,e);r.numbers.add(ticket);r.pending.push(e);return {ok:true,ticket};
  }
  // Called every 100 ms or so by the host.
  tick(){
    const r=this.raffle,now=this.now();if(!r)return null;const s=this.settings,tell=t=>{if(s.announce)this.say(t);};
    if(r.phase==='intro'&&now>=r.opensAt){r.phase='open';r.phaseAt=now;}
    if(r.phase==='intro'||r.phase==='open'){
      // Entries are confirmed in chat a few at a time: "@name #1234".
      if(s.confirm&&r.pending.length&&now-r.confirmAt>=TIMING.confirmEvery){r.confirmAt=now;const batch=r.pending.splice(0,r.pending.length);let line='🎟 Raffle tickets: ',shown=0;
        for(const e of batch){const part='@'+e.name+' #'+e.ticket;if((line+part).length>380)break;line+=(shown?' · ':'')+part;shown++;}
        this.say(line+(batch.length>shown?' · and '+(batch.length-shown)+' more (see the panel)':'')+'.');}
      const left=r.endsAt-now;
      for(const [mark,text] of [[300000,'5 minutes'],[60000,'1 minute']])if(r.minutes*60000>mark&&left<=mark&&left>0&&!r.told[mark]){r.told[mark]=1;tell('🎟 '+text+' left to join the raffle: type !raffle. '+r.entries.size+' in so far.');}
      if(now<r.endsAt)return null;
      // Time is up: draw the winning tickets now (the screen reveals them one at a time).
      const pool=[...r.entries.values()],n=Math.min(r.want,pool.length);for(let i=0;i<n;i++){const j=this.pick(pool.length);r.winners.push(pool.splice(j,1)[0]);}
      if(!r.winners.length){tell('🎟 The raffle closed with no entries.');this.record(r,now);r.phase='result';r.phaseAt=now;r.doneAt=now+8000;return 'result';}
      r.phase='drawing';r.phaseAt=now;r.revealAt=now;r.doneAt=now+r.winners.length*TIMING.reveal;
      tell('🎟 The raffle is closed with '+r.entries.size+' entr'+(r.entries.size===1?'y':'ies')+'. Drawing '+r.winners.length+' winning ticket'+(r.winners.length===1?'':'s')+' now…');
      return 'drawing';
    }
    if(r.phase==='drawing'&&now>=r.doneAt){
      r.phase='result';r.phaseAt=now;r.doneAt=now+TIMING.result;this.record(r,now);
      if(r.prize>0)try{this.onTickets({id:'raffle-'+r.id,reason:'Voyager raffle winner',grants:r.winners.map(w=>({key:w.key,name:w.name,login:w.login,tickets:r.prize}))});}catch{}
      this.say('🏆 RAFFLE WINNERS: '+r.winners.map(w=>'@'+w.name+' (#'+w.ticket+')').join(' · ')+(r.prize?'. Each wins '+r.prize+' giveaway tickets.':'.'));
      return 'result';
    }
    if(r.phase==='result'&&now>=r.doneAt){this.raffle=null;return 'done';}
    return null;
  }
  record(r,now){const st=this.stats;st.raffles++;st.entries+=r.entries.size;st.winners+=r.winners.length;
    this.history.unshift({id:r.id,at:now,entries:r.entries.size,prize:r.prize,winners:r.winners.map(w=>({name:w.name,platform:w.platform,ticket:w.ticket}))});this.history=this.history.slice(0,20);void this.persist();}
  // How many winners the screen has revealed so far (one every TIMING.reveal while drawing).
  revealed(r,now){return r.phase==='result'?r.winners.length:r.phase==='drawing'?Math.min(r.winners.length,Math.floor((now-r.revealAt)/TIMING.reveal)):0;}
  // What the panel and the overlay draw: display names and ticket numbers only.
  overlay(){
    const r=this.raffle,now=this.now();if(!r||!this.settings.enabled)return {serverAt:now,raffle:null,last:this.history[0]||null};
    const shown=this.revealed(r,now),list=[...r.entries.values()],w=e=>({name:e.name,platform:e.platform,ticket:e.ticket});
    return {serverAt:now,last:null,raffle:{id:r.id,phase:r.phase,phaseAt:r.phaseAt,opensAt:r.opensAt,endsAt:r.endsAt,minutes:r.minutes,want:r.want,prize:r.prize,count:list.length,
      recent:list.slice(-14).reverse().map(e=>({...w(e),seq:e.seq})),
      // While drawing: the winner being revealed now (the screen spins to its number) and the ones already revealed. Never the ones still to come.
      revealAt:r.revealAt,revealMs:TIMING.reveal,drawing:r.phase==='drawing'&&shown<r.winners.length?{index:shown,...w(r.winners[shown]),startedAt:r.revealAt+shown*TIMING.reveal}:null,
      winners:r.winners.slice(0,shown).map(w),total:r.winners.length,doneAt:r.doneAt}};
  }
  // For the public website: open or not, time left, how many are in, and the winners once they have been revealed on stream.
  share(){const r=this.raffle;if(!r||!this.settings.enabled)return null;const now=this.now();return {phase:r.phase,endsAt:r.endsAt,count:r.entries.size,want:r.want,prize:r.prize,winners:r.winners.slice(0,this.revealed(r,now)).map(w=>({name:w.name,platform:w.platform,ticket:w.ticket}))};}
  view(){const r=this.raffle;return {settings:this.settings,stats:this.stats,history:this.history,running:!!r,entries:r?[...r.entries.values()].slice(-200).reverse().map(e=>({name:e.name,platform:e.platform,ticket:e.ticket,at:e.at})):[],...this.overlay()};}
}
