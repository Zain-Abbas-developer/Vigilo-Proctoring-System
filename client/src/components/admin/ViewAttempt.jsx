import { useEffect } from "react";
import {
  X,
  User,
  FileText,
  Clock,
  CalendarDays,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  PlayCircle,
  Trophy,
} from "lucide-react";

const ViewAttemptModal = ({ attempt, onClose }) => {
  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!attempt) return null;

  // --------------------------------
  // Status styles
  // --------------------------------
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";

      case "in progress":
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";

      case "flagged":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  // --------------------------------
  // Risk styles
  // --------------------------------
  const getRiskStyle = (risk) => {
    const numericRisk =
      typeof risk === "string"
        ? parseInt(risk.replace("%", ""))
        : risk;

    if (numericRisk >= 70) {
      return "text-red-600 dark:text-red-400";
    }

    if (numericRisk >= 40) {
      return "text-yellow-600 dark:text-yellow-400";
    }

    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/75"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================
            HEADER
        ========================================== */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-[#111827]">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Attempt Details
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Detailed information about this exam attempt
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">

          {/* =========================================
              STUDENT + EXAM
          ========================================== */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Student Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">
              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <User size={21} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    STUDENT
                  </p>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {attempt.student?.name || "Unknown Student"}
                  </h3>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Attempt
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.attempt || "#1"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Student ID
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.studentId || "STU-001"}
                  </p>
                </div>

              </div>
            </div>

            {/* Exam Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">
              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <FileText size={21} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    EXAM
                  </p>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {attempt.exam || "Unknown Exam"}
                  </h3>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.duration || "1h 15m"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exam Type
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.examType || "Final Exam"}
                  </p>
                </div>

              </div>
            </div>

          </div>


          {/* =========================================
              STATISTICS
          ========================================== */}
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

            {/* Score */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#172235]">
              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Score
                </span>

                <Trophy
                  size={18}
                  className="text-yellow-500"
                />

              </div>

              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {attempt.score || "82%"}
              </p>
            </div>


            {/* Risk */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#172235]">
              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Risk
                </span>

                <ShieldAlert
                  size={18}
                  className={getRiskStyle(attempt.risk || 35)}
                />

              </div>

              <p
                className={`mt-2 text-2xl font-bold ${getRiskStyle(
                  attempt.risk || 35
                )}`}
              >
                {attempt.risk || "35%"}
              </p>
            </div>


            {/* Violations */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#172235]">
              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Violations
                </span>

                <AlertTriangle
                  size={18}
                  className="text-yellow-500"
                />

              </div>

              <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {attempt.violations ?? 2}
              </p>
            </div>


            {/* Status */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#172235]">
              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Status
                </span>

                {attempt.status?.toLowerCase() ===
                "completed" ? (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500"
                  />
                ) : (
                  <PlayCircle
                    size={18}
                    className="text-blue-500"
                  />
                )}

              </div>

              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                  attempt.status
                )}`}
              >
                {attempt.status || "Completed"}
              </span>
            </div>

          </div>


          {/* =========================================
              TIMELINE
          ========================================== */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">

            <h3 className="mb-5 font-semibold text-slate-900 dark:text-white">
              Attempt Timeline
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Started */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Started
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.started ||
                      "Sep 3, 2026, 9:30 AM"}
                  </p>
                </div>

              </div>


              {/* Submitted */}
              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Clock size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    {attempt.submitted ||
                      "Sep 3, 2026, 10:45 AM"}
                  </p>
                </div>

              </div>

            </div>
          </div>


          {/* =========================================
              QUESTIONS SUMMARY
          ========================================== */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Questions Summary
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Student's performance across questions
                </p>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {attempt.correct || 8} /{" "}
                {attempt.totalQuestions || 10} Correct
              </span>

            </div>


            {/* Progress */}
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${
                    ((attempt.correct || 8) /
                      (attempt.totalQuestions || 10)) *
                    100
                  }%`,
                }}
              />
            </div>


            {/* Question stats */}
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

              {/* Total */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#1e2a3d]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {attempt.totalQuestions || 10}
                </p>
              </div>


              {/* Correct */}
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-500/10 dark:bg-emerald-500/5">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Correct
                </p>

                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  {attempt.correct || 8}
                </p>

              </div>


              {/* Wrong */}
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 dark:border-red-500/10 dark:bg-red-500/5">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Wrong
                </p>

                <p className="mt-1 font-semibold text-red-600 dark:text-red-400">
                  {attempt.wrong || 2}
                </p>

              </div>


              {/* Skipped */}
              <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-500/10 dark:bg-yellow-500/5">

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Skipped
                </p>

                <p className="mt-1 font-semibold text-yellow-600 dark:text-yellow-400">
                  {attempt.skipped || 0}
                </p>

              </div>

            </div>
          </div>


          {/* =========================================
              PROCTORING VIOLATIONS
          ========================================== */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">

            <div className="mb-4 flex items-center gap-2">

              <AlertTriangle
                size={19}
                className="text-red-500"
              />

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Proctoring Violations
              </h3>

            </div>


            <div className="space-y-3">

              {(attempt.violationDetails || [
                {
                  type: "Multiple faces detected",
                  time: "10:12 AM",
                  severity: "High",
                },
                {
                  type: "Student looked away from screen",
                  time: "10:26 AM",
                  severity: "Medium",
                },
              ]).map((violation, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#1e2a3d]"
                >

                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {violation.type}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {violation.time}
                    </p>
                  </div>


                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      violation.severity === "High"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
                    }`}
                  >
                    {violation.severity}
                  </span>

                </div>

              ))}

            </div>
          </div>

        </div>


        {/* =========================================
            FOOTER
        ========================================== */}
        <div className="sticky bottom-0 flex justify-end border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-[#111827]">

          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default ViewAttemptModal;