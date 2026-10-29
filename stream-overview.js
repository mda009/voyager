/* Compact Home readiness view; detailed live and reporting panels live on their pages. */
(()=>{'use strict';
const $=id=>document.getElementById(id),demo=new URLSearchParams(location.search).get('demo')==='1';
function update({model,statsAvailable,sourceProblem}){
 const now=Date.now(),connected=model.connected,fresh=connected&&model.snapshotAt&&now-model.snapshotAt<=150000,total=model.total();let external={};
 try{external=JSON.parse(localStorage.getItem('VoyagerExternalStatusV1')||'{}');}catch{}
 const success=Math.max(...['TwitchTracker','TwitchMetrics'].map(k=>Number(external[k]?.lastSuccessAt)||0)),sourceProblems=['TwitchTracker','TwitchMetrics'].some(k=>external[k]?.error);
 const rows=[
  {name:'Streamer.bot connection',detail:connected?'Connected to your stream tools':'Open Streamer.bot and check Connection settings',value:demo?'Demo':connected?'Connected':'Disconnected',state:connected?'ok':'warn'},
  {name:'Saved counters & membership',detail:statsAvailable===false?'Voyager - Stream Stats action not found':fresh?'Automatic reads every 60 seconds':sourceProblem||'Waiting for a successful stats read',value:fresh?'Current':model.snapshotAt?'Last received':'Waiting',state:fresh?'ok':'warn'},
  {name:'Platform data coverage',detail:'Open Live dashboard for viewer counts and goals',value:total.coverage+' / 3',state:total.coverage===3?'ok':total.coverage?'neutral':'warn'},
  {name:'External reporting data',detail:demo?'Open Reporting to preview external source status':success?'Last successful retrieval '+new Date(success).toLocaleString()+'. Open Reporting to refresh.':'Open Reporting to check TwitchTracker and TwitchMetrics',value:demo?'Sample':sourceProblems?'Check source':success?'Saved':'Not checked',state:demo?'neutral':sourceProblems?'warn':success?'ok':'neutral'},
  {name:'OBS broadcast quality',detail:'Bitrate / dropped frames not connected',value:'Not measured',state:'neutral'}
 ];
 const list=$('home-health-list');list.replaceChildren();for(const r of rows){const li=document.createElement('li');li.dataset.state=r.state;const copy=document.createElement('div'),strong=document.createElement('strong'),small=document.createElement('small'),value=document.createElement('span');strong.textContent=r.name;small.textContent=r.detail;value.textContent=r.value;copy.append(strong,small);li.append(document.createElement('i'),copy,value);list.append(li);}
 $('health-summary').textContent=demo?'DEMO':!connected?'OFFLINE':fresh?'CONNECTED':'CHECK DATA';$('health-summary').dataset.state=connected&&fresh?'ok':'warn';
}
window.VoyagerOverview={update};
})();
