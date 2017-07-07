
"use strict";

var appRootPath             = require("app-root-path");
var AclRoleEntity           = require("itheon-module-acl-entity").AclRoleEntity;
var AclRoleCollectionEntity = require("itheon-module-acl-entity").AclRoleCollectionEntity;
const common                = require("opserve-common");
const _                     = common.utilities.underscore;
const ItheonError           = common.error.BaseError;
const Request               = common.Request;

class AclRolesService
{
  constructor(aclRoleGateway, gatewayType)
  {
    this.setGateway(aclRoleGateway, gatewayType);
  }

  setGateway(aclRoleGateway, gatewayType)
  {
    if (!aclRoleGateway) {
      var AclRoleGateway = require("../gateway/aclRole/rethinkDbAclRoleGateway");
      aclRoleGateway = new AclRoleGateway();
    }

    this.aclRoleGateway = aclRoleGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/aclRoles
  */
  getSchema()
  {
    var aclRoleEntity = new AclRoleEntity();
    return {
      "aclRole": aclRoleEntity.getFields()
    };
  }

  /**
   * Method gets all aclRoles matching passed query
   * @param  {[type]}   query    [description]
   * @return {[type]}            [description]
   */
  find(request)
  {
    request = request || new Request();
    var that = this;
    return this.aclRoleGateway.fetchAll(request)
      .then(function(collection) {
        var aclRoleCollectionEntity = new AclRoleCollectionEntity([], AclRoleEntity);
        aclRoleCollectionEntity.setAllowAnyField(true);
        return aclRoleCollectionEntity.inflate(collection);
      }).then(function(aclRoleCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.aclRoleGateway.fetchAll(request)
          .then(function(totalNumberOfAclRoles) {
            return aclRoleCollectionEntity.setTotalCount(totalNumberOfAclRoles);
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
    var aclRoleEntity = this.validateData(data);

    return this.aclRoleGateway.create(aclRoleEntity)
      .then(function (aclRoleData) {
        if (aclRoleData.errorCode) {
          throw new ItheonError(
            aclRoleData.message,
            aclRoleData.data,
            aclRoleData.errorCode
          );
        }

        return new AclRoleEntity(aclRoleData);
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
    var aclRoleEntity = this.validateData(data);

    return this.aclRoleGateway.update(aclRoleEntity)
      .then(function (aclRoleData) {
        if (aclRoleData.errorCode) {
          throw new ItheonError(
            aclRoleData.message,
            aclRoleData.data,
            aclRoleData.errorCode
          );
        }

        return new AclRoleEntity(aclRoleData);
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
    return this.aclRoleGateway.delete(id);
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

    return new AclRoleEntity(data);
  }
}

module.exports = AclRolesService;
