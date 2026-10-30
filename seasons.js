/* Voyager Control > Seasons (2.13). Standings, season settings and the Hall of Fame (data from the Voyager host). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},DAY=86400000;
let token='',view=null,editing=false;
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
  for(const r of view.standings){const tr=el('tr');tr.append(el('td','cs-rank',String(r.rank)),el('td','',r.name),el('td','',PLATFORM[r.platform]||r.platform),el('td','num',r.points.toLocaleString()),el('td','num',r.wins?String(r.wins):'–'));tb.append(tr);}
  if(!view.standings.length){const tr=el('tr');const td=el('td','cm-empty','Nobody has earned points this season yet.');td.colSpan=5;tr.append(td);tb.append(tr);}
  $('standings-note').textContent=view.members+' members tracked';
  const hall=$('hall');hall.textContent='';
  for(const h of view.hall){const li=el('li');li.append(el('span','eyebrow',h.name),el('b','',h.champion?h.champion.name+' · '+h.champion.points.toLocaleString()+' pts':'No champion'),el('span','st-hint',(h.topPilot?'Top pilot: '+h.topPilot.name+' ('+h.topPilot.wins+' wins) · ':'')+'ended '+date(h.endedAt)));hall.append(li);}
  if(!view.hall.length)hall.append(el('li','cm-empty','Champions appear here when a season ends.'));
}
async function load(){try{view=await api('/api/community');render();}catch(e){notice(e.message,true);}}
const form=$('season-form');form.addEventListener('focusin',()=>{editing=true;});
form.onsubmit=async e=>{e.preventDefault();try{view=await api('/api/community/season',{name:form.elements.name.value,weeks:Number(form.elements.weeks.value)});editing=false;notice('Season saved.');render();}catch(err){notice(err.message,true);}};
$('end-season').onclick=async()=>{if(!view||!confirm('End '+view.season.name+' now? Its top five go into the Hall of Fame and the next season starts from zero. Points balances are not changed.'))return;try{view=await api('/api/community/season',{action:'end'});notice('Season ended. Welcome to '+view.season.name+'.');render();}catch(e){notice(e.message,true);}};
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!editing)load();},30000);}
})();
