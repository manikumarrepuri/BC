angular.module('itheonApp')
.directive('stPersist', ['$window','FilterService', function ($window, FilterService) {
return {
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {
                var nameSpace = attr.stPersist;
                scope.$watch(function () {
                    return ctrl.tableState();
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        localStorage.setItem(nameSpace, JSON.stringify(newValue));
                        FilterService.persistedFilterOnPageChange = newValue.search.predicateObject;
                    }
                }, true);
                //fetch the table state when the directive is loaded
                if (localStorage.getItem(nameSpace)) {
                    var savedState = JSON.parse(localStorage.getItem(nameSpace));
                    var tableState = ctrl.tableState();
                    angular.extend(tableState, savedState);
                    ctrl.pipe();
                    // FilterService.predicateForAlerts = savedState.search.predicateObject;
                    //savedState.search.predicateObject
                };

            }
        };
}]);
