
"use strict";

var _            = require("itheon-utility").underscore;
var RequestError = require("./requestError");

/**
 * Request class provides deep validation of user's requests
 */
class Request
{
  /**
   * Custom constructor sets supported logical, order and comparision
   * operators
   */
  constructor(requestData)
  {
    this.supportedLogicOperators = [
      "and",
      "or"
    ];

    this.supportedOrderOperators = [
      "asc",
      "desc"
    ];

    this.supportedComparisionOperators = [
      "eq",      // Matches values that are exactly the same as the value specified in the query.
      "gt",      // Matches values that are greater than the value specified in the query.
      "gte",     // Matches values that are greater than or equal to the value specified in the query.
      "lt",      // Matches values that are less than the value specified in the query.
      "lte",     // Matches values that are less than or equal to the value specified in the query.
      "ne",      // Matches all values that are not equal to the value specified in the query.
      "in",      // Matches values that do exist in an array specified to the query.
      "nin",     // Matches values that do not exist in an array specified to the query.
      "regex",   // Matches values using a regular expression on the specified query.
      "like",    // Matches values that are matching pattern passed in the value specified in the query.
      "contains" // Matches one of values in passed key which needs to be array
    ];

    this.supportedOperators = _.union(
      this.supportedOrderOperators,
      this.supportedComparisionOperators
    );

    this.defaultResultsLimit = 50;
    this.reset();

    if (requestData) {
      this.inflate(requestData);
    }
  }

  /**
   * Method inflates an Request object using passed data
   *
   * @param  object data Assoc array of conditions, fields, joins etc.
   * @return Request this Fluent interface
   */
  inflate(data)
  {
    if (_.has(data, "fields")) {
      this.setFields(data.fields);
    }

    if (_.has(data, "without")) {
      this.setWithout(data.without);
    }

    if (_.has(data, "joins")) {
      this.setJoins(data.joins);
    }

    if (_.has(data, "conditions")) {
      this.setConditions(data.conditions);
    }

    if (_.has(data, "payload")) {
      this.setPayload(data.payload);
    }

    if (_.has(data, "order")) {
      this.setOrder(data.order);
    }

    if (_.has(data, "group")) {
      this.setGroup(data.group);
    }

    if (_.has(data, "limit")) {
      this.setLimit(data.limit);
    }

    if (_.has(data, "max")) {
      this.setMax(data.max);
    }

    if (_.has(data, "min")) {
      this.setMin(data.min);
    }

    if (_.has(data, "sum")) {
      this.setSum(data.sum);
    }

    if (_.has(data, "avg")) {
      this.setAvg(data.avg);
    }

    if (_.has(data, "offset")) {
      this.setOffset(data.offset);
    }

    if (_.has(data, "storage")) {
      this.setStorage(data.storage);
    }

    if (_.has(data, "count")) {
      this.enableCount();
    }

    if (_.has(data, "distinct")) {
      this.setDistinct(data.distinct);
    }

    return this;
  }

  /**
   * Method sets list of fields to be retrieved
   * Converts 0: id to id: id
   *
   * @param array|object|string fields List of fields or single field
   * @return Request this Fluent interface
   */
  setFields(fields)
  {
    if (_.isString(fields)) {
      fields = [fields];
    }

    if ((!_.isArray(fields) && !_.isObject(fields)) || _.isEmpty(fields)) {
      throw new RequestError(
        "Invalid list of fields provided. String|Object|Array expected",
        {
          fields: fields
        },
        2
      );
    }

    let filtered = {};
    _(fields).forEach(function(field, index) {

      if (!_.isString(field) || _.isEmpty(field)) {

        let type = "field";
        if (isNaN(index)) {
          type = "field alias";
        }

        throw new RequestError(
          "Invalid " + type + " passed: '" + field + "'",
          {
            field : field
          },
          3
        );
      }

      if (_.isString(index) && _.isEmpty(index)) {
        throw new RequestError(
          "Invalid field passed: '" + index + "'",
          {
            index: index
          },
          4
        );
      }

      if (isNaN(index)) {
        filtered[index] = field;
      } else {
        let aliasedField = field;
        if (field.indexOf(".") > -1) {
          aliasedField = field.split(".").pop();
        }

        filtered[field] = aliasedField;
      }

    });

    this.query.fields = filtered;
    this.usedFields = _.union(this.usedFields, _.keys(filtered));

    return this;
  }

