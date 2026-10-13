import Report from '../models/Report.js';
import Exam from '../models/Exam.js';
import Attempt from '../models/Attempt.js';
import Violation from '../models/Violation.js';
import * as reportService from '../services/reportService.js';
import { ok, created, asyncHandler } from '../utils/response.js';
import ApiError from '../utils/ApiError.js';

export const generateExamReport = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.examId);
  if (!exam) throw ApiError.notFound('Exam not found');
  if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not own this exam');
  }

  const [attempts, violations] = await Promise.all([
    Attempt.find({ exam: exam._id }).populate('student', 'name rollNumber email'),
    Violation.find({ exam: exam._id }).populate('student', 'name rollNumber'),
  ]);

  const submitted = attempts.filter((a) => a.status !== 'in-progress');
  const average = submitted.length
    ? submitted.reduce((s, a) => s + a.percentage, 0) / submitted.length
    : 0;
  const passRate = submitted.length
    ? submitted.filter((a) => a.passed).length / submitted.length
    : 0;

  const report = await Report.create({
    exam: exam._id,
    generatedBy: req.user._id,
    scope: 'exam',
    title: `Exam report — ${exam.title}`,
    data: {
      exam: { title: exam.title, subject: exam.subject, totalMarks: exam.totalMarks },
      totals: {
        assigned: exam.assignedStudents.length,
        attempted: attempts.length,
        submitted: submitted.length,
        averagePercentage: Number(average.toFixed(2)),
        passRate: Number((passRate * 100).toFixed(2)),
        violations: violations.length,
      },
      attempts,
      violations,
    },
  });
  return created(res, { report }, 'Report generated');
});

export const listReports = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'teacher') filter.generatedBy = req.user._id;
  const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(50);
  return ok(res, { reports });
});

export const getReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) throw ApiError.notFound('Report not found');
  if (req.user.role === 'teacher' && report.generatedBy.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not your report');
  }
  return ok(res, { report });
});

export const analyticsReport = asyncHandler(
  async (req, res) => {
    const range = Number(req.query.range || 30);

    const data = await reportService.analyticsReport(range);

    return ok(res, data);
  }
);
