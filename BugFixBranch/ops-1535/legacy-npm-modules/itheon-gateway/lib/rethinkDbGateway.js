"use strict";

var appRootPath = require("app-root-path");
var inspector = require('schema-inspector');
var BaseEntity = require("itheon-entity").BaseEntity;
var BaseGateway = require("./baseGateway");
var Request = require("itheon-request");
var _ = require("itheon-utility").underscore;
var logger = require("itheon-logger");
var GatewayError = require("./gatewayError");

/**
 * RethinkdbGateway engine works in following way
 *
 * Selecting rows:
 *
 * 1. Filter by conditions connected to local table
 * 2. Join on each table with left side fully selected and right only
 *    partially mapped via fields[]
 * 3. Order by field(s)
 * 4. Limit the number of records
 * 5. Map(select) all fields without prefix and ones with prefix of
 *    current table alias
 *
 * ------------------------------------------------------
 *
 * Deleting rows is achieved by passing nested object:
 *
 * r.db("itheon").table("Device")
 *   .get("460ad418-ac09-44bb-9941-a2a645032c01")
 *   .without({
 *     "rules" : {
 *       "10a98db6-fa2f-458f-ba88-4406bd389fe8":{
 *         "lanes": "972138be-7fd4-4ea6-aca0-7d03fc5e6242"
 *       }
 *     }
 *   }
 * )
 * Above will remove name with id "972138be-7fd4-4ea6-aca0-7d03fc5e6242" from
 * rules ("10a98db6-fa2f-458f-ba88-4406bd389fe8") from device
 * ("460ad418-ac09-44bb-9941-a2a645032c01")
 *
 */
class RethinkDbGateway extends BaseGateway {
  /**
   * Cutom contractor allows to pass data provider instance
   *
   * @param object dataProvider Data provider(i.e. dbConnection)
   */
  constructor(dataProvider) {
    if (!dataProvider) {
      var rethinkDbDataProvider = require("itheon-data-provider").rethinkDbDataProvider;
      dataProvider = rethinkDbDataProvider.getRethinkDbDataProvider();
    }

    super(dataProvider);

    // Table name
    this.table = {
      "name": "Dummy",
      "alias": "d"
    };

    // Object describing comment's relation
    this.relations = {};

    // Lists supported operators lists all valid operators that
    // are identical like MongoDb operators
    this.supportedOperators = {

      // logic operators
      "and": "AND",
      "or": "OR",

      // comparision operators
      "eq": "eq", // Matches documents that contain values that are exactly the same as the value specified in the query.
      "gt": "gt", // Matches documents that contain values that are greater than the value specified in the query.
      "gte": "ge", // Matches documents that contain values that are greater than or equal to the value specified in the query.
      "lt": "lt", // Matches documents that contain values that are less than the value specified in the query.
      "lte": "le", // Matches documents that contain  values that are less than or equal to the value specified in the query.
      "ne": "ne", // Matches documents that contain  all values that are not equal to the value specified in the query.
      "in": "IN", // Matches documents that contain at least one value that exist in an array specified to the query.
      "nin": "NOT IN", // Matches documents that contain at least one value that do not exist in an array specified to the query.
      "regex": { // Matches documents that contain values using a regular expression on the specified query and alters values to a string before comparing.
        "operator": "match",
        "coerceTo": "string"
      },
      "like": "LIKE", // Matches documents that contain values that match a pattern passed in the value specified in the query.
      "contains": "contains" // Matches documents that contain values that exists in array (hard match ie. 1, 2 and 3)
    };
  }

