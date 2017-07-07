
"use strict";

const common              = require("opserve-common");
const config              = common.Config.get();
const HttpGateway         = common.gateway.HttpGateway;
const ItheonError         = common.error.BaseError;
var UserEntity           = require("itheon-module-user-entity").UserEntity;

class HttpUserGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/users";
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
      // let userCollectionEntity = new UserCollectionEntity(response.body);
      // userCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      // return userCollectionEntity;
      return response.body;
    });
  }

  create(userEntity)
  {
    if (!(userEntity instanceof UserEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of UserEntity expected");
    }

    return super.insert(userEntity)
      .then(function(userData) {
        return new UserEntity(userData);
      });
  }

  update(userEntity)
  {
    if (!(userEntity instanceof UserEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of UserEntity expected");
    }

    if (!userEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(userEntity)
      .then(function(userData) {
        return new UserEntity(userData);
      });
  }
}

module.exports = HttpUserGateway;
