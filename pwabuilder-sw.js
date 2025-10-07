// اسم الكاش الخاص بالتطبيق
const CACHE_NAME = 'baghdadi-mandoub-cache-v1';

// الملفات التي سيتم تخزينها للعمل بدون إنترنت
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log('✅ Service Worker Installed');
});

// تفعيل Service Worker وحذف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🧹 حذف الكاش القديم:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// جلب الملفات من الكاش عند عدم توفر الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match('./index.html')
        )
      );
    })
  );
});
