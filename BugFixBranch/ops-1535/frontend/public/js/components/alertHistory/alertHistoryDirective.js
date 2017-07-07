
angular.module('itheonApp').directive('alertHistory', ['AlertService', '_', function(AlertService, _){

  "use strict";

  return {
    scope: {
      alertHistoryActive: '='
    },
    controllerAs: 'alertHistoryCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.history = {};
      ctrl.visible = false;

      ctrl.toggleVisibility = function($event) {
        $event.stopPropagation();
        ctrl.visible = !ctrl.visible;
      };

      ctrl.requestAlert = function($event,alert) {
        $scope.$emit('requestAlert', [AlertService.items[alert], alert]);
      };

      $scope.$on('loadAlertHistory', function($event, alert) {
        if($scope.alertHistoryActive._id != alert) {
          return;
        }

        //Toggle visibility
        if(ctrl.visible) {
          ctrl.visible = false;
          return;
        }

        //Retrieve event history
        AlertService.getHistory($scope.alertHistoryActive).then(function(result){
          ctrl.history = result.history;
          ctrl.visible = true;
        });
      });
    },
    templateUrl: '/static/js/components/alertHistory/alertHistory.html'
  };
}]);
