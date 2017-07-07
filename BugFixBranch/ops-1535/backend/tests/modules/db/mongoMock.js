var mongoose = require("mongoose");
var mquery = require('mquery');
//Test Data : Start
var alerts = [
    {
      "_id": "590b2c02c98c5acc1a8f7cba",
      "ruleName": "Itheon 7",
      "group": "AJ BELL",
      "name": "AJBTEST",
      "deviceId": "AJ BELL:AJBTEST",
      "state": "U"
    }];
//Test Data : End

//Global Variables : Start

//Global Variables : End

//collection.insert native implementation for Unit Testing : Start
mongoose.Collection.prototype.insert = function(docs, options, callback) {
    callback(null, docs);
};
//collection.findOneAndUpdate native implementation for Unit Testing : End

//collection.findOneAndUpdate native implementation for Unit Testing : Start
mongoose.Collection.prototype.findOneAndUpdate = function(objectId, docs, options, callback) {
    //Send error response if "id" is empty
    if(!objectId.id && !objectId.deviceId)
    {
        return callback("Id Required", null);
    }
    //Send the result object
    var result ={};
    result.value = docs;
    callback(null, result);
};
//collection.findOneAndUpdate native implementation for Unit Testing : End

//Model.findOneAndUpdate native implementation for Unit Testing : Start
mongoose.Model.findOneAndUpdate = function(objectId, docs, options, callback) {
    //Send error response if "id" is empty
    if(!objectId.id && !objectId.deviceId && !objectId._id)
    {
        return callback("Id Required", null);
    }
    //Send the result object
    var result ={};
    if(objectId._id){
        //For update
        result._doc = docs;
    }else{
        //For Create
        result.value = docs;
    }
    callback(null, result);
};
//Model.findOneAndUpdate native implementation for Unit Testing : End

//Model.find native implementation for Unit Testing : Start
mongoose.Model.find = function(objectId, docs, options, callback){
    var mq = new this.Query({}, {}, this, this.collection);
    return mq.find(objectId, callback);
};
mongoose.Query.prototype.find = function(conditions, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
  }
  // if we don't have a callback, then just return the query object
  if (!callback) {
    return mongoose.Query.base.find.call(this);
  }
  return callback(null, alerts);    
};
//Model.find native implementation for Unit Testing : End

//Model.find native implementation for Unit Testing : Start
mongoose.Model.findOne = function(objectId, docs, options, callback){
    var mq = new this.Query({}, {}, this, this.collection);
    return mq.findOne(objectId, callback);
};
mongoose.Query.prototype.findOne = function(conditions, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
  }
  // if we don't have a callback, then just return the query object
  if (!callback) {
    return mongoose.Query.base.findOne.call(this);
  }
  return callback(null, alerts);    
};
//Model.find native implementation for Unit Testing : End

//Model.update native implementation for Unit Testing : Start
mongoose.Model.update = function(objectId, docs, callback){
    return callback(null, "done");
};
//Model.update native implementation for Unit Testing : End

module.exports = mongoose;