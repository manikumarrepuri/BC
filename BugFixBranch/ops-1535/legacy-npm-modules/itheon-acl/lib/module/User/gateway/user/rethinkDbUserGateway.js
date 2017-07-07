
"use strict";

var appRootPath      = require("app-root-path");
var RethinkDbGateway = require("itheon-gateway").RethinkDbGateway;
var UserEntity       = require("itheon-module-user-entity").UserEntity;
var _                = require("itheon-utility").underscore;
var GatewayError     = require("itheon-gateway").GatewayError;

class RethinkDbUserGateway extends RethinkDbGateway
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
      "name": "User",
      "alias": "u"
    };

    /**
     * Object describing user's relation
     *
     * @type Object
     */
    this.relations = {
      "acl-role": {
        "table": "AclRole",
        "localColumn": "roles",
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
    var entities = [new UserEntity()];

    var joins = request.getJoins();

    if (_.contains(joins, "acl-role")) {
      entities.push(new AclRoleEntity());
    }

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param User userEntity User entity
   * @return Promise user Promise of newly created user entity
   */
  create(userEntity)
  {

    if (!(userEntity instanceof UserEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of User expected",
        {
          userEntity: userEntity
        },
        500
      );
    }

    // var parent = super;
    return super.insert(userEntity)
      .then(function (userData) {
        return new UserEntity(userData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param User userEntity User entity
   * @return Promise user Promise of newly created user entity
   */
  update(userEntity)
  {
    if (!(userEntity instanceof UserEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of User expected",
        {
          userEntity: userEntity
        },
        500
      );
    }

    return super.update(userEntity)
      .then(function (userData) {
        return new UserEntity(userData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param User userEntity User entity
   * @return Promise user Promise of newly created user entity
   */
  replace(userEntity)
  {
    if (!(userEntity instanceof UserEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of User expected"
      );
    }

    return super.replace(userEntity)
      .then(function (userData) {
        return new UserEntity(userData);
      });
  }
}

module.exports = RethinkDbUserGateway;
