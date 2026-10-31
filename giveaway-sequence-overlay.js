/* Existing Giveaway Engine transport, with one synchronized presentation frame. */
(()=>{'use strict';
 const q=new URLSearchParams(location.search),preview=q.get('preview')==='1',pool=document.getElementById('pool'),frame=document.getElementById('reveal');
 let client=null,state=null,offset=0,ready=false,poolReady=false,sample=false;
 // 2.20.10: ticketed giveaways play their reveal here too, with the same countdown, wheel and winner sequence.
 let tickets=null,ticketState=null,ticketOffset=0,shown=null;
 const S=window.VoyagerGiveawaySequence;
 function ticketLive(){if(!ticketState||!S)return false;const e=S.event(ticketState);if(!e)return false;const now=Date.now()+ticketOffset;
  if(ticketState.view==='celebration')return now>=e.at-5000&&now<e.at+8000;const t=S.timeline(e);return !!t&&now>=t.at-5000&&now<t.expiresAt;}
 const config=window.VOYAGER_CONFIG||{};
 function send(){const useTickets=ticketLive(),s=useTickets?ticketState:state,o=useTickets?ticketOffset:offset;shown=useTickets?'tickets':'engine';
  if(useTickets){pool.hidden=true;frame.hidden=false;}else if(state){pool.hidden=state.view!=='pool';frame.hidden=!['reveal','celebration'].includes(state.view);}else frame.hidden=true;
  if(ready&&s)frame.contentWindow.postMessage({type:'voyager.giveaway.sequence',state:s,offset:o,volume:Number(config.giveawayVolume??config.volume??.75),muted:preview},'*');}
 function sendPool(){if(poolReady&&state)pool.contentWindow.postMessage({type:'voyager.giveaway.pool.v1',state,offset,sample},'*');}
 function accept(s,clock=0,isSample=false){if(!s||s.schema!==1||!Number.isFinite(s.revision))return;if(state&&s.revision<state.revision)return;state=s;offset=Number(clock)||0;sample=preview&&isSample===true;send();sendPool();}
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
 else{client=new VoyagerConnection();client.addEventListener('state',e=>{if(e.detail?.ok&&e.detail.state)accept(e.detail.state,client.offset);});client.connect();
  if(window.VoyagerTicketConnection&&new URLSearchParams(location.search).get('tickets')!=='0'){
   let settings={};try{settings=JSON.parse(localStorage.getItem('voyager-ticket-connection')||'{}');}catch{}
   tickets=new VoyagerTicketConnection({...config,...settings,readOnly:true});
   tickets.addEventListener('tickets',e=>{const s=e.detail?.state;if(!s||s.schema!==1)return;if(ticketState&&s.revision<ticketState.revision)return;ticketState=s;ticketOffset=Number(e.detail.offset)||0;send();});
   tickets.connect();
  }
  // Tell a separate Ticket overlay source that this one plays the reveals, so OBS never shows two at once.
  try{const bc=new BroadcastChannel('voyager-giveaway-reveal');setInterval(()=>bc.postMessage({type:'main-overlay',at:Date.now()}),2000);}catch{}
  // Switch between the ticket and engine sequence as reveals start and end.
  setInterval(()=>{const want=ticketLive()?'tickets':'engine';if(want!==shown)send();},1000);
 }
addEventListener('pagehide',()=>{tickets?.stop();client?.stop();frame.removeAttribute('src');});
 addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
})();
