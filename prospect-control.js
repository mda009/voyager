/* Voyager Control > Prospect Run (2.33.0). */
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
const NUMS=['ticketsGold','ticketsSilver','ticketsBronze','ticketsFail','mvpTickets','scoreGold','scoreSilver','contractSeconds','mineSeconds','haulSeconds','sellSeconds','cooldownSeconds'];
function fill(){const f=$('settings-form'),s=view.settings;f.announce.checked=s.announce;for(const k of NUMS)f[k].value=s[k];}
function render(){
  const r=view.run,s=view.settings,left=Math.ceil((view.cooldownLeft||0)/1000),pill=$('state-pill');
  pill.dataset.state=r?'ok':s.enabled?'wait':'error';pill.textContent=r?(r.practice?'Practice · ':'')+({contract:'Contract',mine:'Mining',haul:'Hauling',sell:'Selling',result:'Payout'}[r.phase]):!s.enabled?'Off':left?'Cooling down '+left+'s':'Ready';
  const pw=$('power');pw.setAttribute('aria-pressed',String(s.enabled));pw.lastChild.textContent=s.enabled?'Game on':'Game off';
  $('start').hidden=$('practice').hidden=!!r;$('stop').hidden=!r;$('start').disabled=$('practice').disabled=!s.enabled||left>0;
  for(const [id,ph] of [['st-mine','mine'],['st-haul','haul'],['st-sell','sell']])$(id).dataset.on=String(!!r&&r.phase===ph);
  const now=$('now');now.textContent='';
  if(!r)now.append(document.createTextNode(s.enabled?(left?'Cooling down: '+left+' seconds until the next run.':'Press Start a run. A contract card appears and anyone who types a command during the run is on the crew.'):'Prospect Run is switched off. Chat commands do nothing, the overlay stays hidden and viewers cannot ask for it from the website. Press Game off in the header to turn it back on.'));
  else if(r.phase==='contract')now.append(el('b','',r.crew+' aboard'),document.createTextNode(' · the contract card is up; mining starts in '+Math.max(0,Math.ceil((r.phaseEndsAt-view.serverAt)/1000))+' s.'));
  else if(r.phase==='mine')now.append(el('b','',r.cracked?'Rock cracked':'Charge '+Math.round(r.charge*100)+'%'),document.createTextNode(' · rock '+Math.round(r.crack*100)+'% broken · '+r.ore+' CU so far · '+r.crew+' aboard'+(r.over?' · ore has been lost to overcharge':'')));
  else if(r.phase==='haul')now.append(el('b','',r.pirate?(r.killedAt?'Pirate destroyed':'Pirate '+r.pirate.hp+' / '+r.pirate.max):'Jump drive spooling'),document.createTextNode(' · cargo '+r.cargo+' CU'+(r.lost?' ('+r.lost+' lost)':'')));
  else if(r.phase==='sell')now.append(el('b','','×'+(r.price||1).toFixed(2)),document.createTextNode(' · '+r.votes+' of '+r.need+' votes to sell · cargo '+r.cargo+' CU'+(r.soldAt?' · SOLD':'')));
  else if(r.result)now.append(el('b','',r.result.title),document.createTextNode(' · haul score '+r.result.score+' · '+(r.result.practice?'practice run, no tickets':r.result.tickets+' ticket'+(r.result.tickets===1?'':'s')+' each for '+r.result.crew+' crew')+(r.result.mvp?' · MVP '+r.result.mvp.name:'')));
  const st=$('stats'),x=view.stats;st.textContent='';for(const [k,v] of [['Runs',x.runs],['Gold',x.gold],['Silver',x.silver],['Bronze',x.bronze],['Cargo lost',x.fail],['Best score',x.best],['CU delivered',x.delivered]]){const d=el('div','pr-st');d.append(el('small','',k),el('b','',String(v)));st.append(d);}
  const h=$('history');h.textContent='';if(!view.history.length)h.append(el('li','muted','No runs yet. A practice run is a good first try.'));
  for(const g of view.history){const li=el('li');li.append(el('span','',g.title+' · score '+g.score+' · '+g.cargo+' CU at ×'+Number(g.price).toFixed(2)+' · '+g.crew+' crew · '+g.tickets+' ticket'+(g.tickets===1?'':'s')+' each'),el('small','',ago(g.at)));h.append(li);}
  // tickets
  const tg=view.ticketGrants||{},ta=view.ticketAction||{},tp=$('tix-pill'),okAction=ta.state==='found';
  tp.dataset.state=!view.connected?'error':okAction?'ok':'error';tp.textContent=!view.connected?'Streamer.bot is not connected':okAction?'Ready to hand out tickets':'Ticket Giveaway action: '+(ta.state||'not found');
  const gl=$('grants');gl.textContent='';const rows=[...(tg.waiting||[]).map(j=>({...j,status:'waiting'})),...(tg.history||[])].filter(j=>String(j.id).startsWith('prospect-')).slice(0,5);
  if(!rows.length)gl.append(el('li','muted','No tickets handed out by Prospect Run yet.'));
  for(const j of rows){const li=el('li');li.append(el('span','',(j.status==='waiting'?'Waiting to grant ':j.status+': ')+(j.tickets||0)+' tickets across '+(j.accounts||0)+' crew'+(j.message?' · '+j.message:'')),el('small','',ago(j.at)));gl.append(li);}
  const base='http://127.0.0.1:'+location.port+'/control/Voyager_Prospect_Overlay.html';$('overlay-url').textContent=base;
  if(!editing)fill();
}
async function load(){if(!hosted){$('not-hosted').hidden=false;return;}try{view=await api('/api/prospect');render();}catch(e){notice(e.message,true);}}
async function act(path,body,done){try{view={...view,...await api(path,body)};if(done){const off=/\/start$/.test(path)&&view.connected===false;notice(done+(off?' Streamer.bot is NOT connected: chat commands will not be heard, your scene will not move into the stage corner and no tickets can be given. Start Streamer.bot, then call this off and start again.':''),off);}render();}catch(e){notice(e.message,true);}}
$('start').onclick=()=>act('/api/prospect/start',{},'Run started. The contract card is on screen.');
$('practice').onclick=()=>act('/api/prospect/start',{practice:true},'Practice run started: nothing is paid or counted.');
$('power').onclick=()=>{const on=!view.settings.enabled;act('/api/prospect/settings',{enabled:on},on?'Prospect Run is on.':'Prospect Run is off'+(view.run?' and the run was called off':'')+'. Viewers cannot ask for it from the website while it is off.');};
$('stop').onclick=()=>act('/api/prospect/stop',{},'Run called off. Nothing was paid.');
$('settings-form').addEventListener('input',()=>{editing=true;});
$('save').onclick=async()=>{const f=$('settings-form'),b={announce:f.announce.checked};for(const k of NUMS)b[k]=Number(f[k].value);try{view={...view,...await api('/api/prospect/settings',b)};editing=false;notice('Settings saved.');render();}catch(e){notice(e.message,true);}};
$('copy-url').onclick=async()=>{try{await navigator.clipboard.writeText($('overlay-url').textContent);notice('Address copied. Paste it into an OBS Browser source, 1920 × 1080.');}catch{notice('Select the address and copy it.',true);}};
const fit=()=>{const f=$('frame');$('preview').style.transform='scale('+(f.clientWidth/1280)+')';};new ResizeObserver(fit).observe($('frame'));fit();
load();setInterval(()=>{if(!document.hidden)load();},1500);
})();
