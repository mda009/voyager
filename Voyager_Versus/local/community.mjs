// Voyager community programme (2.13): weekly missions and seasons with a Hall of Fame.
// Works only from data Voyager already has: points ledger members (sent by the Public website publisher page
// every minute) and Voyager Versus pilot records. It never changes points itself; mission rewards are paid
// from Voyager Control > Missions through the Points Ledger's own audited preview/apply path.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';

const FILE='community.json',DAY=86400000;
export const TYPES={
  streamDays:{label:'Earn points on different stream days',unit:'days'},
  earnPoints:{label:'Earn Voyager points',unit:'points'},
  versusWins:{label:'Win Voyager Versus battles',unit:'wins'}
};
export const DEFAULT_MISSIONS=[
  {id:'regular',title:'Regular Pilot',type:'streamDays',target:3,reward:250,enabled:true},
  {id:'collector',title:'Point Collector',type:'earnPoints',target:500,reward:150,enabled:true},
  {id:'arena',title:'Ace of the Arena',type:'versusWins',target:1,reward:400,enabled:true}
];
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
const int=(v,min,max)=>{const n=Number(v);return Number.isSafeInteger(n)&&n>=min&&n<=max?n:null;};
const metric=m=>{const c=Number(m.capturedIn);if(Number.isFinite(c)&&c>=0)return c;const p=Number(m.points);return Number.isFinite(p)&&p>=0?p:null;};
// Weeks start Monday 00:00 in the streaming PC's own time zone.
export function weekStart(now){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime();}
export function dayId(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

export function normalizeMissions(raw){
  const out=[],seen=new Set();
  for(const m of Array.isArray(raw)?raw.slice(0,8):[]){
    const id=clean(m?.id,24).toLowerCase().replace(/[^a-z0-9-]/g,'')||'m'+out.length;if(seen.has(id))continue;seen.add(id);
    const type=Object.hasOwn(TYPES,m?.type)?m.type:null;if(!type)throw new Error('Unknown mission type.');
    const title=clean(m.title,40);if(!title)throw new Error('Every mission needs a name.');
    const target=int(m.target,1,type==='earnPoints'?1e7:7);if(target===null)throw new Error(title+': the goal must be a whole number'+(type==='earnPoints'?'.':' from 1 to 7.'));
    const reward=int(m.reward,0,1e6);if(reward===null)throw new Error(title+': the reward must be 0 to 1,000,000 points.');
    out.push({id,title,type,target,reward,enabled:m.enabled!==false});
  }
  return out;
}

export class Community{
  constructor({dataDir,now=Date.now}){this.dataDir=dataDir;this.now=now;this.state=this.fresh();this.saving=Promise.resolve();this.pilots=()=>[];}
  fresh(){
    const now=this.now();
    return {schema:1,missions:DEFAULT_MISSIONS.map(m=>({...m})),members:{},
      week:{id:weekStart(now),baseline:{},days:{},versus:{}},previous:null,payouts:{},
      season:this.newSeason(now,1,13),hall:[]};
  }
  newSeason(now,number,weeks){return {number,name:'Season '+number,startedAt:now,endsAt:now+weeks*7*DAY,weeks,baseline:{},versus:{}};}
  async load(){try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));if(raw?.schema===1){this.state={...this.fresh(),...raw};this.state.missions=normalizeMissions(raw.missions);}}catch{}return this;}
  persist(){const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  setPilots(fn){this.pilots=fn;}

  // Called with the points ledger members (from the publisher page) about once a minute.
  receive(list){
    const now=this.now(),s=this.state;this.roll(now);
    const today=dayId(now);let changed=false;
    for(const m of Array.isArray(list)?list.slice(0,20000):[]){
      const key=clean(m?.key,120);if(!/^(twitch|youtube|kick):/.test(key))continue;
      const value=metric(m);if(value===null)continue;
      const prev=s.members[key];
      s.members[key]={name:clean(m.name||m.login,60)||key,login:clean(m.login,60).toLowerCase(),platform:key.split(':')[0],value,seen:now};
      if(s.week.baseline[key]===undefined){s.week.baseline[key]=value;changed=true;}
      if(s.season.baseline[key]===undefined){s.season.baseline[key]=value;changed=true;}
      if(prev&&value>prev.value){const d=s.week.days[key]||(s.week.days[key]=[]);if(!d.includes(today)){d.push(today);changed=true;}}
      if(!prev||prev.value!==value)changed=true;
    }
    this.notePilots();
    if(changed)this.persist();
    return this.view();
  }
  notePilots(){
    const s=this.state;
    for(const p of this.pilotList()){if(s.week.versus[p.login]===undefined)s.week.versus[p.login]=p.wins;if(s.season.versus[p.login]===undefined)s.season.versus[p.login]=p.wins;}
  }
  pilotList(){let raw=[];try{raw=this.pilots()||[];}catch{}return raw.filter(p=>p&&p.login).map(p=>({login:String(p.login).toLowerCase(),name:clean(p.name||p.login,60),wins:int(p.wins,0,1e9)??0}));}
  // New week: keep last week's completions so they can still be paid. Season end: archive to the Hall of Fame.
  roll(now){
    const s=this.state,w=weekStart(now);
    if(w!==s.week.id){s.previous={id:s.week.id,completions:this.completions()};s.week={id:w,baseline:{},days:{},versus:{}};this.persist();}
    if(now>=s.season.endsAt)this.endSeason(now);
  }
  progressFor(m){
    const s=this.state,rows=[];
    if(m.type==='versusWins'){
      const byLogin=new Map(Object.entries(s.members).filter(([k])=>k.startsWith('twitch:')).map(([k,v])=>[v.login,k]));
      for(const p of this.pilotList()){const base=s.week.versus[p.login];if(base===undefined)continue;const n=Math.max(0,p.wins-base);if(n>0)rows.push({key:byLogin.get(p.login)||'',name:p.name,platform:'twitch',progress:n});}
    }else for(const [key,v] of Object.entries(s.members)){
      const n=m.type==='earnPoints'?Math.max(0,v.value-(s.week.baseline[key]??v.value)):(s.week.days[key]||[]).length;
      if(n>0)rows.push({key,name:v.name,platform:v.platform,progress:n});
    }
    return rows.map(r=>({...r,progress:Math.min(r.progress,m.target),done:r.progress>=m.target})).sort((a,b)=>b.progress-a.progress||a.name.localeCompare(b.name));
  }
  completions(){
    const out=[];
    for(const m of this.state.missions.filter(x=>x.enabled))for(const r of this.progressFor(m).filter(x=>x.done))out.push({missionId:m.id,title:m.title,reward:m.reward,key:r.key,name:r.name,platform:r.platform});
    return out;
  }
  payKey(week,missionId,key){return week+'|'+missionId+'|'+key;}
  // Who is owed what, this week and last week, with payment status.
  payables(){
    const s=this.state,rows=[];
    for(const [week,list] of [[s.week.id,this.completions()],[s.previous?.id,s.previous?.completions||[]]]){
      if(!week)continue;
      for(const c of list){if(!c.reward)continue;const k=this.payKey(week,c.missionId,c.key);rows.push({...c,week,payable:!!c.key,status:s.payouts[k]?.status||'owed',paidAt:s.payouts[k]?.at||0,note:s.payouts[k]?.note||''});}
    }
    return rows;
  }
  recordPayout({week,missionId,key,status,note}){
    if(!['paid','failed'].includes(status))throw new Error('Unknown payout status.');
    const k=this.payKey(int(week,0,1e15),clean(missionId,24),clean(key,120));
    if(this.state.payouts[k]?.status==='paid')return {ok:true,already:true};
    this.state.payouts[k]={status,at:this.now(),note:clean(note,200)};
    const keys=Object.keys(this.state.payouts);if(keys.length>5000)for(const old of keys.slice(0,keys.length-5000))delete this.state.payouts[old];
    this.persist();return {ok:true};
  }
  setMissions(list){this.state.missions=normalizeMissions(list);this.persist();return this.view();}
  standings(limit=50){
    const s=this.state,wins=new Map();
    for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b!==undefined&&p.wins>b)wins.set(p.login,p.wins-b);}
    const rows=Object.entries(s.members).map(([key,v])=>({key,name:v.name,platform:v.platform,points:Math.max(0,v.value-(s.season.baseline[key]??v.value)),wins:v.platform==='twitch'?wins.get(v.login)||0:0}))
      .filter(r=>r.points>0||r.wins>0).sort((a,b)=>b.points-a.points||b.wins-a.wins||a.name.localeCompare(b.name));
    return rows.slice(0,limit).map((r,i)=>({rank:i+1,...r}));
  }
  topPilot(){const s=this.state;let best=null;for(const p of this.pilotList()){const b=s.season.versus[p.login];if(b===undefined)continue;const n=p.wins-b;if(n>0&&(!best||n>best.wins))best={name:p.name,wins:n};}return best;}
  endSeason(now=this.now()){
    const s=this.state,top=this.standings(5);
    s.hall.unshift({number:s.season.number,name:s.season.name,startedAt:s.season.startedAt,endedAt:now,champion:top[0]?{name:top[0].name,platform:top[0].platform,points:top[0].points}:null,topPilot:this.topPilot(),top:top.map(r=>({name:r.name,platform:r.platform,points:r.points}))});
    s.hall=s.hall.slice(0,20);
    s.season=this.newSeason(now,s.season.number+1,s.season.weeks);this.persist();return this.view();
  }
  configureSeason({name,weeks}){
    const s=this.state.season,w=int(weeks,1,52);if(w===null)throw new Error('A season lasts 1 to 52 weeks.');
    const n=clean(name,40);if(n)s.name=n;s.weeks=w;s.endsAt=s.startedAt+w*7*DAY;this.persist();return this.view();
  }
  view(){
    const s=this.state,missions=s.missions.map(m=>{const p=this.progressFor(m);return {...m,typeLabel:TYPES[m.type].label,unit:TYPES[m.type].unit,started:p.length,completed:p.filter(x=>x.done).length,top:p.slice(0,8)};});
    return {missions,week:{id:s.week.id,endsAt:s.week.id+7*DAY},members:Object.keys(s.members).length,payables:this.payables(),
      season:{number:s.season.number,name:s.season.name,startedAt:s.season.startedAt,endsAt:s.season.endsAt,weeks:s.season.weeks},standings:this.standings(),topPilot:this.topPilot(),hall:s.hall,types:TYPES};
  }
  // What the public site may show (names are masked later if "Show viewer names" is off).
  publicView(){
    const v=this.view();
    return {season:{name:v.season.name,endsAt:v.season.endsAt,standings:v.standings.slice(0,10).map(r=>({rank:r.rank,name:r.name,platform:r.platform,points:r.points,wins:r.wins}))},
      hall:v.hall.slice(0,6).map(h=>({name:h.name,endedAt:h.endedAt,champion:h.champion,topPilot:h.topPilot})),
      missions:v.missions.filter(m=>m.enabled).map(m=>({title:m.title,type:m.type,target:m.target,reward:m.reward,completed:m.completed})),weekEndsAt:v.week.endsAt};
  }
}
