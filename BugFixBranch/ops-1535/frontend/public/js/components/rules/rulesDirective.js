
angular.module('itheonApp').directive('rules', ['RuleService', '_', 'socket', function(RuleService, _, socket) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'rulesCtrl',
    controller: function($scope) {
      var ctrl = this;

      ctrl.rules = RuleService.items;
      ctrl.totals = RuleService.totals;
      ctrl.options = RuleService.options;
      ctrl.service = RuleService;
      ctrl.loadingDone = false;

      //This seems really really wrong but it works for now
      ctrl.loadRule = function($event, ruleId) {
        var index = _.findKey(RuleService.items, function(rule) { return rule.id === ruleId; });
        $scope.$broadcast('loadRule', [RuleService.items[index], ruleId]);
      };

      //Get latest data
      RuleService.get({storage: "db"}, true).then(function() {
        console.log('Retrieved data from API');
      });

      //Push notifications for a rule
      socket.on('ruleUpdate', function(ruleUpdate) {

        var ruleId = ruleUpdate.new_val.id;
        var ruleIndex = _.findIndex(RuleService.items, function(rule) { return rule.id === ruleId; });

        $scope.$apply(function () {
          if (ruleIndex === -1) {
            RuleService.items[ruleIndex] = RuleService.items.unshift(agentRuleUpdate.new_val);
            RuleService.totals.active++;
            return;
          }

          RuleService.items[ruleIndex] = _.extend(RuleService.items[ruleIndex], ruleUpdate.new_val);
        });
      });
    },
    link: function(scope, element, attrs) {
      //Fix scrolling for smart-area control
      var parent = document.getElementsByTagName(element[0].nodeName)[0];

      parent.addEventListener('scroll', function (e) {
        if (e.target.className.indexOf('smart-area') !== -1) {
          $(e.target).closest('.sa-wrapper').find('.sa-fakeArea').scrollTop($(e.target).scrollTop());
        }
      }, true);
    },
    templateUrl: '/static/js/components/rules/rules.html'
  };
}]);
