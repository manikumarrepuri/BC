
"use strict";

var appRootPath = require("app-root-path");
var EntityError = require("./entityError");
var inspector   = require('schema-inspector');
var _           = require("itheon-utility").underscore;
var logger      = require("itheon-logger");

/**
 * Field Types
 * From https://github.com/Atinux/schema-inspector
 *  possible values:-
 *   - string
 *   - number
 *   - integer
 *   - boolean
 *   - date (instanceof Date), you can use the validDate: true to check if the date is valid
 *   - object (constructor === Object)
 *   - array (constructor === Array)
 *   - any (it can be anything)
 */
class BaseEntity
{
  /**
   * Constructor needs to be overriden by extending class
   */
  constructor(data)
  {
    if (this.constructor === BaseEntity) {
      throw new EntityError(
        "BaseEntity used incorrectly. You need to extend default constructor!"
      );
    }

    // Strict option mean's it will remove unknown fields
    this.schema = {
      type: 'object',
      strict: true,
      properties: {}
    };
  }

  validateAndGetIndexName(fieldName, silent)
  {
    let fields = fieldName;

    if (_.isObject(fields) && !_.isArray(fields))
    {
      // Mixed sorting on compound indexes is not supported.
      // First let's get an array of all the values in the object...
      let values = _.values(fields);

      //...and throw if all items inside the array are not the same.
      if (values.length > 1
        && values.some((value) => {
          return value !== values[0];
        })) {
        if (!silent)
        {
          throw new EntityError(`There was an error validating the index spec for '${fields}': mixed sorting (asc/desc) is not supported by rethink.`)
        }
        else
        {
          return false;
        }
      }

      fields = _.keys(fields);
    }

    // If an array is passed in, we'll be concatenating
    // the members together using a '+' separator.
    // e.g. field1+field2
    if (_.isArray(fields))
    {
      fields = fields.join("+");
    }

    // By this point, 'fields' will either have a single field's name 'field1'
    // or an identifier for a compound index 'field1+field2'
    return fields;
  }

  /**
   * Check if a given property has a DB index available to it.
   *
   * Pass in an object of fields or array of fields (see below) to look for a compound index.
   * Expected object format:
   *
   *  {
   *    field1 : asc,
   *    field2 : asc
   *  }
   *
   * or: ["field1", "field2"]
   *
   * NOTE: The order of the fields is important!
   *
   * @returns true or false.
   */

