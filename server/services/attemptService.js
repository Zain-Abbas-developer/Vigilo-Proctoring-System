import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import ApiError from "../utils/ApiError.js";
import { calculateResult } from "./resultService.js";
import { logger } from "../utils/logger.js";
import { emitToRoom } from "../socket/index.js";

export async function startAttempt(user, examId, meta = {}) {
  if (!mongoose.isValidObjectId(examId)) {
    throw ApiError.badRequest("Invalid exam ID");
  }

  const exam = await Exam.findById(examId);
  console.log("Exam found:", !!exam);
  console.log("Exam ID:", exam?._id?.toString());
  console.log("Exam title:", exam?.title);
  console.log("Raw assignedStudents:", exam?.assignedStudents);
  console.log("Exam collection:", Exam.collection.name);
  if (!exam) throw ApiError.notFound("Exam not found");

  const assignedStudents = exam.assignedStudents ?? [];

  console.log("Exam ID:", exam._id.toString());

  console.log("Authenticated user:", {
    id: user?._id?.toString(),
    role: user?.role,
    email: user?.email,
  });

  console.log(
    "Assigned student IDs:",
    (exam.assignedStudents ?? []).map((student) => student.toString()),
  );

  const assigned = assignedStudents.some(
    (studentId) => studentId.toString() === user._id.toString(),
  );

  if (!assigned) {
    throw ApiError.forbidden("This exam is not assigned to you");
  }

  const now = new Date();
  const liveStatus = exam.deriveStatus(now);

  if (liveStatus === "scheduled") {
    throw ApiError.badRequest("Exam has not started yet");
  }

  if (liveStatus === "completed") {
    throw ApiError.badRequest("Exam has ended");
  }

  if (liveStatus === "cancelled") {
    throw ApiError.badRequest("Exam has been cancelled");
  }

  // Reuse the student's existing active attempt.
  let attempt = await Attempt.findOne({
    student: user._id,
    exam: examId,
    status: "in_progress",
  });

  if (attempt) {
    if (now >= attempt.expiresAt) {
      return submitAttempt(user, attempt._id, { auto: true });
    }

    return attempt;
  }

  // Do not allow another attempt after submission.
  const submitted = await Attempt.findOne({
    student: user._id,
    exam: examId,
    status: { $in: ["submitted", "auto_submitted"] },
  });

  if (submitted) {
    throw ApiError.badRequest("You have already attempted this exam");
  }

  const durationMs = Number(exam.duration) * 60 * 1000;
  const endTimeMs = exam.endTime ? new Date(exam.endTime).getTime() : Infinity;

  const expiresAt = new Date(Math.min(now.getTime() + durationMs, endTimeMs));

  if (!Number.isFinite(durationMs) || durationMs <= 0 || expiresAt <= now) {
    throw ApiError.badRequest("The exam has no remaining time");
  }

  attempt = await Attempt.create({
    student: user._id,
    exam: examId,
    startedAt: now,
    expiresAt,
    status: "in_progress",
    totalMarks: exam.totalMarks,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  logger.info("Attempt started", {
    attemptId: attempt._id,
    examId,
    studentId: user._id,
  });

  emitToRoom(`exam:${examId}`, "exam_started", {
    attemptId: attempt._id,
    studentId: user._id,
  });

  return attempt;
}

export async function getAttemptForStudent(user, examId) {
  const attempt = await Attempt.findOne({
    student: user._id,
    exam: examId,
    status: "in_progress",
  });

  if (!attempt) {
    throw ApiError.notFound("No active attempt");
  }

  if (new Date() >= attempt.expiresAt) {
    await submitAttempt(user, attempt._id, { auto: true });
    throw ApiError.badRequest("Attempt expired and was auto-submitted");
  }

  return attempt;
}

export async function getExamPaper(user, examId) {
  const exam = await Exam.findById(examId);
  if (!exam) throw ApiError.notFound("Exam not found");

  // Ensure the student has an active attempt before returning the paper.
  const attempt = await Attempt.findOne({
    student: user._id,
    exam: examId,
    status: "in_progress",
  });

  if (!attempt) {
    throw ApiError.forbidden("Start an exam attempt before loading the paper");
  }

  if (new Date() >= attempt.expiresAt) {
    await submitAttempt(user, attempt._id, { auto: true });
    throw ApiError.badRequest("Attempt expired");
  }

  let questions = await Question.find({ exam: examId }).sort({
    order: 1,
  });

  const settings = exam.settings ?? {};

  if (settings.shuffleQuestions) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }

  return {
    exam: {
      _id: exam._id,
      title: exam.title,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      instructions: exam.instructions,
      settings,
      endTime: exam.endTime,
    },
    questions: questions.map((question) => {
      // Never expose correct answers or explanations to students.
      const dto =
        typeof question.toStudentDTO === "function"
          ? question.toStudentDTO()
          : {
              _id: question._id,
              type: question.type,
              question: question.question,
              options: (question.options ?? []).map((option) => ({
                text: option.text,
              })),
              marks: question.marks,
              order: question.order,
            };

      if (settings.shuffleOptions && Array.isArray(dto.options)) {
        dto.options = [...dto.options].sort(() => Math.random() - 0.5);
      }

      return dto;
    }),
  };
}

export async function saveAnswer(
  user,
  attemptId,
  { questionId, selectedOption, textAnswer },
) {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw ApiError.notFound("Attempt not found");

  if (attempt.student.toString() !== user._id.toString()) {
    throw ApiError.forbidden("Not your attempt");
  }

  if (attempt.status !== "in_progress") {
    throw ApiError.badRequest("Attempt is no longer active");
  }

  if (new Date() >= attempt.expiresAt) {
    await submitAttempt(user, attempt._id, { auto: true });
    throw ApiError.badRequest("Attempt has expired");
  }

  const question = await Question.findById(questionId);

  if (!question || question.exam.toString() !== attempt.exam.toString()) {
    throw ApiError.badRequest("Question does not belong to this exam");
  }

  if (
    selectedOption !== undefined &&
    selectedOption !== null &&
    (!Number.isInteger(selectedOption) ||
      selectedOption < 0 ||
      selectedOption >= (question.options?.length ?? 0))
  ) {
    throw ApiError.badRequest("Invalid selected option");
  }

  const answerIndex = attempt.answers.findIndex(
    (answer) => answer.question.toString() === questionId.toString(),
  );

  const answerData = {
    question: question._id,
    selectedOption: typeof selectedOption === "number" ? selectedOption : null,
    textAnswer: textAnswer ?? "",
    answeredAt: new Date(),
  };

  if (answerIndex >= 0) {
    Object.assign(attempt.answers[answerIndex], answerData);
  } else {
    attempt.answers.push(answerData);
  }

  attempt.lastHeartbeatAt = new Date();
  await attempt.save();

  return {
    saved: true,
    answered: attempt.answers.length,
  };
}

export async function submitAttempt(user, attemptId, { auto = false } = {}) {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) throw ApiError.notFound("Attempt not found");

  if (
    user.role === "student" &&
    attempt.student.toString() !== user._id.toString()
  ) {
    throw ApiError.forbidden("Not your attempt");
  }

  // Idempotent: do not submit or calculate an already-finished attempt again.
  if (attempt.status !== "in_progress") {
    return attempt;
  }

  const result = await calculateResult(attempt._id);

  attempt.status = auto ? "auto_submitted" : "submitted";
  attempt.submittedAt = new Date();

  Object.assign(attempt, result);
  await attempt.save();

  logger.info("Attempt submitted", {
    attemptId: attempt._id,
    auto,
    score: attempt.score,
  });

  emitToRoom(`exam:${attempt.exam}`, "exam_submitted", {
    attemptId: attempt._id,
    studentId: attempt.student,
    score: attempt.score,
  });

  return attempt;
}