  /**
   * Main method responsible for generating query from
   * request object
   *
   * @param  Request        request  Request object
   * @param  Array          entities List of connected entities
   * @param  RethinkDbQuery query    RethinkDb query
   * @return Array|Entity  entities Array of entities or entity
   */
  query(request, entities, query) {
    if (!(request instanceof Request)) {
      throw new GatewayError(
        "Invalid request provided. Request instance expected", {
          request: request
        },
        500
      );
    }

    // if single entity change to array of one
    if (!_.isArray(entities)) {
      entities = [
        entities
      ];
    }

    this.request = request;
    this.entities = entities;
    this.joinedFields = {};
    var reduced = false;

    this.validateColumns();

    query = query ? query : this.dataProvider.table(this.table.name);

    let primaryEntity = _.first(this.entities);
    if (!_.isEmpty(request.getOrder()) && primaryEntity.indexes
        && primaryEntity.hasDbIndex(request.getOrder())) {
      let queryChanges = this.generateOrderByRules(query, request.getOrder(), this.entities, true);
      query = queryChanges.query;
      query = query.orderBy.apply(query, queryChanges.orderByRules);
      request.setOrder({});
    }

    // add conditions
    var conditions = request.getConditions();
    var size = _.size(conditions);
    var limitless = false;
    //todo: refactor code to allow for secondary indexes via getALL()
    if (size > 0) {
      if (size === 1 && conditions.id && (!_.isObject(conditions.id) || conditions.id.eq)) {
        var condition = conditions.id.eq || conditions.id;
        query = query.get(condition);
        limitless = true;
      } else {
        var me = this;
        query = query.filter(function (doc) {
          return me.generateConditions(doc, conditions);
        });
      }
    }

    if (request.isCountEnabled()) {
      return query.count();
    }

    // add inner joins
    if (!_.isEmpty(request.getJoins())) {
      query = this.appendJoins(query);
    }

    // ----
    //
    //  if two steps below would be introduced after local map they could
    //  use aliased fields - here on the other hand they create
    //  REQUIREMENT to sort on actual names of fields before local aliases
    //
    // ----

    if (!_.isEmpty(request.getOrder()) && _.isEmpty(request.getGroup())) {
      let queryChanges = this.generateOrderByRules(query, request.getOrder(), this.entities);
      query = queryChanges.query;
      query = query.orderBy.apply(query, queryChanges.orderByRules);
    }

    if (!_.isEmpty(request.getGroup())) {
      query = query.group.apply(query, request.getGroup());
    }

    if (request.isDistinctEnabled()) {
      query = query.pluck(request.getDistinct()).distinct();
    }

    if (request.getAvg()) {
      query = query.avg(request.getAvg());
      reduced = true;
    }

    if (request.getMax()) {
      query = query.max(request.getMax());
      reduced = true;
    }

    if (request.getMin()) {
      query = query.min(request.getMin());
      reduced = true;
    }

    if (request.getSum()) {
      query = query.sum(request.getSum());
      reduced = true;
    }

    if (!_.isEmpty(request.getGroup())) {
      query = query.ungroup();

      //If the group has been reduced to one record we can order it
      if (reduced) {
        query = query.map(function (doc) {
          return doc('reduction');
        });

        if (!_.isEmpty(request.getOrder())) {
          let queryChanges = this.generateOrderByRules(query, request.getOrder(), this.entites);
          query = queryChanges.query;
          query = query.orderBy.apply(query, queryChanges.orderByRules);
        }
      }
    }

    if (request.getOffset()) {
      query = query.skip(request.getOffset());
    }

    if (!limitless && request.getLimit()) {
      query = query.limit(request.getLimit());
    }

    //check if we should remove some fields
    if (!_.isEmpty(request.getWithout())) {
      query = query.without(request.getWithout());
    }

    // select local fields
    if (!_.isEmpty(request.getFields())) {

      let queriedFields = request.getFields();

      if (!_.isArray(queriedFields) ||
        (_.isArray(queriedFields) && queriedFields.indexOf(this.table.alias + ".*") == -1)
      ) {
        var fieldsMap = this.generateFieldsMap(query);
        if (!_.isEmpty(fieldsMap)) {

          fieldsMap = _.extend(fieldsMap, this.joinedFields);

          var index, field;
          for (index in fieldsMap) {
            field = fieldsMap[index];
            fieldsMap[index] = this.dataProvider.row(field);
          }

          return query.map(fieldsMap);
        }
      }

    }

    // Outputs the query as a string to the log
    logger.silly(query.toString());

    return query.run().then(function (result) {
      if (!_.isArray(result)) {
        return [result];
      }

      return result;
    });
  }

