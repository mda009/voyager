/* Voyager Control > Voyager Dreadnought (2.17). Calls the chat boss fight, edits its settings and shows the live overlay. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const FIELDS=['name','lobbySeconds','battleSeconds','baseHp','hpPerPilot','fireMin','fireMax','fireCooldown','bitDamage','giftDamage','victoryPoints'];
const time=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function render(){
  if(!view)return;const s=view.settings,l=view.live,f=$('settings').elements,phase=l.phase;
  if(!editing){for(const k of FIELDS)f[k].value=s[k];f.chatCall.checked=s.chatCall;f.announce.checked=s.announce;}
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
    el('span','',new Date(x.endedAt).toLocaleString([], {weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})+' · '+x.pilots+' pilots · '+x.damage.toLocaleString()+' damage'+(x.mvp?' · MVP '+x.mvp.name:'')+(x.rewardedCount?' · '+x.rewardedCount+' × '+x.reward+' pts owed':'')));h.append(li);}
  if(!view.history.length)h.append(el('li','',"No fights yet. Call the Dreadnought when you're live."));
  const ev=view.lastEvent,act=view.action?.state,chat=view.lastChatAt&&Date.now()-view.lastChatAt<15*60000;
  const checks=[
    [view.connected,view.connected?'Voyager is connected to Streamer.bot':'Voyager is not connected to Streamer.bot: connect it in Voyager Versus › Stream setup'],
    [act==='found',act==='found'?'Found the "Voyager - Dreadnought" action (use Send test message to check it runs)':act==='disabled'?'"Voyager - Dreadnought" is disabled in Streamer.bot: tick Enabled':act==='duplicate'?'There are two enabled "Voyager - Dreadnought" actions: keep one':act==='offline'?'Waiting for Streamer.bot':'No action named exactly "Voyager - Dreadnought": import Voyager_Dreadnought.cs (see the setup guide)'],
    [!!chat,chat?'Voyager can read Twitch chat: !join and !fire work from Twitch even without the commands':'No Twitch chat seen yet (type anything in chat)'],
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
})();
