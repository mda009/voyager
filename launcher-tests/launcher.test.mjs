import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import http from 'node:http';
import {launchVoyager} from '../voyager-launcher.mjs';
import {registrationCommand} from '../install-voyager-launch-link.mjs';
import {startFakeStreamerBot} from './fake-streamerbot.mjs';
const waitFor=async(check,ms=5000)=>{const end=Date.now()+ms;while(Date.now()<end){if(await check())return;await new Promise(r=>setTimeout(r,50));}throw new Error('Timed out waiting for the host.');};

const directory=dirname(dirname(fileURLToPath(import.meta.url)));
test('Page launch starts the real game, opens Versus, and a second launch preserves the running battle',async()=>{
  const data=await mkdtemp(join(tmpdir(),'voyager-launcher-')),port=18745,origin='http://127.0.0.1:'+port,opened=[];
  let child,bot;
  try{
    bot=await startFakeStreamerBot();
    const first=await launchVoyager({directory,port,env:{...process.env,VOYAGER_DATA_DIR:data},openPage:async url=>opened.push(url)});
    child=first.child;assert.ok(child);assert.equal(first.reused,false);assert.equal(opened[0],origin+'/control/Voyager_Versus.html');
    const {token}=await(await fetch(origin+'/api/admin')).json();
    // Live matches start only from chat, so connect the host to a stand-in Streamer.bot and type !versus there.
    const control=body=>fetch(origin+'/api/control',{method:'POST',headers:{'Content-Type':'application/json','X-Voyager-Token':token},body:JSON.stringify(body)}).then(r=>r.json());
    const refused=await control({type:'command',value:{login:'launcher_test',name:'Launcher Test',text:'!versus'}});
    assert.equal(refused.ok,false);
    await control({type:'connect',value:{url:bot.url}});
    await waitFor(async()=>(await(await fetch(origin+'/api/state')).json()).connection.connected);
    bot.chat('launcher_test','!versus','launcher-1');
    await waitFor(async()=>(await(await fetch(origin+'/api/state')).json()).game.phase==='calling');
    const before=(await(await fetch(origin+'/api/state')).json()).game;
    const second=await launchVoyager({directory,port,openPage:async url=>opened.push(url)});
    const after=(await(await fetch(origin+'/api/state')).json()).game;
    assert.equal(second.reused,true);assert.equal(second.child,null);assert.equal(opened.length,2);
    assert.equal(before.phase,'calling');assert.equal(after.phase,'calling');assert.equal(after.caller.login,before.caller.login);
  }finally{
    if(child&&child.exitCode===null){const done=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');await done;}
    await bot?.close();
    await rm(data,{recursive:true,force:true});
  }
});
test('A different service on the port is left alone and never opened as Voyager',async()=>{
  const port=18746,server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'application/json'});res.end('{"ok":true,"otherApp":true}');});
  await new Promise(r=>server.listen(port,'127.0.0.1',r));let opens=0;
  try{await assert.rejects(launchVoyager({directory,port,openPage:async()=>opens++}),/already in use/);assert.equal(opens,0);}
  finally{await new Promise(r=>server.close(r));}
});
test('Windows launch command quotes paths and accepts no URI-supplied command arguments',()=>{
  const command=registrationCommand('C:\\Program Files\\nodejs\\node.exe','C:\\Streams & Games\\Voyager (MDA)\\voyager-launcher.mjs');
  assert.equal(command,'"C:\\Program Files\\nodejs\\node.exe" "C:\\Streams & Games\\Voyager (MDA)\\voyager-launcher.mjs" --versus');
  assert.ok(!command.includes('%1'));
  assert.throws(()=>registrationCommand('node.exe','x" --eval "bad'),/Invalid launcher path/);
});
