angular.module('itheonApp').directive('multiSelectModal', ['_', 'socket', '$uibModal', function(_, socket, $uibModal) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'multiSelectModalCtrl',
    controller: function($scope) {

      var ctrl = this;

      $scope.$on('multiSelectModal', function($event, data, entityServiceName, selectionServiceName, collectionVariableName) {

        var uibModalInstance = $uibModal.open({
          templateUrl: '/static/js/components/multiSelectModal/multiSelectModal.html',
          size: 'lg',
          controller: [
            '$scope', '$injector', '$uibModalInstance', 'entityItems', 'entityServiceName', 'selectionServiceName', 'collectionVariableName', '$q', function($scope, $injector, $uibModalInstance, entityItems, entityServiceName, selectionServiceName, collectionVariableName, $q) {
              var entityService = $injector.get(entityServiceName);     // example: device, user,
              var selectionService = $injector.get(selectionServiceName);  // example: tag, role

              //Form controls
              $scope.multiSelectForm = {};
              $scope.multiSelectForm.items = [];
              $scope.errorMessage = '';

              selectionService.get([]).then(function(result) {

                $scope.items = result.data;

                var itemsMapping = {};
                _.forEach($scope.items, function(item) {
                  itemsMapping[item.id] = item;
                });

                var currentItems = {};
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

                $scope.multiSelectForm.selection = _.values(currentItems);
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
              };

              $scope.isSystem = function(item) {
                return false;
              }

              $scope.editSelection = function(form) {
                var fields = {};

                //If the form hasn't been altered do nothing
                if (form.$pristine || form.$invalid) {
                  console.warn('Failed to edit items, invalid form submission');
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

                var selectedItems = _.pluck(form.selection, 'id');
                var promises = [];
                var item = {};
                _.forEach(entityItems, function(entityItem) {
                  item = {
                    id: entityItem.id
                  };

                  item[collectionVariableName] = selectedItems;

                  promises.push(entityService.save(item));
                });

                $q.all(promises).then(function(result) {
                  _.forEach(entityItems, function(entityItem) {
                    var itemIndex = _.findIndex(entityService.items, {
                      id: entityItem.id
                    });
                    entityService.items[itemIndex][collectionVariableName] = selectedItems;
                  });

                  $uibModalInstance.close(form.selection);
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

              function wireServicesMethods(entityService, selectionService)
              {
                if (!selectionService.multiSelectFilter) {
                  console.warn(selectionServiceName + " doesn't define required multiSelectFilter function");
                }

                $scope.filter = selectionService.multiSelectFilter;

                if (!selectionService.entityNameSingular) {
                  console.warn(selectionServiceName + " doesn't define required singular entity name");
                }

                $scope.viewSelectionEntityNameSingular = selectionService.entityNameSingular;

                if (!selectionService.entityNamePlural) {
                  console.warn(selectionServiceName + " doesn't define required plurar entity name");
                }

                $scope.viewSelectionEntityNamePlural = selectionService.entityNamePlural;

                if (!selectionService.displayFieldName) {
                  console.warn(selectionServiceName + " doesn't define required display field name");
                }

                $scope.displayFieldName = selectionService.displayFieldName;
              }

              wireServicesMethods(entityService, selectionService);

              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
            }],
          resolve: {
            entityItems: function () {
              return data.selected;
            },
            entityServiceName: function() {
              return entityServiceName;
            },
            selectionServiceName: function() {
              return selectionServiceName;
            },
            collectionVariableName: function() {
              return collectionVariableName;
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
