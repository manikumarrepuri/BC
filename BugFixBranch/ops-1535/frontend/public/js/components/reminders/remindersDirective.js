
angular.module('itheonApp').directive('reminders', ['_', "ReminderService", "UserService", "FormSubmitter", "socket", function(_, ReminderService, UserService, FormSubmitter, socket) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'remindersCtrl',
    controller: function($scope, $element) {
      var ctrl = this;

      ctrl.displayType = 'day';
      ctrl.dateToday = new Date();
      ctrl.dateToday.setHours(0,0,0,0);
      ctrl.assignableResources = UserService.items;
      ctrl.reminders = ReminderService.items;
      ctrl.totals = ReminderService.totals;
      ctrl.options = ReminderService.options;
      ctrl.service = ReminderService;
      ctrl.display = 'calendar';
      ctrl.loadingDone = false;

      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Delete Reminders', function ($itemScope) {
          var selected = _.clone($scope.remindersCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.reminder.id);
          }
          $scope.remindersCtrl.deleteReminders(selected);
        }]
      ];

      ctrl.postNovo = function(id) {
        var url = 'http://bcfcapp01/novo/dosearch.asp?Lang=1';
        var method = 'POST';
        var params = {
          words: id
        };

        FormSubmitter.submit(url, method, params);
      }

      ctrl.getData = function() {
        ReminderService.get({conditions: { createdAt: {gt: ctrl.reminderStartDate, lt: ctrl.reminderEndDate}}, storage: "db"}, true).then(function() {
          console.log('Retrieved reminder data from API');
          ctrl.busy = false;
        });
      }

      ctrl.addReminder = function() {
        $element.find('.add-reminder-sidebar').toggleClass('module-sidebar-open');
      };

      ctrl.today = function() {
        ctrl.reminderStartDate = new Date();
        ctrl.reminderEndDate = new Date();
        ctrl.reminderStartDate.setHours(0,0,0,0);
        ctrl.reminderEndDate.setHours(23,59,59,999);
        ctrl.getData();
      }

      ctrl.plusOneDay = function() {
        ctrl.reminderStartDate = new Date(ctrl.reminderStartDate.getFullYear(), ctrl.reminderStartDate.getMonth(), ctrl.reminderStartDate.getDate() + 1);
        ctrl.reminderEndDate = new Date(ctrl.reminderEndDate.getFullYear(), ctrl.reminderEndDate.getMonth(), ctrl.reminderEndDate.getDate() + 1);
        ctrl.reminderStartDate.setHours(0,0,0,0);
        ctrl.reminderEndDate.setHours(23,59,59,999);
        ctrl.getData();
      }

      ctrl.minusOneDay = function() {
        ctrl.reminderStartDate = new Date(ctrl.reminderStartDate.getFullYear(), ctrl.reminderStartDate.getMonth(), ctrl.reminderStartDate.getDate() - 1);
        ctrl.reminderEndDate = new Date(ctrl.reminderEndDate.getFullYear(), ctrl.reminderEndDate.getMonth(), ctrl.reminderEndDate.getDate() - 1);
        ctrl.reminderStartDate.setHours(0,0,0,0);
        ctrl.reminderEndDate.setHours(23,59,59,999);
        ctrl.getData();
      }

      ctrl.today();

      var KanbanBoard = DlhSoft.Controls.KanbanBoard;
      // Prepare data.
      var state1 = { name: 'New', areNewItemButtonsHidden: true }, state2 = { name: 'In progress', areNewItemButtonsHidden: true }, state3 = { name: 'Done', isCollapsedByDefaultForGroups: true, areNewItemButtonsHidden: true };

      // Bind data to the user interface.
       ctrl.states = [state1, state2, state3];
       ctrl.groups = [{ name: 'Backups', state: state2 }, { name: 'Reports', state: state2 }, { name: 'BAU', state: state2 }];

       //Get latest data
       UserService.get().then(function(){
         console.log('Retrieved user data from API');
       });


       // Initialize a newly created item before adding it to the user interface.
       ctrl.initializeNewItem = function (item) {
         item.assignedResource = { username: 'admin'};
         console.log('A new item was created.');
       };

       // Allow item deletion by clicking a button in the user interface.
       ctrl.deleteItem = function (item) {
         ReminderService.deleteReminder(item).then(function(){
           console.log('Item ' + item.name + ' was deleted.');
         });
       };

       ctrl.onItemSelected = function (item) {
         var index = _.findIndex(ReminderService.items, {
           id: item.id
         });

         $scope.$broadcast('loadReminder', [ReminderService.items[index], item]);
       };

       ctrl.onItemAssignmentChanged = function (item) {
         ReminderService.update(item.id, {assignedResource: item.assignedResource}).then(function(){
           console.log('User ' + item.name + ' was changed to: ' + item.assignedResource.name);
         });
       };

       // Handle changes.
       ctrl.onItemStateChanged = function (item, newState, previousState) {
         if(newState.name !== previousState.name) {
           ReminderService.update(item.id, {state: newState}).then(function(){
             console.log('State of ' + item.name + ' was changed to: ' + newState.name);
           });
         }
       };

       ctrl.onItemGroupChanged = function (item, newGroup, previousGroup) {
         if(newGroup.name !== previousGroup.name) {
           ReminderService.update(item.id, {group: newGroup}).then(function(){
             console.log('Group of ' + item.name + ' was changed to: ' + newGroup.name);
           });
         }
      };

      ctrl.deleteReminder = function(reminder) {
        ReminderService.deleteReminder(reminder).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $scope.$broadcast('remindersUpdated', reminder);
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

      ctrl.deleteReminders = function(reminders) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete these Reminders?",
          title: "Confirm Deletion of " + reminders.length + " Reminders",
          buttonText: "Delete " + reminders.length + " Reminders",
          action: 'deleteReminders',
          items: reminders
        });
      }

      $scope.$on('confirmDeleteReminder', function($event, reminder) {
        $event.stopPropagation();
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete this Reminder?",
          title: "Confirm Reminder Deletion",
          buttonText: "Delete Reminder",
          action: 'deleteReminder',
          items: reminder
        });
      });

      $scope.$on('confirmDeleteReminders', function($event, reminders) {
        $event.stopPropagation();
        ctrl.deleteReminders(reminders);
      });

      $scope.$on('deleteReminder', function($event, reminder) {
        $event.stopPropagation();
        ctrl.deleteReminder(reminder);
      });

      $scope.$on('deleteReminders', function($event, reminders) {
        $event.stopPropagation();
        _.each(reminders, function(reminder){
          var index = _.findIndex(ReminderService.items, {
            id: reminder.id
          });
          ctrl.deleteReminder(ReminderService.items[index]);
        })
      });

      $scope.$on('requestReminder', function($event, data) {
        $event.stopPropagation();
        $scope.$broadcast('loadReminder', data);
      });

      //Load more data from the API
      $scope.$on('loadMoreReminders', function() {
        var last = ctrl.totals.active;
        if(_.isEmpty(ctrl.reminders) || !ctrl.loadingDone || last >= ctrl.totals.total) {
          return;
        }

        //We don't want to load this function again until the data is returned.
        ctrl.loadingDone = false;

        ReminderService.getMore({storage: "db", offset: last, limit: 5}).then(function() {
          console.log('Retrieved more data from API ' + last + '-' + (last + 5));
          ctrl.loadingDone = true;
        });
      });
    },
    link: function(scope, element, attrs) {

    },
    templateUrl: '/static/js/components/reminders/reminders.html'
  };
}]);
