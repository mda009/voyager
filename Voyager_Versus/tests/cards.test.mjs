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

test('Ranks page: roster with rank, place and progress, holders per rank, insignia and a promotions log',async()=>{
  const {cards}=await make();
  const members={};cards.community=()=>({state:{members},standings:()=>[]});
  const add=(id,value,name)=>{members['twitch:'+id]={name,login:name.toLowerCase(),platform:'twitch',value};};
  add(1,12_000_000,'Ace');add(2,52_000,'Nova');add(3,4_000,'Rook');members['twitch:9']={name:'Bucket',login:'mdavoyagergold',value:9e9};
  let v=cards.ranksView();
  assert.equal(v.total,3);assert.deepEqual(v.members.map(m=>[m.name,m.place,v.ranks[m.rank].name]),[['Ace',1,'Admiral of the Fleet'],['Nova',2,'Lieutenant'],['Rook',3,'Midshipman']]);
  assert.equal(v.members[1].need,28_000);assert.equal(v.members[1].progress,(52_000-40_000)/40_000);assert.equal(v.members[0].next,null);
  assert.equal(v.ranks[11].holders,1);assert.equal(Object.keys(v.insignia).length,12);assert.match(v.insignia.lt,/^<svg/);
  cards.tickRanks();members['twitch:3'].value=6_000;cards.tickRanks();
  v=cards.ranksView();assert.equal(v.promotions.length,1);assert.equal(v.promotions[0].name,'Rook');assert.equal(v.ranks[v.promotions[0].to].name,'Acting Sub-Lieutenant');
});

test('Public crew rows carry the stream card front, built by the same code, without creating card members',async()=>{
  const {cards}=await make();
  const rows=cards.crewRows(10);const f=rows[0].front;
  assert.equal(rows[0].name,'Nova');assert.equal(f.tier,'blue');assert.deepEqual(f.fields.slice(0,1),['Nova']);
  assert.equal(f.stats[0][0],'VOYAGER POINTS');assert.equal(f.stats[1][0],'LIFETIME POINTS');assert.equal(f.rank.name,'LIEUTENANT');
  assert.equal(Object.keys(cards.state.members).length,0,'building the public front never adds card members');
  assert.equal(cards.memo,null);
});

test('Fleet alerts (2.20.23): a follower\'s card is presented after the Fleet animation; a resub lands on a member\'s card live',async()=>{
  const {cards,medals,at}=await make();
  medals.ingestExport({type:'voyager.medals.data',v:1,users:[{key:'twitch:1',name:'Nova',login:'nova',watchSeconds:312*3600,months:11,gifts:3,firstSeenAt:new Date(2025,2,14).getTime()}]});medals.primed=false;medals.evaluate();
  const now=cards.now(),bot=now-1234; // Streamer.bot's clock runs behind the host's
  const alert=(id,stage,start,extra={})=>({id,stage,status:'queued',startAt:bot+start,endAt:bot+start+16000,name:'Nova',platform:'twitch',userId:'1',login:'nova',amount:1,months:1,tier:'',test:false,...extra});
  // A resub for Nova (12 months) and, queued 700 ms behind it, a follow from someone Voyager has never seen.
  const state={enabled:true,queue:[alert('a',4,350,{months:12}),alert('b',1,350+16000+700,{name:'Rook',userId:'77',login:'rook'})]};
  const made=cards.fromFleet(state,bot);
  assert.equal(made.length,2);
  const resub=made[0],follow=made[1];
  assert.equal(resub.at,now+350+16000+700+16000+500,'both cards wait for the whole run of alerts to end');assert.equal(follow.at,resub.at);
  assert.deepEqual(cards.overlay().items.map(x=>x.id),[],'nothing plays while the Fleet animation runs');
  assert.equal(resub.live.kind,'resub');assert.equal(resub.live.text,'RESUBSCRIBED · 12 MONTHS');assert.equal(resub.live.points,5);assert.equal(resub.live.title,null);
  assert.equal(resub.card.d.extras[2].value,'11 months');assert.equal(resub.live.after.d.extras[2].value,'12 months');
  assert.deepEqual(resub.live.delta.slice(0,2).map(d=>[d.kind,d.label,d.from,d.to]),[['stat','VOYAGER POINTS','1,450','1,455'],['extra','SUBSCRIBED','11 months','12 months']]);
  assert.match(resub.live.delta[2]?.label,/HONOUR/,'the upgraded medal adds honour too');assert.equal(resub.live.delta.length,3);
  assert.equal(resub.live.medal?.id,'subs','12 months reaches Loyal Subscriber Silver');assert.equal(resub.live.medal.gradeName,'Silver');assert.equal(resub.live.medal.upgrade,true);
  assert.ok(resub.live.after.d.equipped.some(b=>b.name==='Loyal Subscriber'&&b.sub==='Silver'));
  assert.equal(follow.live.kind,'follow');assert.equal(follow.live.title.word,'WELCOME');assert.equal(follow.card.tier,'blue');assert.equal(follow.card.c.callsign,'NEW RECRUIT');
  assert.equal(follow.card.d.stats[0].value,'0');assert.equal(follow.live.after.d.stats[0].value,'50','the follow reward lands on an empty card');
  // The same broadcast again adds nothing; a new alert queued behind pushes both cards later.
  assert.equal(cards.fromFleet(state,bot).length,0);
  cards.fromFleet({...state,queue:[...state.queue,alert('c',3,350+2*16700,{amount:5})]},bot);
  assert.equal(cards.state.queue.find(x=>x.id===resub.id).at,now+350+2*16700+16000+500,'rescheduled behind the gift alert');
  at(60000);assert.deepEqual(cards.overlay().items.map(x=>x.live.kind),['resub','follow','gift'],'they play in order once the run has ended');
  // Raids and alerts that ended long ago are ignored; switching the ceremonies off stops them.
  assert.equal(cards.fromFleet({enabled:true,queue:[alert('d',6,0),alert('e',2,-120000)]},bot).length,0);
  cards.configure({fleet:{support:false,points:{gift:0}}});assert.equal(cards.state.settings.fleet.points.gift,0);assert.equal(cards.state.settings.fleet.points.sub,250);
  assert.equal(cards.fromFleet({enabled:true,queue:[alert('f',2,60000)]},bot).length,0);assert.equal(cards.fromFleet({enabled:true,queue:[alert('g',1,60000)]},bot).length,1);
  assert.throws(()=>cards.configure({fleet:{points:{bits:-1}}}),/0 to 1,000,000/);
  // Previews from the control page use sample data and never create members.
  const p=cards.preview({fleet:'gift'});assert.equal(p.preview,true);assert.equal(p.live.text,'5 GIFT SUBS');assert.equal(p.live.points,0);assert.ok(!cards.state.members['twitch:preview']);
  assert.ok(!cards.state.recent.some(r=>r.name==='NebulaKnight'));
});

