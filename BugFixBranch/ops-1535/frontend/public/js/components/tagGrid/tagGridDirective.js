
angular.module('itheonApp').directive('tagGrid', ['TagService', '_', function(TagService, _){

  "use strict";

  return {
    scope: {},
    controllerAs: 'tagGridCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      var parentCtrl = $element.controller('tags');

      ctrl.types = TagService.types;
      ctrl.tags = TagService.items;
      ctrl.tagGroups = TagService.tagGroups;
      ctrl.totals = TagService.totals;
      ctrl.options = TagService.options;
      ctrl.service = TagService;
      ctrl.busy = true;

      // Fire 'resize.js' calculations
      $(window).resize();

      //Add collapsable toggle
      _.each(ctrl.tagGroups, function(group){
        group.isCollapsed = false;
      });

      // Declare the array for the context menu
      ctrl.menuOptions = parentCtrl.menuOptions;

      //This seems really really wrong but it works for now
      ctrl.requestTag = function($event, id) {
        var tag = _.findIndex(TagService.items, {
          id: id
        });

        $scope.$emit('requestTag', [TagService.items[tag], tag]);
      };

      ctrl.confirmDeleteTag = function($event, id) {
        $event.stopPropagation();
        var tag = _.findIndex(TagService.items, {
          id: id
        });

        $scope.$emit('confirmDeleteTag', TagService.items[tag]);
      };

      ctrl.confirmDeleteTags = function($event, tags) {
        $scope.$emit('confirmDeleteTags', tags);
      };

      ctrl.loadMore = function($event, tag) {
        $scope.$emit('loadMoreTags', null);
      };

    },
    templateUrl: '/static/js/components/tagGrid/tagGrid.html'
  };
}]);
