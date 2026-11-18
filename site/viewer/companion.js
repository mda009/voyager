/* Voyager stream companion (2.20.17): tabs, on-air status, the Dreadnought, find-your-card, naval ranks and medals.
   Reads the same public feed as the rest of the page (it arrives as a 'voyager:feed' event) plus crew.json for the card lookup.
   Everything is built with DOM methods; nothing from the feed is ever inserted as HTML. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined&&text!==null)e.textContent=String(text);return e;};
const svg=(tag,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
const fmt=n=>Number(n||0).toLocaleString();
const PLATFORM={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const EMBED=document.documentElement.classList.contains('embed');
const FEED=document.querySelector('meta[name=voyager-feed]').content||'feed.json';
const crewUrl=()=>new URL('crew.json',new URL(FEED,location.href)).href;
let feed=null,crew=null,crewAt=0,crewVer=0,crewLoading=null,selected=null;

// ---------- tabs ----------
// 2.20.51: five tabs by what you are doing. Live (while watching), My card (you), Goals (the community goal and giveaway goals),
// Community (squadrons, leaderboards, winners, medals) and Guide. Old links (#medals, #winners, #boards) still land in the right place.
// 2.22.0 app shell: five tabs in the bar — Home, Live, My card, Community, More. Goals, SC Intel, Commands and Guide are pages
// under More (the bar keeps More lit and a back pill appears). Old links (#goal, #intel, #medals, …) still land in the right place.
const TABS=[
 ['home','Home','M3 11l9-8 9 8 M5 10v10h5v-6h4v6h5V10'],
 ['live','Live','M5 12a7 7 0 0 1 14 0 M2 12a10 10 0 0 1 20 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 14v7'],
 ['crew','My card','M3 5h18v14H3z M7 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0 M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4 M14 9h4 M14 13h4'],
 ['community','Community','M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0z M4 21c0-3.3 3.6-6 8-6s8 2.7 8 6 M19 8a3 3 0 1 0 0-6 M5 8a3 3 0 1 1 0-6'],
 ['more','More','M5 12h.01 M12 12h.01 M19 12h.01'],
 ['notify','Notifications','M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7 M10 20a2 2 0 0 0 4 0'],
 ['goal','Goals','M12 3l2.6 5.4 6 .8-4.3 4.2 1 5.9-5.3-2.8-5.3 2.8 1-5.9L3.4 9.2l6-.8z'],
 ['intel','SC Intel','M12 2l2 5 5 .7-3.7 3.4.9 5.2L12 13.9 7.8 16.3l.9-5.2L5 7.7 10 7z M3 20h18 M6 17v3 M18 17v3'],
 ['commands','Commands','M4 6h16v12H4z M7 10l3 2-3 2 M12 14h5'],
 ['guide','Guide','M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z']];
const BAR=['home','live','crew','community','more'],PARENT={notify:'more',goal:'more',intel:'more',commands:'more',guide:'more'};
const SUB_TEXT={notify:'Alerts when the stream goes live, the Dreadnought appears, a giveaway opens or you win',goal:'The community goal, giveaway goals and standings',intel:'Star Citizen news, patch notes, live events, ships in the store and deals',commands:'Every chat command and what it does',guide:'How Voyager works, and the member manual'};
const TAB_ALIAS={quiz:'community',medals:'community',winners:'community',boards:'community',leaderboards:'community',squad:'community',season:'goal',goals:'goal',dread:'live',giveaways:'live',missions:'live',arena:'live',ranks:'crew',find:'crew',program:'guide',manual:'guide',command:'commands',cmd:'commands',cmds:'commands',news:'intel',sales:'intel',ships:'intel',store:'intel',deals:'intel',events:'intel',sc:'intel',card:'crew',me:'crew'};
const resolveTab=h=>TABS.some(([t])=>t===h)?h:TAB_ALIAS[h]||(document.getElementById(h)?.dataset?.tab)||null;
let pendingCard='';{const m=location.hash.match(/^#card\/(.+)$/);if(m){try{pendingCard=decodeURIComponent(m[1]).toLowerCase();}catch{}}}
let tab=pendingCard?'crew':(resolveTab(location.hash.slice(1))||'home'),wanted=tab; // a link to #crew waits for the feed before it can open that tab
const store={get(k){try{return localStorage.getItem(k);}catch{return null;}},set(k,v){try{localStorage.setItem(k,v);}catch{}},del(k){try{localStorage.removeItem(k);}catch{}}};
function sectionsOf(t){return [...document.querySelectorAll('section[data-tab="'+t+'"]')];}
function available(t){return sectionsOf(t).some(s=>!s.hidden);}
// "New" dots: a short fingerprint of what each tab shows; the dot clears when the tab is opened.
function sigs(){const f=feed||{};const j=v=>JSON.stringify(v??null);return {
 live:j([(f.giveaways||[]).map(g=>[g.id||g.title,g.status]),f.dreadnought?.phase,(f.dreadnought?.recent||[])[0]?.at,f.versus?.status==='live']),
 community:j([(f.winners||[])[0],(f.medals?.recent||[])[0],f.squadrons?.leader,(f.quiz?.all||[]).map(r=>[r.name,r.correct])]),
 goal:j([(f.season?.goals||[]).map(g=>[g.title,!!g.reached]),f.season?.name]),
 intel:j([(f.intel?.news||[])[0]?.title,(f.intel?.deals||[]).length,(f.intel?.events||[]).length,(f.intel?.sales||[])[0]?.name])};}
let seen={};try{seen=JSON.parse(store.get('voyager-seen')||'{}')||{};}catch{}
const fresh1=k=>{const s=sigs()[k];return !!feed&&s!==undefined&&seen[k]!==undefined&&seen[k]!==s;};
function markSeen(t){if(!feed)return;const s=sigs();let ch=false;for(const k of Object.keys(s))if(k===t||seen[k]===undefined){if(seen[k]!==s[k]){seen[k]=s[k];ch=true;}}if(ch)store.set('voyager-seen',JSON.stringify(seen));}
const hasNew=t=>t==='more'?Object.keys(PARENT).some(k=>available(k)&&fresh1(k)):fresh1(t);
function icon(path){const i=svg('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});i.append(svg('path',{d:path}));return i;}
function renderTabs(){
 const bar=$('tabbar');bar.textContent='';bar.setAttribute('role','tablist');
 const ok=TABS.filter(([t])=>available(t)).map(([t])=>t);if(wanted&&ok.includes(wanted)){tab=wanted;if(feed)wanted=null;}if(!ok.includes(tab))tab=ok.includes('home')?'home':ok[0]||'home';
 const lit=PARENT[tab]||tab,busy=feed&&(feed.live?.onAir||['lobby','battle'].includes(feed.dreadnought?.phase)||!!feed.prospect||!!feed.raffle);
 markSeen(tab);
 for(const [t,label,path] of TABS.filter(([t])=>BAR.includes(t)&&ok.includes(t))){
  const b=el('button');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(t===lit));b.setAttribute('aria-controls',sectionsOf(t)[0]?.id||'');
  b.append(icon(path),el('span','',label));if(t!==lit&&((t==='live'&&busy)||hasNew(t)))b.append(el('i','pip'));
  b.onclick=()=>go(t);bar.append(b);
 }
 for(const s of document.querySelectorAll('section[data-tab]'))s.classList.toggle('off',s.dataset.tab!==tab);
 const sub=$('subhead');sub.hidden=!PARENT[tab];if(PARENT[tab])$('sub-title').textContent=TABS.find(([t])=>t===tab)[1];
 renderMore();
}
function renderMore(){
 const box=$('more-list');if(!box)return;box.textContent='';
 const item=(path,title,subText,fn,dot)=>{const b=el('button');b.type='button';const t=el('div');const h=el('b','',title);if(dot)h.append(el('i'));t.append(h,el('small','',subText));b.append(icon(path),t,el('span','go','›'));b.onclick=fn;box.append(b);};
 for(const [t,label,path] of TABS.filter(([t])=>PARENT[t]==='more'&&available(t)))item(path,label,SUB_TEXT[t]||'',()=>go(t),fresh1(t));
 box.append(el('div','more-h','The app'));
 item('M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7 M12 3v13 M7 8l5-5 5 5','Share Voyager','Send the companion to a friend',()=>share({title:'Voyager · Stream companion',text:'Giveaways, the Dreadnought, membership cards and medals, live from the stream.',url:location.origin+location.pathname}));
 if(!EMBED&&!standalone())item('M12 3v12 M7 10l5 5 5-5 M5 21h14','Install the app','Add Voyager to your home screen',()=>installFlow());
 if(!EMBED)item('M12 8v4l3 2 M21 12a9 9 0 1 1-9-9','Welcome tour','See the three-step welcome again',()=>onboard(true));
}
const scrollAt={};let lastIdx=0;
function go(t,push=true){
 if(t===tab&&push){window.scrollTo({top:0,behavior:'smooth'});return;}
 scrollAt[tab]=window.scrollY;const order=TABS.map(x=>x[0]),from=order.indexOf(tab),to=order.indexOf(t);
 tab=t;wanted=null;if(push)history.pushState(null,'','#'+t);renderTabs();if(t==='crew')loadCrew();
 const dx=PARENT[t]?'18px':t==='more'&&PARENT[order[from]]?'-18px':to>=from?'14px':'-14px';
 for(const s of sectionsOf(t)){s.style.setProperty('--dx',dx);s.classList.remove('tab-in');void s.offsetWidth;s.classList.add('tab-in');}
 window.scrollTo({top:PARENT[t]?0:scrollAt[t]||0});
}
$('sub-back').onclick=()=>go('more');
addEventListener('hashchange',()=>{const h=location.hash.slice(1);const c=h.match(/^card\/(.+)$/);if(c){try{pendingCard=decodeURIComponent(c[1]).toLowerCase();}catch{}go('crew',false);loadCrew(true);return;}
 const t=resolveTab(h);if(!t)return;if(t!==tab)go(t,false);if(h!==t){const sec=document.getElementById(h);if(sec)setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),60);}});
// ---------- small app helpers: toast, share, standalone ----------
let toastTimer=0;function toast(text){let t=$('toast');if(!t){t=el('div','toast');t.id='toast';t.setAttribute('role','status');document.body.append(t);}t.textContent=text;t.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('on'),2200);}
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
async function share(data){try{if(navigator.share){await navigator.share(data);return;}}catch(e){if(e?.name==='AbortError')return;}
 try{await navigator.clipboard.writeText((data.text?data.text+' ':'')+data.url);toast('Link copied');}catch{toast(data.url);}}
// Right now: what is on, one tap away (the community goal, an open giveaway, the Dreadnought, missions).
window.renderRightNow=function(){
 const box=document.getElementById('rightnow');if(!box||!feed)return;box.textContent='';
 const tile=(cls,title,sub,target,section)=>{const b=el('button',cls);b.type='button';const t=el('b');t.append(el('i'),document.createTextNode(title));b.append(t,el('small','',sub));b.onclick=()=>{go(target);if(section){const sec=document.getElementById(section);if(sec)setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),80);}};box.append(b);};
 try{const ev=(intelNow()?.spotlights||[]).find(e=>e.status!=='news');if(ev){const now=Date.now(),cur=(ev.days||[]).find(d=>now>=d.start&&now<d.end);tile('gold',ev.name+(ev.status==='live'?' is on':' starts soon'),[cur?'On the floor: '+cur.label:'',ev.freefly?'Free Fly':''].filter(Boolean).join(' · ')||'Event details','intel','intel');}}catch{}
 const s=feed.season;if(s&&s.active!==false&&s.name){const days=s.endsAt?Math.max(0,Math.ceil((s.endsAt-Date.now())/864e5)):0,next=(s.goals||[]).find(g=>!g.reached&&!g.missed),done=(s.goals||[]).filter(g=>g.reached).length;
  tile('gold',s.name,(s.endsAt?days+' days to go · ':'')+(next?next.title+' '+Math.min(100,Math.floor(next.total/next.target*100))+'%':done+' of '+(s.goals||[]).length+' goals reached'),'goal','season');}
 const open=(feed.giveaways||[]).filter(g=>g.status==='open');if(open.length&&feed.online&&Date.now()-feed.generatedAt<15*60000)tile('',open.length===1?'Giveaway open':open.length+' giveaways open',open[0].title+(open[0].eligibility?' · '+open[0].eligibility:''),'live','giveaways');
 {const rf=feed.raffle;if(rf&&(rf.phase==='open'||rf.phase==='intro'))tile('gold','Raffle is open','Type !join in chat · '+fmt(rf.count)+' in','live','raffle');}
 {const pr=feed.prospect;if(pr&&pr.phase!=='result')tile('gold','Prospect Run is on',({contract:'Type !mine, !fire or !sell to join',mine:'Type !mine now',haul:'Type !fire when pirates hit',sell:'Type !sell at the peak'})[pr.phase],'live','prospect');}
 const d=feed.dreadnought;if(d&&['lobby','battle'].includes(d.phase))tile('red',d.phase==='lobby'?'Dreadnought boarding':'Dreadnought fight',d.phase==='lobby'?'Type !join now':'Type !fire to attack','live','dread');
 const m=feed.missions;if(m&&(m.list||[]).length&&box.children.length<3)tile('',(m.list||[]).length+' missions this week','Finish one to earn Voyager points','live','missions');
 if(feed.requests?.open&&feed.requests.options?.length&&box.children.length<4)tile('gold','Make a request','Ask for '+feed.requests.options.slice(0,3).map(o=>o.label).join(', ')+(feed.requests.options.length>3?'…':''),'live','requests');
 const h=document.getElementById('h-rightnow');if(h)h.hidden=!box.children.length;
};
const st=document.createElement('style');st.textContent='section.off{display:none!important}'+(EMBED?' nav.tabbar{position:static!important;padding:0!important;background:none!important;border:0!important;margin-top:10px!important}.embed .wrap{padding-bottom:24px!important}':'');document.head.append(st);

// ---------- now / on air ----------
const COMMANDS=[['!report','report for duty'],['!voyager','your card on stream'],['!medals','your medals'],['!squadron','pick a team'],['!log','log a moment'],['!join','board the Dreadnought fight'],['!fire','attack'],['!mine','Prospect Run: work the laser'],['!sell','Prospect Run: sell the cargo'],['!enter','join a chat giveaway']];
function copyChip(cmd,hint){const b=el('button','chip');b.type='button';b.append(el('code','',cmd),el('small','',hint));
 b.onclick=async()=>{try{await navigator.clipboard.writeText(cmd);b.classList.add('copied');const s=b.querySelector('small'),was=s.textContent;s.textContent='copied';setTimeout(()=>{b.classList.remove('copied');s.textContent=was;},1400);}catch{}};return b;}
function renderNow(){
 const on=!!feed.live?.onAir,fresh=feed.online&&Date.now()-feed.generatedAt<15*60000;
 const badge=$('onair');badge.dataset.on=String(on&&fresh);$('onair-text').textContent=on&&fresh?'Live now':fresh?'Stream tools on':'Off air';
 $('updated-short').textContent='Updated '+ago(feed.generatedAt);
 for(const a of $('links').querySelectorAll('a')){if(['Twitch','YouTube','Kick'].includes(a.textContent.trim())){a.classList.add('watch');if(!a.dataset.w){a.dataset.w='1';a.lastChild.textContent=(on?'Watch on ':'')+a.lastChild.textContent;}}}
 const chips=$('chips');if(!chips.childElementCount){const cmds=[...COMMANDS];const tix=(feed.program?.commands||[]).find(c=>c.command==='!entergiveaway');if(tix)cmds.push(['!entergiveaway','ticket giveaway']);for(const [c,h] of cmds)chips.append(copyChip(c,h));}
}
function ago(t){const s=Math.max(0,Math.round((Date.now()-t)/1000));if(s<60)return 'just now';const m=Math.round(s/60);if(m<60)return m+' min ago';const h=Math.round(m/60);if(h<48)return h+' h ago';return new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short'});}
function left(t){const s=Math.max(0,Math.round((t-Date.now())/1000));const m=Math.floor(s/60);return m?m+'m '+String(s%60).padStart(2,'0')+'s':s+'s';}
function who(p){const w=el('span','name');if(PLATFORM[p.platform]){const d=el('i','dot '+p.platform);d.setAttribute('aria-hidden','true');w.append(d);}w.append(el('span','',p.name));return w;}

// ---------- the Dreadnought ----------
// 2.34.0 Raffle: shown on the Live tab while a raffle is open, being drawn or just finished.
function renderRaffle(){
 const r=feed.raffle,sec=$('raffle');if(!sec)return;sec.hidden=!r;if(!r)return;const card=$('raffle-card');card.textContent='';
 const open=r.phase==='open'||r.phase==='intro',top=el('div','gw-top');top.append(el('span','kind','Raffle · '+(r.want===1?'1 winner':'up to '+r.want+' winners')+(r.prize?' · '+r.prize+' giveaway tickets each':'')),el('span','badge '+(open?'s-open':r.phase==='drawing'?'s-drawing':''),open?'Open':r.phase==='drawing'?'Drawing now':'Winners'));card.append(top);
 if(open){card.append(el('div','phase lobby','Type !join in stream chat'));const c=el('p','who');if(r.endsAt){c.dataset.until=r.endsAt;c.dataset.prefix='Closes in ';c.textContent='Closes in '+left(r.endsAt);}card.append(c,el('p','who',fmt(r.count)+' ticket'+(r.count===1?'':'s')+' handed out so far. One each, with a random number.'));
  const cm=el('div','cmds');cm.append(copyChip('!join','get your ticket'));card.append(cm);}
 else{card.append(el('div','phase battle',r.phase==='drawing'?'The winning tickets are being drawn on stream':'The raffle is over'));
  if(r.winners?.length){const ol=el('ol','rows');r.winners.forEach((w,i)=>{const li=el('li');li.append(el('span','rank',String(i+1)),el('span','',w.name+(PLATFORM[w.platform]?' · '+PLATFORM[w.platform]:'')),el('span','',w.ticket?'#'+w.ticket:''));ol.append(li);});card.append(ol);}
  else card.append(el('p','who',fmt(r.count)+' ticket'+(r.count===1?'':'s')+' in the draw.'));}
}
// 2.33.0 Prospect Run: shown on the Live tab only while a run is on.
function renderProspect(){
 const p=feed.prospect,sec=$('prospect');if(!sec)return;sec.hidden=!p;if(!p)return;const card=$('prospect-card');card.textContent='';
 const NAME={contract:'Contract accepted',mine:'Phase 1 · Mining',haul:'Phase 2 · Hauling',sell:'Phase 3 · Selling',result:'Run over'},top=el('div','gw-top');
 top.append(el('span','kind','Crew contract'+(p.practice?' · practice':'')),el('span','badge '+(p.phase==='result'?'':'s-drawing'),p.phase==='result'?'Just ended':'On now'));card.append(top);
 card.append(el('div','phase battle',NAME[p.phase]));
 const say=t=>card.append(el('p','who',t)),cm=el('div','cmds');
 if(p.phase==='contract'){say('A run is starting. Type any of the three commands in chat to fly with the crew ('+fmt(p.crew)+' aboard).');cm.append(copyChip('!mine','phase 1'),copyChip('!fire','phase 2'),copyChip('!sell','phase 3'));}
 else if(p.phase==='mine'){say('Type !mine to keep your laser on the rock. About half the miners at a time holds the charge in the green; everyone at once overcharges it. '+fmt(p.ore)+' CU mined so far.');cm.append(copyChip('!mine','work the laser'));}
 else if(p.phase==='haul'){say('The freighter is jumping home with '+fmt(p.cargo)+' CU. When pirates pull it out of the jump, type !fire to drive them off before they shoot cargo loose.');cm.append(copyChip('!fire','shoot the pirate'));}
 else if(p.phase==='sell'){say(fmt(p.cargo)+' CU reached the exchange and the price is moving'+(p.price?' (×'+p.price.toFixed(2)+' a moment ago)':'')+'. Type !sell when it is high: the cargo sells once enough of the crew agrees.');cm.append(copyChip('!sell','vote to sell'));}
 else if(p.result){const r=p.result;say(r.title+(r.grade==='fail'?'.':' · '+fmt(r.cargo)+' CU delivered · haul score '+fmt(r.score)+'.')+(p.practice?' Practice run: no tickets.':r.tickets?' Everyone who flew ('+fmt(r.crew)+') earned '+r.tickets+' giveaway ticket'+(r.tickets===1?'':'s')+'.':''));}
 if(cm.children.length)card.append(cm);
 if(p.phase!=='result')card.append(el('p','lede small','This page updates about once a minute; the action is on stream. Each command counts once every 6 seconds.'));
}
function renderDread(){
 const d=feed.dreadnought,sec=$('dread');sec.hidden=!d;if(!d)return;
 const card=$('dread-card');card.textContent='';
 const phase=d.phase,last=d.history?.[0];
 $('h-dread').textContent=d.name||'The Dreadnought';
 const top=el('div','gw-top');top.append(el('span','kind','Co-op boss fight'),el('span','badge '+(phase==='battle'?'s-drawing':phase==='lobby'?'s-open':''),phase==='battle'?'Battle on':phase==='lobby'?'Boarding':phase==='result'?'Just ended':'Standing by'));card.append(top);
 if(phase==='lobby'){
  card.append(el('div','phase lobby','It’s approaching!'),el('p','who','Board the fleet now, then fire when the battle starts. Everyone who fights earns '+([d.victoryTickets?fmt(d.victoryTickets)+' ticket'+(d.victoryTickets===1?'':'s')+' for the ticketed giveaway':'',d.victoryPoints?fmt(d.victoryPoints)+' Voyager points':''].filter(Boolean).join(' and ')||'glory')+' if it’s destroyed.'));
  if(d.lobbyEndsAt){const c=el('p','who');c.dataset.until=d.lobbyEndsAt;c.dataset.prefix='Battle starts in ';c.textContent='Battle starts in '+left(d.lobbyEndsAt);card.append(c);}
  const cm=el('div','cmds');cm.append(copyChip('!join','board the fleet'));card.append(cm);
 }else if(phase==='battle'){
  const pct=d.maxHp?Math.max(0,Math.min(100,d.hp/d.maxHp*100)):0;
  card.append(el('div','phase battle','Battle in progress'));
  const hull=el('div','hull');hull.setAttribute('role','progressbar');hull.setAttribute('aria-label','Dreadnought hull');hull.setAttribute('aria-valuenow',String(Math.round(pct)));const f=el('i');f.style.width=pct.toFixed(1)+'%';hull.append(f);
  const meta=el('div','hull-meta');meta.append(el('span','',fmt(d.hp)+' / '+fmt(d.maxHp)+' hull · '+Math.round(pct)+'%'),el('span','',fmt(d.pilots)+' pilots'));
  card.append(hull,meta);
  if(d.endsAt){const c=el('p','who');c.dataset.until=d.endsAt;c.dataset.prefix='Time left ';c.textContent='Time left '+left(d.endsAt);card.append(c);}
  const cm=el('div','cmds');cm.append(copyChip('!join','board'),copyChip('!fire','attack'));card.append(cm);
  card.append(el('p','lede small','Hull updates about once a minute here. Cheers and gifted subs hit hardest.'));
 }else{
  const r=phase==='result'?{outcome:d.outcome,mvp:d.leaders?.[0]}:last;
  if(r){card.append(el('div','phase '+(r.outcome==='victory'?'victory':'escaped'),r.outcome==='victory'?'Destroyed!':'It escaped'));
   card.append(el('p','who',(r.outcome==='victory'?'The fleet won':'The fleet ran out of time')+(r.mvp?' · MVP '+r.mvp.name+' ('+fmt(r.mvp.damage)+' damage)':'')+'.'));}
  else card.append(el('div','phase','Quiet skies'),el('p','who','No fight yet. When it appears on stream, type !join and then !fire.'));
 }
 if(['battle','result'].includes(phase)&&d.leaders?.length){card.append(el('h4','','Top pilots'));const ol=el('ol','rows');d.leaders.forEach((l,i)=>{const li=el('li');li.append(el('span','rank',i+1),who(l),el('span','value',fmt(l.damage)));ol.append(li);});card.append(ol);}
 if(phase!=='battle'&&phase!=='lobby'&&(d.history||[]).length){card.append(el('h4','','Recent fights'));const ol=el('ol','rows');for(const h of d.history.slice(0,5)){const li=el('li');li.append(el('span','rank',h.outcome==='victory'?'✓':'✗'),el('span','',(h.outcome==='victory'?'Victory':'Escaped')+' · '+fmt(h.pilots)+' pilots'+(h.mvp?' · MVP '+h.mvp.name:'')),el('span','when',ago(h.endedAt)));ol.append(li);}card.append(ol);}
}

// ---------- rank insignia (Royal Australian Navy sleeve lace, drawn here) ----------
// [broad stripe?, thin stripes, medium stripes] per rank, bottom to top.
const LACE=[null,[0,1,0],[0,0,1],[0,0,2],[0,1,2],[0,0,3],[0,0,4],[1,0,0],[1,0,1],[1,0,2],[1,0,3],[1,0,4]];
function insignia(i){
 const s=svg('svg',{viewBox:'0 0 64 30',class:'lace','aria-hidden':'true'});
 s.append(svg('rect',{x:0,y:0,width:64,height:30,rx:5,fill:'#0b1426',stroke:'#2c3b58'}));
 const gold='#f2c14e';
 if(i===0){s.append(svg('rect',{x:23,y:6,width:18,height:18,rx:2,fill:'#f4f7fb'}),svg('circle',{cx:36,cy:15,r:2.6,fill:gold}));return s;}
 const [broad,thin,med]=LACE[i]||[0,0,1],bars=[];
 if(broad)bars.push(7);for(let k=0;k<med;k++)bars.push(3.2);
 if(thin){bars.splice(broad?1:1,0,1.6);}
 const total=bars.reduce((a,b)=>a+b,0)+(bars.length-1)*2.2;let y=15+total/2;
 bars.forEach((h,k)=>{y-=h;s.append(svg('rect',{x:8,y:y.toFixed(1),width:48,height:h,rx:.6,fill:gold}));
  if(k===bars.length-1){s.append(svg('circle',{cx:32,cy:(y-3.2).toFixed(1),r:2.4,fill:'none',stroke:gold,'stroke-width':1.4}));}
  y-=2.2;});
 return s;
}

// ---------- medals ----------
const GRADES=['Bronze','Silver','Gold','Legend'];
const LOOK=[['linear-gradient(180deg,#ffe6cc,#f0a868 30%,#a5582a 52%,#6e3510 60%,#d68a4c 84%,#ffd9b0)','#fff3e6','#f0b07a'],
 ['linear-gradient(180deg,#fff,#eef2f6 26%,#9aa6b4 50%,#55606d 58%,#cfd8e2 84%,#fff)','#fff','#dfe6ee'],
 ['linear-gradient(180deg,#fffbe0,#ffe07a 26%,#e0a420 48%,#7a4d00 56%,#ffcf4a 82%,#fff3b8)','#fff8dc','#ffd257'],
 ['linear-gradient(135deg,#8ff6ff,#9fb4ff 30%,#c58bff 52%,#ff8fe0 74%,#ffe28a)','#fff','#d6a8ff']];
const SPECIAL=['linear-gradient(180deg,#e6f5ff,#5fb8ff 40%,#0b4fd0 52%,#8fd2ff 82%,#e6f5ff)','#e6f5ff','#9fe3ff'];
const CATS={loyalty:'Time & loyalty',support:'Subs & support',honour:'Hall of Honour',games:'Games',community:'Community',special:'Specials'};
let catalogue=new Map();
function hex(medal,grade,delay=0){
 const graded=medal&&['count','rank'].includes(medal.kind),look=graded?LOOK[Math.max(0,Math.min(3,grade|0))]:SPECIAL;
 const h=el('div','hex');h.style.setProperty('--metal',look[0]);h.style.setProperty('--ink',look[1]);if(delay)h.style.animationDelay=delay+'ms';
 const inner=el('div');const st=svg('svg',{viewBox:'0 0 24 24','aria-hidden':'true',class:'star'});st.append(svg('path',{d:'M12 1.5l1.6 6.9L20.5 10l-6.9 1.6L12 18.5l-1.6-6.9L3.5 10l6.9-1.6z'}));inner.append(st);
 const s=svg('svg',{viewBox:'0 0 24 24','aria-hidden':'true',class:'mark'});if(medal?.icon)s.append(svg('path',{d:medal.icon}));inner.append(s);h.append(inner);return h;
}
function medalLabel(m,g){return !m?'Medal':['count','rank'].includes(m.kind)?m.name+' '+GRADES[g]:m.name;}
function renderMedals(){
 const m=feed.medals,sec=$('medal-sec');sec.hidden=!m;if(!m)return;
 catalogue=new Map((m.catalogue||[]).map(x=>[x.id,x]));
 const hon=$('honour');hon.textContent='';for(const r of m.honour||[]){const li=el('li');const v=el('span','value');v.append('★ '+fmt(r.honour),el('small','',r.medals+' medals'));li.append(el('span','rank',r.place),who(r),v);hon.append(li);}
 if(!(m.honour||[]).length)hon.append(el('li','empty','No medals awarded yet.'));
 const aw=$('awards');aw.textContent='';for(const a of m.recent||[]){const md=catalogue.get(a.medal);const li=el('li');li.style.gridTemplateColumns='44px 1fr auto';const hx=hex(md,a.grade);hx.style.cssText+=';width:38px;height:38px';hx.firstChild.style.cssText='width:32px;height:32px';
  const info=el('div');info.append(who(a),el('div','when',medalLabel(md,a.grade)));li.append(hx,info,el('span','when',ago(a.at)));aw.append(li);}
 if(!(m.recent||[]).length)aw.append(el('li','empty','New medals show here as they are earned.'));
 const box=$('catalogue');box.textContent='';
 for(const [cat,label] of Object.entries(CATS)){
  const list=(m.catalogue||[]).filter(x=>x.cat===cat);if(!list.length)continue;
  const wrap=el('div','cat');wrap.append(el('h3','',label+(cat==='loyalty'||cat==='support'||cat==='honour'?' · counts double for Honour':'')));const grid=el('div','grid');
  for(const x of list){const c=el('article','card mcard');c.append(hex(x,x.kind==='count'||x.kind==='rank'?2:0));const body=el('div');body.append(el('h4','',x.name),el('p','',x.desc));
   if(x.grades){const g=el('div','grades');x.grades.forEach((t,i)=>{const sp=el('span');const dot=el('i');dot.style.background=LOOK[i][2];sp.append(dot,GRADES[i]+' '+(x.kind==='rank'?'top '+fmt(t):fmt(t)+' '+x.unit));g.append(sp);});body.append(g);}
   const total=(x.earned||[]).reduce((a,b)=>a+b,0);body.append(el('p','',total?fmt(total)+' crew have it':'Nobody has it yet'));
   for(const ms of (feed.missions?.list||[]).filter(ms=>ms.medal===x.id))body.append(el('p','mission-tie','This week’s mission: '+ms.title+' · +'+fmt(ms.reward)+' pts'));
   c.append(body);grid.append(c);}
  wrap.append(grid);box.append(wrap);
 }
}

// ---------- ranks ----------
function renderRanks(){
 const r=feed.ranks,sec=$('ranks');sec.hidden=!r;if(!r)return;
 const lad=$('ladder');lad.textContent='';
 (r.ladder||[]).forEach((x,i)=>{const li=el('li',i>=7?'flag':'');const nm=el('div');nm.append(el('b','',x.name),el('small','',x.abbr+(x.top?' · top '+x.top+' all-time':'')));
  const pts=el('div','pts',i?fmt(x.points):'Start');pts.append(el('small','',fmt(x.holders)+' crew'));li.append(insignia(i),nm,pts);lad.append(li);});
 const off=$('officers');off.textContent='';for(const x of r.top||[]){const li=el('li');li.style.gridTemplateColumns='34px 1fr auto';const n=who(x);const v=el('span','value');v.append(r.ladder?.[x.rank]?.name||'',el('small','',fmt(x.lifetime)+' pts'));li.append(el('span','rank',x.place),n,v);off.append(li);}
 if(!(r.top||[]).length)off.append(el('li','empty','No ranks yet.'));
 const pr=$('promotions');pr.textContent='';$('promo-card').hidden=!(r.promotions||[]).length;
 for(const x of r.promotions||[]){const li=el('li');li.style.gridTemplateColumns='62px 1fr auto';const info=el('div');info.append(who(x),el('div','when','Promoted to '+(r.ladder?.[x.rank]?.name||'')));li.append(insignia(x.rank),info,el('span','when',ago(x.at)));pr.append(li);}
}

// ---------- squadrons and the Captain's Log (2.20.22) ----------
const SQC={red:['#ff8a8a','#c0283c'],gold:['#ffe08a','#b8862b'],blue:['#97dfff','#1f5fd0']};
function renderSquad(){
 const q=feed.squadrons,sec=$('squad');sec.hidden=!q||!q.standings?.length;if(sec.hidden)return;
 const box=$('squad-list');box.textContent='';const max=Math.max(1,...q.standings.map(x=>x.score));
 const wins={};for(const h of q.history||[])wins[h.winner]=(wins[h.winner]||0)+1;
 $('squad-lede').textContent='Pick a side with !squadron '+q.standings.map(x=>x.id).join(', ')+'. Chat, missions, Dreadnought damage and Versus wins score for your squadron'+(q.weekEndsAt?' · this week ends '+new Date(q.weekEndsAt).toLocaleDateString(undefined,{weekday:'long'}):'')+'.';
 q.standings.forEach((x,i)=>{const [c1,c2]=SQC[x.id]||SQC.blue,card=el('article','card sqcard');card.style.setProperty('--c',c1);card.style.setProperty('--c2',c2);
  const h=el('h3','',x.name);if(i===0&&x.score>0)h.append(el('span','lead-tag','LEADING'));
  const bar=el('div','bar');const f=el('i');f.style.width=(x.score/max*100).toFixed(1)+'%';bar.append(f);
  card.append(el('span','kind',fmt(x.crew)+' crew'+(wins[x.id]?' · '+wins[x.id]+' week'+(wins[x.id]===1?'':'s')+' won':'')),h,el('div','score',fmt(x.score)),bar);
  if(x.top?.length){const ol=el('ol','rows');x.top.slice(0,5).forEach((p,j)=>{const li=el('li');li.append(el('span','rank',j+1),who(p),el('span','value',fmt(p.score)));ol.append(li);});card.append(ol);}
  const cm=el('div','cmds');cm.style.marginTop='10px';cm.append(copyChip('!squadron '+x.id,'join '+x.name));card.append(cm);
  box.append(card);});
}
// ---------- SC Intel (2.21.15) ----------
const ITAG={freefly:'FREE FLY',ccu:'UPGRADES',sale:'SALE',event:'EVENT',patch:'PATCH',show:'SHOW',lore:'LORE',news:'NEWS'},IKIND={ccu:'CCU / UPGRADE',sale:'SHIP DEAL',event:'EVENT',freefly:'FREE FLY',note:'NOTE'};
const until=u=>u?'until '+new Date(u+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'}):'';
function irow(tag,tagKind,title,sub,right,rightSub,url,img){const li=el('li');
 if(img!==undefined){if(img){const i=el('img','ship-img');i.alt='';i.loading='lazy';i.src=img;i.onerror=()=>i.remove();li.append(i);}else li.style.gridTemplateColumns='minmax(0,1fr) auto';}else{li.append(el('span','itag '+tagKind,tag));}
 const t=el('div','t');const b=el('b');if(url){const a=el('a','',title);a.href=url;a.target='_blank';a.rel='noopener';b.append(a);}else b.textContent=title;t.append(b);if(sub)t.append(el('small','',sub));li.append(t);
 const r=el('div','r',right||'');if(rightSub)r.append(el('small','',rightSub));li.append(r);return li;}
// 2.31.0: the website keeps its own copy of the news, patch notes and builds (api/intel, refreshed by the site every six hours
// even when the stream is off); the app's copy arrives in the feed. The page shows whichever is newer, plus the event sections.
let siteIntel=null,siteIntelAt=0;
async function loadSiteIntel(){if(EMBED||Date.now()-siteIntelAt<10*60000)return;siteIntelAt=Date.now();
 try{const r=await fetch('api/intel',{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(d&&Array.isArray(d.news)&&d.news.length){siteIntel=d;try{renderIntel();window.renderRightNow?.();}catch{}}}catch{}}
function intelNow(){
 const f=feed?.intel;if(!f||feed.sections?.intel===false)return null;const w=siteIntel,now=Date.now(),newer=w&&(w.at||0)>(f.at||0);
 const own=(f.spotlights||[]).filter(e=>String(e.id).startsWith('own-')),spots=(w?[...(w.spotlights||[]),...own]:f.spotlights||[])
  .filter(e=>!e.end||e.end>now).map(e=>({...e,status:e.status==='news'?'news':e.start&&now<e.start?'soon':'live'}));
 return {...f,at:Math.max(f.at||0,w?.at||0),news:newer?w.news:f.news,patches:newer?w.patches:f.patches||[],releases:newer?w.releases:f.releases||[],spotlights:spots};
}
const dm=t=>new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short'}),span=ms=>{const h=Math.max(0,Math.round(ms/3600000));return h<1?'under an hour':h<36?h+' hour'+(h===1?'':'s'):Math.round(h/24)+' days';};
function spotCard(e){const now=Date.now(),c=el('article','spot');c.dataset.status=e.status;
 const top=el('div','spot-top');top.append(el('span','spot-badge'+(e.status==='live'?' live':''),e.status==='live'?'On now':e.status==='soon'?'Starts in '+span(e.start-now):'In the news'));if(e.freefly)top.append(el('span','spot-badge fly','Free Fly · play free'));c.append(top);
 c.append(el('h3','',e.name));if(e.location)c.append(el('p','where',e.location+(e.start&&e.end?' · '+dm(e.start)+' – '+dm(e.end):'')));else if(e.end&&!e.start)c.append(el('p','where','Until '+dm(e.end)));
 if(e.blurb)c.append(el('p','blurb',e.blurb));
 if(e.status==='live'&&e.start&&e.end){const p=el('div','spot-prog'),bar=el('i'),fill=el('b');fill.style.width=Math.min(100,Math.max(2,(now-e.start)/(e.end-e.start)*100)).toFixed(1)+'%';bar.append(fill);
  const total=Math.ceil((e.end-e.start)/86400000),n=Math.min(total,Math.floor((now-e.start)/86400000)+1);p.append(el('span','','Day '+n+' of '+total),bar,el('span','','ends in '+span(e.end-now)));c.append(p);}
 const days=e.days||[];if(days.length){const i=days.findIndex(d=>now>=d.start&&now<d.end),cur=days[i],next=i>=0?days[i+1]:days.find(d=>d.start>now);
  if(cur||next){const b=el('div','spot-now');b.append(el('small','',cur?'On the show floor now':'First up'),el('b','',(cur||next).label));
   if(cur)b.append(el('span','',next?'changes in '+span(cur.end-now):'until the close'));else b.append(el('span','','in '+span(next.start-now)));
   const note=[(cur||next).note,cur&&next?'Next: '+next.label:''].filter(Boolean).join(' · ');if(note)b.append(el('em','',note));c.append(b);}
  const ul=el('ul','spot-days');for(const d of days){const li=el('li',now>=d.end?'past':d===cur?'now':'');li.append(el('small','',dm(d.start)),el('span','',d.label));ul.append(li);}
  const det=el('details'),sm=el('summary','','Full schedule ('+days.length+' days, your local dates)');sm.style.cssText='cursor:pointer;color:var(--muted);font-size:13px;margin-bottom:8px';det.append(sm,ul);if(innerWidth>760)det.open=true;c.append(det);}
 if(e.news?.length){const ul=el('ul','spot-links');for(const n of e.news){const li=el('li'),a=el('a','',n.title);a.href=n.url;a.target='_blank';a.rel='noopener';li.append(a);if(n.at)li.append(el('small','',ago(n.at)));ul.append(li);}c.append(ul);}
 if(e.url){const a=el('a','go',e.days?.length?'Schedule and details on RSI':'Details');a.href=e.url;a.target='_blank';a.rel='noopener';c.append(a);}
 return c;}
function renderIntel(){
 const x=intelNow(),sec=$('intel');sec.hidden=!x||(!x.news?.length&&!x.sales?.length&&!x.deals?.length&&!x.events?.length&&!x.spotlights?.length&&!x.releases?.length);if(sec.hidden)return;
 $('intel-at').textContent=x.at?'Updated '+ago(x.at)+'.':'';
 const sp=$('intel-spot');sp.textContent='';for(const e of x.spotlights||[])sp.append(spotCard(e));
 const rel=$('intel-rel');rel.textContent='';$('intel-rel-card').hidden=!x.releases?.length;
 for(const r of x.releases||[]){const b=el(r.url?'a':'div',r.url?'':'r1');if(r.url){b.href=r.url;b.target='_blank';b.rel='noopener';}
  b.append(el('span','ch '+r.channel,r.channel==='LIVE'?'LIVE · everyone':r.channel==='PTU'?'PTU · test servers':'EPTU · Evocati'),el('b','','Alpha '+r.version),
   el('small','',[r.audience,r.build?'build '+r.build:'',r.at?(r.channel==='LIVE'?'released ':'updated ')+ago(r.at):''].filter(Boolean).join(' · ')||' '),el('small','',r.url?'Read the patch notes →':''));rel.append(b);}
 const pn=$('intel-patches');pn.textContent='';$('intel-patch-card').hidden=!x.patches?.length;
 for(const p of x.patches||[])pn.append(irow(p.channel||'PATCH',p.channel||'patch',p.title.replace(/^\s*\[[^\]]+\]\s*/,''),p.audience,p.at?ago(p.at).toUpperCase():'','',p.url));
 const n=$('intel-news');n.textContent='';if(!x.news?.length)n.append(el('li','empty','No news loaded yet.'));for(const it of x.news||[])n.append(irow(ITAG[it.tag]||'NEWS',it.tag,it.title,'',it.at?ago(it.at).toUpperCase():'','',it.url));
 const s=$('intel-sales');s.textContent='';$('intel-sales-kind').textContent='In the pledge store'+(x.salesTotal?' · '+x.salesTotal+' ships':'');if(!x.sales?.length)s.append(el('li','empty','Ship list not loaded yet.'));
 for(const m of x.sales||[])s.append(irow('','',m.name,(m.maker||'')+(m.status?' · '+m.status.replace(/-/g,' '):''),'$'+(Math.round(m.price)===m.price?m.price:m.price.toFixed(2)),'PLEDGE',m.url,m.image||''));
 for(const [id,list] of [['deals',x.deals||[]],['events',x.events||[]]]){const card=$('intel-'+id+'-card'),ul=$('intel-'+id);ul.textContent='';card.hidden=!list.length;
  for(const d of list)ul.append(irow(IKIND[d.kind]||'NOTE',d.kind,d.title,d.detail,until(d.until).toUpperCase(),'',d.url));}
 const c=$('intel-cmds');c.textContent='';for(const [cmd,hint] of [['!news','latest Comm-Links'],['!patch','game version & patch notes'],['!sales','ships in the store'],['!deals','CCU & warbond deals'],['!events','events & Free Fly']])if(!x.commands?.length||x.commands.includes(cmd))c.append(copyChip(cmd,hint));
 loadSiteIntel();
}
function renderLog(){
 const l=feed.log,sec=$('logbook');sec.hidden=!l||!l.entries?.length;if(sec.hidden)return;
 $('logbook-lede').textContent='Moments from the stream on '+new Date(l.stream).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})+', logged by the crew with !log.';
 const ol=$('logbook-list');ol.textContent='';ol.className='rows logrows';
 for(const e of l.entries){const li=el('li'),t=el('div');t.append(el('div','quote','“'+e.text+'”'),who(e));li.append(t,el('span','when',new Date(e.at).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})));ol.append(li);}
}

