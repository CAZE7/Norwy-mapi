const CACHE='norwegen-flat-v4';
const SHELL=['./','index.html','app.css','leaflet.css','MarkerCluster.css','MarkerCluster.Default.css','leaflet.js','leaflet.markercluster.js','places-data.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin){
  if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put('index.html',r.clone()));return r}).catch(()=>caches.match('index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r})));return;
 }
 if(/tile\.openstreetmap|upload\.wikimedia|cloudinary/.test(u.hostname)){
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request,{mode:'no-cors'}).then(r=>{caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>hit)));
 }
});