/* Voyager Doorframe (2.27.0): a silly chat game only the streamer can start. A tall, clumsy heroine in giant platform boots
   heads for a run of doors; something new is in the way at each one (a cat, a coffee table, a chandelier…). Chat has a few
   seconds to type !duck, !hop or !squeeze; the most-typed command decides. Right: she gets past. Wrong, tied or silent: she
   bonks the frame and breaks something. Everyone who typed the right command for a door earns points, with a bonus for a
   clean run. Nothing here is published to the website and no chat command starts it. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const COMMANDS=['duck','hop','squeeze'];
// kind = where it sits on the overlay: floor (hop over), hang (duck under), side (squeeze past). art = the drawing the overlay knows.
export const BUILTIN=[
  {id:'cat',name:'A cat',cmd:'hop',oops:'Tripped over the cat. The cat is fine. The cat is always fine.'},
  {id:'vacuum',name:'A robot vacuum',cmd:'hop',oops:'Stepped on the robot vacuum and rode it into the frame.'},
  {id:'banana',name:'A banana peel',cmd:'hop',oops:'Classic banana peel. Full cartoon slide, feet over head.'},
  {id:'lego',name:'One Lego brick',cmd:'hop',oops:'Found the brick with her one bare toe. Through a platform boot. Nobody knows how.'},
  {id:'chandelier',name:'A chandelier',cmd:'duck',oops:'Wore the chandelier as a hat for one glorious second.'},
  {id:'washing',name:'The washing line',cmd:'duck',oops:'Clotheslined by actual clothes. Left wearing a sock on her face.'},
  {id:'plant',name:'A hanging plant',cmd:'duck',oops:'Headbutted the fern. The fern won.'},
  {id:'table',name:'A coffee table',cmd:'squeeze',oops:'Shin, meet coffee table. Coffee table, meet shin.'},
  {id:'wardrobe',name:'A wardrobe',cmd:'squeeze',oops:'Tried to go through the wardrobe. It was not that kind of wardrobe.'},
  {id:'laundry',name:'The laundry pile',cmd:'squeeze',oops:'Vanished into the laundry pile. Emerged three days later.'}];
export const BONES=['Funny bone','Left pinky toe','Her dignity','Tailbone','Nose','Both elbows','Collarbone','A fingernail','Kneecap','Forehead','Wrist','The good ankle','A rib (the spare one)','Big toe','Shin'];
export const KIND={hop:'floor',duck:'hang',squeeze:'side'};
export const DOORFRAME_DEFAULTS={enabled:true,doors:3,seconds:7,reward:5,cleanBonus:10,announce:true,off:[],custom:[]};
const T={approach:1700,pass:1400,bonk:2600,exit:1600,result:9000};
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const int=(v,min,max,label)=>{const n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error(label+' must be '+min+' to '+max+'.');return n;};

export function normalizeDoorframeSettings(raw={},base=DOORFRAME_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},pick=(k)=>r[k]===undefined?base[k]:r[k];
  const custom=[];if(r.custom!==undefined&&!Array.isArray(r.custom))throw new Error('Your obstacles must be a list.');
  for(const c of r.custom===undefined?base.custom:r.custom){const name=clean(c?.name,40);if(!name)continue;if(!COMMANDS.includes(c?.cmd))throw new Error('"'+name+'" needs !duck, !hop or !squeeze.');
    custom.push({id:/^c[a-f0-9]{6}$/.test(String(c.id||''))?c.id:'c'+randomUUID().replace(/-/g,'').slice(0,6),name,cmd:c.cmd,oops:clean(c.oops,140)||'Walked straight into it.'});}
  if(custom.length>30)throw new Error('Up to 30 obstacles of your own.');
  const off=[...new Set((Array.isArray(pick('off'))?pick('off'):[]).map(x=>clean(x,12)).filter(Boolean))].slice(0,60);
  return {enabled:!!pick('enabled'),doors:int(pick('doors'),1,5,'Doors per round'),seconds:int(pick('seconds'),4,20,'Seconds to vote'),reward:int(pick('reward'),0,1000,'Points for the right command'),cleanBonus:int(pick('cleanBonus'),0,5000,'Clean-run bonus'),announce:!!pick('announce'),off,custom};
}

export class Doorframe{
  // say(text): chat. key(chat): the viewer's key (same as the rest of Voyager). reward(id,title,points,label,who): owe points.
  constructor({dataDir,say=()=>{},key=c=>(c?.platform||'twitch')+':'+String(c?.userId||c?.login||'').toLowerCase(),reward=()=>{},stream=()=>0,now=Date.now,random=Math.random}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'doorframe.json');this.say=say;this.key=key;this.reward=reward;this.stream=stream;this.now=now;this.random=random;
    this.settings=normalizeDoorframeSettings({});this.stats={rounds:0,doors:0,cleared:0,bones:0,clean:0,stream:0,streamBones:0};this.deck=[];this.history=[];this.round=null;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeDoorframeSettings(raw.settings||{});this.stats={...this.stats,...(raw.stats||{})};this.deck=Array.isArray(raw.deck)?raw.deck.slice(0,60):[];this.history=Array.isArray(raw.history)?raw.history.slice(0,20):[];}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,stats:this.stats,deck:this.deck,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  configure(raw={}){this.settings=normalizeDoorframeSettings({...this.settings,...raw});this.deck=this.deck.filter(id=>this.items().some(i=>i.id===id));void this.persist();return this.view();}
  items(){return [...BUILTIN,...this.settings.custom].filter(i=>!this.settings.off.includes(i.id)).map(i=>({...i,kind:KIND[i.cmd],art:BUILTIN.some(b=>b.id===i.id)?i.id:'crate'}));}
  // The next obstacle: every one comes up once before any comes round again.
  draw(){const items=this.items();if(!items.length)throw new Error('Switch on at least one obstacle.');
    if(!this.deck.length){this.deck=items.map(i=>i.id);for(let i=this.deck.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.deck[i],this.deck[j]]=[this.deck[j],this.deck[i]];}}
    const id=this.deck.pop();return items.find(i=>i.id===id)||items[0];}
  start(){
    if(!this.settings.enabled)throw new Error('Turn Doorframe on first.');if(this.round&&this.round.phase!=='done')throw new Error('A round is already running.');
    const now=this.now(),s=this.settings;
    this.round={id:randomUUID().slice(0,8),startedAt:now,doors:s.doors,door:0,bones:0,cleared:0,broken:[],right:new Map(),phase:'approach',phaseAt:now,phaseEndsAt:now+T.approach,item:this.draw(),votes:new Map(),choice:null,ok:null,bone:null};
    if(s.announce)this.say('🚪 DOORFRAME! '+s.doors+' door'+(s.doors===1?'':'s')+', and something new in the way at each one. Type !duck, !hop or !squeeze to get her through.');
    return this.view();
  }
  stop(){if(!this.round)throw new Error('No round is running.');this.round=null;return this.view();}
  tally(){const t={duck:0,hop:0,squeeze:0};if(this.round)for(const v of this.round.votes.values())t[v.cmd]++;return t;}
  // A chat line: counts while a door's vote is open. One vote per viewer per door; changing your mind is allowed.
  chat(chat){
    const r=this.round;if(!r||r.phase!=='vote')return null;const word=clean(chat?.text,40).toLowerCase().split(' ')[0],cmd=word.startsWith('!')?word.slice(1):'';if(!COMMANDS.includes(cmd))return null;
    const key=this.key(chat);if(!key)return null;r.votes.set(key,{cmd,who:{key,name:clean(chat.name||chat.login,60)||'Crew',platform:String(key).split(':')[0]}});return {ok:true,cmd};
  }
  // Called every 100 ms or so by the host.
  tick(){
    const r=this.round,now=this.now();if(!r||now<r.phaseEndsAt)return null;const s=this.settings,go=(phase,ms)=>{r.phase=phase;r.phaseAt=now;r.phaseEndsAt=now+ms;return phase;};
    if(r.phase==='approach'){if(s.announce)this.say('🚪 Door '+(r.door+1)+': '+r.item.name.toUpperCase()+'! !duck, !hop or !squeeze? ('+s.seconds+'s)');return go('vote',s.seconds*1000);}
    if(r.phase==='vote'){
      const t=this.tally(),ranked=Object.entries(t).sort((a,b)=>b[1]-a[1]);r.choice=ranked[0][1]>0&&ranked[0][1]>ranked[1][1]?ranked[0][0]:null;r.ok=r.choice===r.item.cmd;r.tally=t;
      for(const v of r.votes.values())if(v.cmd===r.item.cmd){const w=r.right.get(v.who.key)||{who:v.who,n:0};w.n++;r.right.set(v.who.key,w);if(s.reward>0)this.reward('door-'+r.id+'-'+r.door,'Doorframe: '+r.item.name,s.reward,'Doorframe',v.who);}
      this.stats.doors++;
      if(r.ok){r.cleared++;this.stats.cleared++;r.bone=null;if(s.announce)this.say('✅ Chat said !'+r.choice+'. She makes it past '+r.item.name.toLowerCase()+'!');return go('pass',T.pass);}
      const bone=BONES[Math.floor(this.random()*BONES.length)];r.bone={name:bone,line:r.item.oops};r.bones++;r.broken.push(bone);this.stats.bones++;
      const st=this.stream();if(this.stats.stream!==st){this.stats.stream=st;this.stats.streamBones=0;}this.stats.streamBones++;
      if(s.announce)this.say('💥 '+(r.choice?'Chat said !'+r.choice+'. ':'Chat could not decide. ')+'BONK! '+r.item.oops+' Broken: '+bone+'.');return go('bonk',T.bonk);
    }
    if(r.phase==='pass'||r.phase==='bonk')return go('exit',T.exit);
    if(r.phase==='exit'){
      if(r.door+1<r.doors){r.door++;r.item=this.draw();r.votes=new Map();r.choice=null;r.ok=null;r.bone=null;r.tally=null;return go('approach',T.approach);}
      const clean0=r.bones===0;this.stats.rounds++;if(clean0)this.stats.clean++;
      if(clean0&&s.cleanBonus>0)for(const w of r.right.values())this.reward('door-'+r.id+'-clean','Doorframe: clean run',s.cleanBonus,'Doorframe',w.who);
      r.result={cleared:r.cleared,doors:r.doors,bones:r.bones,broken:r.broken,players:r.right.size,clean:clean0,title:clean0?'Flawless!':r.bones===r.doors?'Straight to hospital':'She made it. Mostly.'};
      this.history.unshift({at:now,...r.result});this.history=this.history.slice(0,20);void this.persist();
      if(s.announce)this.say('🚪 Doorframe over: '+r.cleared+' of '+r.doors+' doors, '+r.bones+' bone'+(r.bones===1?'':'s')+' broken'+(r.broken.length?' ('+r.broken.join(', ')+')':'')+'. '+(r.right.size?r.right.size+' crew earned points'+(clean0&&s.cleanBonus?' plus the clean-run bonus':'')+'.':'Nobody typed a right answer.'));
      return go('result',T.result);
    }
    if(r.phase==='result'){this.round=null;return 'done';}
    return null;
  }
  streamBones(){return this.stats.stream===this.stream()?this.stats.streamBones:0;}
  overlay(){const r=this.round,now=this.now();
    return {serverAt:now,enabled:this.settings.enabled,round:r?{id:r.id,door:r.door,doors:r.doors,phase:r.phase,phaseAt:r.phaseAt,phaseEndsAt:r.phaseEndsAt,item:{name:r.item.name,kind:r.item.kind,art:r.item.art,cmd:['pass','bonk','exit','result'].includes(r.phase)?r.item.cmd:undefined},
      votes:r.phase==='vote'?this.tally():r.tally||{duck:0,hop:0,squeeze:0},choice:r.choice,ok:r.ok,bone:r.bone,bones:r.bones,result:r.result||null}:null,streamBones:this.streamBones()};}
  view(){return {settings:this.settings,builtin:BUILTIN.map(b=>({...b,on:!this.settings.off.includes(b.id)})),stats:{...this.stats,streamBones:this.streamBones()},history:this.history.slice(0,8),running:!!this.round,round:this.overlay().round,commands:COMMANDS.map(c=>'!'+c)};}
}
