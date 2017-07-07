module.exports.singleMetricString =
  "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#" +
  "1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#" +
  "0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#" +
  "0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";

module.exports.singleMetricStringExpected = {
  name: 'ITHW64SQL32',
  group: '',
  platform: 'windows',
  originalEvent: "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##",
  metricGroup: "system",
  metrics: {
    'system:physicalMemoryUsed': {
      name: 'system:physicalMemoryUsed',
      value: '24.51',
      type: '%',
      occurred: '1435536065'
    },
    'system:caches': {
      name: 'system:caches',
      value: '211963904.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:copyRead': {
      name: 'system:copyRead',
      value: '1.96',
      type: 's',
      occurred: '1435536065'
    },
    'system:copyReadHit': {
      name: 'system:copyReadHit',
      value: '100.00',
      type: '%',
      occurred: '1435536065'
    },
    'system:dataMap': {
      name: 'system:dataMap',
      value: '104.63',
      type: 's',
      occurred: '1435536065'
    },
    'system:dataMapHit': {
      name: 'system:dataMapHit',
      value: '100.00',
      type: '%',
      occurred: '1435536065'
    },
    'system:committeds': {
      name: 'system:committeds',
      value: '4257529856.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:frees': {
      name: 'system:frees',
      value: '3242147840.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:nonpagedPools': {
      name: 'system:nonpagedPools',
      value: '77971456.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:pageFault': {
      name: 'system:pageFault',
      value: '70.94',
      type: 's',
      occurred: '1435536065'
    },
    'system:pageIo': {
      name: 'system:pageIo',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:processCount': {
      name: 'system:processCount',
      value: '53.00',
      type: 'int',
      occurred: '1435536065'
    },
    'system:threadCount': {
      name: 'system:threadCount',
      value: '521.00',
      type: 'int',
      occurred: '1435536065'
    },
    'system:rdRate': {
      name: 'system:rdRate',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:rdPacket': {
      name: 'system:rdPacket',
      value: '0.01',
      type: 's',
      occurred: '1435536065'
    },
    'system:serverRate': {
      name: 'system:serverRate',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:serverReq': {
      name: 'system:serverReq',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:pageFiles': {
      name: 'system:pageFiles',
      value: '0.00',
      type: 'kb',
      occurred: '1435536065'
    },
    'system:pageFiles%': {
      name: 'system:pageFiles%',
      value: '0.00',
      type: '%',
      occurred: '1435536065'
    },
    'system:pageFilesMax': {
      name: 'system:pageFilesMax',
      value: '0.00',
      type: '%',
      occurred: '1435536065'
    },
    'system:contextSwitch': {
      name: 'system:contextSwitch',
      value: '284.96',
      type: 's',
      occurred: '1435536065'
    },
    'system:cpuBusy': {
      name: 'system:cpuBusy',
      value: '0.37',
      type: '%',
      occurred: '1435536065'
    },
    'system:cpuDpc': {
      name: 'system:cpuDpc',
      value: '0.03',
      type: '%',
      occurred: '1435536065'
    },
    'system:cpuInterrupt': {
      name: 'system:cpuInterrupt',
      value: '0.01',
      type: '%',
      occurred: '1435536065'
    },
    'system:cpuPrivileged': {
      name: 'system:cpuPrivileged',
      value: '0.21',
      type: '%',
      occurred: '1435536065'
    },
    'system:cpuQueueLength': {
      name: 'system:cpuQueueLength',
      value: '1.00',
      type: 'int',
      occurred: '1435536065'
    },
    'system:cpuUser': {
      name: 'system:cpuUser',
      value: '0.16',
      type: '%',
      occurred: '1435536065'
    },
    'system:exception': {
      name: 'system:exception',
      value: '0.01',
      type: 's',
      occurred: '1435536065'
    },
    'system:fileControlRate': {
      name: 'system:fileControlRate',
      value: '24634.58',
      type: 'B',
      occurred: '1435536065'
    },
    'system:fileControlIo': {
      name: 'system:fileControlIo',
      value: '47.31',
      type: 's',
      occurred: '1435536065'
    },
    'system:fileIo': {
      name: 'system:fileIo',
      value: '2.67',
      type: 's',
      occurred: '1435536065'
    },
    'system:fileReadRate': {
      name: 'system:fileReadRate',
      value: '9622.63',
      type: 'B',
      occurred: '1435536065'
    },
    'system:fileReadIo': {
      name: 'system:fileReadIo',
      value: '2.07',
      type: 's',
      occurred: '1435536065'
    },
    'system:fileWriteRate': {
      name: 'system:fileWriteRate',
      value: '1900.92',
      type: 'B',
      occurred: '1435536065'
    },
    'system:fileWriteIo': {
      name: 'system:fileWriteIo',
      value: '0.60',
      type: 's',
      occurred: '1435536065'
    },
    'system:interrupt': {
      name: 'system:interrupt',
      value: '1008.18',
      type: 's',
      occurred: '1435536065'
    },
    'system:systemCall': {
      name: 'system:systemCall',
      value: '690.41',
      type: 's',
      occurred: '1435536065'
    },
    'system:ipDgram': {
      name: 'system:ipDgram',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:tcpSegment': {
      name: 'system:tcpSegment',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:udpDgram': {
      name: 'system:udpDgram',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:httpRecvRate': {
      name: 'system:httpRecvRate',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:httpSentRate': {
      name: 'system:httpSentRate',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:xcgIsRpcOp': {
      name: 'system:xcgIsRpcOp',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    },
    'system:xcgMtagByteRate': {
      name: 'system:xcgMtagByteRate',
      value: '0.00',
      type: 'ms',
      occurred: '1435536065'
    },
    'system:xcgMtagRate': {
      name: 'system:xcgMtagRate',
      value: '0.00',
      type: 'ms',
      occurred: '1435536065'
    },
    'system:xcgImcInboundsTotal': {
      name: 'system:xcgImcInboundsTotal',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:xcgImcInboundgTotal': {
      name: 'system:xcgImcInboundgTotal',
      value: '0.00',
      type: 'ms',
      occurred: '1435536065'
    },
    'system:xcgImcOutboundsTotal': {
      name: 'system:xcgImcOutboundsTotal',
      value: '0.00',
      type: 'B',
      occurred: '1435536065'
    },
    'system:xcgImcOutboundgTotal': {
      name: 'system:xcgImcOutboundgTotal',
      value: '0.00',
      type: 'ms',
      occurred: '1435536065'
    },
    'system:sqlConfigDataCache': {
      name: 'system:sqlConfigDataCache',
      value: '0',
      type: '%',
      occurred: '1435536065'
    },
    'system:sqlIoPageRead': {
      name: 'system:sqlIoPageRead',
      value: '0.00',
      type: 's',
      occurred: '1435536065'
    }
  },
  time: '1435536065',
  createdAt: new Date(0)
};

module.exports.singleWindowsDiskMetricString =
  "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#Disks#2015-06-29 00:01:05.000#00:01#ITHW64SQL32#C##40857#27.87#72.13#0.90#4100.93#4578.14#1.06#0.00#0.00#0.10#0##";

module.exports.singleUnixDiskMetricString =
  "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#unixfilesystem#2015-06-29 00:01:05.000#00:01#ITHW64SQL32#/##40857#27.87#72.13#0.90#4100.93#4578.14#1.06#0.00#0.00#0.10#0##";

module.exports.singleUnixDiskMetricExpected = {
  name: 'ITHW64SQL32',
  group: '',
  platform: 'unix',
  metricGroup: "",
  originalEvent: "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#unixfilesystem#2015-06-29 00:01:05.000#00:01#ITHW64SQL32#/##40857#27.87#72.13#0.90#4100.93#4578.14#1.06#0.00#0.00#0.10#0##",
  metrics: {
    disks: {
      '/': {
        diskName: {
          name: 'diskName',
          value: '/',
          type: 'entity',
          occurred: '1435536065'
        },
        bytesFree: {
          name: 'bytesFree',
          value: '',
          type: 'int',
          occurred: '1435536065'
        },
        bytesUsed: {
          name: 'bytesUsed',
          value: '27.87',
          type: 'int',
          occurred: '1435536065'
        },
        inodesFree: {
          name: 'inodesFree',
          value: '72.13',
          type: 'int',
          occurred: '1435536065'
        },
        inodesFreeNonsu: {
          name: 'inodesFreeNonsu',
          value: '0.90',
          type: 'int',
          occurred: '1435536065'
        },
        totals: {
          name: 'totals',
          value: '4100.93',
          type: 'B',
          occurred: '1435536065'
        },
        totalInodes: {
          name: 'totalInodes',
          value: '4578.14',
          type: 'int',
          occurred: '1435536065'
        },
        diskUsed: {
          name: 'diskUsed',
          value: '1.06',
          type: '%',
          occurred: '1435536065'
        },
        diskFree: {
          name: 'diskFree',
          value: '0.00',
          type: '%',
          occurred: '1435536065'
        },
        fsInodesUsed: {
          name: 'fsInodesUsed',
          value: '0.00',
          type: '%',
          occurred: '1435536065'
        },
        fsInodesFree: {
          name: 'fsInodesFree',
          value: '0.10',
          type: '%',
          occurred: '1435536065'
        }
      }
    }
  },
  time: '1435536065',
  createdAt: new Date(0)
};

module.exports.singleOS400SystemMetricString =
  "9#1#UMG::USFSH17#29-SEP-2016#15:40:11#Performance Data#OS400System#2016-09-29 15:40:11.493#15:40#USFSH17#9.3#4869#0.094#1.963#776030#54.5260#776030#3697#3937#1.5#6266624#16#14#0.12#1#259#163520#0#1.1#-1#6266624##";


module.exports.singleType7String = "7#1#ITHW64SQL32#29-JUN-2015#00:01:05#N#CPU_LOAD##1#0##context0|context1|context2|context3#01-01-2016#00:00:00#13#opServe#Some Brief Text#Some Full Text##";

module.exports.singleType7StringExpected = {
  name: 'ITHW64SQL32',
  group: null,
  platform: 'question',
  metricGroup: "context0-context1-context2-context3-",
  originalEvent: "7#1#ITHW64SQL32#29-JUN-2015#00:01:05#N#CPU_LOAD##1#0##context0|context1|context2|context3#01-01-2016#00:00:00#13#opServe#Some Brief Text#Some Full Text##",
  metrics: {
    "context0-context1-context2-context3-:state": {
      name: 'context0-context1-context2-context3-:state',
      value: 'N',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:class": {
      name: 'context0-context1-context2-context3-:class',
      value: 'CPU_LOAD',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:subClass": {
      name: 'context0-context1-context2-context3-:subClass',
      value: '',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:severity": {
      name: 'context0-context1-context2-context3-:severity',
      value: '1',
      type: 'integer',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:handleNo": {
      name: 'context0-context1-context2-context3-:handleNo',
      value: '0',
      type: 'integer',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:handleName": {
      name: 'context0-context1-context2-context3-:handleName',
      value: '',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:context0": {
      name: 'context0-context1-context2-context3-:context0',
      value: 'context0',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:context1": {
      name: 'context0-context1-context2-context3-:context1',
      value: 'context1',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:context2": {
      name: 'context0-context1-context2-context3-:context2',
      value: 'context2',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:context3": {
      name: 'context0-context1-context2-context3-:context3',
      value: 'context3',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:creationDate": {
      name: 'context0-context1-context2-context3-:creationDate',
      value: '01-01-2016',
      type: 'date',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:creationTime": {
      name: 'context0-context1-context2-context3-:creationTime',
      value: '00:00:00',
      type: 'time',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:closeDate": {
      name: 'context0-context1-context2-context3-:closeDate',
      value: '13',
      type: 'date',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:closeTime": {
      name: 'context0-context1-context2-context3-:closeTime',
      value: 'opServe',
      type: 'time',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:updateCount": {
      name: 'context0-context1-context2-context3-:updateCount',
      value: 'Some Brief Text',
      type: 'string',
      occurred: '1435536065'
    },
    "context0-context1-context2-context3-:problemOwner": {
      name: 'context0-context1-context2-context3-:problemOwner',
      value: 'Some Full Text',
      type: 'string',
      occurred: '1435536065'
    }
  },
  time: '1435536065',
  createdAt: new Date(0)
};
