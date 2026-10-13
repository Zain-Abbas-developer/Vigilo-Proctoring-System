import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
} from "lucide-react";

import {authApi} from '../../services/authApi.js'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      console.log("Forgot password response:", response);
      const resetToken = response?.resetToken;

      if(!resetToken) {
        throw new Error("Failed to generate reset token.");
      }

      setSuccess(
        "Reset token generated successfully."
      );

      if (resetToken) {
        navigate(`/reset-password/${resetToken}`);
      }
    } catch (error) {
      console.error("Forgot password failed:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
          </div>

          {!submitted ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Forgot your password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Enter your email address and we'll send you a link to
                  reset your password.
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  disabled={loading}
                >
                  <Send className="h-4 w-4" />
                  {/* Send Reset Link */}
                  {loading 
                    ? "Generating..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                <Mail className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Check your email
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                If an account exists for{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {email}
                </span>
                , you'll receive a password reset link shortly.
              </p>
            </div>
          )}

          <Link
            to="/login"
            className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;