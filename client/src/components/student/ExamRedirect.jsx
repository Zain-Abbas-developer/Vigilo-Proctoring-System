import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";

const ExamRedirect = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const redirectPath = "/student/exam-list";

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate(redirectPath, { replace: true });
    }
  }, [countdown, navigate]);

  const handleRedirect = () => {
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="w-full max-w-lg">

        {/* Card */}
        <div
          className="
            relative overflow-hidden
            bg-white dark:bg-[#0F172A]
            border border-slate-200 dark:border-slate-700/70
            rounded-2xl
            shadow-sm dark:shadow-black/20
            p-8
            text-center
          "
        >

          {/* Subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-orange-500 to-indigo-500" />

          {/* Icon */}
          <div
            className="
              mx-auto mb-6
              flex h-20 w-20
              items-center justify-center
              rounded-full
              bg-red-50 dark:bg-red-500/10
              border border-red-100 dark:border-red-500/20
            "
          >
            <ShieldAlert
              className="
                h-10 w-10
                text-red-500
                dark:text-red-400
              "
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Exam Not Accessible
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-6">
            You are not authorized to access the exam page directly.
            Please select an exam from the available exams list to continue.
          </p>

          {/* Warning / Countdown */}
          <div
            className="
              mt-6
              rounded-xl
              bg-slate-50 dark:bg-[#111C33]
              border border-slate-200 dark:border-slate-700/70
              p-5
            "
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You will be redirected to the available exams page in
            </p>

            {/* Countdown */}
            <div className="mt-2 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {countdown}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              seconds
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleRedirect}
            className="
              mt-6
              w-full
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5 py-3
              text-sm
              font-semibold
              text-white
              hover:bg-indigo-700
              dark:hover:bg-indigo-500
              shadow-sm
              shadow-indigo-500/20
              transition-all
            "
          >
            Go to Available Exams

            <ArrowRight size={18} />
          </button>

          {/* Small helper text */}
          <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
            Direct exam access is restricted for security purposes.
          </p>

        </div>
      </div>
    </div>
  );
};

export default ExamRedirect;