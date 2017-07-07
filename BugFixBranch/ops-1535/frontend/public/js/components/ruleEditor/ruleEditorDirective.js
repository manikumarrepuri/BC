angular.module('itheonApp').directive('ruleEditor', function() {
  return {
    scope: {},
    controllerAs: 'ruleEditorCtrl',
    controller: function() {
      var ctrl = this;
    },
    templateUrl: '/static/js/components/ruleEditor/ruleEditor.html'
  }
});
