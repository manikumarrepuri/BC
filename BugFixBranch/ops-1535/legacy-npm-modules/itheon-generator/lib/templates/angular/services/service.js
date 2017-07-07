var {{module}}Service = angular.module('{{Module}}Service', ['underscoreService']);

{{module}}Service.factory('{{Module}}Service', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var {{Module}}Service = {};
  var {{module}}sApiUrl = '/api/{{module}}s';
  {{Module}}Service.schema = {};
  {{Module}}Service.loaded = false;
  {{Module}}Service.global{{Module}} = {};
  {{Module}}Service.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  {{Module}}Service.items = [];
  {{Module}}Service.options={
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
  {{Module}}Service.searchFields=[];
  {{Module}}Service.searchExamples=[];

  // call to get a {{module}}
  {{Module}}Service.get = function(params, cache) {
    //Add ordering
    _.extend(params,{{Module}}Service.options.orderAPI);

    if(!_.isEmpty({{Module}}Service.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone({{Module}}Service.options.conditions)
      });
    }

    var result = $http.get(
      {{module}}sApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        {{Module}}Service.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, {{Module}}Service.items);
        {{Module}}Service.totals.active = _.size({{Module}}Service.items);
      });
    }

    return result;
  };

  {{Module}}Service.getMore = function(params) {
    //Add ordering
    _.extend(params,{{Module}}Service.options.orderAPI);

    if(!_.isEmpty({{Module}}Service.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone({{Module}}Service.options.conditions)
      });
    }

    var result = $http.get(
      {{module}}sApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      _.extend({{Module}}Service.items,response.data);
      {{Module}}Service.totals.active += _.size(response.data);
    });
  };

  {{Module}}Service.getById = function(id, params) {
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

  {{Module}}Service.save = function({{module}}) {
    if ({{module}}.id) {
      return this.update({{module}}.id, {{module}});
    }

    return this.create({{module}});
  };

  // call to POST and create a new {{module}}
  {{Module}}Service.create = function({{module}}) {
    return $http.post({{module}}sApiUrl, {{module}})
      .then(function(result) {
        return result.data;
      });
  };

  {{Module}}Service.update = function(id, {{module}}) {
    return $http.put({{module}}sApiUrl + '/' + id, {{module}})
      .then(function(result) {
        return result.data;
      });
  };

  //Sort {{module}}s
  {{Module}}Service.sort = SortService.sort;

  // Search {{module}}s
  {{Module}}Service.search = SearchService.search;
  {{Module}}Service.buildConditions = SearchService.buildConditions;

  {{Module}}Service.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve({{Module}}Service.schema);
      }, 0);
    }

    return $http.get({{module}}sApiUrl + '/schema')
      .then(function(result) {
        {{Module}}Service.schema = result.data[Object.keys(result.data)[0]];
        return {{Module}}Service.schema;
      });
  };

  return {{Module}}Service;
}]);
