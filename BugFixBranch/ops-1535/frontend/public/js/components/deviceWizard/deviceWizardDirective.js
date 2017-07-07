
angular.module('itheonApp').directive('deviceWizard', ['_', 'socket', '$uibModal', function(_, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'deviceWizardCtrl',
    controller: function($scope) {

      var ctrl = this;

      $scope.$on('deviceWizard', function($event, data, serviceName) {

        var uibModalInstance = $uibModal.open({
          templateUrl: '/static/js/components/deviceWizard/deviceWizard.html',
          size: 'lg',
          controller: [
            '$scope', '$injector', '$uibModalInstance', 'TagService', 'items', 'serviceName', '$q', function($scope, $injector, $uibModalInstance, TagService, items, serviceName, $q) {
              var Service = $injector.get(serviceName);

              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
          }],
          resolve: {
            items: function () {
              return data.selected;
            },
            serviceName: function() {
              return serviceName;
            }
          }
        });

        uibModalInstance.result.then(function (tags) {
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
            // $log.info('Modal dismissed at: ' + new Date());
          });
      });
    }
  };
}]);
