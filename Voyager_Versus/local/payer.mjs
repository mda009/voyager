/* Voyager auto-pay (2.21.12). Everything Voyager owes a viewer — mission rewards, community-goal payouts, Dreadnought victory and
   MVP points, Versus champion bonuses, muster (!report) and Bridge Quiz points, crew-surge bonuses — lands in one "points owed"
   list (community.payables()). Until now the streamer paid it from Missions › Points owed by hand. The payer does exactly what
   that button did, from the host, as soon as something is owed and Streamer.bot is connected: Points Ledger admin_preview →
   admin_apply for each row, then the row is marked paid (or failed, with the reason, and retried later). Switch it off with
   autoPay=false to go back to paying by hand; the button still works either way. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';

const RETRY_MS=10*60*1000,TIMEOUT_MS=150000,MAX_PER_RUN=25;

export class Payer{
  // run(args) → DoAction on "Voyager - Points Ledger" ({ok,message}); replies arrive through resolve(data) from the
  // voyager.points.v1 broadcast carrying the same requestId.
  constructor({dataDir,community,run=null,now=Date.now,uuid=()=>Math.random().toString(16).slice(2),log=()=>{}}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'payer.json');this.community=community;this.run=run;this.now=now;this.uuid=uuid;this.log=log;
    this.enabled=true;this.waiters=new Map();this.tried=new Map();this.busy=false;this.last={at:0,paid:0,failed:0,message:''};this.history=[];
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));if(raw.enabled!==undefined)this.enabled=!!raw.enabled;}catch{}return this;}
  async persist(){await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,enabled:this.enabled}));await rename(tmp,this.file);}
  configure({enabled}={}){if(enabled!==undefined)this.enabled=!!enabled;this.saving=this.persist().catch(()=>{});return this.view();}
  // A points reply from Streamer.bot (any operation): hand it to whoever asked.
  resolve(data){const w=data?.requestId&&this.waiters.get(data.requestId);if(!w)return false;this.waiters.delete(data.requestId);clearTimeout(w.timer);w.resolve(data);return true;}
  call(operation,args){
    const requestId=this.uuid();
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.waiters.delete(requestId);reject(new Error('No answer from the Points Ledger in '+Math.round(TIMEOUT_MS/1000)+' s.'));},TIMEOUT_MS);
      this.waiters.set(requestId,{resolve:d=>{if(d?.ok===false||(d?.ok!==true&&d?.error))reject(new Error(String(d?.error||'Points Ledger refused.')));else resolve(d);},timer});
      Promise.resolve().then(()=>this.run({...args,requestId,pointsOperation:operation})).then(r=>{if(r&&r.ok===false){this.waiters.delete(requestId);clearTimeout(timer);reject(new Error(r.message||'Could not run the Points Ledger.'));}}).catch(e=>{this.waiters.delete(requestId);clearTimeout(timer);reject(e);});
    });
  }
  static reason(p){return (p.scope==='boss'?'Voyager Dreadnought: '+p.title+' ('+new Date(p.week).toLocaleDateString()+')':p.scope==='season'?p.title+' ('+p.label+')':p.scope==='surge'||p.scope==='versus'||p.scope==='engage'?p.title+' ('+p.label+')':'Mission: '+p.title+' (week of '+new Date(p.week).toLocaleDateString()+')').slice(0,200);}
  due(){const now=this.now();return (this.community?.payables?.()||[]).filter(p=>p.payable&&p.status!=='paid'&&p.status!=='accruing'&&p.reward>0).filter(p=>{const t=this.tried.get(this.community.payKey(p.week,p.missionId,p.key));return !t||now-t>RETRY_MS;});}
  // Called every few seconds with whether Streamer.bot is connected. Pays what is due, one row at a time.
  async tick({connected=false}={}){
    if(!this.enabled||!connected||!this.run||this.busy)return null;
    const due=this.due().slice(0,MAX_PER_RUN);if(!due.length)return null;
    this.busy=true;let paid=0,failed=0,lastMsg='';
    try{
      for(const p of due){
        const k=this.community.payKey(p.week,p.missionId,p.key);this.tried.set(k,this.now());
        const reason=Payer.reason(p);
        try{
          const plan=await this.call('admin_preview',{adminTask:'points',adminUserKey:p.key,adminTwitchLogin:'',adminDelta:String(p.reward),adminReason:reason});
          if(!plan?.planId)throw new Error(plan?.error||'No preview returned.');
          const result=await this.call('admin_apply',{adminPlanId:plan.planId,adminConfirm:'APPLY',adminClearConfirm:''});
          if(result?.ok===false)throw new Error(result.error||'Not applied.');
          this.community.recordPayout({week:p.week,missionId:p.missionId,key:p.key,status:'paid',note:'Auto-paid · '+reason});paid++;
          this.history.unshift({at:this.now(),name:p.name,reward:p.reward,title:p.title,ok:true});
          this.log('paid '+p.reward+' to '+p.name+' · '+p.title);
        }catch(e){
          failed++;lastMsg=e?.message||'failed';
          this.community.recordPayout({week:p.week,missionId:p.missionId,key:p.key,status:'failed',note:'Auto-pay: '+lastMsg});
          this.history.unshift({at:this.now(),name:p.name,reward:p.reward,title:p.title,ok:false,message:lastMsg});
          this.log('FAILED '+p.reward+' to '+p.name+' · '+p.title+' · '+lastMsg);
          if(/not connected|Could not run|No answer/i.test(lastMsg))break; // Streamer.bot is the problem, not the row: stop and try again later
        }
      }
      this.history=this.history.slice(0,30);
    }finally{this.busy=false;}
    this.last={at:this.now(),paid,failed,message:lastMsg};return this.last;
  }
  view(){const due=this.due();return {enabled:this.enabled,busy:this.busy,pending:due.length,pendingPoints:due.reduce((a,p)=>a+p.reward,0),last:this.last,history:this.history.slice(0,12)};}
}
