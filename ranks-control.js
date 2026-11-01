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
    tr.append(el('td','n',String(m.place)),who,rk,el('td','n hide-sm',fmt(m.lifetime)),nx);T.append(tr);
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
  ladder();roster();if(!editing)settings();
  const L=$('promotions');L.textContent='';
  for(const p of view.promotions.slice(0,15)){const li=el('li');li.append(insignia(p.to,true));const t=el('span');t.append(el('b','',p.name),document.createTextNode(' → '+view.ranks[p.to].name));li.append(t,el('span','r',ago(p.at)));L.append(li);}
  if(!view.promotions.length)L.append(el('li','','No promotions yet. They are checked about once a minute while Voyager runs.'));
}
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
