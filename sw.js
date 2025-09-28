// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/', // Se debe cachear también el 8080 "/" http://localhost:8080/ o dará error.
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/wolverine.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/hulk.jpg',
    '/js/app.js',
    '/js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];


self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE ).then( cache => {
        return cache.addAll( APP_SHELL );
    });

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache => {
        return cache.addAll( APP_SHELL_INMUTABLE );
    });

    // Esperamos a que se resuelvan ambas promesas
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]) );

});

// Limpiar cache viejo
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
        });
    });
    // Esperamos a que se resuelva la promesa
    e.waitUntil( respuesta );
});

// Estrategia: Cache with Network Fallback
self.addEventListener('fetch', e => {

    // 2 - Cache with Network Fallback - Primero busca en cache y si no lo encuentra va a la web
    const respuesta = caches.match( e.request ).then( res => {
        if ( res ) {
            return res; // Si lo encuentra en cache, responde con eso
        } else {
            
            return fetch( e.request ).then( newRes => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            });
        
        }   
    })

    e.respondWith( respuesta );
});