angular.module('itheonApp')
.directive('checkTextDate', checkTextDate)
.run(serverMock);

function checkTextDate(LaterService) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
      ngModel.$validators.invalidDateString = function(modelValue, viewValue) {
        console.log(modelValue, viewValue);
        let sched = LaterService.parse.text(modelValue);
        return sched.error != '-1';
      }
    }
  }
}
