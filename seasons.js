/* Voyager Control > Seasons (2.13). Standings, season settings and the Hall of Fame (data from the Voyager host). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},DAY=86400000;
let token='',view=null,editing=false,goals=null,goalsEditing=false;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const date=t=>new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function render(){
  const s=view.season,now=Date.now(),week=Math.min(s.weeks,Math.max(1,Math.floor((now-s.startedAt)/(7*DAY))+1));
  $('season-title').textContent=s.name;$('season-dates').textContent=date(s.startedAt)+' – '+date(s.endsAt);
  $('week-num').textContent='Week '+week;$('week-of').textContent='of '+s.weeks+' · '+Math.max(0,Math.ceil((s.endsAt-now)/DAY))+' days left';
  $('season-bar').style.width=Math.min(100,Math.max(0,(now-s.startedAt)/(s.endsAt-s.startedAt)*100)).toFixed(1)+'%';
  const f=$('season-form').elements;if(!editing){f.name.value=s.name;f.weeks.value=s.weeks;}
  const tb=$('standings');tb.textContent='';
  for(const r of view.standings){const tr=el('tr');tr.append(el('td','cs-rank',String(r.rank)),el('td','',r.name),el('td','',PLATFORM[r.platform]||r.platform),el('td','num',r.points.toLocaleString()),el('td','num',r.support?String(r.support):'–'),el('td','num cs-score',(r.score??r.points).toLocaleString()),el('td','num',r.wins?String(r.wins):'–'));tb.append(tr);}
  if(!view.standings.length){const tr=el('tr');const td=el('td','cm-empty','Nobody has earned points this season yet.');td.colSpan=7;tr.append(td);tb.append(tr);}
  renderGoals();
  $('standings-note').textContent=view.members+' members tracked';
  const hall=$('hall');hall.textContent='';
  for(const h of view.hall){const li=el('li');li.append(el('span','eyebrow',h.name),el('b','',h.champion?h.champion.name+' · '+h.champion.points.toLocaleString()+' pts':'No champion'),el('span','st-hint',(h.topPilot?'Top pilot: '+h.topPilot.name+' ('+h.topPilot.wins+' wins) · ':'')+'ended '+date(h.endedAt)));hall.append(li);}
  if(!view.hall.length)hall.append(el('li','cm-empty','Champions appear here when a season ends.'));
}
// Season sub goals (2.15)
function renderGoals(){
  if(!goalsEditing||!goals)goals=(view.goals||[]).map(({id,title,metric,platform,target,reward})=>({id,title,metric,platform,target,reward}));
  const live=Object.fromEntries((view.goals||[]).map(g=>[g.id,g])),box=$('goals');box.textContent='';
  const opts=(sel,map,val)=>{for(const [k,label] of Object.entries(map||{})){const o=el('option','',label);o.value=k;o.selected=k===val;sel.append(o);}return sel;};
  goals.forEach((g,i)=>{
    const card=el('article','cs-goal'),lv=live[g.id];
    const head=el('div','cs-goal-head');
    const title=el('input','cm-title');title.value=g.title;title.maxLength=40;title.setAttribute('aria-label','Goal name');title.oninput=()=>{g.title=title.value;};
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{goals.splice(i,1);goalsEditing=true;renderGoals();};
    head.append(title,del);card.append(head);
    const f=el('div','cm-fields cs-goal-fields');
    const metric=opts(el('select'),view.goalMetrics,g.metric);metric.onchange=()=>{g.metric=metric.value;};
    const plat=opts(el('select'),view.platforms,g.platform);plat.onchange=()=>{g.platform=plat.value;};
    const target=el('input');target.type='number';target.min='1';target.max='100000';target.value=g.target;target.oninput=()=>{g.target=Number(target.value);};
    const reward=el('input');reward.type='number';reward.min='0';reward.max='1000000';reward.value=g.reward;reward.oninput=()=>{g.reward=Number(reward.value);};
    for(const [label,input] of [['Counts',metric],['Platform',plat],['Community target',target],['Reward each helper (points)',reward]]){const l=el('label','',label);l.append(input);f.append(l);}
    card.append(f);
    if(lv){
      const bar=el('div','cm-bar big');const fill=el('i');fill.style.width=Math.min(100,lv.total/lv.target*100).toFixed(1)+'%';bar.append(fill);
      card.append(el('div','cs-goal-num',lv.reached?'✓ Reached · '+lv.total.toLocaleString()+' / '+lv.target.toLocaleString():lv.total.toLocaleString()+' / '+lv.target.toLocaleString()),bar,
        el('p','st-hint',lv.helpers.length?'Helping: '+lv.helpers.slice(0,6).map(h=>h.name+' ('+h.count+')').join(', ')+(lv.helpers.length>6?'…':''):'Nobody yet this season.'));
    }else card.append(el('p','st-hint','Save to start tracking this goal.'));
    box.append(card);
  });
  if(!goals.length)box.append(el('p','cm-empty','No sub goals this season. Add one to give the community something to aim for.'));
  $('goal-add').disabled=goals.length>=4;
  const b=$('support-bonus');if(document.activeElement!==b)b.value=view.supportBonus??100;
  const sup=view.support||{};
  $('support-note').textContent=sup.updatedAt?sup.tracked+' recent subscribers and gifters tracked · last read '+new Date(sup.updatedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+'.':'Waiting for subscriber data: install Voyager - Community Tracker, update Voyager - Stream Stats to v6 and keep Voyager running.';
}
$('goals').addEventListener('input',()=>{goalsEditing=true;});$('goals').addEventListener('change',()=>{goalsEditing=true;});
$('goal-add').onclick=()=>{goals.push({id:'g'+Date.now().toString(36),title:'New goal',metric:'support',platform:'all',target:20,reward:200});goalsEditing=true;renderGoals();};
$('goals-save').onclick=async()=>{try{view=await api('/api/community/season',{goals,supportBonus:Number($('support-bonus').value)});goalsEditing=false;notice('Season goals saved.');render();}catch(e){notice(e.message,true);}};
async function load(){try{view=await api('/api/community');render();renderPanel();}catch(e){notice(e.message,true);}}
const form=$('season-form');form.addEventListener('focusin',()=>{editing=true;});
form.onsubmit=async e=>{e.preventDefault();try{view=await api('/api/community/season',{name:form.elements.name.value,weeks:Number(form.elements.weeks.value)});editing=false;notice('Season saved.');render();}catch(err){notice(err.message,true);}};
$('end-season').onclick=async()=>{if(!view||!confirm('End '+view.season.name+' now? Its top five go into the Hall of Fame and the next season starts from zero. Points balances are not changed.'))return;try{view=await api('/api/community/season',{action:'end'});notice('Season ended. Welcome to '+view.season.name+'.');render();}catch(e){notice(e.message,true);}};
// On-stream panel (2.14)
const pf=$('panel-form'),FIELDS=['kind','limit','duration','title','top','right','width','opacity','speed'];let panelEditing=false,previewReady=false;
pf.addEventListener('focusin',()=>{panelEditing=true;});pf.addEventListener('input',()=>sendPreview());
$('panel-url').textContent=location.origin+location.pathname.replace(/[^/]*$/,'')+'Voyager_Community_Panel.html';
$('panel-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('panel-url').textContent);$('panel-copy').textContent='Copied';setTimeout(()=>$('panel-copy').textContent='Copy',1500);}catch{}};
function formConfig(){const c={};for(const k of FIELDS){const v=pf.elements[k].value;c[k]=k==='kind'||k==='title'?v:Number(v);}return c;}
function renderPanel(){
  const p=view.panel;if(!p)return;
  if(!panelEditing)for(const k of FIELDS)pf.elements[k].value=p.config[k];
  const st=$('panel-state');st.dataset.state=p.visible?'ok':'wait';st.textContent=p.visible?'On stream'+(p.expiresAt?' · hides at '+new Date(p.expiresAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit',second:'2-digit'}):''):'Hidden';
  sendPreview();
}
async function sendPreview(){
  if(!previewReady)return;
  let data={};try{data=await(await fetch('/api/community/overlay',{cache:'no-store'})).json();}catch{}
  $('panel-preview').contentWindow?.postMessage({type:'voyager.community.preview',config:formConfig(),data},'*');
}
addEventListener('message',e=>{if(e.source===$('panel-preview').contentWindow&&e.data?.type==='voyager.community.preview.ready'){previewReady=true;sendPreview();}});
async function panel(body){try{const r=await api('/api/community/panel',body);view.panel=r.panel;panelEditing=false;renderPanel();notice(body.visible===true?'Panel is on stream.':body.visible===false?'Panel hidden.':'Panel saved.');}catch(e){notice(e.message,true);}}
pf.onsubmit=e=>{e.preventDefault();panel({config:formConfig()});};
$('panel-show').onclick=()=>panel({config:formConfig(),visible:true});
$('panel-hide').onclick=()=>panel({visible:false});
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!editing&&!goalsEditing)load();},30000);}
})();