//list all attempts for a student


/**
 * List attempts with role-based access control,
 * pagination, and filters.
 */
export async function listAttempts(user, query = {}) {
  if (!user?._id || !user?.role) {
    throw ApiError.unauthorized("Authentication required");
  }

  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  const filter = {};

  // Students can only see their own attempts.
  if (user.role === "student") {
    filter.student = user._id;
  } else if (user.role === "teacher") {
    // Teachers can only see attempts for their own exams.
    const examFilter = { createdBy: user._id };

    if (query.examId) {
      if (!mongoose.isValidObjectId(query.examId)) {
        throw ApiError.badRequest("Invalid exam ID");
      }

      examFilter._id = query.examId;
    }

    const exams = await Exam.find(examFilter).select("_id").lean();
    const examIds = exams.map((exam) => exam._id);

    filter.exam = { $in: examIds };

    if (query.studentId) {
      if (!mongoose.isValidObjectId(query.studentId)) {
        throw ApiError.badRequest("Invalid student ID");
      }

      filter.student = query.studentId;
    }
  } else if (user.role === "admin") {
    // Admins can view attempts across the system.
    if (query.studentId) {
      if (!mongoose.isValidObjectId(query.studentId)) {
        throw ApiError.badRequest("Invalid student ID");
      }

      filter.student = query.studentId;
    }

    if (query.examId) {
      if (!mongoose.isValidObjectId(query.examId)) {
        throw ApiError.badRequest("Invalid exam ID");
      }

      filter.exam = query.examId;
    }
  } else {
    throw ApiError.forbidden("You cannot access exam attempts");
  }

  const allowedStatuses = [
    "in_progress",
    "submitted",
    "auto_submitted",
    "expired",
  ];

  if (query.status) {
    if (!allowedStatuses.includes(query.status)) {
      throw ApiError.badRequest("Invalid attempt status");
    }

    filter.status = query.status;
  }

  const [items, total] = await Promise.all([
    Attempt.find(filter)
      .populate("student", "name email")
      .populate("exam", "title subject")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Attempt.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Get one attempt while enforcing ownership and exam access.
 */
export async function getAttemptById(user, attemptId) {
  if (!user?._id || !user?.role) {
    throw ApiError.unauthorized("Authentication required");
  }

  if (!mongoose.isValidObjectId(attemptId)) {
    throw ApiError.badRequest("Invalid attempt ID");
  }

  const attempt = await Attempt.findById(attemptId)
    .populate("student", "name email")
    .populate("exam", "title subject createdBy");

  if (!attempt) {
    throw ApiError.notFound("Attempt not found");
  }

  if (user.role === "student") {
    if (
      attempt.student._id.toString() !== user._id.toString()
    ) {
      throw ApiError.forbidden("You cannot access this attempt");
    }
  } else if (user.role === "teacher") {
    if (
      !attempt.exam ||
      attempt.exam.createdBy?.toString() !== user._id.toString()
    ) {
      throw ApiError.forbidden("You cannot access this attempt");
    }
  } else if (user.role !== "admin") {
    throw ApiError.forbidden("You cannot access this attempt");
  }

  return attempt;
}

