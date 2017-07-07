
angular.module('itheonApp').directive('tagTable', ['TagService', '_', function(TagService, _){

  "use strict";

  return {
    scope: {},
    controllerAs: 'tagTableCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.parentCtrl = $element.controller('tags');

      ctrl.types = TagService.types;
      ctrl.tags = TagService.items;
      ctrl.totals = TagService.totals;
      ctrl.options = TagService.options;
      ctrl.service = TagService;

      // Declare the array for the context menu
      ctrl.selected = ctrl.parentCtrl.selected;
      ctrl.lastSelectedRow = ctrl.parentCtrl.lastSelectedRow;
      ctrl.menuOptions = ctrl.parentCtrl.menuOptions;

      //This seems really really wrong but it works for now
      ctrl.requestTag = function($event, tag) {
        $scope.$emit('requestTag', [TagService.items[tag], tag]);
      };

      ctrl.loadMore = function($event, tag) {
        $scope.$emit('loadMoreTags', null);
      };

    },
    templateUrl: '/static/js/components/tagTable/tagTable.html'
  };
}]);
