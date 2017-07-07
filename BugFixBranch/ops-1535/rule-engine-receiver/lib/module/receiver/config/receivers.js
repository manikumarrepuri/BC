module.exports = {
  "iamAnnounce": {
    "receiver": "iamAnnounce",
    "expect": [{
      "operator": "regEx",
      "value": "^9{1,2}#1.*#ITH_ANNOUNCE"
    },
    {
      "operator": "endsWith",
      "value": "##"
    }],
    "enabled": true,
    "type": "splitter",
    "delimiter": "#",
    "definition": {
      "column": 6,
      "modifier": "lcase",
      "remove": [0, -1, -2, 5, 6, 7]
    }
  },
  "iamReminder": {
    "receiver": "iamReminder",
    "expect": [{
      "operator": "regEx",
      "value": "^7#1.*#REMINDER#"
    },
    {
      "operator": "endsWith",
      "value": "##"
    }],
    "enabled": true,
    "type": "splitter",
    "delimiter": "#",
    "definition": {
      "column": 0,
      "modifier": {
        "text": "type"
      },
      "remove": [0, -1, -2]
    }
  },
  "iamPerformance": {
    "receiver": "iamReceiver",
    "expect": [
      {
        "operator": "regEx",
        "value": "^9#1.*#Performance Data"
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
  },
  "iamReceiver": {
    "receiver": "iamReceiver",
    "expect": [
      {
        "operator": "regEx",
        "value": "^[0-9]{1,2}#1"
      },
      {
        "operator": "endsWith",
        "value": "##"
      }
    ],
    "definition": {
      "column": 0,
      "modifier": {
        "text": "type"
      },
      "remove": [0, -1, -2]
    },
    "enabled": true,
    "type": "splitter",
    "delimiter": "#"
  }
};
