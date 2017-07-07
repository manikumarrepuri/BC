angular.module('itheonApp').directive('addReminder', ['$rootScope', 'ScheduledReminderService', 'LaterService', function($rootScope, ScheduledReminderService, LaterService){
  return {
    scope: {},
    controllerAs: 'addReminderCtrl',
    controller: function($scope, $filter, $element) {
      var ctrl = this;

      //Form controls
      ctrl.addReminderForm = {};
      ctrl.addReminderForm.defaultState = "new";
      ctrl.addReminderForm.defaultAssignee = "admin";
      ctrl.addReminderForm.description = "";
      ctrl.addReminderForm.tags = [];
      ctrl.addReminderForm.type = "bau";
      ctrl.addReminderForm.schedule = "";
      ctrl.addReminderForm.reminder = "";
      ctrl.addReminderForm.actionBy = "";
      ctrl.addReminderForm.procedureLink = "http://";

      ctrl.errorMessage = '';

      ctrl.toggleReminder = function() {
        $element.find('.add-reminder-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addReminder = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add reminder, invalid form submission');
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

      $scope.$on('addReminderText', function($event, text){
        ctrl.addReminderForm.description = text;
      });

      ctrl.changeReminderText = function() {
        $rootScope.$broadcast('changeReminderText', ctrl.addReminderForm.description);
      };

      $scope.$on('saveReminder', function($event, fields) {
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
    templateUrl: '/static/js/components/addReminder/addReminder.html'
  };
}]);
