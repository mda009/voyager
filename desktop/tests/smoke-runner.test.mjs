import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,chmod} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {smoke} from '../scripts/smoke.mjs';

// A stand-in "app" so the runner's plumbing can be checked without Electron.
async function fakeApp(body){
  const dir=await mkdtemp(join(tmpdir(),'voyager-fake-app-')),file=join(dir,'app.mjs');
  await writeFile(file,`import {writeFileSync} from 'node:fs';const out=process.argv.find(a=>a.startsWith('--smoke-result=')).slice(15);${body}`);
  return {dir,args:[file]};
}
test('A passing self-test report is returned with the exit code',{skip:process.platform==='win32'},async()=>{
  const {dir,args}=await fakeApp(`writeFileSync(out,JSON.stringify({ok:true,version:'2.9.0',steps:[{name:'x',ok:true}],port:process.env.VOYAGER_PORT}));`);
  try{const r=await smoke(process.execPath,{args,port:18799});assert.equal(r.code,0);assert.equal(r.report.ok,true);assert.equal(r.report.port,'18799');}
  finally{await rm(dir,{recursive:true,force:true});}
});
test('A missing report or a hung app is a failure',{skip:process.platform==='win32'},async()=>{
  const a=await fakeApp(`process.exit(3);`),b=await fakeApp(`setInterval(()=>{},1000);`);
  try{
    await assert.rejects(smoke(process.execPath,{args:a.args}),/without writing a self-test report/);
    await assert.rejects(smoke(process.execPath,{args:b.args,timeoutMs:800}),/did not finish/);
  }finally{await rm(a.dir,{recursive:true,force:true});await rm(b.dir,{recursive:true,force:true});}
});
