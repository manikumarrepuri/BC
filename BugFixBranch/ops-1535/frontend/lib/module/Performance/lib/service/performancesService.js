
"use strict";

const appRootPath       = require("app-root-path");
const PerformanceEntity = require("itheon-module-performance-entity").PerformanceEntity;
const DeviceEntity      = require("itheon-module-device-entity").DeviceEntity;
const common            = require("opserve-common");
const _                 = common.utilities.underscore;
const ItheonError       = common.error.BaseError;
const logger            = common.logger;
const Request           = common.Request;

class PerformancesService
{
  constructor(performancesGateway, deviceGateway)
  {
    this.setGateway(performancesGateway, deviceGateway);
  }

  setGateway(performancesGateway, deviceGateway)
  {
    if (!performancesGateway) {
      var PerformancesGateway = require(appRootPath + "/lib/module/Performance/lib/gateway/performance/httpPerformanceGateway");
      performancesGateway = new PerformancesGateway();
    }

    if (!deviceGateway) {
      var DeviceGateway = require(appRootPath + "/lib/module/Device/lib/gateway/device/httpDeviceGateway");
      deviceGateway = new DeviceGateway();
    }

    this.performancesGateway = performancesGateway;
    this.deviceGateway = deviceGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var deviceEntity = new DeviceEntity();
    var performanceEntity = new PerformanceEntity();
    return {
      "device": deviceEntity.getFields(),
      "performance": performanceEntity.getFields()
    };
  }

  /**
   * Method gets all performances matching passed query
   * @param  {[type]}   query    [description]
   * @return {[type]}            [description]
   */
  find(query)
  {
    query = query || new Request();
    return this.performancesGateway.fetchAll(query)
      .then(function (data) {
        return data || [];
      });
  }

  save(data)
  {
    logger.info("PerformanceService::save - data received", {
      data: data
    });

    var performanceEntity = new PerformanceEntity(data);

    var me = this;
    var deviceId = performanceEntity.get('group') + ':' + performanceEntity.get('name');
    var deviceData = {};
    var deviceMetrics = performanceEntity.get('metrics');
    var updatedMetrics = false;

    if (_.has(deviceMetrics, 'cpuBusy')) {
      deviceData.cpuBusy = parseFloat(deviceMetrics.cpuBusy.value);
      updatedMetrics = true;
    }

    if (_.has(deviceMetrics, 'physicalMemoryUsed')) {
      deviceData.physicalMemoryUsed = parseFloat(deviceMetrics.physicalMemoryUsed.value);
      updatedMetrics = true;
    }

    if (updatedMetrics) {
      deviceData.id = deviceId;
      deviceData.updatedAt = new Date();

      var deviceEntity = new DeviceEntity(deviceData);
      logger.info("PerformanceService::create - updating device using device gateway", {
        deviceData: deviceData,
        deviceEntity: deviceEntity
      });
      me.deviceGateway.update(deviceEntity, new Request({"storage": "db"}));
    }

    return this.performancesGateway.create(performanceEntity, new Request({"storage": "db"}))
      .then(function (performanceData) {
        if (performanceData.errorCode) {
          throw new ItheonError(
            performanceData.message,
            performanceData.data,
            performanceData.errorCode
          );
        }

        return performanceData;
      });
  }

  /**
   * Method inserts metrics
   */
  create(data)
  {
    return this.save(data);
  }

  /**
   * Method updates metrics
   */
  update(data)
  {
    return this.save(data);
  }
}

module.exports = PerformancesService;
