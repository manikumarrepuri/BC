"use strict";

var appRoot       = require('app-root-path');
var common        = require('opserve-common');
var _             = common.utilities.underscore;
const logger      = common.logger;
const HttpGateway   = common.gateway.HttpGateway;
const RedisGateway  = common.gateway.RedisGateway;
const ReceiverError = common.error.ReceiverError;
var moment        = require('moment');
var Service       = require('itheon-service');
var DeviceEntity  = require("itheon-module-device-entity").DeviceEntity;
var Request       = common.Request;


class iamAnnounce extends Service
{
  /**
  *
  */
  constructor()
  {
    super();
    this.config      = common.Config.get();
    this.httpGateway = new HttpGateway(null, this.config.get("backend-api"));
    this.redisGateway = new RedisGateway();
  }

  /**
  * Generate a Performance entity using a mapper
  *
  * @param Object data
  * {
  *   "mapperName": "",
  *   "mapper": {
  *               fields: {
  *                 "name": "physicalMemoryUsed",
  *                 "type": "%"
  *               }
  *             },
  *   "columns": [],
  * }
  * @return Performance entity
  */
  generateEntity(data) {
    //Load the mapper and create the metrics array
    var id=null,time=null,date=null;
    var details ={};
    _.each(data.columns,function(value,index) {
      if(typeof data.mapper.fields[index] !== 'undefined') {
        switch(data.mapper.fields[index].name) {
          //Ignore this we'll get it from the JSON
        case 'computerName':
        case 'customerId':
          break;
        case 'dateTime':
          date = value.replace(/[- :]/g," ");
          break;
        case 'timeOfDay':
          time = moment(new Date(date+' '+value+'z')).format('X');
          break;
        default:
          if(data.mapper.fields[index].type == 'json') {
            details = JSON.parse(value);
            details.GroupName = details.GroupName.replace(/\:{1,}$/g, '');
            id = details.GroupName + ':' + details.HostName;
          }
          break;
        }
      }
    });

    if(!details) {
      throw new ReceiverError(
        'Invalid request. No announce details generated.'
      );
    }

    //Add in the timestamp for when the data was generated
    details.updatedAt = time;

    return {
      "id": id,
      "details": details
    };
  }

  /**
  * Method sends a patch request to the frontend api
  *
  * @param announceEntity announceEntity Announce entity
  * @return announceEntity announce Announce entity
  */
  process(announce)
  {
    announce.updatedAt = new Date();

    logger.info(
      'iamAnnounce Receiver: Posting announce entity to API'
    );

    //We need to get the existing tags first
    this.redisGateway.hget('device:' + announce.id, 'tags').then((tags) => {

      if(!tags) {
        return false;
      }

      //See if we have a SourceType already
      var sourceType =  _.find(tags, (tag) => {
        return tag.indexOf("system:SourceType:") > -1;
      });

      //If not add one and re-save the device to the cache
      if(!sourceType) {
        announce.tags = (tags || []);
        announce.tags.push('system:SourceType:iAM Agent');
      }

      announce.name = announce.details.HostName;
      announce.group = announce.details.GroupName;
      announce.platform = announce.details.OSPlatform.toLowerCase();
      announce.status = 1;
      var request = new Request();
      request.setPayload(announce);
      //Send metrics to the frontend
      this.httpGateway.setUrl('/devices');
      // var deviceEntity = new DeviceEntity(announce);
      this.httpGateway.save(request).then((response) => {
        if(!sourceType && response && !response.error) {
          this.redisGateway.hmset('device:' + announce.id, { "tags": JSON.stringify(announce.tags) }).then((result) => {
            logger.info('Updated tags in Redis for device' + announce.id);
          });
        }
      });
    });

    return announce;
  }
}

module.exports = iamAnnounce;
