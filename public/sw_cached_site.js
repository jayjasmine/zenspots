const cacheName = 'zenspots_v2';


// Call install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
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

//Each time the a request is made, clone the response and store it in cache, load that cache when offline
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching')
  e.respondWith(
      fetch(e.request)
        .then(res => {
            // Make copy/clone of response
            const resClone = res.clone();
            // Open cache
            caches
            .open(cacheName)
            .then(cache => {
                // Add response to cache
                cache.put(e.request, resClone)
            });
            return res;
        //Load stored cache if offline
        }).catch(err => caches.match(e.request).then(res => res))
    )
})