  /**
   * Method sets list of fields to be excluded from retrieval
   * Converts 0: id to id: id
   *
   * @param array|object|string without List of fields or single field
   * @return Request this Fluent interface
   */
  setWithout(without)
  {
    if (_.isString(without)) {
      without = [without];
    }

    if ((!_.isArray(without) && !_.isObject(without)) || _.isEmpty(without)) {
      throw new RequestError(
        "Invalid list of fields provided. String|Object|Array expected",
        {
          without: without
        },
        2
      );
    }

    let filtered = {};
    _(without).forEach(function(field, index) {
      if (!_.isString(field) || _.isEmpty(field)) {
        let type = "field";
        if (isNaN(index)) {
          type = "field alias";
        }

        throw new RequestError(
          "Invalid " + type + " passed: '" + field + "'",
          {
            field : field
          },
          3
        );
      }

      if (_.isString(index) && _.isEmpty(index)) {
        throw new RequestError(
          "Invalid field passed: '" + index + "'",
          {
            index: index
          },
          4
        );
      }

      if (isNaN(index)) {
        filtered[index] = field;
      } else {
        let aliasedField = field;
        if (field.indexOf(".") > -1) {
          aliasedField = field.split(".").pop();
        }

        filtered[field] = aliasedField;
      }

    });

    this.query.without = filtered;

    return this;
  }

  /*
   * Method gets list of fields to be retrieved
   *
   * @return array fields List of fields
   */
  getFields()
  {
    return this.query.fields;
  }

  /*
   * Method gets list of fields to exclude when retrieving
   *
   * @return array fields List of fields
   */
  getWithout()
  {
    return this.query.without;
  }

  /**
   * Method sets resource"s relation(s) to be joined
   * Expected structure:
   * [
   *   "creator"
   * ]
   * @param array relations List of resource"s relation(s)
   * @return Request this Fluent interface
   */
  setJoins(relations)
  {
    if (_.isString(relations)) {
      relations = [relations];
    }

    if (!_.isArray(relations) || _.isEmpty(relations)) {
      throw new RequestError(
        "Invalid join relations list provided",
        {
          relations: relations
        },
        5
      );
    }

    _.forEach(relations, function(relation) {
      if (!_.isString(relation) || _.isEmpty(relation)) {
        throw new RequestError(
          "Invalid join relation provided: '" + relation + "'",
          {
            relation: relation
          },
          6
        );
      }
    });

    this.query.joins = relations;
    return this;
  }

  /**
   * Method returns resources to be joined
   * Expected structure:
   * [
   *   owner
   * ]
   * @return array resources List of resources
   */
  getJoins()
  {
    return this.query.joins ? this.query.joins : [];
  }

  /**
   * Method sets query's conditions
   *
   * @param object data Conditions details field => value|condition
   * @return Request this Fluent interface
   */
  setConditions(data)
  {
    this.validateCondtionsLevel(data, 1);

    // if nothing above thrown an error we can safely assign the conditions
    this.query.conditions = data;

    return this;
  }

  /**
   * Method gets query's conditions
   *
   * @param object data Conditions details field => value|condition
   * @return Request this Fluent interface
   */
  getConditions()
  {
    return this.query.conditions;
  }

  /**
   * Method sets query's conditions
   *
   * @param object data Conditions details field => value|condition
   * @return Request this Fluent interface
   */
  setDistinct(data)
  {
    if(data && !_.isEmpty(data)) {
      this.query.distinct = data;
    }

    return this;
  }

  /**
   * Method gets query's conditions
   *
   * @param object data Conditions details field => value|condition
   * @return Request this Fluent interface
   */
  getDistinct()
  {
    return this.query.distinct;
  }

  /**
   * Method append condition to query's conditions
   *
   * @param object condition Condition
   * @return Request this Fluent interface
   * @throws RequestError error Validation error
   */
  appendConditions(conditions)
  {
    this.validateCondtionsLevel(conditions, 1);

    // if nothing above thrown an error we can safely assign the conditions
    this.query.conditions = _.extend(this.query.conditions, conditions);

    return this;
  }