  hasDbIndex(fieldName)
  {
    if (!this.hasOwnProperty("indexes"))
    {
      return false;
    }

    let fields = this.validateAndGetIndexName(fieldName, true);

    if (!fields)
    {
      return false;
    }

    let indexes = this.indexes;

    if (_.contains(_.keys(indexes), fields))
    {
      if (!_.isEmpty(indexes[fields]))
      {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a given property has a DB index available to it.
   *
   * Pass in an object of fields or array of fields (see below) to look for a compound index.
   * Expected object format:
   *
   *  {
   *    field1 : asc,
   *    field2 : asc
   *  }
   *
   * or: ["field1", "field2"]
   *
   * NOTE: The order of the fields is important!
   *       Also, the sort (asc/desc) has to be the same for all fields.
   *
   * @returns the name of the rethinkDB index to use
   */
  getDbIndex(fieldName)
  {
    if (this.hasDbIndex(fieldName))
    {
      let fields = this.validateAndGetIndexName(fieldName, false);
      return this.indexes[fields];
    }
    else
    {
      throw new EntityError(`There was an error attempting to get the index for '${fieldName}': index not found.`)
    }
  }

  /**
   * Set indexes for a given entity
   *
   * Example Input:
   *
   * {
   *    field1 : index_name,
   *    anotherfield+field2 : another_index_name
   * }
   *
   *
   */
  setDbIndexes(fieldObject)
  {
    for (let key in fieldObject) {
      let value = fieldObject[key];
      try {
        this.setDbIndex(key, value);
      } catch (err) {
        logger.warn("Error while attempting to set a DB index. ", err);
      }
    }
  }

  /**
   * Set a DB index available to a given property or properties.
   *
   * Pass in an object of fields or array of fields (see below) to specify a compound index.
   * Expected object format:
   *
   *  {
   *    field1 : asc,
   *    field2 : desc
   *  }
   *
   * or: ["field1", "field2"]
   *
   *
   * NOTE: The order of the fields is important! it must match the
   * order of the fields on the secondary index in rethinkdb.
   *
   * e.g. field1+field2 : field1_field2_compound_index
   * NOT: field1+field2 : field2_field1_this_will_behave_incorrectly.
   *
   */
  setDbIndex(fieldName, indexName)
  {
    let fields = this.validateAndGetIndexName(fieldName, false);

    if (!fields)
    {
      return false;
    }

    if (!this.hasOwnProperty("indexes"))
    {
      this.indexes = {};
    }

    this.indexes[fields] = indexName;
  }


  /**
   * Method tells you if the entity will allow any number of fields
   *
   * @return boolean
   */
  getAllowAnyField()
  {
    return !this.schema.strict;
  }

  /**
   * Method updates whether or not the enity will allow any number of fields
   *
   * @param boolean allow set whether to allow anything
   * @return self Fluent interface
   */
  setAllowAnyField(allow)
  {
    this.schema.strict = !allow;
    return this;
  }

  /**
   * Method inflates entity object
   *
   * @param object data Data to be used for inflation
   * @return self Fluent interface
   */
  inflate(data)
  {
    if (!_.isObject(data)) {
      throw new EntityError(
        "Invalid data provided. Object expected"
      );
    }

    // Cast data/remove unknown values etc.
    var result = inspector.sanitize(this.schema, data);
    data = result.data;

    // If we changed something let it be known!
    if (result.reporting.length >= 1) {
      logger.silly("BaseEntity: " + result.format());
    }

    // Now use the sanitized data to update the entity
    var that = this;
    _(data).forEach(function(value, key) {
      that.set(key, value);
    });

    return this;
  }

  /**
   * Method returns fields of entity
   *
   * @return Array fields Entity's properties
   */
  getFields()
  {
    if (_.isEmpty(this.schema.properties)) {
      throw new EntityError(
        "Invalid entity definition. No fields defined"
      );
    }

    return this.schema.properties;
  }

  /**
   * Method sets fields of entity
   *
   * @param Object fields Entity
   * @return Array fieldnames Entity's properties
   */
  setFields(fields)
  {
    if (_.isEmpty(fields)) {
      throw new EntityError(
        "BaseEntity used incorrectly. You need to specfic the fields used for the entity!"
      );
    }

    this.schema.properties = fields;
    return this;
  }

  /**
   * Method returns properties of entity
   *
   * @return Array properties Entity"s properties
   */
  getProperties()
  {
    if (!this.properties) {
      this.properties = _.keys(this.schema.properties);

      if (_.isEmpty(this.properties)) {
        throw new EntityError(
          "Invalid entity definition. No properties defined"
        );
      }
    }

    return this.properties;
  }

  /**
   * Method add properties for an entity
   *
   * @param String property fieldname
   * @return Array fieldnames Entity's properties
   */
  addProperty(property, type = 'any')
  {
    if(!this.has(property)) {
      this.schema.properties[property] = {type};
      this.properties.push(property);
    }

    return this;
  }

  /**
   * Method returns the data Type of a given property
   *
   * @return Array properties Entity"s properties
   */
  getDataType(key)
  {
    let field = this.schema.properties[key];

    if (_.isEmpty(field) || typeof field.type === "undefined") {
      throw new EntityError(
        "Invalid entity definition. No properties defined"
      );
    }

    return field.type;
  }

  /**
  * Method returns an object with all the dataTypes for this entity
  *
  * @return Array properties Entity"s properties
  */
  getDataTypes()
  {
    let fields = this.schema.properties;
    let types = {};

    _(fields).forEach(function(field, key) {
      types[key] = field.type;
    });

    return types;
  }

  /**
   * Custom set method filters passed keys based on
   * entity"s properties
   *
   * @param string key   Property name
   * @param mixed  value Property value
   * @return self this Fluent interface
   */
  set(key, value)
  {
    if (this.has(key)) {
      let field = {};
      let setter = "set" + _(key).capitalize();
      if (typeof this[setter] === "function") {
        field[key] = this[setter](value);
      } else {
        field[key] = value;
      }

      // Just sanitize the single field
      var result = inspector.sanitize(this.schema, field);
      var data = result.data;

      // If we changed something let it be known!
      if (result.reporting.length >= 1) {
        logger.silly("BaseEntity: " + result.format());
      }

      // Set sanitized property
      this[key] = data[key];
      return this;
    }

    //If we allow any field then add it
    if(this.getAllowAnyField()) {
      this.addProperty(key);
      this[key] = value;
    }

    return this;
  }

  /**
   * Returns value of passed entity's property
   * @param string propertyName
   */
  get(propertyName)
  {
    if (!_.isString(propertyName) || _.isEmpty(propertyName)) {
      throw new EntityError(
        "Invalid property name to be retrieved provided. Non-empty string expected",
        propertyName,
        500
      );
    }

    return this[propertyName];
  }

  /**
   * Method checks is passed property part of entity
   *
   * @param string property Property name
   * @return bool result Result of check is passed
   * property one of entity"s properties
   */
  has(property)
  {
    return this.getProperties().indexOf(property) > -1;
  }

  /**
   * Method exports data from entity
   *
   * @return object exportedData Data exported
   * from entity
   */
  export()
  {
    let exportedData = {};

    for (var i = 0, keys = this.getProperties(), l = keys.length; i < l; ++i) {
      if (typeof this[keys[i]] != "undefined") {
        exportedData[keys[i]] = this[keys[i]];
      }
    }

    return exportedData;
  }
}

module.exports = BaseEntity;
