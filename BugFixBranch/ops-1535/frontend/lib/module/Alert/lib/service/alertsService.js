
"use strict";

var appRootPath           = require("app-root-path");
var lodash = require('lodash');
const common              = require("opserve-common");
const _                   = common.utilities.underscore;
const ItheonError         = common.error.BaseError;
const Request             = common.Request;

/**
 * Alerts service class definition
 */
class AlertsService
{
  constructor(alertsGateway, alertHistorysGateway, deviceAlertsGateway)
  {
    this.setGateway(alertsGateway, alertHistorysGateway, deviceAlertsGateway);
  }

  setGateway(alertsGateway, alertHistorysGateway, deviceAlertsGateway)
  {
    if (!alertsGateway || _.isString(alertsGateway)) {
      var AlertsGateway = require("../gateway/alert/httpAlertGateway");
      alertsGateway = new AlertsGateway();
    }

    if (!alertHistorysGateway || _.isString(alertHistorysGateway)) {
      var AlertHistorysGateway = require(appRootPath + "/lib/module/AlertHistory/lib/gateway/alertHistory/httpAlertHistoryGateway");
      alertHistorysGateway = new AlertHistorysGateway();
    }

    if (!deviceAlertsGateway || _.isString(deviceAlertsGateway)) {
      var DeviceAlertsGateway = require(appRootPath + "/lib/module/Device/lib/gateway/alert/httpAlertGateway");
      deviceAlertsGateway = new DeviceAlertsGateway();
    }

    this.alertsGateway = alertsGateway;
    this.alertHistorysGateway = alertHistorysGateway;
    this.deviceAlertsGateway = deviceAlertsGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    // var alertEntity = new AlertEntity();
    // return {
    //   "alert": alertEntity.getFields()
    // };
  }

  /**
   * Method gets all "active" alerts matching passing the query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();

    var that = this;
    return this.alertsGateway.fetchAll(request).then(function(collection){
      return that.patchAlerts(collection);
    });
  }

  /**
   * Method fix's alerts and add's missing data expected by the frontend.
   * @param  {[array|object]}   alerts    [alerts|alert to correct]
   * @return returns fixed up data
   */
  patchAlerts(collection)
  {
    //Fix up the data ready for the frontend
    lodash.forEach(collection.alerts, function(alert,index,theArray) {
      if (alert.createdAt) {
        //Create the date objects
        alert.createdAt = new Date(alert.createdAt);
      }

      if (alert.state == 'C') {
        //Work out how long each occurrence took to close
        if(alert.createdAt && alert.firstOccurrence){
          var msDiff = alert.createdAt.getTime() - alert.firstOccurrence; //in ms
          //var hourDiff = msDiff / 3600 / 1000; //in hours
          var minDiff = msDiff / 60 / 1000; //in minutes
          //var secDiff = msDiff / 1000; //in s
          alert.timeToClose = parseInt(Math.ceil(minDiff), 10);
        }      
      }

      if (alert.brief) {
        // Hightlight any percentages
        alert.brief = alert.brief.replace(/([0-9.]+\s*%)/, function(a, b) {
          return '<mark>' + b + '</mark>';
        });
      }

      if (alert.fullText) {
        alert.fullText = alert.fullText.replace(/([0-9.]+\s*%)/, function(a, b) {
          return '<mark>' + b + '</mark>';
        });
      }

      //Update the collection
      // collection.updateEntity(alert);
    });

    return collection;
  }

  /**
   * Method first update's any previous alerts and then calls the save method
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  save(data)
  {
    if (!_.isObject(data)) {
      throw new ItheonError("Invalid data provided. Object describing model properties expected.");
    }

    // let alert = new AlertEntity(data);
    var that = this;
    var startingPromise;
    if (data.state !== 'N' && !data._id) {

      var request = new Request({
        fields: [
          "_id",
          "acknowledged",
          "assignee"
        ],
        conditions: {
          "firstOccurrence": data.firstOccurrence,
          "deviceId": data.deviceId,
          "entity": data.entity,
          "ruleName": data.ruleName,
          "status" : 1
        },
        limit: 1
      });
      startingPromise = this.alertHistorysGateway.fetchAll(request).then(function(alertsCollection) {
        let entities = alertsCollection;
        if (_.isEmpty(entities)) {
          return false;
        }
        var alert = entities[Object.keys(entities)[0]];
        return {
          acknowledged: alert.acknowledged,
          assignee: alert.assignee,
        }
      });
    } else if (data._id) {
      startingPromise = new Promise(function(resolve, reject) {
        resolve({
          acknowledged: data.acknowledged,
          assignee: data.assignee,
        });
      });

    } else {
      //New Alert
      startingPromise = new Promise(function(resolve, reject) {
        resolve(false);
      });
    }

    return startingPromise.then(function(flags) {
      if(flags){
        if(flags.acknowledged)
        {
          data.acknowledged = flags.acknowledged;
        }
        if(flags.assignee)
        {
          data.assignee = flags.assignee;
        }
      }
      return that.alertsGateway.save(data)
        .then(function (alertData) {
          if(alertData){
            if(!alertData.assignee && !alertData.acknowledged)
            that.alertHistorysGateway.create(alertData);
          }
          if (alertData.state === 'N') {
            that.deviceAlertsGateway.create(alertData.deviceId, {id: alertData.ruleName});
          } else if (alertData.state === 'C') {
            that.deviceAlertsGateway.delete(alertData.deviceId, alertData.ruleName);
          } 
          return alertData;
        });
    });
  }

  create(data)
  {
    return this.save(data);
  }

  update(data)
  {
    return this.save(data);
  }
}

module.exports = AlertsService;
