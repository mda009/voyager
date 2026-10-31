/* Voyager shell (2.11): one grouped sidebar on every control page with a live status card,
   "Jump anywhere" (Ctrl K), a help panel for each page, and giveaway tabs.
   Load it before voyager-navigation.js. It only changes navigation; page tools stay where they are. */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(params.has('background')||params.has('embed'))return;
const demo=params.get('demo')==='1';
const here=location.pathname.split('/').pop()||'Voyager_Command_Center.html';
const subpage=window.VOYAGER_PAGE||params.get('page')||'home';
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const console_=document.body.classList.contains('voyager-console');
const BRAND_KEY='VoyagerBrandingV1';

// Canonical page list. group: null = top, then Live, Community, Setup. side:false = Ctrl K only.
const GIVEAWAY_FILES=['Giveaway_Control.html','Voyager_Ticket_Giveaway.html','Voyager_Entrant_Board.html'];
const PAGES=[
 {file:'Voyager_Command_Center.html',label:'Home',ico:'◈',group:null,keys:'home mission control dashboard command center',help:'COMMAND_CENTER_SETUP.html'},
 {file:'Giveaway_Control.html',label:'Giveaways',ico:'✦',group:'Live',keys:'giveaway draw winner pool chat members',help:'START_HERE.html',also:GIVEAWAY_FILES},
 {file:'Voyager_Ticket_Giveaway.html',label:'Ticketed giveaway',ico:'◇',group:'Live',side:false,keys:'ticket tickets watchtime weighted giveaway',help:'TICKET_GIVEAWAY_SETUP.html'},
 {file:'Voyager_Entrant_Board.html',label:'Entrant board',ico:'☷',group:'Live',side:false,keys:'entrants board list giveaway'},
 {file:'Voyager_Versus.html',label:'Voyager Versus',ico:'⚔',group:'Live',keys:'versus battle pilots fleet game',help:'VERSUS_SETUP.html'},
 {file:'Voyager_Dreadnought.html',label:'Voyager Dreadnought',ico:'☄',group:'Live',live:true,keys:'dreadnought boss fight raid co-op chat game fire join',help:'DREADNOUGHT_SETUP.html'},
 {file:'Voyager_Fleet_Control.html',label:'Support alerts',ico:'✧',group:'Live',keys:'support alerts fleet follow subscription raid bits',help:'FLEET_ALERTS_SETUP.html'},
 {file:'Voyager_Banner_Control.html',label:'Stream banner',ico:'▰',group:'Live',keys:'banner message ticker',help:'BANNER_SETUP.html'},
 {file:'Voyager_Command_Center.html',page:'live',label:'Live dashboard',ico:'◉',group:'Live',keys:'live dashboard audiences viewers obs strip',help:'DASHBOARD_PAGES_SETUP.html'},
 {file:'Voyager_Points.html',label:'Points & members',ico:'★',group:'Community',keys:'points members membership tiers silver gold platinum ledger',help:'POINTS_SETUP.html'},
 {file:'Voyager_Missions.html',label:'Missions',ico:'◆',group:'Community',live:true,keys:'missions weekly rewards badges streak',help:'Voyager_Guide.html'},
 {file:'Voyager_Seasons.html',label:'Seasons',ico:'⟳',group:'Community',live:true,keys:'season seasons standings hall of fame champion',help:'Voyager_Guide.html'},
 {file:'Voyager_Public_Site.html',label:'Public website',ico:'◎',group:'Community',keys:'public website site viewers voyagercommand fourthwall',live:true,help:'Voyager_Guide.html'},
 {file:'Voyager_Security.html',label:'Security',ico:'⛨',group:'Community',keys:'security reports signals accounts',help:'SECURITY_SETUP.html'},
 {file:'Voyager_Command_Center.html',page:'reporting',label:'Reporting',ico:'▥',group:'Community',keys:'reporting reports twitch statistics analytics',help:'TWITCH_ANALYTICS_SETUP.html'},
 {file:'Voyager_Commands.html',label:'Chat commands',ico:'⌘',group:'Setup',keys:'chat commands command ticket enter versus duplicates cooldown',help:'Voyager_Guide.html'},
 {file:'Voyager_System_Check.html',label:'System check',ico:'✓',group:'Setup',keys:'system check health streamer.bot connection data folder',live:true,help:'Voyager_Guide.html'},
 {file:'Voyager_Guide.html',label:'Help',ico:'?',group:'Setup',keys:'help guide setup instructions updates'},
 {file:'Voyager_Settings.html',label:'Settings',ico:'⚙',group:'Setup',side:false,live:true,keys:'settings connection streamer.bot password address port logos branding',help:'Voyager_Guide.html'}
].filter(p=>!(demo&&p.live));
const GUIDES=[
 ['START_HERE.html','Getting started'],['TICKET_GIVEAWAY_SETUP.html','Ticket giveaway setup'],['POINTS_SETUP.html','Points setup & history'],
 ['POINTS_ADMIN_SETUP.html','Points member controls'],['WATCHTIME_SETUP.html','Watchtime points'],['VERSUS_SETUP.html','Voyager Versus setup'],
 ['FLEET_ALERTS_SETUP.html','Support alerts setup'],['BANNER_SETUP.html','Stream banner setup'],['SECURITY_SETUP.html','Security setup'],
 ['COMMAND_CENTER_SETUP.html','Command center setup'],['LEADERBOARD_PANEL_SETUP.html','Leaderboard panel setup'],['BUCKET_OVERLAY_SETUP.html','OBS progress strip setup'],
 ['TWITCH_ANALYTICS_SETUP.html','Twitch analytics setup'],['EXTERNAL_ANALYTICS_SETUP.html','External analytics'],['NATIVE_COMMUNITY_SETUP.html','Native community setup'],
 ['BRAND_REFRESH_SETUP.html','Stream branding & preview'],['DREADNOUGHT_SETUP.html','Voyager Dreadnought setup']
];
const canonical=new Set([...PAGES.map(p=>p.file),'START_HERE.html','COMMAND_CENTER_SETUP.html','Voyager_Settings.html']);
const hrefOf=p=>{let h=p.file+(p.page?'?page='+p.page:'');if(demo&&!/SETUP|START_HERE|Guide|Settings/.test(p.file))h+=(h.includes('?')?'&':'?')+'demo=1';return h;};
const matches=p=>(p.also||[p.file]).includes(here)&&(p.file!=='Voyager_Command_Center.html'||(p.page||'home')===subpage);
const current=PAGES.find(p=>p.file===here&&(p.file!=='Voyager_Command_Center.html'||(p.page||'home')===subpage));
const el=(tag,attrs={},...kids)=>{const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else n.setAttribute(k,v);}n.append(...kids);return n;};
const fileOf=a=>{try{return new URL(a.getAttribute('href'),location.href).pathname.split('/').pop();}catch{return '';}};

