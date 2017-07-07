
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
    var that = this;

    return this.agentRulesGateway.fetchAll(query).then(function(collection){
      return that.patchAgentRules(collection);
    });
  }

  // Placeholder
  patchAgentRules(collection)
  {
    return collection;
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

    return this.agentRuleGateway.create(agentRuleEntity)
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
   * Method update the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  update(data)
  {
    var agentRuleEntity = this.validateData(data);

    return this.agentRuleGateway.update(agentRuleEntity)
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
    return this.agentRuleGateway.delete(id);
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
