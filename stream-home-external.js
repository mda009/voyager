/* Home refresh status and scheduling. Uses existing saved WebSocket settings. */
(()=>{'use strict';
const $=id=>document.getElementById(id),demo=new URLSearchParams(location.search).get('demo')==='1',key='VoyagerExternalStatusV1',names=['TwitchTracker','TwitchMetrics'];
let connection=null,options=null,sources={},busy=false,rejected={};
const stamp=time=>time?new Date(time).toLocaleString('en-AU'):'Never';
const node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
try{if(!demo){const raw=JSON.parse(localStorage.getItem(key)||'{}');for(const name of names)if(raw[name])sources[name]=raw[name];}}catch{}
function render(){
 const list=$('external-refresh-sources');if(!list)return;list.replaceChildren();
 for(const name of names){const s=sources[name]||{},card=node('article','');const problem=rejected[name]||s.error;
  card.dataset.state=problem?'warn':s.lastSuccessAt?'ok':'waiting';
  card.append(node('strong',name),node('span',demo?'Demo · no external requests':problem?'Last refresh failed':s.lastSuccessAt?'Last successful retrieval':'Awaiting first check'));
  card.append(node('small',demo?'Live mode checks on page load and every 30 minutes.':stamp(s.lastSuccessAt)));
  if(!demo){if(s.lastAttemptAt)card.append(node('small','Last attempt: '+stamp(s.lastAttemptAt)));if(problem)card.append(node('p',problem+' Saved figures remain available.'));else if(s.warning)card.append(node('p',s.warning));
   if(s.nextAttemptAt>Date.now())card.append(node('small',(s.error?'Source retry available after ':'Short cache until ')+stamp(s.nextAttemptAt)));}
  list.append(card);
 }
 $('external-refresh-button').disabled=busy||demo;$('external-refresh-button').textContent=busy?'Refreshing…':'Refresh external data';
}
function status(text){$('external-refresh-status').textContent=text;}
function connect(config){
 if(demo)return;options=config;connection?.stop();busy=false;render();
 connection=new VoyagerExternalAnalyticsConnection(config);const active=connection;
 active.addEventListener('status',e=>{if(active!==connection)return;busy=false;status(e.detail.message);render();});
 active.addEventListener('loading',()=>{if(active!==connection)return;busy=true;status('Checking TwitchTracker and TwitchMetrics…');render();});
 active.addEventListener('external',e=>{if(active!==connection)return;try{
  const result=window.VoyagerHome.mergeExternal(e.detail);sources=e.detail.sources;rejected=result.rejected;
  const failed=names.filter(name=>sources[name]?.error||rejected[name]||!sources[name]?.lastSuccessAt);
  status((failed.length?'Check completed with '+failed.length+' source notice'+(failed.length===1?'':'s')+'.':'Source check complete.')+' Next automatic check: '+stamp(Date.now()+30*60*1000)+'.');
  // Persist status only; the validated history is stored separately by VoyagerHome.
  const summary={};for(const name of names){const s=sources[name]||{};summary[name]={lastAttemptAt:s.lastAttemptAt,lastSuccessAt:s.lastSuccessAt,nextAttemptAt:s.nextAttemptAt,error:s.error,warning:s.warning};}try{localStorage.setItem(key,JSON.stringify(summary));}catch{}
 }catch(err){status('External data could not be applied: '+err.message+' Saved figures retained.');}render();});
 active.addEventListener('notice',e=>{if(active===connection){status(e.detail+' Saved figures retained.');render();}});
 active.addEventListener('idle',()=>{if(active===connection){busy=false;render();}});active.connect();
}
if($('external-refresh-button'))$('external-refresh-button').onclick=()=>{if(demo)return;if(!connection?.transportReady){connect(options||{...window.VOYAGER_CONFIG});return;}connection.sync().catch(()=>{});};
window.VoyagerExternalAnalytics={connect,stop(){connection?.stop();},refresh(){if(!demo&&connection?.transportReady)return connection.sync();return Promise.resolve();}};
if(demo)status('Demo preview · automatic external checks are disabled.');render();
})();
