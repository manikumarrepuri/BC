
"use strict";

var BaseRoute   = require("itheon-route");
var MetricsService = require("./../service/metricsService");

class MetricRoutes extends BaseRoute
{
  constructor()
  {
    var metricsService = new MetricsService();
    super(metricsService, 'api/metrics');
  }
}

module.exports = new MetricRoutes();

// module.exports.delete = function (req, res) {
//   logger.info("MetricRoutes::delete - request received", {
//     httpMethod: req.method,
//     url: req.url,
//     body: req.body,
//     query: req.query.export(),
//     params: req.params
//   });

//   var metricsService = new MetricsService(null, req.query.getStorage());
//   try {
//     metricsService.delete(req.params.id)
//       .then(function (numberOfDeleted) {
//         if (numberOfDeleted === 0) {
//           return res.status(404).json("Not Found");
//         }
//         return res.status(204).json("No Content");
//       })
//       .catch(function (error) {
//         return errorHandler.resolve(error, req, res);
//       });
//   } catch (error) {
//     return errorHandler.resolve(error, req, res);
//   }
// };
