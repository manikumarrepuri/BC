
"use strict";

const appRootPath = require("app-root-path");
const Routes      = require("itheon-route");
const TagsService = require(appRootPath + "/lib/module/Tag/lib/service/tagsService");
const logger      = require("opserve-common").logger;

class TagRoutes extends Routes
{
  constructor()
  {
    var tagsService = new TagsService();
    super(tagsService, 'api/tags');
  }
}

var apiRoutes = new TagRoutes();
module.exports = apiRoutes;
