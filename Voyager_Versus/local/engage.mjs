// Voyager chat engagement (2.20.22): Comms Relay, daily muster (!report), Bridge Quiz, Squadrons, arrival cards and
// the Captain's Log. Reads chat from Twitch, Kick and YouTube (the same messages Voyager already sees).
// Points it awards (muster, quiz) are never paid here: they're listed in Missions › Points owed and paid through the
// Points Ledger's own audited path, like mission and Dreadnought rewards. Nothing here touches giveaways or tickets.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {weekStart} from './community.mjs';

const FILE='engage.json',HOUR=3600000,DAY=86400000,SESSION_GAP=4*HOUR;
export const SQUADRONS=['red','gold','blue'];
export const REWARD_MAX=50;
// 2.20.24: !report pays at most 2 points. Accounts are per platform (Twitch, Kick and YouTube never merge), so one person
// on all three can muster three times a stream; a small reward keeps that fair.
export const REPORT_MAX=2;
export const ENGAGE_DEFAULTS={
  relay:{enabled:true,threshold:50,damagePct:2,perUserSeconds:5},
  report:{enabled:true,reward:2},
  quiz:{enabled:true,reward:5,seconds:60,autoMinutes:0}, // 2.20.94: 5 points a correct answer
  squadrons:{enabled:true,names:{red:'Red Wing',gold:'Gold Wing',blue:'Blue Wing'},chat:1,chatCap:60,mission:25,damageDiv:10,versusWin:50},
  arrivals:{enabled:true,minTier:'silver',ranks:true},
  log:{enabled:true,perStream:3}
};
// Starter questions (2.21.13, bank 3): mid-range Star Citizen lore and space / general knowledge — harder than the 2.20.94 set
// (a regular viewer should get most of them, a casual one about half), every one with an unambiguous answer. Edit them in
// Voyager Control › Chat engagement, or reload this set with "Load the Star Citizen & general knowledge set".
export const QUIZ_BANK_VERSION=3;
export const QUIZ_STARTERS=[
  // Star Citizen — the verse
  {q:'What does CIG call its fork of CryEngine that runs Star Citizen?',a:['starengine','star engine']},
  {q:'What is the name of the technology that lets many servers share one Star Citizen shard?',a:['server meshing','meshing','static server meshing','dynamic server meshing']},
  {q:'What does PU stand for in Star Citizen?',a:['persistent universe']},
  {q:'What is the name of the UEE\'s federal law-enforcement agency?',a:['advocacy','the advocacy']},
  {q:'What is the UEE-wide network that is also the name of Star Citizen\'s official forums?',a:['spectrum']},
  {q:'Who is the current Imperator of the UEE, elected in 2950?',a:['laylah addison','addison']},
  {q:'Roughly how many years ahead of the real-world date is the Star Citizen timeline?',a:['930','930 years','about 930','roughly 930','around 930','900','900 years','930 years ahead']},
  {q:'Which planet rivals Earth as the UEE\'s cultural capital and has the city Prime?',a:['terra','terra iii']},
  {q:'Levski, the free settlement run by the People\'s Alliance, is in which star system?',a:['nyx']},
  {q:'What is the main outlaw hub station in Pyro called?',a:['ruin station','ruin']},
  {q:'What is the crime rating that outlaws build up by breaking the law called?',a:['crimestat','crime stat','crime stat level']},
  {q:'Which mined ore is refined into quantum fuel?',a:['quantanium','quantainium']},
  {q:'What is the small injectable used to heal yourself in the field called?',a:['medpen','med pen','medipen']},
  {q:'What is the name of the UEE\'s main hostile alien enemy\'s largest capital ship?',a:['kingship','vanduul kingship']},
  {q:'What is the common Vanduul light fighter, named after a farming tool?',a:['scythe','vanduul scythe']},
  // Star Citizen — Stanton
  {q:'microTech\'s three moons are named after Greek Muses. Name one.',a:['calliope','clio','euterpe']},
  {q:'Name one of ArcCorp\'s two moons.',a:['lyria','wala']},
  {q:'Name one of Hurston\'s four moons.',a:['aberdeen','arial','ita','magda']},
  {q:'Which orbital station serves Lorville, above Hurston?',a:['everus harbor','everus harbour','everus']},
  {q:'Which station orbits microTech?',a:['port tressler','tressler']},
  {q:'Which station orbits ArcCorp?',a:['baijini point','baijini']},
  {q:'Which station replaced Port Olisar above Crusader in 2023?',a:['seraphim station','seraphim']},
  {q:'Which Hurston moon holds the Klescher Rehabilitation Facility?',a:['aberdeen']},
  {q:'Which Stanton moon hosts the community Daymar Rally?',a:['daymar']},
  {q:'What does the company that owns Hurston make most of its money from?',a:['weapons','arms','weapon manufacturing','munitions','weapons manufacturing']},
  // Star Citizen — ships and makers
  {q:'Which manufacturer builds the Cyclone buggy and the Nova tank?',a:['tumbril','tumbril land systems']},
  {q:'Who makes the ROC ground mining vehicle?',a:['greycat','greycat industries']},
  {q:'Which manufacturer builds the MOLE multi-crew mining ship?',a:['argo','argo astronautics']},
  {q:'Which manufacturer builds the Mustang and the Nomad?',a:['consolidated outland','consolidated','cnou']},
  {q:'The Fury, Pulse and Guardian belong to which MISC brand?',a:['mirai']},
  {q:'The Ares Ion and Ares Inferno heavy fighters are built by which manufacturer?',a:['crusader','crusader industries']},
  {q:'Which alien race builds the Khartu-al and the Nox?',a:['xi an','xian','xi an race','aopoa']},
  {q:'Which alien race of traders builds the Merchantman and the Defender?',a:['banu']},
  {q:'The Esperia Prowler is a dropship design of which alien race?',a:['tevarin']},
  {q:'Which small snub fighter docks inside the RSI Constellation?',a:['merlin','p52','p 52','p52 merlin','p 52 merlin','kruger merlin']},
  {q:'The Origin 85X snub is carried by which ship?',a:['890 jump','890','890j']},
  {q:'The Pisces is carried inside which Anvil explorer?',a:['carrack','anvil carrack']},
  {q:'Which Anvil dropship is named after the Norse maidens who carried warriors to Valhalla?',a:['valkyrie','anvil valkyrie']},
  {q:'Which Aegis destroyer is bigger than the Idris?',a:['javelin','aegis javelin']},
  {q:'Which Aegis stealth fighter is named after a sword?',a:['sabre','saber','aegis sabre']},
  {q:'Which Aegis stealth bomber is named after an astronomical event?',a:['eclipse','aegis eclipse']},
  {q:'What is RSI\'s torpedo-armed corvette called?',a:['polaris','rsi polaris']},
  {q:'Which RSI medical ship is named after a Greek god of healing?',a:['apollo','rsi apollo']},
  {q:'Which RSI ship can pull others out of quantum travel with a snare?',a:['mantis','rsi mantis']},
  {q:'Which Drake ship is built for carrying and relaying data?',a:['herald','drake herald']},
  {q:'Which Drake multi-crew explorer is named after a Barbary pirate?',a:['corsair','drake corsair']},
  {q:'Which Hercules Starlifter variant (A2, C2 or M2) is the bomber?',a:['a2','the a2','a2 hercules','hercules a2','a2 starlifter']},
  {q:'MISC\'s dedicated cargo haulers run from the Hull A up to the Hull what?',a:['e','hull e']},
  // Space
  {q:'Which planet spins on its side, with its axis tilted about 98 degrees?',a:['uranus']},
  {q:'Which planet has a day that is longer than its year?',a:['venus']},
  {q:'Which planet has the shortest day in the Solar System?',a:['jupiter']},
  {q:'Which planet takes about 165 Earth years to go round the Sun?',a:['neptune']},
  {q:'What is the name of Neptune\'s largest moon?',a:['triton']},
  {q:'Name one of Mars\'s two moons.',a:['phobos','deimos']},
  {q:'Which moon of Jupiter is the most volcanically active body in the Solar System?',a:['io']},
  {q:'Which moon of Jupiter is named after a continent?',a:['europa']},
  {q:'Which moon of Saturn sprays water geysers from its south pole?',a:['enceladus']},
  {q:'What is the largest object in the asteroid belt?',a:['ceres']},
  {q:'What is the region of icy bodies beyond Neptune, where Pluto lives, called?',a:['kuiper belt','the kuiper belt','kuiper']},
  {q:'Which comet returns about every 76 years?',a:['halley','halleys','halleys comet','halley s comet','comet halley']},
  {q:'What is the unit of distance equal to about 3.26 light-years?',a:['parsec']},
  {q:'What is the boundary about 100 km up that is usually taken as the edge of space called?',a:['karman line','the karman line','karman']},
  {q:'What is the point in an orbit closest to Earth called?',a:['perigee']},
  {q:'What is the name of the supermassive black hole at the centre of the Milky Way?',a:['sagittarius a','sagittarius a star','sgr a','sgr a star']},
  {q:'What is the brightest star in the night sky?',a:['sirius']},
  {q:'Betelgeuse is the shoulder of which constellation?',a:['orion']},
  {q:'What element does the Sun fuse to make its energy?',a:['hydrogen']},
  {q:'What type of star is the Sun?',a:['yellow dwarf','g type','g2','g2v','main sequence','g type main sequence','yellow dwarf star']},
  {q:'About how many minutes does sunlight take to reach Earth?',a:['8','eight','8 minutes','eight minutes','8 min','about 8']},
  {q:'Which probe took the Pale Blue Dot photo of Earth in 1990?',a:['voyager 1','voyager','voyager one']},
  {q:'In which year were the two Voyager probes launched?',a:['1977']},
  {q:'Which NASA mission orbited Saturn for 13 years before diving into it in 2017?',a:['cassini','cassini huygens']},
  {q:'Which probe landed on Saturn\'s moon Titan in 2005?',a:['huygens']},
  {q:'What is the name of NASA\'s Mars helicopter that flew in 2021?',a:['ingenuity']},
  {q:'Which rover carried that helicopter to Mars?',a:['perseverance']},
  {q:'Which Apollo mission radioed "Houston, we\'ve had a problem"?',a:['apollo 13','13','thirteen','apollo thirteen']},
  {q:'How many people have walked on the Moon?',a:['12','twelve','12 people']},
  {q:'Which NASA program aims to return people to the Moon this decade?',a:['artemis']},
  {q:'Who was the first woman in space?',a:['valentina tereshkova','tereshkova']},
  {q:'What was the name of the first space station, launched in 1971?',a:['salyut 1','salyut']},
  {q:'What was the name of the Soviet space shuttle?',a:['buran']},
  {q:'In which country is the Baikonur Cosmodrome?',a:['kazakhstan']},
  {q:'What is the name of China\'s space station?',a:['tiangong']},
  {q:'Which SpaceX rocket was the first to land its booster back on the ground?',a:['falcon 9','falcon nine','falcon']},
  // General knowledge
  {q:'What is the chemical symbol for tungsten?',a:['w']},
  {q:'Which element has the chemical symbol Pb?',a:['lead']},
  {q:'What is the SI unit of force?',a:['newton','newtons','n']},
  {q:'What is the SI unit of electrical resistance?',a:['ohm','ohms']},
  {q:'What is absolute zero in degrees Celsius?',a:['273','273 15','minus 273','negative 273','273 c','273 degrees']},
  {q:'What is the most abundant gas in Earth\'s atmosphere?',a:['nitrogen','n2']},
  {q:'Which blood type is the universal donor?',a:['o negative','o neg','o','type o','o minus']},
  {q:'How many chambers does the human heart have?',a:['4','four','4 chambers','four chambers']},
  {q:'What is the largest organ of the human body?',a:['skin','the skin']},
  {q:'What is the only even prime number?',a:['2','two']},
  {q:'What is 2 to the power of 10?',a:['1024']},
  {q:'What is the square root of 169?',a:['13','thirteen']},
  {q:'What is binary 1010 in decimal?',a:['10','ten']},
  {q:'How many bits are in a byte?',a:['8','eight','8 bits','eight bits']},
  {q:'What does CPU stand for?',a:['central processing unit']},
  {q:'What does HTTP stand for?',a:['hypertext transfer protocol','hyper text transfer protocol']},
  {q:'What is the Linux mascot penguin called?',a:['tux']},
  {q:'Which company makes Ryzen processors?',a:['amd','advanced micro devices']},
  {q:'Epic Games makes which game engine?',a:['unreal','unreal engine']},
  {q:'In which year was the first iPhone released?',a:['2007']},
  {q:'Who co-founded Microsoft with Bill Gates?',a:['paul allen','allen']},
  {q:'Which country has the most time zones?',a:['france']},
  {q:'Which country has the most islands?',a:['sweden']},
  {q:'What is the largest island in the Mediterranean?',a:['sicily']},
  {q:'What is the smallest country in the world?',a:['vatican','vatican city','the vatican']},
  {q:'What is the largest hot desert in the world?',a:['sahara','the sahara','sahara desert']},
  {q:'What is the capital of Canada?',a:['ottawa']},
  {q:'What is the capital of New Zealand?',a:['wellington']},
  {q:'What is the currency of Switzerland?',a:['franc','swiss franc','chf','francs']},
  {q:'Who painted The Starry Night?',a:['van gogh','vincent van gogh','gogh']},
  {q:'Who wrote the novel 1984?',a:['orwell','george orwell']},
  {q:'In which year did the Berlin Wall fall?',a:['1989']},
  {q:'In which year did World War I begin?',a:['1914']},
  {q:'In which year did Australia become a federation?',a:['1901']},
  {q:'Who was Australia\'s first Prime Minister?',a:['edmund barton','barton']},
  {q:'What is the highest mountain in Australia?',a:['kosciuszko','mount kosciuszko','mt kosciuszko','kosciusko','mount kosciusko']},
  {q:'What is the longest river in Australia?',a:['murray','the murray','murray river']},
  {q:'Darwin is the capital of which Australian state or territory?',a:['northern territory','nt','the northern territory']}
];
// Earlier shipped starters, recognised so a new set can replace them without touching the streamer's own questions.
const PREVIOUS_STARTERS=[
  // 2.20.22
  'Which planet has the Great Red Spot?','What is the closest star to the Sun?','Which planet is known as the Red Planet?','What is the name of Saturn\'s largest moon?','Which large galaxy is the Milky Way\'s nearest neighbour?','What was the first artificial satellite put into orbit?','What chat command shows your Voyager membership card?','What do you type to board the fleet when the Dreadnought appears?','How many naval ranks are there in the Voyager fleet?','How many grades do most Voyager medals have?',
  // 2.20.94 (bank 2)
  'Which studio develops Star Citizen?','Who is the creator and director of Star Citizen?','In what year did Star Citizen first go up on Kickstarter?','What is the name of Star Citizen\'s single-player campaign?','Which star system was the first one playable in Star Citizen?','Which lawless star system connects to Stanton through a jump point?','What is the name of the human government in Star Citizen?','What does UEC stand for?','Which alien race is the UEE\'s main hostile enemy in Star Citizen?','Which Stanton planet has the landing zone Lorville?','Which Stanton planet has the landing zone New Babbage?','Which Stanton planet has the landing zone Area18?','Which Stanton planet is a gas giant with the floating city Orison?','Name one of Crusader\'s three moons.','Which outlaw station is hidden inside an asteroid orbiting Yela?','Which Stanton moon holds the Klescher prison?','Which manufacturer builds the Cutlass, the Caterpillar and the Vulture?','Which manufacturer builds the Carrack, the Arrow and the Hornet?','Which manufacturer builds the Gladius, the Avenger and the Idris?','Which manufacturer builds the 300 series and the 890 Jump?','Which manufacturer builds the Aurora and the Constellation?','Which manufacturer builds the Prospector, the Freelancer and the Starfarer?','What job is the Drake Vulture built for?','What job is the MISC Prospector built for?','What is the name of the faster-than-light travel mode used to cross a star system?','What is the annual Star Citizen fan convention called?','What does IAE stand for in Star Citizen?','Which noodle brand has vending machines all over Stanton?','What is the name of the in-game currency you earn in the live alpha, with its first letter?','Which company is Hurston\'s planet named after and run by?',
  'How many planets are in our Solar System?','Who was the first person to walk on the Moon?','In which year did humans first land on the Moon?','Who was the first human in space?','Which is the hottest planet in the Solar System?','Which is the smallest planet in the Solar System?','How many moons does Mars have?','What is the largest volcano in the Solar System, found on Mars?','What does ISS stand for?','Which space telescope launched in December 2021?','Roughly how fast does light travel, in kilometres per second?','What is the chemical symbol for gold?','What gas do plants absorb from the air?','What is the largest ocean on Earth?','What is the tallest mountain above sea level?','What is the capital city of Australia?','The Great Barrier Reef lies off which Australian state?','What is the largest animal that has ever lived?','What is the fastest land animal?','How many bones are in the adult human body?','How many continents are there?','At what temperature does water boil at sea level, in Celsius?','What is the hardest natural substance?','Who wrote Romeo and Juliet?','What is the currency of Japan?','Which country launched the first satellite into orbit?','How many sides does a hexagon have?'
];
const OLD_STARTERS=PREVIOUS_STARTERS.map(q=>({q}));
const TIERS=['blue','silver','gold','platinum'];
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const norm=v=>String(v??'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9! ]/g,' ').replace(/(?<=\S)!+/g,' ').replace(/\s+/g,' ').trim();
const int=(v,min,max,label)=>{const n=Number(v);if(!Number.isInteger(n)||n<min||n>max)throw new Error(label+' must be a whole number from '+min+' to '+max+'.');return n;};
const URL_RE=/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|gg|tv|ly|me|xyz)\b)/i;

