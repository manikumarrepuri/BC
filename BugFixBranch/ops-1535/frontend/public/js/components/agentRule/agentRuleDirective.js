
angular.module('itheonApp').directive('agentRule', ['AgentRuleService', '$rootScope', '$uibModal', function(AgentRuleService, $rootScope, $uibModal, $log) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'agentRuleCtrl',
    controller: function($element, $scope) {
      var ctrl = this;

      ctrl.items = ['item1', 'item2', 'item3'];
      ctrl.rule = {};
      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY @ HH:mm:ss'
      };

      $scope.$on('loadAgentRule', function($event, id) {
        ctrl.config = AgentRuleService.config;
        ctrl.oldRule = (ctrl.rule) ? ctrl.rule : {};

        AgentRuleService.getById(id).then(function(rule) {
          ctrl.rule = rule;
          ctrl.versions = Object.keys(ctrl.rule.versions).reverse();

          //Create Form controls
          ctrl.newAgentRuleForm = {};
          var open = true;
          _.each(ctrl.versions, function(version) {
            ctrl.newAgentRuleForm['version' + version] = ctrl.rule.versions[version].details
            ctrl.rule.versions[version].editable = false;
            ctrl.rule.versions[version].open = open;
            open = false;
          });
        });

        $('table.table-ruleUpdater > tbody > tr').removeClass("active");
        $($event.target).parent().addClass("active");

        //Check if the agentRule has even changed and if it has if the panel is already open
        if(Object.keys(ctrl.oldRule).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldRule.name === ctrl.rule.name && ctrl.oldRule.group === ctrl.rule.group))) {
           ctrl.toggleAgentRule(false);
        }

        $element.find('.form-hidden').addClass('hide');
      });

      ctrl.addComment = function(version) {
        ctrl.rule.versions[version].editable = !ctrl.rule.versions[version].editable;

        if(!ctrl.rule.versions[version].commentAdded) {
          ctrl.newAgentRuleForm['version' + version] = "! @reason Please add a description\n" +
          "! @version {nextVersion}\n" +
          "! @author " + $rootScope.identity.username + "\n\n" +
          ctrl.newAgentRuleForm['version' + version];
          ctrl.rule.versions[version].commentAdded = true;
        }
      }

      ctrl.validateComment = function(content) {
        var foundAuthor= false, foundReason = false, foundVersion = false;
        var lines = content.split('\n');
        for(var i = 0; i < lines.length; i++){
          //If we've finsihed looking through the comments stop here.
          if(lines[i].indexOf('!') == -1) {
            break;
          }

          //Check for required fields
          if(lines[i].indexOf('@author') != -1) {
            foundAuthor = true;
          }

          if(lines[i].indexOf('@reason') != -1) {
            foundReason = true;
          }

          if(lines[i].indexOf('@version') != -1) {
            foundVersion = true;
          }

          if(foundReason && foundAuthor && foundVersion) {
            return true;
          }
        }

        return false;
      }

      ctrl.saveNewVersion = function(content, currentVersion) {
        //If the content hasn't been altered do nothing
        if(ctrl.rule.versions[ctrl.versions[0]].details == content) {
          console.warn('Failed to add new version, invalid form submission');
          return false;
        }

        if(!ctrl.validateComment(content)) {
          alert("Please add the reason for this change using @reason, @version and @author");
          return false;
        }

        var fields = _.clone(ctrl.rule);
        fields.content = content;
        delete fields.id;
        delete fields.version;
        delete fields.versions;
        delete fields.versionDisplay;

        ctrl.newAgentRuleForm['version' + currentVersion] = ctrl.rule.versions[currentVersion].details;

        AgentRuleService.save(fields).then(function(result){
          _.each(ctrl.versions, function(version) {
            ctrl.rule.versions[version]['open'] = false;
          });

          ctrl.newAgentRuleForm['version' + result.version] = result.content;

          ctrl.rule.versions[result.version] = {};
          ctrl.rule.versions[result.version]['details'] = result.content;
          ctrl.rule.versions[result.version]['versionDisplay'] = result.createdAt;
          ctrl.rule.versions[result.version]['open'] = true;
          ctrl.versions.unshift(result.version);

          $element.find('.update-success').removeClass('hide');
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

      ctrl.toggleAgentRule = function(removeClass) {
        const mainPage = $('.main-page');
        const className = 'togglePane';

        if(typeof removeClass == 'undefined') removeClass = true;

        if(removeClass) $('table.table-ruleUpdater > tbody > tr').removeClass("active");
        $element.find('aside').toggleClass("module-sidebar-open");
        if (mainPage.hasClass(className)) {
          mainPage.removeClass(className);
        } else {
          mainPage.addClass(className);
        }

        $(window).resize();
      };
    },
    link: function(scope, element, attrs) {
      //Scrolling and page/up-down are buggered so fix them
      var accordion = document.getElementsByTagName(element[0].nodeName)[0];

      accordion.addEventListener('scroll', function (e) {
        if (e.target.className.indexOf('smart-area') !== -1) {
          $(e.target).closest('.sa-wrapper').find('.sa-fakeArea').scrollTop($(e.target).scrollTop());
        }
      }, true);

      element.on('keydown', function(e) {
        switch (e.keyCode) {
          //Enter
          case 13:
            /*The plugin doesn't like you pressing return as the first character
            * so you can't do it, just don't!
            */
            var target = $(e.target);
            if(target.hasClass('smart-area') && target[0].selectionStart == 0) {
              e.stopPropagation();
              e.preventDefault();
            }
            break;
          // on page up
          case 33:
            $(e.target).scrollTop($(e.target).scrollTop()-50);
          // on page down
          case 34:
            if(e.keyCode == 34) {
              $(e.target).scrollTop($(e.target).scrollTop()+50);
            }
            e.stopPropagation();
            e.preventDefault();
            break;
          default:
              break;
          };
      });

    },
    templateUrl: '/static/js/components/agentRule/agentRule.html'
  };
}]);
