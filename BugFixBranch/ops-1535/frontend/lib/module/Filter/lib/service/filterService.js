
"use strict";

const appRootPath = require("app-root-path");
const common      = require("opserve-common");
const Request     = common.Request;
const _           = common.utilities.underscore;
const lodash      = require('lodash');

/**
 * AlertHistorys service class definition
 */
class FilterService {
  constructor(filterGateway) {
    this.setGateway(filterGateway);
  }

  setGateway(filterGateway) {
    if (!filterGateway || _.isString(filterGateway)) {
      var FilterGateway = require("../gateway/filter/httpFilterGateway");
      filterGateway = new FilterGateway();
    }
    this.filterGateway = filterGateway;
  }

  /**
   * Method gets all persistent filter(s)
   * @param  {[type]}   query    [description]
   * @return Promise filters collection
   */
  find(request) {
    request = request || new Request();
    var that = this;
    return this.filterGateway.fetchAll(request).then(function (collection) {
      return collection;
      // return that.patchFilters(collection);
    });
  }

  /**
   * Method fix's filters and add's missing data expected by the frontend.
   * @param  {[array|object]}   filters    [filters|filters to correct]
   * @return returns fixed up data
   */
  patchFilters(collection) {
    //Fix up the data ready for the frontend
    lodash.forEach(collection.filters, function (filter, index, theArray) {
      if (filter.createdAt) {
        //Create the date objects
        filter.createdAt = new Date(filter.createdAt);
      }
    });

    return collection;
  }

  /**
   * Method creates the passed data using gateway
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  create(data) {
    return this.filterGateway.save(data, new Request({ "storage": "db" }))
      .then(function (filterData) {
        return filterData;
      });
  }

}

module.exports = FilterService;
