/* Voyager OBS Season & Missions panel (2.14; 2.15 adds season sub goals). Same look and placement as the OBS leaderboard panel.
   Reads /api/community/overlay from the local Voyager host; shown and hidden from Voyager Control > Seasons. */
(()=>{'use strict';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),preview=params.get('preview')==='1',compact=preview&&params.get('compact')==='1';
const NAMES={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const TITLES={season:'Season standings',goals:'Season sub goals',hall:'Hall of Fame',missions:"This week's missions"};
const icons={twitch:'<path fill="currentColor" d="M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z"/>',youtube:'<path fill="currentColor" d="M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.3 1.4-.5 3.4-.5 5s.2 3.6.5 5c.3 1.4 1.2 2.3 2.6 2.5 1.9.3 5.4.5 7.4.5s5.5-.2 7.4-.5c1.4-.2 2.3-1.1 2.6-2.5.3-1.4.5-3.4.5-5s-.2-3.6-.5-5z"/><path fill="#171f2b" d="m10 8 6 4-6 4z"/>',kick:'<path fill="currentColor" d="M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z"/>'};
const ON={all:'',twitch:' on Twitch',youtube:' on YouTube',kick:' on Kick'};
const MISSION={streamDays:n=>'Earn points on '+n+' stream day'+(n===1?'':'s'),earnPoints:n=>'Earn '+Number(n).toLocaleString()+' points',versusWins:n=>'Win '+n+' Versus battle'+(n===1?'':'s'),
  subscribe:(n,p)=>'Subscribe or renew'+(ON[p]||''),giftSubs:(n,p)=>'Gift '+n+' sub'+(n===1?'':'s')+(ON[p]||''),loyalSub:(n,p)=>'Renew at '+n+'+ months'+(ON[p]||'')};
const METRIC={support:'subs & gifts',subs:'subs',gifts:'gifted subs'};
let data=null,readAt=0,failed=false,rows=[],rowKey='',orderKey='',position=0,lastFrame=0;
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function fit(){const c=data?.panel?.config,width=compact?(c?.width||356)+32:1920,height=compact?520:1080,s=Math.min(innerWidth/width,innerHeight/height);const st=$('stage');st.style.width=width+'px';st.style.height=height+'px';st.style.transform='translate('+((innerWidth-width*s)/2)+'px,'+((innerHeight-height*s)/2)+'px) scale('+s+')';}
function build(c){
  if(!data)return [];
  if(c.kind==='season')return (data.season?.standings||[]).slice(0,c.limit).map(r=>({key:'s'+r.rank+r.name,name:r.name,platform:r.platform,sub:[r.support?r.support+' sub'+(r.support===1?'':'s')+' & gifts':'',r.wins?r.wins+' Versus win'+(r.wins===1?'':'s'):''].filter(Boolean).join(' · ')||NAMES[r.platform]||'',value:r.points.toLocaleString(),unit:'SCORE'}));
  if(c.kind==='goals')return (data.season?.goals||[]).slice(0,c.limit).map(g=>({key:'g'+g.title,name:g.title,platform:g.platform==='all'?'':g.platform,sub:(g.reached?'Reached! ':'')+METRIC[g.metric]+(ON[g.platform]||'')+' · +'+g.reward.toLocaleString()+' pts each helper',value:Math.min(g.total,99999).toLocaleString()+'/'+g.target.toLocaleString(),unit:g.reached?'DONE':'SUBS',icon:g.reached?'✓':'◆',pct:Math.min(1,g.total/g.target)}));
  if(c.kind==='hall')return (data.hall||[]).slice(0,c.limit).map(h=>({key:'h'+h.name,name:h.champion?.name||'—',platform:h.champion?.platform||'',sub:h.name+' champion'+(h.topPilot?' · top pilot '+h.topPilot.name:''),value:h.champion?h.champion.points.toLocaleString():'',unit:'POINTS',icon:'★'}));
  return (data.missions||[]).slice(0,c.limit).map(m=>({key:'m'+m.title,name:m.title,platform:'',sub:(MISSION[m.type]||(()=>''))(m.target,m.platform)+' · '+m.completed+' finished',value:'+'+m.reward.toLocaleString(),unit:'POINTS',icon:'◆'}));
}
function renderRows(c){
  const order=c.kind+'|'+rows.map(r=>r.key).join('|');if(order!==orderKey){orderKey=order;position=0;}
  const key=JSON.stringify([c.kind,rows]);if(key===rowKey)return;rowKey=key;
  const list=$('entries');list.replaceChildren();const loop=rows.length>5,display=loop?rows.concat(rows.slice(0,6)):rows;
  display.forEach((r,i)=>{
    const rank=i%rows.length+1,li=node('div',undefined,'entry'),plain=c.kind==='missions'||c.kind==='goals';li.dataset.place=plain?'':rank;
    if(r.pct!==undefined)li.style.setProperty('--goal-n',r.pct.toFixed(3)),li.classList.add('goal-row');li.style.transform='translateY('+(i*48)+'px)';li.setAttribute('role','listitem');
    if(i>=rows.length)li.setAttribute('aria-hidden','true');
    const person=node('div',undefined,'leader-person'),platform=node('span',undefined,'leader-platform '+(r.platform||''));
    if(icons[r.platform]){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[r.platform];platform.append(svg);}
    platform.append(node('span',r.sub));person.append(node('strong',r.name,'name'),platform);
    const score=node('div',undefined,'leader-score');score.append(node('b',r.value),node('small',r.unit));
    li.append(node('span',plain?'':c.kind==='hall'?'★':String(rank).padStart(2,'0'),'leader-rank'),node('span',plain?r.icon||'◆':Array.from(r.name).slice(0,2).join('').toUpperCase(),'avatar'),person,score);list.append(li);
  });
  $('viewport').style.height=Math.max(92,Math.min(5,rows.length)*48)+'px';list.style.height=(rows.length*48+(loop?240:0))+'px';list.hidden=!rows.length;$('empty').hidden=!!rows.length;
}
function render(){
  const p=data?.panel,visible=preview||(p&&p.visible&&(!p.expiresAt||Date.now()+(data.offset||0)<p.expiresAt));
  $('panel').hidden=!visible||!p;if($('panel').hidden)return;
  const c=p.config,panel=$('panel');panel.dataset.kind='pilots';
  panel.style.setProperty('--panel-width',c.width+'px');panel.style.setProperty('--panel-top',(compact?16:c.top)+'px');panel.style.setProperty('--panel-right',(compact?16:c.right)+'px');panel.style.setProperty('--leader-opacity',String(c.opacity/100));
  rows=build(c);
  const stale=!preview&&(failed||Date.now()-readAt>30000);
  $('status').dataset.state=preview?'preview':stale?'stale':rows.length?'ok':'waiting';$('status-text').textContent=preview?'Preview':stale?'Last known':'Updated';panel.dataset.stale=String(stale);
  $('panel-brand-title').textContent=c.kind==='missions'?'VOYAGER MISSIONS':c.kind==='goals'?'VOYAGER CREW GOALS':'VOYAGER SEASON';
  $('title').textContent=c.title||(c.kind==='season'?data.season?.name||TITLES.season:c.kind==='goals'?(data.season?.name?data.season.name+' sub goals':TITLES.goals):TITLES[c.kind]);
  const endsAt=c.kind==='missions'?data.weekEndsAt:data.season?.endsAt;
  $('total').textContent=c.kind==='missions'?'New missions every Monday':c.kind==='hall'?'Past season champions':c.kind==='goals'?'Twitch · YouTube · Kick'+(endsAt?' · ends '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}):''):'Top '+Math.min(c.limit,rows.length||c.limit)+(endsAt?' · ends '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}):'');
  $('list-order').textContent=c.kind==='missions'?'REWARD':c.kind==='goals'?'PROGRESS':c.kind==='season'?'SCORE':'POINTS';
  $('leader-basis').textContent=c.kind==='season'?'Points earned + supporter bonus':c.kind==='hall'?'Season champions':c.kind==='goals'?'Sub, renew or gift to help the crew':'Finish a mission, earn points';
  $('leader-note').textContent=preview?'PREVIEW · NOT ON STREAM':stale?'LAST RECEIVED · RECONNECTING':c.kind==='season'?'SPENDING NEVER LOWERS YOUR STANDING':c.kind==='missions'?'PROGRESS IS TRACKED AUTOMATICALLY':c.kind==='goals'?'EVERYONE WHO HELPS EARNS THE REWARD':'THE VOYAGER HALL OF FAME';
  $('empty-title').textContent=!data?'Waiting for Voyager':c.kind==='hall'?'No champions yet':c.kind==='missions'?'No missions this week':c.kind==='goals'?'No sub goals this season':'The season has just begun';
  $('empty-note').textContent=c.kind==='hall'?'Champions appear when a season ends.':c.kind==='missions'?'Turn missions on in Voyager Control.':c.kind==='goals'?'Add goals in Voyager Control › Seasons.':'Earn points to get on the board.';
  renderRows(c);fit();
}
async function poll(){
  try{const t=Date.now(),r=await fetch('/api/community/overlay',{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));const d=await r.json();d.offset=d.serverAt-(t+Date.now())/2;data=d;readAt=Date.now();failed=false;}
  catch{failed=true;}
  render();
}
if(preview){
  document.documentElement.style.background=document.body.style.background='transparent';
  addEventListener('message',e=>{if(e.source!==window.parent||e.data?.type!=='voyager.community.preview')return;data={...e.data.data,panel:{config:e.data.config,visible:true,expiresAt:0}};rowKey='';render();});
  window.parent.postMessage({type:'voyager.community.preview.ready'},'*');
}else{poll();setInterval(poll,5000);}
setInterval(render,1000);
function animate(t){const dt=Math.min(100,t-(lastFrame||t));lastFrame=t;const c=data?.panel?.config;if(c&&!$('panel').hidden){position=rows.length>5?(position+dt*c.speed/1000)%(rows.length*48):0;$('entries').style.transform='translateY('+(-position)+'px)';}requestAnimationFrame(animate);}
requestAnimationFrame(animate);addEventListener('resize',fit);
})();
