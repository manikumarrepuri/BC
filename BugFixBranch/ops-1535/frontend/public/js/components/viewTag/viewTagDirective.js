
angular.module('itheonApp').directive('viewTag', ['TagService', 'moment', function(TagService, moment) {

  "use strict";

  return {
    scope: {},
    controllerAs: 'tagCtrl',
    controller: function($element, $scope) {
      var ctrl = this;
      $scope.isNumber = angular.isNumber;
      ctrl.tag = {};
      // ctrl.device = {};
      // ctrl.thresholdsForm = {};
      // ctrl.tagStatus = '???';

      ctrl.toggleTagDetails = function(removeClass) {
        const mainPage = $('.main-page');
        const className = 'togglePane';

        if (typeof removeClass == 'undefined') removeClass = true;

        if(removeClass) $('table.table-tags > tbody > tr').removeClass("active");
        $element.find('.tag-sidebar').toggleClass("module-sidebar-open");

        if (mainPage.hasClass(className)) {
          mainPage.removeClass(className);
        } else {
          mainPage.addClass(className);
        }

        $(window).resize();


      };

      $scope.$on('loadTag', function($event, data) {
        var tag = data[0];
        var key = data[1];

        ctrl.oldTag = (ctrl.tag) ? ctrl.tag : {};

        //If the tag isn't defined we'll need to grab it
        if (!tag) {
          TagService.getById(key).then(function(tag) {
            ctrl.tag = tag;
          });
        } else {
          ctrl.tag = tag;
        }

        if(Object.keys(ctrl.oldTag).length === 0 ||
           (!$element.find('aside').hasClass("module-sidebar-open") ||
            (ctrl.oldTag.id === ctrl.tag.id))) {
           ctrl.toggleTagDetails(false);
        }
      });

      // ctrl.getTagDetails = function(tag) {
      //   //Retrieve host information
      //   DeviceService.getByName(tag.name,tag.group).then(function(result){
      //     //The search seems to return multiple results in some cases
      //     var device = (result[tag.deviceId]) ? result[tag.deviceId] : Object.keys(result)[0];

      //     //If we can't find it set the device to what we've got in the tag
      //     if(!_.isObject(device)){
      //       device = {};
      //       device.displayName = tag.name;
      //       device.group = tag.group;
      //       device.status = '???'; //We don't know about the device so how can we know it's status?
      //       device.tagsCount = 0;
      //       device.createdAt = tag.createdAt;
      //     }

      //     device.createdAt = new Date(device.createdAt);
      //     ctrl.device = device;
      //   });

      //   ctrl.oldTag = (ctrl.tag) ? ctrl.tag : {};

      //   tag.firstOccurrence = moment.unix(tag.firstOccurrence / 1000);
      //   tag.lastOccurrence = moment.unix(tag.lastOccurrence / 1000);

      //   ctrl.tag = tag;

      //   //Retrieve event history
      //   TagService.getHistoryCount(tag).then(function(result){
      //     ctrl.tag.total = result.total;
      //     ctrl.tag.weekCount = result.weekCount;
      //     ctrl.tag.avgTimeToClose = result.avgTimeToClose;
      //   });

      //   //Check if the tag has even changed and if it has if the panel is already open
      //   if(Object.keys(ctrl.oldTag).length === 0 ||
      //      (!$element.find('aside').hasClass("module-sidebar-open") ||
      //       (ctrl.oldTag.id === ctrl.tag.id))) {
      //      ctrl.toggleTag(false);
      //   }

      //   $element.find('.form-hidden').addClass('hide');
      // };
    },
    templateUrl: '/static/js/components/viewTag/viewTag.html'
  };
}]);