  /**
   * Method validates request against entity
   *
   * @param  Request      request  Query Builder populated by request
   * @param  Array|Entity entities An array of entities or entity
   * @todo Validate columns with connection to aliases
   */
  validateColumns(request, entities) {
    request = request ? request : this.request;
    entities = entities ? entities : this.entities;

    // if single entity change to array of one
    if (!_.isArray(entities)) {
      entities = [
        entities
      ];
    }

    // every element in array needs to be a BaseEntity
    var entity = null;
    var validColumns = ["*"]; // it's always allowed to query by star
    var index = "";
    for (index in entities) {
      entity = entities[index];
      if (!_.isObject(entity)) {
        throw new GatewayError(
          "Invalid entity(s) provided. Object expected", {
            entity: entity
          },
          501
        );
      }

      var entityFieldsArray = [];
      entity.getProperties().forEach(function (field) {
        entityFieldsArray.push(field);
      });
      this.fieldTypes = {};
      this.fieldTypes = _.extend(entity.getDataTypes(), this.fieldTypes);
      validColumns = _.union(validColumns, entityFieldsArray);
    }

    var usedFields = request.getUsedFields();

    // validate fields
    var alias = null;
    var field = null;
    var tempField = null;
    var fieldParts = [];
    var tempIndex = "";
    for (tempIndex in usedFields) {
      field = usedFields[tempIndex];
      tempField = field;

      // escape alias if exists
      if (tempField.indexOf(".") > -1) {
        fieldParts = tempField.split(".");
        alias = fieldParts.shift();
        if (!_.contains(this.getAllowedColumnAliases(), alias)) {
          throw new GatewayError(
            "Invalid alias for field provided " + alias,
            alias,
            1
          );
        }
        tempField = fieldParts.join("");
      }

      if (!_.contains(validColumns, tempField)) {
        throw new GatewayError(
          "Invalid field passed: " + field, {
            field: field
          },
          2
        );
      }
    }
  }

  /**
   * Generates map of fields using request and optionality
   * alias
   *
   * @param query   query   Rethikdb query
   * @param Request request Instance of Request
   * @param string  alias   If passed method generates map only for
   * fields prefixed with passed alias
   * @return object Fields map
   */
  generateFieldsMap(query, request, alias) {
    request = request ? request : this.request;

    var field = "";
    var index = "";
    var fields = {};

    var fieldsList = request.getFields();

    for (index in fieldsList) {

      field = fieldsList[index];

      if (isNaN(index) && field.indexOf(".") > -1) {
        throw new GatewayError(
          "Aliases are not allowed in aliases", {
            field: field
          },
          502
        );
      }

      if (index == this.table.alias + ".*" || index == "*") {
        continue; // skip
      }

      // skip all non-aliased fields
      if (alias && index.indexOf(alias + ".") == -1) {
        continue; // skip
      }

      field = this.escapeColumnName(field);
      index = this.escapeColumnName(index);

      if (isNaN(index)) {
        fields[field] = index;
      } else {
        fields[field] = field;
      }
    }

    return fields;
  }

  getAllowedColumnAliases() {
    if (this.allowedColumnAliases && !_.isEmpty(this.allowedColumnAliases)) {
      return this.allowedColumnAliases;
    }

    // refering columns from main table with alias is valid
    this.allowedColumnAliases = [];
    this.allowedColumnAliases.push(this.table.alias);

    var relation = null;
    var relationName = null;
    for (relationName in this.relations) {

      relation = this.relations[relationName];

      if (!_.has(relation, "defaultAlias")) {
        throw new GatewayError(
          "Invalid relation definition for relation " + relationName, {
            relationName: relationName
          },
          502
        );
      }

      this.allowedColumnAliases.push(relation.defaultAlias);
    }

    return this.allowedColumnAliases;
  }

  /**
   * Method generates conditions for RethinkDB query
   *
   * @param Object doc            Rethinkdb's object representing row/document
   * @param Object conditionsData Data to create conditions
   */
  generateConditions(doc, conditionsData) {
    return this.generateConditionLevel(doc, conditionsData, 1);
  }

