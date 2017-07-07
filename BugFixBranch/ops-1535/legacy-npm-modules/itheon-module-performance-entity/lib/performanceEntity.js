
"use strict";

var _            = require("itheon-utility").underscore;
var BaseEntity   = require("itheon-entity").BaseEntity;
var MetricEntity = require("itheon-module-metric-entity").MetricEntity;

class PerformanceEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      name: {"type": 'string'},
      group: {"type": 'string'},
      platform: {"type": 'string'},
      metrics: {"type": 'object'},
      createdAt: {"type": 'date'}
    });

    this.set("createdAt", Math.floor(Date.now() / 1000));

    if (data) {
      this.inflate(data);
    }
  }

  getId()
  {
    if (!this.get("id")) {

    }

    return this.get("id");
  }

  setId(id)
  {
    this.set("id", id);
  }

  inflate(data)
  {
    super.inflate(data);

    var me = this;
    if (data.metrics) {
      var deviceMetrics = {}, entityMetrics = {};

      _(data.metrics).forEach(function(metric,entityName) {
        if (_.has(metric, "name")) {
          deviceMetrics[entityName] = new MetricEntity(metric);
          deviceMetrics[entityName].set('deviceId', me.get('group') + ':' + me.get('name'));
          return false;
        }

        if (!_.has(deviceMetrics, entityName)) {
          deviceMetrics[entityName] = {};
        }

        _(metric).forEach(function(entityMetric,entityValue) {
          let entityMetrics = {};

          _(entityMetric).forEach(function(entityLevelMetric) {
            var metricEntity = new MetricEntity(entityLevelMetric);
            metricEntity.set('deviceId', me.get('group') + ':' + me.get('name'));
            metricEntity.set('entity', entityValue);
            metricEntity.set('entityType', entityName);
            entityMetrics[entityLevelMetric.name] = metricEntity;
          });

          deviceMetrics[entityName][entityValue] = entityMetrics;
        });
      });

      this.set("metrics", deviceMetrics);
    }
  }

  export()
  {
    var exportData = super.export();
    var deviceMetrics = {}, entityMetrics = {};

    _(exportData.metrics).forEach(function(metric,entityName) {
      if (metric instanceof MetricEntity) {
        deviceMetrics[metric.getName()] = metric.export();
        return;
      }

      if (!_.has(deviceMetrics, entityName)) {
        deviceMetrics[entityName] = {};
      }

      _(metric).forEach(function(entityMetric, entityValue) {
        let entityMetrics = {};

        _(entityMetric).forEach(function(entityLevelMetric) {
          entityMetrics[entityLevelMetric.getName()] = entityLevelMetric.export();
        });

        deviceMetrics[entityName][entityValue] = entityMetrics;
      });
    });

    exportData.metrics = deviceMetrics;

    return exportData;
  }
}

module.exports = PerformanceEntity;
