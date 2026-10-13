import * as attemptService from '../services/attemptService.js';
import { recordViolationSchema } from '../validators/attemptValidators.js';
import { ok, created, asyncHandler } from '../utils/response.js';
import { verifyFace } from '../services/aiClient.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

export const startAttempt = asyncHandler(async (req, res) => {
  const attempt = await attemptService.startAttempt(req.user, req.params.examId, {
    ipAddress: req.ip, userAgent: req.headers['user-agent'],
  });
  return created(res, { attempt }, 'Attempt started');
});

export const getActiveAttempt = asyncHandler(async (req, res) => {
  const attempt = await attemptService.getAttemptForStudent(
    req.user,
    req.params.examId
  );

  return ok(res, { attempt });
});

export const getExamPaper = asyncHandler(async (req, res) => {
  const data = await attemptService.getExamPaper(req.user, req.params.examId);
  return ok(res, data);
});

export const saveAnswer = asyncHandler(async (req, res) => {
  const data = await attemptService.saveAnswer(req.user, req.params.attemptId, req.body);
  return ok(res, data, 'Answer saved');
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await attemptService.submitAttempt(req.user, req.params.attemptId, req.body || {});
  return ok(res, { attempt }, 'Attempt submitted');
});

export const listAttempts = asyncHandler(async (req, res) => ok(res, await attemptService.listAttempts(req.user, req.query)));
export const getAttempt   = asyncHandler(async (req, res) => ok(res, { attempt: await attemptService.getAttemptById(req.user, req.params.id) }));

export const verifyFaceForAttempt = asyncHandler(async (req, res) => {
  const { verificationImage } = req.body;
  if (!verificationImage) throw ApiError.badRequest('verificationImage is required');

  const attempt = await Attempt.findById(req.params.attemptId).populate('exam');
  if (!attempt) throw ApiError.notFound('Attempt not found');
  if (attempt.student.toString() !== req.user._id.toString()) throw ApiError.forbidden('Not your attempt');

  const student = await User.findById(req.user._id).select('+profileImage');
  if (!student.profileImage) throw ApiError.badRequest('No reference image on file. Please enroll first.');

  const result = await verifyFace({
    referenceImage: student.profileImage,
    verificationImage,
    studentId: student._id,
  });

  attempt.faceVerified = !!result.verified;
  attempt.faceConfidence = result.confidence ?? null;
  await attempt.save();

  return ok(res, result, result.message || 'Verification complete');
});

export const recordViolationEndpoint = asyncHandler(async (req, res) => {
  const { recordViolation } = await import('../services/violationService.js');
  const v = await recordViolation(req.body);
  return created(res, { violation: v }, 'Violation recorded');
});
