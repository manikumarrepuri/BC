
"use strict";

var _               = require("itheon-utility").underscore;
var RuleEngineError = require("./ruleEngineServiceError");

class RuleEngineService
{
  /**
  * Custom constructor
  */
  constructor()
  {
    this.logicOperators = ["$or", "$and"];
    this.matchedConditions = [];
  }


  /**
   * Method validates against rule. Uses recursive function to get
   * through nested conditions
   *
   * @param Metrics object can be metrics or a device with metrics
   * @param Rule   object  Rule(requires thresholds, definition)
   * @return Result result Result object containing code and severity if it was
   * successful
   */
  validate(device, rule)
  {
    if (!device || !_.isObject(device)) {
      throw new Error(
        "Invalid device passed. Object expected"
      );
    }

    if (!rule || !_.isObject(rule)) {
      throw new Error(
        "Invalid rule passed. Object expected"
      );
    }

    var thresholds = rule.thresholds;
    //We might want to know what entity we are working with.
    this.entity = rule.entity;

    if (_.isEmpty(thresholds)) {
      throw new Error(
        "Invalid rule passed. Thresholds list is missing or empty"
      );
    }

    if (!_.isObject(rule.definition) || _.isEmpty(rule.definition)) {
      throw new Error(
        "Invalid rule passed. Rule definition is missing or invalid"
      );
    }

    this.matchedConditions = [];

    for (let thresholdSeverity of Object.keys(thresholds)) {
      let thresholdVariables = thresholds[thresholdSeverity];

      let level = 1;
      let results = this.validateRule(
        device.metrics,
        rule.definition,
        thresholdVariables,
        1
      );

      if (results.indexOf(false) === -1) {
          let result = {
            code: "success",
            matchedConditions: this.matchedConditions
          };
          result.severity = parseInt(thresholdSeverity.split("severity").pop(), 10);
          return result;
      }
    }

    return {
      code: "failure"
    };
  }

  /**
   * Recursive method called by validate method. It validates one level
   * at the time and call itself if it finds any nesting.
   *
   * @param Array  metrics        Array of Metric objects
   * @param object ruleDefinition Definition of rule can be as simple as:
   * {
   *   cpuBusy: {
   *     "$gt": "cpuMax"
   *   }
   * }
   * or as complex as
   * {
   *   "$or": [
   *     {
   *       cpuBusy: {
   *         "$gt": "cpuMax"
   *       }
   *     },
   *     {
   *       physicalMemoryUsed: {
   *         "$gt": "memoryMax"
   *       }
   *     }
   *   ]
   * }
   * @param Array thresholdVariables List all variables used to resolve the
   * rule definition in following way:
   * {
   *   "cpuMax": "95",
   *   "memoryMax": "75"
   * }
   * @param int   level              Level of recursive call - safety fuse to
   * stop going deeper infitely(some attacks)
   * @return Array results Array of results merged for passed ruleDefinition
   */
  validateRule(metrics, ruleDefinition, thresholdVariables, level)
  {
    metrics = _.clone(metrics);

    var index, value, results = [], subResults;
    var subIndex, subValue, resultIndex, resultValue, tempResults;
    var that = this;

    _(ruleDefinition).forEach(function(value,index){
      if (that.logicOperators.indexOf(index) > -1) {
        level++;
        subResults = [];
        _(value).forEach(function(subValue){
          tempResults = that.validateRule(metrics, subValue, thresholdVariables, level);
          _(tempResults).forEach(function(result){
            subResults.push(result);
          });
        });

        if (index === "$and") {
          results.push(subResults.indexOf(false) > -1 ? false : true);
        } else {
          results.push(subResults.indexOf(true) > -1 ? true : false);
        }

        return false;
      }

      results.push(that.addLeafCondition(
        index,
        value,
        metrics,
        thresholdVariables
      ));
    });

    return results;
  }

  /**
   * Method compares last levels of condition
   *
   * @param metricName         string Name of metric
   * @param condition          mixed  Condition for metric name (it can be
   * string/int, array or object like {"$gt": 4}
   * @param metric             object metricName => metric list of device"s
   * metrics
   * @param thresholdVariables object containing variableName => value pairs
   * @return bool result Array of results
   */
  addLeafCondition(metricName, condition, metrics, thresholdVariables)
  {
    if (metricName.indexOf(".") === -1) {
      return this.parseSimpleCondition(
        metricName,
        condition,
        metrics,
        thresholdVariables
      );
    }

    return this.parseEntitiesCondition(
      metricName,
      condition,
      metrics,
      thresholdVariables
    );
  }

