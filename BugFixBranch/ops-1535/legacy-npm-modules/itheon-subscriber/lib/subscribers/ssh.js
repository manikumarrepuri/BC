
"use strict"

var _            = require('itheon-utility').underscore;
var logger       = require('itheon-logger');
var ServiceError = require('itheon-service').ServiceError;
var SSHClient    = require('simple-ssh');
var Handlebars   = require("handlebars");

class SSH
{
  /**
   * Method sends an email
   * @param Event details Event entity
   * @param Object settings  expected:
   * https://github.com/request/
   */
  processEvent(details, subscriber, subscriberService)
  {
    if (!_.isObject(details)) {
      throw new ServiceError(
        'Invalid event passed. Instance of Event expected'
      );
    }

    this.details = details;
    this.subscriber = _.clone(subscriber);
    this.subscriberService = subscriberService;

    var settings = _.clone(subscriber.settings);

    // Check for required properties
    if (!_.isObject(settings) || !settings.host || !settings.user || !settings.pass) {
      throw new ServiceError(
        'Invalid subscriber passed. Expected required properties: host, user, pass.'
      );
    }

    var commands = {};
    if (!settings.commands) {
      return false;
    }

    // Each field could be a handlebar template
    _.each(settings.commands, function(template, key){
      if(_.isString(template)) {
        template = Handlebars.compile(template);
        commands[key] = template(details);
      }
    });

    if (!_.isArray(commands)) {
      commands = [].concat(commands);
    }

    delete settings.commands
    return this.sendSSH(commands, settings);
  }

  /**
   * Send SSH commands from Itheon 10
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendSSH(commands, settings)
  {
    logger.info('Sending SSH commands to: ' + settings.host);
    logger.silly('Commands: ', commands);

    var ssh = new SSHClient(settings);
    var responses = [], codes = [];
    var that = this;

    // Craete default handlers
    ssh.on('error', function(err) {
      logger.error('Oops, something went wrong.', err);
      ssh.end();
      that.subscriberService.retry(that.details, that.subscriber);
    });

    // Execute the commands
    _.each(commands, function(command, key){
      let options = {
        out: function(stdout) {
          responses.push(stdout);
          logger.silly('SSH command returned: ', stdout);
        },
        exit: function(code) {
          codes.push(code);
          logger.silly('SSH command returned code: ', code);
        }
      };

      // If we've been given an object we need to patch it
      if (_.isObject(command)) {
        options = _.extend(options, command);
        command = key;
      }

      // Check for sudo
      if (/^sudo/.test(command)) {
        options.pty = true;
      }

      try {
        ssh.exec(command, options).start();
      } catch(e) {
        logger.error('Error:', e)
        this.subscriberService.retry(this.details, this.subscriber);
      }
    });

    return true;
  }
}

module.exports = SSH;
