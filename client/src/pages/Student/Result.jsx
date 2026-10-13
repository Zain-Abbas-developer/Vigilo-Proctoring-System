
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  Trophy,
  ArrowLeft,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";

// Mock data for questions and answers
import { examQuestions, exams } from "../../data/studentMockData.js";

const questions = examQuestions["EXM-001"] || [];
const examDetail = exams[0] || {};

const ExamResult = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const location = useLocation();

  const resultData = location.state;

  const answers = resultData?.answers || {};
  const timeLeft = resultData?.timeLeft ?? null;

  const result = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (!userAnswer) {
        unanswered++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = questions.length;
    const percentage =
      total > 0 ? Math.round((correct / total) * 100) : 0;

    const passed = percentage >= 50;

    return {
      total,
      correct,
      wrong,
      unanswered,
      percentage,
      passed,
    };
  }, [answers]);

  const timeTaken =
    timeLeft !== null ? Math.max(0, 30 * 60 - timeLeft) : null;

  const formatTime = (seconds) => {
    if (seconds === null) return "N/A";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const handleBackToExams = () => {
    navigate("/student/exam-list");
  };

  const handleDashboard = () => {
    navigate("/student/dashboard");
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Result Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This result page can only be accessed after completing an exam.
          </p>

          <button
            onClick={handleBackToExams}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <ArrowLeft size={17} />
            Back to Exams
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Exam Result
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your examination attempt has been completed
            </p>
          </div>

          <button
            onClick={handleDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#111C33] px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Result Banner */}
        <section
          className={`rounded-2xl border p-6 ${
            result.passed
              ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10"
              : "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10"
          }`}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                  result.passed
                    ? "bg-emerald-100 dark:bg-emerald-500/15"
                    : "bg-red-100 dark:bg-red-500/15"
                }`}
              >
                {result.passed ? (
                  <Trophy className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
                )}
              </div>

              <div>

                <h2
                  className={`text-xl font-bold ${
                    result.passed
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {result.passed
                    ? "Congratulations! You Passed"
                    : "Exam Completed"}
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    result.passed
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {result.passed
                    ? "You successfully passed this examination."
                    : "Unfortunately, you did not reach the passing score."}
                </p>

              </div>

            </div>

            <div className="text-left md:text-right">

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Final Score
              </p>

              <p
                className={`text-4xl font-extrabold ${
                  result.passed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {result.percentage}%
              </p>

            </div>

          </div>
        </section>

        {/* Score Overview */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Questions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-500/10 p-2.5">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {result.total}
              </span>

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Questions
            </p>

          </div>

          {/* Correct */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {result.correct}
              </span>

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Correct Answers
            </p>

          </div>

          {/* Wrong */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-red-50 dark:bg-red-500/10 p-2.5">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>

              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {result.wrong}
              </span>

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Wrong Answers
            </p>

          </div>

          {/* Time */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 p-2.5">
                <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>

              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {formatTime(timeTaken) || "30mins"}
              </span>

            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Time Taken
            </p>

          </div>

        </section>

        {/* Score Details */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Score Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-6 shadow-sm">

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Score Overview
            </h3>

            <div className="mt-6 flex items-center justify-center">

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-14 border-slate-100 dark:border-[#111C33]">

                <div
                  className={`absolute -inset-3.5 rounded-full border-14 border-transparent ${
                    result.passed
                      ? "border-t-emerald-500"
                      : "border-t-red-500"
                  }`}
                />

                <div className="text-center">

                  <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {result.percentage}%
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Grade {getGrade(result.percentage)}
                  </p>

                </div>

              </div>
            </div>

            <div className="mt-6 space-y-3">

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Passing Score
                </span>

                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  50%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Your Score
                </span>

                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Result
                </span>

                <span
                  className={`font-semibold ${
                    result.passed
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.passed ? "Passed" : "Failed"}
                </span>
              </div>

            </div>
          </div>

          {/* Attempt Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] p-6 shadow-sm lg:col-span-2">

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Attempt Information
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Exam
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {examDetail.title || "Exam Title"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Exam ID
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  #{examDetail.id || examId || "1"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Total Questions
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {result.total}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Time Allowed
                </p>

                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {examDetail.duration || "30 mins"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Correct
                </p>

                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  {result.correct}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#111C33] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Unanswered
                </p>

                <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                  {result.unanswered}
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* Question Breakdown */}
        <section className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] shadow-sm overflow-hidden">

          <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-5">

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Question Breakdown
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review your answers for each question.
            </p>

          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">

            {questions.map((question, index) => {

              const userAnswer = answers[question.id];

              const isCorrect =
                userAnswer === question.correctAnswer;

              const isUnanswered = !userAnswer;

              return (
                <div
                  key={question.id}
                  className="px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-[#111C33]/50 transition-colors"
                >

                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-[#111C33] text-sm font-bold text-slate-600 dark:text-slate-300">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {question.question}
                        </p>

                        {isUnanswered ? (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                            <AlertCircle size={13} />
                            Unanswered
                          </span>
                        ) : isCorrect ? (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 size={13} />
                            Correct
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
                            <XCircle size={13} />
                            Incorrect
                          </span>
                        )}

                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">

                        {/* Your Answer */}
                        <div className="rounded-lg border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#111C33] p-3">

                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Your Answer
                          </p>

                          <p
                            className={`mt-1 text-sm font-medium ${
                              isUnanswered
                                ? "text-slate-400 dark:text-slate-500"
                                : isCorrect
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-red-700 dark:text-red-400"
                            }`}
                          >
                            {userAnswer || "Not answered"}
                          </p>

                        </div>

                        {/* Correct Answer */}
                        <div className="rounded-lg border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 p-3">

                          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Correct Answer
                          </p>

                          <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            {question.correctAnswer}
                          </p>

                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            onClick={handleBackToExams}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-[#111C33]"
          >
            <ArrowLeft size={17} />
            Back to Listed Exam
          </button>

          <button
            onClick={handleDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <LayoutDashboard size={17} />
            Go to Dashboard
          </button>

        </div>

      </main>
    </div>
  );
};

export default ExamResult;
