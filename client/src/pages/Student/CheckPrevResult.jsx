import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Trophy,
  Target,
  TrendingUp,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  BarChart3,
  FileText,
  Award,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";

import { attemptService } from "../../services/attemptService.js";
import ResultDetailModal from "../../components/student/ResultDetailModal.jsx";

// Format date for display
const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
};

// Calculate score percentage
const getPercentage = (attempt) => {
  if (
    attempt?.percentage != null &&
    Number.isFinite(Number(attempt.percentage))
  ) {
    return Math.round(Number(attempt.percentage) * 10) / 10;
  }

  const score = Number(attempt?.score ?? 0);

  const total = Number(
    attempt?.totalMarks ??
      attempt?.total ??
      attempt?.exam?.totalMarks ??
      0
  );

  if (total > 0) {
    return Math.round((score / total) * 1000) / 10;
  }

  return score;
};

// Normalize backend attempt data for the UI
const normalizeAttempt = (attempt, index) => {
  const exam =
    attempt?.exam && typeof attempt.exam === "object"
      ? attempt.exam
      : {};

  const percentage = getPercentage(attempt);

  const total = Number(
    attempt?.totalMarks ??
      attempt?.total ??
      exam?.totalMarks ??
      0
  );

  const passingMarks = Number(
    attempt?.passingMarks ??
      exam?.passingMarks ??
      50
  );

  // Prefer the backend's explicit pass/fail result.
  const passed =
    typeof attempt?.passed === "boolean"
      ? attempt.passed
      : total > 0
        ? Number(attempt?.score ?? 0) >= passingMarks
        : percentage >= passingMarks;

  const start = attempt?.startedAt
    ? new Date(attempt.startedAt).getTime()
    : null;

  const end =
    attempt?.submittedAt ??
    attempt?.completedAt ??
    attempt?.endedAt;

  const endTime = end ? new Date(end).getTime() : null;

  const elapsed =
    start != null &&
    endTime != null &&
    Number.isFinite(start) &&
    Number.isFinite(endTime)
      ? Math.max(0, Math.round((endTime - start) / 60000))
      : null;

  const questions = Array.isArray(attempt?.answers)
    ? attempt.answers.length
    : Number(
        attempt?.totalQuestions ??
          exam?.totalQuestions ??
          0
      );

  const rawDate =
    attempt?.submittedAt ??
    attempt?.completedAt ??
    attempt?.endedAt ??
    attempt?.createdAt ??
    attempt?.updatedAt ??
    null;

  return {
    ...attempt,

    id: attempt?._id ?? attempt?.id ?? `attempt-${index}`,

    title:
      exam?.title ??
      attempt?.examTitle ??
      attempt?.title ??
      "Untitled exam",

    subject: exam?.subject ?? attempt?.subject ?? "General",

    date: formatDate(rawDate),

    rawDate,

    score: Number(attempt?.score ?? 0),

    total: total || 100,

    percentage,

    status: passed ? "Passed" : "Failed",

    time:
      elapsed != null
        ? `${elapsed} min`
        : attempt?.timeSpent != null
          ? `${attempt.timeSpent} min`
          : "—",

    questions,
  };
};

