/* Voyager Control > Community goals (2.20.48, formerly Seasons). Campaigns you start and end yourself, custom goals with points and due dates, standings and the Hall of Fame (data from the Voyager host). */
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
const date=t=>new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}),when=t=>new Date(t).toLocaleString(undefined,{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'});
// datetime-local <-> timestamp (local time)
const toLocal=t=>{if(!t)return '';const d=new Date(t),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes());};
const fromLocal=v=>{if(!v)return 0;const t=new Date(v).getTime();return Number.isFinite(t)?t:0;};
const defaultDue=()=>{const now=new Date();const y=now.getMonth()===11&&now.getDate()>25?now.getFullYear()+1:now.getFullYear();return new Date(y,11,25,23,59).getTime();};
function render(){
  const s=view.season,now=Date.now(),active=!!s.active;
  {const t=$('twitch-subs'),ts=view.twitchSubs;if(t)t.textContent=ts?'Twitch reports '+ts.value.toLocaleString()+' active subscribers (read '+Math.max(0,Math.round((now-ts.at)/60000))+' min ago).':(view.goals||[]).some(g=>g.metric==='activeSubs')?'No Twitch subscriber count heard yet — Voyager asks Voyager - Stream Stats for it within a minute of connecting; that action needs the Twitch › Get Subscriber Count sub-action above its C#.':'';}
  $('season-title').textContent=active?s.name:'Community goals';
  const st=$('season-state');st.dataset.state=active?'ok':'wait';st.textContent=active?'Running':'Nothing running';
  $('season-dates').textContent=active?date(s.startedAt)+' – '+when(s.endsAt):'';
  $('campaign-h').textContent=active?s.name:'No community goal running';
  $('week-of').textContent=active?Math.max(0,Math.ceil((s.endsAt-now)/DAY))+' days left · due '+when(s.endsAt):'';
  $('season-bar').style.width=active?Math.min(100,Math.max(0,(now-s.startedAt)/(s.endsAt-s.startedAt)*100)).toFixed(1)+'%':'0%';
  const f=$('season-form').elements;
  if(!editing){if(active){f.name.value=s.name;f.startsAt.value=toLocal(s.startedAt);f.endsAt.value=toLocal(s.endsAt);}else{if(!f.name.value)f.name.value='Christmas 2026';if(!f.startsAt.value)f.startsAt.value=toLocal(Date.now());if(!f.endsAt.value)f.endsAt.value=toLocal(defaultDue());}f.supportBonus.value=view.supportBonus??100;}
  $('season-start').hidden=active;$('season-save').hidden=!active;$('end-season').hidden=!active;
  $('campaign-hint').textContent=active?'Running until '+when(s.endsAt)+' · subs and gifts counted from '+date(s.startedAt)+(s.openedAt&&s.openedAt-s.startedAt>3600000?' (points from '+date(s.openedAt)+', when the run was opened)':'')+'. Change anything above or in the goals and press Save changes; End now closes it early: the top five go into the Hall of Fame, reached goals and multiplier bonuses become payable from Missions › Points owed.':'Nothing runs on its own. Set the goals below, give the community goal a name and a due date, then press Start. Standings and every goal count from that moment; it ends on its due date (or when you end it) and the top five go into the Hall of Fame.';
  const tb=$('standings');tb.textContent='';
  for(const r of view.standings){const tr=el('tr');tr.append(el('td','cs-rank',String(r.rank)),el('td','',r.name),el('td','',PLATFORM[r.platform]||r.platform),el('td','num',r.points.toLocaleString()),el('td','num',r.support?String(r.support):'–'),el('td','num cs-score',(r.score??r.points).toLocaleString()),el('td','num',r.wins?String(r.wins):'–'));tb.append(tr);}
  if(!view.standings.length){const tr=el('tr');const td=el('td','cm-empty',active?'Nobody has scored yet in '+s.name+'.':'Standings appear once a community goal is running.');td.colSpan=7;tr.append(td);tb.append(tr);}
  renderGoals();
  $('standings-note').textContent=view.members+' members tracked';
  const hall=$('hall');hall.textContent='';
  for(const h of view.hall){const li=el('li');li.append(el('span','eyebrow',h.name),el('b','',h.champion?h.champion.name+' · '+h.champion.points.toLocaleString()+' pts':'No champion'),el('span','st-hint',(h.topPilot?'Top pilot: '+h.topPilot.name+' ('+h.topPilot.wins+' wins) · ':'')+(h.goals?.length?h.goals.filter(g=>g.reached).length+' of '+h.goals.length+' goals reached · ':'')+'ended '+date(h.endedAt)));hall.append(li);}
  if(!view.hall.length)hall.append(el('li','cm-empty','Champions appear here when a community goal ends.'));
}
// Goals (2.20.48): custom goals with a reward, an optional due date and a minimum contribution.
function renderGoals(){
  if(!goalsEditing||!goals)goals=(view.goals||[]).map(({id,title,metric,platform,target,reward,minimum,dueAt,description,multiplier})=>({id,title,metric,platform,target,reward,minimum:minimum||1,dueAt:dueAt&&dueAt!==view.season.endsAt?dueAt:0,description:description||'',multiplier:multiplier||1}));
  const live=Object.fromEntries((view.goals||[]).map(g=>[g.id,g])),box=$('goals');box.textContent='';const active=!!view.season.active;
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
    const num=(key,min,max)=>{const i=el('input');i.type='number';i.min=String(min);i.max=String(max);i.value=g[key];i.oninput=()=>{g[key]=Number(i.value);};return i;};
    const due=el('input');due.type='datetime-local';due.value=toLocal(g.dueAt);due.oninput=()=>{g.dueAt=fromLocal(due.value);};
    const desc=el('input');desc.maxLength=120;desc.value=g.description;desc.placeholder='Shown on the panel and website (optional)';desc.oninput=()=>{g.description=desc.value;};
    const mult=el('input');mult.type='number';mult.min='1';mult.max='5';mult.step='0.1';mult.value=g.multiplier;mult.oninput=()=>{g.multiplier=Number(mult.value);};
    for(const [label,input] of [['Counts',metric],['Platform',plat],['Community target',num('target',1,1e9)],['Reward each helper when reached (points)',num('reward',0,1e6)],['Points multiplier for helpers during the run (1 = none, 1.5 = half again)',mult],['Minimum to count as a helper',num('minimum',1,1e9)],['Due date (blank = with the run)',due],['Description',desc]]){const l=el('label','',label);l.append(input);f.append(l);}
    card.append(f);
    if(lv&&active){
      const bar=el('div','cm-bar big');const fill=el('i');fill.style.width=Math.min(100,lv.total/lv.target*100).toFixed(1)+'%';bar.append(fill);
      const label=lv.reached?'✓ Reached · ':lv.missed?'✗ Missed · ':'';
      card.append(el('div','cs-goal-num',label+lv.total.toLocaleString()+' / '+lv.target.toLocaleString()+(lv.dueAt?' · due '+when(lv.dueAt):'')),bar,
        el('p','st-hint',lv.helpers.length?'Helping: '+lv.helpers.slice(0,6).map(h=>h.name+' ('+h.count.toLocaleString()+')').join(', ')+(lv.helpers.length>6?'…':'')+(lv.contributors>lv.helpers.length?' · '+(lv.contributors-lv.helpers.length)+' below the minimum':''):'Nobody yet.'));
    }else card.append(el('p','st-hint','Counts once the run is started.'));
    box.append(card);
  });
  if(!goals.length)box.append(el('p','cm-empty','No goals yet. Add one, for example "Christmas gift drive · 25 gifted subs · 200 points each".'));
  $('goal-add').disabled=goals.length>=(view.goalLimit||8);
  renderContributors();
  const f=view.feed||{},ago=t=>t?Math.round((Date.now()-t)/60000)+' min ago':'never';
  const feedNote=' · Points ledger: '+f.members+' members, last '+ago(f.membersAt)+' · Subs & gifts: '+f.supporters+' supporters, last '+ago(f.supportAt)+(f.supportAt&&Date.now()-f.supportAt>10*60000?' (STALE: the Public website publisher asks Voyager - Stream Stats v6 once a minute; is Voyager connected to Streamer.bot?)':'');
  const sup=view.support||{};
  $('support-note').textContent=(sup.updatedAt?sup.tracked+' recent subscribers and gifters tracked · last read '+new Date(sup.updatedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+'.':'Sub and gift goals need subscriber data: install Voyager - Community Tracker, update Voyager - Stream Stats to v6 and keep Voyager running. Points and Versus goals work without it.')+feedNote;
}
$('goals').addEventListener('input',()=>{goalsEditing=true;});$('goals').addEventListener('change',()=>{goalsEditing=true;});
// 2.20.74: who has contributed to each goal, with the multiplier bonus accrued, and a Copy names button for giveaways.
function renderContributors(){const box=$('contributors');box.replaceChildren();if(!view.season.active)return;
  for(const g of view.goals||[]){const list=g.contributorsList||g.helpers||[];const wrap=el('div','cm-table');wrap.style.marginTop='14px';
    const head=el('div','card-heading');const t=el('div');t.append(el('span','eyebrow','CONTRIBUTORS · '+g.title.toUpperCase()),el('h2','',list.length+' helping · '+g.total.toLocaleString()+' of '+g.target.toLocaleString()+' '+(view.goalMetrics?.[g.metric]||g.metric).toLowerCase()));
    const copy=el('button','','Copy names');copy.type='button';copy.onclick=async()=>{try{await navigator.clipboard.writeText(list.map(h=>h.name).join('\n'));copy.textContent='Copied '+list.length;setTimeout(()=>copy.textContent='Copy names',1500);}catch{}};
    head.append(t,copy);wrap.append(head);
    const table=el('table'),thead=el('thead'),tr=el('tr');for(const h of ['#','Viewer','Platform','Contribution',g.multiplier>1?'Bonus points (x'+g.multiplier+')':'Reward when reached']){const th=el('th','',h);if(h!=='#'&&h!=='Viewer'&&h!=='Platform')th.className='num';tr.append(th);}thead.append(tr);table.append(thead);
    const tb=el('tbody');list.forEach((h,i)=>{const r=el('tr');r.append(el('td','cs-rank',String(i+1)),el('td','',h.name),el('td','',PLATFORM[h.platform]||h.platform),el('td','num',h.count.toLocaleString()),el('td','num',g.multiplier>1?(h.bonus||0).toLocaleString()+' accrued':g.reward.toLocaleString()));tb.append(r);});
    if(!list.length){const r=el('tr');const td=el('td','cm-empty','Nobody has contributed yet'+(g.contributors?' at the minimum of '+g.minimum+' ('+g.contributors+' below it)':'')+'.');td.colSpan=5;r.append(td);tb.append(r);}
    table.append(tb);wrap.append(table);
    if(g.multiplier>1)wrap.append(el('p','st-hint','Bonus = Voyager points each helper earns during the run x '+(g.multiplier-1).toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+', paid from Missions › Points owed when the run ends'+(g.reward?'; the '+g.reward.toLocaleString()+'-point reward is paid when the goal is reached':'')+'.'));
    box.append(wrap);}}
