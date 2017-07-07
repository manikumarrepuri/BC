
angular.module('itheonApp').directive('confirmModal', ['_', 'socket', '$uibModal', function(_, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'confirmModalCtrl',
    controller: function($scope) {
      var ctrl = this;

      $scope.$on('confirmModal', function($event, data) {
        var modalInstance = $uibModal.open({
          templateUrl: '/static/js/components/confirmModal/confirmModal.html',
          size: 'sm',
          controller: [
            '$scope', '$uibModalInstance', 'modal', function($scope, $modalInstance, modal) {
              $scope.modal = _.extend({
                message: "Are you sure you wish to delete this item?",
                title: "Confirm deletion",
                buttonText: "Ok"
              }, modal);
              $scope.modal.confirm = false;
              $scope.ok = function() {
                $scope.modal.confirm = true;
                $modalInstance.close($scope.modal);
              };
              $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
              };
            }
          ],
          resolve: {
            modal: function () {
              return data;
            }
          }
        });

        modalInstance.result.then(function (modal) {
          if(modal.confirm) {
            $scope.$emit(modal.action, modal.items);
          }
        }, function () {
        });
      });
    },
    link: function(scope, element, attrs) {

    }
  };
}]);
