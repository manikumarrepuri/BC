
"use strict";

var appRootPath       = require("app-root-path");
var RethinkDbGateway  = require("itheon-gateway").RethinkDbGateway;
var AclRuleEntity     = require("itheon-module-acl-entity").AclRuleEntity;
var AclRoleEntity     = require("itheon-module-acl-entity").AclRoleEntity;
var AclResourceEntity = require("itheon-module-acl-entity").AclResourceEntity;
var _                 = require("itheon-utility").underscore;
var GatewayError = require("itheon-gateway").GatewayError;

class RethinkDbAclRuleGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass gateway instance
   *
   * @param object gateway Mapper's gateway(i.e. dbConnection)
   */
  constructor(gateway)
  {
    super(gateway);

    this.table = {
      "name": "AclRule",
      "alias": "acl-rul"
    };

    /**
     * Object describing aclRule's relation
     *
     * @type Object
     */
    this.relations = {
      "acl-resource": {
        "table": "AclResource",
        "localColumn": "resource",
        "targetColumn": "id",
        "defaultAlias": "acl-res"
      },
      "acl-role": {
        "table": "AclRole",
        "localColumn": "role",
        "targetColumn": "id",
        "defaultAlias": "acl-rol"
      }
    };
  }

  /**
   * Method fetches all records matching passed request's criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new AclRuleEntity()];
    var joins = request.getJoins();
    if (_.contains(joins, "acl-resource")) {
      entities.push(new AclResourceEntity());
    }
    if (_.contains(joins, "acl-role")) {
      entities.push(new AclRoleEntity());
    }
    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param AclRule aclRuleEntity AclRule entity
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

    // var parent = super;
    return super.insert(aclRuleEntity)
      .then(function (aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param AclRule aclRuleEntity AclRule entity
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
   * @param AclRule aclRuleEntity AclRule entity
   * @return Promise aclRule Promise of newly created aclRule entity
   */
  replace(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRule expected"
      );
    }

    return super.replace(aclRuleEntity)
      .then(function (aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }
}

module.exports = RethinkDbAclRuleGateway;
