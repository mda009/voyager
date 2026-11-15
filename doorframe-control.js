/* Voyager Control > Doorframe (2.27.0). */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,editing=false,custom=null,off=null;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':s<86400?Math.round(s/3600)+' h ago':new Date(t).toLocaleDateString([],{day:'numeric',month:'short'});};
const PHASE={approach:'She is walking up to the door',vote:'Chat is voting',pass:'She made it past',bonk:'BONK',exit:'On to the next door',result:'Round over'};
function renderObstacles(){
  const b=$('builtin');b.textContent='';for(const i of view.builtin){const lab=el('label');const c=el('input');c.type='checkbox';c.checked=!off.has(i.id);c.onchange=()=>{c.checked?off.delete(i.id):off.add(i.id);editing=true;count();};lab.append(c,document.createTextNode(i.name),el('code','','!'+i.cmd));b.append(lab);}
  const box=$('custom');box.textContent='';if(!custom.length)box.append(el('p','st-hint','None yet. Add a banana cream pie, your office chair, a suspicious puddle…'));
  custom.forEach((o,i)=>{const row=el('div','df-ob');const n=el('input');n.type='text';n.value=o.name;n.maxLength=40;n.placeholder='What is in the way, e.g. A wet floor sign';n.oninput=()=>{o.name=n.value;editing=true;};
    const sel=el('select');for(const c of ['hop','duck','squeeze']){const op=el('option','','!'+c);op.value=c;sel.append(op);}sel.value=o.cmd;sel.onchange=()=>{o.cmd=sel.value;editing=true;};
    const del=el('button','link','Remove');del.type='button';del.onclick=()=>{custom.splice(i,1);editing=true;renderObstacles();};
    const l2=el('div','l2');const p=el('input');p.type='text';p.value=o.oops||'';p.maxLength=140;p.placeholder='Punchline when she hits it';p.oninput=()=>{o.oops=p.value;editing=true;};l2.append(p);row.append(n,sel,del,l2);box.append(row);});
  count();
}
function count(){$('ob-pill').textContent=(view.builtin.filter(i=>!off.has(i.id)).length+custom.filter(o=>o.name.trim()).length)+' in play';}
function render(){if(!view)return;const s=view.settings,r=view.round;
  if(!editing){const f=$('settings-form').elements;f.enabled.checked=s.enabled;f.announce.checked=s.announce;for(const k of ['doors','seconds','reward','cleanBonus'])f[k].value=s[k];custom=structuredClone(s.custom);off=new Set(s.off);renderObstacles();}
  const pill=$('state-pill');pill.dataset.state=!s.enabled?'wait':view.running?'ok':'wait';pill.textContent=!s.enabled?'Off':view.running?'Round running':'Ready';
  $('start').hidden=view.running;$('start').disabled=!s.enabled;$('stop').hidden=!view.running;
  const now=$('now');now.textContent='';
  if(r){now.append(el('b','','Door '+(r.door+1)+' of '+r.doors+' · '+r.item.name),document.createTextNode(' — '+(PHASE[r.phase]||r.phase)+'. Votes: !duck '+r.votes.duck+' · !hop '+r.votes.hop+' · !squeeze '+r.votes.squeeze+(r.bone?' · broken: '+r.bone.name:'')));}
  else{now.append(document.createTextNode('Press '),el('b','','Start a round'),document.createTextNode('. She heads for the first door and chat gets '+s.seconds+' seconds to type the right command.'));}
  $('overlay-url').textContent=location.origin+'/control/Voyager_Doorframe_Overlay.html';
  const st=view.stats,box=$('stats');box.textContent='';for(const [k,v] of [['This stream',st.streamBones],['All-time bones',st.bones],['Rounds played',st.rounds],['Clean runs',st.clean],['Doors cleared',st.cleared+' / '+st.doors]]){const d=el('div','df-st');d.append(el('small','',k),el('b','',String(v)));box.append(d);}
  const h=$('history');h.textContent='';if(!view.history.length)h.append(el('li','','No rounds played yet.'));
  for(const x of view.history){const li=el('li');li.append(el('span','',x.title+' — '+x.cleared+' of '+x.doors+' doors, '+x.bones+' bone'+(x.bones===1?'':'s')+(x.broken?.length?' ('+x.broken.join(', ')+')':'')+' · '+x.players+' crew scored'),el('small','',ago(x.at)));h.append(li);}
}
async function load(){try{view=await api('/api/doorframe');render();}catch(e){notice(e.message,true);}}
$('settings-form').addEventListener('input',()=>{editing=true;});
$('ob-add').onclick=()=>{custom.push({name:'',cmd:'hop',oops:''});editing=true;renderObstacles();$('custom').querySelector('.df-ob:last-child input')?.focus();};
$('save').onclick=async()=>{const f=$('settings-form').elements;try{view=await api('/api/doorframe/settings',{enabled:f.enabled.checked,announce:f.announce.checked,doors:Number(f.doors.value),seconds:Number(f.seconds.value),reward:Number(f.reward.value),cleanBonus:Number(f.cleanBonus.value),off:[...off],custom:custom.filter(o=>o.name.trim())});editing=false;notice('Saved.');render();}catch(e){notice(e.message,true);}};
$('start').onclick=async()=>{try{view=await api('/api/doorframe/start',{});notice('Round started. Watch the overlay.');render();}catch(e){notice(e.message,true);}};
$('stop').onclick=async()=>{try{view=await api('/api/doorframe/stop',{});notice('Round stopped.');render();}catch(e){notice(e.message,true);}};
$('copy-url').onclick=async()=>{try{await navigator.clipboard.writeText($('overlay-url').textContent);notice('Address copied.');}catch{notice('Select the address and copy it.',true);}};
function fit(){const box=$('frame'),f=$('preview');if(box&&f)f.style.transform='scale('+box.clientWidth/1280+')';}
addEventListener('resize',fit);fit();
if(!hosted){$('not-hosted').hidden=false;}else{load();setInterval(load,1000);}
})();
