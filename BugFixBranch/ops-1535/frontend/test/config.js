var config = {
  "redis": {
    "masterOne": {
      "host": '10.187.75.205',
      "port": '6379'
    },
    "masterTwo": {
      "host": '10.187.75.206',
      "port": '6379'
    },
    "masterThree": {
      "host": '10.187.75.207',
      "port": '6379'
    }
  },
  "appliance": {
    "url": 'http://10.187.75.215',
    "deviceURL": 'http://10.187.75.215/devices',
    "username": 'admin',
    "password": 'admin1234'
  }
  
};

module.exports = config;