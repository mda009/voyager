import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as M from '../../public-feed-model.mjs';
import {PublicSite,uploadFeed,pagesUrl} from '../local/public-site.mjs';

const NOW=Date.UTC(2026,9,29,1,0,0);
const SECRET=['SECRET_USER_ID_9911','secretlogin_77','SECRET_AUDIT_REASON','SECRET_CHAT','sk-oauth-SECRET','127.0.0.1-SECRET','SECRET_WATCHTIME'];
const giveawayState={schema:1,revision:4,audit:[{reason:'SECRET_AUDIT_REASON'}],requests:[{id:'SECRET_CHAT'}],
  session:{id:'sess-1',title:'Friday <b>Gold</b> drop',mode:'chat',entriesOpen:true,groups:[],createdAt:NOW-600000,
    pool:[{key:'twitch:id:SECRET_USER_ID_9911',id:'SECRET_USER_ID_9911',login:'secretlogin_77',name:'NebulaKnight',platform:'twitch'},{key:'kick:id:2',id:'2',login:'b',name:'AuroraFox',platform:'kick'}],
    draws:[],excludeLogins:['secretlogin_77']},reveal:null};
const ticketState={campaign:{id:'camp-1',title:'October ticket giveaway',status:'open',startedAt:NOW-86400000,endsAt:NOW+3600000,platforms:['twitch','kick'],
  users:{a:{key:'twitch:id:SECRET_USER_ID_9911',login:'secretlogin_77',name:'NebulaKnight',tickets:40,manual:5,blocked:false},b:{key:'kick:id:2',name:'AuroraFox',tickets:12}},
  audit:[{reason:'SECRET_AUDIT_REASON'}],draws:[]},presence:{twitch:{present:['secretlogin_77']}},tracking:{token:'sk-oauth-SECRET'}};
const points={users:[{key:'twitch:id:SECRET_USER_ID_9911',id:'SECRET_USER_ID_9911',login:'secretlogin_77',name:'NebulaKnight',platform:'twitch',points:4200,watchTime:'SECRET_WATCHTIME',groups:['gold']},{key:'k',name:'AuroraFox',platform:'kick',points:3100},{key:'z',name:'Stale',platform:'twitch',points:9999,pointsFresh:false}],
  buckets:{silver:{login:'mdavoyagersilver',points:63720,target:72000},gold:{points:84600,target:120000},platinum:{error:'unavailable'}}};

function collect(settings=M.DEFAULT_SETTINGS){
  const s=M.normalizeSettings(settings);
  return {giveaways:[M.projectGiveaway(giveawayState,s,NOW),M.projectTicket(ticketState,s,NOW)].filter(Boolean),points:{available:true,...M.projectPoints(points,s)},sources:{giveaway:true,tickets:true,points:true}};
}

test('The public feed carries giveaway info and no IDs, logins, audit, chat, tokens or stream statistics',()=>{
  const feed=M.buildFeed({collected:collect(),settings:{},pilots:[{login:'ace',name:'Ace',wins:5,losses:1,draws:0,battles:6}],versus:{status:'cooldown',cooldownUntil:NOW+600000,winnerPoints:50},winners:[],now:NOW});
  const text=JSON.stringify(feed);
  for(const s of SECRET)assert.ok(!text.includes(s),'leaked '+s);
  assert.ok(!/:id:/.test(text),'account keys leaked');
  for(const key of ['"login"','"userId"','"audit"','"presence"','"tracking"','"manual"','"blocked"','"viewers"','"followers"','"subscribers"','"watchTime"'])assert.ok(!text.includes(key),'unexpected field '+key);
  const [g,t]=feed.giveaways;
  assert.equal(g.status,'open');assert.equal(g.enter,'!enter');assert.equal(g.entrants,2);assert.equal(g.title,'Friday <b>Gold</b> drop');
  assert.equal(t.kind,'tickets');assert.equal(t.tickets,52);assert.equal(t.closesAt,NOW+3600000);assert.equal(t.enter,'!entergiveaway');
  assert.deepEqual(feed.leaderboards.points.map(l=>l.name),['NebulaKnight','AuroraFox']);
  assert.deepEqual(feed.goals.map(x=>x.key),['silver','gold']);
  assert.equal(feed.versus.status,'cooldown');assert.equal(feed.leaderboards.pilots[0].wins,5);
});

