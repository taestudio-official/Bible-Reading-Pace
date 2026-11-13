// 앱을 수정해서 다시 올릴 때 아래 버전 숫자를 1씩 올려주세요.
const CACHE="bible-pace-v58";
const SHELL=["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // 앱 파일: 네트워크 먼저(최신 버전), 실패하면 저장본
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
  }else if(u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com")){
    // 글꼴: 저장본 먼저
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})));
  }
});