export function normalizeEngageSettings(raw={},base=ENGAGE_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},s=structuredClone(base);
  for(const k of Object.keys(ENGAGE_DEFAULTS))if(r[k]?.enabled!==undefined)s[k].enabled=r[k].enabled===true;
  if(r.relay){for(const [k,min,max] of [['threshold',5,1000],['damagePct',1,20],['perUserSeconds',0,60]])if(r.relay[k]!==undefined)s.relay[k]=int(r.relay[k],min,max,'Comms Relay '+k);}
  if(r.report?.reward!==undefined)s.report.reward=int(r.report.reward,0,REPORT_MAX,'The !report reward');
  if(r.quiz){if(r.quiz.reward!==undefined)s.quiz.reward=int(r.quiz.reward,0,REWARD_MAX,'The quiz reward');if(r.quiz.seconds!==undefined)s.quiz.seconds=int(r.quiz.seconds,15,600,'Quiz time (seconds)');if(r.quiz.autoMinutes!==undefined)s.quiz.autoMinutes=int(r.quiz.autoMinutes,0,240,'Automatic quiz (minutes)');}
  if(r.squadrons){const q=r.squadrons;
    if(q.names)for(const k of SQUADRONS)if(q.names[k]!==undefined){const n=clean(q.names[k],24);if(!n)throw new Error('Every squadron needs a name.');s.squadrons.names[k]=n;}
    for(const [k,min,max] of [['chat',0,100],['chatCap',0,1000],['mission',0,1000],['damageDiv',1,1000],['versusWin',0,1000]])if(q[k]!==undefined)s.squadrons[k]=int(q[k],min,max,'Squadron '+k);}
  if(r.arrivals){if(r.arrivals.minTier!==undefined){if(!TIERS.includes(r.arrivals.minTier))throw new Error('Unknown tier.');s.arrivals.minTier=r.arrivals.minTier;}if(r.arrivals.ranks!==undefined)s.arrivals.ranks=r.arrivals.ranks===true;}
  if(r.log?.perStream!==undefined)s.log.perStream=int(r.log.perStream,1,20,'Log entries per viewer');
  return s;
}

