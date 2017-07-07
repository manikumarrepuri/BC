var searchService = angular.module('SearchService', []);

searchService.factory('SearchService', ['$filter', function ($filter) {

  "use strict";

  var _defineProperty = function(obj, key, value) {
    if (key in obj) {
       Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
     } else {
       obj[key] = value;
     }
     return obj;
   };

  return {
    options: {
      orderBy: '',
      orderASC: true,
      orderAPI: {'order': {}},
      query: '',
      oldQuery: '',
      conditions: {},
      oldConditions: {}
    },
    searchFields: {},
    items: {},

    search : function(parameters) {
      var that = this;

      this.getFields().then(function(schema){
        if(parameters.query && _.isEmpty(parameters.query)) {
          that.options.conditions = '';
        }
        else if(parameters.query) {
          that.options.conditions = that.buildConditions(parameters.query, schema);
        }
        else {
          that.options.conditions = parameters.conditions;
        }

        //Get sorted data
        that.get({"storage": "db"}, true).then(function() {
          console.log('Retrieved searched data from API');
        });
      });
    },

    doesItemMatchSearch: function(item) {
      //If there is no search allow all
      if(!this.options.conditions) {
        return true;
      }

      return this.matchConditions(this.options.conditions, item)
             .indexOf(false) === -1;
    },

    matchConditions: function(conditions, item, level) {
      var that = this, results = [];

      _(conditions).forEach(function(required, fieldName){
        //Handle the fact we could have nested and/or blocks
        if (["or", "and"].indexOf(fieldName) > -1) {
          level++;
          let subResults = [];
          _(required).forEach(function(subCondition) {
            let tempResults = that.matchConditions(subCondition, item, level);
            _(tempResults).forEach(function(result){
              subResults.push(result);
            });
          });

          if (fieldName === "$and") {
            results.push(subResults.indexOf(false) > -1 ? false : true);
          } else {
            results.push(subResults.indexOf(true) > -1 ? true : false);
          }

          return false;
        }

        //Check that the item has the field we wish to check
        if(!item[fieldName]) {
          return false;
        }

        let actual = item[fieldName];
        let operator = "eq";
        /*****************
         * We might have an object
         *  fieldName: {
         *    operator: requiredValue
         *  }
         ***********/
        if(typeof required == "object") {
          operator = Object.keys(required)[0];
          required = required[operator];
        }

        results.push(that.parseCondition(
          operator,
          required,
          actual
        ));
      });

      return results;
    },

    parseCondition: function(operator, requiredValue, actualValue) {
      switch (operator) {
        case "gt":
          return actualValue > requiredValue;
        case "gte":
          return actualValue >= requiredValue;
        case "lt":
          return actualValue < requiredValue;
        case "lte":
          return actualValue <= requiredValue;
        case "ne":
          return actualValue != requiredValue;
        case "contains":
          return actualValue.indexOf(requiredValue) > -1;
        case "begins":
          return actualValue.indexOf(requiredValue) === 0;
        case "ends":
          return actualValue.indexOf(requiredValue, actualValue.length - requiredValue.length) !== -1;
        case "regex":
          requiredValue = requiredValue.replace('(?im)', '');
          var pattern = new RegExp(requiredValue,'im');
          return pattern.test(actualValue);
        case "in":
          if (!_.isArray(requiredValue)) {
            return false;
          }
          return requiredValue.indexOf(actualValue) > -1;
        case "nin":
          if (!_.isArray(requiredValue)) {
            return false;
          }
          return requiredValue.indexOf(actualValue) === -1;
        default:
          return actualValue == requiredValue;
      }
    },

    buildConditions: function(query, schema) {
      var conditions = {};

      //Check if we are searching on a given field/fields only
      if (query.indexOf(':') !== -1) {
        //Split on comma's outside of character classes remove blank array elements
        var querySplit = query.split(/(?!,(\W*)?[\]}]),/g).filter(Boolean);
        for (var i = 0; i < querySplit.length; i++) {
          var search = querySplit[i].split(':');
          var field = search[0];
          var searchTerm = search[1];

          //Special case for tags since these can use : again
          if(field == "tags") {
            searchTerm = search.slice(1).join(':');
          }

          //Make sure that we have key/value pairs otherwise skip this search
          if (_.isArray(searchTerm)) continue;

          //Remove the spaces after the , and :
          field = field.trimLeft();
          searchTerm = searchTerm.trimLeft();

          //If the search is blank skip it;
          if(searchTerm == "") {
            continue;
          }

          //Make sure that the field is valid otherwise we'll just ignore it
          if (_.indexOf(this.searchFields, $filter('camelize')(field)) !== -1) {
            //Make sure the regex is valid
            try {
              new RegExp(searchTerm, "im");
            } catch (e) {
              //ignore this search if not valid
              continue;
            }

            conditions[field] = {};
            conditions[field].regex = '(?im)' + searchTerm;
          }
        }
      }

      //Generate fuzzy search if no specific search found
      if (_.isEmpty(conditions)) {
        var allConditions = [];

        //Make sure the regex is valid
        try {
          new RegExp(query, "im");
        } catch (e) {
          return false;
        }

        for (var i = 0; i < this.searchFields.length; i++) {
          switch(schema[this.searchFields[i]].type) {
            case 'string':
            case 'array':
              allConditions.push(_defineProperty({}, this.searchFields[i], {
                "regex": '(?im)' + query
              }));
              break;
            case 'number':
            case 'integer':
              if(!isNaN(parseFloat(query)) && isFinite(query)) {
                allConditions.push(_defineProperty({}, this.searchFields[i], parseFloat(query)));
              }
              break;
            case 'boolean':
              if(query == "false" || query == "true") {
                allConditions.push(_defineProperty({}, this.searchFields[i], Boolean(query)));
              }
              break;
          }
        }

        conditions = {
          "or": allConditions
        };
      }

      return conditions;
    }
  };
}]);
