
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
var AclRoleEntity    = require("itheon-module-acl-entity").AclRoleEntity;

class RethinkDbAclRoleGateway extends RethinkDbGateway
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
      "name": "AclRole",
      "alias": "arol"
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
    var entities = [new AclRoleEntity()];

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param AclRoleEntity aclRoleEntity AclRole entity
   * @return Promise aclRole Promise of newly created aclRole entity
   */
  create(aclRoleEntity)
  {
    if (!(aclRoleEntity instanceof AclRoleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRole expected",
        {
          aclRoleEntity: aclRoleEntity
        },
        500
      );
    }

    return this.insert(aclRoleEntity)
      .then(function (aclRoleData) {
        return new AclRoleEntity(aclRoleData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param AclRoleEntity aclRoleEntity AclRole entity
   * @return Promise aclRole Promise of newly created aclRole entity
   */
  update(aclRoleEntity)
  {
    if (!(aclRoleEntity instanceof AclRoleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRole expected",
        {
          aclRoleEntity: aclRoleEntity
        },
        500
      );
    }

    return super.update(aclRoleEntity)
      .then(function (aclRoleData) {
        return new AclRoleEntity(aclRoleData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param AclRoleEntity aclRoleEntity AclRole entity
   * @return Promise aclRole Promise of newly created aclRole entity
   */
  replace(aclRoleEntity)
  {
    if (!(aclRoleEntity instanceof AclRoleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclRole expected",
        {
          aclRoleEntity: aclRoleEntity
        }
      );
    }

    return super.replace(aclRoleEntity)
      .then(function (aclRoleData) {
        return new AclRoleEntity(aclRoleData);
      });
  }
}

module.exports = RethinkDbAclRoleGateway;
