/* Voyager Settings page (2.11). Edits the Streamer.bot connection in config.js through the local
   Voyager host, and keeps the Voyager Control branding choices in this browser. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const BRAND_KEY='VoyagerBrandingV1';
let token='';

// Tabs
const tabs=[...document.querySelectorAll('.st-tabs [role=tab]')];
function select(tab,focus){for(const t of tabs){const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;$(t.getAttribute('aria-controls')).hidden=!on;}if(focus)tab.focus();try{history.replaceState(null,'','#'+tab.id.slice(4));}catch{}}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{const d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();select(tabs[(i+d+tabs.length)%tabs.length],true);}});});
const start=tabs.find(t=>t.id==='tab-'+location.hash.slice(1));if(start)select(start);else select(tabs[0]);

async function api(path,options={}){
  if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{...options,headers:{'X-Voyager-Token':token,...(options.body?{'Content-Type':'application/json'}:{})}});
  const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.message||('Voyager answered '+r.status));return data;
}
const msg=(el,text,state)=>{el.textContent=text;if(state)el.dataset.state=state;else delete el.dataset.state;};

// Connection
const form=$('connection-form'),cfg=window.VOYAGER_CONFIG||{};
function fill(c){form.host.value=c.host;form.port.value=c.port;form.password.value='';form.password.placeholder=c.hasPassword?'Saved · leave blank to keep it':'No password set';form.requireAuthentication.checked=!!c.requireAuthentication;$('clear-password').hidden=!c.hasPassword;if(c.file)$('config-file').textContent='Saved in '+c.file;}
function probe(host,port){
  const pill=$('sb-status');pill.dataset.state='wait';pill.textContent='Checking…';
  return new Promise(resolve=>{
    let ws,done=false;const finish=(ok,text)=>{if(done)return;done=true;clearTimeout(t);try{ws&&ws.close();}catch{}pill.dataset.state=ok?'ok':'error';pill.textContent=text;resolve(ok);};
    const t=setTimeout(()=>finish(false,'No answer'),4000);
    try{ws=new WebSocket(`${cfg.secure?'wss':'ws'}://${host.includes(':')&&!host.startsWith('[')?'['+host+']':host}:${port}${cfg.path||'/'}`);}catch{finish(false,'Address not valid');return;}
    ws.onopen=()=>finish(true,'Reachable');ws.onerror=()=>finish(false,'Not reachable');
  });
}
if(hosted){
  api('/api/settings/connection').then(c=>{fill(c);probe(c.host,c.port);}).catch(e=>{msg($('connection-msg'),e.message,'error');fill({host:cfg.host||'127.0.0.1',port:cfg.port||8080,hasPassword:!!cfg.password,requireAuthentication:!!cfg.requireAuthentication});probe(form.host.value,form.port.value);});
}else{
  $('not-hosted').hidden=false;$('saved-where').textContent='Read only';
  fill({host:cfg.host||'127.0.0.1',port:cfg.port||8080,hasPassword:!!cfg.password,requireAuthentication:!!cfg.requireAuthentication});
  for(const el of form.querySelectorAll('input,button[type=submit],#clear-password'))if(el.id!=='test-connection')el.disabled=true;
  probe(form.host.value,form.port.value);
}
async function save(extra={}){
  const out=$('connection-msg');msg(out,'Saving…');
  try{
    const body={host:form.host.value.trim(),port:Number(form.port.value),requireAuthentication:form.requireAuthentication.checked,...extra};
    if(form.password.value)body.password=form.password.value;
    const c=await api('/api/settings/connection',{method:'POST',body:JSON.stringify(body)});fill(c);
    msg(out,'Saved. Reload open Voyager pages and refresh OBS browser sources to use it.','ok');probe(c.host,c.port);
  }catch(e){msg(out,e.message,'error');}
}
form.addEventListener('submit',e=>{e.preventDefault();save();});
$('test-connection').addEventListener('click',()=>probe(form.host.value.trim(),Number(form.port.value)));
$('clear-password').addEventListener('click',()=>{form.password.value='';save({clearPassword:true});});

// Branding
const bf=$('branding-form');
const brand=window.VoyagerShell?.branding?.()||(()=>{try{return {partnersHome:true,partnersSidebar:true,...JSON.parse(localStorage.getItem(BRAND_KEY)||'{}')};}catch{return {partnersHome:true,partnersSidebar:true};}})();
bf.partnersHome.checked=brand.partnersHome!==false;bf.partnersSidebar.checked=brand.partnersSidebar!==false;
bf.addEventListener('change',()=>{const next={partnersHome:bf.partnersHome.checked,partnersSidebar:bf.partnersSidebar.checked};if(window.VoyagerShell?.setBranding)window.VoyagerShell.setBranding(next);else try{localStorage.setItem(BRAND_KEY,JSON.stringify(next));}catch{}});

// Public website + app
const when=t=>t?new Date(t).toLocaleString():'—';
if(hosted){
  api('/api/public-site').then(v=>{
    const up=v.upload||{};$('site-status').textContent=up.enabled?(up.lastError?'Problem: '+up.lastError:'Publishing while Voyager runs'):'Not publishing yet';
    $('site-url').textContent=v.siteUrl||'—';$('site-last').textContent=when(up.lastOkAt);
    if(v.siteUrl){$('site-open').href=v.siteUrl;$('site-open').hidden=false;}
  }).catch(()=>{$('site-status').textContent='Not available in this package';});
  api('/api/system').then(s=>{$('app-version').textContent=s.version;$('app-data').textContent=s.dataDir+(s.dataWritable?'':' (cannot save here)');$('app-node').textContent=s.node;}).catch(()=>{});
}else{$('site-status').textContent='Open from the Voyager app to see this';}
})();
