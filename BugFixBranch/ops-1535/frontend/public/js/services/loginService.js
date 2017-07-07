
var loginService = angular.module('LoginService', []);

loginService.factory('LoginService', ['$http', function ($http) {

  return {
    login : function (loginForm) {
      return $http.post('/login', loginForm);
    },
  };
}]);
