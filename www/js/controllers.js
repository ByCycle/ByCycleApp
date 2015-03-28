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
      $scope.location.lon = position.coords.longitude
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
.controller('HomeCtrl',function($scope, $state) {
  $scope.$parent.navBarClass= "bar-clear";
  $scope.categories = [
    "Cities and Towns",
    "Countryside",
    "Culture",
    "Family Friendly",
    "Film and TV",
    "Food and Drink",
    "Landmarks",
    "Music",
    "Royal Britain",
    "Shopping",
    "Sport"
  ];
  $scope.duration = 120;
  $scope.durationMins = 0;
  $scope.durationHours = 2;
  $scope.slideDuration = function(duration) {
    $scope.duration = duration;
    $scope.durationMins = duration % 60;
    $scope.durationHours = Math.floor(duration / 60);
  }
  $scope.setCategory = function(category){
    $scope.category = category;
  }
  $scope.goToSearch = function(){
   $state.go('app.changeLocation');
  };
  $scope.goToDestination = function() {
    $state.go('app.browse', {lat: $scope.$parent.location.lat,
                             lon: $scope.$parent.location.lon,
                             category: $scope.category,
                             duration: $scope.duration});
  }
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
.controller('LocationDetailCtrl',function($scope,$ionicHistory,$stateParams,LocationService,$cordovaGeolocation){
  $scope.title = $stateParams.title;
  $scope.map = {center: {}, markers: {}};


  LocationService.detail($stateParams.id).then(function(locationDetail){
    $scope.detail = locationDetail;
    LocationService.bikeDirections(locationDetail.location.lat,locationDetail.location.lng,locationDetail.id)
    .then(function(direction){
      $scope.map.paths = {p1: {
                            color: 'red',
                            weight: 8,latlngs: [{ lat: 51.504435, lng: -0.1291664}, {lat: 51.5042996, lng: -0.1291992},{ lat: 51.5046362, lng: -0.1293118},{ lat: 51.5051764, lng: -0.1294966},{ lat: 51.505305, lng: -0.1296819},{ lat: 51.5057982, lng: -0.1306751},{ lat: 51.5058666, lng: -0.1308105}, { lat: 51.5058666, lng: -0.1308105},{ lat: 51.5057746, lng: -0.1310182},{ lat: 51.5057235, lng: -0.1311537},{ lat: 51.5056813, lng: -0.1312616}, { lat: 51.5056813, lng: -0.1312616},{ lat: 51.505533, lng: -0.1310394},{ lat: 51.5054849, lng: -0.1311154},{ lat: 51.5054062, lng: -0.1311661},{ lat: 51.5052828, lng: -0.1311508},{ lat: 51.5051423, lng: -0.1311264},{ lat: 51.5049304, lng: -0.1310938},{ lat: 51.5046366, lng: -0.1310723},{ lat: 51.5041932, lng: -0.1310129},{ lat: 51.50477, lng: -0.1304}]
                          ,message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
                        }};
      console.log(direction);
    },function(err){
      console.log(err);
    })
    console.log(locationDetail);
  },function(error){
    console.log(error);
  });

  angular.extend($scope.map, {
    defaults: {
      tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
    }
  });
  $cordovaGeolocation
         .getCurrentPosition()
         .then(function (position) {
           $scope.map.center.lat  = position.coords.latitude;
           $scope.map.center.lng = position.coords.longitude;
           $scope.map.center.zoom = 15;

           $scope.map.markers.now = {
             lat:position.coords.latitude,
             lng:position.coords.longitude,
             message: "You Are Here",
             focus: true,
             draggable: false
           };

         }, function(err) {
           // error
           console.log("Location error!");
           console.log(err);
         });

})
.controller('DestinationCtrl',function($scope,$ionicHistory,$stateParams,LocationService){
  LocationService.destinations($stateParams.lat,
                               $stateParams.lon,
                               $stateParams.duration,
                               $stateParams.category).then(function(data){
    $scope.destinations = data.destinations;
    console.log(data.destinations);
  },function(error){
    console.log(error);
  });
});
