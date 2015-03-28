angular.module('starter.services', [])
.service('LocationService',function($q,$http){
  return({
    suggest : locationSuggestion
  });
  function locationSuggestion(str){
    var url = 'http://api.visitbritain.com/search?title='+str+'&target=gb';
    var request = $http.get(url);
      return( request.then( handleSuccess, handleError ) );
  }
  function handleError( response ) {
                    if (! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }


    function handleSuccess( response ) {
        return( response.data );
    }
});
