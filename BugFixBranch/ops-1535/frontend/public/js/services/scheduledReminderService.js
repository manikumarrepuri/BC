var reminderService = angular.module('ScheduledReminderService', ['underscoreService']);

reminderService.factory('ScheduledReminderService', ['$http', '$timeout', '$q', '$filter', '_', 'socket', 'timeoutStorage', 'SearchService', 'webNotification', 'SortService', function($http, $timeout, $q, $filter, _, socket, timeoutStorage, SearchService, webNotification, SortService) {

  "use strict";

  var ScheduledReminderService = angular.extend({}, SearchService, SortService);
  var remindersApiUrl = '/api/scheduled-reminders';
  ScheduledReminderService.schema = {};
  ScheduledReminderService.loaded = false;
  ScheduledReminderService.totals = {
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  ScheduledReminderService.items = [];
  ScheduledReminderService.options = {
    orderBy: 'nextOccurrence',
    orderASC: true,
    orderAPI: {
      "order": { "nextOccurrence": "asc" }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  ScheduledReminderService.searchFields = [
    "value",
    "description",
    "color"
  ];
  ScheduledReminderService.searchExamples = [
    "name",
    "color",
  ];

  // call to get a reminder
  ScheduledReminderService.get = function(params, cache) {
    //Add ordering
    _.extend(params,ScheduledReminderService.options.orderAPI);

    if(!_.isEmpty(ScheduledReminderService.options.conditions)) {
      if(!params.conditions) {
        _.extend(params, {
          'conditions': _.clone(ScheduledReminderService.options.conditions)
        });
      }
      else {
        _.extend({
          'conditions': _.clone(ScheduledReminderService.options.conditions)
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
        ScheduledReminderService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, ScheduledReminderService.items);
        that.setupReminders(response.data);
        ScheduledReminderService.totals.active = _.size(ScheduledReminderService.items);
      });
    }

    return result;
  };

  ScheduledReminderService.initSocketHandlers = function() {
    socket.emit('remindersSubscribe', {id: socket.id});
    //Push notifications for a reminder
    socket.on('reminderUpdate', function(reminderUpdate) {
      var reminderId = null;
      var type = null;

      if (reminderUpdate.type == "add") {
        ScheduledReminderService.items.push(reminderUpdate.new_val);

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

      var itemsReminderKey = _.findKey(ScheduledReminderService.items, function(reminder) {
        return reminder.id === reminderId;
      });

      if(reminderUpdate.type == "change" && reminderUpdate.new_val.status !== -1) {
        ScheduledReminderService.items[itemsReminderKey] = _.extend(ScheduledReminderService.items[itemsReminderKey], reminderUpdate.new_val);

        //Refresh reminder status
        ScheduledReminderService.items[itemsReminderKey].updatedAt = new Date();
        return;
      }

      ScheduledReminderService.items.splice(itemsReminderKey, 1);
    });
  }

  ScheduledReminderService.setupReminders = function(reminders) {
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

  ScheduledReminderService.getById = function(id, params) {
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

  ScheduledReminderService.getMore = function(params) {
    //Add ordering
    _.extend(params,ScheduledReminderService.options.orderAPI);

    if (!_.isEmpty(ScheduledReminderService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(ScheduledReminderService.options.conditions)
      });
    }

    var result = $http.get(
      remindersApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      var index;
      _.forEach(response.data, function(item) {
        index = _.findIndex(ScheduledReminderService.items, {id: item.id});
        if (index === -1) {
          ScheduledReminderService.items.push(item);
          ScheduledReminderService.totals.active++;
        }
      });
    });
  };

  ScheduledReminderService.getTypes = function() {
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
      angular.copy(_.pluck(response.data, 'type'), ScheduledReminderService.types);
    });
  };

  ScheduledReminderService.updateGroups = function() {
    angular.copy(_.groupBy(ScheduledReminderService.items, 'type'), ScheduledReminderService.reminderGroups);

    // Add collapsable toggle
    _.each(ScheduledReminderService.reminderGroups, function(group) {
      group.isCollapsed = false;
    });
  };

  //Update user object array
  ScheduledReminderService.updateReminders = function(newReminder, action) {
    if (typeof action == "undefined") {
      action = 'update';
    }

    if (action == "add") {
      //If it doesn't match the current search end here
      if(!ScheduledReminderService.doesItemMatchSearch(newReminder)) {
        return;
      }

      if (_.indexOf(ScheduledReminderService.types, newReminder.type) == -1) {
        ScheduledReminderService.types.push(newReminder.type);
      }
      ScheduledReminderService.items.push(newReminder);
      ScheduledReminderService.totals.total++;
    } else if (action == "delete") {
      var index = _.findIndex(ScheduledReminderService.items, function(reminder) {return reminder.id == newReminder.id;});
      ScheduledReminderService.items.splice(index, 1);

      //If this was the only item in the group delete it
      if (ScheduledReminderService.reminderGroups[newReminder.type].length <= 1) {
        index = _.findIndex(ScheduledReminderService.types, function(type) {return type == newReminder.type;});
        ScheduledReminderService.types.splice(index, 1);
      }

      ScheduledReminderService.totals.total--;
    } else {
      var index = _.findIndex(ScheduledReminderService.items, function(reminder) {return reminder.id == newReminder.id;});
      ScheduledReminderService.items[index] = newReminder;
    }

    this.updateGroups();
    ScheduledReminderService.totals.active = ScheduledReminderService.items.length;
  };

  ScheduledReminderService.save = function(reminder) {
    if (reminder.id) {
      return this.update(reminder.id, reminder);
    }

    return this.create(reminder);
  };

  // call to POST and create a new reminder
  ScheduledReminderService.create = function(reminder) {
    return $http.post(remindersApiUrl, reminder)
      .then(function(result) {
        return result.data;
      });
  };

  ScheduledReminderService.update = function(id, reminder) {
    return $http.put(remindersApiUrl + '/' + id, reminder)
      .then(function(result) {
        return result.data;
      });
  };

  // Delete a reminder
  ScheduledReminderService.deleteReminder = function(reminder) {
    return this.update(reminder.id, {status: -1}).then(function(result) {
      return result;
    });
  };

  ScheduledReminderService.getFields = function(force) {
    if (!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(ScheduledReminderService.schema);
      }, 0);
    }

    return $http.get(remindersApiUrl + '/schema')
      .then(function(result) {
        ScheduledReminderService.schema = result.data[Object.keys(result.data)[0]];
        return ScheduledReminderService.schema;
      });
  };

  return ScheduledReminderService;
}]);
