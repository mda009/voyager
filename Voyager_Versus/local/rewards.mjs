import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {join,basename} from 'node:path';
import {randomUUID} from 'node:crypto';
import {CALL_COOLDOWN_MS} from '../dist/engine.mjs';
export const REWARD_ACTION='Voyager Versus Rewards v2.5';
export const receiptName=id=>'voyagerVersusReceipt_'+id;
export const validReward=r=>/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}_[01]$/.test(r.id||'')&&['winner','runnerUp'].includes(r.role);
const target=r=>r.role==='winner'?50:0;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));

export class EconomyStore {
  constructor(directory){
    this.path=join(directory,'economy.json');this.data={cooldownUntil:0,cooldownMs:CALL_COOLDOWN_MS,rewards:[],availability:null,rewardPolicy:2};let raw;
    try{raw=readFileSync(this.path,'utf8');this.data=JSON.parse(raw);}catch(e){if(e.code!=='ENOENT')throw new Error('Cannot read economy.json. Restore your backup before starting Voyager.');}
    if(!Number.isFinite(this.data.cooldownUntil)||!Array.isArray(this.data.rewards))throw new Error('Invalid economy.json. Restore your backup before starting Voyager.');
    if(this.data.rewards.some(r=>!r||typeof r!=='object'||typeof r.id!=='string')||new Set(this.data.rewards.map(r=>r.id)).size!==this.data.rewards.length)throw new Error('Invalid or duplicate saved reward records. Restore your backup before starting Voyager.');
    if(this.data.rewardPolicy!==2&&this.data.rewards.length){
      const backup=join(directory,'economy-before-reward-repair-'+Date.now()+'.json');writeFileSync(backup,raw,{flag:'wx'});
      this.update(d=>{d.rewardPolicy=2;d.repairBackup=basename(backup);d.rewards=d.rewards.map(r=>({...r,original:structuredClone(r),amount:validReward(r)?target(r):null,status:'audit',reason:'Preview saved history to verify Streamer.bot receipts before backfilling.',policy:2}));});
    }
    this.data.rewardPolicy=2;
    if(this.data.cooldownMs!==CALL_COOLDOWN_MS)this.update(d=>{const previous=Number.isFinite(d.cooldownMs)?d.cooldownMs:20*60*1000;if(d.cooldownUntil>0)d.cooldownUntil+=Math.max(0,CALL_COOLDOWN_MS-previous);d.cooldownMs=CALL_COOLDOWN_MS;d.availability=null;});
  }
  update(fn){const next=structuredClone(this.data);fn(next);writeFileSync(this.path+'.tmp',JSON.stringify(next,null,2));renameSync(this.path+'.tmp',this.path);this.data=next;}
  cooldown(until){this.update(d=>{d.cooldownUntil=until;d.cooldownMs=CALL_COOLDOWN_MS;d.availability=null;});}
  availability(id,patch){this.update(d=>{if(d.availability?.id===id)Object.assign(d.availability,patch);});}
  enqueue(rewards){this.update(d=>{for(const r of rewards){if(!validReward(r)||d.rewards.some(x=>x.id===r.id))continue;d.rewards.push({...r,amount:target(r),policy:2,status:r.role==='runnerUp'?'no_reward':/^\d{1,25}$/.test(r.userId||'')?'pending':'review',createdAt:Date.now(),attemptAt:0,reason:r.role==='runnerUp'?'Runner-up entitlement is 0 points.':''});}});}
  change(id,patch){this.update(d=>{const r=d.rewards.find(r=>r.id===id);if(!r)throw new Error('Reward record not found.');Object.assign(r,patch);});}
}

