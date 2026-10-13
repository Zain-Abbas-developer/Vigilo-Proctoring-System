import * as examService from '../services/examService.js';
import { ok, created, asyncHandler } from '../utils/response.js';

export const createExam    = asyncHandler(async (req, res) => created(res, await examService.createExam(req.user._id, req.body), 'Exam created'));
export const listExams     = asyncHandler(async (req, res) => ok(res, await examService.listExams(req.user, req.query)));
export const getExam       = asyncHandler(async (req, res) => ok(res, await examService.getExamById(req.user, req.params.id)));
export const updateExam    = asyncHandler(async (req, res) => ok(res, await examService.updateExam(req.user, req.params.id, req.body), 'Exam updated'));
export const deleteExam    = asyncHandler(async (req, res) => ok(res, await examService.deleteExam(req.user, req.params.id)));
export const publishExam   = asyncHandler(async (req, res) => ok(res, await examService.publishExam(req.user, req.params.id), 'Exam published'));
export const assignStudents= asyncHandler(async (req, res) => ok(res, await examService.assignStudents(req.user, req.params.id, req.body.studentIds), 'Students assigned'));