// ---------- find your card ----------
const TIER={blue:['Blue Explorer','#3fb2ff','#0b2c6e'],silver:['Silver Sentinel','#eef3f9','#3a4552'],gold:['Gold Commander','#ffc53d','#5c3a04'],platinum:['Platinum Vanguard','#c08bff','#2a0f5c']};
async function loadCrew(force=false){
 const sec=$('find');if(sec.hidden)return null;
 // 2.32.0: reload as soon as the feed says a card changed (feed.crew.at); otherwise at most every five minutes.
 const ver=feed?.crew?.at||0;
 if(crew&&!force&&ver===crewVer&&Date.now()-crewAt<5*60000)return crew;
 if(crewLoading)return crewLoading;
 $('crew-note').textContent='Loading the crew list…';
 crewLoading=(async()=>{try{const r=await fetch(crewUrl()+'?t='+(ver||Math.floor(Date.now()/300000)),{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json();if(d?.schema!==1||!Array.isArray(d.members))throw new Error();
  crew=d.members.map(m=>({name:String(m[0]),platform:m[1],tier:m[2],rank:m[3]|0,place:m[4]|0,lifetime:Number(m[5])||0,medals:Array.isArray(m[6])?m[6]:[],record:Array.isArray(m[7])?m[7]:null,front:m[8]&&typeof m[8]==='object'?m[8]:null,back:m[9]&&typeof m[9]==='object'?m[9]:null,key:String(m[0]).toLowerCase()}));crewAt=Date.now();crewVer=ver;
  $('crew-note').textContent=fmt(crew.length)+' crew members · updated '+ago(d.generatedAt)+'. Not listed? Earn some Voyager points on stream and check back.';
  search();
  if(pendingCard){const pm=crew.find(m=>m.key===pendingCard);pendingCard='';if(pm)show(pm,false);else toast('That card is not on the crew list');}
  try{const saved=localStorage.getItem('voyager-me');if(saved&&!selected){const me=crew.find(m=>m.key===saved);if(me)show(me,false);}}catch{}
  // The card on screen follows the new data (it used to stay as first drawn until the page was reopened).
  try{if(selected){const fresh=crew.find(m=>m.key===selected.key&&m.platform===selected.platform)||crew.find(m=>m.key===selected.key);if(fresh&&document.activeElement!==$('crew-search')&&JSON.stringify(fresh)!==JSON.stringify(selected))show(fresh,false);}}catch{}
  renderHome();try{renderRequests();}catch{}
  return crew;}catch{$('crew-note').textContent='The crew list isn’t available right now. Try again in a few minutes.';return null;}finally{crewLoading=null;}})();
 return crewLoading;
}
function search(){
 const q=$('crew-search').value.trim().toLowerCase(),out=$('crew-results');out.textContent='';if(!crew||!q)return;
 const hits=crew.filter(m=>m.key.includes(q)).sort((a,b)=>(b.key===q)-(a.key===q)||(b.key.startsWith(q))-(a.key.startsWith(q))||a.place-b.place).slice(0,8);
 for(const m of hits){const li=el('li'),b=el('button');b.type='button';b.append(who(m),el('span','meta',(feed?.ranks?.ladder?.[m.rank]?.name||'')+' · #'+fmt(m.place)));b.onclick=()=>show(m);li.append(b);out.append(li);}
 if(!hits.length)out.append(el('li','lede small','No one by that name yet.'));
}
// 2.20.20: the FRONT is the very card shown on stream for !voyager (Voyager's own card template, drawn from the same data);
// the BACK holds everything the front doesn't show. Tap the card or use the buttons to flip.
function medalTile(md,g,i,locked){const d=el('div','medal'+(locked?' locked':''));d.append(hex(md,locked?0:g,locked?0:120+i*70),el('span','',md?.name||'Medal'),el('small','',locked?'Locked':md&&['count','rank'].includes(md.kind)?GRADES[g]:'Special'));return d;}
const plural=(n,one,many)=>fmt(n)+' '+(n===1?one:many);
function tile(label,value,sub){const t=el('div','rtile');t.append(el('small','',label),el('b','',value));if(sub)t.append(el('span','',sub));return t;}
const FIELD_ICONS=['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7','M3 5h18v14H3z M7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4 M14 9h4 M14 13h4','M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5 M8 14h2 M12 14h2 M16 14h2 M8 17h2 M12 17h2'];
const FIELD_LABELS=['MEMBER NAME','MEMBER ID','MEMBER SINCE'];
// The same grade metals as the stream card.
const CARD_LOOK=[{metal:'linear-gradient(180deg,#ffe6cc 0%,#f0a868 30%,#a5582a 52%,#6e3510 60%,#d68a4c 84%,#ffd9b0 100%)',ink:'#fff3e6',tag:'#f0b07a'},
 {metal:'linear-gradient(180deg,#ffffff 0%,#eef2f6 26%,#9aa6b4 50%,#55606d 58%,#cfd8e2 84%,#ffffff 100%)',ink:'#ffffff',tag:'#dfe6ee'},
 {metal:'linear-gradient(180deg,#fffbe0 0%,#ffe07a 26%,#e0a420 48%,#7a4d00 56%,#ffcf4a 82%,#fff3b8 100%)',ink:'#fff8dc',tag:'#ffd257'},
 {metal:'linear-gradient(135deg,#8ff6ff 0%,#9fb4ff 30%,#c58bff 52%,#ff8fe0 74%,#ffe28a 100%)',ink:'#ffffff',tag:'#d6a8ff'}];
const RANK_IDS=['mid','aslt','slt','lt','lcdr','cdr','capt','cdre','radm','vadm','adml','af'];
let template=null;
function loadTemplate(){return template||(template=import('./card-template.js?v=2.20.47').catch(()=>null));}
// Draws one side of the stream card with the overlay's own template: 'front', 'stats' (the back) or 'badges' (medal wall).
async function drawSide(host,f,side='front',b=null){
 const T=await loadTemplate();if(!T||!f||(side!=='front'&&!b)){host.append(el('p','lede small',side==='front'?'The full card appears after the next update from the stream.':'The back of the card appears after the next update from the stream.'));return false;}
 const byName=new Map([...catalogue.values()].map(md=>[md.name,md]));
 const t={...T.TIERS[f.tier]||T.TIERS.blue,next:f.next,pct:f.pct,need:f.need};
 const ribbons=f.vip||f.emerald;
 const v={front:side==='front'?'block':'none',stats:side==='stats'?'block':'none',badges:side==='badges'?'block':'none',banner:'none',bannerEyebrow:'',bannerText:'',
  vip:f.vip?'flex':'none',emerald:f.emerald&&!f.vip?'flex':'none',ribbonPad:ribbons?'160px':'0',
  vipText:f.vip&&f.emerald?'★ RUBY VIP · EMERALD ★':'★ RUBY VIP ★',vipFont:f.vip&&f.emerald?'15px':'17px',vipSpacing:f.vip&&f.emerald?'3px':'5px',
  vipBg:f.vip&&f.emerald?'linear-gradient(90deg, #e0313f 0%, #e0313f 44%, #22b04c 56%, #22b04c 100%)':'linear-gradient(90deg, #e0313f, #e0313f)'};
 const c={callsign:f.callsign,badgeCount:f.badgeCount,statsEyebrow:b?.statsEyebrow||'',badgesEyebrow:b?.badgesEyebrow||'',alsoEarned:b?.alsoEarned||'',promoted:''};
 const badge=([name,sub,earned])=>{const md=byName.get(name),g=GRADES.indexOf(sub),look=earned&&g>=0?CARD_LOOK[g]:null;return {icon:md?.icon||'',name,sub,op:earned?'1':'.34',filter:earned?'none':'grayscale(1)',metal:look?.metal||'',ink:look?.ink||'',tag:look?.tag||''};};
 const rows=list=>(list||[]).map(([label,value])=>({label,value}));
 const d={fields:f.fields.map((value,i)=>({label:FIELD_LABELS[i],value,icon:FIELD_ICONS[i]})),stats:f.stats.map(([label,value,sub])=>({label,value,sub})),extras:f.extras.map(([label,value])=>({label,value})),
  equipped:f.equipped.map(([name,sub])=>badge([name,sub,1])),
  badges:(b?.badges||[]).map(badge),dread:rows(b?.dread),versus:rows(b?.versus),missions:rows(b?.missions),community:(b?.community||[]).map(([label,value,sub])=>({label,value,sub}))};
 const k=f.rank?{show:'flex',roleShow:'none',name:f.rank.name,place:f.rank.place}:{show:'none',roleShow:'inline',name:'',place:''};
 for(const id of RANK_IDS)k['s_'+id]=f.rank&&f.rank.id===id?'inline-flex':'none';
 // The template escapes every value itself (it is what the stream overlay uses).
 const scale=el('div','cardscale'),stage=el('div','cardstage');stage.innerHTML=T.cardHTML(t,v,c,d,k);scale.append(stage);host.append(scale);
 const fit=()=>{
  if(document.fullscreenElement===host){const k=Math.min(innerWidth/1200,innerHeight/720);scale.style.transform='translate('+((innerWidth-1200*k)/2)+'px,'+((innerHeight-720*k)/2)+'px) scale('+k+')';return;}
  const w=host.clientWidth||600;scale.style.transform='scale('+(w/1200)+')';host.style.height=(720*w/1200)+'px';};
 fit();new ResizeObserver(fit).observe(host);addEventListener('resize',fit);document.addEventListener('fullscreenchange',()=>{fit();if(!document.fullscreenElement)try{screen.orientation?.unlock?.();}catch{}});
 // Small screens: show the card full screen (sideways on phones) so every detail is readable.
 if(host.requestFullscreen){const btn=el('button','fs-btn','⤢ Full screen');btn.type='button';btn.onclick=async e=>{e.stopPropagation();try{await host.requestFullscreen();await screen.orientation?.lock?.('landscape');}catch{}};host.append(btn);}
 return true;
}
const drawFront=(host,f)=>drawSide(host,f,'front');
function show(m,remember=true,side='front'){
 selected=m;$('crew-results').textContent='';$('crew-search').value='';
 if(remember){try{localStorage.setItem('voyager-me',m.key);}catch{}store.del('voyager-snap');renderHome();push.syncName();}
 const [title,c1,c2]=TIER[m.tier]||TIER.blue,box=$('member');box.hidden=false;box.textContent='';box.className='member-wrap';
 box.style.setProperty('--t',c1);box.style.setProperty('--t2',c2);
 const total=catalogue.size||0,r=m.record||[];
 const rec=m.record?{honour:r[0],fights:r[1],victories:r[2],mvp:r[3],damage:r[4],wins:r[5],losses:r[6],missions:r[7],giveaways:r[8],podiums:r[9],seasonPlace:r[10],seasonPoints:r[11],since:r[12],
  activity:r.length>=25?{hours:r[13],months:r[14],subBest:r[15],gifts:r[16],streams:r[17],streak:r[18],bestStreak:r[19],messages:r[20],followDays:r[21],versusBest:r[22],points:r[23],private:r[24]===1}:null}:null;
 const ctl=el('div','sides');ctl.setAttribute('role','tablist');ctl.setAttribute('aria-label','Card side');
 // 2.20.47: Front, Back and Medals are the stream card's own three sides, drawn by the same template in the member's tier.
 const SIDES=[['front','Front'],['back','Back'],['medals','Medals']],tabs={};
 for(const [id,label] of SIDES){const b=el('button','',label);b.type='button';b.setAttribute('role','tab');b.onclick=()=>setSide(id);ctl.append(b);tabs[id]=b;}
 const flipper=el('div','card3d'),faces={front:el('div','face front cardface'),back:el('div','face back cardface'),medals:el('div','face medals cardface')};
 let current=SIDES.some(x=>x[0]===side)?side:'front',busy=false;
 const paint=s=>{for(const [id,face] of Object.entries(faces)){face.hidden=id!==s;tabs[id].setAttribute('aria-selected',String(id===s));}};
 const setSide=async s=>{if(s===current||busy)return;busy=true;flipper.classList.add('turn');await new Promise(r=>setTimeout(r,230));current=s;paint(s);flipper.classList.remove('turn');flipper.classList.add('turned');requestAnimationFrame(()=>requestAnimationFrame(()=>flipper.classList.remove('turned')));setTimeout(()=>busy=false,260);};
 flipper.onclick=e=>{if(e.target.closest('button,summary,details'))return;setSide(current==='front'?'back':current==='back'?'medals':'front');};
 flipper.tabIndex=0;flipper.setAttribute('aria-label','Membership card. Press Enter to turn it over.');flipper.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flipper.click();}};
 drawSide(faces.front,m.front,'front');
 // BACK: the fleet record (Dreadnought, Versus, missions, crew & community with the stream streak), as on stream.
 drawSide(faces.back,m.front,'stats',m.back);
 // MEDALS: the medal wall side, then anything still to earn.
 drawSide(faces.medals,m.front,'badges',m.back);
 flipper.append(faces.front,faces.back,faces.medals);paint(current);
 const earned=new Set(m.medals.map(x=>x[0])),locked=[...catalogue.values()].filter(md=>!earned.has(md.id)&&md.kind!=='secret');
 const under=el('div','under-card');
 if(rec&&!m.back){const a=rec.activity,g=el('div','rgrid');g.append(tile('Dreadnought',plural(rec.victories,'victory','victories'),plural(rec.fights,'fight','fights')+' · MVP ×'+fmt(rec.mvp)),tile('Missions',fmt(rec.missions),'weekly missions completed'),tile('Giveaways won',fmt(rec.giveaways),'confirmed wins'));if(a)g.append(tile('Stream streak',a.private?'Private':a.streak?plural(a.streak,'stream','streams')+' in a row':'—',a.private?'':a.streak?'Twitch watch streak · best '+fmt(a.bestStreak):'share your Twitch watch streak in chat'));under.append(g);}
 under.append(el('h4','','Medals · '+m.medals.length+' of '+(total||'–')+' unlocked'));
 if(locked.length){const det=el('details','locked-list');det.append(el('summary','','Still to earn · '+locked.length));const lg=el('div','medal-grid');for(const md of locked)lg.append(medalTile(md,0,0,true));det.append(lg);under.append(det);}
 under.append(el('p','hint','Tap the card to turn it over ↻'));
 const again=el('button','chip','Not you? Search again');again.type='button';again.onclick=()=>{try{localStorage.removeItem('voyager-me');}catch{}selected=null;box.hidden=true;$('crew-search').focus();renderHome();};
 const sh=el('button','chip','Share this card');sh.type='button';sh.onclick=()=>share({title:m.name+' · Voyager',text:m.name+' — '+title+(m.place?', #'+fmt(m.place)+' on the Voyager crew':'')+(m.medals.length?' · '+m.medals.length+' medals':'')+'.',url:location.origin+location.pathname+'#card/'+encodeURIComponent(m.key)});
 const foot=el('div','card-foot');foot.append(sh,again,el('span','lede small','Tap the card to turn it over · type !voyager in chat to show it on stream.'));
 box.append(ctl,flipper,under,foot);
}
$('crew-search').addEventListener('input',()=>{if(!crew)loadCrew();search();});
$('crew-search').addEventListener('focus',()=>loadCrew());

