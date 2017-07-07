angular.module('itheonApp').directive('appHeader', ['$rootScope','$window', '$timeout', function($rootScope, $window, $timeout) {
  return {
    controllerAs: 'headerCtrl',
    controller: function() {
      var ctrl = this;
      ctrl.date = new Date();
      ctrl.time = '00:00:00 am'

      ctrl.tick = function() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        ctrl.time = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
        $timeout(ctrl.tick, 1000);
      };

      $timeout(ctrl.tick, 1000);

      ctrl.logout = function($event) {
        $event.preventDefault = true;
        $($event.target).parent().parent().parent().click();
        $window.location.href = '/logout';
      }
    },
    link: function(scope, element, attrs) {
      scope.$watch('identity', function(newValue, oldValue) {
        if (newValue) {
          scope.headerCtrl.user = newValue;
        }
      });
    },
    templateUrl: '/static/js/components/header/header.html'
  }
}]);
