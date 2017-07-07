angular.module('itheonApp').directive('editReminder', ['$rootScope', 'ScheduledReminderService', 'LaterService', function($rootScope, ScheduledReminderService, LaterService){
  return {
    scope: {},
    controllerAs: 'editReminderCtrl',
    controller: function($scope, $filter, $element) {
      var ctrl = this;

      //Form controls
      ctrl.editReminderForm = {};
      ctrl.errorMessage = '';

      ctrl.toggleEditReminder = function() {
        $element.find('.edit-reminder-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.editReminder = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to edit reminder, invalid form submission');
          return false;
        }

        //We must have a schedule
        if(!form['schedule'].$modelValue) {
          console.warn('Error no schedule provided.');
          return false;
        }

        //And it must be valid
        let sched = LaterService.parse.text(form['schedule'].$modelValue);
        if(sched.error != '-1') {
          console.warn('Error in schedule at position: ' + sched.error);
          return false;
        }

        //get the values and only send what's been changed
        angular.forEach(form, function (control, key) {
          if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {

            //Arrays are a bit different
            if(_.isArray(control.$modelValue)) {
              var tmp = [];
              _.each(control.$modelValue, function(tag){
                tmp.push(tag.group + ":" + tag.type + ":" + tag.value);
              })
              fields[key] = tmp;
              return;
            }

            fields[key] = control.$modelValue;
          }
        });

        fields['status'] = 1;

        //Workout the next occurence
        let occurrence = later.schedule(sched).next(1);
        fields['nextOccurrence'] = occurrence;

        //Check with the user that they are happy
        $scope.$broadcast('confirmModal', {
          message: "The first occurence of this reminder will be:\n\n" + $filter('date')(occurrence, 'MMM d, y @ h:mm:ss a') + ", is this what you expect?",
          title: "Confirm Reminder",
          buttonText: "Confirm Reminder",
          action: 'saveReminder',
          items: fields
        });

        return false;
      };

      $scope.$on('editReminder', function($event, data) {
        var reminder = data[0];
        var key = data[1];

        ctrl.oldReminder = (ctrl.editReminderForm) ? ctrl.editReminderForm : {};

        //If the reminder isn't defined we'll need to grab it
        if (!reminder) {
          ScheduledReminderService.getById(key).then(function(reminder) {
            ctrl.editReminderForm = reminder;
          });
        } else {
          ctrl.editReminderForm = reminder;
        }

        if(Object.keys(ctrl.oldReminder).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldReminder.id === ctrl.editReminderForm.id))) {
           ctrl.toggleEditReminder(false);
        }
      });

      $scope.$on('updateReminder', function($event, fields) {
        $event.stopPropagation();

        ScheduledReminderService.save(fields).then(function(result){
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
      });
    },
    templateUrl: '/static/js/components/editReminder/editReminder.html'
  };
}]);
