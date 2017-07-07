angular.module('itheonApp').directive('ruleUpdater', ['AgentRuleService', '_', 'socket', function(AgentRuleService, _, socket) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'ruleUpdaterCtrl',
    controller: function($rootScope, $scope, $element) {
      var ctrl = this;

      ctrl.rules = AgentRuleService.items;
      ctrl.options = AgentRuleService.options;
      ctrl.service = AgentRuleService;
      ctrl.totals = AgentRuleService.totals;
      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY @ HH:mm:ss'
      };

      ctrl.selected = [];

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Delete Agent Rules', function ($itemScope) {
          var selected = _.clone($scope.ruleUpdaterCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.rule);
          }
          $scope.ruleUpdaterCtrl.deleteAgentRules(selected);
        }]
      ];

      //Get latest data
      AgentRuleService.get(null, true).then(function(){
        console.log('Retrieved data from API');
      });

      ctrl.addAgentRule = function() {
        $element.find('.add-agent-rule-sidebar').toggleClass('module-sidebar-open');
      }

      //This seems really really wrong but it works for now
      ctrl.loadAgentRule = function($event, id) {
        $scope.$broadcast('loadAgentRule', id);
      };

      //Push notifications for agentRules
      socket.on('agentRuleUpdate', function(agentRuleUpdate) {
        AgentRuleService.updateAgentRules(agentRuleUpdate, $element);
      });

      ctrl.deleteAgentRule = function(agentRule) {
        AgentRuleService.deleteAgentRule(agentRule).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $scope.$broadcast('agentRulesUpdated', agentRule);
            $('.delete-success').addClass('hide');
          }, 2000);
        }, function(error){
          ctrl.errorMessage = error.data.message;
          //Failed to update thresholds
          $element.find('.delete-failed').removeClass('hide');
          setTimeout(function() {
            $('.delete-failed').addClass('hide');
          }, 2000);
        });
      }

      ctrl.deleteAgentRules = function(agentRules) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete these Agent Rules?",
          title: "Confirm Deletion of " + agentRules.length + " Agent Rules",
          buttonText: "Delete " + agentRules.length + " Agent Rules",
          action: 'deleteAgentRules',
          items: agentRules
        });
      }

      $scope.$on('deleteAgentRules', function($event, agentRules) {
        $event.stopPropagation();
        _.each(agentRules, function(agentRule){
          var index = _.findIndex(AgentRuleService.items, {
            id: agentRule.id
          });
          ctrl.deleteAgentRule(AgentRuleService.items[index]);
        })
      });
    },
    link: function(scope, element, attrs) {
    },
    templateUrl: '/static/js/components/ruleUpdater/ruleUpdater.html'
  }
}]);
