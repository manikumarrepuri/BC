// create the controller and inject Angular's $scope
angular.module('MainController', []).controller('MainController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Please provide your feedback to the Application Development team.';
});
