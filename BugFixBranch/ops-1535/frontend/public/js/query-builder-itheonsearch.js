/*
 * jQuery QueryBuilder Elasticsearch 'bool' query support
 * https://github.com/mistic100/jQuery-QueryBuilder
 * https://www.elastic.co/
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
 */

// Register plugin
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'query-builder'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
"use strict";

var QueryBuilder = $.fn.queryBuilder;
var Utils = QueryBuilder.utils = {};

/**
 * Change type of a value to int or float
 * @param value {mixed}
 * @param type {string} 'integer', 'double' or anything else
 * @param boolAsInt {boolean} return 0 or 1 for booleans
 * @return {mixed}
 */
Utils.changeType = function(value, type, boolAsInt) {
    switch (type) {
        case 'integer': return parseInt(value);
        case 'double': return parseFloat(value);
        case 'boolean':
            var bool = value.trim().toLowerCase() === 'true' || value.trim() === '1' || value === 1;
            return boolAsInt ? (bool ? 1 : 0) : bool;
        default: return value;
    }
};

/**
 * Throw an Error object with custom name
 * @param type {string}
 * @param message {string}
 * @param args,... {mixed}
 */
Utils.error = function(type, message/*, args*/) {
    var err = new Error(Utils.fmt.apply(null, Array.prototype.slice.call(arguments, 1)));
    err.name = type + 'Error';
    err.args = Array.prototype.slice.call(arguments, 2);
    throw err;
};

/**
 * Replaces {0}, {1}, ... in a string
 * @param str {string}
 * @param args,... {mixed}
 * @return {string}
 */
