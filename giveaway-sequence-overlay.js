/* Existing Giveaway Engine transport, with one synchronized presentation frame. */
(()=>{'use strict';
 const q=new URLSearchParams(location.search),preview=q.get('preview')==='1',pool=document.getElementById('pool'),frame=document.getElementById('reveal');
 let client=null,state=null,offset=0,ready=false,poolReady=false,sample=false;
 const config=window.VOYAGER_CONFIG||{};
 function send(){if(ready&&state)frame.contentWindow.postMessage({type:'voyager.giveaway.sequence',state,offset,volume:Number(config.giveawayVolume??config.volume??.75),muted:preview},'*');}
 function sendPool(){if(poolReady&&state)pool.contentWindow.postMessage({type:'voyager.giveaway.pool.v1',state,offset,sample},'*');}
 function accept(s,clock=0,isSample=false){if(!s||s.schema!==1||!Number.isFinite(s.revision))return;if(state&&s.revision<state.revision)return;state=s;offset=Number(clock)||0;sample=preview&&isSample===true;pool.hidden=s.view!=='pool';frame.hidden=!['reveal','celebration'].includes(s.view);send();sendPool();}
 pool.addEventListener('load',()=>{poolReady=true;sendPool();});
 frame.addEventListener('load',()=>{ready=true;send();});
 addEventListener('message',e=>{
  if(e.source===pool.contentWindow&&e.data?.type==='voyager.giveaway.pool.ready'){poolReady=true;sendPool();}
  else if(e.source===frame.contentWindow&&e.data?.type==='voyager.giveaway.sequence.ready'){ready=true;send();}
  else if(preview&&parent!==window&&e.source===parent&&e.data?.state)accept(e.data.state,e.data.offset,e.data.sample);
 });
 // The pool and animation share this connection. Always re-send the latest
 // state after a child loads, including live OBS and a refreshed child frame.
 pool.src='Voyager_Entrant_Panel.html?embedded=1&v=2.1.2';frame.src='Voyager_Giveaway_Sequence.html';
 if(preview){if(parent!==window)parent.postMessage({type:'voyager.overlay.ready'},'*');}
 else{client=new VoyagerConnection();client.addEventListener('state',e=>{if(e.detail?.ok&&e.detail.state)accept(e.detail.state,client.offset);});client.connect();}
 addEventListener('pagehide',()=>{client?.stop();frame.removeAttribute('src');});
 addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
