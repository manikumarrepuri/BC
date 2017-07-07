
"use strict";

const common      = require("opserve-common");
const _           = common.utilities.underscore;
const Request     = common.Request;

let assert       = require("chai").assert;
let defaultLimit = 20;

describe("Request", function() {

  describe("passing object to constructor", function () {

    it("should allow not passing object", function () {

      let request = new Request();

      let expectedExport = {
        conditions: {},
        limit: defaultLimit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing empty object", function () {

      let request = new Request({});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with fields", function () {

      let fields = {
        0: "fieldA",
        "fieldB": "fieldX"
      };

      let request = new Request({fields: fields});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: {
          fieldA: "fieldA",
          fieldB: "fieldX"
        }
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with joins", function () {

      let joins = [
        "relationOne",
        "relationTwo",
      ];

      let request = new Request({joins: joins});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        joins: joins
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with conditions", function () {

      let conditions = {
        // type 1
        "name": "Test",
        // type 2
        "age": {
          "gt": 20,
          "lt": 22
        },
        // type 3
        "and": [
          {
            "name": "Test2"
          },
          {
            "age": {
              "gt": "20",
              "lte": "25"
            }
          }
        ]
      };

      let request = new Request({conditions: conditions});

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with order", function () {

      let order = {
        "fieldX": "asc",
        "fieldY": "desc"
      };

      let request = new Request({order: order});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: order
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with limit", function () {

      let limit = 5;

      let request = new Request({limit: limit});

      let expectedExport = {
        conditions: {},
        limit: limit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with offset", function () {

      let offset = 10;

      let request = new Request({offset: offset});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        offset: offset
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

  });

  describe("passing object to inflate() method", function () {

    it("should allow not passing object", function () {

      let request = new Request();
      request.inflate();

      let expectedExport = {
        conditions: {},
        limit: defaultLimit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing empty object", function () {

      let request = new Request();
      request.inflate({});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with fields", function () {

      let fields = {
        0: "fieldA",
        "fieldB": "fieldX"
      };

      let request = new Request();
      request.inflate({fields: fields});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: {
          fieldA: "fieldA",
          fieldB: "fieldX"
        }
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with joins", function () {

      let joins = [
        "relationOne",
        "relationTwo",
      ];

      let request = new Request();
      request.inflate({joins: joins});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        joins: joins
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with conditions", function () {

      let conditions = {
        // type 1
        "name": "Test",
        // type 2
        "age": {
          "gt": 20,
          "lt": 22
        },
        // type 3
        "and": [
          {
            "name": "Test2"
          },
          {
            "age": {
              "gt": "20",
              "lte": "25"
            }
          }
        ]
      };

      let request = new Request();
      request.inflate({conditions: conditions});

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with order", function () {

      let order = {
        "fieldX": "asc",
        "fieldY": "desc"
      };

      let request = new Request();
      request.inflate({order: order});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: order
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with limit", function () {

      let limit = 5;

      let request = new Request();
      request.inflate({limit: limit});

      let expectedExport = {
        conditions: {},
        limit: limit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

    it("should allow passing object with offset", function () {

      let offset = 10;

      let request = new Request();
      request.inflate({offset: offset});

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        offset: offset
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );
    });

  });

  describe("passing object to setFields() method", function () {

    it("should throw error when no object was passed", function () {

      let request = new Request();

      assert.throw(function() {
          request.setFields();
        },
        "Invalid list of fields provided. String|Object|Array expected"
      );

    });

    it("should throw error when invalid type of object was passed", function () {

      let request = new Request();

      let invalidFields = [
        -1,
        null,
        undefined
      ];

      _(invalidFields).forEach(function(field) {
        assert.throw(function() {
            request.setFields(field);
          },
          "Invalid list of fields provided. String|Object|Array expected"
        );
      });

    });

    it("should allow passing object with single field as string", function () {

      let field = "id";

      let request = new Request();
      request.setFields(field);

      let expectedFields = {
        id: "id"
      };

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: expectedFields
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        [field]
      );

      assert.deepEqual(
        request.getFields(),
        expectedFields
      );

    });

    it("should throw error when passing empty string", function () {

      let field = "";

      let request = new Request();
      assert.throw(function() {
          request.setFields(field);
        },
        "Invalid field passed: ''"
      );

    });

    it("should throw error when passing empty array", function () {

      let fields = [];

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid list of fields provided. String|Object|Array expected"
      );

    });

    it("should allow passing object with single field as array", function () {

      let field = ["field2"];

      let request = new Request();
      request.setFields(field);

      let expectedFields = {
        field2: "field2"
      };

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: expectedFields
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        field
      );

      assert.deepEqual(
        request.getFields(),
        expectedFields
      );

    });

    it("should allow passing object with multiple fields as array", function () {

      let fields = ["id", "field2", "t.field3"];

      let request = new Request();
      request.setFields(fields);

      let expectedFields = {
        id: "id",
        field2: "field2",
        "t.field3": "field3"
      };

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: expectedFields
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        fields
      );

      assert.deepEqual(
        request.getFields(),
        expectedFields
      );

    });

    it("should throw error when passing empty object", function () {

      let fields = {};

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid list of fields provided. String|Object|Array expected"
      );

    });

    it("should allow passing object with single field as object (numeric key)", function () {

      let field = {0: "field2"};

      let request = new Request();
      request.setFields(field);

      let expectedFields = {
        field2: "field2"
      };

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: expectedFields
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field2"]
      );

      assert.deepEqual(
        request.getFields(),
        expectedFields
      );

    });

    it("should allow passing object with single field as object (string key - alias)", function () {

      let field = {"field1": "field2"};

      let request = new Request();
      request.setFields(field);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: field
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1"]
      );

      assert.deepEqual(
        request.getFields(),
        field
      );

    });

    it("should allow passing object with multiple fields as object (mixed keys)", function () {

      let fields = {
        0: "id",
        "field1": "field2"
      };

      let request = new Request();
      request.setFields(fields);

      let expectedFields = {
        id: "id",
        field1: "field2"
      };

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        fields: expectedFields
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["id", "field1"]
      );

      assert.deepEqual(
        request.getFields(),
        expectedFields
      );

    });

    it("should throw error when passing complex object", function () {

      let fields = {
        "fieldA": {}
      };

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid field alias passed: '[object Object]'"
      );

    });

    it("should throw error when aliasing field to integer", function () {

      let fields = {
        "fieldA": 1
      };

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid field alias passed: '1'"
      );

    });

    it("should throw error when aliasing field to empty string", function () {

      let fields = {
        "fieldA": ""
      };

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid field alias passed: ''"
      );

    });

    it("should throw error when aliasing empty field", function () {

      let fields = {
        "": "fieldX"
      };

      let request = new Request();
      assert.throw(function() {
          request.setFields(fields);
        },
        "Invalid field passed: ''"
      );

    });

  });

  describe("passing object to setJoins() method", function () {

    it("should allow passing single ralation as string", function () {

      let relation = "someRelationName";

      let request = new Request();
      request.setJoins(relation);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        joins: [relation]
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getJoins(),
        [relation]
      );

    });

    it("should throw error when empty relation name string was passed", function () {

      let relation = "";

      let request = new Request();
      assert.throw(function() {
          request.setJoins(relation);
        },
        "Invalid join relation provided: ''"
      );

    });

    it("should throw error when no variable was passed", function () {

      let request = new Request();
      assert.throw(function() {
          request.setJoins();
        },
        "Invalid join relations list provided"
      );

    });

    it("should throw error when invalid variable type was passed", function () {

      var invalidTypes = [
        {},
        -1,
        0,
        1,
        null,
        undefined,
        false,
        true,
        {
          someProperty: "someValue"
        }
      ];

      let request = new Request();

      _(invalidTypes).forEach(function(invalidType) {

        assert.throw(function() {
            request.setJoins(invalidType);
          },
          "Invalid join relations list provided"
        );

      });

    });

    it("should throw error when invalid relation type was passed", function () {

      var invalidTypes = {
        "[object Object]": [{}],
        "-1": [-1],
        "0": [0],
        "1": [1],
        "null": [null],
        "undefined": [undefined],
        "false": [false],
        "true": [true]
      };

      let request = new Request();

      _(invalidTypes).forEach(function(invalidType, errorVar) {

        assert.throw(function() {
            request.setJoins(invalidType);
          },
          "Invalid join relation provided: '" + errorVar + "'"
        );

      });

    });

    it("should allow passing array with single ralation", function () {

      let relation = ["someRelationName"];

      let request = new Request();
      request.setJoins(relation);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        joins: relation
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getJoins(),
        relation
      );

    });

    it("should allow passing array with multiple ralations", function () {

      let relations = [
        "someRelationName",
        "someRelationName2"
      ];

      let request = new Request();
      request.setJoins(relations);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        joins: relations
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getJoins(),
        relations
      );

    });

  });

  describe("passing object to setConditions() method", function () {

    it("should allow passing object with single condition (base level)", function () {

      let conditions = {
        name: "abc"
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name"]
      );

    });

    it("should allow passing object with multiple conditions (base level)", function () {

      let conditions = {
        name: "abc",
        lastName: "def"
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name", "lastName"]
      );

    });

    it("should allow passing object with multiple complex conditions (base level)", function () {

      let conditions = {
        name: "abc",
        lastName: "def",
        counter: {
          gt: 5,
          in: [6, 7, 8]
        },
        counter2: [2, 4, 5]
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name", "lastName", "counter", "counter2"]
      );

    });

    it("should allow passing object with multiple complex conditions (first level)", function () {

      let conditions = {
        or: [
          {
            name: "abc"
          },
          {
            lastName: "def"
          }
        ],
        and: [
          {
            counter: {
              gt: 5,
              in: [6, 7, 8]
            }
          },
          {
            counter2: [2, 4, 5]
          }
        ]
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name", "lastName", "counter", "counter2"]
      );

    });

    it("should allow passing object with multiple complex conditions (second level)", function () {

      let conditions = {
        or: [
          {
            or: [
              {
                name: "abc"
              },
              {
                name: "xyz"
              }
            ]
          },
          {
            lastName: "def"
          }
        ],
        and: [
          {
            counter: {
              gt: 5,
              in: [6, 7, 8]
            }
          },
          {
            counter2: [2, 4, 5]
          }
        ]
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name", "lastName", "counter", "counter2"]
      );

    });

    it("should allow passing object with multiple complex conditions (third level)", function () {

      let conditions = {
        or: [
          {
            or: [
              {
                or: [
                  {
                    name: "abc"
                  },
                  {
                    name: "qwe"
                  }
                ]
              },
              {
                name: "xyz"
              }
            ]
          },
          {
            lastName: "def"
          }
        ],
        and: [
          {
            counter: {
              gt: 5,
              in: [6, 7, 8]
            }
          },
          {
            counter2: [2, 4, 5]
          }
        ]
      };

      let request = new Request();
      request.setConditions(conditions);

      let expectedExport = {
        limit: defaultLimit,
        conditions: conditions
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getConditions(),
        conditions
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["name", "lastName", "counter", "counter2"]
      );

    });

    it("should throw error when passed data contains 4th level deep conditions", function () {

      let conditions = {
        or: [
          {
            or: [
              {
                or: [
                  {
                    name: "abc"
                  },
                  {
                    and: [
                      {
                        name: "qwe"
                      },
                      {
                        lastName: "asd"
                      }
                    ]
                  }
                ]
              },
              {
                name: "xyz"
              }
            ]
          },
          {
            lastName: "def"
          }
        ],
        and: [
          {
            counter: {
              gt: 5,
              in: [6, 7, 8]
            }
          },
          {
            counter2: [2, 4, 5]
          }
        ]
      };

      let request = new Request();

      assert.throw(function() {
          request.setConditions(conditions);
        },
        "Only 3 levels of nested conditions are supported"
      );
    });

    it("should throw error when passed conditions contains invalid logic blocks", function () {

      let invalidLogicConditions = [
        { or: -1 },
        { or: 0 },
        { or: 1 },
        { or: null },
        { or: undefined },
        { or: "random string" },
        { or: {} },
        { and: -1 },
        { and: 0 },
        { and: 1 },
        { and: null },
        { and: undefined },
        { and: "random string" },
        { and: {} },
      ];

      let request = new Request();
      _(invalidLogicConditions).forEach(function(invalidCondition) {

        assert.throw(function() {
            request.setConditions(invalidCondition);
          },
          "Logic operator expects array of conditions"
        );

      });

    });

    it("should throw error when passed conditions doesnt contain conditions", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({or: []});
        },
        "Logic operator expects array of at least two conditions"
      );

      assert.throw(function() {
          request.setConditions({and: []});
        },
        "Logic operator expects array of at least two conditions"
      );

    });

    it("should throw error when passed conditions contains less than 2 conditions", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({or: [{a: "b"}]});
        },
        "Logic operator expects array of at least two conditions"
      );

      assert.throw(function() {
          request.setConditions({and: [{a: "b"}]});
        },
        "Logic operator expects array of at least two conditions"
      );

    });

    it("should throw error when passed condition contains array with non-int and non-strings", function () {

      var invalidInValues = [
        null,
        undefined,
        {},
        []
      ];

      let request = new Request();
      _(invalidInValues).forEach(function(invalidInValue) {

        assert.throw(function() {
            request.setConditions({fieldX: [invalidInValue]});
          },
          "Invalid list of values for field: 'fieldX'"
        );

      });
    });

    it("should throw error when passed conditions contains invalid operator", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({fieldX: {invalidOperator: ["validValue", 5, -12]}});
        },
        "Invalid operator provided for field: 'fieldX'"
      );
    });

    it("should throw error when passed conditions contains array of invalid values for operator", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({fieldX: {gt: [{}]}});
        },
        "Invalid list of values for field: 'fieldX' and operator: 'gt'"
      );
    });

    it("should throw error when passed conditions contains invalid operator in field's conditions", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({fieldX: {invalidOperator: "b"}});
        },
        "Invalid operator provided for field: 'fieldX'"
      );
    });

    it("should throw error when passed conditions contains value for field", function () {

      let request = new Request();
      assert.throw(function() {
          request.setConditions({fieldX: null});
        },
        "Invalid data structure provided"
      );

      assert.throw(function() {
          request.setConditions({fieldX: undefined});
        },
        "Invalid data structure provided"
      );
    });

  });

  describe("passing object to setOrder() method", function () {

    it("should allow ordering by single field ASC (using object)", function () {

      let order = {
        "field1": "asc"
      };

      let request = new Request();
      request.setOrder(order);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: order
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1"]
      );

      assert.deepEqual(
        request.getOrder(),
        order
      );
    });

    it("should allow ordering by single field DESC (using object)", function () {

      let order = {
        "field1": "desc"
      };

      let request = new Request();
      request.setOrder(order);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: order
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1"]
      );

      assert.deepEqual(
        request.getOrder(),
        order
      );
    });

    it("should allow ordering by single field (using string)", function () {

      let order = "field1";

      let request = new Request();
      request.setOrder(order);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: {
          [order]: "asc"
        }
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1"]
      );

      assert.deepEqual(
        request.getOrder(),
        {
          [order]: "asc"
        }
      );
    });

    it("should allow ordering by multiple fields mixed using object", function () {

      let order = {
        "field1": "desc",
        "field2": "asc"
      };

      let request = new Request();
      request.setOrder(order);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: order
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1", "field2"]
      );

      assert.deepEqual(
        request.getOrder(),
        order
      );
    });

    it("should allow ordering by multiple fields mixed using array", function () {

      let order = [
        "field1",
        "field2"
      ];

      let expectedOrder = {
        "field1": "asc",
        "field2": "asc"
      };

      let request = new Request();
      request.setOrder(order);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        order: expectedOrder
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getUsedFields(),
        ["field1", "field2"]
      );

      assert.deepEqual(
        request.getOrder(),
        expectedOrder
      );
    });

    it("should throw error when invalid order fields passed inside array", function () {

      var invalidOrderValues = [
        [null],
        [undefined],
        [1],
        [0],
        [-1],
        [{}],
        [false],
        [true]
      ];

      let request = new Request();
      _(invalidOrderValues).forEach(function(invalidOrder) {

        assert.throw(function() {
            request.setOrder(invalidOrder);
          },
          "Invalid order field(s) passed"
        );

      });
    });

    it("should throw error when invalid order variable type passed", function () {

      var invalidOrderValues = [
        null,
        undefined,
        1,
        0,
        -1
      ];

      let request = new Request();
      _(invalidOrderValues).forEach(function(invalidOrder) {

        assert.throw(function() {
            request.setOrder(invalidOrder);
          },
          "Invalid order passed"
        );

      });
    });

    it("should throw error when invalid order passed", function () {

      var invalidOrderValues = [
        {fieldX: "xxxx"},
        {fieldX: undefined},
        {fieldX: null},
        {fieldX: []},
        {fieldX: {}},
        {fieldX: 1},
        {fieldX: 0},
        {fieldX: -1}
      ];

      let request = new Request();
      _(invalidOrderValues).forEach(function(invalidOrder) {

        assert.throw(function() {
            request.setOrder(invalidOrder);
          },
          "Invalid order operator passed"
        );

      });
    });
  });

  describe("passing object to setLimit() method", function () {

    it("should allow pass limit", function () {

      let limit = 23;

      let request = new Request();
      request.setLimit(limit);

      let expectedExport = {
        conditions: {},
        limit: limit
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getLimit(),
        limit
      );
    });

    it("should throw error when invalid limit variable type passed", function () {

      var invalidLimitValues = [
        null,
        undefined,
        [],
        {},
        false,
        true,
        -1,
        0
      ];

      let request = new Request();
      _(invalidLimitValues).forEach(function(invalidLimitValue) {

        assert.throw(function() {
            request.setLimit(invalidLimitValue);
          },
          "Invalid limit passed. Positive integer value expected"
        );

      });
    });

  });

  describe("passing object to setOffset() method", function () {

    it("should allow pass offset", function () {

      let offset = 23;

      let request = new Request();
      request.setOffset(offset);

      let expectedExport = {
        conditions: {},
        limit: defaultLimit,
        offset: offset
      };

      assert.deepEqual(
        request.export(),
        expectedExport
      );

      assert.deepEqual(
        request.getOffset(),
        offset
      );
    });

    it("should throw error when invalid offset variable type passed", function () {

      var invalidOffsetValues = [
        null,
        undefined,
        [],
        {},
        false,
        true,
        -1,
        0
      ];

      let request = new Request();
      _(invalidOffsetValues).forEach(function(invalidOffsetValue) {

        assert.throw(function() {
            request.setOffset(invalidOffsetValue);
          },
          "Invalid offset passed. Positive integer value expected"
        );

      });
    });

  });

});