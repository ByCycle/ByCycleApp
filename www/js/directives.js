angular.module('starter.directives', [])
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background': 'url(' + url +')',
            'background-size': '100% 100%',
            'height':'150px',
            '-webkit-filter':'blur(0.5px)',
            'filter':'blur(0.5px)'
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

