import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw ApiError.unauthorized('Authentication token missing');

    let payload;
    try { payload = jwt.verify(token, env.jwtSecret); }
    catch { throw ApiError.unauthorized('Invalid or expired token'); }

    const user = await User.findById(payload.id);
    if (!user) throw ApiError.unauthorized('User no longer exists');
    if (user.status !== 'active') throw ApiError.forbidden(`Account is ${user.status}`);

    req.user = user;
    next();
  } catch (err) { next(err); }
}

export function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden('Insufficient role permissions'));
    next();
  };
}
