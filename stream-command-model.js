(()=>{'use strict';
const PLATFORMS=['twitch','youtube','kick'],NAMES={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},FRESH=300000;
const number=x=>{if(x===null||x===undefined||typeof x==='boolean'||typeof x==='object'||(typeof x==='string'&&!x.trim()))return null;const n=Number(x);return Number.isFinite(n)&&n>=0&&n<=Number.MAX_SAFE_INTEGER?n:null;};
function normalize(raw={}){const s={leaderboardSetupVersion:number(raw.leaderboardSetupVersion)||0,savedAt:number(raw.savedAt)||0,statsActionName:typeof raw.statsActionName==='string'?raw.statsActionName:'Voyager - Stream Stats',connection:raw.connection&&typeof raw.connection==='object'?raw.connection:{},goals:{},sources:{},manual:{},excluded:String(raw.excluded||'').slice(0,3000)};
 for(const p of PLATFORMS){const g=raw.goals?.[p]||{},v=raw.sources?.[p]||{},m=raw.manual?.[p]||{};s.goals[p]={};for(const k of ['viewers','followers','subscriptions'])s.goals[p][k]=number(g[k])>0?number(g[k]):null;s.sources[p]={leaderboardMode:v.leaderboardMode==='custom'?'custom':'native',persisted:v.persisted!==false,watchtimeUnits:['seconds','minutes','hours'].includes(v.watchtimeUnits)?v.watchtimeUnits:'minutes'};for(const k of ['followers','subscriptions','watchtime','months','gifts'])s.sources[p][k]=String(v[k]||'').trim().slice(0,128);s.manual[p]={followers:number(m.followers),subscriptions:number(m.subscriptions),at:number(m.at)||null};}return s;
}
// Native mode reads the independent Voyager community ledger. Stored-field mappings
// are kept for optional custom mode and are never used by native mode.
function prepareLeaderboards(raw={}){const s=normalize(raw);s.leaderboardSetupVersion=2;return s;}
class StreamModel{
 constructor(){this.connected=false;this.platforms=Object.fromEntries(PLATFORMS.map(p=>[p,{viewer:null,live:null,title:'',liveAt:0}]));this.youtube=new Map();this.snapshot=null;this.snapshotAt=0;this.history=Object.fromEntries(PLATFORMS.map(p=>[p,[]]));this.activity=[];this.eventIds=new Map();this.lastSample=0;}
 viewer(p,value,at,source){const n=number(value);if(n===null||n%1)return false;this.platforms[p].viewer={value:n,at,source};if(n>0){this.platforms[p].live=true;this.platforms[p].liveAt=at;}this.sample(at,true);return true;}
 applyStats(data,at=Date.now()){if(!data?.ok||data.schema!==1)return false;this.snapshot=data;this.snapshotAt=at;return true;}
 handle({event={},data={},timeStamp},now=Date.now()){
  const p=String(event.source||'').toLowerCase(),type=event.type;if(!PLATFORMS.includes(p)||data.isTest===true||data.isTest==='true'||data.isFromSharedChatGuest)return false;
  const reported=Date.parse(timeStamp);if(Number.isFinite(reported)&&(now-reported>FRESH||reported>now+60000))return false;
  const ch=this.platforms[p];
  if(p!=='youtube'&&(type==='ViewerCountUpdate'||type==='PresentViewers')&&Object.hasOwn(data,'viewerCount'))this.viewer(p,data.viewerCount,now,'Platform viewer update');
  if(type==='StreamOnline'){ch.live=true;ch.liveAt=now;ch.viewer=null;}
  if(type==='StreamOffline'){ch.live=false;ch.liveAt=now;this.viewer(p,0,now,'Stream offline');}
  if(p==='youtube'){
   const broadcast=data.broadcast||{},id=broadcast.id;
   if(type==='StatisticsUpdated'&&id&&number(data.concurrentViewers)!==null){
    const ended=['complete','completed','ended'].includes(String(broadcast.status||'').toLowerCase());
    this.youtube.set(id,{value:ended?0:number(data.concurrentViewers),at:now,ended,title:broadcast.title||''});
   }
   if(['BroadcastEnded','BroadcastMonitoringEnded'].includes(type)&&id){this.youtube.set(id,{value:0,at:now,ended:true,title:broadcast.title||''});}
   if(type==='BroadcastStarted'){if(id)this.youtube.set(id,{value:null,at:now,ended:false,title:broadcast.title||''});ch.live=true;ch.liveAt=now;}
   if(['StatisticsUpdated','BroadcastEnded','BroadcastMonitoringEnded','BroadcastStarted'].includes(type))this.youtubeTotal(now);
   if(broadcast.title)ch.title=String(broadcast.title).slice(0,250);
  }else if(['StreamOnline','StreamUpdate','ChannelUpdate'].includes(type))ch.title=String(data.title||data.status||ch.title).slice(0,250);
  const labels={Follow:'New follower',NewSubscriber:'New channel subscriber',Sub:'Subscribed',ReSub:'Resubscribed',Subscription:'Subscribed',Resubscription:'Resubscribed',NewSponsor:'New member',MemberMileStone:'Membership milestone',GiftSub:'Gift subscription',GiftBomb:'Community gift subscriptions',GiftSubscription:'Gift subscription',MassGiftSubscription:'Community gift subscriptions',MembershipGift:'Gift memberships',Cheer:'Cheered',Raid:'Incoming raid',SuperChat:'Super Chat',SuperSticker:'Super Sticker'};
  if(labels[type]){
   const user=data.user||data.gifter||data.fromBroadcaster||{},name=user.name||user.displayName||user.login||data.userName||'Community member';
   const explicit=data.id||data.messageId||data.msgId,key=explicit?p+':'+type+':'+explicit:null;
   if(!key||!this.eventIds.has(key)){if(key)this.eventIds.set(key,now);this.activity.unshift({platform:p,name:String(name).slice(0,100),label:labels[type],at:now});this.activity.length=Math.min(40,this.activity.length);}
   for(const [id,at]of this.eventIds)if(now-at>3600000)this.eventIds.delete(id);
  }
  return true;
 }
 youtubeTotal(now){const records=[...this.youtube.values()],active=records.filter(r=>!r.ended),fresh=active.filter(r=>number(r.value)!==null&&now-r.at<FRESH);if(active.length&&fresh.length===active.length){this.viewer('youtube',fresh.reduce((n,r)=>n+r.value,0),Math.min(...fresh.map(r=>r.at)),active.length+' monitored broadcast'+(active.length===1?'':'s'));this.platforms.youtube.live=true;this.platforms.youtube.liveAt=now;}else if(records.length&&!active.length){this.platforms.youtube.live=false;this.platforms.youtube.liveAt=now;this.viewer('youtube',0,now,'Monitored broadcasts ended');}else this.platforms.youtube.viewer=null;}
 current(p,now=Date.now()){const v=this.platforms[p].viewer;return v&&this.connected&&now-v.at<FRESH?v:null;}
 total(now=Date.now()){const values=PLATFORMS.map(p=>this.current(p,now)).filter(Boolean);return{value:values.length?values.reduce((n,v)=>n+v.value,0):null,coverage:values.length};}
 metric(p,key,settings,now=Date.now()){
  const manual=settings.manual[p],source=settings.sources[p],m=this.snapshot?.metrics?.[p]?.[key];
  if(!source[key]&&manual[key]!==null)return{status:'manual',value:manual[key],source:'Manual total',at:manual.at};
  if(m?.status==='ok'&&number(m.value)!==null)return{...m,value:number(m.value),at:this.snapshotAt,stale:!this.connected||now-this.snapshotAt>150000};
  return{status:m?.status||'unconfigured',value:null,reason:m?.reason||'Waiting for the stats action.',source:''};
 }
 leaders(kind,platform,settings){const selected=platform==='all'?PLATFORMS:[platform],rows=[],status=[];const blocked=new Set(settings.excluded.toLowerCase().split(/[\s,;]+/).map(x=>x.replace(/^@/,'')).filter(Boolean));for(const p of selected){let b=this.snapshot?.boards?.[p]?.[kind];if(!['points','pilots'].includes(kind)&&settings.sources[p].leaderboardMode==='native'&&this.snapshot?.communityVersion!==1)b={status:'unconfigured',reason:'Update Voyager - Stream Stats to v3 and install Voyager - Community Tracker.'};if(!['points','pilots'].includes(kind)&&settings.sources[p].leaderboardMode==='native'&&b?.status==='ok'&&b.mode!=='native')b={status:'unconfigured',reason:'Waiting for a native community read. Save & check the leaderboard settings.'};if(kind==='points'&&(this.snapshot?.pointsLeaderboardVersion!==1||b?.mode!=='voyager'))b={status:'unconfigured',reason:'Update Voyager - Stream Stats with Voyager_Stream_Stats.cs v4 to read Voyager points.'};if(kind==='pilots'&&(p!=='twitch'||this.snapshot?.pilotLeaderboardVersion!==1||b?.mode!=='versus'))b={status:'unconfigured',reason:p!=='twitch'?'Pilot rankings use Twitch battles.':'Install the Pilot Leaderboard update for Voyager - Stream Stats and Voyager - Leaderboard Panel.'};if(kind==='gifts'&&platform==='all')b={status:'unconfigured',reason:'Choose one platform: gift total coverage differs between platforms.'};status.push({platform:p,status:b?.status||'unconfigured',reason:b?.reason||'',total:b?.totalRecords||0,basis:b?.basis||'',startedAt:b?.startedAt||null,warning:b?.warning||'',publishedAt:b?.publishedAt||null,stale:b?.stale===true});if(b?.status!=='ok'||!Array.isArray(b.rows))continue;for(const r of b.rows){const n=number(r.value),login=String(r.login||'').toLowerCase();if(kind==='pilots'&&(!['wins','losses','draws','battles'].every(k=>Number.isSafeInteger(r[k])&&r[k]>=0)||r.battles===0||r.wins+r.losses+r.draws!==r.battles||n!==r.wins))continue;if(n===null||(kind==='points'&&(n%1!==0||(p==='twitch'&&['mdavoyagersilver','mdavoyagergold','mdavoyagerplatinum'].includes(login))))||blocked.has(login)||blocked.has(p+':'+login))continue;rows.push({...r,platform:p,value:n,name:String(r.name||r.login||'Unknown')});}}rows.sort((a,b)=>b.value-a.value||(kind==='pilots'?a.losses-b.losses:0)||a.name.localeCompare(b.name)||String(a.login).localeCompare(String(b.login))||a.platform.localeCompare(b.platform));return{rows:rows.slice(0,10),status};}
 sample(now=Date.now(),force=false){if(!force&&now-this.lastSample<30000)return;this.lastSample=now;for(const p of PLATFORMS){const h=this.history[p],v=this.current(p,now);if(force&&h.at(-1)?.at===now)h.pop();h.push({at:now,value:v?.value??null});while(h.length>120||h[0]?.at<now-3600000)h.shift();}}
}
function pilotDemo(names){return{status:'ok',mode:'versus',basis:'saved_battle_wins',totalRecords:names.length,publishedAt:Date.now(),rows:names.map((name,i)=>{const wins=28-i*2,losses=4+i,draws=i%3;return{key:'twitch:pilot:'+i,platform:'twitch',name,login:name.toLowerCase(),value:wins,wins,losses,draws,battles:wins+losses+draws};})};}
window.VoyagerStream={PLATFORMS,NAMES,FRESH,number,normalize,prepareLeaderboards,StreamModel,pilotDemo};
})();
