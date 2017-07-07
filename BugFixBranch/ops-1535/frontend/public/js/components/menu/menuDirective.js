angular.module('itheonApp').directive('appMenu', ['$location', '$rootScope', '$route', 'SessionService', function(location, $rootScope, $route, SessionService) {
  return {
    controllerAs: 'menuCtrl',
    controller: function($element) {
      var ctrl = this;
      ctrl.routes = $route.routes;
      ctrl.user = SessionService.user;

      $($element).find('li').removeClass('active');
    },
    link: function(scope, element, attrs) {
      scope.$location = location;
      scope.$watch('$location.path()', function(locationPath) {
        $(element).find('li').removeClass('active');
        if(locationPath == '/') return;
        $(element).find('a[href^="/' + locationPath.split("/")[1] + '"]').parent().addClass('active');
      });
    },
    templateUrl: '/static/js/components/menu/menu.html'
  }
}]);
