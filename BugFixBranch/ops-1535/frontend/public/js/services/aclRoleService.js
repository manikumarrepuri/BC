var aclRoleService = angular.module('AclRoleService', ['underscoreService']);

aclRoleService.factory('AclRoleService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var AclRoleService = angular.extend({}, SearchService, SortService);
  var rolesApiUrl = '/api/acl-roles';
  AclRoleService.schema = {};
  AclRoleService.loaded = false;
  AclRoleService.globalRole = {};
  AclRoleService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  AclRoleService.items = [];
  AclRoleService.options={
    orderBy: 'id',
    orderASC: true,
    orderAPI: {
      "order": { "id": "asc" }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  AclRoleService.searchFields=[
    "id",
    "deviceId"
  ];
  AclRoleService.searchExamples=[
    "cpu|memory",
    "dev|test",
  ];

  AclRoleService.entityNamePlural = "Roles";
  AclRoleService.entityNameSingular = "Role";
  AclRoleService.displayFieldName = "id";

  // call to get a role
  AclRoleService.get = function(params, cache) {
    params = params || {};

    //Add ordering
    _.extend(params, AclRoleService.options.orderAPI);

    if(!_.isEmpty(AclRoleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclRoleService.options.conditions)
      });
    }

    var result = $http.get(
      rolesApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        AclRoleService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, AclRoleService.items);
        AclRoleService.totals.active = _.size(AclRoleService.items);
      });
    }

    return result;
  };

  AclRoleService.getMore = function(params) {
    //Add ordering
    _.extend(params,AclRoleService.options.orderAPI);

    if(!_.isEmpty(AclRoleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclRoleService.options.conditions)
      });
    }

    //We don't want to get the Global Role
    if(typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'id': {
            'ne': 'Bluechip:Generic'}
          }
        });
    }
    else {
      _.extend(params.conditions, {
        'id': {
          'ne': 'Bluechip:Generic'
        }
      });
    }

    var result = $http.get(
      rolesApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      _.extend(AclRoleService.items,response.data);
      AclRoleService.totals.active += _.size(response.data);
    });
  };

  AclRoleService.getById = function(id, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'id': id
      }
    });

    return this.get(query)
      .then(function(response) {
        if (!_.isObject(response) && _.isEmpty(response.data)) {
          return null;
        }

        return response.data.pop();
      });
  };

  AclRoleService.save = function(role) {
    if (role.id) {
      return this.update(role.id, role);
    }

    return this.create(role);
  };

  // call to POST and create a new role
  AclRoleService.create = function(role) {
    return $http.post(rolesApiUrl, role)
      .then(function(result) {
        return result.data;
      });
  };

  AclRoleService.update = function(id, role) {
    return $http.put(rolesApiUrl + '/' + id, role)
      .then(function(result) {
        return result.data;
      });
  };

  AclRoleService.multiSelectFilter = function(role) {
    return true;
  };

  AclRoleService.multiSelectDataPatch = function(roles) {
    _.forEach(roles, function(role) {
      role.value = role.id;
    });

    return roles;
  };

  AclRoleService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(AclRoleService.schema);
      }, 0);
    }

    return $http.get(rolesApiUrl + '/schema')
      .then(function(result) {
        AclRoleService.schema = result.data[Object.keys(result.data)[0]];
        return AclRoleService.schema;
      });
  };

  return AclRoleService;
}]);
