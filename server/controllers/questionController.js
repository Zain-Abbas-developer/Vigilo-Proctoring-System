import * as questionService from '../services/questionService.js';
import { ok, created, asyncHandler } from '../utils/response.js';

export const addQuestion   = asyncHandler(async (req, res) => created(res, await questionService.addQuestion(req.user, req.params.examId, req.body), 'Question added'));
export const bulkQuestions = asyncHandler(async (req, res) => created(res, { questions: await questionService.bulkCreateQuestions(req.user, req.params.examId, req.body.questions) }, 'Questions created'));
export const listQuestions = asyncHandler(async (req, res) => ok(res, { questions: await questionService.listQuestions(req.user, req.params.examId) }));
export const updateQuestion= asyncHandler(async (req, res) => ok(res, await questionService.updateQuestion(req.user, req.params.id, req.body), 'Question updated'));
export const deleteQuestion= asyncHandler(async (req, res) => ok(res, await questionService.deleteQuestion(req.user, req.params.id)));
export const listQuestionBank = asyncHandler(async (req, res) => ok(res, { questions: await questionService.listQuestionBank(req.user) }));
