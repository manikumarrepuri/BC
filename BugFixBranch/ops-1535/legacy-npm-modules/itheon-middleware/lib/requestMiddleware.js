
"use strict";

var logger       = require("itheon-logger");
var Request      = require("itheon-request");
var errorHandler = require("itheon-error").errorHandler;

module.exports.validate = function (req, res, next) {

  var request = new Request();
  request.reset();

  var util = require("util");
  logger.info("RequestMiddleware::validate - request received", {
    httpMethod: req.method,
    url: req.url,
    query: req.query
  });

  try {

    request.inflate(req.query);

  } catch (error) {

    logger.error(error);

    return errorHandler.resolve(error, req, res);
  }

  req.query = request;
  next();
};
