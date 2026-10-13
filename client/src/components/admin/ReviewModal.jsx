import { useEffect } from "react";
import {
  X,
  AlertTriangle,
  User,
  Mail,
  CalendarDays,
  Clock,
  ShieldAlert,
  Camera,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Flag,
  Activity,
  Monitor,
  Volume2,
} from "lucide-react";

const ViolationReviewModal = ({ violation, onClose }) => {
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

  if (!violation) return null;

  const risk = violation.risk ?? 70;

  const getRiskStyle = () => {
    if (risk >= 85) {
      return {
        badge:
          "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
        icon: "text-red-500",
        label: "Critical",
      };
    }

    if (risk >= 70) {
      return {
        badge:
          "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
        icon: "text-orange-500",
        label: "High",
      };
    }

    if (risk >= 40) {
      return {
        badge:
          "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
        icon: "text-yellow-500",
        label: "Medium",
      };
    }

    return {
      badge:
        "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      icon: "text-blue-500",
      label: "Low",
    };
  };

  const riskStyle = getRiskStyle();

  const student = violation.student || {
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    id: "STU-1006",
    avatar: "",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm dark:bg-black/70"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]"
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Review Violation
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Review suspicious activity and take appropriate action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="overflow-y-auto p-6">
          {/* Violation Overview */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#172235]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {violation.title || "Plagiarism"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Type:{" "}
                    <span className="text-slate-700 dark:text-slate-300">
                      {violation.type || "Plagiarism"}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {violation.date || "Jan 06, 2023"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {violation.time || "3:00 PM"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase ${riskStyle.badge}`}
              >
                {riskStyle.label}
              </div>
            </div>
          </div>

          {/* ================= STUDENT + RISK ================= */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Student */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#172235]">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Student Information
                </h3>
              </div>

              <div className="flex items-center gap-4">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {student.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {student.name}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                    {student.email}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Student ID: {student.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#172235]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className={`h-5 w-5 ${riskStyle.icon}`} />

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Risk Assessment
                  </h3>
                </div>

                <span className={`text-xl font-bold ${riskStyle.icon}`}>
                  {risk}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-current transition-all"
                  style={{
                    width: `${risk}%`,
                    color:
                      risk >= 85
                        ? "#ef4444"
                        : risk >= 70
                          ? "#f97316"
                          : risk >= 40
                            ? "#eab308"
                            : "#3b82f6",
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </div>
          </div>

          {/* ================= EXAM DETAILS ================= */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#172235]">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Exam Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Exam
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {violation.exam || "Mathematics Midterm"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Question
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {violation.question || "Question #12"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Attempt
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {violation.attempt || "ATT-1024"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Duration
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {violation.duration || "01:24:35"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= EVIDENCE ================= */}
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-500" />

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Evidence
                </h3>
              </div>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                Captured automatically
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Camera Evidence */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-indigo-500" />

                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Camera Capture
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    03:00:12 PM
                  </span>
                </div>

                <div className="flex h-48 items-center justify-center bg-slate-100 dark:bg-[#0f172a]">
                  {violation.evidenceImage ? (
                    <img
                      src={violation.evidenceImage}
                      alt="Violation evidence"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600" />

                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Camera evidence preview
                      </p>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        No image uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-indigo-500" />

                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Detected Activity
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Camera className="h-4 w-4" />
                      Face Detection
                    </span>

                    <span className="text-sm font-medium text-red-500">
                      Suspicious
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Monitor className="h-4 w-4" />
                      Screen Activity
                    </span>

                    <span className="text-sm font-medium text-emerald-500">
                      Normal
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Volume2 className="h-4 w-4" />
                      Audio Detection
                    </span>

                    <span className="text-sm font-medium text-yellow-500">
                      Detected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-500/20 dark:bg-yellow-500/5">
            <div className="flex gap-3">
              <Flag className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Violation Description
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {violation.description ||
                    "The proctoring system detected suspicious activity during the examination. The behavior may indicate possible plagiarism or unauthorized assistance. Please review the captured evidence before taking further action."}
                </p>
              </div>
            </div>
          </div>

          {/* ================= SYSTEM EVENTS ================= */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#172235]">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Activity Timeline
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" />

                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Suspicious activity detected
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {violation.time || "03:00 PM"} · Automated proctoring
                    system
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-yellow-500" />

                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Violation flagged for review
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Automatically added to admin review queue
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400" />

                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Awaiting admin decision
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    No action has been taken yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-[#0f172a] sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#172235] dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <XCircle className="h-4 w-4" />
              Dismiss Violation
            </button>

            <button
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Violation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationReviewModal;