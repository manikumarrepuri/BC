// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var appRoutes = angular.module('appRoutes', []);

appRoutes.config(
  [
    '$routeProvider', '$locationProvider',
    // configure our routes
    function($routeProvider, $locationProvider) {

      "use strict";

      var universalResolves = {
        "user": function($q, $route, $location, $rootScope, UserService, AclRuleService, SessionService) {
          return UserService.getInfo()
            .then(function(user) {
              SessionService.setUser(user);
              $rootScope.identity = user;

              //Check if the user has access to this route
              return SessionService.getAclValid($route.routes[$route.current.$$route.originalPath].title, "view").then(function(valid) {
                if(!valid) {
                  alert("You do not have permissions to view this page!");
                  return $q.reject();
                }

                return user;
              });
          });
        },
        "socket": function($q, $route, $location, socket, ReminderService) {
          if(!$route.current.$$route) {
            return false;
          }

          var resolveSocket = function(routeSocket) {
            if(routeSocket) {
              socket.emit(routeSocket, {id: socket.id});
            }
            ReminderService.initSocketHandlers();
          }

          return $q(function(resolve, reject) {
            if(socket.connected) {
              resolveSocket($route.current.$$route.socket);
              resolve('subscribed!');
            }

            if(socket.disconnected) {
              socket.connect();
            }

            //Subscribe to socket
            socket.on('connect', function(){
              resolveSocket($route.current.$$route.socket);
              resolve('connnected!');
            });
          });
        }
      };

      var customRouteProvider = angular.extend({}, $routeProvider, {
        when: function(path, route) {
          route.resolve = (route.resolve) ? route.resolve : {};
          angular.extend(route.resolve, universalResolves);
          $routeProvider.when(path, route);
          return this;
        }
      });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      customRouteProvider
      //-- Start Custom Angular Routes --//
      // route for the home page
      .when('/', {
        title: 'Dashboard',
        icon: 'fa-dashboard',
        templateUrl: '/static/js/pages/home.html',
        controller: 'MainController'
      })

      // route for the home page
      .when('/alerts', {
        title: 'Alerts',
        socket: "alertsSubscribe",
        icon: 'fa-bell',
        templateUrl: '/static/js/pages/alerts.html',
        controller: 'AlertsController'
      })

      //route for the devices page
      .when('/devices', {
        title: 'Devices',
        socket: "devicesSubscribe",
        icon: 'fa-list',
        templateUrl: '/static/js/pages/devices.html',
        controller: 'DevicesController'
      })

      //route for the reminders page
      .when('/reminders', {
        title: 'Reminders',
        icon: 'fa-clock-o',
        templateUrl: '/static/js/pages/reminders.html',
        controller: 'RemindersController'
      })

      //route for the ruleEditor page
      .when('/ruleUpdater', {
        title: 'Agent Rules',
        socket: "agentRulesSubscribe",
        icon: 'fa-download',
        templateUrl: '/static/js/pages/ruleUpdaters.html',
        controller: 'RuleUpdatersController'
      })

        //route for the rules page
      .when('/rules', {
        title: 'Central Rules',
        socket: "rulesSubscribe",
        icon: 'fa-cogs',
        templateUrl: '/static/js/pages/rules.html',
        controller: 'RulesController'
      })

      //route for the ruleEditor page
      .when('/ruleEditor', {
        templateUrl: '/static/js/pages/ruleEditors.html',
        controller: 'RuleEditorsController',
        hidden: true
      })

      //route for the tags page
      .when('/tags', {
        title: 'Tags',
        socket: "tagsSubscribe",
        icon: 'fa-tags',
        templateUrl: '/static/js/pages/tags.html',
        controller: 'TagsController'
      })

      //route for the users page
      .when('/users', {
        title: 'User Access',
        socket: "usersSubscribe",
        icon: 'fa-users',
        templateUrl: '/static/js/pages/users.html',
        controller: 'UsersController',
        hasChildren: true
      })

      //route for the users page (again)
      .when('/users/users', {
        title: 'Users',
        socket: "userRolesSubscribe",
        icon: 'fa-users',
        templateUrl: '/static/js/pages/users.html',
        controller: 'UsersController',
        isChild: true,
        parent: '/users'
      })

      //route for the roles page
      .when('/users/roles', {
        title: 'Roles',
        socket: "userRolesSubscribe",
        icon: 'fa-users',
        templateUrl: '/static/js/pages/user-roles.html',
        controller: 'UserRolesController',
        isChild: true,
        parent: '/users'
      })

      .otherwise({
        redirectTo: '/'
      });
      //-- End Custom Angular Routes --//
    }
  ]);
