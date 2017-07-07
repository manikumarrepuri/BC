
var appRootPath        = require("app-root-path");

var AlertHistoryModule = require(appRootPath + "/lib/module/AlertHistory/alertHistoryModule.js");
var AlertModule        = require(appRootPath + "/lib/module/Alert/alertModule.js");
var DeviceAlertModule  = require(appRootPath + "/lib/module/Device/deviceAlertModule.js");
var DeviceModule       = require(appRootPath + "/lib/module/Device/deviceModule.js");
var TagModule          = require(appRootPath + "/lib/module/Tag/tagModule.js");
var UserModule         = require(appRootPath + "/lib/module/User/userModule.js");
var FilterModule       = require(appRootPath + "/lib/module/Filter/filterModule.js");

// var ScheduledReminderModule = require(appRootPath + "/lib/module/ScheduledReminder/scheduledreminder.js");
// var RuleModule              = require(appRootPath + "/lib/module/Rule/rule.js");
// var ReminderModule          = require(appRootPath + "/lib/module/Reminder/reminder.js");
// var PerformanceModule       = require(appRootPath + "/lib/module/Performance/performance.js");
// var MetricModule            = require(appRootPath + "/lib/module/Metric/metric.js");
// var AgentRuleModule         = require(appRootPath + "/lib/module/AgentRule/agentrule.js");
// var AclRuleModule           = require(appRootPath + "/lib/module/Acl/aclrules.js");
// var AclResourcesModule      = require(appRootPath + "/lib/module/Acl/aclresources.js");
// var AclModule               = require(appRootPath + "/lib/module/Acl/acl.js");