// Extract attempts from common API response structures
const extractAttempts = (response) => {
  let payload = response;

  for (let i = 0; i < 3; i += 1) {
    if (
      payload &&
      !Array.isArray(payload) &&
      typeof payload === "object" &&
      payload.data != null
    ) {
      payload = payload.data;
    } else {
      break;
    }
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.attempts)) {
    return payload.attempts;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const PreviousResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] = useState(
    () => location.state?.selectedResult ?? null
  );

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Close result detail modal
  const closeResultModal = () => {
    setSelectedExam(null);

    if (location.state?.selectedResult) {
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  };

  // Fetch attempts using attemptService
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Your service returns response.data.data
      const response = await attemptService.list();

      const attemptList = extractAttempts(response);

      setAttempts(attemptList.map(normalizeAttempt));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your previous results."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Completed exam attempts
  const completedResults = useMemo(() => {
    return attempts
      .filter((item) => {
        const status = String(item.status ?? "").toLowerCase();

        const incompleteStatuses = [
          "in_progress",
          "in-progress",
          "started",
          "pending",
        ];

        return (
          Boolean(item.rawDate) &&
          !incompleteStatuses.includes(status)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.rawDate).getTime() -
          new Date(a.rawDate).getTime()
      );
  }, [attempts]);

  // Date filter for the reports table
  const examResults = useMemo(() => {
    const now = Date.now();

    const cutoff =
      dateFilter === "30"
        ? now - 30 * 24 * 60 * 60 * 1000
        : dateFilter === "90"
          ? now - 90 * 24 * 60 * 60 * 1000
          : null;

    if (!cutoff) {
      return completedResults;
    }

    return completedResults.filter(
      (item) => new Date(item.rawDate).getTime() >= cutoff
    );
  }, [completedResults, dateFilter]);

  // Summary analytics
  const scores = completedResults
    .map((item) => item.percentage)
    .filter(Number.isFinite);

  const passedExams = completedResults.filter(
    (item) => item.status === "Passed"
  ).length;

  const failedExams = completedResults.length - passedExams;

  const summary = {
    totalExams: completedResults.length,

    averageScore: scores.length
      ? Math.round(
          (scores.reduce((sum, score) => sum + score, 0) /
            scores.length) *
            10
        ) / 10
      : 0,

    passRate: completedResults.length
      ? Math.round(
          (passedExams / completedResults.length) * 100
        )
      : 0,

    bestScore: scores.length ? Math.max(...scores) : 0,
  };

  // Recent performance trend
  const scoreTrend = [...completedResults]
    .reverse()
    .slice(-8);

  // Subject-wise performance
  const subjectPerformance = Object.values(
    completedResults.reduce((acc, result) => {
      const subject = result.subject || "General";

      if (!acc[subject]) {
        acc[subject] = {
          subject,
          score: 0,
          count: 0,
        };
      }

      acc[subject].score += result.percentage;
      acc[subject].count += 1;

      return acc;
    }, {})
  )
    .map((item) => ({
      ...item,
      score: Math.round(item.score / item.count),
    }))
    .slice(0, 5);

  // Average completion time
  const averageTimeValues = completedResults
    .map((item) => Number.parseInt(item.time, 10))
    .filter(Number.isFinite);

  const averageTime = averageTimeValues.length
    ? Math.round(
        averageTimeValues.reduce(
          (sum, value) => sum + value,
          0
        ) / averageTimeValues.length
      )
    : null;

  // Download CSV report
  const downloadReport = () => {
    const rows = [
      [
        "Exam",
        "Subject",
        "Date",
        "Score",
        "Total Marks",
        "Percentage",
        "Status",
        "Time",
      ],

      ...completedResults.map((item) => [
        item.title,
        item.subject,
        item.date,
        item.score,
        item.total,
        item.percentage,
        item.status,
        item.time,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "vigilo-previous-results.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const cards = [
    {
      label: "Total Exams",
      value: summary.totalExams,
      Icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Average Score",
      value: `${summary.averageScore}%`,
      Icon: BarChart3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      label: "Pass Rate",
      value: `${summary.passRate}%`,
      Icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Best Score",
      value: `${summary.bestScore}%`,
      Icon: Trophy,
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-[#0F172A] sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Previous Results
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your exam performance, analytics and reports.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadReport}
            disabled={!completedResults.length}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Download Overall Report
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchResults}
              className="w-fit font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 dark:border-slate-700/70 dark:bg-[#0F172A]"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${bg}`}>
                  <Icon className={color} size={21} />
                </div>

                {label === "Best Score" && (
                  <Award className={color} size={19} />
                )}

                {label === "Average Score" && (
                  <TrendingUp
                    className="text-emerald-500"
                    size={19}
                  />
                )}
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {label}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {loading ? "—" : value}
              </h2>
            </div>
          ))}
        </div>

        {/* Performance analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-[#0F172A] lg:col-span-2">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Performance Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your score progression across recent completed exams
            </p>

            {scoreTrend.length > 0 ? (
              <div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-200 px-4 dark:border-slate-700">
                {scoreTrend.map((exam, index) => (
                  <div
                    key={exam.id}
                    title={`${exam.title}: ${exam.percentage}%`}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="relative flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-indigo-500 transition hover:bg-indigo-600"
                        style={{
                          height: `${Math.max(
                            2,
                            Math.min(100, exam.percentage)
                          )}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-xs font-semibold text-slate-700 group-hover:block dark:text-slate-300">
                          {exam.percentage}%
                        </span>
                      </div>
                    </div>

                    <span className="mt-2 truncate text-center text-[10px] text-slate-400">
                      E-{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-slate-500">
                {loading
                  ? "Loading performance..."
                  : "No completed exam scores available yet."}
              </p>
            )}
          </section>

          {/* Attempt analytics */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-[#0F172A]">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Attempt Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Overall examination statistics
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Passed Exams
                  </span>

                  <span className="font-semibold text-emerald-600">
                    {passedExams}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${summary.passRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Failed Exams
                  </span>

                  <span className="font-semibold text-red-500">
                    {failedExams}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${
                        completedResults.length
                          ? (failedExams / completedResults.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#111C33]">
                <div className="flex items-center gap-3">
                  <Clock3 size={20} className="text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Average Time
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {averageTime == null
                        ? "—"
                        : `${averageTime} Minutes`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#111C33]">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-emerald-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Average Score
                    </p>

                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {summary.averageScore}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Subject performance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/70 dark:bg-[#0F172A]">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Subject Performance
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Calculated from your completed attempts
          </p>

          {subjectPerformance.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
              {subjectPerformance.map((item) => (
                <div
                  key={item.subject}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#111C33]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.subject}
                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.score}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, item.score)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-sm text-slate-500">
              Subject analytics will appear after completed exams.
            </p>
          )}
        </section>

        {/* Exam reports */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/70 dark:bg-[#0F172A]">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Exam Reports
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Detailed history of your previous examinations
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CalendarDays size={16} />

              <span className="sr-only">
                Filter results by date
              </span>

              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-[#111C33]"
              >
                <option value="all">All time</option>
                <option value="90">Last 90 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5">
              <thead className="bg-slate-50 dark:bg-[#111C33]">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Exam</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Report</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examResults.map((exam) => (
                  <tr
                    key={exam.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {exam.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {exam.subject} · {exam.questions} Questions
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {exam.date}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {exam.percentage}%
                        </span>

                        <div className="hidden h-1.5 w-20 rounded-full bg-slate-100 dark:bg-slate-800 sm:block">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, exam.percentage)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {exam.time}
                    </td>

                    <td className="px-6 py-4">
                      {exam.status === "Passed" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                          <CheckCircle2 size={14} />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10">
                          <XCircle size={14} />
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          title="View Result"
                          onClick={() => setSelectedExam(exam)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-[#111C33] dark:text-slate-400"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && examResults.length === 0 && !error && (
            <div className="py-14 text-center">
              <FileText
                className="mx-auto mb-3 text-slate-300"
                size={32}
              />

              <p className="font-medium text-slate-700 dark:text-slate-200">
                No previous results found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed exam results will appear here.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading your results...
            </div>
          )}
        </section>
      </div>

      {/* Result detail modal */}
      <ResultDetailModal
        result={selectedExam}
        onClose={closeResultModal}
      />
    </div>
  );
};

export default PreviousResult;
