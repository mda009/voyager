/* 2.20.11: exactly one OBS source plays each ticketed reveal.
   Priority: main Giveaway overlay (3) > shared Leaderboard panel (2) > separate Ticket overlay (1).
   A source only steps aside for a higher one that is on screen and actually playing that same reveal;
   if the higher source is present but does not start within 2.5 seconds, the lower one plays it anyway. */
(()=>{'use strict';
 window.VoyagerRevealArbiter=function(rank){
  const peers=new Map(),firstSeen=new Map();let channel=null,active,visible;
  try{channel=new BroadcastChannel('voyager-giveaway-reveal');channel.onmessage=e=>{const d=e.data;if(d?.type!=='voyager.reveal.beat'||!(Number(d.rank)>rank))return;
   const p=peers.get(d.rank)||{seen:0,playing:'',playingAt:0};p.seen=Date.now();if(d.playing){p.playing=String(d.playing);p.playingAt=Date.now();}peers.set(d.rank,p);};}catch{}
  // OBS tells a browser source when it goes on or off program/preview; outside OBS these never fire.
  addEventListener('obsSourceActiveChanged',e=>{if(typeof e.detail?.active==='boolean')active=e.detail.active;});
  addEventListener('obsSourceVisibleChanged',e=>{if(typeof e.detail?.visible==='boolean')visible=e.detail.visible;});
  const onScreen=()=>active!==false&&visible!==false&&document.visibilityState!=='hidden';
  return{
   onScreen,
   beat(present,playing=''){if(!channel||!present||!onScreen())return;try{channel.postMessage({type:'voyager.reveal.beat',rank,playing,at:Date.now()});}catch{}},
   mayPlay(id){if(!id)return false;const now=Date.now();
    if(!firstSeen.has(id)){firstSeen.set(id,now);if(firstSeen.size>20)firstSeen.delete(firstSeen.keys().next().value);}
    let higher=false;for(const p of peers.values()){if(p.playing===id&&now-p.playingAt<3500)return false;if(now-p.seen<12000)higher=true;}
    return !higher||now-firstSeen.get(id)>=2500;}
  };
 };
})();
