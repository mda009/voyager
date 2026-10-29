// Electron-free logic for the Voyager desktop app, so it can be tested with plain Node.
import {copyFile,mkdir,readdir,readFile,writeFile,stat,access} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';

export const DEFAULT_PORT=8740;
export const USER_FILES=['config.js','stream-command-settings.js'];

export function voyagerPaths(userData){
  return {dataDir:join(userData,'data'),userFiles:userData,settingsFile:join(userData,'desktop-settings.json')};
}

export async function readSettings(file){
  try{const value=JSON.parse(await readFile(file,'utf8'));return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}
}
export async function writeSettings(file,settings){await writeFile(file,JSON.stringify(settings,null,2));}

async function isDir(path){try{return (await stat(path)).isDirectory();}catch{return false;}}
async function exists(path){try{await access(path);return true;}catch{return false;}}
async function hasJson(dir){try{return (await readdir(dir)).some(n=>n.endsWith('.json'));}catch{return false;}}

// Accepts the old Voyager_Giveaway folder, its Voyager_Versus folder, or the data folder itself.
export async function inspectOldInstall(folder){
  const root=resolve(folder);
  const candidates=[join(root,'Voyager_Versus','local','data'),join(root,'local','data'),root];
  let dataDir=null;for(const c of candidates)if(await isDir(c)&&await hasJson(c)){dataDir=c;break;}
  const files=[];for(const name of USER_FILES)if(await exists(join(root,name)))files.push(name);
  return {root,dataDir,files,valid:Boolean(dataDir||files.length)};
}

// Copies config.js etc. into the user folder once. Never overwrites a file you already have there.
export async function prepareUserFiles({bundleDir,userFiles,importFrom=null}){
  await mkdir(userFiles,{recursive:true});const result={};
  for(const name of USER_FILES){
    const target=join(userFiles,name);
    if(await exists(target)){result[name]='kept';continue;}
    if(importFrom&&await exists(join(importFrom,name))){await copyFile(join(importFrom,name),target);result[name]='imported';continue;}
    if(await exists(join(bundleDir,name))){await copyFile(join(bundleDir,name),target);result[name]='default';}
  }
  return result;
}

// Only Voyager's own local pages load inside the app window; everything else opens in the browser.
export function linkPolicy(url,port=DEFAULT_PORT){
  let u;try{u=new URL(url);}catch{return 'block';}
  if(u.protocol==='voyager-versus:')return 'versus';
  if(u.protocol==='http:'&&(u.hostname==='127.0.0.1'||u.hostname==='localhost')&&Number(u.port)===port)return 'app';
  if(u.protocol==='https:'||u.protocol==='http:')return 'external';
  return 'block';
}

export function pageUrl(port,page){
  const pages={home:'Voyager_Command_Center.html',versus:'Voyager_Versus.html',check:'Voyager_System_Check.html',guide:'Voyager_Guide.html',public:'Voyager_Public_Site.html',publisher:'Voyager_Public_Site.html?background=1'};
  return 'http://127.0.0.1:'+port+'/control/'+(pages[page]||pages.home);
}

// Starts the bundled host, or reuses one that is already running (for example the old .bat launcher).
export async function startHost({bundleDir,port=DEFAULT_PORT,dataDir,userFiles,importFrom=null,execEnv={}}){
  const {launchVoyager}=await import(pathToFileURL(join(bundleDir,'voyager-launcher.mjs')).href);
  const env={...process.env,...execEnv,VOYAGER_DATA_DIR:dataDir,VOYAGER_USER_FILES:userFiles};
  if(importFrom)env.VOYAGER_IMPORT_FROM=importFrom;else delete env.VOYAGER_IMPORT_FROM;
  const started=await launchVoyager({directory:bundleDir,port,page:'home',env,openPage:async()=>{}});
  return {child:started.child,reused:started.reused,origin:'http://127.0.0.1:'+port};
}

// Asks the host to save and stop; only force-stops it if it does not exit in time.
export async function stopHost({origin,child,timeoutMs=8000}){
  if(!child||child.exitCode!==null)return 'not-running';
  const exited=new Promise(r=>child.once('exit',()=>r(true)));
  try{
    const {token}=await(await fetch(origin+'/api/admin',{signal:AbortSignal.timeout(2000)})).json();
    await fetch(origin+'/api/shutdown',{method:'POST',headers:{'Content-Type':'application/json','X-Voyager-Token':token},body:'{}',signal:AbortSignal.timeout(2000)});
  }catch{}
  if(await Promise.race([exited,delay(timeoutMs).then(()=>false)]))return 'saved';
  child.kill();await Promise.race([exited,delay(2000)]);return 'forced';
}
