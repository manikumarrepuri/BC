
"use strict"

var appRoot = require('app-root-path');
var net     = require('net');
var client  = new net.Socket();

var counter = 0;
var host = '127.0.0.1';
var port = 2919;

//Overridable via command line param 1
var delay = 10000;
//Overridable via command line param 2


/*
var messages = [

  "7#1#Gala::NCHP2000#31-OCT-2016#23:59:15#U#HPP2000#HPAvailable#1#0#HPAvailable#WKSE99PXIGWY01|         1#09-SEP-2016#05:21:07###12561#iAM#HP P2000 is unavailable.#Additional support information.^MBlue Chip Novo Reference: GAL676^MAvailable               : No##",
  "7#1#Kuehne + Nagel::KN-CDP-01#01-NOV-2016#00:05:00#C#FalconstorCDP#CDPEventLog#5#0#CDPEventLog#11304#01-NOV-2016#00:05:00#01-NOV-2016#00:05:00#253#iAM#User root at IP address 10.44.56.106 authenticated.#Additional support information." +
  "Blue Chip Novo Reference: KNA604" +
  "Event Type              : I" +
  "Event Date & Time       : 11/01/2016 00:05:00" +
  "Event Log ID            : 11304" +
  "Event Log Message       : User root at IP address 10.44.56.106 authenticated.##",


  "7#1#Societe Generale::SGSSDOLD#01-NOV-2016#00:00:10#U#I-Series#ITHEON#2#0#BBD0142#SGSSDOLD-06D27FP 027770/ITHEON/JOBMONITOR|Job DLYBACKUP in subsystem QSYSWRK is not active#31-OCT-2016#23:05:09###12#Itheon#BBD0142 - Job DLYBACKUP in subsystem QSYSWRK is not active#System : SGSSDOLD^MSerial Number : 06D27FP^MMessage Queue : ITHEON/ITHMSGQ^MJob : 027770/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0142^MSeverity :        70^MMessage Details:^MJob DLYBACKUP in subsystem QSYSWRK is not active^MAdditional Text:^M^MMessage Help Text:^MJob DLYBACKUP should be active at this time.##"
  "7#1#Movianto::SGBBC1PWAP13#01-NOV-2016#00:00:07#U#CentOSLinux#CentOSLinuxLoadAverage#2#0#CentOSLinuxLoadAverage#SGBBC1PWAP13|         1#09-JUN-2016#19:10:04###41536#iAM#CentOS Linux load average is 34.83.#Additional support information.^MBlue Chip Novo Reference : MOV612^MLoad Average (1 minute)  : 36.64^MLoad Average (5 minutes) : 34.83^MLoad Average (15 minutes): 31.37^M^MMonitor Threshold        : 5.00^MOccurrence Threshold     : 6^MConsecutive Occurrences  : 41536##",
  "7#1#Brooks MacDonald::BCA-BRU-HI-01#01-NOV-2016#00:00:01#N#WINDOWSSERVICE#WINDOWS#2#0#MICROSOFTWINDOWSSERVICES#DataStore32#01-NOV-2016#00:00:01###1#itheonadmin#Microsoft Windows service DataStore32 has stopped.#Additional information.^MBlue Chip Novo Reference: BRO603^MDisplay Name            : DataStore32^MStart Type              : AUTO_START^MState                   : STOPPED^MName                    : DataStore32^MPath Name               : C:\Program Files (x86)\Hitec Laboratories\DataStore32\DS32Service.exe^MDependant Services      : ##",
  "7#1#UMG::USFSH23#01-NOV-2016#00:00:16#N#I-Series#ITHEON#4#0#BBD0301#USFSH23-219386W 511259/ITHEON/JOBMONITOR|A maintenance window has been started by user ITHEON.#01-NO" +
  "V-2016#00:00:09###1#Itheon#BBD0301 - A maintenance window has been started by user ITHEON.^MJob Name: JOBMONITOR  Job User: ITHEON  Job Number: 511259 ^M#System : USFSH23^MSerial Number : 219386W^MMessage Queue : ITHEON/ITHMSGQ^MJob : 511259/ITHEON/JOBMONITOR^MJob Type : B^MProgram : QMHSNUSR^MMessage ID : BBD0301^MSeverity : 20^MMessage Details:^MA maintenance window has been started by user ITHEON.^MAdditional Text:^MJob Name: JOBMONITOR  Job User: ITHEON  Job Number: 511259 ^M^MMessage Help Text:^MStart time = 2016-11-01-00.00.09.157000^M Expiry time = 2016-11-01-00.10.10.157000^M Monitors affected:^M  *MSGID##",
  "7#1#DRS::PRODBDCWEB02#01-NOV-2016#00:01:05#N#DRSWINDOWS#SERVICE#2#0#SERVICE_NOT_RUNNING#RemoteRegistry#19-OCT-2016#16:20:00###1#itheonadmin#The service Remote Registry is not running.#The service type of Remote Registry is WIN32_SHARE_PROCESS." +
  "The service provided by the Remote Registry" +
  "service will not be available to users of this computer.##"

];
*/

