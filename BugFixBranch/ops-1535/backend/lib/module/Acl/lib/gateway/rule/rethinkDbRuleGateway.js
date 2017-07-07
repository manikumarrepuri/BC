
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
var AclRuleEntity       = require("itheon-module-aclRule-entity").AclRuleEntity;

class RethinkDbAclRuleGateway extends RethinkDbGateway
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
      "name": "AclRule",
      "alias": "ar"
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
    var entities = [new AclRuleEntity()];

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param AclRuleEntity aclRuleEntity AclRule entity
   * @return Promise aclRule Promise of newly created aclRule entity
   */
  create(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRule expected",
        {
          aclRuleEntity: aclRuleEntity
        },
        500
      );
    }

    return this.insert(aclRuleEntity)
      .then(function (aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param AclRuleEntity aclRuleEntity AclRule entity
   * @return Promise aclRule Promise of newly created aclRule entity
   */
  update(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRule expected",
        {
          aclRuleEntity: aclRuleEntity
        },
        500
      );
    }

    return super.update(aclRuleEntity)
      .then(function (aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param AclRuleEntity aclRuleEntity AclRule entity
   * @return Promise aclRule Promise of newly created aclRule entity
   */
  replace(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRule expected",
        {
          aclRuleEntity: aclRuleEntity
        }
      );
    }

    return super.replace(aclRuleEntity)
      .then(function (aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }
}

module.exports = RethinkDbAclRuleGateway;
