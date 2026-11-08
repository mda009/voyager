import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Stage,normalizeSettings,STAGE_DEFAULTS,GEOMETRY} from '../local/stage.mjs';

const dir=()=>mkdtemp(join(tmpdir(),'voyager-stage-'));

test('Stage settings: slots, stack, corner and chat options are validated; unknown panels are refused',()=>{
  const s=normalizeSettings({slots:{left:'chat',bottomLeft:'christmas'},stack:['ticker','bucket','ticker'],pip:'bl',scene:' Live ',source:'Game',resultSeconds:30,chat:{kick:false,commands:true}});
  assert.equal(s.slots.left,'chat');assert.equal(s.slots.right,STAGE_DEFAULTS.slots.right);assert.equal(s.slots.bottomLeft,'christmas');
  assert.deepEqual(s.stack,['ticker','bucket']);assert.equal(s.pip,'bl');assert.equal(s.scene,'Live');assert.equal(s.resultSeconds,30);assert.equal(s.chat.kick,false);assert.equal(s.chat.commands,true);assert.equal(s.chat.twitch,true);
  const h=normalizeSettings({hide:'Versus ready timer, SC referral,, Versus ready timer\nCam'});assert.deepEqual(h.hide,['Versus ready timer','SC referral','Cam']);
  assert.equal(normalizeSettings({slots:{bottomLeft:'squadron',right:'dread'},stack:['dread','ticker']}).slots.bottomLeft,'squadron');
  assert.throws(()=>normalizeSettings({slots:{left:'nope'}}),/Unknown panel/);
  assert.throws(()=>normalizeSettings({stack:['x']}),/bottom stack/);
  assert.throws(()=>normalizeSettings({pip:'tl'}),/corner/);
  assert.throws(()=>normalizeSettings({resultSeconds:2}),/5 to 60/);
});

test('Stage is up for boarding, battle and the battle report hold, or when forced; layout follows the corner choice',async()=>{
  let now=1000000;const st=await new Stage({dataDir:await dir(),now:()=>now}).load();
  assert.equal(st.active({phase:'idle'}),false);
  assert.equal(st.active({phase:'lobby'}),true);assert.equal(st.active({phase:'battle'}),true);
  assert.equal(st.active({phase:'result',endedAt:now-5000,id:'b1',outcome:'victory',leaders:[{name:'StarNova',platform:'twitch',damage:900}],mvpBonus:25}),true,'report shown for resultSeconds');
  now+=20000;assert.equal(st.active({phase:'idle'}),true,'MVP celebration keeps the stage up after the report, even once the boss is idle');
  let o=st.overlay({phase:'idle'});assert.equal(o.phase,'mvp');assert.equal(o.mvp.name,'StarNova');assert.equal(o.mvp.bonus,25);
  now+=10000;assert.equal(st.active({phase:'idle'}),false,'celebration over');
  st.lastResult=null;assert.equal(st.active({phase:'result',endedAt:now-25000,id:'b2',leaders:[]}),false,'report hold over, nobody dealt damage: no MVP window');
  st.configure({enabled:false});assert.equal(st.active({phase:'battle'}),false,'switched off');
  st.configure({enabled:true});st.force(60);assert.equal(st.active({phase:'idle'}),true,'forced from the control page');now+=61000;assert.equal(st.active({phase:'idle'}),false);
  o=st.overlay({phase:'idle'});assert.equal(o.geometry.pip.x,GEOMETRY.pip.br.x);assert.equal(o.geometry.bottomLeft.x,GEOMETRY.bottomLeft.br.x);
  st.configure({pip:'bl'});o=st.overlay({phase:'idle'});assert.equal(o.geometry.pip.x,GEOMETRY.pip.bl.x);assert.equal(o.geometry.bottomLeft.x,GEOMETRY.bottomLeft.bl.x,'the corner panel swaps sides with the game');
  await st.saving;const again=await new Stage({dataDir:st.dataDir,now:()=>now}).load();assert.equal(again.settings.pip,'bl','settings persist');
});

test('Chat feed keeps the last messages from every platform, filters platforms and !commands, and dedupes by message id',async()=>{
  let now=5000;const st=await new Stage({dataDir:await dir(),now:()=>now}).load();
  st.chat({platform:'twitch',name:'StarNova',text:'hello',color:'#9FD4FF',role:3,sub:true,messageId:'a1'});
  st.chat({platform:'twitch',name:'StarNova',text:'hello',messageId:'a1'});
  st.chat({platform:'kick',name:'PixelDrift',text:'!join'});
  st.chat({platform:'youtube',name:'Quillon',text:'gg'});
  st.chat({platform:'twitch',name:'','text':'no name'});
  assert.equal(st.messages.length,3,'duplicate and nameless lines dropped');
  let feed=st.chatFeed();assert.equal(feed.length,2,'!commands hidden by default');assert.equal(feed[0].color,'#9fd4ff');assert.equal(feed[0].role,3);assert.equal(feed[0].sub,true);
  st.configure({chat:{commands:true,youtube:false}});feed=st.chatFeed();assert.deepEqual(feed.map(m=>m.platform),['twitch','kick']);
  for(let i=0;i<100;i++)st.chat({platform:'twitch',name:'Bot'+i,text:'line '+i});
  assert.equal(st.messages.length,80,'bounded');assert.equal(st.chatFeed().length,40,'overlay shows the last 40');
  assert.equal(st.messages.length,80);st.force(10);assert.equal(st.messages.length,80,'samples only seed an empty feed');
  const empty=await new Stage({dataDir:await dir(),now:()=>now}).load();empty.force(10);assert.ok(empty.messages.length>=5,'a test showing seeds fictional sample lines');
});

