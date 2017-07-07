
"use strict";

const BaseEntity  = require("itheon-entity").BaseEntity;
const util        = require("util");
const qs          = require("qs");
const _           = require("itheon-utility").underscore;
const Request     = require("itheon-request");
const BaseError   = require("itheon-error").BaseError;
const logger      = require("itheon-logger");
const urlencode = require("urlencode");
const syswidecas = require('syswide-cas');

class HttpDataProvider
{

  constructor(httpConfig)
  {
    if (httpConfig) {
      this.httpConfig = httpConfig;
    }
  }

  /**
   * Method returns HTTP client details
   */
  getHttpClient()
  {
    if (!this.httpClient) {
      if (!this.httpConfig) {
        throw new BaseError("HTTP Data Provider used incorrectly. No httpConfig provided.");
      }

      var HTTP = require("q-io/http");
      HTTP.config = this.httpConfig;
      this.httpClient = HTTP;
    }

    return this.httpClient;
  }

  /**
   * Method sends GET HTTP request
   */
  sendGetRequest(request)
  {
    if (!(request instanceof Request)) {
      throw new BaseError("Invalid request passed. Instance of Request expected");
    }

    var HttpClient = this.getHttpClient();

    var requestObject = _.extend({}, HttpClient.config);
    requestObject.path = this.apiUrl;
    this.appendRequestOptions(requestObject, request, HttpClient.config);
    requestObject.method = "GET";

    logger.silly('HttpGateway::sendGetRequest', {
      request: requestObject
    });

    var headers;
    return HttpClient.request(requestObject)
      .then(function (response) {
        return response.body.read().then(function (buffer) {
          return {
            "buffer": buffer,
            "headers": response.headers
          };
        });
      }).then(function (response) {
        var body = response.buffer.toString();
        if (body.length === 0) {
          return null;
        }

        //Check if we've got JSON
        var json = '';
        try {
          json = JSON.parse(body);
          if (_.isEmpty(json)) {
            json = {};
          }
        } catch (e) {
          throw new BaseError(
            "Invalid response. JSON expected.",
            {
              data: body
            }
          );
        }

        return {
          "body": json,
          "headers": response.headers
        };
      }).catch(function (error) {
        logger.error('HttpGateway::sendGetRequest - Failed', {
          error: error
        });
      });
  }