  /**
   * Recursive method validates single condition level
   *
   * @param data  object  Validated condition level
   * @param level integer Level of recursion (how deep condition is)
   */
  validateCondtionsLevel(data, level)
  {
    if (!_.isObject(data) || _.size(data) === 0 || _.isArray(data)) {
      throw new RequestError(
        "Invalid data structure provided",
        {
          level: level,
          data: data
        },
        7
      );
    }

    var value = null;

    for (var index in data) {

      value = data[index];

      // if it"s logic it should point to array with more than 1 element
      if (index === "and" || index === "or") {

        if (!_.isArray(value)) {
          throw new RequestError(
            "Logic operator expects array of conditions",
            {
              value: value
            },
            8
          );
        }

        if (value.length < 2) {
          throw new RequestError(
            "Logic operator expects array of at least two conditions",
            {
              value: value
            },
            9
          );
        }

        if (level > 3) {
          throw new RequestError(
            "Only 3 levels of nested conditions are supported",
            {
              data: data
            },
            4
          );
        }

        var singleCondtion = null;
        for (var tempIndex in value) {
          singleCondtion = value[tempIndex];
          level += 1;
          this.validateCondtionsLevel(singleCondtion, level);
        }

      } else {

        // now we have something like that
        // {
        //   field : "value",
        // }
        // or
        // {
        //   field2 : {
        //     "gt" : "value2"
        //   }
        // }
        // or
        // {
        //   field3 : ["abc", "def"]
        // }
        // or mix of 2 above
        // index is a field
        var field = index;

        this.usedFields = _.union(this.usedFields, [field]);

        // if type 1 it"s ok!
        if (_.isString(value) || _.isNumber(value)) {
          continue;
        }

        // if it's type 2 validate that contains only strings etc
        if (_.isArray(value)) {
          var tempValue = null;
          for (var tempIndex in value) {
            tempValue = value[tempIndex];
            if (!_.isString(tempValue) && !_.isNumber(tempValue)) {
              throw new RequestError(
                "Invalid list of values for field: '" + field + "'",
                {
                  field : field,
                  value : tempValue
                },
                10
              );
            }
          }
          continue;
        }

        if (_.isObject(value)) {
          var tempValue = null;
          for (var tempIndex in value) {
            tempValue = value[tempIndex];

            if (_.isArray(tempValue)) {

              if (!_.contains(this.supportedComparisionOperators, tempIndex)) {
                throw new RequestError(
                  "Invalid operator provided for field: '" + field + "'",
                  {
                    field : field
                  },
                  12
                );
              }

              var i = null;
              for (var v in tempValue) {
                i = tempValue[v];
                // each value can be only string or integer
                if (!_.isString(i) && !_.isNumber(i)) {
                  throw new RequestError(
                    "Invalid list of values for field: '" + field + "' and operator: '" + tempIndex + "'",
                    {
                      field : field,
                      operator : tempIndex
                    },
                    11
                  );
                }
              }
              continue;
            }

            // each index should be valid operator
            if (!_.contains(this.supportedComparisionOperators, tempIndex)) {
              throw new RequestError(
                "Invalid operator provided for field: '" + field + "'",
                {
                  field : field
                },
                12
              );
            }

            // each value can be only string or integer
            if (!_.isString(tempValue) && !_.isNumber(tempValue)) {
              throw new RequestError(
                "Invalid list of values for field: " + field + " and operator: " + tempIndex,
                {
                  field : field,
                  opeator : tempIndex
                },
                13
              );
            }
          }

          continue;

        }

        throw new RequestError(
          "Invalid data structure provided for field: '" + field + "'",
          {
            value: value
          },
          14
        );

      }
    }
  }

