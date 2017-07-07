
angular.module('itheonApp').directive('stNumberRange', ['$timeout', function ($timeout) {
return {
    restrict: 'E',
    require: '^stTable',
    scope: {
        //'=' Two way data binding b/w directive and parent controller
        lower: '=',
        higher: '=',
        equal: '='
    },
    templateUrl: '/static/js/components/stNumberRange/stNumberRange.html',
    link: function (scope, element, attr, table) {
        var inputs = element.find('input');
        var inputLower = angular.element(inputs[0]);
        var inputHigher = angular.element(inputs[1]);
        var inputEqual = angular.element(inputs[2]);
        var predicateName = attr.predicate;

        [inputLower, inputHigher, inputEqual].forEach(function (input, index) {

            input.on('blur keyup change', function () {
                var query = {};
                if (scope.lower) {
                    query.lower = scope.lower;
                }

                if (scope.higher) {
                    query.higher = scope.higher;
                }

                if (scope.equal) {
                    query.equal = scope.equal;
                }

                scope.$apply(function () {
                    table.search(query, predicateName)
                });
            });
        });
    }
};
}]);
