"use strict";

var appRootPath      = require("app-root-path");
var RethinkDbGateway = require("itheon-gateway").RethinkDbGateway;
var {{Module}}Entity     = require("itheon-module-{{module}}-entity").{{Module}}Entity;
var RuleEntity       = require("itheon-module-rule-entity").RuleEntity;
var _                = require("itheon-utility").underscore;
var GatewayError     = require("itheon-gateway").GatewayError;
var logger           = require("itheon-logger");

class RethinkDb{{Module}}Gateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass instance of data provider
   *
   * @param object dataProvider Data provider(i.e. dbConnection)
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      "name": "{{Module}}",
      "alias": "{{moduleFirstLetter}}"
    };

    /**
     * Object describing {{module}}'s relation
     *
     * @type Object
     */
    this.relations = {};
  }

  /**
   * Method fetches all records matching passed request"s criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new {{Module}}Entity()];
    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param {{Module}} {{module}} {{Module}} entity
   * @return Promise {{module}} Promise of newly created {{module}} entity
   */
  create({{module}})
  {
    if (!({{module}} instanceof {{Module}}Entity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of {{Module}} expected",
        {{module}},
        500
      );
    }

    // var parent = super;
    return this.validate{{Module}}name({{module}})
      .then(super.insert.bind(this))
      .then(function ({{module}}Data) {
        return new {{Module}}Entity({{module}}Data);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param {{Module}} {{module}} {{Module}} entity
   * @return Promise {{module}} Promise of newly created {{module}} entity
   */
  update({{module}})
  {
    if (!({{module}} instanceof {{Module}}Entity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of {{Module}} expected",
        {{module}},
        500
      );
    }

    // check {{module}}name uniqueness before inserting
    return super.update({{module}})
      .then(function ({{module}}Data) {
        return new {{Module}}Entity({{module}}Data);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param {{Module}} {{module}} {{Module}} entity
   * @return Promise {{module}} Promise of newly created {{module}} entity
   */
  replace({{module}})
  {
    if (!({{module}} instanceof {{Module}}Entity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of {{Module}} expected"
      );
    }

    return super.replace({{module}})
      .then(function ({{module}}Data) {
        return new {{Module}}Entity({{module}}Data);
      });
  }

  /**
   * Helper method validates {{module}}name to be inserted
   *
   * @param {{Module}} {{module}} {{Module}} entity
   * @return Promise {{module}} Promise of exception if {{module}}name exists
   * otherwise promise of passed object
   */
  validate{{Module}}name({{module}})
  {
    return this.dataProvider.table(this.table.name)
      .getAll({{module}}.get("{{module}}name"), {index: "{{module}}name"})
      .then(function({{module}}s) {
        if (!_.isEmpty({{module}}s)) {
          throw new GatewayError(
            "{{Module}}name already in use",
            {},
            409
          );
        }

        return {{module}};
      });
  }
}

module.exports = RethinkDb{{Module}}Gateway;