  /**
   * Method generates a single condition level or calls
   * recursively itself
   *
   * @param  object doc           Rethinkdb's object representing row/document
   * @param  object conditionData Object describing condition's level(s)
   * @param  int    level         Level of current recursive call(safety fuse)
   * @return object expr Expression object(part of squel package)
   */
  generateConditionLevel(doc, conditionData, level) {
    var index, value, nestedIndex, nestedValue, operator;
    var dbConditions = [],
      nestedDbConditions = [];

    for (index in conditionData) {
      value = conditionData[index];

      if (index === "or" || index === "and") {
        if (!Array.isArray(value)) {
          throw new GatewayError(
            "Invalid argument of logic operator passed. Array of conditions expected", {
              value: value
            },
            3
          );
        }

        if (value.length < 2) {
          throw new GatewayError(
            "Logic operator expects array of at least two conditions", {
              value: value
            },
            9
          );
        }

        if (level > 3) {
          throw new GatewayError(
            "Only 3 levels of nested conditions are supported", {
              conditionData: conditionData
            },
            4
          );
        }

        nestedValue = null;
        for (nestedIndex in value) {
          nestedValue = value[nestedIndex];
          level += 1;
          nestedDbConditions.push(
            this.generateConditionLevel(doc, nestedValue, level)
          );
        }

        dbConditions.push(this.dataProvider[index].apply(null, nestedDbConditions));

      } else {

        nestedValue = null;

        // Sanitise the value to the required type if it's not an object.
        if (!_.isObject(value)) {
          var result = inspector.sanitize({
            "type": 'object',
            "properties": {
              [index]: {
                "type": this.fieldTypes[index]
              }
            }
          }, {
            [index]: value
          });
          value = result.data[index];
        }

        // simple conditions
        // {
        //   field: value
        // }
        if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {

          // If I wanted null I'd use null!
          // expr.and(this.escapeColumnName(index) + " = ?");
          // expr.parameters.push(value);
          dbConditions.push(doc(this.escapeColumnName(index)).eq(value));

        } else if (_.isArray(value)) {

          // {
          //   field: [4, 5]
          // }

          dbConditions.push(
            this.dataProvider.branch(
              doc(this.escapeColumnName(index)).typeOf().eq("ARRAY"),
              this.dataProvider.expr(value).setIntersection(doc(this.escapeColumnName(index))).isEmpty().not(),
              this.dataProvider.expr(value).contains(doc(this.escapeColumnName(index)))
            ).eq(true)
          );
          // expr.and(this.escapeColumnName(index) + " IN ?");
          // expr.parameters.push(value);

        } else {

          // complex conditions
          // {
          //   field: {
          //     "gt" : 5
          //   }
          // }
          // or
          // {
          //   field: {
          //     "in" : [5, 4]
          //     // or
          //     "nin" : [5, 4]
          //   }
          // }
          for (operator in value) {
            nestedValue = value[operator];

            let supportedOperator = this.supportedOperators[operator];
            if (_.isObject(supportedOperator)) {
              //Allows to use rethinkdb functions like hasFields
              if (supportedOperator.function) {
                dbConditions.push(
                  doc[supportedOperator.function](nestedValue)
                );
                continue;
              }

              dbConditions.push(
                doc(this.escapeColumnName(index)).coerceTo(supportedOperator.coerceTo)[supportedOperator.operator](nestedValue)
              );
              continue;
            }

            // Sanitise the nested value
            let result = inspector.sanitize({
              "type": 'object',
              "properties": {
                [index]: {
                  "type": this.fieldTypes[index]
                }
              }
            }, {
              [index]: nestedValue
            });
            nestedValue = result.data[index];

            if (_.isArray(nestedValue)) {
              if (operator == "in") {
                dbConditions.push(
                  this.dataProvider.branch(
                    doc(this.escapeColumnName(index)).typeOf().eq("ARRAY"),
                    this.dataProvider.expr(nestedValue).setIntersection(doc(this.escapeColumnName(index))).isEmpty().not(),
                    this.dataProvider.expr(nestedValue).contains(doc(this.escapeColumnName(index)))
                  ).eq(true)
                );
              } else if (operator == "nin") {
                dbConditions.push(
                  this.dataProvider.branch(
                    doc(this.escapeColumnName(index)).typeOf().eq("ARRAY"),
                    this.dataProvider.expr(nestedValue).setIntersection(doc(this.escapeColumnName(index))).isEmpty(),
                    this.dataProvider.expr(nestedValue).contains(doc(this.escapeColumnName(index))).not()
                  ).eq(true)
                );
                // it's probably "contains" (hard match ie. 1, 2 and 3)
              } else {
                var andConditions = [];
                _.each(nestedValue, (value) => {
                  andConditions.push(
                    this.dataProvider.expr(value).contains(doc(this.escapeColumnName(index)))
                  );
                });

                dbConditions.push(
                  this.dataProvider.and(andConditions)
                );
              }
              continue;
            }

            dbConditions.push(
              doc(this.escapeColumnName(index))[supportedOperator](nestedValue)
            );
          }
        }
      }
    }

    if (dbConditions.length > 1) {
      return this.dataProvider.and.apply(null, dbConditions);
    }

    return dbConditions.pop();
  }

  escapeColumnName(columnName) {
    if (columnName.indexOf(".") > -1) {
      var columnNameParts = columnName.split(".");
      columnName = columnNameParts[1];
    }
    return columnName;
  }

