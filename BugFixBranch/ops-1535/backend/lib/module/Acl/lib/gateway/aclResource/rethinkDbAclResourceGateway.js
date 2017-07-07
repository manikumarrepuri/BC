
"use strict";

var appRootPath         = require("app-root-path");
const common            = require("opserve-common");
const _                 = common.utilities.underscore;
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const GatewayError      = common.gateway.GatewayError;
var AclResourceEntity = require("itheon-module-acl-entity").AclResourceEntity;

class RethinkDbAclResourceGateway extends RethinkDbGateway
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
      "name": "AclResource",
      "alias": "aresource"
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
    var entities = [new AclResourceEntity()];

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param AclResourceEntity aclResourceEntity AclResource entity
   * @return Promise aclResource Promise of newly created aclResource entity
   */
  create(aclResourceEntity)
  {
    if (!(aclResourceEntity instanceof AclResourceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclResource expected",
        {
          aclResourceEntity: aclResourceEntity
        },
        500
      );
    }

    return this.insert(aclResourceEntity)
      .then(function (aclResourceData) {
        return new AclResourceEntity(aclResourceData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param AclResourceEntity aclResourceEntity AclResource entity
   * @return Promise aclResource Promise of newly created aclResource entity
   */
  update(aclResourceEntity)
  {
    if (!(aclResourceEntity instanceof AclResourceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclResource expected",
        {
          aclResourceEntity: aclResourceEntity
        },
        500
      );
    }

    return super.update(aclResourceEntity)
      .then(function (aclResourceData) {
        return new AclResourceEntity(aclResourceData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param AclResourceEntity aclResourceEntity AclResource entity
   * @return Promise aclResource Promise of newly created aclResource entity
   */
  replace(aclResourceEntity)
  {
    if (!(aclResourceEntity instanceof AclResourceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AclResource expected",
        {
          aclResourceEntity: aclResourceEntity
        }
      );
    }

    return super.replace(aclResourceEntity)
      .then(function (aclResourceData) {
        return new AclResourceEntity(aclResourceData);
      });
  }
}

module.exports = RethinkDbAclResourceGateway;
