var sharedServices = angular.module('SharedServices', []);

sharedServices.config(function ($rootScope, $httpProvider) {
  $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
      $rootScope.$broadcast("loader_show");
      return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', function ($rootScope, $q, $window) {
  return function (promise) {
    return promise.then(function (response) {
      return response;
    }, function (response) {
      return $q.reject(response);
    }).finally(function() {
      $rootScope.$broadcast("loader_hide");
    });
  };
});
