
"use strict";

var appRootPath = require("app-root-path");
const common    = require("opserve-common");
const _         = common.utilities.underscore;
const Request   = common.Request;

var RethinkDbTicketGateway = require(appRootPath + "/lib/module/Ticket/lib/gateway/ticket/rethinkDbTicketGateway");

var assert  = require("chai").assert;

var TestHelper = require("itheon-test").helper;
var testHelper = new TestHelper(__filename);

var rethinkDbTicketGateway = new RethinkDbTicketGateway();

var expectedResults = testHelper.getDataProvider("expectedQueryResults");

describe("RethinkDbGateway Test", function() {

  beforeEach(function(done) {
    testHelper.executeFixtureScript("ticketsWithRelations", done);
  });

  // ---------------------------------------------------------------------------------
  describe("Query method - selecting field", function() {
  // ---------------------------------------------------------------------------------

    it("should by default select all fields", function(done) {

      var sampleRequestData = {};

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.all, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select all fields", function(done) {

      var sampleRequestData = {
        "fields": [
          "*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.all, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select specific fields", function(done) {

      var sampleRequestData = {
        "fields": [
          "id",
          "name"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.limitedFields, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select aliased fields", function(done) {

      var sampleRequestData = {
        "fields": [
          "t.id",
          "t.name"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.limitedFields, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });

    });

    it("should allow to select all fields with alias", function(done) {

      var sampleRequestData = {
        "fields": [
          "t.*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.all, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - aliasing field", function() {
  // ---------------------------------------------------------------------------------


    it("should allow to select and alias specific fields", function(done) {

      var sampleRequestData = {
        "fields": {
          "t.id": "ticketId",
          "t.name": "ticketName"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.aliasedFields, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should throw error when column is aliased to prefixed column", function() {

      var sampleRequestData = {
        "fields": {
          "t.name" : "t.nameA"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "Aliases are not allowed in aliases"
      );

    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - joining on single collection", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to join on other collections and specify fields to be selected", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator"
        ],
        "fields": {
          "t.name": "ticketName",
          "uc.username": "creatorUsername"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.joinedWithCreator, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to join on other collections and specify fields to be selected(allow *)", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator"
        ],
        "fields": [
          "t.*",
          "uc.username"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.joinedWithCreatorAllTicketFields, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    // it("should allow to join on other collections and specify all fields", function(done) {

    //   return done("Currently not implemented - test skipped");

    //   var sampleRequestData = {
    //     "joins": [
    //       "creator"
    //     ],
    //     "fields": [
    //       "t.name",
    //       "uc.*"
    //     ]
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   rethinkDbTicketGateway.fetchAll(request)
    //     .then(function(results) {

    //       _.each(expectedResults.joinedWithCreatorAllTicketFields, function(result) {
    //         assert.include(results, result);
    //       });

    //       done();
    //     }).catch(function(error) {
    //       done(error);
    //     });
    // });

    it("should throw error when no fields were selected from joined collection", function() {

      var sampleRequestData = {
        "joins": [
          "creator"
        ],
        "fields": [
          "t.*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "No fields selected from joined collection"
      );

    });

    it("should throw error when joined with no fields (from both both collections)", function() {

      var sampleRequestData = {
        "joins": [
          "creator"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "No fields selected from joined collection"
      );

    });

    it("should throw error when joined with no fields (from both both collections)", function() {

      var sampleRequestData = {
        "joins": [
          "invalidJoin"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "Invalid join name provided"
      );

    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - joining on multiple collection", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to join on MULTIPLE other collections and specify fields to be selected", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator",
          "assignee"
        ],
        "fields": {
          "t.name": "ticketName",
          "uc.username": "creatorUsername",
          "ua.username": "assigneeUsername"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.joinedWithCreatorAndAssignee, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    // it("should allow to join on MULTIPLE other collections and specify fields to be selected(including *)", function(done) {

    //   return done("Currently not implemented - test skipped");

    //   var sampleRequestData = {
    //     "joins": [
    //       "creator",
    //       "assignee"
    //     ],
    //     "fields": {
    //       "t.name": "ticketName",
    //       "uc.username": "creatorUsername",
    //       0: "ua.*"
    //     }
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   rethinkDbTicketGateway.fetchAll(request)
    //     .then(function(results) {

    //       _.each(expectedResults.joinedWithCreatorAndAssignee, function(result) {
    //         assert.include(results, result);
    //       });

    //       done();
    //     }).catch(function(error) {
    //       done(error);
    //     });
    // });

    it("should allow to join on MULTIPLE other collections and ignore fields from one collection", function() {

      var sampleRequestData = {
        "joins": [
          "creator",
          "assignee"
        ],
        "fields": {
          "t.name": "ticketName",
          "uc.username": "creatorUsername"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "No fields selected from joined collection"
      );
    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - passing conditions", function() {
  // ---------------------------------------------------------------------------------

    it("should allow for implicit IN conditions", function(done) {

      var sampleRequestData = {
        "conditions": {
          "id": [
            "382f0878-29fd-4161-8231-fc931741e49f",
            "647c3c3c-309d-476a-8891-c2d569ba14e1"
          ]
        },
        "fields": {
          "name": "ticketName",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.ticketsInId, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow for explicit IN conditions", function(done) {

      var sampleRequestData = {
        "conditions": {
          "id": {
            "in" : [
              "382f0878-29fd-4161-8231-fc931741e49f",
              "647c3c3c-309d-476a-8891-c2d569ba14e1"
            ]
          }
        },
        "fields": {
          "name": "ticketName",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.ticketsInId, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow for explicit NIN conditions", function(done) {

      var sampleRequestData = {
        "conditions": {
          "id": {
            "nin" : [
              "382f0878-29fd-4161-8231-fc931741e49f",
              "647c3c3c-309d-476a-8891-c2d569ba14e1"
            ]
          }
        },
        "fields": {
          "name": "ticketName",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.ticketsNinId, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow nested conditions with logical operators", function(done) {

      var sampleRequestData = {
        "conditions": {
          "or": [
            {"name": "Concatenate files"},
            {"storyPoints": {"gt": 8}}
          ],
          "id": {
            "nin" : [
              "382f0878-29fd-4161-8231-fc931741e49f",
              "647c3c3c-309d-476a-8891-c2d569ba14e1"
            ]
          }
        },
        "fields": {
          "name": "ticketName",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {

          _.each(expectedResults.ticketsComplexConditions, function(result) {
            assert.include(results, result);
          });

          done();
        }).catch(function(error) {
          done(error);
        });
    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - set query order", function() {
  // ---------------------------------------------------------------------------------

    it("should allow order by single field ASC(explicit)", function(done) {

      var sampleRequestData = {
        "fields": {
          "name": "ticketName",
        },
        "order": {
          "name": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByNameAsc, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by single field DESC(explicit)", function(done) {

      var sampleRequestData = {
        "fields": {
          "name": "ticketName",
        },
        "order": {
          "name": "desc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByNameDesc, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow for requesting implicit order", function(done) {

      var sampleRequestData = {
        "fields": {
          "name": "ticketName",
        },
        "order": [
          "name"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByNameAsc, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should throw error when order on invalid field", function() {

      var sampleRequestData = {
        "fields": {
          "name": "ticketName",
        },
        "order": {
          "invalid": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      assert.throws(function() {
          rethinkDbTicketGateway.fetchAll(request);
        },
        "Invalid field passed: invalid"
      );

    });

    it("should allow order by multiple fields(both ASC)", function(done) {

      var sampleRequestData = {
        "fields": [
          "name",
          "storyPoints",
          "status"
        ],
        "order": {
          "status": "asc",
          "storyPoints": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByMultiAsc, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by multiple fields(both DESC)", function(done) {

      var sampleRequestData = {
        "fields": [
          "name",
          "storyPoints",
          "status"
        ],
        "order": {
          "status": "desc",
          "storyPoints": "desc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByMultiDesc, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by multiple fields(mixed order)", function(done) {

      var sampleRequestData = {
        "fields": [
          "name",
          "storyPoints",
          "status"
        ],
        "order": {
          "status": "desc",
          "storyPoints": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsOrderedByMultiMixed, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  });

  // ---------------------------------------------------------------------------------
  describe("Query method - set complex conditions", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to generate 1 level deep queries", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator",
          "assignee"
        ],
        "fields": {
          0: "id",
          1: "name",
          2: "storyPoints",
          "uc.username": "creatorUsername",
          "ua.username": "assigneeUsername"
        },
        "conditions": {
          "storyPoints": {"gt": 0},
          "status": "active"
        },
        "limit": 2,
        "order": {
          "status": "desc",
          "storyPoints": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsQueryLevel1Results, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to generate 2 level deep queries", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator",
          "assignee"
        ],
        "fields": {
          0: "id",
          1: "name",
          2: "storyPoints",
          "uc.username": "creatorUsername",
          "ua.username": "assigneeUsername"
        },
        "conditions": {
          "or": [
            {"storyPoints": {"gt": 0}},
            {"storyPoints": {"lt": 8}}
          ],
          "status": "active"
        },
        "limit": 2,
        "order": {
          "status": "desc",
          "storyPoints": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsQueryLevel1Results, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to generate 3 level deep queries", function(done) {

      var sampleRequestData = {
        "joins": [
          "creator",
          "assignee"
        ],
        "fields": {
          0: "id",
          1: "name",
          2: "storyPoints",
          "uc.username": "creatorUsername",
          "ua.username": "assigneeUsername"
        },
        "conditions": {
          "or": [
            {
              "and": [
                {"storyPoints": {"gt": 2}},
                {"storyPoints": {"lt": 9}},
              ]
            },
            {"storyPoints": {"lt": 8}}
          ],
          "status": "active"
        },
        "limit": 2,
        "order": {
          "status": "desc",
          "storyPoints": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      rethinkDbTicketGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(expectedResults.ticketsQueryLevel1Results, results);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  });


});