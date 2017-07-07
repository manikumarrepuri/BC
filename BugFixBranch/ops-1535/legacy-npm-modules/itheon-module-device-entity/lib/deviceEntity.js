
"use strict";

var BaseEntity        = require("itheon-entity").BaseEntity;
var _                 = require("itheon-utility").underscore;
var RuleEntity        = require("itheon-module-rule-entity").RuleEntity;
var DeviceAlertEntity = require("./deviceAlertEntity");
var MetricEntity      = require("itheon-module-metric-entity").MetricEntity;

class DeviceEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'string'},
      alertsCount: {"type": 'integer'},
      name: {"type": 'string'},
      group: {"type": 'string'},
      displayName: {"type": 'string'},
      details: {"type": 'object'},
      platform: {"type": 'string'},
      metrics: {"type": 'object'},
      rules: {"type": 'object'},
      alerts: {"type": 'object'},
      mergedRules: {"type": 'object'},
      alertsCounter: {"type": 'integer'},
      cpuBusy: {"type": 'number'},
      physicalMemoryUsed: {"type": 'number'},
      status: {"type": 'number'},
      storage: {"type": 'number'},
      tags: {"type": 'array'},
      createdAt: {"type": 'date'},
      updatedAt: {"type": 'date'}
    });

    if (data) {
      this.inflate(data);
    }
  }

  getId()
  {
    return this.id;
  }

  setId(id)
  {
    return id;
  }
  getName()
  {
    return this.get("name");
  }

  getMetrics()
  {
    return this.get("metrics");
  }

  inflate(data)
  {
    super.inflate(data);

    if (data.rules && _.isObject(data.rules) && !_.isEmpty(data.rules)) {
      var rules = {};

      _(data.rules).forEach(function(rule, ruleName) {
        let ruleEntity = new RuleEntity(rule);
        rules[rule.name] = ruleEntity;
      });

      this.set("rules", rules);

      if (data.mergedRules && _.isObject(data.mergedRules) && !_.isEmpty(data.mergedRules)) {
        this.set("mergedRules", rules);
      }
    }

    if (data.alerts && _.isObject(data.alerts) && !_.isEmpty(data.alerts)) {
      var alerts = {};

      _(data.alerts).forEach(function(alert, id) {
        let alertEntity = new DeviceAlertEntity(alert);
        alerts[alertEntity.get('id')] = alertEntity;
      });

      this.set("alerts", alerts);
    }

    if (data.metrics && _.isObject(data.metrics) && !_.isEmpty(data.metrics)) {
      var deviceMetrics = {}, entityMetrics = {};

      _(data.metrics).forEach(function(metric, entityName) {
        if (_.has(metric, "name")) {
          deviceMetrics[entityName] = new MetricEntity(metric);
          return false;
        }

        if (!_.has(deviceMetrics, entityName)) {
          deviceMetrics[entityName] = {};
        }

        _(metric).forEach(function(entityMetric, entityValue) {
          let entityMetrics = {};

          _(entityMetric).forEach(function(entityMetricValue) {
            entityMetrics[entityMetricValue.name] = new MetricEntity(entityMetricValue);
          });

          deviceMetrics[entityName][entityValue] = entityMetrics;
        });
      });

      this.set("metrics", deviceMetrics);
    }
  }

  export()
  {
    var exportedData = super.export();

    if (exportedData.rules && _.isObject(exportedData.rules) && !_.isEmpty(exportedData.rules)) {
      var rules = {};

      _(exportedData.rules).forEach(function(rule, ruleName) {
        rules[ruleName] = rule.export();
      });

      exportedData.rules = rules;
    }

    if (exportedData.alerts && _.isObject(exportedData.alerts) && !_.isEmpty(exportedData.alerts)) {
      var alerts = {};

      _(exportedData.alerts).forEach(function(alert, id) {
        if (alert instanceof BaseEntity) {
          alerts[id] = alert.export();
        } else{
          alerts[id] = alert;
        }
      });

      exportedData.alerts = alerts;
    }

    // never export the merged rules
    if (exportedData.mergedRules) {
      delete exportedData.mergedRules;
    }

    if (exportedData.metrics && _.isObject(exportedData.metrics) && !_.isEmpty(exportedData.metrics)) {
      var deviceMetrics = {}, entityMetrics = {};

      _(exportedData.metrics).forEach(function(metric, entityName) {
        if (metric instanceof MetricEntity) {
          deviceMetrics[metric.getName()] = metric.export();
          return false;
        }

        if (!_.has(deviceMetrics, entityName)) {
          deviceMetrics[entityName] = {};
        }

        _(metric).forEach(function(entityMetric, entityValue) {
          _(entityMetric).forEach(function(entityLevelMetric) {
            entityMetrics[entityLevelMetric.getName()] = entityLevelMetric.export();
          });

          deviceMetrics[entityName][entityValue] = _.clone(entityMetrics,true);
        });
      });

      exportedData.metrics = deviceMetrics;
    }

    return exportedData;
  }
}

module.exports = DeviceEntity;
