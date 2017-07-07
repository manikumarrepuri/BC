
"use strict";

var TagEntity           = require("itheon-module-tag-entity").TagEntity;
const common            = require("opserve-common");
const _                 = common.utilities.underscore;
const ItheonError       = common.error.BaseError;
const Request           = common.Request;

/**
 * Tags service class definition
 */
class TagsService
{
  constructor(tagsGateway, gatewayType)
  {
    this.setGateway(tagsGateway, gatewayType);
  }

  setGateway(tagsGateway, gatewayType)
  {
    if (!tagsGateway) {
      var TagsGateway = require("../gateway/tag/httpTagGateway");
      tagsGateway = new TagsGateway();
    }

    this.tagsGateway = tagsGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var tagEntity = new TagEntity();
    return {
      "tag": tagEntity.getFields()
    };
  }

  /**
   * Method gets all tags matching passed request
   * @param  {[type]}   request    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();
    var conditions = request.getConditions();
    conditions.status = 1;
    request.setConditions(conditions);

    return this.tagsGateway.fetchAll(request)
      .then(function(collection) {
        return collection;
      });
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
    var tagEntity = this.validateData(data);

    return this.tagsGateway.create(tagEntity)
      .then(function (tagData) {
        if(tagData.errorCode) {
          throw new ItheonError(
            tagData.message,
            tagData.data,
            tagData.errorCode
          );
        }

        return new TagEntity(tagData);
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
    var tagEntity = this.validateData(data);

    return this.tagsGateway.update(tagEntity)
      .then(function (tagData) {
        if(tagData.errorCode) {
          throw new ItheonError(
            tagData.message,
            tagData.data,
            tagData.errorCode
          );
        }

        return new TagEntity(tagData);
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
    return this.tagsGateway.delete(id);
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

    return new TagEntity(data);
  }
}

module.exports = TagsService;
