var reminderService = angular.module('ReminderService', ['underscoreService']);

reminderService.factory('ReminderService', ['$http', '$timeout', '$q', '$filter', '_', 'socket', 'timeoutStorage', 'SearchService', 'webNotification', 'SortService', function($http, $timeout, $q, $filter, _, socket, timeoutStorage, SearchService, webNotification, SortService) {

  "use strict";

  var ReminderService = angular.extend({}, SearchService, SortService);
  var remindersApiUrl = '/api/reminders';
  ReminderService.schema = {};
  ReminderService.loaded = false;
  ReminderService.globalReminder = {};
  ReminderService.totals = {
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  ReminderService.types = [];
  ReminderService.items = [];
  ReminderService.reminderGroups = [];
  ReminderService.options = {
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
  ReminderService.searchFields = [
    "value",
    "description",
    "color"
  ];
  ReminderService.searchExamples = [
    "name",
    "color",
  ];

  // call to get a reminder
  ReminderService.get = function(params, cache) {
    //Add ordering
    _.extend(params,ReminderService.options.orderAPI);

    if(!_.isEmpty(ReminderService.options.conditions)) {
      if(!params.conditions) {
        _.extend(params, {
          'conditions': _.clone(ReminderService.options.conditions)
        });
      }
      else {
        _.extend({
          'conditions': _.clone(ReminderService.options.conditions)
        }, params.conditions);
      }
    }

    //Add dodgy limit :)
    params.limit = 100000;

    var result = $http.get(
      remindersApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      var that = this;
      return result.then(function(response) {
        ReminderService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, ReminderService.items);
        that.setupReminders(response.data);
        ReminderService.totals.active = _.size(ReminderService.items);
      });
    }

    return result;
  };

  ReminderService.initSocketHandlers = function() {
    socket.emit('remindersSubscribe', {id: socket.id});
    //Push notifications for a reminder
    socket.on('reminderUpdate', function(reminderUpdate) {
      var reminderId = null;
      var type = null;

      if (reminderUpdate.type == "add") {
        ReminderService.items.push(reminderUpdate.new_val);

        webNotification.showNotification(reminderUpdate.new_val.name, {
          body:  $filter('htmlToPlaintext')(reminderUpdate.new_val.briefText),
          icon: '/static/images/alarm.ico',
          tag: reminderUpdate.new_val.id,
          onClick: function onNotificationClicked() {
           //Do something useful here like ummm
          },
          autoClose: 10000
        }, function onShow(error, hide) {
          if (error) {
            window.alert('Unable to show notification: ' + error.message);
          } else {
            console.log('Notification Shown.');
          }
        });

        return;
      }

      if(reminderUpdate.type != 'remove') {
        reminderId = reminderUpdate.new_val.id;
      } else {
        reminderId = reminderUpdate.old_val.id;
      }

      var itemsReminderKey = _.findKey(ReminderService.items, function(reminder) {
        return reminder.id === reminderId;
      });

      if (!itemsReminderKey) {
        console.log("Unable to find reminder");
        return false;
      }

      if(reminderUpdate.type == "change" && reminderUpdate.new_val.status !== -1) {
        ReminderService.items[itemsReminderKey] = _.extend(ReminderService.items[itemsReminderKey], reminderUpdate.new_val);

        //Refresh reminder status
        ReminderService.items[itemsReminderKey].updatedAt = new Date();
        return;
      }

      ReminderService.items.splice(itemsReminderKey, 1);
    });
  }

  ReminderService.setupReminders = function(reminders) {
    var reminder = reminders[0];

    angular.forEach(reminders, function(reminder, key) {
      if(reminder.schedule) {
        timeoutStorage.setInterval(reminder.id, reminder.schedule, function() {
          webNotification.showNotification(reminder.name, {
            body: $filter('htmlToPlaintext')(reminder.briefText),
            icon: '/static/images/alarm.ico',
            tag: reminder.id,
            onClick: function onNotificationClicked() {
              hide();
            },
            autoClose: 20000
          }, function onShow(error, hide) {
            if (error) {
              window.alert('Unable to show notification: ' + error.message);
            } else {
              console.log('Notification Shown.');
            }
          });
        });
      }
    });
  }

  ReminderService.getById = function(id, params) {
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

  ReminderService.getMore = function(params) {
    //Add ordering
    _.extend(params,ReminderService.options.orderAPI);

    if (!_.isEmpty(ReminderService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(ReminderService.options.conditions)
      });
    }

    var result = $http.get(
      remindersApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      var index;
      _.forEach(response.data, function(item) {
        index = _.findIndex(ReminderService.items, {id: item.id});
        if (index === -1) {
          ReminderService.items.push(item);
          ReminderService.totals.active++;
        }
      });
    });
  };

  ReminderService.getTypes = function() {
    var params = {
      'distinct': 'type',
      'conditions': {
        'group': 'user'
      }
    };

    var result = $http.get(
      remindersApiUrl + '?' + $.param(params)
    );

    // storing data
    return result.then(function(response) {
      angular.copy(_.pluck(response.data, 'type'), ReminderService.types);
    });
  };

  ReminderService.updateGroups = function() {
    angular.copy(_.groupBy(ReminderService.items, 'type'), ReminderService.reminderGroups);

    // Add collapsable toggle
    _.each(ReminderService.reminderGroups, function(group) {
      group.isCollapsed = false;
    });
  };

  //Update user object array
  ReminderService.updateReminders = function(newReminder, action) {
    if (typeof action == "undefined") {
      action = 'update';
    }

    if (action == "add") {
      //If it doesn't match the current search end here
      if(!ReminderService.doesItemMatchSearch(newReminder)) {
        return;
      }

      if (_.indexOf(ReminderService.types, newReminder.type) == -1) {
        ReminderService.types.push(newReminder.type);
      }
      ReminderService.items.push(newReminder);
      ReminderService.totals.total++;
    } else if (action == "delete") {
      var index = _.findIndex(ReminderService.items, function(reminder) {return reminder.id == newReminder.id;});
      ReminderService.items.splice(index, 1);

      //If this was the only item in the group delete it
      if (ReminderService.reminderGroups[newReminder.type].length <= 1) {
        index = _.findIndex(ReminderService.types, function(type) {return type == newReminder.type;});
        ReminderService.types.splice(index, 1);
      }

      ReminderService.totals.total--;
    } else {
      var index = _.findIndex(ReminderService.items, function(reminder) {return reminder.id == newReminder.id;});
      ReminderService.items[index] = newReminder;
    }

    this.updateGroups();
    ReminderService.totals.active = ReminderService.items.length;
  };

  ReminderService.save = function(reminder) {
    if (reminder.id) {
      return this.update(reminder.id, reminder);
    }

    return this.create(reminder);
  };

  // call to POST and create a new reminder
  ReminderService.create = function(reminder) {
    return $http.post(remindersApiUrl, reminder)
      .then(function(result) {
        return result.data;
      });
  };

  ReminderService.update = function(id, reminder) {
    return $http.put(remindersApiUrl + '/' + id, reminder)
      .then(function(result) {
        return result.data;
      });
  };

  // Delete a reminder
  ReminderService.deleteReminder = function(reminder) {
    return this.update(reminder.id, {status: -1}).then(function(result) {
      return result;
    });
  };

  ReminderService.getFields = function(force) {
    if (!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(ReminderService.schema);
      }, 0);
    }

    return $http.get(remindersApiUrl + '/schema')
      .then(function(result) {
        ReminderService.schema = result.data[Object.keys(result.data)[0]];
        return ReminderService.schema;
      });
  };

  return ReminderService;
}]);
