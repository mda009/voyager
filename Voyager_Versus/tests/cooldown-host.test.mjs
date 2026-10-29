import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cooldownView} from '../dist/cooldown-state.mjs';

test('OBS reloads and host restarts retain the same saved cooldown without writes',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-cooldown-')),port=18747,base=`http://127.0.0.1:${port}`;
  const deadline=Date.now()+900_000;
  const economy=JSON.stringify({cooldownUntil:deadline,cooldownMs:2_700_000,rewards:[],availability:null});
  await writeFile(join(dir,'economy.json'),economy);
  let child;
  async function start(){
    child=spawn(process.execPath,[fileURLToPath(new URL('../local/server.mjs',import.meta.url))],{env:{...process.env,VOYAGER_DATA_DIR:dir,VOYAGER_PORT:String(port)},stdio:['ignore','pipe','pipe']});
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Host startup timeout')),5000);child.stdout.on('data',d=>{if(d.toString().includes('Control panel:')){clearTimeout(timer);resolve();}});child.once('exit',code=>{clearTimeout(timer);reject(new Error('Host exited '+code));});});
  }
  async function stop(){if(child&&child.exitCode===null){const exited=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');await exited;}child=null;}
  try{
    await start();
    for(const file of ['cooldown.html','cooldown.css','cooldown.mjs','cooldown-state.mjs','brand/fonts.css','brand/fonts/rajdhani-700.ttf'])assert.equal((await fetch(base+'/'+file)).status,200,file);
    for(let i=0;i<2;i++){
      const abort=new AbortController();const response=await fetch(base+'/api/events',{signal:abort.signal});
      const {value}=await response.body.getReader().read();
      const event=JSON.parse(new TextDecoder().decode(value).split('\n\n')[0].slice(6));abort.abort();
      assert.equal(event.game.cooldownUntil,deadline);assert.ok(Number.isFinite(event.serverTime));
      assert.equal(cooldownView(event).ready,false);assert.match(cooldownView(event).value,/^1[45]:[0-5]\d$/);
    }
    await stop();await start();
    const packet=await(await fetch(base+'/api/state')).json();assert.equal(packet.game.cooldownUntil,deadline);assert.ok(packet.game.cooldownRemaining<=900);
    assert.equal(await readFile(join(dir,'economy.json'),'utf8'),economy);
  }finally{await stop();await rm(dir,{recursive:true,force:true});}
});
