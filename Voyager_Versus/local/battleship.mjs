/* Voyager Battleship (2.40.0): the classic guessing game, crew against a hidden enemy fleet. Only the streamer can start it.
   An enemy fleet is hidden on a grid (columns A, B, C…, rows 1, 2, 3…). Chat calls shots; a hit, a miss or a sinking shows on
   the board. Sink every ship before the clock runs out. Three ways to help, the same shape as the Dreadnought:
     FREE       !fire B5 (or just "B5")   one shot per player every 6 seconds
     CHEERS     bits / Super Chats        a sonar ping marks hidden ship squares as CONTACTS (someone still has to shoot them)
     GIFT SUBS  each gifted sub           an air strike on a random unshot square
   Victory: every player who fired at least one shot gets the same number of tickets for the active ticketed giveaway
   (onTickets), and the MVP a few more. Cheers and gifts help the whole crew but never earn the payer tickets by themselves:
   only a shot puts someone on the ticket list, an air strike never lands the final hit, and by default the MVP is the player
   with the most hits from their own shots (setting mvpFreeOnly). The grid grows with the crew: 6×6, 8×8 or 10×10. */
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';

export const WORDS=['!fire','!shot','!shoot'];
export const BATTLESHIP_DEFAULTS={enabled:true,announce:true,practice:false,mvpFreeOnly:true,lobbySeconds:30,battleSeconds:240,cooldownSeconds:120,tickets:5,mvpTickets:2};
export const RULES={pace:6000,bitsMin:100,bitsPer:100,sonarCap:3,strikeCap:5,result:25000};
// The board is chosen when the battle starts, from how many players signed on in the lobby.
export const FLEETS=[
  {upTo:3,size:6,ships:[['Frigate',3],['Corvette',2],['Scout',2]]},
  {upTo:11,size:8,ships:[['Cruiser',4],['Frigate',3],['Corvette',3],['Scout',2]]},
  {upTo:Infinity,size:10,ships:[['Flagship',5],['Cruiser',4],['Frigate',3],['Corvette',3],['Scout',2]]}];
const LIMITS={lobbySeconds:[10,120],battleSeconds:[60,600],cooldownSeconds:[0,3600],tickets:[0,100],mvpTickets:[0,100]};
const LABELS={lobbySeconds:'Seconds to join before the battle',battleSeconds:'Battle seconds',cooldownSeconds:'Cooldown between battles',tickets:'Tickets for each player',mvpTickets:'Extra tickets for the MVP'};
const PLATFORMS=['twitch','youtube','kick'],LETTERS='ABCDEFGHIJ';
const clean=(v,max)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);

export function normalizeBattleshipSettings(raw={},base=BATTLESHIP_DEFAULTS){
  const r=raw&&typeof raw==='object'?raw:{},out={};
  for(const k of ['enabled','announce','practice','mvpFreeOnly'])out[k]=r[k]===undefined?!!base[k]:!!r[k];
  for(const [k,[min,max]] of Object.entries(LIMITS)){const n=Number(r[k]===undefined?base[k]:r[k]);if(!Number.isInteger(n)||n<min||n>max)throw new Error(LABELS[k]+' must be '+min+' to '+max+'.');out[k]=n;}
  return out;
}
// "!fire b5", "!fire B 5", "b5", "5b" → {col,row} (0-based) or null. The command word is optional so chat can simply call squares.
export function parseShot(text,size=10){
  let t=clean(text,40).toLowerCase();const word=t.split(' ')[0],cmd=WORDS.includes(word);if(cmd)t=t.slice(word.length).trim();
  let col=-1,row=-1;const a=/^([a-j])\s*-?\s*(10|[1-9])$/.exec(t),b=/^(10|[1-9])\s*-?\s*([a-j])$/.exec(t);
  if(a){col=a[1].charCodeAt(0)-97;row=Number(a[2])-1;}else if(b){col=b[2].charCodeAt(0)-97;row=Number(b[1])-1;}
  if(col<0)return {cmd,cell:null};if(col>=size||row>=size)return {cmd,cell:null,outside:true};
  return {cmd,cell:{col,row,index:row*size+col,label:LETTERS[col]+(row+1)}};
}
export const label=(index,size)=>LETTERS[index%size]+(Math.floor(index/size)+1);
// Lay the fleet out at random: straight ships, horizontal or vertical, no overlaps (ships may touch).
export function placeFleet(size,ships,random=Math.random){
  const at=new Map(),out=[];
  const cellsOf=(horiz,r,c,len)=>Array.from({length:len},(_,k)=>(r+(horiz?0:k))*size+c+(horiz?k:0)),free=cells=>!cells.some(x=>at.has(x));
  ships.forEach(([name,len],i)=>{let cells=null;
    for(let tries=0;tries<200&&!cells;tries++){const horiz=random()<.5,c=Math.floor(random()*(horiz?size-len+1:size)),r=Math.floor(random()*(horiz?size:size-len+1)),t=cellsOf(horiz,r,c,len);if(free(t))cells=t;}
    // Unlucky draws (or a fixed "random" in tests): take the first place that fits.
    for(const horiz of [true,false])for(let r=0;r<(horiz?size:size-len+1)&&!cells;r++)for(let c=0;c<(horiz?size-len+1:size)&&!cells;c++){const t=cellsOf(horiz,r,c,len);if(free(t))cells=t;}
    if(!cells)throw new Error('Could not place the fleet.');for(const x of cells)at.set(x,i);out.push({name,len,cells,hits:0,sunkBy:''});});
  return {ships:out,at};
}

