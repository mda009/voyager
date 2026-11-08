/* Voyager Control › Screen & overlays › Sources (2.21.0). One list of every OBS browser source Voyager draws, from
   GET /api/sources: address, size, whether OBS is asking for it right now, a copy button, a test where the page has one. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',open=new Set(),data=null;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body,method){
  if(!token)token=(await(await fetch('/api/admin',{cache:'no-store'})).json()).token;
  const r=await fetch(path,{method:method||(body?'POST':'GET'),cache:'no-store',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
// A test for the sources that have one: something visible happens on that overlay within a few seconds.
const TESTS={
  stage:['Show the stage for 20 s',()=>api('/api/stage/force',{seconds:20,mode:'dread'})],
  moments:['Play a sample medal toast',()=>api('/api/moments/test',{kind:'medal'})],
  bucket:['Show the goals strip',()=>api('/api/moments/test',{kind:'goals'})],
  card:['Show a sample Gold card',()=>api('/api/cards/preview',{tier:'gold',side:'front',tierUp:true})],
  medals:['Show a sample toast',()=>api('/api/medals/preview',{})],
  goalfx:['Play the Silver celebration',()=>api('/api/goalfx/control',{kind:'play',tier:'silver'})],
  fleet:['Send a test follow alert',()=>api('/api/streamerbot/run',{key:'fleet.test',stage:'1',name:'Nova Pilot',platform:'twitch'})],
  engage:['Show the squadron panel for 20 s',()=>api('/api/engage/panel',{seconds:20})],
  community:['Show the community panel',()=>api('/api/community/panel',{visible:true})],
  cooldown:['Play the Versus ready alert',()=>api('/api/control',{type:'ready_alert_test'})],
  ready:['Play the Versus ready alert',()=>api('/api/control',{type:'ready_alert_test'})]
};
const ago=at=>{if(!at)return 'never';const s=Math.round((Date.now()-at)/1000);return s<60?s+' s ago':s<3600?Math.round(s/60)+' min ago':Math.round(s/3600)+' h ago';};
const STATE={ok:'Loaded in OBS',stale:'Not asking',off:'Not seen',sb:'Streamer.bot'};
function render(){
  const d=data;if(!d)return;
  const list=$('list');list.replaceChildren();let group='';
  for(const e of d.sources){
    if(e.group!==group){group=e.group;list.append(el('div','sc-group',group));}
    const row=el('div','sc-item');row.dataset.state=e.state;row.dataset.key=e.key;if(open.has(e.key))row.classList.add('open');
    const n=el('div','n');n.append(el('b','',e.name),el('code','',d.origin+e.page),el('span','sz',e.size));
    const m=el('div','m',e.state==='sb'?'Streamer.bot':e.state==='ok'?'Loaded':e.state==='stale'?'Last seen '+ago(e.seenAt):'Not seen');
    const note=el('div','note',e.note+(e.state==='stale'?' Refresh the source’s cache in OBS, or check it is in the scene you are on.':e.state==='off'&&!e.sb?' Add it with the three steps on the right if you want it.':''));
    const b=el('div','b');
    const copy=el('button','',"Copy address");copy.type='button';copy.onclick=async()=>{try{await navigator.clipboard.writeText(d.origin+e.page);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy address',1500);}catch{notice('Copy failed — select the address and copy it.',true);}};
    const openA=el('a','button','Open page ↗');openA.href=e.page;openA.target='_blank';openA.rel='noopener';
    b.append(copy,openA);
    if(TESTS[e.key]&&hosted){const [label,fn]=TESTS[e.key];const t=el('button','primary',label);t.type='button';t.onclick=async()=>{t.disabled=true;try{await fn();notice(e.name+' · test sent — watch OBS.');}catch(err){notice(e.name+' · '+err.message,true);}finally{t.disabled=false;}};b.append(t);}
    if(e.setup){const s=el('a','button','Settings ↗');s.href=e.setup;b.append(s);}
    n.onclick=()=>{row.classList.toggle('open');if(row.classList.contains('open'))open.add(e.key);else open.delete(e.key);};
    row.append(el('i'),n,m,note,b);list.append(row);
  }
  const pill=$('count-pill');pill.dataset.state=d.loaded===d.total?'ok':d.loaded?'warn':'wait';pill.textContent=d.loaded+' of '+d.total+' loaded';
  const sum=$('summary');sum.replaceChildren();
  const stat=(label,value,sub)=>{const c=el('div','sc-st');c.append(el('small','',label),el('b','',value),el('span','',sub||''));sum.append(c);};
  const by=s=>d.sources.filter(e=>e.state===s).length;
  stat('Loaded in OBS',String(d.loaded),'asking Voyager right now');stat('Stopped asking',String(by('stale')),'hidden or an old copy');stat('Not seen',String(by('off')),'not in OBS, or not needed');stat('Streamer.bot driven',String(by('sb')),'cannot be checked from here');
}
async function refresh(){if(!hosted)return;try{data=await api('/api/sources');render();}catch(e){notice(e.message,true);}}
$('refresh').onclick=refresh;
if(!hosted){$('not-hosted').hidden=false;}else{refresh();setInterval(()=>{if(!document.hidden)refresh();},5000);}
})();
