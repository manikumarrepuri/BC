angular.module('itheonApp').directive('selectBox', ['$injector', '$rootScope', function($injector, $rootScope){
  return {
    scope: true,
    bindToController: {
      conditions: '@?',
      collectionVariableName: '@',
      serviceName: '@',
      ngModel: '@',
      value: '=ngModel'
    },
    require: 'ngModel',
    controllerAs: 'selectBoxCtrl',
    controller: function($element) {
      var ctrl = this;
      ctrl.items = [];

      if(!ctrl.conditions) {
        ctrl.conditions = {
          //2 - This option will fetch all the unique users from the db
          'whatToFetch':2
        };
      }
      //TODO: TRN: Warning divert your eyes the cowboys were in town, they were eaten by Godzilla and this filth was left behind
      ctrl.update = function(field) {
        var modelParts = ctrl.ngModel.split('.');
        if(field.$parent.$parent[modelParts[1]] && field.$parent.$parent[modelParts[1]][modelParts[2]]) {
          field.$parent.$parent[modelParts[1]][modelParts[2]].$setDirty();
        }
      };

      ctrl.service = $injector.get(ctrl.serviceName);     // example: device, user,

      ctrl.service.get({
        storage: "db",
        conditions: ctrl.conditions,
        limit: 100000
      }, false).then(function(response) {
        ctrl.busy = false;
        angular.copy(response.data, ctrl.items);

        var itemsMapping = {};
        _.forEach(ctrl.items, function(item) {
          itemsMapping[item._id] = item;
        });
      });
    },
    templateUrl: '/static/js/components/selectBox/selectBox.html'
  };
}]);
