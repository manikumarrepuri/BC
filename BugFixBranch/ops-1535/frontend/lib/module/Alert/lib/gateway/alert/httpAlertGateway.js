
"use strict";

const common                = require("opserve-common");
const HttpGateway           = common.gateway.HttpGateway;
const config                = common.Config.get();
const Request               = common.Request;

class HttpAlertGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/alerts";
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
    });
  }

  create(alertEntity)
  {
    return super.insert(alertEntity).then(function(alertData) {
      return alertData;
    });
  }

  update(alertEntity)
  {
    if (alertEntity instanceof Request) {
      alertEntity = alertEntity.getPayload();
    }

    return super.update(alertEntity).then(function(alertData) {
      return alertData;
    });
  }
}

module.exports = HttpAlertGateway;
