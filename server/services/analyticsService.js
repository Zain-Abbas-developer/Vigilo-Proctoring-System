import User from "../models/User.js";
import Exam from "../models/Exam.js";
import Attempt from "../models/Attempt.js";
import Violation from "../models/Violation.js";
import Question from "../models/Question.js";

export async function adminDashboard() {
  const now = new Date();
  const [
    totalStudents,
    totalTeachers,
    totalExams,
    activeExams,
    completedExams,
    totalAttempts,
    pendingReviews,
    detectedViolations,
    flaggedStudents,
    avgRiskScore,
    violationTimeLine,
    violationType,
    RiskDistribution,
    LiveExams,
    recentViolations,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    Exam.countDocuments(),
    Exam.countDocuments({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $nin: ["draft", "cancelled"] },
    }),
    Exam.countDocuments({
      endTime: { $lt: now },
      status: { $nin: ["draft", "cancelled"] },
    }),
    Attempt.countDocuments(),
    Violation.countDocuments({ reviewed: false }),
    Violation.countDocuments(),
    User.aggregate([
      { $match: { role: "student" } },
      {
        $lookup: {
          from: "violations",
          localField: "_id",
          foreignField: "student",
          as: "violations",
        },
      },
      { $addFields: { violationCount: { $size: "$violations" } } },
      { $match: { violationCount: { $gt: 0 } } },
      { $sort: { violationCount: -1 } },
      { $limit: 10 },
      { $project: { name: 1, email: 1, violationCount: 1 } },
    ]),

    Violation.aggregate([
      {
        $group: {
          _id: "$student",
          riskScore: { $sum: 1 },
        },
      },
      { $group: { _id: null, avg: { $avg: "$riskScore" } } },
    ]),

    Violation.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Violation.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Violation.aggregate([
      {
        $bucket: {
          groupBy: "$severity",
          boundaries: [0, 25, 50, 75, 101],
          default: "unknown",
          output: { count: { $sum: 1 } },
        },
      },
    ]),

    Exam.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $nin: ["scheduled", "cancelled"] },
    }).populate("createdBy", "name"),

    Violation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("student", "name email")
      .populate("exam", "title"),
  ]);
  return {
    totalStudents,
    totalTeachers,
    totalExams,
    activeExams,
    completedExams,
    totalAttempts,
    pendingReviews,
    detectedViolations,
    flaggedStudents,
    avgRiskScore: avgRiskScore[0]?.avg || 0,
    violationTimeLine,
    violationType,
    RiskDistribution,
    LiveExams,
    recentViolations,
  };
}

// export async function teacherDashboard(teacherId) {
//   const now = new Date();
//   const examIds = await Exam.find({ createdBy: teacherId }).distinct('_id');

//   const [totalExams, activeExams, upcomingExams, completedExams] = await Promise.all([
//     Exam.countDocuments({ createdBy: teacherId }),
//     Exam.countDocuments({ createdBy: teacherId, startTime: { $lte: now }, endTime: { $gte: now }, status: { $nin: ['draft', 'cancelled'] } }),
//     Exam.countDocuments({ createdBy: teacherId, startTime: { $gt: now } }),
//     Exam.countDocuments({ createdBy: teacherId, endTime: { $lt: now } }),
//   ]);

//   const [totalStudents, recentAttempts, recentViolations] = await Promise.all([
//     Exam.aggregate([
//       { $match: { createdBy: (await import('mongoose')).default.Types.ObjectId.createFromHexString(String(teacherId)) } },
//       { $unwind: '$assignedStudents' },
//       { $group: { _id: '$assignedStudents' } },
//       { $count: 'count' },
//     ]).then((r) => r[0]?.count || 0),
//     Attempt.find({ exam: { $in: examIds } }).sort({ createdAt: -1 }).limit(10)
//       .populate('student', 'name rollNumber').populate('exam', 'title'),
//     Violation.find({ exam: { $in: examIds } }).sort({ createdAt: -1 }).limit(10)
//       .populate('student', 'name rollNumber').populate('exam', 'title'),
//   ]);

