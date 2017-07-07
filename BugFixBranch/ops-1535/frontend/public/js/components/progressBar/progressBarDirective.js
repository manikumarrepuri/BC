angular.module('itheonApp').directive('progressBar', function(){

  "use strict";

  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      value: '=',
    },
    controllerAs: 'progressBarCtrl',
    controller: function() {
      var ctrl = this;

      if (!ctrl.value) {
        ctrl.value = 0;
      }

      if (ctrl.value == 100.00) {
        ctrl.value = 100;
      }

      ctrl.valuePercent = (ctrl.value < 100) ? ctrl.value : 100;
    },
    link: function(scope, element, attrs) {
      //Ugly hack to watch if the value update's so the percent changes too
      scope.$watch('progressBarCtrl.value', function(newValue, oldValue) {
        if (newValue) {
          if(newValue == 100.00) scope.progressBarCtrl.value = 100;
          scope.progressBarCtrl.valuePercent = (newValue < 100) ? newValue : 100;
        }
      }, true);
    },
    templateUrl: '/static/js/components/progressBar/progressBar.html'
  };
});
