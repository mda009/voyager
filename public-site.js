// Public website control page. Reads saved giveaway, ticket and points state (never changes it),
// projects only public-safe fields, and hands them to the local Voyager host to publish.
import * as M from './public-feed-model.mjs';

const $=id=>document.getElementById(id);
const background=new URLSearchParams(location.search).get('background')==='1';
const hosted=location.protocol==='http:'&&['127.0.0.1','localhost'].includes(location.hostname);
let token='',view=null,settings=M.normalizeSettings({}),lastSent='',previewAt=0,collectTimer=null;
const states={giveaway:null,tickets:null,points:null};
const status={giveaway:'Connecting…',tickets:'Connecting…',points:'Connecting…'};
const live={giveaway:false,tickets:false,points:false};
// A source is settled once it has loaded or reported that it is unavailable. Nothing is sent before that,
// so opening this page never publishes an empty site.
const settled={giveaway:false,tickets:false,points:false};let startedAt=Date.now();

function feedback(text,error=false){const f=$('feedback');f.hidden=!text;f.textContent=text||'';f.dataset.error=String(error);}
async function api(path,body){
  const r=await fetch(path,{method:body?'POST':'GET',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const data=await r.json().catch(()=>({}));if(!r.ok||data.ok===false)throw new Error(data.message||'Voyager could not complete that.');return data;
}

// ---------- read-only connections ----------
class GiveawayReader extends window.VoyagerConnection{
  command(op){return op==='sync'?this.sync():Promise.reject(Error('The public website only reads saved giveaways.'));}
  refreshMembers(){return Promise.resolve(null);}
  scheduleSync(gen,delay){super.scheduleSync(gen,Math.min(delay,20000));}
}
function watch(name,client,event,pick){
  client.addEventListener('status',e=>{const s=e.detail.state;if(s==='error'){settled[name]=true;schedule();}live[name]=s==='live'||s==='recovering'&&!!states[name];status[name]=s==='error'?e.detail.message:s==='live'?'Live':e.detail.message||s;renderSources();});
  client.addEventListener(event,e=>{states[name]=pick(e.detail);settled[name]=true;live[name]=true;status[name]='Live';renderSources();schedule();});
  client.connect();return client;
}
function startReaders(){
  startedAt=Date.now();
  if(!window.VoyagerTicketConnection)settled.tickets=true;
  if(!window.VoyagerPointsConnection)settled.points=true;
  watch('giveaway',new GiveawayReader({}),'state',d=>d?.state||null);
  if(window.VoyagerTicketConnection)watch('tickets',new window.VoyagerTicketConnection({}),'tickets',d=>d?.state||null);
  if(window.VoyagerPointsConnection)watch('points',new window.VoyagerPointsConnection(window.VOYAGER_CONFIG||{}),'points',d=>d||null);
}
function renderSources(){
  if(background)return;
  const box=$('sources');box.textContent='';
  for(const [k,label] of [['giveaway','Giveaways'],['tickets','Ticket giveaways'],['points','Points & goals']]){
    const s=document.createElement('span');s.className='ps-source';s.dataset.live=String(live[k]);
    s.textContent=label+' · '+(live[k]?'Live':status[k]);box.append(s);
  }
}

// ---------- collect and send ----------
function collect(){
  const now=Date.now(),giveaways=[];
  const g=states.giveaway&&M.projectGiveaway(states.giveaway,settings,now);if(g)giveaways.push(g);
  const t=states.tickets&&M.projectTicket(states.tickets,settings,now);if(t)giveaways.push(t);
  const p=states.points?M.projectPoints(states.points,settings):{leaders:[],goals:[]};
  return {giveaways,points:{available:!!states.points,...p},sources:{giveaway:live.giveaway,tickets:live.tickets,points:live.points}};
}
function schedule(){clearTimeout(collectTimer);collectTimer=setTimeout(send,1500);}
async function send(){
  clearTimeout(collectTimer);collectTimer=setTimeout(send,30000);
  if(!token)return;
  if(Object.values(settled).includes(false)&&Date.now()-startedAt<20000)return;
  sendMembers();
  const body=collect(),json=JSON.stringify(body);
  try{
    const r=await api('/api/public-site/feed',body);view=r.status;renderStatus();
    if(!background){$('feed-json').textContent=JSON.stringify(r.feed,null,2);if(json!==lastSent&&Date.now()-previewAt>20000)reloadPreview();}
    lastSent=json;
  }catch(e){if(!background)feedback(e.message,true);}
}
// Missions and seasons (2.13): the host needs each member's points to work out weekly and season progress.
// This stays on this PC (127.0.0.1); only counts and top-10 standings ever reach the public site.
let lastMembers='';
async function sendMembers(){
  const users=states.points?.users;if(!Array.isArray(users)||!users.length)return;
  const members=users.filter(u=>u&&u.key&&u.pointsFresh!==false).map(u=>({key:u.key,name:u.name||u.login||'',login:u.login||'',capturedIn:Number.isFinite(Number(u.capturedIn))?Number(u.capturedIn):null,points:Number.isFinite(Number(u.points))?Number(u.points):null}));
  const json=JSON.stringify(members);if(json===lastMembers&&Date.now()-(sendMembers.at||0)<300000)return;
  try{await api('/api/community/members',{members});lastMembers=json;sendMembers.at=Date.now();}catch{}
}
function reloadPreview(){previewAt=Date.now();const f=$('preview');f.src='/public/?preview='+previewAt;}

// ---------- settings forms ----------
function fillForms(){
  const s=settings,sf=$('sections-form');
  for(const k of Object.keys(M.DEFAULT_SETTINGS.sections))sf.elements[k].checked=s.sections[k];
  sf.elements.showNames.checked=s.showNames;sf.elements.leaderboardSize.value=s.leaderboardSize;
  const cf=$('channel-form').elements;
  cf.channelName.value=s.channelName;cf.tagline.value=s.tagline;
  for(const k of Object.keys(M.DEFAULT_SETTINGS.links))cf[k].value=s.links[k];
  for(const k of Object.keys(M.DEFAULT_SETTINGS.commands))cf['cmd-'+k].value=s.commands[k];
  for(const k of ['silver','gold','platinum'])cf['goal-'+k].value=s.goalNames[k];
  cf.intro.value=s.program.intro;
  cf.commands.value=s.program.commands.map(c=>c.command+' - '+c.description).join('\n');
  const tiers=$('tier-fields');tiers.textContent='';
  const byKey=Object.fromEntries(s.program.tiers.map(t=>[t.key,t]));
  for(const d of M.DEFAULT_SETTINGS.program.tiers){
    const t=byKey[d.key]||{name:'',description:''};
    const row=document.createElement('div');row.className='ps-tier';row.dataset.key=d.key;
    const name=Object.assign(document.createElement('input'),{value:t.name,placeholder:d.name+' (leave empty to hide)',maxLength:60});name.setAttribute('aria-label',d.name+' tier name');name.dataset.field='name';
    const desc=Object.assign(document.createElement('input'),{value:t.description,placeholder:'What '+d.name+' members get (optional)',maxLength:160});desc.setAttribute('aria-label',d.name+' tier description');desc.dataset.field='description';
    row.append(name,desc);tiers.append(row);
  }
  const pf=$('publish-form').elements;pf.repo.value=s.publish.repo;pf.siteUrl.value=s.publish.siteUrl||'';pf.enabled.checked=s.publish.enabled;
  pf.token.value='';pf.token.placeholder=view?.hasToken?'Saved on this PC · paste a new one to replace':'github_pat_…';
}
function readForms(){
  const sf=$('sections-form').elements,cf=$('channel-form').elements,pf=$('publish-form').elements;
  const sections={};for(const k of Object.keys(M.DEFAULT_SETTINGS.sections))sections[k]=sf[k].checked;
  const links={};for(const k of Object.keys(M.DEFAULT_SETTINGS.links))links[k]=cf[k].value.trim();
  const commands={};for(const k of Object.keys(M.DEFAULT_SETTINGS.commands))commands[k]=cf['cmd-'+k].value.trim();
  const goalNames={};for(const k of ['silver','gold','platinum'])goalNames[k]=cf['goal-'+k].value.trim();
  const tiers=[...document.querySelectorAll('.ps-tier')].map(r=>({key:r.dataset.key,name:r.querySelector('[data-field=name]').value.trim(),description:r.querySelector('[data-field=description]').value.trim()})).filter(t=>t.name);
  const cmds=cf.commands.value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const m=/^(!\S+)\s*[-–:]?\s*(.*)$/.exec(l);return m?{command:m[1],description:m[2]}:null;}).filter(Boolean);
  return {channelName:cf.channelName.value,tagline:cf.tagline.value,links,sections,showNames:sf.showNames.checked,leaderboardSize:Number(sf.leaderboardSize.value),commands,goalNames,
    program:{intro:cf.intro.value,tiers,commands:cmds},publish:{enabled:pf.enabled.checked,repo:pf.repo.value.trim(),siteUrl:pf.siteUrl.value.trim()}};
}
function invalidLinks(){
  const cf=$('channel-form').elements,site=$('publish-form').elements.siteUrl.value.trim();
  return Object.keys(M.DEFAULT_SETTINGS.links).filter(k=>cf[k].value.trim()&&!M.safeUrl(cf[k].value)).concat(site&&!M.safeUrl(site)?['your web address']:[]);
}
async function save(extra={},message='Saved.'){
  const bad=invalidLinks();if(bad.length){feedback('Links must start with https:// ('+bad.join(', ')+').',true);return;}
  try{
    const r=await api('/api/public-site/settings',{settings:readForms(),...extra});
    view=r;settings=r.settings;fillForms();renderStatus();feedback(message);lastSent='';send();
    for(const ms of [3000,8000])setTimeout(async()=>{try{view=await api('/api/public-site');renderStatus();}catch{}},ms);
  }catch(e){feedback(e.message,true);}
}
function renderStatus(){
  if(background||!view)return;
  const pill=$('publish-pill'),u=view.upload,open=$('open-site'),st=$('publish-status');
  if(view.siteUrl){open.hidden=false;open.href=view.siteUrl;}else open.hidden=true;
  const code=view.siteUrl?M.embedSnippet(view.siteUrl):'';$('embed-card').hidden=!code;
  if(code&&$('embed-code').value!==code){$('embed-code').value=code;$('embed-src').textContent=view.siteUrl+'?embed=1';}
  if(!u.enabled){pill.textContent=view.settings.publish.enabled?'Needs repository and token':'Not published';pill.dataset.state='off';}
  else if(u.lastError){pill.textContent='Publishing problem';pill.dataset.state='error';}
  else if(u.lastOkAt){pill.textContent='Published '+ago(u.lastOkAt);pill.dataset.state='ok';}
  else{pill.textContent='Publishing soon';pill.dataset.state='wait';}
  const parts=[];
  if(u.lastError)parts.push(u.lastError);
  if(u.lastOkAt)parts.push('Last published '+ago(u.lastOkAt)+'. Viewers see changes within about 5 minutes.');
  if(view.siteUrl)parts.push('Public site: '+view.siteUrl);
  st.textContent=parts.join(' ');st.dataset.error=String(!!u.lastError);
  $('token-hint').dataset.saved=String(view.hasToken);
}
function ago(t){const s=Math.round((Date.now()-t)/1000);return s<60?'just now':s<3600?Math.round(s/60)+' min ago':Math.round(s/3600)+' h ago';}

