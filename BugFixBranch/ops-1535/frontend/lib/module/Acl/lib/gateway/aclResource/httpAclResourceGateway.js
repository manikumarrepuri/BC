
"use strict";

var AclResourceEntity           = require("itheon-module-acl-entity").AclResourceEntity;
var AclResourceCollectionEntity = require("itheon-module-acl-entity").AclResourceCollectionEntity;
const common                    = require("opserve-common");
const config                    = common.Config.get();
const HttpGateway               = common.gateway.HttpGateway;
const ItheonError               = common.error.BaseError;

class HttpAclResourceGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/acl-resources";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    return super.fetchAll(request).then(function(response) {
      let aclResourceCollectionEntity = new AclResourceCollectionEntity(response.body, AclResourceEntity);
      aclResourceCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return aclResourceCollectionEntity;
    });
  }

  create(aclResourceEntity)
  {
    if (!(aclResourceEntity instanceof AclResourceEntity)) {
      throw new ItheonError(
        "Invalid entity passed. Instance of AclResourceEntity expected",
        {
          aclResourceEntity: aclResourceEntity
        }
      );
    }

    return super.insert(aclResourceEntity)
      .then(function(aclResourceData) {
        return new AclResourceEntity(aclResourceData);
      });
  }

  update(aclResourceEntity)
  {
    if (!(aclResourceEntity instanceof AclResourceEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of AclResourceEntity expected");
    }

    if (!aclResourceEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(aclResourceEntity)
      .then(function(aclResourceData) {
        return new AclResourceEntity(aclResourceData);
      });
  }
}

module.exports = HttpAclResourceGateway;
