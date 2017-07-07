
"use strict";

const BaseRoute   = require("itheon-route");
const logger      = require("opserve-common").logger;
const AclService  = require("../service/aclService");

class AclRoutes extends BaseRoute
{
  constructor()
  {
    var aclService = new AclService();
    super(aclService, 'api/acl');
  }

  find(req, res)
  {
    logger.info(this.constructor.name + "::find - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;
    var nestedArguments = this.getNestedArguments(req);
    nestedArguments.push(req.query);

    try {
      this.setGateway(req);
      this.service.find.apply(this.service, nestedArguments)
        .then(function (response) {
          if(!response.body) {
            return res.status(200).json({"valid": false});
          }

          return res.status(200).json(response.body);
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }

  /**
 * Method returns list of nested parameters that should be passed to gateway
 * methods
 *
 * @param ExpressRequest request Request object
 * @return Array argumentsList List of arguments
 */
 getNestedArguments(request)
 {
   return [request.params.user, request.params.resource, request.params.action];
 }

}

module.exports = new AclRoutes();
