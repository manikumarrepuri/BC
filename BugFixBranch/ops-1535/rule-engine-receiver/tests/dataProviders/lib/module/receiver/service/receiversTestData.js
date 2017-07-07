module.exports = [{
  name: 'CASEONE',
  entity: {
    name: 'CASEONE',
    group: 'Brighthouse',
    platform: 'question',
    metrics: {
      'AgentUpdater:state': {
        name: 'AgentUpdater:state',
        value: 'N',
        type: 'string',
        occurred: '1466000411'
      },
      'AgentUpdater:fullText': {
        name: 'AgentUpdater:fullText',
        value: 'Process CPUBusy update from version Unknown. to version 1461331558.0 has started.',
        type: 'string',
        occurred: '1466000411'
      }
    },
    time: '1466000411'
  }
}, {
  name: 'system:cpuBusy',
  entity: {
    name: 'CFLHA02',
    group: 'Brighthouse',
    platform: 'question',
    metrics: {
      'system:cpuBusy': {
        name: 'system:cpuBusy',
        value: '98',
        type: '%',
        occurred: '1466000411'
      }
    },
    time: '1466000411'
  }
}, {
  name: 'system:physicalMemoryUsed',
  entity: {
    name: 'CFLHA03',
    group: 'Brighthouse',
    platform: 'question',
    metrics: {
      'system:cpuBusy': {
        name: 'system:physicalMemoryUsed',
        value: '50',
        type: '%',
        occurred: '1466000411'
      }
    },
    time: '1466000411'
  }
}, {
  name: 'system:systemAspUsed',
  entity: {
    name: 'CFLHA03',
    group: 'Brighthouse',
    platform: 'question',
    metrics: {
      'system:cpuBusy': {
        name: 'system:systemAspUsed',
        value: '50',
        type: '%',
        occurred: '1466000411'
      }
    },
    time: '1466000411'
  }
}, {
  name: 'windows disk',
  entity: {
    name: 'ITHW64SQL32',
    group: '',
    platform: "windows",
    metrics: {
      disks: {
        'C': {
          diskUsed: {
            name: 'diskUsed',
            value: '72.13',
            type: '%',
            occurred: '1435536065'
          }
        }
      }
    },
    time: '1435536065'
  }
}, {
  name: 'unix disk',
  entity: {
    name: 'ITHW64SQL32',
    group: '',
    platform: "unix",
    metrics: {
      disks: {
        '/': {
          diskUsed: {
            name: 'diskUsed',
            value: '72.13',
            type: '%',
            occurred: '1435536065'
          }
        }
      }
    },
    time: '1435536065'
  }
}, 
{
  name: 'iamAnnounceTest',
  entity: {
    id: 'BC MS:BCA-ITH-GWY-01',
    details: {
      GroupName: 'BC MS',
      HostName: 'BCA-ITH-GWY-01',
      DateStamp: '20-Jun-2016',
      TimeStamp: '10:58:54',
      OSFlavour: 'CentOS Linux',
      OSVersion: 'CentOS Linux release 7.1.1503 (64-bit)',
      IPAddress: '10.197.15.150',
      HWVendor: 'VMware, Inc.',
      HWModel: 'VMware Virtual Platform',
      SerialNbr: 'VMware-422188c9b6f475e0-c94f8f8b3ff0d6ff',
      Processor: 'Intel(R) Xeon(R) CPU E5-2650 0 @ 2.00GHz',
      ProcessorSpeed: '2000.000 MHz',
      ProcessorCount: '2',
      MemorySize: '1840 MB',
      DiskSize: '53.7 GB',
      iAMVersion: 'V8.2c GA',
      iAMLicense: 'Thu Jan  1 01:00:00 1970',
      updatedAt: '1466420334'
    }
  }
}];