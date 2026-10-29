import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile,copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readConnection,updateConnection} from '../local/connection-config.mjs';

const sample=`// Edit in Notepad, save, then refresh the OBS browser source.
window.VOYAGER_CONFIG = {
  host: "127.0.0.1",
  port: 8080,
  password: "",
  // keep this comment
  requireAuthentication: false,
  actionName: "Voyager - Broadcast Members",
  layout: "columns", // columns, grid, or strip
};`;

test('Reads the connection without revealing the password',()=>{
  assert.deepEqual(readConnection(sample),{host:'127.0.0.1',port:8080,hasPassword:false,requireAuthentication:false});
  assert.equal(readConnection(sample.replace('password: ""','password: "s3cret"')).hasPassword,true);
  assert.throws(()=>readConnection('var x = 1;'),/VOYAGER_CONFIG/);
});

test('Updates only the connection lines and keeps comments and other settings',()=>{
  const next=updateConnection(sample,{host:'192.168.1.20',port:'8081',password:'pa"ss',requireAuthentication:true});
  assert.deepEqual(readConnection(next),{host:'192.168.1.20',port:8081,hasPassword:true,requireAuthentication:true});
  assert.match(next,/password: "pa\\"ss",/);
  assert.match(next,/\/\/ keep this comment/);assert.match(next,/layout: "columns", \/\/ columns, grid, or strip/);
  const kept=updateConnection(next,{host:'localhost'});assert.match(kept,/password: "pa\\"ss"/);
  assert.equal(readConnection(updateConnection(next,{clearPassword:true})).hasPassword,false);
});

test('Rejects bad hosts, ports and passwords, and adds a missing key',()=>{
  assert.throws(()=>updateConnection(sample,{host:'evil"; alert(1)//'}),/computer name/);
  assert.throws(()=>updateConnection(sample,{port:70000}),/port/);
  assert.throws(()=>updateConnection(sample,{password:'a\nb'}),/cannot be saved/);
  const added=updateConnection(sample.replace(/\n\s*requireAuthentication: false,/,''),{requireAuthentication:true});
  assert.equal(readConnection(added).requireAuthentication,true);
});

const local=['server.mjs','rewards.mjs','availability.mjs','streamerbot.mjs','stream-entries.mjs','live-overlay.mjs','match-chat.mjs','pilot-leaderboard.mjs','public-site.mjs','connection-config.mjs'];
test('Settings API edits the config.js in the user folder and needs the local token',{skip:process.platform==='win32'},async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-settings-')),root=join(dir,'Voyager_Versus'),user=join(dir,'user'),port=18761;
  await mkdir(join(root,'local'),{recursive:true});await mkdir(join(root,'dist'),{recursive:true});
  for(const f of local)await copyFile(fileURLToPath(new URL('../local/'+f,import.meta.url)),join(root,'local',f));
  await copyFile(fileURLToPath(new URL('../dist/engine.mjs',import.meta.url)),join(root,'dist/engine.mjs'));
  await copyFile(fileURLToPath(new URL('../package.json',import.meta.url)),join(root,'package.json'));
  await writeFile(join(dir,'Voyager_Command_Center.html'),'<!doctype html>');await writeFile(join(dir,'config.js'),sample);
  const base={...process.env};delete base.VOYAGER_DATA_DIR;delete base.VOYAGER_IMPORT_FROM;
  const child=spawn(process.execPath,[join(root,'local/server.mjs')],{env:{...base,VOYAGER_PORT:String(port),VOYAGER_DATA_DIR:join(dir,'data'),VOYAGER_USER_FILES:user},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((ok,fail)=>{const t=setTimeout(()=>fail(new Error('Host startup timeout')),5000);child.stdout.on('data',d=>{if(d.toString().includes('Control panel:')){clearTimeout(t);ok();}});child.once('exit',c=>fail(new Error('exit '+c)));});
    const url='http://127.0.0.1:'+port,{token}=await(await fetch(url+'/api/admin')).json(),h={'X-Voyager-Token':token,'Content-Type':'application/json'};
    assert.equal((await fetch(url+'/api/settings/connection')).status,403);
    const before=await(await fetch(url+'/api/settings/connection',{headers:h})).json();
    assert.equal(before.host,'127.0.0.1');assert.equal(before.password,undefined);
    const saved=await(await fetch(url+'/api/settings/connection',{method:'POST',headers:h,body:JSON.stringify({host:'10.0.0.5',port:8085,password:'abc'})})).json();
    assert.equal(saved.ok,true);assert.equal(saved.hasPassword,true);assert.equal(saved.password,undefined);
    const written=await readFile(join(user,'config.js'),'utf8');assert.match(written,/host: "10\.0\.0\.5"/);assert.match(written,/actionName/);
    assert.equal(await readFile(join(dir,'config.js'),'utf8'),sample);
    const bad=await fetch(url+'/api/settings/connection',{method:'POST',headers:h,body:JSON.stringify({port:'x'})});assert.equal(bad.status,400);
    const served=await(await fetch(url+'/control/config.js')).text();assert.match(served,/10\.0\.0\.5/);
  }finally{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
});
