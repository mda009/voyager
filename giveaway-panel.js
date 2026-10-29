(()=>{'use strict';
const $=id=>document.getElementById(id),viewport=$('viewport'),entries=$('entries'),ROW=48,SPEED=20;
const platforms={twitch:'Twitch',youtube:'YouTube',kick:'Kick'};
const tiers={blue:'Blue',silver:'Silver',gold:'Gold',platinum:'Platinum',vip:'Ruby VIP'},colours={blue:'#a7d8ff',silver:'#d1dce9',gold:'#f4cb71',platinum:'#e0e6ff',vip:'#ff6893'};
const icons={twitch:'<path fill="currentColor" d="M4 2h18v13l-6 6h-5l-3 3v-3H4V2zm2 2v13h5v3l3-3h4l2-2V4H6zm5 3h2v6h-2V7zm5 0h2v6h-2V7z"/>',youtube:'<path fill="currentColor" d="M22 7c-.3-1.4-1.2-2.3-2.6-2.5C17.5 4.2 14 4 12 4s-5.5.2-7.4.5C3.2 4.7 2.3 5.6 2 7c-.3 1.4-.5 3.4-.5 5s.2 3.6.5 5c.3 1.4 1.2 2.3 2.6 2.5 1.9.3 5.4.5 7.4.5s5.5-.2 7.4-.5c1.4-.2 2.3-1.1 2.6-2.5.3-1.4.5-3.4.5-5s-.2-3.6-.5-5z"/><path fill="#171f2b" d="m10 8 6 4-6 4z"/>',kick:'<path fill="currentColor" d="M3 2h6v7h3V5h3V2h6v7h-3v3h-3v3h3v3h3v4h-6v-4h-3v-3H9v7H3z"/>'};
let state=null,session=null,offset=0,position=0,lastFrame=0,seen=new Set(),fresh=new Map(),rows=new Map(),lastStatus='';
function fit(){const scale=Math.min(innerWidth/1920,innerHeight/1080);$('stage').style.transform=`translate(${(innerWidth-1920*scale)/2}px,${(innerHeight-1080*scale)/2}px) scale(${scale})`;renderWindow();}
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function safeImage(raw){if(typeof raw!=='string')return '';try{const url=new URL(raw);if(url.protocol==='https:'&&!url.username&&!url.password)return url.href;}catch{}return /^demo-avatar-[1-6]\.svg$/.test(raw)?raw:'';}
function status(){const d=session?.draws?.find(x=>x.id===session.currentDrawId),now=Date.now()+offset,r=state?.reveal;
 if(session?.preview)return session.error?'unavailable':'open';
 if(d&&((r?.drawId===d.id&&now<r.at+20000)||now<d.at+20000))return 'drawing';
 if(d?.status==='confirmed')return 'confirmed';if(d?.claimDeadline&&now>=d.claimDeadline&&d.status==='selected')return 'expired';if(d)return 'drawn';return session?.mode==='chat'&&session.entriesOpen?'open':'locked';}
function renderStatus(){if(!session)return;const value=status(),key=value+'|'+session.mode+'|'+(session.groups||[]).join(',')+'|'+!!session.preview;if(key===lastStatus)return;lastStatus=key;$('status').dataset.status=value;$('status-text').textContent=value[0].toUpperCase()+value.slice(1);
 const text={locked:'Entries locked. Good luck!',drawing:'Choosing a winner…',drawn:'Winner drawn. Entries locked.',confirmed:'Winner confirmed.',expired:'Claim time expired.'};
 if(session.mode!=='chat'){$('instructions').replaceChildren(node('strong',(session.groups||[]).map(k=>tiers[k]||k).join(' + ')||'Member giveaway','group-label'),node('span',session.preview?(session.error?'LAST RECEIVED MEMBERS · UPDATE FAILED':'GROUPS UPDATE UNTIL LOCKED'):'AUTOMATIC MEMBER ENTRY'));}
 else if(value==='open'){const label=node('strong','');label.append(document.createTextNode('!ticket '),node('span','or'),document.createTextNode(' !enter'));$('instructions').replaceChildren(label,node('span','IN CHAT TO JOIN'));}
 else $('instructions').replaceChildren(node('strong',text[value],'status-note'),node('span',value==='drawing'?'GOOD LUCK, EVERYONE':'ENTRIES CLOSED'));
 $('empty').firstElementChild.textContent=session.mode!=='chat'?(session.preview?'No eligible members yet.':'No eligible members remain.'):value==='open'?'Be the first to enter.':'No entrants in this giveaway.';$('empty').lastElementChild.textContent=session.mode!=='chat'?(session.preview?'Members appear as groups update.':'Previous picks are excluded.'):value==='open'?'Your name will appear here.':'Entries are locked.';renderWindow();
}
function updateRow(row,u,index,slot,used){row.style.transform=`translateY(${slot*ROW}px)`;row.dataset.index=index;row.setAttribute('aria-posinset',index+1);row.setAttribute('aria-setsize',session.pool.length);row.classList.toggle('picked',used.has(u.key));row.querySelector('.name').textContent=u.name;
 const memberships=session.mode==='chat'?[]:Object.keys(tiers).filter(k=>Array.isArray(u.groups)&&u.groups.includes(k)),signature=memberships.join(',');
 if(row.dataset.groups!==signature){const badges=row.querySelector('.member-groups');badges.replaceChildren(...memberships.map(k=>{const badge=node('span',tiers[k],'member-group');badge.style.setProperty('--group-colour',colours[k]);return badge;}));badges.hidden=!memberships.length;row.dataset.groups=signature;}
 row.title=u.name+' · '+(platforms[u.platform]||u.platform)+(memberships.length?' · '+memberships.map(k=>tiers[k]).join(' + '):'');const avatar=row.querySelector('.avatar'),src=safeImage(u.avatarUrl);avatar.firstElementChild.textContent=Array.from(u.name||'?').slice(0,2).join('').toUpperCase();
 if(row.dataset.avatar!==src){row.dataset.avatar=src;avatar.querySelector('img')?.remove();if(src){const img=document.createElement('img');img.alt='';img.decoding='async';img.referrerPolicy='no-referrer';img.onload=()=>img.hidden=false;img.onerror=()=>img.remove();img.hidden=true;img.src=src;avatar.append(img);}}
}
function renderWindow(){if(!session||!viewport.clientHeight)return;const pool=session.pool,cycle=pool.length*ROW,looping=cycle>viewport.clientHeight;
 // Render only the visible rows. Continuing past the last ticket reuses the
 // first tickets visually; the saved pool and entrant count never change.
 if(!looping)position=0;else position%=cycle;
 const height=cycle+(looping?viewport.clientHeight:0)+'px';if(entries.style.height!==height)entries.style.height=height;
 const start=Math.max(0,Math.floor(position/ROW)-1),end=pool.length?(looping?Math.ceil((position+viewport.clientHeight)/ROW)+1:pool.length):0,wanted=new Set(),used=new Set((session.draws||[]).filter(d=>d.id!==session.currentDrawId||status()!=='drawing').map(d=>d.winner.key));
 for(let i=start;i<end;i++){const index=i%pool.length,u=pool[index];wanted.add(i);let row=rows.get(i);if(row&&row.dataset.key!==u.key){row.remove();rows.delete(i);row=null;}if(!row){row=node('div','','entry');row.dataset.key=u.key;row.setAttribute('role','listitem');const avatar=node('span','','avatar');avatar.append(node('span',''));const platform=node('span','','platform '+(platforms[u.platform]?u.platform:''));platform.title=platforms[u.platform]||u.platform;platform.append(node('span',platforms[u.platform]||u.platform,'platform-name'));if(icons[u.platform]){platform.classList.add('has-icon');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[u.platform];platform.prepend(svg);platform.setAttribute('aria-label',platforms[u.platform]);}row.append(avatar,node('strong','','name'),node('span','','member-groups'),platform);if((fresh.get(u.key)||0)>Date.now())row.classList.add('is-new');rows.set(i,row);}
 updateRow(row,u,index,i,used);if(entries.children[i-start]!==row)entries.insertBefore(row,entries.children[i-start]||null);
 }for(const[key,row]of rows)if(!wanted.has(key)){row.remove();rows.delete(key);}
 viewport.scrollTop=position;
}
function apply(next,clockOffset){const s=next?.session;if(!s||!Array.isArray(s.pool)||(s.mode&&s.mode!=='chat'&&s.mode!=='groups')){state=next;session=null;$('panel').hidden=true;return;}
 const changed=session?.id!==s.id;state=next;offset=clockOffset||0;session=s;
 if(changed){seen=new Set(s.pool.map(u=>u.key));fresh.clear();rows.clear();entries.replaceChildren();position=0;viewport.scrollTop=0;lastStatus='';}
 else for(const u of s.pool)if(!seen.has(u.key)){seen.add(u.key);fresh.set(u.key,Date.now()+2600);}
 for(const[key,until]of fresh)if(until<Date.now())fresh.delete(key);
 const chat=s.mode==='chat';$('panel').hidden=false;$('panel').dataset.mode=chat?'chat':'groups';$('panel').style.setProperty('--panel-accent',chat?colours.blue:colours[s.groups?.[0]]||colours.blue);$('title').textContent=s.title;$('total').textContent=s.pool.length.toLocaleString()+(chat?' '+(s.pool.length===1?'entrant':'entrants'):' eligible '+(s.pool.length===1?'member':'members'));$('list-order').textContent=chat?'ENTRY ORDER':'NAME ORDER';entries.setAttribute('aria-label',chat?'Entrants in entry order':'Eligible members in name order');entries.style.height=s.pool.length*ROW+'px';entries.hidden=!s.pool.length;$('empty').hidden=!!s.pool.length;renderStatus();fit();requestAnimationFrame(fit);
}
function animate(t){const delta=Math.min(100,t-(lastFrame||t));lastFrame=t;if(session&&viewport.clientHeight){const cycle=session.pool.length*ROW;position=cycle>viewport.clientHeight?(position+delta*SPEED/1000)%cycle:0;renderWindow();}requestAnimationFrame(animate);}
addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='voyager.panel.state.v1')apply(e.data.state,e.data.offset);});
addEventListener('resize',fit);new ResizeObserver(fit).observe(document.documentElement);setInterval(renderStatus,250);fit();requestAnimationFrame(animate);
})();