//   return { totalExams, activeExams, upcomingExams, completedExams, totalStudents, recentAttempts, recentViolations };
// }

export async function teacherDashboard(teacherId) {
  const now = new Date();

  const exams = await Exam.find({ createdBy: teacherId })
    .sort({ createdAt: -1 })
    .select("title subject startTime endTime status createdAt assignedStudents")
    .limit(10);

  const examIds = exams.map((exam) => exam._id);

  const [
    totalExams,
    activeExams,
    upcomingExams,
    completedExams,
    totalStudents,
    recentAttempts,
    recentViolations,
    flaggedAttemptIds,
  ] = await Promise.all([
    Exam.countDocuments({ createdBy: teacherId }),

    Exam.countDocuments({
      createdBy: teacherId,
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $nin: ["draft", "cancelled"] },
    }),

    Exam.countDocuments({
      createdBy: teacherId,
      startTime: { $gt: now },
    }),

    Exam.countDocuments({
      createdBy: teacherId,
      endTime: { $lt: now },
    }),

    Exam.aggregate([
      {
        $match: {
          createdBy: (
            await import("mongoose")
          ).default.Types.ObjectId.createFromHexString(String(teacherId)),
        },
      },
      { $unwind: "$assignedStudents" },
      { $group: { _id: "$assignedStudents" } },
      { $count: "count" },
    ]).then((result) => result[0]?.count || 0),

    Attempt.find({ exam: { $in: examIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("student", "name rollNumber")
      .populate("exam", "title subject"),

    Violation.find({ exam: { $in: examIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("student", "name rollNumber")
      .populate("exam", "title"),

    Violation.distinct("attempt", {
      exam: { $in: examIds },
      attempt: { $exists: true, $ne: null },
    }),
  ]);

  const flaggedAttempts = await Attempt.find({
    _id: { $in: flaggedAttemptIds },
  })
    .sort({ createdAt: -1 })
    .populate("student", "name rollNumber")
    .populate("exam", "title subject");

  const flaggedAttemptIdsSet = new Set(
    flaggedAttemptIds.map((id) => String(id)),
  );

  const recentExamsData = exams.map((exam) => ({
    _id: exam._id,
    title: exam.title,
    subject: exam.subject,
    students: exam.assignedStudents?.length || 0,
    duration:
      exam.startTime && exam.endTime
        ? `${Math.round(
            (new Date(exam.endTime) - new Date(exam.startTime)) / 60000,
          )} min`
        : "-",
    status: exam.deriveStatus ? exam.deriveStatus(now) : exam.status,
  }));

  const recentAttemptsData = recentAttempts.map((attempt) => ({
    id: attempt._id,
    student: attempt.student?.name || "Unknown student",
    exam: attempt.exam?.title || "Unknown exam",
    score: attempt.percentage ?? attempt.score ?? null,
    risk: flaggedAttemptIdsSet.has(String(attempt._id)) ? 100 : 0,
    status: flaggedAttemptIdsSet.has(String(attempt._id))
      ? "flagged"
      : "completed",
  }));

  return {
    stats: {
      totalExams: {
        value: totalExams,
        change: "",
        positive: true,
      },
      totalStudents: {
        value: totalStudents,
        change: "",
        positive: true,
      },
      activeExams: {
        value: activeExams,
        change: "",
        positive: true,
      },
      flagged: {
        value: flaggedAttempts.length,
        change: "",
        positive: false,
      },
    },

    recentExams: recentExamsData,
    recentAttempts: recentAttemptsData,
  };
}

// export async function studentDashboard(studentId) {
//   const now = new Date();

//   const [exams, recentAttempts, allAttempts, violationCount] =
//     await Promise.all([
//       Exam.find({ assignedStudents: studentId }).populate("createdBy", "name"),

//       Attempt.find({ student: studentId })
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .populate("exam", "title subject"),

//       Attempt.find({ student: studentId }).select(
//         "score percentage totalMarks createdAt",
//       ),

//       Violation.countDocuments({ student: studentId }),
//     ]);

//   const questionCounts = await Question.aggregate([
//     {
//       $match: {
//         exam: { $in: exams.map((exam) => exam._id) },
//       },
//     },
//     {
//       $group: {
//         _id: "$exam",
//         totalQuestions: { $sum: 1 },
//       },
//     },
//   ]);

//   const questionCountMap = new Map(
//     questionCounts.map((item) => [item._id.toString(), item.totalQuestions]),
//   );

//   const upcoming = [];
//   const active = [];
//   const completed = [];

//   for (const exam of exams) {
//     const status = exam.deriveStatus(now);
//     const dto = exam.toDTO(now);

//     dto.duration = exam.duration;
//     dto.startTime = exam.startTime;
//     dto.startDate = exam.startTime;

//     dto.totalQuestions = questionCountMap.get(exam._id.toString()) ?? 0;

//     if (status === "scheduled") upcoming.push(dto);
//     else if (status === "active") active.push(dto);
//     else if (status === "completed") completed.push(dto);
//   }

//   const scores = allAttempts
//     .map((attempt) => {
//       if (attempt.percentage != null) return Number(attempt.percentage);

//       if (
//         attempt.score != null &&
//         attempt.totalMarks &&
//         attempt.totalMarks > 0
//       ) {
//         return (Number(attempt.score) / Number(attempt.totalMarks)) * 100;
//       }

//       return Number(attempt.score);
//     })
//     .filter((score) => Number.isFinite(score));

//   const averageScore = scores.length
//     ? scores.reduce((total, score) => total + score, 0) / scores.length
//     : 0;

//   const riskScore = Math.min(100, violationCount * 10);

//   const performance = allAttempts
//     .filter((attempt) => attempt.createdAt)
//     .reduce((result, attempt) => {
//       const date = new Date(attempt.createdAt);
//       const month = date.toLocaleString("en-US", { month: "short" });

//       const score =
//         attempt.percentage != null
//           ? Number(attempt.percentage)
//           : Number(attempt.score || 0);

//       if (!result[month]) {
//         result[month] = { month, score: 0, count: 0 };
//       }

//       result[month].score += score;
//       result[month].count += 1;

//       return result;
//     }, {});

//   const performanceData = Object.values(performance).map((item) => ({
//     month: item.month,
//     score: Math.round(item.score / item.count),
//   }));

//   return {
//     upcomingExams: upcoming,
//     activeExams: active,
//     completedExams: completed,
//     recentAttempts,

//     counts: {
//       upcoming: upcoming.length,
//       active: active.length,
//       completed: completed.length,
//     },

//     averageScore: Math.round(averageScore * 10) / 10,
//     riskScore,
//     proctoringStatus: riskScore < 40 ? "Low Risk" : "Needs Attention",
//     performance: performanceData,
//   };
// }


const toPercentage = (attempt) => {
  if (attempt.percentage != null) {
    return Number(attempt.percentage);
  }

  const score = Number(attempt.score ?? 0);
  const totalMarks = Number(attempt.totalMarks ?? 0);

  if (totalMarks > 0) {
    return (score / totalMarks) * 100;
  }

  return score;
};

const roundToOneDecimal = (value) =>
  Math.round(value * 10) / 10;

const formatExamDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatExamTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export async function studentDashboard(studentId) {
  const now = new Date();

  // 1. Fetch assigned exams and student attempts.
  const [exams, recentAttempts, allAttempts, violationCount] =
    await Promise.all([
      Exam.find({ assignedStudents: studentId })
        .populate("createdBy", "name")
        .lean(false),

      Attempt.find({ student: studentId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("exam", "title subject")
        .lean(),

      Attempt.find({ student: studentId })
        .select("score percentage totalMarks createdAt status exam")
        .sort({ createdAt: 1 })
        .lean(),

      Violation.countDocuments({ student: studentId }),
    ]);

  // 2. Count questions for assigned exams.
  const questionCounts = await Question.aggregate([
    {
      $match: {
        exam: { $in: exams.map((exam) => exam._id) },
      },
    },
    {
      $group: {
        _id: "$exam",
        totalQuestions: { $sum: 1 },
      },
    },
  ]);

  const questionCountMap = new Map(
    questionCounts.map(({ _id, totalQuestions }) => [
      _id.toString(),
      totalQuestions,
    ]),
  );

  // 3. Prepare exam lists for the dashboard.
  const upcomingExams = [];
  const activeExams = [];
  const completedExams = [];

  for (const exam of exams) {
    const status = exam.deriveStatus(now);
    const dto = exam.toDTO(now);
    const startDate = exam.startTime;

    const dashboardExam = {
      ...dto,
      id: exam._id.toString(),
      _id: exam._id.toString(),
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      totalQuestions:
        questionCountMap.get(exam._id.toString()) ?? 0,
      questions:
        questionCountMap.get(exam._id.toString()) ?? 0,
      startDate,
      startTime: formatExamTime(startDate),
      date: formatExamDate(startDate),
      status:
        status === "active"
          ? "Available"
          : status === "scheduled"
            ? "Upcoming"
            : "Completed",
    };

    if (status === "scheduled") {
      upcomingExams.push(dashboardExam);
    } else if (status === "active") {
      activeExams.push(dashboardExam);
    } else if (status === "completed") {
      completedExams.push(dashboardExam);
    }
  }

  // 4. Calculate average score.
  const scores = allAttempts
    .map(toPercentage)
    .filter(Number.isFinite);

  const averageScore = scores.length
    ? roundToOneDecimal(
        scores.reduce((sum, score) => sum + score, 0) /
          scores.length,
      )
    : 0;

  // 5. Calculate proctoring risk.
  const riskScore = Math.min(100, violationCount * 10);

  // 6. Build a chronological, month-wise performance chart.
  const monthlyPerformance = new Map();

  for (const attempt of allAttempts) {
    if (!attempt.createdAt) continue;

    const date = new Date(attempt.createdAt);
    const monthKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    const score = toPercentage(attempt);
    if (!Number.isFinite(score)) continue;

    if (!monthlyPerformance.has(monthKey)) {
      monthlyPerformance.set(monthKey, {
        monthKey,
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        totalScore: 0,
        count: 0,
      });
    }

    const item = monthlyPerformance.get(monthKey);
    item.totalScore += score;
    item.count += 1;
  }

  const performance = [...monthlyPerformance.values()]
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-6)
    .map(({ month, totalScore, count }) => ({
      month,
      score: Math.round(totalScore / count),
    }));

  // 7. Normalize recent results for the dashboard.
  const normalizedRecentAttempts = recentAttempts.map(
    (attempt) => ({
      ...attempt,
      score: roundToOneDecimal(toPercentage(attempt)),
      percentage: roundToOneDecimal(toPercentage(attempt)),
      startedAt: attempt.startedAt ?? attempt.createdAt,
    }),
  );

  // 8. Return a consistent dashboard response.
  return {
    student: {
      // The frontend can use the authenticated user for the name.
    },

    cards: {
      availableExams: {
        value: activeExams.length,
        change: "",
      },
      completedExams: {
        value: completedExams.length,
        change: "",
      },
      averageScore: {
        value: averageScore,
        change: "",
      },
      riskScore: {
        value: riskScore,
        change: "",
      },
    },

    upcomingExams,
    activeExams,
    completedExams,
    recentAttempts: normalizedRecentAttempts,
    performance,

    counts: {
      upcoming: upcomingExams.length,
      active: activeExams.length,
      completed: completedExams.length,
    },

    averageScore,
    riskScore,
    violationCount,

    proctoringStatus:
      riskScore < 40 ? "Low Risk" : "Needs Attention",
  };
}