  /**
   * Method generates order part of query
   *
   * Expected data:
   * {
   *   "fieldA": "desc",
   *   "fieldB": "asc"
   * }
   *
   * @return string sql Generated part of valid RethinkDb query
   */
  generateOrderByRules(query, orderData, entites, useIndex) {
    let orderField, orderByRules = [],
      orderByModified = {};

    var that = this;

    if (useIndex)
    {
      let index = _.first(entites).getDbIndex(orderData);

      orderField = Object.keys(orderData)[0];
      if (orderData[orderField] === "desc") {
        return {query: query, orderByRules: [{"index" : that.dataProvider.desc(index)}]};
      }

      return {query: query, orderByRules: [{"index" : index}]};
    }

    let newQuery = query.merge(function (doc) {
      for (orderField in orderData) {
        if (typeof orderData[orderField] !== "object") {
          if (orderData[orderField] === "desc") {
            orderByRules.push(that.dataProvider.desc(orderField));
            continue;
          }

          orderByRules.push(orderField);
          continue;
        }

        //When dealing with an object it's a bit different
        let fieldName = orderData[orderField].field;

        switch (orderData[orderField].modifier) {
        case 'lowercase':
          if (that.fieldTypes[fieldName] !== 'string') break;
            //r.branch is like if/else check the row has the field, and that it's a string then lowercase it
          orderByModified = that.dataProvider.branch(
              doc.hasFields(fieldName),
              that.dataProvider.branch(
                doc(fieldName).typeOf().eq("STRING"), {
                  [fieldName + "LowerCase"]: doc(fieldName).downcase()
                }, {
                  [fieldName + "LowerCase"]: doc(fieldName)
                }
              ), {
                [fieldName + "LowerCase"]: null
              }
            );
          fieldName += "LowerCase";
          break;
        case 'count':
          orderByModified = that.dataProvider.branch(
              doc(fieldName).typeOf().eq("ARRAY"), {
                [fieldName + "Count"]: doc(fieldName).count()
              }, {
                [fieldName + "Count"]: doc(fieldName).coerceTo('ARRAY').count()
              }
            );
          fieldName += "Count";
          break;
        }

        if (orderData[orderField].order === "desc") {
          orderByRules.push(that.dataProvider.desc(fieldName));
          continue;
        }

        orderByRules.push(fieldName);
      }

      return orderByModified;
    });

    //If we don't need to modify anything return original query
    if (_.isEmpty(orderByModified)) {
      return {
        query: query,
        orderByRules: orderByRules
      };
    }

    return {
      query: newQuery,
      orderByRules: orderByRules
    };
  }

  /**
   * Appends joins to query object
   *
   * @param  object query   [description]
   * @param  object request [description]
   * @return {[type]}            [description]
   */
  appendJoins(query, request) {
    request = request ? request : this.request;

    var joins = request.getJoins();

    if (!(_.isArray(joins))) {
      throw new GatewayError(
        "Invalid joins list provided. Array expected", {
          joins: joins
        },
        503
      );
    }

    var joinName = "";
    var index = "";
    var that = this;
    _.each(joins, function (join, index) {

      var joinName = joins[index];
      var relation = that.relations[joinName];

      if (!relation) {
        throw new GatewayError("Invalid join name provided");
      }

      var joinType = relation.type;

      switch (joinType) {
      case 'right':
        query = that.appendRightJoin(query, request, joinName);
        break;
      case 'left-outer':
        query = that.appendLeftOuterJoin(query, request, joinName);
        break;
          //Drop through to default
      case 'left':
      default:
        query = that.appendLeftJoin(query, request, joinName);
        break;
      }
    });

    return query;
  }

