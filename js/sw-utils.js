

// Función para actualizar el cache dinámico
function actualizaCacheDinamico( dynamicCache, request, response ) {

    if( response.ok ) {
        
        return caches.open( dynamicCache ).then( cache => {
            // cache.put(request, response) guarda en el Cache Storage una entrada que asocia una Request (o URL) con una Response. La próxima vez que hagas caches.match(request) devolverá esa Response.
            cache.put( request, response.clone() );
            return response.clone();
        });
    } else {
        return response;
    }

}
/*
Importante: Response es un stream consumible una sola vez. Si vas a devolver la misma Response al cliente y además guardarla, debes clonar la Response antes de ponerla en el cache (response.clone()). Si no, la Response que devuelves al cliente quedará vacía o el cache guardará una Response consumida.
*/












