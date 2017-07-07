"use strict";

var appRootPath      = require('app-root-path');
var common           = require('opserve-common');
var _                = common.utilities.underscore;
var moment           = require('moment');
var receiverMappings = require('require-all')(appRootPath + '/lib/module/receiver/mappings');
var receivers        = require(appRootPath + '/lib/module/receiver/config/receivers');
const ReceiverError     = common.error.ReceiverError;

class ReceiverService
{

   /**
   * Set the string we are going to attempt to deal with
   *
   * @param string the string to handle
   */
  constructor(string)
  {
    this.string = string;
  }

   /**
   * Parse the string
   *
   * @return Performance entity with metrics
   */
  parse(string)
  {
    if(string) {
      //If we were passed a message make sure it's a string
      if(!_.isString(string)) {
        throw new ReceiverError(
          'Invalid request. Expected message to be a string recieved: '+ (typeof string),
          string
        );
      }
      this.string = string;
    }

    if(!_.isString(this.string)) {
      throw new ReceiverError(
        'Invalid request. Expected message to be a string recieved: '+ (typeof this.string),
        this.string
      );
    }

    var result = null;
    this.receiver = this.findReceiver();

    //Process the required receiver
    if (!this.receiver) {
      throw new ReceiverError(
        'Invalid request. No receiver found for this message: "' + string + '"',
        string
      );
    }

    //Patch up the data
    switch (this.receiver.type) {
    case "splitter":
      result = this.splitter();
      break;
    }

    //Check we know what we're doing with this object
    if (!result.hasOwnProperty('mapper') || !result.mapper) {
      throw new ReceiverError(
        'Invalid request. No mapper found for this message: "' + result.mapperName + '"',
        string
      );
    }

    return result;
  }

  /**
  * Setter for the receiver object used by other functions
  *
  * @param Receiver object
  */
  setReceiver(receiver)
  {
    this.receiver = receiver;
  }

  /**
  * Getter for the receiver object used by other functions 
  *
  * @param Receiver object
  */
  getReceiver()
  {
    return this.receiver;
  }

  /**
  * Look through the string and attempt to work out how to handle it
  *
  * @return Receiver object || null
  */
  findReceiver()
  {
    //Attempt to find a receiver for our string
    for(var index in receivers) {
      var receiver = receivers[index];
      if(this.validateReceiver(receiver)) return receiver;
    }

    return null;
  }

 /**
  * Validate whether or not the given reciever can handle the incoming string
  *
  * @return boolean
  */
  validateReceiver(receiver)
  {

    if(!receiver.enabled) {
      return false;
    }

    //Remove line-breaks;
    var string = this.string.replace(/(\r\n|\n|\r)/gm, "");

    //Loop through matching requirements
    for(var i=0; i < receiver.expect.length; i++) {
      switch (receiver.expect[i].operator) {
        case "beginsWith":
          if (string.substring(0, receiver.expect[i].value.length) != receiver.expect[i].value) {
            return false;
          }
          break;
        case "endsWith":
          if (string.substring(string.length - receiver.expect[i].value.length) != receiver.expect[i].value) {
            return false;
          }
          break;
        case "regEx":
          var regEx = new RegExp(receiver.expect[i].value, 'gim');
          if (!regEx.test(string)) {
            return false;
          }
        }
    }

    return true;
  }

  /**
  * Split the string
  *
  * @return Mapper object
  */
  splitter()
  {
    //Check if we need to do anything
    if(!_.has(this.receiver, 'definition')) {
      throw new ReceiverError(
          'Invalid request. No definition provided.',
          this.string
      );
    }

    //Spilt the string using the required delimiter
    var columns = this.string.split(this.receiver.delimiter);

    //check what mapper file we need to load
    var mapperName = 'type9';

    if(this.receiver.definition.column != "undefined") {
      mapperName = columns[this.receiver.definition.column];
    }

    //check if the name needs to be modified in anyway
    if(_.has(this.receiver.definition, 'modifier')) {
      if(!_.isObject(this.receiver.definition.modifier)) {
        switch(this.receiver.definition.modifier) {
          case 'lcase':
            mapperName = mapperName.toLowerCase();
            break;
        }
      }
      else {
        _.each(this.receiver.definition.modifier, function(value, key) {
          switch(key) {
            case 'text':
              mapperName = value + mapperName;
              break;
          }
        });
      }
    }

    //check that the mapper file exists
    try {
      var mapper = receiverMappings[mapperName];

      //If no mapper found
      if(mapper == undefined) {
        throw new ReceiverError(
          'Invalid request. Unknown mapping file.',
          this.string
        );
      }
    }
    //If something went wrong throw error
    catch (e) {
      throw new ReceiverError(
        'Invalid request. Unknown mapping file.',
        this.string
      );
    }

    //check if we need to remove any array elements
    if(_.has(this.receiver.definition, 'remove')) {
      //this.receiver.definition.remove.sort(); //just make sure the array is in order!
      for (var i = this.receiver.definition.remove.length -1; i >= 0; i--)
        columns.splice(this.receiver.definition.remove[i],1);
    }

    return {'mapperName': mapperName, 'mapper': mapper,'columns': columns};
  }
}

module.exports = ReceiverService;
