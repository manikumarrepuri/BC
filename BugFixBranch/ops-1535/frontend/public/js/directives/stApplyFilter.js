angular.module('smart-table')
  .directive("stApplyFilter", ['$rootScope','$window','$route','FilterService', function ($rootScope, $window, $route, FilterService) {
  return {
          restrict: 'EA',
          require: '^stTable',
          link: function(scope, element, attrs, ctrl) {
            return element.bind('click', function() {
              return scope.$apply(function() {
                var tableState;
                tableState = ctrl.tableState();
                tableState.search.predicateObject = FilterService.predicateForAlerts;
                tableState.pagination.start = 0;
                ctrl.pipe();
                // $rootScope.filteredAlertData = ctrl.getFilteredCollection();
                // FilterService.predicateForAlerts = {};
              });
            });
        }
      };
  }]);