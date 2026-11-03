/* Voyager Control > Streamer.bot actions (2.20.41): run Voyager's actions, Goal FX plays and any Streamer.bot action from Voyager. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,filter='';const inputs={};
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const when=t=>new Date(t).toLocaleTimeString([], {hour:'numeric',minute:'2-digit',second:'2-digit'});
const STATE={found:'',missing:'Not in Streamer.bot',disabled:'Disabled in Streamer.bot',duplicate:'More than one action with this name',offline:'Streamer.bot offline'};
const PLATFORM_OPTS=[['','All platforms'],['twitch','Twitch only'],['kick','Kick only'],['youtube','YouTube only']];
function field(key,name){
  const k=key+'.'+name;inputs[k]??='';
  let i;
  if(name==='platform'){i=el('select');for(const [v,l] of PLATFORM_OPTS){const o=el('option','',l);o.value=v;i.append(o);}i.value=inputs[k]||(key==='fleet.test'?'twitch':'');}
  else if(name==='stage'){i=el('select');for(const [v,l] of [[1,'1 · Follow'],[2,'2 · Sub'],[3,'3 · Gift sub'],[4,'4 · Resub'],[5,'5 · Bits'],[6,'6 · Raid']]){const o=el('option','',l);o.value=v;i.append(o);}i.value=inputs[k]||'1';}
  else if(name==='amount'||name==='months'){i=el('input');i.type='number';i.min=1;i.max=name==='amount'?1000000:1200;i.value=inputs[k]||'1';i.title=name==='amount'?'Amount (gifts, bits or raiders)':'Months (resubs)';i.placeholder=name;}
  else{i=el('input');i.type='text';i.maxLength=name==='name'?80:450;i.placeholder=name==='name'?'Viewer name shown in the alert (test)':'Message to post (leave empty for a check message)';i.value=inputs[k];}
  i.setAttribute('aria-label',name);i.oninput=()=>{inputs[k]=i.value;};return i;
}
async function run(body,button){
  button.disabled=true;const was=button.textContent;button.textContent='Sending…';
  try{view={...view,...await api('/api/streamerbot/run',body)};const last=view.history[0];notice((last.ok?'':'Not run: ')+last.action+' · '+last.message,!last.ok);render();}
  catch(e){notice(e.message,true);}
  finally{button.disabled=false;button.textContent=was;}
}
function renderPresets(){
  const box=$('presets');if(box.contains(document.activeElement))return;box.textContent='';let group='';
  for(const p of view.presets||[]){
    if(p.group!==group){group=p.group;box.append(el('div','sb-group',group));}
    const li=el('li');li.dataset.state=p.state;const text=el('div');text.append(el('b','',p.label));
    const sub=el('small','',p.note+(STATE[p.state]?' · '+STATE[p.state]:''));text.append(sub);
    const act=el('div','act');act.append(el('code','',p.action));
    const b=el('button',p.state==='found'?'primary':'','Run');b.type='button';b.disabled=p.state!=='found';
    b.onclick=()=>{const body={key:p.key};for(const n of p.input)body[n]=inputs[p.key+'.'+n]??'';if(p.key==='fleet.test'){body.stage=body.stage||'1';body.platform=body.platform||'twitch';}run(body,b);};
    act.append(b);li.append(text,act);
    if(p.input.length){const row=el('div','in');for(const n of p.input)row.append(field(p.key,n));li.append(row);}
    box.append(li);
  }
}
function renderAll(){
  const box=$('all');box.textContent='';const q=filter.trim().toLowerCase();
  const list=(view.actions||[]).filter(a=>a.enabled&&(!q||a.name.toLowerCase().includes(q)||a.group.toLowerCase().includes(q)));
  $('all-pill').textContent=list.length+(q?' shown':'');$('all-pill').dataset.state=view.connected?'ok':'wait';
  let group=null;
  for(const a of list){if(a.group!==group){group=a.group;box.append(el('div','sb-group',group||'No group'));}
    const li=el('li');const text=el('div');text.append(el('b','',a.name));text.append(el('small','',a.subactions+' sub-action'+(a.subactions===1?'':'s')));
    const b=el('button','','Run');b.type='button';b.onclick=()=>run({id:a.id,name:a.name},b);
    const act=el('div','act');act.append(b);li.append(text,act);box.append(li);}
  if(!list.length)box.append(el('li','',view.connected?'No actions match.':'Connect Voyager to Streamer.bot (Settings) to list its actions.'));
}
function render(){
  if(!view)return;
  const pill=$('conn-pill');pill.dataset.state=view.connected?'ok':'error';pill.textContent=view.connected?'Connected to Streamer.bot':'Streamer.bot offline';
  const cl=$('checklist');cl.textContent='';
  const found=(view.presets||[]).filter(p=>p.state==='found').length,total=(view.presets||[]).length,missing=(view.presets||[]).filter(p=>p.state!=='found'&&p.state!=='offline').map(p=>p.action);
  for(const [ok,t] of [[view.connected,view.connected?'Voyager is connected to Streamer.bot':'Voyager is not connected to Streamer.bot (Settings › Connection)'],
    [view.connected?(view.actions||[]).length>0:null,view.connected?(view.actions||[]).length+' actions listed by Streamer.bot':'Actions appear once connected'],
    [view.connected?found===total:null,view.connected?found+' of '+total+' Voyager actions found'+(missing.length?' · check: '+[...new Set(missing)].join(', '):''):'Voyager actions are checked once connected']])cl.append(el('li',ok===null?'info':ok?'ok':'',t));
  if(view.error)cl.append(el('li','',view.error));
  const g=$('goal-pill'),gf=view.goalFx||{};g.dataset.state=gf.polling?'ok':'wait';g.textContent=gf.polling?'Overlay open in OBS':gf.pollAt?'Overlay last seen '+when(gf.pollAt):'Overlay not open';
  $('goal-help').hidden=!!gf.polling;
  renderPresets();renderAll();
  const h=$('history');h.textContent='';
  for(const e of view.history||[]){const li=el('li',e.ok?'':'bad');li.append(el('time','',when(e.at)),el('b','',e.label),el('i','',e.action+' · '+e.message));h.append(li);}
  if(!(view.history||[]).length)h.append(el('li','','Nothing run yet this session.'));
}
async function load(refresh){try{view=await api('/api/streamerbot'+(refresh?'?refresh=1':''));render();}catch(e){notice(e.message,true);}}
for(const b of document.querySelectorAll('[data-goal]'))b.onclick=async()=>{b.disabled=true;try{view={...view,...await api('/api/goalfx/control',{kind:'play',tier:b.dataset.goal})};notice('Queued the '+b.dataset.goal+' celebration for the Goal FX overlay.');render();}catch(e){notice(e.message,true);}finally{b.disabled=false;}};
$('goal-rearm').onclick=async()=>{try{view={...view,...await api('/api/goalfx/control',{kind:'rearm'})};notice('Goal FX re-armed: the next real crossing of each goal plays again.');render();}catch(e){notice(e.message,true);}};
$('refresh').onclick=()=>load(true);
$('filter').oninput=()=>{filter=$('filter').value;renderAll();};
if(!hosted){$('not-hosted').hidden=false;}else{load(true);setInterval(()=>load(false),15000);}
})();
