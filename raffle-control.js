/* Voyager Control > Raffle (2.34.0). */
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
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
function fill(){const f=$('settings-form'),s=view.settings;f.minutes.value=s.minutes;f.winners.value=s.winners;f.prize.value=s.prize;f.confirm.checked=s.confirm;f.announce.checked=s.announce;}
function render(){
  const r=view.raffle,s=view.settings,open=r&&(r.phase==='intro'||r.phase==='open'),pill=$('state-pill');
  pill.dataset.state=r?'ok':s.enabled?'wait':'error';pill.textContent=r?(open?'Open · '+mmss(r.endsAt-view.serverAt)+' left':r.phase==='drawing'?'Drawing':'Winners'):s.enabled?'Ready':'Off';
  const pw=$('power');pw.setAttribute('aria-pressed',String(s.enabled));pw.lastChild.textContent=s.enabled?'Raffle on':'Raffle off';
  $('start').hidden=!!r;$('start').disabled=!s.enabled;$('close').hidden=!open;$('cancel').hidden=!r||r.phase==='result';
  const now=$('now');now.textContent='';
  if(!r)now.append(document.createTextNode(s.enabled?'Press Start a raffle. It opens for '+s.minutes+' minute'+(s.minutes===1?'':'s')+'; everyone who types !join gets one ticket with a random number, and '+(s.winners===1?'1 winner is':'up to '+s.winners+' winners are')+' drawn'+(s.prize?' for '+s.prize+' giveaway tickets each.':'.'):'The raffle is switched off. !join does nothing and both OBS sources stay hidden.'));
  else if(open)now.append(el('b','',r.count+' ticket'+(r.count===1?'':'s')+' handed out'),document.createTextNode(' · closes in '+mmss(r.endsAt-view.serverAt)+' · '+(r.want===1?'1 winner':'up to '+r.want+' winners')+(r.prize?' at '+r.prize+' giveaway tickets each':'')));
  else if(r.phase==='drawing')now.append(el('b','','Drawing ticket '+Math.min(r.total,r.winners.length+1)+' of '+r.total),document.createTextNode(' · '+r.count+' in the draw'+(r.winners.length?' · so far: '+r.winners.map(w=>w.name+' #'+w.ticket).join(', '):'')));
  else now.append(el('b','',r.winners.length?'Winners: ':'No entries'),document.createTextNode(r.winners.map(w=>w.name+' #'+w.ticket).join(', ')));
  // entries (or the last raffle's winners)
  const L=$('entries');L.textContent='';const ents=view.entries||[];$('ent-pill').dataset.state=ents.length?'ok':'wait';$('ent-pill').textContent=r?String(r.count):'—';$('ent-title').textContent=r?'Tickets handed out':'Last raffle';
  if(r){if(!ents.length)L.append(el('li','muted','Nobody yet. Viewers type !join in chat.'));const wins=new Set((r.winners||[]).map(w=>w.ticket));
    for(const e of ents){const li=el('li',wins.has(e.ticket)?'win':''),a=el('span');a.append(el('span','rf-tk','#'+e.ticket),document.createTextNode(e.name));li.append(a,el('small','',(wins.has(e.ticket)?'WINNER · ':'')+(PLATFORM[e.platform]||e.platform)));L.append(li);}}
  else{const h=view.history[0];if(!h)L.append(el('li','muted','No raffle has been run yet.'));else{for(const w of h.winners){const li=el('li','win'),a=el('span');a.append(el('span','rf-tk','#'+w.ticket),document.createTextNode(w.name));li.append(a,el('small','','WINNER · '+(PLATFORM[w.platform]||w.platform)));L.append(li);}
      L.append(el('li','muted',h.entries+' ticket'+(h.entries===1?'':'s')+' in that draw · '+ago(h.at)));}}
  // prize status
  const tg=view.ticketGrants||{},ta=view.ticketAction||{},tp=$('tix-pill'),okAction=ta.state==='found';
  tp.dataset.state=!view.connected?'error':okAction?'ok':'error';tp.textContent=!view.connected?'Streamer.bot is not connected':okAction?'Ready to hand out tickets':'Ticket Giveaway action: '+(ta.state||'not found');
  const gl=$('grants');gl.textContent='';const rows=[...(tg.waiting||[]).map(j=>({...j,status:'waiting'})),...(tg.history||[])].filter(j=>String(j.id).startsWith('raffle-')).slice(0,5);
  if(!rows.length)gl.append(el('li','muted','No tickets handed out by a raffle yet.'));
  for(const j of rows){const li=el('li');li.append(el('span','',(j.status==='waiting'?'Waiting to grant ':j.status+': ')+(j.tickets||0)+' tickets across '+(j.accounts||0)+' winner'+(j.accounts===1?'':'s')+(j.message?' · '+j.message:'')),el('small','',ago(j.at)));gl.append(li);}
  const st=$('stats'),x=view.stats;st.textContent='';for(const [k,v] of [['Raffles',x.raffles],['Tickets handed out',x.entries],['Winners',x.winners]]){const d=el('div','rf-st');d.append(el('small','',k),el('b','',String(v)));st.append(d);}
  const H=$('history');H.textContent='';if(!view.history.length)H.append(el('li','muted','Nothing yet.'));
  for(const h of view.history){const li=el('li');li.append(el('span','',h.entries+' entr'+(h.entries===1?'y':'ies')+' · '+(h.winners.length?h.winners.map(w=>w.name+' #'+w.ticket).join(', '):'no winners')+(h.prize&&h.winners.length?' · '+h.prize+' tickets each':'')),el('small','',ago(h.at)));H.append(li);}
  const base='http://127.0.0.1:'+location.port+'/control/';$('overlay-url').textContent=base+'Voyager_Raffle_Overlay.html';$('panel-url').textContent=base+'Voyager_Raffle_Panel.html';
  if(!editing)fill();
}
async function load(){if(!hosted){$('not-hosted').hidden=false;return;}try{view=await api('/api/raffle');render();}catch(e){notice(e.message,true);}}
async function act(path,body,done){try{view={...view,...await api(path,body)};if(done)notice(done);render();}catch(e){notice(e.message,true);}}
$('start').onclick=()=>act('/api/raffle/start',{},'Raffle started. The opening is on screen and chat has been told.');
$('close').onclick=()=>act('/api/raffle/close',{},'Entries closed. Drawing now.');
$('cancel').onclick=()=>act('/api/raffle/cancel',{},'Raffle called off. Nobody wins and nothing is paid.');
$('power').onclick=()=>{const on=!view.settings.enabled;act('/api/raffle/settings',{enabled:on},on?'The raffle is on.':'The raffle is off'+(view.raffle?' and the running raffle was called off':'')+'.');};
$('settings-form').addEventListener('input',()=>{editing=true;});
$('save').onclick=async()=>{const f=$('settings-form');try{view={...view,...await api('/api/raffle/settings',{minutes:Number(f.minutes.value),winners:Number(f.winners.value),prize:Number(f.prize.value),confirm:f.confirm.checked,announce:f.announce.checked})};editing=false;notice('Settings saved. They apply from the next raffle.');render();}catch(e){notice(e.message,true);}};
for(const b of document.querySelectorAll('[data-copy]'))b.onclick=async()=>{try{await navigator.clipboard.writeText($(b.dataset.copy).textContent);notice('Address copied. Paste it into an OBS Browser source.');}catch{notice('Select the address and copy it.',true);}};
const fit=()=>{$('preview').style.transform='scale('+($('frame').clientWidth/1920)+')';$('ppreview').style.transform='scale('+($('pframe').clientWidth/460)+')';};new ResizeObserver(fit).observe($('frame'));new ResizeObserver(fit).observe($('pframe'));fit();
load();setInterval(()=>{if(!document.hidden)load();},1500);
})();
