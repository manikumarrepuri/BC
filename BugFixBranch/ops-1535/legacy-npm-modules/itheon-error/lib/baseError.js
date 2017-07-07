
"use strict";

class BaseError extends Error
{
  /**
   * Custom constructor allows to specify message, context data
   * and error code
   *
   * @param string message   Error message
   * @param mixed  data      Context data
   * @param string errorCode Error code
   */
  constructor(message, data, errorCode)
  {
    super(message);

    this.data = null;

    if (data) {
      this.data = data;
    }

    this.errorCode = errorCode;

    if (!errorCode) {
      this.errorCode = 1;
    }
  }

  /**
   * Method exports details of error
   *
   * @return object Object with all details of error
   */
  exportDetails()
  {
    return {
      "type": this.constructor.name,
      "message": this.message,
      "errorCode": this.errorCode,
      "data" : this.data
    };
  }
}

module.exports = BaseError;
