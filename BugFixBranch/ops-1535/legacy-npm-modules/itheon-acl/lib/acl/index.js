"use strict";

const Acl                     = require("acl");
const AclRedisPrefix          = "itheon-acl";

const Request                 = require("itheon-request");
const _                       = require("itheon-utility").underscore;

const RedisGateway            = require("itheon-gateway").RedisGateway;
const redisGateway            = new RedisGateway();
const redisClient             = redisGateway.cacheConnection;

const RethinkDbAclRuleGateway = require("../module/Acl/gateway/aclRule/rethinkDbAclRuleGateway");
const rethinkDbAclRuleGateway = new RethinkDbAclRuleGateway();

const RethinkDbUserGateway    = require("../module/User/gateway/user/rethinkDbUserGateway");
const rethinkDbUserGateway    = new RethinkDbUserGateway();

class AclService
{
  isAllowed(user, resource, action)
  {
    var me = this;

    if (!this.acl) {
      return this.init()
        .then(function() {
          return me.initUserRoles(user);
        })
        .then(function() {
          return new Promise(function(resolve, reject) {
            return me.acl
              .isAllowed(user, resource, action, function(error, result) {

                if (error) {
                  return reject(error);
                }

                return resolve(result);
              });
          });
        });
    }

    return this.initUserRoles(user)
      .then(function() {
        return new Promise(function(resolve, reject) {
          return me.acl
            .isAllowed(user, resource, action, function(error, result) {

              if (error) {
                return reject(error);
              }

              return resolve(result);
            });
        });
      });
  }

  allowedPermissions(user, resources)
  {
    var me = this;

    if (!_.isArray(resources)) {
      resources = [resources];
    }

    if (!this.acl) {
      return this.init()
        .then(function() {
          return new Promise(function(resolve, reject) {
            me.acl.allowedPermissions(user, resources, function(error, result) {
              return resolve(result);
            });
          });
        });
    }

    return new Promise(function(resolve, reject) {
      return me.acl.allowedPermissions(user, resources, function(error, result) {
        return resolve(result);
      });
    });
  }

  initUserRoles(username)
  {
    if (!_.isArray(this.cachedUserRoles)) {
      this.cachedUserRoles = [];
    }

    if (this.cachedUserRoles[username]) {
      return new Promise(function(resolve, reject) {
        return resolve(null);
      });
    }

    var that = this;
    var request = new Request();
    request.setFields(["roles"]);
    request.setConditions({username: username});

    return rethinkDbUserGateway.fetchOne(request)
      .then(function(result) {

        if (_.isObject(result)) {
          that.acl.addUserRoles(username, result.roles);
        }

        that.cachedUserRoles[username] = true;
      });
  }

  init()
  {
    // The acl service is/has been restarted, so we cannot trust that then
    // persistent DB and redis are in sync.
    redisGateway.keys(`${AclRedisPrefix}_*`).then((keys) => {
      redisGateway.delete(keys);
    });

    this.acl = new Acl(new Acl.redisBackend(redisClient, AclRedisPrefix));

    return rethinkDbAclRuleGateway.fetchAll(new Request())
      .then(this.patchRulesToAclFormat)
      .then((aclRules) => {
        this.acl.allow(aclRules);
      });
  }

  patchRulesToAclFormat(aclRules) {
    if (!_.isArray(aclRules)) {
      aclRules = [aclRules];
    }

    let formattedRules = [];
    let rules = aclRules.reduce((rules, rule) => {
      if (!rules[rule.role]) {
        rules[rule.role] = {};
      }

      if (!rules[rule.role][rule.resource]) {
        rules[rule.role][rule.resource] = [];
      }

      rules[rule.role][rule.resource].push(rule.action);
      return rules;
    }, {});

    _.forEach(rules, (aclRule, roles) => {
      let allows = [];
      _.forEach(aclRule, (permissions, resources) => {
        allows.push({
          resources,
          permissions
        });
      });

      formattedRules.push({
        roles,
        allows
      });
    });

    return formattedRules;
  }

  createOrUpdate(ruleEntity)
  {
    if (!this.acl)
    {
      this.init();
      return;
    }
    ruleEntity = [ruleEntity];

    this.acl.allow(this.patchRulesToAclFormat(ruleEntity));
  }

  delete(ruleEntity)
  {
    if (!this.acl)
    {
      return;
    }
    ruleEntity = [ruleEntity];

    this.acl.removeAllow(this.patchRulesToAclFormat(ruleEntity));
  }
}

module.exports = new AclService();
