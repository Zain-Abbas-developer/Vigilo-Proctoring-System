import Attempt from '../models/Attempt.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import ApiError from '../utils/ApiError.js';


/**
 * Server-authoritative scoring. Never trust the frontend for marks.
 */
export async function calculateResult(attemptId) {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw ApiError.notFound('Attempt not found');

  const exam = await Exam.findById(attempt.exam);
  const questions = await Question.find({ exam: attempt.exam });

  let correct = 0, wrong = 0, unattempted = 0;
  let obtained = 0;

  const answerMap = new Map(attempt.answers.map((a) => [a.question.toString(), a]));

  for (const q of questions) {
    const a = answerMap.get(q._id.toString());
    if (!a || (a.selectedOption === null && !a.textAnswer)) { unattempted++; continue; }

    let isCorrect = false;
    if (q.type === 'mcq' || q.type === 'true_false') {
      isCorrect = a.selectedOption === q.correctAnswer;
    }
    // Future: short/long/coding answer grading hooks go here.

    a.isCorrect = isCorrect;
    if (isCorrect) {
      a.marksAwarded = q.marks;
      obtained += q.marks;
      correct++;
    } else {
      wrong++;
      if (exam.settings.negativeMarking) {
        const penalty = q.negativeMarks || exam.settings.negativeMarkValue || 0;
        a.marksAwarded = -penalty;
        obtained -= penalty;
      } else {
        a.marksAwarded = 0;
      }
    }
  }

  obtained = Math.max(0, obtained);

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0) || exam.totalMarks || 0;
  const percentage = totalMarks > 0 ? Number(((obtained / totalMarks) * 100).toFixed(2)) : 0;
  const passed = obtained >= (exam.passingMarks || 0);

  return {
    answers: attempt.answers,
    score: Number(obtained.toFixed(2)),
    totalMarks,
    percentage,
    passed,
    correctAnswers: correct,
    wrongAnswers: wrong,
    unattempted,
  };
}

export async function getResult(user, attemptId) {
  const attempt = await Attempt.findById(attemptId)
    .populate('exam', 'title subject passingMarks totalMarks duration')
    .populate('student', 'name email rollNumber');
  if (!attempt) throw ApiError.notFound('Attempt not found');

  if (user.role === 'student' && attempt.student._id.toString() !== user._id.toString()) {
    throw ApiError.forbidden('Not your result');
  }
  if (attempt.status === 'in-progress') throw ApiError.badRequest('Attempt has not been submitted');

  return {
    attemptId: attempt._id,
    exam: attempt.exam,
    student: attempt.student,
    status: attempt.status,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    duration: attempt.submittedAt
      ? Math.round((attempt.submittedAt - attempt.startedAt) / 1000)
      : null,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
    percentage: attempt.percentage,
    passed: attempt.passed,
    correctAnswers: attempt.correctAnswers,
    wrongAnswers: attempt.wrongAnswers,
    unattempted: attempt.unattempted,
    violationCount: attempt.violationCount,
  };
}