// ---------- home (2.22.0): you first ----------
let sinceText=null;
function sinceLast(me){
 if(sinceText!==null)return sinceText;sinceText='';
 const now={k:me.key,l:me.lifetime,m:me.medals.length,r:me.rank,at:Date.now()};let old=null;try{old=JSON.parse(store.get('voyager-snap')||'null');}catch{}
 if(old&&old.k===me.key&&now.at-old.at>10*60000){const bits=[];if(now.l>old.l)bits.push('+'+fmt(now.l-old.l)+' points');if(now.m>old.m)bits.push((now.m-old.m)+' new medal'+(now.m-old.m===1?'':'s'));if(now.r>old.r)bits.push('promoted to '+(feed.ranks?.ladder?.[now.r]?.name||'a new rank'));
  if(bits.length)sinceText='Since your last visit ('+ago(old.at)+'): '+bits.join(' · ')+'.';}
 if(!old||old.k!==me.key||now.at-old.at>10*60000)store.set('voyager-snap',JSON.stringify(now));
 return sinceText;
}
function renderHome(){
 if(!feed)return;const on=!!feed.live?.onAir,fr=feed.online&&Date.now()-feed.generatedAt<15*60000;
 $('home-onair').dataset.on=String(on&&fr);$('home-onair-text').textContent=on&&fr?'Live now':fr?'Stream tools on':'Off air';$('home-updated').textContent='Updated '+ago(feed.generatedAt);
 const box=$('home-me'),saved=store.get('voyager-me'),me=saved&&crew?crew.find(m=>m.key===saved):null,since=$('home-since');
 $('h-home').textContent=me?'Welcome back, '+me.name:'Welcome aboard';box.textContent='';since.hidden=true;
 if(me){const [title,c1,c2]=TIER[me.tier]||TIER.blue,rank=feed.ranks?.ladder?.[me.rank]?.name||'';
  const b=el('button','me-card');b.type='button';b.style.setProperty('--t',c1);b.style.setProperty('--t2',c2);const t=el('div');t.append(el('b','',me.name),el('small','',title+(rank?' · '+rank:'')+(PLATFORM[me.platform]?' · '+PLATFORM[me.platform]:'')));
  b.append(el('span','badge',(title[0]||'V')),t,el('span','go','›'));b.onclick=()=>go('crew');
  const st=el('div','me-stats');for(const [k,v] of [['Lifetime points',fmt(me.lifetime)],['Crew place',me.place?'#'+fmt(me.place):'—'],['Medals',fmt(me.medals.length)]]){const d=el('div');d.append(el('small','',k),el('b','',v));st.append(d);}
  box.append(b,st);const txt=sinceLast(me);if(txt){since.textContent=txt;since.hidden=false;}}
 else if(saved&&feed.crew&&!crew){box.append(el('div','sk sk-block'));loadCrew();}
 else if(feed.crew){const c=el('div','me-cta');const btn=el('button','','Find my card');btn.type='button';btn.onclick=()=>{go('crew');setTimeout(()=>$('crew-search')?.focus(),250);};c.append(el('span','','Find your name once and your tier, rank, points and medals live here.'),btn);box.append(c);}
 else box.append(el('p','lede',feed.channel?.tagline||'Giveaways, the Dreadnought, ranks and medals, live from the stream.'));
}
// ---------- install (PWA) ----------
let installEvent=null;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function installHint(){if(EMBED||standalone())return;const box=$('install');if(installEvent){$('install-text').textContent='Add Voyager to your home screen for one-tap access.';$('install-btn').textContent='Install';box.hidden=false;}
 else if(isIOS()){$('install-text').textContent='Add Voyager to your Home Screen to use it like an app.';$('install-btn').textContent='How';box.hidden=false;}}
