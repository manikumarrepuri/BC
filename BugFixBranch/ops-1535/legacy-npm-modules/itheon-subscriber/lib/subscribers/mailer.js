
"use strict"

var _             = require('itheon-utility').underscore;
var logger        = require('itheon-logger');
var nodemailer    = require('nodemailer');
var BaseEntity    = require('itheon-entity').BaseEntity;
var ServiceError  = require('itheon-service').ServiceError;

class Mailer
{
  /**
   * Method sends an email
   * @param Event details Event entity
   * @param Object settings  expected:
   * http://adilapapaya.com/docs/nodemailer/
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

    var mailOptions = subscriber.settings.mailOptions;

    // Check for required properties
    if (!_.isObject(subscriber) || !subscriber.settings.transport || !mailOptions.to || !mailOptions.from || !(mailOptions.text || mailOptions.html)) {
      throw new ServiceError(
        'Invalid subscriber passed. Expected required properties: to, from, subject, text'
      );
    }

    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport(subscriber.settings.transport);

    return this.sendEmail(details, mailOptions);
  }

  /**
   * Post alert to the ItheonX API
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendEmail(context, mailOptions)
  {
    // create template based sender function
    var sendEmail = this.transporter.templateSender(mailOptions);

    // use template based sender to send a message
    var that = this;
    return sendEmail({
      to: mailOptions.to
    }, context).then(function(info){
      logger.info('Message sent: ' + info.response);
      return true;
    }).catch(function(err){
      logger.error('Failed to send email: ', error);
      that.subscriberService.retry(that.details, that.subscriber);
      return false;
    });
  }
}

module.exports = Mailer;
