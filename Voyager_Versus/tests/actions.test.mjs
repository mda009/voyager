import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Actions,PRESETS} from '../local/actions.mjs';

function fakeBot(actions,{connected=true}={}){
  const calls=[];
  return {calls,status:{connected},request:async(request,values)=>{calls.push({request,...values});
    if(request==='GetActions')return {status:'ok',actions};
    if(request==='DoAction')return values.action.id==='bad'?{status:'error',error:'No such action.'}:{status:'ok'};
    throw new Error('unexpected '+request);}};
}
const LIST=[
  {id:'a1',name:'Voyager - Points Ledger',group:'Voyager',enabled:true,subaction_count:1},
  {id:'a2',name:'Voyager - Medals',group:'Voyager',enabled:true,subaction_count:1},
  {id:'a3',name:'Voyager - Read OBS Percentages',group:'Goals',enabled:true,subaction_count:1},
  {id:'a4',name:'Upgrade Animation Silver',group:'Goals',enabled:false,subaction_count:9},
  {id:'a5',name:'Voyager - Fleet Alerts',group:'Voyager',enabled:true,subaction_count:1},
  {id:'a6',name:'Voyager - Fleet Alerts',group:'Voyager',enabled:true,subaction_count:1},
  {id:'a7',name:'Something else',group:'',enabled:true,subaction_count:2}
];

test('Presets run the right action with the right arguments and report missing, disabled and duplicate actions',async()=>{
  let t=1000;const bot=fakeBot(LIST),a=new Actions({bot,medalsSince:()=>42,now:()=>t});
  const list=await a.actions();assert.equal(list.connected,true);assert.equal(list.actions.length,7);
  const states=Object.fromEntries(a.presets().map(p=>[p.key,p.state]));
  assert.equal(states['points.scan'],'found');assert.equal(states['goals.read'],'found');
  assert.equal(states['upgrade.silver'],'disabled');assert.equal(states['upgrade.gold'],'missing');assert.equal(states['fleet.test'],'duplicate');
  const r=await a.run({key:'points.scan'});assert.equal(r.ok,true);
  const sent=bot.calls.filter(c=>c.request==='DoAction').pop();assert.equal(sent.action.id,'a1');assert.equal(sent.args.pointsOperation,'scan');assert.match(sent.args.requestId,/^[0-9a-f-]{36}$/);
  const say=await a.run({key:'medals.say',text:'  hello   chat ',platform:'KICK'});assert.equal(say.ok,true);
  const sayCall=bot.calls.filter(c=>c.request==='DoAction').pop();assert.deepEqual(sayCall.args,{medalSay:'hello chat',medalSayPlatform:'kick'});
  const blank=await a.run({key:'medals.say',text:'',platform:'nope'});assert.equal(blank.ok,true);
  assert.match(bot.calls.filter(c=>c.request==='DoAction').pop().args.medalSay,/Voyager check/);assert.equal(bot.calls.filter(c=>c.request==='DoAction').pop().args.medalSayPlatform,'');
  const exp=await a.run({key:'medals.export'});assert.equal(exp.ok,true);assert.equal(bot.calls.filter(c=>c.request==='DoAction').pop().args.since,'42');
  const fleet=await a.run({key:'fleet.test',stage:'9',name:'',amount:'-3',months:'',platform:''});assert.equal(fleet.ok,false);assert.match(fleet.message,/2 enabled actions/);
  const off=await a.run({key:'upgrade.silver'});assert.equal(off.ok,false);assert.match(off.message,/disabled/);
  const missing=await a.run({key:'upgrade.gold'});assert.equal(missing.ok,false);assert.match(missing.message,/not in Streamer.bot/);
  const unknown=await a.run({key:'nope'});assert.equal(unknown.ok,false);
  assert.equal(a.view().history[0].message,'Unknown preset.');assert.equal(a.view().history.length,8);
});

test('Fleet test arguments are clamped and defaulted',async()=>{
  const bot=fakeBot(LIST.filter(x=>x.id!=='a6')),a=new Actions({bot});
  const r=await a.run({key:'fleet.test',stage:'9',name:'',amount:'-3',months:'abc',platform:'YouTube'});assert.equal(r.ok,true);
  const args=bot.calls.filter(c=>c.request==='DoAction').pop().args;
  assert.equal(args.fleetOperation,'test');assert.equal(args.fleetStage,'6');assert.equal(args.fleetName,'MDA009');assert.equal(args.fleetAmount,'1');assert.equal(args.fleetMonths,'1');assert.equal(args.fleetPlatform,'youtube');
  assert.match(args.requestId,/^[0-9a-f-]{36}$/);
});

test('Any listed action runs by id; unknown, disabled and stale ids are refused; the list is cached for 20 s',async()=>{
  let t=1;const bot=fakeBot(LIST),a=new Actions({bot,now:()=>t});
  await a.actions();const gets=()=>bot.calls.filter(c=>c.request==='GetActions').length;assert.equal(gets(),1);
  t=10000;await a.actions();assert.equal(gets(),1);t=30001;await a.actions();assert.equal(gets(),2);await a.actions(true);assert.equal(gets(),3);
  const ok=await a.run({id:'a7'});assert.equal(ok.ok,true);assert.equal(ok.action,'Something else');assert.deepEqual(bot.calls.pop().args,{});
  const dis=await a.run({id:'a4'});assert.equal(dis.ok,false);assert.match(dis.message,/disabled/);
  const gone=await a.run({id:'zzz',name:'Old'});assert.equal(gone.ok,false);assert.match(gone.message,/not in Streamer.bot any more/);
});

test('Offline: nothing is sent and the page is told why',async()=>{
  const bot=fakeBot(LIST,{connected:false}),a=new Actions({bot});
  assert.deepEqual(await a.actions(),{connected:false,actions:[]});
  assert.ok(a.presets().every(p=>p.state==='offline'));
  const r=await a.run({key:'goals.read'});assert.equal(r.ok,false);assert.match(r.message,/not connected/);assert.equal(bot.calls.length,0);
  assert.equal(Object.keys(PRESETS).length,a.presets().length);
});

test('Goal FX commands queue for the overlay, expire after 60 s and restart numbering per host epoch',()=>{
  let t=5000;const a=new Actions({bot:fakeBot([]),now:()=>t});
  assert.equal(a.goalFx({kind:'play',tier:'bronze'}).ok,false);assert.equal(a.goalFx({kind:'dance'}).ok,false);
  const p=a.goalFx({kind:'play',tier:'Gold'});assert.equal(p.ok,true);assert.equal(p.command.tier,'gold');assert.equal(p.command.id,1);
  const r=a.goalFx({kind:'rearm'});assert.equal(r.command.kind,'rearm');assert.equal(r.command.tier,'');
  let o=a.goalOverlay(0);assert.equal(o.epoch,5000);assert.deepEqual(o.commands.map(c=>c.id),[1,2]);
  o=a.goalOverlay(1);assert.deepEqual(o.commands.map(c=>c.id),[2]);
  assert.equal(a.view().goalFx.polling,true);t=12000;assert.equal(a.view().goalFx.polling,false);
  t=70000;assert.deepEqual(a.goalOverlay(0).commands,[]);
  assert.equal(a.view().history[0].label,'Re-arm the goal celebrations');assert.match(a.view().history[1].label,/Gold goal celebration/);
});
