"use strict";

var AclResourceEntity           = require("itheon-module-acl-entity").AclResourceEntity;
const common                    = require("opserve-common");
const _                         = common.utilities.underscore;
const ItheonError               = common.error.BaseError;
const Request                   = common.Request;

/**
 * AclResources service class definition
 */
class AclResourcesService
{
  constructor(aclResourcesGateway)
  {
    this.setGateway(aclResourcesGateway);
  }

  setGateway(aclResourcesGateway)
  {
    if (!aclResourcesGateway) {
      var AclResourcesGateway = require("../gateway/aclResource/httpAclResourceGateway");
      aclResourcesGateway = new AclResourcesGateway();
    }

    this.aclResourcesGateway = aclResourcesGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/aclResources
  */
  getSchema()
  {
    var aclResourceEntity = new AclResourceEntity();
    return {
      "aclResource": aclResourceEntity.getFields()
    };
  }

  /**
   * Method gets all aclResources matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(query)
  {
    query = query || new Request();
    var that = this;

    return this.aclResourcesGateway.fetchAll(query).then(function(collection) {
      return that.patchAclResources(collection);
    });
  }

  // Placeholder
  patchAclResources(collection)
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
    var aclResourceEntity = this.validateData(data);

    return this.aclResourcesGateway.create(aclResourceEntity)
      .then(function (aclResourceData) {
        if(aclResourceData.errorCode) {
          throw new ItheonError(
            aclResourceData.message,
            aclResourceData.data,
            aclResourceData.errorCode
          );
        }

        return new AclResourceEntity(aclResourceData);
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
    var aclResourceEntity = this.validateData(data);

    return this.aclResourcesGateway.update(aclResourceEntity)
      .then(function (aclResourceData) {
        if(aclResourceData.errorCode) {
          throw new ItheonError(
            aclResourceData.message,
            aclResourceData.data,
            aclResourceData.errorCode
          );
        }

        return new AclResourceEntity(aclResourceData);
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
    return this.aclResourcesGateway.delete(id);
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

    return new AclResourceEntity(data);
  }
}

module.exports = AclResourcesService;
