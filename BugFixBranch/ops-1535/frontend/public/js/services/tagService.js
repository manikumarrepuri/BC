
var tagService = angular.module('TagService', ['underscoreService']);

tagService.factory('TagService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var TagService = angular.extend({}, SearchService, SortService);
  var tagsApiUrl = '/api/tags';
  TagService.schema = {};
  TagService.loaded = false;
  TagService.globalTag = {};
  TagService.totals = {
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  TagService.types = [];
  TagService.items = [];
  TagService.tagGroups = [];
  TagService.options = {
    orderBy: 'name',
    orderASC: true,
    orderAPI: {
      "order": { "value": "asc" }
    },
    conditions: {
      'group': 'user'
    },
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  TagService.searchFields = [
    "value",
    "description",
    "color"
  ];
  TagService.searchExamples = [
    "name",
    "color",
  ];

  TagService.entityNamePlural = "Tags";
  TagService.entityNameSingular = "Tag";
  TagService.displayFieldName = "id";

  // call to get a tag
  TagService.get = function(params, cache) {
    //Add ordering
    _.extend(params,TagService.options.orderAPI);

    if(!_.isEmpty(TagService.options.conditions)) {
      if(!params.conditions) {
        _.extend(params, {
          'conditions': _.clone(TagService.options.conditions)
        });
      }
      else {
        _.extend({
          'conditions': _.clone(TagService.options.conditions)
        }, params.conditions);
      }
    }

    //Add dodgy limit :)
    params.limit = 100000;

    var result = $http.get(
      tagsApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      var that = this;
      return result.then(function(response) {
        TagService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, TagService.items);
        that.updateGroups();
        angular.copy(_.uniq(_.map(response.data, function(tag) {
          return tag.type;
        })), TagService.types);
        TagService.totals.active = _.size(TagService.items);
      });
    }

    return result;
  };

  TagService.getById = function(id, params) {
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

  TagService.getMore = function(params) {
    //Add ordering
    _.extend(params,TagService.options.orderAPI);

    if (!_.isEmpty(TagService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(TagService.options.conditions)
      });
    }

    var result = $http.get(
      tagsApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      var index;
      _.forEach(response.data, function(item) {
        index = _.findIndex(TagService.items, {id: item.id});
        if (index === -1) {
          TagService.items.push(item);
          TagService.totals.active++;
        }
      });
    });
  };

  TagService.getTypes = function() {
    var params = {
      'distinct': 'type',
      'conditions': {
        'group': 'user'
      }
    };

    var result = $http.get(
      tagsApiUrl + '?' + $.param(params)
    );

    // storing data
    return result.then(function(response) {
      angular.copy(_.pluck(response.data, 'type'), TagService.types);
    });
  };

  TagService.updateGroups = function() {
    angular.copy(_.groupBy(TagService.items, 'type'), TagService.tagGroups);

    // Add collapsable toggle
    _.each(TagService.tagGroups, function(group) {
      group.isCollapsed = false;
    });
  };

  //Update user object array
  TagService.updateTags = function(newTag, action) {
    if (typeof action == "undefined") {
      action = 'update';
    }

    if (action == "add") {
      //If it doesn't match the current search end here
      if(!TagService.doesItemMatchSearch(newTag)) {
        return;
      }

      if (_.indexOf(TagService.types, newTag.type) == -1) {
        TagService.types.push(newTag.type);
      }
      TagService.items.push(newTag);
      TagService.totals.total++;
    } else if (action == "delete") {
      var index = _.findIndex(TagService.items, function(tag) {return tag.id == newTag.id;});
      TagService.items.splice(index, 1);

      //If this was the only item in the group delete it
      if (TagService.tagGroups[newTag.type].length <= 1) {
        index = _.findIndex(TagService.types, function(type) {return type == newTag.type;});
        TagService.types.splice(index, 1);
      }

      TagService.totals.total--;
    } else {
      var index = _.findIndex(TagService.items, function(tag) {return tag.id == newTag.id;});
      TagService.items[index] = newTag;
    }

    this.updateGroups();
    TagService.totals.active = TagService.items.length;
  };

  TagService.save = function(tag) {
    if (tag.id) {
      return this.update(tag.id, tag);
    }

    return this.create(tag);
  };

  // call to POST and create a new tag
  TagService.create = function(tag) {
    return $http.post(tagsApiUrl, tag)
      .then(function(result) {
        TagService.updateTags(result.data, "add");
        return result.data;
      });
  };

  TagService.update = function(id, tag) {
    return $http.put(tagsApiUrl + '/' + id, tag)
      .then(function(result) {
        // Deleted are handled elsewhere
        if (result.data.status != -1) {
          TagService.updateTags(result.data);
        }
        return result.data;
      });
  };

  TagService.multiSelectFilter = function(tag) {
    return tag.group == "system" ? true : false;
  };

  // Delete a tag
  TagService.deleteTag = function(tag) {
    return this.update(tag.id, {status: -1}).then(function(result) {
      TagService.updateTags(result, "delete");
      return result;
    });
  };

  TagService.getFields = function(force) {
    if (!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(TagService.schema);
      }, 0);
    }

    return $http.get(tagsApiUrl + '/schema')
      .then(function(result) {
        TagService.schema = result.data[Object.keys(result.data)[0]];
        return TagService.schema;
      });
  };

  return TagService;
}]);
