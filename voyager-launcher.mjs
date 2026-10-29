import {spawn} from 'node:child_process';
import {access} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

const folder=dirname(fileURLToPath(import.meta.url));
export function requireNode(){
  const [major,minor]=process.versions.node.split('.').map(Number);
  if(major<22||major===22&&minor<4)throw new Error('Install Node.js 22.4 or newer from https://nodejs.org/ and try again.');
}
export async function inspectHost(origin){
  try{
    const response=await fetch(origin+'/api/health',{signal:AbortSignal.timeout(1200),redirect:'error'});
    if(!response.ok)return 'occupied';
    const data=await response.json();
    return data.ok===true&&typeof data.version==='string'&&data.voyagerControl===true?'ready':'occupied';
  }catch(e){
    // Only a refused connection means it is safe to try starting our host.
    return e.cause?.code==='ECONNREFUSED'?'offline':'occupied';
  }
}
export function openBrowser(url){
  const command=process.platform==='win32'?'cmd.exe':process.platform==='darwin'?'open':'xdg-open';
  // This URL is built only from a validated local port and one of two fixed paths.
  const args=process.platform==='win32'?['/d','/c','start','',url]:[url];
  return new Promise((resolve,reject)=>{
    const browser=spawn(command,args,{stdio:'ignore',windowsHide:true});
    browser.once('error',reject);browser.once('exit',code=>code===0?resolve():reject(new Error('Could not open the browser. Open this address manually: '+url)));
  });
}
export async function launchVoyager({directory=folder,port=Number(process.env.VOYAGER_PORT||8740),page='versus',openPage=openBrowser,env=process.env}={}){
  requireNode();
  if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid VOYAGER_PORT.');
  if(!['home','versus'].includes(page))throw new Error('Unknown Voyager page.');
  const origin='http://127.0.0.1:'+port,url=origin+'/control/'+(page==='home'?'Voyager_Command_Center.html':'Voyager_Versus.html');
  const state=await inspectHost(origin);
  if(state==='ready'){await openPage(url);return {child:null,reused:true,url};}
  if(state!=='offline')throw new Error('Port '+port+' is already in use or not responding. Close the old standalone Voyager launcher, then try again.');
  const server=join(directory,'Voyager_Versus','local','server.mjs');
  await access(server);await access(join(directory,'Voyager_Command_Center.html'));
  console.log('Starting Voyager. Keep this window open while streaming.');
  const child=spawn(process.execPath,[server],{cwd:directory,env:{...env,VOYAGER_PORT:String(port)},stdio:'inherit',windowsHide:false});
  let spawnError;child.once('error',e=>spawnError=e);
  for(let i=0;i<60;i++){
    await delay(200);
    if(spawnError)throw spawnError;
    const status=await inspectHost(origin);
    if(status==='ready'){
      try{await openPage(url);}catch(e){console.error(e.message);console.log('Open Voyager manually: '+url);}
      // Another click may have won the port race; use its running host.
      return {child:child.exitCode===null?child:null,reused:child.exitCode!==null,url};
    }
    if(child.exitCode!==null)throw new Error('Voyager could not start. Read the message above and run START-VOYAGER-CONTROL.bat if needed.');
  }
  // Never terminate a game just because a readiness request was slow.
  console.error('Voyager is still starting. Check this window, then open '+url);
  return {child,reused:false,url};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const args=process.argv.slice(2);
    if(args.some(arg=>!['--home','--versus'].includes(arg)))throw new Error('Use START-VOYAGER-CONTROL.bat or the Start Voyager Versus button.');
    await launchVoyager({page:args.includes('--versus')?'versus':'home'});
    // An active child keeps this launcher and its console alive.
  }catch(e){
    console.error('\nVoyager launcher: '+e.message);process.exitCode=1;
    if(process.stdin.isTTY&&process.argv.includes('--versus')){
      const {createInterface}=await import('node:readline/promises');
      const prompt=createInterface({input:process.stdin,output:process.stdout});await prompt.question('Press Enter to close.');prompt.close();
    }
  }
}
