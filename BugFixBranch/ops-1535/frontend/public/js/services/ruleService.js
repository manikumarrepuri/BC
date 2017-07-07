var ruleService = angular.module('RuleService', ['underscoreService']);

ruleService.factory('RuleService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var RuleService = angular.extend({}, SearchService, SortService);
  var rulesApiUrl = '/api/rules';
  RuleService.schema = {};
  RuleService.loaded = false;
  RuleService.globalRule = {};
  RuleService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  RuleService.items = [];
  RuleService.options={
    orderBy: 'name',
    orderASC: true,
    orderAPI: {
      "order": { "name": "asc" }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  RuleService.searchFields=[
    "name",
    "deviceId"
  ];
  RuleService.searchExamples=[
    "cpu|memory",
    "dev|test",
  ];

  // call to get a rule
  RuleService.get = function(params, cache) {
    //Add ordering
    _.extend(params,RuleService.options.orderAPI);

    if(!_.isEmpty(RuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(RuleService.options.conditions)
      });
    }

    var result = $http.get(
      rulesApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        RuleService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, RuleService.items);
        RuleService.totals.active = _.size(RuleService.items);
      });
    }

    return result;
  };

  RuleService.getMore = function(params) {
    //Add ordering
    _.extend(params,RuleService.options.orderAPI);

    if(!_.isEmpty(RuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(RuleService.options.conditions)
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
      _.extend(RuleService.items,response.data);
      RuleService.totals.active += _.size(response.data);
    });
  };

  RuleService.getById = function(id, params) {
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

  RuleService.save = function(rule) {
    if (rule.id) {
      return this.update(rule.id, rule);
    }

    return this.create(rule);
  };

  // call to POST and create a new rule
  RuleService.create = function(rule) {
    return $http.post(rulesApiUrl, rule)
      .then(function(result) {
        return result.data;
      });
  };

  RuleService.update = function(id, rule) {
    return $http.put(rulesApiUrl + '/' + id, rule)
      .then(function(result) {
        return result.data;
      });
  };

  RuleService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(RuleService.schema);
      }, 0);
    }

    return $http.get(rulesApiUrl + '/schema')
      .then(function(result) {
        RuleService.schema = result.data[Object.keys(result.data)[0]];
        return RuleService.schema;
      });
  };

  return RuleService;
}]);
