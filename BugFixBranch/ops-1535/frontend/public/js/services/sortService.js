
var sortService = angular.module('SortService', []);

sortService.factory('SortService', [function () {

  var _defineProperty = function(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var generateOrder = function(orderBy, orderASC) {
    var orderAPI = {};
    orderAPI['order'] = {};

    _.forEach(orderBy, function(order){
      if(typeof orderBy !== "object") {
        orderAPI['order'][order] = (orderASC) ? 'asc' : 'desc';
      }
      else {
        if(typeof order.field !== 'undefined') {
          orderAPI['order'][order.field] = {};
          orderAPI['order'][order.field] = order;
        }
        else {
          _.extend(orderAPI['order'],order);
        }
      }
    });

    return orderAPI;
  };

  return {
    options: {
      orderBy: '',
      orderASC: true,
      orderAPI: {'order': {}},
      conditions: '',
      oldconditions: ''
    },
    items: {},

    sort : function(fields) {
      var order = [];

      //We always want to deal with an array
      if(!_.isArray(fields)) fields = [fields];

      //We could be sorting on a single value or an object array
      if (fields[0] === this.options.orderBy[0] || (typeof fields[0] === "object" && Object.keys(fields[0])[0] === Object.keys(this.options.orderBy[0])[0])) {
        this.options.orderASC = !this.options.orderASC;
      } else {
        this.options.orderASC = true;
      }

      var that = this;
      _.each(fields, function(field) {
        if(typeof field !== "object") {
          order.push({"field": field, "modifier": "lowercase", "order": ((that.options.orderASC) ? 'asc' : 'desc')});
        }
        else {
          _.each(field, function(orderBy, name) {
            if ((that.options.orderASC && orderBy == 'asc') || (!that.options.orderASC && orderBy == 'desc')) {
              orderBy = 'asc';
            } else {
              orderBy = 'desc';
            }

            order.push(_defineProperty({}, name, orderBy));
          });
        }
      });

      this.options.orderBy = fields;

      //Now let's generate the API ordering
      this.options.orderAPI = generateOrder(order, this.options.orderASC);

      //Get sorted data
      this.get({storage: "db"}, true).then(function() {
        console.log('Retrieved sorted data from API');
      });
    }
  };
}]);
