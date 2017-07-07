
"use strict";

var appRootPath                = require("app-root-path");
var HttpGateway                = require("itheon-gateway").HttpGateway;
var {{Module}}Entity           = require("itheon-module-{{module}}-entity").{{Module}}Entity;
var {{Module}}CollectionEntity = require("itheon-module-{{module}}-entity").{{Module}}CollectionEntity;
var ItheonError                = require("itheon-error").BaseError;
var _                          = require("itheon-utility").underscore;
var logger                     = require("itheon-logger");
var Request                    = require("itheon-request");
var config                     = require("itheon-config").ConfigFactory.getConfig();

class Http{{Module}}Gateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/{{module}}s";
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
      let {{module}}CollectionEntity = new {{Module}}CollectionEntity(response.body);
      {{module}}CollectionEntity.setTotalCount(response.headers["x-total-count"]);
      return {{module}}CollectionEntity;
    });
  }

  create({{module}}Entity)
  {
    if (!({{module}}Entity instanceof {{Module}}Entity)) {
      throw new ItheonError(
        "Invalid model passed. Instance of {{Module}}Entity expected",
        {
          {{module}}Entity: {{module}}Entity
        }
      );
    }

    return super.insert({{module}}Entity).then(function({{module}}Data) {
      return new {{Module}}Entity({{module}}Data);
    });
  }

  update({{module}}Entity)
  {
    if (!({{module}}Entity instanceof {{Module}}Entity)) {
      throw new ItheonError(
        "Invalid model passed. Instance of {{Module}}Entity expected",
        {
          {{module}}Entity: {{module}}Entity
        }
      );
    }

    if (!{{module}}Entity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update({{module}}Entity).then(function({{module}}Data) {
      return new {{Module}}Entity({{module}}Data);
    });
  }
}

module.exports = Http{{Module}}Gateway;
