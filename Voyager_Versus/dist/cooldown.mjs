import {cooldownView} from './cooldown-state.mjs?v=1.8.0';

const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const local=['127.0.0.1','localhost','[::1]'].includes(location.hostname);
const preview=params.get('preview')==='1';
let packet=null,receivedAt=0,connected=false,source=null;

function render(){
  const view=cooldownView(packet,{elapsedMs:performance.now()-receivedAt,connected});
  $('cooldown').dataset.mode=view.mode;
  $('timer-label').textContent=view.label;
  $('timer-value').textContent=view.value;
  $('timer-hint').textContent=view.hint;
  $('timer-progress').style.transform=`scaleX(${view.progress})`;
}

if(preview){
  // Explicit visual preview only: never creates an Arena or calls a control API.
  $('preview-label').hidden=false;
  const start=performance.now();
  const showPreview=()=>{
    const remaining=Math.max(0,12-Math.floor((performance.now()-start)/1000));
    packet={serverTime:0,connection:{connected:true},game:{cooldownRemaining:remaining,cooldownUntil:remaining*1000,phase:'lobby',open:true,paused:false,players:[],queue:[],matches:[]}};
    connected=true;receivedAt=performance.now();render();
  };
  showPreview();setInterval(showPreview,250);
}else if(local){
  source=new EventSource('/api/events');
  source.onmessage=event=>{
    try{
      const value=JSON.parse(event.data);
      if(!value.game||!Number.isFinite(value.game.cooldownRemaining)||!Number.isFinite(value.game.cooldownUntil))throw new Error('Invalid state');
      packet=value;receivedAt=performance.now();connected=true;
    }catch{connected=false;}
    render();
  };
  source.onerror=()=>{connected=false;render();};
  setInterval(render,250);
  document.addEventListener('visibilitychange',render);
  render();
}else{
  render();
  $('timer-hint').textContent='Start Voyager on your OBS PC to show the live timer';
}
