var deviceService = angular.module('DeviceService', ['underscoreService']);

deviceService.factory('DeviceService', ['$http', '$timeout', '$q', '_', '$location', function($http, $timeout, $q, _, $location) {

  "use strict";

  var DeviceService = angular.extend({});
  //var host = "http://localhost:9443";

  var port= ":9443";
  var path = '/devices';
  var devicesApiUrl = $location.protocol() + "://" + $location.host() + port + path;
  
  DeviceService.documents=[];
  DeviceService.schema = {};
  DeviceService.loaded = false;
  DeviceService.globalDevice = {};
  DeviceService.totals={
    active: 0,
    total: 0,
    totalUp: 0,
    totalDown: 0
  };
  DeviceService.items = [];
  DeviceService.all = [];
  DeviceService.options={
    orderBy: 'alerts',
    orderASC: false,
    orderAPI: {
      "order":
      {
        "alerts": {
          "field": "alerts",
          "modifier": "count",
          "order": "desc"
        },
        "group": "asc",
        "name": "asc"
      }
    },
    conditions: {},
    oldConditions: {},
    query: '',
    oldQuery: ''
  };
  // DeviceService.searchFields=[
  //   "group",
  //   "displayName",
  //   "name",
  //   "platform",
  //   "tags"
  // ];
  // DeviceService.searchExamples=[
  //   "itheon|bluechip",
  //   "dev|test",
  //   "dev|test",
  //   "ibm|linux",
  //   "customer:Bluechip"
  // ];

  // call to get a device
  DeviceService.get = function(params, cache) {
    //Add ordering
    _.extend(params,DeviceService.options.orderAPI);

    if(!_.isEmpty(DeviceService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(DeviceService.options.conditions)
      });
    }

    //We don't want to get the Global Device
    if(typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'id': {
            'ne': 'Bluechip:Generic'
          },
          // 1 : fetch all the devices data for the devices UI
          'whatToFetch':1
        }
      });
    }
    else {
      _.extend(params.conditions, {
        'id': {
          'ne': 'Bluechip:Generic'
        },
          // 1 : fetch all the devices data for the devices UI
          'whatToFetch':1
      });
    }

    params.joins = ["tags"];
    params.fields = params.fields ? params.fields.push("t.name") : [];

  var includeRules = true;
