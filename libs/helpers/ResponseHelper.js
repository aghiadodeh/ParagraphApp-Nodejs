'use strict';
export default {
  /**
   * mapping object you want to return in response to base response model
   * @param {Object} data 
   * @returns {Object} after mapping
   */
  successResponse: (data) => {
    return {
      responseCode: 200,
      success: true,
      message: "operation done successfully",
      data: data,
      error: null,
    };
  },

  /**
   * mapping object you want to return in response to base response model
   * @param {Object} data 
   * @returns {Object} after mapping
   */
  badResponse: (message, code) => {
    return {
      responseCode: code || getCode(message),
      success: false,
      message,
      data: null,
    };
  },

  /**
   * await some ms
   * @param {Number} ms 
   */
  sleep: (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

const ResponseCode = {
  DATA_MISSED: 420,
  PERMISSION_DENIED: 421,
  UNAUTHENTICATED: 403,
  NOT_FOUND: 404,
  PASSWORD_WRONG: 422,
  USER_NOT_FOUND: 423,
  DATA_NOT_VALID: 426,
  DELETED: 427,
  EMAIL_EXISTS: 428,
  TOO_MANY_REQUESTS: 429,
};

/**
 * get response code by message
 * @param {String} message the message you want to return in response
 * @returns {Number} response code by message
 */
function getCode(message) {
  let code = 500;

  try {
    if (message.includes("required")) code = ResponseCode.DATA_MISSED;
    else if (message.includes("user not found")) code = ResponseCode.USER_NOT_FOUND;
    else if (message.includes("password is wrong")) code = ResponseCode.PASSWORD_WRONG;
    else if (message.includes("not found")) code = ResponseCode.NOT_FOUND;
    else if (message.includes("UNAUTHORIZED")) code = ResponseCode.UNAUTHENTICATED;
    else if (message.includes("permission")) code = ResponseCode.PERMISSION_DENIED;
    else if (message.includes("invalid")) code = ResponseCode.DATA_NOT_VALID;
    else if (message.includes("deleted")) code = ResponseCode.DELETED;
    else if (message.includes("email is exists")) code = ResponseCode.EMAIL_EXISTS;
    else if (message.includes("too many requests")) code = ResponseCode.TOO_MANY_REQUESTS;
  } catch (error) { }

  return code;
}
