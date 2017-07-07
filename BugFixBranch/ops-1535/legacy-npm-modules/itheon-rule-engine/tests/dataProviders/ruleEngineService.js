
"use strict";

var _             = require('itheon-utility').underscore;
var stubs         = require("itheon-test").stubs;
var DeviceEntity  = stubs.baseEntity;
var RuleEntity    = stubs.baseEntity;

module.exports.simpleRule = function () {

  // general simple rule

  var sampleRule = {
    name: 'cpu_load',
    definition: {
      "cpuBusy": {
          "$gt": "cpuMax"
      }
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95"
      },
      "severity2": {
        "cpuMax": "85"
      }
    }
  };

  // --------------------
  // -- low level case --
  // --------------------

  var cpuBusyMetricLow = {
    name: 'cpuBusy',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var deviceLow = new DeviceEntity({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy': cpuBusyMetricLow
    }
  });

  var resultLow = {
    code: 'failure'
  };

  var data = [];
  data.push([deviceLow, new RuleEntity(sampleRule), resultLow]);

  // ---------------------
  // -- severity 2 case --
  // ---------------------

  var cpuBusyMetricSeverity2 = {
    name: 'cpuBusy',
    value: '86',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity2 = new DeviceEntity({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy': cpuBusyMetricSeverity2
    }
  });

  var resultSeverity2 = {
    code: 'success',
    matchedConditions: [
      {
        name: "cpuBusy",
        operator: "$gt",
        threshold: 85,
        value: 86
      }
    ],
    severity: 2
  };

  data.push([deviceSeverity2, new RuleEntity(sampleRule), resultSeverity2]);

  // ---------------------
  // -- severity 1 case --
  // ---------------------

  var cpuBusyMetricSeverity1 = {
    name: 'cpuBusy',
    value: '96',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity1 = new DeviceEntity({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1
    }
  });

  var resultSeverity1 = {
    code: 'success',
    matchedConditions: [
      {
        name: "cpuBusy",
        operator: "$gt",
        threshold: 95,
        value: 96
      }
    ],
    severity: 1
  };

  data.push([deviceSeverity1, new RuleEntity(sampleRule), resultSeverity1]);

  return data;
};

