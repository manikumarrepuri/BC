
"use strict";

var appRootPath          = require("app-root-path");
var RuleEntity           = require("itheon-module-rule-entity").RuleEntity;
var RuleCollectionEntity = require("itheon-module-rule-entity").RuleCollectionEntity;
const common             = require("opserve-common");
const _                  = common.utilities.underscore;
const ItheonError        = common.error.BaseError;
const Request            = common.Request;


class RulesService
{
  constructor(ruleGateway, gatewayType)
  {
    this.setGateway(ruleGateway, gatewayType);
  }

  setGateway(ruleGateway, gatewayType)
  {
    if (!ruleGateway) {
      var RuleGateway = require("../gateway/rule/rethinkDbRuleGateway");
      ruleGateway = new RuleGateway();
    }

    this.ruleGateway = ruleGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var ruleEntity = new RuleEntity();
    return {
      "rule": ruleEntity.getFields()
    };
  }

  /**
   * Method gets all rules matching passed query
   * @param  {[type]}   query    [description]
   * @return {[type]}            [description]
   */
  find(request)
  {
    request = request || new Request();
    var that = this;
    return this.ruleGateway.fetchAll(request)
      .then(function(collection) {
        var ruleCollectionEntity = new RuleCollectionEntity();
        ruleCollectionEntity.setAllowAnyField(true);
        return ruleCollectionEntity.inflate(collection);
      }).then(function(ruleCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.ruleGateway.fetchAll(request)
          .then(function(totalNumberOfRules) {
            return ruleCollectionEntity.setTotalCount(totalNumberOfRules);
          });
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
    var ruleEntity = this.validateData(data);

    return this.ruleGateway.create(ruleEntity)
      .then(function (ruleData) {
        if (ruleData.errorCode) {
          throw new ItheonError(
            ruleData.message,
            ruleData.data,
            ruleData.errorCode
          );
        }

        return new RuleEntity(ruleData);
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
    var ruleEntity = this.validateData(data);

    return this.ruleGateway.update(ruleEntity)
      .then(function (ruleData) {
        if (ruleData.errorCode) {
          throw new ItheonError(
            ruleData.message,
            ruleData.data,
            ruleData.errorCode
          );
        }

        return new RuleEntity(ruleData);
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
    return this.ruleGateway.delete(id);
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

    return new RuleEntity(data);
  }
}

module.exports = RulesService;
