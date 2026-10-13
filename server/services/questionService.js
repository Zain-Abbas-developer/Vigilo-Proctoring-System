import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import ApiError from '../utils/ApiError.js';

function assertOwnership(user, exam) {
  if (!exam) throw ApiError.notFound('Exam not found');
  if (user.role === 'teacher' && exam.createdBy.toString() !== user._id.toString()) {
    throw ApiError.forbidden('You do not own this exam');
  }
}

export async function addQuestion(user, examId, payload) {
  const exam = await Exam.findById(examId);
  assertOwnership(user, exam);

  if (payload.type === 'mcq') {
    if (!Array.isArray(payload.options) || payload.options.length < 2) {
      throw ApiError.badRequest('MCQ requires at least two options');
    }
    if (typeof payload.correctAnswer !== 'number' ||
        payload.correctAnswer < 0 || payload.correctAnswer >= payload.options.length) {
      throw ApiError.badRequest('correctAnswer must be a valid option index');
    }
  }

  const count = await Question.countDocuments({ exam: examId });
  const q = await Question.create({ ...payload, exam: examId, order: count });
  await recalcExamMarks(examId);
  return q;
}

export async function bulkCreateQuestions(user, examId, questions = []) {
  const exam = await Exam.findById(examId);
  assertOwnership(user, exam);
  if (!Array.isArray(questions) || !questions.length) throw ApiError.badRequest('questions array is required');

  const base = await Question.countDocuments({ exam: examId });
  const docs = questions.map((q, i) => ({ ...q, exam: examId, order: base + i }));
  const created = await Question.insertMany(docs);
  await recalcExamMarks(examId);
  return created;
}

export async function listQuestions(user, examId) {
  const exam = await Exam.findById(examId);
  assertOwnership(user, exam);
  return Question.find({ exam: examId }).sort({ order: 1 });
}

export async function updateQuestion(user, questionId, updates) {
  const q = await Question.findById(questionId);
  if (!q) throw ApiError.notFound('Question not found');
  const exam = await Exam.findById(q.exam);
  assertOwnership(user, exam);

  Object.assign(q, updates);
  await q.save();
  await recalcExamMarks(q.exam);
  return q;
}

export async function deleteQuestion(user, questionId) {
  const q = await Question.findById(questionId);
  if (!q) throw ApiError.notFound('Question not found');
  const exam = await Exam.findById(q.exam);
  assertOwnership(user, exam);

  const examId = q.exam;
  await q.deleteOne();
  await recalcExamMarks(examId);
  return { message: 'Question deleted' };
}

export async function recalcExamMarks(examId) {
  const agg = await Question.aggregate([
    { $match: { exam: (await import('mongoose')).default.Types.ObjectId.createFromHexString(String(examId)) } },
    { $group: { _id: null, total: { $sum: '$marks' } } },
  ]);
  const totalMarks = agg[0]?.total || 0;
  await Exam.findByIdAndUpdate(examId, { totalMarks });
  return totalMarks;
}

export async function listQuestionBank(user) {
  let filter = {};

  if (user.role === 'teacher') {
    const exams = await Exam.find({
      createdBy: user._id,
    }).select('_id');

    const examIds = exams.map((exam) => exam._id);

    filter = {
      exam: { $in: examIds },
    };
  }

  return Question.find(filter)
    .populate('exam', 'title subject')
    .sort({ createdAt: -1 });
}