module.exports.semiComplexRule = function () {

  // general complex rule

  var semiComplexRule = {
    name: 'cpu_load_and_memory',
    definition: {
      "cpuBusy": {
        "$gt": "cpuMax"
      },
      "physicalMemoryUsed": {
        "$gt": "memoryMax"
      },
      "field1": {
        "$begins": "fieldBegins"
      },
      "field2": {
        "$ends": "fieldEnds"
      },
      "field3": {
        "$regex": "fieldRegex"
      }
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95",
        "memoryMax": "75",
        "fieldBegins": "abc",
        "fieldEnds": "xyz",
        "fieldRegex": '^([0-9]{1,})$'
      },
      "severity2": {
        "cpuMax": "85",
        "memoryMax": "65",
        "fieldBegins": "abc",
        "fieldEnds": "xyz",
        "fieldRegex": '^([0-9]{1,})$'
      }
    }
  };

  // --------------------
  // -- low level case --
  // --------------------

  var cpuBusyMetricLow = {
    name: 'cpuBusy',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricLow = {
    name: 'physicalMemoryUsed',
    value: '56',
    type: '%',
    occurred: 1437399589
  };

  var field1NonBegins = {
    name: 'field1',
    value: 'aaa',
    type: 'string',
    occurred: 1437399589
  };

  var field2NonEnding = {
    name: 'field2',
    value: 'aaa',
    type: 'string',
    occurred: 1437399589
  };

  var field3RegexNotMatching = {
    name: 'field3',
    value: 'aaa',
    type: 'string',
    occurred: 1437399589
  };

  var deviceLow = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule
    },
    metrics: {
      'cpuBusy': cpuBusyMetricLow,
      'physicalMemoryUsed': physicalMemoryUsedMetricLow,
      'field1': field1NonBegins,
      'field2': field2NonEnding,
      'field3': field3RegexNotMatching
    }
  });

  var resultLow = {
    code: 'failure'
  };

  var data = [];
  data.push([deviceLow, new RuleEntity(semiComplexRule), resultLow]);

  // -------------------------
  // -- severity 2 case x 3 --
  // -------------------------

  // cpu severity 2

  var cpuBusyMetricSeverity2 = {
    name: 'cpuBusy',
    value: '86',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricSeverity2 = {
    name: 'physicalMemoryUsed',
    value: '66',
    type: '%',
    occurred: 1437399589
  };

  var field1Begins = {
    name: 'field1',
    value: 'abcsdgdfgdfg',
    type: 'string',
    occurred: 1437399589
  };

  var field2Ending = {
    name: 'field2',
    value: 'sdfsdfsdfxyz',
    type: 'string',
    occurred: 1437399589
  };

  var field3RegexMatching = {
    name: 'field3',
    value: '87345435',
    type: 'integer',
    occurred: 1437399589
  };

  var deviceSeverity2Cpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'field1': field1NonBegins,
      'field2': field2NonEnding,
      'field3': field3RegexNotMatching
    }
  });

  data.push([deviceSeverity2Cpu, new RuleEntity(semiComplexRule), resultLow]);

  // memory severity 2

  var deviceSeverity2Memory = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
      'field1': field1NonBegins,
      'field2': field2NonEnding,
      'field3': field3RegexNotMatching
    }
  });

  data.push([deviceSeverity2Memory, new RuleEntity(semiComplexRule), resultLow]);

  // memory AND cpu severity 2

  var deviceSeverity2MemoryAndCpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
      'field1': field1Begins,
      'field2': field2Ending,
      'field3': field3RegexMatching
    }
  });

  var resultSeverity2 = {
    code: 'success',
    matchedConditions: [
      {
        name: "cpuBusy",
        operator: "$gt",
        threshold: "95",
        value: "86"
      },
      {
        name: "physicalMemoryUsed",
        operator: "$gt",
        threshold: "75",
        value: "66"
      },
      {
        name: "field1",
        operator: "$begins",
        threshold: "abc",
        value: "abcsdgdfgdfg"
      },
      {
        name: "field2",
        operator: "$ends",
        threshold: "xyz",
        value: "sdfsdfsdfxyz"
      },
      {
        name: "field3",
        operator: "$regex",
        threshold: "^([0-9]{1,})$",
        value: "87345435"
      }
    ],
    severity: 2
  };

  data.push([deviceSeverity2MemoryAndCpu, new RuleEntity(semiComplexRule), resultSeverity2]);

  // -------------------------
  // -- severity 1 case x 3 --
  // -------------------------

  // cpu serverity 1

  var cpuBusyMetricSeverity1 = {
    name: 'cpuBusy',
    value: '96',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricSeverity1 = {
    name: 'physicalMemoryUsed',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity1Cpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'field1': field1NonBegins,
      'field2': field2NonEnding,
      'field3': field3RegexNotMatching
    }
  });

  data.push([deviceSeverity1Cpu, new RuleEntity(semiComplexRule), resultLow]);

  // memory severity 1

  var deviceSeverity1Memory = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity1,
      'field1': field1NonBegins,
      'field2': field2NonEnding,
      'field3': field3RegexNotMatching
    }
  });

  data.push([deviceSeverity1Memory, new RuleEntity(semiComplexRule), resultLow]);

  // memory AND cpu severity 1

  var deviceSeverity1MemoryAndCpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: semiComplexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity1,
      'field1': field1Begins,
      'field2': field2Ending,
      'field3': field3RegexMatching
    }
  });

  var resultSeverity1 = {
    code: 'success',
    matchedConditions: [
      {
        name: "cpuBusy",
        operator: "$gt",
        threshold: "95",
        value: "96"
      },
      {
        name: "physicalMemoryUsed",
        operator: "$gt",
        threshold: "75",
        value: "76"
      },
      {
        name: "field1",
        operator: "$begins",
        threshold: "abc",
        value: "abcsdgdfgdfg"
      },
      {
        name: "field2",
        operator: "$ends",
        threshold: "xyz",
        value: "sdfsdfsdfxyz"
      },
      {
        name: "field3",
        operator: "$regex",
        threshold: "^([0-9]{1,})$",
        value: "87345435"
      }
    ],
    severity: 1
  };

  data.push([deviceSeverity1MemoryAndCpu, new RuleEntity(semiComplexRule), resultSeverity1]);

  return data;
};