export class RewardDispatcher {
  constructor({store,bot,now=()=>Date.now(),onCredit=()=>{},rpcTimeout=12000,pollMs=250}){
    Object.assign(this,{store,bot,now,onCredit,rpcTimeout,pollMs});this.clientId=randomUUID();this.busy=false;this.nextCheck=0;this.action=null;this.ready=false;this.chatProtocol=0;this.plan=null;this.diagnostic={stage:'disconnected',actionName:REWARD_ACTION};this.message='Connect Streamer.bot and import Voyager-Versus-Rewards-Install.sb (v2.5).';
  }
  snapshot(){const rows=this.store.data.rewards;return {message:this.message,busy:this.busy,ready:this.ready,diagnostic:{...this.diagnostic},pending:rows.filter(r=>r.status==='pending').length,review:rows.filter(r=>r.status==='review').length,awaitingRepair:rows.filter(r=>['audit','ready'].includes(r.status)).length,backup:this.store.data.repairBackup||'',recent:rows.slice(-15).map(({id,name,role,amount,status,reason,paid,before,after})=>({id,name,role,amount,status,reason,paid,before,after}))};}
  async rpc(operation,reward={},extra={}){
    const requestId=randomUUID(),args={vvOperation:operation,vvRequestId:requestId,vvClientId:this.clientId,vvRewardId:reward.id||'',vvUserId:reward.userId||'',vvLogin:reward.login||'',vvRole:reward.role||'',vvSourceStatus:reward.original?.status||'',vvExpiresAt:String(this.now()+this.rpcTimeout+5000),...extra};
    this.diagnostic={stage:'sending',operation,actionName:REWARD_ACTION,actionId:this.action,at:this.now()};
    const sent=await this.bot.request('DoAction',{action:{id:this.action},args});if(sent.status!=='ok')throw new Error('Streamer.bot rejected the rewards action. Check it is enabled.');
    this.diagnostic.stage='accepted';let lastRead='No matching execution response.';
    const finish=(result,via)=>{
      if(result?.requestId!==requestId||(result.clientId&&result.clientId!==this.clientId))return null;
      this.diagnostic={...this.diagnostic,stage:'executed',via,codeVersion:result.codeVersion||'unknown',at:this.now()};
      if(result.protocol!==2)throw new Error('Rewards protocol mismatch. Import and compile the complete v2.5 action.');
      if(!result.ok)throw new Error(result.reason||'Rewards action failed.');return result;
    };
    const deadline=Date.now()+this.rpcTimeout;
    do{
      let result=finish(this.bot.takeRewardResponse?.(requestId,this.clientId),'broadcast');if(result)return result;
      try{
        const response=await this.bot.request('GetGlobal',{variable:'voyagerVersusResponse_'+this.clientId,persisted:false},Math.min(1000,this.rpcTimeout));
        if(response.status==='ok'){
          let parsed;try{parsed=typeof response.variable?.value==='string'?JSON.parse(response.variable.value):response.variable?.value;}catch{lastRead='Temporary response could not be decoded.';}
          result=finish(parsed,'temporary global');if(result)return result;
          lastRead='Temporary response did not match this request.';
        }else lastRead='Temporary response unavailable'+(response.error?': '+String(response.error).slice(0,160):'.');
      }catch(e){if(this.diagnostic.stage==='executed')throw e;lastRead=e.message;}
      result=finish(this.bot.takeRewardResponse?.(requestId,this.clientId),'broadcast');if(result)return result;
      if(!this.bot.status.connected)throw new Error('Streamer.bot disconnected while confirming the rewards action. Pending credits are retained.');
      await pause(this.pollMs);
    }while(Date.now()<deadline);
    this.ready=false;this.diagnostic={...this.diagnostic,stage:'no_response',detail:lastRead};
    throw new Error('Rewards action accepted, but no execution confirmation ('+operation+'). Open Voyager Versus Rewards v2.5, compile its enabled C# sub-action, and resume the Voyager Versus Rewards v2.5 queue. Pending credits are retained.');
  }
  async ensureAction(force=false){
    if(!this.bot.status.connected){this.ready=false;this.action=null;throw new Error('Rewards waiting for Streamer.bot connection.');}
    if(!force&&this.ready&&this.now()<this.nextCheck)return;
    this.ready=false;this.diagnostic={stage:'finding_action',actionName:REWARD_ACTION,at:this.now()};const response=await this.bot.request('GetActions');if(response.status==='error')throw new Error('Streamer.bot could not list actions. Check the WebSocket connection.');const actions=response.actions?.filter(a=>a.enabled&&a.name===REWARD_ACTION)||[];
    this.action=actions.length===1?actions[0].id:null;this.nextCheck=this.now()+30000;
    if(!this.action){const old=response.actions?.filter(a=>/Voyager Versus Rewards/i.test(a.name)).map(a=>a.name).join(', ');throw new Error('Install exactly one enabled “'+REWARD_ACTION+'” action.'+(old?' Found: '+old+'.':'')+' Import Voyager-Versus-Rewards-Install.sb, compile the new action, and disable older rewards actions.');}
    if(actions[0].subaction_count===0)throw new Error('The rewards action has no sub-actions. Import Voyager-Versus-Rewards-Install.sb.');
    const health=await this.rpc('health');if(health.field!=='points'||health.persisted!==true)throw new Error('Rewards action must use the existing persisted Twitch points variable.');
    if(health.codeVersion!=='2.5.0')throw new Error('The action is named v2.5 but still runs older code. Replace the entire C# code and compile it.');
    this.chatProtocol=health.chatProtocol||0;this.ready=true;this.message='Rewards v2.5 verified · 50 Voyager points per win.';
  }
  async checkAction(){
    if(this.busy)throw new Error('A rewards check is running. Try again when it finishes.');
    this.busy=true;
    try{await this.ensureAction(true);return {ok:true,message:this.message,diagnostic:{...this.diagnostic}};}
    catch(e){this.message=e.message;this.nextCheck=this.now()+10000;return {ok:false,message:e.message,diagnostic:{...this.diagnostic}};}
    finally{this.busy=false;}
  }
  remember(reward,result){
    const patch={status:result.status,reason:result.reason||'',inspection:result,checkedAt:this.now()};
    for(const key of ['paid','before','after'])if(result[key]!==undefined)patch[key]=result[key];
    if(result.verified&&result.userId){patch.userId=result.userId;patch.verifiedAt=this.now();}
    this.store.change(reward.id,patch);
    if(result.deltaApplied>0)this.onCredit({...reward,userId:result.userId,amount:result.deltaApplied});
  }
  async inspect(reward){
    if(!validReward(reward)){const result={ok:true,id:reward.id,status:'review',reason:'Invalid saved reward ID or role. No payment can be inferred.',canResolve:false,amount:reward.amount,delta:0};this.remember(reward,result);return result;}
    const result=await this.rpc('inspect',reward);this.remember(reward,result);return result;
  }
  async tick(){
    if(this.busy)return;
    if(!this.bot.status.connected){this.action=null;this.ready=false;this.nextCheck=0;this.message='Rewards waiting for Streamer.bot connection.';return;}
    if(!this.ready&&this.now()<this.nextCheck)return;
    this.busy=true;
    try{
      await this.ensureAction();
      const reward=this.store.data.rewards.find(r=>r.status==='pending'&&this.now()-(r.attemptAt||0)>=30000);if(!reward)return;
      this.store.change(reward.id,{attemptAt:this.now()});
      const result=await this.inspect(reward);
      if(result.status==='ready'){
        // Keep an uncertain request queued. The next attempt re-inspects its durable receipt.
        this.store.change(reward.id,{status:'pending'});
        const paid=await this.rpc('pay',reward,{vvExpected:result.fingerprint});this.remember(reward,paid);
      }
    }catch(e){this.message=e.message;if(!this.ready)this.nextCheck=this.now()+10000;}
    finally{this.busy=false;}
  }
  async previewRepair(){
    if(this.busy)throw new Error('A rewards check is running. Try again in a moment.');this.busy=true;this.plan=null;
    try{
      await this.ensureAction(true);const rows=[];
      for(const reward of [...this.store.data.rewards]){
        this.message='Checking saved reward '+(rows.length+1)+' of '+this.store.data.rewards.length+'…';
        try{const inspection=await this.inspect(reward);rows.push({...reward,...inspection,name:inspection.name||reward.name,originalAmount:reward.original?.amount??reward.amount});}
        catch(e){const inspection={status:'review',reason:e.message,canResolve:false,delta:0};this.store.change(reward.id,inspection);rows.push({...reward,...inspection,originalAmount:reward.original?.amount??reward.amount});}
      }
      this.plan={id:randomUUID(),createdAt:this.now(),expiresAt:this.now()+15*60*1000,rows};
      this.message='History checked. Apply the preview to backfill eligible wins at 50 points.';return this.planSummary();
    }finally{this.busy=false;}
  }
  planSummary(){
    if(!this.plan)return null;const {rows}=this.plan;
    return {ok:true,planId:this.plan.id,expiresAt:this.plan.expiresAt,rows,points:rows.reduce((n,r)=>n+(r.status==='ready'?r.delta:0),0),payments:rows.filter(r=>r.status==='ready').length,review:rows.filter(r=>r.status==='review').length,settlements:rows.filter(r=>!r.verified&&['ready','no_reward'].includes(r.status)&&r.fingerprint).length};
  }
  async applyRepair(planId){
    if(this.busy)throw new Error('A rewards operation is already running.');
    if(!this.plan||this.plan.id!==planId||this.now()>this.plan.expiresAt)throw new Error('Preview the saved history again before applying.');
    this.busy=true;const plan=this.plan;this.plan=null;let credited=0,points=0,review=0;
    try{
      await this.ensureAction();
      for(const row of plan.rows){
        if(row.verified||!row.fingerprint||!['ready','no_reward'].includes(row.status))continue;
        const reward=this.store.data.rewards.find(r=>r.id===row.id);if(!reward)continue;
        try{const result=await this.rpc('pay',reward,{vvExpected:row.fingerprint});this.remember(reward,result);if(result.deltaApplied>0){credited++;points+=result.deltaApplied;}if(result.status==='review')review++;}
        catch(e){review++;this.store.change(reward.id,{status:'review',reason:e.message});}
      }
      this.message=`History repair finished: ${credited} wins credited, ${points} points added. ${review} requests need another preview.`;return {ok:true,message:this.message,credited,points,review};
    }finally{this.busy=false;}
  }
  async resolveUnpaid({id,note}){
    if(this.busy)throw new Error('A rewards operation is already running.');
    if(typeof note!=='string'||note.trim().length<8||note.length>500)throw new Error('Enter how you verified this original payout was not received (8–500 characters).');
    const reward=this.store.data.rewards.find(r=>r.id===id);if(!reward)throw new Error('Saved reward not found.');this.busy=true;this.plan=null;
    try{
      await this.ensureAction();const current=await this.inspect(reward);
      if(!current.canResolve)throw new Error('This reward is already verified or has an identity conflict. No repeat payment is allowed.');
      this.store.change(id,{resolutionRequests:[...(reward.resolutionRequests||[]),{at:this.now(),note,inspection:current}].slice(-20)});
      const result=await this.rpc('pay',reward,{vvExpected:current.fingerprint,vvResolution:'confirmed_unpaid',vvNote:note});this.remember(reward,result);
      return {ok:true,message:result.reason,result};
    }finally{this.busy=false;}
  }
}
