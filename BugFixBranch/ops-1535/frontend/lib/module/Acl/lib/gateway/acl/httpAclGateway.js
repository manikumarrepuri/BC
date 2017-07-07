
"use strict";

const common                  = require("opserve-common");
const logger                  = common.logger;
const config                  = common.Config.get();
const HttpGateway             = common.gateway.HttpGateway;
const urlencode               = require("urlencode");

class HttpAclGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrlParts = [
      "/acl/validate/user/",
      null,
      "/resource/",
      null,
      "/action/",
      null
    ];
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(user, resource, action, request)
  {
    logger.info("HttpAclGateway::fetchAll() method called", {
      user: user,
      resource: resource,
      action: action
    });

    if (user === "admin") {
      return new Promise(function(resolve, reject) {
        return resolve({body: {"valid": true}});
      });
    }

    this.setupUrl(user, resource, action);

    return super.fetchAll(request).then(function(response){
      return response;
    });
  }

  setupUrl(user, resource, action, aclRuleCollectionEntity)
  {
    logger.info("HttpAclGateway::setupUrl() method called", {
      user: user,
      resource: resource,
      action: action
    });

    this.dataProvider.apiUrlParts[1] = urlencode(user);
    this.dataProvider.apiUrlParts[3] = urlencode(resource);
    this.dataProvider.apiUrlParts[5] = urlencode(action);
    this.dataProvider.apiUrl = this.dataProvider.apiUrlParts.join("");
  }
}

module.exports = HttpAclGateway;