$('goal-add').onclick=()=>{goals.push({id:'g'+Date.now().toString(36),title:'New goal',metric:'gifts',platform:'all',target:25,reward:200,minimum:1,dueAt:0,description:''});goalsEditing=true;renderGoals();};
async function load(){try{view=await api('/api/community');render();renderPanel();}catch(e){notice(e.message,true);}}
const form=$('season-form');form.addEventListener('focusin',()=>{editing=true;});
const campaign=()=>({name:form.elements.name.value,startsAt:fromLocal(form.elements.startsAt.value),endsAt:fromLocal(form.elements.endsAt.value),supportBonus:Number(form.elements.supportBonus.value),goals});
form.onsubmit=e=>{e.preventDefault();if(view?.season?.active)save();else start();};
async function start(){if(!goals.length){notice('Add at least one goal first.',true);return;}
  if(!confirm('Start "'+form.elements.name.value+'" now? Subs and gifts count from '+(form.elements.startsAt.value?date(fromLocal(form.elements.startsAt.value)):'now')+' (as far as the tracker\'s records go), points from now, until '+(form.elements.endsAt.value?when(fromLocal(form.elements.endsAt.value)):'its due date')+'.'))return;
  try{view=await api('/api/community/season',{action:'start',...campaign()});goalsEditing=false;editing=false;notice(view.season.name+' is running.');render();}catch(err){notice(err.message,true);}}
