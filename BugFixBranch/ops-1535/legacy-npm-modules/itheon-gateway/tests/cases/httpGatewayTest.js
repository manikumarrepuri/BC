
"use strict";

var Request = require("itheon-request");
var assert  = require("assert");

var HttpUserGateway = require("../mocks/httpUserGateway");
var httpUserGateway = new HttpUserGateway();

var nock = require('nock');

describe("HttpGateway Test", function() {

  // ---------------------------------------------------------------------------------
  describe("Query method - selecting field", function() {
  // ---------------------------------------------------------------------------------

    it("should by default select all fields", function(done) {

      var sampleRequestData = {};

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should by default select all fields'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default"});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select all fields explicit *", function(done) {

      var sampleRequestData = {
        "fields": [
          "*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to select all fields explicit *'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", fields: {"*": "*"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select specific fields", function(done) {

      var sampleRequestData = {
        "fields": [
          "id",
          "username"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to select specific fields'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", fields: {"id": "id", "username": "username"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to select aliased fields", function(done) {

      var sampleRequestData = {
        "fields": [
          "u.id",
          "u.username"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to select aliased fields'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", fields: {"u.id": "id", "u.username": "username"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });

    });

    it("should allow to select all fields with alias", function(done) {

      var sampleRequestData = {
        "fields": [
          "u.*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to select all fields with alias'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", fields: {"u.*": "*"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  // ---------------------------------------------------------------------------------
  // describe("Query method - aliasing field", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to select and alias specific fields", function(done) {

      var sampleRequestData = {
        "fields": {
          "u.id": "userId",
          "u.username": "userUsername"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to select and alias specific fields'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", fields: {"u.id": "userId", "u.username": "userUsername"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    // it("should throw error when column is aliased to prefixed column", function() {

    //   var sampleRequestData = {
    //     "fields": {
    //       "u.username" : "u.nameA"
    //     }
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   assert.throws(function() {
    //     httpUserGateway.fetchAll(request);
    //     },
    //     "Aliases are not allowed in aliases"
    //   );

    // });

  // ---------------------------------------------------------------------------------
  // describe("Query method - joining on single collection", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to join on other collections and specify fields to be selected", function(done) {

      var sampleRequestData = {
        "joins": [
          "role"
        ],
        "fields": {
          "u.username": "userUsername",
          "r.name": "roleName"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to join on other collections and specify fields to be selected'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", joins: ["role"], fields: {"u.username": "userUsername", "r.name": "roleName"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to join on other collections and specify fields to be selected(allow *)", function(done) {

      var sampleRequestData = {
        "joins": [
          "role"
        ],
        "fields": [
          "u.*",
          "r.name"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to join on other collections and specify fields to be selected(allow *)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", joins: ["role"], fields: {"u.*": "*", "r.name": "name"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow to join on other collections and specify all fields", function(done) {

      var sampleRequestData = {
        "joins": [
          "role"
        ],
        "fields": [
          "u.name",
          "r.*"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow to join on other collections and specify all fields'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {limit: "50", storage: "default", joins: ["role"], fields: {"u.name": "name", "r.*": "*"}});
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    // it("should throw error when no fields were selected from joined collection", function() {

    //   var sampleRequestData = {
    //     "joins": [
    //       "role"
    //     ],
    //     "fields": [
    //       "u.*"
    //     ]
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   assert.throws(function() {
    //       rethinkDbUserGateway.fetchAll(request);
    //     },
    //     "No fields selected from joined collection"
    //   );

    // });

    // it("should throw error when joined with no fields (from both both collections)", function() {

    //   var sampleRequestData = {
    //     "joins": [
    //       "role"
    //     ]
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   assert.throws(function() {
    //       rethinkDbUserGateway.fetchAll(request);
    //     },
    //     "No fields selected from joined collection"
    //   );

    // });

    // it("should throw error when joined on invalid relation", function() {

    //   var sampleRequestData = {
    //     "joins": [
    //       "invalidJoin"
    //     ]
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   assert.throws(function() {
    //       rethinkDbUserGateway.fetchAll(request);
    //     },
    //     "Invalid join name provided"
    //   );

    // });

  // ---------------------------------------------------------------------------------
  // describe("Query method - passing conditions", function() {
  // ---------------------------------------------------------------------------------

    it("should allow for implicit IN conditions", function(done) {

      var sampleRequestData = {
        "conditions": {
          "id": [
            "d7885ec6-ece3-427a-b15c-c114d27d2f82",
            "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
          ]
        },
        "fields": {
          "username": "userUsername",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow for implicit IN conditions'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            conditions: {
              id: [
                "d7885ec6-ece3-427a-b15c-c114d27d2f82",
                "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
              ]
            },
            fields: {
              "username": "userUsername"
            }
          });
          assert.deepEqual(results.body, expectedResult);
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
              "d7885ec6-ece3-427a-b15c-c114d27d2f82",
              "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
            ]
          }
        },
        "fields": {
          "username": "userUsername",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow for explicit IN conditions'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            conditions: {
              "id": {
                "in": [
                  "d7885ec6-ece3-427a-b15c-c114d27d2f82",
                  "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
                ]
              }
            },
            fields: {
              "username": "userUsername"
            }
          });
          assert.deepEqual(results.body, expectedResult);
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
              "d7885ec6-ece3-427a-b15c-c114d27d2f82",
              "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
            ]
          }
        },
        "fields": {
          "username": "userUsername",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow for explicit NIN conditions'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            conditions: {
              "id": {
                "nin": [
                  "d7885ec6-ece3-427a-b15c-c114d27d2f82",
                  "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
                ]
              }
            },
            fields: {
              "username": "userUsername"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow nested conditions with logical operators", function(done) {

      var sampleRequestData = {
        "conditions": {
          "or": [
            {"firstName": "Kristy"},
            {"age": {"gt": 44}}
          ],
          "id": {
            "nin" : [
              "d7885ec6-ece3-427a-b15c-c114d27d2f82",
              "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
            ]
          }
        },
        "fields": {
          "username": "userUsername",
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow for explicit NIN conditions'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            conditions: {
              "or": [
                {"firstName": "Kristy"},
                {"age": {"gt": 44}}
              ],
              "id": {
                "nin": [
                  "d7885ec6-ece3-427a-b15c-c114d27d2f82",
                  "8d28e55b-1e77-479f-a3f6-c499c40be3ea"
                ]
              }
            },
            fields: {
              "username": "userUsername"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  // ---------------------------------------------------------------------------------
  // describe("Query method - set query order", function() {
  // ---------------------------------------------------------------------------------

    it("should allow order by single field ASC(explicit)", function(done) {

      var sampleRequestData = {
        "fields": {
          "username": "userUsername",
        },
        "order": {
          "username": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by single field ASC(explicit)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "userUsername"
            },
            order: {
              "username": "asc"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by single field DESC(explicit)", function(done) {

      var sampleRequestData = {
        "fields": {
          "username": "userUsername",
        },
        "order": {
          "username": "desc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by single field DESC(explicit)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "userUsername"
            },
            order: {
              "username": "desc"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow for requesting implicit order", function(done) {

      var sampleRequestData = {
        "fields": {
          "username": "userUsername",
        },
        "order": [
          "username"
        ]
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow for requesting implicit order'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "userUsername"
            },
            order: {
              "username": "asc"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    // it("should throw error when order on invalid field", function() {

    //   var sampleRequestData = {
    //     "fields": {
    //       "username": "userUsername",
    //     },
    //     "order": {
    //       "invalid": "asc"
    //     }
    //   };

    //   var request = new Request();
    //   request.inflate(sampleRequestData);

    //   assert.throws(function() {
    //       rethinkDbUserGateway.fetchAll(request);
    //     },
    //     "Invalid field passed: invalid"
    //   );

    // });

    it("should allow order by multiple fields(both ASC)", function(done) {

      var sampleRequestData = {
        "fields": [
          "username",
          "roleId"
        ],
        "order": {
          "roleId": "asc",
          "username": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by multiple fields(both ASC)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function(results) {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "username",
              "roleId": "roleId"
            },
            order: {
              "roleId": "asc",
              "username": "asc"
            }
          });
          assert.deepEqual(results.body, expectedResult);
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by multiple fields(both DESC)", function(done) {

      var sampleRequestData = {
        "fields": [
          "username",
          "roleId"
        ],
        "order": {
          "roleId": "desc",
          "username": "desc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by multiple fields(both DESC)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function() {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "username",
              "roleId": "roleId"
            },
            order: {
              "roleId": "desc",
              "username": "desc"
            }
          });
          done();
        }).catch(function(error) {
          done(error);
        });
    });

    it("should allow order by multiple fields(mixed order)", function(done) {

      var sampleRequestData = {
        "fields": [
          "username",
          "roleId"
        ],
        "order": {
          "roleId": "desc",
          "username": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by multiple fields(mixed order)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function() {
          assert.deepEqual(queryParams, {
            limit: "50",
            storage: "default",
            fields: {
              "username": "username",
              "roleId": "roleId"
            },
            order: {
              "roleId": "desc",
              "username": "asc"
            }
          });
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  // ---------------------------------------------------------------------------------
  // describe("Query method - set complex conditions", function() {
  // ---------------------------------------------------------------------------------

    it("should allow to generate 1 level deep queries", function(done) {

      var sampleRequestData = {
        "joins": [
          "role"
        ],
        "fields": {
          0: "id",
          1: "username",
          2: "age",
          3: "roleId",
          "r.name": "roleName"
        },
        "conditions": {
          "age": {"gt": 35},
          "roleId": "0c6acdbd-525d-4e15-84d2-7f630b7a6548"
        },
        "limit": 1,
        "order": {
          "roleId": "desc",
          "username": "asc"
        }
      };

      var request = new Request();
      request.inflate(sampleRequestData);

      var expectedResult = {
        url: 'should allow order by multiple fields(mixed order)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function() {
          assert.deepEqual(queryParams, {
            limit: "1",
            storage: "default",
            joins: [
              "role"
            ],
            fields: {
              "id": "id",
              "username": "username",
              "age": "age",
              "roleId": "roleId",
              "r.name": "roleName"
            },
            conditions: {
              "age": {"gt": 35},
              "roleId": "0c6acdbd-525d-4e15-84d2-7f630b7a6548"
            },
            order: {
              "roleId": "desc",
              "username": "asc"
            }
          });
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

      var expectedResult = {
        url: 'should allow order by multiple fields(mixed order)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function() {
          assert.deepEqual(queryParams, {
            "joins": [
              "creator",
              "assignee"
            ],
            "fields": {
              "id": "id",
              "name": "name",
              "storyPoints": "storyPoints",
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
            "storage": "default",
            "limit": "2",
            "order": {
              "status": "desc",
              "storyPoints": "asc"
            }
          });
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

      var expectedResult = {
        url: 'should allow order by multiple fields(mixed order)'
      };

      var queryParams = {};

      nock('http://backend-api:9443')
        .get("/users")
        .query(function(query) {
          queryParams = query;
          return true;
        })
        .reply(200, expectedResult);

      httpUserGateway.fetchAll(request)
        .then(function() {
          assert.deepEqual(queryParams, {
            "storage": "default",
            "joins": [
              "creator",
              "assignee"
            ],
            "fields": {
              "id": "id",
              "name": "name",
              "storyPoints": "storyPoints",
              "uc.username": "creatorUsername",
              "ua.username": "assigneeUsername"
            },
            "conditions": {
              "or": [
                {
                  "and": [
                    {"storyPoints": {"[gt]": "2"}},
                    {"storyPoints": {"[lt]": "9"}},
                  ]
                },
                {"storyPoints": {"lt": "8"}}
              ],
              "status": "active"
            },
            "limit": "2",
            "order": {
              "status": "desc",
              "storyPoints": "asc"
            }
          });
          done();
        }).catch(function(error) {
          done(error);
        });
    });

  });


});
