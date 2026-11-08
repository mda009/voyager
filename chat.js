/* Voyager chat window (2.20.84): reads the host's chat feed (every platform Streamer.bot sends to Voyager) once a second. */
(()=>{'use strict';
const $=id=>document.getElementById(id),q=new URLSearchParams(location.search);
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname),base=hosted?'':'http://127.0.0.1:'+(Number(q.get('voyager'))||8740);
const w=Number(q.get('w')),h=Number(q.get('h'));if(w&&h){document.body.style.width=w+'px';document.body.style.height=h+'px';}
const shown=new Map();let names=true;
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function row(m){const d=node('div',undefined,'msg '+m.platform);d.dataset.id=m.id;d.append(node('span',undefined,'p'));const b=node('div',undefined,'b');
  if(m.role>=4)b.append(node('span','HOST','badge host'));else if(m.role===3)b.append(node('span','MOD','badge mod'));else if(m.role===2)b.append(node('span','VIP','badge vip'));if(m.sub)b.append(node('span','SUB','badge sub'));
  const n=node('span',names?m.name:'Viewer','n');if(m.color)n.style.setProperty('--c',m.color);b.append(n,node('span',m.text,'t'));d.append(b);return d;}
function render(list){const box=$('list');const ids=new Set(list.map(m=>m.id));for(const [id,el] of shown)if(!ids.has(id)){el.remove();shown.delete(id);}
  for(const m of list){if(shown.has(m.id))continue;const el=row(m);shown.set(m.id,el);box.append(el);}
  // keep only what fits: drop from the top while the column overflows
  while(box.scrollHeight>box.clientHeight+2&&box.children.length>1){const first=box.firstElementChild;shown.delete(first.dataset.id);first.remove();}
  $('empty').hidden=!!list.length;const seen={twitch:0,youtube:0,kick:0};for(const m of list)seen[m.platform]=1;document.querySelector('.tw').classList.toggle('on',!!seen.twitch);document.querySelector('.yt').classList.toggle('on',!!seen.youtube);document.querySelector('.kk').classList.toggle('on',!!seen.kick);}
async function poll(){try{const r=await fetch(base+'/api/stage/overlay',{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));const d=await r.json();names=d.chatNames!==false;render(d.chat||[]);}catch{}}
poll();setInterval(poll,1000);
})();
