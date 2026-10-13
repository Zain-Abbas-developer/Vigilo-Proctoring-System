import Violation from '../models/Violation.js';
import Attempt from '../models/Attempt.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, getSort, paginated } from '../utils/pagination.js';
import { emitToRoom } from '../socket/index.js';
import { logger } from '../utils/logger.js';

const SEVERITY_BY_TYPE = {
  TAB_SWITCH: 'medium',
  FULLSCREEN_EXIT: 'medium',
  FACE_NOT_DETECTED: 'high',
  MULTIPLE_FACES: 'critical',
  PHONE_DETECTED: 'high',
  NOISE_DETECTED: 'low',
  SCREEN_SHARE_STOPPED: 'high',
  COPY_PASTE: 'medium',
  SUSPICIOUS_MOVEMENT: 'low',
  CAMERA_DISABLED: 'high',
  MICROPHONE_DISABLED: 'medium',
  CONNECTION_LOST: 'medium',
  FACE_MISMATCH: 'critical',
};

export async function recordViolation({ attemptId, type, description = '', metadata = {} }) {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw ApiError.notFound('Attempt not found');

  const severity = SEVERITY_BY_TYPE[type] || 'low';
  const violation = await Violation.create({
    attempt: attempt._id, exam: attempt.exam, student: attempt.student,
    type, severity, description, metadata,
  });

  attempt.violationCount = (attempt.violationCount || 0) + 1;
  await attempt.save();

  emitToRoom(`exam:${attempt.exam}`, 'violation', {
    attemptId: attempt._id, studentId: attempt.student,
    type, severity, timestamp: violation.timestamp,
  });

  logger.warn('Violation recorded', { attemptId, type, severity });
  return violation;
}

export async function listViolations(user, query = {}) {
  const { page, limit, skip } = getPagination(query);
  const sort = getSort(query, { timestamp: -1 });

  const filter = {};
  if (user.role === 'student') filter.student = user._id;
  if (query.examId) filter.exam = query.examId;
  if (query.attemptId) filter.attempt = query.attemptId;
  if (query.type) filter.type = query.type;
  if (query.severity) filter.severity = query.severity;
  if (query.reviewed !== undefined) filter.reviewed = query.reviewed === 'true';

  const [items, total] = await Promise.all([
    Violation.find(filter).sort(sort).skip(skip).limit(limit)
      .populate('student', 'name email rollNumber')
      .populate('exam', 'title subject')
      .populate('attempt', 'status score'),
    Violation.countDocuments(filter),
  ]);
  return paginated(items, total, page, limit);
}

export async function reviewViolation(user, violationId, { reviewed = true, reviewNote = '' }) {
  const v = await Violation.findById(violationId);
  if (!v) throw ApiError.notFound('Violation not found');
  v.reviewed = reviewed;
  v.reviewedBy = user._id;
  v.reviewedAt = new Date();
  v.reviewNote = reviewNote;
  await v.save();
  return v;
}
