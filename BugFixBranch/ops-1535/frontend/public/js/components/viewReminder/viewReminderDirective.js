angular.module('itheonApp').directive('viewReminder', ['ScheduledReminderService', "FormSubmitter", 'moment', function(ScheduledReminderService, FormSubmitter, moment) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'reminderCtrl',
    controller: function($element, $scope) {
      var ctrl = this;
      $scope.isNumber = angular.isNumber;
      ctrl.reminder = {};

      ctrl.postNovo = function(id) {
        var url = 'http://bcfcapp01/novo/dosearch.asp?Lang=1';
        var method = 'POST';
        var params = {
          words: id
        };

        FormSubmitter.submit(url, method, params);
      }

      ctrl.toggleReminderDetails = function(removeClass) {
        if (typeof removeClass == 'undefined') removeClass = true;

        if(removeClass) $('table.table-reminders > tbody > tr').removeClass("active");
        $element.find('.view-reminder-sidebar').toggleClass("module-sidebar-open");
      };

      $scope.$on('loadReminder', function($event, data) {
        var reminder = data[0];
        var key = data[1];

        ctrl.oldReminder = (ctrl.reminder) ? ctrl.reminder : {};

        //If the reminder isn't defined we'll need to grab it
        if (!reminder) {
          ScheduledReminderService.getById(key).then(function(reminder) {
            ctrl.reminder = reminder;
          });
        } else {
          ctrl.reminder = reminder;
        }

        if(Object.keys(ctrl.oldReminder).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldReminder.id === ctrl.reminder.id))) {
           ctrl.toggleReminderDetails(false);
        }
      });
    },
    templateUrl: '/static/js/components/viewReminder/viewReminder.html'
  };
}]);