test('Move cue goes to Streamer.bot once when the stage comes up and once when it goes down, only with a scene and source named',async()=>{
  let now=1000;const sent=[];const st=await new Stage({dataDir:await dir(),now:()=>now,run:async a=>{sent.push(a);return {ok:true};},uuid:()=>'r1'}).load();
  assert.equal(await st.tick({phase:'lobby'}),null,'no scene named: nothing sent');assert.equal(sent.length,0);
  st.cue.on=false;st.configure({scene:'Live',source:'Game',hide:['Versus ready timer']});
  assert.equal(await st.tick({phase:'lobby'}),null,'the splash plays first');now+=6000;
  const r=await st.tick({phase:'lobby'});assert.equal(r.phase,'on');assert.equal(r.ok,true);assert.equal(sent.length,1);
  assert.equal(sent[0].stagePhase,'on');assert.equal(sent[0].stageScene,'Live');assert.equal(sent[0].stageSource,'Game');assert.equal(sent[0].stageX,GEOMETRY.pip.br.x);assert.equal(sent[0].stageW,640);assert.equal(sent[0].stageMs,1200);assert.deepEqual(JSON.parse(sent[0].stageHide),['Versus ready timer']);
  assert.equal(await st.tick({phase:'battle'}),null,'still up: no second cue');
  now+=30000;const off=await st.tick({phase:'result',endedAt:now-25000});assert.equal(off.phase,'off');assert.equal(sent.length,2);
  assert.equal(st.overlay({phase:'idle'}).cue.phase,'off');
});

test('Voyager Versus takeover (2.20.91): call, battle and result put the stage up, the champion is celebrated and earns the bonus payable; the Dreadnought wins when both are on',async()=>{
  let now=50000;const st=await new Stage({dataDir:await dir(),now:()=>now}).load();st.configure({versus:{winnerBonus:25}}); // bonus is off by default (2.20.92): a win is the 50-point reward
  const idle={phase:'idle'};
  assert.equal(st.mode(idle,{phase:'lobby'}),'','nothing on');
  assert.equal(st.mode(idle,{phase:'calling',caller:{name:'StarNova'}}),'versus');
  let o=st.overlay(idle,{phase:'calling',caller:{name:'StarNova'}});assert.equal(o.mode,'versus');assert.equal(o.splashOn,true);assert.match(o.splash.title,/STARNOVA CALLS/);assert.match(o.main.url,/index\.html\?overlay=1&stage=1/);
  o=st.overlay(idle,{phase:'battle',players:[{name:'StarNova'},{name:'Quillon'}]});assert.equal(o.splashOn,false);assert.equal(o.phase,'battle');
  const result={phase:'result',matchId:'m1',players:[{name:'StarNova',login:'starnova',userId:'123'},{name:'Quillon',login:'quillon',userId:'456'}],result:{winner:0,reason:'Hull destroyed',cancelled:false,demo:false,duration:42,rewards:[{role:'winner',amount:50},{role:'runnerUp',amount:0}]}};
  assert.equal(st.mode(idle,result),'versus');assert.equal(st.overlay(idle,result).phase,'result');
  now+=9000;o=st.overlay(idle,{phase:'lobby'});assert.equal(o.mode,'versus','arena back in the lobby, the champion celebration keeps the stage up');assert.equal(o.phase,'winner');
  assert.equal(o.celebrate.name,'StarNova');assert.equal(o.celebrate.points,75,'winner reward 50 + champion bonus 25');assert.match(o.celebrate.line,/DEFEATED QUILLON · 0:42/);
  now+=10000;assert.equal(st.mode(idle,{phase:'lobby'}),'','celebration over');
  const pay=st.bonusPayables();assert.equal(pay.length,1);assert.equal(pay[0].key,'twitch:123');assert.equal(pay[0].reward,25);assert.equal(pay[0].scope,'versus');assert.match(pay[0].title,/beat Quillon/);
  await st.saving;const again=await new Stage({dataDir:st.dataDir,now:()=>now}).load();assert.equal(again.bonusPayables().length,1,'payables persist');
  // a training (demo) win is celebrated but never paid; a cancelled call puts nothing on screen
  st.observeVersus({phase:'result',matchId:'m2',players:[{name:'Bot A',demo:true},{name:'Bot B',demo:true}],result:{winner:1,demo:true,duration:10}});assert.equal(st.bonusPayables().length,1);assert.equal(st.lastVersus.winner.name,'Bot B');
  st.observeVersus({phase:'result',matchId:'m3',players:[{name:'A'},{name:'B'}],result:{winner:null,cancelled:true}});assert.equal(st.lastVersus.winner,null);now+=9000;assert.equal(st.mode(idle,{phase:'lobby'}),'');
  // Dreadnought outranks Versus; Versus can be switched off; forced Versus preview
  assert.equal(st.mode({phase:'battle'},{phase:'battle'}),'dread');
  st.configure({versus:{enabled:false}});assert.equal(st.mode(idle,{phase:'battle'}),'');
  st.force(60,'versus');assert.equal(st.mode(idle,{phase:'lobby'}),'versus');assert.equal(st.overlay(idle,{phase:'lobby'}).splashOn,true);
  assert.throws(()=>normalizeSettings({versus:{winnerBonus:-1}}),/Versus winner bonus/);
  assert.equal(STAGE_DEFAULTS.versus.winnerBonus,0,'no champion bonus unless the streamer sets one');
  const plain=await new Stage({dataDir:await dir(),now:()=>now}).load();plain.observeVersus(result);now+=9000;const po=plain.overlay(idle,{phase:'lobby'});assert.equal(po.celebrate.points,50,'a Versus win shows the 50-point reward');assert.equal(plain.bonusPayables().length,0);
});
