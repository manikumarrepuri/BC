"use strict";

var r = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Rule", {
  replicas: replicas
}).then(function() {

  return r.table("Rule").indexCreate("deviceId").run();

}).then(function() {

  var rules = [{
    "definition": {
      "AgentUpdater:briefText": {
        "$regex": "AgentText"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "{{AgentUpdater:briefText}}",
        "fullText": "{{AgentUpdater:fullText}}"
      }
    },
    "handleWhen": {
      "dependencies": [
        "AgentUpdater:briefText"
      ]
    },
    "name": "agentUpdater",
    "subscribers": [{
      "name": "itheon10.xhttpSender",
      "settings": {
        "method": "PATCH",
        "payload": {
          "brief": "{{brief}}",
          "deviceId": "{{group}}:{{name}}"
        },
        "url": "{{itheon10}}/agent-update/"
      }
    }],
    "thresholds": {
      "severity1": {
        "AgentText": "started|success|failed"
      }
    }
  },
  {
    "definition": {
      "{{metricGroup}}:class": {
        "$nin":  "classes"
      }
    } ,
    "deviceId":  "Bluechip:Generic" ,
    "enabled": true ,
    "eventDetails": {
      "default": {
        "briefText":  "" ,
        "fullText":  "{{originalEvent}}"
      }
    } ,
    "handleWhen": {
      "dependencies": [
        "{{metricGroup}}:class"
      ]
    } ,
    "name":  "Itheon 7 in Opserve" ,
    "subscribers": [
      {
        "itheon10.x7Event": {
          "name":  "itheon10.x7Event"
        }
      }
    ] ,
    "thresholds": {
      "severity1": {
        "classes": [
          "AgentUpdate" ,
          "EVENT_HEARTBEAT",
          "REMINDER"
        ]
      }
    }
  },
  {
    "definition": {
      "system:cpuBusy": {
        "$gte": "cpuMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "CPU usage percentage has been reported at {{system:cpuBusy}} %",
        "fullText": "CPU usage percentage has been reported at {{system:cpuBusy}}% - CPU usage breakdown is: DPC CPU: {{system:cpuDpc}}% Interrupt CPU: {{system:cpuInterrupt}}% Privileged CPU: {{system:cpuPrivileged}}% User CPU: {{system:cpuUser}}%"
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:cpuBusy"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - cpu-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "cpuMax": "90"
      }
    }
  }, {
    "definition": {
      "system:cpuQueueLength": {
        "$gte": "cpuQueueMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "The CPU queue length has been reported at {{system:cpuQueueLength}} threads.",
        "fullText": "The CPU queue length has been reported at {{system:cpuQueueLength}} threads. Current CPU utilization is {{system:cpuBusy}}%. Physical Memory percentage is at {{system:physicalMemoryUsed}}%. Page File usage is currently at {{[system:pageFiles%]}}%"
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:cpuQueueLength"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - cpu-queue",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "cpuQueueMax": "100"
      }
    }
  }, {
    "definition": {
      "system:physicalMemoryUsed": {
        "$gte": "memoryMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Physical Memory percentage has been reported at {{system:physicalMemoryUsed}}%",
        "fullText": "Physical Memory percentage has been reported at {{system:physicalMemoryUsed}}%. CPU usage is currently at {{system:cpuBusy}}%, Page File usage is currently at {{[system:pageFiles%]}}%. there are currently {{system:processCount}} processes running."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:physicalMemoryUsed"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - memory-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "memoryMax": "90"
      }
    }
  }, {
    "definition": {
      "system:pageFiles%": {
        "$gte": "pageMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Used Page File percentage has been reported at {{[system:pageFiles%]}}%",
        "fullText": "Used Page File percentage has been reported at {{[system:pageFiles%]}}%. CPU usage is currently at {{system:cpuBusy}}%, memory usage is currently at {{system:physicalMemoryUsed}}%, there are currently {{system:processCount}} processes running."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:pageFiles%"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - page-file",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "pageMax": "90"
      }
    }
  }, {
    "definition": {
      "disks.*.diskUsed": {
        "$gte": "diskMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Disk {{diskName}} is reporting a usage of {{diskUsed}}%",
        "fullText": "Disk {{diskName}} is reporting a usage of {{diskUsed}}%. The Disk size for {{diskName}} is {{diskSize}}MB."
      }
    },
    "handleWhen": {
      "dependencies": [
        "disks.*.diskUsed"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - disk-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity2": {
        "diskMax": "90"
      }
    }
  }, {
    "definition": {
      "disks.*.diskQueueLength": {
        "$gte": "diskQueueMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "The Disk queue length for {{diskName}} has been reported at {{diskQueueLength}} threads.",
        "fullText": "The disk queue length for {{diskName}} has been reported at {{diskQueueLength}} threads. Current Disk Utilisation is at {{diskUsed}}%. The Disk IO rate is reported at {{diskIo}}"
      }
    },
    "handleWhen": {
      "dependencies": [
        "disks.*.diskQueueLength"
      ],
      "tags": [
        "system:platform:windows"
      ]
    },
    "name": "Windows - disk-queue",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "diskQueueMax": "150"
      }
    }
  }, {
    "definition": {
      "system:cpuBusy": {
        "$gte": "cpuMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "CPU usage percentage has been reported at {{system:cpuBusy}}%",
        "fullText": "CPU usage percentage has been reported at\n{{system:cpuBusy}}% - CPU usage breakdown is:\nIdle CPU: {{system:cpuIdle}}\nNice CPU: {{system:cpuNice}}\nSystem CPU: {{system:cpuSystem}}\nUser CPU: {{system:cpuUser}}\nWaiting CPU: {{system:cpuWait}}"
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:cpuBusy"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - cpu-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "cpuMax": "95"
      }
    }
  }, {
    "definition": {
      "system:pageFiles%": {
        "$gte": "swapMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Physical Memory percentage has been reported at {{system:physicalMemoryUsed}}%",
        "fullText": "Physical Memory percentage has been reported at {{system:physicalMemoryUsed}}%. CPU usage is currently at {{system:cpuBusy}}%, Swap Space usage is currently at {{[system:pageFile%]}}%, there are currently {{system:processCount}} processes running."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:physicalMemoryUsed"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - memory-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "swapMax": "95"
      }
    }
  }, {
    "definition": {
      "system:processCount": {
        "$gte": "processMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "There are currently {{system:processCount}} processes running.",
        "fullText": "There are currently {{system:processCount}} processes running. CPU usage is currently at {{system:cpuBusy}}%, memory usage is currently at {{system:physicalMemoryUsed}}%, Swap Space usage is currently at {{[system:pageFiles%]}}"
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:processCount"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - process-count",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "processMax": "2500"
      }
    }
  }, {
    "definition": {
      "system:pageFiles%": {
        "$gte": "swapMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Used Swap Space percentage has been reported at {{[system:pageFiles%]}}%",
        "fullText": "Used Swap Space percentage has been reported at {{[system:pageFiles%]}}%. CPU usage is currently at {{system:cpuBusy}}%, memory usage is currently at {{system:physicalMemoryUsed}}%, there are currently {{system:processCount}} processes running."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:pageFiles%"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - swap-space",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "swapMax": "90"
      }
    }
  }, {
    "definition": {
      "disks.*.diskUsed": {
        "$gte": "diskMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Filesystem {{diskName}} is reporting a usage of {{diskUsed}}%",
        "fullText": "Filesystem {{diskName}} is reporting a usage of {{diskUsed}}%. Bytes left on the filesystem is {{math bytesFree '/' 1048576}}MB out of a total of {{math totals '/' 1048576}}MB allocated to {{diskUsed}} filesystem."
      }
    },
    "handleWhen": {
      "dependencies": [
        "disks.*.diskName"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - disk-usage",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity2": {
        "diskMax": "90"
      }
    }
  }, {
    "definition": {
      "disks.*.bytesFree": {
        "$gte": "bytesMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "Filesystem {{diskName}} is reporting {{math bytesFree '/' 1048576}}MB remaining.",
        "fullText": "Filesystem {{diskName}} is reporting {{math bytesFree '/' 1048576}}MB remaining. This represents a usage of {{diskUsed}}%."
      }
    },
    "handleWhen": {
      "dependencies": [
        "disks.*.bytesFree"
      ],
      "tags": [
        "system:platform:unix"
      ]
    },
    "name": "Unix - disk-free",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity2": {
        "bytesMax": "52428800"
      }
    }
  }, {
    "definition": {
      "system:systemAspUsed": {
        "$gte": "cpuMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "System ASP percentage has been reported at {{system:systemAspUsed}}%",
        "fullText": "System ASP percentage has been reported at {{system:systemAspUsed}}%. The current CPU used is {{system:cpuBusy}}%. The system ASP is {{system:systemAsp}}."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:systemAspUsed"
      ],
      "tags": [
        "system:platform:os400"
      ]
    },
    "name": "OS400 - asp-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity3": {
        "cpuMax": "90"
      }
    }
  }, {
    "definition": {
      "system:cpuBusy": {
        "$gte": "cpuMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "CPU usage percentage has been reported at {{system:cpuBusy}}%",
        "fullText": "CPU usage percentage has been reported at {{system:cpuBusy}}%. There are {{system:permanentAddresses}}% permanent addresses and {{system:temporaryAddresses}}% temporary addresses. There are {{system:jobsInSystem}} jobs on the host."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:cpuBusy"
      ],
      "tags": [
        "system:platform:os400"
      ]
    },
    "name": "OS400 - cpu-load",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity4": {
        "cpuMax": "90"
      }
    }
  }, {
    "definition": {
      "system:temporaryAddresses": {
        "$gte": "addressesMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "There are {{system:temporaryAddresses}}% temporary addresses on the host.",
        "fullText": "There are {{system:temporaryAddresses}}% temporary addresses on the host. There are {{system:permanentAddresses}}% permanent addresses. CPU usage percentage is at {{system:cpuBusy}}%. There are {{system:jobsInSystem}} jobs on the host."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:temporaryAddresses"
      ],
      "tags": [
        "system:platform:os400"
      ]
    },
    "name": "OS400 - temporary-addresses",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity4": {
        "addressesMax": "60"
      }
    }
  }, {
    "definition": {
      "system:permanentAddresses": {
        "$gte": "addressesMax"
      }
    },
    "deviceId": "Bluechip:Generic",
    "enabled": true,
    "eventDetails": {
      "default": {
        "briefText": "There are {{system:permanentAddresses}}% permanent addresses on the host.",
        "fullText": "There are {{system:permanentAddresses}}% permanent addresses on the host. There are {{system:temporaryAddresses}}% temporary addresses. CPU usage percentage is at {{system:cpuBusy}}%. There are {{system:jobsInSystem}} jobs on the host."
      }
    },
    "handleWhen": {
      "dependencies": [
        "system:permanentAddresses"
      ],
      "tags": [
        "system:platform:os400"
      ]
    },
    "name": "OS400 - permanent-addresses",
    "subscribers": [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ],
    "thresholds": {
      "severity4": {
        "addressesMax": "2.5"
      }
    }
  }];

  return r.table("Rule").insert(rules).run();

});
