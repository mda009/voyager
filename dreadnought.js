/* Voyager Control > Dreadnought (2.17; tabs and presets 2.21.1). Calls the chat boss fight, edits its settings and shows the live overlay. */
(()=>{'use strict';
const clock=ms=>{const t=Math.max(0,Math.round((ms||0)/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const FIELDS=['name','lobbySeconds','battleSeconds','baseHp','hpPerPilot','fireMin','fireMax','fireCooldown','bitDamage','giftDamage','victoryPoints','mvpBonus','legendarySeconds','heroSeconds','speedBonusPct'];
const time=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function render(){
  if(!view)return;const s=view.settings,l=view.live,f=$('settings').elements,phase=l.phase;
  if(!editing){for(const k of FIELDS)f[k].value=s[k];f.chatCall.checked=s.chatCall;f.announce.checked=s.announce;if(typeof markPreset==='function')markPreset();}
  $('c-fire').textContent=s.fireMin+'–'+s.fireMax;$('c-cd').textContent=s.fireCooldown;$('c-bits').textContent=s.bitDamage;$('c-gift').textContent=s.giftDamage.toLocaleString();
  const active=phase==='lobby'||phase==='battle';
  $('call').hidden=active;$('demo').hidden=active;$('start').hidden=phase!=='lobby';$('cancel').hidden=!active&&phase!=='result';
  $('idle').hidden=phase!=='idle';
  const pill=$('live-pill');pill.dataset.state=active?'ok':'wait';
  pill.textContent=phase==='lobby'?(l.demo?'Preview · ':'')+'Boarding · '+time(l.lobbyEndsAt-l.serverAt):phase==='battle'?(l.demo?'Preview · ':'')+'Battle · '+time(l.endsAt-l.serverAt):phase==='result'?(l.outcome==='victory'?'Victory':l.outcome==='empty'?'Nobody boarded':'Boss escaped'):'Standing by';
  $('phase-note').textContent=active?(l.demo?'Simulated chat, nothing is posted or paid':'Live on stream'):'';
  $('s-pilots').textContent=l.pilots??0;$('s-hull').textContent=l.maxHp?Math.ceil(l.hp/l.maxHp*100)+'%':'—';$('s-time').textContent=phase==='battle'?time(l.endsAt-l.serverAt):phase==='lobby'?time(l.lobbyEndsAt-l.serverAt):'—';$('s-gifts').textContent=l.damage?.gifts??0;
  const h=$('history');h.textContent='';
  for(const x of view.history){const li=el('li',x.outcome==='victory'?'win':'');li.append(el('b','',(x.outcome==='victory'?'★ Destroyed':x.outcome==='empty'?'Nobody boarded':'☠ Escaped')+' · '+x.name),
    el('span','',new Date(x.endedAt).toLocaleString([], {weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})+' · '+x.pilots+' pilots · '+x.damage.toLocaleString()+' damage'+(x.mvp?' · MVP '+x.mvp.name:'')+(x.speed==='legendary'?' · ⚡ Legendary kill in '+clock(x.elapsed):x.speed==='hero'?' · ★ Heroic kill in '+clock(x.elapsed):'')+(x.rewardedCount?' · '+x.rewardedCount+' × '+x.reward+' pts owed'+(x.bonus?' (incl. +'+x.bonus+' speed bonus)':''):'')));h.append(li);}
  if(!view.history.length)h.append(el('li','',"No fights yet. Call the Dreadnought when you're live."));
  const ev=view.lastEvent,act=view.action?.state,chat=view.lastChatAt&&Date.now()-view.lastChatAt<15*60000;
  const checks=[
    [view.connected,view.connected?'Voyager is connected to Streamer.bot':'Voyager is not connected to Streamer.bot: connect it in Voyager Versus › Stream setup'],
    [act==='found',act==='found'?'Found the "Voyager - Dreadnought" action (use Send test message to check it runs)':act==='disabled'?'"Voyager - Dreadnought" is disabled in Streamer.bot: tick Enabled':act==='duplicate'?'There are two enabled "Voyager - Dreadnought" actions: keep one':act==='offline'?'Waiting for Streamer.bot':'No action named exactly "Voyager - Dreadnought": import Voyager_Dreadnought.cs (see the setup guide)'],
    [!!chat,chat?'Voyager can read Twitch chat: !join and !fire work from Twitch even without the commands':'No Twitch chat seen yet (type anything in chat)'],
    (()=>{const o=view.otherChat||{},recent=t=>t&&Date.now()-t<15*60000;
      if(o.subscribed===false)return [false,'Streamer.bot refused Kick/YouTube chat events: update Streamer.bot to 1.0 or later, or use the command triggers'];
      const seen=['kick','youtube'].filter(p=>recent(o[p])).map(p=>p==='kick'?'Kick':'YouTube');
      return [seen.length?true:null,seen.length?'Voyager can read '+seen.join(' and ')+' chat too: !join, !fire, !voyager and !medals work there directly':'No Kick or YouTube chat seen yet: check Kick/YouTube are connected in Streamer.bot (Platforms), then type in that chat'];})(),
    [!!ev,ev?'Events arriving from the action (last: '+ev.kind+' from '+ev.platform+', '+new Date(ev.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+')':'No events from the action yet: during a fight, type !join (needed for YouTube, Kick, cheers and gifted subs)'],
    [null,'Add the !join, !fire, !dreadnought commands and the Cheer / Gift Subscription / Gift Bomb · Super Chat / Super Sticker / Membership Gift · Kick Gift / Mass Gift triggers to the action']
  ];
  const cl=$('checklist');cl.textContent='';for(const [ok,text] of checks){const li=el('li',ok===null?'info':ok?'ok':'',text);cl.append(li);}
}
async function load(){try{view=await api('/api/boss');render();}catch(e){notice(e.message,true);}}
async function control(action,value,msg){try{view=await api('/api/boss/control',{action,value});notice(msg);render();}catch(e){notice(e.message,true);}}
$('call').onclick=()=>control('call',null,'The Dreadnought is approaching. Chat has '+(view?.settings.lobbySeconds||60)+' seconds to !join.');
$('demo').onclick=()=>control('demo',null,'Preview running with simulated chat. Nothing is posted in chat or paid.');
$('start').onclick=()=>control('start',null,'Battle started.');
$('test').onclick=async()=>{try{const r=await api('/api/boss/control',{action:'test'});notice(r.message);}catch(e){notice(e.message,true);}};
$('cancel').onclick=()=>{if(confirm('End this fight now? No rewards are paid for a fight that is ended early.'))control('cancel',null,'Fight ended.');};
const form=$('settings');form.addEventListener('focusin',()=>{editing=true;});
form.onsubmit=e=>{e.preventDefault();const f=form.elements,value={chatCall:f.chatCall.checked,announce:f.announce.checked};for(const k of FIELDS)value[k]=k==='name'?f[k].value:Number(f[k].value);
  control('settings',value,'Settings saved.').then(()=>{editing=false;render();});};
$('obs-url').textContent=location.origin+'/dreadnought.html';
$('obs-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('obs-url').textContent);$('obs-copy').textContent='Copied';setTimeout(()=>$('obs-copy').textContent='Copy',1500);}catch{}};
// ---------- victory rewards (2.20.7) ----------
let points=null,owed=[],paying=false;
async function loadOwed(){try{const c=await api('/api/community');owed=(c.payables||[]).filter(p=>p.scope==='boss');renderOwed();}catch{}}
function renderOwed(){
  const list=$('owed');list.textContent='';
  const rows=owed.slice().sort((a,b)=>(a.status==='paid')-(b.status==='paid')||b.week-a.week);
  for(const p of rows.slice(0,40)){const li=el('li','owe');li.dataset.status=p.status;
    li.append(el('b','',p.name),el('span','',p.title+' · '+new Date(p.week).toLocaleDateString([], {day:'numeric',month:'short'})),el('span','r',p.status==='paid'?'Paid +'+p.reward:!p.payable?'No points account':p.status==='failed'?'Failed':'+'+p.reward.toLocaleString()));
    if(p.note)li.title=p.note;list.append(li);}
  if(!rows.length)list.append(el('li','','No victory rewards yet. Destroy the Dreadnought and the pilots appear here.'));
  const due=owed.filter(p=>p.status!=='paid'&&p.payable),total=due.reduce((a,p)=>a+p.reward,0);
  $('pay-summary').textContent=due.length?due.length+' pilot'+(due.length===1?'':'s')+' · '+total.toLocaleString()+' points':'All paid';
  $('pay-all').textContent=due.length?'Pay '+due.length+' pilot'+(due.length===1?'':'s')+' ('+total.toLocaleString()+' points)':'Pay victory points';
  $('pay-all').disabled=paying||!due.length||!points?.transportReady;
}
$('pay-all').onclick=async()=>{
  const due=owed.filter(p=>p.status!=='paid'&&p.payable);if(!due.length)return;
  if(!confirm('Pay '+due.length+' pilots their Dreadnought victory points ('+due.reduce((a,p)=>a+p.reward,0).toLocaleString()+' points)?'))return;
  paying=true;renderOwed();let ok=0,bad=0;
  for(const p of due){
    const reason=('Voyager Dreadnought: '+p.title+' ('+new Date(p.week).toLocaleDateString()+')').slice(0,200);
    try{
      const plan=await points.call('admin_preview',{adminTask:'points',adminUserKey:p.key,adminTwitchLogin:'',adminDelta:String(p.reward),adminReason:reason});
      if(!plan?.planId)throw new Error(plan?.error||'No preview returned.');
      const result=await points.call('admin_apply',{adminPlanId:plan.planId,adminConfirm:'APPLY',adminClearConfirm:''});
      if(result?.ok===false)throw new Error(result.error||'Not applied.');
      await api('/api/community/payout',{week:p.week,missionId:p.missionId,key:p.key,status:'paid',note:reason});ok++;
    }catch(e){bad++;await api('/api/community/payout',{week:p.week,missionId:p.missionId,key:p.key,status:'failed',note:e.message}).catch(()=>{});}
    notice('Paying pilots… '+(ok+bad)+' of '+due.length);
  }
  paying=false;notice(bad?ok+' paid, '+bad+' failed. Hover a failed pilot to see why, then press Pay again.':'All '+ok+' pilots paid. The points show in Points history.',bad>0);await loadOwed();
};
if(window.VoyagerPointsConnection&&hosted){
  points=new window.VoyagerPointsConnection(window.VOYAGER_CONFIG||{});
  points.addEventListener('status',e=>{const s=$('points-status'),st=e.detail?.state;s.dataset.state=st==='live'?'ok':st==='error'||st==='offline'?'error':'wait';s.textContent=st==='live'?'Points Ledger connected':'Points Ledger · '+(e.detail?.message||st);renderOwed();});
  points.connect();
}
if(!hosted)$('not-hosted').hidden=false;else{load();loadOwed();setInterval(()=>{if(!document.hidden)load();},1000);setInterval(()=>{if(!document.hidden&&!paying)loadOwed();},5000);}

// ---------- Dreadnought stage (2.20.84): screen takeover layout, chat window and the Streamer.bot move cue ----------
{
const form=$('stage-form');if(form){let st=null,stEditing=false;const f=form.elements;
$('stage-url').textContent=location.origin+'/control/stage.html';
$('stage-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('stage-url').textContent);$('stage-copy').textContent='Copied';setTimeout(()=>$('stage-copy').textContent='Copy',1500);}catch{}};
function options(sel,kinds,value){if(!sel.options.length)for(const [k,label] of Object.entries(kinds)){const o=document.createElement('option');o.value=k;o.textContent=label;sel.append(o);}sel.value=value;}
function pic(){const s=st.settings,short=k=>({none:'—',leaderboard:'Leaders',standings:'Standings',goals:'Goals',bar:'Goal bar',helpers:'Contributors',hall:'Hall of Fame',missions:'Missions',christmas:'Christmas',chat:'Chat',squadron:'Squadrons',dread:'Damage HUD',camera:'Camera'})[k]||k;
  $('pic-left').textContent=short(s.slots.left);$('pic-right').textContent=short(s.slots.right);$('pic-bl').textContent=short(s.slots.bottomLeft);$('pic-stack').textContent=s.stack.map(k=>({bucket:'Goals strip',ticker:'Ticker',moments:'Hints · medals',dread:'Damage HUD'})[k]).join(' · ')||'—';
  const pipRight=s.pip==='br';$('pic-bl').style.order=pipRight?0:2;$('pic-pip').style.order=pipRight?2:0;$('pic-stack').style.order=1;}
function renderStage(){if(!st)return;const s=st.settings;
  if(!stEditing){f.enabled.checked=s.enabled;options(f.left,st.slotKinds,s.slots.left);options(f.right,st.slotKinds,s.slots.right);options(f.bottomLeft,st.slotKinds,s.slots.bottomLeft);f.pip.value=s.pip;
    for(const cb of form.querySelectorAll('input[name=stack]'))cb.checked=s.stack.includes(cb.value);for(const k of ['twitch','youtube','kick','commands','names'])f['chat.'+k].checked=!!s.chat[k];
    f.scene.value=s.scene;f.source.value=s.source;f.hide.value=(s.hide||[]).join(', ');f.resultSeconds.value=s.resultSeconds;f.splashSeconds.value=s.splashSeconds;f.mvpSeconds.value=s.mvpSeconds;f.animationMs.value=s.animationMs;
    const v=s.versus||{};f['versus.enabled'].checked=v.enabled!==false;f['versus.splashSeconds'].value=v.splashSeconds??6;f['versus.winnerSeconds'].value=v.winnerSeconds??10;f['versus.winnerBonus'].value=v.winnerBonus??0;}
  pic();
  const pill=$('stage-pill');pill.dataset.state=st.forced?'ok':s.enabled?'wait':'';pill.textContent=st.forced?'Showing ('+(st.forcedMode==='versus'?'Versus':'Dreadnought')+' test)':s.enabled||s.versus?.enabled?'Armed':'Off';$('stage-hide').hidden=!st.forced;$('stage-show').hidden=!!st.forced;$('stage-show-versus').hidden=!!st.forced;
  const act=st.action?.state,cue=st.cue;
  const checks=[[s.enabled,s.enabled?'The stage takes over when the Dreadnought is called (and for the battle report)':'The stage is off: the Dreadnought shows on its own source as before'],
    [act==='found',act==='found'?'Found the "Voyager - Dreadnought Stage" action: your scene will be moved into the corner':act==='disabled'?'"Voyager - Dreadnought Stage" is disabled in Streamer.bot: tick Enabled':act==='duplicate'?'Two enabled "Voyager - Dreadnought Stage" actions: keep one':act==='offline'?'Waiting for Streamer.bot':'No action named exactly "Voyager - Dreadnought Stage": import Voyager_Dreadnought_Stage.cs (the stage still shows without it; your scene just stays put)'],
    [s.scene&&s.source?true:null,s.scene&&s.source?'Moving "'+s.source+'" inside the scene "'+s.scene+'"':'Name your live scene and the nested scene / group that holds your game to have it moved into the corner'],
    [st.obs?st.obs.ok:null,st.obs?'OBS '+(st.obs.ok?'did it':'refused')+': '+st.obs.message+' · '+new Date(st.obs.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):cue&&cue.ok?'No answer from the action yet: if nothing moved, re-open the action in Streamer.bot and Compile (0 errors), then press Move my scene again':'Waiting for the first cue'],
    [cue?cue.ok:null,cue?'Last cue: '+cue.phase+' · '+(cue.ok?'sent to Streamer.bot':'failed: '+cue.message)+' · '+new Date(cue.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'No move cue sent yet (use "Show the stage for 60 s" to test)'],
    [s.versus?.enabled?true:null,s.versus?.enabled?'Voyager Versus: the stage also takes over for a !versus call, the battle and the result; the champion gets '+(s.versus.winnerSeconds||0)+' s on screen'+(s.versus.winnerBonus?' and a '+s.versus.winnerBonus+'-point bonus (Missions › Points owed)':''):'Voyager Versus takeover is off'],
    [null,'Chat window: '+(st.chatCount||0)+' messages heard this session · platforms '+['twitch','youtube','kick'].filter(k=>s.chat[k]).join(', ')]];
  const cl=$('stage-checks');cl.textContent='';for(const [ok,text] of checks){cl.append(el('li',ok===null?'info':ok?'ok':'',text));}}
async function loadStage(){try{st=await api('/api/stage');renderStage();}catch(e){notice(e.message,true);}}
form.addEventListener('focusin',()=>{stEditing=true;});form.addEventListener('change',()=>{if(st){st.settings={...st.settings,slots:{left:f.left.value,right:f.right.value,bottomLeft:f.bottomLeft.value},pip:f.pip.value,stack:[...form.querySelectorAll('input[name=stack]:checked')].map(c=>c.value)};pic();}});
form.onsubmit=async e=>{e.preventDefault();const value={enabled:f.enabled.checked,slots:{left:f.left.value,right:f.right.value,bottomLeft:f.bottomLeft.value},pip:f.pip.value,stack:[...form.querySelectorAll('input[name=stack]:checked')].map(c=>c.value),scene:f.scene.value,source:f.source.value,hide:f.hide.value,resultSeconds:Number(f.resultSeconds.value),splashSeconds:Number(f.splashSeconds.value),mvpSeconds:Number(f.mvpSeconds.value),versus:{enabled:f['versus.enabled'].checked,splashSeconds:Number(f['versus.splashSeconds'].value),winnerSeconds:Number(f['versus.winnerSeconds'].value),winnerBonus:Number(f['versus.winnerBonus'].value)},animationMs:Number(f.animationMs.value),chat:{}};
  for(const k of ['twitch','youtube','kick','commands','names'])value.chat[k]=f['chat.'+k].checked;
  try{st={...st,...(await api('/api/stage/settings',value))};stEditing=false;notice('Stage saved. A stage source that is open picks the layout up within a second.');renderStage();}catch(e){notice(e.message,true);}};
$('stage-show').onclick=async()=>{try{st={...st,...(await api('/api/stage/force',{seconds:60}))};notice('The Dreadnought stage is showing for 60 seconds (your Dreadnought source shows the standby scene).');renderStage();setTimeout(loadStage,1500);}catch(e){notice(e.message,true);}};
$('stage-show-versus').onclick=async()=>{try{st={...st,...(await api('/api/stage/force',{seconds:60,mode:'versus'}))};notice('The Versus stage is showing for 60 seconds with the arena in the middle.');renderStage();setTimeout(loadStage,1500);}catch(e){notice(e.message,true);}};
$('stage-cue').onclick=async()=>{try{const r=await api('/api/stage/cue',{});st={...st,...r};const c=r.cue;notice(c?('Move cue ('+c.phase+') '+(c.ok?'sent to Streamer.bot. If the scene did not move, read the Streamer.bot log for a [Voyager Stage] line.':'failed: '+c.message)):'No cue sent: name the live scene and the game source first, then save.',!(c&&c.ok));renderStage();}catch(e){notice(e.message,true);}};
$('stage-hide').onclick=async()=>{try{st={...st,...(await api('/api/stage/force',{seconds:0}))};notice('Stage hidden.');renderStage();setTimeout(loadStage,1500);}catch(e){notice(e.message,true);}};
loadStage();setInterval(loadStage,5000);
}}

// 2.21.1: Live / The fight / Stage takeover tabs, and difficulty presets that fill the fight fields (Save keeps them).
const layout=document.querySelector('.dn-layout'),tabs=document.querySelectorAll('.dn-tabs [data-tab]');
function showTab(name){if(!['live','settings','stage'].includes(name))name='live';layout.dataset.tab=name;
  for(const sec of document.querySelectorAll('section[data-tab]'))sec.hidden=sec.dataset.tab!==name;
  for(const b of tabs)b.setAttribute('aria-selected',String(b.dataset.tab===name));
  try{sessionStorage.setItem('dnTab',name);}catch{}}
for(const b of tabs)b.onclick=()=>showTab(b.dataset.tab);
{const q=new URLSearchParams(location.search).get('tab'),h=location.hash.replace('#','');let saved='';try{saved=sessionStorage.getItem('dnTab')||'';}catch{}
 showTab(q||(h==='stage'||h==='stage-card'?'stage':h==='settings'||h==='fight'?'settings':saved||'live'));
 if(h==='stage'||h==='stage-card')setTimeout(()=>document.getElementById('stage-card')?.scrollIntoView({block:'start'}),50);}
addEventListener('hashchange',()=>{const h=location.hash.replace('#','');if(h==='stage'||h==='stage-card')showTab('stage');});
const PRESETS={
  balanced:{lobbySeconds:60,battleSeconds:240,baseHp:1000,hpPerPilot:150,fireMin:15,fireMax:30,fireCooldown:3,bitDamage:2.5,giftDamage:600,legendarySeconds:60,heroSeconds:120},
  easier:{lobbySeconds:60,battleSeconds:300,baseHp:700,hpPerPilot:100,fireMin:20,fireMax:40,fireCooldown:2,bitDamage:3,giftDamage:800,legendarySeconds:90,heroSeconds:180},
  brutal:{lobbySeconds:45,battleSeconds:210,baseHp:1600,hpPerPilot:220,fireMin:12,fireMax:24,fireCooldown:4,bitDamage:2,giftDamage:450,legendarySeconds:45,heroSeconds:90}};
function markPreset(){const f=$('settings').elements;let hit='custom';for(const [k,p] of Object.entries(PRESETS))if(Object.entries(p).every(([n,v])=>Number(f[n].value)===v))hit=k;
  for(const b of document.querySelectorAll('.dn-presets [data-preset]'))b.setAttribute('aria-pressed',String(b.dataset.preset===hit));}
for(const b of document.querySelectorAll('.dn-presets [data-preset]'))if(PRESETS[b.dataset.preset])b.onclick=()=>{editing=true;const f=$('settings').elements;for(const [k,v] of Object.entries(PRESETS[b.dataset.preset]))f[k].value=v;markPreset();notice(b.firstChild.textContent.trim()+' preset filled in — press Save settings to keep it.');};
$('settings').addEventListener('input',markPreset);
})();
