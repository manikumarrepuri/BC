
"use strict";

var AgentRuleEntity           = require("itheon-module-agent-rule-entity").AgentRuleEntity;
var AgentRuleCollectionEntity = require("itheon-module-agent-rule-entity").AgentRuleCollectionEntity;
const common                  = require("opserve-common");
const config                  = common.Config.get();
const HttpGateway             = common.gateway.HttpGateway;
const ItheonError             = common.error.BaseError;

class HttpAgentRuleGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/agent-rules";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    this.dataProvider.apiUrl = "/agent-rules";
    return super.fetchAll(request).then(function(response){
      var agentRuleCollectionEntity = new AgentRuleCollectionEntity();
      agentRuleCollectionEntity.setAllowAnyField(true);
      agentRuleCollectionEntity.inflate(response.body);
      agentRuleCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return agentRuleCollectionEntity;
    });
  }

  agentUpdate(request)
  {
    this.dataProvider.apiUrl = "/agent-rules/tag-match";
    return super.fetchAll(request).then(function(response){
      var agentRuleCollectionEntity = new AgentRuleCollectionEntity();
      agentRuleCollectionEntity.setAllowAnyField(true);
      agentRuleCollectionEntity.inflate(response.body);
      agentRuleCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return agentRuleCollectionEntity;
    });
  }

  create(agentRuleEntity)
  {
    if (!(agentRuleEntity instanceof AgentRuleEntity)) {
      throw new ItheonError(
        "Invalid entity passed. Instance of AgentRuleEntity expected",
        {
          agentRuleEntity: agentRuleEntity
        }
      );
    }

    this.dataProvider.apiUrl = "/agent-rules";
    return super.insert(agentRuleEntity)
      .then(function(agentRuleData) {
        return new AgentRuleEntity(agentRuleData);
      });
  }

  update(agentRuleEntity)
  {
    if (!(agentRuleEntity instanceof AgentRuleEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of AgentRuleEntity expected");
    }

    if (!agentRuleEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    this.dataProvider.apiUrl = "/agent-rules";
    return super.update(agentRuleEntity)
      .then(function(agentRuleData) {
        return new AgentRuleEntity(agentRuleData);
      });
  }
}

module.exports = HttpAgentRuleGateway;
