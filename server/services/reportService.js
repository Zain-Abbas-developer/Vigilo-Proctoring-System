import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Violation from '../models/Violation.js';

const getDateRange = (range) => {
  const days = Number(range);

  if (![7, 15, 30].includes(days)) {
    return null;
  }

  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - days);

  return { startDate, endDate };
};

export async function analyticsReport(range = 30) {
  const dateRange = getDateRange(range);

  if (!dateRange) {
    const error = new Error('Range must be 7, 15, or 30 days');
    error.statusCode = 400;
    throw error;
  }

  const { startDate, endDate } = dateRange;

  const completedAttemptFilter = {
    status: {
      $in: ['submitted', 'auto_submitted'],
    },
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const [
    overview,
    summary,
    scoreDistribution,
    examPerformance,
    topStudents,
  ] = await Promise.all([

    // =========================
    // OVERVIEW
    // =========================
    Attempt.aggregate([
      {
        $match: completedAttemptFilter,
      },
      {
        $group: {
          _id: null,

          averageScore: {
            $avg: '$percentage',
          },

          totalAttempts: {
            $sum: 1,
          },

          passedAttempts: {
            $sum: {
              $cond: ['$passed', 1, 0],
            },
          },

          averageRisk: {
            $avg: '$violationCount',
          },
        },
      },
    ]),

    // =========================
    // SUMMARY
    // =========================
    Promise.all([
      Exam.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      Attempt.countDocuments(completedAttemptFilter),

      Attempt.countDocuments({
        ...completedAttemptFilter,
        passed: true,
      }),

      Attempt.countDocuments({
        ...completedAttemptFilter,
        violationCount: {
          $gt: 0,
        },
      }),
    ]),

    // =========================
    // SCORE DISTRIBUTION
    // =========================
    Attempt.aggregate([
      {
        $match: completedAttemptFilter,
      },
      {
        $bucket: {
          groupBy: '$percentage',

          boundaries: [0, 60, 70, 80, 90, 101],

          default: 'unknown',

          output: {
            students: {
              $sum: 1,
            },
          },
        },
      },
    ]),

    // =========================
    // EXAM PERFORMANCE
    // =========================
    Attempt.aggregate([
      {
        $match: completedAttemptFilter,
      },

      {
        $group: {
          _id: '$exam',

          attempts: {
            $sum: 1,
          },

          average: {
            $avg: '$percentage',
          },

          passed: {
            $sum: {
              $cond: ['$passed', 1, 0],
            },
          },

          averageRisk: {
            $avg: '$violationCount',
          },
        },
      },

      {
        $lookup: {
          from: 'exams',
          localField: '_id',
          foreignField: '_id',
          as: 'exam',
        },
      },

      {
        $unwind: {
          path: '$exam',
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 0,

          exam: '$exam.title',

          attempts: 1,

          average: {
            $round: ['$average', 1],
          },

          passRate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: ['$passed', '$attempts'],
                  },
                  100,
                ],
              },
              1,
            ],
          },

          risk: {
            $round: [
              {
                $min: [
                  100,
                  {
                    $multiply: ['$averageRisk', 10],
                  },
                ],
              },
              1,
            ],
          },
        },
      },

      {
        $sort: {
          attempts: -1,
        },
      },

      {
        $limit: 20,
      },
    ]),

    // =========================
    // TOP STUDENTS
    // =========================
    Attempt.aggregate([
      {
        $match: completedAttemptFilter,
      },

      {
        $group: {
          _id: '$student',

          exams: {
            $sum: 1,
          },

          average: {
            $avg: '$percentage',
          },

          totalViolations: {
            $sum: '$violationCount',
          },
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },

      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $match: {
          'student.role': 'student',
        },
      },

      {
        $project: {
          _id: 0,

          name: '$student.name',

          exams: 1,

          average: {
            $round: ['$average', 1],
          },

          risk: {
            $round: [
              {
                $min: [
                  100,
                  {
                    $multiply: [
                      {
                        $divide: [
                          '$totalViolations',
                          '$exams',
                        ],
                      },
                      10,
                    ],
                  },
                ],
              },
              1,
            ],
          },
        },
      },

      {
        $sort: {
          average: -1,
        },
      },

      {
        $limit: 10,
      },
    ]),
  ]);

  // =========================
  // ACTIVE STUDENTS
  // =========================

  const activeStudents = await User.countDocuments({
    role: 'student',
    status: 'active',
  });

  const overviewData = overview[0] || {};

  const averageScore = Number(
    overviewData.averageScore || 0
  );

  const passRate = overviewData.totalAttempts
    ? (
        (overviewData.passedAttempts /
          overviewData.totalAttempts) *
        100
      )
    : 0;

  /*
   * violationCount ko 10 points per violation
   * ke scale par 0-100 risk mein convert kar rahe hain.
   */
  const averageRisk = Math.min(
    100,
    Number(overviewData.averageRisk || 0) * 10
  );

  // =========================
  // SCORE DISTRIBUTION FORMAT
  // =========================

  const distributionMap = {
    90: {
      label: '90 - 100%',
      students: 0,
    },

    80: {
      label: '80 - 89%',
      students: 0,
    },

    70: {
      label: '70 - 79%',
      students: 0,
    },

    60: {
      label: '60 - 69%',
      students: 0,
    },

    0: {
      label: 'Below 60%',
      students: 0,
    },
  };

  for (const item of scoreDistribution) {
    if (item._id === 90) {
      distributionMap[90].students = item.students;
    }

    if (item._id === 80) {
      distributionMap[80].students = item.students;
    }

    if (item._id === 70) {
      distributionMap[70].students = item.students;
    }

    if (item._id === 60) {
      distributionMap[60].students = item.students;
    }

    if (item._id === 0) {
      distributionMap[0].students = item.students;
    }
  }

  const totalDistributionStudents =
    Object.values(distributionMap).reduce(
      (total, item) => total + item.students,
      0
    );

  const formattedDistribution = [
    distributionMap[90],
    distributionMap[80],
    distributionMap[70],
    distributionMap[60],
    distributionMap[0],
  ].map((item) => ({
    ...item,

    value: totalDistributionStudents
      ? Number(
          (
            (item.students / totalDistributionStudents) *
            100
          ).toFixed(1)
        )
      : 0,
  }));

  return {
    range: Number(range),

    overview: {
      averageScore: Number(averageScore.toFixed(1)),
      passRate: Number(passRate.toFixed(1)),
      activeStudents,
      averageRisk: Number(averageRisk.toFixed(1)),
    },

    summary: {
      totalExams: summary[0],
      totalAttempts: summary[1],
      passed: summary[2],
      flagged: summary[3],
    },

    scoreDistribution: formattedDistribution,

    examPerformance,

    topStudents,
  };
}