app.factory('socket', function () {

  "use strict";

  console.log('Connecting to: http://localhost:5000');
  return io.connect('http://localhost:5000');
});