  /**
   * Sets query order
   *
   * Accepted object:
   * {
   *   "field1" : "desc"
   * }
   *
   * or
   *
   * [
   *   "field1"
   * ]
   *
   * or
   *
   * field1
   *
   * @param object order Order description
   * @return Request this Fluent interface
   */
  setOrder(order)
  {
    if (_.isString(order)) {
      order = {
        [order]: "asc"
      };
    }

    if (_.isArray(order)) {
      let newOrder = {};
      _(order).forEach(function(orderField) {
        if (!_.isString(orderField)) {
          throw new RequestError(
            "Invalid order field(s) passed",
            {
              order: order
            },
            15
          );
        }
        newOrder[orderField] = "asc";
      });
      order = newOrder;
    }

    if (!_.isObject(order)) {
      throw new RequestError(
        "Invalid order passed",
        {
          order: order
        },
        15
      );
    }

    var that = this;
    _.forEach(order, function(orderOperator, field) {
      if ((!_.isString(orderOperator) ||
        !_.contains(that.supportedOrderOperators, orderOperator)
      ) && (!_.isString(field) || !_.isObject(orderOperator) ||
        !_.contains(that.supportedOrderOperators, orderOperator.order)
      )) {
        throw new RequestError(
          "Invalid order operator passed",
          {
            orderOperator: orderOperator
          },
          16
        );
      }
      that.usedFields = _.union(that.usedFields, [field]);
    });

    this.query.order = order;
    return this;
  }

  /**
   * Getter for query order
   *
   * @return object Order description
   */
  getOrder()
  {
    return this.query.order;
  }

  /**
   * Sets payload
   *
   * Accepted parameter:
   *
   * {
   *   "key": "value"
   * }
   *
   * or
   *
   * entity
   *
   * @param entity|object payload Payload entity
   * @return Request this Fluent interface
   */
  setPayload(payload)
  {
    if (!_.isObject(payload)) {
      throw new RequestError(
        "Invalid payload passed",
        {
          payload: payload
        }
      );
    }

    this.query.payload = payload;
    return this;
  }

  /**
   * Getter for query group
   *
   * @return array group description
   */
  getPayload()
  {
    return this.query.payload;
  }

  /**
   * Sets group
   *
   * Accepted parameter:
   *
   * [
   *   "field1"
   * ]
   *
   * or
   *
   * field1
   *
   * @param string|array group Group description
   * @return Request this Fluent interface
   */
  setGroup(group)
  {
    if (_.isString(group)) {
      group = [group];
    }

    if (_.isObject(group) && !_.isArray(group)) {
      throw new RequestError(
        "Invalid group passed",
        {
          group: group
        },
        15
      );
    }

    this.addUsedFields(group);
    this.query.group = group;
    return this;
  }

  /**
   * Getter for query group
   *
   * @return array group description
   */
  getGroup()
  {
    return this.query.group;
  }


  /**
   * Method disables limit on query
   */
  disableLimit()
  {
    this.query.limit = false;
    return this;
  }

  /**
   * Method validates and sets limit for query
   *
   * @param integer limit Limit to be set in query
   * @return Request this Fluent interface
   * @throws RequestError When passed limit is invalid
   */
  setLimit(limit)
  {
    if ((!_.isNumber(limit) && !_.isString(limit)) ||
      parseInt(limit, 10) != limit || limit < 1)
    {
      throw new RequestError(
        "Invalid limit passed. Positive integer value expected",
        {
          limit: limit
        },
        17
      );
    }

    this.query.limit = parseInt(limit, 10);

    return this;
  }

  /**
   * @return number Query Limit
   */
  getLimit()
  {
    return this.query.limit;
  }

  /**
   * Method add's fields used by the query
   *
   * @param string|array fields used in the query
   * @return Request this Fluent interface
   */
  addUsedFields(fields)
  {
    if(_.isString(fields)) {
      _.union(this.usedFields, [fields]);
      return this;
    }

    _.forEach(fields, function(field) {
      this.usedFields = _.union(this.usedFields, [field]);
    }, this);

    return this;
  }

  /**
   * Method sets the maximum field for the query
   *
   * @param string|object Maximum description
   * @return Request this Fluent interface
   * @throws RequestError When passed max is invalid
   */
  setMax(max)
  {
    if (!_.isString(max) && !_.isObject(max)) {
      throw new RequestError(
        "Invalid maximum passed",
        {
          max: max
        },
        15
      );
    }

    this.addUsedFields(max);
    this.query.max = max;

    return this;
  }

  /**
   * @return string|object Maximum description
   */
  getMax()
  {
    return this.query.max;
  }

