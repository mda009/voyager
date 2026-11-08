import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Sources,CATALOGUE} from '../local/sources.mjs';

const req=(referer,path)=>({headers:{host:'127.0.0.1:8740',...(referer?{referer:'http://127.0.0.1:8740'+referer}:{})},url:path});

test('OBS sources: a page counts as loaded while it keeps asking the host, by its own address first and its API path second',()=>{
  let now=100000;const s=new Sources({now:()=>now});
  const by=k=>s.list().find(e=>e.key===k);
  assert.equal(by('moments').state,'off','nothing seen yet');
  s.touch(req('/control/Voyager_Moments.html','/api/moments/overlay'),'/api/moments/overlay');
  assert.equal(by('moments').state,'ok');assert.equal(by('moments').via,'page');
  assert.equal(by('bucket').state,'off','the goals strip shares the moments API but has not asked itself');
  // an older cached page sends no Referer: the API path alone marks the one page that uses it
  s.touch(req('','/api/medals/overlay'),'/api/medals/overlay');assert.equal(by('medals').state,'ok');assert.equal(by('medals').via,'api');
  now+=31000;assert.equal(by('moments').state,'stale','30 s without a poll');
  // a page on another host is ignored
  s.touch({headers:{host:'127.0.0.1:8740',referer:'http://evil.example/control/card.html'}},'/api/cards/overlay');assert.equal(by('card').via,'api');
  const sum=s.summary();assert.equal(sum.total,CATALOGUE.filter(e=>!e.sb).length);assert.equal(sum.loaded,1,'the card overlay API was just asked');
  // Streamer.bot-driven sources are listed but never judged
  assert.equal(by('giveaway').state,'sb');
});

test('OBS sources: an open event stream keeps the arena and the timer loaded until it closes',()=>{
  let now=5000;const s=new Sources({now:()=>now});
  const res=new EventEmitter();s.stream(req('/index.html?overlay=1','/api/events'),res);
  const by=k=>s.list().find(e=>e.key===k);
  assert.equal(by('versus').state,'ok');now+=600000;assert.equal(by('versus').state,'ok','still open');
  res.emit('close');assert.equal(by('versus').state,'off');
  assert.equal(by('cooldown').state,'off');
});
