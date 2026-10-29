import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {Arena,CALL_COOLDOWN_MS} from '../dist/engine.mjs';
import {cooldownView,formatCooldown} from '../dist/cooldown-state.mjs';

function fixture(){
  let now=2_000_000;
  const game=new Arena({now:()=>now});
  return {game,advance:ms=>{now+=ms;},packet:()=>({serverTime:now,connection:{connected:true},game:game.snapshot()})};
}

test('Cooldown overlay follows a real call and keeps the second seat joinable',()=>{
  const f=fixture();
  assert.equal(cooldownView(f.packet()).ready,true);
  f.game.command({login:'pilot_one',text:'!versus',userId:'1'});
  let view=cooldownView(f.packet());assert.equal(view.value,'45:00');assert.equal(view.ready,false);assert.match(view.hint,/Challenger wanted now/);
  f.advance(61_000);view=cooldownView(f.packet());assert.equal(view.value,'43:59');
  assert.equal(f.game.command({login:'pilot_two',text:'!versus',userId:'2'}).ok,true);
  assert.equal(cooldownView(f.packet()).value,'43:59');
  f.game.control('cancel');f.game.tick(9);f.advance(CALL_COOLDOWN_MS);
  assert.equal(cooldownView(f.packet()).ready,true);
});

test('Timer uses the host deadline and waits for fresh confirmation at zero',()=>{
  const f=fixture();f.game.cooldownUntil=f.packet().serverTime+1100;
  const packet=f.packet();
  assert.equal(cooldownView(packet,{elapsedMs:0}).value,'00:02');
  assert.equal(cooldownView(packet,{elapsedMs:200}).value,'00:01');
  assert.equal(cooldownView(packet,{elapsedMs:1200}).value,'SYNCING');
  f.advance(1200);assert.equal(cooldownView(f.packet()).ready,true);
  assert.equal(formatCooldown(-5),'00:00');assert.equal(formatCooldown(1800),'30:00');
  const legacy=f.packet();delete legacy.serverTime;assert.equal(cooldownView(legacy).ready,true);
});

test('Paused, closed and disconnected arenas never advertise a new call',()=>{
  const f=fixture();
  for(const patch of [{paused:true},{open:false}]){
    const p=f.packet();Object.assign(p.game,patch);const view=cooldownView(p);assert.equal(view.ready,false);assert.equal(view.value,'ON HOLD');
    p.game.cooldownUntil=p.serverTime+60_000;p.game.cooldownRemaining=60;
    assert.equal(cooldownView(p).value,'01:00');
  }
  const p=f.packet();p.connection.connected=false;assert.equal(cooldownView(p).value,'ON HOLD');
  assert.equal(cooldownView(f.packet(),{connected:false}).mode,'offline');
  assert.equal(cooldownView(f.packet(),{elapsedMs:5001}).mode,'offline');
  assert.equal(cooldownView(null).ready,false);
});

test('Availability distinguishes waiting challengers, battles, training and queued pilots',()=>{
  const f=fixture();
  for(const [patch,value] of [
    [{phase:'calling',caller:{demo:false}},'JOIN NOW'],
    [{phase:'countdown'},'IN BATTLE'],[{phase:'battle'},'IN BATTLE'],[{phase:'result'},'IN BATTLE'],
    [{phase:'calling',caller:{demo:true}},'TRAINING'],
    [{queue:[{},{}]},'QUEUED'],[{matches:[[{},{}]]},'QUEUED']
  ]){
    const p=f.packet();Object.assign(p.game,patch);const view=cooldownView(p);assert.equal(view.value,value);assert.equal(view.ready,false);
  }
  assert.equal(f.game.control('demo').ok,false);assert.equal(f.game.cooldownUntil,0);const training=new Arena({training:true});training.control('demo');assert.equal(cooldownView({...f.packet(),game:training.snapshot()}).value,'TRAINING');
});

async function runClient(search=''){
  const code=(await readFile(new URL('../dist/cooldown.mjs',import.meta.url),'utf8')).replace(/^import .*;\n/,'');
  const elements=new Map();const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',hidden:true,dataset:{},style:{}});return elements.get(id);};
  const events=[],intervals=[];
  const sandbox={cooldownView,URLSearchParams,location:{hostname:'127.0.0.1',search},performance:{now:()=>1000},document:{getElementById:element,addEventListener:()=>{}},setInterval:fn=>intervals.push(fn),EventSource:class{constructor(url){assert.equal(url,'/api/events');events.push(this);}}};
  vm.runInNewContext(code,sandbox);
  return {element,events,intervals};
}

test('Live browser client renders host events and clears READY on connection loss',async()=>{
  const {events,element}=await runClient();assert.equal(events.length,1);
  events[0].onmessage({data:JSON.stringify(fixture().packet())});assert.equal(element('timer-value').textContent,'READY');
  events[0].onerror();assert.equal(element('timer-value').textContent,'--:--');
  events[0].onmessage({data:'not JSON'});assert.equal(element('cooldown').dataset.mode,'offline');
  const f=fixture();f.game.cooldownUntil=f.packet().serverTime+120_000;
  events[0].onmessage({data:JSON.stringify(f.packet())});assert.equal(element('timer-value').textContent,'02:00');
});

test('Explicit timer preview is labelled and never connects to the host',async()=>{
  const {events,element}=await runClient('?preview=1');assert.equal(events.length,0);assert.equal(element('preview-label').hidden,false);assert.equal(element('timer-value').textContent,'00:12');
});
