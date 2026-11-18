// Builds the Voyager Member Manual (November 2026 edition) as HTML, then PDF with Chromium.
// Voyager member manual: builds manual.html and the PDF with Playwright's Chromium. Run from anywhere: node tools/manual/build.mjs
// Output: tools/manual/out/manual.pdf — copy it to site/manual/manual.pdf (and page 1, 360 × 466, to site/manual/cover.jpg).
import {fileURLToPath as __f} from 'node:url';import {dirname as __d,resolve as __r} from 'node:path';import {mkdirSync as __mk} from 'node:fs';
const HERE=__d(__f(import.meta.url))+'/',REPO=__r(HERE,'..','..')+'/';__mk(HERE+'out',{recursive:true});
import {writeFileSync,readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {MEDALS,MEDAL_ICONS} from '../../Voyager_Versus/local/medals.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const A='file://'+HERE+'assets/';
const FONT='file://'+REPO+'brand-assets/';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fmt=n=>Number(n).toLocaleString('en-AU');

// ---------- the user's current Voyager settings (read from their Voyager data, 1 Nov 2026) ----------
const RANK_POINTS=[0,500,1000,2500,5000,10000,25000,50000,100000,175000,250000,500000];
const RANKS=[['Midshipman','MIDN',0],['Acting Sub-Lieutenant','ASLT',0],['Sub-Lieutenant','SBLT',0],['Lieutenant','LEUT',0],['Lieutenant Commander','LCDR',0],['Commander','CMDR',0],['Captain','CAPT',0],['Commodore','CDRE',0],['Rear Admiral','RADM',0],['Vice Admiral','VADM',10],['Admiral','ADML',3],['Admiral of the Fleet','AF',1]];
const RANK_IDS=['mid','aslt','slt','lt','lcdr','cdr','capt','cdre','radm','vadm','adml','af'];
// Insignia (sleeve lace) straight from the membership card template.
const tpl=readFileSync(REPO+'Voyager_Versus/dist/card-template.mjs','utf8');
const INSIGNIA={};for(const m of tpl.matchAll(/<span style="display: \$\{e\(k\.s_(\w+)\)\}">(<svg[\s\S]*?<\/svg>)<\/span>/g))INSIGNIA[m[1]]=m[2];
const lace=(i,w=74)=>INSIGNIA[RANK_IDS[i]].replace(/width="68" height="38"/,`width="${w}" height="${Math.round(w*38/68)}"`).replace(/id="lace(\w+)"/g,(a,b)=>`id="lace${b}_${i}_${w}"`).replace(/url\(#lace(\w+)\)/g,(a,b)=>`url(#lace${b}_${i}_${w})`);

const GRADE=[['Bronze','linear-gradient(180deg,#ffe6cc 0%,#f0a868 30%,#a5582a 52%,#6e3510 60%,#d68a4c 84%,#ffd9b0 100%)','#fff3e6'],
 ['Silver','linear-gradient(180deg,#ffffff 0%,#eef2f6 26%,#9aa6b4 50%,#55606d 58%,#cfd8e2 84%,#ffffff 100%)','#ffffff'],
 ['Gold','linear-gradient(180deg,#fffbe0 0%,#ffe07a 26%,#e0a420 48%,#7a4d00 56%,#ffcf4a 82%,#fff3b8 100%)','#fff8dc'],
 ['Legend','linear-gradient(135deg,#8ff6ff 0%,#9fb4ff 30%,#c58bff 52%,#ff8fe0 74%,#ffe28a 100%)','#ffffff']];
const SPECIAL=['linear-gradient(180deg,#e6f5ff,#5fb8ff 40%,#0b4fd0 52%,#8fd2ff 82%,#e6f5ff)','#e6f5ff'];
const STAR='M12 1.5l1.6 6.9L20.5 10l-6.9 1.6L12 18.5l-1.6-6.9L3.5 10l6.9-1.6z';
const hex=(id,g=2,size=40,special=false)=>{const [bg,ink]=special?SPECIAL:[GRADE[g][1],GRADE[g][2]];const inner=Math.round(size*.8),ico=Math.round(size*.44),st=Math.round(size*.2);
  return `<span class="hex" style="width:${size}px;height:${size}px;background:repeating-conic-gradient(from 7.5deg,rgba(0,0,0,.28) 0 2.4deg,rgba(0,0,0,0) 2.4deg 15deg),${bg};box-shadow:inset 0 0 0 1px rgba(255,255,255,.35),inset 0 0 0 ${Math.max(2,Math.round(size*.055))}px rgba(0,0,0,.35)"><span style="width:${inner}px;height:${inner}px"><svg viewBox="0 0 24 24" width="${st}" height="${st}" style="position:absolute;left:50%;top:9%;transform:translateX(-50%)" fill="${ink}" opacity=".9"><path d="${STAR}"/></svg><svg viewBox="0 0 24 24" width="${ico}" height="${ico}" style="margin-top:${Math.round(size*.08)}px" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="${MEDAL_ICONS[id]||MEDAL_ICONS.secret}"/></svg></span></span>`;};
const ICON={chat:'M4 5h16v11H9l-5 4z M8 9h8 M8 12h5',star:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',card:'M3 5h18v14H3z M7 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0 M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4 M14 9h4 M14 13h4',
 up:'M12 19V5 M5 12l7-7 7 7',gift:'M4 10h16v11H4z M3 7h18v3H3z M12 7v14 M12 7c-2-4-6-3-5 0 M12 7c2-4 6-3 5 0',target:'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M12 2v4 M12 18v4 M2 12h4 M18 12h4',
 globe:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18',medal:'M12 2l8 4.5v9L12 20l-8-4.5v-9z',anchor:'M12 8a2 2 0 1 0 0-4a2 2 0 0 0 0 4 M12 8v13 M5 13a7 7 0 0 0 14 0 M8 11h8',
 eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',users:'M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8 M2 21c0-4 3-6 7-6s7 2 7 6 M17 11a3 3 0 1 0 0-6 M18 15c2.5.5 4 2.5 4 6',
 wheel:'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 3v18 M3 12h18 M5.6 5.6l12.8 12.8 M18.4 5.6L5.6 18.4',shield:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
 phone:'M7 2h10v20H7z M11 18h2',check:'M5 12l4 4L19 6',book:'M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z',quiz:'M9 9a3 3 0 1 1 4 2.8c-.8.4-1 1-1 2v.7 M12 18v.01',crown:'M3 8l4 4 5-7 5 7 4-4-2 11H5z'};
const ic=(name,size=22,color='currentColor')=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;

// ---------- page frame ----------
let pageNo=0;const toc=[];
function page(body,{title,sub,num,color,cls='',bare=false}={}){
  pageNo++;if(title&&num)toc.push([num,title,pageNo]);
  const banner=title?`<div class="banner" style="${color?`border-color:${color}`:''}"><h1>${num?num+'&nbsp;&nbsp;|&nbsp;&nbsp;':''}${esc(title)}</h1>${sub?`<p style="${color?`color:${color}`:''}">${esc(sub)}</p>`:''}</div>`:'';
  return `<section class="page ${cls}">${bare?'':`<div class="runhead">VOYAGER&nbsp;&nbsp;|&nbsp;&nbsp;MEMBER MANUAL</div>`}<div class="content">${banner}${body}</div>${bare?'':footer()}</section>`;
}
const footer=()=>`<footer><img src="${A}mda-c.png" class="fl" alt="MDA009"><div><b>VOYAGER MEMBERSHIP PROGRAM™</b><br><strong>© 2026 The Unprofessionals | ABN 19 390 951 076 | All rights reserved.</strong><br><span>Voyager Program content, branding and associated original materials are proprietary to The Unprofessionals.</span></div><img src="${A}unpro-c.png" class="fr" alt="The Unprofessionals"><span class="pn">${pageNo}</span></footer>`;
const cmd=c=>`<code>${esc(c)}</code>`;
const flow=(items)=>`<div class="flow">${items.map(([i,t,d])=>`<div><span class="fi">${ic(i,19)}</span><b>${t}</b><small>${d}</small></div>`).join('<i>›</i>')}</div>`;


const pages=[];
// ================= COVER =================
pages.push(page(`
<div class="cover">
  <div class="stars"></div>
  <img src="${A}roundel-c.png" class="roundel" alt="Voyager Membership Program emblem">
  <div class="ctitle">MEMBERSHIP PROGRAM</div>
  <div class="csub">OFFICIAL MEMBER MANUAL &amp; FAQ</div>
  <div class="ced">NOVEMBER 2026 EDITION · REVISED 18 NOV</div>
  <div class="ctag">EXPLORE. EARN. EXCEL.</div>
  <p class="cintro">A 100% free community program that recognises the people who watch, chat, play, support and help build MDA009's stream and community, on Twitch, YouTube and Kick.</p>
  <div class="cemb">${['blue','silver','gold','platinum'].map(t=>`<div><img src="${A}emb-${t}.png" alt=""><span>${{blue:'Blue Explorer',silver:'Silver Sentinel',gold:'Gold Commander',platinum:'Platinum Vanguard'}[t]}</span></div>`).join('')}</div>
  <div class="cfoot"><img src="${A}mda-c.png" alt="MDA009"><div>VOYAGER MEMBERSHIP PROGRAM™<br>© 2026 The Unprofessionals | ABN 19 390 951 076 | All rights reserved.</div><img src="${A}unpro-c.png" alt="The Unprofessionals"></div>
</div>`,{bare:true,cls:'dark'}));

// ================= CONTENTS (filled after) =================
pages.push('__TOC__');pageNo++;

// ================= 1 WELCOME =================
pages.push(page(`
<p class="lead">Voyager is MDA009's membership program, and the set of tools that runs it live on stream. Everyone starts as a <b>Blue Explorer</b> the first time they chat. From there, everything you do on stream counts: watching, chatting, playing the games, finishing missions and supporting the channel.</p>
<div class="two">
 <div><h3>What Voyager gives you</h3><ul>
  <li><b>Voyager points</b> you earn on stream and spend on membership upgrades with ${cmd('!upgrade')}.</li>
  <li><b>Four membership tiers</b> (Blue, Silver, Gold, Platinum), each with its own giveaways.</li>
  <li><b>A membership card</b> you can show on stream any time with ${cmd('!voyager')}.</li>
  <li><b>Naval ranks</b> from Midshipman to Admiral of the Fleet, based on every point you have ever earned.</li>
  <li><b>${MEDALS.length} medals</b> for loyalty, support, games and community, shown on your card.</li>
  <li><b>Live games</b>: the Dreadnought boss fight and Voyager Versus dogfights.</li>
  <li><b>Weekly missions, community goals and squadrons</b> to work towards with the community.</li>
  <li><b>Giveaways</b> with an on-stream countdown and wheel, and a fair-draw check anyone can run.</li>
 </ul></div>
 <div><h3>Where it works</h3><ul>
  <li><b>Twitch, YouTube and Kick.</b> Chat commands work on all three (Voyager Versus is Twitch only).</li>
  <li><b>On stream.</b> Cards, promotions, medals, quizzes and giveaways appear in the broadcast.</li>
  <li><b>voyagercommand.com</b>, the stream companion: live status, your card, ranks, medals, leaderboards and winners on your phone.</li>
 </ul>
 <div class="callout"><b>100% free.</b> You never need to spend money to take part. Subscriptions, gifts and Bits are always optional, and paid support never buys giveaway entries or tickets.</div></div>
</div>
<h3 class="mt">How it all fits together</h3>
<div class="map">
 <div class="mcol"><div class="mh">YOU DO</div>
  <div class="mi">${ic('eye')}<span>Watch live</span></div><div class="mi">${ic('chat')}<span>Chat &amp; ${cmd('!report')}</span></div><div class="mi">${ic('target')}<span>Play the games</span></div><div class="mi">${ic('check')}<span>Finish missions</span></div><div class="mi">${ic('gift')}<span>Support (optional)</span></div></div>
 <div class="arrow">→</div>
 <div class="mcol"><div class="mh">YOU EARN</div>
  <div class="mi big">${ic('star')}<span><b>Voyager points</b><small>your balance · ${cmd('!points')}</small></span></div>
  <div class="mi big">${ic('anchor')}<span><b>Lifetime points</b><small>never go down · set your rank</small></span></div>
  <div class="mi big">${ic('medal')}<span><b>Medals &amp; Honour</b><small>prestige only · ${cmd('!medals')}</small></span></div></div>
 <div class="arrow">→</div>
 <div class="mcol"><div class="mh">YOU UNLOCK</div>
  <div class="mi">${ic('up')}<span>Tiers with ${cmd('!upgrade')}</span></div><div class="mi">${ic('gift')}<span>Tier giveaways</span></div><div class="mi">${ic('anchor')}<span>Naval rank &amp; promotions</span></div><div class="mi">${ic('card')}<span>Your card: ${cmd('!voyager')}</span></div><div class="mi">${ic('crown')}<span>Hall of Fame &amp; Honour</span></div></div>
</div>
<div class="new"><h3>New in this edition</h3><div class="newgrid">
 <span>Glass membership cards with stats &amp; medal sides</span><span>Naval ranks &amp; on-stream promotions</span><span>${MEDALS.length} medals &amp; the Hall of Honour</span><span>Weekly missions linked to medals (max 50 points)</span>
 <span>Community goals (from Christmas 2026) &amp; the Hall of Fame</span><span>The Dreadnought: Legendary &amp; Hero kills</span><span>!report, Bridge Quiz, Squadrons &amp; Captain's Log</span><span>Ticketed giveaways &amp; the winner wheel</span>
 <span>Fair-draw check for every chat giveaway</span><span>voyagercommand.com: your card, front, back &amp; medals</span><span>Stream streaks are your Twitch watch streak</span><span>Dreadnought &amp; Versus take over the screen; MVP bonus</span></div></div>
`,{num:1,title:'WELCOME ABOARD',sub:'WHAT VOYAGER IS AND HOW IT WORKS'}));

// ================= 2 GETTING STARTED =================
const steps=[['Say hello in chat','Your first message on Twitch, YouTube or Kick makes you a Blue Explorer. Type '+cmd('!report')+' once each stream to report for duty.'],
 ['Earn Voyager points','Watch, chat, follow, raid, play and finish weekly missions. Check your balance with '+cmd('!points')+'.'],
 ['Show your card','Type '+cmd('!voyager')+' and your membership card appears on stream with your tier, rank, stats and medals.'],
 ['Upgrade when you are ready','Type '+cmd('!upgrade')+' to spend points on Silver, Gold or Platinum. Nothing upgrades automatically.'],
 ['Join in','Enter giveaways, board the Dreadnought, answer the Bridge Quiz, pick a squadron and follow it all on voyagercommand.com.']];
const groups=[['Your membership',[['!points','Your Voyager points balance'],['!voyager','Your membership card on stream'],['!voyager stats','The back of your card: your service record'],['!voyager badges','Your medal wall'],['!voyager title <medal>','Show an earned medal as your callsign'],[['!voyager private','!voyager public'],'Hide or show hours watched and months subscribed'],['!upgrade','Buy the next membership tier'],['!medals','Your medal count, latest medal and next goal']]],
 ['Every stream',[['!report','Report for duty once a stream (points; counts a stream attended)'],['!squadron red | gold | blue','Join a squadron for the weekly war'],['!log <moment>','Log a stream moment for the Captain\'s Log'],['!quiz','Repeat the current Bridge Quiz question'],['!news | !patch | !sales | !deals | !events','Star Citizen news, patch notes, ships on sale, deals and events']]],
 ['Giveaways',[[['!enter','!ticket'],'Join an open chat giveaway'],[['!entergiveaway','!entry'],'Join a ticketed giveaway'],['!tickets','Check your tickets in a ticketed giveaway']]],
 ['Games',[['!join','Board the fleet when the Dreadnought appears'],['!fire','Attack the Dreadnought'],['!shoot','Second free attack, half damage, its own cooldown'],['!versus','Call or answer a Voyager Versus battle (Twitch)'],['!ship interceptor | sentinel | phantom','Pick your Versus fighter'],[['!fire','!missile','!shield','!dodge'],'Fly your fighter in a Versus battle'],[['!mine','!fire','!sell'],'Prospect Run: work the laser, shoot the pirate, sell the cargo']]]];
pages.push(page(`
<div class="steps">${steps.map(([t,d],i)=>`<div class="step"><div class="sn">${i+1}</div><b>${t}</b><p>${d}</p></div>`).join('')}</div>
<h3 class="mt">Command cheat sheet</h3>
<div class="cmds">${groups.map(([g,list])=>`<div class="cg"><div class="cgh">${g}</div><table>${list.map(([c,d])=>`<tr><td>${Array.isArray(c)?c.map(cmd).join(c.length===2?' or ':' '):cmd(c)}</td><td>${d}</td></tr>`).join('')}</table></div>`).join('')}</div>
<p class="note">Commands work in Twitch, YouTube and Kick chat unless marked. Your card has a one-minute cooldown per viewer. Type commands on their own, at the start of a message.</p>
`,{num:2,title:'GETTING STARTED',sub:'FIVE STEPS • EVERY COMMAND IN ONE PLACE'}));

// ================= 3 AT A GLANCE =================
pages.push(page(`
<p>Everyone starts as a Blue Explorer. Earn Voyager points through participation and support, then choose when to spend those points to unlock higher membership tiers and their giveaways.</p>
<ul>
 <li>Core progression: <b>Blue Explorer → Silver Sentinel → Gold Commander → Platinum Vanguard.</b></li>
 <li><b>Ruby VIP</b> and <b>Emerald Elite</b> are adjacent recognitions added to your existing core membership.</li>
 <li>Your <b>naval rank</b> sits alongside your tier. Tiers are what you choose to buy; ranks are what you have earned over time.</li>
 <li>Tier giveaways are community-triggered by point thresholds. Once a threshold is reached, the giveaway is scheduled for the following Stellar Sunday.</li>
 <li>Upgrades remain open until that tier's giveaway begins.</li>
</ul>
<figure><img src="${A}tier-structure.jpg" class="full" alt="Voyager tier structure infographic"><figcaption>Voyager tier structure: four core tiers with adjacent Ruby VIP and Emerald Elite recognition.</figcaption></figure>
<div class="trio">
 <div><b>TIER</b><span>Blue → Platinum</span><p>Bought with ${cmd('!upgrade')}. Decides which giveaways you are in.</p></div>
 <div><b>RANK</b><span>Midshipman → Admiral of the Fleet</span><p>Earned from lifetime points. Shown on your card; never lost.</p></div>
 <div><b>MEDALS</b><span>${MEDALS.length} to collect</span><p>Earned for what you do. Prestige only: no points, tickets or odds.</p></div>
</div>
`,{num:3,title:'VOYAGER AT A GLANCE',sub:'WATCH • ENGAGE • EARN • UPGRADE • UNLOCK REWARDS'}));

// ================= 4 CORE TIERS =================
const tiers=[['blue','BLUE EXPLORER','#1aa3ee','STARTING TIER  |  FREE','Every member begins here: access to Voyager, community rewards and Blue-tier opportunities, including Super Saturday Game Package giveaways and the Grand Monthly Ship giveaway.','Requirements: be following on Twitch and present at the time of the draw (*exception: the Monthly Grand Prize).'],
 ['silver','SILVER SENTINEL','#8b97a6','CORE MEMBERSHIP  |  1,200 POINTS','Included in Silver and Blue tier giveaways. Silver giveaways are valued between US$100 and US$200.','You remain Silver until a Silver giveaway is drawn. Silver giveaway trigger: 72,000 community points.'],
 ['gold','GOLD COMMANDER','#d6a12b','ADVANCED MEMBERSHIP  |  3,000 POINTS (1,800 FROM SILVER)','Included in Gold, Silver and Blue tier giveaways. Gold giveaways are valued between US$200 and US$500.','You remain Gold until a Gold giveaway is drawn. Gold giveaway trigger: 120,000 community points.'],
 ['platinum','PLATINUM VANGUARD','#8f6bd8','HIGHEST CORE MEMBERSHIP  |  20,000 POINTS (17,000 FROM GOLD)','Included in Platinum, Gold, Silver and Blue tier giveaways. Platinum giveaways are valued between US$500 and US$1,000.','Remain in the tier until a Platinum giveaway is drawn. Platinum giveaway trigger: 200,000 community points.']];
pages.push(page(`
<p class="center muted">Each core tier is shown with its new Voyager glass membership card (sample members).</p>
${tiers.map(([k,n,c,h,a,b])=>`<div class="tier" style="--c:${c}"><div class="timg"><img src="${A}card-${k}-front.jpg" alt="${n} membership card"></div><div class="ttxt"><h2 style="color:${c}">${n}</h2><h4>${h}</h4><p>${a}</p><p>${b}</p></div></div>`).join('')}
<p class="note">Upgrade prices step up one tier at a time: Silver 1,200 points; Silver → Gold 1,800 more (3,000 in total); Gold → Platinum 17,000 more (20,000 in total). Type ${cmd('!upgrade')} when your balance is ready; your card shows how far you have to go.</p>
`,{num:4,title:'CORE MEMBERSHIP TIERS',sub:'THE VOYAGER PROGRESSION PATH'}));

// ================= 5 YOUR CARD (front) =================
pages.push(page(`
<p>Type ${cmd('!voyager')} in chat and your membership card plays on stream for about 12 seconds: it warps in, opens like a hologram, counts up your stats, pops in your medals and stamps on your naval rank. Your card is coloured by your tier.</p>
<div class="anno"><img src="${A}card-gold-front.jpg" alt="Gold Commander membership card, front">
 ${[[-3.2,46,'1'],[35,11.5,'2'],[62.5,21.3,'3'],[35.6,30,'4'],[78.5,31,'5'],[-3.2,79.5,'6'],[35.6,67.5,'7'],[35.3,82.5,'8']].map(([x,y,n])=>`<span class="pin" style="left:${x}%;top:${y}%">${n}</span>`).join('')}</div>
<div class="legend">
 <div><b>1</b> Your member details: name, member ID and the date you joined.</div>
 <div><b>2</b> Your tier title, in your tier's colours.</div>
 <div><b>3</b> Your callsign: an earned medal you choose with ${cmd('!voyager title <medal>')}.</div>
 <div><b>4</b> Voyager points (your balance), lifetime points with the points to your next rank, hours watched with your stream streak (this is your Twitch watch streak and nothing else: share it in chat when Twitch offers and the card shows that number), and your Voyager Versus record.</div>
 <div><b>5</b> Your naval rank with its sleeve insignia, your all-time place and lifetime points.</div>
 <div><b>6</b> Six of your best medals in their grade metals (Bronze, Silver, Gold or Legend).</div>
 <div><b>7</b> Community goal place and score, Dreadnought record, months subscribed and Honour.</div>
 <div><b>8</b> Next tier: how many points until you can ${cmd('!upgrade')}.</div>
</div>
<div class="callout"><b>Privacy:</b> type ${cmd('!voyager private')} to hide your hours watched and months subscribed on your card and on voyagercommand.com (${cmd('!voyager public')} shows them again). Giveaway ticket balances are never shown anywhere.</div>
`,{num:5,title:'YOUR MEMBERSHIP CARD',sub:'!VOYAGER • YOUR TIER, RANK, STATS AND MEDALS ON STREAM'}));

// ================= 5 YOUR CARD (back) =================
pages.push(page(`
<div class="two tight">
 <figure><img src="${A}card-gold-stats.jpg" class="r" alt="Card back: fleet record"><figcaption>${cmd('!voyager stats')}: your fleet record (Dreadnought, Versus, missions and community goals, crew and community).</figcaption></figure>
 <figure><img src="${A}card-platinum-badges.jpg" class="r" alt="Card back: medal wall"><figcaption>${cmd('!voyager badges')}: your medal wall, earned medals in their grade and locked ones with progress.</figcaption></figure>
</div>
<h3>Ceremonies</h3>
<div class="two tight">
 <figure><img src="${A}card-gold-tierup.jpg" class="r" alt="Tier-up ceremony"><figcaption><b>Tier-up.</b> When you upgrade, your old card charges up and explodes into your new tier's card, with confetti.</figcaption></figure>
 <figure><img src="${A}card-gold-promo.jpg" class="r" alt="Promotion ceremony"><figcaption><b>Promotion.</b> A gold PROMOTED title card, then your old insignia flips to your new rank with a shockwave.</figcaption></figure>
</div>
<h3 class="mt">How your card plays on stream</h3>
<div class="flow">${[['bolt','Warp in','Light streaks in your tier colour'],['eye','Hologram opens','The card unfolds from a beam of light'],['star','Stats count up','Points, hours and records roll up'],['medal','Medals pop in','One by one, in their grade metals'],['anchor','Rank stamps on','Your insignia lands with sparks'],['check','Signs off','About 12 seconds, then it folds away']].map(([i,t,d],n)=>`<div><span class="fi">${ic(i,20)}</span><b>${t}</b><small>${d}</small></div>`).join('<i>›</i>')}</div>
<ul class="compact">
 <li>One card at a time plays on stream, in the order called; each viewer can call their card once a minute.</li>
 <li>Type ${cmd('!voyager title')} on its own to list the callsigns you have unlocked.</li>
 <li>Promotions are announced in chat (grouped) and on stream as they happen.</li>
 <li>Your card is also on voyagercommand.com › My card, front and back, with a full-screen view on phones.</li>
</ul>
`,{num:5,title:'YOUR CARD: THE BACK & CEREMONIES',sub:'!VOYAGER STATS • !VOYAGER BADGES • TIER-UPS • PROMOTIONS'}));

// ================= 6 RANKS =================
pages.push(page(`
<p>Your rank shows how much you have contributed over time. It comes from your <b>lifetime Voyager points</b>: every point you have earned, which never goes down when you spend points on ${cmd('!upgrade')}. The top three ranks also need an all-time leaderboard place, so only the most dedicated crew can reach them.</p>
<div class="ladder">${RANKS.map((r,i)=>i).reverse().map(i=>`<div class="lr${i>=7?' flag':''}">${lace(i,72)}<div class="ln"><b>${RANKS[i][0]}</b><span>${RANKS[i][1]}</span></div><div class="lp">${i?fmt(RANK_POINTS[i]):'Start'}<small>${i?'lifetime points':'everyone'}</small></div><div class="lt">${RANKS[i][2]?(RANKS[i][2]===1?'#1 all-time only':'and top '+RANKS[i][2]+' all-time'):''}</div></div>`).join('')}</div>
<ul class="compact">
 <li>Lifetime points are the points Voyager has seen you earn, and never less than the points you hold right now.</li>
 <li>Promotions are checked about once a minute while Voyager is running, announced in chat and played on stream.</li>
 <li>See every rank holder, the senior officers and recent promotions on voyagercommand.com.</li>
</ul>
`,{num:6,title:'NAVAL RANKS',sub:'ROYAL AUSTRALIAN NAVY OFFICER RANKS • LIFETIME POINTS • LEADERBOARD'}));

// ================= 7 MEDALS =================
const FRIENDLY={watch:'Hours watched live',follow:'Days since you followed (or first seen)',streak:'Your best Twitch watch streak (share it in chat when Twitch offers; Twitch is the only source)',regular:'Stream days you earned Voyager points',subs:'Months subscribed, all time, any platform',substreak:'Months renewed without a gap',gifter:'Subs or memberships gifted, all time',giftbomb:'Most subs gifted in one drop',power:'Bits cheered, with Kicks and Super Chats counted as Bits (US$1 = 100)',goals:'Season sub goals you helped unlock',
 patron:'All-time top supporters (months + gifts + Bits)',elder:'Longest-serving crew (hours watched + weeks with us)',seasonpatron:'Top supporter of a community goal',versus:'Voyager Versus battles won',hotstreak:'Versus wins in a row',slayer:'Dreadnought victories you fought in',torpedo:'Gifted subs fired as torpedoes in a fight',topgun:'Fights finished as top damage (MVP)',
 points:'Voyager points earned, all time',missions:'Weekly missions completed',spectrum:'Different mission types completed',podium:'Community goals finished in the top 3',champion:'Community goals finished at #1',legendary:'Dreadnought destroyed within 1 minute while you fought',hero:'Dreadnought destroyed within 2 minutes while you fought',comms:'Chat messages sent on stream',lucky:'Giveaways won and confirmed',
 founding:'With the crew before Season 2 ends. Can never be earned later.',firstcontact:'Typed !medals for the first time',laststand:'Secret: how to earn it is for you to discover',nightwatch:'Secret: how to earn it is for you to discover',
 rockbreaker:'Prospect Runs where you helped crack the rock',gunrunner:'Pirates you helped drive off on a Prospect Run',hauler:'Prospect Runs finished as a Gold haul',scratch:'Secret: how to earn it is for you to discover'};
const CATS=[['loyalty','TIME & LOYALTY · COUNTS DOUBLE'],['support','SUBS & SUPPORT · COUNTS DOUBLE'],['honour','HALL OF HONOUR · COUNTS DOUBLE'],['games','VERSUS, DREADNOUGHT & PROSPECT RUN'],['community','COMMUNITY'],['special','SPECIAL & SECRET']];
const tgt=(m,v)=>m.kind==='rank'?(v===1?'#1':'Top '+v):fmt(v);
const medalRow=m=>`<div class="md">${hex(m.id,m.kind==='rank'?3:2,34,!m.grades)}<div class="mdt"><b>${m.name}</b><span>${FRIENDLY[m.id]}</span></div>${m.grades?`<div class="gr">${m.grades.map((v,i)=>`<span><i style="background:${GRADE[i][1]}"></i>${tgt(m,v)}</span>`).join('')}</div>`:'<div class="gr sp">'+(m.kind==='secret'?'Secret':'Special')+'</div>'}</div>`;
const catBlock=([k,l])=>`<div class="mcat"><h4>${l}</h4>${MEDALS.filter(m=>m.cat===k).map(medalRow).join('')}</div>`;
pages.push(page(`
<p>Medals celebrate what you do for the community. Most have four grades, and a medal upgrades in place when you reach the next grade; you never lose one. Medals are <b>prestige only</b>: they never give points, tickets or better odds. ${cmd('!medals')} shows your count and next grade; ${cmd('!voyager title <medal>')} wears one as your callsign.</p>
<div class="grades">${GRADE.map(([n],i)=>`<div>${hex('patron',i,44)}<b>${n}</b><span>${[1,2,4,8][i]} Honour ★</span></div>`).join('')}<div>${hex('founding',0,44,true)}<b>Special</b><span>4 Honour ★</span></div></div>
<p class="note"><b>Honour</b> is your medal score. Time &amp; loyalty, Subs &amp; support and Hall of Honour medals count double, to reward the crew who have been here the longest and contributed the most. The Hall of Honour on voyagercommand.com ranks everyone by Honour. Medal grade targets are listed Bronze · Silver · Gold · Legend.</p>
${CATS.slice(0,3).map(catBlock).join('')}
`,{num:7,title:'MEDALS & HONOUR',sub:MEDALS.length+' MEDALS • FOUR GRADES • !MEDALS • !VOYAGER BADGES'}));
pages.push(page(`
<div class="tightm">${CATS.slice(3).filter(c=>c[0]!=='special').map(catBlock).join('')}
${CATS.filter(c=>c[0]==='special').map(([k,l])=>`<div class="mcat"><h4>${l}</h4><style>.sp2 .md{grid-template-columns:36px 1fr 54px}.tightm .md{padding:1px 0}.tightm .mcat{margin-top:3px}</style><div class="sp2" style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">${MEDALS.filter(m=>m.cat===k).map(medalRow).join('')}</div></div>`).join('')}</div>
`,{num:7,title:'MEDALS (CONTINUED)',sub:'GAMES • COMMUNITY • SPECIAL & SECRET'}));

// ================= 8 ADJACENT =================
pages.push(page(`
<p>Ruby VIP and Emerald Elite sit alongside the Blue–Platinum progression path rather than above it. Recognition is added to the member's existing tier.</p>
<div class="adj"><div class="ruby"><h2>RUBY VIP</h2><p>Weekly recognition primarily for members who significantly support the stream through subscriptions, Gift Subs and Bits.</p><p>Included in exclusive VIP-only giveaways monthly.</p></div>
<div class="emerald"><h2>EMERALD ELITE</h2><p>Supporting recognition for trusted members who help MDA run the stream, Discord and associated community programs.</p></div></div>
<div class="combo">${[['blue','Blue Explorer','ruby','Ruby VIP'],['silver','Silver Sentinel','emerald','Emerald Elite'],['platinum','Platinum Vanguard','ruby','Ruby VIP']].map(([a,an,b,bn])=>`<div><span><img src="${A}emb-${a}.png" alt=""><small>${an}</small></span><em>+</em><span><img src="${A}${b}-s.png" alt=""><small>${bn}</small></span></div>`).join('')}</div>
<p class="center note">Examples: the core tier stays in place and the recognition is added alongside it.</p>
<div class="rounds"><img src="${A}ruby-w.jpg" alt="Ruby VIP emblem"><img src="${A}emerald-w.jpg" alt="Emerald Elite emblem"></div>
`,{num:8,title:'ADJACENT RECOGNITION',sub:'YOUR CORE MEMBERSHIP REMAINS IN PLACE'}));

// ================= 9 RUBY =================
pages.push(page(`
<figure><img src="${A}ruby-info.jpg" class="poster" alt="Ruby VIP infographic"></figure>
<p>Ruby VIP recognises members whose weekly support directly contributes to the stream and helps MDA continue to provide content, community events and giveaways.</p>
<ul class="compact">
 <li>Weekly awards: Top 3 Gift Sub contributors, Top 3 Bit contributors and Top 3 qualifying clip creators.</li>
 <li>Qualifying clips must achieve 100+ views* (exceptions determined by the streamer, MDA009).</li>
 <li>Successful members receive Voyager Ruby VIP recognition and the Twitch VIP Channel Badge for the week.</li>
 <li>Automatic entry into the monthly Ruby VIP giveaway and the ability to suggest future Blue Explorer ship giveaways.</li>
 <li>Ruby giveaways are normally drawn mid-month during a Super Saturday and focus on smaller exclusive or collectible rewards, such as The Unprofessionals &amp; MDA009 merchandise.</li>
</ul>
`,{num:9,title:'RUBY VIP',sub:'WEEKLY SUPPORT RECOGNITION',color:'#e0313f'}));

// ================= 10 EMERALD =================
pages.push(page(`
<figure><img src="${A}emerald-info.jpg" class="poster" alt="Emerald Elite infographic"></figure>
<p>Emerald Elite recognises members who contribute their time, skills and responsibilities behind the scenes. Members are selected by the streamer, while applications remain open to people who want to contribute.</p>
<ul class="compact">
 <li>May include business managers, lead moderators, moderators, editors, content creators, artists, administrators and Discord moderators.</li>
 <li>Provides exclusive recognition, input on future direction and greater involvement in community decisions.</li>
 <li>Members may help identify and recommend outstanding community members for Ruby VIP recognition.</li>
</ul>
`,{num:10,title:'EMERALD ELITE',sub:'SUPPORTING THE STREAM, DISCORD & COMMUNITY',color:'#22b04c'}));

// ================= 11 POINTS =================
const earn=[['Cheer with Bits','1 per Bit'],['Gift Subscription','100 per gifted sub'],['Monthly Subscription','5'],['Chat during a stream','5'],['Follow','50'],['25 Stream Streak','50'],['Watch Time','6 per hour'],['Prime Subscription','50'],['Tier 1 Subscription','250'],['Referral','75'],['Join Raid','75 + 1 per viewer']];
const more=[['Weekly missions','Up to 50 each','Missions & community goals'],['!report (once a stream, per platform)','2','Chat engagement'],['Bridge Quiz (first correct answer)','5','Chat engagement'],['Win a Voyager Versus battle','50','Live games'],['Dreadnought MVP (top damage in a victory)','50','Live games'],['Season sub goal reached (everyone who helped)','200–250','Missions & seasons']];
pages.push(page(`
<table class="grid"><thead><tr><th>ACTIVITY</th><th>VOYAGER POINTS</th></tr></thead><tbody>${earn.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table>
<h3 class="mt">More ways to earn</h3>
<table class="grid"><thead><tr><th>ACTIVITY</th><th>VOYAGER POINTS</th><th>SEE</th></tr></thead><tbody>${more.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}</tbody></table>
<p class="note">Amounts are the current settings and may change. Mission, muster, quiz and goal rewards are paid into your Voyager points by MDA009 after they are earned.</p>
<div class="three">
 <div class="box"><b>Your balance</b><p>What you can spend. Check it with ${cmd('!points')}. Spend it with ${cmd('!upgrade')}.</p></div>
 <div class="box"><b>Lifetime points</b><p>Everything you have ever earned. Never goes down. Sets your naval rank.</p></div>
 <div class="box"><b>Giveaway tickets</b><p>Only in ticketed giveaways, earned by watching live. Separate from points and never bought.</p></div>
</div>
<p>Points do not automatically upgrade your membership. Use ${cmd('!upgrade')} when you are ready to progress. Fast tracking is completely optional: eligible Twitch Tier 2 or Tier 3 subscribers retain their corresponding Voyager tier while their qualifying subscription remains active. You never need to spend money to participate.</p>
`,{num:11,title:'EARNING & USING VOYAGER POINTS',sub:'PARTICIPATE • BUILD YOUR BALANCE • CHOOSE WHEN TO UPGRADE'}));

// ================= 12 MISSIONS & SEASONS =================
const missions=[['Ace of the Arena','Win a Voyager Versus battle','versus','Versus Ace'],['Crew Supporter','Subscribe or renew (sub, membership or Kick sub)','subs','Loyal Subscriber'],['Fleet Gifter','Gift 3 subs or memberships','gifter','Fleet Gifter'],['Veteran Crew','Renew with 6+ months subscribed','substreak','Sub Streak'],['Quartermaster','Earn 300 Voyager points','points','Point Collector'],['Hold the Line','Be at 5 streams in a row','streak','Unbreakable'],['Care Package','Gift a sub or membership','gifter','Fleet Gifter']];
pages.push(page(`
<p>Every week brings a fresh set of missions. Finish one to earn up to <b>50 Voyager points</b>. Weeks reset on Monday at midnight (Sydney time), and each mission can be completed once a week.</p>
<h3>This week's missions</h3>
<table class="grid ms"><thead><tr><th>MISSION</th><th>WHAT TO DO</th><th>REWARD</th><th>WORKS TOWARD</th></tr></thead><tbody>${missions.map(([t,d,id,mn])=>`<tr><td><b>${t}</b></td><td>${d}</td><td>25 pts</td><td><span class="mt2">${hex(id,2,22)}${mn}</span></td></tr>`).join('')}</tbody></table>
<ul class="compact">
 <li><b>Missions and medals work together:</b> each mission counts toward a medal, and every mission you finish also counts toward Mission Runner and Full Spectrum.</li>
 <li>Other mission types MDA may run: watch hours, chat messages, streams in a row, Dreadnought fights, victories, damage, MVPs and torpedoes. See this week's on voyagercommand.com and on stream.</li>
</ul>
<h3 class="mt">Community goals &amp; the Hall of Fame</h3>
<div class="two">
 <div><p>From time to time MDA runs a <b>community goal</b>: a named run with a start date, a due date and one or more targets for the whole crew, counted from the day it is announced. During a run your <b>score</b> is the points you earn, plus <b>100</b> for every sub, renewal or gifted sub. When it ends, the champion and the top Versus pilot join the <b>Hall of Fame</b>, and the top three earn the Season Podium medal.</p>
 <div class="goal" style="margin-top:8px"><b>Christmas 2026 · 1 Nov – 25 Dec</b><span>1,000 subs across Twitch, YouTube and Kick (new subs, renewals and gifted subs, counted from 1 November). Everyone who contributes earns ×1.5 Voyager points on everything they earn during the run, paid when it ends, and a place in the Christmas Eve giveaway draw.</span></div></div>
 <div><div class="goal"><b>Each goal has</b><span>what it counts (subs, gifted subs, Voyager points earned by the crew, or Versus wins), a community target, a points reward and/or a points multiplier for every helper, and a due date</span></div>
 <div class="goal"><b>Your contribution is tracked</b><span>per person: the on-stream contributors panel and voyagercommand.com show who has helped each goal and by how much.</span></div>
 <p class="note">A multiplier bonus is paid to every helper when the run ends whether or not the target is reached; a fixed reward is paid when the goal is reached. Nothing runs between community goals.</p></div>
</div>
<h3 class="mt">From mission to points</h3>
${flow([['target','Do it on stream','Play, watch, support or simply show up'],['check','Voyager tracks it','Progress shows on stream and on voyagercommand.com'],['shield','MDA reviews it','Completed missions are listed for MDA009 to pay'],['star','Points land','In your balance and your lifetime points']])}
`,{num:12,title:'MISSIONS & COMMUNITY GOALS',sub:'WEEKLY MISSIONS • COMMUNITY GOALS • SCORE • HALL OF FAME'}));

// ================= 13 GAMES =================
pages.push(page(`
<div class="dread">
 <div class="dh"><span>⚠ HOSTILE CAPITAL SHIP</span><b>THE DREADNOUGHT</b><div class="hull"><i style="width:61%"></i></div><small>3,920 / 6,450 HULL · 61% · 1:42 LEFT</small><div class="relay">COMMS RELAY · CHAT TO CHARGE <i><u style="width:72%"></u></i> 36 / 50</div></div>
 <div class="dsteps">
  <div><b>1 · It approaches</b><p>MDA or a moderator calls it and the battle takes over the screen (MDA's game shrinks to a corner). You have 60 seconds to type ${cmd('!join')} and board the fleet.</p></div>
  <div><b>2 · Fight</b><p>Type ${cmd('!fire')} for 25–50 damage (6% chance of a triple critical), and ${cmd('!shoot')} on its own cooldown for half that. You have 4 minutes.</p></div>
  <div><b>3 · Hit harder</b><p>Cheers deal 2.5 damage per Bit. Each gifted sub fires a torpedo for 600. Every 50 chat messages charge the Comms Relay for a fleet barrage (2% of the hull).</p></div>
  <div><b>4 · Survive</b><p>At half hull its shields go up for 8 seconds (${cmd('!fire')} halved). It knocks pilots out for 6 seconds every 20 seconds, and faster when enraged at 20% hull.</p></div>
  <div><b>5 · Victory</b><p>Destroy it in time and <b>every pilot who fought earns 10 giveaway tickets</b> while a ticketed giveaway runs. The <b>MVP</b> adds 50 points and 10 tickets. If it escapes, nobody is paid.</p></div>
 </div>
</div>
<p class="note"><b>Speed goals:</b> a kill within <b>1 minute</b> earns every pilot who fought the <b>Legendary Strike</b> medal; within <b>2 minutes</b>, <b>Hero of the Fleet</b>. The countdown runs under the clock. Hull: 6,000 + 150 per pilot (75 per late joiner). Medals: Slayer, Top Gun, Torpedo Run, Legendary Strike, Hero of the Fleet and the secret Last Stand.</p>
<h3 class="mt">Voyager Versus <span class="tag">TWITCH</span></h3>
<div class="two">
 <div><ul class="compact">
  <li>Type ${cmd('!versus')} to call a battle. The next viewer to type ${cmd('!versus')} flies as the challenger.</li>
  <li>Pick a fighter any time with ${cmd('!ship')} and its name (below).</li>
  <li>After a 10-second countdown, fly with the actions below. Energy starts at 100 and recharges; ${cmd('!leave')} leaves the queue.</li>
 </ul></div>
 <div><ul class="compact">
  <li>The winner earns <b>50 Voyager points</b> and a champion celebration on screen.</li>
  <li>The arena recharges for 45 minutes between battles, and each viewer can call one battle and answer one each stream.</li>
  <li>Wins count toward Versus Ace, Hot Streak, missions, the community goal and your squadron.</li>
 </ul></div>
</div>
<div class="ships">${[['interceptor','VX-01 Dart','Interceptor · balanced fighter',100,50],['sentinel','VX-02 Bulwark','Sentinel · heavy defender',120,30],['phantom','VX-03 Wraith','Phantom · shield specialist',85,65]].map(([k,n,r,h,sh])=>`<div><img src="${A}ship-${k}.png" alt="${n}"><b>${n}</b><span>${r}</span><div class="st"><small>Hull</small><i><u style="width:${h/1.2}%"></u></i><em>${h}</em><small>Shield</small><i><u class="s" style="width:${sh/0.65}%"></u></i><em>${sh}</em></div>${cmd('!ship '+k)}</div>`).join('')}</div>
<table class="grid acts"><thead><tr><th>ACTION</th><th>ENERGY</th><th>RECHARGE</th><th>WHAT IT DOES</th></tr></thead><tbody>
<tr><td>${cmd('!fire')}</td><td>10</td><td>2 s</td><td>Laser shot for 14 damage (your guns also fire on their own)</td></tr>
<tr><td>${cmd('!missile')}</td><td>35</td><td>10 s</td><td>Heavy hit for 32 damage</td></tr>
<tr><td>${cmd('!shield')}</td><td>30</td><td>12 s</td><td>Restores up to 30 shield</td></tr>
<tr><td>${cmd('!dodge')}</td><td>25</td><td>9 s</td><td>Evasive roll: shots miss you for 2.5 seconds</td></tr></tbody></table>

`,{num:13,title:'LIVE GAMES',sub:'THE DREADNOUGHT CO-OP BOSS FIGHT • VOYAGER VERSUS'}));

// ================= 13b PROSPECT RUN (2.33) =================
pages.push(page(`
<figure><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><img src="${A}prospect-mine.jpg" class="r" style="width:100%;display:block;border-radius:8px" alt="Prospect Run: mining ships lasing an asteroid"><img src="${A}prospect-haul.jpg" class="r" style="width:100%;display:block;border-radius:8px" alt="Prospect Run: a pirate interdicts the freighter"></div><figcaption>Prospect Run on stream: holding the laser in the optimal window (left) and the pirate interdiction (right). Sample data.</figcaption></figure>
<p>A crew contract that MDA starts. Mine Lumenite in the Marrow Belt, jump it to Halcyon Exchange and sell it at the peak. <b>Three commands, one per phase.</b> Type any of them during a run and you are on the crew; there is nothing to join first.</p>
<div class="feat" style="grid-template-columns:repeat(3,1fr)">
 <div><h4>${ic('star',18)} 1 · Mine · ${cmd('!mine')}</h4><p>Each ${cmd('!mine')} keeps your laser on the rock for 10 seconds, and the charge cools by itself. About half the miners at a time holds it in the green window until the rock breaks. <b>Everyone at once overcharges it and ore is lost.</b></p></div>
 <div><h4>${ic('shield',18)} 2 · Haul · ${cmd('!fire')}</h4><p>The jump drive spools, then pirates pull the freighter out of the jump. Every ${cmd('!fire')} hits the pirate. The longer it lives, the more cargo is shot loose; if it escapes it takes a share with it.</p></div>
 <div><h4>${ic('check',18)} 3 · Sell · ${cmd('!sell')}</h4><p>The price swings while the freighter docks. The cargo sells the moment half the crew (20 at most) has typed ${cmd('!sell')}, so chat has to agree on the peak. One vote each.</p></div>
</div>
<table class="grid acts"><thead><tr><th>RESULT</th><th>HAUL SCORE (CARGO × PRICE)</th><th>TICKETS FOR EVERYONE WHO FLEW</th></tr></thead><tbody>
<tr><td><b>Gold haul</b></td><td>260 or more</td><td>8 tickets each</td></tr>
<tr><td><b>Silver haul</b></td><td>180 or more</td><td>5 tickets each</td></tr>
<tr><td><b>Bronze haul</b></td><td>Anything delivered below that</td><td>3 tickets each</td></tr>
<tr><td><b>Cargo lost</b></td><td>Nothing mined or nothing delivered</td><td>1 ticket each, for taking part</td></tr></tbody></table>
<p class="note">Tickets go to the ticketed giveaway that is running; with none running, a run pays nothing. Each command counts once every 6 seconds per viewer, so there is no need to spam. Cheers and gifted subs do nothing here. Medals: Rock Breaker, Gun Runner, Long Hauler and one secret. Weekly missions can ask for runs, Gold hauls or cracked rocks.</p>
<div class="two">
 <div class="box"><b>${ic('quiz',18)} Bridge Quiz leaderboard</b><p>A panel shows the quiz standings on stream while questions are being asked, and voyagercommand.com keeps the all-time and this-stream boards. Questions never repeat.</p></div>
 <div class="box"><b>${ic('users',18)} Doorframe</b><p>A silly one MDA starts for fun: something new blocks each door and chat votes ${cmd('!duck')}, ${cmd('!hop')} or ${cmd('!squeeze')}. Everyone who typed the right command earns a few points, with a bonus for a clean run.</p></div>
</div>
`,{num:13,title:'LIVE GAMES',sub:'PROSPECT RUN • MINE, HAUL, SELL • GIVEAWAY TICKETS'}));

// ================= 14 CHAT ENGAGEMENT =================
pages.push(page(`
<figure><img src="${A}engage-overlay.jpg" class="full r" alt="Arrival, muster and log cards, Bridge Quiz and squadron panel on stream"><figcaption>On stream: arrival, muster and Captain's Log cards (left), the Bridge Quiz (top) and the squadron war (right). Sample data.</figcaption></figure>
<div class="feat">
 <div><h4>${ic('check',18)} Daily muster · ${cmd('!report')}</h4><p>Report for duty once each stream for <b>2 points</b> (your Twitch, Kick and YouTube accounts each count separately). Your name joins the muster call in chat and on stream and counts a stream attended. (Your stream streak is separate: it is Twitch's watch streak, shared in chat.) A stream starts when MDA goes live or after a long break in chat; MDA can also reset it mid-session, which lets everyone report again.</p></div>
 <div><h4>${ic('quiz',18)} Bridge Quiz</h4><p>Star Citizen trivia and general knowledge. When a question appears, the <b>first correct answer</b> in chat wins <b>5 points</b>. You have 60 seconds; spelling and capitals are forgiven. ${cmd('!quiz')} repeats the question.</p></div>
 <div><h4>${ic('users',18)} Squadrons · ${cmd('!squadron red | gold | blue')}</h4><p>Join Red Wing, Gold Wing or Blue Wing. Each week your chat (1 per message, up to 60 a stream), missions (25 each), Dreadnought damage (1 per 10) and Versus wins (50 each) score for your squadron. Switch once every 30 days. Bragging rights only: squadron scores never change anyone's points.</p></div>
 <div><h4>${ic('chat',18)} Comms Relay</h4><p>During a Dreadnought fight, every chat message (not commands) charges the relay. At 50 the whole fleet fires. Each viewer counts once every 5 seconds.</p></div>
 <div><h4>${ic('anchor',18)} Arrival cards</h4><p>The first time a Silver, Gold or Platinum member chats each stream, or anyone promoted since their last visit, a "now on the bridge" card slides in with their tier and rank.</p></div>
 <div><h4>${ic('book',18)} Captain's Log · ${cmd('!log <moment>')}</h4><p>Log the moments you love (up to 3 a stream, no links). MDA pins the best, and they become the Captain's Log on voyagercommand.com.</p></div>
</div>
`,{num:14,title:'CHAT ENGAGEMENT',sub:'!REPORT • BRIDGE QUIZ • SQUADRONS • COMMS RELAY • ARRIVALS • CAPTAIN\'S LOG'}));

// ================= 15 GIVEAWAYS =================
pages.push(page(`
<div class="gtypes">
 <div><h4>Chat giveaways</h4><p>Impromptu giveaways opened during the stream. Type ${cmd('!enter')} (or ${cmd('!ticket')}) while entry is open, on Twitch, YouTube or Kick. One entry each.</p></div>
 <div><h4>Member tier giveaways</h4><p>Silver, Gold, Platinum and Ruby VIP giveaways for members of that tier and above, triggered by community thresholds (section 16).</p></div>
 <div><h4>Ticketed giveaways</h4><p>Longer giveaways (usually about four weeks). Join once with ${cmd('!entergiveaway')} or ${cmd('!entry')}, then earn <b>1 ticket per 10 minutes</b> you watch live. ${cmd('!tickets')} checks your balance. More tickets, better odds.</p></div>
</div>
<h3>The winner reveal</h3>
<div class="reveal">${[['give-countdown','10-second countdown'],['give-buildup','Buildup'],['give-wheel','30-second wheel'],['give-winner','Winner and claim timer']].map(([f,t])=>`<figure><img src="${A}${f}.jpg" alt="${t}"><figcaption>${t}</figcaption></figure>`).join('')}</div>
<p class="note">Every draw plays the same sequence on stream. On a ticketed wheel, each slice is sized by tickets. The winner's name and platform appear, followed by the claim timer where a live claim applies.</p>
<div class="two">
 <div class="box"><b>${ic('shield',18)} Fair-draw check</b><p>Before a chat giveaway is drawn, Voyager locks the entrant list and posts its fingerprint in chat and on voyagercommand.com. After the draw, anyone can press <b>Check this draw</b> on the site and their own browser repeats the draw to confirm the winner.</p></div>
 <div class="box"><b>${ic('star',18)} Recent-winner rule</b><p>Everyone may enter chat giveaways, but anyone who won a chat giveaway in the last 30 days can't be drawn again until the 30 days pass. Silver, Gold, Platinum and Ruby VIP giveaways are not affected.</p></div>
</div>
<p class="note">Tickets come from watching and from playing (Dreadnought victories, Prospect Runs) and are never sold. The Live tab on voyagercommand.com lists every entrant's tickets with a time bar to their next one.</p>
`,{num:15,title:'GIVEAWAYS & THE WINNER REVEAL',sub:'CHAT • MEMBER TIERS • TICKETED • FAIR DRAW'}));

// ================= 16 THRESHOLDS =================
pages.push(page(`
<p>Each applicable tier has a community point threshold. Reaching it activates the next giveaway; it does not close entry.</p>
<div class="cycle">${[['UPGRADE','Spend points'],['BUILD','Reach threshold'],['TRIGGER','Giveaway activates'],['ENTER','Upgrades stay open'],['RESET','Cycle restarts']].map(([a,b],i)=>`<div><b>${i+1}</b><span>${a}</span><small>${b}</small></div>`).join('')}</div>
<div class="thr">${[['silver','Silver Sentinel','72,000','US$100–200'],['gold','Gold Commander','120,000','US$200–500'],['platinum','Platinum Vanguard','200,000','US$500–1,000']].map(([k,n,p,v])=>`<div><img src="${A}emb-${k}.png" alt=""><b>${n}</b><span>${p} community points</span><small>Giveaways valued ${v}</small></div>`).join('')}</div>
<h3>Silver Sentinel example</h3>
<p>Silver requires 72,000 community points to trigger its giveaway. Once reached, the giveaway is scheduled for the following Stellar Sunday. Members can continue spending 1,200 points to upgrade into Silver right up until the Silver giveaway begins.</p>
<p>After the draw, Silver resets. Point-upgraded members must upgrade again for the next cycle. Active Twitch Tier 2 subscribers remain Silver while their qualifying subscription remains active.</p>
<p>Threshold progression is shown live on stream with each tier's emblem and a percentage, and on voyagercommand.com. Once a threshold reaches 100%, entry stays open until the giveaway is drawn, so more than 100% can be reached.</p>
<p>Members may be invited to suggest a giveaway item relative to the value of prizes eligible for the tier, and to vote on suggested prizes for the upcoming draw.</p>
<h3 class="mt">Tracking progress</h3>
<div class="track">${[['silver','Silver Sentinel',61920,72000],['gold','Gold Commander',49200,120000],['platinum','Platinum Vanguard',24000,200000]].map(([k,n,v,t])=>`<div><img src="${A}emb-${k}.png" alt=""><b>${n}</b><i><u class="${k}" style="width:${(v/t*100).toFixed(1)}%"></u></i><span>${fmt(v)} / ${fmt(t)}<em>${Math.round(v/t*100)}%</em></span></div>`).join('')}</div>
<p class="note">Sample figures. The live tracker is on stream and on voyagercommand.com.</p>
`,{num:16,title:'TIER GIVEAWAY THRESHOLDS',sub:'COMMUNITY-TRIGGERED GIVEAWAY CYCLES'}));

// ================= 17 CLAIMING =================
pages.push(page(`
<div class="claim"><div class="live"><h4>SUPER SATURDAY — LIVE CLAIM</h4><p>Blue Starter Pack and Monthly Bundle giveaways require the member to be present in chat.</p><ul><li>Approximately 1 minute to claim.</li><li>If unclaimed, a redraw begins and the member is removed from subsequent redraws for that prize.</li><li>Once the redraw starts, the previous winner cannot claim.</li></ul></div>
<div><h4>OTHER TIER DRAWS — NO LIVE ATTENDANCE</h4><p>Blue Monthly Grand Prize, Silver, Gold, Platinum and Ruby VIP giveaways do not require live attendance.</p><ul><li>Winner posted in MDA's Discord.</li><li>Winner must DM MDA before the next stream begins.</li><li>Unclaimed prizes may be redrawn.</li></ul></div></div>
<h3>Schedule</h3>
<ul><li><b>Super Saturdays:</b> Blue Starter Pack and Monthly Bundle giveaways; Ruby VIP is normally mid-month.</li><li><b>Stellar Sundays:</b> Silver, Gold and Platinum giveaways after the applicable threshold has been triggered.</li><li><b>Ticketed giveaways</b> run for their announced period; the draw date is announced on stream and on voyagercommand.com.</li><li><b>Chat giveaways</b> can open at any time during a stream.</li></ul>
<div class="callout">Recent winners from the last 30 days can still enter chat giveaways but can't be drawn. A member cannot win two consecutive giveaways in a row unless MDA009 expressly announces an exception.</div>
<h3 class="mt">If your name comes up</h3>
${flow([['wheel','Watch the wheel','Your name and platform appear on stream with the claim timer'],['chat','Live claim','Confirm your claim with MDA009 in chat before the timer ends (about 1 minute)'],['users','No live claim','Watch MDA\'s Discord and DM MDA before the next stream begins'],['shield','Check the draw','Chat giveaways: press Check this draw on voyagercommand.com']])}
<h3 class="mt">A week with Voyager</h3>
<div class="week">${[['MON','Missions reset','New weekly missions from midnight (Sydney time)'],['EVERY STREAM','Be there','!report, Bridge Quiz, squadrons, the Dreadnought and Versus'],['SAT','Super Saturday','Blue Starter Pack &amp; Monthly Bundle; Ruby VIP mid-month'],['SUN','Stellar Sunday','Silver, Gold &amp; Platinum draws once triggered'],['ANY TIME','While you watch','Chat giveaways open, and tickets build in ticketed giveaways']].map(([d,t,x])=>`<div><span>${d}</span><b>${t}</b><small>${x}</small></div>`).join('')}</div>
`,{num:17,title:'GIVEAWAYS & CLAIMING RULES',sub:'KNOW WHEN YOU NEED TO BE PRESENT'}));

// ================= 18 SITE =================
pages.push(page(`
<p><b>voyagercommand.com</b> is the Voyager stream companion. Keep it open on your phone while you watch, or add it to your home screen for one-tap access (it opens instantly, even offline, showing the last update).</p>
<div class="phones">${[['site-live','Live','What is on right now, watch links, tap-to-copy commands, the Dreadnought, giveaways, Versus and missions.'],['site-card-front','My card','Search your name to see your card front: the same card as on stream.'],['site-card-back','My card · back','Turn it over for the real back of your card: your Fleet Record with your stream streak, then the Medals side.'],['site-boards','Community','Squadron war, points and Versus leaderboards, winners and every medal.']].map(([f,t,d])=>`<figure><img src="${A}${f}.jpg" alt="${t}"><figcaption><b>${t}</b>${d}</figcaption></figure>`).join('')}</div>
<div class="three"><div class="box"><b>Requests &amp; alerts</b><p>Ask MDA for a game from the Live tab (each option once per stream), and switch on notifications for going live, giveaways and the Dreadnought.</p></div><div class="box"><b>SC Intel</b><p>Star Citizen news, patch notes, what is playable now, ships on sale, and a section for the event that is on.</p></div><div class="box"><b>Goals, Community &amp; Guide</b><p>The community goal, squadron war, points, Versus and Bridge Quiz boards, winners with a fair-draw check, every medal and every command.</p></div></div>
<p class="note">The site shows names, tiers, ranks, medals, game results and, unless you are private, hours watched and months subscribed. It never shows account IDs, chat messages or money amounts. Cards update within a couple of minutes of the stream.</p>
<div class="install"><div class="box"><b>${ic('phone',18)} Add it to your home screen</b><p><b class="in">iPhone or iPad:</b> open voyagercommand.com in Safari, tap Share, then Add to Home Screen.</p><p><b class="in">Android:</b> open it in Chrome, tap the ⋮ menu, then Install app (or Add to Home screen).</p></div><div class="qrbox"><img src="${A}qr-site.svg" alt="QR code for voyagercommand.com"><span><b>Scan to open</b>voyagercommand.com</span></div></div>
`,{num:18,title:'VOYAGERCOMMAND.COM',sub:'THE STREAM COMPANION • LIVE • MY CARD • GOALS • COMMUNITY • GUIDE'}));

// ================= 19 GOVERNANCE =================
pages.push(page(`
<p class="quote">“This is a promotion from MDA009. Twitch, YouTube and Kick do not sponsor or endorse broadcaster promotions and are not responsible for them.”</p>
<h3>Streamer Authority</h3>
<p>MDA009 administers the Voyager Membership Program and all associated promotions, giveaways, eligibility decisions, redraws and interpretations of these rules. MDA009 has the final call on all decision-making, and all decisions are final.</p>
<p>Where reasonably required for fairness, integrity, security or practical operation of the stream and community, MDA009 may override, amend, temporarily suspend or make an exception to a Voyager rule or process. This may include technical failures, platform issues, suspected abuse, unforeseen circumstances, errors, event changes or situations not expressly covered by this manual.</p>
<h3>General Giveaway Rules</h3>
<ul class="compact"><li>Must be following the MDA009 channel.</li><li>Where a live claim applies, must be present in chat at the time of the draw.</li><li>Scripts, bots, automated and/or multiple accounts or artificial methods used to manipulate entries, points, tickets, games or eligibility are prohibited and may result in disqualification and a ban.</li><li>A member cannot win two consecutive giveaways in a row unless MDA009 expressly announces an exception; chat giveaway winners can't be drawn again for 30 days.</li><li>The regular giveaway cycle is intended to operate every four weeks, subject to tier thresholds, special events and scheduling.</li><li>Giveaways are at the discretion of streamer MDA009. Eligibility, redraw, winner and prize decisions are final.</li></ul>
<h3>Fair play &amp; points</h3>
<ul class="compact"><li>Paid support (subscriptions, gifts, Bits, Kicks, Super Chats) earns Voyager points, medals and recognition, never giveaway entries or tickets.</li><li>Voyager points, ranks, medals and squadron scores have no cash value and cannot be exchanged or transferred.</li><li>Rewards for missions, the daily muster, quizzes and goals are reviewed and paid by MDA009.</li><li>Values, criteria, rewards and benefits may evolve; significant changes will be communicated.</li></ul>
<h3>Privacy</h3>
<ul class="compact"><li>Voyager keeps what it needs to run the program: your platform name and account ID, your points, watch time and counts of your activity such as chat messages, games and support. Captain's Log entries you submit with ${cmd('!log')} are kept so MDA009 can review them.</li><li>voyagercommand.com never shows account IDs, chat messages, money amounts or giveaway ticket balances. ${cmd('!voyager private')} hides your hours watched and months subscribed.</li></ul>
<h3>Voyager-Specific Attendance Rules</h3>
<p>The general rules operate together with the specific Voyager draw rules. Blue Starter Pack and Monthly Bundle Super Saturday giveaways require live attendance and the approximately one-minute claim window. The Blue Monthly Grand Prize, Silver, Gold, Platinum and Ruby VIP giveaways do not require the winner to be present unless MDA009 announces otherwise for that promotion.</p>
`,{num:19,title:'PROGRAM GOVERNANCE & PROMOTION RULES',sub:'PROMOTION DISCLAIMER • ELIGIBILITY • FAIR PLAY • FINAL AUTHORITY'}));

// ================= 20 FAQ =================
const faq=[['Is Voyager free?','Yes. Voyager is 100% free and everyone begins as a Blue Explorer.'],['Do I have to subscribe?','No. Subscriptions, Gift Subs and Bits are optional.'],['Which platforms count?','Twitch, YouTube and Kick. Chat commands work on all three; Voyager Versus is Twitch only.'],
 ['How do I upgrade?','Use !upgrade. Points are deducted when you purchase an available upgrade: Silver 1,200, Gold 1,800 more, Platinum 17,000 more.'],['How long does my tier last?','Until that tier\'s giveaway is drawn. There is no stream limit: Silver, Gold and Platinum all stay until their giveaway.'],
 ['What is the difference between my tier and my rank?','Your tier is the membership you choose to buy with points and decides your giveaways. Your naval rank is earned from lifetime points and is never lost.'],['Does spending points lower my rank?','No. Ranks use lifetime points, which never go down.'],
 ['Do medals give points or better odds?','No. Medals are prestige only: they show on your card and add to your Honour.'],['How do I count towards Christmas 2026?','Sub, renew or gift subs between 1 Nov and 25 Dec: ×1.5 points during the run and a place in the Christmas Eve draw.'],['How do I show my card?','Type !voyager. Add stats or badges for the back sides, or look yourself up on voyagercommand.com › My card.'],
 ['Can I hide my stats?','Yes. !voyager private hides hours watched and months subscribed on stream and on the site. !voyager public shows them again.'],['What is a tier threshold?','A community point target that activates the next tier giveaway. Entry remains open until the giveaway begins.'],
 ['What happens after a tier giveaway?','The tier resets for point-based members, who must upgrade again for the next cycle.'],['What about Tier 2 or Tier 3 Twitch subscribers?','They retain the applicable Voyager tier while the qualifying subscription remains active.'],
 ['How do giveaway tickets work?','Only in ticketed giveaways. Join with !entergiveaway, then earn 1 ticket per 10 minutes watched live, plus tickets for Dreadnought victories and Prospect Runs. Check with !tickets or on voyagercommand.com. Tickets are never sold.'],['How do I know a draw was fair?','Chat giveaways post a fingerprint before the draw. After it, press Check this draw on voyagercommand.com.'],
 ['I won recently. Can I still enter?','Yes, but chat giveaway winners can\'t be drawn again for 30 days. Tier giveaways are not affected.'],['When are mission rewards paid?','MDA009 pays mission, muster, quiz and goal rewards into your Voyager points after they are earned. Weeks reset Monday at midnight.'],
 ['How do I join a squadron?','Type !squadron red, gold or blue. You can switch once every 30 days.'],['Is Ruby VIP above Platinum?','No. Ruby VIP is adjacent recognition added to the existing core tier.'],['What is Emerald Elite?','Adjacent supporting recognition for trusted members who help run the stream, Discord and associated programs.'],
 ['Do I need to be present for giveaways?','Only Blue Starter Pack and Monthly Bundle Super Saturday draws require live presence.'],['Why didn\'t my card show?','Cards play one at a time, and each viewer can call theirs once a minute. Give it a moment and type !voyager again.'],['Can I choose my callsign?','Yes. !voyager title lists the callsigns you have unlocked; add a medal name to pick one.'],
 ['What is the Bridge Quiz?','A quick Star Citizen or general-knowledge question on stream. The first correct answer in chat within 60 seconds wins 5 Voyager points.'],['Do squadron scores change my points?','No. Squadrons are for bragging rights; their scores never change anyone\'s points.'],
 ['Can Voyager rules change?','Yes; significant changes will be communicated.']];
const half=Math.ceil(faq.length/2);
const faqBlock=list=>list.map(([q,a])=>`<div class="faq"><b>${q}</b><p>${a.replace(/(![a-z]+(?: (?:stats|badges|private|public|title|red, gold or blue))?)/g,'<code>$1</code>')}</p></div>`).join('');
pages.push(page(`<div class="faqcols">${faqBlock(faq)}</div>`,{num:20,title:'FREQUENTLY ASKED QUESTIONS',sub:'QUICK ANSWERS'}));

// ================= 21 PHILOSOPHY =================
pages.push(page(`
<p>Voyager isn't simply about accumulating points. It is designed to recognise the different ways people contribute to the community.</p>
<ul class="compact"><li><b>Blue, Silver, Gold and Platinum</b> reward participation and progression.</li><li><b>Naval ranks</b> honour everything you have contributed over time.</li><li><b>Medals and Honour</b> celebrate loyalty, support, play and community, and count longest-serving and most generous crew double.</li><li><b>Ruby VIP</b> recognises exceptional weekly stream support.</li><li><b>Emerald Elite</b> recognises members who contribute their time and skills to help the stream and community operate and grow.</li><li><b>Missions, community goals, squadrons and the games</b> give everyone something to work towards together, every stream.</li></ul>
<div class="poster2">
 <div class="ph"><img src="${A}roundel-s.png" alt=""><div><b>VOYAGER</b><span>MEMBERSHIP PROGRAM · EXPLORE. EARN. EXCEL.</span></div><div class="free">100% FREE TO JOIN<small>Everyone starts as a Blue Explorer</small></div></div>
 <div class="pt">${[['blue','BLUE EXPLORER','Free','Super Saturday & monthly'],['silver','SILVER SENTINEL','1,200 pts','US$100–200'],['gold','GOLD COMMANDER','3,000 pts','US$200–500'],['platinum','PLATINUM VANGUARD','20,000 pts','US$500–1,000']].map(([k,n,c,v])=>`<div><img src="${A}emb-${k}.png" alt=""><b>${n}</b><span>${c}</span><small>${v}</small></div>`).join('')}
  <div class="rb"><img src="${A}ruby-s.png" alt=""><b>RUBY VIP</b><span>Weekly</span><small>Merch &amp; exclusives</small></div><div class="em"><img src="${A}emerald-s.png" alt=""><b>EMERALD ELITE</b><span>Invitation</span><small>Streamer's pick</small></div></div>
 <div class="pr"><div>${lace(11,64)}<span><b>12 naval ranks</b>Midshipman → Admiral of the Fleet</span></div><div>${hex('patron',3,40)}<span><b>${MEDALS.length} medals</b>Bronze · Silver · Gold · Legend</span></div><div>${hex('missions',2,40)}<span><b>Weekly missions</b>up to 50 points each</span></div><div>${hex('slayer',2,40)}<span><b>Live games</b>Dreadnought · Versus · Prospect Run</span></div></div>
 <div class="pc">${['!report','!points','!voyager','!upgrade','!medals','!squadron','!enter','!join','!fire','!versus'].map(c=>`<code>${c}</code>`).join('')}<span>voyagercommand.com</span></div>
</div>
<div class="find"><div class="qrbox"><img src="${A}qr-site.svg" alt="QR code for voyagercommand.com"><span><b>Stream companion</b>voyagercommand.com</span></div><div class="links">${[['Twitch','twitch.tv/mda009','#9146ff'],['YouTube','youtube.com/@MDA009','#ff0033'],['Kick','kick.com/mda009','#53fc18'],['Discord','discord.gg/mda009','#5865f2']].map(([n,u,c])=>`<div><i style="background:${c}"></i><b>${n}</b><span>${u}</span></div>`).join('')}</div></div>
<div class="closing"><div>EXPLORE. EARN. EXCEL.</div><span>WELCOME ABOARD, VOYAGER.</span></div>
`,{num:21,title:'THE VOYAGER PHILOSOPHY',sub:'RECOGNISING EVERY WAY THE COMMUNITY CONTRIBUTES'}));

// ================= TOC =================
const tocHtml=page(`
<div class="tocwrap"><img src="${A}roundel-w.jpg" class="wm" alt="Voyager Membership Program emblem">
<p class="center muted bold">VOYAGER MEMBERSHIP PROGRAM™ · NOVEMBER 2026 EDITION</p>
<ol class="toc">${toc.filter((t,i,a)=>a.findIndex(x=>x[0]===t[0])===i).map(([n,t,p])=>`<li><span>${n}.&nbsp;&nbsp;${t.replace(/: .*/,'').replace(/ \(CONTINUED\)/,'')}</span><i></i><b>${p}</b></li>`).join('')}</ol></div>
`,{title:'CONTENTS'});
// the TOC page was counted as page 2 already; page() incremented again, so fix its number
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Voyager Membership Program · Member Manual & FAQ · November 2026</title><style>${readFileSync(HERE+'manual.css','utf8').replaceAll('FONT/',FONT).replaceAll('file:///tmp/claude-0/manual/fonts/','file://'+HERE+'fonts/')}</style></head><body>${pages.map(p=>p==='__TOC__'?tocHtml.replace(/<span class="pn">\d+<\/span>/,'<span class="pn">2</span>'):p).join('\n')}</body></html>`;
writeFileSync(HERE+'out/manual.html',html);
const b=await chromium.launch();const pg=await b.newPage();
await pg.goto('file://'+HERE+'out/manual.html',{waitUntil:'load'});await pg.evaluate(()=>document.fonts.ready);
// overflow check: any page whose content runs into the footer
const over=await pg.evaluate(()=>[...document.querySelectorAll('.page')].map((p,i)=>{const c=p.querySelector('.content'),f=p.querySelector('footer');if(!f)return null;const last=[...c.children].reduce((m,e)=>Math.max(m,e.getBoundingClientRect().bottom),0);return last>f.getBoundingClientRect().top-6?[i+1,Math.round(last-f.getBoundingClientRect().top)]:null;}).filter(Boolean));
console.log('overflow',JSON.stringify(over));
await pg.pdf({path:HERE+'out/manual.pdf',width:'8.5in',height:'11in',printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});
await b.close();console.log('pages',pages.length);
