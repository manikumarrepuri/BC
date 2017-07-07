
"use strict";

var BaseRoute  = require("itheon-route");
var aclService = require("itheon-acl").aclService;
var logger     = require("opserve-common").logger;

class AclRoutes extends BaseRoute
{
  constructor()
  {
    super(aclService, 'api/acl');
  }

  validate(req, res) {
    logger.info(this.constructor.name + "::validate - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    if(!req.params) {
      return res.status(201).json({"valid": false});
    }

    if(!req.params.user || !req.params.resource || !req.params.action) {
      return res.status(201).json({"valid": false});
    }

    aclService.isAllowed(req.params.user, req.params.resource, req.params.action).then(function(result) {
      return res.status(201).json({"valid": result});
    });
  }

}

module.exports = new AclRoutes();
