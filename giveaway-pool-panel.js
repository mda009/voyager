/* Read-only pool display. An embedded panel shares its parent's engine connection. */
(()=>{'use strict';
 const $=id=>document.getElementById(id),q=new URLSearchParams(location.search),embedded=parent!==window||q.get('embedded')==='1',preview=q.get('preview')==='1';
 const panel=$('panel'),list=$('entries'),height=48,motion=matchMedia('(prefers-reduced-motion: reduce)');
 const names={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},icons={twitch:'M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z',youtube:'M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.6 3-.6 7 0 10 .3 1.4 1.2 2.3 2.6 2.5 4.3.7 10.5.7 14.8 0 1.4-.2 2.3-1.1 2.6-2.5.6-3 .6-7 0-10z M10 8l6 4-6 4z',kick:'M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z'};
 // Saved account keys carry the platform too. Never guess Twitch when it is
 // missing: older records can recover it from their platform:id/login key.
 function platformOf(u){for(const value of [u.platform,String(u.key||'').split(':')[0]]){const p=String(value||'').trim().toLowerCase();if(Object.prototype.hasOwnProperty.call(names,p))return p;}return 'unknown';}
 function platformLogo(platform){
  const label=names[platform]||'Unknown platform',badge=node('span',undefined,'pool-platform-logo');badge.dataset.platform=platform;badge.title='Entry from '+label;badge.setAttribute('role','img');badge.setAttribute('aria-label',label);
  if(!icons[platform]){badge.textContent='?';return badge;}
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','24');svg.setAttribute('height','24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',icons[platform]);path.setAttribute('fill',({twitch:'#c5a0ff',youtube:'#ff3449',kick:'#53fc18'})[platform]);path.setAttribute('fill-rule','evenodd');svg.append(path);
  if(platform==='youtube'){const play=document.createElementNS('http://www.w3.org/2000/svg','path');play.setAttribute('d','M10 8l6 4-6 4z');play.setAttribute('fill','#ffffff');svg.append(play);}
  badge.append(svg);return badge;
 }
 let state=null,rows=[],signature='',epoch=performance.now(),position=-1,raf=0,client=null;
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);$('stage').style.transform='translate('+((innerWidth-1920*s)/2)+'px,'+((innerHeight-1080*s)/2)+'px) scale('+s+')';}
 function tier(value){const key=String(value).toLowerCase().replace(/\s+group$/,'').trim();return ['blue','silver','gold','platinum','vip'].includes(key)?key:'';}
 function entry(u,index,slot){
  const row=node('div',undefined,'entry'),person=node('div',undefined,'pool-person'),line=node('div',undefined,'pool-name-line'),name=node('strong',u.name||u.login||'Viewer','name');name.title=name.textContent;
  row.style.transform='translateY('+(slot*height)+'px)';row.dataset.key=u.key||String(index);row.setAttribute('role','listitem');row.setAttribute('aria-posinset',index+1);row.setAttribute('aria-setsize',rows.length);
  const avatar=node('span',Array.from(name.textContent).slice(0,2).join('').toUpperCase(),'avatar');
  if(typeof u.avatarUrl==='string'&&/^https?:\/\//i.test(u.avatarUrl)){const img=document.createElement('img');img.alt='';img.decoding='async';img.referrerPolicy='no-referrer';img.src=u.avatarUrl;img.addEventListener('error',()=>img.remove(),{once:true});avatar.append(img);}
  line.append(name);const badges=node('span',undefined,'pool-tiers');for(const t of new Set((Array.isArray(u.groups)?u.groups:[]).map(tier).filter(Boolean))){const b=node('span',t==='vip'?'VIP':t[0].toUpperCase()+t.slice(1),'pool-tier');b.dataset.tier=t;badges.append(b);}line.append(badges);
  const platform=platformOf(u),sub=node('span',names[platform]||'Unknown platform','pool-platform');row.dataset.platform=platform;
  person.append(line,sub);row.append(node('span',String(index+1).padStart(2,'0'),'pool-rank'),avatar,person,platformLogo(platform));return row;
 }
 function paint(first){if(first===position)return;position=first;list.replaceChildren();for(let slot=0;slot<Math.min(rows.length,rows.length>5?6:5);slot++){const i=(first+slot)%rows.length;list.append(entry(rows[i],i,slot));}}
 function scroll(now){raf=0;if(panel.hidden)return;const y=rows.length>5&&!motion.matches?((now-epoch)*.018)%(rows.length*height):0;paint(Math.floor(y/height));list.style.transform='translateY(-'+(y%height)+'px)';raf=requestAnimationFrame(scroll);}
 function render(){
  const session=state?.session||state?.preview;panel.hidden=state?.view!=='pool'||!session;cancelAnimationFrame(raf);raf=0;if(panel.hidden)return;
  const draw=(session.draws||[]).find(d=>d.id===session.currentDrawId),open=session.entriesOpen===true||session.preview===true,status=draw?(draw.status==='confirmed'?'Claimed':'Drawn'):open?'Open':'Locked';
  $('status-text').textContent=status;$('status').dataset.status=status.toLowerCase();$('title').textContent=session.title||'Voyager giveaway';
  rows=Array.isArray(session.pool)?session.pool.filter(u=>u&&typeof u==='object'):[];$('total').textContent=rows.length.toLocaleString()+' '+(rows.length===1?'entrant':'entrants');$('list-order').textContent=session.mode==='chat'?'ENTRY ORDER':'MEMBER POOL';
  const instructions=$('instructions');instructions.replaceChildren();instructions.append(node('strong',session.mode==='chat'&&open?'!ticket or !enter':open?'Your Voyager member pool':status==='Drawn'?'Winner drawn':status==='Claimed'?'Winner confirmed':'Entries are locked'),node('span',session.mode==='chat'&&open?'IN CHAT TO JOIN':open?'MEMBERS INCLUDED BEFORE THE DRAW':session.mode==='chat'?'THANK YOU, VOYAGERS':'BLUE · SILVER · GOLD · PLATINUM · VIP'));
  $('empty').hidden=rows.length>0;$('empty').firstElementChild.textContent=session.error||'No entrants yet.';$('empty').lastElementChild.textContent=session.mode==='chat'?'Enter in chat and your name will appear here.':'Included members will appear here.';
  const next=JSON.stringify(rows.map(u=>[u.key,u.name,u.login,u.platform,u.avatarUrl,u.groups]));if(next!==signature){signature=next;position=-1;epoch=performance.now();}list.hidden=!rows.length;list.style.height=(rows.length>5?6:Math.min(5,rows.length))*height+'px';scroll(performance.now());
 }
 function accept(s){if(!s||s.schema!==1||!Number.isFinite(s.revision)||state&&s.revision<state.revision)return;state=s;render();}
 addEventListener('message',e=>{if(parent!==window&&e.source===parent&&['voyager.giveaway.pool.v1','voyager.preview'].includes(e.data?.type))accept(e.data.state);});
 function script(src){return new Promise((resolve,reject)=>{const e=document.createElement('script');e.src=src;e.onload=resolve;e.onerror=()=>reject(Error('Cannot load '+src));document.head.append(e);});}
 async function connect(){try{await script('config.js');await script('giveaway-connection.js');client=new VoyagerConnection();client.addEventListener('state',e=>{if(e.detail?.ok&&e.detail.state)accept(e.detail.state);});client.connect();}catch(e){console.error('[Voyager pool] '+e.message);}}
 if(embedded||preview){if(parent!==window)parent.postMessage({type:'voyager.giveaway.pool.ready'},'*');}else connect();
 addEventListener('resize',fit);addEventListener('pagehide',()=>{cancelAnimationFrame(raf);client?.stop();});addEventListener('pageshow',e=>{if(e.persisted)location.reload();});fit();
})();
