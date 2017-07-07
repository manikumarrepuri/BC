
"use strict"

var appRoot = require('app-root-path');
var net     = require('net');
var net     = require('net');

var port = 3000;

var server = net.createServer(function(c) { //'connection' listener

  console.log('Info: Client connected');

  c.on('end', function() {
    console.log('Info: Client disconnected');
  });

  c.on('data', function(data) {
    console.log('Info: Data received: ' + data);
    c.write('"ok"');
    // c.pipe(c);
  });
});

server.listen(port, function() { //'listening' listener
  console.log('Info: Receiver EDA Mock started on port ' + port);
});
