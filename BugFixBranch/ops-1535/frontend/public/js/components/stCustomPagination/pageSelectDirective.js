angular.module('itheonApp')
    .directive('pageSelect', ['$timeout', function ($timeout) {
      return {
        restrict: 'E',
        template: '<input type="text" style="width:50px; text-align:center;" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        }
      }
    }]);