angular.module('itheonApp').directive('multiSelectBox', ['$injector', function($injector){
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
    controllerAs: 'multiSelectBoxCtrl',
    controller: function($element) {
      var ctrl = this;
      ctrl.items = [];

      if(!ctrl.conditions) {
        ctrl.conditions = {};
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
          itemsMapping[item.id] = item;
        });

        var currentItems = {};

        /*
        _.forEach(entityItems, function(entityItem) {
          entityItem[collectionVariableName] = entityItem[collectionVariableName] ? entityItem[collectionVariableName] : [];
          _.forEach(entityItem[collectionVariableName], function(currentSelectionItem) {
            var id = currentSelectionItem;
            if (angular.isObject(currentSelectionItem)) {
              id = currentSelectionItem.id;
            }

            currentItems[id] = itemsMapping[id];
          });
        });
*/
        ctrl.value = _.values(currentItems);
      });
    },
    templateUrl: '/static/js/components/multiSelectBox/multiSelectBox.html'
  };
}]);
