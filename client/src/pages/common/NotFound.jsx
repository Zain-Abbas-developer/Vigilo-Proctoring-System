import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Home,
  ArrowLeft,
  SearchX,
  LayoutDashboard
} from "lucide-react";

const NotFound = () => {
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

          {/* 404 */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <SearchX className="h-8 w-8 text-indigo-600" />
            <h1 className="text-7xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-8xl">
              404
            </h1>
          </div>

          {/* Content */}
          <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            The page you're looking for doesn't exist or may have been moved.
            Please check the URL or return to the Vigilo homepage.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-indigo-950/40"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
              <LayoutDashboard className="h-4 w-4"/>
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

export default NotFound;
