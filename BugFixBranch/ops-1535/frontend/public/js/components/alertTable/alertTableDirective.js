
angular.module('itheonApp').directive('alertTable', ['$rootScope','AlertService', '_', function($rootScope, AlertService, _){

  "use strict";

  return {
    scope: {},
    controllerAs: 'alertTableCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.parentCtrl = $element.controller('alerts');
      ctrl.query={};
      ctrl.alerts = AlertService.items;
      ctrl.totals = AlertService.totals;
      ctrl.options = AlertService.options;
      ctrl.service = AlertService;
      ctrl.isFilterVisible = ctrl.parentCtrl.isFilterVisible;
      ctrl.filterStatus = ctrl.parentCtrl.filterStatus;
      ctrl.numberOfPages = ctrl.parentCtrl.numberOfPages;
      ctrl.isFixedWidth = false;
      ctrl.calendarFormatWithTime = {
        sameElse: 'DD/MM/YYYY HH:mm:ss'
      };
      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY'
      };

      // Declare the array for the context menu
      ctrl.menuOptions = ctrl.parentCtrl.menuOptions;
      
      //This seems really really wrong but it works for now
      ctrl.requestAlert = function($event, id) {
        ctrl.isFixedWidth = true;
        var alert = _.findIndex(AlertService.items, {
          _id: id
        });

        $scope.$emit('requestAlert', [$event, AlertService.items[alert]]);
      };
      ctrl.requestHistory = function($event, alert) {
        $scope.$broadcast('loadAlertHistory', alert);
      };

      ctrl.assignToMe = function($event, id) {
        if(!id) return;
        AlertService.save({_id: id, assignee: $rootScope.identity.username})
          .then(function(result) {
            return AlertService.createAssigned(id, $rootScope.identity.username);
          });
      };

      ctrl.acknowledge = function($event, id) {
        if(!id) return;

        AlertService.save({_id: id, acknowledged: true})
          .then(function(result) {
            return AlertService.createAcknowledged(id);
          });
      };
      ctrl.loadMore = function($event,alert) {
        $scope.$emit('loadMoreAlerts', null);
      };

      $scope.$on('isFilter', function($broadcastEvent, data) {
        ctrl.isFilterVisible = data[0];
        ctrl.filterStatus = data[1];
      });
      $scope.$on('isNumberOfPageChanged', function($broadcastEvent, data) {
        ctrl.numberOfPages = data;
      });
      $scope.$watch(function() {
        return $rootScope.isFixedWidth;
      }, function() {
        ctrl.isFixedWidth = $rootScope.isFixedWidth;
      });
    },   
    templateUrl: '/static/js/components/alertTable/alertTable.html'
  };
}]);
