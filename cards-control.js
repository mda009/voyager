/* Voyager Control > Membership cards (2.19). Card settings, previews and the !voyager setup checklist. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':new Date(t).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'});};
const TIERS=[['blue','Blue'],['silver','Silver'],['gold','Gold'],['platinum','Platinum']];
function buttons(){
  const box=$('previews');
  for(const [k,label] of TIERS)box.append(Object.assign(el('button','',label+' card'),{type:'button',onclick:()=>preview({tier:k})}));
  box.append(Object.assign(el('button','','Stats side'),{type:'button',onclick:()=>preview({tier:'gold',side:'stats'})}));
  box.append(Object.assign(el('button','','Medal wall'),{type:'button',onclick:()=>preview({tier:'platinum',side:'badges'})}));
  box.append(Object.assign(el('button','','Tier-up: Silver → Gold'),{type:'button',onclick:()=>preview({tier:'gold',tierUp:true})}));
  box.append(Object.assign(el('button','','Promotion: Lt Cdr → Commander'),{type:'button',onclick:()=>preview({tier:'silver',promotion:true})}));
}
async function preview(o){try{await api('/api/cards/preview',o);notice('Preview queued: it plays in OBS and in the live view.');}catch(e){notice(e.message,true);}}
function render(){
  if(!view)return;const s=view.settings,f=$('settings').elements;
  if(!editing){f.enabled.checked=s.enabled;f.chat.checked=s.chat;f.seconds.value=s.seconds;f.cooldown.value=s.cooldown;for(const k of ['silver','gold','platinum'])f[k].value=s.costs[k];}
  const rf=$('ranks').elements;
  if(!editing){rf.ranks.checked=s.ranks;rf.promoChat.checked=s.promoChat;
    const sel=$('promo-min');if(!sel.options.length)view.ranks.forEach((x,i)=>{if(i)sel.append(Object.assign(el('option','',x.name+' and above'),{value:String(i)}));});sel.value=String(s.promoMin);
    const rows=$('rank-rows');rows.textContent='';rows.append(el('b','','Rank'),el('b','','Lifetime points'),el('b','','Holders'));
    view.ranks.forEach((x,i)=>{const inp=el('input');inp.type='number';inp.min='0';inp.value=x.points;inp.disabled=i===0;inp.dataset.i=i;inp.className='rank-pts';
      inp.style.cssText='height:32px;padding:0 8px;border:1px solid rgba(151,223,255,.18);background:rgba(8,15,24,.55);color:#e6eef7;min-width:0';
      rows.append(el('span','',x.name+(x.top?' · top '+x.top:'')),inp,el('span','',String(x.holders)));});}
  const ev=view.lastEvent,pill=$('state-pill');pill.dataset.state=ev?'ok':'wait';pill.textContent=ev?'Last card event '+ago(ev.at):'Waiting for !voyager';
  const R=$('recent');R.textContent='';
  for(const r of view.recent.slice(0,12)){const li=el('li');li.append(el('span','mc-dot mc-'+r.tier),el('b','',r.name),el('span','',(r.promotion?'Promoted to '+r.promotion+' · ':r.tierUp?'Tier-up · ':'')+(r.side==='front'?'card':r.side)+' · '+r.platform),el('span','r',ago(r.at)));R.append(li);}
  if(!view.recent.length)R.append(el('li','','No cards yet.'));
  const checks=[[view.connected,view.connected?'Streamer.bot is connected':'Connect Streamer.bot (Voyager Versus › Stream setup)'],
    [!!ev,ev?'Voyager - Membership Card is sending events (last: '+ev.kind+' from '+ev.platform+')':'Import Voyager_Membership_Card.cs as "Voyager - Membership Card"'],
    [!!ev,'Move the !voyager command trigger to that action, and add Core › Groups › User Added to Group'],
    [true,'Disable the old Silver/Gold/Platinum OR Blue "Membership On Screen" actions so the old cards stop showing']];
  const cl=$('checklist');cl.textContent='';for(const [ok,t] of checks)cl.append(el('li',ok?'ok':'',t));
}
async function load(){try{view=await api('/api/cards');render();}catch(e){notice(e.message,true);}}
$('settings').addEventListener('focusin',()=>{editing=true;});$('ranks').addEventListener('focusin',()=>{editing=true;});
$('save').onclick=async()=>{try{const f=$('settings').elements;
  view={...view,...await api('/api/cards/settings',{enabled:f.enabled.checked,chat:f.chat.checked,seconds:Number(f.seconds.value),cooldown:Number(f.cooldown.value),costs:{silver:Number(f.silver.value),gold:Number(f.gold.value),platinum:Number(f.platinum.value)},
    ranks:$('ranks').elements.ranks.checked,promoChat:$('ranks').elements.promoChat.checked,promoMin:Number($('promo-min').value),rankPoints:[...document.querySelectorAll('.rank-pts')].map(i=>Number(i.value))})};
  editing=false;notice('Card settings saved.');render();}catch(e){notice(e.message,true);}};
$('obs-url').textContent=location.origin+'/card.html';
$('obs-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('obs-url').textContent);$('obs-copy').textContent='Copied';setTimeout(()=>$('obs-copy').textContent='Copy',1500);}catch{}};
buttons();
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!document.hidden)load();},4000);}
})();
