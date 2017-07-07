
"use strict";

var logger = require("itheon-logger");

module.exports = function (err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send();
};
