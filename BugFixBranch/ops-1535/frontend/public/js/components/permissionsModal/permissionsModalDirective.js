
angular.module('itheonApp').directive('permissionsModal', ['_', 'socket', '$uibModal', function(_, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'permissionsModalCtrl',
    controller: function($scope) {
      var ctrl = this;

      $scope.$on('permissionsModal', function($event, data, serviceName) {

        var uibModalInstance = $uibModal.open({
          templateUrl: '/static/js/components/permissionsModal/permissionsModal.html',
          size: 'lg',
          controller: [
            '$scope', '$injector', '$uibModalInstance', 'AclResourceService', 'AclRuleService', "_", 'roles', '$q', function($scope, $injector, $uibModalInstance, AclResourceService, AclRuleService, _, roles, $q) {
              $scope.editPermissionsForm = {};
              $scope.role = roles[0].id;
              $scope.resources = AclResourceService.items;

              AclResourceService.get({}, true).then(function(){
                console.log('Retrieved ACL Resources');
                angular.forEach($scope.resources, function(resource, key){
                  angular.forEach(resource.actions, function(action, key) {
                    if(!$scope.editPermissionsForm[resource.id]) $scope.editPermissionsForm[resource.id] = [];
                    $scope.editPermissionsForm[resource.id][action] = false;
                  });
                });

                AclRuleService.getByRole($scope.role).then(function(rules){
                  $scope.rules = rules;
                  angular.forEach(rules, function(rule, key){
                    $scope.editPermissionsForm[rule.resource][rule.action] = (rule.type == "allow") ? true : false;
                  });
                });
              });

              $scope.editPermissions = function(form) {
                var fields = {}, rule, nameParts = [], errors = [];

                //If the form hasn't been altered do nothing
                if(!form.$dirty) {
                  return false;
                }

                //Loop through the checkboxes and see what's changed
                angular.forEach(form, function (control, key) {
                  if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
                    if(control.$dirty) {
                      fields.role = $scope.role;

                      nameParts = key.split('-');
                      fields.resource = nameParts[0];
                      fields.action = nameParts[1];

                      rule = _.findWhere($scope.rules, fields);
                      if(rule) {
                        fields.id = rule.id;
                      }

                      fields["type"] = (control.$modelValue) ? "allow" : "deny";

                      //Make the request to save the changes
                      AclRuleService.save(fields).then(function(result) {
                        if(result) {
                          return true;
                        }

                        errors.push(fields);
                      });
                      fields = {};
                    }
                  }
                });

                //If there were no errors then all good
                if(!errors.length) {
                  $('#editPermissionsForm').find('.update-success').removeClass('hide');
                  setTimeout(function() {
                    $('.update-success').addClass('hide');
                    $uibModalInstance.dismiss('cancel');
                  }, 2000);
                  return;
                }

                //Failed to update thresholds
                $('#editPermissionsForm').find('.update-failed').removeClass('hide');
                setTimeout(function() {
                  $('.update-failed').addClass('hide');
                }, 2000);
              };

              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
            }],
          resolve: {
            roles: function () {
              return data.roles;
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
