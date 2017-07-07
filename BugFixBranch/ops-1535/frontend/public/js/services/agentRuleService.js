var agentRuleService = angular.module('AgentRuleService', ['underscoreService']);

agentRuleService.factory('AgentRuleService', ['$http', '$timeout', '$q', '_', 'SearchService', 'SortService', function($http, $timeout, $q, _, SearchService, SortService) {

  "use strict";

  var AgentRuleService = angular.extend({}, SearchService, SortService);
  var agentRulesApiUrl = '/api/agent-rules';
  AgentRuleService.schema = {};
  AgentRuleService.loaded = false;
  AgentRuleService.globalAgentRule = {};
  AgentRuleService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  AgentRuleService.items = [];
  AgentRuleService.options={
    orderBy: 'name',
    orderASC: true,
    orderAPI: {
      "order": {
        "name": {
          "field":"name",
          "modifier":"lowercase",
          "order":"asc"
        }
      }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  AgentRuleService.searchFields=[
    "name",
    "description"
  ];
  AgentRuleService.searchExamples=[
    "cpu|memory",
    "cpu|memory"
  ];
  AgentRuleService.config = {
    autocomplete: [
      {
        words: [/\brule\b/gi, /\b(end_)?macro\b/gi],
        cssClass: 'highlight ruleMain'
      },
      {
        words: [/condition/gi, /selection/gi, 'SCHEDULE', 'INTERVAL', 'COLLECT STATISTICS', /calculate/gi, /\b(error_)?action\b/gi, 'ERROR_ACTION'],
        cssClass: 'highlight ruleSections'
      },
      {
        words: [/\s{1,}and\s{1,}/gi, /\s{1,}or\s{1,}/gi, /\bif|else|then|end_if\b/gi, 'VARIABLE'],
        cssClass: 'highlight ruleCondtions'
      },
      //{
      //  words: [/(?=([^"]*"[^"]*")*[^"]*$)LOG/gi, /(?=([^"]*"[^"]*")*[^"]*$)EVENT/gi, /(?=([^"]*"[^"]*")*[^"]*$)WRITE_VARIABLE/gi,
      //  /(?=([^"]*"[^"]*")*[^"]*$)FORWARD/gi, /(?=([^"]*"[^"]*")*[^"]*$)FORWARD_DEC/gi, /(?=([^"]*"[^"]*")*[^"]*$)MAIL/gi,
      //  /(?=([^"]*"[^"]*")*[^"]*$)SNMP_TRAP/gi, /(?=([^"]*"[^"]*")*[^"]*$)PAGE/gi, /(?=([^"]*"[^"]*")*[^"]*$)EXECUTE OS_COMMAND/gi,
      //  /(?=([^"]*"[^"]*")*[^"]*$)MCC_EVENT/gi, /(?=([^"]*"[^"]*")*[^"]*$)TEC_EVENT/gi, /(?=([^"]*"[^"]*")*[^"]*$)TNG_EVENT/gi,
      //  /(?=([^"]*"[^"]*")*[^"]*$)ITO_EVENT/gi],
      //  cssClass: 'highlight ruleActions'
      //},
      {
        words: [/AUTHORITY\s?=/gi, /BCC\s?=/gi, /CC\s?=/gi, /COMMUNITY\s?=/gi, /CONTEXT\s?=/gi, /FAIL\s?=/gi, /FILE\s?=/gi, /FROM\s?=/gi, /ID\s?=/gi, /LEVEL\s?=/gi, /MESSAGE\s?=/gi,
                /NODE\s?=/gi, /OS_COMMAND\s?=/gi, /ORIGINATOR\s?=/gi, /REPLACE\s?=/gi, /SHELL\s?=/gi, /SMTP_SERVER\s?=/gi, /SUBJECT\s?=/gi, /\bTEXT([0-9]{1,2})?\s?=\b/gi, /TO\s?=/gi, /(?![^\(]*\))TYPE\s?/gi,
                /VALUE\s?=/gi],
        cssClass: 'highlight ruleActionOptions'
      },
      {
        words: [/{(.*?)}/gi],
        cssClass: 'highlight ruleVariables'
      },
      {
        words: [/!\s{1}.*/g],
        cssClass: 'highlight ruleComments'
      }
    ],
    dropdown: []
  };

  // call to get a agentRule
  AgentRuleService.get = function(params, cache) {
    params = params || {};
    _.extend(params, {
      'group': 'agentRuleId',
      'max': 'version'
    });

    //Add ordering
    _.extend(params, AgentRuleService.options.orderAPI);
    params.group = "agentRuleId";

    if(!_.isEmpty(AgentRuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AgentRuleService.options.conditions)
      });
    }

    var result = $http.get(
      agentRulesApiUrl + '?' + $.param(params)
    );

    if (cache) {
      // storing data
      return result.then(function(response) {
        AgentRuleService.totals.total = response.headers('X-Total-Count');
        angular.copy(response.data, AgentRuleService.items);
        AgentRuleService.totals.active = _.size(AgentRuleService.items);
      });
    }

    return result;
  };

  AgentRuleService.getById = function(id, params) {
    params = params || {};
    _.extend(params, {
      'conditions': {
        'agentRuleId': id
      },
      'group': 'agentRuleId'
    });

    params.group = "agentRuleId";

    var result = $http.get(
      agentRulesApiUrl + '?' + $.param(params)
    );

    return result.then(function(response) {
      return response.data[0];
    });
  };

  AgentRuleService.getMore = function(params) {
    _.extend(params, {
      'group': 'agentRuleId',
      'max': 'version'
    });

    //Add ordering
    _.extend(params,AgentRuleService.options.orderAPI);

    if(!_.isEmpty(AgentRuleService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(AgentRuleService.options.conditions)
      });
    }

    var result = $http.get(
      agentRulesApiUrl + '?' + $.param(params)
    );

    // formatting data
    return result.then(function(response) {
      _.extend(AgentRuleService.items, response.data);
      AgentRuleService.totals.active += _.size(response.data);
    });
  };

  AgentRuleService.save = function(agentRule) {
    if (agentRule.id) {
      return this.update(agentRule.id, agentRule);
    }

    return this.create(agentRule);
  };

  // call to POST and create a new agentRule
  AgentRuleService.create = function(agentRule) {
    return $http.post(agentRulesApiUrl, agentRule)
      .then(function(result) {
        return result.data;
      });
  };

  AgentRuleService.update = function(id, agentRule) {
    return $http.put(agentRulesApiUrl + '/' + id, agentRule)
      .then(function(result) {
        return result.data;
      });
  };

  //Update user object array
  AgentRuleService.updateAgentRules = function(newAgentRule, $element) {
    //Patch agentRules
    if(newAgentRule.new_val) {
      newAgentRule.new_val.versionDisplay = new Date(newAgentRule.new_val.version * 1000);
    }

    var agentRule = newAgentRule.new_val;
    if(newAgentRule['type'] == "remove") {
      agentRule = newAgentRule.old_val;
    }

    var agentRuleIndex = _.findIndex(AgentRuleService.items, function(rule) {
      return rule.agentRuleId == agentRule.agentRuleId;
    });


    //Handle change
    if (newAgentRule['type'] == "remove" ) {
      AgentRuleService.removeAgentRule(agentRuleIndex, $element);
      return;
    }

    //TODO: Patch information about server state's we are duplicating code we need to fix this.
    var started=0,failed=0,success=0;
    var startedDevices='',failedDevices='',successDevices='';
    _.each(agentRule.results, function(result, id){
      switch (result.status) {
        case "failed":
          failed++;
          failedDevices += '<dl class="agentUpdater"><dt>Device:</dt>' +
                           '<dd>' + id + '</dd>' +
                           '<dt>Previous version:</dt>' +
                           '<dd>' + result.oldVersion  + '</dd>' +
                           '<dt>Updated at:</dt>' +
                           '<dd><date>' + new Date(result.time *1000) + '<date></dd></dl>' ;
          break;
        case "started":
          started++;
          startedDevices += '<dl class="agentUpdater"><dt>Device:</dt>' +
                           '<dd>' + id + '</dd>' +
                           '<dt>Previous version:</dt>' +
                           '<dd>' + result.oldVersion  + '</dd>' +
                           '<dt>Updated at:</dt>' +
                           '<dd><date>' + new Date(result.time *1000) + '<date></dd></dl>' ;
          break;
        case "success":
          success++;
          successDevices += '<dl class="agentUpdater"><dt>Device:</dt>' +
                           '<dd>' + id + '</dd>' +
                           '<dt>Previous version:</dt>' +
                           '<dd>' + result.oldVersion  + '</dd>' +
                           '<dt>Updated at:</dt>' +
                           '<dd><date>' + new Date(result.time *1000) + '<date></dd></dl>' ;
          break;
      }
    });

    var properties = {};

    agentRule.failed = {
      count: failed,
      devices: failedDevices
    };
    agentRule.started = {
      count: started,
      devices: startedDevices
    };
    agentRule.success = {
      count: success,
      devices: successDevices
    };

    if (agentRuleIndex == -1) {
      AgentRuleService.items.unshift(agentRule);
      AgentRuleService.totals.total++;
    } else if (agentRule.status == -1) {
      AgentRuleService.removeAgentRule(agentRuleIndex, $element);
    } else {
      AgentRuleService.items[agentRuleIndex] = _.extend(AgentRuleService.items[agentRuleIndex], agentRule);
    }


    AgentRuleService.totals.active = AgentRuleService.items.length;
  };

  AgentRuleService.removeAgentRule = function (agentRuleIndex, $element) {
    AgentRuleService.items.splice(agentRuleIndex, 1);
    AgentRuleService.totals.total--;
    $element.find('aside').removeClass("module-sidebar-open");
  };

  // Delete a agentRule
  AgentRuleService.deleteAgentRule = function(agentRule) {
    return this.update(agentRule.id, {status: -1}).then(function(result) {
      return result;
    });
  };

  AgentRuleService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(AgentRuleService.schema);
      }, 0);
    }

    return $http.get(agentRulesApiUrl + '/schema')
      .then(function(result) {
        AgentRuleService.schema = result.data[Object.keys(result.data)[0]];
        return AgentRuleService.schema;
      });
  };

  return AgentRuleService;
}]);
