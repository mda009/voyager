(()=>{'use strict';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
const served=['127.0.0.1','localhost','[::1]'].includes(location.hostname)&&location.pathname.startsWith('/control/');
const origin=served?location.origin:'http://127.0.0.1:8740';
const frame=$('versus-frame');let demo=params.get('demo')==='1';
$('open-game').hidden=!served;$('open-game').href=origin+'/';$('versus-obs-url').value=origin+'/?overlay=1&hideIdle=1';
function render(){
 $('mode-live').setAttribute('aria-pressed',String(!demo));$('mode-demo').setAttribute('aria-pressed',String(demo));
 $('open-control').value=origin+'/control/Voyager_Versus.html'+(demo?'?demo=1':'');
 $('open-game').href=origin+'/'+(demo?'?demo=1':'');
 $('launch-help').hidden=served;frame.hidden=!served;
 if(served)$('voyager-launch-note').hidden=true;
 $('versus-status').textContent=served?(demo?'Training preview · isolated simulation; no live commands or points.':'Live game · connect chat in Stream setup. OBS uses this same arena.'):'Click Start Voyager Versus above to launch your local game.';
 if(served){frame.title=demo?'Voyager Versus isolated training preview':'Voyager Versus live control panel';frame.src=origin+'/?embedded=1'+(demo?'&demo=1':'')+'&v=1.7.1';}
}
$('mode-live').onclick=()=>{if(demo){demo=false;render();}};
$('mode-demo').onclick=()=>{if(!demo){demo=true;render();}};
$('copy-versus-obs').onclick=async()=>{try{await navigator.clipboard.writeText($('versus-obs-url').value);$('copy-versus-obs').textContent='Copied';setTimeout(()=>$('copy-versus-obs').textContent='Copy OBS URL',1800);}catch{$('versus-obs-url').select();$('versus-status').textContent='Select and copy the OBS URL.';}};

$('versus-cooldown-url').value=origin+'/cooldown.html';
$('open-versus-cooldown').href=origin+'/cooldown.html';
$('open-versus-cooldown').hidden=!served;
$('preview-versus-cooldown').href=served?origin+'/cooldown.html?preview=1':'https://voyager-versus.dalton-michael.chatgpt.site/cooldown.html?preview=1';
$('copy-versus-cooldown').onclick=async()=>{try{await navigator.clipboard.writeText($('versus-cooldown-url').value);$('copy-versus-cooldown').textContent='Copied';setTimeout(()=>$('copy-versus-cooldown').textContent='Copy timer URL',1800);}catch{$('versus-cooldown-url').select();$('versus-status').textContent='Select and copy the cooldown timer URL.';}};
$('versus-ready-url').value=origin+'/versuscall.html';
$('preview-versus-ready').href=served?origin+'/versuscall.html?preview=1':'Voyager_Versus/dist/versuscall.html?preview=1';
$('copy-versus-ready').onclick=async()=>{try{await navigator.clipboard.writeText($('versus-ready-url').value);$('copy-versus-ready').textContent='Copied';setTimeout(()=>$('copy-versus-ready').textContent='Copy ready alert URL',1800);}catch{$('versus-ready-url').select();}};
render();
})();
