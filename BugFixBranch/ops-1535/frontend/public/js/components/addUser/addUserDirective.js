angular.module('itheonApp').directive('addUser', ['_', 'UserService', function(_, UserService){
  return {
    scope: {},
    controllerAs: 'addUserCtrl',
    controller: function($element) {
      var ctrl = this;

      //Form controls
      ctrl.addUserForm = {};
      ctrl.addUserForm.username = '';
      ctrl.addUserForm.email = '';
      ctrl.addUserForm.password = '';
      ctrl.addUserForm.confirm = '';
      ctrl.addUserForm.title = '';
      ctrl.addUserForm.roles = '';
      ctrl.errorMessage = '';

      ctrl.toggleUser = function() {
        $element.find('.user-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addUser = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add user, invalid form submission');
          return false;
        }

        //get the values and only send what's been changed
        angular.forEach(form, function (control, key) {
          if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
            if(control.$dirty) {
              //Arrays are a bit different
              if(_.isArray(control.$modelValue)) {
                var tmp = [];
                _.each(control.$modelValue, function(role){
                  tmp.push(role.id);
                })
                fields[key] = tmp;
                return;
              }

              fields[key] = control.$modelValue;
            }
          }
        });

        fields['status'] = 1;

        UserService.save(fields).then(function(result){
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

      ctrl.loadUser = function($event, user, key) {

      };
    },
    templateUrl: '/static/js/components/addUser/addUser.html'
  };
}]);