module.exports = function(router) {

// user resources
  router.get("/users", UserModule.find);
  router.get("/users/:id", UserModule.findById);
  router.post("/users", UserModule.create);
  router.patch("/users/:id", UserModule.update);
  // router.delete("/users/:id", UserModule.Routes.UserRoutes.delete.bind(UserModule.Routes.UserRoutes));

  // alert resources
  router.get("/alerts", AlertModule.find.bind(AlertModule));
  router.get("/alerts/:id", AlertModule.findById.bind(AlertModule));
  router.post("/alerts", AlertModule.create.bind(AlertModule));
  router.patch("/alerts/:id", AlertModule.update.bind(AlertModule));
  router.delete("/alerts/:id", AlertModule.delete.bind(AlertModule));

  // alert history resources
  router.get("/alert-histories", AlertHistoryModule.find);
  router.get("/alert-histories/:id", AlertHistoryModule.findById);
  router.post("/alert-histories", AlertHistoryModule.create);
  router.patch("/alert-histories/:id", AlertHistoryModule.update);
  // router.delete("/alert-histories/:id", AlertHistoryModule.Routes.AlertHistoryRoutes.delete.bind(AlertHistoryModule.Routes.AlertHistoryRoutes));

//   // tag resources
  router.get("/tags", TagModule.find);
  router.get("/tags/:id", TagModule.findById);
  router.post("/tags", TagModule.create);
  router.patch("/tags/:id", TagModule.update);
// router.delete("/tags/:id", TagModule.Routes.TagRoutes.delete.bind(TagModule.Routes.TagRoutes));

  // device resources
  router.get("/devices", DeviceModule.find);
  router.get("/devices/:id", DeviceModule.findById);
  router.post("/devices", DeviceModule.create);
  router.patch("/devices/:id", DeviceModule.update);

// device / alert resources
  router.get("/devices/:deviceId/alerts", DeviceAlertModule.find);
  router.get("/devices/:deviceId/alerts/:id", DeviceAlertModule.findById);
  router.post("/devices/:deviceId/alerts", DeviceAlertModule.create);
  router.patch("/devices/:deviceId/alerts/:id", DeviceAlertModule.update);
  router.delete("/devices/:deviceId/alerts/:alertId", DeviceAlertModule.delete);

// filter resources
  router.get("/filters", FilterModule.find);
  router.get("/filters/:id", FilterModule.findById);
  router.post("/filters", FilterModule.create);
  router.patch("/filters/:id", FilterModule.update);
// acl-roles resources
//   router.param("id", middleware.validatorMiddleware.id);
//   router.get("/acl/validate/user/:user/resource/:resource/action/:action", AclModule.Routes.AclRoutes.validate.bind(AclModule.Routes.AclRoutes));

  // acl-roles resources
//   router.get("/acl-roles", AclModule.Routes.AclRoleRoutes.find.bind(AclModule.Routes.AclRoleRoutes));
//   router.get("/acl-roles/:id", AclModule.Routes.AclRoleRoutes.findById.bind(AclModule.Routes.AclRoleRoutes));
//   router.post("/acl-roles", AclModule.Routes.AclRoleRoutes.create.bind(AclModule.Routes.AclRoleRoutes));
//   router.patch("/acl-roles/:id", AclModule.Routes.AclRoleRoutes.update.bind(AclModule.Routes.AclRoleRoutes));
  // router.delete("/acl-roles/:id", AclModule.Routes.AclRoleRoutes.delete.bind(AclModule.Routes.AclRoleRoutes));



  // acl-rules resources
  // router.get("/acl-rules", AclRuleModule.find);
  // router.get("/acl-rules/:id", AclRuleModule.findById);
  // router.post("/acl-rules", AclRuleModule.create);
  // router.patch("/acl-rules/:id", AclRuleModule.update);
  // router.delete("/acl-rules/:id", AclModule.Routes.AclRuleRoutes.delete.bind(AclModule.Routes.AclRuleRoutes));




  // acl-resources resources
  // router.get("/acl-resources", AclResourcesModule.find);
  // router.get("/acl-resources/:id", AclResourcesModule.findById);
  // router.post("/acl-resources", AclResourcesModule.create);
  // router.patch("/acl-resources/:id", AclResourcesModule.update);
  // router.delete("/acl-resources/:id", AclModule.Routes.AclResourceRoutes.delete.bind(AclModule.Routes.AclResourceRoutes));


//   // metric resources
//   router.get("/metrics", MetricModule.find);
//   router.get("/metrics/:id", MetricModule.findById);
//   router.post("/metrics", MetricModule.create);
//   router.patch("/metrics/:id", MetricModule.update);
//   // router.delete("/metrics/:id", MetricModule.Routes.MetricRoutes.delete.bind(MetricModule.Routes.MetricRoutes));

//   // performance resources
//   router.get("/performances", PerformanceModule.find);
//   router.get("/performances/:id", PerformanceModule.findById);
//   router.post("/performances", PerformanceModule.create);
//   router.patch("/performances/:id", PerformanceModule.update);

//   // reminder resources
//   router.get("/reminders", ReminderModule.find);
//   router.get("/reminders/:id", ReminderModule.findById);
//   router.post("/reminders", ReminderModule.create);
//   router.patch("/reminders/:id", ReminderModule.update);
//   // router.delete("/reminders/:id", ReminderModule.Routes.ReminderRoutes.delete.bind(ReminderModule.Routes.ReminderRoutes));

//   // reminder resources
//   router.get("/scheduled-reminders", ScheduledReminderModule.find);
//   router.get("/scheduled-reminders/:id", ScheduledReminderModule.findById);
//   router.post("/scheduled-reminders", ScheduledReminderModule.create);
//   router.patch("/scheduled-reminders/:id", ScheduledReminderModule.update);
//   // router.delete("/scheduledReminders/:id", ScheduledReminderModule.Routes.ReminderRoutes.delete.bind(ReminderModule.Routes.ReminderRoutes));

//   // rule resources
//   router.get("/rules", RuleModule.find);
//   router.get("/rules/:id", RuleModule.findById);
//   router.post("/rules", RuleModule.create);
//   router.patch("/rules/:id", RuleModule.update);
//   router.put("/rules/:id", RuleModule.update);
//   // router.delete("/rules/:id", RuleModule.Routes.RuleRoutes.delete.bind(RuleModule.Routes.RuleRoutes));

//   // agentRule resources
//   router.get("/agent-rules/tag-match", AgentRuleModule.tagMatch);
//   router.get("/agent-rules", AgentRuleModule.find);
//   router.get("/agent-rules/:id", AgentRuleModule.findById);
//   router.post("/agent-rules", AgentRuleModule.create);
//   router.patch("/agent-rules/:id", AgentRuleModule.update);
//   router.put("/agent-rules/:id", AgentRuleModule.update);

};