var messages = [
  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:50:11#Performance Data#OS400System#2016-06-26 23:50:11.189#23:50#CORAL40L#99.3#999999#99.018#99.257#1395864#99.0632#1395864#9959#14248#1#2b5165824#2#1#99.80#1#999999#163520#0#1#1#25165824##",
  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:55:11#Performance Data#OS400System#2016-06-26 23:55:11.189#23:55#CORAL40L#0.3#23354#0.018#0.257#1395864#60.0632#1395864#9959#14248#1#25165824#2#1#0.80#1#267#163520#0#1#1#25165824##"
];

/*
var messages = [

  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:50:11#Performance Data#OS400System#2016-06-26 23:50:11.189#23:50#CORAL40L#99.3#999999#99.018#99.257#1395864#99.0632#1395864#9959#14248#1#2b5165824#2#1#99.80#1#999999#163520#0#1#1#25165824##",
  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:55:11#Performance Data#OS400System#2016-06-26 23:55:11.189#23:55#CORAL40L#0.3#23354#0.018#0.257#1395864#60.0632#1395864#9959#14248#1#25165824#2#1#0.80#1#267#163520#0#1#1#25165824##",

  "9#1#Miki Travel::B2BMSI2#27-JUN-2016#00:00:11#Performance Data#UnixSystem#2016-06-27 00:00:11.000#00:00#B2BMSI2#152245526528.00#11762200576.00#99.00#4194296#4194296#99.19#99.00#99.54#99.27#99.00#99.00#0#0#92.27#99.00#99.81#99.00#99.00#99.00#99.00##",
  "9#1#Miki Travel::B2BMSI2#27-JUN-2016#00:05:11#Performance Data#UnixSystem#2016-06-27 00:05:11.000#00:05#B2BMSI2#152245526528.00#11762200576.00#0.00#4194296#4194296#79.19#0.00#1.54#19.27#0.00#0.00#0#0#2.27#0.00#20.81#0.00#0.00#0.00#0.00##",

  "9#1#Greenhams::NIMserver#27-JUN-2016#00:00:11#Performance Data#UnixSystem#2016-06-27 00:00:11.000#00:00#B2BMSI2#152245526528.00#11762200576.00#99.00#4194296#4194296#99.19#99.00#99.54#99.27#99.00#99.00#0#0#92.27#99.00#99.81#99.00#99.00#99.00#99.00##",
  "9#1#Greenhams::NIMserver#27-JUN-2016#00:05:11#Performance Data#UnixSystem#2016-06-27 00:05:11.000#00:05#B2BMSI2#152245526528.00#11762200576.00#0.00#4194296#4194296#79.19#0.00#1.54#19.27#0.00#0.00#0#0#2.27#0.00#20.81#0.00#0.00#0.00#0.00##",

  "9#1#Greenhams::NIMserver#27-JUN-2016#00:00:11#Performance Data#UnixFilesystem#2016-06-27 00:00:11.000#00:00#NIMserver#/export#112994562048.00#112994562048.00#24175955968.00#24521603#0#137170518016.00#24548205#97.62#2.38#99.11#0.89##",
  "9#1#Greenhams::NIMserver#27-JUN-2016#00:00:16#Performance Data#UnixFilesystem#2016-06-27 00:00:16.000#00:05#NIMserver#/export#112994562048.00#112994562048.00#24175955968.00#24521603#0#137170518016.00#24548205#17.62#82.38#0.11#99.89##",

  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:50:11#Performance Data#OS400System#2016-06-26 23:50:11.189#23:50#CORAL40L#99.3#999999#99.018#99.257#1395864#99.0632#1395864#9959#14248#1#2b5165824#2#1#99.80#1#999999#163520#0#1#1#25165824##",
  "9#1#Coral leisure::CORAL40L#26-JUN-2016#23:55:11#Performance Data#OS400System#2016-06-26 23:55:11.189#23:55#CORAL40L#0.3#23354#0.018#0.257#1395864#60.0632#1395864#9959#14248#1#25165824#2#1#0.80#1#267#163520#0#1#1#25165824##",

  "9#1#Miki Travel::B2BMSI2#27-JUN-2016#00:00:11#Performance Data#UnixSystem#2016-06-27 00:00:11.000#00:00#B2BMSI2#152245526528.00#11762200576.00#99.00#4194296#4194296#99.19#99.00#99.54#99.27#99.00#99.00#0#0#92.27#99.00#99.81#99.00#99.00#99.00#99.00##",
  "9#1#Miki Travel::B2BMSI2#27-JUN-2016#00:05:11#Performance Data#UnixSystem#2016-06-27 00:05:11.000#00:05#B2BMSI2#152245526528.00#11762200576.00#0.00#4194296#4194296#79.19#0.00#1.54#19.27#0.00#0.00#0#0#2.27#0.00#20.81#0.00#0.00#0.00#0.00##",

  "9#1#Greenhams::NIMserver#27-JUN-2016#00:00:11#Performance Data#UnixFilesystem#2016-06-27 00:00:11.000#00:00#NIMserver#/export#112994562048.00#112994562048.00#24175955968.00#24521603#0#137170518016.00#24548205#97.62#2.38#99.11#0.89##",
  "9#1#Greenhams::NIMserver#27-JUN-2016#00:00:16#Performance Data#UnixFilesystem#2016-06-27 00:00:16.000#00:05#NIMserver#/export#112994562048.00#112994562048.00#24175955968.00#24521603#0#137170518016.00#24548205#17.62#82.38#0.11#99.89##",

  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:41:05#Performance Data#System#2016-06-26 23:41:05.000#23:41#300#UKBCEWSSQL002#93.74#221069312.00#7.44#100.00#118.42#100.00#9159163904.00#537612288.00#73998336.00#204.38#0.15#77.00#936.00#721.14#90.01#661.50#93.84#92.00#99.00#99.00#99.00#1518.18#96.28#0.02#0.01#1.82#999.00#4.46#0.03#23848.23#217.73#136.07#27397.64#116.10#10567.21#19.97#1040.59#284269.25#130744.70#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#99.00#0#99.00#99.00#99.00#99.00##",
  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:46:05#Performance Data#System#2016-06-26 23:46:05.000#23:46#300#UKBCEWSSQL002#3.74#221069312.00#7.44#100.00#118.42#100.00#9159163904.00#537612288.00#73998336.00#204.38#0.15#77.00#936.00#721.14#0.01#661.50#3.84#2.00#0.00#0.00#0.00#1518.18#6.28#0.02#0.01#1.82#0.00#4.46#0.03#23848.23#217.73#136.07#27397.64#116.10#10567.21#19.97#1040.59#284269.25#130744.70#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0.00#0#0.00#0.00#0.00#0.00##",

  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:50:11#Performance Data#System#2016-06-26 23:50:11.189#23:50#UKBCEWSSQL002#99.3#999999#99.018#99.257#1395864#99.0632#1395864#9959#14248#1#2b5165824#2#1#99.80#1#999999#163520#0#1#1#25165824##",
  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:46:05#Performance Data#Disks#2016-06-26 23:46:05.000#23:46#UKBCEWSSQL002#C#SYSTEM#51096#97.81#90.19#1.31#8297.79#6334.21#2.65#0.04#0.00#0.34#999##",
  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:46:05#Performance Data#Disks#2016-06-26 23:46:05.000#23:46#UKBCEWSSQL002#C#SYSTEM#51096#17.81#2.19#1.31#8297.79#6334.21#2.65#0.04#0.00#0.34#0##",
  "9#1#UMGi::UKBCEWSSQL002#26-JUN-2016#23:46:05#Performance Data#Disks#2016-06-26 23:46:05.000#23:46#UKBCEWSSQL002#C#SYSTEM#51096#17.81#2.19#1.31#8297.79#6334.21#2.65#0.04#0.00#0.34#70##"

];

*/

