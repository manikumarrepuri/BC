
"use strict";

var RuleEntity           = require("itheon-module-rule-entity").RuleEntity;
const common             = require("opserve-common");
const _                  = common.utilities.underscore;
const ItheonError        = common.error.BaseError;
const Request            = common.Request;

/**
 * Rules service class definition
 */
class RulesService
{
  constructor(rulesGateway)
  {
    this.setGateway(rulesGateway);
  }

  setGateway(rulesGateway)
  {
    if (!rulesGateway) {
      var RulesGateway = require("../gateway/rule/httpRuleGateway");
      rulesGateway = new RulesGateway();
    }

    this.rulesGateway = rulesGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var ruleEntity = new RuleEntity();
    return {
      "rule": ruleEntity.getFields()
    };
  }

  /**
   * Method gets all rules matching passed query
   * @param  {[type]}   query    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(query)
  {
    query = query || new Request();
    var that = this;

    return this.rulesGateway.fetchAll(query).then(function(collection){
      return that.patchRules(collection);
    });
  }

  // Placeholder
  patchRules(collection)
  {
    return collection;
  }

  /**
   * Method gets single rule by passed id
   * @param  {[type]} id      [description]
   * @return {[type]} promise [description]
   */
  updateThresholds(fields)
  {
    var valid = true;
    var aSyncFunctions = [];

    //If we don't have a name/location then this is the global device
    var name = fields.name || 'Generic';
    var location = fields.location || 'Bluechip';
    //Create deviceId from location/name
    var deviceId = location + ':' + name;

    //Generate threshold object
    var thresholds = this.createThresholdObject(fields);

    var that = this;
    return this.getRulesByIds(deviceId,thresholds).then(function(rules) {
      _.each(rules, function(rule, key) {
        aSyncFunctions.push(new Promise(function(resolve, reject) {
          rule = _.clone(rule.data);
          var ruleEntity = new RuleEntity();
          ruleEntity.id = rule.id;

          var updatedThresholds = rule.thresholds;
          //Loop through threshold changes
          _.each(thresholds[rule.name], function(severity, key) {
            //For each severity check the varaibles that need to be updated
            _.each(severity, function(varaible, notUsed) {
              updatedThresholds[key][varaible.threshold] = varaible.value;
            });
          });

          ruleEntity.thresholds = updatedThresholds;

          return that.rulesGateway.update(ruleEntity).then(function(result) {
            if (typeof result != "object") reject('failed to update rule');
            resolve(result);
          });
        }));
      });
    }).then(function(){
      //Resolve the promises and merge the keys
      return Promise.all(aSyncFunctions).then(function(results) {
        return results;
      });
    });
  }

  /**
   * Method to loop through updated thresholds and generate a useable <object> array
   * @param  {[type]} fields      [fields to convert to object]
   * @return {[object]} threshold [thresholds array of object]
   */
  createThresholdObject(fields)
  {
    var thresholds = {};
    var isNotNumber = /[^0-9]+/;
    var failures = [];

    delete fields.id;
    delete fields.name;
    delete fields.location;

    _.each(fields, function(value, key) {
      var thresholdParts = key.split('-');
      thresholdParts.push(value);

      //if statement to check that the value is a valid number
      if (isNotNumber.test(value)) {
        failures.push(thresholdParts);
      }

      if(typeof thresholds[thresholdParts[0]] == 'undefined') {
        thresholds[thresholdParts[0]] = {};
      }

      if(typeof thresholds[thresholdParts[0]]['severity'+ thresholdParts[1]] == 'undefined') {
        thresholds[thresholdParts[0]]['severity'+ thresholdParts[1]] = [];
      }

      thresholds[thresholdParts[0]]['severity'+ thresholdParts[1]].push({'threshold': thresholdParts[2], 'value': thresholdParts[3]});
    });

    //Check if we have a failure
    if(!_.isEmpty(failures)) {
      throw new ItheonError("Invalid data provided. "+ failures);
    }

    return thresholds;
  }

  /**
   * Method gets single rule by passed id
   * @param  {[type]} id      [description]
   * @return {[type]} promise [description]
   */
  getRulesByIds(deviceId, object)
  {
    var that = this;
    var aSyncFunctions = [];
    var query = new Request();

    _.each(object, function(notUsed, ruleName) {
      query.setConditions({"deviceId": deviceId, "name": ruleName});

      aSyncFunctions.push(new Promise(function(resolve, reject) {
        return that.rulesGateway.sendGetRequest(query).then(function(rule) {
          if (!_.isArray(rule)) reject('nothing found');
          resolve(rule);
        });
      }));
    });

    //Resolve the promises and merge the keys
    return Promise.all(aSyncFunctions).then(function(results) {
      var rules = [];
      //Loop through the results from the nodes
      for (var i = 0; i < results.length; i++) {
        rules.push({'id': results[i][0].id, 'data': results[i][0]});
      }
      return rules;
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
    var ruleEntity = this.validateData(data);

    return this.rulesGateway.create(ruleEntity)
      .then(function (ruleData) {
        if(ruleData.errorCode) {
          throw new ItheonError(
            ruleData.message,
            ruleData.data,
            ruleData.errorCode
          );
        }

        return new RuleEntity(ruleData);
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
    var ruleEntity = this.validateData(data);

    return this.rulesGateway.update(ruleEntity)
      .then(function (ruleData) {
        if(ruleData.errorCode) {
          throw new ItheonError(
            ruleData.message,
            ruleData.data,
            ruleData.errorCode
          );
        }

        return new RuleEntity(ruleData);
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
    return this.rulesGateway.delete(id);
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

    return new RuleEntity(data);
  }
}

module.exports = RulesService;
