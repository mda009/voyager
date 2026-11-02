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
let feed=null,crew=null,crewAt=0,crewLoading=null,selected=null;

// ---------- tabs ----------
const TABS=[
 ['live','Live','M5 12a7 7 0 0 1 14 0 M2 12a10 10 0 0 1 20 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 14v7'],
 ['crew','My card','M3 5h18v14H3z M7 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0 M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4 M14 9h4 M14 13h4'],
 ['medals','Medals','M12 2l8 4.5v9L12 20l-8-4.5v-9z M12 7l1.5 3 3.3.4-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.4z'],
 ['boards','Boards','M4 20V10 M10 20V4 M16 20v-7 M22 20H2'],
 ['winners','Winners','M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4 M12 14v4 M8 21h8'],
 ['guide','Guide','M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z']];
let tab=(location.hash.slice(1)||'live'),wanted=tab; // a link to #crew waits for the feed before it can open that tab
function sectionsOf(t){return [...document.querySelectorAll('section[data-tab="'+t+'"]')];}
function available(t){return sectionsOf(t).some(s=>!s.hidden);}
function renderTabs(){
 const bar=$('tabbar');bar.textContent='';bar.setAttribute('role','tablist');
 const shown=TABS.filter(([t])=>available(t));if(wanted&&shown.some(([t])=>t===wanted)){tab=wanted;if(feed)wanted=null;}if(!shown.some(([t])=>t===tab))tab=shown[0]?.[0]||'live';
 const busy=feed&&(feed.live?.onAir||['lobby','battle'].includes(feed.dreadnought?.phase));
 for(const [t,label,path] of shown){
  const b=el('button');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(t===tab));b.setAttribute('aria-controls',sectionsOf(t)[0]?.id||'');
  const icon=svg('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});icon.append(svg('path',{d:path}));
  b.append(icon,el('span','',label));if(t==='live'&&busy&&t!==tab)b.append(el('i','pip'));
  b.onclick=()=>go(t);bar.append(b);
 }
 for(const s of document.querySelectorAll('section[data-tab]'))s.classList.toggle('off',s.dataset.tab!==tab);
}
function go(t,push=true){tab=t;wanted=null;if(push)history.replaceState(null,'','#'+t);renderTabs();if(t==='crew')loadCrew();window.scrollTo({top:0,behavior:'smooth'});}
addEventListener('hashchange',()=>{const t=location.hash.slice(1);if(TABS.some(([x])=>x===t))go(t,false);});
const st=document.createElement('style');st.textContent='section.off{display:none!important}'+(EMBED?' nav.tabbar{position:static!important;padding:0!important;background:none!important;border:0!important;margin-top:10px!important}.embed .wrap{padding-bottom:24px!important}':'');document.head.append(st);

