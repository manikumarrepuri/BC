
angular.module('itheonApp').directive('viewAlert', ['$rootScope', 'AlertService', 'DeviceService', 'UserService', 'moment', function($rootScope, AlertService, DeviceService, UserService, moment){

  "use strict";

  return {
    scope: {},
    controllerAs: 'alertCtrl',
    controller: function($element, $scope) {
      var ctrl = this;
      $scope.isNumber = angular.isNumber;
      ctrl.alert = {};
      ctrl.device = {};
      ctrl.assignment = {};
      ctrl.assignment.assignee = {};
      ctrl.thresholdsForm = {};
      ctrl.alertStatus = '???';
      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY HH:mm:ss'
      };

      ctrl.toggleAlert = function(removeClass) {
        const mainPage = $('.main-page');
        const className = 'togglePane';
        
        if (typeof removeClass == 'undefined') {
          removeClass = true;
        }

        if (removeClass) {
          $('table.table-alerts > tbody > tr').removeClass("active");
        }
        $element.find('.alert-sidebar').toggleClass("module-sidebar-open");

        if (mainPage.hasClass(className)) {
          mainPage.removeClass(className);
        } else {
          mainPage.addClass(className);
        }
        $(window).resize();
      };

      $scope.$on('loadAlert', function($event, data) {
        var alert = data[1];
        return ctrl.getAlertDetails(alert);
      });

      ctrl.getAlertDetails = function(alert) {
        // Retrieve host information
        DeviceService.getByName(alert.name, alert.group).then(function(result) {
          var device = {};

          // If we can't find it set the device to what we've got in the alert
          if (_.isArray(result) && result.length > 0) {
            device = result[0];
            device.alertsCount = _.size(device.alerts);
          }
          else {
            device.displayName = alert.name;
            device.group = alert.group;
            device.status = '???'; //We don't know about the device so how can we know it's status?
            device.alerts = {};
            device.alertsCount = 0;
            device.platform = "question";
            device.createdAt = alert.createdAt;
          }

          device.createdAt = new Date(device.createdAt);
          ctrl.device = device;
        });

        ctrl.oldAlert = (ctrl.alert) ? ctrl.alert : {};

        alert.firstOccurrence = moment.unix(alert.firstOccurrence / 1000);
        alert.lastOccurrence = moment.unix(alert.lastOccurrence / 1000);

        ctrl.alert = alert;
        ctrl.assignment.assignee.selected = null;

        if(alert.assignee) {
          UserService.getByName(alert.assignee).then(function(user) {
            ctrl.assignment.assignee.selected = user;
          });
        }

        // Retrieve event history
        AlertService.getHistoryCount(alert).then(function(result) {
          ctrl.alert.total = result.total;
          ctrl.alert.weekCount = result.weekCount;
          ctrl.alert.avgTimeToClose = result.avgTimeToClose;
        });

        // Check if the alert has even changed and if it has if the panel is already open
        if (Object.keys(ctrl.oldAlert).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldAlert._id === ctrl.alert._id))) {
           ctrl.toggleAlert(false);
        }

        $element.find('.form-hidden').addClass('hide');
      }

      ctrl.setAssignee = function(assignee) {
        if(!ctrl.alert._id) return;
        if(!assignee) {
          assignee = {};
          assignee.username = $rootScope.identity.username;
        }

        //Check that the user isn't already assigned
        var alert = AlertService.findIndex(ctrl.alert._id);
        if(alert.assignee == assignee.username) {
          return;
        }
        AlertService.save({_id: ctrl.alert._id, assignee: assignee.username})
          .then(function(result) {
            ctrl.alert.assignee = assignee.username;
            //Updating the dropdown.
            if(!ctrl.assignment.assignee.selected){
              ctrl.assignment.assignee.selected = $rootScope.identity;
            }
            return AlertService.createAssigned(ctrl.alert._id, assignee.username);
          });
      };

      ctrl.acknowledge = function(alert) {
        if(!alert._id) return;
        //Check that the alert isn't already acknowledged
        // var alert = AlertService.findIndex(ctrl.alert.id);
        if(alert.acknowledged) {
          return;
        }
        var dataTobeSaved = {_id: alert._id, acknowledged: true};
        //Updating the dropdown.
        if(!ctrl.assignment.assignee.selected){
          ctrl.assignment.assignee.selected = $rootScope.identity;
          dataTobeSaved = {_id: alert._id, acknowledged: true, assignee: $rootScope.identity.username};
        }
        AlertService.save(dataTobeSaved)
          .then(function(result) {
            ctrl.alert.acknowledged = true;
            var alertObj = AlertService.findIndex(ctrl.alert._id);
            if(alertObj.state === "C"){ctrl.toggleAlert();}
            return AlertService.createAcknowledged(ctrl.alert._id);
          });
      };
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch('alertCtrl.assignment.assignee', function(newValue, oldValue) {
        if (newValue && newValue.selected) {
          ctrl.setAssignee(newValue.selected);
        }
      }, true);
    },
    templateUrl: '/static/js/components/viewAlert/viewAlert.html'
  };
}]);
