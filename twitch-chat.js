/* Read the same chat ledger for Live dashboard and Reporting history. */
(()=>{'use strict';
const $=id=>document.getElementById(id),demo=new URLSearchParams(location.search).get('demo')==='1',format=(n,d=0)=>n==null?'—':Number(n).toLocaleString(undefined,{maximumFractionDigits:d}),when=t=>t?new Date(t).toLocaleString():'not received';
let connection=null,options={},live=null,liveAt=0,state='waiting',status='Install Voyager - Twitch Analytics using the setup guide',ctx=null;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function card(label,value,note,stale=false){const n=el('article',undefined,'ta-metric');n.dataset.stale=String(stale);n.append(el('span',label),el('b',value),el('small',note));return n;}
function render(){
 const now=Date.now(),today=live?.today,day=new Date(now).toISOString().slice(0,10),sameDay=today?.date===day,stale=!demo&&(state!=='live'||now-liveAt>90000),captured=sameDay&&today?.firstCapturedAt>0,v=ctx?.model?.current('twitch');
 if($('ta-live-cards')){
  $('ta-live-status').textContent=demo?'DEMO DATA':state==='live'?(stale?'LAST RECEIVED':'TRACKER CONNECTED'):state==='error'?'SETUP NEEDED':state==='offline'?'RECONNECTING':'WAITING';$('ta-live-status').dataset.state=!stale&&state==='live'?'ok':'warn';
  $('ta-live-cards').replaceChildren(card('Twitch viewers now',format(v?.value),v?'Current platform viewer count':'Waiting for a recent viewer update'),card('Unique chatters today',format(captured?today.uniqueChatters:null),'Distinct sending accounts · UTC day',stale),card('Chat messages today',format(captured?today.messages:null),'Messages received · UTC day',stale),card('Messages per minute',format(captured?live.messagesPerMinute:null,1),'Previous 5 completed UTC minutes',stale));
  $('ta-capture-note').textContent=demo?'Fictional preview data. No tracker is connected.':live?(stale?'Last received '+when(liveAt)+'. '+status+'. ':'')+(sameDay?'UTC day '+day+'. ':'Waiting for today’s first snapshot. Previous capture: '+today.date+'. ')+(captured?'First message captured '+when(today.firstCapturedAt)+'; latest '+when(today.lastCapturedAt)+'. ':'No chat captured for this UTC day yet. Check the Chat Message trigger after someone sends a message. ')+'Counts messages received while Streamer.bot and its action are running; gaps cannot be backfilled. '+(today.warning||''):status+'. The tracker records chat even when Voyager pages are closed.';
 }
 if($('ta-chat-history')){
  const rows=$('ta-chat-history');rows.replaceChildren();
  $('ta-history-status').textContent=demo?'Fictional capture history for preview.':live?(stale?'Last received ':'Updated ')+when(liveAt)+'. '+(stale?status+'. ':'')+'Completed UTC capture days from Streamer.bot. Gaps are not treated as zero.':status+'. History appears after the tracker has captured a previous UTC day.';
  for(const r of [...(live?.history||[])].reverse()){const tr=el('tr');tr.append(el('td',r.date),el('td',format(r.uniqueChatters)),el('td',format(r.messages)),el('td',r.firstCapturedAt?'First '+when(r.firstCapturedAt)+' · last '+when(r.lastCapturedAt)+(r.warning?' · '+r.warning:''):'No messages captured'));rows.append(tr);}
  if(!rows.children.length){const tr=el('tr'),td=el('td','No previous capture days yet.');td.colSpan=4;tr.append(td);rows.append(tr);}
 }
}
function connect(config){if(demo)return;options=config||options;connection?.stop();state='waiting';status='Connecting to the chat tracker';connection=new VoyagerTwitchAnalyticsConnection(options);const active=connection;
 active.addEventListener('status',e=>{if(active!==connection)return;state=e.detail.state;status=e.detail.message;render();});active.addEventListener('notice',e=>{if(active!==connection)return;status=e.detail;state='error';render();});active.addEventListener('analytics',e=>{if(active!==connection)return;const d=e.detail;if(!d?.ok||d.schema!==1||!d.today||!Array.isArray(d.history))return;live=d;liveAt=Date.now();state='live';render();});active.connect();
}
async function refresh(){if(demo){render();return;}if(!connection?.transportReady){connect(options);return;}$('ta-refresh').disabled=true;try{await connection.sync();}catch(e){status=e.message;state='error';render();}finally{$('ta-refresh').disabled=false;}}
if($('ta-refresh'))$('ta-refresh').onclick=refresh;
if(demo){const now=Date.now(),day=new Date(now).toISOString().slice(0,10);live={today:{date:day,messages:6248,uniqueChatters:312,firstCapturedAt:now-4*3600000,lastCapturedAt:now},messagesPerMinute:24.6,history:[2,1].map(n=>({date:new Date(now-n*86400000).toISOString().slice(0,10),messages:6248-n*240,uniqueChatters:312-n*15,firstCapturedAt:now-n*86400000-4*3600000,lastCapturedAt:now-n*86400000}))};liveAt=now;state='live';}
window.VoyagerTwitchChat={connect,refresh,update(context){ctx=context;render();},stop(){connection?.stop();}};render();
})();
