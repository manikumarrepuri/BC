
"use strict";

var _      = require("itheon-utility").underscore;
var logger = require("itheon-logger");

module.exports.id = function (req, res, next, id) {
  //return res.status(400).json('Bad Request');
  next();
};

module.exports.requestData = function (req, res, next) {
  if (_.isEmpty(req.body)) {
    logger.info("Invalid body provided", req.body);
    return res.status(400).json("Bad Request");
  }

  next();
};
