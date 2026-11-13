/* Voyager Control > SC Intel (2.21.15): Star Citizen news, ships in the store, deals and events — panel settings, chat commands, your list. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false,deals=null;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{if(!t)return 'never';const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':s<86400?Math.round(s/3600)+' h ago':new Date(t).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'});};
const PLAT={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},KINDS={ccu:'CCU / upgrade',sale:'Ship deal',event:'Event',freefly:'Free Fly',note:'Note'};
function fill(obj){const f=$('settings-form').elements;for(const [k,v] of Object.entries(obj)){const i=f[k];if(!i)continue;if(i.type==='checkbox')i.checked=!!v;else i.value=v;}}
function renderDeals(){
  const box=$('deals');box.textContent='';$('deals-pill').textContent=deals.filter(d=>d.enabled!==false).length+' active';$('deals-pill').dataset.state=deals.length?'ok':'wait';
  if(!deals.length)box.append(el('p','st-hint','Nothing listed. Add a row for a warbond CCU discount, a ship deal or an event.'));
  deals.forEach((d,i)=>{const row=el('div','si-deal'+(d.enabled===false?' off':''));
    const k=el('select');for(const [v,l] of Object.entries(KINDS)){const o=el('option','',l);o.value=v;k.append(o);}k.value=KINDS[d.kind]?d.kind:'note';k.onchange=()=>{d.kind=k.value;};
    const t=el('input');t.value=d.title||'';t.placeholder='Title (shown in chat and on the panel)';t.maxLength=80;t.oninput=()=>{d.title=t.value;};
    const de=el('input');de.value=d.detail||'';de.placeholder='Detail, e.g. Carrack → Polaris $185 warbond';de.maxLength=160;de.oninput=()=>{d.detail=de.value;};
    const u=el('input');u.value=d.url||'';u.placeholder='https://… (optional)';u.maxLength=200;u.oninput=()=>{d.url=u.value;};
    const un=el('input');un.type='date';un.value=d.until||'';un.title='Until (hidden after this day)';un.onchange=()=>{d.until=un.value;};
    const on=el('label','on');const c=el('input');c.type='checkbox';c.checked=d.enabled!==false;c.onchange=()=>{d.enabled=c.checked;row.classList.toggle('off',!c.checked);};on.append(c,'on');
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{deals.splice(i,1);renderDeals();};
    const l2=el('div','l2');l2.append(de,u);const l3=el('div','l3');l3.append(el('span','','Until (optional)'),un,on,del);row.append(k,t,l2,l3);box.append(row);});
}
function render(){
  if(!view)return;const s=view.settings;
  if(!editing)fill({enabled:s.enabled,cycleSeconds:s.panel.cycleSeconds,cooldownSeconds:s.commands.cooldownSeconds,newsCount:s.panel.newsCount,shipsCount:s.panel.shipsCount,news:s.panel.news,sales:s.panel.sales,deals:s.panel.deals,events:s.panel.events,commands:s.commands.enabled});
  if(!deals){deals=structuredClone(view.deals).map(({active,...d})=>d);renderDeals();}
  // sources
  for(const [id,src] of [['st-news',view.news],['st-sales',view.sales]]){const b=$(id);b.dataset.ok=String(src.ok);b.children[1].textContent=src.ok===null?'Not fetched yet':src.ok?(id==='st-news'?src.items.length+' loaded':src.count+' ships'):'Could not fetch';b.children[2].textContent=(src.message||'')+(src.at?' · '+ago(src.at):'');}
  const bad=view.news.ok===false||view.sales.ok===false,pill=$('src-pill');pill.dataset.state=!s.enabled?'wait':bad?'error':view.news.ok&&view.sales.ok?'ok':'wait';pill.textContent=!s.enabled?'Off':bad?'A source failed':view.news.ok&&view.sales.ok?'Both sources OK':'Fetching…';
  $('panel-pill').dataset.state=s.enabled?'ok':'wait';$('panel-pill').textContent=s.enabled?'Showing':'Off';
  $('panel-url').textContent=location.origin+'/control/Voyager_SC_Intel_Panel.html';
  // commands
  const c=$('commands');c.textContent='';const act=view.action?.state;
  $('cmd-pill').dataset.state=!s.enabled||!s.commands.enabled?'wait':act==='found'&&view.connected?'ok':'error';$('cmd-pill').textContent=!s.enabled||!s.commands.enabled?'Off':!view.connected?'Streamer.bot not connected':act==='found'?'Ready':'Needs "Voyager - Medals" action';
  for(const cmd of view.commands){const row=el('div','si-cmd');const left=el('div');left.append(el('code','',cmd.word));if(cmd.also?.length)left.append(el('span','also','also '+cmd.also.join(' ')));
    const p=el('div','p');p.append(el('small','',cmd.text));p.append(document.createTextNode(view.preview[cmd.kind]||''));
    const b=el('button','','Post now');b.type='button';b.onclick=async()=>{try{const r=await api('/api/intel/say',{kind:cmd.kind});notice('Posted to chat · '+r.message);load();}catch(e){notice(e.message,true);}};
    row.append(left,p,b);c.append(row);}
  const co=view.chatOut||[],cl=$('chatout');cl.textContent='';if(!co.length)cl.append(el('li','muted','Nothing asked since Voyager started.'));
  for(const x of co){const li=el('li',x.ok===false?'bad':x.ok?'ok':'');li.append(el('b','',ago(x.at)+' · '+x.word+(x.by?' by '+x.by:'')+' · '+(PLAT[x.platform]||'all platforms')+' · '),el('span','',x.text.slice(0,100)+(x.text.length>100?'…':'')),el('small','',' — '+(x.ok===false?'NOT POSTED: ':'')+x.message));cl.append(li);}
  // news + ships
  const n=$('news');n.textContent='';if(!view.news.items.length)n.append(el('li','muted',view.news.ok===false?'Could not fetch: '+view.news.message:'Fetching…'));
  for(const x of view.news.items){const li=el('li');const tag=el('span','si-tag',x.label);const a=el('a','',x.title);a.href=x.url;a.target='_blank';a.rel='noopener';li.append(tag,a,el('span','r',x.when+(x.channel?' · '+x.channel:'')));n.append(li);}
  const sl=$('sales');sl.textContent='';$('sales-pill').textContent=view.sales.count?view.sales.count+' ships':'—';$('sales-pill').dataset.state=view.sales.ok?'ok':view.sales.ok===false?'error':'wait';
  if(!view.sales.items.length)sl.append(el('li','muted',view.sales.ok===false?'Could not fetch: '+view.sales.message:'Fetching…'));
  for(const x of view.sales.items){const li=el('li');const a=el('a','',x.name);if(x.url){a.href=x.url;a.target='_blank';a.rel='noopener';}li.append(el('b','',x.maker||''),a,el('span','r',(x.priceLabel||'$'+x.price)+(x.status?' · '+x.status.replace(/-/g,' '):'')+' · '+ago(x.updated)));sl.append(li);}
}
async function load(){try{view=await api('/api/intel');render();}catch(e){notice(e.message,true);}}
$('settings-form').addEventListener('input',()=>{editing=true;});
$('save-settings').onclick=async()=>{const f=$('settings-form').elements;try{view=await api('/api/intel/settings',{enabled:f.enabled.checked,panel:{cycleSeconds:Number(f.cycleSeconds.value),newsCount:Number(f.newsCount.value),shipsCount:Number(f.shipsCount.value),news:f.news.checked,sales:f.sales.checked,deals:f.deals.checked,events:f.events.checked},commands:{enabled:f.commands.checked,cooldownSeconds:Number(f.cooldownSeconds.value)}});editing=false;notice('Settings saved.');render();}catch(e){notice(e.message,true);}};
$('deals-save').onclick=async()=>{try{view=await api('/api/intel/deals',{deals});deals=null;notice('List saved — the panel and the commands use it now.');render();}catch(e){notice(e.message,true);}};
$('deal-add').onclick=()=>{deals.push({kind:'ccu',title:'',detail:'',url:'',until:'',enabled:true});renderDeals();$('deals').querySelector('.si-deal:last-child input')?.focus();};
$('refresh').onclick=async()=>{notice('Fetching…');try{view=await api('/api/intel/refresh',{});notice('Fetched · news: '+view.news.message+' · ships: '+view.sales.message,view.news.ok===false||view.sales.ok===false);render();}catch(e){notice(e.message,true);}};
$('copy-url').onclick=async()=>{try{await navigator.clipboard.writeText($('panel-url').textContent);notice('Address copied.');}catch{notice('Select the address and copy it.',true);}};
function fitPreview(){const box=$('frame'),f=$('preview');if(!box||!f)return;const k=box.clientWidth/640;f.style.transform='scale('+k+')';}
addEventListener('resize',fitPreview);fitPreview();
if(!hosted){$('not-hosted').hidden=false;}else{load();setInterval(load,20000);}
})();
