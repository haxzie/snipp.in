/* eslint-disable no-console */

import { register } from 'register-service-worker'

const VERSION = process.env.COMMIT_REF;

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log('SERVICE WORKER',
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('SERVICE WORKER','Service worker has been registered.')
    },
    cached () {
      console.log('SERVICE WORKER','Content has been cached for offline use.')
    },
    updatefound () {
      console.log('SERVICE WORKER','New content is downloading.')
    },
    updated (registration) {
      console.log('SERVICE WORKER','New content is available; please refresh.');
      // clear the cache
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      )
      registration.unregister();
    },
    offline () {
      console.log('SERVICE WORKER','No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('SERVICE WORKER','Error during service worker registration:', error)
    }
  })
}
