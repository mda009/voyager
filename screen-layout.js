/* Voyager Control > Screen layout (2.20.66): drag every on-screen element on a 1920 x 1080 canvas. Moments and the Community
   panel move for real; OBS-positioned overlays are reference boxes so overlaps show. */
(()=>{'use strict';
const $=id=>document.getElementById(id),hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
let token='',view=null,community=null,layout={},markers={},sel='',dirty=false,previewReady=false,scale=1;
const notice=(text,bad)=>{const n=$('notice');n.hidden=!text;n.textContent=text||'';n.dataset.state=bad?'error':'ok';};
async function api(path,body){if(!token)token=(await(await fetch('/api/admin')).json()).token;
  const r=await fetch(path,{method:body?'POST':'GET',cache:'no-store',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),snap=v=>$('snap').checked?Math.round(v/4)*4:Math.round(v);
function fit(){const w=$('canvas-wrap').clientWidth;scale=w/1920;$('canvas').style.transform='scale('+scale+')';}
addEventListener('resize',fit);
function boxes(){const out=[];for(const [k,b] of Object.entries(layout))out.push({id:'m:'+k,key:k,kind:'moment',label:view.elements[k],...b,on:!!view.settings.elements[k]});
  for(const [k,b] of Object.entries(markers)){const info=view.markerInfo[k];if(k==='community'&&community?.panel?.config){const c=community.panel.config;out.push({id:'k:'+k,key:k,kind:'marker',src:'community',label:info.label,x:1920-c.right-c.width,y:c.top,w:c.width,h:Math.max(200,Math.min(5,c.limit)*48+230),on:b.on,fixedH:true});}
    else out.push({id:'k:'+k,key:k,kind:'marker',src:info.src,label:info.label,...b});}
  return out;}
const overlaps=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
function conflicts(all){const shown=all.filter(b=>b.on&&!(b.w>=1920&&b.h>=1080)&&b.key!=='streak'),bad=new Set();for(let i=0;i<shown.length;i++)for(let j=i+1;j<shown.length;j++)if(overlaps(shown[i],shown[j])){bad.add(shown[i].id);bad.add(shown[j].id);}return bad;}
function render(){if(!view)return;const all=boxes(),bad=conflicts(all),host=$('boxes');host.replaceChildren();
  for(const b of all){if(b.kind==='marker'&&!b.on)continue;const d=el('div','box'+(b.kind==='marker'?' marker':'')+(b.src==='obs'?' obs':'')+(sel===b.id?' sel':'')+(bad.has(b.id)?' conflict':'')+(!b.on?' off':''));
    d.style.left=b.x+'px';d.style.top=b.y+'px';d.style.width=b.w+'px';d.style.height=b.h+'px';d.dataset.id=b.id;d.append(el('span','lab',b.label+(b.kind==='moment'&&!b.on?' · hidden':'')));
    if(b.kind==='marker'||b.key==='ticker'){const r=el('span','rs');r.dataset.resize='1';d.append(r);}
    d.onpointerdown=e=>start(e,b,e.target.dataset.resize==='1');host.append(d);}
  $('conflicts').textContent=bad.size?'Overlapping: '+all.filter(b=>bad.has(b.id)).map(b=>b.label).join(', '):'No overlaps';$('conflicts').className=bad.size?'sl-conf':'st-note';
  renderList(all,bad);sendPreview();$('saved').textContent=dirty?'Unsaved changes':'Drag anything on the canvas · arrow keys nudge · Shift = 10 px';}
function renderList(all,bad){const list=$('list');list.replaceChildren();
  const group=(title,items)=>{list.append(el('div','sl-group',title));for(const b of items){const it=el('div','sl-item'+(sel===b.id?' sel':'')+(bad.has(b.id)?' conflict':''));it.onclick=()=>{sel=b.id;render();};
    const name=el('b','',b.label);const tg=el('label','tg');const cb=el('input');cb.type='checkbox';cb.checked=!!b.on;cb.onclick=e=>e.stopPropagation();cb.onchange=async()=>{if(b.kind==='moment'){try{view={...view,...await api('/api/moments/element',{key:b.key,on:cb.checked})};}catch(e){notice(e.message,true);}}else{markers[b.key].on=cb.checked;dirty=true;}render();};
    tg.append(cb,document.createTextNode(b.kind==='moment'?'on stream':'on layout'));it.append(name,tg);
    const note=b.kind==='moment'?(b.key==='streak'?'Crosses the full width at this height; never counted as an overlap.':b.key==='ticker'?'Drag the corner to set its width.':'Voyager moment.'):b.src==='community'?'Moves the real Community panel (top, right edge and width).':'Positioned in OBS · '+view.markerInfo[b.key].setup+'. Match this box to the source.';it.append(el('small','',note));
    const xy=el('div','xy');const mk=(k,v,min,max)=>{const i=el('input');i.type='number';i.value=v;i.min=min;i.max=max;i.onclick=e=>e.stopPropagation();i.onchange=()=>{set(b,{[k]:clamp(Number(i.value)||0,min,max)});};xy.append(document.createTextNode(k.toUpperCase()+' '),i);};
    if(!(b.kind==='moment'&&b.key==='streak'))mk('x',b.x,-200,1920);mk('y',b.y,-200,1080);if(b.kind==='marker'||b.key==='ticker')mk('w',b.w,40,1920);if(b.kind==='marker'&&!b.fixedH)mk('h',b.h,24,1080);it.append(xy);list.append(it);}};
  group('Voyager moments (this overlay)',all.filter(b=>b.kind==='moment'));group('Other overlays',all.filter(b=>b.kind==='marker'));}
function set(b,patch,quiet){if(b.kind==='moment'){const L=layout[b.key];Object.assign(L,patch);if(b.key==='streak')L.x=0;L.x=clamp(L.x,-200,1920);L.y=clamp(L.y,-200,1080);if(b.key==='ticker')L.w=clamp(L.w,300,1920);}
  else{if(b.src==='community'&&community?.panel?.config){const c=community.panel.config;const nb={x:b.x,y:b.y,w:b.w,...patch};c.width=clamp(nb.w,320,480);c.top=clamp(nb.y,0,600);c.right=clamp(1920-nb.x-c.width,0,1440);community.dirty=true;}
    else{const M=markers[b.key];Object.assign(M,patch);M.x=clamp(M.x,-200,1920);M.y=clamp(M.y,-200,1080);M.w=clamp(M.w,40,1920);M.h=clamp(M.h,24,1080);}}
  dirty=true;if(!quiet)render();}
function start(e,b,resize){e.preventDefault();sel=b.id;const sx=e.clientX,sy=e.clientY,ox=b.x,oy=b.y,ow=b.w,oh=b.h;const target=e.currentTarget;target.setPointerCapture(e.pointerId);for(const x of document.querySelectorAll('.box.sel'))x.classList.remove('sel');target.classList.add('sel');
  const move=ev=>{const dx=(ev.clientX-sx)/scale,dy=(ev.clientY-sy)/scale;if(resize)set(b,{w:snap(ow+dx),...(b.kind==='marker'&&!b.fixedH?{h:snap(oh+dy)}:{})},true);else set(b,{x:snap(ox+dx),y:snap(oy+dy)},true);
    const cur=boxes().find(x=>x.id===b.id);if(cur){target.style.left=cur.x+'px';target.style.top=cur.y+'px';target.style.width=cur.w+'px';target.style.height=cur.h+'px';Object.assign(b,{x:cur.x,y:cur.y,w:cur.w,h:cur.h});}sendPreview();};
  const up=()=>{target.removeEventListener('pointermove',move);target.removeEventListener('pointerup',up);render();};target.addEventListener('pointermove',move);target.addEventListener('pointerup',up);}
addEventListener('keydown',e=>{if(!sel||/INPUT|TEXTAREA/.test(document.activeElement?.tagName))return;const b=boxes().find(x=>x.id===sel);if(!b)return;const n=e.shiftKey?10:1,d={ArrowLeft:{x:b.x-n},ArrowRight:{x:b.x+n},ArrowUp:{y:b.y-n},ArrowDown:{y:b.y+n}}[e.key];if(d){e.preventDefault();set(b,d);}});
function sendPreview(){if(!previewReady||!view)return;$('preview').contentWindow?.postMessage({type:'voyager.moments.preview',layoutOnly:true,settings:{...view.settings,layout,elements:Object.fromEntries(Object.keys(view.elements).map(k=>[k,!!view.settings.elements[k]]))}},'*');}
addEventListener('message',e=>{if(e.source===$('preview').contentWindow&&e.data?.type==='voyager.moments.preview.ready'){previewReady=true;sendPreview();}});
$('show-all').onclick=()=>{previewReady=true;sendPreview();};
$('save').onclick=async()=>{try{view={...view,...await api('/api/moments/settings',{layout,markers})};if(community?.dirty){await api('/api/community/panel',{config:community.panel.config});community.dirty=false;}dirty=false;render();notice('Layout saved. The overlay moves within 2 s; the Community panel on its next refresh.');}catch(e){notice(e.message,true);}};
$('reset').onclick=()=>{layout=structuredClone(view.layoutDefaults);dirty=true;render();};
async function load(){try{view=await api('/api/moments');layout=structuredClone(view.settings.layout);markers=structuredClone(view.settings.markers);try{community=await api('/api/community');}catch{community=null;}fit();render();}catch(e){notice(e.message,true);}}
if(!hosted){$('not-hosted').hidden=false;}else load();
})();

// 2.21.10: timed OBS sources (show N s, hide M s, repeat) through the Stage action.
(()=>{
const $=id=>document.getElementById(id),el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n;};
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname);if(!hosted||!$('rot-rows'))return;
let token='',rot=null,editing=false;
async function api(path,body){if(!token)token=(await(await fetch('/api/admin')).json()).token;const r=await fetch(path,{method:body?'POST':'GET',cache:'no-store',headers:{'X-Voyager-Token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const d=await r.json().catch(()=>({}));if(!r.ok||d.ok===false)throw new Error(d.message||'Voyager answered '+r.status);return d;}
const note=(t,bad)=>{const n=$('rot-note');n.textContent=t||'';n.style.color=bad?'#ff9aa6':'';};
const ago=at=>{if(!at)return '';const s=Math.round((Date.now()-at)/1000);return s<60?s+' s ago':Math.round(s/60)+' min ago';};
const fmt=s=>s>=60&&s%60===0?(s/60)+' min':s+' s';
function row(it){const r=el('div','rot-row');r.dataset.name=it.name;
  const name=el('input');name.type='text';name.placeholder='OBS source name, exactly';name.value=it.name||'';name.title='Source name';
  const show=el('input');show.type='number';show.min=5;show.max=3600;show.value=it.showSeconds??30;show.title='Show for (seconds)';
  const hide=el('input');hide.type='number';hide.min=5;hide.max=86400;hide.value=it.hideSeconds??600;hide.title='Hide for (seconds)';
  const on=el('label');const cb=el('input');cb.type='checkbox';cb.checked=it.enabled!==false;on.append(cb,' On');
  const btns=el('div','rot-btns');const t1=el('button','','Show now');t1.type='button';const t2=el('button','','Hide now');t2.type='button';const del=el('button','','Remove');del.type='button';
  t1.onclick=()=>test(name.value,true);t2.onclick=()=>test(name.value,false);del.onclick=()=>{r.remove();editing=true;};
  btns.append(t1,t2,del);
  const st=el('div','rot-st');
  if(it.name){let txt='',cls='';if(it.enabled===false)txt='Off';else if(rot?.stageUp)txt='Paused: the stage is up';else if(it.sent===null)txt='Waiting for Streamer.bot';else{txt=(it.showing?'Showing':'Hidden')+' · changes in '+fmt(Math.max(0,Math.round((it.nextChange-Date.now())/1000)));}
    const o=it.obs;const sub=o?(o.ok?'OBS: ':'OBS FAILED: ')+o.message:it.ok===false?'NOT SENT: '+it.message:it.at?'Sent '+ago(it.at):'';cls=o?(o.ok?'ok':'bad'):it.ok===false?'bad':'';
    st.className='rot-st '+cls;st.append(el('b','',txt),document.createElement('br'),document.createTextNode(sub));}
  for(const i of [name,show,hide,cb])i.addEventListener('input',()=>{editing=true;});
  r.append(name,show,hide,on,btns,st);return r;}
function render(){if(!rot||editing)return;const box=$('rot-rows');box.replaceChildren();for(const it of rot.items)box.append(row(it));if(!rot.items.length)box.append(el('p','st-hint','No timed sources yet — Add a source.'));
  const pill=$('rot-pill'),act=rot.action;const bad=rot.items.some(i=>i.enabled!==false&&(i.ok===false||i.obs?.ok===false));
  pill.dataset.state=!rot.connected?'wait':act?.state!=='found'?'error':bad?'warn':rot.items.some(i=>i.enabled!==false)?'ok':'wait';
  pill.textContent=!rot.connected?'Streamer.bot offline':act?.state!=='found'?'Stage action missing':rot.stageUp?'Paused · stage up':bad?'Check OBS':rot.items.filter(i=>i.enabled!==false).length+' on a clock';}
function collect(){return {items:[...$('rot-rows').querySelectorAll('.rot-row')].map(r=>{const [name,show,hide]=r.querySelectorAll('input');return {name:name.value,showSeconds:Number(show.value),hideSeconds:Number(hide.value),enabled:r.querySelector('input[type=checkbox]').checked};}).filter(i=>i.name.trim())};}
async function test(name,show){if(!name.trim()){note('Name the source first.',true);return;}try{const r=await api('/api/rotation/test',{name:name.trim(),show});note((show?'Show':'Hide')+' sent · '+(r.message||''));}catch(e){note(e.message,true);}}
async function load(){try{rot=await api('/api/rotation');render();}catch(e){note(e.message,true);}}
$('rot-add').onclick=()=>{editing=true;$('rot-rows').querySelector('p')?.remove();$('rot-rows').append(row({name:'',showSeconds:30,hideSeconds:600,enabled:true}));};
$('rot-save').onclick=async()=>{try{rot={...rot,...(await api('/api/rotation/settings',collect()))};editing=false;note('Saved · the cycle starts now: showing first.');render();}catch(e){note(e.message,true);}};
load();setInterval(()=>{if(!document.hidden)load();},5000);
})();
