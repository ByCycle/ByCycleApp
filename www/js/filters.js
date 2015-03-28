angular.module('starter.filters', [])
.filter('formatSecs', function() {
    return function(input) {
      if (input < 60)
        return input + ' seconds';
      if (input < 3600)
        return Math.floor(input / 60) + ' minutes ' + input % 60 + ' seconds';
      return Math.floor(input / 3600) + ' hours ' + Math.floor(input / 60) + ' minutes';
    };
})
