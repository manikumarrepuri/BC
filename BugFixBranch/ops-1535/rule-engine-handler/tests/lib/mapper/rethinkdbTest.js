
"use strict"

var appRoot = require('app-root-path');

var RethinkDbMapper = require(appRoot + '/lib/mapper/rethinkdb');
var Mapper          = require(appRoot + '/lib/mapper');
var Entity          = require(appRoot + '/lib/entity');

class CustomMapper extends RethinkDbMapper
{
  constructor(dbConnection)
  {
    super(dbConnection);

    this.table = {
      name: 'Rule',
      alias: 'r'
    };
  }
}

class CustomEntity extends Entity
{
  constructor(data)
  {
    super();

    this.setFields(new Set([
      'id',
      'height',
      'width'
    ]));

    if (data) {
      this.inflate(data);
    }
  }
}

exports.testExtendsBaseMapper = function(test) {
  test.ok(new Mapper instanceof Mapper);
  test.done();
};

exports.testInsertAndRetrieve = function(test) {

  var customMapper = new CustomMapper();

  // tidy up before test
  customMapper.getDbConnection().table(customMapper.table.name).delete().run();

  var sampleEntity = new CustomEntity({
    height: 10,
    width: 20
  });

  customMapper.insert(sampleEntity).then(function() {
    return customMapper.filter({});
  }).then(function(results) {

      test.equals(1, results.length);

      var sampleEntityData = sampleEntity.export();

      var recordFromDb = results.pop();
      sampleEntityData.id = recordFromDb.id;

      test.deepEqual(sampleEntityData, recordFromDb);
      test.done();
  })
};

exports.testInsertUpdateRetrieve = function(test) {

  var customMapper = new CustomMapper();

  // tidy up before test
  customMapper.getDbConnection().table(customMapper.table.name).delete().run();

  var sampleEntity = new CustomEntity({
    height: 10,
    width: 20
  });

  customMapper.insert(sampleEntity).then(function() {

    return customMapper.filter({});

  }).then(function(results) {

    test.equals(1, results.length);

    var sampleEntityData = sampleEntity.export();

    var recordFromDb = results.pop();

    sampleEntityData.id = recordFromDb.id;

    test.deepEqual(sampleEntityData, recordFromDb);

    sampleEntity.set("id", recordFromDb.id);
    sampleEntity.set("height", 22);
    return customMapper.update(sampleEntity)

}).then(function() {

    return customMapper.filter({});


  }).then(function(results) {

    test.equals(1, results.length);

    var sampleEntityData = sampleEntity.export();
    var recordFromDb = results.pop();

    test.deepEqual(sampleEntityData, recordFromDb);

    test.done();
  })
};
