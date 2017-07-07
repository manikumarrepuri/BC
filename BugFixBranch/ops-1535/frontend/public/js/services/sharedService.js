var sharedServices = angular.module('SharedServices', [])
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', function($rootScope, $q, $window) {
  return {
    // optional method
    'request': function(config) {
      if(config.url.startsWith('/api/')) {
        $rootScope.loadingView = true;
      }
      return config;
    },
      // optional method
    'requestError': function(rejection) {
      // do something on error
      $rootScope.loadingView = false;
      return $q.reject(rejection);
    },
      // optional method
    'response': function(response) {
      $rootScope.loadingView = false;
      return response;
    },
      // optional method
    'responseError': function(rejection) {
      // do something on error
      $rootScope.loadingView = false;
      return $q.reject(rejection);
    }
  };
});
