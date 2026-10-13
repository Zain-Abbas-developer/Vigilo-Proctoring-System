import * as analytics from '../services/analyticsService.js';
import { ok, asyncHandler } from '../utils/response.js';

export const adminDashboard   = asyncHandler(async (req, res) => ok(res, await analytics.adminDashboard()));
export const teacherDashboard = asyncHandler(async (req, res) => ok(res, await analytics.teacherDashboard(req.user._id)));
export const studentDashboard = asyncHandler(async (req, res) => ok(res, await analytics.studentDashboard(req.user._id)));
