
angular.module('itheonApp').directive('alertList', ['$rootScope','AlertService', '_', function($rootScope, AlertService, _){

  "use strict";

  return {
    scope: {},
    controllerAs: 'alertListCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.parentCtrl = $element.controller('alerts');

      ctrl.alerts = AlertService.items;
      ctrl.totals = AlertService.totals;
      ctrl.options = AlertService.options;
      ctrl.service = AlertService;

      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY @ HH:mm:ss'
      };

      // Declare the array for the context menu
      ctrl.menuOptions = ctrl.parentCtrl.menuOptions;

      //This seems really really wrong but it works for now
      ctrl.requestAlert = function($event, id) {
        if(!id) return;
        $scope.$emit('requestAlert', [$event, AlertService.findIndex(id)]);
      };

      ctrl.requestHistory = function($event, alert) {
        $scope.$broadcast('loadAlertHistory', alert);
      };

      ctrl.assignToMe = function($event, id) {
        if(!id) return;
        AlertService.save({id: id, assignee: $rootScope.identity.username})
          .then(function(result) {
            return AlertService.createAssigned(id, $rootScope.identity.username);
          });
      };

      ctrl.acknowledge = function($event, id) {
        if(!id) return;

        AlertService.save({id: id, acknowledged: true})
          .then(function(result) {
            return AlertService.createAcknowledged(id);
          });
      };

      ctrl.loadMore = function($event,alert) {
        $scope.$emit('loadMoreAlerts', null);
      };
    },
    templateUrl: '/static/js/components/alertList/alertList.html'
  };
}]);
