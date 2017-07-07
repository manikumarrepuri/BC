
angular.module('itheonApp').directive('tagModal', ['_', 'socket', '$uibModal', function(_, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'tagModalCtrl',
    controller: function($scope) {

      var ctrl = this;

      $scope.$on('editTagsModal', function($event, data, serviceName) {

        var uibModalInstance = $uibModal.open({
          templateUrl: '/static/js/components/tagModal/tagModal.html',
          size: 'lg',
          controller: [
            '$scope', '$injector', '$uibModalInstance', 'TagService', 'items', 'serviceName', '$q', function($scope, $injector, $uibModalInstance, TagService, items, serviceName, $q) {
              var Service = $injector.get(serviceName);

              //Form controls
              $scope.editTagsForm = {};
              $scope.editTagsForm.tags = [];
              $scope.errorMessage = '';

              TagService.get([]).then(function(result) {
                $scope.tags = result.data;

                var tagsMapping = {};
                _.forEach($scope.tags, function(tag) {
                  tagsMapping[tag.id] = tag;
                });

                var currentTags = {};
                _.forEach(items, function(item) {
                  item.tags = item.tags ? item.tags : [];
                  _.forEach(item.tags, function(tag) {
                    var id = tag;
                    if(angular.isObject(tag)) {
                      id = tag.id;
                    }

                    currentTags[id] = tagsMapping[id];
                  });
                });

                $scope.editTagsForm.tags = _.values(currentTags);
              });

              $scope.clear = function($event, $select){
                //stops click event bubbling
                $event.stopPropagation();
                //to allow empty field, in order to force a selection remove the following line
                $select.selected = undefined;
                //reset search query
                $select.search = undefined;
                //focus and open dropdown
                $select.activate();
              }

              $scope.isSystem = function(tag){
                return tag.group == "system" ? true : false;
              };

              $scope.editTags = function(form) {
                var fields = {};

                //If the form hasn't been altered do nothing
                if (form.$pristine || form.$invalid) {
                  console.warn('Failed to edit tags, invalid form submission');
                  return false;
                }

                //get the values and only send what's been changed
                angular.forEach(form, function(control, key) {
                  if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
                    if (control.$dirty) {
                      fields[key] = control.$modelValue;
                    }
                  }
                });

                var tags = _.pluck(form.tags, 'id');
                var promises = [];
                var item = {};
                _.forEach(items, function(item) {
                  item = {
                    id: item.id,
                    tags: tags
                  };

                  promises.push(Service.save(item));
                });

                $q.all(promises).then(function(result) {
                  _.forEach(items, function(item) {
                    var itemIndex = _.findIndex(Service.items, {
                      id: item.id
                    });
                    Service.items[itemIndex].tags = form.tags;
                  });

                  $uibModalInstance.close(tags);
                  // setTimeout(function() {
                  //   $('.update-success').addClass('hide');

                  // }, 2000);
                }, function(error) {
                  // ctrl.errorMessage = error.data.message;
                  // //Failed to update thresholds
                  // $element.find('.update-failed').removeClass('hide');
                  //   setTimeout(function() {
                  //     $('.update-failed').addClass('hide');
                  //   }, 2000);
                });
              };

              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
            }],
          resolve: {
            items: function () {
              return data.selected;
            },
            serviceName: function() {
              return serviceName;
            }
          }
        });

        uibModalInstance.result.then(function (tags) {
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
            // $log.info('Modal dismissed at: ' + new Date());
          });
      });
    }
  };
}]);
