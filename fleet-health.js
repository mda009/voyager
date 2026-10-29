/* Diagnostics are opt-in. The normal OBS source remains transparent at rest. */
(()=>{'use strict';
 const q=new URLSearchParams(location.search),mode=q.get('preview')==='1'?'Local preview':q.get('demo')==='1'?'Local demo':'Live OBS';
 const state={build:'1.12',mode,connection:mode==='Live OBS'?'Starting':'Not used in preview',graphics:'Loading',enabled:null,queue:0,lastSync:null,lastAlert:'None',lumia:'Waiting for saved state',error:'',connectionError:''};
 let visible=q.get('diagnostics')==='1'||document.body.dataset.diagnostics==='true';
 const style=document.createElement('style');style.textContent='#fleet-diagnostics{position:fixed;z-index:99999;left:24px;top:24px;width:min(540px,calc(100vw - 48px));padding:20px 24px;background:#081522f2;border:1px solid #80c9ed;color:#e2f1fb;font:16px/1.5 "Segoe UI",sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;box-shadow:0 12px 40px #0006}#fleet-diagnostics[hidden]{display:none!important}';document.head.append(style);
 const panel=document.createElement('aside');panel.id='fleet-diagnostics';document.body.append(panel);
 function paint(){panel.hidden=!visible;if(!visible)return;panel.textContent='VOYAGER FLEET · DIAGNOSTICS '+state.build+'\n\nMode: '+state.mode+'\nStreamer.bot: '+state.connection+'\nGraphics: '+state.graphics+'\nAlerts: '+(state.enabled===null?'Waiting for saved state':state.enabled?'Enabled':'Disabled in Fleet controls')+'\nScheduled: '+state.queue+'\nLast sync: '+(state.lastSync?new Date(state.lastSync).toLocaleTimeString():'None')+'\nLast alert: '+state.lastAlert+'\nLumia: '+state.lumia+(state.error||state.connectionError?'\n\nAttention: '+[state.error,state.connectionError].filter(Boolean).join(' / '):'')+'\n\nOBS → Interact → D toggles this card.\nSend test to OBS from Fleet controls.';}
 function update(values){Object.assign(state,values);paint();}
 window.VoyagerFleetHealth={update,snapshot:()=>({...state}),toggle:()=>{visible=!visible;paint();}};
 addEventListener('keydown',e=>{if(e.key.toLowerCase()==='d'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){visible=!visible;paint();}});
 addEventListener('error',e=>{if(e.target?.tagName==='SCRIPT')update({error:'A required script did not load: '+e.target.src.split('/').pop()+'. Extract the complete update and refresh the OBS source.'});else if(e.message)update({error:e.message});},true);
 addEventListener('unhandledrejection',e=>update({error:String(e.reason?.message||e.reason||'Unexpected browser error')}));
 paint();
})();