  /**
   * Appends a left join to the query object
   *
   * @param  object  query    [description]
   * @param  Request request  [description]
   * @param  string  joinName [description]
   * @return {[type]} [description]
   */
  appendLeftJoin(query, request, joinName) {
    if (!_.has(this.relations, joinName)) {
      throw new GatewayError(
        "Invalid join name provided", {
          joinName: joinName
        },
        5
      );
    }

    var index, relation, fieldsMap, selectedFields;

    relation = this.relations[joinName];

    // step 1 join and get left and right
    query = query.outerJoin(
      this.dataProvider.table(relation.table),
      function (baseTable, joinedTable) {
        return joinedTable(relation.targetColumn).eq(baseTable(relation.localColumn));
      }
    );

    // step 2 minimize right and leave left as it is
    fieldsMap = this.generateFieldsMap(
      query,
      request,
      relation.defaultAlias
    );

    if (_.isObject(fieldsMap) && !_.isEmpty(fieldsMap)) {

      // unset fieldsMap of local table
      this.joinedFields = {};
      selectedFields = request.getFields();
      var field;
      for (index in selectedFields) {
        field = selectedFields[index];
        if (index.indexOf(relation.defaultAlias + ".") > -1) {

          if (field.indexOf(this.table.alias) === 0) {
            continue;
          }

          delete selectedFields[index];
          this.joinedFields[field] = field;
        }

        if (isNaN(index) && field.indexOf(relation.defaultAlias + ".") > -1) {
          throw new GatewayError(
            "Aliases are not allowed in aliases", {
              relation: relation
            },
            6
          );
        }
      }

      // prepare for map
      for (index in fieldsMap) {
        field = fieldsMap[index];
        if (field == "*") {
          fieldsMap = this.dataProvider.row("right");
        } else {
          fieldsMap[index] = this.dataProvider.row("right")(field);
        }
      }

      query = query.map({
        left: this.dataProvider.row("left"),
        right: fieldsMap
      });
    } else if (typeof fieldsMap === "boolean") {

      // merge whole thing!

    } else {
      // error
      throw new GatewayError(
        "No fields selected from joined collection", {
          fieldsMap: fieldsMap
        },
        7
      );
    }

    // step 3 zip both sets together
    return query.zip();
  }

  /**
   * Appends a right join to the query object
   *
   * @param  object  query    [description]
   * @param  Request request  [description]
   * @param  string  joinName [description]
   * @return {[type]} [description]
   */
  appendRightJoin(query, request, joinName) {
    if (!_.has(this.relations, joinName)) {
      throw new GatewayError(
        "Invalid join name provided", {
          joinName: joinName
        },
        5
      );
    }

    var index, relation, fieldsMap, selectedFields;

    relation = this.relations[joinName];

    // step 1 minimize left and leave right as it is used later
    fieldsMap = this.generateFieldsMap(
      query,
      request,
      relation.defaultAlias
    );

    if (_.isObject(fieldsMap) && !_.isEmpty(fieldsMap)) {

      // unset fieldsMap of local table
      this.joinedFields = {};
      selectedFields = request.getFields();
      var field;
      for (index in selectedFields) {
        field = selectedFields[index];
        if (index.indexOf(relation.defaultAlias + ".") > -1) {

          if (field.indexOf(this.table.alias) === 0) {
            continue;
          }

          delete selectedFields[index];
          this.joinedFields[field] = field;
        }

        if (isNaN(index) && field.indexOf(relation.defaultAlias + ".") > -1) {
          throw new GatewayError(
            "Aliases are not allowed in aliases", {
              relation: relation
            },
            6
          );
        }
      }

      // prepare for map
      for (index in fieldsMap) {
        field = fieldsMap[index];
        if (field == "*") {
          fieldsMap = this.dataProvider.row("right");
        } else {
          fieldsMap[index] = this.dataProvider.row("right")(field);
        }
      }
    } else if (typeof fieldsMap === "boolean") {

      // merge whole thing!

    } else {
      // error
      throw new GatewayError(
        "No fields selected from joined collection", {
          fieldsMap: fieldsMap
        },
        7
      );
    }

    var that = this;
    query = query.merge(function (baseTable) {
      //  if(typeof fieldsMap  === "boolean") {
      return {
        [joinName]: that.dataProvider.table(relation.table).getAll(baseTable(relation.localColumn), {
          "index": relation.targetColumn
        }).coerceTo('ARRAY')
      }
      //      }

      //TODO: with a field map it is failing with the error "Cannot use r.row in nested queries.  Use functions instead"
      //    return {
      //      [joinName] : that.dataProvider.table(relation.table).getAll(baseTable(relation.localColumn), {"index": relation.targetColumn}).map({ left : that.dataProvider.row("left"), right : fieldsMap }).coerceTo('ARRAY')
      //    }
    });

    return query;
  }

