
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  History,
  ArrowRight,
  PartyPopper,
  ShieldCheck,
  BellRing,
} from "lucide-react";

const REDIRECT_SECONDS = 5;

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId } = useParams();

  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [toastVisible, setToastVisible] = useState(true);

  const attemptId = location.state?.attemptId;
  const autoSubmitted = location.state?.autoSubmitted ?? false;

  useEffect(() => {
    // Show a success toast after arriving on this page.
    const toastTimer = setTimeout(() => {
      setToastVisible(false);
    }, 4000);

    // Redirect to dashboard after the countdown.
    const redirectTimer = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearInterval(redirectTimer);
          navigate("/student/dashboard", { replace: true });
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(toastTimer);
      clearInterval(redirectTimer);
    };
  }, [navigate]);

  const handleDashboard = () => {
    navigate("/student/dashboard", { replace: true });
  };

  const handlePreviousResults = () => {
    navigate("/student/prev-result", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300">
      {/* Success notification */}
      <div
        className={`fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ${
          toastVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 pointer-events-none opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl dark:border-emerald-500/20 dark:bg-[#0F172A]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
            <BellRing className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Exam submitted successfully!
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your submission has been received.
            </p>
          </div>

          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
        </div>
      </div>

      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
        <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-700/70 dark:bg-[#0F172A] dark:shadow-black/20">
          {/* Decorative header */}
          <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/15" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full border border-white/15" />

            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-lg backdrop-blur-sm">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>

            <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
              <PartyPopper className="h-4 w-4" />
              Submission complete
            </div>

            <h1 className="relative mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Thank You!
            </h1>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/90 sm:text-base">
              {autoSubmitted
                ? "Your exam time ended, and your attempt was automatically submitted."
                : "You have successfully completed your examination. Your responses have been submitted."}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Status */}
            <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#111C33]">
                <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  Your submission is complete
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  You can check your saved examination results from the
                  Previous Results section of your student dashboard.
                </p>
              </div>
            </div>

            {/* Attempt reference */}
            {attemptId && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700/70">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Attempt reference
                  </p>
                  <p className="mt-1 truncate font-mono text-sm text-slate-700 dark:text-slate-300">
                    {attemptId}
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              </div>
            )}

            {examId && (
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Exam reference: {examId}
              </p>
            )}

            {/* Countdown */}
            <div className="mt-7 flex items-center justify-center gap-3 rounded-xl bg-slate-50 px-4 py-4 dark:bg-[#111C33]">
              <Clock3 className="h-5 w-5 text-indigo-500" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Redirecting to dashboard in{" "}
                <span className="font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                  {secondsLeft}
                </span>{" "}
                {secondsLeft === 1 ? "second" : "seconds"}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handlePreviousResults}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700/70 dark:bg-[#111C33] dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
              >
                <History className="h-4 w-4" />
                Previous Results
              </button>

              <button
                type="button"
                onClick={handleDashboard}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
              Thank you for using Vigilo Proctoring System.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ThankYou;
