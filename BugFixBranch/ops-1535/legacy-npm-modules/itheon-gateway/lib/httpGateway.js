
"use strict";

var BaseGateway  = require("./baseGateway");
var BaseEntity   = require("itheon-entity").BaseEntity;
var util         = require("util");
var _            = require("itheon-utility").underscore;
var logger       = require("itheon-logger");
var Request      = require("itheon-request");
var GatewayError = require("./gatewayError");

class HttpGateway extends BaseGateway
{
  /**
   * Cutom contractor allows to pass data provider instance
   *
   * @param object httpDataProvider DataProvider's instance(i.e. httpDataProvider)
   */
  constructor(httpDataProvider, httpConfig)
  {

    if (!httpDataProvider && !httpConfig) {
      throw new GatewayError(
        "HTTP Gateway used incorrectly. Expecting a httpDataProvider or httpConfig object to be passed.",
        {
          httpDataProvider: httpDataProvider,
          httpConfig: httpConfig
        }
      );
    }

    if (!httpDataProvider) {
      var HttpDataProvider = require("itheon-data-provider").HttpDataProvider;
      httpDataProvider = new HttpDataProvider(httpConfig);
    }

    super(httpDataProvider);
    this.dataProvider.apiUrl = "/http-gateway";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    if (!(request instanceof Request) && !_.isObject(request)) {
      throw new GatewayError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    // Allow for depreciated method call
    if (!(request instanceof Request)) {
      let tmpRequest = request;
      request = new Request();
      request.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    return this.dataProvider.sendGetRequest(request);
  }

  /**
   * Generic save request method
   *
   * @param Request request Request object
   */
  save(saveRequest)
  {
    if (!(saveRequest instanceof Request) && !_.isObject(saveRequest)) {
      throw new GatewayError(
        "Invalid request passed. Instance of Request expected",
        {
          request: saveRequest
        }
      );
    }

    // Allow for depreciated method call
    if (!(saveRequest instanceof Request)) {
      let tmpRequest = saveRequest;
      saveRequest = new Request();
      saveRequest.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    if (!saveRequest.getPayload().id) {
      return this.insert(saveRequest);
    }

    var me = this;
    var findRequest = new Request();
    findRequest.setConditions({id: saveRequest.getPayload().id});
    return this.fetchAll(findRequest)
      .then(function (results) {

        //We might get back a HTTP response
        if(results.body) {
          results = results.body;
        }

        //We might get back a collection entity
        if(_.isObject(results) && results.collectionEntity && results.getTotalCount() == 0) {
          results = null;
        }

        if (!_.isEmpty(results)) {
          return me.update(saveRequest);
        }

        return me.insert(saveRequest);
      });
  }

  /**
  * Generic insert request method
  *
  * @param Request request Request object
   */
  insert(request)
  {
    if (!(request instanceof Request) && !_.isObject(request)) {
      throw new GatewayError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    // Allow for depreciated method call
    if (!(request instanceof Request)) {
      let tmpRequest = request;
      request = new Request();
      request.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    return this.dataProvider.sendPostRequest(request);
  }

  /**
   * Generic update entity method
   *
   * @param Entity entity Entity to be updated
   */
  update(request)
  {
    if (!(request instanceof Request) && !_.isObject(request)) {
      throw new GatewayError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    // Allow for depreciated method call
    if (!(request instanceof Request)) {
      let tmpRequest = request;
      request = new Request();
      request.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    if (!request.getPayload().id) {
      throw new GatewayError(
        "Invalid logic. Insert should be called",
        {
          entity: request.getPayload()
        }
      );
    }

    return this.dataProvider.sendPatchRequest(request);
  }

  /**
   * Method delete records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  delete(request)
  {
    // Allow for depreciated method call
    if (!(request instanceof Request)) {
      let tmpRequest = request;
      request = new Request();
      request.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    if (!request.getPayload().id) {
      throw new GatewayError(
        "Invalid id passed. Delete should be called with a valid id",
        {
          payload: request.getPayload()
        }
      );
    }

    this.setupUrl(request.getPayload().id);
    return this.dataProvider.sendDeleteRequest();
  }

  setUrl(url)
  {
    logger.info("HttpGateway::setUrl() method called", {
      url: url
    });

    this.dataProvider.apiUrl = url;
  }

  setupUrl(id)
  {
    logger.info("HttpGateway::setupUrl() method called", {
      id: id
    });

    this.dataProvider.apiUrlParts[1] = id;
    this.dataProvider.apiUrl = this.dataProvider.apiUrlParts.join("");
  }
}

module.exports = HttpGateway;