// Branding choices (Settings › Branding & logos)
function branding(){try{return {partnersHome:true,partnersSidebar:true,...JSON.parse(localStorage.getItem(BRAND_KEY)||'{}')};}catch{return {partnersHome:true,partnersSidebar:true};}}
function setBranding(next){try{localStorage.setItem(BRAND_KEY,JSON.stringify({...branding(),...next}));}catch{}applyBranding();}
function partnerRow(cls,label){return el('div',{class:cls},el('span',{text:label}),el('img',{src:'brand-assets/mda009.png',alt:'MDA009'}),el('img',{src:'brand-assets/unprofessionals.png',alt:'The Unprofessionals'}));}
function applyBranding(){
 const b=branding();
 document.querySelectorAll('.vg-presented').forEach(n=>n.hidden=!b.partnersSidebar);
 document.querySelectorAll('.vg-home-partners').forEach(n=>n.hidden=!b.partnersHome);
}

// Sidebar
const side=document.querySelector('aside.rail, aside.sidebar');
let statusCard=null;
if(side&&console_){
 for(const nav of side.querySelectorAll('nav:not(#presets)'))nav.remove();
 for(const a of side.querySelectorAll('a.help-link, a.brand-update-link, #presets > a[href]'))if(canonical.has(fileOf(a))||/SETUP\.html$|START_HERE/.test(fileOf(a))||a.classList.contains('brand-update-link'))a.remove();
 const nav=el('nav',{class:'vg-nav','aria-label':'Voyager pages'});
 let group;
 for(const p of PAGES){
  if(p.side===false)continue;
  if(p.group!==group){group=p.group;if(group)nav.append(el('div',{class:'vg-group','aria-hidden':'true',text:group}));}
  const a=el('a',{href:hrefOf(p)},el('span',{class:'vg-ico','aria-hidden':'true',text:p.ico}),el('span',{text:p.label}));
  if(p.page)a.dataset.dashboardPage=p.page;
  if(p.file==='Giveaway_Control.html')a.id='giveaway-link';
  if(matches(p)){a.classList.add('active');a.setAttribute('aria-current','page');}
  nav.append(a);
 }
 const jump=el('button',{type:'button',class:'vg-jump','aria-label':'Jump anywhere (Ctrl K)'},el('span',{text:'Jump to…'}),el('kbd',{text:'Ctrl K'}));
 jump.addEventListener('click',()=>openPalette());
 const brand=side.querySelector(':scope > .brand');
 if(brand){const small=brand.querySelector('small');if(small)small.textContent='MDA009 · MISSION CONTROL';brand.after(jump,nav);}else side.prepend(jump,nav);
 const rest=nav.nextElementSibling;if(rest&&!rest.matches('.rail-bottom'))rest.classList.add('vg-page-tools');
 // Footer: live status, Settings, and a small "Presented by" row.
 const row=(key,label)=>el('li',{'data-key':key,'data-state':'wait'},el('span',{class:'vg-dot','aria-hidden':'true'}),el('span',{class:'vg-name',text:label}),el('span',{class:'vg-state',text:'Checking'}));
 statusCard=el('div',{class:'vg-foot'},
  el('ul',{class:'vg-status','aria-label':'Connection status','aria-live':'polite'},row('sb','Streamer.bot'),row('host','Voyager'),row('site','Public site')),
  el('div',{class:'vg-foot-links'},
   el('a',{href:'Voyager_Settings.html',class:here==='Voyager_Settings.html'?'active':'', ...(here==='Voyager_Settings.html'?{'aria-current':'page'}:{})},'⚙ Settings'),
   el('a',{href:'Voyager_System_Check.html'},'System check')));
 if(demo){statusCard.querySelector('.vg-status').replaceChildren(el('li',{'data-state':'demo'},el('span',{class:'vg-dot','aria-hidden':'true'}),el('span',{class:'vg-name',text:'Demo mode'}),el('span',{class:'vg-state',text:'Sample data'})));statusCard.querySelector('.vg-foot-links').remove();}
 side.append(statusCard,partnerRow('vg-presented','PRESENTED BY'));
 if(side.querySelector('.rail-bottom'))side.querySelector('.rail-bottom').remove();
}