test('A winner is public only once confirmed, so the site never spoils a reveal or shows a re-rolled pick',()=>{
  const s=M.normalizeSettings({});
  const drawing={session:{...giveawayState.session,entriesOpen:false,currentDrawId:'d1',draws:[{id:'d1',status:'selected',at:NOW,winner:{name:'AuroraFox',platform:'kick'}}]}};
  const g1=M.projectGiveaway(drawing,s,NOW);assert.equal(g1.status,'drawing');assert.equal(g1.winner,null);assert.ok(!JSON.stringify(g1).includes('AuroraFox'));
  const confirmed={session:{...drawing.session,draws:[{id:'d1',status:'confirmed',at:NOW,winner:{name:'AuroraFox',platform:'kick'}}]}};
  const g2=M.projectGiveaway(confirmed,s,NOW);assert.equal(g2.status,'winner');assert.deepEqual(g2.winner,{name:'AuroraFox',platform:'kick'});
  const winners=M.mergeWinners(M.mergeWinners([],[g2],NOW),[g2],NOW+1000);assert.equal(winners.length,1);
});

test('Hidden names, switched-off sections and unsafe settings are respected',()=>{
  const feed=M.buildFeed({collected:collect(),settings:{showNames:false,sections:{points:false,versus:false},links:{twitch:'javascript:alert(1)',discord:'https://discord.gg/voyager'},commands:{impromptu:'!enter; rm -rf'}},pilots:[{name:'Ace',wins:1,losses:0,draws:0,battles:1}],versus:{status:'ready'},now:NOW});
  assert.deepEqual(feed.leaderboards.points,[]);assert.equal(feed.versus,null);
  assert.equal(feed.leaderboards.pilots[0].name,'A••');
  assert.deepEqual(feed.channel.links,{discord:'https://discord.gg/voyager'});
  assert.equal(feed.giveaways[0].enter,'!enter');
});

test('The host refuses anything outside the allow-list a page might send',()=>{
  const c=M.sanitizeCollected({giveaways:[{id:'x<script>',kind:'tickets',status:'open',title:'T',enter:'!go',entrants:-5,tickets:'9',users:[{id:'SECRET_USER_ID_9911'}],winner:{name:'Early',platform:'twitch'}},{kind:'other',status:'open'}],points:{leaders:[{name:'A',value:1,id:'SECRET_USER_ID_9911'}]},viewers:999,extra:'SECRET_CHAT'});
  const text=JSON.stringify(c);for(const s of SECRET)assert.ok(!text.includes(s));
  assert.equal(c.giveaways.length,1);assert.equal(c.giveaways[0].id,'xscript');assert.equal(c.giveaways[0].entrants,0);assert.equal(c.giveaways[0].winner,null);assert.ok(!('viewers' in c));
});

function fakeGitHub(){
  const calls=[];let fail=0;
  const server=http.createServer(async(req,res)=>{
    let body='';for await(const c of req)body+=c;calls.push({method:req.method,url:req.url,auth:req.headers.authorization,body:body?JSON.parse(body):null});
    if(fail){fail--;res.writeHead(401);res.end('{}');return;}
    const send=(code,obj)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(obj));};
    if(req.url.endsWith('/git/trees'))return send(201,{sha:'tree1'});
    if(req.url.endsWith('/git/commits'))return send(201,{sha:'commit'+calls.length});
    if(req.method==='PATCH'&&calls.filter(c=>c.method==='PATCH').length===1)return send(422,{message:'Reference does not exist'});
    return send(200,{ref:'refs/heads/public-data'});
  });
  return new Promise(r=>server.listen(0,'127.0.0.1',()=>r({server,calls,base:'http://127.0.0.1:'+server.address().port,failNext:n=>{fail=n;}})));
}

