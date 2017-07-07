angular.module('itheonApp').directive('alerts', ['$rootScope','AlertService','FilterService', '_', 'socket', '$q', '$timeout','$route', function($rootScope, AlertService, FilterService, _, socket, $q, $timeout, $route){

  "use strict";

  return {
    scope: {},
    controllerAs: 'alertsCtrl',
    controller: function ($scope, $element) {
      var ctrl = this;
      ctrl.query={};
      ctrl.filterAttributes={};
      ctrl.filterAttributes.isShared = false;
      ctrl.modal = {};
      ctrl.loadingDone = false;
      ctrl.alerts = AlertService.items;
      ctrl.totals = AlertService.totals;
      ctrl.options = AlertService.options;
      ctrl.service = AlertService;
      ctrl.display = 'list';
      ctrl.isFilterVisible = false;
      ctrl.filterStatus = "Show";
      ctrl.numberOfPages = 100;
      ctrl.busy = true;
      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;
      ctrl.calendarFormatWithTime = {
        sameElse: 'DD/MM/YYYY HH:mm:ss'
      };
      ctrl.calendarFormat = {
        sameElse: 'DD/MM/YYYY'
      };
      ctrl.filterVisibility = function () {
        if (ctrl.isFilterVisible) {
          ctrl.isFilterVisible = false;
          ctrl.filterStatus = "Show";
        } else {
          ctrl.isFilterVisible = true;
          ctrl.filterStatus = "Hide";
        }
      }

      ctrl.saveFilter = function(filterData) {
        if(!filterData.filterAttributes.filterName)
        {
          $timeout(function() {
              ctrl.modal.title = "Save Filter";
              ctrl.modal.message = "Please fill in filter name.";
              document.getElementById('modalButton').click();
          });
        }else{
          FilterService.saveFilter(filterData.query,filterData.filterAttributes)
            .then(function(result) {
              $timeout(function() {
                  ctrl.modal.title = "Save Filter";
                  ctrl.modal.message = "Saved successfully!";
                  document.getElementById('modalButton').click();
              });
          });
        }
      };

      ctrl.clearFilterAttributes = function() {
        ctrl.filterAttributes.isShared = false;
        ctrl.filterAttributes.filterName = "";
        ctrl.filterAttributes.filterId = undefined;
      }

      ctrl.clearFilter = function() {
        FilterService.predicateForAlerts = {};
        $timeout(function() {
            document.getElementById('clearFiltersButton').click();
            $scope.$broadcast('clearAlertFilter');        
        });
        ctrl.clearFilterAttributes();  
      };
      
      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Acknowledge Alerts', function ($itemScope) {
          var promises = [];
          var items = [];
          // _.forEach($itemScope.$parent.alert, function(item) {
          var alertIndex = _.findIndex(ctrl.alerts, {
            _id: $itemScope.$parent.alert._id
          });
          var alertItem = {
            _id: $itemScope.$parent.alert._id,
            acknowledged: true
          };
          if (!ctrl.alerts[alertIndex].assignee) {
            ctrl.alerts[alertIndex].assignee = $rootScope.identity.username;
            alertItem.assignee = $rootScope.identity.username;
          }
          items.push(alertItem._id);
          promises.push(AlertService.save(alertItem));
          // });

          $q.all(promises).then(function (result) {
            _.forEach(items, function (itemId) {
              var itemIndex = _.findIndex(ctrl.alerts, {
                _id: itemId
              });
              // if alert is still on the list (it was removed if it's closed + acknowledged)
              if (ctrl.alerts[itemIndex]) {
                ctrl.alerts[itemIndex].acknowledged = true;
              }
            });
          }, function (error) {
            console.warn("Failed to acknowledge alerts.");
          });
        }]
      ];

      ctrl.addAlert = function ($event, alert) {
        $element.find('.add-alert-sidebar').toggleClass('module-sidebar-open');
      };

     //Bubble the event up the chain
      ctrl.requestAlert = function($event, id) {
        //Check the original event and stop bubbling if we're using a dropdown
        var className = $event.target.className;
        if (className.indexOf("dropdown") !== -1 || className.indexOf("caret") !== -1) {
          return false;
        }
        var alert = _.findIndex(ctrl.alerts, {
          _id: id
        });
        $scope.$broadcast('loadAlert', [$event, ctrl.alerts[alert]]);
      };

      //Bubble the event up the chain
      ctrl.requestHistory = function ($event, alert) {
        $event.stopPropagation();
        $scope.$broadcast('loadAlertHistory', alert);
      };

      ctrl.assignToMe = function ($event, id) {
        if (!id) return;
        var alertKey = _.findIndex(ctrl.alerts, {
          _id: id
        });
        var loggedInUserName = $rootScope.identity.username;
        if (ctrl.alerts[alertKey].assignee == loggedInUserName) {
          return;
        }
        AlertService.save({
            _id: id,
            assignee: loggedInUserName
          })
          .then(function (result) {
            //Update avatar to the current user
            ctrl.alerts[alertKey].assignee = $rootScope.identity.username;
            return AlertService.createAssigned(id, $rootScope.identity.username);
          });
      };

      ctrl.acknowledge = function ($event, id) {
        if (!id) return;
        var alertKey = _.findIndex(ctrl.alerts, {
          _id: id
        });
        ctrl.alerts[alertKey].acknowledged = true;
        var dataTobeSaved = {
          _id: id,
          acknowledged: true
        };
        if (!ctrl.alerts[alertKey].assignee) {
          ctrl.alerts[alertKey].assignee = $rootScope.identity.username;
          dataTobeSaved = {
            _id: id,
            acknowledged: true,
            assignee: $rootScope.identity.username
          };
        }
        AlertService.save(dataTobeSaved)
          .then(function (result) {
            return AlertService.createAcknowledged(id);
        });
      };

      ctrl.filterAttribueChanged = function(){
        FilterService.filterForAlerts.isShared = ctrl.filterAttributes.isShared;
        FilterService.filterForAlerts.filterName = ctrl.filterAttributes.filterName;
      };

      ctrl.showAlertTable = function(){
        ctrl.busy = false;
        ctrl.display = 'table';
      };

      ctrl.loadFiltersObject = function(data){
        ctrl.filterAttributes.isShared = JSON.parse(data.isShared);
        ctrl.filterAttributes.filterName = data.filterName;
        ctrl.filterAttributes.filterId = data._id;
      };
      ctrl.loadPage = function () {
        ctrl.busy = true;
        
        //Check if the page is redirected from Dashboard page, take the filters and load the alerts page with the selected filter
        if(FilterService.isFromOverview){
          FilterService.isFromOverview = false;
          //We already have the alerts data in the AlertService, hence no need to have a db call
          console.log('Redirected from dashboard page with filter selection');
          ctrl.loadFiltersObject(FilterService.filterForAlerts);
          FilterService.predicateForAlerts = FilterService.applyFilters(FilterService.filterForAlerts.filterCondition);
          $timeout(function() {
            document.getElementById('applyFiltersButton').click();
            $scope.$broadcast('applyAlertFilter', ["This param is ignored", FilterService.predicateForAlerts]);
          });
          ctrl.showAlertTable();
        } else { 
          //Get latest data
          AlertService.get({
            storage: "db"
          }, true).then(function () {
            console.log('Retrieved data from API');
            // $timeout(function() {
            //   $scope.$broadcast('applyAlertFilter', ["This param is ignored", FilterService.persistedFilterOnPageChange]);
            // });
            ctrl.showAlertTable();
          });
        }
      };
      ctrl.loadPage();

      ctrl.loadMore = function ($event, alert) {
        var last = ctrl.totals.active;
        if (_.isEmpty(ctrl.alerts) || !ctrl.busy || last >= ctrl.totals.total) return true;

        //We don't want to load this function again until the data is returned.
        ctrl.busy = true;

        AlertService.getMore({
          storage: "db",
          offset: last,
          limit: 5
        }).then(function () {
          ctrl.busy = false;
          console.log('Retrieved more data from API ' + last + '-' + (last + 5));
        });
      };

      

      socket.on('alertUpdate', function (alertUpdate) {
        let item = JSON.parse(alertUpdate);
        switch (item.operation) {
        case "create":
          ctrl.alerts.unshift(item.payload);
          ctrl.totals.total = ctrl.alerts.length;
          break;
        default:
          break;
        }
      });

    },
    link: function (scope, element, attrs) {},
    templateUrl: '/static/js/components/alerts/alerts.html'
  };
}]);
