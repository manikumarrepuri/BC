
angular.module('itheonApp').directive('viewRule', ['$filter', 'RuleService', 'moment', function($filter, RuleService, moment) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'ruleCtrl',
    controller: function($element, $scope) {
      var ctrl = this;
      $scope.isNumber = angular.isNumber;
      ctrl.editRuleForm = "";
      ctrl.config = {
        autocomplete: [{
          words: [/"(.*?)"(?::)/g],
          cssClass: 'highlight jsonProperty'
        },
        {
          words: [/{{(.*?)}}/g],
          cssClass: 'highlight hbValue'
        },
        {
          words: [/\s"(.*?)"(,|\r\n?|\n)/g],
          cssClass: 'highlight jsonValue'
        },
        {
          words: [/\strue|false(,|\r\n?|\n)/g],
          cssClass: 'highlight jsonBool'
        },
        {
          words: [/\s[0-9]*(,|\r\n?|\n)/g],
          cssClass: 'highlight jsonNumber'
        },
        {
          words: [/{/g,/}/g,/\[/g,/]/g],
          cssClass: 'highlight jsonObjArr'
        }],
        dropdown: []
      };
      ctrl.rule = {};
      ctrl.oldRule ={};

      ctrl.toggleRuleDetails = function(removeClass) {
        if (typeof removeClass == 'undefined') removeClass = true;

        if(removeClass) $('table.table-rules > tbody > tr').removeClass("active");
        $element.find('.rule-sidebar').toggleClass("module-sidebar-open");

        const mainPage = $('.main-page');
        const className = 'togglePane';

        if (mainPage.hasClass(className)) {
          mainPage.removeClass(className);
        } else {
          mainPage.addClass(className);
        }

        $(window).resize();
      };

      $scope.$on('loadRule', function($event, data) {
        var rule = data[0];
        var key = data[1];

        ctrl.oldRule = (ctrl.rule) ? ctrl.rule : {};
        ctrl.edit = false;

        //If the rule isn't defined we'll need to grab it
        if (!rule) {
          RuleService.getById(key).then(function(rule) {
            ctrl.rule = rule;
            ctrl.editRuleForm = angular.toJson(rule, true);
          });
        } else {
          ctrl.rule = rule;
          ctrl.editRuleForm = angular.toJson(rule, true);
        }

        if(Object.keys(ctrl.oldRule).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldRule.id === ctrl.rule.id))) {
           ctrl.toggleRuleDetails(false);
        }
      });

      ctrl.cancelEdit = function() {
        ctrl.edit = false;
        //Reset the input box
        ctrl.editRuleForm = angular.toJson(ctrl.rule, true);
      }

      ctrl.saveRule = function(rule) {

        //Attempt to parse the JSON (very basic validation)
        try {
          var fields = JSON.parse(rule);
        }
        catch(e) {
          alert('Error: ' + e);
        }

        RuleService.save(fields).then(function(result){
          $element.find('.update-success').removeClass('hide');
          ctrl.edit=false;
          ctrl.rule = fields;
          setTimeout(function() {
            $('.update-success').addClass('hide');
          }, 2000);
        }, function(error){
          ctrl.errorMessage = error.data.message;
          //Failed to update thresholds
          $element.find('.update-failed').removeClass('hide');
          setTimeout(function() {
            $('.update-failed').addClass('hide');
          }, 2000);
        });
      };
    },
    templateUrl: '/static/js/components/viewRule/viewRule.html'
  };
}]);