async function installFlow(){if(installEvent){installEvent.prompt();try{await installEvent.userChoice;}catch{}installEvent=null;$('install').hidden=true;return;}onboard(true,2);}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;installHint();});
addEventListener('appinstalled',()=>{$('install').hidden=true;toast('Voyager installed');});
$('install-btn').onclick=installFlow;
if(!EMBED&&'serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
installHint();

// ---------- welcome (first run): what it is, find your name, add to home screen ----------
function onboard(force=false,start=0){
 if(EMBED||(!force&&(store.get('voyager-welcomed')||standalone()&&store.get('voyager-me'))))return;if($('onb'))return;
 const wrap=el('div','onb');wrap.id='onb';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','Welcome to Voyager');const inner=el('div','onb-in');wrap.append(inner);document.body.append(wrap);
 let step=start;const close=()=>{store.set('voyager-welcomed','1');wrap.remove();renderHome();};
 const dots=()=>{const d=el('div','dots');for(let i=0;i<3;i++)d.append(el('i',i===step?'on':''));return d;};
 const nav=(nextLabel,next)=>{const row=el('div','row');const n=el('button','btn',nextLabel);n.type='button';n.onclick=next;row.append(n);const sk=el('button','skip',step<2?'Skip':'Close');sk.type='button';sk.onclick=close;return [row,sk];};
 function draw(){inner.textContent='';
  if(step===0){const img=el('img','logo');img.src='assets/voyager.png';img.alt='';const f=el('div','feat');
   for(const [t,d] of [['Your card','Tier, rank, points and medals'],['Live','Giveaways and the Dreadnought as they happen'],['Community','Leaderboards, winners, squadrons'],['SC Intel','Star Citizen news and ships in the store']]){const x=el('div','',t);x.append(el('small','',d));f.append(x);}
   inner.append(img,dots(),el('h1','','Welcome aboard'),el('p','','Voyager is the companion to the '+((feed?.channel?.name)||'MDA009')+' stream. Keep it next to the stream, or check in between streams.'),f,...nav('Next',()=>{step=1;draw();}));}
  else if(step===1){inner.append(dots(),el('h1','','Find your name'),el('p','','Pick yourself from the crew list and Voyager opens on your own card every time.'));
   if(!feed?.crew){inner.append(el('p','','The crew list is not available right now — you can do this later from My card.'),...nav('Next',()=>{step=2;draw();}));return;}
   const lab=el('label','search');const inp=el('input');inp.type='search';inp.placeholder='Type your name…';inp.autocomplete='off';inp.autocapitalize='off';inp.spellcheck=false;lab.append(inp);const res=el('ul','results');const picked=el('div','picked');picked.hidden=true;
   const find=()=>{res.textContent='';const q=inp.value.trim().toLowerCase();if(q.length<2||!crew)return;for(const m of crew.filter(x=>x.key.includes(q)).sort((a,b)=>(a.key.startsWith(q)?0:1)-(b.key.startsWith(q)?0:1)||a.place-b.place).slice(0,6)){const li=el('li');const b=el('button');b.type='button';b.append(el('b','',m.name),el('small','',(TIER[m.tier]||TIER.blue)[0]+(PLATFORM[m.platform]?' · '+PLATFORM[m.platform]:'')));
     b.onclick=()=>{show(m,true);res.textContent='';inp.value='';picked.hidden=false;picked.textContent='You are '+m.name+' — '+(TIER[m.tier]||TIER.blue)[0]+'.';};li.append(b);res.append(li);}};
   inp.oninput=find;loadCrew().then(find);
   inner.append(lab,res,picked,el('p','','Not listed yet? Earn some Voyager points on stream — chat, !report, join a Dreadnought fight — and check back.'),...nav('Next',()=>{step=2;draw();}));setTimeout(()=>inp.focus(),100);}
  else{inner.append(dots(),el('h1','',standalone()?'You are all set':'Put it on your home screen'));
   if(standalone())inner.append(el('p','','Voyager is installed. It opens on your card and updates itself while the stream is live.'));
   else if(installEvent){inner.append(el('p','','One tap and Voyager sits beside your other apps, full screen, and opens instantly.'));const row=el('div','row');const b=el('button','btn','Install Voyager');b.type='button';b.onclick=async()=>{await installFlow();close();};row.append(b);inner.append(row);}
   else if(isIOS()){const ol=el('ol');for(const t of ['Open this page in Safari.','Tap the Share button (the square with an arrow).','Choose "Add to Home Screen", then Add.'])ol.append(el('li','',t));inner.append(el('p','','On iPhone and iPad:'),ol);}
   else{const ol=el('ol');for(const t of ['Open your browser menu (⋮ or ⋯).','Choose "Install app" or "Add to Home screen".'])ol.append(el('li','',t));inner.append(el('p','','In Chrome, Edge or Samsung Internet:'),ol);}
   const row=el('div','row');const d=el('button','btn'+(installEvent&&!standalone()?' ghost':''),'Done');d.type='button';d.onclick=close;row.append(d);inner.append(row);}
 }
 draw();
}

// ---------- notifications (2.23.0): Web Push through the site's own Worker ----------
const NTF=[['live','Stream is live','When the stream goes on air'],['dread','Dreadnought incoming','When the Dreadnought appears, so you can !join in time'],['giveaway','Giveaway open','When a new giveaway opens'],['win','You won','When you are confirmed as a giveaway winner (uses the card name you picked)']];
const push={ok:false,key:'',sub:null,busy:false,
 supported:()=>!EMBED&&location.protocol==='https:'&&'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window,
 topics(){try{const t=JSON.parse(store.get('voyager-topics')||'null');if(Array.isArray(t))return t;}catch{}return NTF.map(x=>x[0]);},
 async init(){ // is the Worker there, and is this device already subscribed?
  if(!push.supported()){push.render();return;}
  try{const r=await fetch('api/push/key',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();if(!d.key)throw 0;push.key=d.key;push.ok=true;}catch{push.ok=false;}
  push.render();renderTabs();
  if(push.ok){try{const reg=await Promise.race([navigator.serviceWorker.ready,new Promise((_,no)=>setTimeout(no,6000))]);push.sub=await reg.pushManager.getSubscription();}catch{}}
  push.render();renderTabs();
 },
 async save(topics){const r=await fetch('api/push/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({subscription:push.sub.toJSON(),topics,name:store.get('voyager-me')||''})});if(!r.ok)throw new Error((await r.json().catch(()=>({}))).message||'Could not save');store.set('voyager-topics',JSON.stringify(topics));},
 async enable(){if(push.busy)return;push.busy=true;try{
   if(isIOS()&&!standalone()){toast('Add Voyager to your Home Screen first');onboard(true,2);return;}
   const perm=await Notification.requestPermission();if(perm!=='granted'){push.render();return;}
   const reg=await navigator.serviceWorker.ready,pad='='.repeat((4-push.key.length%4)%4),raw=atob((push.key+pad).replace(/-/g,'+').replace(/_/g,'/'));
   push.sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:Uint8Array.from(raw,c=>c.charCodeAt(0))});
   const t=push.topics();await push.save(t.length?t:NTF.map(x=>x[0]));toast('Notifications are on');
  }catch(e){toast(e?.message||'Could not turn notifications on');}finally{push.busy=false;push.render();}},
 async disable(){try{if(push.sub){await fetch('api/push/unsubscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({endpoint:push.sub.endpoint})}).catch(()=>{});await push.sub.unsubscribe();}}catch{}push.sub=null;toast('Notifications are off');push.render();},
 async setTopic(k,on){const t=new Set(push.topics());on?t.add(k):t.delete(k);const list=NTF.map(x=>x[0]).filter(x=>t.has(x));try{if(!list.length){await push.disable();store.set('voyager-topics','[]');return;}await push.save(list);}catch(e){toast(e?.message||'Could not save');}push.render();},
 async syncName(){if(push.sub&&push.ok)try{await push.save(push.topics());}catch{}},
 render(){
  const sec=$('notify');if(!sec)return;sec.hidden=!push.ok;const prompt=$('ntf-prompt');
  const perm=push.supported()?Notification.permission:'denied',on=!!push.sub&&perm==='granted',needHome=isIOS()&&!standalone();
  if(prompt)prompt.hidden=!(push.ok&&!on&&perm==='default'&&!store.get('voyager-ntf-later')&&feed);
  if(!push.ok)return;
  const st=$('ntf-state');st.dataset.on=on?'true':perm==='denied'?'blocked':'false';st.textContent='';st.append(el('i'),el('span','',on?'On for this device':perm==='denied'?'Blocked in this browser':'Off'));
  const list=$('ntf-list');list.textContent='';const mine=push.topics();
  for(const [k,title,sub] of NTF){const lab=el('label');const t=el('div');t.append(el('b','',title),el('small','',k==='win'&&!store.get('voyager-me')?sub+' — find your card first':sub));const c=el('input');c.type='checkbox';c.checked=on&&mine.includes(k);c.disabled=!on;c.setAttribute('aria-label',title);c.onchange=()=>push.setTopic(k,c.checked);lab.append(t,c);list.append(lab);}
  $('ntf-on').hidden=on;$('ntf-test').hidden=!on;$('ntf-off').hidden=!on;
  $('ntf-note').textContent=perm==='denied'?'Notifications are blocked for this site. Allow them in your browser or phone settings, then come back here.':needHome&&!on?'On iPhone and iPad, add Voyager to your Home Screen first (Share › Add to Home Screen), then open it from there and turn notifications on.':on?'Alerts arrive within a minute or two of it happening on stream.':'Your browser will ask for permission. Only this device is signed up; nothing else about you is stored.';
 }};
$('ntf-on').onclick=()=>push.enable();$('ntf-off').onclick=()=>push.disable();
$('ntf-test').onclick=async()=>{try{const r=await fetch('api/push/test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({endpoint:push.sub.endpoint})});toast(r.ok?'Test sent — it should appear in a moment':'The test could not be sent');}catch{toast('The test could not be sent');}};
$('ntf-prompt-on').onclick=()=>{go('notify');push.enable();};$('ntf-prompt-x').onclick=()=>{store.set('voyager-ntf-later','1');$('ntf-prompt').hidden=true;};
push.init();

// ---------- viewer requests (2.24.0); 2.30.0: each option once per person per stream ----------
function deviceId(){let d=store.get('voyager-device');if(!/^[a-f0-9]{32}$/.test(d||'')){d=[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join('');store.set('voyager-device',d);}return d;}
let reqBusy=false;
function renderRequests(){
 // 2.30.0: each option can be asked for once per stream (was one request in total). What this device has asked is remembered per stream.
 const sec=$('requests');if(!sec)return;const rq=feed?.requests;sec.hidden=EMBED||!rq||!rq.options?.length;if(sec.hidden)return;
 const me=store.get('voyager-me'),meName=me&&crew?crew.find(m=>m.key===me)?.name:me;let mine=null;try{mine=JSON.parse(store.get('voyager-request')||'null');}catch{}
 if(!mine||mine.round!==rq.round)mine={round:rq.round,keys:[]};if(!Array.isArray(mine.keys))mine.keys=mine.key?[mine.key]:[];
 const listed=(rq.recent||[]).filter(r=>me&&r.name.toLowerCase()===me),asked=o=>mine.keys.includes(o.key)||listed.some(r=>r.label===o.label),left=rq.options.filter(o=>!asked(o)).length,granted=listed.filter(r=>r.done).length;
 $('req-state').textContent=rq.open?'Open':'Closed';
 $('req-lede').textContent=!rq.open?'Requests open while the stream is live. Come back when it is on air.':!me?'Find your card first, then ask for what you would like to see on stream. You can ask for each one once per stream.':!left?'You have asked for everything on the list this stream'+(granted?' — '+granted+' granted ✓':'.'):left<rq.options.length?'Sent'+(granted?' ('+granted+' granted ✓)':'')+'. You can still ask for the others, once each per stream.':'Ask for what you would like to see on stream'+(meName?', '+meName:'')+'. Each one once per stream.';
 const box=$('req-opts');box.textContent='';
 for(const o of rq.options){const b=el('button','',o.label);b.type='button';const done=listed.some(r=>r.label===o.label&&r.done);if(asked(o)){b.classList.add('mine');b.append(el('small','',done?' ✓ granted':' ✓ sent'));}b.disabled=!rq.open||asked(o)||reqBusy;
  b.onclick=async()=>{if(!me){toast('Find your card first');go('crew');setTimeout(()=>$('crew-search')?.focus(),250);return;}
   reqBusy=true;renderRequests();try{const r=await fetch('api/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:meName||me,key:o.key,device:deviceId()})});const d=await r.json().catch(()=>({}));
    if(r.ok||r.status===409&&/already/.test(d.message||'')){mine.keys.push(o.key);store.set('voyager-request',JSON.stringify({round:rq.round,keys:mine.keys,at:Date.now()}));toast(r.ok?o.label+' requested — watch the stream':'You have already asked for '+o.label+' this stream');}else toast(d.message||'The request could not be sent');
   }catch{toast('The request could not be sent');}reqBusy=false;renderRequests();};
  box.append(b);}
 const t=$('req-tally');t.textContent='';for(const x of rq.tally||[]){const sp=el('span','',x.label);sp.append(el('b','',String(x.count)));t.append(sp);}
 const rec=$('req-recent');rec.textContent='';for(const r of (rq.recent||[]).slice(0,5)){const li=el('li');li.append(el('span','',r.name+' asked for '+r.label+(r.done?' ✓':'')),el('small','',ago(r.at)));rec.append(li);}
}

// ---------- watch here (2.23.0): the Twitch player, loaded only when tapped ----------
function renderWatch(){
 const sec=$('watch');if(!sec)return;const url=feed?.channel?.links?.twitch||'',m=url.match(/^https:\/\/(?:www\.)?twitch\.tv\/([A-Za-z0-9_]{3,25})\/?$/);
 sec.hidden=EMBED||!m||!/^[a-z0-9.-]+$/i.test(location.hostname);if(sec.hidden)return;
 const ch=m[1],on=!!feed.live?.onAir;$('watch-chat').href='https://www.twitch.tv/'+ch;$('player-label').textContent=on?'Play the stream here':'Off air — play the channel here';
 $('player-start').onclick=()=>{const f=document.createElement('iframe');f.src='https://player.twitch.tv/?channel='+encodeURIComponent(ch)+'&parent='+encodeURIComponent(location.hostname)+'&muted=false&autoplay=true';f.allow='autoplay; fullscreen; picture-in-picture';f.allowFullscreen=true;f.title='Twitch stream';$('player').replaceChildren(f);};
}

// ---------- pull to refresh (phones and tablets) ----------
(()=>{if(EMBED||!('ontouchstart' in window))return;const ind=$('ptr');let y0=null,pull=0,busy=false;
 const set=(px,live)=>{ind.classList.toggle('live',live);ind.style.transform='translateY('+(px-70)+'px)';ind.style.opacity=String(Math.min(1,px/60));ind.style.setProperty('--r',(px*4)+'deg');};
 addEventListener('touchstart',e=>{if(busy||window.scrollY>0||$('onb')||e.touches.length!==1){y0=null;return;}y0=e.touches[0].clientY;pull=0;},{passive:true});
 addEventListener('touchmove',e=>{if(y0===null)return;const d=e.touches[0].clientY-y0;if(d<=0||window.scrollY>0){pull=0;set(0,false);return;}pull=Math.min(110,d*.5);set(pull,false);},{passive:true});
 addEventListener('touchend',async()=>{if(y0===null)return;y0=null;if(pull<64){set(0,true);return;}busy=true;ind.classList.add('spin');set(64,true);
  try{await Promise.all([window.voyagerReload?.(),tab==='crew'||store.get('voyager-me')?loadCrew(true):null,new Promise(r=>setTimeout(r,500))]);}catch{}
  ind.classList.remove('spin');set(0,true);busy=false;toast('Updated');},{passive:true});
})();

// ---------- feed ----------
addEventListener('voyager:feed',e=>{
 feed=e.detail;
 try{renderNow();}catch{}try{renderHome();}catch{}try{renderWatch();}catch{}try{renderRequests();}catch{}try{push.render();}catch{}try{renderDread();}catch{}try{renderProspect();}catch{}try{renderRaffle();}catch{}try{renderRanks();}catch{}try{renderMedals();}catch{}try{renderSquad();}catch{}try{renderLog();}catch{}try{renderIntel();}catch{}
 $('arena').hidden=$('versus').hidden;
 $('find').hidden=!feed.crew;
 renderTabs();
 if((tab==='crew'||store.get('voyager-me')||pendingCard)&&feed.crew)loadCrew();
 if(!onboard.done){onboard.done=true;setTimeout(()=>onboard(),400);}
});
setInterval(()=>{for(const n of document.querySelectorAll('[data-until]'))n.textContent=(n.dataset.prefix||'')+left(Number(n.dataset.until));},1000);
renderTabs();
})();
