(()=>{'use strict';
const $=id=>document.getElementById(id),names={twitch:'Twitch',youtube:'YouTube',kick:'Kick'},PAGE_SIZE=18;
let session=null,page=0,signature='',timer=null,arrivalTimer=null,queue=[],seen=new Set(),fresh=new Map();
function fit(){const scale=Math.min(innerWidth/1920,innerHeight/1080);$('stage').style.transform=`translate(${(innerWidth-1920*scale)/2}px,${(innerHeight-1080*scale)/2}px) scale(${scale})`;}
addEventListener('resize',fit);new ResizeObserver(fit).observe(document.documentElement);fit();
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
function ticket(u){return '#'+String(u.ticketNumber||session.pool.findIndex(x=>x.key===u.key)+1).padStart(4,'0');}
function showArrival(u,isNew=false){
 $('arrival-heading').textContent=isNew?'JUST ENTERED':'LATEST TICKET';$('arrival-kicker').textContent=u?'TICKET SECURED':'READY WHEN YOU ARE';$('arrival-name').textContent=u?u.name:'Join the crew.';$('arrival-platform').textContent=u?(names[u.platform]||u.platform):'!ticket or !enter';$('arrival-platform').className=u?u.platform:'';$('arrival-ticket').textContent=u?ticket(u):'#----';
 const card=$('arrival-card');card.classList.remove('flash');if(isNew){void card.offsetWidth;card.classList.add('flash');}
 $('queue-note').textContent=queue.length?queue.length+' more new '+(queue.length===1?'entrant':'entrants')+' joining the board':'';
}
function nextArrival(){if(!queue.length){arrivalTimer=null;$('queue-note').textContent='';$('arrival-heading').textContent='LATEST TICKET';return;}const u=queue.shift();showArrival(u,true);arrivalTimer=setTimeout(nextArrival,queue.length>12?650:1800);}
function render(){if(!session)return;fit();requestAnimationFrame(fit);$('panel').hidden=false;const used=new Set(session.draws.map(d=>d.winner.key)),pool=session.pool,pages=Math.ceil(pool.length/PAGE_SIZE);page=pages?page%pages:0;
 $('title').textContent=session.title;$('status-text').textContent=session.entriesOpen?'ENTRIES OPEN':'ENTRIES CLOSED';$('status').classList.toggle('closed',!session.entriesOpen);$('total').textContent=pool.length.toLocaleString();
 $('instructions').replaceChildren(...(session.entriesOpen?[node('span','Type '),node('b','!ticket'),node('span',' or '),node('b','!enter'),node('span',' in chat to join')]:[node('span','The pool is locked. Good luck, crew.')]));
 for(const p of Object.keys(names))$(p).textContent=pool.filter(u=>u.platform===p).length.toLocaleString();
 const visible=pool.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE),next=JSON.stringify(visible.map(u=>[u.key,u.name,used.has(u.key),u.ticketNumber]));
 if(signature!==next){signature=next;$('entries').replaceChildren();visible.forEach((u,i)=>{const r=node('div','','entry'+(used.has(u.key)?' picked':'')+((fresh.get(u.key)||0)>Date.now()?' is-new':''));r.dataset.key=u.key;const copy=node('div','','entry-copy');copy.append(node('strong',u.name),node('span',used.has(u.key)?'Previously picked':names[u.platform]||u.platform,'platform '+u.platform));r.append(node('span',u.name.slice(0,2).toUpperCase(),'avatar'),copy,node('span',ticket(u),'number'));$('entries').append(r);});}
 $('entries').hidden=!pool.length;$('empty').hidden=!!pool.length;$('empty-text').textContent=session.entriesOpen?'Type !ticket or !enter. Your ticket will appear here.':'No entries were collected.';$('page').textContent=pages?'ENTRANTS '+(page*PAGE_SIZE+1)+'–'+Math.min((page+1)*PAGE_SIZE,pool.length)+' / '+pool.length:'WAITING FOR ENTRANTS';$('track').classList.toggle('single',pages<=1);
 $('remaining').textContent=(pool.length-used.size).toLocaleString()+' ELIGIBLE · '+used.size+' PREVIOUSLY PICKED';$('footer-note').textContent=session.entriesOpen?'YOUR TICKET NUMBER APPEARS HERE AND IN YOUR CHAT':'ENTRIES CLOSED · WINNER REVEAL COMING UP';
 $('recent-list').replaceChildren();for(const u of pool.slice(-5).reverse()){const r=node('div','','recent-row'),copy=node('div','','copy');copy.append(node('strong',u.name),node('small',names[u.platform]||u.platform,u.platform));r.append(copy,node('span',ticket(u),'number'));$('recent-list').append(r);}if(!pool.length)$('recent-list').append(node('p','Waiting for the first ticket…','recent-empty'));
}
addEventListener('message',e=>{
 if(e.source!==parent||e.data?.type!=='voyager.chat.pool.v1')return;const next=e.data.session;if(!next||next.mode!=='chat')return;
 const changed=session?.id!==next.id;
 if(changed){page=0;signature='';clearInterval(timer);clearTimeout(arrivalTimer);arrivalTimer=null;queue=[];fresh.clear();seen=new Set(next.pool.map(u=>u.key));session=next;showArrival(next.pool.at(-1));timer=setInterval(()=>{page++;render();},6000);}
 else{const newEntries=next.pool.filter(u=>!seen.has(u.key));session=next;for(const u of newEntries){seen.add(u.key);fresh.set(u.key,Date.now()+4500);queue.push(u);}if(queue.length&&!arrivalTimer)nextArrival();else $('queue-note').textContent=queue.length?queue.length+' more new '+(queue.length===1?'entrant':'entrants')+' joining the board':'';}
 render();
});
})();
