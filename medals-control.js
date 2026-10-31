/* Voyager Control > Medals (2.18). Grade targets, which medals are on, announcements, the Hall of Honour and recent unlocks. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,draft=null,editing=false;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{if(!t)return 'never';const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':new Date(t).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'});};
function fresh(){draft={off:[...view.settings.off],grades:Object.fromEntries(view.catalogue.filter(m=>m.grades).map(m=>[m.id,[...m.grades]]))};}
function renderCatalogue(){
  const box=$('catalogue');if(editing&&box.childElementCount)return;box.textContent='';
  const groups={};for(const m of view.catalogue)(groups[m.cat]||(groups[m.cat]=[])).push(m);
  for(const [cat,list] of Object.entries(groups)){
    const c=view.categories[cat],h=el('div','md-cat'+(c.featured?' feat':''),c.label);if(c.featured)h.append(el('small','','COUNTS DOUBLE'));box.append(h);
    const t=el('table','md-table'),head=el('tr');
    for(const x of ['Medal','Bronze','Silver','Gold','Legend','Earned','On'])head.append(el('th','',x));t.append(head);
    for(const m of list){
      const on=!draft.off.includes(m.id),tr=el('tr',on?'':'off'),n=el('td','n');
      n.append(el('b','',m.name+(m.kind==='secret'?' (secret)':'')),el('span','',m.desc));tr.append(n);
      if(m.grades)m.grades.forEach((_,i)=>{const td=el('td'),inp=el('input');inp.type='number';inp.min='1';inp.value=draft.grades[m.id][i];
        inp.setAttribute('aria-label',m.name+' '+view.gradeNames[i]+(m.kind==='rank'?' (top N)':' ('+m.unit+')'));inp.title=m.kind==='rank'?'Top '+inp.value:m.unit;
        inp.oninput=()=>{draft.grades[m.id][i]=Number(inp.value);};td.append(inp);tr.append(td);});
      else{const td=el('td','',m.kind==='secret'?'Hidden until someone earns it':'One-off');td.colSpan=4;tr.append(td);}
      tr.append(el('td','md-earned',m.grades?m.earned.join(' · '):String(m.earned[0])));
      const td=el('td'),cb=el('input');cb.type='checkbox';cb.checked=on;cb.setAttribute('aria-label',m.name+' on');
      cb.onchange=()=>{draft.off=cb.checked?draft.off.filter(x=>x!==m.id):[...draft.off,m.id];tr.className=cb.checked?'':'off';};td.append(cb);tr.append(td);t.append(tr);
    }
    box.append(t);
  }
}
function render(){
  if(!view)return;if(!draft)fresh();
  $('s-viewers').textContent=view.stats.viewers.toLocaleString();$('s-with').textContent=view.stats.withMedals.toLocaleString();$('s-medals').textContent=view.stats.medals.toLocaleString();
  const pill=$('state-pill');pill.dataset.state=view.settings.enabled&&view.sources.exportAt?'ok':'wait';
  pill.textContent=!view.settings.enabled?'Off':view.sources.exportAt?'Live · data read '+ago(view.sources.exportAt):'Waiting for Voyager - Medals';
  const f=$('settings').elements;if(document.activeElement?.form!==$('settings')){f.enabled.checked=view.settings.enabled;f.chat.checked=view.settings.chat;f.toastMin.value=String(view.settings.toastMin);}
  renderCatalogue();
  const L=$('leaders');L.textContent='';
  for(const r of view.leaderboard.slice(0,15)){const li=el('li');li.append(el('b','','#'+r.rank),el('span','',r.name+' · '+r.platform),el('span','r','★ '+r.honour+' · '+r.medals+' medals'));L.append(li);}
  if(!view.leaderboard.length)L.append(el('li','','Nobody yet. Medals appear once Voyager has read the first data.'));
  const R=$('recent');R.textContent='';
  for(const a of view.recent.slice(0,15)){const li=el('li'),p=el('span','md-pill md-p'+(a.special?4:a.grade),a.special?'SPECIAL':view.gradeNames[a.grade].toUpperCase());li.append(p,el('b','',a.name),el('span','',a.title),el('span','r',ago(a.at)));R.append(li);}
  if(!view.recent.length)R.append(el('li','','No medals yet.'));
  const a=view.action||{},checks=[
    [view.connected,view.connected?'Streamer.bot is connected':'Connect Streamer.bot (Voyager Versus › Stream setup)'],
    [a.found===true,a.found===true?'Found the "Voyager - Medals" action':a.found===false?'Import Voyager_Medals.cs as an action named exactly "Voyager - Medals"':'Looking for the "Voyager - Medals" action…'],
    [!!view.sources.exportAt,view.sources.exportAt?'Medal data read '+ago(view.sources.exportAt):'Waiting for the first medal data'],
    [view.sources.members>0,view.sources.members>0?view.sources.members.toLocaleString()+' Points Ledger members (points and stream days)':'Points data arrives while the Public website page or Voyager Control is open'],
    [true,'Add the !medals command (Everyone; Twitch, YouTube, Kick) to the action']
  ];
  for(const w of view.sources.warnings||[])checks.push([false,w]);
  const cl=$('checklist');cl.textContent='';for(const [ok,text] of checks)cl.append(el('li',ok?'ok':'',text));
}
async function load(){try{view=await api('/api/medals');render();}catch(e){notice(e.message,true);}}
$('catalogue').addEventListener('focusin',()=>{editing=true;});
$('save').onclick=async()=>{
  try{const f=$('settings').elements;
    view={...view,...await api('/api/medals/settings',{enabled:f.enabled.checked,chat:f.chat.checked,toastMin:Number(f.toastMin.value),off:draft.off,grades:draft.grades})};
    editing=false;fresh();$('catalogue').textContent='';notice('Medals saved.');render();
  }catch(e){notice(e.message,true);}
};
$('preview').onclick=async()=>{try{await api('/api/medals/preview',{});notice('A sample unlock is showing on the OBS source now. Nothing is posted in chat.');}catch(e){notice(e.message,true);}};
$('sync').onclick=async()=>{try{await api('/api/medals/sync',{});notice('Asked Streamer.bot for the latest medal data.');setTimeout(load,1500);}catch(e){notice(e.message,true);}};
$('obs-url').textContent=location.origin+'/medals.html';
$('obs-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('obs-url').textContent);$('obs-copy').textContent='Copied';setTimeout(()=>$('obs-copy').textContent='Copy',1500);}catch{}};
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!document.hidden)load();},5000);}
})();
