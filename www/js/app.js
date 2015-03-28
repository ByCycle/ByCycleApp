// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ion-google-place', 'leaflet-directive', 'starter.controllers', 'starter.directives', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller:'SearchCtrl'
      }
    }
  })
  .state('app.changeLocation', {
    url: "/changeHomeLocation",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller:'ChangeHomeLocationCtrl'
      }
    }
  })
  .state('app.browse', {
    url: "/browse/:lat/:lon/:category/:duration",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller:"DestinationCtrl"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })
   .state('app.geolocation', {
      url: "/geolocation",
      views: {
        'menuContent': {
          templateUrl: "templates/geolocation.html",
          controller: 'GeoCtrl'
        }
      }
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    }).state('app.locationdetail', {
      url: "/locationdetail/:id/:title",
      views: {
        'menuContent': {
          templateUrl: "templates/locationdetail.html",
          controller: 'LocationDetailCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
