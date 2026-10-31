import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,mkdir,copyFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
test('Local host serves assets, rejects unauthorized controls and shares authoritative state',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-test-')),port=18743,base=`http://127.0.0.1:${port}`;
  const child=spawn(process.execPath,[fileURLToPath(new URL('../local/server.mjs',import.meta.url))],{env:{...process.env,VOYAGER_DATA_DIR:dir,VOYAGER_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Host startup timeout')),5000);child.stdout.on('data',d=>{if(d.toString().includes('Control panel:')){clearTimeout(timer);resolve();}});child.once('exit',code=>reject(new Error('Server exited '+code)));});
    assert.equal((await fetch(base+'/')).status,200);
    const material=await fetch(base+'/materials/hull-basecolor-4096.webp');
    assert.equal(material.status,200);assert.equal(material.headers.get('content-type'),'image/webp');
    assert.ok((await material.arrayBuffer()).byteLength>100000);
    const ship=await fetch(base+'/ships/paladin.ctm');
    assert.equal(ship.status,200);assert.equal(ship.headers.get('content-type'),'application/octet-stream');
    const mesh=new Uint8Array(await ship.arrayBuffer());assert.equal(new TextDecoder().decode(mesh.slice(0,4)),'OCTM');
    assert.ok(new DataView(mesh.buffer).getUint32(12,true)>50000);
    assert.equal((await fetch(base+'/local/data/rankings.json')).status,404);
    assert.equal((await fetch(base+'/api/admin',{headers:{Origin:'https://evil.example'}})).status,403);
    assert.equal((await fetch(base+'/api/control',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"type":"demo"}'})).status,403);
    const {token}=await(await fetch(base+'/api/admin')).json();
    const post=async data=>(await fetch(base+'/api/control',{method:'POST',headers:{'Content-Type':'application/json','X-Voyager-Token':token},body:JSON.stringify(data)})).json();
    assert.equal((await fetch(base+'/api/live-overlay/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,403);
    assert.equal((await fetch(base+'/api/live-overlay',{headers:{Origin:'https://evil.example'}})).status,403);
    const livePost=async(path,data)=>fetch(base+'/api/live-overlay/'+path,{method:'POST',headers:{'Content-Type':'application/json','X-Voyager-Token':token},body:JSON.stringify(data)});
    assert.equal((await livePost('feed',{schema:1,demo:true,platforms:{}})).status,400);
    assert.equal((await livePost('feed',{schema:1,connected:true,platforms:{twitch:{metrics:{viewers:{value:123,at:Date.now()}}}}})).status,200);
    await livePost('settings',{visible:false,opacity:20});
    const overlay=await (await fetch(base+'/api/live-overlay')).json();assert.equal(overlay.config.visible,false);assert.equal(overlay.feed.platforms.twitch.metrics.viewers.value,123);
    const offlineRepair=await post({type:'rewards_preview'});assert.equal(offlineRepair.ok,false);assert.match(offlineRepair.message,/connection/);
    const badPlan=await post({type:'rewards_apply',value:{planId:'invalid'}});assert.equal(badPlan.ok,false);assert.match(badPlan.message,/Preview/);
    assert.equal((await post({type:'demo'})).ok,false);
    assert.equal((await post({type:'command',value:{login:'pilot_one',name:'Pilot One',text:'!versus'}})).ok,false);
    const a=await(await fetch(base+'/api/state')).json(),b=await(await fetch(base+'/api/state')).json();
    assert.equal(a.game.phase,'lobby');assert.equal(a.game.caller,null);assert.deepEqual(a.game.caller,b.game.caller);assert.equal(a.game.round,0);
    const abort=new AbortController();const response=await fetch(base+'/api/events',{signal:abort.signal});
    assert.match(response.headers.get('content-type'),/event-stream/);
    const {value}=await response.body.getReader().read();assert.match(new TextDecoder().decode(value),/"phase":"lobby"/);abort.abort();
    assert.equal((await post({type:'command',value:{login:'pilot_two',name:'Pilot Two',text:'!versus'}})).ok,false);
    const matched=(await(await fetch(base+'/api/state')).json()).game;assert.equal(matched.phase,'lobby');assert.equal(matched.players.length,0);assert.equal(matched.round,0);
    assert.equal((await post({type:'connect',value:{url:'file:///etc/passwd'}})).ok,undefined);
    assert.equal((await post({type:'ready_alert_test'})).ok,true);
    const ready=(await(await fetch(base+'/api/state')).json());
    assert.equal(ready.announcements.readyAlert.test,true);assert.equal(ready.announcements.readyAlert.durationMs,12000);
    assert.equal(ready.game.phase,'lobby');assert.equal(ready.game.round,0);
    assert.equal((await fetch(base+'/versuscall.html')).status,200);
    const audio=await fetch(base+'/Versus_AreYouReady.wav',{headers:{Range:'bytes=0-43'}});
    assert.equal(audio.status,206);assert.equal((await audio.arrayBuffer()).byteLength,44);
    await post({type:'pause'});const before=(await(await fetch(base+'/api/state')).json()).game.time;
    await new Promise(r=>setTimeout(r,250));assert.equal((await(await fetch(base+'/api/state')).json()).game.time,before);
  }finally{if(child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}await rm(dir,{recursive:true,force:true});}
});

test('Bundled Voyager Control and the game share one host without exposing game runtime files',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-control-test-')),bundle=join(dir,'Voyager_Versus'),port=18744,base=`http://127.0.0.1:${port}`;
  await mkdir(join(bundle,'local'),{recursive:true});await mkdir(join(bundle,'dist'),{recursive:true});
  for(const file of ['server.mjs','rewards.mjs','availability.mjs','streamerbot.mjs','stream-entries.mjs','live-overlay.mjs','match-chat.mjs','pilot-leaderboard.mjs','public-site.mjs','connection-config.mjs','community.mjs','boss.mjs','medals.mjs'])await copyFile(fileURLToPath(new URL('../local/'+file,import.meta.url)),join(bundle,'local',file));
  await copyFile(fileURLToPath(new URL('../dist/engine.mjs',import.meta.url)),join(bundle,'dist/engine.mjs'));
  await writeFile(join(bundle,'dist/index.html'),'<h1>Game</h1>');
  await writeFile(join(dir,'Voyager_Command_Center.html'),'<a href="Voyager_Versus.html">Voyager Versus</a>');
  await writeFile(join(dir,'Voyager_Versus.html'),'<iframe src="/?embedded=1"></iframe>');
  await writeFile(join(dir,'versus-control.js'),'const host="shared";');
  await writeFile(join(bundle,'local/private.txt'),'must not be served');
  const child=spawn(process.execPath,[join(bundle,'local/server.mjs')],{env:{...process.env,VOYAGER_DATA_DIR:join(dir,'data'),VOYAGER_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Host startup timeout')),5000);child.stdout.on('data',d=>{if(d.toString().includes('Control panel:')){clearTimeout(timer);resolve();}});child.once('exit',code=>reject(new Error('Server exited '+code)));});
    assert.equal((await(await fetch(base+'/api/health')).json()).voyagerControl,true);
    assert.match(await(await fetch(base+'/control/')).text(),/Voyager Versus/);
    assert.match(await(await fetch(base+'/control/Voyager_Versus.html')).text(),/embedded=1/);
    assert.match((await fetch(base+'/control/versus-control.js')).headers.get('content-type'),/javascript/);
    assert.equal((await fetch(base+'/?embedded=1')).status,200);
    for(const path of ['/control/Voyager_Versus/local/private.txt','/control//Voyager_Versus/local/private.txt','/control/Voyager_Versus/local/data/economy.json'])assert.equal((await fetch(base+path)).status,404,path);
    assert.equal((await fetch(base+'/api/admin',{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  }finally{if(child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}await rm(dir,{recursive:true,force:true});}
});
