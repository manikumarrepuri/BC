
"use strict";

var appRoot = require('app-root-path');

module.exports.validMappers = function() {
  var data = [];
  var string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System##";
  var expected = "system";

  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#Exchange##";
  expected = "exchange";

  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#TEXT#ITH_ANNOUNCE##";
  expected = "ith_announce";

  data.push([string, expected]);

  string = "7#1#ITHW64SQL32#29-JUN-2015#00:01:05##";
  expected = "type7";

  data.push([string, expected]);
  return data;
};

module.exports.validParseableData = function () {
  var data = [];
  var timeNow =  Math.floor(Date.now() / 1000);
  var string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";

  var expected = [ '1','ITHW64SQL32','29-JUN-2015','00:01:05','900','ITHW64SQL32',
     '24.51','211963904.00','1.96','100.00','104.63','100.00','4257529856.00',
     '3242147840.00','77971456.00','70.94','0.00','53.00','521.00','0.00','0.01',
     '0.00','0.00','1.00','0.00','0.00','0.00','284.96','0.37','0.03','0.01','0.21',
     '1.00','0.16','0.01','24634.58','47.31','2.67','9622.63','2.07','1900.92','0.60',
     '1008.18','690.41','19816634.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00',
     '0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0','0.00','0.00',
     '0.00','0.00' ];
  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:11#Performance Data#ServiceLevelAgreement#2015-06-29 00:01:11.000#00:01#ITHW64SQL32#305#Page File Space#Page files percent used#ITHW64SQL32#0.00#0.00#100.00#0.00#0.00##";

  expected = [ '1',
     'ITHW64SQL32',
     '29-JUN-2015',
     '00:01:11',
     'ITHW64SQL32',
     '305',
     'Page File Space',
     'Page files percent used',
     'ITHW64SQL32',
     '0.00',
     '0.00',
     '100.00',
     '0.00',
     '0.00' ];

  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#Disks#2015-06-29 00:01:05.000#00:01#ITHW64SQL32#C##40857#27.87#72.13#0.90#4100.93#4578.14#1.06#0.00#0.00#0.10#0##";

  expected = [ '1',
     'ITHW64SQL32',
     '29-JUN-2015',
     '00:01:05',
     'ITHW64SQL32',
     'C',
     '',
     '40857',
     '27.87',
     '72.13',
     '0.90',
     '4100.93',
     '4578.14',
     '1.06',
     '0.00',
     '0.00',
     '0.10',
     '0' ];

  data.push([string, expected]);

  string = "7#1#ITHW64SQL32#29-JUN-2015#00:01:05#N#CPU_LOAD##1#0##context0|context1|context2|context3#01-01-2016#00:00:00#13#opServe#Some Brief Text#Some Full Text##";

  expected = [
    '1',
    'ITHW64SQL32',
    '29-JUN-2015',
    '00:01:05',
    'N',
    'CPU_LOAD',
    '',
    '1',
    '0',
    '',
    'context0|context1|context2|context3',
    '01-01-2016',
    '00:00:00',
    '13',
    'opServe',
    'Some Brief Text',
    'Some Full Text'
  ];

  data.push([string, expected]);

  return data;
};

