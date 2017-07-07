const opservecommon     = require("opserve-common");
const mongoose          = require('mongoose');
const config            = opservecommon.Config.get();
const appRootPath       = require("app-root-path");
const async             = require('async');
//Connect to db
mongoose.connect(config.get("mongo:db"));

console.log("------------------------------------------------");
console.log("|                MongoDB Build               |");
console.log("------------------------------------------------");

//Create model ref
var Device = mongoose.model("Device");
var Rule = mongoose.model("Rule");
var Tag = mongoose.model("Tag");

var isRule = false;
var isDevice = false;
var isTag = false;

seed();

function seed(){
    var DeviceData = [{
                    "displayName": "Generic Bluechip Machine" ,
                    "group": "Bluechip" ,
                    "id": "Bluechip:Generic" ,
                    "name": "Generic" ,
                    "status": 1
                    }];
    var device = new Device();
    var RuleData = [{
                    "definition": {
                    "AgentUpdater:briefText": {
                        "300003regex": "AgentText"
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
                        "300003nin":  "classes"
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
                        "itheon10200002x7Event": {
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
                        "300003gte": "cpuMax"
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
                        "300003gte": "cpuQueueMax"
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
                        "300003gte": "memoryMax"
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
                        "300003gte": "pageMax"
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
                    "disks200002*200002diskUsed": {
                        "300003gte": "diskMax"
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
                    "disks200002*200002diskQueueLength": {
                        "300003gte": "diskQueueMax"
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
                        "300003gte": "cpuMax"
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
                        "300003gte": "swapMax"
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
                        "300003gte": "processMax"
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
                        "300003gte": "swapMax"
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
                    "disks200002*200002diskUsed": {
                        "300003gte": "diskMax"
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
                    "disks200002*200002bytesFree": {
                        "300003gte": "bytesMax"
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
                        "300003gte": "cpuMax"
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
                        "300003gte": "cpuMax"
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
                        "300003gte": "addressesMax"
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
                        "300003gte": "addressesMax"
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
    var rule = new Rule();
    var TagData = [{
                    id: "system:platform:os400",
                    group: "system",
                    type: "platform",
                    value: "os400",
                    description: "os400 systems",
                    color: null,
                    defaultColor: "#80B5D3",
                    createdAt: new Date(),
                    status: 1,
                    weight: 1000
                    },
                    {
                    id: "system:platform:windows",
                    group: "system",
                    type: "platform",
                    value: "windows",
                    description: "windows systems",
                    color: null,
                    defaultColor: "#80B5D3",
                    createdAt: new Date(),
                    status: 1,
                    weight: 1000
                    },
                    {
                    id: "system:platform:linux",
                    group: "system",
                    type: "platform",
                    value: "linux",
                    description: "linux systems",
                    color: null,
                    defaultColor: "#80B5D3",
                    createdAt: new Date(),
                    status: 1,
                    weight: 1000
                    },
                    {
                    id: "system:sourceType:iAM Agent",
                    group: "system",
                    type: "sourceType",
                    value: "iAM Agent",
                    description: "Metrics collected by iAM Agent",
                    color: null,
                    defaultColor: "#80B5D3",
                    createdAt: new Date(),
                    status: 1,
                    weight: 1000
                    }];
    var tag = new Tag();
    device.collection.insert(DeviceData, function(err, result){
      if (err) {
          console.log('Error while saving devices: '+err);
          isDevice = true;
          workDone()
          return err;
      } else {
          console.log("Devices stored!");
          isDevice = true;
          workDone()
          return;
      }
    });

    RuleData.forEach(function(item) {
        var query = {id: item.id,
                    name: item.name};
        var options = {upsert: true};
        Rule.findOneAndUpdate(query, item, options, function(err,doc) {
            if (err) {
                console.log('Error while saving rules: '+err);
                isRule = true;
                workDone()
                return err;
            } else {
                console.log("Rules stored!");
                isRule = true;
                workDone()
                return;
            }
        });
    });
    tag.collection.insert(TagData, function(err, result){
      if (err) {
          console.log('Error while saving tags: '+err);
          isTag = true;
          workDone()
          return err;
      } else {
          console.log("Tags stored!");
          isTag = true;
          workDone()
          return;
      }
    });
}
function workDone(){
   if(isRule && isTag && isDevice)
   {
       exit();
   }
}
function exit(){
console.log("------------------------------------------------");
console.log("|                MongoDB Build Completed               |");
console.log("------------------------------------------------");
   mongoose.disconnect();
}
