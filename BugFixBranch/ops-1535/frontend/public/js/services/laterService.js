(function (angular) {
  'use strict';
  function angularLater($log, $window) {
    if (angular.isUndefined($window.later)) {
      $log.error('later.js is not available. Did you forget to include it?');
    }
    else {
      $window.later.date.localTime();
      return $window.later;
    }
  }
  angular.module('itheonApp').service('LaterService', ['$log', '$window', angularLater])
  .factory('timeoutStorage', ['LaterService', function (LaterService) {
    var timeouts = {}, intervals = {};

    return {
      setInterval: function (id, schedule, callback) {
        let sched = LaterService.parse.text(schedule),
        interval = LaterService.setInterval(callback, sched);
        intervals[id] = interval;
      },
      setTimeout: function (id, schedule, callback) {
        let sched = LaterService.parse.text(schedule),
        timeout = LaterService.setTimeout(callback, sched);
        timeouts[id] = timeout;
      },
      clearInterval: function (id) {
        clearInterval(intervals[id]);
        delete intervals[id];
      },
      clearTimeout: function (id) {
        clearTimeout(timeouts[id]);
        delete timeouts[id];
      }
    };
  }]);
})(angular);