test('Uploads replace the public-data branch with one commit, creating it the first time',async()=>{
  const gh=await fakeGitHub();
  try{
    await uploadFeed({fetchImpl:fetch,apiBase:gh.base,repo:'mda009/voyager',token:'github_pat_x',content:'{"a":1}'});
    assert.deepEqual(gh.calls.map(c=>c.method+' '+c.url),['POST /repos/mda009/voyager/git/trees','POST /repos/mda009/voyager/git/commits','PATCH /repos/mda009/voyager/git/refs/heads/public-data','POST /repos/mda009/voyager/git/refs']);
    assert.deepEqual(gh.calls[1].body.parents,[]);assert.equal(gh.calls[0].body.tree[0].path,'feed.json');assert.equal(gh.calls[2].body.force,true);assert.equal(gh.calls[0].auth,'Bearer github_pat_x');
    assert.equal(pagesUrl('MDA009/voyager'),'https://mda009.github.io/voyager/');assert.equal(pagesUrl('mda009/MDA009.github.io'),'https://mda009.github.io/');
  }finally{gh.server.close();}
});

test('Publishing is throttled, never exposes the token, and backs off on errors',async()=>{
  const gh=await fakeGitHub(),dir=await mkdtemp(join(tmpdir(),'voyager-public-'));let clock=NOW,site;
  try{
    site=await new PublicSite({dataDir:dir,model:M,apiBase:gh.base,now:()=>clock}).load();
    await assert.rejects(site.configure({settings:{publish:{enabled:true,repo:'not a repo'}}}),/owner\/name/);
    await assert.rejects(site.configure({token:'hunter2'}),/GitHub token/);
    const view=await site.configure({settings:{channelName:'MDA009',publish:{enabled:true,repo:'mda009/voyager'}},token:'github_pat_'+'a'.repeat(40)});
    assert.equal(view.hasToken,true);assert.ok(!JSON.stringify(view).includes('github_pat_'));
    assert.equal(view.siteUrl,'https://mda009.github.io/voyager/');
    site.receive(collect());await site.tick();
    const first=gh.calls.length;assert.ok(first>=3);
    clock+=20000;site.receive(collect());await site.tick();assert.equal(gh.calls.length,first,'unchanged feed is not re-uploaded early');
    clock+=301000;await site.tick();assert.ok(gh.calls.length>first,'keep-alive upload after 5 minutes');
    const saved=await readFile(join(dir,'public-site.json'),'utf8');assert.match(saved,/github_pat_/);
    gh.failNext(1);clock+=301000;await site.tick();
    assert.match(site.view().upload.lastError,/rejected the token/);const n=gh.calls.length;
    clock+=10000;await site.tick();assert.equal(gh.calls.length,n,'waits before retrying');
  }finally{gh.server.close();await site?.saving;await rm(dir,{recursive:true,force:true,maxRetries:3});}
});

test('The running host serves the local preview and feed, and keeps the token private',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'voyager-public-host-')),port=18771,base='http://127.0.0.1:'+port;
  const child=spawn(process.execPath,[fileURLToPath(new URL('../local/server.mjs',import.meta.url))],{env:{...process.env,VOYAGER_DATA_DIR:dir,VOYAGER_PORT:String(port)},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('timeout')),6000);child.stdout.on('data',d=>{if(String(d).includes('Control panel:')){clearTimeout(t);resolve();}});});
    assert.match(await(await fetch(base+'/public/')).text(),/voyager-feed/);
    assert.equal((await fetch(base+'/public/assets/voyager.png')).status,200);
    assert.equal((await fetch(base+'/public/../config.js')).status,404);
    assert.equal((await fetch(base+'/public/public-site.json')).status,404);
    assert.equal((await fetch(base+'/api/public-site')).status,403);
    const {token}=await(await fetch(base+'/api/admin')).json(),h={'Content-Type':'application/json','X-Voyager-Token':token};
    const r=await(await fetch(base+'/api/public-site/feed',{method:'POST',headers:h,body:JSON.stringify(collect())})).json();
    assert.equal(r.ok,true);assert.equal(r.feed.giveaways.length,2);
    const feed=await(await fetch(base+'/public/feed.json')).json();assert.equal(feed.online,true);assert.equal(feed.versus.winnerPoints,50);
    await fetch(base+'/api/public-site/settings',{method:'POST',headers:h,body:JSON.stringify({token:'github_pat_'+'b'.repeat(40)})});
    const view=await(await fetch(base+'/api/public-site',{headers:h})).json();assert.equal(view.hasToken,true);assert.ok(!JSON.stringify(view).includes('github_pat_'));
    assert.ok(!(await(await fetch(base+'/public/feed.json')).text()).includes('github_pat_'));
  }finally{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));await rm(dir,{recursive:true,force:true});}
});

