
"use strict";

var appRootPath               = require("app-root-path");
var AgentRuleEntity           = require("itheon-module-agent-rule-entity").AgentRuleEntity;
var AgentRuleCollectionEntity = require("itheon-module-agent-rule-entity").AgentRuleCollectionEntity;
var uuid                      = require('uuid');
const common                  = require("opserve-common");
const _                       = common.utilities.underscore;
const ItheonError             = common.error.BaseError;
const Request                 = common.Request;

class AgentRulesService
{
  constructor(agentRuleGateway, gatewayType)
  {
    this.setGateway(agentRuleGateway, gatewayType);
  }

  setGateway(agentRuleGateway, gatewayType)
  {
    if (!agentRuleGateway) {
      var AgentRuleGateway = require("../gateway/agentRule/rethinkDbAgentRuleGateway");
      agentRuleGateway = new AgentRuleGateway();
    }

    this.agentRuleGateway = agentRuleGateway;
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
   * @return {[type]}            [description]
   */
  find(query)
  {
    query = query || new Request();
    query.appendConditions({status: 1});
    return this.agentRuleGateway.fetchAll(query)
      .then(function(collection) {
        var agentRuleCollectionEntity = new AgentRuleCollectionEntity();
        agentRuleCollectionEntity.setAllowAnyField(true);
        return agentRuleCollectionEntity.inflate(collection);
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

    if(!agentRuleEntity.agentRuleId) {
      agentRuleEntity.id = uuid.v4();
      agentRuleEntity.agentRuleId = agentRuleEntity.id;
    }

    return this.agentRuleGateway.create(agentRuleEntity)
      .then(function (agentRuleData) {
        if(agentRuleData.errorCode) {
          throw new ItheonError(agentRuleData.message, agentRuleData.data, agentRuleData.errorCode);
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
          throw new ItheonError(agentRuleData.message, agentRuleData.data, agentRuleData.errorCode);
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

  /**
   * Method gets agentRules by tag specificity
   */
  tagMatch(request)
  {
    return this.agentRuleGateway.tagMatch(request.getConditions().tags, request.getConditions().name, request.getConditions().version)
      .then(function(collection) {
        var agentRuleCollectionEntity = new AgentRuleCollectionEntity();
        agentRuleCollectionEntity.setAllowAnyField(true);
        return agentRuleCollectionEntity.inflate(collection);
      });
  }

}

module.exports = AgentRulesService;
