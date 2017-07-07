
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Rule", {replicas: replicas}).then(function() {

  return r.table("Rule").indexCreate("deviceId").run();

}).then(function() {

  var rules = [
    {
      "id": "86d01b9d-c0ae-4bab-8125-4e7edf1816cb",
      "name": "global_cpu_or_memory_load",
      "deviceId": "Bluechip:Generic",
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
      "id": "159cdd88-bade-40f0-9ba9-c8f151b23c1d",
      "name": "cpu_or_memory_load",
      "deviceId": "Bluechip:Generic",
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
      "definition": {
        "AgentUpdater:briefText": {
          "$regex":  "AgentText"
        }
      } ,
      "deviceId":  "Bluechip:Generic" ,
      "enabled": true,
      "eventDetails": {
        "default": {
          "briefText":  "{AgentUpdater:briefText}",
          "fullText":  "{AgentUpdater:fullText}"
        }
      } ,
      "handleWhen": {
        "dependencies": [
          "AgentUpdater:briefText"
        ]
      },
      "id":  "50af595f-dd4b-4a4f-b92e-69099f54e13f",
      "name":  "agentUpdater",
      "subscribers": [
        {
          "name": "itheon10.xhttpSender" ,
          "settings": {
            "method": "PATCH",
            "payload": {
              "brief":  "{{brief}}" ,
              "deviceId":  "{{group}}:{{name}}"
            } ,
            "url":  "{{itheon10}}/agent-update/"
          }
        }
      ],
      "thresholds": {
        "severity1": {
          "AgentText":  "started|success|failed"
        }
      }
    },
    {
      "id": "34a61e1e-0032-4d12-bbd3-223b507ae98d",
      "name": "cpu_memory_or_disk_load",
      "deviceId": "Bluechip:Generic",
      "definition": {
        "disks.*.diskName": {
          "$ne": "e"
        },
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
        "exclude": ["disks.e"]
      }
    }
  ];

  return r.table("Rule").insert(rules).run();

});
