/* Cairo 3A — Service Worker بسيط لتفعيل تثبيت التطبيق (PWA)
   ضعه في نفس فولدر index.html في ريبو البرنامج */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ if(self.clients && self.clients.claim) self.clients.claim(); });
self.addEventListener('fetch', function(e){
  /* تمرير مباشر بدون تخزين — وجود المعالج كافٍ لمعايير التثبيت
     ولا يؤثر على تحديثات البيانات اللحظية */
});
