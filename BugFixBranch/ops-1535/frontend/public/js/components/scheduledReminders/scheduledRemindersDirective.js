
angular.module('itheonApp').directive('scheduledReminders', ['_', 'moment', "$rootScope", "ScheduledReminderService", "UserService", "FormSubmitter", "socket", function(_, moment, $rootScope, ScheduledReminderService, UserService, FormSubmitter, socket) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'scheduledRemindersCtrl',
    controller: function($scope, $element) {
      var ctrl = this;

      ctrl.assignableResources = UserService.items;
      ctrl.reminders = ScheduledReminderService.items;
      ctrl.totals = ScheduledReminderService.totals;
      ctrl.options = ScheduledReminderService.options;
      ctrl.description = "";
      ctrl.service = ScheduledReminderService;
      ctrl.loadingDone = false;

      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Delete Reminders', function ($itemScope) {
          var selected = _.clone($scope.scheduledRemindersCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.reminder.id);
          }
          $scope.scheduledRemindersCtrl.deleteScheduledReminders(selected);
        }]
      ];

      ScheduledReminderService.get({storage: "db"}, true).then(function() {
        console.log('Retrieved data from API');
        ctrl.busy = false;
      });

      ctrl.addReminder = function() {
        $('.add-reminder-sidebar').addClass('module-sidebar-open');
      };

      //This seems really really wrong but it works for now
      ctrl.editReminder = function($event, id) {
        var reminder = _.findIndex(ScheduledReminderService.items, {
          id: id
        });

        $rootScope.$broadcast('editReminder', [ScheduledReminderService.items[reminder], reminder]);
      };


      ctrl.reminderText = function() {
        $rootScope.$broadcast('addReminderText', ctrl.description);
      };

      $scope.$on('changeReminderText', function($event, text){
        ctrl.description = text;
      });

       //Get latest data
       UserService.get().then(function(){
         console.log('Retrieved data from API');
       });

      ctrl.deleteScheduledReminder = function(reminder) {
        ScheduledReminderService.deleteScheduledReminder(reminder).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $scope.$broadcast('scheduledRemindersUpdated', reminder);
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

      ctrl.deleteScheduledReminders = function(reminders) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete these Scheduled Reminders?",
          title: "Confirm Deletion of " + reminders.length + " Scheduled Reminders",
          buttonText: "Delete " + reminders.length + " Scheduled Reminders",
          action: 'deleteScheduledReminders',
          items: reminders
        });
      }

      $scope.$on('confirmDeleteScheduledReminder', function($event, reminder) {
        $event.stopPropagation();
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete this Scheduled Reminder?",
          title: "Confirm Scheduled Reminder Deletion",
          buttonText: "Delete Scheduled Reminder",
          action: 'deleteScheduledReminder',
          items: reminder
        });
      });

      $scope.$on('confirmDeleteScheduledReminders', function($event, reminders) {
        $event.stopPropagation();
        ctrl.deleteScheduledReminders(reminders);
      });

      $scope.$on('deleteScheduledReminders', function($event, reminder) {
        $event.stopPropagation();
        ctrl.deleteScheduledReminder(reminder);
      });

      $scope.$on('deleteScheduledReminders', function($event, reminders) {
        $event.stopPropagation();
        _.each(reminders, function(reminder){
          var index = _.findIndex(ScheduledReminderService.items, {
            id: reminder.id
          });
          ctrl.deleteScheduledReminder(ScheduledReminderService.items[index]);
        })
      });

      $scope.$on('requestScheduledReminder', function($event, data) {
        $event.stopPropagation();
        $scope.$broadcast('loadScheduledReminder', data);
      });

      //Load more data from the API
      $scope.$on('loadMoreScheduledReminders', function() {
        var last = ctrl.totals.active;
        if(_.isEmpty(ctrl.reminders) || !ctrl.loadingDone || last >= ctrl.totals.total) {
          return;
        }

        //We don't want to load this function again until the data is returned.
        ctrl.loadingDone = false;

        ScheduledReminderService.getMore({storage: "db", offset: last, limit: 5}).then(function() {
          console.log('Retrieved more data from API ' + last + '-' + (last + 5));
          ctrl.loadingDone = true;
        });
      });
    },
    link: function(scope, element, attrs) {

    },
    templateUrl: '/static/js/components/scheduledReminders/scheduledReminders.html'
  };
}]);
