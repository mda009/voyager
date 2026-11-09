/* Voyager Dreadnought stage (2.20.84). Polls /api/stage/overlay every second: when the host says the stage is up, the page
   fills with the Dreadnought scene, the chosen panels and the picture-in-picture frame, and animates in; when it is down,
   everything fades and the embedded pages are dropped. The panels are the ordinary overlay pages opened with ?stage=1, so
   they show the same live data as their own OBS sources (which hide themselves while the stage is up). */
(()=>{'use strict';
const $=id=>document.getElementById(id),q=new URLSearchParams(location.search),debug=q.get('debug')==='1';
const hosted=location.protocol==='http:'&&/^(127\.0\.0\.1|localhost)$/.test(location.hostname),base=hosted?'':'http://127.0.0.1:'+(Number(q.get('voyager'))||8740);
// 2.20.93: when Voyager is updated, the page reloads itself under a new address so OBS does not keep serving the cached copy.
const BUILD='2.21.5';
const stage=$('stage');let data=null,readAt=0,lastErr='',on=false,layoutKey='',offTimer=0,splashTimer=0,mvpKey='';
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform='translate('+((innerWidth-1920*s)/2)+'px,'+((innerHeight-1080*s)/2)+'px) scale('+s+')';}
addEventListener('resize',fit);fit();
const frame=(src,w,h,scale,left=0,top=0)=>{const f=document.createElement('iframe');f.src=base+src;f.width=w;f.height=h;f.style.width=w+'px';f.style.height=h+'px';f.style.transform='scale('+scale+')';f.style.left=left+'px';f.style.top=top+'px';f.setAttribute('title','panel');f.setAttribute('scrolling','no');return f;};
// A slot's content for a kind, sized to the slot rectangle.
function fill(el,kind,rect){
  el.replaceChildren();el.style.left=rect.x+'px';el.style.top=rect.y+'px';el.style.width=rect.w+'px';el.style.height=rect.h+'px';
  if(kind==='leaderboard'){const s=rect.w/388;el.append(frame('/control/Voyager_Leaderboard_Panel.html?stage=1&compact=1',388,520,s));return;}
  if(['standings','goals','bar','helpers','hall','missions'].includes(kind)){const s=rect.w/388;el.append(frame('/control/Voyager_Community_Panel.html?stage=1&compact=1&kind='+(kind==='standings'?'season':kind),388,520,s));return;}
  if(kind==='christmas'){const s=Math.min(rect.w/440,rect.h/560);el.append(frame('/control/Voyager_Christmas_Goal.html?stage=1&always=1',1920,1080,s,-1440*s+(rect.w-440*s)/2,-110*s));return;}
  if(kind==='chat'){el.append(frame('/control/chat.html?stage=1&w='+rect.w+'&h='+rect.h,rect.w,rect.h,1));return;}
  if(kind==='squadron'){const s=rect.w/568;el.append(frame('/engage.html?stage=squadron&w=568',568,Math.round(rect.h/s),s));return;}
  if(kind==='dread'){const s=Math.min(1,rect.w/380);el.append(frame('/control/Voyager_Moments.html?stage=dread&w='+Math.round(rect.w/s),1920,1080,s));return;}
  if(kind==='camera'){const d=document.createElement('div');d.className='camera';const s=document.createElement('span');s.textContent='CAMERA · PLACE YOUR SOURCE HERE';d.append(s);el.append(d);return;}
}
function fillStack(items,rect){
  const box=$('stack');box.replaceChildren();box.style.left=rect.x+'px';box.style.top=rect.y+'px';box.style.width=rect.w+'px';box.style.height=rect.h+'px';
  const heights={bucket:Math.round(rect.w/3840*480),ticker:56},gap=14;const frees=items.filter(k=>!heights[k]).length||1;let y=0;const fixed=items.filter(k=>heights[k]).reduce((a,k)=>a+heights[k]+gap,0),free=Math.max(120,Math.round((rect.h-fixed-gap*(frees-1))/frees));
  items.forEach((k,i)=>{const h=heights[k]||free,item=document.createElement('div');item.className='item';item.style.top=y+'px';item.style.height=h+'px';item.style.setProperty('--d',(2.45+i*.15)+'s');
    if(k==='bucket')item.append(frame('/control/Voyager_Bucket_Overlay.html?stage=1&always=1',3840,480,rect.w/3840));
    else if(k==='ticker')item.append(frame('/control/Voyager_Moments.html?stage=ticker&w='+rect.w,1920,1080,1));
    else if(k==='moments')item.append(frame('/control/Voyager_Moments.html?stage=moments&w='+rect.w+'&h='+h,1920,1080,1));
    else if(k==='dread')item.append(frame('/control/Voyager_Moments.html?stage=dread&w='+rect.w,1920,1080,1));
    box.append(item);y+=h+gap;});
}
function build(d){
  const g=d.geometry,key=JSON.stringify([d.slots,d.stack,d.pip,g,d.mode,d.main?.url,d.splash?.title]);if(key===layoutKey)return;layoutKey=key;
  stage.style.setProperty('--px',g.pip.x+'px');stage.style.setProperty('--py',g.pip.y+'px');stage.style.setProperty('--pw',g.pip.w+'px');stage.style.setProperty('--ph',g.pip.h+'px');stage.style.setProperty('--anim',(d.animationMs||1200)/1000+'s');
  stage.style.setProperty('--accent',d.main?.accent||'#ff7b8c');stage.style.setProperty('--accent-glow',(d.main?.accent||'#ff7b8c')+'66');stage.style.setProperty('--accent-flash',(d.main?.accent||'#ff7b8c')+'8c');$('main-label').textContent=d.main?.label||'VOYAGER DREADNOUGHT · LIVE';
  if(d.splash){$('alert-eyebrow').textContent=d.splash.eyebrow||'';$('alert-title').textContent=d.splash.title||'';const chips=$('alert-chips');chips.replaceChildren(...(d.splash.chips||[]).map(c=>{const i=document.createElement('i');i.textContent=c;return i;}));}
  $('main').style.left=g.main.x+'px';$('main').style.top=g.main.y+'px';$('main').style.width=g.main.w+'px';$('main').style.height=g.main.h+'px';$('main').querySelector('iframe').style.transform='scale('+(g.main.w/1920)+')';$('main-tag').style.left=g.main.x+'px';$('main-tag').style.top=(g.main.y+g.main.h+10)+'px';
  fill($('slot-left'),d.slots.left,g.left);fill($('slot-right'),d.slots.right,g.right);fill($('slot-bottomLeft'),d.slots.bottomLeft,g.bottomLeft);fillStack(d.stack||[],g.stack);
}
function clear(){layoutKey='';for(const id of ['slot-left','slot-right','slot-bottomLeft','stack'])$(id).replaceChildren();$('dread').removeAttribute('src');mvp(null);}
// MVP celebration after the battle report: name, damage, bonus points, confetti.
const CONF=['#ffd56a','#fff3b8','#a7d8ff','#7ff0b5','#ff9aa6','#c9a6ff','#ffffff'];
function mvp(m){const box=$('mvp'),key=m?m.name+'|'+m.until:'';if(key===mvpKey)return;mvpKey=key;stage.classList.toggle('mvp',!!m);
  if(!m){box.hidden=true;$('confetti').replaceChildren();return;}
  $('mvp-eb').textContent=m.eyebrow||'★ MVP ★';$('mvp-name').textContent=m.name;$('mvp-line').textContent=m.line||'';
  $('mvp-pts').textContent=Number(m.points||0).toLocaleString('en');$('mvp-ptslabel').textContent=m.pointsLabel||'VOYAGER POINTS';$('mvp').querySelector('.pts').hidden=!(m.points>0);
  $('mvp-sub').textContent=m.sub||'';
  const c=$('confetti');c.replaceChildren();for(let i=0;i<90;i++){const p=document.createElement('i');p.style.left=(Math.random()*100)+'%';p.style.background=CONF[i%CONF.length];p.style.setProperty('--t',(3.5+Math.random()*3)+'s');p.style.setProperty('--d',(Math.random()*4)+'s');p.style.setProperty('--x',((Math.random()-.5)*300)+'px');p.style.setProperty('--r',(Math.random()*1440-720)+'deg');p.style.width=(8+Math.random()*8)+'px';p.style.height=(12+Math.random()*10)+'px';c.append(p);}
  box.hidden=false;}
function render(){
  const d=data,fresh=d&&Date.now()-readAt<15000,want=!!(fresh&&d.active);
  if(debug){$('debug').hidden=false;$('debug').textContent=['Stage · '+(base||location.origin)+'/api/stage/overlay',lastErr?'✗ '+lastErr:'✓ Voyager answered '+(readAt?Math.round((Date.now()-readAt)/1000)+' s ago':''),d?'Active: '+d.active+' · phase '+d.phase+(d.forced?' · forced from Voyager Control':'')+(d.demo?' · demo':''):'',d?'Slots: '+JSON.stringify(d.slots)+' · stack '+(d.stack||[]).join(', ')+' · PiP '+d.pip:'',d?.cue?'Cue: '+d.cue.phase+' '+(d.cue.ok?'sent':'failed: '+d.cue.message)+' · '+new Date(d.cue.at).toLocaleTimeString():'Cue: none sent yet (name the scene and game source on the Dreadnought page)'].filter(Boolean).join('\n');}
  if(want&&!on){on=true;clearTimeout(offTimer);clearTimeout(splashTimer);stage.classList.remove('off');build(d);if(q.get('nomain')!=='1')$('dread').src=base+(d.main?.url||'/dreadnought.html?stage=1')+'&quality='+(['ultra','balanced','low'].includes(q.get('quality'))?q.get('quality'):'balanced')+(q.get('res')?'&res='+encodeURIComponent(q.get('res')):'');
    // Splash first (boarding, or a test showing), then the stage builds; mid-battle or report, straight in.
    const splash=d.splashOn?Number(d.splashMs)||0:0;stage.style.setProperty('--splash',Math.max(1.6,splash/1000)+'s');
    if(splash>0){stage.classList.remove('alert');void stage.offsetWidth;stage.classList.add('alert');splashTimer=setTimeout(()=>{if(on)stage.classList.add('on');},splash);}else stage.classList.add('on');}
  else if(!want&&on){on=false;clearTimeout(splashTimer);stage.classList.add('off');stage.classList.remove('alert');offTimer=setTimeout(()=>{stage.classList.remove('on','off');clear();},700);}
  else if(want&&on)build(d);
  if(on)mvp(d.celebrate||null);
}
async function poll(){try{const r=await fetch(base+'/api/stage/overlay',{cache:'no-store'});if(!r.ok)throw new Error('Voyager answered '+r.status+(r.status===404?' (update Voyager to 2.20.84 or later)':''));data=await r.json();readAt=Date.now();lastErr='';if(debug)window.__stage=data;
    if(data.version&&data.version!==BUILD&&q.get('v')!==data.version){const u=new URL(location.href);u.searchParams.set('v',data.version);location.replace(u.href);return;}}
  catch(e){lastErr=e.message&&e.message!=='Failed to fetch'?e.message:'Voyager is not reachable at '+(base||location.origin)+' (is Voyager running? add ?voyager=port if not on 8740)';}render();}
poll();setInterval(poll,1000);
})();