// Giveaway tabs: the three giveaway screens read as one place.
if(console_&&GIVEAWAY_FILES.slice(0,2).includes(here)){
 const head=document.querySelector('main .page-head, main .top');
 const tab=(file,label,extra={})=>{const a=el('a',{href:file+(demo&&!extra.target?'?demo=1':''),...extra},label);if(file===here){a.classList.add('active');a.setAttribute('aria-current','page');}return a;};
 const tabs=el('nav',{class:'vg-subtabs','aria-label':'Giveaway types'},tab('Giveaway_Control.html','Chat & members'),tab('Voyager_Ticket_Giveaway.html','Ticketed'),tab('Voyager_Entrant_Board.html','Entrant board ↗',{target:'_blank',rel:'noopener'}));
 if(head)head.after(tabs);
}

// Help panel for this page
const help=current?.help;
if(console_&&help){
 const head=document.querySelector('main .page-head, main .top');
 if(head){
  const btn=el('button',{type:'button',class:'vg-help-btn','aria-label':'Help for this page','aria-expanded':'false',title:'Help for this page'},'?');
  head.classList.add('vg-has-help');head.append(btn);
  let panel=null;
  const close=()=>{if(panel){panel.hidden=true;btn.setAttribute('aria-expanded','false');btn.focus();}};
  btn.addEventListener('click',()=>{
   if(!panel){
    const x=el('button',{type:'button',class:'vg-help-close','aria-label':'Close help'},'✕');x.addEventListener('click',close);
    panel=el('aside',{class:'vg-help','aria-label':'Help: '+current.label},
     el('div',{class:'vg-help-head'},el('span',{class:'vg-help-title',text:'Help · '+current.label}),el('a',{href:help,target:'_blank',rel:'noopener'},'Open full guide ↗'),x),
     el('iframe',{src:help,title:'Help for '+current.label,loading:'lazy'}));
    panel.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
    document.body.append(panel);
   }
   if(btn.getAttribute('aria-expanded')==='true'){close();return;}
   panel.hidden=false;btn.setAttribute('aria-expanded','true');panel.querySelector('.vg-help-close').focus();
  });
 }
}

