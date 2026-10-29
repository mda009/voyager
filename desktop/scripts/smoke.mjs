// Launches the built Voyager app in --smoke-test mode and fails if any check fails.
// Usage: node scripts/smoke.mjs [path to Voyager.exe]   (default: release/win-unpacked/Voyager.exe)
import {spawn} from 'node:child_process';
import {readFile,rm,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here=dirname(dirname(fileURLToPath(import.meta.url)));
export async function smoke(exe,{port=18740,timeoutMs=120000,args=[]}={}){
  const dir=await mkdtemp(join(tmpdir(),'voyager-smoke-run-')),result=join(dir,'result.json');
  try{
    const child=spawn(exe,[...args,'--smoke-test','--smoke-result='+result],{env:{...process.env,VOYAGER_PORT:String(port)},stdio:'inherit'});
    const code=await new Promise((res,rej)=>{
      const t=setTimeout(()=>{child.kill();rej(new Error('The app did not finish its self-test within '+timeoutMs/1000+'s.'));},timeoutMs);
      child.once('error',e=>{clearTimeout(t);rej(e);});child.once('exit',c=>{clearTimeout(t);res(c);});
    });
    let report;try{report=JSON.parse(await readFile(result,'utf8'));}catch{throw new Error('The app exited (code '+code+') without writing a self-test report.');}
    return {code,report};
  }finally{await rm(dir,{recursive:true,force:true});}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const exe=resolve(process.argv[2]||join(here,'release','win-unpacked','Voyager.exe'));
  try{
    const {code,report}=await smoke(exe,{args:process.argv.slice(3)});
    for(const s of report.steps)console.log((s.ok?'PASS ':'FAIL ')+s.name+(s.detail&&!s.ok?' - '+s.detail:''));
    console.log(`Voyager ${report.version} · Electron ${report.electron} · Node ${report.node}`);
    if(!report.ok||code!==0){console.error('Self-test failed: '+(report.error||'exit code '+code));process.exitCode=1;}
    else console.log('Self-test passed.');
  }catch(e){console.error(e.message);process.exitCode=1;}
}
