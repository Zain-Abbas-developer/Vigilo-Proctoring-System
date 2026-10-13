import * as notificationService from '../services/notificationService.js';
import { ok, asyncHandler } from '../utils/response.js';

export const listNotifications = asyncHandler(async (req, res) => ok(res, await notificationService.listNotifications(req.user._id, req.query)));
export const unreadCount       = asyncHandler(async (req, res) => ok(res, { count: await notificationService.unreadCount(req.user._id) }));
export const markRead          = asyncHandler(async (req, res) => ok(res, { notification: await notificationService.markRead(req.user._id, req.params.id) }, 'Marked read'));
export const markAllRead       = asyncHandler(async (req, res) => ok(res, await notificationService.markAllRead(req.user._id)));
