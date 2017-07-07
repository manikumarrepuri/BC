
"use strict";

var AclRuleEntity           = require("itheon-module-acl-entity").AclRuleEntity;
const common                = require("opserve-common");
const _                     = common.utilities.underscore;
const ItheonError           = common.error.BaseError;
const Request               = common.Request;


/**
 * AclRules service class definition
 */
class AclRulesService
{
  constructor(aclRulesGateway)
  {
    this.setGateway(aclRulesGateway);
  }

  setGateway(aclRulesGateway)
  {
    if (!aclRulesGateway) {
      var AclRulesGateway = require("../gateway/aclRule/httpAclRuleGateway");
      aclRulesGateway = new AclRulesGateway();
    }

    this.aclRulesGateway = aclRulesGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/aclRules
  */
  getSchema()
  {
    var aclRuleEntity = new AclRuleEntity();
    return {
      "aclRule": aclRuleEntity.getFields()
    };
  }

  /**
   * Method gets all aclRules matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(query)
  {
    query = query || new Request();
    var that = this;

    return this.aclRulesGateway.fetchAll(query).then(function(collection) {
      return that.patchAclRules(collection);
    });
  }

  // Placeholder
  patchAclRules(collection)
  {
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
    var aclRuleEntity = this.validateData(data);

    return this.aclRulesGateway.create(aclRuleEntity)
      .then(function (aclRuleData) {
        if(aclRuleData.errorCode) {
          throw new ItheonError(
            aclRuleData.message,
            aclRuleData.data,
            aclRuleData.errorCode
          );
        }

        return new AclRuleEntity(aclRuleData);
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
    var aclRuleEntity = this.validateData(data);

    return this.aclRulesGateway.update(aclRuleEntity)
      .then(function (aclRuleData) {
        if(aclRuleData.errorCode) {
          throw new ItheonError(
            aclRuleData.message,
            aclRuleData.data,
            aclRuleData.errorCode
          );
        }

        return new AclRuleEntity(aclRuleData);
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
    return this.aclRulesGateway.delete(id);
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

    return new AclRuleEntity(data);
  }
}

module.exports = AclRulesService;