  /**
   * Method parses simple conditions (non entity level)
   *
   * @param metricName         string Name of metric
   * @param condition          mixed  Condition for metric name (it can be
   * string/int, array or object like {"$gt": 4}
   * @param metrics            object metricName => metric list of device's
   * metrics
   * @param thresholdVariables object containing variableName => value pairs
   * @return bool result Array of results
   */
  parseSimpleCondition(metricName, condition, metrics, thresholdVariables)
  {
    if (!metrics || !metrics.hasOwnProperty(metricName)) {
      throw new Error(
        "Unable to locate \"" + metricName + "\" metric required by rule"
      );
    }

    var currentState = metrics[metricName];
    if (_.isObject(metrics[metricName])) {
      currentState = metrics[metricName].value;
    }

    var variableValue = false;
    if (!_.isObject(condition)) {
      if (!_.isNull(thresholdVariables) && !thresholdVariables.hasOwnProperty(condition)) {
        throw new Error(
          "Unable to locate \"" + condition + "\" variable for \"" + metricName + "\" metric"
        );
      }

      variableValue = condition;
      if (!_.isNull(thresholdVariables)) {
        variableValue = thresholdVariables[condition];
      }

      this.matchedConditions.push({
        name: metricName,
        value: currentState,
        threshold: variableValue,
        operator: '$eq'
      });

      return currentState === variableValue;
    }

    var operator = _.keys(condition)[0];
    if (!_.isNull(thresholdVariables) &&  !thresholdVariables.hasOwnProperty(condition[operator])) {
      throw new Error(
        "Unable to locate \"" + condition[operator] + "\" variable for \"" + metricName + "\" metric"
      );
    }

    variableValue = condition[operator];
    if (!_.isNull(thresholdVariables)) {
      variableValue = thresholdVariables[condition[operator]];
    }

    // Check if we need to cast to float
    if (!isNaN(parseFloat(currentState)) && isFinite(currentState)) {
      currentState = parseFloat(currentState);
    }

    // Check if we need to cast to float
    if (!isNaN(parseFloat(variableValue)) && isFinite(variableValue)) {
      variableValue = parseFloat(variableValue);
    }

    var result;
    switch (operator) {
      case "$gt":
        result = currentState > variableValue;
        break;
      case "$gte":
        result = currentState >= variableValue;
        break;
      case "$lt":
        result = currentState < variableValue;
        break;
      case "$lte":
        result = currentState <= variableValue;
        break;
      case "$ne":
        result = currentState != variableValue;
        break;
      case "$contains":
        result = currentState.indexOf(variableValue) > -1;
        break;
      case "$begins":
        result = currentState.indexOf(variableValue) === 0;
        break;
      case "$ends":
        result = currentState.indexOf(variableValue, currentState.length - variableValue.length) !== -1;
        break;
      case "$regex":
        var pattern = new RegExp(variableValue);
        result = pattern.test(currentState);
        break;
      case "$in":
        if (!_.isArray(variableValue)) {
          throw new Error(
            "Variable \"" + condition.$in + "\" variable for \"" + metricName + "\" metric"
          );
        }
        result = variableValue.indexOf(currentState) > -1;
        break;
      case "$nin":
        if (!_.isArray(variableValue)) {
          throw new Error(
            "Unable to locate \"" + condition.$nin + "\" variable for \"" + metricName + "\" metric"
          );
        }
        result = variableValue.indexOf(currentState) === -1;
        break;
      default:
        throw new Error(
          "Invalid operator passed for " + metricName + " : " + operator
        );
    }

    // Warning: this true is not a dubbuging
    // It was added here to get all metrics when at least one was matched
    if (result || true) {
      this.matchedConditions.push({
        name: metricName,
        value: currentState,
        threshold: variableValue,
        operator: operator
      });
    }

    return result;
  }

