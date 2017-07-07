
"use strict";

var AclRuleEntity           = require("itheon-module-acl-entity").AclRuleEntity;
var AclRuleCollectionEntity = require("itheon-module-acl-entity").AclRuleCollectionEntity;
const common                = require("opserve-common");
const config                = common.Config.get();
const HttpGateway           = common.gateway.HttpGateway;
const ItheonError           = common.error.BaseError;

class HttpAclRuleGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/acl-rules";
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
      let aclRuleCollectionEntity = new AclRuleCollectionEntity(response.body, AclRuleEntity);
      aclRuleCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return aclRuleCollectionEntity;
    });
  }

  create(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new ItheonError(
        "Invalid entity passed. Instance of AclRuleEntity expected",
        {
          aclRuleEntity: aclRuleEntity
        }
      );
    }

    return super.insert(aclRuleEntity)
      .then(function(aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }

  update(aclRuleEntity)
  {
    if (!(aclRuleEntity instanceof AclRuleEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of AclRuleEntity expected");
    }

    if (!aclRuleEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(aclRuleEntity)
      .then(function(aclRuleData) {
        return new AclRuleEntity(aclRuleData);
      });
  }
}

module.exports = HttpAclRuleGateway;
