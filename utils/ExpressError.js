class ExpressError extends Error {
  constructor(statusCode,message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError;

// This class is used to create custom error objects in Express applications.

