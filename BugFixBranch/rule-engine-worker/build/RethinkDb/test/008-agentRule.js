
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports =r.tableCreate("AgentRule", {replicas: replicas}).then(function() {
  return r.table("AgentRule")
    .indexCreate("agentRuleId").run();
}).then(function() {
  var agentRules = [
    {
      "agentRuleId":  "7ade0b23-0db5-4deb-a3c6-951f63ff4eef",
      "content":  "RULE CPUBusy CONDITION x=y",
      "id":  "4ee4b2e8-f86f-43a1-b318-bf1e745fc1f2",
      "name":  "CPUBusy",
      "fileName": "cpu_busy.rul",
      "tags": [
        "system:customer:Nampack",
        "system:host:server1"
      ] ,
      "version":  "1461331518"
    },
    {
      "agentRuleId":  "7ade0b23-0db5-4deb-a3c6-951f63ff4eef",
      "content":  "RULE CPUBusy SELECTION x=y CONDITION x=y",
      "id":  "0a436afb-08e0-432c-92fe-322e2d316f40",
      "name":  "CPUBusy",
      "fileName": "cpu_busy.rul",
      "tags": [
        "system:customer:Nampack",
        "system:host:server1"
      ] ,
      "version":  "1461331558"
    },
    {
      "agentRuleId":  "44cda8b1-7924-4b9a-b203-190381664429",
      "content":  "RULE RAMBusy SELECTION x=y CONDITION x=y",
      "id":  "0ea55642-007c-4faf-abaa-f3e48da4514c",
      "name":  "RAMBusy",
      "fileName": "ram_busy.rul",
      "tags": [
        "system:customer:itheonx",
        "system:host:server1"
      ] ,
      "version":  "1461331558"
    },
    {
      "agentRuleId":  "44cda8b1-7924-4b9a-b203-190381664429",
      "content":  "RULE RAMBusy CONDITION x=y",
      "id":  "44cda8b1-7924-4b9a-b203-190381664429",
      "name":  "RAMBusy",
      "fileName": "ram_busy.rul",
      "tags": [
        "system:customer:itheonx",
        "system:host:server1"
      ] ,
      "version":  "1461331518"
    },
    {
      "agentRuleId":  "44cda8b1-7924-4b9a-b203-190381664429",
      "content":  "RULE RAMBusy",
      "id":  "3bcea27d-8fb2-4343-bdeb-7846a28086eb",
      "name":  "RAMBusy",
      "fileName": "ram_busy.rul",
      "tags": [
        "system:customer:itheonx",
        "system:host:server1"
      ] ,
      "version":  "1461331318"
    },
    {
      "agentRuleId":  "a3c6-0db5-4deb-7ade0b23-951f63ff4eef",
      "content":  "RULE CPUBusy" ,
      "id":  "a3c6-0db5-4deb-7ade0b23-951f63ff4eef",
      "name":  "CPUBusy" ,
      "fileName": "cpu_busy.rul",
      "tags": [
        "system:customer:Nampack"
      ] ,
      "version":  "1461331318"
    }
  ];

  return r.table("AgentRule").insert(agentRules).run();
});
