// imports
importScripts('js/sw-utils.js');

const STATIC_CACHE =    'static-v4';
const DYNAMIC_CACHE =   'dynamic-v3';
const INMUTABLE_CACHE = 'inmutable-v1';

// LO QUE UNO CREA Y MODIFICA
const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
]; 
// LO QUE NO SE MODIFICA 
const APP_SHELL_INMUTABLE =[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// instalacion
self.addEventListener('install', e => {
    //poner en cache
    const cacheStatic = caches.open( STATIC_CACHE).then( cache=>
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open( INMUTABLE_CACHE).then( cache=>
        cache.addAll(APP_SHELL_INMUTABLE));    


    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
});

// se ejecuta 'activate' cuando la instalacion termina
self.addEventListener('activate', e => {
    // borrar del cache versiones anteriores de static
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }
            if ( key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    })

    e.waitUntil( respuesta);
})

// solo cache
self.addEventListener('fetch', e =>{

    const respuesta = caches.match( e.request).then( res=> {
        if( res ){
            return res;
        } else {
            console.log( e.request.url );
            return fetch( e.request ).then( newRes =>{
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);
            })
        }
        console.log()
    });

    e.respondWith( respuesta );
});