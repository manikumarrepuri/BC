
"use strict";

const appRootPath = require("app-root-path");
const logger      = require("opserve-common").logger;

module.exports.getDetails = function (req, res) {
  logger.info(req.method + " request: " + req.url);

  return res.status(200).json(req.user);
};
