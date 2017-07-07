
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class ScheduledReminderEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      actionBy: {"type": "date"},           //Deadline for the task to be completed by.
      defaultState: {"type": "string"},     //Initial state in the kanban board
      defaultAssignee: {"type": "string"},  //Initial assignee for the kanban board
      description:  {"type": "string"},     //Summary of what to do
      nextOccurrence: {"type": "date"},     //The next time the reminder will occur
      reminder: {"type": "string"},         //String that confines to later.js a schedule to be parsed once moved to a generated reminder.
      schedule: {"type": "string"},         //String that confines to later.js text parser
      status: {"type": "number"},           //Whether or not the reminder is deleted.
      tags:  {"type": "array"},             //Array of tags this reminder relates to
      type: {"type": "string"},             //Category of reminder (priority, backup etc.)
      procedureLink: {"type": "string"}     //Novo web address etc.
    });

    if (data) {
      this.inflate(data);
    }
  }

  getId()
  {
    return this.id;
  }

  setId(id)
  {
    return id;
  }
}

module.exports = ScheduledReminderEntity;