async function save(){try{view=await api('/api/community/season',campaign());goalsEditing=false;editing=false;notice('Run saved.');render();}catch(err){notice(err.message,true);}}
$('season-start').onclick=start;
$('season-save').onclick=save;
$('end-season').onclick=async()=>{if(!view||!confirm('End '+view.season.name+' now? Its top five go into the Hall of Fame and reached goals stay payable. Nothing starts afterwards until you start the next community goal. Points balances are not changed.'))return;try{view=await api('/api/community/season',{action:'end'});editing=false;notice(view.hall[0]?.name+' has ended.');render();}catch(e){notice(e.message,true);}};
// On-stream panel (2.14)
const pf=$('panel-form'),FIELDS=['kind','limit','duration','title','top','right','width','opacity','speed'];let panelEditing=false,previewReady=false;
pf.addEventListener('focusin',()=>{panelEditing=true;});pf.addEventListener('input',()=>sendPreview());
$('panel-url').textContent=location.origin+location.pathname.replace(/[^/]*$/,'')+'Voyager_Community_Panel.html';
$('xmas-url').textContent=location.origin+location.pathname.replace(/[^/]*$/,'')+'Voyager_Christmas_Goal.html';
$('xmas-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('xmas-url').textContent);$('xmas-copy').textContent='Copied';setTimeout(()=>$('xmas-copy').textContent='Copy',1500);}catch{}};
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
// 2.20.76: import past subs and gifts for the part of the run before Voyager was counting.
(()=>{const ta=document.getElementById('import-text'),pv=document.getElementById('import-preview'),ap=document.getElementById('import-apply'),cl=document.getElementById('import-clear'),out=document.getElementById('import-out');if(!ta)return;let rows=[];
const fmt=t=>t?new Date(t).toLocaleDateString([],{day:'numeric',month:'short'}):'(no date)';
function status(){const m=view?.season?.manual;cl.hidden=!m;if(m&&!rows.length)out.textContent='Imported so far: '+m.subs+' subs and '+m.gifts+' gifted subs for '+m.viewers+' viewers, up to '+new Date(m.until).toLocaleString([],{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})+'. Applying again replaces this.';}
pv.onclick=async()=>{try{const d=await api('/api/community/import',{action:'parse',text:ta.value});rows=d.rows;out.replaceChildren();if(!rows.length){out.textContent='Nothing recognised. Use one event per line: date, name, sub or gift, count.';ap.hidden=true;return;}
  const t=el('table');t.style.cssText='width:100%;border-collapse:collapse;font-size:13px';const h=el('tr');for(const x of ['Date','Viewer','Kind','Count',''])h.append(el('th','',x));t.append(h);
  rows.forEach((r,i)=>{const tr=el('tr');const name=el('input');name.value=r.name;name.oninput=()=>{r.name=name.value;};const kind=el('select');for(const k of ['sub','gift']){const o=el('option','',k);o.value=k;o.selected=r.kind===k;kind.append(o);}kind.onchange=()=>{r.kind=kind.value;};const n=el('input');n.type='number';n.min='1';n.value=r.count;n.style.width='70px';n.oninput=()=>{r.count=Number(n.value);};const del=el('button','link','remove');del.type='button';del.onclick=()=>{rows.splice(i,1);pv.onclick();};
    for(const c of [el('td','',fmt(r.at)),name,kind,n,del]){const td=c.tagName==='TD'?c:el('td');if(c.tagName!=='TD')td.append(c);tr.append(td);}t.append(tr);});
  out.append(t,el('p','',rows.length+' events · '+rows.filter(r=>r.kind==='sub').reduce((a,r)=>a+r.count,0)+' subs · '+rows.filter(r=>r.kind==='gift').reduce((a,r)=>a+r.count,0)+' gifted subs. Rows without a date are taken as inside the run.'));ap.hidden=false;}catch(e){out.textContent=e.message;}};
ap.onclick=async()=>{if(!confirm('Apply '+rows.length+' events to '+(view?.season?.name||'the run')+'? This replaces any earlier import; from now on the tracker counts on its own.'))return;try{view=await api('/api/community/import',{rows,until:Date.now()});rows=[];ta.value='';out.textContent='';ap.hidden=true;notice('Imported '+view.imported+' events for '+view.viewers+' viewers.');render();status();}catch(e){notice(e.message,true);}};
cl.onclick=async()=>{if(!confirm('Remove the imported credits? The run will count only what the tracker knows.'))return;try{view=await api('/api/community/import',{action:'clear'});notice('Imported credits removed.');render();status();}catch(e){notice(e.message,true);}};
const orig=render;render=function(){orig();status();};})();
// 2.20.71: why a viewer does or does not count towards each goal.
(()=>{const q=document.getElementById('explain-q'),go=document.getElementById('explain-go'),out=document.getElementById('explain');if(!q||!go)return;
const fmt=t=>t?new Date(t).toLocaleString([],{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'—';
async function check(){out.textContent='Checking…';try{const d=await api('/api/community/explain',{query:q.value});out.replaceChildren();
  if(!d.matches.length){out.textContent='No member or supporter matches "'+d.query+'". Members come from the Points Ledger (every 30 s); supporters from Voyager - Stream Stats v6 (every minute).';return;}
  for(const m of d.matches){const box=document.createElement('div');box.style.cssText='margin:8px 0;padding:10px 12px;border:1px solid rgba(151,223,255,.14);background:rgba(8,15,24,.35);border-radius:10px';
    const h=document.createElement('b');h.textContent=m.name+' · '+m.platform+(m.member?'':' · not in the points ledger');box.append(h);
    const lines=[];if(m.points)lines.push('Points: lifetime '+m.points.lifetime.toLocaleString()+', goal baseline '+(m.points.baseline==null?'none':m.points.baseline.toLocaleString())+', earned during the goal '+m.points.season.toLocaleString());
    if(m.support)lines.push('Tracker: '+m.support.months+' sub months (last '+fmt(m.support.monthsAt)+'), '+m.support.gifts+' gifted subs (last '+fmt(m.support.giftsAt)+') · counted this goal: '+m.support.season.subs+' subs, '+m.support.season.gifts+' gifts'+(m.support.baseline?' (baseline '+m.support.baseline.months+' / '+m.support.baseline.gifts+')':' (no baseline yet)'));else lines.push('Tracker: no sub or gift record for this viewer.');
    for(const g of m.goals)lines.push((g.counts?'✓ ':'✗ ')+g.title+': '+g.count+' '+g.metric+(g.counts?(g.earns?' · earns the reward':' · below the minimum of '+g.minimum):' · '+g.why));
    for(const l of lines){const p=document.createElement('div');p.textContent=l;box.append(p);}out.append(box);}
}catch(e){out.textContent=e.message;}}
go.onclick=check;q.addEventListener('keydown',e=>{if(e.key==='Enter')check();});})();

})();
