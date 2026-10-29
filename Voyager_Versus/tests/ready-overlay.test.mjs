import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const html=readFileSync(new URL('../dist/versuscall.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function browser(storage=new Map()){
  const elements=new Map(),timers=new Map(),events={};let stream,tid=0;
  const node=id=>{
    if(!elements.has(id)){
      const classes=new Set();
      elements.set(id,{hidden:true,textContent:'',style:{},duration:6.8,currentTime:0,plays:0,
        classList:{add:(...c)=>c.forEach(x=>classes.add(x)),remove:(...c)=>c.forEach(x=>classes.delete(x)),toggle:(c,on)=>on?classes.add(c):classes.delete(c),contains:c=>classes.has(c)},
        getAnimations:()=>[],play(){this.plays++;return Promise.resolve();},pause(){}});
    }
    return elements.get(id);
  };
  const context={URLSearchParams,Date,Number,Math,JSON,Promise,document:{getElementById:node},
    location:{search:'',protocol:'http:',hostname:'127.0.0.1',origin:'http://127.0.0.1:8740'},
    performance:{now:()=>0},matchMedia:()=>({matches:false}),requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},
    setTimeout:(fn,ms)=>{timers.set(++tid,{fn,ms});return tid;},clearTimeout:id=>timers.delete(id),
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    EventSource:class{constructor(){stream=this;}close(){}},addEventListener:(key,fn)=>events[key]=fn};
  runInNewContext(script,context);
  return {node,storage,timers,consume:packet=>stream.onmessage({data:JSON.stringify(packet)}),events};
}
const packet=(id,elapsed=0,test=false)=>({serverTime:Date.now(),announcements:{message:'Chat confirmation pending.',overlayMessage:'Automatic alert sent.',readyAlert:{id,startedAt:Date.now()-elapsed,durationMs:12000,test}}});

test('The existing transparent browser source automatically plays audio and typing once, then hides',async()=>{
  const b=browser();assert.equal(b.node('alert').classList.contains('playing'),false);
  const p=packet('first');b.consume(p);await Promise.resolve();
  assert.equal(b.node('voice').plays,1);assert.equal(b.node('alert').classList.contains('playing'),true);
  b.consume(p);assert.equal(b.node('voice').plays,1);
  assert.ok([...b.timers.values()].some(t=>t.ms<=12000&&t.ms>11900));
  for(const timer of b.timers.values())timer.fn();
  assert.equal(b.node('alert').classList.contains('playing'),false);
  const reloaded=browser(b.storage);reloaded.consume(p);assert.equal(reloaded.node('voice').plays,0);
});

test('A brief reconnect can join a still-live cue, but expired or future cues do not play',()=>{
  const b=browser();b.consume(packet('late',6000));assert.equal(b.node('voice').plays,1);assert.ok(b.node('voice').currentTime>=6);
  const fresh=browser();fresh.consume(packet('expired',12001));fresh.consume(packet('future',-1000));assert.equal(fresh.node('voice').plays,0);
});

test('A viewer call cancels the availability banner; explicit preview remains independent',()=>{
  const b=browser();b.consume(packet('live'));b.consume({serverTime:Date.now(),announcements:{readyAlert:null}});
  assert.equal(b.node('alert').classList.contains('playing'),false);
  b.consume(packet('test',0,true));assert.equal(b.node('voice').plays,2);
  b.node('replay').onclick();b.consume({serverTime:Date.now(),announcements:{readyAlert:null}});
  assert.equal(b.node('alert').classList.contains('playing'),true);
});
