
"use strict";

const appRootPath = require("app-root-path");
const common      = require("opserve-common");
const HttpGateway = common.gateway.HttpGateway;
const _           = common.utilities.underscore;
const config      = common.Config.get();

class HttpFilterGateway extends HttpGateway {
  constructor(httpDataProvider) {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/filters";
  }

  /**
  * Method fetches all saved persistent filter records
  *
  * @return Promise of data from DB
  */
  fetchAll(request) {
    return super.fetchAll(request).then(function (response) {
      if (response) {
        return response.body;
      } else {
        return "";
      }
    });
  }

  /**
  * Method saves persistent filter record
  *
  * @return success/failure
  */
  create(filterData) {
    return super.insert(filterData).then(function (result) {
      return result;
    });
  }
}

module.exports = HttpFilterGateway;
