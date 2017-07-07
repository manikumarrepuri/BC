angular.module('itheonApp')
.directive('stRatio', ['$window', function ($window) {
  return {
          link:function(scope, element, attr){
            var ratio=+(attr.stRatio);
            element.css('width',ratio+'%');
          }
        };
}]);
