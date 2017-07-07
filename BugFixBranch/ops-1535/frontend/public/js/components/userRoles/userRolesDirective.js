angular.module('itheonApp').directive('userRoles', ['AclRoleService', 'AclRuleService', 'AclResourceService', 'SessionService', 'socket', function(AclRoleService, AclRuleService, AclResourceService, SessionService, socket){
  return {
    scope: {},
    controllerAs: 'userRolesCtrl',
    controller: function($scope, $element) {
      var ctrl = this;

      ctrl.errorMessage = '';
      ctrl.roles = AclRoleService.items;
      ctrl.rules = AclRuleService.items;
      ctrl.resources = AclResourceService.items;
      ctrl.totals = AclRoleService.totals;
      ctrl.options = AclRoleService.options;
      ctrl.service = AclRoleService;

      // Declare the array for the selected items
      ctrl.selected = [];
      ctrl.lastSelectedRow = null;

      ctrl.menuOptions = [
        ['Edit User Role', function ($itemScope) {
          var selected = _.clone($scope.userRolesCtrl.selected);
          if(selected.length === 0) {
            selected.push($itemScope.role);
          }

          //Check with the user that they are happy
          $scope.$broadcast('permissionsModal', {roles: selected}, 'AclResourceService');
        }],
        null, // Dividier
        ['Delete Role', function ($itemScope) {
          var selected = _.clone($scope.userRolesCtrl.selected);
          if(selected.length == 0) {
            selected.push($itemScope.id);
          }
          alert('Delete Roles: ' + selected.join(', '));
        }]
      ];

      //Get latest data
      AclRoleService.get({}, true).then(function(){
        console.log('Retrieved data from API');
      });

      ctrl.addRole = function() {
        $element.find('.role-sidebar').toggleClass('module-sidebar-open');
      }

      //Load more data from the API
      ctrl.loadMore = function() {
        var last = ctrl.totals.active;
        if(_.isEmpty(ctrl.users) || !ctrl.loadingDone || last >= ctrl.totals.total) return;

        //We don't want to load this function again until the data is returned.
        ctrl.loadingDone = false;

        AclRoleService.getMore({storage: "db", offset: last, limit: 5}).then(function() {
          ctrl.loadingDone = true;
          console.log('Retrieved more data from API '+last+'-'+(last+5));
        });
      };

      //Push notifications for a role
      socket.on('roleUpdate', function(roleUpdate) {
        var roleId = roleUpdate.new_val.id;
        var allDeviceKey = _.findIndex(AclRoleService.items, {
          id: roleId
        });

        if (allDeviceKey === -1 && roleUpdate.new_val && roleUpdate.new_val.status !== -1) {
          console.warn("roleUpdate all - Unable to find role.");
          ctrl.needRefresh = true;
          return;
        }

        if (roleUpdate.new_val && roleUpdate.new_val.status === -1) {
          return;
        }

        var itemsRoleKey = _.findIndex(AclRoleService.items, {
          id: roleId
        });

        $scope.$apply(function () {
          if (itemsRoleKey === -1) {
            console.warn("roleUpdate screen - Unable to find role to update.");
            return;
          }

          AclRoleService.items[itemsRoleKey] = _.extend(AclRoleService.items[itemsRoleKey], roleUpdate.new_val);
        });
      });

      ctrl.confirmDeleterole = function(role) {
        $scope.$broadcast('confirmModal', {
          message: "Are you sure you wish to delete this Role?",
          title: "Confirm Deletion of " + role.id + " Role",
          buttonText: "Delete Role",
          action: 'deleteRole',
          items: user
        });
      };

      $scope.$on('deleteRole', function($event, role) {
        $event.stopPropagation();
        ctrl.deleteRole(role);
      });

      ctrl.deleteRole = function(user) {
        AclRoleService.deleteRole(role).then(function(result){
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
    templateUrl: '/static/js/components/userRoles/userRoles.html'
  };
}]);