/*
var messages = [
  "7#1#Nampak::NMI50101#18-JUL-2016#21:45:00#U#REMINDER#BBD9001#6#0#BBD9001Nampak1630check##13-JUL-2016#00:05:00###6#itheonadmin#Nampak - NMi50101 - Please ensure that a tape is labelled & initialised ready for the monthly Option21 full system save at 12:30am, Novo Ref: NKP520#Additional support information.\n\nBlue Chip Novo Reference: NPK520\nServers used in check: NMI50101\nSupport Team: OS400\nTask to be completed at: ASAP##",
  "7#1#Nampak::Helpdesk#18-JUL-2016#21:45:00#U#REMINDER#BBD9001#6#0#BBD9001Nampak1630check##13-JUL-2016#00:05:00###6#itheonadmin#Nampak Plastics - The IT Services Desk will switch over to Bluechip Operations - in half an hour, please test connectivity, Novo Ref: NPK405#Additional support information.\n\nBlue Chip Novo Reference: NPK405\nServers used in check: Various\nSupport Team: Customer Helpdesk\nTask to be completed at: ASAP##",
  "7#1#VTB::PRODLDN#18-JUL-2016#21:45:00#U#REMINDER#BBD9001#6#0#BBD9001VTBCOBCheck9##13-JUL-2016#00:05:00###6#itheonadmin#VTB Bank - EMAIL - Ensure VTB Daily Report for the London COB has been completed and sent, Novo Ref: VTB508#Additional support information.\n\nBlue Chip Novo Reference: VTB508\nServers used in check: PRODLDN\nSupport Team: Customer\nTask to be completed at: ASAP##",
  "7#1#Abbott Diabetes::MEDIUK#18-JUL-2016#00:05:00#U#REMINDER#BBD9001#6#0#BBD9001ABBOTTDEAMAINTCHECK##13-JUL-2016#00:05:00###6#itheonadmin#Abbott Diabetes Care - MEDIUK - Check if ONJOB is still running, if so please cancel the DEAMAINTRPT job as per ADC604  & check there are no outstanding transactions to process.#Additional support information.\n\nBlue Chip Novo Reference: ADC604\nServers used in check: MEDIUK\nSupport Team: OS400\nTask to be completed at: ASAP##",
  "7#1#QuickEDD::QuickEDD Checks#18-JUL-2016#00:05:00#U#REMINDER#BBD9001#6#0#BBD9001BLUECHIPQUICKEDD##12-JUL-2016#20:05:00###32#itheonadmin#QuickEDD Checks - Please check for any NOK issues on all EDD customers listed in procedure EDD502#Additional support information.\n\nBlue Chip Novo Reference: EDD502\nServers used in check: See list\nSupport Team: OS400\nTask to be completed at: ASAP##",
  "7#1#Antalis::WTSEQ01#18-JUL-2016#00:00:00#U#REMINDER#BBD9001#6#0#BBD9001ANTALISBATCHQUEUECHECK##12-JUL-2016#21:00:00###42#itheonadmin#Antalis RS6000 - ANTFIN1/WTSEQ01 - Check batch queue status. Check for FAILED TASKS by selecting the UniQBatch options 1 & 2 from the operations menu, Novo Ref: ANP510 #Additional support information.\n\nBlue Chip Novo Reference: ANP510\nServers used in check: WTSEQ01 / ANTFIN1\nSupport Team: Unix\nTask to be completed at: ASAP##"
]
*/

