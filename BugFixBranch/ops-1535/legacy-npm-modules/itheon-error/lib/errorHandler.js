
"use strict";

var BaseError    = require("./baseError");
var logger       = require("itheon-logger");
var _            = require("itheon-utility").underscore;

class ErrorHandler
{
  resolve(error, req, res)
  {
    logger.error(error);

    //If we don't have a valid express object this function is pointless
    if(!_.isObject(res)) {
      logger.error('res is not a valid express object');
      return;
    }

    // by default
    var httpStatusCode = 500;
    var errorMessage = error;

    if (_.isObject(error)) {
      errorMessage = error.message;
    }

    if (error instanceof BaseError && error.errorCode) {
      httpStatusCode = 400;
      if (error.errorCode > 499) {
        httpStatusCode = 500;
      } else if(error.errorCode === 409) {
        httpStatusCode = 409;
      } else if(error.errorCode === 404) {
        httpStatusCode = 404;
      }
      errorMessage = error.exportDetails();
    }

    return res.status(httpStatusCode).json(errorMessage);
  }
}

module.exports = new ErrorHandler();
