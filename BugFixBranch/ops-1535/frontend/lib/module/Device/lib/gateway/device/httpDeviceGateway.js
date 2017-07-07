
"use strict";

const common                  = require("opserve-common");
const HttpGateway             = common.gateway.HttpGateway;
const config                  = common.Config.get();


class HttpDeviceGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/devices";
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
      if(response){
        return response.body; 
      }else{
        return "";
      }

    });
  }

  create(deviceEntity)
  {
    return super.insert(deviceEntity).then(function(deviceData) {
      return deviceData;
    });
  }

  update(deviceEntity) 
  {
    return super.update(deviceEntity).then(function(deviceData) {
      return deviceData;
    });
  }
}

module.exports = HttpDeviceGateway;
