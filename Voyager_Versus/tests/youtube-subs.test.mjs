import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {YoutubeSubs,parseChannel} from '../local/youtube-subs.mjs';

const KEY='AIza'+'x'.repeat(35);
test('channel names: handle, id or link',()=>{
  assert.deepEqual(parseChannel('@StarlingVex'),{kind:'handle',value:'@StarlingVex'});
  assert.deepEqual(parseChannel('https://www.youtube.com/@StarlingVex/live'),{kind:'handle',value:'@StarlingVex'});
  assert.deepEqual(parseChannel('https://youtube.com/channel/UC'+'a'.repeat(22)),{kind:'id',value:'UC'+'a'.repeat(22)});
  assert.equal(parseChannel('my channel'),null);
});
test('reads the subscriber count with the key in a header, every 5 minutes, and never shows the key',async()=>{
  let now=1e12,calls=[],answer={ok:true,status:200,json:async()=>({items:[{snippet:{title:'Starling Vex'},statistics:{subscriberCount:'987'}}]})};const got=[];
  const y=await new YoutubeSubs({dataDir:await mkdtemp(join(tmpdir(),'voyager-yt-')),now:()=>now,api:'https://yt.test/v3',fetcher:async(url,o)=>{calls.push([url,o.headers['X-goog-api-key']]);return answer;},onReading:r=>got.push(r)}).load();
  assert.equal(await y.tick(),null,'nothing to do without a key');
  assert.throws(()=>y.configure({apiKey:'hello'}),/API key/);assert.throws(()=>y.configure({channel:'not a channel'}),/handle/);
  y.configure({channel:'@StarlingVex',apiKey:KEY});assert.equal(JSON.stringify(y.view()).includes(KEY),false);assert.equal(y.view().hasKey,true);
  assert.equal((await y.tick()).value,987);assert.deepEqual(calls[0],['https://yt.test/v3/channels?part=statistics,snippet&forHandle=%40StarlingVex',KEY]);assert.equal(calls[0][0].includes(KEY),false);
  assert.equal(got[0].value,987);assert.equal(y.view().title,'Starling Vex');
  now+=60000;assert.equal(await y.tick(),null,'not again within 5 minutes');assert.equal(await y.tick({wanted:false}),null);
  now+=5*60000;answer={ok:true,status:200,json:async()=>({items:[{statistics:{hiddenSubscriberCount:true}}]})};assert.equal(await y.tick(),null);assert.match(y.view().error,/hides its subscriber count/);
  now+=61000;answer={ok:false,status:403,json:async()=>({error:{message:'API key not valid.'}})};await y.tick();assert.match(y.view().error,/refused the API key/);
  y.configure({manual:1001});assert.deepEqual([got.at(-1).value,got.at(-1).source],[1001,'manual']);
  await y.persist();const again=await new YoutubeSubs({dataDir:y.dataDir}).load();assert.equal(again.view().reading.value,1001);assert.equal(again.view().hasKey,true);
  y.configure({clearKey:true});assert.equal(y.view().hasKey,false);await y.persist();assert.equal((await readFile(y.file,'utf8')).includes(KEY),false);
});
