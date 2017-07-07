
"use strict";

var appRootPath      = require("app-root-path");
var RethinkDbGateway = require("./../../lib/rethinkDbGateway");
var UserEntity       = require("./userEntity");
var AclRoleEntity    = require("./aclRoleEntity");
var _                = require("itheon-utility").underscore;
var GatewayError     = require("./../../lib/gatewayError");

class RethinkDbUserGateway extends RethinkDbGateway
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
      "name": "User",
      "alias": "u"
    };

    /**
     * Object describing user"s relation
     *
     * @type Object
     */
    this.relations = {
      "role": {
        "table": "AclRole",
        "localColumn": "roleId",
        "targetColumn": "id",
        "defaultAlias": "r",
        "condition": "`u`.`roleId` = `r`.`id`"
      },
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
    var entities = [new UserEntity()];

    var joins = request.getJoins();
    if (_.contains(joins, "role")) {
      entities.push(new AclRoleEntity());
    }

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param UserEntity userEntity User entity
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

    return this.validateUsername(userEntity)
      .then(super.insert.bind(this))
      .then(function (userData) {
        return new UserEntity(userData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param UserEntity userEntity User entity
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
   * @param UserEntity userEntity User entity
   * @return Promise user Promise of newly created user entity
   */
  replace(userEntity)
  {
    if (!(userEntity instanceof UserEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of User expected",
        {
          userEntity: userEntity
        }
      );
    }

    return super.replace(userEntity)
      .then(function (userData) {
        return new UserEntity(userData);
      });
  }

  /**
   * Helper method validates username to be inserted
   *
   * @param UserEntity userEntity User entity
   * @return Promise user Promise of exception if username exists
   * otherwise promise of passed object
   */
  validateUsername(userEntity)
  {
    return this.dataProvider.table(this.table.name)
      .getAll(userEntity.get("username"), {index: "username"})
      .then(function(users) {
        if (!_.isEmpty(users)) {
          throw new GatewayError(
            "Username already in use",
            {
              users: users
            },
            409
          );
        }

        return userEntity;
      });
  }
}

module.exports = RethinkDbUserGateway;