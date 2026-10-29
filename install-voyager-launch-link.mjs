import {spawnSync} from 'node:child_process';
import {accessSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {requireNode} from './voyager-launcher.mjs';

const key='HKCU\\Software\\Classes\\voyager-versus';
export function registrationCommand(nodePath,launcherPath){
  if([nodePath,launcherPath].some(p=>!p||/["\r\n\0]/.test(p)))throw new Error('Invalid launcher path.');
  // Deliberately do not pass %1 or any URI text into the process.
  return '"'+nodePath+'" "'+launcherPath+'" --versus';
}
export function install({remove=false}={}){
  if(process.platform!=='win32')throw new Error('The page launch link setup is for Windows. Use start-voyager-control.sh on macOS/Linux.');
  requireNode();
  const folder=dirname(fileURLToPath(import.meta.url)),launcher=join(folder,'voyager-launcher.mjs');
  accessSync(launcher);accessSync(join(folder,'Voyager_Versus','local','server.mjs'));
  const command=registrationCommand(process.execPath,launcher);
  const reg=join(process.env.SystemRoot||'C:\\Windows','System32','reg.exe');
  const run=(args,required=true)=>{
    const result=spawnSync(reg,args,{encoding:'utf8',windowsHide:true});
    if(required&&(result.error||result.status!==0))throw new Error(result.error?.message||result.stderr||'Windows could not update the launch link.');
    return result;
  };
  if(remove){
    const current=run(['query',key+'\\shell\\open\\command','/ve'],false);
    if(current.status!==0){console.log('No Voyager launch link is installed for this Windows account.');return;}
    if(!current.stdout.includes(command))throw new Error('The launch link belongs to another Voyager folder. Remove it from that folder to avoid changing a different installation.');
    run(['delete',key,'/f']);console.log('Voyager page launch link removed. Your game and data were not deleted.');return;
  }
  run(['add',key,'/ve','/t','REG_SZ','/d','URL:Voyager Versus Launcher','/f']);
  run(['add',key,'/v','URL Protocol','/t','REG_SZ','/d','','/f']);
  run(['add',key+'\\shell\\open\\command','/ve','/t','REG_SZ','/d',command,'/f']);
  console.log('Ready. Open Voyager Control and click Start Voyager Versus.\nAllow your browser to open the launcher when asked.\nRun this setup again if you move the Voyager folder or reinstall Node.js.');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const args=process.argv.slice(2);if(args.some(a=>a!=='--remove'))throw new Error('Unknown setup option.');
    install({remove:args.includes('--remove')});
  }catch(e){console.error('Voyager launch-link setup: '+e.message);process.exitCode=1;}
}
