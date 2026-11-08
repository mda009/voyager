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
  assert.equal(st.active({phase:'result',endedAt:now-5000}),true,'report shown for resultSeconds');
  assert.equal(st.active({phase:'result',endedAt:now-25000}),false,'report hold over');
  st.configure({enabled:false});assert.equal(st.active({phase:'battle'}),false,'switched off');
  st.configure({enabled:true});st.force(60);assert.equal(st.active({phase:'idle'}),true,'forced from the control page');now+=61000;assert.equal(st.active({phase:'idle'}),false);
  let o=st.overlay({phase:'idle'});assert.equal(o.geometry.pip.x,GEOMETRY.pip.br.x);assert.equal(o.geometry.bottomLeft.x,GEOMETRY.bottomLeft.br.x);
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
  const r=await st.tick({phase:'lobby'});assert.equal(r.phase,'on');assert.equal(r.ok,true);assert.equal(sent.length,1);
  assert.equal(sent[0].stagePhase,'on');assert.equal(sent[0].stageScene,'Live');assert.equal(sent[0].stageSource,'Game');assert.equal(sent[0].stageX,GEOMETRY.pip.br.x);assert.equal(sent[0].stageW,640);assert.equal(sent[0].stageMs,1200);assert.deepEqual(JSON.parse(sent[0].stageHide),['Versus ready timer']);
  assert.equal(await st.tick({phase:'battle'}),null,'still up: no second cue');
  now+=30000;const off=await st.tick({phase:'result',endedAt:now-25000});assert.equal(off.phase,'off');assert.equal(sent.length,2);
  assert.equal(st.overlay({phase:'idle'}).cue.phase,'off');
});
