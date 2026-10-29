(()=>{'use strict';const S=VoyagerGiveawaySequence,$=id=>document.getElementById(id);let state=null,start=0,serial=0;
function send(){if(state)$('screen').contentWindow.postMessage({type:'voyager.giveaway.sequence',state,offset:0,muted:!$('audio').checked,volume:.6},'*');}
function go(elapsed=0){start=Date.now()-elapsed;state=S.previewState($('mode').value,start);state.revision=++serial;state.reveal.id='preview-'+serial;send();}
$('screen').addEventListener('load',send);addEventListener('message',e=>{if(e.source===$('screen').contentWindow&&e.data?.type==='voyager.giveaway.sequence.ready')send();});
$('play').onclick=()=>go();$('goodluck').onclick=()=>go(18800);$('spin').onclick=()=>go(20000);$('landing').onclick=()=>go(44000);$('winner').onclick=()=>go(50000);$('timeout').onclick=()=>go(120000);
$('claim').onclick=()=>{if(!state)go(51000);state=structuredClone(state);state.revision=++serial;const d=S.current(state);d.status='confirmed';state.view='celebration';state.celebration={id:'claim-'+serial,at:Date.now(),winner:d.winner.name};send();};
$('hide').onclick=()=>{if(state){state.view='hidden';state.revision=++serial;send();}};$('mode').onchange=()=>go();$('audio').onchange=()=>go();
setInterval(()=>{if(state){const p=S.phase(state,Date.now());$('status').textContent=$('mode').selectedOptions[0].text+' · '+p.phase.toUpperCase()+' · '+Math.max(0,Math.floor((Date.now()-start)/1000))+'s';}},100);
})();
