// Voyager desktop app: runs the Voyager host and shows Voyager Control in its own window.
'use strict';
const {app,BrowserWindow,Tray,Menu,dialog,shell,nativeImage,Notification}=require('electron');
const {join,resolve}=require('node:path');
const {writeFileSync,mkdtempSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {pathToFileURL}=require('node:url');

const PORT=Number(process.env.VOYAGER_PORT||8740);
const bundleDir=app.isPackaged?join(process.resourcesPath,'voyager'):resolve(__dirname,'..');
const iconPath=join(__dirname,'build',process.platform==='win32'?'icon.ico':'icon.png');
let core,paths,settings,host=null,win=null,tray=null,publisher=null,quitting=false;

// --smoke-test: used by the release build to launch the real packaged app, check it, and exit.
const smoke=process.argv.includes('--smoke-test');
const smokeResult=(process.argv.find(a=>a.startsWith('--smoke-result='))||'').slice('--smoke-result='.length);
if(smoke)app.setPath('userData',mkdtempSync(join(tmpdir(),'voyager-smoke-')));

// Sounds in Voyager Control (wheel, Versus) should play without a click first.
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
app.setAppUserModelId('com.mda009.voyager');

const primary=smoke||app.requestSingleInstanceLock();
if(!primary)app.quit();
else app.on('second-instance',()=>show());

function show(page){
  if(!win)return;
  if(page)win.loadURL(core.pageUrl(PORT,page));
  if(win.isMinimized())win.restore();win.show();win.focus();
}

function createWindow(firstPage,hidden=false){
  win=new BrowserWindow({
    width:1440,height:900,minWidth:900,minHeight:600,show:false,backgroundColor:'#090f19',title:'Voyager',icon:iconPath,autoHideMenuBar:true,
    webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,spellcheck:false}
  });
  const route=(event,url)=>{
    const policy=core.linkPolicy(url,PORT);
    if(policy==='app')return false;
    event?.preventDefault?.();
    if(policy==='versus')win.loadURL(core.pageUrl(PORT,'versus'));
    else if(policy==='external')shell.openExternal(url);
    return true;
  };
  win.webContents.on('will-navigate',(e,url)=>route(e,url));
  win.webContents.setWindowOpenHandler(({url})=>{
    // Voyager pages (previews, OBS URLs) open in a second app window; everything else in the browser.
    if(core.linkPolicy(url,PORT)==='app')return {action:'allow',overrideBrowserWindowOptions:{autoHideMenuBar:true,icon:iconPath,backgroundColor:'#090f19',webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}}};
    route(null,url);return {action:'deny'};
  });
  if(!hidden)win.once('ready-to-show',()=>win.show());
  win.on('close',e=>{
    if(quitting)return;
    // Closing the window keeps Voyager running for OBS; quit from the tray.
    e.preventDefault();win.hide();
    if(!settings.trayHintShown&&Notification.isSupported()){new Notification({title:'Voyager is still running',body:'OBS overlays keep working. Use the tray icon to reopen or quit Voyager.'}).show();settings.trayHintShown=true;core.writeSettings(paths.settingsFile,settings).catch(()=>{});}
  });
  win.loadURL(core.pageUrl(PORT,firstPage));
}

// Keeps the public website fed while Voyager runs, without needing a browser tab open.
// The page only reads saved giveaway, ticket and points state.
function startPublisher(){
  publisher=new BrowserWindow({show:false,width:1024,height:768,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:false}});
  publisher.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  publisher.webContents.on('will-navigate',e=>e.preventDefault());
  publisher.webContents.on('render-process-gone',()=>{if(!quitting)setTimeout(()=>publisher?.reload(),5000);});
  publisher.loadURL(core.pageUrl(PORT,'publisher'));
}