module.exports.validEntities = function () {
  var data = [];
  var timeNow =  Math.floor(Date.now() / 1000);
  var entity = {
    mapperName: 'system',
    mapper:
     { fields:
        [ { name: 'sequenceNumber', type: 'unknown' },
          { name: 'customerId', type: 'unknown' },
          { name: 'dateTime', type: 'unknown' },
          { name: 'timeOfDay', type: 'unknown' },
          { name: 'collectionInterval', type: 'unknown' },
          { name: 'computerName', type: 'unknown' },
          { name: 'physicalMemoryUsed', type: '%' },
          { name: 'caches', type: 'B' },
          { name: 'copyRead', type: 's' },
          { name: 'copyReadHit', type: '%' },
          { name: 'dataMap', type: 's' },
          { name: 'dataMapHit', type: '%' },
          { name: 'committeds', type: 'B' },
          { name: 'frees', type: 'B' },
          { name: 'nonpagedPools', type: 'B' },
          { name: 'pageFault', type: 's' },
          { name: 'pageIo', type: 's' },
          { name: 'processCount', type: 'int' },
          { name: 'threadCount', type: 'int' },
          { name: 'rdRate', type: 'B' },
          { name: 'rdPacket', type: 's' },
          { name: 'serverRate', type: 'B' },
          { name: 'serverReq', type: 's' },
          { name: 'serverSessions', type: 'unknown' },
          { name: 'pageFiles', type: 'kb' },
          { name: 'pageFiles%', type: '%' },
          { name: 'pageFilesMax', type: '%' },
          { name: 'contextSwitch', type: 's' },
          { name: 'cpuBusy', type: '%' },
          { name: 'cpuDpc', type: '%' },
          { name: 'cpuInterrupt', type: '%' },
          { name: 'cpuPrivileged', type: '%' },
          { name: 'cpuQueueLength', type: 'unknown' },
          { name: 'cpuUser', type: '%' },
          { name: 'exception', type: 's' },
          { name: 'fileControlRate', type: 'B' },
          { name: 'fileControlIo', type: 's' },
          { name: 'fileIo', type: 's' },
          { name: 'fileReadRate', type: 'B' },
          { name: 'fileReadIo', type: 's' },
          { name: 'fileWriteRate', type: 'B' },
          { name: 'fileWriteIo', type: 's' },
          { name: 'interrupt', type: 's' },
          { name: 'systemCall', type: 's' },
          { name: 'systemUpTime', type: 'unknown' },
          { name: 'ipDgram', type: 's' },
          { name: 'tcpSegment', type: 's' },
          { name: 'udpDgram', type: 's' },
          { name: 'httpRecvRate', type: 'B' },
          { name: 'httpSentRate', type: 'B' },
          { name: 'xcgIsActiveUsers', type: 'unknown' },
          { name: 'xcgIsConnections', type: 'unknown' },
          { name: 'xcgIsRpcOp', type: 's' },
          { name: 'xcgMtagByteRate', type: 'ms' },
          { name: 'xcgMtagRate', type: 'ms' },
          { name: 'xcgImcInboundsTotal', type: 'B' },
          { name: 'xcgImcInboundgTotal', type: 'ms' },
          { name: 'xcgImcQueuedInbound', type: 'unknown' },
          { name: 'xcgImcOutboundsTotal', type: 'B' },
          { name: 'xcgImcOutboundgTotal', type: 'ms' },
          { name: 'xcgImcQueuedOutbound', type: 'unknown' },
          { name: 'sqlConfigDataCache', type: '%' },
          { name: 'sqlCacheFreeBuffers', type: 'unknown' },
          { name: 'sqlCacheHitRatio', type: 'unknown' },
          { name: 'sqlIoPageRead', type: 's' },
          { name: 'sqlUsrConnections', type: 'unknown' }
        ]
      },
    columns:
     [ '1',
       'ITHW64SQL32',
       '29-JUN-2015',
       '00:01:05',
       '900',
       'ITHW64SQL32',
       '24.51',
       '211963904.00',
       '1.96',
       '100.00',
       '104.63',
       '100.00',
       '4257529856.00',
       '3242147840.00',
       '77971456.00',
       '70.94',
       '0.00',
       '53.00',
       '521.00',
       '0.00',
       '0.01',
       '0.00',
       '0.00',
       '1.00',
       '0.00',
       '0.00',
       '0.00',
       '284.96',
       '0.37',
       '0.03',
       '0.01',
       '0.21',
       '1.00',
       '0.16',
       '0.01',
       '24634.58',
       '47.31',
       '2.67',
       '9622.63',
       '2.07',
       '1900.92',
       '0.60',
       '1008.18',
       '690.41',
       '19816634.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0.00',
       '0',
       '0.00',
       '0.00',
       '0.00',
       '0.00']
  };

  var receiverName = 'iamReceiver';

  var expected = {
    time: "1435536065",
    name: 'ITHW64SQL32',
    group: '',
    platform: 'windows',
    metricGroup: "system",
    originalEvent: undefined,
    metrics: { 'system:physicalMemoryUsed': { name:
      'system:physicalMemoryUsed',
       value: '24.51',
       type: '%',
       occurred: '1435536065' },
     'system:caches': { name: 'system:caches',
       value: '211963904.00',
       type: 'B',
       occurred: '1435536065'},
     'system:copyRead': { name: 'system:copyRead',
       value: '1.96',
       type: 's',
       occurred: '1435536065' },
     'system:copyReadHit': { name: 'system:copyReadHit',
       value: '100.00',
       type: '%',
       occurred: '1435536065' },
     'system:dataMap': { name: 'system:dataMap',
       value: '104.63',
       type: 's',
       occurred: '1435536065' },
     'system:dataMapHit': { name: 'system:dataMapHit',
       value: '100.00',
       type: '%',
       occurred: '1435536065'},
     'system:committeds': { name: 'system:committeds',
       value: '4257529856.00',
       type: 'B',
       occurred: '1435536065' },
     'system:frees': { name: 'system:frees',
       value: '3242147840.00',
       type: 'B',
       occurred: '1435536065' },
     'system:nonpagedPools': { name: 'system:nonpagedPools',
       value: '77971456.00',
       type: 'B',
       occurred: '1435536065' },
     'system:pageFault': { name: 'system:pageFault',
       value: '70.94',
       type: 's',
       occurred: '1435536065' },
     'system:pageIo': { name: 'system:pageIo',
       value: '0.00',
       type: 's',
       occurred: '1435536065' },
     'system:processCount': { name: 'system:processCount',
       value: '53.00',
       type: 'int',
       occurred: '1435536065' },
     'system:threadCount': { name: 'system:threadCount',
       value: '521.00',
       type: 'int',
       occurred: '1435536065' },
     'system:rdRate': { name: 'system:rdRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065' },
     'system:rdPacket': { name: 'system:rdPacket',
       value: '0.01',
       type: 's',
       occurred: '1435536065' },
     'system:serverRate': { name: 'system:serverRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065' },
     'system:serverReq': { name: 'system:serverReq',
       value: '0.00',
       type: 's',
       occurred: '1435536065' },
     'system:pageFiles': { name: 'system:pageFiles',
       value: '0.00',
       type: 'kb',
       occurred: '1435536065' },
     'system:pageFiles%': { name: 'system:pageFiles%',
       value: '0.00',
       type: '%',
       occurred: '1435536065'},
     'system:pageFilesMax': { name: 'system:pageFilesMax',
       value: '0.00',
       type: '%',
       occurred: '1435536065' },
     'system:contextSwitch': { name: 'system:contextSwitch',
       value: '284.96',
       type: 's',
       occurred: '1435536065'},
     'system:cpuBusy': { name: 'system:cpuBusy',
       value: '0.37',
       type: '%',
       occurred: '1435536065'},
     'system:cpuDpc': { name: 'system:cpuDpc',
       value: '0.03',
       type: '%',
       occurred: '1435536065' },
     'system:cpuInterrupt': { name: 'system:cpuInterrupt',
       value: '0.01',
       type: '%',
       occurred: '1435536065' },
     'system:cpuPrivileged': { name: 'system:cpuPrivileged',
       value: '0.21',
       type: '%',
       occurred: '1435536065'},
     'system:cpuUser': { name: 'system:cpuUser',
       value: '0.16',
       type: '%',
       occurred: '1435536065' },
     'system:exception': { name: 'system:exception',
       value: '0.01',
       type: 's',
       occurred: '1435536065' },
     'system:fileControlRate': { name: 'system:fileControlRate',
       value: '24634.58',
       type: 'B',
       occurred: '1435536065' },
     'system:fileControlIo': { name: 'system:fileControlIo',
       value: '47.31',
       type: 's',
       occurred: '1435536065' },
     'system:fileIo': { name: 'system:fileIo',
       value: '2.67',
       type: 's',
       occurred: '1435536065' },
     'system:fileReadRate': { name: 'system:fileReadRate',
       value: '9622.63',
       type: 'B',
       occurred: '1435536065'},
     'system:fileReadIo': { name: 'system:fileReadIo',
       value: '2.07',
       type: 's',
       occurred: '1435536065'},
     'system:fileWriteRate': { name: 'system:fileWriteRate',
       value: '1900.92',
       type: 'B',
       occurred: '1435536065'},
     'system:fileWriteIo': { name: 'system:fileWriteIo',
       value: '0.60',
       type: 's',
       occurred: '1435536065'},
     'system:interrupt': { name: 'system:interrupt',
       value: '1008.18',
       type: 's',
       occurred: '1435536065'},
     'system:systemCall': { name: 'system:systemCall',
       value: '690.41',
       type: 's',
       occurred: '1435536065'},
     'system:ipDgram': { name: 'system:ipDgram',
       value: '0.00',
       type: 's',
       occurred: '1435536065'},
     'system:tcpSegment': { name: 'system:tcpSegment',
       value: '0.00',
       type: 's',
       occurred: '1435536065'},
     'system:udpDgram': { name: 'system:udpDgram',
       value: '0.00',
       type: 's',
       occurred: '1435536065'},
     'system:httpRecvRate': { name: 'system:httpRecvRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065' },
     'system:httpSentRate': { name: 'system:httpSentRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065' },
     'system:xcgIsRpcOp': { name: 'system:xcgIsRpcOp',
       value: '0.00',
       type: 's',
       occurred: '1435536065' },
     'system:xcgMtagByteRate': { name: 'system:xcgMtagByteRate',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065' },
     'system:xcgMtagRate': { name: 'system:xcgMtagRate',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065'},
     'system:xcgImcInboundsTotal': { name: 'system:xcgImcInboundsTotal',
       value: '0.00',
       type: 'B',
       occurred: '1435536065'},
     'system:xcgImcInboundgTotal': { name: 'system:xcgImcInboundgTotal',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065'},
     'system:xcgImcOutboundsTotal': { name: 'system:xcgImcOutboundsTotal',
       value: '0.00',
       type: 'B',
       occurred: '1435536065'},
      'system:xcgImcOutboundgTotal': { name: 'system:xcgImcOutboundgTotal',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065'},
     'system:sqlConfigDataCache': { name: 'system:sqlConfigDataCache',
       value: '0',
       type: '%',
       occurred: '1435536065'},
     'system:sqlIoPageRead': { name: 'system:sqlIoPageRead',
       value: '0.00',
       type: 's',
       occurred: '1435536065'}
     }
  };

  data.push([entity, receiverName, expected]);

  entity = {
    mapperName: 'unixfilesystem',
    mapper: {
      tableName: 'disks',
      group: "",
      fields:
      [ { name: 'sequenceNumber', type: 'unknown' },
        { name: 'customerId', type: 'unknown' },
        { name: 'dateTime', type: 'unknown' },
        { name: 'timeOfDay', type: 'unknown' },
        { name: 'computerName', type: 'unknown' },
        { name: 'diskName', type: 'entity' },
        { name: 'diskVolumeName', type: 'unknown' },
        { name: 'diskSize', type: 'mb' },
        { name: 'diskFree', type: '%' },
        { name: 'diskUsed', type: '%' },
        { name: 'diskIo', type: 's' },
        { name: 'diskRate', type: 'B' },
        { name: 'diskAvgIoSize', type: 'unknown' },
        { name: 'diskAvgIo', type: 'ms' },
        { name: 'diskBusy', type: '%' },
        { name: 'diskBusyRead', type: '%' },
        { name: 'diskBusyWriting', type: '%' },
        { name: 'diskQueueLength', type: 'unknown' }
      ]
    },
    columns:
   [ '1',
     'ITHW64SQL32',
     '29-JUN-2015',
     '00:01:05',
     'ITHW64SQL32',
     'C',
     '',
     '40857',
     '27.87',
     '72.13',
     '0.90',
     '4100.93',
     '4578.14',
     '1.06',
     '0.00',
     '0.00',
     '0.10',
     '0']
  };

  expected = {
    name: 'ITHW64SQL32',
    group: '',
    platform: "unix",
    metricGroup: "",
    originalEvent: undefined,
    metrics: {
      disks: {
        C: {
          diskName: {
            name: 'diskName',
            value: 'C',
            type: 'entity',
            occurred: '1435536065'
          },
          diskSize: {
            name: 'diskSize',
            value: '40857',
            type: 'mb',
            occurred: '1435536065'
          },
          diskFree: {
            name: 'diskFree',
            value: '27.87',
            type: '%',
            occurred: '1435536065'
          },
          diskUsed: {
            name: 'diskUsed',
            value: '72.13',
            type: '%',
            occurred: '1435536065'
          },
          diskIo: {
            name: 'diskIo',
            value: '0.90',
            type: 's',
            occurred: '1435536065'
          },
          diskRate: {
            name: 'diskRate',
            value: '4100.93',
            type: 'B',
            occurred: '1435536065'
          },
          diskAvgIo: {
            name: 'diskAvgIo',
            value: '1.06',
            type: 'ms',
            occurred: '1435536065'
          },
          diskBusy: {
            name: 'diskBusy',
            value: '0.00',
            type: '%',
            occurred: '1435536065'
          },
          diskBusyRead: {
            name: 'diskBusyRead',
            value: '0.00',
            type: '%',
            occurred: '1435536065'
          },
          diskBusyWriting: {
            name: 'diskBusyWriting',
            value: '0.10',
            type: '%',
            occurred: '1435536065'
          }
        }
      }
    },
    time: '1435536065'
  };

  data.push([entity, receiverName, expected]);

  entity = {
    mapperName: 'type7',
    mapper:
    {
      group: "{{#xif class '==' 'AgentUpdate'}}AgentUpdater{{else}}{{context0}}-{{context1}}-{{context2}}-{{context3}}-{{context4}}{{/xif}}",
      fields:
      [ { name: 'valid', type: 'unknown' },
        { name: 'host', type: 'unknown' },
        { name: 'date', type: 'unknown' },
        { name: 'time', type: 'unknown' },
        { name: 'state', type: 'string' },
        { name: 'class', type: 'string' },
        { name: 'subclass', type: 'string' },
        { name: 'severity', type: 'integer' },
        { name: 'handleNo', type: 'integer' },
        { name: 'handleName', type: 'string' },
        { name: 'context', type: 'unknown' },
        { name: 'creationDate', type: 'date' },
        { name: 'creationTime', type: 'time' },
        { name: 'closeDate', type: 'date' },
        { name: 'closeTime', type: 'time' },
        { name: 'updateCount', type: 'string' },
        { name: 'problemOwner', type: 'string' },
        { name: 'briefText', type: 'string' },
        { name: 'fullText', type: 'string' }
      ]
    },
    columns:
   [ '1',
     'ITHW64SQL32',
     '29-JUN-2015',
     '00:01:05',
     'N',
     'CPU_LOAD',
     '',
     '1',
     '0',
     'class',
     'context0|context1|context2|context3',
     '01-01-2016',
     '00:00:00',
     '13',
     'opServe',
     'Some Brief Text',
     'Some Full Text',
     ]
  };

  expected = { name: 'ITHW64SQL32',
  group: null,
  platform: 'question',
  metricGroup: "context0-context1-context2-context3-",
  originalEvent: undefined,
  metrics:
   { "context0-context1-context2-context3-:state":
      { name: 'context0-context1-context2-context3-:state',
        value: 'N',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:class":
      { name: 'context0-context1-context2-context3-:class',
        value: 'CPU_LOAD',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:subclass":
      { name: 'context0-context1-context2-context3-:subclass',
        value: '',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:severity":
      { name: 'context0-context1-context2-context3-:severity',
        value: '1',
        type: 'integer',
        occurred: '1435536065' },
    "context0-context1-context2-context3-:handleNo":
      { name: 'context0-context1-context2-context3-:handleNo',
        value: '0',
        type: 'integer',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:handleName":
      { name: 'context0-context1-context2-context3-:handleName',
        value: 'class',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:context0":
      { name: 'context0-context1-context2-context3-:context0',
        value: 'context0',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:context1":
      { name: 'context0-context1-context2-context3-:context1',
        value: 'context1',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:context2":
      { name: 'context0-context1-context2-context3-:context2',
        value: 'context2',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:context3":
      { name: 'context0-context1-context2-context3-:context3',
        value: 'context3',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:creationDate":
      { name: 'context0-context1-context2-context3-:creationDate',
        value: '01-01-2016',
        type: 'date',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:creationTime":
      { name: 'context0-context1-context2-context3-:creationTime',
        value: '00:00:00',
        type: 'time',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:closeDate":
      { name: 'context0-context1-context2-context3-:closeDate',
        value: '13',
        type: 'date',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:closeTime":
      { name: 'context0-context1-context2-context3-:closeTime',
        value: 'opServe',
        type: 'time',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:updateCount":
      { name: 'context0-context1-context2-context3-:updateCount',
        value: 'Some Brief Text',
        type: 'string',
        occurred: '1435536065' },
     "context0-context1-context2-context3-:problemOwner":
      { name: 'context0-context1-context2-context3-:problemOwner',
        value: 'Some Full Text',
        type: 'string',
        occurred: '1435536065' } },
  time: '1435536065' };

  data.push([entity, receiverName, expected]);

  entity = {
    mapperName: 'ith_announce',
    mapper: {
      fields: [
        { name: 'sequenceNumber', type: 'unknown' },
        { name: 'customerId', type: 'unknown' },
        { name: 'dateTime', type: 'unknown' },
        { name: 'timeOfDay', type: 'unknown' },
        { name: 'details', type: 'json' }
      ]
    },
    columns: [
      '1',
      'BC MS::BCA-ITH-GWY-01',
      '20-JUN-2016',
      '10:58:54',
      '{"GroupName":"BC MS::","HostName":"BCA-ITH-GWY-01","DateStamp":"20-Jun-2016","TimeStamp":"10:58:54","OSFlavour":"CentOS Linux","OSVersion":"CentOS Linux release 7.1.1503 (64-bit)","IPAddress":"10.197.15.150","HWVendor":"VMware, Inc.","HWModel":"VMware Virtual Platform","SerialNbr":"VMware-422188c9b6f475e0-c94f8f8b3ff0d6ff","Processor":"Intel(R) Xeon(R) CPU E5-2650 0 @ 2.00GHz","ProcessorSpeed":"2000.000 MHz","ProcessorCount":"2","MemorySize":"1840 MB","DiskSize":"53.7 GB","iAMVersion":"V8.2c GA","iAMLicense":"Thu Jan  1 01:00:00 1970"}'
    ]
  };

  receiverName = 'iamAnnounce';
  expected = {
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
  };

  data.push([entity, receiverName, expected]);

  entity = { mapperName: 'type7',
  mapper:
   { group: "{{#xif class '==' 'AgentUpdate'}}AgentUpdater{{else}}{{context0}}-{{context1}}-{{context2}}-{{context3}}-{{context4}}{{/xif}}",
     fields:
      [ { name: 'valid', type: 'unknown' },
        { name: 'host', type: 'unknown' },
        { name: 'date', type: 'unknown' },
        { name: 'time', type: 'unknown' },
        { name: 'state', type: 'string' },
        { name: 'class', type: 'string' },
        { name: 'subClass', type: 'string' },
        { name: 'severity', type: 'integer' },
        { name: 'handleNo', type: 'integer' },
        { name: 'handleName', type: 'string' },
        { name: 'context', type: 'unknown' },
        { name: 'creationDate', type: 'date' },
        { name: 'creationTime', type: 'time' },
        { name: 'closeDate', type: 'date' },
        { name: 'closeTime', type: 'time' },
        { name: 'updateCount', type: 'string' },
        { name: 'problemOwner', type: 'string' },
        { name: 'briefText', type: 'string' },
        { name: 'fullText', type: 'string' }
      ]
    },
  columns:
   [ '1',
     'Brighthouse::CFLHA01',
     '15-JUN-2016',
     '14:20:11',
     'N',
     'AgentUpdate',
     'success',
     '4',
     '0',
     'AgentUpdate',
     'Brighthouse::CFLHA01|AgentUpdate|CPUBusy',
     '15-JUN-2016',
     '14:20:11',
     '',
     '',
     '1',
     '',
     'Process CPUBusy update from version Unknown. to version 1461331558.0 has started.',
     'Process CPUBusy update from version Unknown. to version 1461331558.0 has started.'
   ]
 };

  receiverName = 'iamReceiver';
  expected = { name: 'CFLHA01',
  group: 'Brighthouse',
  platform: 'question',
  metricGroup: "AgentUpdater",
  originalEvent: undefined,
  metrics:
   { 'AgentUpdater:state':
      { name: 'AgentUpdater:state',
        value: 'N',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:class':
      { name: 'AgentUpdater:class',
        value: 'AgentUpdate',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:subClass':
      { name: 'AgentUpdater:subClass',
        value: 'success',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:severity':
      { name: 'AgentUpdater:severity',
        value: '4',
        type: 'integer',
        occurred: '1466000411' },
     'AgentUpdater:handleNo':
      { name: 'AgentUpdater:handleNo',
        value: '0',
        type: 'integer',
        occurred: '1466000411' },
     'AgentUpdater:handleName':
      { name: 'AgentUpdater:handleName',
        value: 'AgentUpdate',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:context0':
      { name: 'AgentUpdater:context0',
        value: 'Brighthouse::CFLHA01',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:context1':
      { name: 'AgentUpdater:context1',
        value: 'AgentUpdate',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:context2':
      { name: 'AgentUpdater:context2',
        value: 'CPUBusy',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:creationDate':
      { name: 'AgentUpdater:creationDate',
        value: '15-JUN-2016',
        type: 'date',
        occurred: '1466000411' },
     'AgentUpdater:creationTime':
      { name: 'AgentUpdater:creationTime',
        value: '14:20:11',
        type: 'time',
        occurred: '1466000411' },
     'AgentUpdater:closeDate':
      { name: 'AgentUpdater:closeDate',
        value: '',
        type: 'date',
        occurred: '1466000411' },
     'AgentUpdater:closeTime':
      { name: 'AgentUpdater:closeTime',
        value: '',
        type: 'time',
        occurred: '1466000411' },
     'AgentUpdater:updateCount':
      { name: 'AgentUpdater:updateCount',
        value: '1',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:problemOwner':
      { name: 'AgentUpdater:problemOwner',
        value: '',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:briefText':
      { name: 'AgentUpdater:briefText',
        value: 'Process CPUBusy update from version Unknown. to version 1461331558.0 has started.',
        type: 'string',
        occurred: '1466000411' },
     'AgentUpdater:fullText':
      { name: 'AgentUpdater:fullText',
        value: 'Process CPUBusy update from version Unknown. to version 1461331558.0 has started.',
        type: 'string',
        occurred: '1466000411' } },
  time: '1466000411' };

  data.push([entity, receiverName, expected]);

  data.push([entity, receiverName, expected]);

  entity = { mapperName: 'type7',
  mapper:
   { group: "{{#xif class '==' 'AgentUpdate'}}AgentUpdater{{else}}{{context0}}-{{context1}}-{{context2}}-{{context3}}-{{context4}}{{/xif}}",
     fields:
      [ { name: 'valid', type: 'unknown' },
        { name: 'host', type: 'unknown' },
        { name: 'date', type: 'unknown' },
        { name: 'time', type: 'unknown' },
        { name: 'state', type: 'string' },
        { name: 'class', type: 'string' },
        { name: 'subClass', type: 'string' },
        { name: 'severity', type: 'integer' },
        { name: 'handleNo', type: 'integer' },
        { name: 'handleName', type: 'string' },
        { name: 'context', type: 'unknown' },
        { name: 'creationDate', type: 'date' },
        { name: 'creationTime', type: 'time' },
        { name: 'closeDate', type: 'date' },
        { name: 'closeTime', type: 'time' },
        { name: 'updateCount', type: 'string' },
        { name: 'problemOwner', type: 'string' },
        { name: 'briefText', type: 'string' },
        { name: 'fullText', type: 'string' }
      ]
    },
  columns:
    [
      '1',
      'Societe Generale::SGSSDOLD',
      '01-NOV-2016',
      '00:00:10',
      'U',
      'I-Series',
      'ITHEON',
      '2',
      '0',
      'BBD0142',
      'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR|Job DLYBACKUP in subsystem QSYSWRK is not active',
      '31-OCT-2016',
      '23:05:09',
      '',
      '',
      '12',
      'Itheon',
      'BBD0142 - Job DLYBACKUP in subsystem QSYSWRK is not active',
      'System : SGSSDOLD^MSerial Number : 06D27FP^MMessage Queue : ITHEON/ITHMSGQ^MJob : 027770/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0142^MSeverity : SGSSDOLD^MSerial Number : 06D27FP^MMessage Queue : ITHEON/ITHMSGQ^MJob : 027770/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0142^MSeverity :        70^MMessage Details:^MJob DLYBACKUP in subsystem QSYSWRK is not active^MAdditional Text:^M^MMessage Help Text:^MJob DLYBACKUP should be active at this time.'
  ]
 };

  receiverName = 'iamReceiver';

  expected = {
    name: 'SGSSDOLD',
    group: 'Societe Generale',
    platform: 'question',
    metricGroup: "SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---",
    originalEvent: undefined,
    metrics:
    { 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:state':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:state',
        value: 'U',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:class':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:class',
        value: 'I-Series',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:subClass':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:subClass',
        value: 'ITHEON',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:severity':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:severity',
        value: '2',
        type: 'integer',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:handleNo':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:handleNo',
        value: '0',
        type: 'integer',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:handleName':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:handleName',
        value: 'BBD0142',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:context0':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:context0',
        value: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:context1':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:context1',
        value: 'Job DLYBACKUP in subsystem QSYSWRK is not active',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:creationDate':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:creationDate',
        value: '31-OCT-2016',
        type: 'date',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:creationTime':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:creationTime',
        value: '23:05:09',
        type: 'time',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:closeDate':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:closeDate',
        value: '',
        type: 'date',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:closeTime':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:closeTime',
        value: '',
        type: 'time',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:updateCount':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:updateCount',
        value: '12',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:problemOwner':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:problemOwner',
        value: 'Itheon',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:briefText':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:briefText',
        value: 'BBD0142 - Job DLYBACKUP in subsystem QSYSWRK is not active',
        type: 'string',
        occurred: '1477958410' },
     'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:fullText':
      { name: 'SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR-Job DLYBACKUP in subsystem QSYSWRK is not active---:fullText',
        value: 'System : SGSSDOLD^MSerial Number : 06D27FP^MMessage Queue : ITHEON/ITHMSGQ^MJob : 027770/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0142^MSeverity : SGSSDOLD^MSerial Number : 06D27FP^MMessage Queue : ITHEON/ITHMSGQ^MJob : 027770/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0142^MSeverity :        70^MMessage Details:^MJob DLYBACKUP in subsystem QSYSWRK is not active^MAdditional Text:^M^MMessage Help Text:^MJob DLYBACKUP should be active at this time.',
        type: 'string',
        occurred: '1477958410' } },
  time: '1477958410' };

  data.push([entity, receiverName, expected]);

  return data;
};

module.exports.invalidEntities = function () {
  var data = [];
  var entity = {
    mapperName: 'type7',
    mapper:
    {
      fields: []
    },
    columns: []
  };
  var receiverName = 'iamReceiver';

  data.push([entity, receiverName]);

  entity = {
    mapperName: 'ith_announce',
    mapper:
    {
      fields: []
    },
    columns: []
  };
  receiverName = 'iamAnnounce';

  data.push([entity, receiverName]);

  entity = {
    mapperName: 'type9',
    mapper:
    {
      fields: []
    },
    columns: []
  };
  receiverName = 'iamForwarder';

  data.push([entity, receiverName]);
};

module.exports.invalidData = function () {
  var data = [];
  var timeNow =  Math.floor(Date.now() / 1000);
  var string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";

  var expected = {
    name: 'ITHW64SQL32',
    location: 'ITHW64SQL32',
    metrics: [ { name: 'physicalMemoryUsed',
       value: '24.51',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'caches',
       value: '211963904.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'copyRead',
       value: '1.96',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'copyReadHit',
       value: '100.00',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'dataMap',
       value: '104.63',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'dataMapHit',
       value: '100.00',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'committeds',
       value: '4257529856.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'frees',
       value: '3242147840.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'nonpagedPools',
       value: '77971456.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'pageFault',
       value: '70.94',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'pageIo',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'processCount',
       value: '53.00',
       type: 'int',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'threadCount',
       value: '521.00',
       type: 'int',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'rdRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'rdPacket',
       value: '0.01',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'serverRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'serverReq',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'pageFiless',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'pageFiles',
       value: '0.00',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'pageFilesMax',
       value: '0.00',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'contextSwitch',
       value: '284.96',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'cpuBusy',
       value: '0.37',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'cpuDpc',
       value: '0.03',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'cpuInterrupt',
       value: '0.01',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'cpuPrivileged',
       value: '0.21',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'cpuUser',
       value: '0.16',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'exception',
       value: '0.01',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileControlRate',
       value: '24634.58',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileControlIo',
       value: '47.31',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileIo',
       value: '2.67',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileReadRate',
       value: '9622.63',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileReadIo',
       value: '2.07',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileWriteRate',
       value: '1900.92',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'fileWriteIo',
       value: '0.60',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'interrupt',
       value: '1008.18',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'systemCall',
       value: '690.41',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'ipDgram',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'tcpSegment',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'udpDgram',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'httpRecvRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'httpSentRate',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgIsRpcOp',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgMtagByteRate',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgMtagRate',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgImcInboundsTotal',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgImcInboundgTotal',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgImcOutboundsTotal',
       value: '0.00',
       type: 'B',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'xcgImcOutboundgTotal',
       value: '0.00',
       type: 'ms',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'sqlConfigDataCache',
       value: '0',
       type: '%',
       occurred: '1435536065',
       createdAt: timeNow },
     { name: 'sqlIoPageRead',
       value: '0.00',
       type: 's',
       occurred: '1435536065',
       createdAt: timeNow } ],
    createdAt: timeNow
  };

  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:11#Performance Data#ServiceLevelAgreement#2015-06-29 00:01:11.000#00:01#ITHW64SQL32#305#Page File Space#Page files percent used#ITHW64SQL32#0.00#0.00#100.00#0.00#0.00##";

  expected = {
    name: 'ITHW64SQL32',
    location: 'ITHW64SQL32',
    metrics: { 'slaFailed': { name: 'slaFailed',
       value: '0.00',
       type: '%',
       occurred: '1435536071',
       createdAt: timeNow },
     'slaNonFailed': { name: 'slaNonFailed',
       value: '100.00',
       type: '%',
       occurred: '1435536071',
       createdAt: timeNow },
     'slaDegraded': { name: 'slaDegraded',
       value: '0.00',
       type: '%',
       occurred: '1435536071',
       createdAt: timeNow },
     'slaNonDegraded': { name: 'slaNonDegraded',
       value: '0.00',
       type: '%',
       occurred: '1435536071',
       createdAt: timeNow } },
    createdAt: timeNow
  };

  data.push([string, expected]);
  return data;
};

module.exports.validReceivers = function () {
  var data = [];
  var string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";

  var expected = {
    "receiver": "iamReceiver",
    "expect": [
      {
        "operator": "regEx",
        "value": "^9{1,2}#1.*#Performance Data"
      },
      {
        "operator": "endsWith",
        "value": "##"
      }
    ],
    "enabled": true,
    "type": "splitter",
    "delimiter": "#",
    "definition": {
      "column": 6,
      "modifier": "lcase",
      "remove": [0, -1, -2, 5, 6, 7, 8]
    }
  };

  data.push([string, expected]);
  return data;
};

module.exports.invalidInput = function () {
  var data = [];
  var string = "1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";
  var expected = "Invalid request. No receiver found for this message.";

  data.push([string, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#System#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00";
  data.push([string, expected]);
  return data;
};

module.exports.invalidMappers = function () {
  var data = [];
  var string = "9#1#ITHW64SQL32#29-JUN-2015#00:01:05#Performance Data#xyz#2015-06-29 00:01:05.000#00:01#900#ITHW64SQL32#24.51#211963904.00#1.96#100.00#104.63#100.00#4257529856.00#3242147840.00#77971456.00#70.94#0.00#53.00#521.00#0.00#0.01#0.00#0.00#1.00#0.00#0.00#0.00#284.96#0.37#0.03#0.01#0.21#1.00#0.16#0.01#24634.58#47.31#2.67#9622.63#2.07#1900.92#0.60#1008.18#690.41#19816634.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##";
  var receiver = {
    "expect": [
      {"operator": "beginsWith", "value": "9#"},
      {"operator": "endsWith", "value": "##"}
    ],
    "type": "splitter",
    "delimiter": "#",
    "definition": {
      "column": 6,
      "modifier": "lcase",
      "remove": [-1, -2, 0, 5, 6, 7, 8]
    }
  };

  var expected = 'Invalid request. Unknown mapping file.';

  data.push([string, receiver, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:15:00#Performance Data#SSpMerge#2015-06-29 00:15:00.000#00:15#ITHW64SQL32#Default#0.00#0.00##";

  data.push([string, receiver, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:15:00#Performance Data#SSLxStat#2015-06-29 00:15:00.000#00:15#ITHW64SQL32#Default#0.00#0.00#0.00##";

  data.push([string, receiver, expected]);

  string = "9#1#ITHW64SQL32#29-JUN-2015#00:15:00#Performance Data#Stpt#2015-06-29 00:15:00.000#00:15#ITHW64SQL32#Default#0.00#0.00#0.00##";

  data.push([string, receiver, expected]);
  return data;
};
