
"use strict";

var appRoot         = require('app-root-path');
var common          = require('opserve-common');
var _               = common.utilities.underscore;
const config        = common.Config.get();
const logger        = common.logger;
const HandlerError    = common.error.HandlerError;
var ReceiverService = require(appRoot + '/lib/receiverService');
var Receivers       = require('require-all')(appRoot + '/lib/receivers');

class HandlerService
{
  /**
   * Custom constructor allows to inject receiver and performance services
   *
   * @param ReceiverService    receiverService    Receiver service
   */
  constructor(receiverService)
  {
    if (receiverService && !(receiverService instanceof ReceiverService)) {
      throw new HandlerError(
        'Invalid receiver service passed. Instance of ReceiverService expected'
      );
    }

    if (!receiverService) {
      receiverService = new ReceiverService();
    }

    this.receiverService = receiverService;
  }

  /**
   * Main method to be called to handle incoming performance data
   *
   * @return Promise result Promise of statup result
   */
  handleIncomingData(data)
  {
    logger.info(
      'HandlerService: Handling incoming data'
    );

    //Parse the string into something we can use
    var result = this.receiverService.parse(data);
    result.originalEvent = data;

    //Select the class that can handle this object iamAnnounce, iamReceiver etc.
    var receiver = new Receivers[this.receiverService.getReceiver().receiver]();
    //Generate generic object
    var entity = receiver.generateEntity(result);

    //Save generic object
    receiver.process(entity);

    // This return is ignored by the app, but is needed for unit tests.
    return entity;
  }
}

module.exports = HandlerService;
