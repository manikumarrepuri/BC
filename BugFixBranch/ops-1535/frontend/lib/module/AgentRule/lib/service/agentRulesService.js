"use strict";

var AgentRuleEntity           = require("itheon-module-agent-rule-entity").AgentRuleEntity;
const common                  = require("opserve-common");
const _                       = common.utilities.underscore;
const ItheonError             = common.error.BaseError;
const Request                 = common.Request;

/**
 * AgentRules service class definition
 */
class AgentRulesService
{
  constructor(agentRulesGateway)
  {
    this.setGateway(agentRulesGateway);
  }

  setGateway(agentRulesGateway)
  {
    if (!agentRulesGateway) {
      var AgentRulesGateway = require("../gateway/agentRule/httpAgentRuleGateway");
      agentRulesGateway = new AgentRulesGateway();
    }

    this.agentRulesGateway = agentRulesGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/agentRules
  */
  getSchema()
  {
    var agentRuleEntity = new AgentRuleEntity();
    return {
      "agentRule": agentRuleEntity.getFields()
    };
  }

  /**
   * Method gets all agentRules matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(query)
  {
    query = query || new Request();
    var conditions = query.getConditions();
    conditions.status = 1;
    query.setConditions(conditions);

    var that = this;

    return this.agentRulesGateway.fetchAll(query).then(function(collection){
      return that.patchAgentRules(collection);
    });
  }

  /**
   * Method gets all agentRules matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  agentUpdate(query)
  {
    query = query || new Request();
    var that = this;

    return this.agentRulesGateway.agentUpdate(query).then(function(collection){
      var list = '';
      _(collection.export()).forEach(function(rule, key) {
        list += rule.name + "," + rule.platform + "," + rule.version + ".0," + "*\n";
      });
      return list;
    });
  }

  /**
   * Method get's the latest version of an agentRule matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  getLatestAgentRule(query)
  {
    query = query || new Request();
    var that = this;

    return this.agentRulesGateway.agentUpdate(query).then(function(collection){
      var tmp = collection.export();
      return tmp[Object.keys(tmp)[0]];
    });
  }

  // Placeholder
  patchAgentRules(collection)
  {
      var that = this;
    _(collection.export()).forEach(function(rule, key) {

      if(!rule.reduction) {
        rule.versionDisplay = new Date(rule.version*1000);
        _.extend(rule, that.patchSuccess(rule.results));
        //Update the collection
        collection.updateEntity(rule);
        return;
      }

      var newRule = {};
      newRule = _.clone(rule.reduction[0]);
      newRule.versionDisplay = new Date(newRule.version * 1000);
      newRule.versions = {};
      _.each(rule.reduction, function(version, id){
        newRule.versions[version.version] = {};
        newRule.versions[version.version].versionDisplay = new Date(version.version * 1000);
        newRule.versions[version.version].details = version.content;
        _.extend(newRule.versions[version.version], that.patchSuccess(version.results));
      });

      delete newRule.results;
      delete newRule.reduction;
      delete newRule.group;

      collection.addEntity(newRule);
      collection.deleteEntity(key);
    });

    return collection;
  }

  patchSuccess(results) {
    //Patch information about server state's
    var started=0,failed=0,success=0;
    var startedDevices='',failedDevices='',successDevices='';
    _.each(results, function(result, id){
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

    properties.failed = {
      count: failed,
      devices: failedDevices
    };
    properties.started = {
      count: started,
      devices: startedDevices
    };
    properties.success = {
      count: success,
      devices: successDevices
    };

    return properties;
  }

  /**
   * Method gets single agentRule by passed id
   * @param  {[type]} id      [description]
   * @return {[type]} promise [description]
   */
  getAgentRulesByIds(deviceId, object)
  {
    var that = this;
    var aSyncFunctions = [];
    var query = new Request();

    _.each(object, function(notUsed, agentRuleName) {
      query.setConditions({"deviceId": deviceId, "name": agentRuleName});

      aSyncFunctions.push(new Promise(function(resolve, reject) {
        return that.agentRulesGateway.sendGetRequest(query).then(function(agentRule) {
          if (!_.isArray(agentRule)) reject('nothing found');
          resolve(agentRule);
        });
      }));
    });

    //Resolve the promises and merge the keys
    return Promise.all(aSyncFunctions).then(function(results) {
      var agentRules = [];
      //Loop through the results from the nodes
      for (var i = 0; i < results.length; i++) {
        agentRules.push({'id': results[i][0].id, 'data': results[i][0]});
      }
      return agentRules;
    });
  }

  /**
   * Method creates the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  create(data)
  {
    var agentRuleEntity = this.validateData(data);

    //Add the current timestamp
    agentRuleEntity.version = Math.round(new Date().getTime()/1000);
    //Patch up comments if need be.
    agentRuleEntity.content = agentRuleEntity.content.replace('{nextVersion}', agentRuleEntity.version);

    return this.agentRulesGateway.create(agentRuleEntity)
      .then(function (agentRuleData) {
        if(agentRuleData.errorCode) {
          throw new ItheonError(
            agentRuleData.message,
            agentRuleData.data,
            agentRuleData.errorCode
          );
        }

        return new AgentRuleEntity(agentRuleData);
      });
  }

  /**
   * Method generates update for the incoming agentUpdater event
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  processUpdate(data)
  {
    var deviceId = data.deviceId;
    delete data.deviceId;

    //Parse the string and generate our object
    data.ruleName = data.brief.match(/(?:Process\s|Package\s)(.*?)(?: update)/)[1];
    data.status = data.brief.match(/started|success|failed/)[0];
    var versions = data.brief.match(/Unknown|[0-9]{10,}/g);
    data.oldVersion = versions[0];
    data.time = Date.now() / 1000 | 0
    delete data.brief;

    //Create our request for tag matching.
    var query = new Request();
    var hostParts = deviceId.split(':');
    var tags = [
      "system:customer:" + hostParts[0],
      "system:host:" + hostParts[1]
    ];

    query.setConditions({"tags": tags, "name": data.ruleName, "version": versions[1]});

    var that = this;
    return this.agentRulesGateway.agentUpdate(query).then(function(collection){
      delete data.ruleName;

      var tmp = collection.export();
      var id = tmp[Object.keys(tmp)[0]].id;

      return that.update({
        id: id,
        results: {
          [deviceId]: data
        }
      });
    });
  }

  /**
   * Method update the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  update(data)
  {
    var agentRuleEntity = this.validateData(data);

    return this.agentRulesGateway.update(agentRuleEntity)
      .then(function (agentRuleData) {
        if(agentRuleData.errorCode) {
          throw new ItheonError(
            agentRuleData.message,
            agentRuleData.data,
            agentRuleData.errorCode
          );
        }

        return new AgentRuleEntity(agentRuleData);
      });
  }

  /**
   * Method delete the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  delete(id)
  {
    return this.agentRulesGateway.delete(id);
  }

  /**
   * Method checks data for create/update method
   *
   * @param object data Object with data
   */
  validateData(data)
  {
    if (!_.isObject(data)) {
      throw new ItheonError(
        "Invalid data provided. Object describing entity properties expected.",
        {
          data: data
        }
      );
    }

    return new AgentRuleEntity(data);
  }
}

module.exports = AgentRulesService;
