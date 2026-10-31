/* Voyager Control > Chat commands (2.12). Lists every Streamer.bot chat command, groups Voyager's by feature,
   and warns about duplicates and look-alikes. Read-only, except the optional on/off switch, which runs the
   "Voyager - Command Manager" action (it only enables or disables a command by ID). */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const cfg={host:'127.0.0.1',port:8080,password:'',path:'/',secure:false,commandActionName:'Voyager - Command Manager',...(window.VOYAGER_CONFIG||{})};
const FEATURES=[
 ['Giveaways','Enter the chat giveaway',['!ticket','!enter']],
 ['Ticketed giveaway','Join the ticketed giveaway or check tickets',['!entry','!entergiveaway','!tickets']],
 ['Voyager Versus','Call or join a battle',['!versus']],
 ['Voyager Dreadnought','Board the fleet, fire, or call the boss (mods)',['!join','!fire','!dreadnought']],
 ['Voyager Medals','See your medals, Honour and the next grade',['!medals']],
 ['Membership card','Show your card, its stats or medal wall',['!voyager']],
 ['Points','Voyager points and tiers',['!upgrade','!points','!balance']],
 ['Overlays','Show or hide stream panels',['!hidemembers','!showmembers']]
];
const featureOf=word=>{for(const [name,what,list] of FEATURES)if(list.includes(word))return {name,what};return null;};
let socket,seq=0,pending=new Map(),commands=[],actionId='',filter='All',busy=new Set();

