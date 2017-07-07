"use strict";

const common = require('opserve-common');
const _ = common.utilities.underscore;
const Handlebars = common.utilities.handlebars;
const logger = common.logger;
const AmqpQueueGateway = common.gateway.AmqpQueueGateway;
const HttpGateway = common.gateway.HttpGateway;
const RedisGateway = common.gateway.RedisGateway;
const ReceiverError = common.error.ReceiverError;
var Request = common.Request;
var moment = require('moment');
var Service = require('itheon-service');
var PerformanceEntity = require("itheon-module-performance-entity").PerformanceEntity;


class iamReceiver extends Service
{
  /**
  *
  */

  constructor()
  {
    super();
    this.config = common.Config.get();
    this.httpGateway = new HttpGateway(null, this.config.get("backend-api"));
    this.amqp = new AmqpQueueGateway({ sendTo: "metrics" });
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
    var group = null,
      time = null,
      date = null,
      name = null,
      metricName = null;
    var entity = '';
    var tmp = [];
    var platform = 'question';
    var metrics = {};
    var prefix = data.mapper.tableName || data.mapperName;

    //Allow for a blank group so we don't set a prefix
    if (!_.isUndefined(data.mapper.group)) {
      prefix = data.mapper.group;
    }

    //If we have a prefix add the :
    if (prefix) {
      prefix += ':';
    }

    //If this is a template drop the prefix we'll add it later
    var isTemplate = !!~prefix.indexOf('{{');
    if (isTemplate) {
      prefix = '';
    }

    var templateData = {};

    _.each(data.columns, function (value, index) {
      if (typeof data.mapper.fields[index] !== 'undefined') {
        switch (data.mapper.fields[index].name) {
          case 'computerName':
            if (group) {
              //Fix up the group if need be
              var groupParts = group.split(/:+/g);
              //Grab/Remove the last item from the group and compare to computerName
              if (value == groupParts.pop()) {
                group = groupParts.join(':');
              }
            }

            name = value;
            break;
          case 'host':
            name = value;
            if (value.indexOf('::') !== -1) {
              tmp = value.split('::');
              group = tmp[0];
              name = tmp[1];
            }
            break;
          case 'context':
            tmp = value.split('|');
            for (var i = 0; i < tmp.length; i++) {
              templateData['context' + i] = tmp[i];
              metrics[prefix + 'context' + i] = {
                name: 'context' + i,
                value: tmp[i],
                type: "string",
                occurred: time
              };
            }
            break;
          case 'customerId':
            group = value;
            break;
          case 'date':
          case 'dateTime':
            date = value.replace(/[- :]/g, " ");
            break;
          case 'time':
          case 'timeOfDay':
            time = moment(new Date(date + ' ' + value + 'z')).format('X');
            break;
          default:
            if (data.mapper.fields[index].type == 'entity') {
              entity = value;
            }

            //If we don't understand the datatype skip it!
            if (data.mapper.fields[index].type !== 'unknown') {
              metricName = data.mapper.fields[index].name;

              if (metricName.indexOf('.') == -1) {
                metricName = prefix + metricName;
              }

              templateData[data.mapper.fields[index].name] = value;

              metrics[metricName] = {
                "name": metricName,
                "value": value,
                "type": data.mapper.fields[index].type,
                "occurred": time
              };
            }

            break;
        }
      }
    });

    if (!metrics) {
      throw new ReceiverError(
        'Invalid request. No metrics generated.'
      );
    }

    //If the group name is a template we now need to fix everything
    if (isTemplate) {
      var newMetrics = {};
      //Parse the template
      var template = Handlebars.compile(data.mapper.group);
      prefix = template(templateData);
      //If we've got the computer name in here delete it
      prefix = prefix.replace(group + '::' + name, '') + ':';

      //Update the metrics to use the generated prefix
      _.each(metrics, function (value, key) {
        let newKey = prefix + key;
        value['name'] = newKey;
        newMetrics[newKey] = value;
      });
      metrics = newMetrics;
    }

    //Work out platform
    switch (data.mapperName) {
      case 'system':
      case 'disks':
        platform = 'windows';
        break;
      case 'unixsystem':
      case 'unixfilesystem':
        platform = 'unix';
        break;
      case 'os400system':
      case 'os400pool':
        platform = 'os400';
        break;
      case 'vmssystem':
      case 'vmsdisks':
        platform = 'vms';
        break;
    }

    //if we have an entity level statistic the array needs to be returned differently
    if (entity !== '') {
      var mapperName = (!data.mapper.tableName) ? data.mapperName : data.mapper.tableName.toLowerCase();

      metrics = {
        [mapperName]: {
          [entity]: metrics
        }
      };
    }

    return {
      "name": name,
      "group": group,
      "platform": platform,
      "metrics": metrics,
      "metricGroup": prefix.substr(0, prefix.length - 1),
      "originalEvent": data.originalEvent,
      "tags": ['system:SourceType:iAM Agent'],
      "time": time
    };
  }

