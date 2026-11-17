/* Voyager Control > Viewer requests (2.24.0). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false,options=null;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});};
function renderOptions(){const box=$('options');box.textContent='';
  options.forEach((o,i)=>{const row=el('div','rq-opt');const t=el('input');t.type='text';t.value=o.label;t.maxLength=30;t.placeholder='e.g. Bridge Quiz';t.oninput=()=>{o.label=t.value;editing=true;};
    const on=el('label');const c=el('input');c.type='checkbox';c.checked=o.enabled!==false;c.onchange=()=>{o.enabled=c.checked;editing=true;};on.append(c,'on');
    const tst=el('button','link','Test');tst.type='button';tst.onclick=async()=>{try{view=await api('/api/requests/test',{key:o.key});notice('Test alert sent to the overlay.');render();}catch(e){notice(e.message,true);}};tst.disabled=!o.key;
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{options.splice(i,1);editing=true;renderOptions();};row.append(t,on,tst,del);box.append(row);});}
function render(){if(!view)return;const s=view.settings;
  if(!editing){const f=$('settings-form').elements;for(const k of ['enabled','onlyLive','chat','overlay','sound','appAlert'])f[k].checked=!!s[k];f.overlaySeconds.value=s.overlaySeconds;options=structuredClone(s.options);renderOptions();}
  const op=$('open-pill');op.dataset.state=view.open?'ok':'wait';op.textContent=!s.enabled?'Off':view.open?'Open to viewers':'Closed · stream not live';
  const lp=$('link-pill'),st=view.status||{};lp.dataset.state=st.ok?'ok':st.ok===false?'error':'wait';lp.textContent=st.ok?'Website connected':st.ok===false?'Website not reachable':'Waiting';
  $('link-note').textContent=(st.message||'')+(view.siteUrl?' · '+view.siteUrl:' — set your web address under Public website.');
  $('overlay-url').textContent=location.origin+'/control/Voyager_Request_Overlay.html';
  // 2.30.0 one-click switches
  const sw=$('switches');sw.textContent='';const all=view.all||[];
  for(const o of all){const b=el('button','rq-switch');b.type='button';b.setAttribute('aria-pressed',String(!!o.enabled));b.append(el('span','',o.label),el('i'),el('small','',(o.enabled?'On':'Off')+' · '+o.count+' asking this stream'));
    b.onclick=async()=>{try{view=await api('/api/requests/option',{key:o.key,enabled:!o.enabled});if(options){const mine=options.find(x=>x.key===o.key);if(mine)mine.enabled=!o.enabled;renderOptions();}notice(o.label+(o.enabled?' switched off.':' switched on.')+' The website follows within a minute.');render();}catch(e){notice(e.message,true);}};sw.append(b);}
  const onN=all.filter(o=>o.enabled).length,onp=$('on-pill');onp.dataset.state=onN?'ok':'wait';onp.textContent=onN+' of '+all.length+' on';
  renderLog();
  const t=$('tally');t.textContent='';for(const x of view.tally){const sp=el('span','',x.label);sp.append(el('b','',String(x.count)));t.append(sp);}
  const l=$('list');l.textContent='';if(!view.items.length)l.append(el('li','','No requests yet this stream.'));
  for(const i of view.items){const li=el('li');li.dataset.status=i.status;const a=el('div');a.append(el('b','',i.name+' → '+i.label),el('small','',ago(i.at)+(i.test?' · test':'')+(i.status!=='new'?' · '+i.status:'')));
    const b=el('div','rq-row');for(const [label,status] of i.status==='new'?[['Done','done'],['Dismiss','dismissed']]:[['Reopen','new']]){const btn=el('button','',label);btn.type='button';btn.onclick=async()=>{try{view=await api('/api/requests/mark',{id:i.id,status});render();}catch(e){notice(e.message,true);}};b.append(btn);}
    li.append(a,b);l.append(li);}
}
const when=t=>new Date(t).toLocaleString([],{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
function renderLog(){const q=$('log-q').value.trim().toLowerCase(),log=view.log||{rows:[],total:0},rows=log.rows.filter(r=>!q||r.name.toLowerCase().includes(q)||r.label.toLowerCase().includes(q));
  const body=$('log');body.textContent='';for(const r of rows){const tr=el('tr');const st=el('td','',r.status==='new'?'waiting':r.status);st.dataset.s=r.status;tr.append(el('td','',when(r.at)),el('td','',r.name),el('td','',r.label),st);body.append(tr);}
  if(!rows.length){const tr=el('tr'),td=el('td','',log.total?'Nothing matches that filter.':'No requests logged yet.');td.colSpan=4;tr.append(td);body.append(tr);}
  const lp=$('log-pill');lp.dataset.state=log.total?'ok':'wait';lp.textContent=log.total+(log.total>log.rows.length?' · newest '+log.rows.length+' shown':'')+' logged';}
$('log-q').oninput=()=>{if(view)renderLog();};
$('log-save').onclick=async()=>{try{const d=await api('/api/requests/log');const a=el('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+d.csv],{type:'text/csv'}));a.download='voyager-requests-'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);notice('Saved '+d.total+' requests.');}catch(e){notice(e.message,true);}};
$('log-clear').onclick=async()=>{if(!confirm('Delete the log of earlier streams? This stream\'s requests stay.'))return;try{view=await api('/api/requests/log/clear',{});notice('Earlier streams deleted from the log.');render();}catch(e){notice(e.message,true);}};
async function load(){try{view=await api('/api/requests');render();}catch(e){notice(e.message,true);}}
$('settings-form').addEventListener('input',()=>{editing=true;});
$('opt-add').onclick=()=>{options.push({key:'',label:'',enabled:true});editing=true;renderOptions();$('options').querySelector('.rq-opt:last-child input')?.focus();};
$('save').onclick=async()=>{const f=$('settings-form').elements;try{view=await api('/api/requests/settings',{enabled:f.enabled.checked,onlyLive:f.onlyLive.checked,chat:f.chat.checked,overlay:f.overlay.checked,sound:f.sound.checked,appAlert:f.appAlert.checked,overlaySeconds:Number(f.overlaySeconds.value),options});editing=false;notice('Saved. The website picks it up within a minute.');render();}catch(e){notice(e.message,true);}};
$('test').onclick=async()=>{try{view=await api('/api/requests/test',{});notice('Test alert sent to the overlay (tests are not announced in chat).');render();}catch(e){notice(e.message,true);}};
$('clear').onclick=async()=>{if(!confirm('Clear this stream\'s requests? Everyone can ask again; the entries stay in the log.'))return;try{view=await api('/api/requests/clear',{});render();}catch(e){notice(e.message,true);}};
$('check').onclick=async()=>{try{view=await api('/api/requests/check',{});notice(view.status?.message||'Checked.',view.status?.ok===false);render();}catch(e){notice(e.message,true);}};
$('copy-url').onclick=async()=>{try{await navigator.clipboard.writeText($('overlay-url').textContent);notice('Address copied.');}catch{notice('Select the address and copy it.',true);}};
if(!hosted){$('not-hosted').hidden=false;}else{load();setInterval(load,5000);}
})();
