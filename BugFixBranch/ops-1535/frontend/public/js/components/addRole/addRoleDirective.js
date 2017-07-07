angular.module('itheonApp').directive('addRole', ['AclRoleService', function(AclRoleService){
  return {
    scope: {},
    controllerAs: 'addRoleCtrl',
    controller: function($element) {
      var ctrl = this;

      //Form controls
      ctrl.addRoleForm = {};
      ctrl.addRoleForm.name = '';
      ctrl.addRoleForm.description = '';
      ctrl.errorMessage = '';

      ctrl.toggleRole = function() {
        $element.find('.role-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addRole = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add role, invalid form submission');
          return false;
        }

        //get the values and only send what's been changed
        angular.forEach(form, function (control, key) {
          if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
            if(control.$dirty) {
              fields[key] = control.$modelValue;
            }
          }
        });

        if(!fields.id) {
          ctrl.errorMessage = "No role name provided.";
          //Failed to update thresholds
          $element.find('.update-failed').removeClass('hide');
          setTimeout(function() {
            $('.update-failed').addClass('hide');
          }, 2000);
          return;
        }

        if(!fields.description) {
          fields.description = 'A role can be assigned to mulitple users, to grant a set of permsissions.';
        }

        fields['status'] = 1;

        AclRoleService.create(fields).then(function(result){
          $element.find('.update-success').removeClass('hide');
          setTimeout(function() {
            $('.update-success').addClass('hide');
          }, 2000);
        }, function(error){
          ctrl.errorMessage = error.data.message;
          //Failed to update thresholds
          $element.find('.update-failed').removeClass('hide');
          setTimeout(function() {
            $('.update-failed').addClass('hide');
          }, 2000);
        });
      };
    },
    templateUrl: '/static/js/components/addRole/addRole.html'
  };
}]);
