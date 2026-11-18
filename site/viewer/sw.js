/* Voyager stream companion service worker: the page works offline and opens instantly.
   The page and its files are cached; the live feed always comes from the network first (the last copy is used offline). */
const CACHE='voyager-companion-v30';
const SHELL=['./','index.html','companion.js','card-template.js','brand/voyager.png','fair-draw.js','manifest.webmanifest','assets/voyager.png','assets/icon.png','assets/icon-192.png','assets/Rajdhani-600.ttf','assets/Rajdhani-700.ttf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url),data=/\/(feed|crew)\.json$/.test(url.pathname)||url.pathname.includes('/proofs/')||url.pathname.endsWith('/api/intel'); // network first, last copy offline
  if(data){const key=url.origin+url.pathname;e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(key,copy));}return r;}).catch(()=>caches.match(key).then(r=>r||Response.error())));return;}
  if(url.origin!==location.origin)return;
  // The member manual is large and can be updated: always fetch it from the network.
  if(url.pathname.endsWith('.pdf'))return;
  // Pages: network first so updates arrive; other files: cache first.
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('index.html',copy));return r;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{if(r.ok&&r.type==='basic'){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r;})));
});

// Notifications (2.23.0): the Voyager Worker pushes a small JSON message; show it, and open the companion when it is tapped.
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{};}catch{}
  const title=String(d.title||'Voyager').slice(0,80);
  e.waitUntil(self.registration.showNotification(title,{body:String(d.body||'').slice(0,200),icon:'assets/icon-192.png',badge:'assets/icon-192.png',tag:String(d.tag||'voyager'),renotify:true,data:{url:typeof d.url==='string'&&d.url.startsWith('./')?d.url:'./'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();const url=new URL(e.notification.data?.url||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if(c.url.startsWith(self.registration.scope)&&'focus' in c){c.navigate?.(url);return c.focus();}}return self.clients.openWindow(url);}));
});
