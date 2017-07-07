
angular.module('itheonApp').directive('tags', ['TagService', '_', 'socket', function(TagService, _, socket) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'tagsCtrl',
    controller: function($scope, $element) {
      var ctrl = this;

      ctrl.types = TagService.types;
      ctrl.tags = TagService.items;
      ctrl.totals = TagService.totals;
      ctrl.options = TagService.options;
      ctrl.service = TagService;
      ctrl.loadingDone = false;
      ctrl.display = 'grid';

      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Delete Tags', function ($itemScope) {
          var selected = _.clone($scope.tagsCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.tag.id);
          }
          $scope.tagsCtrl.deleteTags(selected);
        }]
      ];

      ctrl.addTag = function($event, tag) {
        $element.find('.add-tag-sidebar').toggleClass('module-sidebar-open');
      };

      ctrl.deleteTag = function(tag) {
        TagService.deleteTag(tag).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $scope.$broadcast('tagsUpdated', tag);
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

      ctrl.deleteTags = function(tags) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete these Tags?",
          title: "Confirm Deletion of " + tags.length + " Tags",
          buttonText: "Delete " + tags.length + " Tags",
          action: 'deleteTags',
          items: tags
        });
      }

      //Get latest data
      TagService.getTypes({storage: "db"}, true).then(function() {
        TagService.get({storage: "db"}, true).then(function() {
          ctrl.loadingDone = true;
        });
      });

      $scope.$on('confirmDeleteTag', function($event, tag) {
        $event.stopPropagation();
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete this Tag?",
          title: "Confirm Tag Deletion",
          buttonText: "Delete Tag",
          action: 'deleteTag',
          items: tag
        });
      });

      $scope.$on('confirmDeleteTags', function($event, tags) {
        $event.stopPropagation();
        ctrl.deleteTags(tags);
      });

      $scope.$on('deleteTag', function($event, tag) {
        $event.stopPropagation();
        ctrl.deleteTag(tag);
      });

      $scope.$on('deleteTags', function($event, tags) {
        $event.stopPropagation();
        _.each(tags, function(tag){
          var index = _.findIndex(TagService.items, {
            id: tag.id
          });
          ctrl.deleteTag(TagService.items[index]);
        })
      });

      $scope.$on('requestTag', function($event, data) {
        $event.stopPropagation();
        $scope.$broadcast('loadTag', data);
      });

      //Load more data from the API
      $scope.$on('loadMoreTags', function() {
        var last = ctrl.totals.active;
        if(_.isEmpty(ctrl.tags) || !ctrl.loadingDone || last >= ctrl.totals.total) {
          return;
        }

        //We don't want to load this function again until the data is returned.
        ctrl.loadingDone = false;

        TagService.getMore({storage: "db", offset: last, limit: 5}).then(function() {
          console.log('Retrieved more data from API ' + last + '-' + (last + 5));
          ctrl.loadingDone = true;
        });
      });

      //Push notifications for a tag
      socket.on('tagUpdate', function(tagUpdate) {
        var tagId = tagUpdate.new_val.id;
        var itemsTagKey = _.findKey(TagService.items, function(tag) {
          return tag.id === tagId;
        });

        if (!itemsTagKey) {
          console.warn("tagUpdate - Unable to find tag.");
          return;
        }

        $scope.$apply(function () {
          TagService.items[itemsTagKey] = _.extend(TagService.items[itemsTagKey], tagUpdate.new_val);

          //Refresh tag status
          TagService.items[itemsTagKey].updatedAt = new Date();
          TagService.checkStatus('items');
        });
      });
    },
    link: function(scope, element, attrs) {
    },
    templateUrl: '/static/js/components/tags/tags.html'
  };
}]);
