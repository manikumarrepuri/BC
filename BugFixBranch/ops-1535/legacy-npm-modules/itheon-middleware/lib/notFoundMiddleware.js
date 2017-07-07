
"use strict";

var logger = require("itheon-logger");

module.exports = function (req, res, next) {
  logger.error("NotFoundMiddleware: Non matching routes found", {
    httpMethod: req.method,
    url: req.url,
    query: req.query.export()
  });
  res.status(404).json('Not Found');
};
