var os          = require('os');
var appRootPath = require('app-root-path');
var common      = require('opserve-common');
var _           = common.utilities.underscore;
const config    = common.Config.get();
var moment      = require('moment');

module.exports = function(variables) {
  Object.defineProperties(variables, {
    action: {
      get: function() {
        if (!this.subscribers || _.size(this.subscribers) != 1) {
          return false;
        }
        return Object.keys(this.subscribers)[0];
      },
      enumerable: true
    },
    actionFailed: {
      value: false,
      enumerable: true
    },
    actionError: {
      get: function() {
        if (!this.subscribers || _.size(this.subscribers) != 1) {
          return false;
        }

        //If we have an error action return that
        if(this.subscribers.onError) {
          return this.subscribers.onError;
        }

        //Otherwise this probably is the error action
        return Object.keys(this.subscribers)[0];
      },
      enumerable: true
    },
    appRootPath: {
      value: appRootPath.path,
      enumerable: true
    },
    closeDate: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format("DD-MM-YYYY");
      },
      enumerable: true
    },
    closeTimeStamp: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('X');
      },
      enumerable: true
    },
    closeDay: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('ddd');
      },
      enumerable: true
    },
    closeDayNum: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('DD');
      },
      enumerable: true
    },
    closeMonth: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('MMMM');
      },
      enumerable: true
    },
    closeMonthNum: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('MM');
      },
      enumerable: true
    },
    closeMonthShort: {
      enumerable: true,
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('MMM');
      }
    },
    closeHour: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('HH');
      },
      enumerable: true
    },
    closeMinute: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('mm');
      },
      enumerable: true
    },
    closeSecond: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('ss');
      },
      enumerable: true
    },
    closeTime: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('HH:mm:ss');
      },
      enumerable: true
    },
    closeYear: {
      get: function() {
        if (!this.closeDateTime) {
          return false;
        }
        return moment(this.closeDateTime).format('YYYY');
      },
      enumerable: true
    },
    computer: {
      get: function() {
        if (!this.group || !this.name) {
          return false;
        }
        return this.group + ':' + this.name;
      },
      enumerable: true
    },
    computerOnly: {
      get: function() {
        if (!this.computerName) {
          return false;
        }
        return this.computerName;
      },
      enumerable: true
    },
    creationDate: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format("DD-MM-YYYY");
      },
      enumerable: true
    },
    creationTimeStamp: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('X');
      },
      enumerable: true
    },
    creationDay: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('ddd');
      },
      enumerable: true
    },
    creationDayNum: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('DD');
      },
      enumerable: true
    },
    creationMonth: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('MMMM');
      },
      enumerable: true
    },
    creationMonthNum: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('MM');
      },
      enumerable: true
    },
    creationMonthShort: {
      enumerable: true,
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('MMM');
      }
    },
    creationHour: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('HH');
      },
      enumerable: true
    },
    creationMinute: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('mm');
      },
      enumerable: true
    },
    creationSecond: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('ss');
      },
      enumerable: true
    },
    creationTime: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('HH:mm:ss');
      },
      enumerable: true
    },
    creationYear: {
      get: function() {
        if (!this.creationDateTime) {
          return false;
        }
        return moment(this.creationDateTime).format('YYYY');
      },
      enumerable: true
    },
    currentDateTime: {
      value: new Date(),
      enumerable: true
    },
    currentDate: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format("DD-MM-YYYY");
      },
      enumerable: true
    },
    currentDateCompare: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format("YYYY-MM-DD");
      },
      enumerable: true
    },
    currentDateDisplay: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format("DD-MM-YYYY");
      },
      enumerable: true
    },
    currentDateFile: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format("YYYY_MM_DD");
      },
      enumerable: true
    },
    currentTimeStamp: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('X');
      },
      enumerable: true
    },
    currentDay: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('ddd');
      },
      enumerable: true
    },
    currentDayNum: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('DD');
      },
      enumerable: true
    },
    currentMonth: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('MMMM');
      },
      enumerable: true
    },
    currentMonthNum: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('MM');
      },
      enumerable: true
    },
    currentMonthShort: {
      enumerable: true,
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('MMM');
      }
    },
    currentHour: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('HH');
      },
      enumerable: true
    },
    currentMinute: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('mm');
      },
      enumerable: true
    },
    currentSecond: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('ss');
      },
      enumerable: true
    },
    currentTime: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('HH:mm:ss');
      },
      enumerable: true
    },
    currentYear: {
      get: function() {
        if (!this.currentDateTime) {
          return false;
        }
        return moment(this.currentDateTime).format('YYYY');
      },
      enumerable: true
    },
    currentComputer: {
      get: function() {
        return os.hostname();
      },
      enumerable: true
    },
    databaseName: {
      get: function() {
        return "";
      },
      enumerable: true
    },
    eventDate: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format("DD-MM-YYYY");
      },
      enumerable: true
    },
    eventTimeStamp: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('X');
      },
      enumerable: true
    },
    eventDay: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('ddd');
      },
      enumerable: true
    },
    eventDayNum: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('DD');
      },
      enumerable: true
    },
    eventMonth: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('MMMM');
      },
      enumerable: true
    },
    eventMonthNum: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('MM');
      },
      enumerable: true
    },
    eventMonthShort: {
      enumerable: true,
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('MMM');
      }
    },
    eventHour: {
      get: function() {
        if (!this.eventDateTime) {
            return false;
        }
        return moment(this.eventDateTime).format('HH');
      },
      enumerable: true
    },
    eventMinute: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('mm');
      },
      enumerable: true
    },
    eventSecond: {
      get: function() {
        if (!this.eventDateTime) {
            return false;
        }
        return moment(this.eventDateTime).format('ss');
      },
      enumerable: true
    },
    eventTime: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('HH:mm:ss');
      },
      enumerable: true
    },
    eventYear: {
      get: function() {
        if (!this.eventDateTime) {
          return false;
        }
        return moment(this.eventDateTime).format('YYYY');
      },
      enumerable: true
    },
    ruleName: {
      get: function() {
        if (!this.subscribers || _.size(this.subscribers) != 1) {
          return false;
        }

        if(this.subscribers.ruleName) {
          return this.subscribers.ruleName;
        }
      },
      enumerable: true
    },
    socket: {
      get: function() {
        return config.get('server:port');
      },
      enumerable: true
    },
    statCount: {
      get: function() {
        var counts = _.countBy(_.keys(this), function(key) {
          return (/stat[0-9]{1,}/.test(key)) == true ? 'stats' : 'other';
        });
        return counts['stats'];
      },
      enumerable: true
    }
  });

  return variables;
};

