angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $cordovaGeolocation) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.location = {};
  $scope.location.title = 'unknown';

  $cordovaGeolocation
    .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
    .then(function (position) {
      $scope.location.lat  = position.coords.latitude
      $scope.location.long = position.coords.longitude
      $http.get('http://nominatim.openstreetmap.org/reverse',
                {params: {format: 'json',
                          lat: position.coords.latitude,
                          lon: position.coords.longitude}})
        .success(function(data, status) {
          $scope.location.title = [data.address.road, data.address.city].join(', ');
        });
      console.log('location detected:', position);
    }, function(err) {
      // FIXME: handle case when user denies geolocation or can't be located
    });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('GeoCtrl', function($scope, $cordovaGeolocation) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.lat  = position.coords.latitude
      $scope.long = position.coords.longitude
      console.log(position);
    }, function(err) {
      // error
    });


  var watchOptions = {
    frequency : 1000,
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      console.log(position);
      var lat  = position.coords.latitude
      var long = position.coords.longitude
  });


  watch.clearWatch();
  // OR
  /*$cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
      // success
      }, function (error) {
      // error
    });*/
})
.controller('HomeCtrl',function($scope,$location){
  $scope.$parent.navBarClass= "bar-clear";
  $scope.durations = [
  {value: '15min', displayName: '15min'},
  {value: '30min', displayName: '30min'},
  {value: '45min', displayName: '45min'}]
  $scope.selectedDuration = $scope.durations[1];
  $scope.goToSearch = function(){
   $location.path('/app/changeHomeLocation');
  };
})
.controller('SearchCtrl',function($scope,$ionicHistory,LocationService,$state){
  $scope.goBack = function goBack() {
    $ionicHistory.goBack();
  };
  $scope.suggest = {};
  $scope.suggest.locations = [];
  $scope.suggestLocation = function(){
      $scope.suggest.locations = [];
      if($scope.suggest.location.length < 2) return;
      LocationService.suggest($scope.suggest.location).then(function(artists){
        $scope.suggest.locations = artists;
      },function(error){
        console.log(error);
      });
  }
  $scope.setLocation = function(location){
    $state.go('app.locationdetail', {id: location.id, title: location.title});
    //$scope.$parent.location = location;
  };
})
.controller('ChangeHomeLocationCtrl',function($scope,$ionicHistory,LocationService){
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  $scope.suggest = {};
  $scope.suggest.locations = [];
  $scope.suggestLocation = function(){
      $scope.suggest.locations = [];
      if($scope.suggest.location.length < 2) return;
      LocationService.suggest($scope.suggest.location).then(function(locations){
        $scope.suggest.locations = locations;
      },function(error){
        console.log(error);
      });
  }
  $scope.setLocation = function(location){
    console.log(location);
    $scope.$parent.location = location;
    $ionicHistory.goBack();
  };
})
.controller('LocationDetailCtrl',function($scope,$ionicHistory,$stateParams,LocationService){
  $scope.title = $stateParams.title;
  LocationService.detail($stateParams.id).then(function(locationDetail){
    $scope.detail = locationDetail;
    console.log(locationDetail);
  },function(error){
    console.log(error);
  });
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background': 'url(' + url +')',
            'background-size': '100% 100%'
        });
    };
})
.directive( 'goToPath', function ( $location ) {
  return function ( scope, element, attrs ) {
    var path;

    attrs.$observe( 'goToPath', function (val) {
      path = val;
    });

    element.bind( 'click', function () {
      scope.$apply( function () {
        console.log(path);
        $location.path( path );
      });
    });
  };
});
