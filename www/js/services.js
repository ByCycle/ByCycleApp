angular.module('starter.services', [])
.service('LocationService',function($q,$http){
  $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;
  return({
    suggest : locationSuggestion,
    detail: locationDetail,
    destinations:destinations,
    bikeDirections: bikeDirections
  });
  function locationSuggestion(str){
    var url = 'http://api.visitbritain.com/search';
    var request = $http.get(url, {params: {title: str, target: 'gb'}});
      return( request.then( handleSuccess, handleError ) );
  }
  function locationDetail(id){
    var url = 'http://api.visitbritain.com/items/'+id+'?t=CEkyP6gIddWG&lang=en';
    var request = $http.get(url);
      return( request.then( handleSuccess, handleError ) );
  }
  function destinations(lat,lng,max,interest){
    var url = "http://bycycleapi.herokuapp.com/destinations";
    var request = $http.get(url, {params: {location: lat + "," + lng,
                                           maxDuration: max * 60,
                                           interest: interest}});
    return( request.then( handleSuccess, handleError ) );

  }
  function bikeDirections(lat,lng,id){
    var url = "http://bycycleapi.herokuapp.com/route/"+ lat+"," + lng + "/"+id;
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
