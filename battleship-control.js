/* Voyager Control > Battleship (2.40.0). */
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
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':s<86400?Math.round(s/3600)+' h ago':new Date(t).toLocaleDateString([],{day:'numeric',month:'short'});};
const mmss=ms=>{const t=Math.max(0,Math.ceil(ms/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
const NUMS=['tickets','mvpTickets','lobbySeconds','battleSeconds','cooldownSeconds'],OUT={victory:'Fleet sunk',defeat:'Fleet escaped',empty:'No players'};
function fill(){const f=$('settings-form'),s=view.settings;f.announce.checked=s.announce;f.mvpFreeOnly.checked=s.mvpFreeOnly;for(const k of NUMS)f[k].value=s[k];}
function render(){
  const h=view.battle,s=view.settings,left=Math.ceil((view.cooldownLeft||0)/1000),pill=$('state-pill');
  pill.dataset.state=h?'ok':s.enabled?'wait':'error';pill.textContent=h?(h.practice?'Practice · ':'')+({lobby:'Fleet sighted',battle:'Battle',result:'Result'}[h.phase]):!s.enabled?'Off':left?'Cooling down '+left+'s':'Ready';
  const pw=$('power');pw.setAttribute('aria-pressed',String(s.enabled));pw.lastChild.textContent=s.enabled?'Game on':'Game off';
  $('start').hidden=$('practice').hidden=!!h;$('stop').hidden=!h;$('start').disabled=$('practice').disabled=!s.enabled||left>0;
  for(const id of ['st-free','st-bits','st-gift'])$(id).dataset.on=String(!!h&&h.phase==='battle');
  const now=$('now');now.textContent='';
  if(!h)now.append(document.createTextNode(s.enabled?(left?'Cooling down: '+left+' seconds until the next battle.':'Press Start a battle. The splash appears and chat has '+s.lobbySeconds+' seconds to join with !fire.'):'Battleship is switched off. Shots do nothing and the overlay stays hidden. Press Game off in the header to turn it back on.'));
  else if(h.phase==='lobby')now.append(el('b','','Enemy fleet sighted'),document.createTextNode(' · '+h.players+' signed on · the battle starts in '+Math.max(0,Math.ceil((h.phaseEndsAt-view.serverAt)/1000))+' s.'));
  else if(h.phase==='battle'){const sunk=h.ships.filter(x=>x.sunk).length;now.append(el('b','',sunk+' of '+h.ships.length+' ships sunk'),document.createTextNode(' · '+h.size+' × '+h.size+' grid · '+h.players+' player'+(h.players===1?'':'s')+' · '+h.hitCells+' of '+h.totalCells+' ship squares hit · '+mmss(h.phaseEndsAt-view.serverAt)+' left'+(h.leaders[0]&&h.leaders[0].score?' · leading: '+h.leaders[0].name:'')));}
  else if(h.result){const r=h.result;now.append(el('b','',OUT[r.outcome]),document.createTextNode(' · '+r.players+' player'+(r.players===1?'':'s')+' · '+r.shots+' shots, '+r.accuracy+'% hit'+(r.mvp?' · MVP '+r.mvp.name:'')+' · '+(r.practice?'practice battle, no tickets':r.outcome==='victory'?r.tickets+' ticket'+(r.tickets===1?'':'s')+' each'+(r.mvpTickets&&r.mvp?', MVP +'+r.mvpTickets:''):'no tickets')));}
  const st=$('stats'),x=view.stats;st.textContent='';for(const [k,v] of [['Battles',x.battles],['Won',x.won],['Lost',x.lost],['Shots fired',x.shots]]){const d=el('div','pr-st');d.append(el('small','',k),el('b','',String(v)));st.append(d);}
  const H=$('history');H.textContent='';if(!view.history.length)H.append(el('li','muted','No battles yet. A practice battle is a good first try.'));
  for(const g of view.history){const li=el('li');li.append(el('span','',OUT[g.outcome]+' · '+g.size+' × '+g.size+' · '+g.sunk+' of '+g.ships+' sunk · '+g.players+' player'+(g.players===1?'':'s')+' · '+g.accuracy+'% hit'+(g.mvp?' · MVP '+g.mvp.name:'')+(g.outcome==='victory'?' · '+g.tickets+' ticket'+(g.tickets===1?'':'s')+' each':'')),el('small','',ago(g.at)));H.append(li);}
  const tg=view.ticketGrants||{},ta=view.ticketAction||{},tp=$('tix-pill'),okAction=ta.state==='found';
  tp.dataset.state=!view.connected?'error':okAction?'ok':'error';tp.textContent=!view.connected?'Streamer.bot is not connected':okAction?'Ready to hand out tickets':'Ticket Giveaway action: '+(ta.state||'not found');
  const gl=$('grants');gl.textContent='';const rows=[...(tg.waiting||[]).map(j=>({...j,status:'waiting'})),...(tg.history||[])].filter(j=>String(j.id).startsWith('battleship-')).slice(0,5);
  if(!rows.length)gl.append(el('li','muted','No tickets handed out by Battleship yet.'));
  for(const j of rows){const li=el('li');li.append(el('span','',(j.status==='waiting'?'Waiting to grant ':j.status+': ')+(j.tickets||0)+' tickets across '+(j.accounts||0)+' player'+(j.accounts===1?'':'s')+(j.message?' · '+j.message:'')),el('small','',ago(j.at)));gl.append(li);}
  $('overlay-url').textContent='http://127.0.0.1:'+location.port+'/control/Voyager_Battleship_Overlay.html';
  if(!editing)fill();
}
async function load(){if(!hosted){$('not-hosted').hidden=false;return;}try{view=await api('/api/battleship');render();}catch(e){notice(e.message,true);}}
async function act(path,body,done){try{view={...view,...await api(path,body)};if(done){const off=/\/start$/.test(path)&&view.connected===false;notice(done+(off?' Streamer.bot is NOT connected: chat commands will not be heard, your scene will not move into the stage corner and no tickets can be given. Start Streamer.bot, then call this off and start again.':''),off);}render();}catch(e){notice(e.message,true);}}
$('start').onclick=()=>act('/api/battleship/start',{},'Battle started. The splash is on screen.');
$('practice').onclick=()=>act('/api/battleship/start',{practice:true},'Practice battle started: nothing is paid or counted.');
$('power').onclick=()=>{const on=!view.settings.enabled;act('/api/battleship/settings',{enabled:on},on?'Battleship is on.':'Battleship is off'+(view.battle?' and the battle was called off':'')+'.');};
$('stop').onclick=()=>act('/api/battleship/stop',{},'Battle called off. Nothing was paid.');
$('settings-form').addEventListener('input',()=>{editing=true;});
$('save').onclick=async()=>{const f=$('settings-form'),b={announce:f.announce.checked,mvpFreeOnly:f.mvpFreeOnly.checked};for(const k of NUMS)b[k]=Number(f[k].value);try{view={...view,...await api('/api/battleship/settings',b)};editing=false;notice('Settings saved.');render();}catch(e){notice(e.message,true);}};
$('copy-url').onclick=async()=>{try{await navigator.clipboard.writeText($('overlay-url').textContent);notice('Address copied. Paste it into an OBS Browser source, 1920 × 1080.');}catch{notice('Select the address and copy it.',true);}};
const fit=()=>{const f=$('frame');$('preview').style.transform='scale('+(f.clientWidth/1920)+')';};new ResizeObserver(fit).observe($('frame'));fit();
load();setInterval(()=>{if(!document.hidden)load();},1500);
})();
