import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Cards,normalizeCardSettings,memberId} from '../local/cards.mjs';
import {Medals} from '../local/medals.mjs';
import {TIERS,cardHTML} from '../dist/card-template.mjs';

async function make(){
  let now=new Date(2026,9,31,20,0,0).getTime();const said=[];const dir=await mkdtemp(join(tmpdir(),'voyager-cards-'));
  const medals=await new Medals({dataDir:dir,now:()=>now}).load();medals.state.backfilled=true;
  const community={state:{members:{'twitch:1':{name:'Nova',login:'nova',platform:'twitch',value:52000,balance:1450}},season:{name:'Season 1'}},standings:()=>[{key:'twitch:1',rank:2,score:18940}]};
  const rankings=[{login:'nova',wins:27,losses:9,draws:0},{login:'orion',wins:30,losses:2}];
  const cards=await new Cards({dataDir:dir,now:()=>now,say:t=>said.push(t),medals,community:()=>community,rankings:()=>rankings}).load();
  return {cards,medals,said,at:ms=>{now+=ms;}};
}
const ev=(extra={})=>({type:'voyager.card.event',v:1,kind:'card',platform:'twitch',userId:'1',login:'nova',name:'Nova',tier:'silver',points:1450,rank:4,members:312,input:'',...extra});

test('!voyager builds the tier card from groups, points and what Voyager tracks',async()=>{
  const {cards,medals}=await make();
  medals.ingestExport({type:'voyager.medals.data',v:1,users:[{key:'twitch:1',name:'Nova',login:'nova',watchSeconds:312*3600,months:14,gifts:3,firstSeenAt:new Date(2025,2,14).getTime()}]});medals.primed=false;medals.evaluate();
  const item=cards.receive(ev());assert.ok(item);
  const c=item.card;assert.equal(c.tier,'silver');assert.equal(c.t.title,'SILVER SENTINEL');
  assert.equal(c.d.stats[0].value,'1,450');assert.equal(c.d.stats[1].label,'LIFETIME POINTS');assert.equal(c.d.stats[1].value,'52,000');assert.match(c.d.stats[1].sub,/28,000 to Lieutenant Commander/);
  assert.equal(c.k.name,'LIEUTENANT');assert.equal(c.k.place,'#1 ALL-TIME · 52,000 POINTS EARNED');assert.equal(c.k.s_lt,'inline-flex');assert.equal(c.k.s_mid,'none');assert.equal(c.d.stats[2].value,'312 h');assert.equal(c.d.stats[3].value,'27–9');
  assert.equal(c.d.extras[0].value,'#2 · 18,940');assert.equal(c.d.extras[2].value,'14 months');
  assert.equal(c.d.fields[2].value,'14 March 2025');assert.match(c.d.fields[1].value,/^UNP-2025-\d{4}$/);
  assert.equal(c.t.next,'GOLD COMMANDER');assert.equal(c.t.pct,'80%','1,450 of the 1,800 Silver → Gold price');assert.match(c.t.need,/350 to go · then type !upgrade/);
  assert.ok(c.d.equipped.length>0&&c.d.equipped.length<=6);assert.equal(c.d.badges.length,24);
  assert.equal(c.v.front,'block');assert.equal(c.v.banner,'none');
  assert.ok(!JSON.stringify(c).toLowerCase().includes('ticket balance'));
  const html=cardHTML({...TIERS[c.tier],...c.t},c.v,c.c,c.d,c.k);assert.match(html,/SILVER SENTINEL/);assert.match(html,/LIEUTENANT/);assert.match(html,/1,450/);assert.ok(!html.includes('{{'));
});

test('Back sides, cooldown, privacy and callsigns',async()=>{
  const {cards,medals,said,at}=await make();
  medals.viewer('twitch:1',{name:'Nova',login:'nova'}).m={versus:{g:2,at:1},watch:{g:1,at:2}};
  assert.equal(cards.receive(ev({input:'stats'})).card.v.stats,'block');
  assert.equal(cards.receive(ev({input:'badges'})).cooldown,true,'one card per viewer per minute');
  at(61000);assert.equal(cards.receive(ev({input:'badges'})).card.v.badges,'block');
  cards.receive(ev({input:'private'}));assert.match(said.at(-1),/hides time watched/);
  at(61000);const priv=cards.receive(ev()).card;assert.equal(priv.d.stats[2].value,'Private');assert.equal(priv.d.extras[2].value,'Private');
  cards.receive(ev({input:'title time'}));assert.match(said.at(-1),/callsign is now ★ TIME WATCHED/);
  at(61000);assert.equal(cards.receive(ev()).card.c.callsign,'TIME WATCHED');
  cards.receive(ev({input:'title champion'}));assert.match(said.at(-1),/not earned/);
});

