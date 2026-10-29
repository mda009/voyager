import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

const roles=['initiator','challenger'];
const numeric=s=>/^\d{1,25}$/.test(s||'');
export class StreamEntries {
  constructor(directory,{now=()=>Date.now()}={}) {
    this.now=now;this.path=join(directory,'stream-entries.json');
    this.data={schema:1,id:randomUUID(),startedAt:now(),source:'initial',streamKey:'',latestStreamAt:0,seenStreams:[],users:[]};
    try {this.data=JSON.parse(readFileSync(this.path,'utf8'));}
    catch(e){if(e.code!=='ENOENT')throw new Error('Cannot read stream-entries.json. Restore its backup; entry limits were not reset.');}
    const d=this.data;
    if(d.schema!==1||typeof d.id!=='string'||!Number.isFinite(d.startedAt)||!Number.isFinite(d.latestStreamAt)||!Array.isArray(d.seenStreams)||!d.seenStreams.every(x=>typeof x==='string')||!Array.isArray(d.users)||d.users.some(u=>!u||!numeric(u.userId)||typeof u.login!=='string'||typeof u.name!=='string'||roles.some(r=>u[r]!==null&&(!Number.isFinite(u[r])||u[r]<0)))||new Set(d.users.map(u=>u.userId)).size!==d.users.length)throw new Error('Invalid stream-entries.json. Restore its backup; entry limits were not reset.');
  }
  update(change){const next=structuredClone(this.data);change(next);writeFileSync(this.path+'.tmp',JSON.stringify(next,null,2));renameSync(this.path+'.tmp',this.path);this.data=next;}
  claim(p,role) {
    if(p.demo)return {ok:true};
    if(!roles.includes(role))throw new Error('Unknown entry role.');
    if(!numeric(p.userId))return {ok:false,message:'Your Twitch account ID was missing. Ask the host to check the Streamer.bot chat connection.',entryLimit:true};
    const user=this.data.users.find(u=>u.userId===p.userId);
    if(user?.[role]!=null){
      const other=role==='initiator'?'challenger':'initiator';
      return {ok:false,entryLimit:true,message:user[other]!=null?'You have used both Versus entries this stream: one initiator and one challenger.':`You have already used your ${role} entry this stream. Your ${other} entry is still available.`};
    }
    this.update(d=>{let u=d.users.find(u=>u.userId===p.userId);if(!u){u={userId:p.userId,login:p.login,name:p.name,initiator:null,challenger:null};d.users.push(u);}u.login=p.login;u.name=p.name;u[role]=this.now();});
    return {ok:true};
  }
  newStream(){this.update(d=>{d.id=randomUUID();d.startedAt=this.now();d.source='manual';d.streamKey='';d.users=[];});return {ok:true,message:'New stream started. Each viewer has one initiator entry and one challenger entry. Global cooldown and points are unchanged.'};}
  observe({key,startedAt,channelId}) {
    if(typeof key!=='string'||!key||!numeric(channelId)||!Number.isFinite(startedAt)||startedAt<=0||startedAt>this.now()+60000)return false;
    if(this.data.seenStreams.includes(key)||startedAt<=this.data.latestStreamAt)return false;
    this.update(d=>{
      d.latestStreamAt=startedAt;d.seenStreams=[...d.seenStreams,key].slice(-100);d.streamKey=key;
      // Delayed online events must retain entries already used during that stream.
      // A manually started session is also not cleared by a late event for an older stream.
      if(startedAt>d.startedAt){d.id=randomUUID();d.startedAt=startedAt;d.users=d.users.map(u=>({...u,...Object.fromEntries(roles.map(r=>[r,u[r]!=null&&u[r]>=startedAt?u[r]:null]))})).filter(u=>roles.some(r=>u[r]!=null));}
      d.source='twitch';
    });return true;
  }
  snapshot(){return {...structuredClone(this.data),initiators:this.data.users.filter(u=>u.initiator!=null).length,challengers:this.data.users.filter(u=>u.challenger!=null).length};}
}
