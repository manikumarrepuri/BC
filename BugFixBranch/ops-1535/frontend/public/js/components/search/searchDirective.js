angular.module('itheonApp').directive('appSearch', ['$timeout', function () {
  return {
    scope: {},
    controllerAs: 'searchCtrl',
    bindToController: {
      service: '=',
    },
    controller: function ($timeout, $element, $scope) {

      var ctrl = this;
      ctrl.timer = '';
      ctrl.searchForm = {};
      ctrl.searchForm.query = ctrl.service.options.query
      ctrl.advancedSearch = false;

      //Generate popoverHTML to explain what the search options are
      ctrl.popoverHTML = 'Search on all fields, or target specific properties using these prefixes:<hr />';

      var fields = '';
      _.each(ctrl.service.searchFields, function (field, key) {
        fields += '<p><mark>' + field + ':</mark> ' + ctrl.service.searchExamples[key] + '</p>';
      });
      ctrl.popoverHTML += fields;

      ctrl.search = function (form) {
        ctrl.service.search(form);
      };

      ctrl.openAdvancedSearch = function () {
        ctrl.advancedSearch = !ctrl.advancedSearch;
      };
    },
    link: function ($scope, elem, attr, ctrl) {
      $scope.$watch("searchForm.query", function (newText) {
        $scope.searchForm.query = newText;
        ctrl.service.search($scope.searchForm);
      });
    },
    templateUrl: '/static/js/components/search/search.html'
  };
}]);
