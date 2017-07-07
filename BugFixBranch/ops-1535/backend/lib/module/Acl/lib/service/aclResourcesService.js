
"use strict";

var appRootPath                 = require("app-root-path");
var AclResourceEntity           = require("itheon-module-acl-entity").AclResourceEntity;
var AclResourceCollectionEntity = require("itheon-module-acl-entity").AclResourceCollectionEntity;
const common                    = require("opserve-common");
const _                         = common.utilities.underscore;
const ItheonError               = common.error.BaseError;
const Request                   = common.Request;

class AclResourcesService
{
  constructor(aclResourceGateway, gatewayType)
  {
    this.setGateway(aclResourceGateway, gatewayType);
  }

  setGateway(aclResourceGateway, gatewayType)
  {
    if (!aclResourceGateway) {
      var AclResourceGateway = require("../gateway/aclResource/rethinkDbAclResourceGateway");
      aclResourceGateway = new AclResourceGateway();
    }

    this.aclResourceGateway = aclResourceGateway;
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
   * @return {[type]}            [description]
   */
  find(request)
  {
    request = request || new Request();
    var that = this;
    return this.aclResourceGateway.fetchAll(request)
      .then(function(collection) {
        var aclResourceCollectionEntity = new AclResourceCollectionEntity([], AclResourceEntity);
        aclResourceCollectionEntity.setAllowAnyField(true);
        return aclResourceCollectionEntity.inflate(collection);
      }).then(function(aclResourceCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.aclResourceGateway.fetchAll(request)
          .then(function(totalNumberOfAclResources) {
            return aclResourceCollectionEntity.setTotalCount(totalNumberOfAclResources);
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
    var aclResourceEntity = this.validateData(data);

    return this.aclResourceGateway.create(aclResourceEntity)
      .then(function (aclResourceData) {
        if (aclResourceData.errorCode) {
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

    return this.aclResourceGateway.update(aclResourceEntity)
      .then(function (aclResourceData) {
        if (aclResourceData.errorCode) {
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
    return this.aclResourceGateway.delete(id);
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
