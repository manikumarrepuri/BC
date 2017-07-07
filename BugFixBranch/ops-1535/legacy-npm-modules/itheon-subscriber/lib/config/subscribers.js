var appRootPath = require("app-root-path");
var config = require("itheon-config").ConfigFactory.getConfig();

module.exports = {
  "itheon10.xAMQP": {
    "type": "amqp",
    "settings": {}
  },
  "itheon10.x7Event": {
    "type": "itheonX7Event",
    "settings": {
      "eventType": "Type7",
      "payload": "{{fullText}}",
      "endpoint": config.get('frontendApi:protocol') + config.get('frontendApi:host') + '/api/alerts',
      "strictSSL": config.get('frontendApi:strictSSL')
    }
  },
  "itheon10.xProblemEvent": {
    "type": "itheonXEvent",
    "settings": {
      "eventType": "problem",
      "endpoint": config.get('frontendApi:protocol') + config.get('frontendApi:host') + '/api/alerts',
      "strictSSL": config.get('frontendApi:strictSSL')
    }
  },
  "itheon10.xForwarder": {
    "type": "tcpSender",
    "settings": {
      "timeout": 5,
      "payload": "{{originalEvent}}",
      "successTest": "<[s|S]tatus>\s*SUCCESS\s*<\/[s|S]tatus>"
    }
  },
  "itheon10.xMailer": {
    "type": "mailer",
    "settings": {
      "transport": "smtps://127.0.0.1:25",
      "mailOptions": {
      }
    }
  },
  "itheon10.xFile": {
    "type": "file",
    "settings": {
      "payload": "{{originalEvent}}\n",
      "fileName":"{{appRootPath}}/logs/itheon_error_{{currentDateFile}}.evt"
    }
  },
  "itheon10.xSOAP": {
    "type": "soap",
    "settings": {
      "options": {}
    }
  },
  "itheon10.xSSH": {
    "type": "ssh",
    "settings": {}
  },
  "itheon10.xhttpSender": {
    "type": "httpSender",
    "settings": {
      "method": "POST",
      "json": true,
      "headers": {
        "content-type": "application/json",
      }
    }
  },
  "itheon10.xWebhook": {
    "type": "httpSender",
    "settings": {
      "method": "POST",
      "json": true,
      "headers": {
        "content-type": "application/json",
      }
    }
  },
  "itheon7.xProblemEvent": {
    "type": "itheonEvent",
    "settings": {
      "eventType": "7",
      "fileName": "/opt/itheon/logs/itheon_problem_events_{datetime}.evt"
    }
  }
}
