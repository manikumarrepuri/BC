"use strict";

var appRootPath                 = require("app-root-path");
var {{Module}}Entity            = require("itheon-module-{{module}}-entity").{{Module}}Entity;
var {{Module}}CollectionEntity  = require("itheon-module-{{module}}-entity").{{Module}}CollectionEntity;
var Request                     = require("itheon-request");
var _                           = require("itheon-utility").underscore;
var ItheonError                 = require("itheon-error").BaseError;

/**
 * {{Module}}s service class definition
 */
class {{Module}}sService
{
  constructor({{module}}sGateway, gatewayType)
  {
    this.setGateway({{module}}sGateway, gatewayType);
  }

  setGateway({{module}}sGateway, gatewayType)
  {
    if (!{{module}}sGateway) {
      var {{Module}}sGateway = require("../gateway/{{module}}/http{{Module}}Gateway");
      {{module}}sGateway = new {{Module}}sGateway();
    }

    this.{{module}}sGateway = {{module}}sGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/{{module}}s
  */
  getSchema()
  {
    var {{module}}Entity = new {{Module}}Entity();
    return {
      "{{module}}": {{module}}Entity.getFields()
    };
  }

  /**
  * Method gets all {{module}}s matching passed query
  * @param  {[type]}   query    [description]
  * @return Promise results Promise of mapper"s results
  */
  find(query)
  {
    query = query || new Request();
    var conditions = query.getConditions();
    conditions.status = 1;
    query.setConditions(conditions);

    var that = this;
    return this.{{module}}sGateway.fetchAll(query)
      .then(function(collection) {
          return that.patch{{Module}}s(collection);
      });
  }

  /**
  * Method fix's {{module}}s and add's missing data expected by the frontend.
  * @param  {[array|object]}   {{module}}s    [{{module}}s|{{module}} to correct]
  * @return returns fixed up data
  */
  patch{{Module}}s(collection)
  {
    //Fix up the data ready for the frontend
    _(collection.export()).forEach(function({{module}}, key) {
      //Custom logic to patch fields / add additional calculated fields etc.

      //Set date object's for {{module}}
      {{module}}.createdAt = new Date({{module}}.createdAt);
      {{module}}.updatedAt = new Date({{module}}.updatedAt);

      //Update the collection
      collection.updateEntity({{module}});
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
    var {{module}}Entity = this.validateData(data);

    return this.{{module}}sGateway.save({{module}}Entity, new Request({"storage": "db"}))
      .then(function ({{module}}Data) {
        if({{module}}Data.errorCode) {
          throw new ItheonError(
            {{module}}Data.message,
            {{module}}Data.data,
            {{module}}Data.errorCode
          );
        }

        return new {{Module}}Entity({{module}}Data);
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
    var {{module}}Entity = this.validateData(data);

    return this.{{module}}sGateway.update({{module}}Entity)
      .then(function ({{module}}Data) {
        if({{module}}Data.errorCode) {
          throw new ItheonError(
            {{module}}Data.message,
            {{module}}Data.data,
            {{module}}Data.errorCode
          );
        }

        return new {{Module}}Entity({{module}}Data);
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
    return this.{{module}}sGateway.delete(id);
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

    return new {{Module}}Entity(data);
  }
}

module.exports = {{Module}}sService;
