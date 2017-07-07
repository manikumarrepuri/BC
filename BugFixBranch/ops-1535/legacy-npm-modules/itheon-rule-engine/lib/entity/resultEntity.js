
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class ResultEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      "code": {"type": "string"},
      "message": {"type": "string"},
      "severity": {"type": "string"},
      "state": {"type": "string"},
      "matchedConditions": {"type": "object"}
    });

    if (data) {
      this.inflate(data);
    }
  }

  isSuccessful()
  {
    return this.get("code") == "success";
  }

  setSeverity(severity)
  {
    if (parseInt(severity) !== severity) {
      this.set("severity", parseInt(severity, 10));
    }

    return this;
  }

  getSeverity()
  {
    return this.get("severity");
  }
}

module.exports = ResultEntity;
