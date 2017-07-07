angular.module('smart-table')
  .directive("stGetFilteredCollection", ['FilterService', function (FilterService) {
  return {
          restrict: 'EA',
          require: '^stTable',
          link: function(scope, element, attrs, ctrl) {
            return element.bind('click', function() {
              return scope.$apply(function() {
                var tableState;
                tableState = ctrl.tableState();
                tableState.search.predicateObject = FilterService.filterForOverviewPage;
                ctrl.pipe();
                FilterService.filteredOverviewData = ctrl.getFilteredCollection();
                tableState.search.predicateObject = {};
                FilterService.filterForOverviewPage = {};
                return;
              });
            });
        }
      };
  }]);