
angular.module('itheonApp').directive('{{module}}', ['{{Module}}Service', function({{Module}}Service) {

  "use strict";

  return {
    scope: {},
    controllerAs: '{{module}}Ctrl',
    controller: function($element, $scope) {
      var ctrl = this;

      ctrl.{{module}}s = {{Module}}Service.items;
      ctrl.totals = {{Module}}Service.totals;
      ctrl.options = {{Module}}Service.options;
      ctrl.service = {{Module}}Service;
      ctrl.loadingDone = false;

      //Get latest data
      {{Module}}Service.get({storage: "db"}, true).then(function() {
        console.log('Retrieved data from API');
      });

      //Push notifications for a {{module}}
      socket.on('{{module}}Update', function({{module}}Update) {
        var {{module}}Id = {{module}}Update.new_val.id;
        var {{module}}Index = _.findIndex({{Module}}Service.items, function({{module}}) { return {{module}}.id === {{module}}Id; });

        $scope.$apply(function () {
          if ({{module}}Index === -1) {
            {{Module}}Service.items[{{module}}Index] = {{Module}}Service.items.unshift(agent{{Module}}Update.new_val);
            {{Module}}Service.totals.active++;
            return;
          }

          {{Module}}Service.items[{{module}}Index] = _.extend({{Module}}Service.items[{{module}}Index], {{module}}Update.new_val);
          });
        });
    },
    templateUrl: '/static/js/components/{{module}}/{{module}}.html'
  };
}]);
