export const ok = (res, data = {}, message = 'Operation successful', status = 200) =>
  res.status(status).json({ success: true, message, data });
export const created = (res, data = {}, message = 'Created successfully') =>
  ok(res, data, message, 201);
export const fail = (res, message = 'Request failed', errors = null, status = 400) =>
  res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
