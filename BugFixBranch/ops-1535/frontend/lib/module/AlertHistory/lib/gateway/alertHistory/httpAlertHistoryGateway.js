
"use strict";

const common                      = require("opserve-common");
const HttpGateway                 = common.gateway.HttpGateway;
const config                      = common.Config.get();
var AlertHistoryEntity            = require("itheon-module-alert-entity").AlertHistoryEntity;
const ItheonError                 = common.error.BaseError;
const Request                     = common.Request;


class HttpAlertHistoryGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/alert-histories";
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
      if(response){
        return response.body;
      }else{
        return "";
      }
      // let alertHistoryCollectionEntity = new AlertHistoryCollectionEntity(response.body);
      // alertHistoryCollectionEntity.setTotalCount(response.headers["x-total-count"]);
      // return alertHistoryCollectionEntity;
    });
  }

  create(alertHistoryEntity)
  {
    // if (!(alertHistoryEntity instanceof AlertHistoryEntity)) {
    //   throw new ItheonError(
    //     "Invalid model passed. Instance of AlertHistoryEntity expected",
    //     {
    //       alertHistoryEntity: alertHistoryEntity
    //     }
    //   );
    // }

    return super.insert(alertHistoryEntity).then(function(alertHistoryData) {
      return alertHistoryData;
    });
  }

  update(alertHistoryEntity)
  {
    if (alertHistoryEntity instanceof Request) {
      alertHistoryEntity = alertHistoryEntity.getPayload();
    }

    // if (!(alertHistoryEntity instanceof AlertHistoryEntity)) {
    //   throw new ItheonError(
    //     "Invalid model passed. Instance of AlertHistoryEntity expected",
    //     {
    //       alertHistoryEntity: alertHistoryEntity
    //     }
    //   );
    // }

    if (!alertHistoryEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(alertHistoryEntity).then(function(alertHistoryData) {
      return new AlertHistoryEntity(alertHistoryData);
    });
  }
}

module.exports = HttpAlertHistoryGateway;
