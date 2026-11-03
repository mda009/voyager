/* Voyager Home (2.20.43): the "Connect chat" button from Voyager Versus › Stream setup, on the home page.
   Connects Voyager's host to Streamer.bot using the address and password saved in Settings; nothing to type. */
(()=>{'use strict';
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname),actions=document.querySelector('.home-actions');
if(!actions||new URLSearchParams(location.search).get('demo')==='1')return;
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
const wrap=el('div','home-connect'),dot=el('span','hc-dot'),text=el('span','hc-text','Checking Streamer.bot…'),connect=el('button','primary','Connect chat'),disconnect=el('button','','Disconnect'),settings=el('a','','Settings ↗');
connect.type='button';disconnect.type='button';settings.href='Voyager_Settings.html';disconnect.hidden=true;
wrap.append(dot,text,connect,disconnect,settings);actions.prepend(wrap);
let token='';
async function api(path,body){
  if(!token)token=(await(await fetch('/api/admin',{cache:'no-store'})).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',cache:'no-store',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;
}
function show(state,message){wrap.dataset.state=state;text.textContent=message;connect.hidden=state==='ok';disconnect.hidden=state!=='ok';connect.disabled=state==='busy';}
async function refresh(){
  if(!hosted){show('off','Start Voyager to connect chat');connect.disabled=true;return;}
  try{const s=await(await fetch('/api/state',{cache:'no-store'})).json();const c=s.connection||{};show(c.connected?'ok':/Connecting|retrying/.test(c.message||'')?'busy':'off',c.message||(c.connected?'Streamer.bot connected':'Streamer.bot disconnected'));}
  catch{show('off','Voyager host not answering');}
}
connect.onclick=async()=>{show('busy','Connecting to Streamer.bot…');try{const r=await api('/api/control',{type:'connect_saved'});text.textContent=r.message||'Connecting…';}catch(e){show('off',e.message);}setTimeout(refresh,1500);setTimeout(refresh,4000);};
disconnect.onclick=async()=>{try{await api('/api/control',{type:'disconnect'});}catch(e){show('off',e.message);}setTimeout(refresh,500);};
refresh();setInterval(()=>{if(!document.hidden)refresh();},5000);
})();
