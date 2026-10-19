const CACHE = 'lea-sigge-v2.0.1';
const FILES = ['./','./index.html','./manifest.webmanifest','./src/app.js','./src/art.js','./src/state.js','./src/world.js','./src/play-art.js','./src/play-views.js','./src/style.css','./assets/icon.svg','./assets/lea-sigge.webp'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lea-sigge-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin) return;
 event.respondWith(fetch(event.request).then(response=>{
 if(response.ok&&FILES.some(f=>new URL(f,self.registration.scope).href===event.request.url)){
 const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));
 }return response;
 }).catch(async()=>await caches.match(event.request)||new Response('Öppna spelet med internet en gång först.',{status:503})));
});