  /**
   * Method parses entities conditions (non entity level)
   *
   * @param metricName         string Name of metric
   * @param condition          mixed  Condition for metric name (it can be
   * string/int, array or object like {"$gt": 4}
   * @param metric             object metricName => metric list of device"s
   * metrics
   * @param thresholdVariables object containing variableName => value pairs
   * @return bool result Array of results
   */
  parseEntitiesCondition(metricName, condition, metrics, thresholdVariables)
  {
   // Step 0 - split string and make sure it"s valid
    var metricNameParts = metricName.split(".");

    if (metricNameParts.length !== 3) {
      throw new Error(
        "Invalid metric name provided: " + metricName +
        ". 3 tier name expected like 'disks.*.diskUsed'"
      );
    }

    var entityType = metricNameParts[0];
    var entityName = metricNameParts[1];
    var entityMetricName = metricNameParts[2];

    // Step 1 - make sure that there are some metrics for that type of
    // device

    if (!metrics || !metrics.hasOwnProperty(entityType)) {
      throw new Error(
        "Unable to locate any \"" + entityType + "\" metrics required by rule"
      );
    }

    var entityTypeMetrics = metrics[entityType];
    var entityMetrics = false;

    // Step 2 - check what"s the entity name like "C" or "*" and wether that is the currently recieved metric
    if (entityName !== "*") {
      if(entityName !== this.entity) {
        throw new Error(
          "Attempting to evaulate \"" + entityName + "\"(required by rule), which does not match the current entity of \"" +
          this.entity + "\""
        );
      }

      if (!entityTypeMetrics.hasOwnProperty(entityName)) {
        throw new Error(
          "Unable to locate \"" + entityName + "\" entity of \"" + entityType +
          "\" type inside device metrics(required by rule)"
        );
      }

      entityMetrics = entityTypeMetrics[entityName];

      if (!entityMetrics.hasOwnProperty(entityMetricName)) {
        throw new Error(
          "Unable to locate \"" + entityMetricName + "\" metric for \"" +
          entityName + "\" entity of \"" + entityType +
          "\" type inside device metrics(required by rule)"
        );
      }

      var currentEntityValue = entityMetrics[entityMetricName];
      if(_.isObject(metrics[metricName])) {
        currentEntityValue = entityMetrics[entityMetricName].value;
      }

      var tempMetrics = {};
      tempMetrics[entityMetricName] = {
        "name": entityMetricName,
        "value": currentEntityValue
      };
      return this.parseSimpleCondition(
        entityMetricName,
        condition,
        tempMetrics,
        thresholdVariables
      );
    }

    //Process the entity rule against the currently recieved metrics.

    // for example disk "C" and array of C's metrics
    var entityMetrics = metrics[entityType][this.entity];
    var me = this;

    return me.parseSimpleCondition(
      entityMetricName,
      condition,
      entityMetrics,
      thresholdVariables
    );
  }

  /**
   * Method to deep copy metric list. Used when entities get involved and
   * code needs to delete not matching entities as it goes
   *
   * @param object metricsList List of metrics like:
   * {
   *   "cpuBusy": MetricObject
   *   "disks": {
   *     "C": {
   *       "diskName": MetricObject
   *       "diskUsed": MetricObject
   *     },
   *     "D": {
   *       "diskName": MetricObject
   *       "diskUsed": MetricObject
   *     }
   *   }
   * }
   * @return object clonedMetric 1 to 1 deep copy of metrics
   */
  cloneMetrics(metricsList)
  {
    var clonedMetrics = {};
    var firstMetric = metricsList[Object.keys(metricsList)[0]];

    //If we aren't using entites this is pretty easy!
    if (!(firstMetric instanceof MetricEntity) &&
        !(firstMetric[Object.keys(firstMetric)[0]] instanceof MetricEntity)
    ) {
      return _.clone(metricsList);
    }

    _(metricsList).forEach(function(metric, metricName){
      if (metric instanceof MetricEntity) {
        clonedMetrics[metricName] = new MetricEntity(metric.export());
        return false;
      }

      _(metric).forEach(function(entityMetrics, entityName) {
        entityMetrics = metric[entityName];

        // create metric name level
        if (!clonedMetrics.hasOwnProperty(metricName)) {
          clonedMetrics[metricName] = {};
        }

        clonedMetrics[metricName][entityName] = {};
        _(entityMetrics).forEach(function(entityMetric,entityMetricName) {
          // indexes for example [disks][C][diskUsed]
          clonedMetrics[metricName][entityName][entityMetricName] = new MetricEntity(entityMetric.export());
        });
      });

    });

    return clonedMetrics;
  }

  /**
   * Method to get a list of unique fields used in the rule. Uses recursive
   * function to get through nested conditions.
   *
   * @param ruleDefinition object Expects to get a list of conditions.
   * @param Level  integer        How far down the rabbit hole are we?
   * @return Result array         Unique list of fields used in the rule
   */
  getUniqueFieldsUsed(ruleDefinition, level)
  {
    var index, value, results = [], subResults;
    var subValue, tempResults;
    var that = this;

    _(ruleDefinition).forEach(function(value, index) {
      if (that.logicOperators.indexOf(index) > -1) {
        level++;
        subResults = [];
        _(value).forEach(function(subValue) {
          tempResults = that.getUniqueFieldsUsed(subValue, level);
          _(tempResults).forEach(function(result) {
            subResults.push(result);
          });
        });

        results = results.concat(_.uniq(subResults));
        return false;
      }

      results.push(index);
    });

    return _.uniq(results);
  }
}

module.exports = RuleEngineService;
