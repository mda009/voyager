(()=>{'use strict';
const clone=o=>JSON.parse(JSON.stringify(o));
const id=()=>crypto.randomUUID?crypto.randomUUID():'demo-'+Date.now()+'-'+crypto.getRandomValues(new Uint32Array(1))[0];
function uniform(n){if(!Number.isInteger(n)||n<1)throw Error('The pool is empty.');const range=4294967296,limit=range-range%n,b=new Uint32Array(1);do{crypto.getRandomValues(b);}while(b[0]>=limit);return b[0]%n;}
function mergePool(groups,selected,exclude=''){
 const rows=[],aliases=new Map(),blocked=new Set(String(exclude).toLowerCase().split(/[\s,;]+/).map(s=>s.replace(/^@/,'')));
 for(const tier of selected){const g=groups?.[tier];if(!g||g.exists===false||g.error||!Array.isArray(g.users))throw Error(g?.error||'Group unavailable: '+tier);for(const raw of g.users){const u={id:String(raw.id||raw.Id||'').trim(),login:String(raw.login||raw.Login||'').trim().toLowerCase(),name:String(raw.name||raw.Username||raw.login||'').trim(),platform:String(raw.platform||raw.Type||'').trim().toLowerCase(),tier};if(!u.platform||!u.name||(!u.id&&!u.login))throw Error('Incomplete member identity in '+tier);rows.push(u);if(u.id&&u.login){const a=u.platform+':'+u.login;if(aliases.has(a)&&aliases.get(a)!==u.id)throw Error('Conflicting IDs for '+u.login);aliases.set(a,u.id);}}}
 const keyOf=u=>u.platform+((u.id||aliases.get(u.platform+':'+u.login))?':id:'+(u.id||aliases.get(u.platform+':'+u.login)):':login:'+u.login);
 const blockedKeys=new Set(rows.filter(u=>blocked.has(u.login)).map(keyOf));const map=new Map();let acceptedRows=0;
 for(const u of rows){const key=keyOf(u);if(blockedKeys.has(key))continue;acceptedRows++;if(!map.has(key))map.set(key,{key,id:u.id||aliases.get(u.platform+':'+u.login)||'',login:u.login,name:u.name,platform:u.platform,groups:[]});const member=map.get(key);if(!member.groups.includes(u.tier))member.groups.push(u.tier);}
 return{pool:[...map.values()].sort((a,b)=>a.name.localeCompare(b.name)),duplicatesRemoved:acceptedRows-map.size};
}
const sampleNames=['AetherPilot','AuroraFox','BeaconRunner','BlueHorizon','CelestialNomad','CometRider','CosmicWanderer','DeepSpaceDave','EclipseVoyager','EmberFalcon','GravityGhost','HorizonSeeker','IonDrifter','LunarRanger','NebulaKnight','NovaPathfinder','OrbitBreaker','QuantumScout','SolarSentinel','StarboundAce','StellarEcho','TerraNavigator','VoidWalker','ZenithCaptain','AstraWings','CorvusRider','DriftCaptain','EchoVanguard','FrostNomad','GalacticTinker','HeliosJade','IgnitionFox','JunoSkies','KeplerOne','LightSpeedLily','MeteorMason','NyxHarbour','OrionVale','PolarisPatch','QuasarQuinn','RiftRunner','SolsticeStar'];
function demoGroups(){const slices={blue:[0,28],silver:[14,32],gold:[26,37],platinum:[32,42],vip:[12,21]},groups={};for(const k of VoyagerGroups.keys){groups[k]={exists:true,error:'',groupName:k==='vip'?'VIP GROUP':k.toUpperCase()+' GROUP',users:sampleNames.slice(...slices[k]).map(name=>({id:String(sampleNames.indexOf(name)+100),login:name.toLowerCase(),name,platform:'twitch'}))};}return groups;}
class DemoEngine extends EventTarget{
 constructor(){super();this.ready=true;this.offset=0;this.groups=demoGroups();this.state={schema:1,engineVersion:7,revision:0,controlRevision:0,session:null,preview:null,celebration:null,view:'hidden',reveal:null,audit:[],requests:[]};}
 emit(name,detail){this.dispatchEvent(new CustomEvent(name,{detail}));}
 connect(){this.emit('status',{state:'demo',message:'Offline demo · sample members'});this.refreshMembers();this.sync();}
 stop(){}
 refreshMembers(){this.emit('members',{type:'voyager.members.v1',groups:this.groups});return Promise.resolve();}
 sync(){const s=this.state;if(!s.session&&s.preview){try{Object.assign(s.preview,mergePool(this.groups,s.preview.groups,s.preview.excludeLogins),{updatedAt:Date.now(),error:''});}catch(e){s.preview.error=e.message;}s.revision++;}this.emit('state',{ok:true,state:clone(s),serverAt:Date.now()});return Promise.resolve(clone(s));}
 enter(entry){
  const s=this.state,session=s.session;
  if(session?.mode!=='chat'||!session.entriesOpen)return false;
  const platform=String(entry.platform).toLowerCase(),command=String(entry.command).trim().toLowerCase(),uid=String(entry.id||'').trim(),login=String(entry.login||'').trim().replace(/^@/,'').toLowerCase();
  if(!['twitch','youtube','kick'].includes(platform)||!['!ticket','!enter'].includes(command)||!uid||!entry.name||entry.isInternal)return false;
  const blocked=String(session.excludeLogins||'').split(/[\s,;]+/).map(x=>x.replace(/^@/,''));
  if(blocked.some(x=>x.includes(':id:')?x===platform+':id:'+uid:[login,platform+':'+login].includes(x.toLowerCase())))return false;
  const key=platform+':id:'+uid;if(session.pool.some(u=>u.key===key)||session.pool.length>=50000)return false;
  const ticketNumber=session.pool.length+1;session.pool.push({key,id:uid,login,name:entry.name,platform,groups:[],enteredAt:Date.now(),entryCommand:command,ticketNumber,avatarUrl:entry.avatarUrl||'demo-avatar-'+((ticketNumber-1)%6+1)+'.svg',confirmationState:'demo'});
  if(session.pool.length===50000){session.entriesOpen=false;session.closedAt=Date.now();s.controlRevision++;}
  s.revision++;this.sync();this.emit('chat-confirmation',{platform,ticketNumber,text:'[Voyager] '+String(entry.name).replace(/[\x00-\x1F\x7F]/g,'').slice(0,60)+", you're entered! Ticket #"+String(ticketNumber).padStart(4,'0')+'. Good luck!'});return true;
 }
 async command(op,args={}){
  if(op==='sync')return this.sync();const s=clone(this.state),now=Date.now(),session=s.session;
  if(Number(args.controlRevision??args.revision)!==s.controlRevision)throw Error('State changed. Refresh before trying again.');
  let current=session?.draws.find(d=>d.id===session.currentDrawId);
  if(op!=='hide'&&s.reveal&&now<s.reveal.at+20000)throw Error('Wait for the 20-second reveal to finish.');
  if(op==='new'){if(current?.status==='selected'){current.status='not_confirmed';const a=s.audit.findIndex(d=>d.id===current.id);s.audit[a]=clone(current);}s.session=null;s.preview=null;s.celebration=null;s.reveal=null;s.view='hidden';}
  else if(op==='hide')s.view='hidden';
  else if(op==='preview'){
   if(session)throw Error('Start a new giveaway before changing its member pool.');
   const selected=VoyagerGroups.keys.filter(k=>String(args.groups).split(',').includes(k));
   if(args.mode!=='groups'||!selected.length)throw Error('Choose at least one membership group.');
   if(!String(args.title||'').trim()||String(args.title).trim().length>160)throw Error('Enter a prize title of 1–160 characters.');
   const merged=mergePool(this.groups,selected,args.excludeLogins);if(merged.pool.length>50000)throw Error('The member limit has been reached.');
   s.preview={id:s.preview?.id||id(),mode:'groups',preview:true,entriesOpen:true,title:String(args.title).trim(),createdAt:s.preview?.createdAt||now,updatedAt:now,error:'',groups:selected,claimSeconds:Number(args.claimSeconds)||0,excludeLogins:args.excludeLogins,...merged,draws:[],currentDrawId:''};s.view='pool';s.reveal=null;
  }
  else if(op==='create'){
   if(session)throw Error('Start a new giveaway first.');
   const chat=args.mode==='chat',selected=chat?[]:String(args.groups).split(',').filter(k=>VoyagerGroups.keys.includes(k));
   if(!chat&&!selected.length)throw Error('Choose at least one group.');if(!String(args.title||'').trim())throw Error('Enter a prize title.');
   const merged=chat?{pool:[],duplicatesRemoved:0}:mergePool(this.groups,selected,args.excludeLogins);if(!chat&&!merged.pool.length)throw Error('The selected pool is empty.');
   const showingPreview=!!s.preview&&s.view==='pool';s.session={id:id(),mode:chat?'chat':'groups',title:args.title,createdAt:now,groups:selected,claimSeconds:Number(args.claimSeconds)||0,excludeLogins:args.excludeLogins,...merged,draws:[],currentDrawId:'',...(chat?{entriesOpen:true,openedAt:now,closedAt:0}:{})};s.preview=null;s.view=chat||showingPreview?'pool':'hidden';s.reveal=null;
  }else if(op==='test'){s.reveal={id:id(),at:now,winner:'MDA009 · TEST',title:'TEST REVEAL — no winner drawn',claimDeadline:0,test:true};s.view='reveal';}
  else if(!session)throw Error('Load and lock a pool first.');
  else if(op==='pool')s.view='pool';
  else if(op==='closeEntries'||op==='reopenEntries'){
   if(session.mode!=='chat'||session.draws.length)throw Error('Entries can only change before the first impromptu draw.');
   const opening=op==='reopenEntries';if(session.entriesOpen===opening)throw Error('Entries are already '+(opening?'open.':'closed.'));
   if(opening&&session.pool.length>=50000)throw Error('The entry limit has been reached.');
   session.entriesOpen=opening;session[opening?'openedAt':'closedAt']=now;s.view='pool';s.reveal=null;
  }
  else if(op==='confirm'){
   if(!current||current.status!=='selected')throw Error('No unconfirmed winner.');if(current.claimDeadline&&now>=current.claimDeadline)throw Error('The claim window expired. Reroll to choose someone else.');current.status='confirmed';current.confirmedAt=now;s.audit[s.audit.findIndex(d=>d.id===current.id)]=clone(current);s.celebration={id:id(),drawId:current.id,at:now,winner:current.winner.name};s.reveal=null;s.view='celebration';
  }else if(op==='replay'){
   if(!current)throw Error('Draw a winner first.');s.reveal={id:id(),drawId:current.id,at:now,winner:current.winner.name,platform:session.mode==='chat'?current.winner.platform:'',title:session.title,claimDeadline:current.status==='confirmed'?0:current.claimDeadline,test:false};s.view='reveal';
  }else if(op==='draw'||op==='reroll'){
   if(session.mode==='chat'&&session.entriesOpen)throw Error('Close entries before drawing.');if(op==='draw'&&current?.status==='selected')throw Error('Confirm the winner or use Reroll.');if(op==='reroll'&&current?.status!=='selected')throw Error('No winner awaiting a reroll.');const used=new Set(session.draws.map(d=>d.winner.key)),pool=session.pool.filter(u=>!used.has(u.key));if(!pool.length)throw Error('No eligible members remain.');if(op==='reroll'){current.status='rerolled';s.audit[s.audit.findIndex(d=>d.id===current.id)]=clone(current);}
   const d={id:id(),sessionId:session.id,mode:session.mode,title:session.title,groups:session.groups,winner:clone(pool[uniform(pool.length)]),eligibleCount:pool.length,at:now,claimDeadline:session.claimSeconds?now+30000+session.claimSeconds*1000:0,status:'selected'};session.draws.push(d);session.currentDrawId=d.id;s.audit.push(clone(d));s.reveal={id:id(),drawId:d.id,at:now,winner:d.winner.name,platform:session.mode==='chat'?d.winner.platform:'',title:session.title,claimDeadline:d.claimDeadline,test:false};s.view='reveal';
  }else throw Error('Unknown command.');
  s.revision++;s.controlRevision++;this.state=s;return this.sync();
 }
}
window.VoyagerPool={mergePool,uniform};window.VoyagerDemo=DemoEngine;
})();
