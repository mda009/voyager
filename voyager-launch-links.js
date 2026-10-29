(()=>{'use strict';
  const served=['127.0.0.1','localhost','[::1]'].includes(location.hostname)&&location.pathname.startsWith('/control/');
  for(const link of document.querySelectorAll('[data-launch-voyager]')){
    link.href=served?'Voyager_Versus.html':'voyager-versus://start';
    link.textContent=served?'Open Voyager Versus':'Start Voyager Versus';
    link.addEventListener('click',()=>{
      const note=document.getElementById('voyager-launch-note');
      if(note&&!served){note.hidden=false;note.textContent='Allow your browser to open the Voyager launcher. If nothing opens, run SETUP-VOYAGER-LAUNCH-LINK.bat once from this extracted folder, then click again. The live game opens in its own Control tab.';}
    });
  }
})();
