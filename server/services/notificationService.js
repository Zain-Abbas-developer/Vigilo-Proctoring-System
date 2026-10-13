import Notification from '../models/Notification.js';
import { getPagination, paginated } from '../utils/pagination.js';

export async function createNotification(userId, payload) {
  return Notification.create({ user: userId, ...payload });
}

export async function listNotifications(userId, query = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };
  if (query.read !== undefined) filter.read = query.read === 'true';
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);
  return paginated(items, total, page, limit);
}

export async function markRead(userId, notificationId) {
  const n = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  return n;
}

export async function markAllRead(userId) {
  await Notification.updateMany({ user: userId, read: false }, { read: true });
  return { message: 'All notifications marked as read' };
}

export async function unreadCount(userId) {
  return Notification.countDocuments({ user: userId, read: false });
}