/*
??What is this?? CONTEXT
Identifier used by problem events.
DATABASE
The database that the database event will update. Equivalent to CLASS
DESTINATION_COMPUTERThe name or ip address as specified in the HOST_NAME parameter in the initialisation file.
The default value for HOST_NAME (empty string) will be returned if HOST_NAME is not specified
in the initialisation file.
??What is this?? ENTITY
Equivalent to the value of {CONTEXT} but without the vertical bar and all data to left of it.
??What is this?? HANDLE_NUMBER
Numeric identifier used by problem events. Equivalent to ROBOMON_HANDLE. Use of this field has been deprecated.
??What is this?? HELPDESK_HANDLE
Textual identifier used by problem events.
ROBOEDA
RoboEDA installation directory.
SITE
An identifier for a logical group of machines. If present the site id can be found embedded
within the HOST/NODE/COMPUTER value. The format used is <site id>::<Host/Node/Computer Name>.
SITE1
An identifier for a logical sub grouping of the SITE value. A SITE value (see above) can be broken down further
into a maximum of three components. The format used is <site 1>:<site2>:<site 3>.
SITE2
Second sub-component of SITE. See SITE and SITE1 above.
SITE3
Third sub-component of SITE. See SITE and SITE1 above.
will be returned if SOCKET is not specified in the initialisation file.
??What is it talking about?? STAT_JUSTIFY_#
The justification state of the #th statistic recorded in a statistical event. (Number replaces # sign).
??How is that even possible?? STAT_NAME_#
The name of the #th statistic recorded in a statistical event . (Number replaces # sign).
TABLE
The table name that the database event will update. Equivalent to SUB_CLASS
TYPE_TEXT
The iAM:Servers event type in words rather than the number representation as above for TYPE.
TYPE to TYPE_TEXT mappings are: 1) MESSAGE, 2) TEXT, 3) SATISTICAL, 4) OPCOM, 5) SECURITY, 6) USER, 7) PROBLEM, 8)
Windows
UNIQUE_ID
Creates a unique alpha-numeric string based on the current node, current date/time and a counter.
UPDATE_COUNT
The number of events generated for a problem since it occurred.
USER
User associated with this event.
VALID
Set to 1 if the event is to be processed or 0 if it has been actioned (deleted).
*/
