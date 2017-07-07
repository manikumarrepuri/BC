var aclResourceService = angular.module('AclResourceService', ['underscoreService']);

aclResourceService.factory('AclResourceService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var AclResourceService = angular.extend({}, SearchService, SortService);
  var rolesApiUrl = '/api/acl-resource';
  AclResourceService.schema = {};
  AclResourceService.loaded = false;
  AclResourceService.globalRole = {};
  AclResourceService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  AclResourceService.items = [];
  AclResourceService.options={
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
  AclResourceService.searchFields=[
    "id",
    "deviceId"
  ];
  AclResourceService.searchExamples=[
    "cpu|memory",
    "dev|test",
  ];

  AclResourceService.entityNamePlural = "Resources";
  AclResourceService.entityNameSingular = "Resource";
  AclResourceService.displayFieldName = "id";

  // call to get a role
  AclResourceService.get = function(params, cache) {
    params = params || {};

    //Add ordering
    _.extend(params, AclResourceService.options.orderAPI);

    if(!_.isEmpty(AclResourceService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclResourceService.options.conditions)
      });
    }

    var result = $http.get(
      rolesApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        AclResourceService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, AclResourceService.items);
        AclResourceService.totals.active = _.size(AclResourceService.items);
      });
    }

    return result;
  };

  AclResourceService.getMore = function(params) {
    //Add ordering
    _.extend(params,AclResourceService.options.orderAPI);

    if(!_.isEmpty(AclResourceService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclResourceService.options.conditions)
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
      _.extend(AclResourceService.items,response.data);
      AclResourceService.totals.active += _.size(response.data);
    });
  };

  AclResourceService.getById = function(id, params) {
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

  AclResourceService.save = function(role) {
    if (role.id) {
      return this.update(role.id, role);
    }

    return this.create(role);
  };

  // call to POST and create a new role
  AclResourceService.create = function(role) {
    return $http.post(rolesApiUrl, role)
      .then(function(result) {
        return result.data;
      });
  };

  AclResourceService.update = function(id, role) {
    return $http.put(rolesApiUrl + '/' + id, role)
      .then(function(result) {
        return result.data;
      });
  };

  AclResourceService.multiSelectFilter = function(role) {
    return true;
  };

  AclResourceService.multiSelectDataPatch = function(roles) {
    _.forEach(roles, function(role) {
      role.value = role.id;
    });

    return roles;
  };

  AclResourceService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(AclResourceService.schema);
      }, 0);
    }

    return $http.get(rolesApiUrl + '/schema')
      .then(function(result) {
        AclResourceService.schema = result.data[Object.keys(result.data)[0]];
        return AclResourceService.schema;
      });
  };

  return AclResourceService;
}]);
