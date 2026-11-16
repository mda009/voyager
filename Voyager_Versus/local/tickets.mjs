/* Voyager ticket grants (2.28.0). Games can award tickets for the active ticketed giveaway — a Dreadnought victory gives every
   pilot who fought 10 tickets. The tickets live in the "Voyager - Ticket Giveaway" action's own ledger, so the host asks that
   action to add them: first "sync" (which giveaway is active, its revision), then "grant" (v1.5+) with the accounts and amounts.
   The action audits each grant like a manual adjustment. If there is no ticketed giveaway collecting entries, nothing is granted
   and the reason is kept for the control page. A grant that could not reach Streamer.bot is retried for up to 30 minutes. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';

const TIMEOUT_MS=20000,RETRY_MS=60000,GIVE_UP_MS=30*60000;
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
// A pilot key is "<platform>:<user id>"; keys built from a login ("twitch:@name") have no account id and cannot hold tickets.
export function grantRow(g){const m=String(g?.key||'').match(/^(twitch|youtube|kick):(.+)$/);if(!m||m[2].startsWith('@'))return null;const tickets=Math.floor(Number(g.tickets)||0);if(tickets<1)return null;
  return {platform:m[1],id:m[2].slice(0,128),login:clean(g.login,60).toLowerCase(),name:clean(g.name,60),tickets:Math.min(100000,tickets)};}

export class TicketGranter{
  // run(args): DoAction on "Voyager - Ticket Giveaway" → {ok,message}; answers arrive through resolve(data) (voyager.tickets.v1).
  constructor({dataDir,run=null,now=Date.now,uuid=()=>crypto.randomUUID(),log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'ticket-grants.json');this.run=run;this.now=now;this.uuid=uuid;this.log=log;this.waiters=new Map();this.queue=[];this.history=[];this.busy=false;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.queue=(Array.isArray(raw.queue)?raw.queue:[]).slice(0,20);this.history=(Array.isArray(raw.history)?raw.history:[]).slice(0,20);}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,queue:this.queue,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  resolve(data){const w=data?.requestId&&this.waiters.get(data.requestId);if(!w)return false;this.waiters.delete(data.requestId);clearTimeout(w.timer);w.resolve(data);return true;}
  call(operation,args={}){
    const requestId=this.uuid();
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.waiters.delete(requestId);reject(new Error(operation==='grant'?'The Ticket Giveaway action did not answer. Update it to v1.5 (Settings & Streamer.bot › install hub).':'No answer from the Ticket Giveaway action.'));},TIMEOUT_MS);
      this.waiters.set(requestId,{resolve:d=>{if(d?.ok===false)reject(new Error(String(d.error||'The Ticket Giveaway action refused.')));else resolve(d);},timer});
      Promise.resolve().then(()=>this.run({...args,requestId,ticketOperation:operation})).then(r=>{if(r&&r.ok===false){this.waiters.delete(requestId);clearTimeout(timer);const e=new Error(r.message||'Could not run the Ticket Giveaway action.');e.offline=true;reject(e);}}).catch(e=>{this.waiters.delete(requestId);clearTimeout(timer);reject(e);});
    });
  }
  // Queue tickets for a list of accounts: [{key,name,login,tickets}]. Returns the queued job.
  grant({id,reason,grants}){
    const rows=(grants||[]).map(grantRow).filter(Boolean).slice(0,200),noId=(grants||[]).filter(g=>Number(g?.tickets)>0).length-rows.length;
    const job={id:clean(id,60)||this.uuid(),reason:clean(reason,200)||'Voyager game reward',rows,noId:Math.max(0,noId),tickets:rows.reduce((a,r)=>a+r.tickets,0),at:this.now(),tried:0,status:'waiting',message:''};
    if(!rows.length){this.finish(job,'skipped',noId?'No pilot had an account id to hold tickets.':'Nothing to grant.');return job;}
    if(this.queue.some(j=>j.id===job.id)||this.history.some(j=>j.id===job.id))return job; // one grant per battle
    this.queue.push(job);void this.persist();return job;
  }
  finish(job,status,message,extra={}){Object.assign(job,{status,message,doneAt:this.now(),...extra});this.queue=this.queue.filter(j=>j!==job&&j.id!==job.id);
    this.history.unshift({id:job.id,reason:job.reason,accounts:job.rows.length,tickets:job.tickets,noId:job.noId,status,message,at:job.doneAt,title:extra.title||''});this.history=this.history.slice(0,20);this.log(status+': '+job.reason+' · '+message);void this.persist();}
  // Called every few seconds with whether Streamer.bot is connected.
  async tick({connected=false}={}){
    if(this.busy||!this.run||!this.queue.length)return null;const now=this.now(),job=this.queue.find(j=>now-j.tried>=RETRY_MS);if(!job)return null;
    if(now-job.at>GIVE_UP_MS){this.finish(job,'failed','Gave up after 30 minutes: '+(job.message||'Streamer.bot was not reachable.'));return job;}
    if(!connected){job.message='Waiting for Streamer.bot.';return null;}
    this.busy=true;job.tried=now;
    try{
      const sync=await this.call('sync'),st=sync?.state||{},c=st.campaign;
      if(!c||!c.id){this.finish(job,'skipped','No ticketed giveaway is running, so no tickets were given.');return job;}
      if((c.draws||[]).length>0||c.status==='completed'){this.finish(job,'skipped','"'+clean(c.title,60)+'" has already been drawn, so its tickets are frozen.',{title:clean(c.title,60)});return job;}
      const allowed=new Set(c.platforms||[]),rows=job.rows.filter(r=>allowed.has(r.platform));
      if(!rows.length){this.finish(job,'skipped','None of these pilots are on a platform enabled for "'+clean(c.title,60)+'".',{title:clean(c.title,60)});return job;}
      const done=await this.call('grant',{ticketGrants:JSON.stringify(rows),ticketReason:job.reason,ticketExpiresAt:String(now+60000),ticketControlRevision:String(st.controlRevision??0),ticketCampaignId:c.id});
      const g=done?.state?.lastGrant||{};
      this.finish(job,'granted',(g.tickets??job.tickets)+' tickets to '+(g.accounts??rows.length)+' account'+((g.accounts??rows.length)===1?'':'s')+' in "'+clean(c.title,60)+'"'+(g.skipped?' ('+g.skipped+' skipped: blocked or not eligible)':'')+(job.noId?' ('+job.noId+' without an account id)':'')+'.',{title:clean(c.title,60)});
    }catch(e){job.message=e?.message||'failed';if(!e?.offline&&!/did not answer|No answer/.test(job.message)&&!/changed|expired/i.test(job.message)){this.finish(job,'failed',job.message);}}
    finally{this.busy=false;}
    return job;
  }
  view(){return {waiting:this.queue.map(j=>({id:j.id,reason:j.reason,accounts:j.rows.length,tickets:j.tickets,message:j.message,at:j.at})),history:this.history.slice(0,8)};}
}
