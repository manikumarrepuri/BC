angular.module('itheonApp').directive('stAcknowledge', ['$timeout', function ($timeout) {
return {
        restrict: 'E',
        scope: {
            predicate: '@'
        },
        require: '^stTable',
        templateUrl: '/static/js/components/stAcknowledge/stAcknowledge.html',
        link: function (scope, element, attr, ctrl) {
            scope.dropDownItems = ['All','Yes','No'];
            scope.selectedOption = scope.dropDownItems[0];
            scope.optionChanged = function(selectedOption) {
                scope.$parent.$parent.alertsCtrl.query.selectedOption=selectedOption;
                var isAcknowledged;
                if (selectedOption === 'Yes') {
                    isAcknowledged = 'true';
                }else if (selectedOption === 'No') {
                    isAcknowledged = '!true';
                }else{
                    isAcknowledged = '';
                }
                ctrl.search(isAcknowledged, scope.predicate);
            };
            scope.optionChanged(scope.selectedOption);
            scope.$on('clearAlertFilter', function() {
                scope.selectedOption = scope.dropDownItems[0];
            });
            scope.$on('applyAlertFilter', function(event, data) {
                if(data[1].acknowledged){
                    scope.selectedOption = (data[1].acknowledged.toString().toLowerCase() == "true"?"Yes":"No")
                }
            });
        }
    }
}]);