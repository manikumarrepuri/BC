angular.module('itheonApp').directive('addTag', ['TagService', function(TagService){
  return {
    scope: {},
    controllerAs: 'addTagCtrl',
    controller: function($element) {
      var ctrl = this;

      //Form controls
      ctrl.addTagForm = {};
      ctrl.addTagForm.type = '';
      ctrl.addTagForm.value = '';
      ctrl.addTagForm.description = '';
      ctrl.addTagForm.color = '';
      ctrl.errorMessage = '';

      ctrl.toggleTag = function() {
        $element.find('.add-tag-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addTag = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add tag, invalid form submission');
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

        fields['group'] = 'user';
        fields['status'] = 1;

        TagService.save(fields).then(function(result){
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

      ctrl.loadTag = function($event, tag, key) {

      };
    },
    templateUrl: '/static/js/components/addTag/addTag.html'
  };
}]);