test('Ruby VIP ribbon (2.20.28): members in the VIP group get the ribbon on every side; previews can show it',async()=>{
  const {cards,at}=await make();
  let item=cards.receive(ev());assert.equal(item.card.vip,false);assert.equal(item.card.v.vip,'none');
  cards.community().state.members['twitch:1'].vip=true;at(61000);
  item=cards.receive(ev({input:'badges'}));assert.equal(item.card.vip,true);assert.equal(item.card.v.vip,'flex');
  assert.match(cardHTML({...TIERS[item.card.tier],...item.card.t},item.card.v,item.card.c,item.card.d,item.card.k),/RUBY VIP/);
  assert.equal(cards.preview({tier:'gold',vip:true}).card.vip,true);assert.equal(cards.preview({tier:'gold'}).card.vip,false);
  // Emerald Elite (2.20.29): green ribbon; with VIP too, one red-into-green ribbon so the title stays clear.
  cards.community().state.members['twitch:1'].emerald=true;at(61000);
  item=cards.receive(ev());assert.equal(item.card.emerald,true);assert.equal(item.card.v.emerald,'none','merged into the VIP ribbon');assert.equal(item.card.v.vipText,'★ RUBY VIP · EMERALD ★');
  delete cards.community().state.members['twitch:1'].vip;at(61000);
  item=cards.receive(ev());assert.equal(item.card.v.vip,'none');assert.equal(item.card.v.emerald,'flex');assert.equal(item.card.v.ribbonPad,'160px');
  assert.match(cardHTML({...TIERS[item.card.tier],...item.card.t},item.card.v,item.card.c,item.card.d,item.card.k),/EMERALD ELITE/);
  assert.equal(cards.preview({tier:'silver',emerald:true}).card.emerald,true);
});

test('Crew rows (2.20.34): Kick, YouTube and Silver+ members are included even below the lifetime cut-off',async()=>{
  const {cards}=await make();const members=cards.community().state.members;
  for(let i=0;i<30;i++)members['twitch:t'+i]={name:'T'+i,login:'t'+i,platform:'twitch',value:1000-i};
  members['kick:9']={name:'KickLow',login:'kicklow',platform:'kick',value:5,balance:5};
  members['youtube:9']={name:'TubeLow',login:'tubelow',platform:'youtube',value:3};
  members['twitch:gold']={name:'GoldLow',login:'goldlow',platform:'twitch',value:2,tier:'gold'};
  members['twitch:bluelow']={name:'BlueLow',login:'bluelow',platform:'twitch',value:1};
  const rows=cards.crewRows(10),names=rows.map(r=>r.name);
  assert.equal(rows.length,13);assert.ok(names.includes('KickLow')&&names.includes('TubeLow')&&names.includes('GoldLow'));assert.ok(!names.includes('BlueLow'),'low Blue Twitch members stay outside the cut-off');
});
