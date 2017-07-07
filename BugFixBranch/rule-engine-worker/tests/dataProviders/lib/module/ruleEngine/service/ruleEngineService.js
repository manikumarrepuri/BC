
"use strict";

var appRootPath = require('app-root-path');
var common       = require('opserve-common');
var _            = common.utilities.underscore;

var Metric = require(appRootPath + '/lib/module/device/entity/metric');
var Device = require(appRootPath + '/lib/module/device/entity/device');
var Rule   = require(appRootPath + '/lib/module/rule/entity/rule');
var Result = require(appRootPath + '/lib/module/ruleEngine/entity/result');

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

  var deviceLow = new Device({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy': cpuBusyMetricLow
    }
  });

  var resultLow = {
    code: 'failure',
    severity: undefined
  };

  var data = [];
  data.push([deviceLow, new Rule(sampleRule), resultLow]);

  // ---------------------
  // -- severity 2 case --
  // ---------------------

  var cpuBusyMetricSeverity2 = {
    name: 'cpuBusy',
    value: '86',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity2 = new Device({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy': cpuBusyMetricSeverity2
    }
  });

  var resultSeverity2 = {
    code: 'success',
    severity: 2
  };

  data.push([deviceSeverity2, new Rule(sampleRule), resultSeverity2]);

  // ---------------------
  // -- severity 1 case --
  // ---------------------

  var cpuBusyMetricSeverity1 = {
    name: 'cpuBusy',
    value: '96',
    type: '%',
    occurred: 1437399589
  };

  var deviceSeverity1 = new Device({
    rules: {
      cpu_load: sampleRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1
    }
  });

  var resultSeverity1 = {
    code: 'success',
    severity: 1
  };

  data.push([deviceSeverity1, new Rule(sampleRule), resultSeverity1]);

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

  var deviceLow = new Device({
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
    code: 'failure',
    severity: undefined
  };

  var data = [];
  data.push([deviceLow, new Rule(semiComplexRule), resultLow]);

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

  var deviceSeverity2Cpu = new Device({
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

  data.push([deviceSeverity2Cpu, new Rule(semiComplexRule), resultLow]);

  // memory severity 2

  var deviceSeverity2Memory = new Device({
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

  data.push([deviceSeverity2Memory, new Rule(semiComplexRule), resultLow]);

  // memory AND cpu severity 2

  var deviceSeverity2MemoryAndCpu = new Device({
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
    severity: 2
  };

  data.push([deviceSeverity2MemoryAndCpu, new Rule(semiComplexRule), resultSeverity2]);

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

  var deviceSeverity1Cpu = new Device({
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

  data.push([deviceSeverity1Cpu, new Rule(semiComplexRule), resultLow]);

  // memory severity 1

  var deviceSeverity1Memory = new Device({
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

  data.push([deviceSeverity1Memory, new Rule(semiComplexRule), resultLow]);

  // memory AND cpu severity 1

  var deviceSeverity1MemoryAndCpu = new Device({
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
    severity: 1
  };

  data.push([deviceSeverity1MemoryAndCpu, new Rule(semiComplexRule), resultSeverity1]);

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

  var deviceLow = new Device({
    rules: {
      cpu_load_and_memory: complexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultLow = {
    code: 'failure',
    severity: undefined
  };

  var data = [];
  data.push([deviceLow, new Rule(complexRule), resultLow]);

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

  var deviceSeverity2Cpu = new Device({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultSeverity2 = {
    code: 'success',
    severity: 2
  };

  data.push([deviceSeverity2Cpu, new Rule(complexRule), resultSeverity2]);

  // memory severity 2

  var deviceSeverity2Memory = new Device({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
    }
  });

  data.push([deviceSeverity2Memory, new Rule(complexRule), resultSeverity2]);

  // memory AND cpu severity 2

  var deviceSeverity2MemoryAndCpu = new Device({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity2,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity2,
    }
  });

  data.push([deviceSeverity2MemoryAndCpu, new Rule(complexRule), resultSeverity2]);

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

  var deviceSeverity1Cpu = new Device({
    rules: {
      cpu_load_and_memory: complexRule
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricSeverity1,
      'physicalMemoryUsed' : physicalMemoryUsedMetricLow
    }
  });

  var resultSeverity1 = {
    code: 'success',
    severity: 1
  };

  data.push([deviceSeverity1Cpu, new Rule(complexRule), resultSeverity1]);

  // memory severity 1

  var deviceSeverity1Memory = new Device({
    rules: {
      cpu_load_and_memory: complexRule,
    },
    metrics: {
      'cpuBusy' : cpuBusyMetricLow,
      'physicalMemoryUsed' : physicalMemoryUsedMetricSeverity1,
    }
  });

  data.push([deviceSeverity1Memory, new Rule(complexRule), resultSeverity1]);

  return data;
}

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

  var deviceLow = new Device({
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

  var deviceDiskCSeverity2 = new Device({
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

  var deviceDiskDSeverity2 = new Device({
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

  var deviceDiskCSeverity1 = new Device({
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

  var deviceDiskDSeverity1 = new Device({
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

  data.push([deviceLow, new Rule(simpleEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new Rule(simpleEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new Rule(simpleEntityRule), resultSeverity1]);

  data.push([deviceLow, new Rule(complexEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new Rule(complexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity2, new Rule(complexEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new Rule(complexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity1, new Rule(complexEntityRule), resultSeverity1]);

  data.push([deviceLow, new Rule(superComplexEntityRule), resultLow]);
  data.push([deviceDiskCSeverity2, new Rule(superComplexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity2, new Rule(superComplexEntityRule), resultSeverity2]);
  data.push([deviceDiskCSeverity1, new Rule(superComplexEntityRule), resultLow]);
  data.push([deviceDiskDSeverity1, new Rule(superComplexEntityRule), resultSeverity1]);

  return data;
}
