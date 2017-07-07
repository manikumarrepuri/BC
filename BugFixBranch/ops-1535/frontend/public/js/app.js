var app = angular.module(
  'itheonApp',
  [
    'ngRoute',
    'ngSanitize',
    'ngLetterAvatar',
    'sticky',
    'appRoutes',
    'infinite-scroll',
    'pasvaz.bindonce',
    'angularMoment',
    'selectionModel',
    'directives',
    'angular-web-notification',
    //'btford.socket-io',
    'angularFileUpload',
    //'textAngular',
    'ui.select',
    'smartArea',
    //'Mac',
    
    'ui.bootstrap',
    'ui.bootstrap.contextMenu',

    'MainController',
    'AlertsController',
    'DevicesController',
    'RemindersController',
    'RulesController',
    'RuleEditorsController',
    'RuleUpdatersController',
    'UsersController',
    'UserRolesController',
    'UserRulesController',
    'TagsController',
    //'LogoutController',

    'commonFilters',
    'camelCaseToHuman',

    'underscoreService',
    'SessionService',
    'LoginService',
    'AlertService',
    'FilterService',
    'SharedServices',
    'SearchService',
    'SortService',
    'DeviceService',
    'RuleService',
    'ReminderService',
    'ScheduledReminderService',
    'UserService',
    'AclRuleService',
    'AclRoleService',
    'AclResourceService',
    'AgentRuleService',
    'TagService',
    'smart-table'
    //'LogoutService'
  ]
);

app.run(
  function addGlobalErrorHandler($window, $exceptionHandler) {
    // Get a reference to the original error handler, if it exists, so we
    // don't overwrite any error-handling functionality that might be added
    // by a 3rd-party script.
    var originalErrorHandler = $window.onerror;
    // If there is no existing global error handler, let's define a mock one
    // so that our custom error handler code can be handled uniformly.
    if (!originalErrorHandler) {
      originalErrorHandler = function mockHandler() {
        // By returning True, we prevent the browser's default error handler.
        return (true);
      };
    }
    // Define our custom error handler that will pipe errors into the core
    // $exceptionHandler service (where they may be further processed).
    // --
    // NOTE: Only message, fileName, and lineNumber are standardized.
    // columnNumber and error are not standardized values and will not be
    // present in all browsers. That said, they appear to work in all of the
    // browsers that "matter".
    $window.onerror = function handleGlobalError(message, fileName, lineNumber, columnNumber, error) {

      // If this browser does not pass-in the original error object, let's
      // create a new error object based on what we know.
      if (!error) {
        error = new Error(message);
        // NOTE: These values are not standard, according to MDN.
        error.fileName = fileName;
        error.lineNumber = lineNumber;
        error.columnNumber = (columnNumber || 0);
      }
      // Pass the error off to our core error handler.
      $exceptionHandler(error);
      // Pass of the error to the original error handler.
      try {
        return (originalErrorHandler.apply($window, arguments));
      } catch (applyError) {
        $exceptionHandler(applyError);
      }
    };
  }
);

app.run(["$rootScope", "$route", "$location", "$timeout", "socket", "SessionService", "UserService", function ($rootScope, $route, $location, $timeout, socket, SessionService, UserService) {

  "use strict";

  var loadingTimer = null;

  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
    if (curr.$$route && curr.$$route.resolve) {
      //If we were connected to a socket disconnect
      if(prev && prev.$$route && prev.$$route.socket) {
        //If we're still on the same page don't disconnect the socket.
        if(!(curr.$$route.originalPath && prev.$$route.originalPath)) {
          socket.emit(prev.$$route.socket.replace('Subscribe', 'Unsubscribe'), {id: socket.id});
        }
      }
      $rootScope.route = curr.$$route;
    }
  });

  $rootScope.showModal = function (modalSelector) {
    modalSelector = modalSelector || '.modal';
    $(modalSelector).modal(
      {
        show : true,
        backdrop : 'static'
      }
    );
    $rootScope.currentModalSelector = modalSelector;
  };

  $rootScope.hideModal = function (modalSelector) {
    modalSelector = modalSelector || '.modal';
    $(modalSelector).modal('hide');
  };

  // method used to show any type of alert
  $rootScope.showAlert = function (alertType, alertSelector, message) {
    var alert = $(alertSelector);
    alert.removeClass().addClass('alert alert-' + alertType + ' alert-dismissable');
    alert.children('.message').html(message);
    alert.show();
  };

  // method used to show success alert
  $rootScope.showSuccessAlert = function (alertSelector, message) {
    $rootScope.showAlert('success', alertSelector, message);
  };

  // method used to show info alert
  $rootScope.showInfoAlert = function (alertSelector, message) {
    $rootScope.showAlert('info', alertSelector, message);
  };

  // method used to show warning alert
  $rootScope.showWarningAlert = function (alertSelector, message) {
    $rootScope.showAlert('warning', alertSelector, message);
  };

  // method used to show danger alert
  $rootScope.showDangerAlert = function (alertSelector, message) {
    $rootScope.showAlert('danger', alertSelector, message);
  };

  // method used to hide alert
  $rootScope.hideAlert = function (alertSelector) {
    var alert = $(alertSelector);
    alert.hide();
  };

  // setting up underscore
  $rootScope._ = window._;

  // setting up underscore
  $rootScope.Math = window.Math;
}]);

//app.config(function(uiSelectConfig) {
//  uiSelectConfig.theme = 'select2';
//});

app.filter('propsFilter', function() {

  "use strict";

  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < props.fields.length; i++) {
          var propertyCondition = props.fields[i];
          var propertyName  = propertyCondition.name;
          var propertyValue = propertyCondition.value.toString().toLowerCase();

          if (item[propertyName].toString().toLowerCase().indexOf(propertyValue) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

app.filter('prettyJSON', function () {
  return function(json) { return angular.toJson(json, true); }
});
