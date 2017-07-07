
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
var RuleEntity       = require("itheon-module-rule-entity").RuleEntity;

class RethinkDbRuleGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass gateway instance
   *
   * @param object gateway Mapper"s gateway(i.e. dbConnection)
   */
  constructor(gateway)
  {
    super(gateway);

    this.table = {
      "name": "Rule",
      "alias": "r"
    };
  }

  /**
   * Method fetches all records matching passed request"s criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new RuleEntity()];

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param RuleEntity ruleEntity Rule entity
   * @return Promise rule Promise of newly created rule entity
   */
  create(ruleEntity)
  {
    if (!(ruleEntity instanceof RuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Rule expected",
        {
          ruleEntity: ruleEntity
        },
        500
      );
    }

    return this.validateRulename(ruleEntity)
      .then(super.insert.bind(this))
      .then(function (ruleData) {
        return new RuleEntity(ruleData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param RuleEntity ruleEntity Rule entity
   * @return Promise rule Promise of newly created rule entity
   */
  update(ruleEntity)
  {
    if (!(ruleEntity instanceof RuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Rule expected",
        {
          ruleEntity: ruleEntity
        },
        500
      );
    }

    return super.update(ruleEntity)
      .then(function (ruleData) {
        return new RuleEntity(ruleData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param RuleEntity ruleEntity Rule entity
   * @return Promise rule Promise of newly created rule entity
   */
  replace(ruleEntity)
  {
    if (!(ruleEntity instanceof RuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Rule expected",
        {
          ruleEntity: ruleEntity
        }
      );
    }

    return super.replace(ruleEntity)
      .then(function (ruleData) {
        return new RuleEntity(ruleData);
      });
  }

  /**
   * Helper method validates rulename to be inserted
   *
   * @param RuleEntity ruleEntity Rule entity
   * @return Promise ruleEntity Promise of exception if rulename exists
   * otherwise promise of passed object
   */
  validateRulename(ruleEntity)
  {
    return this.dataProvider.table(this.table.name)
      .getAll(ruleEntity.get("rulename"), {index: "rulename"})
      .then(function(rules) {
        if (!_.isEmpty(rules)) {
          throw new GatewayError(
            "Rulename already in use",
            {
              rules: rules
            },
            409
          );
        }

        return ruleEntity;
      });
  }
}

module.exports = RethinkDbRuleGateway;