// Set status 1 as per query
      _.extend(params.conditions, {        
          'status': 1            
      })

     // Check if we just want specific fields
    if (params.fields.length ==0 ) {
    _.extend(params, {
      'fields': ['d.*','r.*', 't.*']
    })  
    } else {
      // Check if any of those fields are from the devices table
      includeRules = _.findIndex(fields, function(value) {
        if(value.indexOf('r.') === 0) {
          return true;
        }
      });
    }

     if (includeRules !== -1) {
      params.joins = ["rules", "tags"];
    }      

      _.extend(params.conditions, {
          'includeRules': includeRules 
             })

    var result;
  
    return $http.get(
    devicesApiUrl + '?' + $.param(params)).then(function(response) {
           result = response.data;
    
   // if (cache) {
      // storing data
     // return result.then(function(response) {
       // DeviceService.totals.total = response.data[0].length;//response.headers('X-Total-Count');
        DeviceService.totals.total = response.data.devices.length;
         angular.copy(result.devices, DeviceService.items);
         DeviceService.totals.active = _.size(DeviceService.items);
         DeviceService.checkStatus('items');
      //   //Added below line of code for the global devices
         DeviceService.globalDevice = response.data.globalDevices;
      // //}).then(function(){
          DeviceService.getCounts();
         DeviceService.globalDevice = result.globalDevices;
         return result;
      });
   // }
    //Mar-2017 Mani Below line of code is added for the global devices.
    //DeviceService.globalDevice = result.globalDevices;
    //return result;  //});
  
  } ; //get ends

  // call to get a device
  //Mar-2017 Mani This function is not required as we would be getting the global devices in the first instance rather than calling backend again
  DeviceService.getGlobalDevice = function(params) {

    //We only want to get the Global Device
    if(typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'id': 'Bluechip:Generic'
        }
      });
    }
    else {
      _.extend(params.conditions, {
        'id': 'Bluechip:Generic'
      });
    }

    return $http.get(
      devicesApiUrl + '?' + $.param(params)).then(function(response) {
      DeviceService.globalDevice = response.data.globalDevices;
    });
  };  //getGlobalDevice ends

  DeviceService.getMore = function(params) {
    //Add ordering
    _.extend(params,DeviceService.options.orderAPI);

    if(!_.isEmpty(DeviceService.options.conditions)) {
      _.extend(params, {
        'conditions': _.clone(DeviceService.options.conditions)
      });
    }

    //We don't want to get the Global Device
    if(typeof params.conditions == "undefined") {
      _.extend(params, {
        'conditions': {
          'id': {
            'ne': 'Bluechip:Generic'},
          // 1 : fetch all the devices data for the devices UI
          'whatToFetch':1
          }
        });
    }
    else {
      _.extend(params.conditions, {
        'id': {
          'ne': 'Bluechip:Generic',
          // 1 : fetch all the devices data for the devices UI
          'whatToFetch':1
        }
      });
    }

    $http.get(
      devicesApiUrl + '?' + $.param(params)).then(function(response) {
        var result1 = response.data;
      

    // formatting data
      _.forEach(response.data.devices, function(item) {
        DeviceService.items.push(item);
      });
      DeviceService.totals.active += response.data.length;
      DeviceService.checkStatus('items');
    });
  }; //getMore

  DeviceService.getCounts = function() {
    var params = {
      storage: "db",
      fields: [
        'id',
        'updatedAt'
      ],
      conditions: {
        "id": {'ne': 'Bluechip:Generic'},
        "whatToFetch":1
      },
      limit: 100000
    };

    if(!_.isEmpty(DeviceService.options.conditions)) {
      params =  _.extend(params.conditions, {
        'conditions': _.clone(DeviceService.options.conditions)
      });
    }

    $http.get(
      devicesApiUrl + '?' + $.param(params)).then(function(response) {
            // formatting data
      angular.copy(response.data.devices, DeviceService.all);
      DeviceService.checkStatus('all');
    });
  };

  DeviceService.checkStatus = function(subset) {
    var currentDate = new Date(new Date().getTime());
    var totalUp=0;

    _(DeviceService[subset]).forEach(function(device, key) {
      if (device) {
        var status = "???";
        var diff = Math.round((currentDate-(new Date(device.updatedAt))) / 1000);

        //Hardcoded to 10 minutes
        if (diff < 600) {
          status = "UP";
          totalUp++;
        }

        DeviceService[subset][key].status = status;
        DeviceService[subset][key].info = device.platform+status;
      }
    });

    if(subset == 'items') {
      DeviceService.totals.totalUp = totalUp;
      DeviceService.totals.totalDown = DeviceService.totals.total-totalUp;
    }
  };

  DeviceService.getSingle = function(params) {
    params = params || {};

   return $http.get(
      devicesApiUrl + (params ? '?' + $.param(params) : '')
    ).then(function(response) {
      var currentDate = new Date(new Date().getTime());

      //If the unthinkable happen's and no device is returned send a blank one
      if(!_.isObject(response.data)) {
        return [{
          "group": "Unknown",
          "device": "Unknown",
          "displayName": "Unknown",
          "createdAt": currentDate,
          "status": "???",
          "platform": "question"
        }];
      }

      var result = response.data;

      _(result).forEach(function(device,key) {
        result[key].status = "???";
        var diff = Math.round((currentDate-(new Date(device.updatedAt))) / 1000);

        //Hardcoded to 10 minutes
        if(diff < 600) {
          result[key].status = "UP";
        }
      });

      return result;
    }); 
  };

  DeviceService.getById = function(id, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'id': id
      }
    });

    return this.getSingle(query)
      .then(function(devices) {
        if (!_.isObject(devices)) {
          return null;
        }

        return devices;
      });
  };

  DeviceService.getByName = function(name, group, params) {
    params = params || {};

    var query = _.extend(params, {
      'conditions': {
        'name': name,
        'group': group,
        // 1 : fetch all the devices data for the devices UI
        'whatToFetch':2
      }
    });

    return this.getSingle(query)
      .then(function(devices) {
        if (!_.isObject(devices)) {
          return null;
        }

        return devices;
      });
  };

  DeviceService.save = function(device) {
    if (device.id) {
      return this.update(device.id, device);
    }

    return this.create(device);
  };

  // call to POST and create a new device
  DeviceService.create = function(device) {
    return $http.post(devicesApiUrl, device)
      .then(function(result) {
        DeviceService.updateDevices(result.data, "add");
        return result.data;
      });
  };

  DeviceService.update = function(id, device) {
    return $http.patch(devicesApiUrl + '/' + id, device)
      .then(function(result) {
        // Deleted are handled elsewhere
        if (result.data.status != -1) {
          DeviceService.updateDevices(result.data);
        }
        return result.data;
      });
  };

  // Delete a device
  DeviceService.deleteDevice = function(device, $element) {
    return this.update(device.id, {status: -1}).then(function(result) {
      DeviceService.updateDevices(result, "delete");
      $element.find('aside').removeClass("module-sidebar-open");
      return result;
    });
  };

  //Update user object array
  DeviceService.updateDevices = function(newDevice, action) {
    if (typeof action == "undefined") {
      action = 'update';
    }

    if (action == "add") {
      //If it doesn't match the current search end here
      if(!DeviceService.doesItemMatchSearch(newDevice)) {
        return;
      }

      if (_.indexOf(DeviceService.types, newDevice.type) == -1) {
        DeviceService.types.push(newDevice.type);
      }

      DeviceService.items.push(newDevice);
      DeviceService.totals.total++;
    } else if (action == "delete") {
      var deviceIndex = _.findIndex(DeviceService.items, function(device) {return device.id == newDevice.id;});
      var allIndex = _.findIndex(DeviceService.all, function(device) {return device.id == newDevice.id;});
      DeviceService.items.splice(deviceIndex, 1);
      DeviceService.all.splice(allIndex, 1);
      DeviceService.totals.total--;
    } else {
      var index = _.findIndex(DeviceService.items, function(device) {return device.id == newDevice.id;});
      DeviceService.items[index] = newDevice;
    }

    DeviceService.checkStatus('all');
    DeviceService.totals.active = DeviceService.items.length;
  };

  // filters devices
  DeviceService.filterByStatus = function(status) {
    var me = this;
    var filtered = {};

    this.filtered = _.clone(this.allShallow);
    this.checkStatus();

    if(status) {
      _.forEach(this.filtered, function(device, key) {
        if (device.status.toLowerCase() == status) {
          filtered[key] = device;
        }
      });

      this.filtered = _.clone(filtered);
    }

    //Update the list so that angular ng-repeat will re-fire
    this.items.values = _.values(this.filtered);

    return this.filtered;
  };

  DeviceService.updateThreshold = function(fields) {
    var isSuccess = false;

    return $http.put('/api/rules/thresholds', fields).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return false;
    });
  };

  DeviceService.getFields = function(force) {
    if(!force && !_.isEmpty(this.schema)) {
      return $q(function(resolve, reject) {
        resolve(DeviceService.schema);
      }, 0);
    }

    return $http.get(devicesApiUrl + '/schema')
      .then(function(result) {
        DeviceService.schema = result.data[Object.keys(result.data)[0]];
        return DeviceService.schema;
      });
  };

  return DeviceService;
}]);  