// ---------- now / on air ----------
const COMMANDS=[['!report','report for duty'],['!voyager','your card on stream'],['!medals','your medals'],['!squadron','pick a team'],['!log','log a moment'],['!join','board the Dreadnought fight'],['!fire','attack'],['!enter','join a chat giveaway']];
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
function renderDread(){
 const d=feed.dreadnought,sec=$('dread');sec.hidden=!d;if(!d)return;
 const card=$('dread-card');card.textContent='';
 const phase=d.phase,last=d.history?.[0];
 $('h-dread').textContent=d.name||'The Dreadnought';
 const top=el('div','gw-top');top.append(el('span','kind','Co-op boss fight'),el('span','badge '+(phase==='battle'?'s-drawing':phase==='lobby'?'s-open':''),phase==='battle'?'Battle on':phase==='lobby'?'Boarding':phase==='result'?'Just ended':'Standing by'));card.append(top);
 if(phase==='lobby'){
  card.append(el('div','phase lobby','It’s approaching!'),el('p','who','Board the fleet now, then fire when the battle starts. Everyone who fights earns '+fmt(d.victoryPoints)+' Voyager points if it’s destroyed.'));
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
 if(crew&&!force&&Date.now()-crewAt<5*60000)return crew;
 if(crewLoading)return crewLoading;
 $('crew-note').textContent='Loading the crew list…';
 crewLoading=(async()=>{try{const r=await fetch(crewUrl()+'?t='+Math.floor(Date.now()/300000),{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json();if(d?.schema!==1||!Array.isArray(d.members))throw new Error();
  crew=d.members.map(m=>({name:String(m[0]),platform:m[1],tier:m[2],rank:m[3]|0,place:m[4]|0,lifetime:Number(m[5])||0,medals:Array.isArray(m[6])?m[6]:[],record:Array.isArray(m[7])?m[7]:null,front:m[8]&&typeof m[8]==='object'?m[8]:null,key:String(m[0]).toLowerCase()}));crewAt=Date.now();
  $('crew-note').textContent=fmt(crew.length)+' crew members · updated '+ago(d.generatedAt)+'. Not listed? Earn some Voyager points on stream and check back.';
  search();
  try{const saved=localStorage.getItem('voyager-me');if(saved&&!selected){const me=crew.find(m=>m.key===saved);if(me)show(me,false);}}catch{}
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
function loadTemplate(){return template||(template=import('./card-template.js?v=2.20.26').catch(()=>null));}
async function drawFront(host,f){
 const T=await loadTemplate();if(!T||!f){host.append(el('p','lede small','The full card appears after the next update from the stream.'));return false;}
 const byName=new Map([...catalogue.values()].map(md=>[md.name,md]));
 const t={...T.TIERS[f.tier]||T.TIERS.blue,next:f.next,pct:f.pct,need:f.need};
 const v={front:'block',stats:'none',badges:'none',banner:'none',bannerEyebrow:'',bannerText:''};
 const c={callsign:f.callsign,badgeCount:f.badgeCount,statsEyebrow:'',badgesEyebrow:'',alsoEarned:'',promoted:''};
 const d={fields:f.fields.map((value,i)=>({label:FIELD_LABELS[i],value,icon:FIELD_ICONS[i]})),stats:f.stats.map(([label,value,sub])=>({label,value,sub})),extras:f.extras.map(([label,value])=>({label,value})),
  equipped:f.equipped.map(([name,sub])=>{const md=byName.get(name),g=GRADES.indexOf(sub),look=g>=0?CARD_LOOK[g]:null;return {icon:md?.icon||'',name,sub,op:'1',filter:'none',metal:look?.metal||'',ink:look?.ink||'',tag:look?.tag||''};}),
  badges:[],dread:[],versus:[],missions:[],community:[]};
 const k=f.rank?{show:'flex',roleShow:'none',name:f.rank.name,place:f.rank.place}:{show:'none',roleShow:'inline',name:'',place:''};
 for(const id of RANK_IDS)k['s_'+id]=f.rank&&f.rank.id===id?'inline-flex':'none';
 // The template escapes every value itself (it is what the stream overlay uses).
 const scale=el('div','cardscale'),stage=el('div','cardstage');stage.innerHTML=T.cardHTML(t,v,c,d,k);scale.append(stage);host.append(scale);
 const fit=()=>{
  if(document.fullscreenElement===host){const k=Math.min(innerWidth/1200,innerHeight/720);scale.style.transform='translate('+((innerWidth-1200*k)/2)+'px,'+((innerHeight-720*k)/2)+'px) scale('+k+')';return;}
  const w=host.clientWidth||600;scale.style.transform='scale('+(w/1200)+')';host.style.height=(720*w/1200)+'px';};
 fit();new ResizeObserver(fit).observe(host);addEventListener('resize',fit);document.addEventListener('fullscreenchange',()=>{fit();if(!document.fullscreenElement)try{screen.orientation?.unlock?.();}catch{}});
 // Small screens: show the card full screen (sideways on phones) so every detail is readable.
 if(host.requestFullscreen){const b=el('button','fs-btn','⤢ Full screen');b.type='button';b.onclick=async e=>{e.stopPropagation();try{await host.requestFullscreen();await screen.orientation?.lock?.('landscape');}catch{}};host.append(b);}
 return true;
}
function show(m,remember=true,side='front'){
 selected=m;$('crew-results').textContent='';$('crew-search').value='';
 if(remember)try{localStorage.setItem('voyager-me',m.key);}catch{}
 const [title,c1,c2]=TIER[m.tier]||TIER.blue,box=$('member');box.hidden=false;box.textContent='';box.className='member-wrap';
 box.style.setProperty('--t',c1);box.style.setProperty('--t2',c2);
 const total=catalogue.size||0,r=m.record||[];
 const rec=m.record?{honour:r[0],fights:r[1],victories:r[2],mvp:r[3],damage:r[4],wins:r[5],losses:r[6],missions:r[7],giveaways:r[8],podiums:r[9],seasonPlace:r[10],seasonPoints:r[11],since:r[12],
  activity:r.length>=25?{hours:r[13],months:r[14],subBest:r[15],gifts:r[16],streams:r[17],streak:r[18],bestStreak:r[19],messages:r[20],followDays:r[21],versusBest:r[22],points:r[23],private:r[24]===1}:null}:null;
 const ctl=el('div','sides');ctl.setAttribute('role','tablist');ctl.setAttribute('aria-label','Card side');
 const fb=el('button','','Front'),bb=el('button','','Back');for(const b of [fb,bb]){b.type='button';b.setAttribute('role','tab');ctl.append(b);}
 const flipper=el('div','card3d'),front=el('div','face front cardface'),back=el('div','member face back');
 let current=side,busy=false;
 const paint=s=>{front.hidden=s!=='front';back.hidden=s!=='back';fb.setAttribute('aria-selected',String(s==='front'));bb.setAttribute('aria-selected',String(s==='back'));};
 const setSide=async s=>{if(s===current||busy)return;busy=true;flipper.classList.add('turn');await new Promise(r=>setTimeout(r,230));current=s;paint(s);flipper.classList.remove('turn');flipper.classList.add('turned');requestAnimationFrame(()=>requestAnimationFrame(()=>flipper.classList.remove('turned')));setTimeout(()=>busy=false,260);};
 fb.onclick=()=>setSide('front');bb.onclick=()=>setSide('back');
 flipper.onclick=e=>{if(e.target.closest('button,summary,details'))return;setSide(current==='front'?'back':'front');};
 flipper.tabIndex=0;flipper.setAttribute('aria-label','Membership card. Press Enter to flip.');flipper.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flipper.click();}};
 // FRONT: the stream card.
 drawFront(front,m.front);
 // BACK: everything the front doesn't show.
 back.append(el('div','tiername',title+' · service record'),el('div','who small-who',m.name));
 if(rec){
  const battles=rec.wins+rec.losses,a=rec.activity,g=el('div','rgrid');
  g.append(tile('Dreadnought',plural(rec.victories,'victory','victories'),plural(rec.fights,'fight','fights')+' · MVP ×'+fmt(rec.mvp)+' · '+fmt(rec.damage)+' damage'),
   tile('Voyager Versus',plural(battles,'battle','battles'),battles?fmt(rec.wins)+' won · '+Math.round(rec.wins/battles*100)+'%'+(a?' · best streak '+fmt(a.versusBest):''):'Type !versus to battle'),
   tile('Missions',fmt(rec.missions),'weekly missions completed'),
   tile('Season',fmt(rec.seasonPoints)+' pts',rec.podiums?plural(rec.podiums,'podium finish','podium finishes'):'season score'),
   tile('Giveaways won',fmt(rec.giveaways),'confirmed wins'));
  if(a){g.append(tile('Streams attended',fmt(a.streams),'best watch streak '+plural(a.bestStreak,'stream','streams')),
   tile('Chat messages',fmt(a.messages),'counted since November 2026'),
   tile('Gifted subs',fmt(a.gifts),'gifted to the crew'),
   tile('Sub streak',a.private?'Private':plural(a.subBest,'month','months'),a.private?'Hidden by !voyager private':'best run in a row'),
   tile('With the crew',plural(a.followDays,'day','days'),rec.since?(()=>{const [y,mo]=rec.since.split('-').map(Number);return 'since '+new Date(y,mo-1,1).toLocaleDateString(undefined,{month:'long',year:'numeric'});})():'since first seen'));}
  back.append(g);
 }else back.append(el('p','lede small','The full service record appears after the next update from the stream.'));
 back.append(el('h4','','Medal wall · '+m.medals.length+' of '+(total||'–')+' unlocked'));
 const wall=el('div','medal-grid');m.medals.forEach(([id,g],i)=>wall.append(medalTile(catalogue.get(id),g,i)));
 const earned=new Set(m.medals.map(x=>x[0])),locked=[...catalogue.values()].filter(md=>!earned.has(md.id)&&md.kind!=='secret');
 if(!m.medals.length)wall.append(el('p','lede small','No medals yet.'));
 back.append(wall);
 if(locked.length){const det=el('details','locked-list');det.append(el('summary','','Still to earn · '+locked.length));const lg=el('div','medal-grid');for(const md of locked)lg.append(medalTile(md,0,0,true));det.append(lg);back.append(det);}
 back.append(el('p','hint','Tap the card to see the front ↻'));
 flipper.append(front,back);paint(current);
 const again=el('button','chip','Not you? Search again');again.type='button';again.onclick=()=>{try{localStorage.removeItem('voyager-me');}catch{}selected=null;box.hidden=true;$('crew-search').focus();};
 const foot=el('div','card-foot');foot.append(again,el('span','lede small','Tap the card to flip it · type !voyager in chat to show it on stream.'));
 box.append(ctl,flipper,foot);
}
$('crew-search').addEventListener('input',()=>{if(!crew)loadCrew();search();});
$('crew-search').addEventListener('focus',()=>loadCrew());

// ---------- install (PWA) ----------
let installEvent=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(!EMBED)$('install').hidden=false;});
$('install-btn').onclick=async()=>{if(!installEvent)return;installEvent.prompt();try{await installEvent.userChoice;}catch{}installEvent=null;$('install').hidden=true;};
if(!EMBED&&'serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

// ---------- feed ----------
addEventListener('voyager:feed',e=>{
 feed=e.detail;
 try{renderNow();}catch{}try{renderDread();}catch{}try{renderRanks();}catch{}try{renderMedals();}catch{}try{renderSquad();}catch{}try{renderLog();}catch{}
 $('arena').hidden=$('versus').hidden;
 $('find').hidden=!feed.crew;
 renderTabs();
 if(tab==='crew'&&feed.crew)loadCrew();
});
setInterval(()=>{for(const n of document.querySelectorAll('[data-until]'))n.textContent=(n.dataset.prefix||'')+left(Number(n.dataset.until));},1000);
renderTabs();
})();
