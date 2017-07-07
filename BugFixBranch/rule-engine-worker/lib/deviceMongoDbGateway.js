"use strict";

const mongoose    = require('mongoose');
const common      = require("opserve-common");
const _           = require('lodash');
const Device      = mongoose.model('Device');
const Rule        = mongoose.model('Rule');
const logger      = common.logger;
const mongoEscape = common.utilities.mongoEscape;

var deviceMongoDbGateway = {

getWithRules : function(){
            var devicesResult = {devices:[],rules:[]};

            return Device.find().lean().then((devices) => {
                devicesResult.devices = devices;

            return Rule.find().lean().then((rules) => {
                    devicesResult.rules = rules;

                _.forEach(devicesResult.devices, function(value,index,theArray) {
                var ruleObject = _.filter(devicesResult.rules, { 'deviceId': value.id });
                if(ruleObject){
                   theArray[index].rules = ruleObject;
              }
                });

                delete devicesResult["rules"];

                let jsonResult = mongoEscape.unescapeInvalidMongoCharacters(devicesResult);

                return jsonResult.devices;
            })
            })

},

save: function(deviceData) {

    logger.info("Saving device...::[deviceModule.create]");
    var device = new Device();
    let json = mongoEscape.escapeInvalidMongoCharacters(deviceData);
    device.collection.findOneAndUpdate(
    {id: json.id}, // query
    json, // replacement
    {returnOriginal:false, upsert:true}, // options
    function(err, device) {
        if (err){
            logger.warn("Error while saving devices::[deviceModule.create]", +err);
            return err;  // returns error if no matching object found
        }else{
            logger.info('Devices were successfully stored::[deviceModule.create]');
            return mongoEscape.unescapeInvalidMongoCharacters(device.value);
        }
    });
  },
};

module.exports = deviceMongoDbGateway;
