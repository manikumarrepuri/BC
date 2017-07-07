var alertService = angular.module('AlertService', ['underscoreService']);

alertService.factory('AlertService', ['$rootScope', '$http', '$timeout', '$q', '_', 'moment', function ($rootScope, $http, $timeout, $q, _, moment) {

  "use strict";

  var AlertService = angular.extend({});
  var alertsApiUrl = '/api/alerts';
  var alertHistoryApiUrl = '/api/alert-histories';
  var filtersApiUrl = '/api/filters';
  AlertService.schema = {};
  AlertService.loaded = false;
  AlertService.items = [];
  AlertService.totals = {};
  AlertService.options = {
    orderBy: 'severity',
    orderASC: true,
    orderAPI: {
      'order': {
        'createdAt': 'desc'
      }
    },
    conditions: {
      "or": [{
          "state": {
            "regex": "(?im)n|u"
          }
        },
        {
          "and": [{
              "state": "C"
            },
            {
              "acknowledged": false
            }
          ]
        }
      ]
    },
    oldConditions: {},
    query: 'state: n|u,acknowledged: false',
    oldQuery: ''
  };
  AlertService.searchFields = [
    "acknowledged",
    "severity",
    "createdAt",
    "occurrences",
    "group",
    "name",
    "state",
    "brief",
    "ruleName",
    "tags"
  ];
  AlertService.searchExamples = [
    "true or false",
    "1 or [1-3]",
    "Not Supported Yet",
    "50 or >50 or <50",
    "itheon|bluechip",
    "test|dev",
    "n|u",
    "cpu load|cpu max",
    "cpu_load",
    "customer:Bluechip"
  ];

  AlertService.findIndex = function (id) {
    var alertId = _.findIndex(AlertService.items, {
      _id: id
    });
    return AlertService.items[alertId];
  }

  // call to get all alert links
  AlertService.get = function (params, cache) {

    //Add ordering
    _.extend(params, AlertService.options.orderAPI);

    // if(!_.isEmpty(AlertService.options.conditions)) {
    //   _.extend(params, {
    //     'conditions': _.clone(AlertService.options.conditions)
    //   });
    // }

    //Add required condition
    //NEO - not(N) equal(E) to 'O'
    if (typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'status': 1
        }
      });
    } else {
      _.extend(params.conditions, {
        'status': 1
      });
    }

    var result = $http.get(
      alertsApiUrl + (params ? '?' + $.param(params) : '')
    );

    // formatting data
    return result.then(function (response) {
      AlertService.totals.total = response.data[0].length;
      angular.copy(response.data[0], AlertService.items);
      AlertService.totals.active = _.size(AlertService.items);
    });
  };

  AlertService.getMore = function (params) {
    //Add ordering
    _.extend(params, AlertService.options.orderAPI);

    if (!_.isEmpty(AlertService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AlertService.options.conditions)
      });
    }

    //Add required condition
    if (typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'status': 1
        }
      });
    } else {
      _.extend(params.conditions, {
        'status': 1
      });
    }

    var result = $http.get(
      alertsApiUrl + (params ? '?' + $.param(params) : '')
    );

    // formatting data
    return result.then(function (response) {
      var index;
      _.forEach(response.data, function (item) {
        index = _.findIndex(AlertService.items, {
          id: item.id
        });
        if (index === -1) {
          AlertService.items.push(item);
          AlertService.totals.active++;
        }
      });
    });
  };

  AlertService.getById = function (id, params) {
    params = params || {};

    _.extend(params, {
      'conditions': {
        '_id': id
      }
    });

    return this.getSingle(params)
      .then(function (response) {
        if (!_.isObject(response.data)) {
          return null;
        }

        return response.data[_id];
      });
  };

  //Retireve Alert history
  AlertService.getHistoryCount = function (context) {

    return this.getByContext(context)
      .then(function (alerts) {
        if (!_.isObject(alerts)) {
          return null;
        }

        var count = 0,
          weekCount = 0;
        var date = new Date();
        var lastWeek = Math.floor(new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000))); //in ms
        var diffSum = 0;
        var totalDiff = 0;

        //Count up alerts this week
        _.each(alerts, function (alert, key) {
          if (alert.state != 'C') {
            if (alert.firstOccurrence > lastWeek) {
              weekCount++;
            }
            count++;
          } else {
            diffSum += alert.timeToClose;
            totalDiff++;
          }
        });

        //Calculate avg
        var avg = diffSum / totalDiff;

        return {
          'total': count,
          'weekCount': weekCount,
          'avgTimeToClose': Math.floor(avg)
        };
      });
  };

  //Retireve Alert history
  AlertService.getHistory = function (context) {
    return this.getByContext(context, {
      url: alertHistoryApiUrl
    })
      .then(function (alerts) {
        if (!_.isObject(alerts)) {
          return null;
        }

        var diffSum = 0;
        var totalDiff = 0;
        var alertGroups = {};

        _.each(alerts[0], function (alert, key) {

          alert.createdAt = new Date(alert.createdAt);
          alert.updatedAt = new Date(alert.updatedAt);

          let date = moment(alert.createdAt).format("YYYY/MM/DD");

          //If the date group doesn't already exist create it.
          if (typeof alertGroups[date] == 'undefined') {
            alertGroups[date] = {};
          }

          if (alert.state == 'C') {
            diffSum += alert.timeToClose;
            totalDiff++;
          }

          //Attach alert to the date group
          alertGroups[date][alert._id] = alert;
        });

        //Calculate avg
        var avg = diffSum / totalDiff;

        return {
          'history': alertGroups,
          'avgTimeToClose': Math.floor(avg)
        };
      });
  };

  AlertService.getByContext = function (context, params) {
    params = params || {};

    _.extend(params, {
      'conditions': {
        'deviceId': context.deviceId,
        'ruleName': context.ruleName,
        'entity': context.entity
      },
      'limit': 1000,
      'order': {
        'createdAt': 'desc'
      }
    });

    return this.getSingle(params)
      .then(function (alerts) {

        if (!_.isObject(alerts.data)) {
          return null;
        }

        return alerts.data;
      });
  };

  AlertService.getSingle = function (params) {
    params = params || {};
    var url = params.url || alertsApiUrl;

    var result = $http.get(
      url + (params ? '?' + $.param(params) : '')
    );

    // formatting data
    return result.then(function (response) {
      return result;
    });
  };

  //Create/Update a alert
  AlertService.save = function (alert) {
    if (alert._id) {
      return this.update(alert._id, alert).then(function (result) {
        AlertService.updateAlerts(result);
        return result;
      });
    }

    return this.create(alert).then(function (result) {
      AlertService.updateAlerts(result, "add");
      return result;
    });
  };

  //Save filter
  AlertService.saveFilter = function(filterCondition, filterAttributes) {
    return this.createFilter(filterCondition, filterAttributes).then(function(result){
      return result;
    });
  };
      
  // call to POST and create a new filter
  AlertService.createFilter = function(filterCondition, filterAttributes) {
    //Add in some required fields
    Object.keys(filterCondition).forEach((key) => (filterCondition[key] == null || filterCondition[key] == undefined) && delete filterCondition[key]);
    var filter = {};
    filter['uiElement'] = "Alerts";
    filter['filterName'] = filterAttributes.filterName;
    filter['isShared'] = filterAttributes.isShared;
    filter['userName'] = $rootScope.identity.username;
    filter['filterCondition'] = filterCondition;

    return $http.post(filtersApiUrl, filter)
      .then(function(result) {
        return result.data;
      });
  };

  //Create/Update a filter
  AlertService.getFilter = function() {
    var params = {};
    _.extend(params, {
      'conditions': {
        'userName': $rootScope.identity.username,
        'isShared': true
      }
    });
    var result = $http.get(filtersApiUrl + '?' + $.param(params));
    // var result = $http.get(filtersApiUrl);
    // formatting data
    return result.then(function(response) {
      return response.data[0];
    });
  };

  //Delete an alert
  AlertService.deleteAlert = function (alert) {
    return this.update(alert._id, {
      status: -1
    }).then(function (result) {
      AlertService.updateAlerts(result, "delete");
      return result;
    });
  };

  //Update alert object array
  AlertService.updateAlerts = function (newAlert, action) {
    if (typeof action == "undefined") {
      action = 'update';
    }

    switch (action) {
    case "add":
      //If it doesn't match the current search end here
      if (!AlertService.doesItemMatchSearch(newAlert)) {
        return;
      }

      AlertService.items.unshift(newAlert);
      AlertService.totals.total++;
      break;
    case "delete":
      var key = _.findKey(
        AlertService.items,
        function (alert) {
          return alert.deviceId + alert.entity + alert.ruleName === newAlert.deviceId + newAlert.entity + newAlert.ruleName;
        }
      );

      if (!key) {
        return;
      }

      delete AlertService.items[key];
      AlertService.totals.total--;
      break;
    case "update":
      var key = _.findKey(AlertService.items, function (alert) {
        return alert.deviceId + alert.entity + alert.ruleName === newAlert.deviceId + newAlert.entity + newAlert.ruleName;
      });

      if (!key) {
        return;
      }
      // This is not the right place to delete the alert if it is closed state and acknowledged.
      //Delete wherever the acknowledge is happened.
      // if (newAlert.acknowledged === true && newAlert.state === 'C') {
      //   delete AlertService.items[key];
      //   return;
      // }
      AlertService.items[key] = newAlert;
    }

    AlertService.totals.active = _.size(AlertService.items);
  };

  // call to POST and create a new alert
  AlertService.create = function (alert) {

    //Add in some required fields
    alert['occurrences'] = "1";
    alert['status'] = "1";
    alert['state'] = "N";
    alert['resourceUrl'] = alertsApiUrl;
    alert['entity'] = null;
    alert['firstOccurrence'] = Math.floor(new Date((new Date).getTime() - (7 * 24 * 60 * 60 * 1000))).toString();
    alert['lastOccurrence'] = alert['firstOccurrence'];

    return $http.post(alertsApiUrl, alert)
      .then(function (result) {
        return result.data;
      });
  };

  AlertService.update = function (id, updatedAlert) {
    var alert = AlertService.findIndex(id);

    if (!alert) {
      return $q(function (resolve, reject) {
        reject("no alert found");
      });
    }

    //Make sure defaulted fields are set or we'll overwrite them
    updatedAlert.tags = updatedAlert.tags || alert.tags;
    updatedAlert.acknowledged = _.isUndefined(updatedAlert.acknowledged) ? alert.acknowledged : updatedAlert.acknowledged;
    updatedAlert.assignee = updatedAlert.assignee || alert.assignee;

    return $http.put(alertsApiUrl + '/' + id, updatedAlert)
      .then(function (result) {
        return result.data;
      });
  };

  AlertService.createHistory = function (id, params) {
    var alert = AlertService.findIndex(id);

    if (!alert) {
      return $q(function (resolve, reject) {
        reject("no alert found");
      });
    }

    var alertHistory = {
      deviceId: alert.deviceId,
      firstOccurrence: alert.firstOccurrence,
      lastOccurrence: alert.lastOccurrence,
      matchedConditions: alert.matchedConditions,
      entity: alert.entity,
      group: alert.group,
      name: alert.name,
      icon: params.icon || 'fa-alert',
      brief: params.action,
      ruleName: alert.ruleName,
      tags: alert.tags,
      status: 1,
      assignee: $rootScope.identity.username
    };

    $http.post(alertHistoryApiUrl, alertHistory)
      .then(function (result) {
        //Delete the alert if it's closed state and acknowledged.
        if (alert.acknowledged === true && alert.state === 'C') {
          var key = _.findKey(AlertService.items, function (alert) {
            return id;
          });
          delete AlertService.items[key];
        }
        return result.data;
      });
  };

  AlertService.createAcknowledged = function (id) {
    return AlertService.createHistory(id, {
      action: "Alert acknowledged by user: " + $rootScope.identity.username,
      icon: 'fa-check-circle-o'
    });
  };

  AlertService.createAssigned = function (id, assignee) {
    return AlertService.createHistory(id, {
      action: "Alert assigned to user: " + assignee || $rootScope.identity.username,
      icon: 'fa-user'
    });
  }

  AlertService.getFields = function (force) {
    if (!force && !_.isEmpty(this.schema)) {
      return $q(function (resolve, reject) {
        resolve(AlertService.schema);
      }, 0);
    }

    return $http.get(alertsApiUrl + '/schema')
      .then(function (result) {
        AlertService.schema = result.data[Object.keys(result.data)[0]];
        return AlertService.schema;
      });
  };

  return AlertService;
}]);
