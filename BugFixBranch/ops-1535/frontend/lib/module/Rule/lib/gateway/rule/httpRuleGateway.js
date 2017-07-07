
"use strict";

const common              = require("opserve-common");
const HttpGateway         = common.gateway.HttpGateway;
const config              = common.Config.get();
const ItheonError         = common.error.BaseError;
var RuleEntity           = require("itheon-module-rule-entity").RuleEntity;
var RuleCollectionEntity = require("itheon-module-rule-entity").RuleCollectionEntity;

class HttpRuleGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/rules";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    return super.fetchAll(request).then(function(response){
      let ruleCollectionEntity = new RuleCollectionEntity(response.body);
      ruleCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return ruleCollectionEntity;
    });
  }

  create(ruleEntity)
  {
    if (!(ruleEntity instanceof RuleEntity)) {
      throw new ItheonError(
        "Invalid entity passed. Instance of RuleEntity expected",
        {
          ruleEntity: ruleEntity
        }
      );
    }

    return super.insert(ruleEntity)
      .then(function(ruleData) {
        return new RuleEntity(ruleData);
      });
  }

  update(ruleEntity)
  {
    if (!(ruleEntity instanceof RuleEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of RuleEntity expected");
    }

    if (!ruleEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(ruleEntity)
      .then(function(ruleData) {
        return new RuleEntity(ruleData);
      });
  }
}

module.exports = HttpRuleGateway;