test('Your own web address is kept as a site root and the website code only trusts that address',()=>{
  assert.equal(M.normalizeSettings({publish:{siteUrl:'https://voyager.theunprofessionalsgroup.com/some/page?x=1'}}).publish.siteUrl,'https://voyager.theunprofessionalsgroup.com/');
  assert.equal(M.normalizeSettings({publish:{siteUrl:'http://insecure.example.com'}}).publish.siteUrl,'');
  const code=M.embedSnippet('https://voyager.theunprofessionalsgroup.com/');
  assert.match(code,/src="https:\/\/voyager\.theunprofessionalsgroup\.com\/\?embed=1"/);
  assert.match(code,/e\.origin!=='https:\/\/voyager\.theunprofessionalsgroup\.com'/);
  assert.equal(M.embedSnippet('javascript:alert(1)'),'');assert.equal(M.embedSnippet('https://a.com/"><script>'),M.embedSnippet('https://a.com/%22%3E%3Cscript%3E'));
});

test('Season sub goals and subscriber missions publish totals and counts only, never who helped',()=>{
  const community={weekEndsAt:NOW+86400000,missions:[{title:'Crew Supporter',type:'subscribe',platform:'kick',target:1,reward:500,completed:2},{title:'Odd',type:'hack',platform:'myspace',target:1,reward:1,completed:0}],
    season:{name:'Season 1',endsAt:NOW+86400000,supportBonus:100,standings:[{name:'Nova',platform:'twitch',points:900,support:3,wins:0,key:'twitch:SECRET_USER_ID_9911'}],
      goals:[{title:'Grow the Crew',metric:'support',platform:'all',target:50,total:12,reward:300,reached:false,helpers:4,helperList:[{key:'twitch:SECRET_USER_ID_9911',name:'secretlogin_77'}]}]},hall:[]};
  const feed=M.buildFeed({collected:collect(),settings:{},community,now:NOW}),text=JSON.stringify(feed);
  assert.deepEqual(feed.season.goals,[{title:'Grow the Crew',metric:'support',platform:'all',target:50,total:12,reward:300,reached:false,helpers:4}]);
  assert.equal(feed.season.standings[0].support,3);assert.equal(feed.season.supportBonus,100);
  assert.deepEqual(feed.missions.list.map(m=>[m.type,m.platform]),[['subscribe','kick'],['earnPoints','all']]);
  for(const s of SECRET)assert.ok(!text.includes(s),'leaked '+s);
});