test('Joining Silver, Gold or Platinum plays the tier-up once; Platinum shows max tier',async()=>{
  const {cards}=await make();
  const up=cards.receive(ev({kind:'tierup',tier:'gold',points:0}));
  assert.equal(up.card.fromTier,'silver');assert.equal(up.card.v.banner,'flex');assert.equal(up.card.v.bannerText,'SILVER SENTINEL → GOLD COMMANDER');
  assert.equal(cards.receive(ev({kind:'tierup',tier:'gold'})),null,'the same promotion only plays once');
  const plat=cards.receive(ev({kind:'tierup',tier:'platinum'})).card;assert.equal(plat.fromTier,'gold');assert.equal(plat.t.next,'MAX TIER REACHED');
  assert.equal(cards.overlay().items.length,2);
});

test('Settings validate, previews use sample data, member IDs are stable',async()=>{
  assert.throws(()=>normalizeCardSettings({seconds:2}),/5 to 60/);
  assert.deepEqual(normalizeCardSettings({costs:{gold:2000}}).costs,{silver:1200,gold:2000,platinum:17000});
  assert.equal(memberId('twitch:1',Date.UTC(2025,5,1)),memberId('twitch:1',Date.UTC(2025,5,1)));
  const {cards}=await make();const p=cards.preview({tier:'platinum',side:'badges'});
  assert.equal(p.card.tier,'platinum');assert.equal(p.card.d.stats[2].value,'312 h');assert.ok(p.card.c.badgeCount.startsWith('MEDALS · 12'));
  assert.throws(()=>cards.preview({tier:'emerald'}),/Unknown/);
});

test('Naval ranks: lifetime points brackets, leaderboard gates for flag ranks, and promotions after the first check',async()=>{
  const {cards}=await make();
  const members={};const community={state:{members,season:{name:'Season 1'}},standings:()=>[]};cards.community=()=>community;
  const add=(id,value,login='u'+id)=>{members['twitch:'+id]={name:'V'+id,login,platform:'twitch',value};};
  add(1,12_000_000);add(2,11_000_000);add(3,4_000_000);add(4,150_000);add(5,4_999);add(6,99_000_000,'mdavoyagergold');
  const {place}=cards.board();
  assert.equal(place.get('twitch:6'),undefined,'bucket accounts are not ranked');
  assert.equal(cards.rankOf(12_000_000,place.get('twitch:1')),11,'#1 with 10M is Admiral of the Fleet');
  assert.equal(cards.rankOf(11_000_000,place.get('twitch:2')),10,'10M but #2 is Admiral');
  assert.equal(cards.rankOf(4_000_000,place.get('twitch:3')),10,'top 3 with 3.5M+ is Admiral');
  assert.equal(cards.rankOf(4_000_000,4),9,'4th place stops at Vice Admiral');
  assert.equal(cards.rankOf(150_000,place.get('twitch:4')),5,'150,000 is Commander');
  assert.equal(cards.rankOf(4_999,5),0,'Midshipman below 5,000');
  assert.deepEqual(cards.tickRanks(),[],'first check only records ranks');
  members['twitch:5'].value=40_000;members['twitch:4'].value=310_000;
  const promos=cards.tickRanks();
  assert.deepEqual(promos.map(p=>[p.key,p.to]),[['twitch:4',6],['twitch:5',3]]);
  const q=cards.overlay().items;assert.equal(q.length,1,'only Lieutenant Commander and above show on stream by default');
  assert.equal(q[0].card.v.bannerText,'COMMANDER → CAPTAIN');assert.equal(q[0].card.v.bannerEyebrow,'★ PROMOTED ★');assert.equal(q[0].card.promotion,true);
  assert.match(cards.tickChat(),/Promotions: V4 is now Captain · V5 is now Lieutenant/);
  assert.throws(()=>cards.configure({rankPoints:[0,5,4,6,7,8,9,10,11,12,13,14]}),/go up/);
});

test('!voyager straight from Twitch chat: tier and points from the Points Ledger, and a duplicate from Streamer.bot is ignored',async()=>{
  const {cards}=await make();
  cards.community().state.members['twitch:1'].tier='gold';
  const ev=cards.fromChat({userId:'1',login:'nova',name:'Nova',text:'!voyager stats'});
  assert.equal(ev.tier,'gold');assert.equal(ev.points,1450);assert.equal(ev.rank,1);assert.equal(ev.input,'stats');
  const item=cards.receive(ev);assert.equal(item.card.tier,'gold');assert.equal(item.card.v.stats,'block');
  assert.ok(cards.requestedSince('twitch:1',0));
  assert.equal(cards.receive({...ev,tier:'gold'}),null,'the same request from the Streamer.bot trigger shows once');
});
