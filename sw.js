/* Cairo 3A — Service Worker (PWA)
   شبكة-أولاً لملفات الموقع مع رجوع للكاش عند انقطاع النت،
   وتجاهل طلبات Supabase/Telegram (تروح للشبكة دائماً).
   ضعه في نفس فولدر index.html */
var CACHE = 'c3a-v2';
var CORE = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE).catch(function(){}); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = req.url;
  // طلبات قاعدة البيانات والإشعارات لازم تروح للشبكة دائماً
  if(url.indexOf('supabase.co') > -1 || url.indexOf('/rest/') > -1 ||
     url.indexOf('/auth/') > -1 || url.indexOf('api.telegram') > -1) return;

  e.respondWith(
    fetch(req).then(function(res){
      if(res && res.status === 200 && url.indexOf(self.location.origin) === 0){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(m){ return m || caches.match('./index.html'); });
    })
  );
});
