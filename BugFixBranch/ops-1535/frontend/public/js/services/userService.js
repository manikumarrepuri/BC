
var userService = angular.module('UserService', ['underscoreService']);

userService.factory('UserService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var UserService = angular.extend({}, SearchService, SortService);
  var usersApiUrl = '/api/users';
  UserService.schema = {};
  UserService.items = [];
  UserService.totals= {};
  UserService.options={
    orderBy: 'username',
    orderASC: true,
    orderAPI: {
      'order': {
        'username': 'asc'
      }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  UserService.searchFields=[
    "username",
    "email",
    "title",
    "role"
  ];
  UserService.searchExamples=[
    "admin",
    "admin@bluechip.co.uk",
    "op|admin",
    "op|admin"
  ];

  UserService.entityNamePlural = "Users";
  UserService.entityNameSingular = "User";
  UserService.displayFieldName = "username";

  // call to get all ticket links
  UserService.get = function(params, cache) {
    params = params || {};

    //Add ordering
    _.extend(params,UserService.options.orderAPI);

    if (!_.isEmpty(UserService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(UserService.options.conditions)
      });
    }

    var result = $http.get(
      usersApiUrl + (params ? '?' + $.param(params) : '')
    );

    if (cache) {
      // formatting data
      return result.then(function(response) {
        UserService.totals.total = response.headers('X-Total-Count');

        //This is for showing the user page
        angular.copy(response.data, UserService.items);
      });
    }

    return result;
  };

  UserService.getMore = function(params) {
    //Add ordering
    _.extend(params,UserService.options.orderAPI);

    if (!_.isEmpty(UserService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(UserService.options.conditions)
      });
    }

    var result = $http.get(
      usersApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      _.extend(UserService.items,response.data);
      UserService.totals.active += _.size(response.data);
      UserService.length();
    });
  };

  UserService.getById = function(id, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'id': id
      }
    });

    return this.get(query)
      .then(function(users) {
        if(users.data) {
          users = users.data;
        }

        if (!_.isArray(users)) {
          return null;
        }

        return users.pop();
      });
  };

  UserService.getByName = function(username, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'username': username,
        //Pass 3 to fetch the user data by name
        'whatToFetch': 3
      }
    });

    return this.get(query)
      .then(function(users) {
        if(users.data) {
          users = users.data;
        }

        if (!_.isArray(users)) {
          return null;
        }

        return users.pop();
      });
  };

  //Create/Update a user
  UserService.save = function(user) {
    if (user.id) {
      return this.update(user.id, user).then(function(result) {
        UserService.updateUsers(result);
        return result;
      });
    }

    return this.create(user).then(function(result) {
      UserService.updateUsers(result, "add");
      return result;
    });
  };

  //Create/Update a user
  UserService.deleteUser = function(user) {
    user.status = "-1";
    return this.update(user.id, user).then(function(result) {
        UserService.updateUsers(result,"delete");
        return result;
    });
  };

  //Update user object array
  UserService.updateUsers = function(newUser, action) {

    if (typeof action == "undefined") {
      action = 'update';
    }

    if (action == "add") {
      //If it doesn't match the current search end here
      if(!UserService.doesItemMatchSearch(newUser)) {
        return;
      }

      UserService.items[UserService.totals.total] = newUser;
      UserService.totals.total++;
    } else if (action == "delete") {
      var index = _.findIndex(UserService.items, function(user) {return user.username == newUser.username;});
      UserService.items.splice(index, 1);
      UserService.totals.total--;
    } else {
      var index = _.findIndex(UserService.items, function(user) {return user.username == newUser.username;});
      UserService.items[index] = newUser;
    }

    UserService.totals.active = UserService.items.length;
  };

  // call to POST and create a new user
  UserService.create = function(user) {
    return $http.post(usersApiUrl, user)
      .then(function(result) {
        return result.data;
      });
  };

  UserService.update = function(id, user) {
    return $http.put(usersApiUrl + '/' + id, user)
      .then(function(result) {
        return result.data;
      });
  };

  // returns details of currently logged in user
  UserService.getInfo = function() {
    return $http.get('/user')
      .then(function(response) {
        return response.data;
      });
  };

  UserService.getFields = function(force) {
    if (!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(UserService.schema);
      }, 0);
    }

    return $http.get(usersApiUrl + '/schema')
      .then(function(result) {
        UserService.schema = result.data[Object.keys(result.data)[0]];
        return UserService.schema;
      });
  };

  return UserService;
}]);
