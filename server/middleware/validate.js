import ApiError from '../utils/ApiError.js';

/**
 * Validates req.body / req.query / req.params against a zod schema object.
 * Schema shape: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
export function validateRequest(schemas = {}) {
  return (req, res, next) => {
    try {
      for (const key of ['body', 'query', 'params']) {
        if (schemas[key]) {
          const parsed = schemas[key].parse(req[key] || {});
          req[key] = parsed;
        }
      }
      next();
    } catch (err) {
      if (err?.issues) {
        const errors = err.issues.reduce((acc, i) => {
          const path = i.path.join('.') || '_';
          acc[path] = i.message;
          return acc;
        }, {});
        return next(ApiError.unprocessable('Validation failed', errors));
      }
      next(err);
    }
  };
}
