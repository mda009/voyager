import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile,copyFile,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const local=['server.mjs','rewards.mjs','availability.mjs','streamerbot.mjs','stream-entries.mjs','live-overlay.mjs','match-chat.mjs','pilot-leaderboard.mjs','public-site.mjs','connection-config.mjs','community.mjs'];
async function bundle(dir){
  const root=join(dir,'Voyager_Versus');
  await mkdir(join(root,'local'),{recursive:true});await mkdir(join(root,'dist'),{recursive:true});
  for(const f of local)await copyFile(fileURLToPath(new URL('../local/'+f,import.meta.url)),join(root,'local',f));
  await copyFile(fileURLToPath(new URL('../dist/engine.mjs',import.meta.url)),join(root,'dist/engine.mjs'));
  await copyFile(fileURLToPath(new URL('../package.json',import.meta.url)),join(root,'package.json'));
  return root;
}
async function start(root,port,env){
  const base={...process.env};delete base.VOYAGER_DATA_DIR;delete base.VOYAGER_IMPORT_FROM;
  const child=spawn(process.execPath,[join(root,'local/server.mjs')],{env:{...base,...env,VOYAGER_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('Host startup timeout')),5000);child.stdout.on('data',d=>{if(d.toString().includes('Control panel:')){clearTimeout(t);resolve();}});child.once('exit',c=>reject(new Error('Server exited '+c)));});
  return child;
}
async function stop(child){if(child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}}
const rankings=[{login:'pilot_one',name:'Pilot One',wins:3,losses:1,draws:0,battles:4}];

test('Live data defaults to the user data folder and old local/data is copied once without being removed',{skip:process.platform==='win32'},async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-datadir-')),root=await bundle(dir),xdg=join(dir,'xdg'),port=18751;
  await mkdir(join(root,'local/data'),{recursive:true});
  await writeFile(join(root,'local/data/rankings.json'),JSON.stringify(rankings));
  let child;
  try{
    child=await start(root,port,{XDG_DATA_HOME:xdg,HOME:dir});
    const target=join(xdg,'voyager','data');
    assert.deepEqual(JSON.parse(await readFile(join(target,'rankings.json'),'utf8')),rankings);
    await access(join(root,'local/data/rankings.json'));
    assert.match(await readFile(join(root,'local/data/MOVED_TO_APPDATA.txt'),'utf8'),/voyager[\\/]data/);
    const base='http://127.0.0.1:'+port,{token}=await(await fetch(base+'/api/admin')).json();
    assert.equal((await fetch(base+'/api/system')).status,403);
    const system=await(await fetch(base+'/api/system',{headers:{'X-Voyager-Token':token}})).json();
    assert.equal(system.dataDir,target);assert.equal(system.dataWritable,true);assert.equal(system.version,'2.16.0');
  }finally{if(child)await stop(child);await rm(dir,{recursive:true,force:true});}
});

test('An existing data folder is never overwritten by an older install folder',{skip:process.platform==='win32'},async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-datadir-')),root=await bundle(dir),xdg=join(dir,'xdg'),port=18752,target=join(xdg,'voyager','data');
  await mkdir(join(root,'local/data'),{recursive:true});await mkdir(target,{recursive:true});
  await writeFile(join(root,'local/data/rankings.json'),JSON.stringify([{login:'old',name:'old',wins:0,losses:0,draws:0,battles:0}]));
  await writeFile(join(target,'rankings.json'),JSON.stringify(rankings));
  let child;
  try{
    child=await start(root,port,{XDG_DATA_HOME:xdg,HOME:dir});
    assert.deepEqual(JSON.parse(await readFile(join(target,'rankings.json'),'utf8')),rankings);
  }finally{if(child)await stop(child);await rm(dir,{recursive:true,force:true});}
});

test('The desktop app can import a chosen old folder into its own data folder',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-datadir-')),root=await bundle(dir),old=join(dir,'old-install','data'),target=join(dir,'app-data'),port=18753;
  await mkdir(old,{recursive:true});await writeFile(join(old,'rankings.json'),JSON.stringify(rankings));
  let child;
  try{
    child=await start(root,port,{VOYAGER_DATA_DIR:target,VOYAGER_IMPORT_FROM:old});
    assert.deepEqual(JSON.parse(await readFile(join(target,'rankings.json'),'utf8')),rankings);
  }finally{if(child)await stop(child);await rm(dir,{recursive:true,force:true});}
});

test('The desktop app serves your own config.js from your user folder, falling back to the bundled copy',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-userfiles-')),root=await bundle(dir),user=join(dir,'user'),port=18754,base='http://127.0.0.1:'+port;
  await writeFile(join(dir,'Voyager_Command_Center.html'),'<h1>Control</h1>');
  await writeFile(join(dir,'config.js'),'window.VOYAGER_CONFIG={password:""};');
  await writeFile(join(dir,'stream-command-settings.js'),'window.bundled=true;');
  await mkdir(user,{recursive:true});await writeFile(join(user,'config.js'),'window.VOYAGER_CONFIG={password:"mine"};');
  let child;
  try{
    child=await start(root,port,{VOYAGER_DATA_DIR:join(dir,'data'),VOYAGER_USER_FILES:user});
    assert.match(await(await fetch(base+'/control/config.js')).text(),/mine/);
    assert.match(await(await fetch(base+'/control/stream-command-settings.js')).text(),/bundled/);
    assert.equal((await fetch(base+'/control/../user/config.js')).status,404);
  }finally{if(child)await stop(child);await rm(dir,{recursive:true,force:true});}
});