module.exports.complexRule = function () {

  // general complex rule

  var complexRule = {
    name: 'cpu_load_and_memory',
    definition: {
      "$or": [
        {
          "cpuBusy": {
            "$gt": "cpuMax"
          }
        },
        {
          "physicalMemoryUsed": {
            "$gt": "memoryMax"
          }
        }
      ]
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95",
        "memoryMax": "75"
      },
      "severity2": {
        "cpuMax": "85",
        "memoryMax": "65"
      }
    }
  };

  // --------------------
  // -- low level case --
  // --------------------

  var cpuBusyMetricLow = {
    name: 'cpuBusy',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricLow = {
    name: 'physicalMemoryUsed',
    value: '56',
    type: '%',
    occurred: 1437399589
  };

  var deviceLow = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultLow = {
    code: 'failure'
  };

  var data = [];
  data.push([deviceLow, new RuleEntity(complexRule), resultLow]);

  // -------------------------
  // -- severity 2 case x 2 --
  // -------------------------

  // cpu severity 2

  var cpuBusyMetricSeverity2 = {
    name: 'cpuBusy',
    value: '86',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricSeverity2 = {
    name: 'physicalMemoryUsed',
    value: '66',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity2Cpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultSeverity2Cpu = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '86',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '56',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 2
  };

  data.push([deviceSeverity2Cpu, new RuleEntity(complexRule), resultSeverity2Cpu]);

  // memory severity 2

  var deviceSeverity2Memory = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
    }
  });

  var resultSeverity2Memory = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '76',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '66',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 2
  };

  data.push([deviceSeverity2Memory, new RuleEntity(complexRule), resultSeverity2Memory]);

  // memory AND cpu severity 2

  var deviceSeverity2MemoryAndCpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
    }
  });

  var resultSeverity2Both = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '86',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '66',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 2
  };

  data.push([deviceSeverity2MemoryAndCpu, new RuleEntity(complexRule), resultSeverity2Both]);

  // ---------------------
  // -- severity 1 case --
  // ---------------------

  // cpu serverity 1

  var cpuBusyMetricSeverity1 = {
    name: 'cpuBusy',
    value: '96',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricSeverity1 = {
    name: 'physicalMemoryUsed',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity1Cpu = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultSeverity1Cpu = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '86',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '56',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 1
  };

  data.push([deviceSeverity1Cpu, new RuleEntity(complexRule), resultSeverity1Cpu]);

  // memory severity 1

  var resultSeverity1Memory = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '86',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '56',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 1
  };

  var deviceSeverity1Memory = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity1,
    }
  });

  data.push([deviceSeverity1Memory, new RuleEntity(complexRule), resultSeverity1Memory]);

  // both severity 1

  var resultSeverity1Both = {
    code: 'success',
    matchedConditions: [
      {
        name: 'cpuBusy',
        value: '86',
        threshold: '95',
        operator: '$gt'
      },
      {
        name: 'physicalMemoryUsed',
        value: '56',
        threshold: '75',
        operator: '$gt'
      }
    ],
    severity: 1
  };

  var deviceSeverity1Both = new DeviceEntity({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity1,
    }
  });

  data.push([deviceSeverity1Both, new RuleEntity(complexRule), resultSeverity1Both]);

  return data;
};