test('Stream companion: live status, Dreadnought, ranks and medals are allow-listed; crew.json only with names on',async()=>{
  const M=await import('../../public-feed-model.mjs');
  const companion={live:{onAir:true},
    dreadnought:{phase:'battle',name:'The Dreadnought',hp:400,maxHp:1000,pilots:7,victoryPoints:100,endsAt:Date.now()+60000,leaders:[{name:'Nova',platform:'twitch',damage:300,key:'twitch:1',login:'nova'}],history:[{outcome:'victory',endedAt:Date.now()-1000,pilots:5,mvp:{name:'Rook',platform:'kick',damage:900},rewarded:['twitch:1']}]},
    ranks:{ladder:[{id:'mid',name:'Midshipman',abbr:'MIDN',points:0,top:0,holders:9}],top:[{key:'twitch:1',name:'Nova',platform:'twitch',rank:3,lifetime:52000,tier:'gold',need:1}],promotions:[{key:'twitch:1',name:'Nova',platform:'twitch',from:2,rank:3,at:Date.now()}]},
    medals:{catalogue:[{id:'watch',name:'Time Watched',cat:'loyalty',kind:'count',unit:'hours',grades:[10,100,500,1500],earned:[3,1,0,0],desc:'Hours',icon:'M12 7v5'},{id:'nightwatch',name:'Night Watch',cat:'special',kind:'secret',desc:'Earned points at night',icon:'<script>'}],
      honour:[{key:'twitch:1',name:'Nova',platform:'twitch',honour:22,medals:7}],recent:[{key:'twitch:1',name:'Nova',platform:'twitch',medal:'watch',grade:1,at:Date.now(),id:5}]}};
  const f=M.buildFeed({collected:{},settings:{},companion,crewCount:3});
  assert.equal(f.live.onAir,true);assert.equal(f.dreadnought.phase,'battle');assert.equal(f.dreadnought.leaders[0].name,'Nova');
  const text=JSON.stringify(f);
  for(const banned of ['twitch:1','"login"','rewarded','<script>','Earned points at night','watchSeconds'])assert.ok(!text.includes(banned),banned+' must not be published');
  assert.equal(f.medals.catalogue[1].desc,'Secret medal. How to earn it is for you to discover.');assert.equal(f.medals.catalogue[1].icon,'');
  assert.deepEqual(f.crew,{file:'crew.json',count:3});
  const offline=M.buildFeed({collected:{},settings:{},companion,online:false});assert.equal(offline.live.onAir,false);assert.equal(offline.dreadnought.phase,'idle');
  const hidden=M.buildFeed({collected:{},settings:{showNames:false},companion,crewCount:3});assert.equal(hidden.crew,undefined);assert.equal(hidden.ranks.top[0].name,M.initials('Nova'));
  const off=M.buildFeed({collected:{},settings:{sections:{ranks:false,medals:false,dreadnought:false,live:false,crew:false}},companion,crewCount:3});
  for(const k of ['ranks','medals','dreadnought','live','crew'])assert.equal(off[k],undefined,k);
  const crew=M.buildCrew([{name:'Nova',platform:'twitch',tier:'gold',rank:3,place:1,lifetime:52000,medals:[['watch',1],['bad id!',2]],key:'twitch:1'}],{});
  assert.deepEqual(crew.members,[['Nova','twitch','gold',3,1,52000,[['watch',1]],null]]);
  const rec=M.buildCrew([{name:'Nova',record:{honour:22,fights:4,victories:2,mvp:1,damage:3000,wins:5,losses:2,missions:9,giveaways:1,podiums:0,seasonPlace:3,seasonPoints:1800,since:'2025-03',watchSeconds:99,months:14}}],{sections:{activity:false}}).members[0][7];
  assert.deepEqual(rec,[22,4,2,1,3000,5,2,9,1,0,3,1800,'2025-03'],'with Activity off: no watch time or months');
  assert.equal(M.buildCrew([{name:'Nova'}],{showNames:false}),null);
  const act=M.buildCrew([{name:'Nova',record:{hours:300,months:14,subBest:6,gifts:3,messages:50,streams:40,private:false,bits:9999}}],{}).members[0][7];
  assert.equal(act.length,25);assert.equal(act[13],300);assert.equal(act[14],14);assert.equal(act[20],50);assert.ok(!act.includes(9999),'never Bits');
  const priv=M.buildCrew([{name:'Nova',record:{hours:300,months:14,subBest:6,private:true}}],{}).members[0][7];assert.deepEqual([priv[13],priv[14],priv[15],priv[24]],[0,0,0,1],'!voyager private hides hours and months');
  assert.equal(M.buildCrew([{name:'Nova',record:{hours:300}}],{sections:{activity:false}}).members[0][7].length,13,'Activity switch off');
});
