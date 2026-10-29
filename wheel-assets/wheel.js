/* Display-only subscriber to the existing Voyager giveaway state. No draw, entry,
   payout, claim or reroll action is sent by this page. No external dependencies. */
(()=>{'use strict';
 const M=window.VoyagerWheelModel,$=id=>document.getElementById(id),q=new URLSearchParams(location.search);
 const preview=q.get('preview')==='1',embedded=q.get('embedded')==='1',store=new M.Store(),stage=$('stage'),canvas=$('wheel'),ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let view={visible:false},poolSignature='',paintPending=false,scale=1,raf=0,wakeTimer=null,nextBoundary=Infinity,lastText='',connection=null,connected=false;
 const platforms={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
 const icons={twitch:'M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z',youtube:'M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.6 3-.6 7 0 10 .3 1.4 1.2 2.3 2.6 2.5 4.3.7 10.5.7 14.8 0 1.4-.2 2.3-1.1 2.6-2.5.6-3 .6-7 0-10z M10 8l6 4-6 4z',kick:'M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z'};
 $('demo-label').hidden=!preview;
 function text(id,value){if($(id).textContent!==String(value))$(id).textContent=value;}
 function diagnostic(message){text('diagnostic-status',message);}
 function fit(){scale=Math.min(innerWidth/1000,innerHeight/1080);stage.style.transform=`translate(${(innerWidth-1000*scale)/2}px,${(innerHeight-1080*scale)/2}px) scale(${scale})`;paintPending=true;start();}
 function scheduleBoundary(now){nextBoundary=view.drawing?view.at+view.duration:view.draw?.status!=='confirmed'&&Number(view.draw?.claimDeadline)>now?Number(view.draw.claimDeadline):Infinity;}
 function paint(pool){
  // Cache the complete wheel once per entrant change. Only its CSS transform
  // moves per frame, so hundreds of names do not become hundreds of DOM nodes.
  const pixels=Math.min(3360,Math.max(840,Math.round(840*scale*(devicePixelRatio||1)*1.5)));
  canvas.width=canvas.height=pixels;ctx.setTransform(pixels/840,0,0,pixels/840,0,0);ctx.clearRect(0,0,840,840);
  ctx.save();ctx.translate(420,420);
  const colours=['#174e81d9','#c9dce7db','#172c42cf','#4787b6db','#7698b3cf','#0b1829d1'];
  if(!pool.length){ctx.fillStyle='#12263b67';ctx.beginPath();ctx.arc(0,0,399,0,M.TAU);ctx.fill();ctx.strokeStyle='#81c5ee20';ctx.lineWidth=1;for(let i=0;i<24;i++){const a=i*M.TAU/24;ctx.beginPath();ctx.moveTo(120*Math.cos(a),120*Math.sin(a));ctx.lineTo(399*Math.cos(a),399*Math.sin(a));ctx.stroke();}ctx.restore();return;}
  const arcs=M.segments(pool);
  for(let i=0;i<pool.length;i++){
   ctx.fillStyle=colours[i%colours.length];ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,399,arcs[i].start,arcs[i].end+.0001);ctx.closePath();ctx.fill();
   if(pool.length<=180){ctx.strokeStyle='#d9efff30';ctx.lineWidth=.7;ctx.stroke();}
  }
  // Equal segments remain intact at every pool size. Dense pools show a spaced
  // subset of labels because sub-pixel names cannot be made readable in OBS.
  const stride=Math.max(1,Math.ceil(pool.length/120)),fontSize=Math.max(11,Math.min(22,Math.min(...arcs.map(a=>a.end-a.start))*340*.70));
  ctx.font=`600 ${fontSize}px Rajdhani, 'Segoe UI', sans-serif`;ctx.textBaseline='middle';ctx.textAlign='right';
  for(let i=0;i<pool.length;i+=stride){
   ctx.save();ctx.rotate(arcs[i].center);
   ctx.fillStyle=i%6===1||i%6===4?'#071b2b':'#f4f9ff';
   let label=pool[i].name,limit=244;
   if(ctx.measureText(label).width>limit){let chars=Array.from(label);while(chars.length&&ctx.measureText(chars.join('')+'…').width>limit)chars.pop();label=chars.join('')+'…';}
   ctx.fillText(label,376,0);ctx.restore();
  }
  ctx.strokeStyle='#ccecff8c';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,399,0,M.TAU);ctx.stroke();ctx.restore();
 }
 function updatePlatforms(pool){
  const totals={twitch:0,youtube:0,kick:0};for(const u of pool)if(u.platform in totals)totals[u.platform]++;
  $('platforms').replaceChildren(...Object.keys(totals).map(k=>{const n=document.createElement('span');n.className='platform-count '+k;n.title=platforms[k];n.setAttribute('aria-label',`${platforms[k]}: ${totals[k]}`);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('fill','currentColor');path.setAttribute('fill-rule','evenodd');path.setAttribute('d',icons[k]);svg.append(path);n.append(svg,document.createTextNode(totals[k].toLocaleString()));return n;}));
 }
 function updateView(){
  clearTimeout(wakeTimer);wakeTimer=null;
  const now=Date.now()+store.offset;view=store.frame();stage.hidden=!view.visible;
  text('diagnostic-state',view.error||(view.visible?`${view.session.pool.length} registered · ${view.pool.length} on wheel · ${view.label} · revision ${store.state.revision}`:view.test?'Test reveal is separate. Use the Wheel Preview page to test this wheel.':`Wheel hidden until the giveaway wheel stage. ${store.state?.session?.pool?.length||0} registered · revision ${store.state?.revision??'—'}`));
  if(!view.visible){cancelAnimationFrame(raf);raf=0;if(view.wakeAt)wakeTimer=setTimeout(updateView,Math.max(1,view.wakeAt-now));return;}
  stage.dataset.status=view.status;text('title',view.session.title||'Community giveaway');text('status-text',view.label);text('count',view.pool.length.toLocaleString());text('count-label',view.draw?'IN THIS DRAW':view.pool.length===1?'ENTRANT':'ENTRANTS');
  const signature=JSON.stringify(view.pool.map(u=>[u.key,u.name,u.platform,u.weight]));if(signature!==poolSignature){poolSignature=signature;paintPending=true;updatePlatforms(view.pool);}
  $('empty').hidden=!!view.pool.length;
  $('connection-note').hidden=preview||connected;
  if(view.pool.length>120)$('count').title='Every eligible account is included. Ticket draws use weighted segments; labels may be spaced for readability.';
  else $('count').removeAttribute('title');
  scheduleBoundary(now);lastText='';renderText(now);start();
 }
 function selectedPath(count){
  if(!count)return '';
  if(count===1)return 'M819 420A399 399 0 1 0 21 420A399 399 0 1 0 819 420Z';
  const arc=view.plan?.arcs[view.plan.index],half=arc?(arc.end-arc.start)/2:Math.PI/count,r=399,x=420+r*Math.cos(half),dy=r*Math.sin(half);
  return `M420 420L${x} ${420-dy}A399 399 0 ${half>Math.PI/2?1:0} 1 ${x} ${420+dy}Z`;
 }
 function renderText(now){
  const claim=view.winner&&view.draw?.status!=='confirmed'&&Number(view.draw.claimDeadline)>now?Math.ceil((view.draw.claimDeadline-now)/1000):0;
  const key=[view.status,claim,view.winner?.key,view.pool.length].join('|');if(key===lastText)return;lastText=key;
  $('selected-path').setAttribute('d',view.winner?selectedPath(view.pool.length):'');
  if(view.drawing){text('hub-label','VOYAGER');text('hub-value','GOOD LUCK');text('result-kicker','THE UNPROFESSIONALS · GOOD LUCK');text('result-name','Finding our next winner');text('result-detail','YOUR VOYAGER GIVEAWAY IS IN MOTION');}
  else if(view.winner){
   text('hub-label',view.status==='confirmed'?'CONFIRMED':'VOYAGER');text('hub-value','WINNER');text('result-kicker',view.status==='confirmed'?'CLAIMED · CONGRATULATIONS':'YOUR VOYAGER WINNER');text('result-name',view.winner.name);$('result-name').title=view.winner.name;
   text('result-detail',(platforms[view.winner.platform]||view.winner.platform||'')+(view.status==='expired'?' · RE-ROLL':view.status==='confirmed'?' · WELCOME TO THE WINNERS’ CIRCLE':claim?' · '+(now<Number(view.draw.claimStartsAt||Number(view.draw.at)+30000)?'CLAIM TIMER STARTS IN '+Math.ceil((Number(view.draw.claimStartsAt||Number(view.draw.at)+30000)-now)/1000)+'s':'CLAIM WITHIN '+claim+'s'):' · CONGRATULATIONS'));
  }else{
   $('result-name').removeAttribute('title');text('hub-label',view.status==='open'?'GOOD LUCK':'STAND BY');text('hub-value',view.status==='open'?'ENTER TO WIN':'READY TO DRAW');text('result-kicker',view.status==='open'?'THE NEXT WINNER COULD BE YOU':'ENTRIES ARE LOCKED · GOOD LUCK');
   if(view.status==='open'){$('result-name').replaceChildren(document.createTextNode('!ticket '),Object.assign(document.createElement('em'),{textContent:'or'}),document.createTextNode(' !enter'));}else text('result-name',view.pool.length?'Ready for the draw':'No entrants');
   text('result-detail',view.pool.length>120?'ALL '+view.pool.length.toLocaleString()+' ENTRANTS INCLUDED · LABELS SPACED FOR READABILITY':'TWITCH · YOUTUBE · KICK');
  }
 }
 function frame(){
  raf=0;if(!view.visible)return;const now=Date.now()+store.offset;
  if(now>=nextBoundary){updateView();return;}
  if(paintPending){paintPending=false;paint(view.pool);}
  const rotation=view.plan?(reduced.matches&&view.drawing?view.plan.start:M.angle(view.plan,now)):reduced.matches?0:M.idleAngle(view.session,now);
  canvas.style.transform=`rotate(${rotation}rad)`;
  renderText(now);raf=requestAnimationFrame(frame);
 }
 function start(){if(view.visible&&!raf)raf=requestAnimationFrame(frame);}
 function accept(state,offset=0){if(store.accept(state,offset))updateView();}
 function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(Error('Cannot load '+src+'. Put this page beside your existing config.js and giveaway-connection.js.'));document.head.append(script);});}
 function fail(e){diagnostic(e.message);$('diagnostics').hidden=false;}
 async function connect(){
  try{
   await loadScript('config.js');await loadScript('giveaway-connection.js');
   if(typeof window.VoyagerConnection!=='function')throw Error('giveaway-connection.js is missing the Voyager connection.');
   connection=new VoyagerConnection();
   // Read-only engine sync on connection/recovery. Never call command().
   connection.addEventListener('state',e=>{if(e.detail.ok&&e.detail.state)accept(e.detail.state,connection.offset);});
   connection.addEventListener('status',e=>{connected=e.detail.state==='live';diagnostic(e.detail.message);$('connection-note').hidden=connected||!view.visible;if(e.detail.state==='error')$('diagnostics').hidden=false;});
   connection.connect();
  }catch(e){fail(e);}
 }
 for(let i=0;i<120;i++){const a=i*M.TAU/120,r=i%5===0?410:415,line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',440+Math.cos(a)*r);line.setAttribute('y1',440+Math.sin(a)*r);line.setAttribute('x2',440+Math.cos(a)*420);line.setAttribute('y2',440+Math.sin(a)*420);$('ticks').append(line);}
 addEventListener('resize',fit);addEventListener('keydown',e=>{if(e.key.toLowerCase()==='d')$('diagnostics').hidden=!$('diagnostics').hidden;});
 addEventListener('pagehide',()=>{clearTimeout(wakeTimer);wakeTimer=null;cancelAnimationFrame(raf);raf=0;connection?.stop();});
 addEventListener('pageshow',e=>{if(e.persisted){if(connection)connection.connect();updateView();}});
 document.fonts?.ready.then(()=>{paintPending=true;start();});fit();
 if(preview||embedded){connected=true;diagnostic('Preview only. No connection to Streamer.bot.');addEventListener('message',e=>{if(parent!==window&&e.source===parent&&e.data?.type==='voyager.wheel.preview.v1')accept(e.data.state,Number(e.data.offset)||0);});if(parent!==window)parent.postMessage({type:'voyager.wheel.preview.ready.v1'},'*');else{diagnostic('Open Voyager_Wheel_Preview.html for the isolated test controls.');$('diagnostics').hidden=false;}}
 else connect();
})();
