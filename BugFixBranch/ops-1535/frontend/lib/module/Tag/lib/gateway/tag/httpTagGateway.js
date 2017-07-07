
"use strict";

const common            = require("opserve-common");
const HttpGateway       = common.gateway.HttpGateway;
const config            = common.Config.get();
const ItheonError       = common.error.BaseError;
var TagEntity           = require("itheon-module-tag-entity").TagEntity;
var TagCollectionEntity = require("itheon-module-tag-entity").TagCollectionEntity;

class HttpTagGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/tags";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    return super.fetchAll(request)
      .then(function(response) {
        let tagCollectionEntity = new TagCollectionEntity(response.body);
        tagCollectionEntity.setTotalCount(response.headers["x-total-count"]);
        return tagCollectionEntity;
      });
  }

  create(tagEntity)
  {
    if (!(tagEntity instanceof TagEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of TagEntity expected");
    }

    return super.insert(tagEntity)
      .then(function(tagData) {
        return new TagEntity(tagData);
      });
  }

  update(tagEntity)
  {
    if (!(tagEntity instanceof TagEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of TagEntity expected");
    }

    if (!tagEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(tagEntity)
      .then(function(tagData) {
        return new TagEntity(tagData);
      });
  }
}

module.exports = HttpTagGateway;