/*
var messages = [
  "7#1#OpServe::TEST-WIN-2008R2#30-JUN-2016#10:25:17#U#AgentUpdate#failure#2#0#AgentUpdate#OpServe::TEST-WIN-2008R2|AgentUpdate|microsoftwindows2008#30-JUN-2016#10:25:16###2##Package microsoftwindows2008 update from version 1467277903.0 to version 1467278452.0 has failed.#Package microsoftwindows2008 update from version 1467277903.0 to version 1467278452.0 has failed. The reason given was : Code=5= " +
  "*****************************************************************************" +
   "Update failed for process microsoftwindows2008" +
   "Recovery procedures were initiated but these failed too." +
   "Reason given was :      FileSet::restoreFiles:Failed to Restore  C:\Program Files (x86)\Itheon\AgentUpdate\storage\microsoftwindows2008\backup\microsoftwindows2008.rul to C:\ProgramData\itheon\iAM\processes\microsoftwindows2008.rul" +
   "Reason given was : Input/output error" +
   "Manual recovery is now required." +
  "*****************************************************************************##",

  "7#1#Brighthouse::CFLHA01#15-JUN-2016#14:20:11#N#AgentUpdate#success#4#0#AgentUpdate#Brighthouse::CFLHA01|AgentUpdate|CPUBusy#15-JUN-2016#14:20:11###1##Process CPUBusy update from version Unknown. to version 1468318857.0 has started.#Process CPUBusy update from version Unknown. to version 1461331558.0 has started.##",

  "7#1#Brighthouse::CFLHA01#15-JUN-2016#14:20:11#N#AgentUpdate#success#4#0#AgentUpdate#Brighthouse::CFLHA01|AgentUpdate|CPUBusy#15-JUN-2016#14:20:11###1##Process CPUBusy update from version Unknown. to version 1468318857.0 has completed successfully.#Process CPUBusy update from version Unknown. to version 1461331558.0 has completed successfully.##",

  "7#1#Brighthouse::CFLHA01#15-JUN-2016#14:20:11#N#AgentUpdate#success#4#0#AgentUpdate#Brighthouse::CFLHA01|AgentUpdate|CPUBusy#15-JUN-2016#14:20:11###1##Process CPUBusy update from version Unknown. to version 1468318857.0 has completed failed.#Process CPUBusy update from version Unknown. to version 1461331558.0 has failed.##",
];
*/


