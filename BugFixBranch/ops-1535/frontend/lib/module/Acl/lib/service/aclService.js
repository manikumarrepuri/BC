"use strict";

const common                    = require("opserve-common");
const Request                   = common.Request;

/**
 * AclResources service class definition
 */
class AclService
{
  constructor(aclGateway)
  {
    this.setGateway(aclGateway);
  }

  setGateway(aclGateway)
  {
    if (!aclGateway) {
      var AclGateway = require("../gateway/acl/httpAclGateway");
      aclGateway = new AclGateway();
    }

    this.aclGateway = aclGateway;
  }

  /**
   * Method gets all aclResources matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(user, resource, action, query)
  {
    query = query || new Request();

    return this.aclGateway.fetchAll(user, resource, action, query).then(function(response) {
      return response
    });
  }
}

module.exports = AclService;