module.exports.entityRule = function () {

  // simple & complex entity rules

  var simpleEntityRule = {
    name: 'cpu_load_memory_or_disks',
    definition: {
      "$or": [
        {
          "cpuBusy": {
            "$gt": "cpuMax"
          }
        },
        {
          "physicalMemoryUsed": {
            "$gt": "memoryMax"
          }
        },
        {
          "disks.C.diskUsed": {
            "$gt": "diskMax"
          }
        }
      ]
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95",
        "memoryMax": "75",
        "diskMax": "80"
      },
      "severity2": {
        "cpuMax": "85",
        "memoryMax": "65",
        "diskMax": "70"
      }
    }
  };

  var complexEntityRule = {
    name: 'cpu_load_memory_or_disks',
    definition: {
      "disks.*.diskName": {
        "$ne": "excludedDrive"
      },
      "$or": [
        {
          "cpuBusy": {
            "$gt": "cpuMax"
          }
        },
        {
          "physicalMemoryUsed": {
            "$gt": "memoryMax"
          }
        },
        {
          "disks.*.diskUsed": {
            "$gt": "diskMax"
          }
        }
      ]
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95",
        "memoryMax": "75",
        "diskMax": "80",
        "excludedDrive": "C"
      },
      "severity2": {
        "cpuMax": "85",
        "memoryMax": "65",
        "diskMax": "70",
        "excludedDrive": "C"
      }
    }
  };

  var superComplexEntityRule = {
    name: 'cpu_load_memory_or_disks',
    definition: {
      "disks.*.diskName": {
        "$nin": "excludedDrives"
      },
      "$or": [
        {
          "cpuBusy": {
            "$gt": "cpuMax"
          }
        },
        {
          "physicalMemoryUsed": {
            "$gt": "memoryMax"
          }
        },
        {
          "disks.*.diskUsed": {
            "$gt": "diskMax"
          }
        }
      ]
    },
    thresholds: {
      "severity1": {
        "cpuMax": "95",
        "memoryMax": "75",
        "diskMax": "80",
        "excludedDrives": ["C", "E"]
      },
      "severity2": {
        "cpuMax": "85",
        "memoryMax": "65",
        "diskMax": "70",
        "excludedDrives": ["C", "E"]
      }
    }
  };

  var cpuBusyMetricLow = {
    name: 'cpuBusy',
    value: '76',
    type: '%',
    occurred: 1437399589
  };

  var physicalMemoryUsedMetricLow = {
    name: 'physicalMemoryUsed',
    value: '56',
    type: '%',
    occurred: 1437399589
  };

  var diskCNameMetric = {
    name: 'diskName',
    value: 'C',
    type: '',
    occurred: 1437399589
  };

  var diskDNameMetric = {
    name: 'diskName',
    value: 'D',
    type: '',
    occurred: 1437399589
  };

  var diskUsedMetricLow = {
    name: 'diskUsed',
    value: '52',
    type: '%',
    occurred: 1437399589
  };

  var diskUsedMetricSeverity2 = {
    name: 'diskUsed',
    value: '74',
    type: '%',
    occurred: 1437399589
  };

  var diskUsedMetricSeverity1 = {
    name: 'diskUsed',
    value: '84',
    type: '%',
    occurred: 1437399589
  };

  var deviceLow = new DeviceEntity({
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'disks': {
        'C': {
          'diskName': diskCNameMetric,
          'diskUsed': diskUsedMetricLow
        },
        'D': {
          'diskName': diskDNameMetric,
          'diskUsed': diskUsedMetricLow
        }
      }
    }
  });

  var deviceDiskCSeverity2 = new DeviceEntity({
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'disks': {
        'C': {
          'diskName': diskCNameMetric,
          'diskUsed': diskUsedMetricSeverity2
        },
        'D': {
          'diskName': diskDNameMetric,
          'diskUsed': diskUsedMetricLow
        }
      }
    }
  });

  var deviceDiskDSeverity2 = new DeviceEntity({
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'disks': {
        'C': {
          'diskName': diskCNameMetric,
          'diskUsed': diskUsedMetricLow
        },
        'D': {
          'diskName': diskDNameMetric,
          'diskUsed': diskUsedMetricSeverity2
        }
      }
    }
  });

  var deviceDiskCSeverity1 = new DeviceEntity({
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'disks': {
        'C': {
          'diskName': diskCNameMetric,
          'diskUsed': diskUsedMetricSeverity1
        },
        'D': {
          'diskName': diskDNameMetric,
          'diskUsed': diskUsedMetricLow
        }
      }
    }
  });

  var deviceDiskDSeverity1 = new DeviceEntity({
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow,
      'disks': {
        'C': {
          'diskName': diskCNameMetric,
          'diskUsed': diskUsedMetricLow
        },
        'D': {
          'diskName': diskDNameMetric,
          'diskUsed': diskUsedMetricSeverity1
        }
      }
    }
  });

  var resultLow = {
    code: 'failure',
    severity: undefined
  };

  var resultSeverity2 = {
    code: 'success',
    severity: 2
  };

  var resultSeverity1 = {
    code: 'success',
    severity: 1
  };

  var data = [];

  data.push([deviceLow, new RuleEntity(simpleEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new RuleEntity(simpleEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new RuleEntity(simpleEntityRule), resultSeverity1]);

  data.push([deviceLow, new RuleEntity(complexEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new RuleEntity(complexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity2, new RuleEntity(complexEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new RuleEntity(complexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity1, new RuleEntity(complexEntityRule), resultSeverity1]);

  data.push([deviceLow, new RuleEntity(superComplexEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new RuleEntity(superComplexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity2, new RuleEntity(superComplexEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new RuleEntity(superComplexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity1, new RuleEntity(superComplexEntityRule), resultSeverity1]);

  return data;
};
