
"use strict";

const AclRuleEntity           = require("itheon-module-acl-entity").AclRuleEntity;
const AclRuleCollectionEntity = require("itheon-module-acl-entity").AclRuleCollectionEntity;
const Request                 = require("itheon-request");
const _                       = require("itheon-utility").underscore;
const ItheonError             = require("itheon-error").BaseError;
const acl                     = require("../../../acl");

class AclRulesService
{
  constructor(aclRuleGateway, gatewayType)
  {
    this.setGateway(aclRuleGateway, gatewayType);
  }

  setGateway(aclRuleGateway, gatewayType)
  {
    if (!aclRuleGateway) {
      var AclRuleGateway = require("../gateway/aclRule/rethinkDbAclRuleGateway");
      aclRuleGateway = new AclRuleGateway();
    }

    this.aclRuleGateway = aclRuleGateway;
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
   * @return {[type]}            [description]
   */
  find(request)
  {
    request = request || new Request();
    var that = this;
    return this.aclRuleGateway.fetchAll(request)
      .then(function(collection) {
        var aclRuleCollectionEntity = new AclRuleCollectionEntity(null, AclRuleEntity);
        aclRuleCollectionEntity.setAllowAnyField(true);
        return aclRuleCollectionEntity.inflate(collection);
      }).then(function(aclRuleCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.aclRuleGateway.fetchAll(request)
          .then(function(totalNumberOfAclRules) {
            return aclRuleCollectionEntity.setTotalCount(totalNumberOfAclRules);
          });
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
    var aclRuleEntity = this.validateData(data);

    return this.aclRuleGateway.create(aclRuleEntity)
      .then(function (aclRuleData) {
        if (aclRuleData.errorCode) {
          throw new ItheonError(
            aclRuleData.message,
            aclRuleData.data,
            aclRuleData.errorCode
          );
        }
        let entity = new AclRuleEntity(aclRuleData);
        acl.createOrUpdate(entity);

        return entity;
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

    return this.aclRuleGateway.update(aclRuleEntity)
      .then(function (aclRuleData) {
        if (aclRuleData.errorCode) {
          throw new ItheonError(
            aclRuleData.message,
            aclRuleData.data,
            aclRuleData.errorCode
          );
        }

        let entity = new AclRuleEntity(aclRuleData);
        acl.createOrUpdate(entity);

        return entity;
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
    let rule = this.aclRuleGateway.fetchAll(new Request({conditions: {id}}));
    this.acl.delete(rule);

    return this.aclRuleGateway.delete(id);
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