export class Engage{
  constructor({dataDir,now=Date.now,say=()=>{},boss=()=>null,cards=()=>null,community=()=>null,pilots=()=>[],random=Math.random}={}){
    Object.assign(this,{dataDir,now,boss,cards,community,pilots,random});
    // 2.21.5: every chat line Voyager tries to post is remembered with whether Streamer.bot took it, so "!report did nothing"
    // can be answered from the Chat engagement page instead of guessed.
    this.chatOut=[];
    this.say=(text,platform='')=>{const row={at:this.now(),text:String(text).slice(0,160),platform:platform||'all',ok:null,message:'sending…'};this.chatOut=[row,...this.chatOut].slice(0,12);
      let r;try{r=say(text,platform);}catch(e){r={ok:false,message:e?.message||'failed'};}
      const done=x=>{if(x&&typeof x==='object'){row.ok=!!x.ok;row.message=x.message||'';}else{row.ok=x!==false;row.message=row.ok?'sent':'not sent';}return x;};
      return Promise.resolve(r).then(done).catch(e=>{row.ok=false;row.message=e?.message||'failed';return {ok:false,message:row.message};});};
    this.state=this.fresh();this.saving=Promise.resolve();this.savedAt=0;this.dirty=false;this.relayUsers=new Map();this.lastChatAt=0;this.pendingReports=[];this.reportSaidAt=0;this.seq=0;
  }
  fresh(){const now=this.now();return {schema:1,settings:structuredClone(ENGAGE_DEFAULTS),stream:{id:0,lastAt:0},relay:{count:0,crew:[],fired:0,battle:0},
    reports:{},muster:[],quiz:{bank:QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x})),bankVersion:QUIZ_BANK_VERSION,active:null,history:[],lastAutoAt:0},
    squadrons:{members:{},week:{id:weekStart(now),chat:{},damage:{},versusBase:{},versus:{}},history:[]},
    arrivals:{stream:0,seen:{},ranks:{}},log:[],rewards:[],toasts:[]};}
  async load(){try{const raw=JSON.parse(await readFile(join(this.dataDir,FILE),'utf8'));if(raw?.schema===1){const f=this.fresh();this.state={...f,...raw,quiz:{...f.quiz,...raw.quiz},squadrons:{...f.squadrons,...raw.squadrons},arrivals:{...f.arrivals,...raw.arrivals}};
    // Settings saved before 2.20.24 may pay !report more than the new cap: bring them down rather than resetting everything.
    if(raw.settings?.report&&Number(raw.settings.report.reward)>REPORT_MAX)raw.settings.report.reward=REPORT_MAX;
    try{this.state.settings=normalizeEngageSettings(raw.settings||{});}catch{this.state.settings=structuredClone(ENGAGE_DEFAULTS);}
    // 2.20.94: the Star Citizen & general knowledge set replaces the original ten starters (questions the streamer added are kept), and a correct answer pays 5 points unless the reward was changed by hand.
    if((Number(raw.quiz?.bankVersion)||1)<QUIZ_BANK_VERSION){const oldQ=new Set(OLD_STARTERS.map(x=>x.q)),starterQ=new Set(QUIZ_STARTERS.map(x=>x.q));const kept=(this.state.quiz.bank||[]).filter(x=>!oldQ.has(x.q)&&!starterQ.has(x.q));
      this.state.quiz.bank=[...QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x})),...kept];this.state.quiz.bankVersion=QUIZ_BANK_VERSION;if(this.state.settings.quiz.reward===25)this.state.settings.quiz.reward=5;this.persist(true);}
    // 2.21.4: the quiz pays 5 points a correct answer (asked for in 2.20.94); a saved 10 or 25 from before becomes 5 once.
    if(!this.state.quizReward5){if([10,25].includes(this.state.settings.quiz.reward))this.state.settings.quiz.reward=5;this.state.quizReward5=true;this.persist(true);}}}catch{}return this;}
  // Replace the bank with the shipped set (Voyager Control › Chat engagement).
  loadStarters(){this.state.quiz.bank=QUIZ_STARTERS.map(x=>({id:randomUUID().slice(0,8),...x}));this.state.quiz.bankVersion=QUIZ_BANK_VERSION;this.persist(true);return this.state.quiz.bank;}
  persist(force=false){if(!this.dataDir)return this.saving;if(!force&&this.now()-this.savedAt<15000){this.dirty=true;return this.saving;}
    this.savedAt=this.now();this.dirty=false;const data=JSON.stringify(this.state),tmp=join(this.dataDir,FILE+'.tmp');
    this.saving=this.saving.then(async()=>{await writeFile(tmp,data);await rename(tmp,join(this.dataDir,FILE));}).catch(()=>{});return this.saving;}
  toast(kind,data){this.state.toastSeq=(this.state.toastSeq||0)+1;const t={id:this.state.toastSeq,kind,at:this.now(),...data};this.state.toasts=[...this.state.toasts.filter(x=>this.now()-x.at<120000),t].slice(-30);return t;}
  key(chat){const p=String(chat.platform||'twitch').toLowerCase();if(!['twitch','youtube','kick'].includes(p))return '';const id=clean(chat.userId,128),login=clean(chat.login,60).toLowerCase();return id?p+':'+id:login?p+':@'+login:'';}
  // A "stream" here is a run of chat with no gap longer than 4 hours (or a Twitch StreamOnline).
  streamFor(now){const s=this.state.stream;if(!s.id||now-s.lastAt>SESSION_GAP){s.id=now;this.state.reports=this.state.reports||{};}s.lastAt=now;return s.id;}
  newStream(now=this.now()){const id=Math.max(now,(this.state.stream?.id||0)+1);this.state.stream={id,lastAt:now};this.pendingReports=[];this.persist(true);}

  // ---------- every chat message ----------
  chat(chat){
    const s=this.state.settings,now=this.now(),key=this.key(chat);if(!key)return null;
    const text=clean(chat.text,500),word=text.toLowerCase().split(' ')[0],name=clean(chat.name||chat.login,60)||'Crew',platform=key.split(':')[0];
    const stream=this.streamFor(now);this.lastChatAt=now;
    const who={key,name,platform,login:clean(chat.login,60).toLowerCase()};
    this.rollWeek(now);
    let out=null;
    if(word==='!report')out=this.report(who,stream);
    else if(word==='!squadron'||word==='!squad')out=this.squadron(who,text.split(' ')[1]||'');
    else if(word==='!log')out=this.logEntry(who,text.slice(word.length).trim(),stream);
    else if(word==='!quiz')out=this.quizStatus();
    // Not commands: the relay, the quiz answer, squadron chat points and the arrival card.
    if(!word.startsWith('!')){
      this.relay(who,now);
      if(this.state.quiz.active)this.answer(who,text);
      const m=this.state.squadrons.members[key];
      if(s.squadrons.enabled&&m){const c=this.state.squadrons.week.chat;const st=(c[key]||(c[key]={n:0,stream:0,streamN:0}));if(st.stream!==stream){st.stream=stream;st.streamN=0;}if(st.streamN<s.squadrons.chatCap){st.streamN++;st.n++;}}
    }
    this.arrival(who,stream);
    this.persist();return out;
  }

  // 1. Comms Relay
  relay(who,now){
    const s=this.state.settings.relay,b=this.boss();if(!s.enabled||!b?.battle||b.battle.phase!=='battle'||b.battle.demo)return;
    const r=this.state.relay;if(r.battle!==b.battle.id){r.battle=b.battle.id;r.count=0;r.crew=[];r.fired=0;}
    const last=this.relayUsers.get(who.key)||0;if(now-last<s.perUserSeconds*1000)return;this.relayUsers.set(who.key,now);
    r.count++;if(!r.crew.includes(who.key))r.crew.push(who.key);
    if(r.count>=s.threshold){const crew=r.crew.length;const dmg=b.relayStrike(s.damagePct,crew);r.count=0;r.crew=[];r.fired++;if(dmg)this.say('📡 COMMS RELAY at '+s.threshold+'! '+crew+' crew charged a fleet barrage: '+dmg.toLocaleString('en')+' damage. Keep chatting to charge the next one.');}
  }
  relayView(){const s=this.state.settings.relay,b=this.boss(),r=this.state.relay;const live=s.enabled&&b?.battle&&b.battle.phase==='battle'&&r.battle===b.battle.id;return {enabled:s.enabled,count:live?r.count:0,threshold:s.threshold,fired:live?r.fired:0};}

  // 2. Daily muster
  report(who,stream){
    const s=this.state.settings.report;if(!s.enabled)return null;
    const r=this.state.reports[who.key]||(this.state.reports[who.key]={last:0,streak:0,best:0,total:0});
    // 2.21.5: a second !report in the same stream gets one quiet answer instead of silence (viewers read silence as "broken").
    if(r.last===stream){if(r.told!==stream){r.told=stream;this.say('🫡 '+who.name+', you already reported for duty this stream'+(r.streak>1?' ('+r.streak+' in a row)':'')+'. Once a stream is all it takes.',who.platform);}return {ok:false,already:true};}
    // A streak counts streams in a row where they reported (the previous stream anyone reported in).
    const prev=this.state.muster.find(m=>m.stream!==stream)?.stream;r.streak=r.last&&r.last===prev?r.streak+1:1;
    r.last=stream;r.best=Math.max(r.best,r.streak);r.total++;
    let m=this.state.muster.find(x=>x.stream===stream);if(!m){m={stream,crew:[]};this.state.muster.unshift(m);this.state.muster=this.state.muster.slice(0,30);}
    m.crew.push({key:who.key,name:who.name,platform:who.platform,streak:r.streak});
    if(s.reward>0)this.addReward('muster-'+stream,'Daily muster',s.reward,'Muster',who);
    this.pendingReports.push({name:who.name,streak:r.streak,platform:who.platform});
    this.toast('report',{name:who.name,platform:who.platform,streak:r.streak,count:m.crew.length});
    return {ok:true,streak:r.streak};
  }
  // 3. Bridge Quiz
  ask(id){
    const s=this.state.settings.quiz,q=this.state.quiz;if(!s.enabled)throw new Error('Turn the Bridge Quiz on first.');if(q.active&&!q.active.winner&&this.now()<q.active.endsAt)throw new Error('A question is already running.');
    const bank=q.bank;if(!bank.length)throw new Error('Add a question first.');
    let pick=id?bank.find(x=>x.id===id):null;if(id&&!pick)throw new Error('Unknown question.');
    if(!pick){const asked=new Set(q.history.slice(0,Math.max(0,bank.length-1)).map(h=>h.qid));const fresh=bank.filter(x=>!asked.has(x.id));const pool=fresh.length?fresh:bank;pick=pool[Math.floor(this.random()*pool.length)];}
    const now=this.now();q.active={id:randomUUID().slice(0,8),qid:pick.id,q:pick.q,a:pick.a,reward:s.reward,startedAt:now,endsAt:now+s.seconds*1000,winner:null};
    this.say('🧠 BRIDGE QUIZ: '+pick.q+' · First correct answer in chat wins '+s.reward+' Voyager points ('+s.seconds+'s).');
    this.toast('quiz',{q:pick.q});this.persist(true);return q.active;
  }
  answer(who,text){
    const a=this.state.quiz.active,now=this.now();if(!a||a.winner||now>a.endsAt)return false;
    const said=norm(text);if(!a.a.some(x=>{const n=norm(x);return said===n||said===n.replace(/^!/,'')||(n.length>=4&&(' '+said+' ').includes(' '+n+' '));}))return false;
    a.winner={key:who.key,name:who.name,platform:who.platform,at:now};
    if(a.reward>0)this.addReward('quiz-'+a.id,'Bridge Quiz: '+a.q.slice(0,40),a.reward,'Bridge Quiz',who);
    this.state.quiz.history=[{id:a.id,qid:a.qid,q:a.q,answer:a.a[0],winner:a.winner,at:now},...this.state.quiz.history].slice(0,50);
    this.say('🧠 '+who.name+' got it! The answer was '+a.a[0]+'. +'+a.reward+' Voyager points.');
    this.toast('quizwin',{name:who.name,platform:who.platform,answer:a.a[0],q:a.q});this.persist(true);return true;
  }
  quizStatus(){const a=this.state.quiz.active;if(a&&!a.winner&&this.now()<a.endsAt)this.say('🧠 BRIDGE QUIZ: '+a.q+' · '+Math.ceil((a.endsAt-this.now())/1000)+'s left.');return null;}
  cancelQuiz(){const a=this.state.quiz.active;if(!a)throw new Error('No question is running.');this.state.quiz.active=null;this.persist(true);return true;}
  setBank(list){
    if(!Array.isArray(list)||list.length>200)throw new Error('Up to 200 questions.');
    this.state.quiz.bank=list.map(x=>{const q=clean(x?.q,160);const a=(Array.isArray(x?.a)?x.a:String(x?.a||'').split('|')).map(v=>clean(v,60)).filter(Boolean).slice(0,6);
      if(!q||!a.length)throw new Error('Every question needs the question and at least one answer.');return {id:/^[a-z0-9-]{1,12}$/.test(x?.id||'')?x.id:randomUUID().slice(0,8),q,a};});
    this.persist(true);return this.state.quiz.bank;
  }
  // 4. Squadrons
  squadron(who,pick){
    const s=this.state.settings.squadrons,sq=this.state.squadrons;if(!s.enabled)return null;
    const want=norm(pick).replace(/ wing$/,''),names=s.names,id=SQUADRONS.find(k=>k===want||norm(names[k])===norm(pick)||norm(names[k]).split(' ')[0]===want);
    const m=sq.members[who.key];
    if(!id){this.say('@'+who.name+' '+(m?'you fly with '+names[m.sq]+'. ':'')+'Enlist with !squadron '+SQUADRONS.join(' | ')+' ('+SQUADRONS.map(k=>names[k]).join(', ')+').',who.platform);return {ok:false};}
    if(m?.sq===id){this.say('@'+who.name+' you already fly with '+names[id]+'.',who.platform);return {ok:false};}
    if(m&&this.now()-m.joinedAt<30*DAY){this.say('@'+who.name+' you can change squadron once every 30 days (next on '+new Date(m.joinedAt+30*DAY).toLocaleDateString('en-AU',{day:'numeric',month:'short'})+').',who.platform);return {ok:false};}
    sq.members[who.key]={sq:id,name:who.name,platform:who.platform,login:who.login,joinedAt:this.now()};
    // Contributions start from now: past chat, damage and wins this week stay with the old squadron (or nobody).
    delete sq.week.chat[who.key];delete sq.week.damage[who.key];delete sq.week.versus[who.key];
    this.say('@'+who.name+' welcome to '+names[id]+'! Chat, missions, Dreadnought damage and Versus wins now score for your squadron.',who.platform);
    this.toast('enlist',{name:who.name,platform:who.platform,sq:id,sqName:names[id]});this.persist(true);return {ok:true,sq:id};
  }
  rollWeek(now){
    const sq=this.state.squadrons,w=weekStart(now);if(sq.week.id===w)return;
    const st=this.standings();if(st.some(x=>x.score>0))sq.history=[{week:sq.week.id,scores:Object.fromEntries(st.map(x=>[x.id,x.score])),winner:st[0].id},...sq.history].slice(0,26);
    sq.week={id:w,chat:{},damage:{},versusBase:{},versus:{}};this.persist(true);
  }
  observeBoss(r){if(!r||!Array.isArray(r.pilots))return;const d=this.state.squadrons.week.damage;for(const p of r.pilots){if(this.state.squadrons.members[p.key]&&p.damage>0)d[p.key]=(d[p.key]||0)+Math.round(p.damage);}this.persist();}
  observePilots(){
    const sq=this.state.squadrons,w=sq.week;let list=[];try{list=this.pilots()||[];}catch{}
    const byLogin=new Map(list.filter(p=>p&&p.login).map(p=>[String(p.login).toLowerCase(),Number(p.wins)||0]));
    for(const [key,m] of Object.entries(sq.members)){if(m.platform!=='twitch'||!m.login||!byLogin.has(m.login))continue;const wins=byLogin.get(m.login);
      if(w.versusBase[key]===undefined){w.versusBase[key]=wins;continue;}w.versus[key]=Math.max(0,wins-w.versusBase[key]);}
  }
  missionCount(){const out={};let list=[];try{list=this.community()?.completions()||[];}catch{}for(const c of list)if(c.key)out[c.key]=(out[c.key]||0)+1;return out;}
  contribution(key,missions){const s=this.state.settings.squadrons,w=this.state.squadrons.week;
    return (w.chat[key]?.n||0)*s.chat+(missions[key]||0)*s.mission+Math.floor((w.damage[key]||0)/s.damageDiv)+(w.versus[key]||0)*s.versusWin;}
  standings(){
    const s=this.state.settings.squadrons,sq=this.state.squadrons,missions=this.missionCount(),out=Object.fromEntries(SQUADRONS.map(k=>[k,{id:k,name:s.names[k],score:0,crew:0,top:[]}]));
    for(const [key,m] of Object.entries(sq.members)){const t=out[m.sq];if(!t)continue;t.crew++;const c=this.contribution(key,missions);t.score+=c;if(c>0)t.top.push({name:m.name,platform:m.platform,score:c});}
    for(const t of Object.values(out))t.top=t.top.sort((a,b)=>b.score-a.score).slice(0,5);
    return Object.values(out).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  }
  // 5. Arrival cards
  arrival(who,stream){
    const s=this.state.settings.arrivals,a=this.state.arrivals;if(!s.enabled)return;
    if(a.stream!==stream){a.stream=stream;a.seen={};}
    if(a.seen[who.key])return;a.seen[who.key]=1;
    const cards=this.cards(),cm=this.community()?.state?.members?.[who.key];if(!cards||!cm)return;
    const tier=cm.tier||cards.state?.members?.[who.key]?.tier||'blue';
    const {place}=cards.board(),lifetime=Math.max(Number(cm.value)||0,Number(cm.balance)||0),rank=cards.rankOf(lifetime,place.get(who.key));
    const before=a.ranks[who.key];a.ranks[who.key]=rank;
    const promoted=s.ranks&&before!==undefined&&rank>before;
    if(TIERS.indexOf(tier)<TIERS.indexOf(s.minTier)&&!promoted)return;
    const RANK_NAMES=['Midshipman','Acting Sub-Lieutenant','Sub-Lieutenant','Lieutenant','Lieutenant Commander','Commander','Captain','Commodore','Rear Admiral','Vice Admiral','Admiral','Admiral of the Fleet'];
    this.toast('arrival',{name:who.name,platform:who.platform,tier,rank,rankName:cards.state?.settings?.ranks===false?'':RANK_NAMES[rank]||'',promoted});
  }
  // 6. Captain's Log
  logEntry(who,text,stream){
    const s=this.state.settings.log;if(!s.enabled)return null;
    const t=clean(text,140);if(t.length<3){this.say('@'+who.name+' add your moment after !log, e.g. !log that torpedo was massive',who.platform);return {ok:false};}
    if(URL_RE.test(t))return {ok:false,link:true};
    const mine=this.state.log.filter(e=>e.stream===stream&&e.key===who.key);if(mine.length>=s.perStream)return {ok:false,limit:true};
    if(mine.some(e=>this.now()-e.at<60000))return {ok:false,cooldown:true};
    const e={id:randomUUID().slice(0,8),stream,key:who.key,name:who.name,platform:who.platform,text:t,at:this.now(),pinned:false,hidden:false};
    this.state.log=[e,...this.state.log].slice(0,500);this.toast('log',{name:who.name,platform:who.platform,text:t});return {ok:true,id:e.id};
  }
  moderateLog(id,{pinned,hidden}){const e=this.state.log.find(x=>x.id===id);if(!e)throw new Error('Log entry not found.');if(pinned!==undefined)e.pinned=pinned===true;if(hidden!==undefined)e.hidden=hidden===true;if(e.hidden)e.pinned=false;this.persist(true);return e;}

  // ---------- rewards (paid from Missions › Points owed) ----------
  addReward(id,title,reward,label,who){
    let b=this.state.rewards.find(x=>x.id===id);if(!b){b={id,title,reward,label,at:this.now(),pilots:[]};this.state.rewards.unshift(b);this.state.rewards=this.state.rewards.slice(0,60);}
    if(!b.pilots.some(p=>p.key===who.key))b.pilots.push({key:who.key,name:who.name,platform:who.platform});
  }
  rewardBatches(){return this.state.rewards.map(b=>({stamp:b.at,missionId:b.id.slice(0,32),title:b.title,reward:b.reward,label:b.label,pilots:b.pilots}));}

  // ---------- once a second ----------
  tick(){
    const now=this.now(),s=this.state.settings;
    const a=this.state.quiz.active;if(a&&!a.winner&&now>a.endsAt&&!a.closed){a.closed=true;this.say('🧠 Time! Nobody got it. The answer was '+a.a[0]+'.');this.state.quiz.history=[{id:a.id,qid:a.qid,q:a.q,answer:a.a[0],winner:null,at:now},...this.state.quiz.history].slice(0,50);this.toast('quizend',{answer:a.a[0],q:a.q});this.persist(true);}
    if(s.quiz.enabled&&s.quiz.autoMinutes>0&&now-this.lastChatAt<10*60000&&now-(this.state.quiz.lastAutoAt||0)>=s.quiz.autoMinutes*60000&&(!a||a.winner||now>a.endsAt)){this.state.quiz.lastAutoAt=now;try{this.ask();}catch{}}
    // The muster line goes to the platform the reports came from: Kick reports are announced on Kick only (2.20.25).
    if(this.pendingReports.length&&now-this.reportSaidAt>5000){const list=this.pendingReports.splice(0,25);this.reportSaidAt=now;const r=s.report.reward;
      for(const platform of [...new Set(list.map(x=>x.platform))]){const mine=list.filter(x=>x.platform===platform);
        this.say('🫡 Reporting for duty: '+mine.map(x=>x.name+(x.streak>1?' ('+x.streak+' in a row)':'')).join(', ')+(r?' · +'+r+' Voyager points each':'')+'. Type !report once a stream.',platform);}}
    if(this.dirty&&now-this.savedAt>=15000)this.persist(true);
  }

  // ---------- views ----------
  overlay({always=false}={}){ // always: the Dreadnought stage's squadron slot shows the standings whether or not the timed panel is on
    // 2.21.6: once someone has the answer the question is finished — it shows the winner for 10 s and leaves, however long the clock had left.
    const now=this.now(),a=this.state.quiz.active,showQuiz=a&&(a.winner?now-a.winner.at<10000:now<a.endsAt+8000);
    return {serverAt:now,toasts:this.state.toasts.filter(t=>now-t.at<60000),quiz:showQuiz?{id:a.id,q:a.q,endsAt:a.endsAt,duration:a.endsAt-a.startedAt,reward:a.reward,winner:a.winner?{name:a.winner.name,platform:a.winner.platform}:null,answer:a.winner||now>a.endsAt?a.a[0]:''}:null,
      squadrons:always||(this.state.panel&&!(this.state.panel.until&&now>this.state.panel.until))?{visible:true,until:this.state.panel?.until||0,standings:this.standings().map(({top,...x})=>({...x,top:top.slice(0,3)}))}:null};
  }
  showPanel(seconds){this.state.panel=seconds>0?{until:this.now()+seconds*1000}:null;if(this.state.panel&&seconds>=3600)this.state.panel.until=0;this.persist(true);return this.state.panel;}
  view(){
    const st=this.state;if(st.panel?.until&&this.now()>st.panel.until)st.panel=null;
    const stream=st.stream.id,muster=st.muster.find(m=>m.stream===stream);
    return {settings:st.settings,defaults:ENGAGE_DEFAULTS,stream:{id:stream,lastAt:st.stream.lastAt},relay:this.relayView(),chatOut:this.chatOut,
      muster:{count:muster?.crew.length||0,crew:(muster?.crew||[]).slice(-40).reverse()},
      quiz:{bank:st.quiz.bank,active:st.quiz.active,history:st.quiz.history.slice(0,15)},
      squadrons:{standings:this.standings(),members:Object.keys(st.squadrons.members).length,history:st.squadrons.history.slice(0,8),weekId:st.squadrons.week.id,panel:!!st.panel&&!(st.panel.until&&this.now()>st.panel.until),panelUntil:st.panel?.until||0},
      log:st.log.filter(e=>!e.hidden).slice(0,80),rewards:st.rewards.slice(0,12).map(b=>({title:b.title,label:b.label,reward:b.reward,count:b.pilots.length,at:b.at}))};
  }
  configure(raw){this.state.settings=normalizeEngageSettings({...this.state.settings,...raw},this.state.settings);this.persist(true);return this.view();}
  // Public site: squadron standings and the Captain's Log pinned from the latest stream that has any.
  publicView(){
    const pinned=this.state.log.filter(e=>e.pinned&&!e.hidden),stream=pinned[0]?.stream||0;
    return {squadrons:this.state.settings.squadrons.enabled?{standings:this.standings(),history:this.state.squadrons.history.slice(0,6).map(h=>({week:h.week,winner:h.winner,scores:h.scores})),weekEndsAt:this.state.squadrons.week.id+7*DAY}:null,
      log:this.state.settings.log.enabled&&stream?{stream,entries:pinned.filter(e=>e.stream===stream).slice(0,12).map(e=>({name:e.name,platform:e.platform,text:e.text,at:e.at}))}:null};
  }
}
