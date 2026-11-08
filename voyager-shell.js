/* Voyager shell (2.21.0): thirteen destinations in one sidebar on every control page, the destination's pages as tabs under
   the title, a shared status bar (Streamer.bot · Voyager · OBS sources · website · points owed), "Jump anywhere" (Ctrl K),
   a help panel for each page, and the duplicate OBS / Streamer.bot set-up cards folded to one line.
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

// 2.21.0: thirteen destinations (was 27 pages). Each destination is one sidebar entry; the pages inside it read as tabs under the
// page title, so nothing moved on disk and every old link still works. group: Operate, Games & events, On screen, Community, Setup.
const GIVEAWAY_FILES=['Giveaway_Control.html','Voyager_Ticket_Giveaway.html','Voyager_Entrant_Board.html'];
const DESTINATIONS=[
 {id:'live',label:'Live',ico:'▶',group:'Operate',live:true,help:'Voyager_Guide.html',keys:'live stream deck operate connect chat dreadnought versus panels goal fx tests new stream publish cockpit',
  tabs:[['Voyager_Stream_Deck.html','Live'],['Voyager_Command_Center.html?page=live','Dashboard']]},
 {id:'dread',label:'Dreadnought',ico:'☄',group:'Games & events',help:'DREADNOUGHT_SETUP.html',keys:'dreadnought boss fight raid co-op chat game fire join stage mvp',
  tabs:[['Voyager_Dreadnought.html','Dreadnought']]},
 {id:'versus',label:'Versus',ico:'⚔',group:'Games & events',help:'VERSUS_SETUP.html',keys:'versus battle pilots fleet game arena hangar',
  tabs:[['Voyager_Versus.html','Versus']]},
 {id:'give',label:'Giveaways',ico:'✦',group:'Games & events',help:'START_HERE.html',keys:'giveaway draw winner pool chat members ticket tickets watchtime weighted entrants board',
  tabs:[['Giveaway_Control.html','Chat & members'],['Voyager_Ticket_Giveaway.html','Ticketed'],['Voyager_Entrant_Board.html','Entrant board ↗',{blank:true}]]},
 {id:'engage',label:'Chat engagement',ico:'✺',group:'Games & events',live:true,help:'Voyager_Guide.html',keys:'chat engagement report muster quiz trivia squadron squadrons team relay comms arrival log captain recap commands command cooldown duplicates',
  tabs:[['Voyager_Engage.html','Chat engagement'],['Voyager_Commands.html','Chat commands']]},
 {id:'screen',label:'Screen & overlays',ico:'▦',group:'On screen',live:true,help:'MOMENTS_SETUP.html',keys:'screen overlays obs sources browser source layout positions canvas drag arrange moments ticker hints surge banner support alerts fleet camera stage',
  tabs:[['Voyager_Screen.html','Sources'],['Voyager_Screen_Layout.html','Layout'],['Voyager_Moments_Control.html','Moments'],['Voyager_Banner_Control.html','Stream banner'],['Voyager_Fleet_Control.html','Support alerts & camera'],['Voyager_Dreadnought.html#stage-card','Stage takeover ↗',{link:true}]]},
 {id:'members',label:'Members & points',ico:'★',group:'Community',help:'POINTS_SETUP.html',keys:'points members membership tiers silver gold platinum ledger security reports signals accounts review',
  tabs:[['Voyager_Points.html','Points & members'],['Voyager_Security.html','Security review']]},
 {id:'prog',label:'Membership programme',ico:'▣',group:'Community',live:true,help:'MEMBERSHIP_CARD_SETUP.html',keys:'membership card voyager tier blue silver gold platinum upgrade badges ranks naval navy officer promotion admiral captain commander medals honour hall of honour loyalty achievements',
  tabs:[['Voyager_Membership_Cards.html','Cards'],['Voyager_Ranks.html','Ranks'],['Voyager_Medals.html','Medals']]},
 {id:'goals',label:'Missions & goals',ico:'◎',group:'Community',live:true,help:'Voyager_Guide.html',keys:'missions weekly rewards badges streak community goals goal season seasons campaign christmas standings hall of fame champion due date points owed pay',
  tabs:[['Voyager_Seasons.html','Community goals'],['Voyager_Missions.html','Missions & points owed']]},
 {id:'site',label:'Public website',ico:'⌂',group:'Community',live:true,help:'Voyager_Guide.html',keys:'public website site viewers voyagercommand fourthwall publish',
  tabs:[['Voyager_Public_Site.html','Public website']]},
 {id:'report',label:'Reporting',ico:'▥',group:'Community',help:'TWITCH_ANALYTICS_SETUP.html',keys:'reporting reports twitch statistics analytics home overview dashboard command center',
  tabs:[['Voyager_Command_Center.html?page=reporting','Reporting'],['Voyager_Command_Center.html','Overview']]},
 {id:'setup',label:'Settings & Streamer.bot',ico:'⚙',group:'Setup',live:true,help:'Voyager_Guide.html',keys:'settings connection streamer.bot streamerbot password address port logos branding actions run trigger test goal fx ledger scan medals export system check health data folder',
  tabs:[['Voyager_Settings.html','Connection & branding'],['Voyager_Streamerbot.html','Streamer.bot actions'],['Voyager_System_Check.html','System check']]},
 {id:'help',label:'Help',ico:'?',group:'Setup',keys:'help guide setup instructions updates',
  tabs:[['Voyager_Guide.html','Help']]}
].filter(d=>!(demo&&d.live));
// Flat page list (one entry per tab) for matching the current page and for Ctrl K.
const PAGES=[];
for(const d of DESTINATIONS)for(const [href,label,opt={}] of d.tabs){if(opt.link)continue;const [file,query='']=href.split('?');const page=new URLSearchParams(query).get('page')||'';PAGES.push({file,page,href,label:d.tabs.length>1?d.label+' · '+label:d.label,tab:label,ico:d.ico,group:d.group,keys:d.keys,help:d.help,dest:d});}
const GUIDES=[
 ['START_HERE.html','Getting started'],['TICKET_GIVEAWAY_SETUP.html','Ticket giveaway setup'],['POINTS_SETUP.html','Points setup & history'],
 ['POINTS_ADMIN_SETUP.html','Points member controls'],['WATCHTIME_SETUP.html','Watchtime points'],['VERSUS_SETUP.html','Voyager Versus setup'],
 ['FLEET_ALERTS_SETUP.html','Support alerts setup'],['BANNER_SETUP.html','Stream banner setup'],['SECURITY_SETUP.html','Security setup'],
 ['COMMAND_CENTER_SETUP.html','Command center setup'],['LEADERBOARD_PANEL_SETUP.html','Leaderboard panel setup'],['BUCKET_OVERLAY_SETUP.html','OBS progress strip setup'],
 ['TWITCH_ANALYTICS_SETUP.html','Twitch analytics setup'],['EXTERNAL_ANALYTICS_SETUP.html','External analytics'],['NATIVE_COMMUNITY_SETUP.html','Native community setup'],
 ['BRAND_REFRESH_SETUP.html','Stream branding & preview'],['DREADNOUGHT_SETUP.html','Voyager Dreadnought setup'],['MEDALS_SETUP.html','Voyager Medals setup'],['MEMBERSHIP_CARD_SETUP.html','Membership card setup'],['STINGERS_SETUP.html','Scene transitions (stingers)'],['MOMENTS_SETUP.html','On-screen moments'],['UPDATE_2.20_SETUP.html','Updating to 2.20']
];
const canonical=new Set([...PAGES.map(p=>p.file),'START_HERE.html','COMMAND_CENTER_SETUP.html','Voyager_Settings.html']);
const hrefOf=p=>{let h=p.href||p.file;if(demo&&!/SETUP|START_HERE|Guide|Settings/.test(p.file))h+=(h.includes('?')?'&':'?')+'demo=1';return h;};
const matches=p=>p.file===here&&(p.file!=='Voyager_Command_Center.html'||(p.page||'home')===subpage);
const current=PAGES.find(matches);
const destination=current?.dest||DESTINATIONS.find(d=>d.tabs.some(([h])=>h.split('?')[0]===here));
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

// Sidebar: the thirteen destinations
const side=document.querySelector('aside.rail, aside.sidebar');
let statusCard=null,bar=null;
if(side&&console_){
 for(const nav of side.querySelectorAll('nav:not(#presets)'))nav.remove();
 for(const a of side.querySelectorAll('a.help-link, a.brand-update-link, #presets > a[href]'))if(canonical.has(fileOf(a))||/SETUP\.html$|START_HERE/.test(fileOf(a))||a.classList.contains('brand-update-link'))a.remove();
 const nav=el('nav',{class:'vg-nav','aria-label':'Voyager pages'});
 let group;
 for(const d of DESTINATIONS){
  if(d.group!==group){group=d.group;if(group)nav.append(el('div',{class:'vg-group','aria-hidden':'true',text:group}));}
  const first=PAGES.find(p=>p.dest===d);
  const a=el('a',{href:hrefOf(first)},el('span',{class:'vg-ico','aria-hidden':'true',text:d.ico}),el('span',{text:d.label}));
  if(d.id==='give')a.id='giveaway-link';
  if(d===destination){a.classList.add('active');a.setAttribute('aria-current','page');}
  nav.append(a);
 }
 const jump=el('button',{type:'button',class:'vg-jump','aria-label':'Jump anywhere (Ctrl K)'},el('span',{text:'Jump to…'}),el('kbd',{text:'Ctrl K'}));
 jump.addEventListener('click',()=>openPalette());
 const brand=side.querySelector(':scope > .brand');
 if(brand){const small=brand.querySelector('small');if(small)small.textContent='MDA009 · MISSION CONTROL';brand.setAttribute('href','Voyager_Stream_Deck.html'+(demo?'?demo=1':''));brand.after(jump,nav);}else side.prepend(jump,nav);
 const rest=nav.nextElementSibling;if(rest&&!rest.matches('.rail-bottom'))rest.classList.add('vg-page-tools');
 // Footer: version and the partner row. Live status moved to the bar under every page title (2.21.0).
 statusCard=el('div',{class:'vg-foot'},el('div',{class:'vg-foot-links'},el('span',{class:'vg-version',text:demo?'Demo mode · sample data':'Voyager'}),el('a',{href:'Voyager_Guide.html'},'Help')));
 side.append(statusCard,partnerRow('vg-presented','PRESENTED BY'));
 if(side.querySelector('.rail-bottom'))side.querySelector('.rail-bottom').remove();
}

// Under the page title: the destination's tabs (when it has more than one page) and the shared status bar.
const head=console_?document.querySelector('main .page-head, main .top'):null;
if(head&&destination){
 if(destination.tabs.length>1){
  const tabs=el('nav',{class:'vg-subtabs','aria-label':destination.label+' pages'});
  for(const [href,label,opt={}] of destination.tabs){
   const a=el('a',{href:href+(demo&&!opt.blank&&!href.includes('?')?'?demo=1':'')},label);
   if(opt.blank){a.target='_blank';a.rel='noopener';}
   const p=PAGES.find(x=>x.href===href);if(p&&matches(p)){a.classList.add('active');a.setAttribute('aria-current','page');}
   tabs.append(a);
  }
  head.after(tabs);
 }
 if(!demo){
  const pill=(key,label)=>el('a',{class:'vg-pill','data-key':key,'data-state':'wait',href:'#'},el('i',{'aria-hidden':'true'}),el('span',{class:'vg-name',text:label}),el('span',{class:'vg-state',text:'…'}));
  bar=el('div',{class:'vg-bar',role:'status','aria-label':'Voyager status'},pill('sb','Streamer.bot'),pill('host','Voyager'),pill('obs','OBS sources'),pill('site','Website'),pill('owed','Points owed'));
  bar.querySelector('[data-key=sb]').href='Voyager_Settings.html';bar.querySelector('[data-key=host]').href='Voyager_System_Check.html';bar.querySelector('[data-key=obs]').href='Voyager_Screen.html';bar.querySelector('[data-key=site]').href='Voyager_Public_Site.html';bar.querySelector('[data-key=owed]').href='Voyager_Missions.html';
  head.classList.add('vg-has-bar');head.append(bar);
 }
}

// Duplicate set-up cards (2.21.0): the "OBS" and "Streamer.bot" install cards every page used to carry fold away to one line,
// pointing at Screen & overlays and Settings & Streamer.bot where the same set-up lives once. The card is still there, opened on click.
if(console_&&destination&&!['screen','setup'].includes(destination.id)){
 for(const eb of document.querySelectorAll('main section .eyebrow, main .versus-obs .eyebrow')){
  const t=eb.textContent.trim().toUpperCase(),card=eb.closest('section');if(!card||card.querySelector('.vg-fold'))continue;
  const obs=/^OBS(\s*[\/·]|$| SOURCE)/.test(t)&&!/PANEL/.test(t),sb=/^STREAMER\.BOT$/.test(t);
  if(!obs&&!sb)continue;
  const body=el('div',{class:'vg-fold-body'});
  for(const n of [...card.childNodes])if(n!==eb&&!(n.nodeType===1&&n.contains(eb)))body.append(n);
  const link=obs?el('a',{href:'Voyager_Screen.html'},'all sources on Screen & overlays ↗'):el('a',{href:'Voyager_Settings.html'},'set up once on Settings & Streamer.bot ↗');
  const sum=el('summary',{},el('span',{text:obs?'OBS source for this page':'Streamer.bot set-up for this page'}),el('small',{},'— ',link));
  const fold=el('details',{class:'vg-fold'},sum,body);
  if(location.hash&&card.querySelector(location.hash))fold.open=true;
  card.append(fold);card.classList.add('vg-folded');
 }
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

// Live status (the bar under the page title, 2.21.0). Streamer.bot from a WebSocket probe; the rest from the host.
function setStatus(key,state,text,title){const li=bar?.querySelector(`[data-key="${key}"]`);if(!li)return;li.dataset.state=state;li.querySelector('.vg-state').textContent=text;if(title)li.title=title;else li.removeAttribute('title');}
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
 if(!bar||demo)return;
 config().then(probe).then(([s,t])=>setStatus('sb',s,t,s==='error'?'Streamer.bot is not answering. Check it is open and its WebSocket server is on (Settings & Streamer.bot).':''));
 if(!hosted){setStatus('host','off','Not running','Start Voyager to see live status.');for(const k of ['obs','site','owed'])setStatus(k,'off','—');return;}
 let h;try{h=await local('/api/health');setStatus('host','ok','v'+h.version);const v=statusCard?.querySelector('.vg-version');if(v)v.textContent='Voyager '+h.version;}catch{setStatus('host','error','Stopped');for(const k of ['obs','site','owed'])setStatus(k,'off','—');return;}
 if(h.sources){const {loaded,stale=0}=h.sources;setStatus('obs',stale?'warn':loaded?'ok':'wait',loaded+' loaded'+(stale?' · '+stale+' stopped':''),stale?'An overlay page that was loaded has stopped asking Voyager for data: hidden, or OBS has an old copy. Screen & overlays says which.':'Overlay pages OBS is asking Voyager for right now. Screen & overlays lists every source.');}else setStatus('obs','off','—');
 try{const v=await local('/api/public-site',true),u=v.upload||{};
  if(!u.enabled)setStatus('site','off','Off','Set up in Public website.');
  else if(u.lastError)setStatus('site','error','Problem',u.lastError);
  else setStatus('site','ok','Publishing',v.siteUrl||'');
 }catch{setStatus('site','off','—');}
 try{const c=await local('/api/community',true),owed=(c.payables||[]).filter(p=>p.payable&&p.status==='owed'),total=owed.reduce((a,p)=>a+(p.reward||0),0);
  setStatus('owed',owed.length?'warn':'ok',owed.length?total.toLocaleString('en')+' pts · '+owed.length+' to pay':'All paid',owed.length?'Pay from Missions & goals › Missions & points owed.':'');
 }catch{setStatus('owed','off','—');}
}
if(bar&&!demo){refresh();setInterval(()=>{if(!document.hidden)refresh();},30000);}

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
