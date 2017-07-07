
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
var AgentRuleEntity  = require("itheon-module-agent-rule-entity").AgentRuleEntity;


class RethinkDbAgentRuleGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass gateway instance
   *
   * @param object gateway Mapper"s gateway(i.e. dbConnection)
   */
  constructor(gateway)
  {
    super(gateway);

    this.table = {
      "name": "AgentRule",
      "alias": "ar"
    };
  }

  /**
   * Method fetches all records matching passed request"s criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new AgentRuleEntity()];

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param AgentRuleEntity agentRuleEntity AgentRule entity
   * @return Promise agentRule Promise of newly created agentRule entity
   */
  create(agentRuleEntity)
  {
    if (!(agentRuleEntity instanceof AgentRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AgentRule expected",
        {
          agentRuleEntity: agentRuleEntity
        },
        500
      );
    }

    return super.insert(agentRuleEntity)
      .then(function (agentRuleData) {
        return new AgentRuleEntity(agentRuleData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param AgentRuleEntity agentRuleEntity AgentRule entity
   * @return Promise agentRule Promise of newly created agentRule entity
   */
  update(agentRuleEntity)
  {
    if (!(agentRuleEntity instanceof AgentRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AgentRule expected",
        {
          agentRuleEntity: agentRuleEntity
        },
        500
      );
    }

    return super.update(agentRuleEntity)
      .then(function (agentRuleData) {
        return new AgentRuleEntity(agentRuleData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param AgentRuleEntity agentRuleEntity AgentRule entity
   * @return Promise agentRule Promise of newly created agentRule entity
   */
  replace(agentRuleEntity)
  {
    if (!(agentRuleEntity instanceof AgentRuleEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of AgentRule expected",
        {
          agentRuleEntity: agentRuleEntity
        }
      );
    }

    return super.replace(agentRuleEntity)
      .then(function (agentRuleData) {
        return new AgentRuleEntity(agentRuleData);
      });
  }

  /**
   * Helper method validates agentRulename to be inserted
   *
   * @param AgentRuleEntity agentRuleEntity AgentRule entity
   * @return Promise agentRuleEntity Promise of exception if agentRulename exists
   * otherwise promise of passed object
   */
  validateAgentRulename(agentRuleEntity)
  {
    return this.dataProvider.table(this.table.name)
      .getAll(agentRuleEntity.get(""), {index: "agentRuleId"})
      .then(function(agentRules) {
        if (!_.isEmpty(agentRules)) {
          throw new GatewayError(
            "AgentRulename already in use",
            {
              agentRules: agentRules
            },
            409
          );
        }

        return agentRuleEntity;
      });
  }

  /*
  * Tag Match
  *   1. Reduce the set to 1 record in the database per group
  *   2. Get platform from device table
  *   3. Find matching tags
  *   4. Remove rows that do not match on all tags
  *   5. Join on the Tags table and get tag weights
  *   6. Get platform from device table
  *   7. Group by value that could be duplicated ie. rule name, rule definition
  *   8. Select by most weighted tag
  *   9. Remove custom fields we added to work this stuff out!
  */
  tagMatch(tags, ruleName, version)
  {
    if (!_.isArray(tags)) {
      throw new GatewayError(
        "Tags must be array.",
        {
          tags: tags
        },
        500
      );
    }

    var that = this;
    //example: system:customer:xyz, system:host:server1
    var deviceId = tags[0].split(":")[2] + ':' + tags[1].split(":")[2];

    var query = this.dataProvider.table("AgentRule")
      // 1. Reduce the set to 1 record in the database per group
      if(version) {
        query = query.filter({"version": version});
      }
      else {
        // Group the data
        query = query.group("agentRuleId")
        .max("version")
        .ungroup()
        //We only have one item per group so drop the whole group thing
        .map(function(doc) {
          return doc('reduction');
        })
      }

      // 2. Get platform from device table
      query = query.merge(function(doc) {
        return that.dataProvider.table("Device").get(deviceId).pluck("platform")
      })

      // 3. Find matching tags
      .merge(function(doc) {
        return {
          tagsIntersection: that.dataProvider.expr(tags).append(that.dataProvider.expr("system:platform:").add(doc("platform"))).setIntersection(doc("tags"))
        }
      })
      // 4. Remove rows that do not match on all tags
      .filter(function(row) {
        return row("tagsIntersection").count().eq(row("tags").count())
      })
      // 5. Join on the Tags table and get tag weights
      .merge(function(doc) {
        return {
          tagWeights: that.dataProvider.expr(doc("tagsIntersection")).map(function(intersectionTags) {
           // this seems a bit hacky but we are summing itself and therefore just returning a number and not an object
           return that.dataProvider.table("Tag").getAll(intersectionTags).pluck("weight").sum("weight")
          })
        }
      })
      // 6. Get platform from device table
      .merge(function(doc) {
        return that.dataProvider.table("Device").get(deviceId).pluck("platform")
      })
      // 7. Group by value that could be duplicated ie. rule name, rule definition
      .group("name")
      // 8. Select by most weighted tag
      .max("tagWeights")
      .ungroup()
      //We only have one item per group so drop the whole group thing
      .map(function(doc) {
        return doc('reduction');
      })
      // 9. Remove custom fields we added to work this stuff out!
      .without("tagsIntersection", "tagWeights");

      if(ruleName) {
        query = query.filter({"name": ruleName});
      }

      logger.silly(query.toString());

      return query.run();
  }
}

module.exports = RethinkDbAgentRuleGateway;
