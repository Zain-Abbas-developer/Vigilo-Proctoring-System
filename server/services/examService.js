import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, getSort, paginated } from "../utils/pagination.js";
import { createNotification } from "./notificationService.js";

export async function createExam(teacherId, payload) {
  const { startTime, endTime, duration } = payload;
  if (new Date(endTime) <= new Date(startTime))
    throw ApiError.badRequest("End time must be after start time");
  if (duration <= 0)
    throw ApiError.badRequest("Duration must be greater than zero");

  const exam = await Exam.create({
    ...payload,
    createdBy: teacherId,
    status: payload.status || "draft",
  });
  return exam.toDTO();
}

export async function listExams(user, query = {}) {
  const { page, limit, skip } = getPagination(query);
  const sort = getSort(query, { startTime: -1 });

  const filter = {};

  if (user.role === "teacher") {
    filter.createdBy = user._id;
  }

  if (user.role === "student") {
    filter.assignedStudents = user._id;
    filter.status = { $in: ["scheduled", "active", "completed"] };
  }

  if (query.status) filter.status = query.status;
  if (query.subject) filter.subject = query.subject;
  if (query.search) filter.$text = { $search: query.search };

  const [items, total] = await Promise.all([
    Exam.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email"),

    Exam.countDocuments(filter),
  ]);

  const examsWithCounts = await Promise.all(
    items.map(async (exam) => {
      const [questionCount, attemptCount] = await Promise.all([
        Question.countDocuments({ exam: exam._id }),
        Attempt.countDocuments({ exam: exam._id }),
      ]);

      return {
        ...exam.toDTO(),
        questionCount,
        attemptCount,
        attemptsAllowed: exam.settings?.allowMultipleAttempts
          ? exam.settings.maxAttempts
          : 1,
      };
    }),
  );

  return paginated(examsWithCounts, total, page, limit);
}

export async function getExamById(user, examId) {
  const exam = await Exam.findById(examId).populate("createdBy", "name email");
  if (!exam) throw ApiError.notFound("Exam not found");

  if (
    user.role === "teacher" &&
    exam.createdBy._id.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("You do not own this exam");
  }
  if (user.role === "student") {
    const assigned = exam.assignedStudents.some(
      (s) => s.toString() === user._id.toString(),
    );
    if (!assigned) throw ApiError.forbidden("This exam is not assigned to you");
  }
  return exam.toDTO();
}

export async function updateExam(user, examId, updates) {
  const exam = await Exam.findById(examId);
  if (!exam) throw ApiError.notFound("Exam not found");
  if (
    user.role === "teacher" &&
    exam.createdBy.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("You do not own this exam");
  }
  delete updates.createdBy;
  Object.assign(exam, updates);
  await exam.save();
  return exam.toDTO();
}

export async function deleteExam(user, examId) {
  const exam = await Exam.findById(examId);
  if (!exam) throw ApiError.notFound("Exam not found");
  if (
    user.role === "teacher" &&
    exam.createdBy.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("You do not own this exam");
  }
  await Promise.all([
    Question.deleteMany({ exam: examId }),
    Attempt.deleteMany({ exam: examId }),
    Exam.deleteOne({ _id: examId }),
  ]);
  return { message: "Exam deleted" };
}

export async function publishExam(user, examId) {
  const exam = await Exam.findById(examId);
  if (!exam) throw ApiError.notFound("Exam not found");
  if (
    user.role === "teacher" &&
    exam.createdBy.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("You do not own this exam");
  }
  const questions = await Question.countDocuments({ exam: examId });
  if (!questions)
    throw ApiError.badRequest("Cannot publish an exam with no questions");

  exam.status = "scheduled";
  await exam.save();

  for (const studentId of exam.assignedStudents) {
    await createNotification(studentId, {
      type: "EXAM_SCHEDULED",
      title: `Exam scheduled: ${exam.title}`,
      message: `Your exam starts at ${exam.startTime.toLocaleString()}.`,
      link: `/student/exams/${exam._id}`,
      meta: { examId: exam._id },
    });
  }
  return exam.toDTO();
}

export async function assignStudents(user, examId, studentIds = []) {
  const exam = await Exam.findById(examId);
  if (!exam) throw ApiError.notFound("Exam not found");
  if (
    user.role === "teacher" &&
    exam.createdBy.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("You do not own this exam");
  }
  exam.assignedStudents = Array.from(new Set(studentIds.map(String)));
  await exam.save();
  return exam.toDTO();
}
