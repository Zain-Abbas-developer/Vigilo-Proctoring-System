import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export function notFound(req, res, next) {
  res
    .status(404)
    .json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || null;

if (err.name === 'CastError') {
  console.error('Mongoose CastError details:', {
    path: err.path,
    value: err.value,
    kind: err.kind,
    message: err.message,
    stack: err.stack,
    requestPath: req.originalUrl,
  });

  status = 400;
  message = 'Invalid identifier';
}

  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(", ")}`;
  }
  if (err.name === "ValidationError") {
    status = 422;
    message = "Validation failed";
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message]),
    );
  }

  if (status >= 500)
    logger.error(message, { stack: err.stack, path: req.originalUrl });

  res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}
