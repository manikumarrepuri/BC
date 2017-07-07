
angular.module('itheonApp').directive('devices', ['DeviceService', '_', 'socket', '$uibModal', function(DeviceService, _, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'devicesCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.query={};

      ctrl.devices = DeviceService.items;
      ctrl.totals = DeviceService.totals;
      ctrl.options = DeviceService.options;
      ctrl.service = DeviceService;
      ctrl.busy = true;
      ctrl.needRefresh = false;
      ctrl.isFilterVisible = false;
      ctrl.filterStatus = "Show";
      ctrl.numberOfPages = 100;
      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Tag Devices', function ($itemScope) {
          var selected = _.clone($scope.devicesCtrl.selected);
          if (selected.length === 0) {
            selected.push($itemScope.device);
          }

          $scope.$broadcast('editTagsModal', {selected: selected}, 'DeviceService');
        }],
        null, // Dividier
        ['Remove Devices', function ($itemScope) {
          var selected = _.clone($scope.devicesCtrl.selected);
          if (selected.length === 0) {
            selected.push($itemScope.device);
          }
          $scope.devicesCtrl.deleteDevices(selected);
        }]
      ];

      ctrl.filterVisibility = function() {
       if(ctrl.isFilterVisible){
          ctrl.isFilterVisible = false;
          ctrl.filterStatus = "Show";
       }else{
          ctrl.isFilterVisible = true;
          ctrl.filterStatus = "Hide";
       }
      }

      ctrl.newDevice = function() {
       console.log("deviceWizard.js")
       $scope.$broadcast('deviceWizard', {}, 'DeviceService');
      }

      //This seems really really wrong but it works for now
      ctrl.loadDevice = function($event, id) {
        var device = _.findIndex(DeviceService.items, {
          id: id
        });

        $scope.$broadcast('loadDevice', [DeviceService.items[device], device]);
      };

      ctrl.loadPage = function() {
        ctrl.busy = true;
        //Get latest data
        DeviceService.get({storage: "db"}, true).then(function() {
          console.log('Retrieved data from API');
          ctrl.busy = false;
        });

        //Mar-2017 Mani commenting this as global devices already fetched in the above step.
        // DeviceService.getGlobalDevice({storage: "db"});
        ctrl.needRefresh = false;
      };

      ctrl.loadPage();

      //Subscribe to devices
      socket.on('connect', function(){
        socket.emit('devicesSubscribe', {id: socket.id});
      });

      //Load more data from the API
      ctrl.loadMore = function() {

        var last = ctrl.totals.active;
        if (_.isEmpty(ctrl.devices) || ctrl.busy || last >= ctrl.totals.total) {
          return true;
        }

        //We don't want to load this function again until the data is returned.
        ctrl.busy = true;

        DeviceService.getMore({storage: "db", offset: last, limit: 50}).then(function() {
          ctrl.busy = false;
        });
      };

      //Push notifications for a device
      socket.on('deviceUpdate', function(deviceUpdate) {

        var deviceId = deviceUpdate.new_val.id;
        var allDeviceKey = _.findIndex(DeviceService.all, {
          id: deviceId
        });

        if (allDeviceKey === -1 && deviceUpdate.new_val && deviceUpdate.new_val.status !== -1) {
          console.warn("deviceUpdate all - Unable to find device.");
          ctrl.needRefresh = true;
          return;
        }

        if (deviceUpdate.new_val && deviceUpdate.new_val.status === -1) {
          return;
        }

        var itemsDeviceKey = _.findIndex(DeviceService.items, {
          id: deviceId
        });

        $scope.$apply(function () {
          DeviceService.all[allDeviceKey].updatedAt = new Date();
          DeviceService.checkStatus('all');

          if (itemsDeviceKey === -1) {
            console.warn("deviceUpdate screen - Unable to find device to update.");
            return;
          }

          let device = deviceUpdate.new_val;


//tanny
          // //Patch devices code from FrontAPI Device service
          // device.alertsCount = _.size(device.alerts);

          // // Check if the device has a custom name
          // if (!device.displayName) {
          //   device.displayName = device.name;
          // }

          // // Fix device group
          // if (device.group && device.group.indexOf(':') !== -1) {
          //   let groupArr = device.group.split(':');
          //   //If the last element of the array is the computer name delete it
          //   if (groupArr[groupArr.length - 1] == device.name) {
          //     delete groupArr[groupArr.length - 1];
          //   }
          //   device.group = groupArr.join(' ');
          // }

          // //Set date object's for device
          // device.createdAt = new Date(device.createdAt);
          // device.updatedAt = new Date(device.updatedAt);

          // DeviceService.items[itemsDeviceKey] = _.extend(DeviceService.items[itemsDeviceKey], device);

          // //Refresh device status
          // DeviceService.items[itemsDeviceKey].updatedAt = new Date();
          // DeviceService.checkStatus('items');
        });
      });

      ctrl.deleteDevice = function(device) {
        DeviceService.deleteDevice(device, $element).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $scope.$broadcast('deviceUpdated', device);
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

      ctrl.deleteDevices = function(devices) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete these Devices?",
          title: "Confirm Deletion of " + devices.length + " Devices",
          buttonText: "Delete " + devices.length + " Devices",
          action: 'deleteDevices',
          items: devices
        });
      }

      // $scope.$on('deleteDevices', function($event, devices) {
      //   $event.stopPropagation();
      //   _.each(devices, function(device){
      //     var index = _.findIndex(DeviceService.items, {
      //       id: device.id
      //     });
      //     ctrl.deleteDevice(DeviceService.items[index]);
      //   })
      // });

    },
    link: function(scope, element, attrs) {

    },
    templateUrl: '/static/js/components/devices/devices.html'
  };
}]);
