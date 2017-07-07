"use strict";

var DeviceEntity            = require("itheon-module-device-entity").DeviceEntity;
var lodash                  = require('lodash');
const common                = require("opserve-common");
const _                     = common.utilities.underscore;
const ItheonError           = common.error.BaseError;
const Request               = common.Request;

/**
 * Devices service class definition
 */
class DevicesService
{
  constructor(devicesGateway, gatewayType)
  {
    this.setGateway(devicesGateway, gatewayType);
  }

  setGateway(devicesGateway, gatewayType)
  {
    if (!devicesGateway) {
      var DevicesGateway = require("../gateway/device/httpDeviceGateway");
      devicesGateway = new DevicesGateway();
    }

    this.devicesGateway = devicesGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/devices
  */
  getSchema()
  {
    var deviceEntity = new DeviceEntity();
    return {
      "device": deviceEntity.getFields()
    };
  }

  /**
  * Method gets all devices matching passed query
  * @param  {[type]}   query    [description]
  * @return Promise results Promise of mapper"s results
  */
  find(query)
  {
    query = query || new Request();
    var conditions = query.getConditions();
    conditions.status = 1;
    query.setConditions(conditions);

    var fields = query.getFields();
    var includeRules = true;

    // Check if we just want specific fields
    if (!fields) {
      query.setFields(['d.*','r.*', 't.*']);
    } else {
      // Check if any of those fields are from the devices table
      includeRules = _.findIndex(fields, function(value) {
        if(value.indexOf('r.') === 0) {
          return true;
        }
      });
    }

    // If we need something from the rules table include it
    if (includeRules !== -1) {
      query.setJoins(['rules', 'tags']);
    }

    var that = this;
    return this.devicesGateway.fetchAll(query)
      .then(function(collection) {
        if (includeRules !== -1 && conditions.whatToFetch == "1") {
          return that.patchDevices(collection);
        }
        return collection;
      });
  }

  /**
  * Method fix's devices and add's missing data expected by the frontend.
  * @param  {[array|object]}   devices    [devices|device to correct]
  * @return returns fixed up data
  */
  patchDevices(collection)
  {
    //Fix up the data ready for the frontend
       lodash.forEach(collection.devices, function(device,index,theArray) {
            //Skip additional processing of the Generic device
            if(device.id == 'Bluechip:Generic')
              return;

            // count the number of events
            theArray[index].alertsCount = _.size(device.alerts);

            // Currently we're getting too much data and rendering is taking a huge hit
            // So we are taking just the metrics we actually need
            var metrics = {};

            if (device.hasOwnProperty('metrics')) {

              if (device.metrics.hasOwnProperty('cpuBusy')) {
                metrics.cpuBusy = device.metrics.cpuBusy;
                theArray[index].cpuBusy = device.metrics.cpuBusy.value;
              }

              if (device.metrics.hasOwnProperty('pctSystemAspUsed')) {
                metrics.pctSystemAspUsed = device.metrics.pctSystemAspUsed;
                metrics.pctSystemAspUsed.value = parseFloat(device.metrics.pctSystemAspUsed.value).toFixed(2);
                theArray[index].pctSystemAspUsed = device.metrics.pctSystemAspUsed.value;
              }

              if (device.metrics.hasOwnProperty('physicalMemoryUsed')) {
                metrics.physicalMemoryUsed = device.metrics.physicalMemoryUsed;
                theArray[index].physicalMemoryUsed = device.metrics.physicalMemoryUsed.value;
              }
            }

            // Replace the metrics object with our new one.
            theArray[index].metrics = metrics;

            // Check if the device has a custom name
            if (!device.displayName) {
              theArray[index].displayName = device.name;
            }

            // Fix device group
            if (device.group && device.group.indexOf(':') !== -1) {
              let groupArr = device.group.split(':');
              //If the last element of the array is the computer name delete it
              if (groupArr[groupArr.length - 1] == device.name) {
                delete groupArr[groupArr.length - 1];
              }
              theArray[index].group = groupArr.join(' ');
            }

            //Set date object's for device
            theArray[index].createdAt = new Date(device.createdAt);
            theArray[index].updatedAt = new Date(device.updatedAt);

            //Update the collection
            // collection.updateEntity(device);
        });

    return collection;
  }

  /**
   * Method creates the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  create(data)
  {
    // var deviceEntity = this.validateData(data);

    return this.devicesGateway.save(data, new Request({"storage": "db"}))
      .then(function (deviceData) {
        // if(deviceData.errorCode) {
        //   throw new ItheonError(
        //     deviceData.message,
        //     deviceData.data,
        //     deviceData.errorCode
        //   );
        // }
        return deviceData; 
      });
  }

  /**
   * Method update the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  update(data)
  {
    // var deviceEntity = this.validateData(data);

    return this.devicesGateway.update(data)
      .then(function (deviceData) {
        // if(deviceData.errorCode) {
        //   throw new ItheonError(
        //     deviceData.message,
        //     deviceData.data,
        //     deviceData.errorCode
        //   );
        // }

        return deviceData;
      });
  }

  /**
   * Method delete the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  delete(id)
  {
    return this.devicesGateway.delete(id);
  }

  /**
   * Method checks data for create/update method
   *
   * @param object data Object with data
   */
  validateData(data)
  {
    if (!_.isObject(data)) {
      throw new ItheonError(
        "Invalid data provided. Object describing entity properties expected.",
        {
          data: data
        }
      );
    }

    return new DeviceEntity(data);
  }
}

module.exports = DevicesService;
