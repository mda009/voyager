/* Voyager Control > Chat engagement (2.20.22): Comms Relay, !report, Bridge Quiz, Squadrons, arrival cards and the Captain's Log. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false,bank=null;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':new Date(t).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'});};
const PLAT={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
function fill(form,obj){const f=$(form).elements;for(const [k,v] of Object.entries(obj)){const i=f[k];if(!i)continue;if(i.type==='checkbox')i.checked=!!v;else i.value=v;}}
function read(form){const out={};for(const i of $(form).elements){if(!i.name)continue;out[i.name]=i.type==='checkbox'?i.checked:i.type==='number'?Number(i.value):i.value;}return out;}
function renderBank(){
  const box=$('bank');box.textContent='';$('bank-count').textContent=bank.length;
  bank.forEach((q,i)=>{const row=el('div','eg-q');const qi=el('input');qi.value=q.q;qi.maxLength=160;qi.setAttribute('aria-label','Question '+(i+1));qi.oninput=()=>{q.q=qi.value;};
    const ai=el('input');ai.value=(q.a||[]).join(' | ');ai.setAttribute('aria-label','Answers for question '+(i+1));ai.oninput=()=>{q.a=ai.value.split('|').map(x=>x.trim()).filter(Boolean);};
    const ask=el('button','','Ask');ask.type='button';ask.onclick=async()=>{try{view={...view,...await api('/api/engage/quiz/ask',{id:q.id})};notice('Question asked in chat and on stream.');render();}catch(e){notice(e.message,true);}};
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{bank.splice(i,1);renderBank();};
    const wrap=el('div','eg-row');wrap.append(ask,del);row.append(qi,ai,wrap);box.append(row);});
}
function render(){
  if(!view)return;const s=view.settings;
  if(!editing){fill('relay-form',s.relay);fill('report-form',s.report);fill('quiz-form',s.quiz);fill('arr-form',s.arrivals);fill('log-form',s.log);
    fill('sq-form',{enabled:s.squadrons.enabled,...s.squadrons.names,chat:s.squadrons.chat,chatCap:s.squadrons.chatCap,mission:s.squadrons.mission,damageDiv:s.squadrons.damageDiv,versusWin:s.squadrons.versusWin});}
  if(!bank){bank=structuredClone(view.quiz.bank);renderBank();}
  // checklist
  const act=view.medalsAction?.state,chat=view.lastChatAt&&Date.now()-view.lastChatAt<15*60000,o=view.otherChat||{},other=['kick','youtube'].filter(p=>o[p]&&Date.now()-o[p]<15*60000);
  const cl=$('checklist');cl.textContent='';
  for(const [ok,t] of [[view.connected,view.connected?'Voyager is connected to Streamer.bot':'Voyager is not connected to Streamer.bot'],
    [!!chat,chat?'Voyager can read Twitch chat':'No Twitch chat seen yet (type anything in chat)'],
    [other.length?true:null,other.length?'Also reading '+other.map(p=>PLAT[p]).join(' and ')+' chat':'No Kick or YouTube chat seen yet'],
    [act==='found',act==='found'?'Chat replies go out through "Voyager - Medals"':'Chat replies need the "Voyager - Medals" action (Medals setup); everything else still works']])cl.append(el('li',ok===null?'info':ok?'ok':'',t));
  // relay
  const r=view.relay,rp=$('relay-pill');rp.dataset.state=r.count||r.fired?'ok':'wait';rp.textContent=r.enabled?(r.count||r.fired?r.count+' / '+r.threshold+' · fired '+r.fired+'×':'No fight running'):'Off';
  // muster
  $('muster-pill').dataset.state=view.muster.count?'ok':'wait';$('muster-pill').textContent=view.muster.count+' this stream';
  const ml=$('muster');ml.textContent='';for(const c of view.muster.crew){const li=el('li');li.append(el('b','',c.name),el('span','',PLAT[c.platform]||''),el('span','r',c.streak>1?c.streak+' in a row':''));ml.append(li);}
  if(!view.muster.crew.length)ml.append(el('li','','Nobody has typed !report this stream yet.'));
  // quiz
  const a=view.quiz.active,live=$('quiz-live');live.textContent='';
  if(a&&!a.winner&&Date.now()<a.endsAt+2000){live.append(el('span','eyebrow','LIVE · '+Math.max(0,Math.ceil((a.endsAt-Date.now())/1000))+'s left'),el('b','',a.q),el('span','st-hint','Answer: '+a.a.join(' | ')+' · +'+a.reward+' points'));}
  else if(a?.winner)live.append(el('span','eyebrow','LAST QUESTION'),el('b','',a.winner.name+' won · '+a.a[0]),el('span','st-hint',a.q));
  else live.append(el('span','st-hint','No question running. Ask one, or set automatic questions.'));
  $('quiz-cancel').disabled=!(a&&!a.winner&&Date.now()<a.endsAt);
  const qh=$('quiz-history');qh.textContent='';for(const h of view.quiz.history){const li=el('li');li.append(el('b','',h.winner?h.winner.name:'No winner'),el('span','',h.q),el('span','r',ago(h.at)));qh.append(li);}
  // squadrons
  const st=$('standings');st.textContent='';const max=Math.max(1,...view.squadrons.standings.map(x=>x.score));
  for(const x of view.squadrons.standings){const row=el('div','eg-sq'),bar=el('div','bar'),i=el('i');i.style.width=(x.score/max*100)+'%';bar.append(i);row.append(el('b','',x.name),bar,el('span','',x.score.toLocaleString()+' · '+x.crew));st.append(row);}
  $('sq-pill').dataset.state=view.squadrons.members?'ok':'wait';$('sq-pill').textContent=view.squadrons.members+' crew'+(view.squadrons.panel?' · on stream':'');
  // log
  const lg=$('log');lg.textContent='';
  for(const e of view.log.slice(0,60)){const li=el('li',e.pinned?'pin':'');const t=el('span');t.append(el('b','',e.name+': '),document.createTextNode(e.text));
    const pin=el('button','',e.pinned?'Unpin':'Pin');pin.type='button';pin.onclick=()=>mod(e.id,{pinned:!e.pinned});
    const hide=el('button','link','Hide');hide.type='button';hide.onclick=()=>mod(e.id,{hidden:true});
    const r2=el('span','r');r2.append(ago(e.at),pin,hide);li.append(t,r2);lg.append(li);}
  if(!view.log.length)lg.append(el('li','','No log entries yet. Viewers add them with !log <moment>.'));
}
async function mod(id,patch){try{view={...view,...await api('/api/engage/log',{id,...patch})};render();}catch(e){notice(e.message,true);}}
async function load(){try{view=await api('/api/engage');render();}catch(e){notice(e.message,true);}}
for(const f of ['relay-form','report-form','quiz-form','sq-form','arr-form','log-form'])$(f).addEventListener('input',()=>{editing=true;});
$('save').onclick=async()=>{try{const sq=read('sq-form');
  view={...view,...await api('/api/engage/settings',{relay:read('relay-form'),report:read('report-form'),quiz:read('quiz-form'),arrivals:read('arr-form'),log:read('log-form'),
    squadrons:{enabled:sq.enabled,names:{red:sq.red,gold:sq.gold,blue:sq.blue},chat:sq.chat,chatCap:sq.chatCap,mission:sq.mission,damageDiv:sq.damageDiv,versusWin:sq.versusWin}})};
  editing=false;notice('Chat engagement settings saved.');render();}catch(e){notice(e.message,true);}};
$('quiz-ask').onclick=async()=>{try{view={...view,...await api('/api/engage/quiz/ask',{})};notice('Question asked in chat and on stream.');render();}catch(e){notice(e.message,true);}};
$('quiz-cancel').onclick=async()=>{try{view={...view,...await api('/api/engage/quiz/cancel',{})};notice('Question cancelled.');render();}catch(e){notice(e.message,true);}};
$('bank-add').onclick=()=>{bank.push({id:'',q:'',a:[]});renderBank();};
$('bank-save').onclick=async()=>{try{view={...view,...await api('/api/engage/quiz/bank',{bank:bank.filter(q=>q.q.trim())})};bank=structuredClone(view.quiz.bank);renderBank();notice('Questions saved.');}catch(e){notice(e.message,true);}};
for(const [id,seconds] of [['panel-show',60],['panel-stay',3600],['panel-hide',0]])$(id).onclick=async()=>{try{view={...view,...await api('/api/engage/panel',{seconds})};notice(seconds?'Squadron panel is on stream.':'Squadron panel hidden.');render();}catch(e){notice(e.message,true);}};
$('obs-url').textContent=location.origin+'/engage.html';
$('obs-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('obs-url').textContent);$('obs-copy').textContent='Copied';setTimeout(()=>$('obs-copy').textContent='Copy',1500);}catch{}};
if(!hosted)$('not-hosted').hidden=false;else{load();setInterval(()=>{if(!document.hidden)load();},3000);}
})();
