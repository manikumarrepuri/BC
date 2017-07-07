
"use strict";

var appRootPath  = require("app-root-path");
var logger       = require("itheon-logger");
var RouteError   = require("./routeError");
var errorHandler = require("itheon-error").errorHandler;
var _            = require("itheon-utility").underscore;

/**
 * Request class provides deep validation of user's requests
 */
class Route
{
  constructor(service, url)
  {
    if (!service) {
      throw new RouteError(
        "No service provided for route",
        {
          service: service
        }
      );
    }
    this.service = service;
    this.url = url;
  }

  /**
   * This function extracts custom X headers and creates an object of them.
   * @param object headers express header object
   * @return object containing just custom headers
   */
  createHeaders(headers)
  {
    var custom = {};
    Object.keys(headers).forEach(function(key, index, element){
      custom["x-" + key.replace( /([A-Z])/g, "-$1" ).toLowerCase()] = headers[key];
    });

    return custom;
  }

  /**
   * Method responds with schema returned from service (entity fields)
   *
   * @param Request  req Express' request
   * @param Response res Express' response
   * @return null
   */
  getSchema(req, res)
  {
    logger.info(
      req.method + ' request: ' + req.url + ". BaseRoute::getSchema"
    );

    try {

      var schema = this.service.getSchema();

      if (schema) {
        return res.status(200).json(schema);
      }

      logger.error('Failed to retrieve schema, no schema found.');
      return errorHandler.resolve('Failed to retrieve schema, no schema found.', req, res);

    } catch(err) {

      logger.error('Exception was thrown - ' + 'Failed to retrieve schema.', {error: err});
      return errorHandler.resolve('Failed to retrieve schema.', req, res);

    }
  }

  /**
   * Method finds entities using passed request obejct and responds using passed
   * response object
   *
   * @param Request  req Express' request
   * @param Response res Express' response
   * @return null
   */
  find(req, res)
  {
    logger.info(this.constructor.name + "::find - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;
    var nestedArguments = this.getNestedArguments(req);
    nestedArguments.push(req.query);

    try {
      this.setGateway(req);
      this.service.find.apply(this.service, nestedArguments)
        .then(function (collection) {
          if(collection.properties){
            res.set(that.createHeaders(collection.properties));
            return res.status(200).json(_.values(collection.export()));  
          }
          else{
            res.set(that.createHeaders(collection));
            return res.status(200).json(_.values(collection));
          }
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }

  /**
   * Method finds single entity using passed request(id param) obejct
   * and responds using passed response object
   *
   * @param Request  req Express' request
   * @param Response res Express' response
   * @return null
   */
  findById(req, res)
  {
    logger.info(this.constructor.name + "::findById - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var nestedArguments = this.getNestedArguments(req);
    req.query.appendConditions({id: req.params.id});
    nestedArguments.push(req.query);

    try {
      this.setGateway(req);
      this.service.find.apply(this.service, nestedArguments)
        .then(function (collection) {
          var entities = _.values(collection.export());
          var result = entities.pop();
          if (!result) {
            return res.status(404).json('Not Found');
          }
          return res.status(200).json(result);
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }

  /**
   * Method creates single entity using passed request obejct
   * and responds using passed response object
   *
   * @param Request  req Express' request
   * @param Response res Express' response
   * @return null
   */
  create(req, res)
  {
    logger.info(this.constructor.name + "::create - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;
    var nestedArguments = this.getNestedArguments(req);
    nestedArguments.push(req.body);

    try {
      this.setGateway(req);
      this.service.create.apply(this.service, nestedArguments)
        .then(function (entity) {
          if (!entity) {
            return res.status(404).json('Not Found');
          }

          if(!Array.isArray(entity)) {
            res.setHeader('Location', that.url +  entity.id);
          }

          return res.status(201).json(entity);
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }

  /**
   * Method updates single entity using passed request obejct
   * and responds using passed response object
   *
   * @param Request  req Express' request
   * @param Response res Express' response
   * @return null
   */
  update(req, res)
  {
    logger.info(this.constructor.name + "::create - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    req.body.id = req.params.id;
    var that = this;
    var nestedArguments = this.getNestedArguments(req);
    nestedArguments.push(req.body);

    try {
      this.setGateway(req);
      this.service.update.apply(this.service, nestedArguments)
        .then(function (response) {
          if (!response) {
            return res.status(409).json('Conflict');
          }
          return res.status(200).json(response);
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }

  /**
   * Method allows to set gateway(s) to be used
   *
   * @param ExpressRequest req Request object
   */
  setGateway(req)
  {
    this.service.setGateway(null, req.query.getStorage());
  }

  /**
   * Method returns list of nested parameters that should be passed to gateway
   * methods
   *
   * @return Array argumentsList List of arguments
   */
  getNestedArguments()
  {
    return [];
  }
}

module.exports = Route;
