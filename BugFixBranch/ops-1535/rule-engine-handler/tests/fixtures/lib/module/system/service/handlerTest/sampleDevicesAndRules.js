
"use strict"

var appRoot            = require('app-root-path');
var r                  = require(appRoot + '/lib/db/rethinkdb');
var RethinkDbException = require(appRoot + '/lib/db/exception');

module.exports = function() {

  var devices = [
    {
      id: '39257813-f84a-4f0b-b13d-d00cfbcb25b2',
      name: "Generic",
      location: "Bluechip",
      displayName: "Generic Bluechip Machine",
    },
    {
      id: '70c4c193-2a4b-4972-b508-94b2b7c65958',
      name: "Server1",
      location: "Bluechip:Itheon:Bedford:Franklin_Court",
      displayName: "some-dev-server-1",
      platform: "windows"
    },
    {
      id: '64b353f1-55f3-4017-aa4d-166dd17e2dec',
      name: "Server2",
      location: "Bluechip:Itheon:Bedford:Franklin_Court",
      displayName: "some-dev-server-2",
      platform: "windows"
    }
  ];

  return r.table("Device").delete().run()
    .then(function() {
        return r.table("Device").insert(devices).run();
    }).then(function() {
      var rules = [
        {
          "id": '86d01b9d-c0ae-4bab-8125-4e7edf1816cb',
          "name": "global_cpu_or_memory_load",
          "deviceId": '39257813-f84a-4f0b-b13d-d00cfbcb25b2',
          "definition": {
            "$or": [
              {
                "cpuBusy": {
                  "$gte": "cpuMax"
                }
              },
              {
                "physicalMemoryUsed": {
                  "$gte": "memoryMax"
                }
              }
            ]
          },
          "subscribers": [
            "itheon7.1_event"
          ],
          "eventDetails": {
            "severity1": {
              "briefText": "oh no it's dead!",
              "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            },
            "default": {
              "briefText": "This box is beginning to die",
              "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            }
          },
          "thresholds": {
            "severity1": {
              "cpuMax": "95",
              "memoryMax": "95"
            },
            "severity2" : {
              "cpuMax": "85",
              "memoryMax": "85"
            }
          },
          "handleWhen": {
            "dependencies": ["cpuBusy", "physicalMemoryUsed"]
          }
        },
        {
          "id": '159cdd88-bade-40f0-9ba9-c8f151b23c1d',
          "name": "cpu_or_memory_load",
          "deviceId": '70c4c193-2a4b-4972-b508-94b2b7c65958',
          "definition": {
            "$or": [
              {
                "cpuBusy": {
                  "$gte": "cpuMax"
                }
              },
              {
                "physicalMemoryUsed": {
                  "$gte": "memoryMax"
                }
              }
            ]
          },
          "subscribers": [
            "itheon7.1_event"
          ],
          "eventDetails": {
            "severity1": {
              "briefText": "oh no it's dead!",
              "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            },
            "default": {
              "briefText": "This box is beginning to die",
              "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            }
          },
          "thresholds": {
            "severity1": {
              "cpuMax": "95",
              "memoryMax": "95"
            },
            "severity2" : {
              "cpuMax": "85",
              "memoryMax": "85"
            }
          },
          "handleWhen": {
            "dependencies": ["cpuBusy", "physicalMemoryUsed"]
          }
        },
        {
          "id": '34a61e1e-0032-4d12-bbd3-223b507ae98d',
          "name": "cpu_memory_or_disk_load",
          "deviceId": '64b353f1-55f3-4017-aa4d-166dd17e2dec',
          "definition": {
            "disks.*.diskName": {
              "$ne": "e"
            },
            "$or": [
              {
                "cpuBusy": {
                  $gte : "cpuMax"
                }
              },
              {
                physicalMemoryUsed: {
                  $gte: "memoryMax"
                }
              },
              {
                "disks.*.diskFree": {
                  "$gt": "diskMax"
                }
              }
            ]
          },
          "subscribers": [
            "itheon7.1_event"
          ],
          "eventDetails": {
            "severity1": {
              "briefText": "oh no it's dead!",
              "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            },
            "default": {
              "briefText": "This box is beginning to die",
              "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
            }
          },
          "thresholds": {
            "severity1": {
              "cpuMax": "95",
              "memoryMax": "95",
              "diskMax": "90"
            },
            "severity2": {
              "cpuMax": "85",
              "memoryMax": "85",
              "diskMax": "80"
            }
          },
          "handleWhen": {
            "dependencies": ["cpuBusy", "physicalMemoryUsed", "disks.*"],
            "exclude": ["disk.e"]
          }
        }
      ];

      return r.table("Rule").insert(rules).run();
    });
}