  /**
 * Method sets the minimum field for the query
 *
 * @param string|object minimum description
 * @return Request this Fluent interface
 * @throws RequestError When passed min is invalid
 */
  setMin(min)
  {
    if (!_.isString(min) && !_.isObject(min)) {
      throw new RequestError(
        "Invalid minimum passed",
        {
          min: min
        },
        15
      );
    }

    this.addUsedFields(min);
    this.query.min = min;

    return this;
  }

 /**
 * @return string|object minimum description
 */
  getMin()
  {
    return this.query.min;
  }

  /**
   * Method sets the average field for the query
   *
   * @param string|object average description
   * @return Request this Fluent interface
   * @throws RequestError When passed avg is invalid
   */
  setAvg(avg)
  {
    if (!_.isString(avg) && !_.isObject(avg)) {
      throw new RequestError(
        "Invalid average passed",
        {
          avg: avg
        },
        15
      );
    }

    this.addUsedFields(avg);
    this.query.avg = avg;

    return this;
  }

  /**
   * @return string|object average description
   */
  getAvg()
  {
    return this.query.avg;
  }

  /**
 * Method sets the sum field for the query
 *
 * @param string|object average description
 * @return Request this Fluent interface
 * @throws RequestError When passed sum is invalid
 */
  setSum(sum)
  {
    if (!_.isString(sum) && !_.isObject(sum)) {
      throw new RequestError(
        "Invalid sum passed",
        {
          sum: sum
        },
        15
      );
    }

    this.addUsedFields(sum);
    this.query.sum = sum;

    return this;
  }

/**
 * @return string|object sum description
 */
  getSum()
  {
    return this.query.sum;
  }


  /**
   * Method validates and sets offset for query
   *
   * @param integer offset Offset value
   * @return Request this Fluent interface
   * @throws RequestError When passed limit is invalid
   */
  setOffset(offset)
  {
    if ((!_.isNumber(offset) && !_.isString(offset)) ||
      parseInt(offset, 10) != offset || offset < 1)
    {
      throw new RequestError(
        "Invalid offset passed. Positive integer value expected",
        {
          offset: offset
        },
        18
      );
    }

    this.query.offset = parseInt(offset, 10);

    return this;
  }

  /**
   * @return number Offset value
   */
  getOffset()
  {
    return this.query.offset;
  }

  /**
   * Method validates and sets storage type for query
   *
   * @param string storage Storage type
   * @return Request this Fluent interface
   * @throws RequestError When invalid storage type was invalid
   */
  setStorage(storage)
  {
    var validStorageTypes = ["default", "cache", "db", "memory"];

    if (!_.isString(storage) || validStorageTypes.indexOf(storage) === -1) {
      throw new RequestError(
        "Invalid storage type passed. default|cache|db|memory expected",
        {
          storage: storage
        },
        19
      );
    }

    this.query.storage = storage;

    return this;
  }

  /**
   * @return number storage type
   */
  getStorage()
  {
    return this.query.storage;
  }

  /**
   * Method returns fields used in query
   *
   * @return Array List of fields used in query
   */
  getUsedFields()
  {
    return this.usedFields;
  }

  /**
   * Method enables count
   *
   * @return self this Fluent interface
   */
  enableCount()
  {
    this.query.count = true;
    return this;
  }

  /**
   * Method disables count
   *
   * @return self this Fluent interface
   */
  disableCount()
  {
    this.query.count = false;
    return this;
  }

  /**
   * Method returns result of check is count enabled
   *
   * @return bool result Result of check
   */
  isCountEnabled()
  {
    return this.query.count;
  }

  /**
   * Method returns result of check is distinct enabled
   *
   * @return bool result Result of check
   */
  isDistinctEnabled()
  {
    return (this.query.distinct) ? true : false;
  }

  /**
   * Method returns array representation of query
   * @return object query Object describing query
   */
  export()
  {
    return this.query;
  }

  /**
   * Method clears current state of Request entity
   *
   * @return Request this Fluent interface
   */
  reset()
  {
    this.query = {
      conditions: {},
      limit: this.defaultResultsLimit,
      storage: "default",
      count: undefined,
      distinct: undefined
    };

    this.usedFields = [];

    return this;
  }
}

module.exports = Request;