  /**
   * Appends a left outer join to the query object
   *
   * @param  object  query    [description]
   * @param  Request request  [description]
   * @param  string  joinName [description]
   * @return {[type]} [description]
   */
  appendLeftOuterJoin(query, request, joinName) {
    if (!_.has(this.relations, joinName)) {
      throw new GatewayError(
        "Invalid join name provided", {
          joinName: joinName
        },
        5
      );
    }

    var index, relation, fieldsMap, selectedFields;

    relation = this.relations[joinName];

    // step 1 minimize left and leave right as it is used later
    fieldsMap = this.generateFieldsMap(
      query,
      request,
      relation.defaultAlias
    );

    if (_.isObject(fieldsMap) && !_.isEmpty(fieldsMap)) {

      // unset fieldsMap of local table
      this.joinedFields = {};
      selectedFields = request.getFields();
      var field;
      for (index in selectedFields) {
        field = selectedFields[index];
        if (index.indexOf(relation.defaultAlias + ".") > -1) {

          if (field.indexOf(this.table.alias) === 0) {
            continue;
          }

          delete selectedFields[index];
          this.joinedFields[field] = field;
        }

        if (isNaN(index) && field.indexOf(relation.defaultAlias + ".") > -1) {
          throw new GatewayError(
            "Aliases are not allowed in aliases", {
              relation: relation
            },
            6
          );
        }
      }

      // prepare for map
      for (index in fieldsMap) {
        field = fieldsMap[index];
        if (field == "*") {
          fieldsMap = this.dataProvider.row("right");
        } else {
          fieldsMap[index] = this.dataProvider.row("right")(field);
        }
      }
    } else if (typeof fieldsMap === "boolean") {

      // merge whole thing!

    } else {
      // error
      throw new GatewayError(
        "No fields selected from joined collection", {
          fieldsMap: fieldsMap
        },
        7
      );
    }

    var that = this;
    query = query.merge(function (baseTable) {
      //  if(typeof fieldsMap  === "boolean") {
      return that.dataProvider.branch(
        baseTable.hasFields(relation.localColumn).and(baseTable(relation.localColumn).typeOf().eq("ARRAY")), {
          [relation.localColumn]: that.dataProvider.table(relation.table).getAll(that.dataProvider.args(baseTable(relation.localColumn))).coerceTo("ARRAY")
        }, {
          [relation.localColumn]: []
        }
      );
    });



    return query;
  }

  /**
   * Generic insert method creates new object in table
   *
   * @param Request request Request to be used
   * @return Promise promise Promise of new entity data after
   * being inserted
   */
  insert(request) {
    if (!(request instanceof Request) && !_.isObject(request)) {
      throw new GatewayError(
        "Invalid request passed. Instance of Request expected", {
          request: request
        }
      );
    }

    // Allow for depreciated method call
    if (!(request instanceof Request)) {
      let tmpRequest = request;
      request = new Request();
      request.setPayload(tmpRequest);
      logger.warn("Depreciated: As of version 3.1.0 an instance of request is expected.");
    }

    var fields = request.getFields();
    var entities = request.getPayload();
    var that = this;

    //If we didn't get an array create one
    if (!_.isArray(entities)) {
      entities = [entities];
    }

    //Validate entities and fix values
    _.each(entities, function (entity, key) {
      entities[key] = this.validateInsert(entity);
    }, this);

    //If we just want the id's then we don't need to know what changed
    var returnChanges = (!_.isEqual(fields, ['id']));

    //Generate insert query
    var query = this.dataProvider.table(this.table.name)
      .insert(entities, {
        returnChanges: returnChanges
      });

    //Return only the fields you need
    if (returnChanges) {

      if (_.isEmpty(fields)) {
        fields = true;
      }

      query = query.pluck({
        'changes': {
          'new_val': fields
        }
      });

      //We just want the data inside changes("new_val")
      query = query.coerceTo("ARRAY")
        .map(function (row) {
          return row(1).map(function (subRow) {
            return subRow("new_val");
          })
        });
    }

    return query.run()
      .then(function (data) {
        if (returnChanges) {
          //Make sure we have something to return!
          if (!_.isArray(data)) {
            throw new GatewayError(
              "No data returned, something has gone wrong", {
                data: data
              },
              503
            );
          }

          return data[0];
        }

        //Make sure we have some id's to return
        if (!data.generated_keys ||
          !_.isArray(data.generated_keys) ||
          _.isEmpty(data.generated_keys)
        ) {
          throw new GatewayError(
            "No id's inserted, something has gone wrong", {
              data: data
            },
            503
          );
        }

        return data.generated_keys;
      });
  }

