angular.module('itheonApp').directive('appFooter', function() {
  return {
    scope: {},
    controllerAs: 'footerCtrl',
    controller: function() {
      var ctrl = this;
      ctrl.version = "0.1.0-alpha"
      ctrl.date = new Date();
      ctrl.year = ctrl.date.getFullYear();
    },
    templateUrl: '/static/js/components/footer/footer.html'
  }
});
