
angular.module('itheonApp').directive('appConditionBuilder', ['AlertService', '$compile', function(AlertService, $compile) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'conditionCtrl',
    bindToController: {
      service: '=',
    },
    controller: function($scope, $filter) {
      var ctrl = this;
      var service = ctrl.service;
      var operators = {
        'integer': ["equal", "not_equal", "greater", "greater_or_equal", "less", "less_or_equal"],
        'string': ["contains", "regex", "like", "equal", "not_equal"],
        'boolean': ["equal", "not_equal"]
      }
      ctrl.filters = [];
      ctrl.ready = false;

      service.getFields().then(function(schema){
        _.forEach(schema, function(property, key) {
          if(key == 'id' || _.indexOf(['integer', 'number', 'string', 'boolean'], property.type) === -1) {
            return;
          }

          if(property.type == "number") {
            property.type = "integer";
          }

          ctrl.filters.push({
            "id": key,
            "label": $filter('camelCaseToHuman')(key, true),
            "type": property.type,
            "operators": operators[property.type]
          });
        });

        ctrl.ready = true;
      });

      ctrl.search = function() {
        var query = {};
        query.conditions = $('.conditionBuilder').queryBuilder('getItheon');
        ctrl.service.search(query);
      }

    },
    link: function(scope, element, attrs) {
      scope.$watch('conditionCtrl.ready', function(newValue, oldValue) {
        if (newValue) {
          $('.conditionBuilder').css('margin-top', $('.actions-bar.is-page-top').css('height'));
          $('.conditionBuilder').queryBuilder({
            "plugins": ['bt-tooltip-errors'],
            "filters": scope.conditionCtrl.filters
          });

          if(Object.keys(scope.conditionCtrl.service.options.conditions).length !== 0) {
            $('.conditionBuilder').queryBuilder('setRulesFromItheon', scope.conditionCtrl.service.options.conditions);
          }

          var strElm = '<button type="button" ng-click="conditionCtrl.search()" class="btn btn-primary btn-search pull-right">Search</button>';
          var compiledHtml = $compile(angular.element(strElm))(scope);
          element.find('.conditionBuilder').append(compiledHtml);
        }
      }, true);
    },
    templateUrl: '/static/js/components/conditionBuilder/conditionBuilder.html'
  };
}]);