// Home: partner logos once, in the welcome panel (rendered later by the dashboard script).
if(console_&&here==='Voyager_Command_Center.html'&&subpage==='home'){
 const place=()=>{const intro=document.querySelector('.home-intro');if(intro&&!intro.querySelector('.vg-home-partners')){intro.append(partnerRow('vg-home-partners','PRESENTED BY'));applyBranding();}};
 place();const box=document.getElementById('dashboard-content');if(box)new MutationObserver(place).observe(box,{childList:true});
}
applyBranding();

// Live status (sidebar footer)
function setStatus(key,state,text,title){const li=statusCard?.querySelector(`[data-key="${key}"]`);if(!li)return;li.dataset.state=state;li.querySelector('.vg-state').textContent=text;if(title)li.title=title;else li.removeAttribute('title');}
let token='';
async function local(path,withToken){
 if(withToken&&!token)token=(await(await fetch('/api/admin',{cache:'no-store'})).json()).token;
 const r=await fetch(path,{cache:'no-store',headers:withToken?{'X-Voyager-Token':token}:{}});if(!r.ok)throw new Error(String(r.status));return r.json();
}
function config(){return window.VOYAGER_CONFIG?Promise.resolve(window.VOYAGER_CONFIG):new Promise(resolve=>{const s=el('script',{src:'config.js'});s.onload=()=>resolve(window.VOYAGER_CONFIG||null);s.onerror=()=>resolve(null);document.head.append(s);});}
function probe(cfg){
 return new Promise(resolve=>{
  if(!cfg){resolve(['off','No config.js']);return;}
  let ws,done=false;const finish=v=>{if(done)return;done=true;clearTimeout(t);try{ws&&ws.close();}catch{}resolve(v);};
  const t=setTimeout(()=>finish(['error','No answer']),4000);
  try{ws=new WebSocket(`${cfg.secure?'wss':'ws'}://${cfg.host||'127.0.0.1'}:${cfg.port||8080}${cfg.path||'/'}`);}catch{finish(['error','Check address']);return;}
  ws.onopen=()=>finish(['ok','Connected']);ws.onerror=()=>finish(['error','Offline']);
 });
}
async function refresh(){
 if(!statusCard||demo)return;
 config().then(probe).then(([s,t])=>setStatus('sb',s,t,s==='error'?'Streamer.bot is not answering. Check it is open and its WebSocket server is on (Settings).':''));
 if(!hosted){setStatus('host','off','Not running','Start Voyager to see live status.');setStatus('site','off','—');return;}
 try{const h=await local('/api/health');setStatus('host','ok','v'+h.version);}catch{setStatus('host','error','Stopped');setStatus('site','off','—');return;}
 try{const v=await local('/api/public-site',true),u=v.upload||{};
  if(!u.enabled)setStatus('site','off','Off','Set up in Public website.');
  else if(u.lastError)setStatus('site','error','Problem',u.lastError);
  else setStatus('site','ok','Live',v.siteUrl||'');
 }catch{setStatus('site','off','—');}
}
if(statusCard&&!demo){refresh();setInterval(()=>{if(!document.hidden)refresh();},60000);}

