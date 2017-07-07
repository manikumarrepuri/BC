var aclRuleService = angular.module('AclRuleService', ['underscoreService']);

aclRuleService.factory('AclRuleService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var AclRuleService = angular.extend({}, SearchService, SortService);
  var rulesApiUrl = '/api/acl-rules';
  AclRuleService.schema = {};
  AclRuleService.loaded = false;
  AclRuleService.globalRule = {};
  AclRuleService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  AclRuleService.items = [];
  AclRuleService.options={
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
  AclRuleService.searchFields=[
    "id",
    "deviceId"
  ];
  AclRuleService.searchExamples=[
    "cpu|memory",
    "dev|test",
  ];

  // call to get a rule
  AclRuleService.get = function(params, cache) {
    params = params || {};

    //Add ordering
    _.extend(params,AclRuleService.options.orderAPI);

    if(!_.isEmpty(AclRuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclRuleService.options.conditions)
      });
    }

    var result = $http.get(
      rulesApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        AclRuleService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, AclRuleService.items);
        AclRuleService.totals.active = _.size(AclRuleService.items);
      });
    }

    return result;
  };

  AclRuleService.getMore = function(params) {
    //Add ordering
    _.extend(params,AclRuleService.options.orderAPI);

    if(!_.isEmpty(AclRuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AclRuleService.options.conditions)
      });
    }

    //We don't want to get the Global Rule
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
      rulesApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      _.extend(AclRuleService.items,response.data);
      AclRuleService.totals.active += _.size(response.data);
    });
  };

  AclRuleService.getById = function(id, params) {
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

  AclRuleService.getByRole = function(role, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'role': role
      }
    });

    return this.get(query)
      .then(function(response) {
        if (!_.isObject(response) && _.isEmpty(response.data)) {
          return null;
        }

        return response.data;
      });
  };

  AclRuleService.save = function(rule) {
    if (rule.id) {
      return this.update(rule.id, rule);
    }

    return this.create(rule);
  };

  // call to POST and create a new rule
  AclRuleService.create = function(rule) {
    return $http.post(rulesApiUrl, rule)
      .then(function(result) {
        return result.data;
      });
  };

  AclRuleService.update = function(id, rule) {
    return $http.put(rulesApiUrl + '/' + id, rule)
      .then(function(result) {
        return result.data;
      });
  };

  AclRuleService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(AclRuleService.schema);
      }, 0);
    }

    return $http.get(rulesApiUrl + '/schema')
      .then(function(result) {
        AclRuleService.schema = result.data[Object.keys(result.data)[0]];
        return AclRuleService.schema;
      });
  };

  return AclRuleService;
}]);