  /**
   * Method sends POST HTTP request
   */
  sendPostRequest(request)
  {
    if (!(request instanceof Request)) {
      throw new BaseError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    var payload = request.getPayload();
    if (payload instanceof BaseEntity) {
      payload = payload.export();
    }

    var HttpClient = this.getHttpClient();
    var requestObject = _.extend({}, HttpClient.config);
    requestObject.path = this.apiUrl;
    this.appendRequestOptions(requestObject, request, HttpClient.config);
    requestObject.method = "POST";
    requestObject.body = [JSON.stringify(payload)];

    logger.info("HttpGateway::sendPostRequest - sending request", {
      requestObject: requestObject
    });

    return HttpClient.request(requestObject)
      .then(function (response) {
        return response.body.read();
      }).then(function (buffer) {
        var body = buffer.toString();
        if (body.length === 0) {
          return null;
        }

        //Check if we've got JSON
        try {
          return JSON.parse(body);
        } catch(e) {
          throw new BaseError(
            "Invalid response. JSON expected.",
            {
              data: body
            }
          );
        }
      }).catch(function(error){
        logger.error('HttpGateway::sendPostRequest - Failed', {
          error: error
        });
      })
  }

  /**
   * Method sends PUT HTTP request
   */
  sendPutRequest(request)
  {
    if (!(request instanceof Request)) {
      throw new BaseError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    var payload = request.getPayload();
    if (payload instanceof BaseEntity) {
      payload = payload.export();
    }

    var HttpClient = this.getHttpClient();

    var requestObject = _.extend({}, HttpClient.config);
    requestObject.path = this.apiUrl + "/" + urlencode(payload.id);
    this.appendRequestOptions(requestObject, request, HttpClient.config);
    requestObject.method = "PUT";
    requestObject.body = [JSON.stringify(payload)];

    logger.info("HttpGateway::sendPutRequest - sending request", {
       requestObject: requestObject
     });

    return HttpClient.request(requestObject)
      .then(function (response) {
        return response.body.read();
      }).then(function (buffer) {
        var body = buffer.toString();
        if (body.length === 0) {
          return null;
        }

        //Check if we've got JSON
        try {
          return JSON.parse(body);
        } catch(e) {
          throw new BaseError("Invalid response. JSON expected.", {data: body});
        }
      }).catch(function(error){
        logger.error('HttpGateway::sendPutRequest - Failed', {
          error: error
        });
      })
  }

  /**
   * Method sends PATCH HTTP request
   */
  sendPatchRequest(request)
  {
    if (!(request instanceof Request)) {
      throw new BaseError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    var payload = request.getPayload();
    if (payload instanceof BaseEntity) {
      payload = payload.export();
    }

    var HttpClient = this.getHttpClient();

    var requestObject = _.extend({}, HttpClient.config);
    requestObject.path = this.apiUrl + "/" + urlencode(payload.id);
    this.appendRequestOptions(requestObject, request, HttpClient.config);
    requestObject.method = "PATCH";
    requestObject.body = [JSON.stringify(payload)];

    logger.info("HttpGateway::sendPatchRequest - sending request", {
      requestObject: requestObject
    });

    return HttpClient.request(requestObject)
      .then(function (response) {
        return response.body.read();
      }).then(function (buffer) {
        var body = buffer.toString();
        if (body.length === 0) {
          return null;
        }

        //Check if we've got JSON
        try {

          return JSON.parse(body);

        } catch(e) {

          throw new BaseError(
            "Invalid response. JSON expected.",
            {
              data: body
            }
          );

        }
      }).catch(function(error){
        logger.error('HttpGateway::sendPatchRequest - Failed', {
          error: error
        });
      })
  }

  /**
   * Method sends DELETE HTTP request
   */
  sendDeleteRequest(request)
  {
    if (!(request instanceof Request)) {
      throw new BaseError(
        "Invalid request passed. Instance of Request expected",
        {
          request: request
        }
      );
    }

    var payload = request.getPayload();
    if (payload instanceof BaseEntity) {
      payload = payload.export();
    }

    var HttpClient = this.getHttpClient();

    var requestObject = _.extend({}, HttpClient.config);
    requestObject.path = this.apiUrl + "/" + urlencode(payload.id);
    this.appendRequestOptions(requestObject, request, HttpClient.config);
    requestObject.method = "DELETE";

    return HttpClient.request(requestObject)
      .then(function (response) {
        return response.body.read();
      }).then(function (buffer) {
        var body = buffer.toString();
        if (body.length === 0) {
          return null;
        }

        //Check if we've got JSON
        try {

          return JSON.parse(body);

        } catch (e) {

          throw new BaseError(
            "Invalid response. JSON expected.",
            {
              data: body
            }
          );
        }
      }).catch(function (error) {
        logger.error('HttpGateway::sendDeleteRequest - Failed', {
          error: error
        });
      });
  }

  appendRequestOptions(requestObject, request, httpConfig)
  {
    if (!(request instanceof Request)) {
      return requestObject;
    }

    var requestQuery = request.export();
    delete requestQuery.payload;

    var queryString = qs.stringify(request.export(), { indices: true });
    if (queryString) {
      requestObject.path += "?" + queryString;
    }

    if (requestObject.ssl) {
      logger.silly("SSL enabled, setting extra options");
      logger.silly("httpConfig", httpConfig);
      
      let fs = require('fs');

      let agentOptions = {};
      if (_.contains(Object.keys(httpConfig), "ca")) {
        agentOptions["ca"] = fs.readFileSync(httpConfig.ca);
      }

      if (_.contains(Object.keys(httpConfig), "strictSSL"))
      {
        agentOptions["rejectUnauthorized"] = httpConfig.strictSSL;
      }

      logger.silly("Agent Options", agentOptions);
      
      let https = require('https');
      requestObject.agent = new https.Agent(agentOptions);
    }

    return requestObject;
  }
}

module.exports = HttpDataProvider;
