angular.module('itheonApp').directive('login', ['LoginService', '$window', function(LoginService, $window){
  return {
    scope: {},
    bindToController: {
      inputUsername: '&',
      inputPassword: '&'
    },
    controllerAs: 'loginCtrl',
    controller: function() {
      var ctrl = this;

      ctrl.username = ctrl.inputUsername();
      ctrl.password = ctrl.inputPassword();
      ctrl.error = '';

      ctrl.login = function(form)
      {
         LoginService.login(form)
          .then(
            function() 
            {
            $window.location.href = '/';
            },
            function() 
            {
              ctrl.error = "Invalid Username or Password";
            }
           );
      }

      ctrl.clearError = function() {
        ctrl.error = '';
      }
    },
    templateUrl: '/static/js/components/login/login.html'
  }
}]);
