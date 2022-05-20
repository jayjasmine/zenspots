const cacheName = 'zenspots';

const cacheAssets = [
  '/',
  '/assets/logo-64.png',
  '/assets/logo-small-color.png',
  '/assets/spash-screen.png',
  '/css/bootstrap.min.css',
  '/css/home.css',
  '/js/bootstrap.bundle.min.js',
  '/js/main.js',
  '/js/pwa.js',
  '/js/pwa.webmanifest',
  '/js/toggleTheme.js',
  '/js/validateForms.js',
  '/js/adminActions.js',
  '/login.ejs',
  '/logout.ejs',
  '/zenspots.ejs',
  '/settings.ejs',
  '/logout.ejs',
  '/admin.ejs'
];


// Call install event
self.addEventListener('install', (event) => {
  // console.log('Service Worker: Installed');

  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files')
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  )
});

// Call activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  event.waitUntil(
    //loop through caches and if current cache isnt the current, delete
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache =>{
          if(cache !== cacheName){
            console.log('Service Worker: Clearing Old Cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching')
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
})