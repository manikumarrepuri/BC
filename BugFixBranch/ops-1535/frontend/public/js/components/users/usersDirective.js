angular.module('itheonApp').directive('users', ['UserService', 'SessionService', 'socket', function(UserService, SessionService, socket){
  return {
    scope: {},
    controllerAs: 'usersCtrl',
    controller: function($scope, $element) {
      var ctrl = this;

      ctrl.errorMessage = '';
      ctrl.users = UserService.items;
      ctrl.userKeys = [];
      ctrl.totals = UserService.totals;
      ctrl.options = UserService.options;
      ctrl.service = UserService;

      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      // Declare the array for the context menu
      ctrl.menuOptions = [
        ['Tag Users', function ($itemScope) {
          var selected = _.clone($scope.usersCtrl.selected);
          if(selected.length === 0) {
            selected.push($itemScope.user);
          }
          $scope.$broadcast('multiSelectModal', {selected: selected}, 'UserService', 'TagService', 'tags');
        }],
        null, // Dividier
        ['Edit Users Roles', function ($itemScope) {
          var selected = _.clone($scope.usersCtrl.selected);
          if(selected.length === 0) {
            selected.push($itemScope.user);
          }
          $scope.$broadcast('multiSelectModal', {selected: selected}, 'UserService', 'AclRoleService', 'roles');
        }],
        null, // Dividier
        ['Delete Users', function ($itemScope) {
          var selected = _.clone($scope.usersCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.user.id);
          }
          alert('Delete Users: ' + selected.join(', '));
        }]
      ];

      //Get latest data
      UserService.get({}, true).then(function(){
        console.log('Retrieved data from API');
      });

      ctrl.addUser = function() {
        $element.find('.user-sidebar').toggleClass('module-sidebar-open');
      }

      //Load more data from the API
      ctrl.loadMore = function() {
        var last = ctrl.totals.active;
        if(_.isEmpty(ctrl.users) || !ctrl.loadingDone || last >= ctrl.totals.total) return;

        //We don't want to load this function again until the data is returned.
        ctrl.loadingDone = false;

        UserService.getMore({storage: "db", offset: last, limit: 5}).then(function() {
          ctrl.loadingDone = true;
          console.log('Retrieved more data from API '+last+'-'+(last+5));
        });
      };

      ctrl.confirmDeleteUser = function(user) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete this User?",
          title: "Confirm Deletion of " + user.username + " User",
          buttonText: "Delete User",
          action: 'deleteUser',
          items: user
        });
      };

      $scope.$on('deleteUser', function($event, user) {
        $event.stopPropagation();
        ctrl.deleteUser(user);
      });

      ctrl.deleteUser = function(user) {
        UserService.deleteUser(user).then(function(result){
          $element.find('.delete-success').removeClass('hide');
          setTimeout(function() {
            $('.delete-success').addClass('hide');
          }, 2000);
        }, function(error){
          ctrl.errorMessage = error.data.message;
          //Failed to update thresholds
          $element.find('.delete-failed').removeClass('hide');
          setTimeout(function() {
            $('.delete-failed').addClass('hide');
          }, 2000);
        });
      }
    },
    link: function(scope, element, attrs) {
    },
    templateUrl: '/static/js/components/users/users.html'
  };
}]);
