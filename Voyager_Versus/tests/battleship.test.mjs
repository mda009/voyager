import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {Battleship,normalizeBattleshipSettings,parseShot,placeFleet,label,RULES,FLEETS} from '../local/battleship.mjs';

// A fixed "random": 0 lays every ship from the top-left, horizontally where it fits.
async function make(settings={},random=()=>0){const dir=await mkdtemp(join(tmpdir(),'voyager-bs-'));let now=1e12;const said=[],grants=[],results=[];
  const g=await new Battleship({dataDir:dir,now:()=>now,random,say:t=>said.push(t),onTickets:x=>grants.push(x),onResult:x=>results.push(x)}).load();g.configure({cooldownSeconds:0,...settings});
  const run=ms=>{const end=now+ms;while(now<end&&g.game){now+=100;g.tick();}},skip=ms=>{now+=ms;};
  return {g,said,grants,results,run,skip};}
const msg=(name,text='!fire',platform='twitch')=>({platform,userId:'id-'+name,login:name.toLowerCase(),name,text});
const cheer=(name,amount)=>({kind:'bits',platform:'twitch',userId:'id-'+name,login:name.toLowerCase(),name,amount});
const gift=(name,amount,extra={})=>({kind:'gift',platform:'twitch',userId:'id-'+name,login:name.toLowerCase(),name,amount,...extra});
const shipCells=g=>[...g.game.at.keys()],water=g=>g.game.grid.map((v,i)=>i).filter(i=>!g.game.at.has(i));

test('calling squares: "!fire B5", "b5", "5b" and "B 5" all work; squares off the grid do not',()=>{
  assert.deepEqual(parseShot('!fire B5',8).cell,{col:1,row:4,index:33,label:'B5'});assert.equal(parseShot('b5',8).cell.label,'B5');assert.equal(parseShot('5b',8).cell.label,'B5');assert.equal(parseShot('!shot b 5',8).cell.label,'B5');
  assert.equal(parseShot('J10',10).cell.label,'J10');assert.equal(parseShot('j10',8).outside,true);assert.equal(parseShot('!fire',8).cell,null);assert.equal(parseShot('!fire',8).cmd,true);
  assert.deepEqual(parseShot('hello b5',8),{cmd:false,cell:null});assert.deepEqual(parseShot('b55',8),{cmd:false,cell:null});assert.equal(label(33,8),'B5');
});

test('the fleet is laid out straight, on the grid and without overlaps, for every board size',()=>{
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(const f of FLEETS)for(let k=0;k<40;k++){const {ships,at}=placeFleet(f.size,f.ships,rnd);assert.equal(at.size,f.ships.reduce((a,[,n])=>a+n,0));
    for(const s of ships){assert.ok(s.cells.every(c=>c>=0&&c<f.size*f.size));const rows=new Set(s.cells.map(c=>Math.floor(c/f.size))),cols=new Set(s.cells.map(c=>c%f.size));assert.ok(rows.size===1||cols.size===1,'straight');assert.equal(Math.max(rows.size,cols.size),s.len);}}
});

test('a battle: lobby, shots once every 6 seconds, hits, misses, sinkings, victory pays every player and the MVP a little more',async()=>{
  const {g,said,grants,results,run,skip}=await make();
  assert.equal(g.chat(msg('Early','b5')),null,'nothing happens with no battle');
  g.start();assert.equal(g.game.phase,'lobby');assert.match(said[0],/BATTLESHIP.*!fire/);
  assert.deepEqual(g.chat(msg('Ada')),{ok:true,joined:true,counted:false});g.chat(msg('Bo','a1'));assert.equal(g.chat(msg('Cy','hello there')),null,'ordinary chat is ignored');
  assert.equal(g.overlay().battle.players,2);assert.equal(g.overlay().battle.size,0);
  run(30000);assert.equal(g.game.phase,'battle');assert.equal(g.game.size,6,'two players: the small board');assert.match(said[1],/OPEN FIRE.*3 enemy ships.*6×6.*A1 to F6/);
  const ships=shipCells(g),sea=water(g),L=i=>label(i,6);
  assert.equal(g.overlay().battle.cells,'.'.repeat(36));assert.ok(g.overlay().battle.ships.every(s=>!s.cells),'ship positions are not sent while they are afloat');
  let r=g.chat(msg('Ada',L(sea[0])));assert.equal(r.result,'miss');assert.equal(g.chat(msg('Ada',L(ships[0]))).counted,false,'one shot every 6 seconds');
  assert.equal(g.chat(msg('Bo','!fire '+L(sea[0]))).repeat,true,'a square that is already shot costs nothing');assert.equal(g.chat(msg('Bo','!fire '+L(ships[0]))).result,'hit');
  assert.equal(g.chat(msg('Cy','!fire')).help,true,'a shot needs a square');assert.equal(g.chat(msg('Cy','z9')),null);
  // Ada sinks everything else
  let last=null;for(const c of ships.slice(1)){skip(RULES.pace);last=g.chat(msg('Ada',L(c)));}
  assert.equal(last.won,true);assert.equal(g.game.phase,'result');const res=g.game.result;assert.equal(res.outcome,'victory');assert.equal(res.players,2,'Cy never fired');assert.equal(res.sunk,3);
  assert.equal(res.mvp.name,'Ada');assert.equal(res.mvp.hits,6);assert.equal(res.mvp.sinks,3);assert.equal(res.shots,8);assert.equal(res.accuracy,88);
  assert.deepEqual(grants[0].grants.map(x=>[x.name,x.tickets]).sort(),[['Ada',7],['Bo',5]]);assert.match(grants[0].id,/^battleship-/);
  assert.equal(results[0].crewList.find(x=>x.name==='Bo').firstHit,true);assert.equal(results[0].crewList.find(x=>x.name==='Ada').firstHit,false);
  const o=g.overlay().battle;assert.ok(o.ships.every(s=>s.sunk&&s.cells.length===s.len));assert.equal(o.cells.split('').filter(c=>c==='s').length,7);assert.equal(o.cells[sea[0]],'o');
  assert.match(said.at(-1),/ENEMY FLEET SUNK.*MVP: Ada/);run(RULES.result+200);assert.equal(g.game,null);assert.equal(g.stats.won,1);assert.equal(g.history[0].outcome,'victory');
});

