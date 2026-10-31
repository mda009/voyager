import http from 'node:http';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rename,access,readdir,cp,stat,unlink} from 'node:fs/promises';
import {homedir} from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,extname,sep,join} from 'node:path';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {Arena,REWARDS} from '../dist/engine.mjs';
import {StreamerBot} from './streamerbot.mjs';
import {EconomyStore,RewardDispatcher} from './rewards.mjs';
import {AvailabilityAnnouncer} from './availability.mjs';
import {MatchChat} from './match-chat.mjs';
import {StreamEntries} from './stream-entries.mjs';
import {PilotLeaderboard} from './pilot-leaderboard.mjs';
import {LiveOverlay} from './live-overlay.mjs';
import {PublicSite} from './public-site.mjs';
import {readConnection,updateConnection} from './connection-config.mjs';
import {Community} from './community.mjs';
import {BossFight} from './boss.mjs';
let VERSION='unknown';try{VERSION=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8')).version;}catch{}
const major=Number(process.versions.node.split('.')[0]);
if(major<22||typeof WebSocket==='undefined'){console.error('Voyager Versus requires Node.js 22.4 or newer. Install it from https://nodejs.org/');process.exit(1);}
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const controlRoot=resolve(root,'..');
let hasControl=false;try{await access(resolve(controlRoot,'Voyager_Command_Center.html'));hasControl=true;}catch{}
const dist=resolve(root,'dist');
// Live data (rankings, rewards, entries) lives outside the program folder so updates,
// re-extracting a release or sharing the folder never overwrite or leak it.
function defaultDataDir(env=process.env,platform=process.platform,home=homedir()){
  if(platform==='win32')return join(env.APPDATA||join(home,'AppData','Roaming'),'Voyager','data');
  if(platform==='darwin')return join(home,'Library','Application Support','Voyager','data');
  return join(env.XDG_DATA_HOME||join(home,'.local','share'),'voyager','data');
}
const legacyDataDir=resolve(root,'local/data');
// The desktop app keeps the files you edit (config.js etc.) beside your data instead of in the read-only program folder.
const userFilesDir=process.env.VOYAGER_USER_FILES?resolve(process.env.VOYAGER_USER_FILES):null;
const userFiles=new Set(['config.js','stream-command-settings.js']);
const dataDir=resolve(process.env.VOYAGER_DATA_DIR||defaultDataDir());
async function hasJson(dir){try{return (await readdir(dir)).some(name=>name.endsWith('.json'));}catch{return false;}}
// One-time import: only into an empty data folder, never overwriting, and the source is left untouched.
async function importLegacyData(){
  const source=process.env.VOYAGER_IMPORT_FROM?resolve(process.env.VOYAGER_IMPORT_FROM):process.env.VOYAGER_DATA_DIR?null:legacyDataDir;
  if(!source||source===dataDir||await hasJson(dataDir)||!await hasJson(source))return '';
  if(!(await stat(source)).isDirectory())return '';
  await cp(source,dataDir,{recursive:true,force:false,errorOnExist:false});
  try{await writeFile(join(source,'MOVED_TO_APPDATA.txt'),'Voyager copied this folder to:\r\n'+dataDir+'\r\n\r\nVoyager now reads and saves live data there. This folder is kept only as a backup and can be deleted once you have checked your rankings and rewards.\r\n');}catch{}
  return source;
}
const port=Number(process.env.VOYAGER_PORT||8740);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid VOYAGER_PORT.');
await mkdir(dataDir,{recursive:true});
const importedFrom=await importLegacyData();
if(importedFrom)console.log('Copied existing Voyager data from '+importedFrom+' to '+dataDir);
const liveOverlay=await new LiveOverlay(dataDir).load();
// Public website feed (needs the Voyager Control bundle for the shared allow-list model).
let publicSite=null,community=null;
if(hasControl){try{community=await new Community({dataDir}).load();}catch(e){console.warn('Missions and seasons unavailable: '+e.message);}}
if(hasControl){try{publicSite=await new PublicSite({dataDir,model:await import(pathToFileURL(resolve(controlRoot,'public-feed-model.mjs')).href)}).load();}catch(e){console.warn('Public website feed unavailable: '+e.message);}}
let saved=[],savedRankings=null;try{saved=JSON.parse(await readFile(resolve(dataDir,'rankings.json'),'utf8'));if(!Array.isArray(saved))throw Error("Invalid rankings format");savedRankings=structuredClone(saved);}catch(e){saved=[];savedRankings=null;if(e.code!=='ENOENT')console.warn('Rankings could not be loaded. Existing file will be retained as rankings-backup.json.');try{await rename(resolve(dataDir,'rankings.json'),resolve(dataDir,'rankings-backup.json'));}catch{}}
const clients=new Set(),adminToken=randomBytes(32).toString('hex');let saving=Promise.resolve(),storageMessage='';
const economy=new EconomyStore(dataDir);
const entries=new StreamEntries(dataDir);
const game=new Arena({entryGate:(pilot,role)=>entries.claim(pilot,role),stats:saved,cooldownUntil:economy.data.cooldownUntil,onCooldown:until=>economy.cooldown(until),onRewards:rewards=>economy.enqueue(rewards),onSave:stats=>{const copy=structuredClone(stats);saving=saving.then(async()=>{try{await writeFile(resolve(dataDir,'rankings.tmp'),JSON.stringify(copy,null,2));await rename(resolve(dataDir,'rankings.tmp'),resolve(dataDir,'rankings.json'));savedRankings=copy;pilots.changed();}catch{if(!storageMessage){storageMessage='Rankings could not be saved. Check the game folder is writable.';game.note(storageMessage,'system');}}});}});
let wasConnected=false;
// Voyager Dreadnought (2.17): chat co-op boss fight. Chat lines go out through the "Voyager - Dreadnought" action.
let bossActionId=null,bossActionAt=0;
async function bossSay(text){
  try{
    if(!bossActionId||Date.now()-bossActionAt>300000){const r=await bot.request('GetActions');const a=(r.actions||[]).filter(x=>x.name==='Voyager - Dreadnought'&&x.enabled!==false);bossActionId=a.length===1?a[0].id:null;bossActionAt=Date.now();}
    if(bossActionId)await bot.request('DoAction',{action:{id:bossActionId},args:{bossSay:String(text).slice(0,450)}});
  }catch{}
}
const boss=await new BossFight({dataDir,say:text=>{void bossSay(text);}}).load();
const bot=new StreamerBot({onBoss:ev=>{
  if(ev.kind==='call'&&!['lobby','result'].includes(game.phase)){game.note('Finish the Versus battle before calling the Dreadnought.','system');return;}
  boss.receive(ev);
},onChat:chat=>{
  if(boss.busy()&&/^!versus\b/i.test(chat.text.trim())){const now=Date.now(),last=failures.get(chat.login)||0;if(now-last>4000){game.note(`${chat.name}: Voyager Versus is paused while the Dreadnought fight is on.`,'system');failures.set(chat.login,now);}return;}
  let result;try{result=game.command(chat);}catch{game.paused=true;game.note('Cannot save battle cooldown or stream entries. Check host storage and restart.');return;}
  // Accepted match transitions are announced by MatchChat; weapon feedback stays on-screen.
  if(!result.ok&&!result.ignored&&result.message&&!result.message.startsWith('Wait a moment')){
    const now=Date.now(),last=failures.get(chat.login)||0;
    if(now-last>4000){game.note(`${chat.name}: ${result.message}`,'system');failures.set(chat.login,now);}
  }
},onStreamOnline:async stream=>{
  try{
    const response=await bot.request('GetBroadcaster');
    if(String(response.platforms?.twitch?.broadcastUserId||'')!==stream.channelId)return;
    if(entries.observe(stream)){economy.update(d=>d.availability=null);game.note('Twitch stream detected. Entry limits now track this stream: one initiator and one challenger per viewer.');}
  }catch(e){game.note('Could not confirm the new Twitch stream. Use Start new stream in Stream setup if this is a new broadcast.');}
},onStatus:status=>{
  if(wasConnected&&!status.connected&&['calling','battle','countdown'].includes(game.phase)&&(game.players.some(p=>!p.demo)||(game.caller&&!game.caller.demo))){
    game.paused=true;game.note('Chat connection lost. Arena paused; reconnect and press Resume.','system');
  }
  if(!status.connected){rewards.action=null;rewards.ready=false;rewards.nextCheck=0;}
  wasConnected=status.connected;
}});
const pilots=new PilotLeaderboard({bot,records:()=>savedRankings});
publicSite?.setVersus(()=>{const now=Date.now(),cooldown=Number(economy.data.cooldownUntil)||0;
  const status=cooldown>now?'cooldown':['calling','countdown','battle','result'].includes(game.phase)?'live':bot.status.connected?'ready':'offline';
  return {pilots:savedRankings||[],versus:{status,cooldownUntil:cooldown,winnerPoints:REWARDS.winner}};});
community?.setPilots(()=>savedRankings||[]);community?.setBoss(()=>boss.rewardBatches());publicSite?.setCommunity(()=>community?.publicView()||null);
const rewards=new RewardDispatcher({store:economy,bot,onCredit:r=>{game.note(`${r.name}: +${r.amount} Voyager points credited.`, 'reward');matchChat.credit(r);}});
const announcements=new AvailabilityAnnouncer({store:economy,bot,game,action:()=>rewards.ready?rewards.action:null});
const matchChat=new MatchChat({directory:dataDir,game,bot,action:()=>rewards.ready?rewards.action:null,protocol:()=>rewards.chatProtocol,reward:id=>economy.data.rewards.find(r=>r.id===id)});
game.onEvent=event=>matchChat.capture(event);
function packet(){const snapshot=game.snapshot();for(const r of snapshot.result?.rewards||[])r.status=economy.data.rewards.find(x=>x.id===r.id)?.status||r.status;return {serverTime:Date.now(),game:snapshot,connection:bot.status,rewards:rewards.snapshot(),announcements:announcements.snapshot(),matchChat:matchChat.snapshot(),entries:entries.snapshot(),pilotLeaderboard:pilots.snapshot()};}
const failures=new Map();
const allowedHosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
function response(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function validToken(req){const token=req.headers['x-voyager-token'];return typeof token==='string'&&token.length===adminToken.length&&timingSafeEqual(Buffer.from(token),Buffer.from(adminToken));}
async function body(req,limit=8192){let size=0,parts=[];for await(const chunk of req){size+=chunk.length;if(size>limit)throw new Error('Request too large.');parts.push(chunk);}return JSON.parse(Buffer.concat(parts).toString());}
const mime={'.wav':'audio/wav','.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.sb':'application/octet-stream','.csv':'text/csv; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ctm':'application/octet-stream','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.zip':'application/zip','.cs':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  if(!allowedHosts.has(req.headers.host)){response(res,403,{message:'Invalid host.'});return;}
  const origin=req.headers.origin;if(origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(origin)){response(res,403,{message:'Cross-origin requests are not allowed.'});return;}
  if(req.headers['sec-fetch-site']==='cross-site'){response(res,403,{message:'Cross-site requests are not allowed.'});return;}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const url=new URL(req.url,'http://127.0.0.1:'+port);
  try{
    if(url.pathname==='/api/admin'&&req.method==='GET'){response(res,200,{token:adminToken});return;}
    if(url.pathname==='/api/health'&&req.method==='GET'){response(res,200,{ok:true,version:VERSION,voyagerControl:hasControl});return;}
    if(url.pathname==='/api/shutdown'&&req.method==='POST'){if(!validToken(req)||!req.headers['content-type']?.startsWith('application/json')){response(res,403,{message:'Open the local control panel.'});return;}response(res,200,{ok:true,message:'Saving and stopping Voyager.'});setImmediate(()=>void stop());return;}
    if(url.pathname==='/api/system'&&req.method==='GET'){if(!validToken(req)){response(res,403,{message:'Open the local control panel.'});return;}let writable=true;try{const probe=join(dataDir,'.write-test');await writeFile(probe,'ok');await unlink(probe);}catch{writable=false;}response(res,200,{version:VERSION,node:process.versions.node,platform:process.platform,dataDir,dataWritable:writable,importedFrom,legacyDataPresent:await hasJson(legacyDataDir)&&legacyDataDir!==dataDir,controlBundled:hasControl});return;}
    if(url.pathname.startsWith('/api/community')){
      if(!community){response(res,404,{message:'Missions and seasons need the full Voyager Control package.'});return;}
      // The OBS panel reads this without the control token (local only, no member keys), like /api/live-overlay.
      if(url.pathname==='/api/community/overlay'&&req.method==='GET'){res.setHeader('Cache-Control','no-store');response(res,200,community.overlay());return;}
      if(!validToken(req)){response(res,403,{message:'Open the local Missions or Seasons page.'});return;}
      if(url.pathname==='/api/community'&&req.method==='GET'){community.roll(Date.now());response(res,200,community.view());return;}
      if(req.method!=='POST'||!req.headers['content-type']?.startsWith('application/json')){response(res,405,{message:'Method not allowed.'});return;}
      try{
        const input=await body(req,['/api/community/members','/api/community/support'].includes(url.pathname)?8*1024*1024:65536);
        if(url.pathname==='/api/community/members'){community.receive(input?.members);response(res,200,{ok:true});return;}
        if(url.pathname==='/api/community/support'){community.receiveSupport(input?.support);response(res,200,{ok:true});return;}
        if(url.pathname==='/api/community/missions'){response(res,200,{ok:true,...community.setMissions(input?.missions)});return;}
        if(url.pathname==='/api/community/season'){response(res,200,{ok:true,...(input?.action==='end'?community.endSeason():community.configureSeason(input||{}))});return;}
        if(url.pathname==='/api/community/panel'){response(res,200,{ok:true,panel:community.setPanel(input||{})});return;}
        if(url.pathname==='/api/community/payout'){response(res,200,community.recordPayout(input||{}));return;}
        response(res,404,{message:'Not found.'});
      }catch(e){response(res,400,{ok:false,message:e.message});}
      return;
    }
    if(url.pathname==='/api/settings/connection'){
      if(!hasControl){response(res,404,{message:'Settings need the full Voyager Control package.'});return;}
      if(!validToken(req)){response(res,403,{message:'Open the local Settings page.'});return;}
      const target=userFilesDir?join(userFilesDir,'config.js'):resolve(controlRoot,'config.js');
      const current=async()=>{try{return await readFile(target,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;return readFile(resolve(controlRoot,'config.js'),'utf8');}};
      if(req.method==='GET'){try{response(res,200,{...readConnection(await current()),file:target});}catch(e){response(res,500,{message:e.message});}return;}
      if(req.method!=='POST'||!req.headers['content-type']?.startsWith('application/json')){response(res,405,{message:'Method not allowed.'});return;}
      try{const next=updateConnection(await current(),await body(req,4096));if(userFilesDir)await mkdir(userFilesDir,{recursive:true});const tmp=target+'.tmp';await writeFile(tmp,next);await rename(tmp,target);response(res,200,{ok:true,...readConnection(next),file:target});}
      catch(e){response(res,400,{ok:false,message:e.message});}
      return;
    }
    if(url.pathname.startsWith('/api/public-site')||url.pathname.startsWith('/public/')||url.pathname==='/public'){
      if(!publicSite){response(res,404,{message:'The public website needs the full Voyager Control package.'});return;}
      const json=req.headers['content-type']?.startsWith('application/json');
      if(url.pathname==='/public'){res.writeHead(302,{Location:'/public/'});res.end();return;}
      const proofMatch=/^\/public\/proofs\/([a-z0-9]{1,16})\.json$/i.exec(url.pathname);
      if(proofMatch&&req.method==='GET'){const p=publicSite.proof(proofMatch[1]);if(!p){response(res,404,{message:'No proof for that giveaway.'});return;}res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(p));return;}
      if(url.pathname==='/public/feed.json'&&req.method==='GET'){if(!publicSite.feed)publicSite.rebuild();res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(publicSite.feedJson);return;}
      if(url.pathname.startsWith('/public/')&&req.method==='GET'){
        const assets={'':'site/viewer/index.html','index.html':'site/viewer/index.html','fair-draw.js':'site/viewer/fair-draw.js','assets/voyager.png':'brand-assets/voyager.png','assets/icon.png':'desktop/build/icon.png','assets/Rajdhani-600.ttf':'brand-assets/Rajdhani-600.ttf','assets/Rajdhani-700.ttf':'brand-assets/Rajdhani-700.ttf'};
        const name=url.pathname.slice('/public/'.length);if(!Object.hasOwn(assets,name)){response(res,404,{message:'File not found.'});return;}
        const file=resolve(controlRoot,assets[name]),bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Content-Length':bytes.length});res.end(bytes);return;
      }
      if(!validToken(req)){response(res,403,{message:'Open the local Public website page.'});return;}
      if(url.pathname==='/api/public-site'&&req.method==='GET'){response(res,200,publicSite.view());return;}
      if(!json||req.method!=='POST'){response(res,405,{message:'Method not allowed.'});return;}
      if(url.pathname==='/api/public-site/feed'){const r=publicSite.receive(await body(req,2*1024*1024));response(res,200,{ok:true,feed:r.feed,status:publicSite.view()});return;}
      if(url.pathname==='/api/public-site/settings'){try{response(res,200,{ok:true,...await publicSite.configure(await body(req,32768))});}catch(e){response(res,400,{ok:false,message:e.message});}return;}
      if(url.pathname==='/api/public-site/publish-now'){await body(req);if(!publicSite.view().upload.enabled){response(res,400,{ok:false,message:'Turn on publishing and add the repository and token first.'});return;}publicSite.rebuild();await publicSite.push();const v=publicSite.view();response(res,200,{ok:!v.upload.lastError,message:v.upload.lastError||'Published. The public site shows it within about 5 minutes.',status:v});return;}
      response(res,404,{message:'Not found.'});return;
    }
    if(url.pathname==='/api/boss/overlay'&&req.method==='GET'){res.setHeader('Cache-Control','no-store');response(res,200,boss.overlay());return;}
    if(url.pathname.startsWith('/api/boss')){
      if(!validToken(req)){response(res,403,{message:'Open Voyager Control to run the Dreadnought.'});return;}
      if(url.pathname==='/api/boss'&&req.method==='GET'){response(res,200,boss.view());return;}
      if(url.pathname==='/api/boss/control'&&req.method==='POST'){
        if(!req.headers['content-type']?.startsWith('application/json')){response(res,403,{message:'Invalid request.'});return;}
        const {action,value}=await body(req);
        try{
          if(['call','demo'].includes(action)&&!['lobby','result'].includes(game.phase))throw new Error('Finish the Voyager Versus battle first.');
          const r=action==='call'?boss.call():action==='demo'?boss.call({demo:true,by:'Preview'}):action==='start'?boss.start():action==='cancel'?boss.cancel():action==='settings'?boss.configure(value||{}):null;
          if(!r)throw new Error('Unknown Dreadnought action.');
          response(res,200,{ok:true,...r});
        }catch(e){response(res,400,{ok:false,message:e.message});}
        return;
      }
      response(res,404,{message:'Not found.'});return;
    }
    if(url.pathname==='/api/live-overlay'&&req.method==='GET'){response(res,200,liveOverlay.snapshot());return;}
    if(['/api/live-overlay/feed','/api/live-overlay/settings'].includes(url.pathname)&&req.method==='POST'){
      if(!validToken(req)||!req.headers['content-type']?.startsWith('application/json')){response(res,403,{message:'Open the local Live dashboard to update the overlay.'});return;}
      const input=await body(req);response(res,200,url.pathname.endsWith('/feed')?liveOverlay.publish(input):await liveOverlay.configure(input));return;
    }
    if(url.pathname==='/api/events'&&req.method==='GET'){
      if(clients.size>=20){response(res,429,{message:'Too many connected views.'});return;}
      res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive'});
      res.write('data: '+JSON.stringify(packet())+'\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;
    }
    if(url.pathname==='/api/state'&&req.method==='GET'){response(res,200,packet());return;}
    if(url.pathname==='/api/control'&&req.method==='POST'){
      if(!validToken(req)||!req.headers['content-type']?.startsWith('application/json')){response(res,403,{message:'Open the local control panel to send commands.'});return;}
      const {type,value}=await body(req);let result;
      if(type==='connect'){bot.connect(value||{});result={ok:true,message:'Connecting to Streamer.bot…'};}
      else if(type==='disconnect'){bot.disconnect();result={ok:true};}
      else if(type==='new_stream'){
        if(value?.confirm!==true)result={ok:false,message:'Confirm that you are starting a new stream.'};
        else if(game.phase!=='lobby'||game.queue.length||game.matches.length||game.invites.length)result={ok:false,message:'Finish the active battle and clear waiting entries before starting a new stream.'};
        else {result=entries.newStream();economy.update(d=>d.availability=null);game.note(result.message);}
      }
      else if(type==='ready_alert_test')result=announcements.preview();
      else if(type==='rewards_check'){try{result=await rewards.checkAction();}catch(e){result={ok:false,message:e.message};}}
      else if(type==='rewards_preview'){try{result=await rewards.previewRepair();}catch(e){result={ok:false,message:e.message};}}
      else if(type==='rewards_apply'){try{result=await rewards.applyRepair(value?.planId);}catch(e){result={ok:false,message:e.message};}}
      else if(type==='rewards_resolve'){try{result=await rewards.resolveUnpaid(value||{});}catch(e){result={ok:false,message:e.message};}}
      else if(type==='command')result={ok:false,message:'Live games accept commands only from Twitch chat. Type !versus there, or open the separate training preview.'};
      else result=game.control(type,value);
      response(res,200,result);return;
    }
    if(req.method!=='GET'&&req.method!=='HEAD'){response(res,405,{message:'Method not allowed.'});return;}
    let pathname=decodeURIComponent(url.pathname);const inControl=pathname.startsWith('/control/');
    if(inControl&&!hasControl){response(res,404,{message:'Voyager Control is not bundled with this installation.'});return;}
    const staticRoot=inControl?controlRoot:dist;
    if(inControl)pathname=pathname.slice('/control'.length);
    const filename=resolve(staticRoot,'.'+(pathname==='/'?(inControl?'/Voyager_Command_Center.html':'/index.html'):pathname));
    if(!filename.startsWith(staticRoot+sep)||inControl&&filename.startsWith(resolve(controlRoot,'Voyager_Versus')+sep)||!Object.hasOwn(mime,extname(filename))){response(res,404,{message:'File not found.'});return;}
    let bytes;
    if(inControl&&userFilesDir&&userFiles.has(pathname.slice(1))){try{bytes=await readFile(join(userFilesDir,pathname.slice(1)));}catch{}}
    bytes??=await readFile(filename);const headers={'Content-Type':mime[extname(filename)],'Cache-Control':'no-cache','Content-Length':bytes.length};
    // Audio needs a known length and byte ranges for metadata and late-cue seeking.
    if(extname(filename)==='.wav'){
      headers['Accept-Ranges']='bytes';
      if(req.headers.range){
        const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        let start=range?.[1]?Number(range[1]):0,end=range?.[2]?Number(range[2]):bytes.length-1;
        if(range&&!range[1]&&range[2]){start=Math.max(0,bytes.length-Number(range[2]));end=bytes.length-1;}
        if(!range||(!range[1]&&!range[2])||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=bytes.length||end<start){res.writeHead(416,{'Content-Range':'bytes */'+bytes.length});res.end();return;}
        end=Math.min(end,bytes.length-1);headers['Content-Range']=`bytes ${start}-${end}/${bytes.length}`;headers['Content-Length']=end-start+1;
        res.writeHead(206,headers);res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));return;
      }
    }
    res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:bytes);
  }catch(e){response(res,e.code==='ENOENT'?404:400,{message:e.code==='ENOENT'?'File not found.':e.message==='Invalid URL'?'Invalid WebSocket address.':'Request could not be processed. Check your inputs.'});}
});
let ticks=0;const timer=setInterval(()=>{
  try{boss.tick();}catch{}
  try{game.tick(.1);}catch{game.paused=true;game.note('Host storage error. Check the game folder before restarting.');}ticks++;
  if(ticks%10===0){community?.roll(Date.now());void publicSite?.tick();void pilots.tick();void rewards.tick();void announcements.tick();void matchChat.tick();}
  if(ticks%300===0){for(const [key,t] of failures)if(Date.now()-t>120000)failures.delete(key);}
  const update='data: '+JSON.stringify(packet())+'\n\n';
  for(const client of clients){if(client.writableLength>1024*1024){client.destroy();clients.delete(client);}else client.write(update);}
},100);
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`Port ${port} is already in use. Voyager may already be running. Open http://127.0.0.1:${port}/`:'Could not start Voyager host: '+err.message);clearInterval(timer);process.exit(1);});
server.listen(port,'127.0.0.1',()=>{
  if(process.argv.includes('--open')||process.argv.includes('--open-control')){
    const address='http://127.0.0.1:'+port+(hasControl&&process.argv.includes('--open-control')?'/control/Voyager_Command_Center.html':'/');
    const command=process.platform==='win32'?'cmd.exe':process.platform==='darwin'?'open':'xdg-open';
    const args=process.platform==='win32'?['/c','start','',address]:[address];
    const browser=spawn(command,args,{detached:true,stdio:'ignore'});browser.on('error',()=>{});browser.unref();
  }
  if(hasControl)console.log(`Voyager Control: http://127.0.0.1:${port}/control/Voyager_Command_Center.html`);
  console.log(`\nVOYAGER VERSUS ${VERSION} — MDA009\n\nData folder:   ${dataDir}\nControl panel: http://127.0.0.1:${port}/\nOBS overlay:   http://127.0.0.1:${port}/?overlay=1&hideIdle=1\nCooldown:      http://127.0.0.1:${port}/cooldown.html\n\nKeep this window open while streaming. Press Ctrl+C to stop.\n`);});
async function stop(){clearInterval(timer);await publicSite?.goOffline().catch(()=>{});await publicSite?.saving;bot.disconnect();for(const client of clients)client.end();server.close();await saving;await liveOverlay.saving.catch(()=>{});process.exit(0);}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
