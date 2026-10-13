
import {
  X,
  Trophy,
  FileText,
  Clock3,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ResultDetailModal = ({ result, onClose }) => {
  if (!result) return null;

  // Backend exam object ko safely handle karo
  const exam =
    result.exam && typeof result.exam === "object"
      ? result.exam
      : {};

  const title =
    typeof result.title === "string"
      ? result.title
      : typeof result.exam === "string"
        ? result.exam
        : typeof exam.title === "string"
          ? exam.title
          : "Exam Result";

  const percentage = Number(
    result.percentage ?? result.score ?? 0
  );

  const score = Number(result.score ?? 0);
  const total = Number(
    result.total ?? result.totalMarks ?? exam.totalMarks ?? 100
  );

  const status =
    typeof result.status === "string"
      ? result.status
      : "Unknown";

  const passed = status.toLowerCase() === "passed";

  const subjectValue = result.subject ?? exam.subject;

  const subject =
    typeof subjectValue === "string"
      ? subjectValue
      : typeof subjectValue?.title === "string"
        ? subjectValue.title
        : typeof subjectValue?.name === "string"
          ? subjectValue.name
          : typeof subjectValue?.subject === "string"
            ? subjectValue.subject
            : "";

  const time =
    typeof result.time === "string" ||
    typeof result.time === "number"
      ? result.time
      : "N/A";

  const date =
    typeof result.date === "string" ||
    typeof result.date === "number"
      ? result.date
      : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        className="w-full max-w-lg rounded-2xl border
          border-slate-200 bg-white p-6 shadow-2xl
          dark:border-slate-700 dark:bg-[#111C33]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-indigo-500">
              Exam Result Details
            </p>

            <h2
              id="result-title"
              className="mt-1 wrap-break-word text-xl font-bold
                text-slate-900 dark:text-white"
            >
              {title}
            </h2>

            {subject && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subject}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-500
              transition hover:bg-slate-100
              dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Score */}
        <div
          className="mt-6 rounded-xl bg-indigo-50 p-5
            text-center dark:bg-indigo-500/10"
        >
          <Trophy
            className="mx-auto text-indigo-500"
            size={28}
          />

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your Score
          </p>

          <p
            className="mt-1 text-4xl font-bold text-indigo-600
              dark:text-indigo-400"
          >
            {Number.isFinite(percentage) ? percentage : 0}%
          </p>

          <span
            className={`mt-3 inline-flex items-center gap-1
              rounded-full px-3 py-1 text-xs font-semibold ${
                passed
                  ? "bg-emerald-100 text-emerald-700"
                  : status.toLowerCase() === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
              }`}
          >
            {passed ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
            {status}
          </span>
        </div>

        {/* Result details */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            className="rounded-xl border border-slate-200 p-4
              dark:border-slate-700"
          >
            <FileText
              size={20}
              className="mb-2 text-indigo-500"
            />

            <p className="text-xs text-slate-500">
              Marks Obtained
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {score} / {total}
            </p>
          </div>

          <div
            className="rounded-xl border border-slate-200 p-4
              dark:border-slate-700"
          >
            <Clock3
              size={20}
              className="mb-2 text-indigo-500"
            />

            <p className="text-xs text-slate-500">
              Time Taken
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {time}
            </p>
          </div>

          <div
            className="col-span-2 rounded-xl border
              border-slate-200 p-4 dark:border-slate-700"
          >
            <CalendarDays
              size={20}
              className="mb-2 text-indigo-500"
            />

            <p className="text-xs text-slate-500">
              Exam Date
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {date}
            </p>
          </div>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-600
            px-4 py-3 text-sm font-semibold text-white
            transition hover:bg-indigo-700"
        >
          Close Result
        </button>
      </div>
    </div>
  );
};

export default ResultDetailModal;

