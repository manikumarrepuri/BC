angular.module('itheonApp').directive('loading', [function() {
  return {
    controllerAs: 'loadingCtrl',
    controller: function($element) {
      var ctrl = this;
    },
    link: function(scope, element, attrs) {
      scope.$watch('loadingView', function(newValue, oldValue) {
        if (newValue != "undefined") {
          scope.loadingCtrl.loadingView = newValue;
        }
      });

      scope.$watch('route', function(newValue, oldValue) {
        if (newValue) {
          scope.loadingCtrl.route = newValue;
        }
      });
    },
    templateUrl: '/static/js/components/loading/loading.html'
  }
}]);
