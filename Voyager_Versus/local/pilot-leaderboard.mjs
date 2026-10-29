import {randomUUID} from 'node:crypto';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export const PILOT_ACTION='Voyager - Leaderboard Panel',PILOT_STORE='VoyagerPilotLeaderboardV1';
export function pilotSnapshot(records,now=Date.now()){
  if(!Array.isArray(records))throw Error('Saved pilot rankings are unavailable.');
  const rows=[],seen=new Set();let invalidRecords=0;
  for(const p of records){
    const login=String(p?.login||'').toLowerCase();
    if(!/^[a-z0-9_]{1,25}$/.test(login)||seen.has(login)||!['wins','losses','draws','battles'].every(k=>Number.isSafeInteger(p?.[k])&&p[k]>=0)||p.battles===0||p.wins+p.losses+p.draws!==p.battles){invalidRecords++;continue;}
    seen.add(login);rows.push({login,name:String(p.name||login).replace(/[\x00-\x1f\x7f]/g,'').trim().slice(0,100)||login,wins:p.wins,losses:p.losses,draws:p.draws,battles:p.battles});
  }
  if(records.length&&!rows.length)throw Error('No valid saved pilot rankings. Existing published rankings were retained.');
  rows.sort((a,b)=>b.wins-a.wins||a.losses-b.losses||a.name.toLowerCase().localeCompare(b.name.toLowerCase(),'en')||a.login.localeCompare(b.login,'en'));
  return{schema:1,source:'voyager-versus-rankings',generatedAt:now,totalRecords:rows.length,invalidRecords,rows:rows.slice(0,100)};
}
export class PilotLeaderboard {
  constructor({bot,records,now=Date.now,pollMs=400,timeout=10000}){Object.assign(this,{bot,records,now,pollMs,timeout});this.busy=false;this.next=0;this.lastSync=0;this.connected=false;this.dirty=1;this.message='Pilot rankings waiting for Streamer.bot.';}
  changed(){this.dirty++;this.next=0;}
  snapshot(){return{busy:this.busy,lastSync:this.lastSync,message:this.message};}
  async tick(){
    if(!this.bot.status.connected){this.connected=false;this.next=0;this.message='Pilot rankings: Streamer.bot disconnected. Last published rankings remain available.';return;}
    if(!this.connected){this.connected=true;this.next=0;}
    if(this.busy||this.now()<this.next)return;
    const records=this.records();if(!Array.isArray(records)){this.message='No saved rankings in this host folder yet. Play a live battle or restore local/data/rankings.json.';this.next=this.now()+60000;return;}
    this.busy=true;const generation=this.bot.generation,dirty=this.dirty;
    try{
      const snapshot=pilotSnapshot(records,this.now());this.message='Syncing saved pilot rankings…';
      const list=await this.bot.request('GetActions');const actions=list.actions?.filter(a=>a.enabled&&a.name===PILOT_ACTION)||[];
      if(list.status!=='ok'||actions.length!==1)throw Error('Install one enabled Voyager - Leaderboard Panel action v1.2 to sync pilot rankings.');
      if(generation!==this.bot.generation)throw Error('Connection changed; pilot rankings will retry.');
      const requestId=randomUUID(),reply=await this.bot.request('DoAction',{action:{id:actions[0].id},args:{leaderboardPanelOperation:'publishPilots',requestId,pilotLeaderboardJson:JSON.stringify(snapshot)}});
      if(reply.status!=='ok')throw Error('Pilot sync action was rejected. Check the Leaderboard Panel action is enabled.');
      const deadline=Date.now()+this.timeout;let confirmed=false;
      do{
        if(!this.bot.status.connected||generation!==this.bot.generation)throw Error('Connection changed; pilot rankings will retry.');
        const response=await this.bot.request('GetGlobal',{variable:PILOT_STORE,persisted:true},2000);
        let data;try{data=typeof response.variable?.value==='string'?JSON.parse(response.variable.value):response.variable?.value;}catch{}
        if(response.status==='ok'&&data?.schema===1&&data.requestId===requestId){confirmed=true;break;}
        await pause(this.pollMs);
      }while(Date.now()<deadline);
      if(!confirmed)throw Error('Pilot sync not confirmed. Import and compile Leaderboard Panel v1.2; keep its queue unpaused.');
      this.lastSync=this.now();this.message=`${snapshot.totalRecords} pilots synced to Live dashboard and OBS.`+(snapshot.invalidRecords?` ${snapshot.invalidRecords} invalid records skipped.`:'');this.next=this.now()+60000;
    }catch(e){this.message=e.message;this.next=this.now()+30000;}
    finally{this.busy=false;if(this.dirty!==dirty)this.next=0;}
  }
}