test('cheers ping the sonar and gifted subs call air strikes: they help the crew but cannot land the final hit, earn tickets or (by default) win MVP',async()=>{
  const {g,grants,run,skip}=await make();g.start();g.chat(msg('Free'));run(30000);const L=i=>label(i,6);
  assert.equal(g.support(cheer('Whale',50)).ignored,true,'under 100 bits does nothing');
  const s1=g.support(cheer('Whale',100000));assert.equal(s1.contacts.length,RULES.sonarCap,'capped per cheer');
  const o=g.overlay().battle;assert.equal(o.cells.split('').filter(c=>c==='c').length,3);for(const c of s1.contacts)assert.ok(g.game.at.has(parseShot(c,6).cell.index),'contacts are real ship squares');
  assert.equal(g.game.grid.filter(Boolean).length,0,'a contact is not a hit: someone still has to shoot it');
  assert.equal(g.support(gift('Gifter',2,{receipts:['a','b']})).strikes.length,2);assert.equal(g.support(gift('Gifter',2,{receipts:['a','b']})).ignored,true,'the same Kick gifts count once');
  for(let i=0;i<20;i++)g.support(gift('Gifter',50)); // far more strikes than squares
  assert.equal(g.game.phase,'battle','air strikes never land the final hit');assert.equal(g.remaining(),1);assert.equal(g.game.grid.filter(v=>!v).length,1,'only the last ship square is left');
  const lastCell=g.game.grid.findIndex(v=>!v);assert.equal(g.chat(msg('Free',L(lastCell))).won,true);
  const r=g.game.result;assert.equal(r.mvp.name,'Free');assert.equal(r.players,1,'only people who fired are players');assert.deepEqual(grants[0].grants.map(x=>[x.name,x.tickets]),[['Free',7]]);void skip;
});

test('time runs out: the fleet is shown and nothing is paid; practice battles and the off switch pay nothing; the board grows with the crew',async()=>{
  const {g,said,grants,results,run}=await make({battleSeconds:60});g.start();g.chat(msg('Ada'));run(30000);g.chat(msg('Ada','a1'));run(61000);
  assert.equal(g.game.result.outcome,'defeat');assert.equal(grants.length,0);assert.ok(g.overlay().battle.ships.every(s=>Array.isArray(s.cells)),'the fleet is revealed at the end');assert.match(said.at(-1),/Time is up/);run(RULES.result+200);
  g.start();run(30000+61000);assert.equal(g.game.result.outcome,'empty');run(RULES.result+200);
  g.start({practice:true});g.chat(msg('Ada'));run(30000);for(const c of [...g.game.at.keys()]){g.chat(msg('Ada',label(c,6)));run(RULES.pace);}
  assert.equal(g.game.result.outcome,'victory');assert.equal(g.game.result.tickets,0);assert.equal(grants.length,0);assert.equal(results.length,2,'practice is not counted');run(RULES.result+200);
  g.start();for(let i=0;i<5;i++)g.chat(msg('P'+i));run(30000);assert.equal(g.game.size,8);g.stop();
  g.start();for(let i=0;i<12;i++)g.chat(msg('Q'+i));run(30000);assert.equal(g.game.size,10);assert.equal(g.game.ships.length,5);
  g.configure({enabled:false});assert.equal(g.game,null);assert.throws(()=>g.start(),/Turn Battleship on/);assert.deepEqual(g.overlay().battle,null);assert.equal(g.share(),null);
});

test('settings are checked; the cooldown holds; with mvpFreeOnly off air-strike hits count toward MVP; the website share carries no ship positions',async()=>{
  assert.throws(()=>normalizeBattleshipSettings({battleSeconds:5}),/Battle seconds must be 60 to 600/);assert.equal(normalizeBattleshipSettings({}).mvpFreeOnly,true);
  const {g,run}=await make({mvpFreeOnly:false,cooldownSeconds:120});g.start();g.chat(msg('Payer'));g.chat(msg('Free'));run(30000);const sea=water(g);
  g.chat(msg('Payer',label(sea[0],6)));for(let i=0;i<10;i++)g.support(gift('Payer',5));
  const sh=g.share();assert.equal(sh.phase,'battle');assert.equal(sh.players,2);assert.equal(sh.ships,3);assert.equal(sh.sunk,2);assert.ok(!JSON.stringify(sh).includes('cells'));
  assert.equal(g.chat(msg('Free',label(g.game.grid.findIndex(v=>!v),6))).won,true);assert.equal(g.game.result.mvp.name,'Payer','six air-strike hits beat one shot when paid help counts');
  run(RULES.result+200);assert.throws(()=>g.start(),/Cooling down/);
});