  /**
   * Generic method to validate an entity before it can be inserted to the tablee
   *
   * @param BaseEntity entity BaseEntity to be added
   * @return BaseEntity entity BaseEntity to be added
   */
  validateInsert(entity) {
    if (!_.isObject(entity)) {
      throw new GatewayError(
        "Invalid entity passed. Object expected", {
          entity: entity
        },
        504
      );
    }

    if (!entity.export || !_.isFunction(entity.export)) {
      entity.createdAt = new Date();
      entity.updatedAt = null;
      return entity;
    }

    if (entity.has("createdAt")) {
      entity.createdAt = new Date();
    }

    if (entity.has("updatedAt")) {
      entity.updatedAt = null;
    }

    return entity.export();
  }

  /**
   * Generic update method updates object in table using
   * it's id
   *
   * @param BaseEntity entity BaseEntity to be used to update old one
   * @return Promise promise Promise of new entity data after
   * update
   */
  update(entity) {
    if (!_.isObject(entity)) {
      throw new GatewayError(
        "Invalid entity passed. Object expected", {
          entity: entity
        },
        504
      );
    }

    if (!entity.getId()) {
      throw new GatewayError(
        "Invalid logic. Insert should be called", {
          entity: entity
        },
        505
      );
    }

    var me = this;

    return this.dataProvider.table(this.table.name)
      .get(entity.getId())
      .then(function (entityFromDb) {
        if (!entityFromDb) {
          throw new GatewayError(
            "Resource does not exist", {
              table: me.table.name,
              entity: entity.export()
            },
            409
          );
        }

        if (entity.has("createdAt")) {
          entity.set("createdAt", entityFromDb.createdAt);
        }

        if (entity.has("updatedAt")) {
          entity.set("updatedAt", new Date());
        }

        return me.dataProvider.table(me.table.name)
          .get(entity.getId())
          .update(entity.export());

      }).then(function () {

        var request = new Request();
        request.setConditions({
          id: entity.getId()
        });
        return me.fetchOne(request);

      });
  }

  /**
   * Generic replace method replaces object in table using
   * it's id
   *
   * @param BaseEntity entity BaseEntity to be used to replace old one
   * @return Promise promise Promise of new entity data after
   * replace
   */
  replace(entity) {
    if (!_.isObject(entity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Object expected", {
          entity: entity
        }
      );
    }

    if (!entity.getId()) {
      throw new GatewayError(
        "Invalid logic. Insert should be called", {
          entity: entity
        }
      );
    }

    var me = this;
    return this.dataProvider.table(this.table.name)
      .get(entity.getId())
      .then(function (currentEntityData) {

        if (!currentEntityData) {
          throw new GatewayError(
            "Resource does not exist", {
              entityId: entity.getId(),
              currentEntityData: currentEntityData
            },
            409
          );
        }

        var newEntityData = entity.export();
        newEntityData.createdAt = new Date(currentEntityData.createdAt);
        newEntityData.updatedAt = new Date();

        return me.dataProvider.table(me.table.name)
          .get(entity.getId())
          .replace(newEntityData)
          .then(function () {
            var request = new Request();
            request.setConditions({
              id: entity.getId()
            });
            return me.fetchOne(request);
          });
      });
  }

  /**
   * Generic delete method removes object from table by id
   *
   * @param string id BaseEntity's identifier
   * @return Promise promise Promise of result of deleting
   * entity
   */
  delete(id) {
    var me = this;
    return this.dataProvider.table(this.table.name)
      .get(id)
      .then(function (entity) {

        if (!entity) {
          throw new GatewayError(
            "Resource does not exits", {
              id: id,
              entity: entity
            },
            409
          );
        }

        return me.dataProvider.table(me.table.name)
          .get(id)
          .delete();
      });
  }

  /**
   * Method fetches single(first) record matching passed query builder's
   * criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise      results      Promise of query results
   */
  fetchOne(request) {

    if (!(request instanceof Request)) {
      throw new GatewayError(
        "Invalid request provided. Request instance expected", {
          request: request
        },
        505
      );
    }

    request.setLimit(1);

    return this.fetchAll(request)
      .then(function (entities) {

        if (!_.isArray(entities)) {
          throw new GatewayError(
            "Invalid data returned from reThinkDb", {
              entities: entities
            },
            506
          );
        }

        if (_.isEmpty(entities)) {
          return null;
        }

        return entities.pop();
      });
  }

  /**
   * Method returns current UTC date object
   *
   * @return Date date Current UTC date object
   */
  getCurrentUtcDate() {
    let now = new Date();
    return new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
  }
}

module.exports = RethinkDbGateway;
