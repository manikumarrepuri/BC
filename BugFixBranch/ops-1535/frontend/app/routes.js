
"use strict";

const appRootPath             = require("app-root-path");
const AclModule               = require("../lib/module/Acl");
const AlertModule             = require("../lib/module/Alert");
const AlertHistoryModule      = require("../lib/module/AlertHistory");
const FilterModule            = require("../lib/module/Filter");
const UserModule              = require("../lib/module/User");
const DeviceModule            = require("../lib/module/Device");
const ReminderModule          = require("../lib/module/Reminder");
const ScheduledReminderModule = require("../lib/module/ScheduledReminder");
const PerformanceModule       = require("../lib/module/Performance");
const RuleModule              = require("../lib/module/Rule");
const AgentRuleModule         = require("../lib/module/AgentRule");
const TagModule               = require("../lib/module/Tag");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function ensureAuthenticatedApi(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(403).json('Forbidden');
}

module.exports = function (router, passport) {

  // ------------------------------------------------------------------------------
  // ---------------------------------- API URLS ----------------------------------
  // ------------------------------------------------------------------------------

  router.get("/api/acl/validate/user/:user/resource/:resource/action/:action", AclModule.Routes.AclApiRoutes.find.bind(AclModule.Routes.AclApiRoutes));

  // acl-role resources
  router.get('/api/acl-roles', ensureAuthenticatedApi, AclModule.Routes.AclRoleApiRoutes.find.bind(AclModule.Routes.AclRoleApiRoutes));
  router.get('/api/acl-roles/schema', ensureAuthenticatedApi, AclModule.Routes.AclRoleApiRoutes.getSchema.bind(AclModule.Routes.AclRoleApiRoutes));
  router.get('/api/acl-roles/:id', ensureAuthenticatedApi, AclModule.Routes.AclRoleApiRoutes.findById.bind(AclModule.Routes.AclRoleApiRoutes));
  router.post('/api/acl-roles', ensureAuthenticatedApi, AclModule.Routes.AclRoleApiRoutes.create.bind(AclModule.Routes.AclRoleApiRoutes));
  router.put('/api/acl-roles/:id', ensureAuthenticatedApi, AclModule.Routes.AclRoleApiRoutes.update.bind(AclModule.Routes.AclRoleApiRoutes));

  // acl-rule resources
  router.get('/api/acl-rules', ensureAuthenticatedApi, AclModule.Routes.AclRuleApiRoutes.find.bind(AclModule.Routes.AclRuleApiRoutes));
  router.get('/api/acl-rules/schema', ensureAuthenticatedApi, AclModule.Routes.AclRuleApiRoutes.getSchema.bind(AclModule.Routes.AclRuleApiRoutes));
  router.get('/api/acl-rules/:id', ensureAuthenticatedApi, AclModule.Routes.AclRuleApiRoutes.findById.bind(AclModule.Routes.AclRuleApiRoutes));
  router.post('/api/acl-rules', ensureAuthenticatedApi, AclModule.Routes.AclRuleApiRoutes.create.bind(AclModule.Routes.AclRuleApiRoutes));
  router.put('/api/acl-rules/:id', ensureAuthenticatedApi, AclModule.Routes.AclRuleApiRoutes.update.bind(AclModule.Routes.AclRuleApiRoutes));

  // acl-resource resources
  router.get('/api/acl-resource', ensureAuthenticatedApi, AclModule.Routes.AclResourceApiRoutes.find.bind(AclModule.Routes.AclResourceApiRoutes));
  router.get('/api/acl-resource/schema', ensureAuthenticatedApi, AclModule.Routes.AclResourceApiRoutes.getSchema.bind(AclModule.Routes.AclResourceApiRoutes));
  router.get('/api/acl-resource/:id', ensureAuthenticatedApi, AclModule.Routes.AclResourceApiRoutes.findById.bind(AclModule.Routes.AclResourceApiRoutes));
  router.post('/api/acl-resource', ensureAuthenticatedApi, AclModule.Routes.AclResourceApiRoutes.create.bind(AclModule.Routes.AclResourceApiRoutes));
  router.put('/api/acl-resource/:id', ensureAuthenticatedApi, AclModule.Routes.AclResourceApiRoutes.update.bind(AclModule.Routes.AclResourceApiRoutes));

  // user resources
  router.get('/api/users', ensureAuthenticatedApi, UserModule.Routes.ApiRoutes.find.bind(UserModule.Routes.ApiRoutes));
  router.get('/api/users/schema', ensureAuthenticatedApi, UserModule.Routes.ApiRoutes.getSchema.bind(UserModule.Routes.ApiRoutes));
  router.get('/api/users/:id', ensureAuthenticatedApi, UserModule.Routes.ApiRoutes.findById.bind(UserModule.Routes.ApiRoutes));
  router.post('/api/users', ensureAuthenticatedApi, UserModule.Routes.ApiRoutes.create.bind(UserModule.Routes.ApiRoutes));
  router.put('/api/users/:id', ensureAuthenticatedApi, UserModule.Routes.ApiRoutes.update.bind(UserModule.Routes.ApiRoutes));

  // alert resources
  router.get('/api/alerts', ensureAuthenticatedApi, AlertModule.Routes.ApiRoutes.find.bind(AlertModule.Routes.ApiRoutes));
  router.get('/api/alerts/schema', ensureAuthenticatedApi, AlertModule.Routes.ApiRoutes.getSchema.bind(AlertModule.Routes.ApiRoutes));
  router.get('/api/alerts/:id', ensureAuthenticatedApi, AlertModule.Routes.ApiRoutes.findById.bind(AlertModule.Routes.ApiRoutes));
  router.post('/api/alerts', AlertModule.Routes.ApiRoutes.create.bind(AlertModule.Routes.ApiRoutes));
  router.put('/api/alerts/:id', ensureAuthenticatedApi, AlertModule.Routes.ApiRoutes.update.bind(AlertModule.Routes.ApiRoutes));

  // alert history resources
  router.get('/api/alert-histories', ensureAuthenticatedApi, AlertHistoryModule.Routes.ApiRoutes.find.bind(AlertHistoryModule.Routes.ApiRoutes));
  router.get('/api/alert-histories/schema', ensureAuthenticatedApi, AlertHistoryModule.Routes.ApiRoutes.getSchema.bind(AlertHistoryModule.Routes.ApiRoutes));
  router.get('/api/alert-histories/:id', ensureAuthenticatedApi, AlertHistoryModule.Routes.ApiRoutes.findById.bind(AlertHistoryModule.Routes.ApiRoutes));
  router.post('/api/alert-histories', ensureAuthenticatedApi, AlertHistoryModule.Routes.ApiRoutes.create.bind(AlertHistoryModule.Routes.ApiRoutes));
  router.put('/api/alert-histories/:id', ensureAuthenticatedApi, AlertHistoryModule.Routes.ApiRoutes.update.bind(AlertHistoryModule.Routes.ApiRoutes));

  // filter resources
  router.get('/api/filters', ensureAuthenticatedApi, FilterModule.Routes.ApiRoutes.find.bind(FilterModule.Routes.ApiRoutes));
  // router.get('/api/filters/:id', ensureAuthenticatedApi, FilterModule.Routes.ApiRoutes.findById.bind(FilterModule.Routes.ApiRoutes));
  router.post('/api/filters', ensureAuthenticatedApi, FilterModule.Routes.ApiRoutes.create.bind(FilterModule.Routes.ApiRoutes));

  // device resources
  router.get('/api/devices', ensureAuthenticatedApi, DeviceModule.Routes.ApiRoutes.find.bind(DeviceModule.Routes.ApiRoutes));
  router.get('/api/devices/schema', ensureAuthenticatedApi, DeviceModule.Routes.ApiRoutes.getSchema.bind(DeviceModule.Routes.ApiRoutes));
  router.get('/api/devices/:id', ensureAuthenticatedApi, DeviceModule.Routes.ApiRoutes.findById.bind(DeviceModule.Routes.ApiRoutes));
  router.post('/api/devices', ensureAuthenticatedApi, DeviceModule.Routes.ApiRoutes.create.bind(DeviceModule.Routes.ApiRoutes));
  router.patch('/api/devices/:id', ensureAuthenticatedApi, DeviceModule.Routes.ApiRoutes.update.bind(DeviceModule.Routes.ApiRoutes));

  // performance resources
  router.get("/api/performances", PerformanceModule.Routes.PerformanceRoutes.find.bind(PerformanceModule.Routes.PerformanceRoutes));
  router.get('/api/performances/schema', PerformanceModule.Routes.PerformanceRoutes.getSchema.bind(PerformanceModule.Routes.PerformanceRoutes));
  router.get("/api/performances/:id", PerformanceModule.Routes.PerformanceRoutes.findById.bind(PerformanceModule.Routes.PerformanceRoutes));
  router.post("/api/performances", PerformanceModule.Routes.PerformanceRoutes.create.bind(PerformanceModule.Routes.PerformanceRoutes));
  router.patch("/api/performances/:id", PerformanceModule.Routes.PerformanceRoutes.update.bind(PerformanceModule.Routes.PerformanceRoutes));

  // rule resources
  router.get('/api/rules', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.find.bind(RuleModule.Routes.ApiRoutes));
  router.get('/api/rules/schema', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.getSchema.bind(RuleModule.Routes.ApiRoutes));
  router.get('/api/rules/:id', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.findById.bind(RuleModule.Routes.ApiRoutes));
  router.post('/api/rules', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.create.bind(RuleModule.Routes.ApiRoutes));
  router.patch('/api/rules/:id', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.update.bind(RuleModule.Routes.ApiRoutes));
  router.put('/api/rules/:id', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.update.bind(RuleModule.Routes.ApiRoutes));
  router.put('/api/rules/thresholds', ensureAuthenticatedApi, RuleModule.Routes.ApiRoutes.updateThresholds.bind(RuleModule.Routes.ApiRoutes));

  // tag resources
  router.get('/api/tags', ensureAuthenticatedApi, TagModule.Routes.ApiRoutes.find.bind(TagModule.Routes.ApiRoutes));
  router.get('/api/tags/schema', ensureAuthenticatedApi, TagModule.Routes.ApiRoutes.getSchema.bind(TagModule.Routes.ApiRoutes));
  router.get('/api/tags/:id', ensureAuthenticatedApi, TagModule.Routes.ApiRoutes.findById.bind(TagModule.Routes.ApiRoutes));
  router.post('/api/tags', ensureAuthenticatedApi, TagModule.Routes.ApiRoutes.create.bind(TagModule.Routes.ApiRoutes));
  router.put('/api/tags/:id', ensureAuthenticatedApi, TagModule.Routes.ApiRoutes.update.bind(TagModule.Routes.ApiRoutes));

  // reminder resources
  router.get('/api/reminders', ensureAuthenticatedApi, ReminderModule.Routes.ApiRoutes.find.bind(ReminderModule.Routes.ApiRoutes));
  router.get('/api/reminders/schema', ensureAuthenticatedApi, ReminderModule.Routes.ApiRoutes.getSchema.bind(ReminderModule.Routes.ApiRoutes));
  router.get('/api/reminders/:id', ensureAuthenticatedApi, ReminderModule.Routes.ApiRoutes.findById.bind(ReminderModule.Routes.ApiRoutes));
  router.post('/api/reminders', ReminderModule.Routes.ApiRoutes.create.bind(ReminderModule.Routes.ApiRoutes));
  router.put('/api/reminders/:id', ensureAuthenticatedApi, ReminderModule.Routes.ApiRoutes.update.bind(ReminderModule.Routes.ApiRoutes));

  // scheduled reminder resources
  router.get('/api/scheduled-reminders', ensureAuthenticatedApi, ScheduledReminderModule.Routes.ApiRoutes.find.bind(ScheduledReminderModule.Routes.ApiRoutes));
  router.get('/api/scheduled-reminders/schema', ensureAuthenticatedApi, ScheduledReminderModule.Routes.ApiRoutes.getSchema.bind(ScheduledReminderModule.Routes.ApiRoutes));
  router.get('/api/scheduled-reminders/:id', ensureAuthenticatedApi, ScheduledReminderModule.Routes.ApiRoutes.findById.bind(ScheduledReminderModule.Routes.ApiRoutes));
  router.post('/api/scheduled-reminders', ScheduledReminderModule.Routes.ApiRoutes.create.bind(ScheduledReminderModule.Routes.ApiRoutes));
  router.put('/api/scheduled-reminders/:id', ensureAuthenticatedApi, ScheduledReminderModule.Routes.ApiRoutes.update.bind(ScheduledReminderModule.Routes.ApiRoutes));

  // agent rule resources
  router.get('/api/agent-rules', ensureAuthenticatedApi, AgentRuleModule.Routes.ApiRoutes.find.bind(AgentRuleModule.Routes.ApiRoutes));
  router.get('/api/agent-rules/schema', ensureAuthenticatedApi, AgentRuleModule.Routes.ApiRoutes.getSchema.bind(AgentRuleModule.Routes.ApiRoutes));
  router.get('/api/agent-rules/:id', ensureAuthenticatedApi, AgentRuleModule.Routes.ApiRoutes.findById.bind(AgentRuleModule.Routes.ApiRoutes));
  router.post('/api/agent-rules', ensureAuthenticatedApi, AgentRuleModule.Routes.ApiRoutes.create.bind(AgentRuleModule.Routes.ApiRoutes));
  router.put('/api/agent-rules/:id', ensureAuthenticatedApi, AgentRuleModule.Routes.ApiRoutes.update.bind(AgentRuleModule.Routes.ApiRoutes));

  //Agent update resources
  router.get('/agent-update/:server/versions', AgentRuleModule.Routes.ApiRoutes.agentUpdate.bind(AgentRuleModule.Routes.ApiRoutes));
  router.get('/agent-update/:server/:filename', AgentRuleModule.Routes.ApiRoutes.getRule.bind(AgentRuleModule.Routes.ApiRoutes));
  router.patch('/agent-update/', AgentRuleModule.Routes.ApiRoutes.processUpdate.bind(AgentRuleModule.Routes.ApiRoutes));

  // ------------------------------------------------------------------------------
  // -------------------------------- FRONTEND URLS -------------------------------
  // ------------------------------------------------------------------------------

  router.get('/user', ensureAuthenticatedApi, UserModule.Routes.FrontendRoutes.getDetails);

  //log in route
  router.get('/login', function (req, res) {
      res.status(200).sendFile(appRootPath + '/public/login.html');
    });
  router.post(
    '/login',
    passport.authenticate('local'),
    function (req, res) {
      res.status(200).json('OK');
    }
  );
  //log out route
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
  });

  // load the single view file
  // (angular will handle the page changes on the front-end)
  router.get('*', ensureAuthenticated, function (req, res) {
    if (!/\.[A-Za-z]{3,4}$/.test(req.url)) {
      res.sendFile(appRootPath + '/public/index.html');
      return;
    }

    res.status(404).json('Not Found');
  });
};
