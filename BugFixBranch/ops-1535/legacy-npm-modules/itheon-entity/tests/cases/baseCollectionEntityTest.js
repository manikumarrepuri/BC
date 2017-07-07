
"use strict";

var appRootPath          = require("app-root-path");
var assert               = require("chai").assert;
var BaseCollectionEntity = require(appRootPath + "/lib/baseCollectionEntity");

class InvalidCollectionEntity extends BaseCollectionEntity
{
  constructor()
  {
    super();
  }
}

class DeviceCollectionEntity extends BaseCollectionEntity
{
  constructor(collection)
  {
    super(collection);
  }
}

describe("BaseCollectionEntity", function() {
  describe("on instantiation of collection", function () {
    it("should not instantiate(since it is not extended)", function () {
      assert.throw(function() {
        new BaseCollectionEntity();
      }, "BaseCollectionEntity used incorrectly. You need to extend default constructor!");
    });
  });
});

describe("DeviceCollectionEntity", function() {
  describe("on instantiation of collection", function () {

    it("should not instantiate(since the collection is not valid)", function () {
      assert.throw(function() {
        new DeviceCollectionEntity('collection');
      }, "BaseCollectionEntity used incorrectly. You need to pass an array of entities");
    });

    it("should instantiate(since the collection is valid)", function () {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "test"
          }
        };

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });
  });

  describe("addEntity()", function () {
    it("should not add item (since the item is not valid)", function () {
      assert.throw(function() {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        collection.addEntity("something random");
      });
    });

    it("should add item (since the item is valid)", function () {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        collection.addEntity({
          "id": 2,
          "name": "abc"
        });

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "test"
          },
          2: {
            "id": "2",
            "name": "abc"
          }
        }

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });
  });

  describe("inflate()", function () {
    it("should allow to append multiple entities using object(strict)", function () {

        var collection = new DeviceCollectionEntity();

        collection.inflate({
          1: {
            "id": 1,
            "name": "test",
            "cutomFieldX": "abc"
          },
          2: {
            "id": 2,
            "name": "abc",
            "cutomFieldY": "def"
          }
        });

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "test"
          },
          2: {
            "id": "2",
            "name": "abc"
          }
        };

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });

    it("should allow to append multiple entities using array(strict)", function () {

        var collection = new DeviceCollectionEntity();

        collection.inflate([
          {
            "id": 1,
            "name": "test",
            "cutomFieldX": "abc"
          },
          {
            "id": 2,
            "name": "abc",
            "cutomFieldY": "def"
          }
        ]);

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "test"
          },
          2: {
            "id": "2",
            "name": "abc"
          }
        };

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });

    it("should allow to append multiple entities(non strict)", function () {

        var collection = new DeviceCollectionEntity();
        collection.setAllowAnyField(true);

        collection.inflate([
          {
            "id": 1,
            "name": "test",
            "cutomFieldX": "abc"
          },
          {
            "id": 2,
            "name": "abc",
            "cutomFieldY": "def"
          }
        ]);

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "test",
            "cutomFieldX": "abc"
          },
          2: {
            "id": "2",
            "name": "abc",
            "cutomFieldY": "def"
          }
        };

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });
  });

  describe("updateEntity()", function () {
    it("should not update entity (since the item is not valid)", function () {
      assert.throw(function() {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        collection.updateEntity("something random");
      });
    });

    it("should update entity (since the item is valid)", function () {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        collection.updateEntity({
          "id": 1,
          "name": "abc"
        });

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "abc"
          },
        }

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });

    it("should update and sanitise entity (strict)", function () {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});

        collection.updateEntity({
          "id": 1,
          "name": "abc",
          "example": true
        });

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "abc"
          },
        }

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });

    it("should update entity (non-strict)", function () {
        var collection = new DeviceCollectionEntity({1: {
          "id": 1,
          "name": "test"
        }});
        collection.setAllowAnyField(true);

        collection.updateEntity({
          "id": 1,
          "name": "abc",
          "example": true
        });

        var expectedProperties = {
          1: {
            "id": "1",
            "name": "abc",
            "example": true
          },
        }

        assert.deepEqual(
          collection.export(),
          expectedProperties
        );
    });
  });

  describe("getTotalCount()", function () {
    it("should return valid count", function () {
        var collection = new DeviceCollectionEntity({
          1: {
            "id": 1,
            "name": "test"
          },
          2: {
            "id": 2,
            "name": "abc"
          },
          3: {
            "id": 3,
            "name": "xyz"
          },
          4: {
            "id": 4,
            "name": "something"
          },
          5: {
            "id": 5,
            "name": "more"
          },
          6: {
            "id": 6,
            "name": "interesting"
          },
          7: {
            "id": 7,
            "name": "please"
          }
        });

        assert.equal(
          collection.getTotalCount(),
          7
        );
    });

    it("should return overridden count", function () {
        var collection = new DeviceCollectionEntity([
         {
            "id": 1,
            "name": "test"
          }
        ]);

        collection.setTotalCount(10);

        assert.equal(
          collection.getTotalCount(),
          10
        );
    });
  });

});
