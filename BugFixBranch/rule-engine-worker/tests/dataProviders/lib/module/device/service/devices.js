
module.exports.expectedDevices = [
  {
    displayName: 'Generic Bluechip Machine',
    id: '39257813-f84a-4f0b-b13d-d00cfbcb25b2',
    location: 'Bluechip',
    name: 'Generic',
    rules: [
      {
        "definition": {
          "$or": [
            {
              "cpuBusy": {
                "$gte": "{cpuMax}"
              }
            },
            {
              "physicalMemoryUsed": {
                "$gte": "{memoryMax}"
              }
            }
          ]
        },
        "deviceId": "39257813-f84a-4f0b-b13d-d00cfbcb25b2",
        "eventDetails": {
          "default": {
            "briefText": "This box is beginning to die",
            "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          },
          "severity1": {
            "briefText": "oh no it's dead!",
            "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          },
        },
        "handleWhen": {
          "dependencies": ["cpuBusy", "physicalMemoryUsed"]
        },
        "id": '86d01b9d-c0ae-4bab-8125-4e7edf1816cb',
        "name": "global_cpu_or_memory_load",
        "subscribers": [
          "itheon7.1_event"
        ],
        "thresholds": {
          "severity1": {
            "cpuMax": "95",
            "memoryMax": "95"
          },
          "severity2" : {
            "cpuMax": "85",
            "memoryMax": "85"
          }
        }
      }
    ],
    hash: "ffa4040a3750ba5a6ec719c4805f5113"
  },
  {
    displayName: 'some-dev-server-1',
    id: '70c4c193-2a4b-4972-b508-94b2b7c65958',
    location: 'Bluechip:Itheon:Bedford:Franklin_Court',
    name: 'Server1',
    platform: 'windows',
    rules: [
      {
        "definition": {
          "$or": [
            {
              "cpuBusy": {
                "$gte": "{cpuMax}"
              }
            },
            {
              "physicalMemoryUsed": {
                "$gte": "{memoryMax}"
              }
            }
          ]
        },
        "deviceId": "70c4c193-2a4b-4972-b508-94b2b7c65958",
        "eventDetails": {
          "default": {
            "briefText": "This box is beginning to die",
            "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          },
          "severity1": {
            "briefText": "oh no it's dead!",
            "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          },
        },
        "handleWhen": {
          "dependencies": ["cpuBusy", "physicalMemoryUsed"]
        },
        "id": '159cdd88-bade-40f0-9ba9-c8f151b23c1d',
        "name": "cpu_or_memory_load",
        "subscribers": [
          "itheon7.1_event"
        ],
        "thresholds": {
          "severity1": {
            "cpuMax": "95",
            "memoryMax": "95"
          },
          "severity2" : {
            "cpuMax": "85",
            "memoryMax": "85"
          }
        }
      }
    ],
    hash: "800f18ae0408f67a6498b29a2fb7bee7"
  },
  {
    displayName: 'some-dev-server-2',
    id: '64b353f1-55f3-4017-aa4d-166dd17e2dec',
    location: 'Bluechip:Itheon:Bedford:Franklin_Court',
    name: 'Server2',
    platform: 'windows',
    rules: [
      {
        "deviceId": '64b353f1-55f3-4017-aa4d-166dd17e2dec',
        "definition": {
          "disks.*.diskName": {
            "$ne": "e"
          },
          "$or": [
            {
              "cpuBusy": {
                $gte : "{cpuMax}"
              }
            },
            {
              physicalMemoryUsed: {
                $gte: "{memoryMax}"
              }
            },
            {
              "disk.*.diskFree": {
                "$gt": "{diskMax}"
              }
            }
          ]
        },
        "eventDetails": {
          "default": {
            "briefText": "This box is beginning to die",
            "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          },
          "severity1": {
            "briefText": "oh no it's dead!",
            "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
          }
        },
        "handleWhen": {
          "dependencies": ["cpuBusy", "physicalMemoryUsed", "disks.*"],
          "exclude": ["disk.e"]
        },
        "id": '34a61e1e-0032-4d12-bbd3-223b507ae98d',
        "name": "cpu_memory_or_disk_load",
        "subscribers": [
          "itheon7.1_event"
        ],
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
        }
      }
    ],
    hash: "bafcc97737eefab5c7c6b78f5c337bc2"
  }
];