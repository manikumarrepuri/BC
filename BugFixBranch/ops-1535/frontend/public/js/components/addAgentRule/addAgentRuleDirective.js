angular.module('itheonApp').directive('addAgentRule', ['AgentRuleService', 'FileUploader', '_', function(AgentRuleService, FileUploader, _){
  return {
    scope: {},
    controllerAs: 'addAgentRuleCtrl',
    controller: function($element) {
      var ctrl = this;

      ctrl.uploader = new FileUploader();
      ctrl.config = AgentRuleService.config;

      //Form controls
      ctrl.addAgentRuleForm = {};
      ctrl.addAgentRuleForm.name = '';
      ctrl.addAgentRuleForm.fileName = '';
      ctrl.addAgentRuleForm.description = '';
      ctrl.addAgentRuleForm.version = '';
      ctrl.addAgentRuleForm.tags = [];
      ctrl.addAgentRuleForm.content = '';
      ctrl.errorMessage = '';

      ctrl.toggleAddAgentRule = function() {
        $element.find('.add-agent-rule-sidebar').toggleClass('module-sidebar-open');
      }

      ctrl.addAgentRule = function(form) {
        var fields = {};

        //If the form hasn't been altered do nothing
        if(form.$pristine || form.$invalid) {
          console.warn('Failed to add agent rule, invalid form submission');
          return false;
        }

        //get the values and only send what's been changed
        angular.forEach(form, function (control, key) {
          if (typeof control === 'object' && control.hasOwnProperty('$modelValue')) {
            if(control.$dirty) {
              //Arrays are a bit different
              if(_.isArray(control.$modelValue)) {
                var tmp = [];
                _.each(control.$modelValue, function(tag){
                  tmp.push(tag.group + ":" + tag.type + ":" + tag.value);
                })
                fields[key] = tmp;
                return;
              }

              if(key == "textContent" || key == "fileContent") {
                fields['content'] = control.$modelValue;
                return;
              }

              fields[key] = control.$modelValue;
            }
          }
        });

        //If the filename isn't set use the name
        if(!fields['fileName']) {
          fields['fileName'] = fields['name'];
        }

        fields['version'] = Date.now() / 1000 | 0
        fields['status'] = 1;

        AgentRuleService.save(fields).then(function(result){
          $element.find('.update-success').removeClass('hide');
          setTimeout(function() {
            $('.update-success').addClass('hide');
          }, 2000);
        }, function(error){
          ctrl.errorMessage = error.data.message;
          //Failed to update thresholds
          $element.find('.update-failed').removeClass('hide');
          setTimeout(function() {
            $('.update-failed').addClass('hide');
          }, 2000);
        });
      };
    },
    templateUrl: '/static/js/components/addAgentRule/addAgentRule.html'
  };
}]);
