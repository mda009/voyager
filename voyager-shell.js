/* Voyager shell (2.10): one grouped sidebar on every control page, plus "Jump anywhere" (Ctrl K).
   Load it before voyager-navigation.js. It only changes navigation; page tools stay where they are. */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(params.has('background')||params.has('embed'))return;
const demo=params.get('demo')==='1';
const here=location.pathname.split('/').pop()||'Voyager_Command_Center.html';
const subpage=window.VOYAGER_PAGE||params.get('page')||'home';

// Canonical page list. group: null = top, then Live, Community, Setup.
const PAGES=[
 {file:'Voyager_Command_Center.html',label:'Home',ico:'◈',group:null,keys:'home mission control dashboard command center'},
 {file:'Giveaway_Control.html',label:'Giveaways',ico:'✦',group:'Live',keys:'giveaway draw winner pool chat members'},
 {file:'Voyager_Ticket_Giveaway.html',label:'Ticketed giveaway',ico:'◇',group:'Live',keys:'ticket tickets watchtime weighted'},
 {file:'Voyager_Versus.html',label:'Voyager Versus',ico:'⚔',group:'Live',keys:'versus battle pilots fleet game'},
 {file:'Voyager_Fleet_Control.html',label:'Fleet alerts',ico:'✧',group:'Live',keys:'fleet alerts launch form up'},
 {file:'Voyager_Banner_Control.html',label:'Stream banner',ico:'▰',group:'Live',keys:'banner message ticker'},
 {file:'Voyager_Command_Center.html',page:'live',label:'Live dashboard',ico:'◉',group:'Live',keys:'live dashboard audiences viewers obs strip'},
 {file:'Voyager_Points.html',label:'Points & members',ico:'★',group:'Community',keys:'points members membership tiers silver gold platinum ledger'},
 {file:'Voyager_Entrant_Board.html',label:'Entrant board',ico:'☷',group:'Community',keys:'entrants board list'},
 {file:'Voyager_Public_Site.html',label:'Public website',ico:'◎',group:'Community',keys:'public website site viewers voyagercommand fourthwall',live:true},
 {file:'Voyager_Security.html',label:'Security',ico:'⛨',group:'Community',keys:'security reports signals accounts'},
 {file:'Voyager_Command_Center.html',page:'reporting',label:'Reporting',ico:'▥',group:'Community',keys:'reporting reports twitch statistics analytics'},
 {file:'Voyager_System_Check.html',label:'System check',ico:'✓',group:'Setup',keys:'system check health streamer.bot connection data folder',live:true},
 {file:'Voyager_Guide.html',label:'Setup guide',ico:'?',group:'Setup',keys:'guide help setup instructions updates'}
].filter(p=>!(demo&&p.live));
const GUIDES=[
 ['START_HERE.html','Getting started'],['TICKET_GIVEAWAY_SETUP.html','Ticket giveaway setup'],['POINTS_SETUP.html','Points setup & history'],
 ['POINTS_ADMIN_SETUP.html','Points member controls'],['WATCHTIME_SETUP.html','Watchtime points'],['VERSUS_SETUP.html','Voyager Versus setup'],
 ['FLEET_ALERTS_SETUP.html','Fleet alerts setup'],['BANNER_SETUP.html','Stream banner setup'],['SECURITY_SETUP.html','Security setup'],
 ['COMMAND_CENTER_SETUP.html','Command center setup'],['LEADERBOARD_PANEL_SETUP.html','Leaderboard panel setup'],['BUCKET_OVERLAY_SETUP.html','OBS progress strip setup'],
 ['TWITCH_ANALYTICS_SETUP.html','Twitch analytics setup'],['EXTERNAL_ANALYTICS_SETUP.html','External analytics'],['NATIVE_COMMUNITY_SETUP.html','Native community setup'],
 ['BRAND_REFRESH_SETUP.html','Stream branding & preview']
];
const canonical=new Set(PAGES.map(p=>p.file));
const hrefOf=p=>{let h=p.file+(p.page?'?page='+p.page:'');if(demo&&!/SETUP|START_HERE|Guide/.test(p.file))h+=(h.includes('?')?'&':'?')+'demo=1';return h;};
const isActive=p=>p.file===here&&(p.file!=='Voyager_Command_Center.html'||(p.page||'home')===subpage);
const el=(tag,attrs={},...kids)=>{const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else n.setAttribute(k,v);}n.append(...kids);return n;};
const fileOf=a=>{try{return new URL(a.getAttribute('href'),location.href).pathname.split('/').pop();}catch{return '';}};

// Sidebar
const side=document.querySelector('aside.rail, aside.sidebar');
if(side&&document.body.classList.contains('voyager-console')){
 for(const nav of side.querySelectorAll('nav:not(#presets)'))nav.remove();
 for(const a of side.querySelectorAll('a.help-link, #presets > a[href]'))if(canonical.has(fileOf(a)))a.remove();
 const nav=el('nav',{class:'vg-nav','aria-label':'Voyager pages'});
 let group;
 for(const p of PAGES){
  if(p.group!==group){group=p.group;if(group)nav.append(el('div',{class:'vg-group','aria-hidden':'true',text:group}));}
  const a=el('a',{href:hrefOf(p)},el('span',{class:'vg-ico','aria-hidden':'true',text:p.ico}),el('span',{text:p.label}));
  if(p.page)a.dataset.dashboardPage=p.page;
  if(p.file==='Giveaway_Control.html')a.id='giveaway-link';
  if(isActive(p)){a.classList.add('active');a.setAttribute('aria-current','page');}
  nav.append(a);
 }
 const jump=el('button',{type:'button',class:'vg-jump','aria-label':'Jump anywhere (Ctrl K)'},el('span',{text:'Jump to…'}),el('kbd',{text:'Ctrl K'}));
 jump.addEventListener('click',()=>openPalette());
 const brand=side.querySelector(':scope > .brand');
 if(brand)brand.after(jump,nav);else side.prepend(jump,nav);
 // Whatever the page keeps in its sidebar (presets, notes, settings) sits under a divider.
 const rest=nav.nextElementSibling;if(rest&&!rest.matches('.rail-bottom'))rest.classList.add('vg-page-tools');
}

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
 if(!items.length)list.append(el('li',{class:'vg-empty',text:'Nothing matches. Try "giveaway", "banner" or "setup".'}));
 mark();
}
function mark(){list.querySelectorAll('.vg-item').forEach((li,i)=>li.setAttribute('aria-selected',String(i===selected)));const cur=list.querySelector('#vg-opt-'+selected);if(cur){input.setAttribute('aria-activedescendant',cur.id);cur.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');}
function build(){
 input=el('input',{type:'text',placeholder:'Type a page or setup guide…','aria-label':'Jump to a page',role:'combobox','aria-expanded':'true','aria-controls':'vg-results',autocomplete:'off',spellcheck:'false'});
 list=el('ul',{id:'vg-results',role:'listbox','aria-label':'Results'});
 const search=el('label',{class:'vg-search'},el('span',{'aria-hidden':'true',text:'⌕'}),input,el('kbd',{text:'Esc'}));
 const foot=el('div',{class:'vg-foot'},el('span',{},el('kbd',{text:'↑'}),' ',el('kbd',{text:'↓'}),' move'),el('span',{},el('kbd',{text:'Enter'}),' open'),el('span',{style:'margin-left:auto',text:'Ctrl K from any page'}));
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
window.VoyagerShell={open:openPalette,close};
})();