// Opens the live viewer site (your own web address, or the GitHub Pages address) in the normal browser.
// If no address is set yet, opens the Public website page instead so it can be set up.
async function openPublicSite(){
  try{
    const r=await fetch(`http://127.0.0.1:${PORT}/api/public-site`,{signal:AbortSignal.timeout(4000)});
    const url=r.ok?(await r.json()).siteUrl:'';
    if(url&&/^https:\/\//.test(url))return shell.openExternal(url);
  }catch{}
  show('public');
}

function buildTray(){
  const image=nativeImage.createFromPath(join(__dirname,'build','tray.png'));
  tray=new Tray(image);tray.setToolTip('Voyager');
  const refresh=()=>tray.setContextMenu(Menu.buildFromTemplate([
    {label:'Open Voyager Control',click:()=>show('home')},
    {label:'Voyager Versus',click:()=>show('versus')},
    {label:'System check',click:()=>show('check')},
    {label:'Setup guide',click:()=>show('guide')},
    {label:'Public website',click:()=>show('public')},
    {label:'Settings',click:()=>show('settings')},
    {label:'View my public website in browser',click:()=>openPublicSite()},
    {type:'separator'},
    {label:'Open data folder',click:()=>shell.openPath(paths.dataDir)},
    {label:'Edit config.js (Streamer.bot settings)',click:()=>shell.openPath(join(paths.userFiles,'config.js'))},
    {label:'Open Streamer.bot import files',click:()=>shell.openPath(bundleDir)},
    {type:'separator'},
    {label:'Start Voyager when I sign in',type:'checkbox',checked:app.getLoginItemSettings().openAtLogin,click:item=>{app.setLoginItemSettings({openAtLogin:item.checked,args:['--hidden']});refresh();}},
    {label:'Check for updates',enabled:app.isPackaged,click:()=>checkForUpdates(true)},
    {type:'separator'},
    {label:'Quit Voyager',click:()=>{quitting=true;app.quit();}}
  ]));
  refresh();tray.on('click',()=>show());
}

async function firstRun(){
  const choice=await dialog.showMessageBox({
    type:'question',title:'Welcome to Voyager',icon:iconPath,
    message:'Bring over your existing Voyager setup?',
    detail:'If you already use Voyager from a folder (START-VOYAGER-CONTROL.bat), choose that folder. Voyager will copy your rankings, rewards and config.js. Your old folder is not changed.',
    buttons:['Choose my Voyager folder…','Start fresh'],defaultId:0,cancelId:1,noLink:true
  });
  if(choice.response!==0)return null;
  for(;;){
    const pick=await dialog.showOpenDialog({title:'Choose your existing Voyager_Giveaway folder',properties:['openDirectory']});
    if(pick.canceled||!pick.filePaths[0])return null;
    const found=await core.inspectOldInstall(pick.filePaths[0]);
    if(found.valid)return found;
    const retry=await dialog.showMessageBox({type:'warning',title:'Voyager',message:'No Voyager data or config.js found in that folder.',detail:'Pick the folder that contains config.js and the Voyager_Versus folder.',buttons:['Choose again','Start fresh'],defaultId:0,cancelId:1,noLink:true});
    if(retry.response!==0)return null;
  }
}

async function checkForUpdates(manual){
  if(!app.isPackaged)return;
  try{
    const {autoUpdater}=require('electron-updater');
    autoUpdater.autoInstallOnAppQuit=true;
    const result=await autoUpdater.checkForUpdatesAndNotify();
    if(manual&&!result?.updateInfo)dialog.showMessageBox({title:'Voyager',message:'You have the latest version of Voyager.'});
  }catch(e){if(manual)dialog.showMessageBox({type:'warning',title:'Voyager',message:'Could not check for updates.',detail:e.message});}
}

app.whenReady().then(async()=>{
  if(!primary)return;
  core=await import(pathToFileURL(join(__dirname,'core.mjs')).href);
  if(smoke)return runSmokeTest();
  paths=core.voyagerPaths(app.getPath('userData'));
  settings=await core.readSettings(paths.settingsFile);
  let importFrom=null,firstPage=process.argv.includes('--hidden')?null:'home';
  if(!settings.setupDone){
    const old=await firstRun();
    await core.prepareUserFiles({bundleDir,userFiles:paths.userFiles,importFrom:old?.root||null});
    importFrom=old?.dataDir||null;settings.setupDone=true;settings.importedFrom=old?.root||null;
    await core.writeSettings(paths.settingsFile,settings);firstPage='check';
  }else await core.prepareUserFiles({bundleDir,userFiles:paths.userFiles});
  try{
    host=await core.startHost({bundleDir,port:PORT,dataDir:paths.dataDir,userFiles:paths.userFiles,importFrom,execEnv:{ELECTRON_RUN_AS_NODE:'1'}});
    if(host.child)host.child.once('exit',code=>{if(!quitting){dialog.showErrorBox('Voyager stopped','The Voyager host stopped unexpectedly (code '+code+'). OBS overlays will not update. Restart Voyager from the Start menu.');}});
  }catch(e){
    dialog.showErrorBox('Voyager could not start',e.message+'\n\nIf another copy of Voyager is open in a command window, close it and start the app again.');
    quitting=true;app.quit();return;
  }
  buildTray();
  if(host.reused&&Notification.isSupported())new Notification({title:'Voyager',body:'Using the Voyager that is already running on this PC (started from a command window). Its data folder is the one shown in System check.'}).show();
  createWindow(firstPage||'home',!firstPage);
  startPublisher();
  setTimeout(()=>checkForUpdates(false),15000);
});

async function runSmokeTest(){
  const report={ok:false,version:app.getVersion(),electron:process.versions.electron,node:process.versions.node,steps:[]};
  const step=(name,ok,detail='')=>{report.steps.push({name,ok,detail:String(detail)});if(!ok)throw new Error(name+': '+detail);};
  const timeout=(p,ms,what)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error(what+' timed out')),ms))]);
  try{
    paths=core.voyagerPaths(app.getPath('userData'));settings={setupDone:true};
    const files=await core.prepareUserFiles({bundleDir,userFiles:paths.userFiles});
    step('config.js copied to the user folder',files['config.js']==='default',JSON.stringify(files));
    host=await timeout(core.startHost({bundleDir,port:PORT,dataDir:paths.dataDir,userFiles:paths.userFiles,execEnv:{ELECTRON_RUN_AS_NODE:'1'}}),30000,'Host start');
    step('Voyager host started by the packaged app',Boolean(host.child)&&!host.reused,'reused='+host.reused);
    const health=await(await fetch(host.origin+'/api/health')).json();
    step('Host health',health.ok===true&&health.voyagerControl===true,JSON.stringify(health));
    const {token}=await(await fetch(host.origin+'/api/admin')).json();
    const sys=await(await fetch(host.origin+'/api/system',{headers:{'X-Voyager-Token':token}})).json();
    step('Live data saved in the user folder',sys.dataDir===paths.dataDir&&sys.dataWritable===true,sys.dataDir);
    win=new BrowserWindow({show:false,width:1280,height:900,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
    for(const page of ['home','check','versus','public']){
      await timeout(win.loadURL(core.pageUrl(PORT,page)),30000,'Loading '+page);
      const info=await win.webContents.executeJavaScript('({title:document.title,links:document.querySelectorAll("a").length,check:!!document.querySelector(\'a[href="Voyager_System_Check.html"]\')||location.pathname.endsWith("Voyager_System_Check.html")})');
      step('Page loads: '+page,Boolean(info.title)&&info.check,JSON.stringify(info));
    }
    step('Host stops cleanly',await core.stopHost({origin:host.origin,child:host.child})==='saved');
    report.ok=true;
  }catch(e){report.error=e.message;try{if(host?.child?.exitCode===null)host.child.kill();}catch{}}
  const text=JSON.stringify(report,null,2);console.log(text);
  if(smokeResult)try{writeFileSync(smokeResult,text);}catch{}
  quitting=true;app.exit(report.ok?0:1);
}

app.on('before-quit',async e=>{
  quitting=true;
  if(host?.child&&host.child.exitCode===null){
    e.preventDefault();
    const child=host.child;host=null;
    await core.stopHost({origin:'http://127.0.0.1:'+PORT,child});
    app.quit();
  }
});
// The window hiding to the tray must not end the app.
app.on('window-all-closed',()=>{});
