var SessionService = angular.module('SessionService', []);

SessionService.factory('SessionService', ['$http', function($http) {

  "use strict";

  var SessionService = {};
  SessionService.user = {};
  SessionService.user.isAdmin = false;

  SessionService.getUser = function() {
    return SessionService.user;
  };

  SessionService.getAclValid = function(resource, action) {
    var result = $http.get(
      'api/acl/validate/user/' + SessionService.user.username + '/resource/' + resource + '/action/' + action
    );

    return result.then(function(response) {
      return response.data.valid;
    });
  };

  SessionService.getRole = function() {
    return SessionService.role;
  };

  SessionService.setUser = function(user) {
    angular.copy(user, SessionService.user);
    if (user.username == 'admin' || user.roles.indexOf('administrator') !== false) {
      SessionService.user.isAdmin = true;
    }
  };

  SessionService.getUserIsAdmin = function() {
    return SessionService.user.isAdmin;
  }

  return SessionService;
}]);