function SocketClient(host, port) {
  var client;

  this.client = new net.Socket();
  client = this.client;
  this.client.on('close', () => {
    console.log("Info: Socket connection closed.\n");
    var new_wrapper = new SocketClient(host, port);

    client.destroy();

    if(messages.length-1 < counter || !messages[counter]) {
      console.log('Info: Completed sending ' + counter + ' messages, all done!');
      return false;
    }

    setTimeout(() => { new_wrapper.start()  }, delay);
  });
  this.client.on('data', (data) => {
    console.log('Info: Data received: ' + data);
  });
  this.client.on('error', (error) => {
    console.log("Info: Error", error);
  });
  this.start = function() {
    this.client.connect(port, host, () => {
      console.log('Info: Eda Mock connected to ' + host + ':' + port);
      console.log('Info: Sending message ' + (counter+1) + ': ' + messages[counter]);
      client.write(messages[counter]);
      counter++;
    });
  };
};

//Check if the delay is being overridden
if(process.argv[2] && (!isNaN(parseFloat(process.argv[2])) && isFinite(process.argv[2]))) {
  delay = process.argv[2] * 1000;
}

//check if the messages are being overridden
if(process.argv[3]) {
  console.log('Info: Loading messages from file, ' + process.argv[3]);

  var fs = require('fs');
  try {
    messages = fs.readFileSync(process.argv[3]).toString().split("\n");
  } catch (e) {
    console.log('Error reading file, does it exist?');
    return false;
  }
}

console.log(
  "Sending " + messages.length + " messages 1 by 1 with a delay of " + (delay / 1000) + " seconds\n",
  "=".repeat(50) + "\n"
);

var wrapper = new SocketClient(host, port);
wrapper.start();
