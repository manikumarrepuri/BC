(function() {
  'use strict';
  angular
  .module('itheonApp')
  .factory('FormSubmitter', FormSubmitter)
  .directive('formSubmitter', formSubmitterDirective);

  function FormSubmitter($rootScope, $sce) {
    // Expose our Api
    return {
      submit: submit
    }

    function submit(url, method, params) {
      url = $sce.trustAsResourceUrl(url);

      $rootScope.$broadcast('form.submit', {
        url: url,
        method: method,
        params: params
      });
    }
  }

  function formSubmitterDirective($timeout) {
    return {
      restrict: 'E',
      replace: true,
      template:
        '<form action="{{ formData.url }}" method="{{ formData.method }}" target="_blank">' +
        '   <div ng-repeat="(key,val) in formData.params">' +
        '       <input type="hidden" name="{{ key }}" value="{{ val }}" />' +
        '   </div>' +
        '</form>',
      link: function($scope, $element, $attrs) {
        $scope.$on('form.submit', function(event, data) {
          $scope.formData = data;

          console.log('auto submitting form...');

          $timeout(function() {
            $element.submit();
          })
        })
      }
    }
  }
})();
