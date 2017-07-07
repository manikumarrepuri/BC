
"use strict";

module.exports.AmqpGateway                = require("./amqpGateway");
module.exports.BaseGateway                = require("./baseGateway");
module.exports.CacheGateway               = require("./cacheGateway");
module.exports.MemoryGateway              = require("./memoryGateway");
module.exports.HttpGateway                = require("./httpGateway");
module.exports.RedisGateway               = require("./redisGateway");
module.exports.RethinkDbGateway           = require("./rethinkDbGateway");
module.exports.RethinkDbChangefeedGateway = require("./rethinkDbChangefeedGateway");
module.exports.GatewayError               = require("./gatewayError");
