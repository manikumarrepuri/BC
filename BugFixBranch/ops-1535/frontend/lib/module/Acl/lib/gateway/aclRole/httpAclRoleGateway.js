
"use strict";

var AclRoleEntity           = require("itheon-module-acl-entity").AclRoleEntity;
var AclRoleCollectionEntity = require("itheon-module-acl-entity").AclRoleCollectionEntity;
const common                = require("opserve-common");
const config                = common.Config.get();
const HttpGateway           = common.gateway.HttpGateway;
const ItheonError           = common.error.BaseError;

class HttpAclRoleGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/acl-roles";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    return super.fetchAll(request).then(function(response){
      let aclRoleCollectionEntity = new AclRoleCollectionEntity(response.body, AclRoleEntity);
      aclRoleCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return aclRoleCollectionEntity;
    });
  }

  create(aclRoleEntity)
  {
    if (!(aclRoleEntity instanceof AclRoleEntity)) {
      throw new ItheonError(
        "Invalid entity passed. Instance of AclRoleEntity expected",
        {
          aclRoleEntity: aclRoleEntity
        }
      );
    }

    return super.insert(aclRoleEntity)
      .then(function(aclRoleData) {
        return new AclRoleEntity(aclRoleData);
      });
  }

  update(aclRoleEntity)
  {
    if (!(aclRoleEntity instanceof AclRoleEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of AclRoleEntity expected");
    }

    if (!aclRoleEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(aclRoleEntity)
      .then(function(aclRoleData) {
        return new AclRoleEntity(aclRoleData);
      });
  }
}

module.exports = HttpAclRoleGateway;