  /**
   * Method saves the entity to the queue and posts to frontend API
   *
   * @param PerformanceEntity performanceEntity Performance entity
   * @return PerformanceEntity performance Performance entity
   */
  process(performance) {
    //Add creation date
    performance.createdAt = new Date();

    logger.info(
      'iamReceiver: Saving performance entity to queue'
    );

    //Save to the metrics queue

    this.amqp.save(performance);

    var updatedMetrics = false;
    var deviceData = {};

    if (_.has(performance.metrics, 'system:cpuBusy')) {
      deviceData.cpuBusy = parseFloat(performance.metrics["system:cpuBusy"].value);
      updatedMetrics = true;
    }

    if (_.has(performance.metrics, 'system:physicalMemoryUsed')) {
      deviceData.physicalMemoryUsed = parseFloat(performance.metrics["system:physicalMemoryUsed"].value);
      updatedMetrics = true;
    }

    if (_.has(performance.metrics, 'system:systemAspUsed')) {
      deviceData.storage = parseFloat(performance.metrics["system:systemAspUsed"].value);
      updatedMetrics = true;
    }

    if (performance.metrics.disks) {
      if (performance.platform == 'unix' && performance.metrics.disks['/']) {
        deviceData.storage = performance.metrics.disks['/'].diskUsed.value;
        updatedMetrics = true;
      }

      if (performance.platform == 'windows' && performance.metrics.disks['C']) {
        deviceData.storage = performance.metrics.disks['C'].diskUsed.value;
        updatedMetrics = true;
      }
    }

    //TODO: This should be removed nasty bodge because metrics kills everything.
    if (updatedMetrics) {
      logger.info(
        'Sending performance updates to Itheon 10'
      );

      var request = new Request();
      deviceData.id = performance.group + ":" + performance.name;
      deviceData.updatedAt = new Date();

      //We need to get the existing tags first

      this.redisGateway.hget('device:' + deviceData.id, 'tags').then((tags) => {

        if (!tags) {
          return false;
        }

        //See if we have a SourceType already
        var sourceType = _.find(tags, (tag) => {
          return tag.indexOf("system:SourceType:") > -1;
        });

        //If not add one and re-save the device to the cache
        if (!sourceType) {
          deviceData.tags = (tags || []);
          deviceData.tags.push('system:SourceType:iAM Agent');
        }

        deviceData.status = 1;
        deviceData.group = performance.group;
        deviceData.name = performance.name;
        deviceData.displayName = performance.name;
        deviceData.platform = performance.platform;

        //Set that we only want the ID back
        request.setFields('id');
        //Set the payload
        request.setPayload(deviceData);

        //Send metrics to the frontend

        this.httpGateway.setUrl('/devices');
        this.httpGateway.save(request).then((response) => {
          if (!sourceType && response && !response.error) {
            this.redisGateway.hmset('device:' + deviceData.id, {
              "tags": JSON.stringify(deviceData.tags)
            }).then((result) => {
              logger.info('Updated tags in Redis for device' + deviceData.id);
            });
          }
        });
      });
    }
    /*
        We aren't sending metrics for now

        logger.info(
          'iamReceiver: Posting perfomance entity to API'
        );

        var config  = require("itheon-config").ConfigFactory.getConfig();
        var request = new Request();
        //Set that we only want the ID back
        request.setFields('id');
        //Set the payload
        request.setPayload(performance);

        //Send metrics to the frontend
        var httpGateway = new HttpGateway(null, config.get("frontendApi"));
        httpGateway.setUrl('/api/performances');
        httpGateway.insert(request);
    */

    return performance;
  }
}



module.exports = iamReceiver;

