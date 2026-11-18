/* Voyager Control > Ranks (2.20.13). The naval rank ladder, the fleet roster, promotions and the rank settings. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
const fmt=n=>Math.round(Number(n)||0).toLocaleString('en');
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},FLAG=7,PAGE=100;
let token='',view=null,editing=false,shown=PAGE;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':s<86400?Math.round(s/3600)+' h ago':new Date(t).toLocaleDateString([], {day:'numeric',month:'short'});};
// Insignia SVGs come from Voyager's own card template (not from viewers).
function insignia(i,small){const s=el('span','rk-ins'+(small?' sm':''));const id=view.ranks[i]?.id;if(id&&view.insignia[id])s.innerHTML=view.insignia[id];return s;}

function ladder(){
  const L=$('ladder'),most=Math.max(1,...view.ranks.map(r=>r.holders)),sel=$('filter').value;L.textContent='';
  view.ranks.forEach((r,i)=>{
    const li=el('li',(i>=FLAG?'flag':'')+(sel===String(i)?' on':''));
    const name=el('div','rk-name');name.append(el('b','',r.name),el('span','',r.abbr+(r.top?' · needs top '+r.top+' all-time':'')));
    const hold=el('div','rk-hold'),bar=el('i'),fill=el('em');fill.style.width=(r.holders/most*100)+'%';bar.append(fill);hold.append(bar,el('b','',fmt(r.holders)));
    li.append(insignia(i),name,el('div','rk-pts',i?fmt(r.points):'Start'),hold);
    li.title='Show '+r.name+'s';li.onclick=()=>{$('filter').value=sel===String(i)?'':String(i);shown=PAGE;render();};
    L.append(li);
  });
}
function roster(){
  const q=$('search').value.trim().toLowerCase(),f=$('filter').value,p=$('platform').value;
  const rows=view.members.filter(m=>(!q||m.name.toLowerCase().includes(q))&&(f===''||m.rank===Number(f))&&(!p||m.platform===p));
  $('roster-title').textContent=f!==''?view.ranks[f].name+'s ('+fmt(rows.length)+')':q||p?fmt(rows.length)+' matching':'Everyone, by lifetime points';
  const T=$('roster');T.textContent='';
  for(const m of rows.slice(0,shown)){
    const tr=el('tr'),who=el('td','who'),b=el('b');b.append(el('span','rk-dot rk-'+m.tier),document.createTextNode(m.name));who.append(b,el('small','',PLATFORM[m.platform]||m.platform));
    const rk=el('td'),box=el('div','rk-r');box.append(insignia(m.rank,true),el('span','',view.ranks[m.rank].name));rk.append(box);
    const nx=el('td','rk-prog hide-sm');
    if(m.next===null)nx.append(el('small','','Highest rank'));
    else{const bar=el('i'),fill=el('em');fill.style.width=(m.progress*100)+'%';bar.append(fill);
      nx.append(bar,el('small','',m.gated?'Needs top '+view.ranks[m.next].top+' all-time for '+view.ranks[m.next].name:fmt(m.need)+' to '+view.ranks[m.next].name));}
    const life=el('td','n hide-sm',fmt(m.lifetime)+(m.fixed?' ✎':''));if(m.fixed)life.title='Corrected by you';
    const fx=el('button','link','Update');fx.title='Update lifetime points';fx.type='button';fx.style.cssText='margin-left:8px;font-size:12px';fx.onclick=()=>openFix(m);who.append(fx);
    tr.append(el('td','n',String(m.place)),who,rk,life,nx);T.append(tr);
  }
  if(!rows.length){const tr=el('tr'),td=el('td','rk-empty',view.total?'Nobody matches.':'No lifetime points yet. Ranks appear once the Points Ledger has synced (Points & members).');td.colSpan=5;tr.append(td);T.append(tr);}
  $('more').hidden=rows.length<=shown;$('more').textContent='Show more ('+fmt(rows.length-shown)+' left)';
}
function settings(){
  const s=view.settings,f=$('settings').elements;
  f.ranks.checked=s.ranks;f.promoChat.checked=s.promoChat;
  const sel=$('promo-min');if(!sel.options.length)view.ranks.forEach((x,i)=>{if(i)sel.append(Object.assign(el('option','',x.name+' and above'),{value:String(i)}));});sel.value=String(s.promoMin);
  const P=$('points');P.textContent='';
  view.ranks.forEach((r,i)=>{const inp=el('input');inp.type='number';inp.min='0';inp.step='1000';inp.value=s.rankPoints[i];inp.disabled=i===0;inp.className='rank-pts';inp.setAttribute('aria-label',r.name+' lifetime points');
    const name=el('span');name.append(document.createTextNode(r.name),el('small','',r.top?' · top '+r.top:''));P.append(insignia(i,true),name,inp);});
}
function render(){
  if(!view)return;
  const flag=view.ranks.slice(FLAG).reduce((a,r)=>a+r.holders,0),week=view.promotions.filter(p=>Date.now()-p.at<7*86400000).length,top=view.members[0];
  $('s-total').textContent=fmt(view.total);$('s-flag').textContent=fmt(flag);$('s-week').textContent=fmt(week);
  $('s-top').textContent=top?top.name:'–';$('s-top-rank').textContent=top?view.ranks[top.rank].name+' · '+fmt(top.lifetime):'nobody yet';
  const pill=$('state-pill');pill.dataset.state=view.settings.ranks?'ok':'wait';pill.textContent=view.settings.ranks?'Ranks on':'Ranks off';
  $('off').hidden=view.settings.ranks;
  const F=$('filter');if(F.options.length===1)view.ranks.forEach((r,i)=>F.append(Object.assign(el('option','',r.name),{value:String(i)})));
  ladder();roster();fixes();if(!editing)settings();
  const L=$('promotions');L.textContent='';
  for(const p of view.promotions.slice(0,15)){const li=el('li');li.append(insignia(p.to,true));const t=el('span');t.append(el('b','',p.name),document.createTextNode(' → '+view.ranks[p.to].name));li.append(t,el('span','r',ago(p.at)));L.append(li);}
  if(!view.promotions.length)L.append(el('li','','No promotions yet. They are checked about once a minute while Voyager runs.'));
}
// Lifetime points: set, add to or take from any member's total (2.32.0 corrections; 2.36.0 search, add and take off).
let fixing=null,findTimer=0,findSeq=0;
const fixMode=()=>document.querySelector('input[name="fix-mode"]:checked').value;
// The naval rank a lifetime total would give. Ranks limited to the top few all-time are only shown as "needs top N".
function rankFor(life){const pts=view.settings.rankPoints;let i=0,gate=null;for(let k=0;k<view.ranks.length;k++){if(life<pts[k])break;if(view.ranks[k].top){gate=gate||view.ranks[k];continue;}i=k;}return {i,gate};}
function fixTarget(){if(!fixing)return null;const raw=$('fix-value').value.trim(),n=Number(raw);if(raw===''||!Number.isInteger(n)||n<0)return null;const m=fixMode();return m==='set'?n:m==='add'?fixing.lifetime+n:Math.max(0,fixing.lifetime-n);}
function fixPreview(){const box=$('fix-result'),t=fixTarget(),m=fixMode();$('fix-label').textContent=m==='set'?'Lifetime points should be':m==='add'?'Points to add':'Points to take off';
  box.textContent='';box.classList.toggle('bad',t===null);if(t===null){box.textContent='Type a whole number, 0 or more.';return;}
  const r=rankFor(t);box.append(document.createTextNode(fmt(fixing.lifetime)+' → '),el('b','',fmt(t)),document.createTextNode(' lifetime points · '+(t===0?'left out of the ranks':view.ranks[r.i].name+(r.gate?' (or higher: '+r.gate.name+' needs top '+r.gate.top+' all-time)':''))+(fixing.balance!==null?' · balance stays '+fmt(fixing.balance):'')));}
function openFix(m){fixing=m;editing=true;$('fix-form').hidden=false;$('fix-hits').textContent='';$('fix-search').value='';$('fix-name').textContent=m.name+' · '+(PLATFORM[m.platform]||m.platform);
  $('fix-info').textContent='Lifetime '+fmt(m.lifetime)+' · '+(m.lifetime?view.ranks[m.rank].name:'not in the ranks yet')+(m.balance!==null?' · balance '+fmt(m.balance):'')+(m.fixed?' · already set by you':'');
  document.querySelector('input[name="fix-mode"][value="set"]').checked=true;$('fix-value').value=m.lifetime;$('fix-balance').disabled=m.balance===null;fixPreview();
  $('fix-card').scrollIntoView({behavior:'smooth',block:'center'});$('fix-value').focus();$('fix-value').select();}
function closeFix(){fixing=null;editing=false;$('fix-form').hidden=true;}
async function saveFix(key,value,text){try{const v=await api('/api/cards/lifetime',{key,value});const {member,...rest}=v;view={...view,...rest};closeFix();
  notice(text+(member&&value!==null&&member.lifetime?' Rank: '+view.ranks[member.rank].name+(member.place?' · #'+fmt(member.place)+' all-time':'')+'.':'')+' Cards on stream and the website follow within a couple of minutes.');render();}catch(e){notice(e.message,true);}}
$('fix-save').onclick=()=>{if(!fixing)return;const t=fixTarget();if(t===null){notice('Type a whole number, 0 or more.',true);return;}saveFix(fixing.key,t,fixing.name+"'s lifetime points are now "+fmt(t)+' (were '+fmt(fixing.lifetime)+').');};
$('fix-balance').onclick=()=>{if(fixing&&fixing.balance!==null){document.querySelector('input[name="fix-mode"][value="set"]').checked=true;$('fix-value').value=fixing.balance;fixPreview();}};
$('fix-zero').onclick=()=>{if(fixing)saveFix(fixing.key,0,fixing.name+' is left out of the ranks.');};
$('fix-cancel').onclick=closeFix;
$('fix-value').addEventListener('input',fixPreview);for(const r of document.querySelectorAll('input[name="fix-mode"]'))r.addEventListener('change',()=>{if(fixMode()!=='set')$('fix-value').value='';else if(fixing)$('fix-value').value=fixing.lifetime;fixPreview();$('fix-value').focus();});
$('fix-value').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('fix-save').click();}});
// Find anyone in the points list, not only the roster's first 1,000.
async function findMembers(){const q=$('fix-search').value.trim(),L=$('fix-hits'),seq=++findSeq;if(q.length<2){L.textContent='';return;}
  try{const d=await api('/api/cards/lifetime/find?q='+encodeURIComponent(q));if(seq!==findSeq)return;L.textContent='';
    if(!d.members.length){const li=el('li');li.append(el('span','','Nobody in the points list matches "'+q+'".'));L.append(li);return;}
    for(const m of d.members){const li=el('li'),b=el('button');b.type='button';const t=el('span');t.append(el('b','',m.name),document.createTextNode(' · '+(PLATFORM[m.platform]||m.platform)));
      b.append(t,el('span','r',fmt(m.lifetime)+' lifetime'+(m.balance!==null?' · balance '+fmt(m.balance):'')+(m.fixed?' ✎':'')));b.onclick=()=>openFix(m);li.append(b);L.append(li);}
  }catch(e){if(seq===findSeq)notice(e.message,true);}}
$('fix-open').onclick=()=>{$('fix-card').scrollIntoView({behavior:'smooth',block:'center'});$('fix-search').focus();};
$('fix-search').addEventListener('input',()=>{clearTimeout(findTimer);findTimer=setTimeout(findMembers,250);});
function fixes(){const L=$('fixes'),list=view.fixes||[];L.textContent='';const pill=$('fix-pill');pill.dataset.state=list.length?'ok':'wait';pill.textContent=list.length?list.length+' set by you':'None set';if(!list.length){const li=el('li');li.append(el('span','','Nobody yet. Everyone is on their counted lifetime points.'));L.append(li);}
  for(const f of list){const li=el('li');const t=el('span');t.append(el('b','',f.name),document.createTextNode(' · '+(PLATFORM[f.platform]||f.platform)+' · was '+fmt(f.was)+', set to '+fmt(f.set)+(f.now!==f.set?', now '+fmt(f.now):'')+(f.set===0&&!f.now?' (left out of ranks)':'')));
    const b=el('button','link','Undo');b.type='button';b.onclick=()=>saveFix(f.key,null,f.name+' is back on their counted lifetime points.');li.append(t,el('span','r',ago(f.at)),b);L.append(li);}}
async function load(){try{view=await api('/api/cards/ranks');render();}catch(e){notice(e.message,true);}}
$('settings').addEventListener('focusin',()=>{editing=true;});$('settings').addEventListener('change',()=>{editing=true;});
$('search').addEventListener('input',()=>{shown=PAGE;roster();});$('filter').addEventListener('change',()=>{shown=PAGE;render();});$('platform').addEventListener('change',()=>{shown=PAGE;roster();});
$('more').onclick=()=>{shown+=PAGE;roster();};
$('reset').onclick=()=>{if(!view)return;editing=true;document.querySelectorAll('.rank-pts').forEach((inp,i)=>{inp.value=view.defaults[i];});notice('Default points filled in. Save settings to use them.');};
$('save').onclick=async()=>{try{const f=$('settings').elements;
  await api('/api/cards/settings',{ranks:f.ranks.checked,promoChat:f.promoChat.checked,promoMin:Number($('promo-min').value),rankPoints:[...document.querySelectorAll('.rank-pts')].map(i=>Number(i.value))});
  editing=false;notice('Rank settings saved.');await load();}catch(e){notice(e.message,true);}};
$('preview-promo').onclick=async()=>{try{await api('/api/cards/preview',{tier:'silver',promotion:true});notice('Preview queued: it plays in OBS and in the live view.');}catch(e){notice(e.message,true);}};
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!document.hidden&&!editing)load();},10000);}
})();
