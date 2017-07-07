
"use strict";

module.exports.AlertEntity                  = require("./alertEntity");
module.exports.AlertCollectionEntity        = require("./alertCollectionEntity");
//Export the same packages again we may want to diverge alert history but no need yet.
module.exports.AlertHistoryEntity           = require("./alertEntity");
module.exports.AlertHistoryCollectionEntity = require("./alertCollectionEntity");
