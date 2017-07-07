
"use strict";

var UserEntity           = require("itheon-module-user-entity").UserEntity;
const common             = require("opserve-common");
const _                  = common.utilities.underscore;
const ItheonError        = common.error.BaseError;
const Request            = common.Request;

/**
 * Users service class definition
 */
class UsersService
{
  constructor(usersGateway, gatewayType)
  {
    this.setGateway(usersGateway, gatewayType);
  }

  setGateway(usersGateway, gatewayType)
  {
    if (!usersGateway) {
      var UsersGateway = require("../gateway/user/httpUserGateway");
      usersGateway = new UsersGateway();
    }

    this.usersGateway = usersGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var userEntity = new UserEntity();
    return {
      "user": userEntity.getFields()
    };
  }

  /**
   * Method gets all users matching passed request
   * @param  {[type]}   request    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();
    var conditions = request.appendConditions({
      status: 1
    });

    return this.usersGateway.fetchAll(request)
      .then(function(collection) {
        return collection;
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
    var userEntity = this.validateData(data);

    return this.usersGateway.create(userEntity)
      .then(function (userData) {
        if (userData.errorCode) {
          throw new ItheonError(
            userData.message,
            userData.data,
            userData.errorCode
          );
        }

        return new UserEntity(userData);
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
    var userEntity = this.validateData(data);

    return this.usersGateway.update(userEntity)
      .then(function (userData) {
        if (userData.errorCode) {
          throw new ItheonError(
            userData.message,
            userData.data,
            userData.errorCode
          );
        }

        return new UserEntity(userData);
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
    return this.usersGateway.delete(id);
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

    return new UserEntity(data);
  }
}

module.exports = UsersService;
