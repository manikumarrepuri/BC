
"use strict"

var appRoot = require('app-root-path');
var net     = require('net');
var client  = new net.Socket();

var host = '127.0.0.1';
var port = 2919;

var counter = -1;

var messages = [

  "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#" +
  "ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#" +
  "70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#" +
  "0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#" +
  "0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##",

  "9#1#ITHW64SQL32#29-JUN-2015#00:01:11#Performance Data#ServiceLevelAgreement#2015-06-29 00:01:11.000#" +
  "00:01#ITHW64SQL32#305#Page File Space#Page files percent used#ITHW64SQL32#0.00#0.00#100.00#0.00#0.00##",

  "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#Disks#2015-06-29 00:01:05.000#00:01#ITHW64SQL32#" +
  "C##40857#27.87#72.13#0.90#4100.93#4578.14#1.06#0.00#0.00#0.10#0##"

];

function sendMessage()
{
  counter++;
  var message = messages[counter % 3];
  console.log('Sending message: ' + message);
  client.write(message);
  setTimeout(sendMessage, 20000);
}

client.connect(port, host, function() {
  console.log('Info: Eda Mock connected to ' + host + ':' + port);
  sendMessage();
});

client.on('data', function(data) {
  console.log('Info: Data received: ' + data);
});

client.on('close', function() {
  console.log('Info: Connection closed');
});
