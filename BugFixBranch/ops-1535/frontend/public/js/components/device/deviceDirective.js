
angular.module('itheonApp').directive('device', ['DeviceService', function(DeviceService) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'deviceCtrl',
    controller: function($element, $scope) {
      var ctrl = this;
      ctrl.thresholdsForm = {};
      ctrl.deviceStatus = '???';

      $scope.$on('loadDevice', function($event, data) {
        var device = data[0];
        var key = data[1];

        ctrl.oldDevice = (ctrl.device) ? ctrl.device : {};
        ctrl.device = device;
        ctrl.deviceStatus = DeviceService.items[key].status;

        ctrl.thresholdsForm.name = device.name;
        ctrl.thresholdsForm.location = device.location;

        $('table.table-devices > tbody > tr').removeClass("active");
        $($event.target).parent().addClass("active");

        //TODO: this isn't the best location for this.
        //If the device has rules use those otherwise grab the globalDevice rules
        var platformRules = _.filter(DeviceService.globalDevice, function(rule){
          return _.isEqual(rule.handleWhen.tags, ["system:platform:" + device.platform]) || rule.handleWhen.tags == undefined;
        });
        _.each(platformRules, function(rule) {
          rule.platform = device.platform;
        });

        ctrl.rules = (ctrl.device.rules && !_.isEmpty(ctrl.device.rules)) ? $.extend(true,  platformRules, ctrl.device.rules) : platformRules;

        ctrl.fixThresholds();

        //Check if the device has even changed and if it has if the panel is already open
        if(Object.keys(ctrl.oldDevice).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldDevice.name === ctrl.device.name && ctrl.oldDevice.group === ctrl.device.group))) {
           ctrl.toggleDevice();
        }

        $element.find('.form-hidden').addClass('hide');
      });

      ctrl.toggleDevice = function() {
        const mainPage = $('.main-page');
        const className = 'togglePane';

        $element.find('aside').toggleClass("module-sidebar-open");

        if (mainPage.hasClass(className)) {
          mainPage.removeClass(className);
        } else {
          mainPage.addClass(className);
        }

        $(window).resize();

      };

      ctrl.onThresholdChange = function() {
        $element.find('.form-hidden').removeClass('hide');
      };

      ctrl.fixThresholds = function() {
        var rules = ctrl.rules;
        ctrl.rules = [];

        for (var rule in rules) {
          var severities = [];
          for (var severity in rules[rule].thresholds) {
            var thresholds = [];
            for (var threshold in rules[rule].thresholds[severity]) {
              thresholds.push({
                "name": threshold,
                "value": rules[rule].thresholds[severity][threshold]
              });

              //Create form controls
              ctrl.thresholdsForm[rule + '-' + severity.replace(/[^0-9.]/g,'') + '-' + threshold] = parseInt(rules[rule].thresholds[severity][threshold], 10);
            }

            severities.push({
              "severity": severity.replace(/[^0-9.]/g, ''),
              "thresholds": thresholds
            });
          }

          rules[rule].thresholds = severities;
          ctrl.rules.push(rules[rule]);
        }
      };

      ctrl.alterThresholds = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(!form.$dirty) {
          return false;
        }

        //Check what's been changed and make sure the name and location haven't been fiddled with!
        angular.forEach(form, function (control, key) {
          if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
            if(key == 'name' && !control.$pristine) return false;
            if(key == 'location' && !control.$pristine) return false;

            if(key != 'thisDeviceOnly' && control.$dirty) {
              fields[key] = control.$modelValue;
            }
          }
        });

        if(form['thisDeviceOnly'].$modelValue) {
          //Add the name and location to the fields array
          fields['name'] = form['name'].$modelValue;
          fields['location'] = form['location'].$modelValue;
        }

        //Make the request to update the threshold!
        DeviceService.updateThreshold(fields).then(function(result) {
          if(result) {
            $element.find('.update-success').removeClass('hide');
            setTimeout(function() {
              $('.update-success').addClass('hide');
            }, 2000);
            return true;
          }

          //Failed to update thresholds
          $element.find('.update-failed').removeClass('hide');
          setTimeout(function() {
            $('.update-failed').addClass('hide');
          }, 2000);
        });
      }

      ctrl.showThresholds = function($event) {
        $($event.target).next().toggleClass("hide");
      }
    },
    templateUrl: '/static/js/components/device/device.html'
  };
}]);
