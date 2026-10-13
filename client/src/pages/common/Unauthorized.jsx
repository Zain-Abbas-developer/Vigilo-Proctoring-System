import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full text-center">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60">
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Access denied
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            You don't have permission to access this page. Please return to
            your dashboard or contact an administrator if you believe this is
            a mistake.
          </p>

          {/* Status */}
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <ShieldAlert className="h-4 w-4" />
            Unauthorized access
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-indigo-950/40"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <p className="mt-12 text-xs text-slate-400">
            © {new Date().getFullYear()} Vigilo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
