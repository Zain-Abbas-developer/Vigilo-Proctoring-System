export default class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status; this.errors = errors; this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(m = 'Bad request', e)        { return new ApiError(400, m, e); }
  static unauthorized(m = 'Unauthorized')        { return new ApiError(401, m); }
  static forbidden(m = 'Forbidden')              { return new ApiError(403, m); }
  static notFound(m = 'Resource not found')      { return new ApiError(404, m); }
  static conflict(m = 'Conflict')                { return new ApiError(409, m); }
  static unprocessable(m = 'Validation failed', e) { return new ApiError(422, m, e); }
  static internal(m = 'Internal server error')   { return new ApiError(500, m); }
}