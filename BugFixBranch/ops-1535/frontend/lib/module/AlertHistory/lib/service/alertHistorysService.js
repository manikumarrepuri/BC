
"use strict";

var appRootPath                   = require("app-root-path");
var AlertHistoryEntity            = require("itheon-module-alert-entity").AlertHistoryEntity;
var lodash = require('lodash');
const common                      = require("opserve-common");
const _                           = common.utilities.underscore;
const ItheonError                 = common.error.BaseError;
const Request                     = common.Request;

/**
 * AlertHistorys service class definition
 */
class AlertHistorysService
{
  constructor(alertHistorysGateway, alertHistoryAlertHistorysGateway)
  {
    this.setGateway(alertHistorysGateway, alertHistoryAlertHistorysGateway);
  }

  setGateway(alertHistorysGateway, alertHistoryAlertHistorysGateway)
  {
    if (!alertHistorysGateway || _.isString(alertHistorysGateway)) {
      var AlertHistorysGateway = require("../gateway/alertHistory/httpAlertHistoryGateway");
      alertHistorysGateway = new AlertHistorysGateway();
    }

    if (!alertHistoryAlertHistorysGateway || _.isString(alertHistoryAlertHistorysGateway)) {
      var AlertHistoryAlertHistorysGateway = require(appRootPath + "/lib/module/AlertHistory/lib/gateway/alertHistory/httpAlertHistoryGateway");
      alertHistoryAlertHistorysGateway = new AlertHistoryAlertHistorysGateway();
    }

    this.alertHistorysGateway = alertHistorysGateway;
    this.alertHistoryAlertHistorysGateway = alertHistoryAlertHistorysGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    // var alertHistoryEntity = new AlertHistoryEntity();
    // return {
    //   "alertHistory": alertHistoryEntity.getFields()
    // };
  }

  /**
   * Method gets all "active" alertHistorys matching passing the query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();

    var that = this;
    return this.alertHistorysGateway.fetchAll(request).then(function(collection){
      return that.patchAlertHistorys(collection);
    });
  }

  /**
   * Method fix's alertHistorys and add's missing data expected by the frontend.
   * @param  {[array|object]}   alertHistorys    [alertHistorys|alertHistory to correct]
   * @return returns fixed up data
   */
  patchAlertHistorys(collection)
  {
    //Fix up the data ready for the frontend
    lodash.forEach(collection.alertHistory, function(alertHistory,index,theArray) {
      if (alertHistory.createdAt) {
        //Create the date objects
        alertHistory.createdAt = new Date(alertHistory.createdAt);
      }

      if (alertHistory.state == 'C') {
        //Work out how long each occurrence took to close
        var msDiff = alertHistory.createdAt.getTime() - alertHistory.firstOccurrence; //in ms
        //var hourDiff = msDiff / 3600 / 1000; //in hours
        var minDiff = msDiff / 60 / 1000; //in minutes
        //var secDiff = msDiff / 1000; //in s

        alertHistory.timeToClose = parseInt(Math.ceil(minDiff), 10);
      }

      if (alertHistory.brief) {
        // Hightlight any percentages
        alertHistory.brief = alertHistory.brief.replace(/([0-9.]+\s*%)/, function(a, b) {
          return '<mark>' + b + '</mark>';
        });
      }

      if (alertHistory.fullText) {
        alertHistory.fullText = alertHistory.fullText.replace(/([0-9.]+\s*%)/, function(a, b) {
          return '<mark>' + b + '</mark>';
        });
      }

      //Update the collection
      // collection.updateEntity(alertHistory);
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
    // var alertHistoryEntity = this.validateData(data);

    return this.alertHistorysGateway.save(data, new Request({"storage": "db"}))
      .then(function (alertHistoryData) {
        // if(alertHistoryData.errorCode) {
        //   throw new ItheonError(
        //     alertHistoryData.message,
        //     alertHistoryData.data,
        //     alertHistoryData.errorCode
        //   );
        // }

        return alertHistoryData;
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
    // var alertHistoryEntity = this.validateData(data);

    return this.alertHistorysGateway.update(data)
      .then(function (alertHistoryData) {
        // if(alertHistoryData.errorCode) {
        //   throw new ItheonError(
        //     alertHistoryData.message,
        //     alertHistoryData.data,
        //     alertHistoryData.errorCode
        //   );
        // }

        return alertHistoryData;
      });
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

    return new AlertHistoryEntity(data);
  }

}

module.exports = AlertHistorysService;
