
"use strict";

var AclRoleEntity           = require("itheon-module-acl-entity").AclRoleEntity;
const common                = require("opserve-common");
const _                     = common.utilities.underscore;
const ItheonError           = common.error.BaseError;
const Request               = common.Request;


/**
 * AclRoles service class definition
 */
class AclRolesService
{
  constructor(aclRolesGateway)
  {
    this.setGateway(aclRolesGateway);
  }

  setGateway(aclRolesGateway)
  {
    if (!aclRolesGateway) {
      var AclRolesGateway = require("../gateway/aclRole/httpAclRoleGateway");
      aclRolesGateway = new AclRolesGateway();
    }

    this.aclRolesGateway = aclRolesGateway;
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
   * @return Promise results Promise of mapper"s results
   */
  find(query)
  {
    query = query || new Request();
    var that = this;

    return this.aclRolesGateway.fetchAll(query).then(function(collection) {
      return that.patchAclRoles(collection);
    });
  }

  // Placeholder
  patchAclRoles(collection)
  {
    return collection;
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

    return this.aclRolesGateway.create(aclRoleEntity)
      .then(function (aclRoleData) {
        if(aclRoleData.errorCode) {
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

    return this.aclRolesGateway.update(aclRoleEntity)
      .then(function (aclRoleData) {
        if(aclRoleData.errorCode) {
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
    return this.aclRolesGateway.delete(id);
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
