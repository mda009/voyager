/* The existing dashboard is the publisher. Only aggregate counters leave it. */
(()=>{'use strict';
const M=window.VoyagerLiveOverlayModel,$=id=>document.getElementById(id);let getState,token='',busy=false,active=true,heartbeat,ready=false,sample=false;
let config={visible:true,opacity:35,goal:'followers'};
const local=location.protocol==='http:'&&['127.0.0.1','localhost'].includes(location.hostname);
const url=(local?location.origin:'http://127.0.0.1:8740')+'/control/Voyager_Live_Overlay.html';
function message(text){$('lo-status').textContent=text;}
async function api(path,body){
 const options={cache:'no-store',signal:AbortSignal.timeout(5000)};
 if(body){if(!token){const r=await fetch('/api/admin',options);if(!r.ok)throw Error('Start the updated Voyager launcher.');token=(await r.json()).token;}options.method='POST';options.headers={'Content-Type':'application/json','X-Voyager-Token':token};options.body=JSON.stringify(body);}
 const r=await fetch(path,options);if(r.status===403)token='';if(!r.ok)throw Error('Start or restart the updated Voyager launcher.');return r.json();
}
function syncControls(){ $('lo-opacity').value=String(config.opacity);$('lo-opacity-value').textContent=config.opacity+'%';$('lo-goal').value=config.goal;$('lo-show').disabled=!ready||config.visible;$('lo-hide').disabled=!ready||!config.visible;}
function preview(){if(sample)$('lo-preview').contentWindow?.postMessage({type:'voyager.live.preview',config},'*');}
async function configure(next){if(sample){config={...config,...next};syncControls();preview();message('Demo settings only · nothing sent to OBS.');return;}
 try{const result=await api('/api/live-overlay/settings',next);config=result.config;syncControls();message(config.visible?'Overlay shown · keep this Live dashboard open.':'Overlay hidden in OBS.');}catch(e){message(e.message);syncControls();}
}
async function publish(){if(!active||busy||!getState||sample||!local)return;busy=true;
 try{if(!ready){const state=await api('/api/live-overlay');config=state.config;ready=true;syncControls();}
  const {model,settings}=getState();await api('/api/live-overlay/feed',M.capture(model,settings));message(config.visible?'Sending dashboard data to OBS · keep this page open.':'Overlay hidden · live feed is still ready.');
 }catch(e){ready=false;syncControls();message(e.message);}finally{busy=false;}
}
function init(options){getState=options.getState;if(!$('lo-panel'))return;sample=getState().demo===true;
 $('lo-url').value=url;$('lo-open').href=sample?'Voyager_Live_Overlay.html?preview=1':url;
 $('lo-preview').src=sample?'Voyager_Live_Overlay.html?preview=1':url+'?monitor=1';
 $('lo-preview').addEventListener('load',preview);
 $('lo-copy').onclick=async()=>{try{await navigator.clipboard.writeText(url);message('OBS URL copied. Use Width 1200 and Height 230.');}catch{$('lo-url').focus();$('lo-url').select();message('Select and copy the OBS URL below.');}};
 $('lo-show').onclick=()=>configure({visible:true});$('lo-hide').onclick=()=>configure({visible:false});
 $('lo-opacity').oninput=()=>{$('lo-opacity-value').textContent=$('lo-opacity').value+'%';};$('lo-opacity').onchange=()=>configure({opacity:Number($('lo-opacity').value)});
 $('lo-goal').onchange=()=>configure({goal:$('lo-goal').value});
 if(sample){ready=true;syncControls();message('Design preview · fictional data, no live publishing.');return;}
 if(!local){message('Run START-VOYAGER-CONTROL.bat, then open Live dashboard at http://127.0.0.1:8740/control/Voyager_Command_Center.html?page=live to send data to OBS.');$('lo-opacity').disabled=true;$('lo-goal').disabled=true;syncControls();return;}
 publish();heartbeat=setInterval(publish,3000);
}
window.VoyagerLiveOverlayControl={init};
window.addEventListener('pagehide',()=>{active=false;clearInterval(heartbeat);});
})();
