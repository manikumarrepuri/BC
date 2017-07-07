
angular.module('itheonApp')
.directive('checkTextDate', checkTextDate);

function checkTextDate(LaterService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      ngModel.$validators.invalidDateString = function(modelValue, viewValue) {
        if(!modelValue || modelValue.$untouched) {
          return true;
        }

        let sched = LaterService.parse.text(viewValue);
        return sched.error == '-1';
      }
    }
  }
}
