/* Voyager Control > Stream deck (2.20.50). One page for everything pressed during a stream: chat connection, start-of-stream
   resets, the Dreadnought, the Versus arena, on-stream panels, celebrations and tests, plus live status and links. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',log=[];
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body,method){
  if(!token)token=(await(await fetch('/api/admin',{cache:'no-store'})).json()).token;
  const r=await fetch(path,{method:method||(body?'POST':'GET'),cache:'no-store',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const when=t=>new Date(t).toLocaleTimeString([], {hour:'numeric',minute:'2-digit',second:'2-digit'});
function record(label,ok,message){log.unshift({at:Date.now(),label,ok,message});log=log.slice(0,40);const h=$('log');h.textContent='';for(const e of log){const li=el('li',e.ok?'':'bad');li.append(el('time','',when(e.at)),el('b','',e.label),el('span','',e.message||''));h.append(li);}}
async function act(button,label,fn,done){
  button.disabled=true;try{const r=await fn();const msg=typeof done==='function'?done(r):done||r?.message||'Done.';record(label,true,msg);notice(label+' · '+msg);}
  catch(e){record(label,false,e.message);notice(label+' · '+e.message,true);}
  finally{button.disabled=false;setTimeout(refresh,700);}
}
let s={};
function stat(key,label,state,value,sub){let d=$('status').querySelector(`[data-key="${key}"]`);if(!d){d=el('div','sd-st');d.dataset.key=key;d.append(el('small','',label),el('b'),el('span'));$('status').append(d);}d.dataset.state=state;const b=d.querySelector('b');b.textContent='';b.append(el('i'),document.createTextNode(value));d.querySelector('span').textContent=sub||'';}
const PHASE={lobby:'Lobby',calling:'Challenger call',countdown:'Countdown',battle:'Battle',result:'Result'};
function render(){
  const c=s.state?.connection||{},g=s.state?.game||{},b=s.boss?.live||{},cg=s.community?.season||{},fx=s.sb?.goalFx||{},site=s.site?.upload||{},lo=s.lo?.config||{};
  stat('sb','Streamer.bot',c.connected?'ok':/Connecting|retrying/.test(c.message||'')?'warn':'off',c.connected?'Connected':'Disconnected',c.message||'');
  stat('boss','Dreadnought',b.phase==='battle'?'warn':b.phase==='lobby'?'ok':'off',b.phase==='idle'||!b.phase?'Idle':b.phase==='lobby'?'Boarding':b.phase==='battle'?'Fighting':b.phase==='result'?'Result':b.phase,b.phase==='battle'||b.phase==='lobby'?(b.pilots||0)+' pilots · '+Math.max(0,Math.ceil(((b.phase==='lobby'?b.lobbyEndsAt:b.endsAt)-Date.now())/1000))+' s left':'');
  stat('vs','Voyager Versus',g.paused?'off':g.phase&&g.phase!=='lobby'?'warn':'ok',g.paused?'Paused':PHASE[g.phase]||g.phase||'—',(g.open===false?'Entries closed':'Entries open')+(g.queue?.length?' · '+g.queue.length+' waiting':''));
  stat('goal','Community goal',cg.active?'ok':'off',cg.active?cg.name:'None running',cg.active&&cg.endsAt?'due '+new Date(cg.endsAt).toLocaleDateString('en-AU',{day:'numeric',month:'short'}):'Start one on Community goals');
  stat('fx','Goal FX overlay',fx.polling?'ok':'warn',fx.polling?'Open in OBS':'Not polling',fx.polling?'Ready for celebrations':'Refresh the OBS source');
  stat('site','voyagercommand.com',site.enabled?(site.lastError?'off':'ok'):'warn',site.enabled?(site.lastError?'Last push failed':'Publishing'):'Publishing off',site.lastOkAt?'last push '+when(site.lastOkAt):'');
  $('sb-pill').dataset.state=c.connected?'ok':'error';$('sb-pill').textContent=c.connected?'Connected':'Disconnected';$('sb-text').textContent=c.message||'';$('connect').hidden=!!c.connected;$('disconnect').hidden=!c.connected;
  const bp=$('boss-pill');bp.dataset.state=b.phase==='battle'?'error':b.phase==='lobby'?'ok':'wait';bp.textContent=b.phase==='idle'||!b.phase?'Idle':b.phase==='lobby'?'Boarding':b.phase==='battle'?'Fighting':b.phase;
  $('boss-call').disabled=!!b.phase&&b.phase!=='idle'&&b.phase!=='result'&&b.phase!=='done';$('boss-start').disabled=b.phase!=='lobby';$('boss-cancel').disabled=!(b.phase==='lobby'||b.phase==='battle');
  $('boss-text').textContent=b.phase==='lobby'?(b.pilots||0)+' pilots boarded · fight starts in '+Math.max(0,Math.ceil((b.lobbyEndsAt-Date.now())/1000))+' s':b.phase==='battle'?(b.hp||0).toLocaleString()+' / '+(b.maxHp||0).toLocaleString()+' hull · '+Math.max(0,Math.ceil((b.endsAt-Date.now())/1000))+' s left':'Call it when chat is ready. Settings are on the Dreadnought page.';
  const vp=$('vs-pill');vp.dataset.state=g.paused?'error':g.phase&&g.phase!=='lobby'?'ok':'wait';vp.textContent=g.paused?'Paused':PHASE[g.phase]||'—';
  $('vs-text').textContent=(g.open===false?'Entries are closed. ':'Entries are open. ')+(g.queue?.length?g.queue.length+' waiting. ':'')+'Per stream: one initiator and one challenger each.';
  const p=s.community?.panel;if(p){$('panel-pill').dataset.state=p.visible?'ok':'wait';$('panel-pill').textContent=p.visible?'On stream · '+(p.config?.kind||''):'Hidden';if(document.activeElement!==$('panel-kind')&&p.config?.kind)$('panel-kind').value=p.config.kind;}
  $('lo-pill').dataset.state=lo.visible===false?'wait':'ok';$('lo-pill').textContent=lo.visible===false?'Hidden':'Shown';
  $('fx-pill').dataset.state=fx.polling?'ok':'wait';$('fx-pill').textContent=fx.polling?'Overlay open':'Overlay not polling';
}
async function refresh(){
  if(!hosted)return;
  const get=async(path,withToken=true)=>{try{return withToken?await api(path):await(await fetch(path,{cache:'no-store'})).json();}catch{return null;}};
  const [state,boss,community,sb,site,lo,mo,eng]=await Promise.all([get('/api/state',false),get('/api/boss'),get('/api/community'),get('/api/streamerbot'),get('/api/public-site'),get('/api/live-overlay',false),get('/api/moments'),get('/api/engage')]);
  s={state,boss,community,sb,site,lo,mo,eng};render();renderMoments();renderSources();
}
// ---- buttons ----
$('connect').onclick=()=>act($('connect'),'Connect chat',()=>api('/api/control',{type:'connect_saved'}));
$('disconnect').onclick=()=>act($('disconnect'),'Disconnect',()=>api('/api/control',{type:'disconnect'}),'Disconnected.');
$('new-stream').onclick=()=>{if(!confirm('Reset the per-stream counters now? !report muster, squadrons, arrival cards and Versus stream entries start again from zero.'))return;
  act($('new-stream'),'New stream',async()=>{await api('/api/engage/stream/new',{});const r=await api('/api/control',{type:'new_stream',value:{confirm:true}}).catch(e=>({message:'Chat counters reset. Versus: '+e.message}));return r;},r=>r?.message||'Counters reset.');};
$('goals-read').onclick=()=>act($('goals-read'),'Read goals from OBS',()=>api('/api/streamerbot/run',{key:'goals.read'}));
$('points-scan').onclick=()=>act($('points-scan'),'Scan tier groups',()=>api('/api/streamerbot/run',{key:'points.scan'}));
$('publish').onclick=()=>act($('publish'),'Publish website',()=>api('/api/public-site/publish-now',{}));
$('boss-call').onclick=()=>act($('boss-call'),'Call the Dreadnought',()=>api('/api/boss/control',{action:'call'}),'Boarding has begun.');
$('boss-start').onclick=()=>act($('boss-start'),'Start the fight',()=>api('/api/boss/control',{action:'start'}),'Fight started.');
$('boss-cancel').onclick=()=>{if(!confirm('Cancel the Dreadnought fight? Nobody is paid.'))return;act($('boss-cancel'),'Cancel the Dreadnought',()=>api('/api/boss/control',{action:'cancel'}),'Cancelled.');};
$('vs-open').onclick=()=>act($('vs-open'),'Versus entries',()=>api('/api/control',{type:'open'}),()=>'Toggled.');
$('vs-pause').onclick=()=>act($('vs-pause'),'Versus pause',()=>api('/api/control',{type:'pause'}),()=>'Toggled.');
$('vs-clear').onclick=()=>{if(!confirm('Clear the waiting challenger call and queue?'))return;act($('vs-clear'),'Clear the Versus call',()=>api('/api/control',{type:'clear'}),'Cleared.');};
$('vs-ready').onclick=()=>act($('vs-ready'),'Versus ready alert',()=>api('/api/control',{type:'ready_alert_test'}),'Playing in OBS.');
$('panel-show').onclick=()=>act($('panel-show'),'Community panel',()=>api('/api/community/panel',{config:{...(s.community?.panel?.config||{}),kind:$('panel-kind').value},visible:true}),'On stream.');
$('panel-hide').onclick=()=>act($('panel-hide'),'Community panel',()=>api('/api/community/panel',{visible:false}),'Hidden.');
for(const [id,seconds,msg] of [['sq-show',60,'On stream for 60 s.'],['sq-stay',3600,'On stream until hidden.'],['sq-hide',0,'Hidden.']])$(id).onclick=()=>act($(id),'Squadron panel',()=>api('/api/engage/panel',{seconds}),msg);
// 2.20.75: say whether the OBS source behind each panel is loaded (it polls the host every few seconds while open in OBS).
function renderSources(){const sq=s.eng?.squadrons;if(sq&&$('sq-pill')){$('sq-pill').dataset.state=sq.panel?'ok':'wait';$('sq-pill').textContent=sq.panel?'On stream'+(sq.panelUntil?' · '+Math.max(0,Math.round((sq.panelUntil-Date.now())/1000))+' s':''):'Hidden';}
  const line=(id,at,name,page)=>{const e=$(id);if(!e)return;const ok=at&&Date.now()-at<20000;e.textContent=ok?'':name+' source is not loaded in OBS: add a Browser source (1920 × 1080, Local file unticked) with '+location.origin+page+', or refresh its cache if it is there.';e.hidden=!!ok;};
  line('panel-src',s.community?.sourceAt,'The Community panel','/control/Voyager_Community_Panel.html');line('sq-src',s.eng?.sourceAt,'The Chat engagement (squadron panel)','/engage.html');}
// On-screen moments (2.20.64): one button per element, pressed = on stream.
function renderMoments(){const box=$('moments');if(!box)return;const m=s.mo;box.replaceChildren();if(!m){box.append(Object.assign(document.createElement('span'),{className:'st-hint',textContent:'Update Voyager to 2.20.64 for on-screen moments.'}));return;}
  for(const [k,name] of Object.entries(m.elements)){const b=document.createElement('button');b.type='button';const on=!!m.settings.elements[k];b.className=on?'primary':'';b.setAttribute('aria-pressed',String(on));b.innerHTML='<span></span><small></small>';b.firstChild.textContent=name;b.lastChild.textContent=on?'On stream · press to hide':'Hidden · press to show';
    b.onclick=()=>act(b,name,async()=>{s.mo={...s.mo,...await api('/api/moments/element',{key:k,on:!on})};renderMoments();},on?'Hidden.':'On stream.');box.append(b);}}
$('lo-show').onclick=()=>act($('lo-show'),'Live stats strip',()=>api('/api/live-overlay/settings',{visible:true}),'Shown.');
$('lo-hide').onclick=()=>act($('lo-hide'),'Live stats strip',()=>api('/api/live-overlay/settings',{visible:false}),'Hidden.');
for(const t of ['silver','gold','platinum'])$('fx-'+t).onclick=()=>act($('fx-'+t),'Goal FX · '+t,()=>api('/api/goalfx/control',{kind:'play',tier:t}),'Queued for the overlay.');
$('fx-rearm').onclick=()=>act($('fx-rearm'),'Goal FX re-arm',()=>api('/api/goalfx/control',{kind:'rearm'}),'Re-armed.');
$('card-preview').onclick=()=>act($('card-preview'),'Card preview',()=>api('/api/cards/preview',{tier:'gold',side:'front',tierUp:true}),'Showing on the card overlay.');
$('fleet-test').onclick=()=>act($('fleet-test'),'Test support alert',()=>api('/api/streamerbot/run',{key:'fleet.test',stage:'1',name:'Nova Pilot',platform:'twitch'}));
// ---- links ----
const LINKS=[['Giveaway_Control.html','Giveaways','Draw winners, pools, ticketed giveaways'],['Voyager_Command_Center.html?page=live','Live dashboard','Audiences, live chat, leaderboards'],['Voyager_Dreadnought.html','Dreadnought settings','Hull, damage, speed goals, overlay'],['Voyager_Versus.html','Voyager Versus','Full arena controls and hangar'],
 ['Voyager_Fleet_Control.html','Support alerts','Fleet alerts, Lumia, tests'],['Voyager_Engage.html','Chat engagement','!report, quiz, squadrons, arrivals'],['Voyager_Seasons.html','Community goals','Start or end a campaign, Christmas panel'],['Voyager_Membership_Cards.html','Membership cards','Card settings and previews'],
 ['Voyager_Streamerbot.html','Streamer.bot actions','Run any action, Goal FX, tests'],['Voyager_Banner_Control.html','Stream banner','Ticker messages'],['Voyager_Missions.html','Missions & points owed','Pay mission and goal rewards'],['Voyager_Public_Site.html','Public website','Publishing and feed status']];
for(const [href,label,sub] of LINKS){const a=el('a');a.href=href;a.append(el('b','',label),el('small','',sub));$('links').append(a);}
$('refresh').onclick=refresh;
if(!hosted){$('not-hosted').hidden=false;}else{refresh();setInterval(()=>{if(!document.hidden)refresh();},5000);}
})();