function status(text,state){const p=$('cm-status');p.textContent=text;p.dataset.state=state||'';}
function notice(text,state){const n=$('cm-notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=state||'';}
async function hash(text){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return btoa(String.fromCharCode(...new Uint8Array(b)));}
function request(name,body={}){return new Promise((resolve,reject)=>{if(socket?.readyState!==1)return reject(new Error('Streamer.bot is not connected.'));const id='cm-'+(++seq);const t=setTimeout(()=>{pending.delete(id);reject(new Error(name+' timed out.'));},15000);pending.set(id,{resolve,reject,t});socket.send(JSON.stringify({request:name,id,...body}));});}
function connect(){
 status('Connecting…','wait');
 let h=String(cfg.host).trim();if(h.includes(':')&&!h.startsWith('['))h='['+h+']';
 try{socket=new WebSocket((cfg.secure?'wss://':'ws://')+h+':'+cfg.port+(String(cfg.path||'/').startsWith('/')?cfg.path||'/':'/'+cfg.path));}catch{status('Check the address in Settings.','error');return;}
 socket.onmessage=async e=>{
  let msg;try{msg=JSON.parse(e.data);}catch{return;}
  if(msg.request==='Hello'){
   try{
    if(msg.authentication){if(!cfg.password)throw new Error('Streamer.bot needs its WebSocket password. Add it in Settings.');const secret=await hash(cfg.password+msg.authentication.salt);await request('Authenticate',{authentication:await hash(secret+msg.authentication.challenge)});}
    else if(cfg.requireAuthentication===true)throw new Error('Streamer.bot has no WebSocket password, and your settings require one.');
    status('Connected','ok');await refresh();
   }catch(err){status(err.message,'error');}
   return;
  }
  const p=msg.id&&pending.get(msg.id);if(!p)return;clearTimeout(p.t);pending.delete(msg.id);
  if(msg.status==='error')p.reject(new Error(msg.error||'Streamer.bot returned an error.'));else p.resolve(msg);
 };
 socket.onclose=()=>{for(const p of pending.values()){clearTimeout(p.t);p.reject(new Error('Disconnected.'));}pending.clear();status('Offline · retrying','error');setTimeout(connect,5000);};
}
const words=c=>{const raw=Array.isArray(c.commands)?c.commands:String(c.commands||c.command||'').split(/\r?\n/);return raw.map(w=>String(w).trim().toLowerCase()).filter(Boolean);};
const sourcesOf=c=>{const s=c.sources;if(Array.isArray(s))return s.map(x=>String(x).toLowerCase());if(typeof s==='string')return s.toLowerCase().split(/[ ,]+/).filter(Boolean);return [];};
async function refresh(){
 try{
  const [r,a]=await Promise.all([request('GetCommands'),request('GetActions')]);
  commands=(r.commands||[]).map(c=>({id:String(c.id||''),name:String(c.name||''),group:String(c.group||''),enabled:c.enabled!==false,words:words(c),sources:sourcesOf(c)}));
  const act=(a.actions||[]).find(x=>x.name===cfg.commandActionName&&x.enabled!==false);actionId=act?.id||'';
  $('cm-toggle-note').hidden=!!actionId;
  render();
 }catch(e){notice('Could not read your commands: '+e.message+' Streamer.bot 0.2.5 or newer is needed.','error');}
}
function distance(a,b){if(Math.abs(a.length-b.length)>1)return 2;const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length];}
function problems(){
 const all=[];for(const c of commands)if(c.enabled)for(const w of c.words)all.push({w,c});
 const out=[];
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const a=all[i],b=all[j];if(a.c.id===b.c.id)continue;
  if(a.w===b.w)out.push({kind:'duplicate',a,b,text:a.w+' is used by two commands: "'+a.c.name+'" and "'+b.c.name+'". Both will run.'});
  else if(a.w.length>3&&b.w.length>3&&distance(a.w,b.w)===1)out.push({kind:'lookalike',a,b,text:a.w+' and '+b.w+' look alike ("'+a.c.name+'" and "'+b.c.name+'"). Viewers may type the wrong one.'});
 }
 return out;
}
function render(){
 const issues=problems(),flagged=new Set(issues.flatMap(x=>[x.a.c.id,x.b.c.id]));
 const box=$('cm-issues');box.textContent='';
 for(const x of issues.slice(0,8)){const d=document.createElement('div');d.className='cm-issue';d.dataset.kind=x.kind;const b=document.createElement('strong');b.textContent=x.kind==='duplicate'?'Duplicate':'Look-alike';const s=document.createElement('span');s.textContent=x.text;d.append(b,s);box.append(d);}
 box.hidden=!issues.length;
 const rows=commands.map(c=>{const f=c.words.map(featureOf).find(Boolean);return {...c,feature:f?f.name:'Other',what:f?f.what:(c.group||'')};})
  .sort((a,b)=>(a.feature==='Other')-(b.feature==='Other')||a.feature.localeCompare(b.feature)||a.name.localeCompare(b.name));
 const features=['All',...new Set(rows.map(r=>r.feature))];
 const fb=$('cm-filters');fb.textContent='';
 for(const f of features){const b=document.createElement('button');b.type='button';b.textContent=f;b.className='cm-filter';b.setAttribute('aria-pressed',String(f===filter));b.onclick=()=>{filter=f;render();};fb.append(b);}
 const q=$('cm-search').value.trim().toLowerCase();
 const tb=$('cm-rows');tb.textContent='';
 const shown=rows.filter(r=>(filter==='All'||r.feature===filter)&&(!q||(r.name+' '+r.words.join(' ')+' '+r.group).toLowerCase().includes(q)));
 for(const r of shown){
  const tr=document.createElement('tr');if(!r.enabled)tr.className='off';
  const td=t=>{const c=document.createElement('td');if(t!==undefined)c.textContent=t;tr.append(c);return c;};
  const cmd=td();for(const w of r.words){const code=document.createElement('code');code.textContent=w;cmd.append(code,' ');}
  if(flagged.has(r.id)){const w=document.createElement('span');w.className='cm-flag';w.textContent='!';w.title='See the warning above';cmd.append(w);}
  td(r.name);td(r.what);td(r.feature);
  const plat=td();const src=r.sources.join(' ');for(const [k,label] of [['twitch','Twitch'],['youtube','YouTube'],['kick','Kick']]){const s=document.createElement('span');s.className='cm-chip '+k;const on=!r.sources.length||src.includes(k);s.dataset.on=String(on);s.textContent=label;plat.append(s);}
  const sw=td();const b=document.createElement('button');b.type='button';b.setAttribute('role','switch');b.className='cm-switch';b.setAttribute('aria-checked',String(r.enabled));b.setAttribute('aria-label',(r.enabled?'Turn off ':'Turn on ')+(r.words[0]||r.name));
  b.disabled=!actionId||busy.has(r.id);b.title=actionId?'':'Import the Voyager - Command Manager action to switch commands here';b.onclick=()=>toggle(r,!r.enabled);sw.append(b);
  tb.append(tr);
 }
 $('cm-empty').hidden=shown.length>0;
 $('cm-count').textContent=commands.filter(c=>c.enabled).length+' of '+commands.length+' on';
}
async function toggle(r,on){
 busy.add(r.id);render();
 try{await request('DoAction',{action:{id:actionId},args:{requestId:crypto.randomUUID(),commandId:r.id,enabled:on?'true':'false'}});await new Promise(res=>setTimeout(res,600));await refresh();notice('');}
 catch(e){notice('Could not change '+(r.words[0]||r.name)+': '+e.message,'error');}
 finally{busy.delete(r.id);render();}
}
$('cm-search').addEventListener('input',render);
$('cm-refresh').addEventListener('click',()=>refresh());
if(new URLSearchParams(location.search).get('demo')==='1'){
 commands=[{id:'1',name:'Giveaway entry',enabled:true,words:['!ticket','!enter'],sources:[]},{id:'2',name:'Ticket balance',enabled:true,words:['!tickets'],sources:[]},{id:'3',name:'Ticket entry',enabled:true,words:['!entry','!entergiveaway'],sources:[]},{id:'4',name:'Voyager Versus',enabled:true,words:['!versus'],sources:['twitch','youtube','kick']},{id:'5',name:'Upgrade tier',enabled:true,words:['!upgrade'],sources:[]},{id:'6',name:'Hide members',enabled:false,words:['!hidemembers'],sources:['twitch']},{id:'7',name:'Socials',enabled:true,words:['!socials'],sources:['twitch']}];
 status('Demo data','wait');render();
}else connect();
})();