Utils.fmt = function(str/*, args*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    return str.replace(/{([0-9]+)}/g, function(m, i) {
        return args[parseInt(i)];
    });
};


// DEFAULT CONFIG
// ===============================
QueryBuilder.defaults({
  itheonOperators: {
      equal:            function(v) { return v[0]; },
      not_equal:        function(v) { return { 'ne': v[0] }; },
      in:               function(v) { return { 'in': v }; },
      not_in:           function(v) { return { 'nin': v }; },
      less:             function(v) { return { 'lt': v[0] }; },
      less_or_equal:    function(v) { return { 'lte': v[0] }; },
      greater:          function(v) { return { 'gt': v[0] }; },
      greater_or_equal: function(v) { return { 'gte': v[0] }; },
      contains:         function(v) { return { 'regex': '(?im)' + v[0] }; },
  },

  itheonRuleOperators: {
      eq:  function(v) { return { 'val': v, 'op': 'equal' }; },
      ne:  function(v) { return { 'val': v.ne, 'op': 'not_equal' }; },
      contains:  function(v) { return { 'val': v.regex.replace('(?im)', ''), 'op': 'contains' }; },
      in:  function(v) { return { 'val': v.in, 'op': 'in' }; },
      nin: function(v) { return { 'val': v.nin, 'op': 'not_in' }; },
      lt:  function(v) { return { 'val': v.lt, 'op': 'less' }; },
      lte: function(v) { return { 'val': v.lte, 'op': 'less_or_equal' }; },
      gt:  function(v) { return { 'val': v.gt, 'op': 'greater' }; },
      gte: function(v) { return { 'val': v.gte, 'op': 'greater_or_equal' }; }
  }
});


// PUBLIC METHODS
// ===============================
QueryBuilder.extend({
    /**
     * Get rules as Itheon query
     * @throws Undefined ItheonConditionError, Undefined ItheonOperatorError
     * @param data {object} (optional) rules
     * @return {object}
     */
    getItheon: function(data) {
        data = (data === undefined) ? this.getRules() : data;

        var self = this;

        return (function parse(data) {
            if (!data.condition) {
                data.condition = self.settings.default_condition;
            }
            if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                Utils.error('UndefinedItheonCondition', 'Unable to build ItheonDB query with condition "{0}"', data.condition);
            }

            if (!data.rules) {
                return {};
            }

            var parts = [];

            data.rules.forEach(function(rule) {
                if (rule.rules && rule.rules.length > 0) {
                    parts.push(parse(rule));
                }
                else {
                    var mdb = self.settings.itheonOperators[rule.operator];
                    var ope = self.getOperatorByType(rule.operator);
                    var values = [];

                    if (mdb === undefined) {
                        Utils.error('UndefinedIheonOperator', 'Unknown Itheon operation for operator "{0}"', rule.operator);
                    }

                    if (ope.nb_inputs !== 0) {
                        if (!(rule.value instanceof Array)) {
                            rule.value = [rule.value];
                        }

                        rule.value.forEach(function(v) {
                            values.push(Utils.changeType(v, rule.type, false));
                        });
                    }

                    var part = {};
                    part[rule.field] = mdb.call(self, values);
                    parts.push(part);
                }
            });

            var res = {};
            if (parts.length > 1) {
                res[data.condition.toLowerCase()] = parts;
            }
            else {
              res = parts[0];
            }
            return res;
        }(data));
    },

  /**
   * Convert Itheon object to rules
   * @throws ItheonParseError, UndefinedItheonConditionError, UndefinedItheonOperatorError
   * @param data {object} query object
   * @return {object}
   */
  getRulesFromItheon: function(data) {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    var self = this;
    var conditions = {
      'and': 'AND',
      'or': 'OR'
    };

    return (function parse(data) {
      var topKeys = Object.keys(data);

      if (topKeys.length > 1) {
        Utils.error('ItheonParse', 'Invalid ItheonDB query format');
      }

      //If we just have 1 condition it needs to be wrapped in an and
      if (!conditions[topKeys[0].toLowerCase()] && Object.keys(data[topKeys]).length == 1) {
        topKeys[0] = 'and';
        var tmp = data;
        data = [];
        data['and'] = [];
        data['and'].push(tmp);
      }
      if (!conditions[topKeys[0].toLowerCase()]) {
        Utils.error('UndefinedItheonCondition', 'Unable to build ItheonDB query with condition "{0}"', topKeys[0]);
      }

      var rules = data[topKeys[0]];
      var parts = [];

      rules.forEach(function(rule) {
        var keys = Object.keys(rule);

        if (conditions[keys[0].toLowerCase()]) {
          parts.push(parse(rule));
        } else {
          var field = keys[0];
          var value = rule[field];

          var operator = determineItheonOperator(value, field);
          if (operator === undefined) {
            Utils.error('ItheonParse', 'Invalid Itheon query format');
          }

          var mdbrl = self.settings.itheonRuleOperators[operator];
          if (mdbrl === undefined) {
            Utils.error('UndefinedItheonOperator', 'JSON Rule operation unknown for operator "{0}"', operator);
          }

          var opVal = mdbrl.call(self, value);
          parts.push({
            id: field,
            field: field,
            operator: opVal.op,
            value: opVal.val
          });
        }
      });

      var res = {};
      if (parts.length > 1) {
        res.condition = conditions[topKeys[0].toLowerCase()];
        res.rules = parts;
      }
      else if (parts.length == 1) {
        res.condition = conditions['and'];
        res.rules = parts;
      }
      return res;
    }(data));
  },

  /**
   * Set rules from Itheon object
   * @param data {object}
   */
  setRulesFromItheon: function(data) {
    this.setRules(this.getRulesFromItheon(data));
  }
});

/**
 * Find which operator is used in a Itheon sub-object
 * @param {mixed} value
 * @param {string} field
 * @return {string|undefined}
 */
function determineItheonOperator(value, field) {
  if (value !== null && typeof value == 'object') {
    var subkeys = Object.keys(value);

    if (subkeys.length === 1) {
      if (subkeys[0] === 'regex') {
        return 'contains';
      }

      return subkeys[0];
    }
  } else {
    return 'eq';
  }
}
}));
