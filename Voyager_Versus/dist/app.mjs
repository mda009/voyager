import {Arena,SHIPS} from './engine.mjs?v=2.8.0';
import {fleet} from './ship-models.mjs?v=2.3.0';
import {ArenaView,SoundFX} from './arena.mjs?v=2.8.1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const params=new URLSearchParams(location.search),overlay=params.get('overlay')==='1';
const local=['127.0.0.1','localhost','[::1]'].includes(location.hostname)&&params.get('demo')!=='1';
if(params.get('embedded')==='1'&&!overlay)document.body.classList.add('embedded');
if(overlay){document.body.classList.add('overlay','transparent');document.documentElement.classList.add('overlay-transparent');if(params.get('hideIdle')!=='0')document.body.classList.add('idle-hidden');}
const sound=new SoundFX();const view=new ArenaView($('battle-canvas'),{onEvent:e=>sound.play(e)});
let state,engine,token,source,lastLists='',toastTimer,streamConnected=false,chatConnected=false;
function toast(message){if(!message)return;$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4200);}
async function send(type,value){
  try{
    let response;
    if(local){if(!token)throw new Error('Local host is reconnecting.');const r=await fetch('/api/control',{method:'POST',headers:{'Content-Type':'application/json','X-Voyager-Token':token},body:JSON.stringify({type,value})});response=await r.json();if(!r.ok)throw new Error(response.message||'Request failed.');}
    else response=type==='command'?engine.command(value):engine.control(type,value);
    if(response.message)toast(response.message);return response;
  }catch(e){toast(e.message);return {ok:false};}
}
function connectBadge(status){
  const good=status?.connected;$('conn-dot').classList.toggle('green',!!good);
  $('connection-text').textContent=local?(status?.message||'Streamer.bot disconnected'):'Preview mode · chat simulated';
  $('connection-detail').textContent=local?(status?.message||'Waiting for local host'):'Connect through the downloaded local launcher.';
}
const clock=n=>{const seconds=Math.max(0,Math.ceil(n-1e-8));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;};
function hud(i,p,s){
  const name=p?.name||'Awaiting pilot',h=p?.hull??100,sh=p?.shield??50,energy=p?.energy??100;
  return `<div class="pilot-top"><span class="pilot-name">${esc(name)}</span><span class="pilot-tag">P${i+1}${p?.demo?' · DEMO':''}</span></div><div class="meter"><span style="width:${h/(p?.maxHull||100)*100}%"></span></div><div class="meter shield"><span style="width:${sh/(p?.maxShield||50)*100}%"></span></div><div class="hud-values"><span>HULL ${Math.ceil(h)}</span><span>SHIELD ${Math.ceil(sh)}</span></div><div class="meter energy"><span style="width:${energy}%"></span></div><div class="hud-values"><span>REACTOR</span><span>${Math.floor(energy)}%</span></div><div class="cooldowns">${['fire','missile','shield','dodge'].map(k=>{const t=Math.max(0,Math.ceil((p?.cooldowns[k]||0)-s.time));return `<span class="${t?'':'ready'}">!${k} ${t?t+'s':'✓'}</span>`;}).join('')}</div>`;
}
function render(s){
  if(state&&s.time<state.time)view.lastId=null;
  state=s;view.update(s);
  const calling=s.phase==='calling', caller=s.caller;
  $('call-screen').hidden=!calling;
  $('arena-stage').classList.toggle('calling',calling);
  $('arena-stage').classList.toggle('arena-paused',s.paused);
  const combatActive=['countdown','battle'].includes(s.phase);
  $('battle-command-guide').hidden=!combatActive;
  $('arena-entry-prompt').hidden=combatActive;
  $('arena-active-prompt').hidden=!combatActive;
  $('battle-command-status').textContent=local&&(!streamConnected||!chatConnected)?'CHAT OFFLINE · WAITING TO RECONNECT':s.paused?'ARENA PAUSED · COMMANDS RESUME WITH THE BATTLE':s.phase==='countdown'?'GET READY · WEAPONS UNLOCK AT LAUNCH':s.players.some(p=>p.demo)?'TRAINING · SIMULATED PILOTS':'ACTIVE PILOTS · TYPE IN CHAT';

  if(calling&&caller){
    const ship=SHIPS[caller.ship];
    if($('call-pilot-name').textContent!==caller.name)$('call-pilot-name').textContent=caller.name;
    if($('call-ship').getAttribute('src')!==ship.image)$('call-ship').src=ship.image;
    $('call-ship-3d').dataset.ship=caller.ship;
    $('call-ship-name').textContent=fleet[caller.ship].name;
    $('call-title').textContent=s.open?'CALLING FOR A CHALLENGER':'CHALLENGER CALL ON HOLD';
    $('call-subtitle').textContent=s.open?`${caller.name} is ready to battle. Will you answer the call?`:'The host has paused new entries. Your Pilot 1 seat is reserved.';
    $('call-cta').textContent=s.open?'TYPE IN CHAT TO ACCEPT':'WAITING FOR HOST TO OPEN ENTRIES';
    $('call-hint').textContent=`Next eligible challenger · 1 entry per role per stream · ${s.countdownLength}s countdown`;
    $('call-status-text').textContent=caller.demo?'TRAINING TRANSMISSION · NO RANKING':s.open?'TRANSMITTING CHALLENGE':'ENTRIES CLOSED';
  }

  $('phase-label').textContent=s.paused?'ARENA PAUSED':({lobby:'STANDING BY',calling:'CALLING FOR A CHALLENGER',countdown:'LAUNCH SEQUENCE',battle:'BATTLE IN PROGRESS',result:'BATTLE COMPLETE'}[s.phase]);
  $('round-label').textContent=s.round?`ROUND ${String(s.round).padStart(3,'0')}`:'SECTOR 009';
  $('battle-clock').textContent=calling?'—':clock(s.phase==='lobby'?s.roundLength:s.remaining);
  $('clock-caption').textContent=s.phase==='battle'?'TIME REMAINING':s.phase==='result'?'RESULT CLOSES':s.phase==='countdown'?'LAUNCH IN':'FLIGHT TIME';
  $('battle-mode').textContent=s.players.some(p=>p.demo)?'TRAINING · NO RANKING':s.autoFire?'AUTO-FIRE ENABLED':'MANUAL WEAPONS';
  $('battle-clock').style.color=s.phase==='battle'&&s.remaining<15?'#e9c36b':'';
  for(let i=0;i<2;i++)$('pilot-'+i).innerHTML=hud(i,s.players[i],s);
  const waiting=s.queue.length+s.matches.length*2+(caller?1:0);
  $('waiting-count').textContent=`${waiting} pilots waiting`;$('queue-number').textContent=String(waiting).padStart(2,'0');
  $('entry-status').textContent=s.open?(s.cooldownRemaining>0?`NEXT CALL ${clock(s.cooldownRemaining)}`:'CALL READY'):'ENTRIES CLOSED';
  $('cooldown-status').textContent=s.cooldownRemaining>0?`Next live call in ${clock(s.cooldownRemaining)} · challengers can join an open call now.`:'Live battle call ready · 45-minute global cooldown.';$('toggle-queue').textContent=s.open?'Close entries':'Open entries';
  $('pause').textContent=s.paused?'▶ Resume arena':'Ⅱ Pause arena';$('cancel').disabled=!['calling','battle','countdown'].includes(s.phase);$('cancel').textContent=calling?'Cancel call':'End battle';
  if(overlay&&params.get('hideIdle')!=='0')document.body.classList.toggle('idle-hidden',s.phase==='lobby');
  const key=JSON.stringify([caller,s.queue,s.matches,s.invites.map(i=>[i.from.name,i.to]),s.events.at(-1)?.id,s.leaderboard]);
  if(key!==lastLists){lastLists=key;
    const queue=[...(caller?[{...caller,calling:true}]:[]),...s.matches.flat().map(p=>({...p,duel:true})),...s.queue];
    $('queue-list').innerHTML=queue.length?queue.map((p,i)=>`<div class="queue-row"><span class="num">${String(i+1).padStart(2,'0')}</span><div><strong>${esc(p.name)}</strong><small>${esc(SHIPS[p.ship].name)}${p.demo?' · simulated':''}</small></div><span class="queue-type">${p.calling?'CALLING':p.duel?'DUEL':'READY'}</span></div>`).join(''):'<div class="empty"><span class="empty-symbol">⌖</span>No pilots in the queue.<br>Type <code>!versus</code> to call for a challenger.</div>';
    $('invite-list').innerHTML=s.invites.map(i=>`<div class="invite">${esc(i.from.name)} → @${esc(i.to)}<br>Awaiting <code>!accept</code> · expires after 60s</div>`).join('');
    const logs=s.events.filter(e=>e.type==='log').slice(-20).reverse();
    $('feed').innerHTML=logs.length?logs.map(e=>`<div class="feed-item ${esc(e.kind)}"><small>T+ ${clock(e.t)}</small>${esc(e.text)}</div>`).join(''):'<div class="empty">All systems ready.<br>Waiting for first contact.</div>';
    $('rankings').innerHTML=s.leaderboard.length?s.leaderboard.map((p,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td>${esc(p.name)}</td><td>${p.wins}</td><td>${p.losses}</td><td>${p.draws}</td><td>${Math.round(100*p.wins/Math.max(1,p.battles))}%</td></tr>`).join(''):'<tr><td colspan="6" class="empty">The leaderboard is waiting for its first live battle.<br>Demo and simulated pilots do not appear here.</td></tr>';
  }
}
async function initLocal(){
  $('mode-banner').textContent='Local arena · Connect Streamer.bot in Stream setup to receive Twitch chat. OBS and this panel share one game.';
  $('mode-banner').classList.add('live');$('connect-help').textContent='Enter the WebSocket settings from Streamer.bot on your streaming PC. Chat commands will drive the arena automatically.';
  try{
    if(!overlay){const r=await fetch('/api/admin');if(!r.ok)throw new Error('Local host unavailable.');token=(await r.json()).token;}
    source=new EventSource('/api/events');
    source.onmessage=event=>{const msg=JSON.parse(event.data);streamConnected=true;chatConnected=!!msg.connection?.connected;$('connection-lost').hidden=true;render(msg.game);connectBadge(msg.connection);$('reward-status').textContent=`${msg.rewards.message} Pending: ${msg.rewards.pending} · Needs review: ${msg.rewards.review} · History awaiting repair: ${msg.rewards.awaitingRepair||0}`;
    $('announcement-status').textContent=(msg.announcements.overlayMessage?msg.announcements.overlayMessage+' ':'')+msg.announcements.message+' '+(msg.matchChat?.message||'')+(msg.matchChat?.review?' Unconfirmed match messages: '+msg.matchChat.review+'.':'');renderEntries(msg.entries);$('pilot-sync-status').textContent=(msg.pilotLeaderboard?.message||'Update the local host for pilot leaderboard sync.')+(msg.pilotLeaderboard?.lastSync?' Last sync: '+new Date(msg.pilotLeaderboard.lastSync).toLocaleString()+'.':'');
    $('rewards-preview').disabled=msg.rewards.busy||!streamConnected;
    if(msg.rewards.busy)$('repair-status').textContent=msg.rewards.message;
    if(!msg.rewards.ready&&!msg.rewards.busy)$('repair-status').textContent=msg.rewards.message;
    const diagnostic=msg.rewards.diagnostic;$('rewards-diagnostic').textContent=diagnostic?[diagnostic.actionName,diagnostic.stage?.replaceAll('_',' '),diagnostic.operation,diagnostic.via?'reply via '+diagnostic.via:'',diagnostic.codeVersion?'code '+diagnostic.codeVersion:'',diagnostic.detail||''].filter(Boolean).join(' · '):'';
    $('reward-history').innerHTML=msg.rewards.recent.slice().reverse().map(r=>`<div class="reward-row"><span>${esc(r.name)}</span><b>${r.amount?'+':''}${r.amount??'?'}</b><small title="${esc(r.reason)}">${esc(r.status==='review'?'needs review':r.status)}</small></div>`).join('');};
    source.onerror=()=>{streamConnected=false;chatConnected=false;$('connection-lost').hidden=false;connectBadge({message:'Host connection lost · reconnecting'});if(state)render(state);};
  }catch(e){connectBadge({message:'Local host unavailable · reconnecting'});$('connection-lost').hidden=false;setTimeout(initLocal,3000);}
}
if(local)initLocal();else{
  engine=new Arena({training:true});render(engine.snapshot());connectBadge();
  setInterval(()=>{engine.tick(.1);render(engine.snapshot());},100);
  $('connect').disabled=true;$('disconnect').disabled=true;$('new-stream').disabled=true;
}
for(const btn of document.querySelectorAll('[data-tab]'))btn.addEventListener('click',()=>{
  for(const panel of document.querySelectorAll('.tab-panel'))panel.hidden=panel.id!=='tab-'+btn.dataset.tab;
  for(const nav of document.querySelectorAll('.nav'))nav.classList.toggle('active',nav===btn);
});
const tab=name=>document.querySelector(`[data-tab="${name}"]`).click();
$('demo').textContent=local?'Open training preview ↗':'▶ Launch training demo';
$('test-form').closest('.simulator').hidden=local;
$('demo').onclick=()=>local?window.open('/?demo=1','voyager-training','noopener'):send('demo');$('pause').onclick=()=>send('pause');$('toggle-queue').onclick=()=>send('open');
$('cancel').onclick=()=>send('cancel');$('clear-queue').onclick=()=>send('clear');
$('sound').onclick=async()=>{try{$('sound').textContent=(await sound.toggle())?'Sound on':'Sound off';}catch{toast('Audio unavailable in this browser.');}};
if(overlay&&params.get('sound')==='1'){
  $('overlay-sound').hidden=false;$('overlay-sound').onclick=async()=>{try{await sound.toggle();$('overlay-sound').hidden=true;}catch{}};
}
$('test-form').onsubmit=async e=>{e.preventDefault();const login=$('test-name').value.trim().toLowerCase();if(!/^[a-z0-9_]{1,25}$/.test(login)){toast('Use letters, numbers and underscores for the pilot name.');return;}await send('command',{login,name:login,text:$('test-command').value.trim(),demo:true});};
for(const button of document.querySelectorAll('[data-command]'))button.onclick=()=>{$('test-command').value=button.dataset.command;$('test-command').focus();toast('Command loaded. Choose the active pilot name and press Send.');};
$('connect-form').onsubmit=async e=>{e.preventDefault();if(!local){toast('Connect using the local launcher.');return;}await send('connect',{url:$('sb-url').value,password:$('sb-password').value});$('sb-password').value='';};
$('disconnect').onclick=()=>send('disconnect');
$('save-rules').onclick=async()=>{const r=await send('settings',{roundLength:$('round-duration').value,autoFire:$('auto-fire').checked});if(r.ok)toast('Rules saved. Duration applies to the next battle.');};
$('graphics-quality').value=['ultra','balanced','low'].includes(params.get('quality'))?params.get('quality'):'ultra';
function overlayURL(){const p=new URLSearchParams({overlay:'1',quality:$('graphics-quality').value});p.set('hideIdle',$('hide-idle').checked?'1':'0');if($('overlay-audio').checked)p.set('sound','1');return `${local?location.origin:'http://127.0.0.1:8740'}/?${p}`;}
for(const id of ['hide-idle','overlay-audio','graphics-quality'])$(id).onchange=()=>$('overlay-url').value=overlayURL();
$('overlay-url').value=overlayURL();
$('copy-overlay').onclick=async()=>{try{await navigator.clipboard.writeText(overlayURL());toast('OBS URL copied.');}catch{$('overlay-url').select();toast('Select and copy the URL above.');}};
$('open-overlay').onclick=()=>{if(local)window.open(overlayURL(),'voyager-overlay');else{tab('setup');toast('Download the local launcher to use the live OBS overlay.');}};
const cooldownURL=()=>`${['127.0.0.1','localhost','[::1]'].includes(location.hostname)?location.origin:'http://127.0.0.1:8740'}/cooldown.html`;
$('cooldown-url').value=cooldownURL();
$('copy-cooldown').onclick=async()=>{try{await navigator.clipboard.writeText(cooldownURL());toast('Cooldown timer URL copied.');}catch{$('cooldown-url').select();toast('Select and copy the timer URL above.');}};
$('open-cooldown').onclick=()=>{if(['127.0.0.1','localhost','[::1]'].includes(location.hostname))window.open(cooldownURL(),'voyager-cooldown');else toast('Start the local launcher to show the live cooldown. Use Preview timer to see the design.');};

$('export-rankings').onclick=()=>{
  if(!state?.leaderboard.length){toast('No live results to export yet.');return;}
  const cell=s=>'"'+String(s).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const csv=['Rank,Pilot,Wins,Losses,Draws,Battles',...state.leaderboard.map((p,i)=>[i+1,cell(p.name),p.wins,p.losses,p.draws,p.battles].join(','))].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='Voyager-Versus-Top-50.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
};
$('ship-cards').innerHTML=Object.entries(SHIPS).map(([key,p],i)=>`<article class="ship-card ship-${key}" style="--ship-accent:${p.accent}"><span class="eyebrow">${fleet[key].name} / ${esc(p.role.toUpperCase())}</span><div class="ship-portrait"><span class="ship-grid"></span><canvas class="ship-preview" data-model="${key}" aria-label="Animated 3D ${esc(p.name)} spaceship"></canvas><img src="${p.image}" alt="${esc(p.name)} spaceship — ${['RSI Aegis Gladius mesh','RSI Anvil Paladin mesh','RSI Aegis Sabre mesh'][i]}" width="640" height="500"><span class="ship-model">${p.model}</span></div><h3>${fleet[key].short.toUpperCase()}</h3><p>${['Aegis Gladius from the RSI holoviewer. Swept wings, forward cockpit and twin engines. Uses the Interceptor loadout.','Anvil Paladin from the RSI holoviewer. Armoured gunship hull and dorsal turret. Uses the Sentinel loadout.','Aegis Sabre from the RSI holoviewer. Broad swept wings and a narrow centre fuselage. Uses the Phantom loadout.'][i]}</p><div class="ship-stats"><span>HULL<b>${p.hull}</b></span><span>SHIELDS<b>${p.shield}</b></span><span>ENERGY<b>100</b></span></div><button class="button" data-ship="${key}">!ship ${key}</button></article>`).join('');
for(const button of document.querySelectorAll('[data-ship]'))button.onclick=()=>{tab('arena');$('test-command').value='!ship '+button.dataset.ship;$('test-command').focus();toast('Ship command loaded. Send before joining the queue.');};
if(params.has('setup'))tab('setup');

// Local-only repair controls. The host owns the preview plan and receipt checks.
let repairPlan=null,repairRows=[],resolvingId=null;
const statusLabel=s=>({audit:'Awaiting check',ready:'Ready to credit',review:'Needs review',credited:'Credited',legacy_paid:'Legacy paid',no_reward:'No runner-up credit',pending:'Pending'})[s]||s;
const pointsCell=n=>n===null||n===undefined?'Unknown':Number(n).toLocaleString();
function showRepair(plan){
  repairPlan=plan.planId;repairRows=plan.rows||[];
  $('rewards-apply').disabled=!plan.settlements;$('rewards-export').disabled=!repairRows.length;
  $('repair-summary').textContent=`${plan.payments} unpaid wins · ${plan.points} points to add · ${plan.review} need review`;
  $('repair-status').textContent=repairRows.length?'Check the accounts and amounts below, then apply eligible credits.':'No saved reward records were found. Keep or restore your original local/data/economy.json; rankings alone are not payment receipts.';
  $('repair-rows').innerHTML=repairRows.length?repairRows.map(r=>`<tr><td><strong>${esc(r.name||r.login)}</strong><small>Twitch ID: ${esc(r.userId||'not saved')}</small><small>${esc(r.id)}</small></td><td>${r.role==='winner'?'Win':'Runner-up'}</td><td>${pointsCell(r.originalAmount)}</td><td>${pointsCell(r.amount)}</td><td>${pointsCell(r.paid)}</td><td>${r.status==='ready'?'+'+pointsCell(r.delta):'0'}</td><td><b>${esc(statusLabel(r.status))}</b><small>${esc(r.reason)}</small>${r.canResolve&&r.status!=='ready'?`<button class="text-button" data-resolve-reward="${esc(r.id)}">Review unpaid claim</button>`:''}</td></tr>`).join(''):'<tr><td colspan="7">No saved payouts found.</td></tr>';
  const accounts=new Map();for(const r of repairRows){const key=r.userId||r.login||r.id,a=accounts.get(key)||{name:r.name||r.login,id:r.userId,wins:0,earned:0,paid:0,unknown:0,due:0};if(r.role==='winner'){a.wins++;a.earned+=50;}if(r.paid===null||r.paid===undefined)a.unknown++;else a.paid+=r.paid;if(r.status==='ready')a.due+=r.delta;accounts.set(key,a);}
  $('repair-accounts').innerHTML=accounts.size?`<div class="panel-title"><h2>Totals per viewer · saved reward history</h2></div><table><thead><tr><th>Viewer</th><th>Wins</th><th>Revised winnings</th><th>Recorded paid</th><th>Eligible to add</th></tr></thead><tbody>${[...accounts.values()].map(a=>`<tr><td>${esc(a.name)}<small>${esc(a.id||'ID needs verification')}</small></td><td>${a.wins}</td><td>${a.earned}</td><td>${a.paid}${a.unknown?' + unknown':''}</td><td>${a.due}</td></tr>`).join('')}</tbody></table>`:'';
}
$('open-repair').onclick=()=>tab('rewards');
$('rewards-check').onclick=async()=>{if(!local)return;$('rewards-check').disabled=true;$('rewards-check-status').textContent='Checking the rewards action…';try{const r=await send('rewards_check');$('rewards-check-status').textContent=r?.message||'No result received. Check the Voyager launcher.';}finally{$('rewards-check').disabled=false;}};
$('rewards-preview').onclick=async()=>{if(!local){toast('History repair is available through your local Voyager launcher.');return;}$('repair-status').textContent='Checking saved receipts and Twitch accounts…';$('rewards-preview').disabled=true;$('rewards-apply').disabled=true;repairPlan=null;const r=await send('rewards_preview');if(r?.ok)showRepair(r);else $('repair-status').textContent=r?.message||'History check failed. See the connection status.';$('rewards-preview').disabled=false;};
$('rewards-apply').onclick=async()=>{if(!local||!repairPlan)return;const id=repairPlan;repairPlan=null;$('rewards-apply').disabled=true;const r=await send('rewards_apply',{planId:id});$('repair-status').textContent=(r?.message||'Repair request finished.')+' Check saved history again to refresh these results.';};
$('repair-rows').onclick=e=>{const button=e.target.closest('[data-resolve-reward]');if(!button)return;const row=repairRows.find(r=>r.id===button.dataset.resolveReward);if(!row)return;resolvingId=row.id;$('repair-detail').textContent=`${row.name||row.login} · Twitch ID ${row.userId||'unknown'} · ${row.role==='winner'?'50-point win':'0-point runner-up'}. ${row.reason}`;$('repair-note').value='';$('repair-confirm').checked=false;$('repair-submit').textContent=row.role==='winner'?'Credit verified unpaid win (+50)':'Close unpaid runner-up (0 points)';$('repair-dialog').showModal();};
$('repair-cancel').onclick=()=>$('repair-dialog').close();
$('repair-form').onsubmit=async e=>{e.preventDefault();if(!local||!resolvingId||!$('repair-confirm').checked)return;const id=resolvingId;resolvingId=null;repairPlan=null;$('rewards-apply').disabled=true;$('repair-dialog').close();const r=await send('rewards_resolve',{id,note:$('repair-note').value.trim()});$('repair-status').textContent=(r?.message||'Resolution request finished.')+' Check saved history again to refresh the audit.';};
$('rewards-export').onclick=()=>{const cell=s=>'"'+String(s??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';const csv=[['Reward ID','Twitch ID','Login','Name','Outcome','Original award','Revised award','Recorded paid','Eligible to add','Status','Reason'],...repairRows.map(r=>[r.id,r.userId,r.login,r.name,r.role,r.originalAmount,r.amount,r.paid??'unknown',r.status==='ready'?r.delta:0,r.status,r.reason])].map(row=>row.map(cell).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='Voyager-Versus-Rewards-Audit.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);};
if(!local){$('rewards-check').disabled=true;$('rewards-preview').disabled=true;$('repair-status').textContent='Preview mode cannot access or change real points. Open the local Voyager launcher to repair saved history.';}

// Stream entry counters are owned and persisted by the local host.
let lastEntries='';
function renderEntries(entries){
  if(!entries)return;
  $('new-stream').disabled=!streamConnected||state?.phase!=='lobby'||!!(state?.queue.length||state?.matches.length||state?.invites.length);
  const key=JSON.stringify(entries);if(key===lastEntries)return;lastEntries=key;
  const source=entries.source==='twitch'?'Twitch stream detected':entries.source==='manual'?'Stream started by host':'Current session · waiting for a Twitch stream-start event';
  $('stream-entry-status').textContent=source+' · '+new Date(entries.startedAt).toLocaleString();
  $('stream-entry-summary').textContent=`${entries.users.length} viewers · ${entries.initiators} initiator entries used · ${entries.challengers} challenger entries used`;
  $('stream-entry-rows').innerHTML=entries.users.length?entries.users.map(u=>`<tr><td>${esc(u.name)}<small>@${esc(u.login)}</small></td><td>${u.initiator!=null?'Used':'Available'}</td><td>${u.challenger!=null?'Used':'Available'}</td></tr>`).join(''):'<tr><td colspan="3">No entries recorded in this session.</td></tr>';
}
$('new-stream').onclick=async()=>{
  if(!local)return;
  if(!window.confirm('Start a new stream session? This restores one initiator and one challenger entry for every viewer. Only do this for a new broadcast. Points, rankings and the global cooldown stay unchanged.'))return;
  await send('new_stream',{confirm:true});
};

// The announcement sound runs in its own OBS source, never in this control tab.
const readyURL=()=>`${local?location.origin:'http://127.0.0.1:8740'}/versuscall.html`;
$('ready-url').value=readyURL();
$('copy-ready').onclick=async()=>{try{await navigator.clipboard.writeText(readyURL());toast('Ready alert URL copied.');}catch{$('ready-url').select();toast('Select and copy the ready alert URL.');}};
$('test-ready').disabled=!local;
$('test-ready').onclick=async()=>{const b=$('test-ready');b.disabled=true;try{const r=await send('ready_alert_test');$('ready-test-status').textContent=r?.message||'Could not send the test. Check the local host.';}finally{b.disabled=!local;}};
