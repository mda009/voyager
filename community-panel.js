/* Voyager OBS Community goals & Missions panel (2.14; 2.15 adds goals; 2.20.48 community goals you run yourself; 2.21.2 compact goal progress bar). Same look and placement as the OBS leaderboard panel.
   Reads /api/community/overlay from the local Voyager host; shown and hidden from Voyager Control > Community goals. */
(()=>{'use strict';
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),preview=params.get('preview')==='1',stagePage=params.get('stage')==='1',stageKind=stagePage&&['season','goals','bar','helpers','hall','missions'].includes(params.get('kind'))?params.get('kind'):'',compact=(preview||stagePage)&&params.get('compact')==='1';
const NAMES={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const TITLES={season:'Community goal standings',goals:'Community goals',helpers:'Community goal contributors',hall:'Hall of Fame',missions:"This week's missions"};
const icons={twitch:'<path fill="currentColor" d="M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z"/>',youtube:'<path fill="currentColor" d="M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.3 1.4-.5 3.4-.5 5s.2 3.6.5 5c.3 1.4 1.2 2.3 2.6 2.5 1.9.3 5.4.5 7.4.5s5.5-.2 7.4-.5c1.4-.2 2.3-1.1 2.6-2.5.3-1.4.5-3.4.5-5s-.2-3.6-.5-5z"/><path fill="#171f2b" d="m10 8 6 4-6 4z"/>',kick:'<path fill="currentColor" d="M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z"/>'};
const ON={all:'',twitch:' on Twitch',youtube:' on YouTube',kick:' on Kick'};
const MISSION={streamDays:n=>'Earn points on '+n+' stream day'+(n===1?'':'s'),earnPoints:n=>'Earn '+Number(n).toLocaleString()+' points',versusWins:n=>'Win '+n+' Versus battle'+(n===1?'':'s'),
  subscribe:(n,p)=>'Subscribe or renew'+(ON[p]||''),giftSubs:(n,p)=>'Gift '+n+' sub'+(n===1?'':'s')+(ON[p]||''),loyalSub:(n,p)=>'Renew at '+n+'+ months'+(ON[p]||''),
  watchHours:(n,p)=>'Watch '+n+' h live'+(ON[p]||''),chatMessages:(n,p)=>'Send '+n+' chat messages'+(ON[p]||''),streamStreak:n=>n+' streams in a row',dreadFights:n=>'Join '+n+' Dreadnought fight'+(n===1?'':'s'),
  dreadVictory:n=>'Win '+n+' Dreadnought fight'+(n===1?'':'s'),dreadDamage:n=>'Deal '+n+' Dreadnought damage',dreadMvp:n=>'Be MVP in '+n+' fight'+(n===1?'':'s'),torpedo:n=>'Fire '+n+' torpedo'+(n===1?'':'es')};
const METRIC={support:'subs & gifts',subs:'subs',gifts:'gifted subs',points:'points',versus:'Versus wins'},UNIT={support:'SUBS',subs:'SUBS',gifts:'GIFTS',points:'PTS',versus:'WINS'};
const short=n=>n>=10000?(Math.round(n/100)/10).toLocaleString()+'k':Number(n).toLocaleString();
const each=(n,m)=>n.toLocaleString()+' '+(m==='points'?'pts':m==='versus'?(n===1?'Versus win':'Versus wins'):m==='gifts'?(n===1?'gifted sub':'gifted subs'):m==='subs'?(n===1?'sub':'subs'):(n===1?'sub or gift':'subs & gifts'));
let data=null,readAt=0,failed=false,rows=[],rowKey='',orderKey='',position=0,lastFrame=0;
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function fit(){const c=data?.panel?.config,width=compact?(c?.width||356)+32:1920,height=compact?520:1080,s=Math.min(innerWidth/width,innerHeight/height);const st=$('stage');st.style.width=width+'px';st.style.height=height+'px';st.style.transform='translate('+((innerWidth-width*s)/2)+'px,'+((innerHeight-height*s)/2)+'px) scale('+s+')';}
function build(c){
  if(!data)return [];
  if(c.kind==='season')return (data.season?.standings||[]).slice(0,c.limit).map(r=>({key:'s'+r.rank+r.name,name:r.name,platform:r.platform,sub:[r.support?r.support+' sub'+(r.support===1?'':'s')+' & gifts':'',r.wins?r.wins+' Versus win'+(r.wins===1?'':'s'):''].filter(Boolean).join(' · ')||NAMES[r.platform]||'',value:r.points.toLocaleString(),unit:'SCORE'}));
  if(c.kind==='goals')return (data.season?.goals||[]).slice(0,c.limit).map(g=>({key:'g'+g.title,name:g.title,platform:g.platform==='all'?'':g.platform,sub:(g.reached?'Reached! ':'')+METRIC[g.metric]+(ON[g.platform]||'')+' · +'+g.reward.toLocaleString()+' pts each helper',value:g.reached?short(g.target):short(g.total)+'/'+short(g.target),unit:g.reached?'DONE':UNIT[g.metric]||'SUBS',icon:g.reached?'✓':'◆',pct:Math.min(1,g.total/g.target)}));
  // 2.20.62 Contributors: each goal as a heading row (progress bar), then the people who helped it most, ranked, with what they gave.
  if(c.kind==='helpers'){const out=[];for(const g of (data.season?.goals||[]).filter(g=>!g.missed)){const people=(g.people||[]).slice(0,c.limit);
      out.push({key:'gh'+g.title,header:true,name:g.title,platform:'',sub:(g.reached?'Reached! ':'')+Math.min(g.total,99999).toLocaleString()+' of '+g.target.toLocaleString()+' '+(METRIC[g.metric]||'')+(ON[g.platform]||'')+' · '+(g.contributors||0)+' helping',value:Math.round(Math.min(1,g.total/g.target)*100)+'%',unit:g.reached?'DONE':'SO FAR',icon:g.reached?'✓':'◆',pct:Math.min(1,g.total/g.target)});
      people.forEach((h,i)=>out.push({key:'gp'+g.title+h.name,rank:i+1,name:h.name,platform:h.platform,sub:each(h.count,g.metric)+(h.count>=(g.minimum||1)?' · earns +'+g.reward.toLocaleString()+' pts':' · '+((g.minimum||1)-h.count)+' more to earn the reward'),value:h.count.toLocaleString(),unit:UNIT[g.metric]||'',pct:Math.min(1,h.count/Math.max(1,people[0]?.count||1))}));
      if(!people.length)out.push({key:'gn'+g.title,plain:true,name:'No one has helped yet',platform:'',sub:'Be the first: '+(METRIC[g.metric]||'')+(ON[g.platform]||''),value:'',unit:'',icon:'·'});}
    return out;}
  if(c.kind==='hall')return (data.hall||[]).slice(0,c.limit).map(h=>({key:'h'+h.name,name:h.champion?.name||'—',platform:h.champion?.platform||'',sub:h.name+' champion'+(h.topPilot?' · top pilot '+h.topPilot.name:''),value:h.champion?h.champion.points.toLocaleString():'',unit:'POINTS',icon:'★'}));
  return (data.missions||[]).slice(0,c.limit).map(m=>({key:'m'+m.title,name:m.title,platform:'',sub:(MISSION[m.type]||(()=>''))(m.target,m.platform)+' · '+m.completed+' finished',value:'+'+m.reward.toLocaleString(),unit:'POINTS',icon:'◆'}));
}
function renderRows(c){
  const order=c.kind+'|'+rows.map(r=>r.key).join('|');if(order!==orderKey){orderKey=order;position=0;}
  const key=JSON.stringify([c.kind,rows]);if(key===rowKey)return;rowKey=key;
  const list=$('entries');list.replaceChildren();const loop=rows.length>5,display=loop?rows.concat(rows.slice(0,6)):rows;
  display.forEach((r,i)=>{
    const rank=r.rank??(i%rows.length+1),li=node('div',undefined,'entry'),plain=c.kind==='missions'||c.kind==='goals'||r.header||r.plain;li.dataset.place=plain?'':rank;if(r.header)li.classList.add('goal-head');
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
  // 2.20.84: inside the Dreadnought stage (?stage=1&kind=) the panel is always shown with that kind; the standalone source hides while the stage is up.
  const p=stagePage?{config:{...(data?.panel?.config||{}),kind:stageKind||data?.panel?.config?.kind||'season',width:356,top:16,right:16,opacity:data?.panel?.config?.opacity??40,limit:data?.panel?.config?.limit||10,title:stageKind?'':data?.panel?.config?.title||''},visible:true,expiresAt:0}:data?.panel,visible=stagePage?!!data:(preview||(p&&p.visible&&(!p.expiresAt||Date.now()+(data.offset||0)<p.expiresAt)))&&!(data?.stage&&!preview);
  const bars=p?.config?.kind==='bar';$('panel').hidden=!visible||!p||bars;$('bars').hidden=!visible||!p||!bars;
  if(bars&&visible&&p){renderBars(p.config);fit();return;}
  if($('panel').hidden)return;
  const c=p.config,panel=$('panel');panel.dataset.kind='pilots';
  panel.style.setProperty('--panel-width',c.width+'px');panel.style.setProperty('--panel-top',(compact?16:c.top)+'px');panel.style.setProperty('--panel-right',(compact?16:c.right)+'px');panel.style.setProperty('--leader-opacity',String(c.opacity/100));
  rows=build(c);
  const stale=!preview&&(failed||Date.now()-readAt>30000);
  $('status').dataset.state=preview?'preview':stale?'stale':rows.length?'ok':'waiting';$('status-text').textContent=preview?'Preview':stale?'Last known':'Updated';panel.dataset.stale=String(stale);
  $('panel-brand-title').textContent=c.kind==='missions'?'VOYAGER MISSIONS':c.kind==='goals'||c.kind==='helpers'?'VOYAGER COMMUNITY GOALS':c.kind==='hall'?'VOYAGER HALL OF FAME':'VOYAGER COMMUNITY GOAL';
  $('title').textContent=c.title||(c.kind==='season'?data.season?.name||TITLES.season:c.kind==='goals'?(data.season?.name?data.season.name+' goals':TITLES.goals):c.kind==='helpers'?(data.season?.name?data.season.name+' · who is helping':TITLES.helpers):TITLES[c.kind]);
  const endsAt=c.kind==='missions'?data.weekEndsAt:data.season?.endsAt;
  $('total').textContent=c.kind==='missions'?'New missions every Monday':c.kind==='hall'?'Past community goal champions':c.kind==='helpers'?'Top '+c.limit+' per goal'+(endsAt?' · due '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}):''):c.kind==='goals'?(data.season?.active===false?'No community goal running':'Twitch · YouTube · Kick')+(endsAt?' · due '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}):''):'Top '+Math.min(c.limit,rows.length||c.limit)+(endsAt?' · due '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}):'');
  $('list-order').textContent=c.kind==='missions'?'REWARD':c.kind==='goals'?'PROGRESS':c.kind==='helpers'?'GIVEN':c.kind==='season'?'SCORE':'POINTS';
  $('leader-basis').textContent=c.kind==='season'?'Points earned + supporter bonus':c.kind==='hall'?'Community goal champions':c.kind==='goals'?'Help the crew reach each goal':c.kind==='helpers'?'What each crew member has given':'Finish a mission, earn points';
  $('leader-note').textContent=preview?'PREVIEW · NOT ON STREAM':stale?'LAST RECEIVED · RECONNECTING':c.kind==='season'?'SPENDING NEVER LOWERS YOUR STANDING':c.kind==='missions'?'PROGRESS IS TRACKED AUTOMATICALLY':c.kind==='goals'||c.kind==='helpers'?'EVERYONE WHO HELPS EARNS THE REWARD':'THE VOYAGER HALL OF FAME';
  $('empty-title').textContent=!data?'Waiting for Voyager':c.kind==='hall'?'No champions yet':c.kind==='missions'?'No missions this week':c.kind==='goals'||c.kind==='helpers'?'No community goals right now':data.season?.active===false?'No community goal running':'The community goal has just begun';
  $('empty-note').textContent=c.kind==='hall'?'Champions appear when a community goal ends.':c.kind==='missions'?'Turn missions on in Voyager Control.':c.kind==='goals'||c.kind==='helpers'?'Add goals in Voyager Control › Community goals.':data.season?.active===false?'Start one in Voyager Control › Community goals.':'Earn points to get on the board.';
  renderRows(c);fit();
}
// 2.21.2: compact progress bar — one slim row per community goal, in place of the full panel.
function renderBars(c){
  const box=$('bars');box.style.setProperty('--panel-width',c.width+'px');box.style.setProperty('--panel-top',(compact?16:c.top)+'px');box.style.setProperty('--panel-right',(compact?16:c.right)+'px');box.style.setProperty('--leader-opacity',String(c.opacity/100));
  const stale=!preview&&(failed||Date.now()-readAt>30000);box.dataset.stale=String(stale);
  const goals=(data?.season?.goals||[]).filter(g=>!g.missed).slice(0,c.limit);
  $('bars-title').textContent=(c.title||data?.season?.name||'COMMUNITY GOAL').toUpperCase();
  const endsAt=data?.season?.endsAt;$('bars-due').textContent=preview?'PREVIEW':stale?'LAST KNOWN':endsAt?'DUE '+new Date(endsAt).toLocaleDateString(undefined,{day:'numeric',month:'short'}).toUpperCase():'';
  const key=JSON.stringify([c.width,goals.map(g=>[g.title,g.total,g.target,g.reached,g.platform])]);if(key===box.dataset.key)return;box.dataset.key=key;
  const list=$('bars-list');list.replaceChildren();
  if(!goals.length){list.append(node('div',!data?'Waiting for Voyager':data.season?.active===false?'No community goal running':'No community goals right now','none'));return;}
  for(const g of goals){const pct=Math.max(0,Math.min(1,g.target?g.total/g.target:0)),row=node('div',undefined,'goal'+(g.reached?' reached':''));row.style.setProperty('--n',pct.toFixed(3));
    const t=node('div',g.title,'t');if(g.platform&&g.platform!=='all')t.append(node('small',NAMES[g.platform]||g.platform));
    const v=node('div',undefined,'v');v.append(node('span',short(Math.min(g.total,99999))+' / '+short(g.target)),node('small',UNIT[g.metric]||''));if(g.reached)v.append(node('em','✓ REACHED'));else v.append(node('em',Math.round(pct*100)+'%'));
    const track=node('div',undefined,'track');track.append(node('i'));row.append(t,v,track);list.append(row);}
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
