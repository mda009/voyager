import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectOldInstall,prepareUserFiles,linkPolicy,pageUrl,startHost,stopHost,voyagerPaths,readSettings,writeSettings} from '../core.mjs';

const bundleDir=dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test('An old Voyager folder is recognised from the main folder, the Versus folder or the data folder',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-desktop-'));
  try{
    const data=join(dir,'Voyager_Giveaway','Voyager_Versus','local','data');
    await mkdir(data,{recursive:true});await writeFile(join(data,'rankings.json'),'[]');await writeFile(join(dir,'Voyager_Giveaway','config.js'),'x');
    const main=await inspectOldInstall(join(dir,'Voyager_Giveaway'));
    assert.equal(main.valid,true);assert.equal(main.dataDir,data);assert.deepEqual(main.files,['config.js']);
    assert.equal((await inspectOldInstall(join(dir,'Voyager_Giveaway','Voyager_Versus'))).dataDir,data);
    assert.equal((await inspectOldInstall(data)).dataDir,data);
    await mkdir(join(dir,'empty'));assert.equal((await inspectOldInstall(join(dir,'empty'))).valid,false);
  }finally{await rm(dir,{recursive:true,force:true});}
});

test('config.js is imported once, defaults are used otherwise, and an existing copy is never overwritten',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-desktop-'));
  try{
    const bundle=join(dir,'bundle'),old=join(dir,'old'),user=join(dir,'user');
    await mkdir(bundle);await mkdir(old);
    await writeFile(join(bundle,'config.js'),'default');await writeFile(join(bundle,'stream-command-settings.js'),'default-stats');
    await writeFile(join(old,'config.js'),'mine');
    assert.deepEqual(await prepareUserFiles({bundleDir:bundle,userFiles:user,importFrom:old}),{'config.js':'imported','stream-command-settings.js':'default'});
    assert.equal(await readFile(join(user,'config.js'),'utf8'),'mine');
    await writeFile(join(user,'config.js'),'edited later');
    assert.equal((await prepareUserFiles({bundleDir:bundle,userFiles:user,importFrom:old}))['config.js'],'kept');
    assert.equal(await readFile(join(user,'config.js'),'utf8'),'edited later');
  }finally{await rm(dir,{recursive:true,force:true});}
});

test('Only local Voyager pages stay in the app window',()=>{
  assert.equal(linkPolicy('http://127.0.0.1:8740/control/Voyager_Guide.html'),'app');
  assert.equal(linkPolicy('http://localhost:8740/?overlay=1'),'app');
  assert.equal(linkPolicy('http://127.0.0.1:8080/'),'external');
  assert.equal(linkPolicy('https://nodejs.org/'),'external');
  assert.equal(linkPolicy('voyager-versus://start'),'versus');
  assert.equal(linkPolicy('file:///C:/Windows/system32/calc.exe'),'block');
  assert.equal(linkPolicy('javascript:alert(1)'),'block');
  assert.equal(pageUrl(8740,'check'),'http://127.0.0.1:8740/control/Voyager_System_Check.html');
  assert.equal(pageUrl(8740,'nope'),'http://127.0.0.1:8740/control/Voyager_Command_Center.html');
});

test('Settings survive a corrupt file',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-desktop-'));
  try{
    const {settingsFile}=voyagerPaths(dir);
    await writeFile(settingsFile,'{broken');assert.deepEqual(await readSettings(settingsFile),{});
    await writeSettings(settingsFile,{setupDone:true});assert.deepEqual(await readSettings(settingsFile),{setupDone:true});
  }finally{await rm(dir,{recursive:true,force:true});}
});

test('The app starts the bundled host with its own data folder, imports old data, serves your config, and stops it cleanly',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-desktop-')),port=18761;
  const {dataDir,userFiles}=voyagerPaths(join(dir,'userData'));
  const old=join(dir,'old','Voyager_Versus','local','data');
  await mkdir(old,{recursive:true});await writeFile(join(old,'rankings.json'),JSON.stringify([{login:'ace',name:'Ace',wins:2,losses:0,draws:0,battles:2}]));
  await mkdir(userFiles,{recursive:true});await writeFile(join(userFiles,'config.js'),'window.VOYAGER_CONFIG={password:"desktop"};');
  let host;
  try{
    host=await startHost({bundleDir,port,dataDir,userFiles,importFrom:old});
    assert.equal(host.reused,false);assert.ok(host.child);
    assert.equal(JSON.parse(await readFile(join(dataDir,'rankings.json'),'utf8'))[0].login,'ace');
    assert.match(await(await fetch(host.origin+'/control/config.js')).text(),/desktop/);
    const again=await startHost({bundleDir,port,dataDir,userFiles});
    assert.equal(again.reused,true);assert.equal(again.child,null);
    assert.equal(await stopHost({origin:host.origin,child:host.child}),'saved');
    assert.equal(host.child.exitCode,0);
  }finally{if(host?.child?.exitCode===null)host.child.kill();await rm(dir,{recursive:true,force:true});}
});