export class Battleship{
  // say(text): chat. key(chat): the viewer's key. onTickets({id,reason,grants}): giveaway tickets. onResult(result): medals.
  constructor({dataDir,say=()=>{},key=c=>(c?.platform||'twitch')+':'+String(c?.userId||c?.login||'').toLowerCase(),onTickets=()=>{},onResult=()=>{},now=Date.now,random=Math.random}={}){
    this.dataDir=dataDir;this.file=join(dataDir,'battleship.json');this.say=say;this.key=key;this.onTickets=onTickets;this.onResult=onResult;this.now=now;this.random=random;
    this.settings=normalizeBattleshipSettings({});this.stats={battles:0,won:0,lost:0,players:0,shots:0};this.history=[];this.game=null;this.lastEndedAt=0;this.receipts=new Map();this.seq=0;
  }
  async load(){try{const raw=JSON.parse(await readFile(this.file,'utf8'));this.settings=normalizeBattleshipSettings(raw.settings||{});this.stats={...this.stats,...(raw.stats||{})};this.history=Array.isArray(raw.history)?raw.history.slice(0,20):[];}catch{}return this;}
  async persist(){try{await mkdir(this.dataDir,{recursive:true});const tmp=this.file+'.tmp';await writeFile(tmp,JSON.stringify({schema:1,settings:this.settings,stats:this.stats,history:this.history},null,1));await rename(tmp,this.file);}catch{}}
  // Switching the game off also calls off a battle that is under way (nothing is paid).
  configure(raw={}){this.settings=normalizeBattleshipSettings({...this.settings,...raw});if(!this.settings.enabled&&this.game)this.stop();void this.persist();return this.view();}
  cooldownLeft(now=this.now()){return Math.max(0,this.lastEndedAt+this.settings.cooldownSeconds*1000-now);}
  active(){return !!this.game&&this.game.phase!=='result';}
  start({practice=false}={}){
    const s=this.settings,now=this.now();
    if(!s.enabled)throw new Error('Turn Battleship on first.');if(this.game)throw new Error('A battle is already under way.');
    const left=this.cooldownLeft(now);if(left>0)throw new Error('Cooling down: '+Math.ceil(left/1000)+' seconds until the next battle.');
    this.game={id:randomUUID().slice(0,8),practice:!!(practice||s.practice),startedAt:now,phase:'lobby',phaseAt:now,phaseEndsAt:now+s.lobbySeconds*1000,size:0,ships:[],at:new Map(),grid:[],contacts:new Set(),
      players:new Map(),events:[],told:false,result:null};
    if(s.announce)this.say('🚢 BATTLESHIP: an enemy fleet is hiding on the grid. Type !fire in the next '+s.lobbySeconds+' seconds to join the gun crew.'+(this.game.practice?' (Practice battle: no tickets.)':''));
    return this.view();
  }
  stop(){if(!this.game)return this.view();this.game=null;this.lastEndedAt=0;if(this.settings.announce)this.say('🚢 Battleship called off.');return this.view();}
  player(key,name,login,platform){const g=this.game;let m=g.players.get(key);
    if(!m){if(g.players.size>=2000)return null;m={key,name:clean(name||login,60)||'Gunner',login:clean(login,60).toLowerCase(),platform,shots:0,hits:0,sinks:0,strikeHits:0,bits:0,gifts:0,last:0,joinedAt:this.now(),n:g.players.size,first:null};g.players.set(key,m);
      this.note('join',m.name,'');}return m;}
  note(kind,name,cell,extra=''){const g=this.game;g.events.push({seq:++this.seq,kind,name,cell,extra,at:this.now()});if(g.events.length>30)g.events.shift();}
  remaining(){return this.game.ships.reduce((a,s)=>a+s.len-s.hits,0);}
  // Mark one square as shot. Returns 'miss' | 'hit' | 'sunk'.
  strike(index,who){const g=this.game,i=g.at.get(index);g.contacts.delete(index);if(i===undefined){g.grid[index]=1;return 'miss';}
    g.grid[index]=2;const ship=g.ships[i];ship.hits++;if(ship.hits>=ship.len){ship.sunkBy=who;return 'sunk';}return 'hit';}
  chat(chat){
    const g=this.game;if(!g||g.phase==='result')return null;const shot=parseShot(chat?.text,g.size||10);if(!shot.cmd&&!shot.cell&&!shot.outside)return null;
    if(g.phase==='lobby'&&!shot.cmd&&!shot.cell)return null;
    const key=this.key(chat);if(!key)return null;const now=this.now(),m=this.player(key,chat.name,chat.login,String(key).split(':')[0]);if(!m)return null;
    if(g.phase==='lobby')return {ok:true,joined:true,counted:false};
    if(!shot.cell)return {ok:true,counted:false,help:true};
    if(g.grid[shot.cell.index])return {ok:true,counted:false,repeat:true}; // already shot: costs nothing, pick another square
    if(now-m.last<RULES.pace)return {ok:true,counted:false,wait:RULES.pace-(now-m.last)};
    m.last=now;m.shots++;const res=this.strike(shot.cell.index,m.name);if(m.first===null)m.first=res!=='miss';
    if(res!=='miss')m.hits++;if(res==='sunk'){m.sinks++;this.note('sunk',m.name,shot.cell.label,g.ships[g.at.get(shot.cell.index)].name);}else this.note(res,m.name,shot.cell.label);
    if(!this.remaining()){this.finish(true,now);return {ok:true,counted:true,result:res,won:true};}
    return {ok:true,counted:true,result:res,cell:shot.cell.label};
  }
  pick(list){return list[Math.min(list.length-1,Math.floor(this.random()*list.length))];}
  // Cheers and gifted subs (the same event the Dreadnought reads): {kind:'bits'|'gift', platform, userId, login, name, amount, receipts?}.
  support(ev){
    const g=this.game;if(!g||g.phase!=='battle'||!ev||typeof ev!=='object')return {ok:false,ignored:true};
    const kind=ev.kind,platform=String(ev.platform||'').toLowerCase();if(!PLATFORMS.includes(platform)||(kind!=='bits'&&kind!=='gift'))return {ok:false,ignored:true};
    let amount=Math.floor(Number(ev.amount));if(!Number.isFinite(amount)||amount<=0)return {ok:false,ignored:true};
    const userId=clean(ev.userId,128),name=clean(ev.name||ev.login,60)||'Anonymous';if(!userId)return {ok:false,ignored:true};
    if(kind==='gift'&&Array.isArray(ev.receipts)&&ev.receipts.length){ // Kick can report the same gifts twice: count each recipient once
      const fresh=ev.receipts.map(r=>clean(r,200)).filter(r=>r&&!this.receipts.has(r));for(const r of fresh)this.receipts.set(r,this.now());
      while(this.receipts.size>5000)this.receipts.delete(this.receipts.keys().next().value);amount=fresh.length;if(!amount)return {ok:false,ignored:true};}
    if(kind==='bits'&&amount<RULES.bitsMin)return {ok:false,ignored:true};
    const m=this.player(this.key({platform,userId,login:ev.login})||platform+':'+userId,name,ev.login,platform);if(!m)return {ok:false,ignored:true};
    if(kind==='bits'){ // sonar: mark hidden ship squares as contacts
      m.bits+=amount;const want=Math.min(RULES.sonarCap,Math.floor(amount/RULES.bitsPer)),found=[];
      for(let i=0;i<want;i++){const open=[...g.at.keys()].filter(x=>!g.grid[x]&&!g.contacts.has(x));if(!open.length)break;const x=this.pick(open);g.contacts.add(x);found.push(label(x,g.size));}
      this.note('sonar',m.name,found.join(' '),String(amount));return {ok:true,contacts:found};}
    m.gifts+=amount;const n=Math.min(RULES.strikeCap,amount),cells=[];
    for(let i=0;i<n;i++){ // an air strike never lands the final hit: the last ship square is left for a shot from chat
      const last=this.remaining()===1,open=g.grid.map((v,x)=>v?-1:x).filter(x=>x>=0&&!(last&&g.at.has(x)));if(!open.length)break;
      const x=this.pick(open),res=this.strike(x,m.name);if(res!=='miss')m.strikeHits++;cells.push({cell:label(x,g.size),result:res});
      if(res==='sunk')this.note('sunk',m.name,label(x,g.size),g.ships[g.at.get(x)].name);}
    this.note('strike',m.name,cells.map(c=>c.cell).join(' '),String(amount));return {ok:true,strikes:cells};
  }
  // Called every 100 ms or so by the host.
  tick(){
    const g=this.game,now=this.now();if(!g)return null;const s=this.settings,tell=t=>{if(s.announce)this.say(t);};
    if(g.phase==='lobby'){if(now<g.phaseEndsAt)return null;
      const fleet=FLEETS.find(f=>g.players.size<=f.upTo),laid=placeFleet(fleet.size,fleet.ships,this.random);g.size=fleet.size;g.ships=laid.ships;g.at=laid.at;g.grid=new Array(fleet.size*fleet.size).fill(0);
      g.phase='battle';g.phaseAt=now;g.phaseEndsAt=now+s.battleSeconds*1000;const m=Math.floor(s.battleSeconds/60),sec=s.battleSeconds%60,last=LETTERS[fleet.size-1]+fleet.size;
      tell('🚢 OPEN FIRE! '+g.ships.length+' enemy ships are hidden on the '+fleet.size+'×'+fleet.size+' grid (A1 to '+last+'). Call a square: !fire B5 (one shot every '+RULES.pace/1000+' seconds). Sink them all in '+m+':'+String(sec).padStart(2,'0')+'. Cheers ping the sonar; gifted subs call an air strike.');return 'battle';}
    if(g.phase==='battle'){
      if(!g.told&&g.phaseEndsAt-now<=60000&&s.battleSeconds>90){g.told=true;const left=g.ships.filter(x=>x.hits<x.len).length;tell('🚢 One minute left: '+left+' enemy ship'+(left===1?'':'s')+' still afloat. Keep calling squares with !fire.');}
      if(now>=g.phaseEndsAt)return this.finish(false,now);return null;}
    if(g.phase==='result'&&now>=g.phaseEndsAt){this.game=null;this.lastEndedAt=now;return 'done';}
    return null;
  }
  score(m){return m.hits+(this.settings.mvpFreeOnly?0:m.strikeHits);}
  // The MVP: the most hits from their own shots (or, with mvpFreeOnly off, air-strike hits too). Then most ships sunk, then first aboard.
  mvp(){const rows=[...this.game.players.values()].filter(m=>m.shots>0&&this.score(m)>0).sort((a,b)=>this.score(b)-this.score(a)||b.sinks-a.sinks||a.joinedAt-b.joinedAt||a.n-b.n);return rows[0]||null;}
  finish(win,now=this.now()){
    const g=this.game,s=this.settings,all=[...g.players.values()],crew=all.filter(m=>m.shots>0),top=this.mvp();
    const outcome=win?'victory':all.length?'defeat':'empty',each=g.practice||!win?0:s.tickets,extra=g.practice||!win?0:s.mvpTickets,shots=crew.reduce((a,m)=>a+m.shots,0),hits=crew.reduce((a,m)=>a+m.hits,0);
    g.result={outcome,players:crew.length,shots,hits,accuracy:shots?Math.round(100*hits/shots):0,sunk:g.ships.filter(x=>x.hits>=x.len).length,ships:g.ships.length,bits:all.reduce((a,m)=>a+m.bits,0),gifts:all.reduce((a,m)=>a+m.gifts,0),
      secondsLeft:Math.max(0,Math.round((g.phaseEndsAt-now)/1000)),tickets:each,mvpTickets:extra,practice:g.practice,mvp:top?{name:top.name,platform:top.platform,hits:top.hits,sinks:top.sinks}:null};
    g.phase='result';g.phaseAt=now;g.phaseEndsAt=now+RULES.result;
    if(!g.practice){
      const st=this.stats;st.battles++;st[win?'won':'lost']++;st.players+=crew.length;st.shots+=shots;
      this.history.unshift({id:g.id,at:now,size:g.size,...g.result});this.history=this.history.slice(0,20);void this.persist();
      if(win&&crew.length&&(each>0||extra>0))try{this.onTickets({id:'battleship-'+g.id,reason:'Battleship: enemy fleet sunk',
        grants:crew.map(m=>({key:m.key,name:m.name,login:m.login,tickets:each+(top&&m.key===top.key?extra:0)})).filter(x=>x.tickets>0)});}catch{}
      try{this.onResult({id:g.id,...g.result,crewList:crew.map(m=>({key:m.key,name:m.name,platform:m.platform,shots:m.shots,hits:m.hits,sinks:m.sinks,firstHit:m.first===true,mvp:!!top&&m.key===top.key}))});}catch{}
    }
    if(s.announce)this.say(win?'🚢 ENEMY FLEET SUNK! '+(top?'MVP: '+top.name+' ('+top.hits+' hit'+(top.hits===1?'':'s')+').':'')+
        (g.practice?' Practice battle, no tickets.':each>0?' Every player who fired ('+crew.length+') earns '+each+' giveaway ticket'+(each===1?'':'s')+(extra>0&&top?', and the MVP '+extra+' more.':'.'):'')
      :outcome==='empty'?'🚢 Nobody manned the guns this time.':'🚢 Time is up: '+g.result.sunk+' of '+g.result.ships+' enemy ships sunk. The rest slipped away. No tickets this time.');
    return 'result';
  }
  leaders(limit=5){return [...this.game.players.values()].map(m=>({name:m.name,platform:m.platform,hits:m.hits,shots:m.shots,sinks:m.sinks,score:this.score(m),joinedAt:m.joinedAt,n:m.n}))
    .sort((a,b)=>b.score-a.score||b.sinks-a.sinks||b.shots-a.shots||a.joinedAt-b.joinedAt||a.n-b.n).slice(0,limit).map(({joinedAt,n,...r})=>r);}
  // What the overlay draws. Ship positions are only sent for ships that are sunk, and for the whole fleet once the battle is over.
  overlay(){
    const g=this.game,now=this.now();if(!g||!this.settings.enabled)return {serverAt:now,battle:null};const s=this.settings,over=g.phase==='result',total=g.ships.reduce((a,x)=>a+x.len,0);
    const sunkCells=new Set(g.ships.filter(x=>x.hits>=x.len).flatMap(x=>x.cells));
    return {serverAt:now,battle:{id:g.id,practice:g.practice,phase:g.phase,phaseAt:g.phaseAt,phaseEndsAt:g.phaseEndsAt,size:g.size,
      cells:g.grid.map((v,i)=>v===2?(sunkCells.has(i)?'s':'x'):v===1?'o':g.contacts.has(i)?'c':'.').join(''),
      ships:g.ships.map(x=>{const sunk=x.hits>=x.len;return {name:x.name,len:x.len,sunk,sunkBy:sunk?x.sunkBy:'',...(sunk||over?{cells:x.cells}:{})};}),
      players:g.players.size,hitCells:total-this.remaining(),totalCells:total,pace:RULES.pace,leaders:g.players.size?this.leaders(5):[],events:g.events.slice(-18),result:g.result,tickets:s.tickets,mvpTickets:s.mvpTickets}};
  }
  // For the public website: that a battle is on, how it is going, and the outcome. No ship positions.
  share(){const g=this.game;if(!g||!this.settings.enabled)return null;const r=g.result;
    return {phase:g.phase,phaseEndsAt:g.phaseEndsAt,size:g.size,players:g.players.size,sunk:g.ships.filter(x=>x.hits>=x.len).length,ships:g.ships.length,practice:g.practice,tickets:this.settings.tickets,
      result:r?{outcome:r.outcome,players:r.players,sunk:r.sunk,ships:r.ships,tickets:r.tickets,mvpTickets:r.mvpTickets,mvp:r.mvp?{name:r.mvp.name,platform:r.mvp.platform}:null}:null};}
  view(){const now=this.now();return {settings:this.settings,rules:RULES,stats:this.stats,history:this.history,cooldownLeft:this.cooldownLeft(now),running:!!this.game,...this.overlay()};}
}
