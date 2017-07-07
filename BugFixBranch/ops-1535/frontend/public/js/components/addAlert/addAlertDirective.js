angular.module('itheonApp').directive('addAlert', ['AlertService', function(AlertService){
  return {
    scope: {},
    controllerAs: 'addAlertCtrl',
    controller: function($element) {
      var ctrl = this;

      //Form controls
      ctrl.addAlertForm = {};
      ctrl.addAlertForm.alertname = '';
      ctrl.addAlertForm.email = '';
      ctrl.addAlertForm.password = '';
      ctrl.addAlertForm.confirm = '';
      ctrl.addAlertForm.title = '';
      ctrl.addAlertForm.role = '';
      ctrl.errorMessage = '';

      ctrl.toggleAlert = function() {
        $element.find('.add-alert-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addAlert = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add alert, invalid form submission');
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

        //Fix up alert object add required field
        fields['deviceId'] = fields['group'] + ':' + fields['name'];
        delete fields['group'];
        delete fields['name'];

        AlertService.save(fields).then(function(result){
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

      ctrl.loadAlert = function($event, alert, key) {

      };
    },
    templateUrl: '/static/js/components/addAlert/addAlert.html'
  };
}]);