async function start(){
  if(!hosted){$('not-hosted').hidden=false;return;}
  try{token=(await(await fetch('/api/admin',{cache:'no-store'})).json()).token;view=await api('/api/public-site');settings=view.settings;}
  catch(e){feedback('This Voyager host is too old for the public website, or it is not running. Restart Voyager after updating.',true);return;}
  if(!background){
    fillForms();renderStatus();renderSources();reloadPreview();
    $('sections-form').addEventListener('change',()=>save({},'Saved. The preview updates in a moment.'));
    $('channel-form').addEventListener('submit',e=>{e.preventDefault();save();});
    $('publish-form').addEventListener('submit',e=>{e.preventDefault();const t=$('publish-form').elements.token.value.trim();save(t?{token:t}:{},'Publishing settings saved.');});
    $('clear-token').addEventListener('click',()=>save({clearToken:true},'Token removed from this PC.'));
    $('publish-now').addEventListener('click',async()=>{try{await send();const r=await api('/api/public-site/publish-now',{});view=r.status;renderStatus();feedback(r.message);}catch(e){feedback(e.message,true);}});
    $('reload-preview').addEventListener('click',reloadPreview);
    $('copy-embed').addEventListener('click',async()=>{const box=$('embed-code');try{await navigator.clipboard.writeText(box.value);feedback('Code copied. Paste it into a Fourthwall Custom code section.');}catch{box.focus();box.select();feedback('Press Ctrl+C to copy the selected code.');}});
    setInterval(async()=>{try{view=await api('/api/public-site');renderStatus();}catch{}},15000);
  }else{
    // Background copy in the Voyager app: pick up settings changes made elsewhere.
    setInterval(async()=>{try{view=await api('/api/public-site');settings=view.settings;}catch{}},60000);
  }
  startReaders();collectTimer=setTimeout(send,3000);
}
start();