// Jump anywhere
let box,input,list,items=[],selected=0,lastFocus=null;
function entries(){
 const out=PAGES.map(p=>({section:'Pages',label:p.label,hint:p.group||'',ico:p.ico,keys:p.keys,go:()=>{location.href=hrefOf(p);}}));
 for(const h of document.querySelectorAll('main h2'))if(h.offsetParent&&h.textContent.trim())out.push({section:'On this page',label:h.textContent.trim(),hint:'',ico:'↓',keys:'',go:()=>{close();h.scrollIntoView({behavior:'smooth',block:'start'});}});
 for(const [f,label] of GUIDES)out.push({section:'Help & setup',label,hint:'Guide',ico:'?',keys:'help setup guide',go:()=>{location.href=f;}});
 return out;
}
function render(){
 const q=input.value.trim().toLowerCase(),words=q.split(/\s+/).filter(Boolean);
 const all=entries().filter(e=>words.every(w=>(e.label+' '+e.keys+' '+e.section).toLowerCase().includes(w)));
 items=q?all:all.filter(e=>e.section!=='Help & setup').concat(all.filter(e=>e.section==='Help & setup').slice(0,4));
 selected=Math.min(selected,Math.max(items.length-1,0));
 list.replaceChildren();let section;
 items.forEach((e,i)=>{
  if(e.section!==section){section=e.section;list.append(el('li',{class:'vg-head',role:'presentation',text:section}));}
  const li=el('li',{class:'vg-item',role:'option',id:'vg-opt-'+i,'aria-selected':String(i===selected)},el('span',{class:'vg-ico','aria-hidden':'true',text:e.ico}),el('span',{class:'vg-label',text:e.label}),el('span',{class:'vg-hint',text:e.hint}));
  li.addEventListener('mousemove',()=>{if(selected!==i){selected=i;mark();}});
  li.addEventListener('click',()=>e.go());
  list.append(li);
 });
 if(!items.length)list.append(el('li',{class:'vg-empty',text:'Nothing matches. Try "giveaway", "banner" or "settings".'}));
 mark();
}
function mark(){list.querySelectorAll('.vg-item').forEach((li,i)=>li.setAttribute('aria-selected',String(i===selected)));const cur=list.querySelector('#vg-opt-'+selected);if(cur){input.setAttribute('aria-activedescendant',cur.id);cur.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');}
function build(){
 input=el('input',{type:'text',placeholder:'Type a page or setup guide…','aria-label':'Jump to a page',role:'combobox','aria-expanded':'true','aria-controls':'vg-results',autocomplete:'off',spellcheck:'false'});
 list=el('ul',{id:'vg-results',role:'listbox','aria-label':'Results'});
 const search=el('label',{class:'vg-search'},el('span',{'aria-hidden':'true',text:'⌕'}),input,el('kbd',{text:'Esc'}));
 const foot=el('div',{class:'vg-foot-keys'},el('span',{},el('kbd',{text:'↑'}),' ',el('kbd',{text:'↓'}),' move'),el('span',{},el('kbd',{text:'Enter'}),' open'),el('span',{style:'margin-left:auto',text:'Ctrl K from any page'}));
 box=el('div',{class:'vg-palette',role:'dialog','aria-modal':'true','aria-label':'Jump anywhere',hidden:''},el('div',{class:'vg-box'},search,list,foot));
 box.addEventListener('mousedown',e=>{if(e.target===box)close();});
 input.addEventListener('input',()=>{selected=0;render();});
 input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();if(items.length){selected=(selected+1)%items.length;mark();}}
  else if(e.key==='ArrowUp'){e.preventDefault();if(items.length){selected=(selected-1+items.length)%items.length;mark();}}
  else if(e.key==='Enter'){e.preventDefault();items[selected]?.go();}
  else if(e.key==='Escape'){e.preventDefault();close();}
  else if(e.key==='Tab')e.preventDefault();
 });
 document.body.append(box);
}
function openPalette(){if(!box)build();if(!box.hidden)return;lastFocus=document.activeElement;box.hidden=false;input.value='';selected=0;render();input.focus();}
function close(){if(!box||box.hidden)return;box.hidden=true;lastFocus?.focus?.();}
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==='k'){e.preventDefault();box&&!box.hidden?close():openPalette();}
});
window.VoyagerShell={open:openPalette,close,branding,setBranding};
})();
