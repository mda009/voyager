import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Arena} from '../dist/engine.mjs';
import {MatchChat,matchSummary} from '../local/match-chat.mjs';

function fixture(t,training=false){
  const dir=mkdtempSync(join(tmpdir(),'voyager-chat-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const f={now:1000000,sends:[],receipts:new Map(),rewards:[],protocol:1,twitch:true};
  f.game=new Arena({training,now:()=>f.now,onRewards:rows=>f.rewards.push(...structuredClone(rows))});
  f.bot={status:{connected:true},request:async(type,args)=>{
    if(type==='GetGlobal')return {status:'ok',variable:{value:f.receipts.get(args.variable)||''}};
    if(type==='GetBroadcaster')return {connected:f.twitch?['twitch']:[]};
    assert.equal(type,'DoAction');assert.equal(args.args.vvOperation,'chat');
    assert.ok(args.args.vvChatText.length<=450);assert.ok(!/[\r\n]/.test(args.args.vvChatText));
    f.sends.push(args.args);f.receipts.set('voyagerVersusChat_'+args.args.vvAnnouncementId,'sent');return {status:'ok'};
  }};
  f.restart=()=>{f.chat=new MatchChat({directory:dir,game:f.game,bot:f.bot,action:()=> 'action',protocol:()=>f.protocol,reward:id=>f.rewards.find(r=>r.id===id),now:()=>f.now});f.game.onEvent=e=>f.chat.capture(e);};
  f.restart();f.command=(login,text='!versus')=>f.game.command({login,name:login.toUpperCase(),userId:login==='alpha'?'100':'200',text});
  f.flush=async(n=4)=>{for(let i=0;i<n;i++){f.now+=1600;await f.chat.tick();}};
  f.battle=()=>{f.command('alpha');f.command('bravo');f.game.tick(10);};
  return f;
}

test('Live lifecycle names both roles, summarizes the match, and confirms only verified points',async t=>{
  const f=fixture(t);f.command('alpha');await f.flush();
  assert.match(f.sends[0].vvChatText,/INITIATOR: @alpha.*!versus/);
  f.command('bravo');await f.flush();
  assert.match(f.sends[1].vvChatText,/INITIATOR: @alpha.*CHALLENGER: @bravo.*Launch in 10/);
  f.game.tick(10);f.game.tick(5);f.game.finish(1,'Hull destroyed');await f.flush();
  assert.match(f.sends[2].vvChatText,/WINNER: @bravo defeats @alpha.*5s.*credit pending.*Runner-up: 0/);
  assert.doesNotMatch(f.sends[2].vvChatText,/credited/);
  assert.equal(f.rewards.length,1);assert.equal(f.rewards[0].amount,50);
  f.rewards[0].status='credited';await f.flush();
  assert.match(f.sends[3].vvChatText,/@bravo \+50 Voyager points credited/);
  f.restart();await f.flush();assert.equal(f.sends.length,4);
});

test('Rapid joins retain both roles but suppress an obsolete challenger invitation',async t=>{
  const f=fixture(t);f.battle();await f.flush();assert.equal(f.sends.length,1);
  assert.match(f.sends[0].vvChatText,/INITIATOR: @alpha.*CHALLENGER: @bravo.*underway/);
});

test('Demo battles and old reward repairs never enqueue public match chat',async t=>{
  const f=fixture(t,true);f.game.control('demo');f.game.tick(4);f.game.tick(10);f.game.finish(0);f.chat.credit({id:'historic',amount:50,login:'old'});await f.flush();
  assert.equal(f.sends.length,0);assert.equal(f.chat.rows.length,0);
});

test('Draw, cancellation and countdown forfeit do not claim a 50-point payment',async t=>{
  for(const kind of ['draw','cancel','forfeit']){
    const f=fixture(t);f.command('alpha');f.command('bravo');if(kind!=='forfeit')f.game.tick(10);
    f.game.finish(kind==='forfeit'?0:null,kind==='forfeit'?'Opponent forfeited':'Time limit',kind==='cancel');await f.flush();
    const text=f.sends[0].vvChatText;assert.doesNotMatch(text,/50 Voyager|credited/);
    assert.match(text,kind==='draw'?/DRAW/:kind==='cancel'?/cancelled/:/before launch/);
    assert.equal(f.rewards.length,0);
  }
});

test('Lost send acknowledgement and host restart check receipt without repeating chat',async t=>{
  const f=fixture(t),request=f.bot.request;f.bot.request=async(type,args)=>{const r=await request(type,args);if(type==='DoAction')throw Error('lost ack');return r;};
  f.command('alpha');await f.flush(1);f.restart();await f.flush();
  assert.equal(f.sends.length,1);assert.equal(f.chat.rows[0].status,'sent');
});

test('Ambiguous sends go to review; missing receipts can retry the same id',async t=>{
  const f=fixture(t),request=f.bot.request;
  f.bot.request=async(type,args)=>{if(type==='DoAction'){f.sends.push(args.args);f.receipts.set('voyagerVersusChat_'+args.args.vvAnnouncementId,'pending');throw Error('send uncertain');}return request(type,args);};
  f.command('alpha');await f.flush(1);f.now+=31000;await f.flush();
  assert.equal(f.chat.rows[0].status,'review');assert.equal(f.sends.length,1);
  const g=fixture(t),original=g.bot.request;let first=true;
  g.bot.request=async(type,args)=>{if(type==='DoAction'&&first){first=false;g.sends.push(args.args);throw Error('not executed');}return original(type,args);};
  g.command('alpha');await g.flush(1);g.now+=16000;await g.flush();
  assert.equal(g.sends.length,2);assert.equal(g.sends[0].vvAnnouncementId,g.sends[1].vvAnnouncementId);
});

test('Disconnected or old C# installs wait; stale match messages expire',async t=>{
  const f=fixture(t);f.protocol=0;f.command('alpha');await f.flush();assert.equal(f.sends.length,0);assert.match(f.chat.message,/Rewards v2.5 action/);
  f.protocol=1;f.twitch=false;await f.flush();assert.equal(f.sends.length,0);
  f.twitch=true;f.bot.status.connected=false;await f.flush();assert.equal(f.sends.length,0);
  f.command('bravo');f.game.tick(10);f.game.finish(0);f.now+=600001;f.bot.status.connected=true;await f.flush();assert.equal(f.sends.length,0);
});

test('Delayed readiness check does not announce an invitation after challenger joins',async t=>{
  const f=fixture(t),request=f.bot.request;f.command('alpha');
  f.bot.request=async(type,args)=>{if(type==='GetBroadcaster')f.command('bravo');return request(type,args);};
  await f.flush(1);assert.equal(f.sends.length,0);await f.flush();assert.equal(f.sends.length,1);assert.match(f.sends[0].vvChatText,/CHALLENGER: @bravo/);
});

test('Confirmed results use credited wording; review and pending remain explicit',async t=>{
  const f=fixture(t);f.battle();f.game.finish(0);const e=f.chat.rows.find(r=>r.kind==='finish').data;
  assert.match(matchSummary(e,{status:'credited'}),/50 Voyager points credited/);
  assert.match(matchSummary(e,{status:'review'}),/credit needs review/);
  assert.match(matchSummary(e,{status:'pending'}),/credit pending/);
});
