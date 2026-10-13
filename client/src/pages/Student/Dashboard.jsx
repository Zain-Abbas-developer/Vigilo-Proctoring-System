import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {analyticsService} from "../../services/analyticsService.js";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CalendarDays,
  AlertTriangle,
  PlayCircle,
  Award,
  BarChart3,
  X,
} from "lucide-react";

// ==============================
// COMPONENT
// ==============================

const Dashboard = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    upcomingExams: [],
    activeExams: [],
    completedExams: [],
    performance: [],
    recentAttempts: [],
    counts: { upcoming: 0, active: 0, completed: 0 },
    cards: {},
    averageScore: 0,
    riskScore: 0,
    proctoringStatus: "Unknown",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // analyticsService.student() should return the API's `data` payload.
        const response = await analyticsService.student();
        const payload = response?.data?.data ?? response?.data ?? response ?? {};

        if (!isMounted) return;

        const upcomingExams = Array.isArray(payload.upcomingExams)
          ? payload.upcomingExams
          : [];
        const activeExams = Array.isArray(payload.activeExams)
          ? payload.activeExams
          : [];
        const completedExams = Array.isArray(payload.completedExams)
          ? payload.completedExams
          : [];

        setDashboardData({
          upcomingExams,
          activeExams,
          completedExams,
          performance: Array.isArray(payload.performance)
            ? payload.performance
            : [],
          recentAttempts: Array.isArray(payload.recentAttempts)
            ? payload.recentAttempts
            : [],
          counts: {
            upcoming: Number(payload.counts?.upcoming ?? upcomingExams.length),
            active: Number(payload.counts?.active ?? activeExams.length),
            completed: Number(payload.counts?.completed ?? completedExams.length),
          },
          cards: payload.cards ?? {},
          averageScore: Number(
            payload.cards?.averageScore?.value ?? payload.averageScore ?? 0
          ),
          riskScore: Number(
            payload.cards?.riskScore?.value ?? payload.riskScore ?? 0
          ),
          proctoringStatus: payload.proctoringStatus ?? "Unknown",
        });
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load your dashboard. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Show both currently active and scheduled exams in the same section.
  const examList = [
    ...dashboardData.activeExams,
    ...dashboardData.upcomingExams,
  ];

  const upcomingExams = examList.map((exam) => {
    const rawStatus = String(exam.status ?? "").toLowerCase();
    // The API sends startDate as an ISO date and startTime as display text.
    const rawStartDate = exam.startDate ?? exam.scheduledAt;
    const startDate = rawStartDate ? new Date(rawStartDate) : null;
    const validStartDate = Boolean(startDate && !Number.isNaN(startDate.getTime()));
    const status = ["available", "active", "published", "in progress"].includes(rawStatus)
      ? "Available"
      : "Upcoming";

    return {
      ...exam,
      id: exam._id ?? exam.id,
      questions: exam.totalQuestions ?? exam.questions ?? exam.questionCount ?? exam.questionsCount ?? "—",
      date: exam.date || (validStartDate ? startDate.toLocaleDateString() : "Date not set"),
      startTime: validStartDate
        ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : exam.startTime || "Time not set",
      status,
    };
  });

  const performanceData = dashboardData.performance;
  const recentResults = dashboardData.recentAttempts;
  const averageScore = dashboardData.averageScore;
  const riskScore = dashboardData.riskScore;
  const completedExams = Number(
    dashboardData.cards.completedExams?.value ?? dashboardData.counts.completed ?? 0
  );
  const availableExams = Number(
    dashboardData.cards.availableExams?.value ?? dashboardData.counts.active ?? 0
  );

  let studentName = "Student";
  try {
    const storedUser = JSON.parse(localStorage.getItem("vigilo_user") || "null");
    studentName = storedUser?.name || storedUser?.fullname || storedUser?.fullName || studentName;
  } catch {
    // Use a generic greeting if the saved user data is not valid JSON.
  }

  // ==============================
  // RISK STYLE
  // ==============================

  const getRiskStyle = (score) => {
    if (score <= 25) {
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        label: "Low Risk",
      };
    }

    if (score <= 50) {
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        label: "Medium Risk",
      };
    }

    return {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "High Risk",
    };
  };

  const riskStyle = getRiskStyle(riskScore);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/5 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
          Loading your dashboard...
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="self-start rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-300 sm:self-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* =========================================
      WELCOME
  ========================================= */}

      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-1">
              Welcome back,
            </p>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] capitalize">
              {studentName}!
            </h1>

            <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-2 max-w-xl leading-relaxed">
              Stay focused, complete your upcoming exams, and keep improving
              your performance.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/40 rounded-xl">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Proctoring Status
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />

                <p className={`text-sm font-semibold ${
                  dashboardData.proctoringStatus === "Needs Attention"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}>
                  {dashboardData.proctoringStatus === "Unknown"
                    ? "Status unavailable"
                    : dashboardData.proctoringStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
      STATS
  ========================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Available Exams */}
        <Link
          to="/student/exam-list"
          className="group bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5 hover:border-indigo-400 dark:hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>

            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              Available
            </span>
          </div>

          <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-4">
            {availableExams}
          </p>

          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            Exams available
          </p>
        </Link>

        {/* Completed */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Completed
            </span>
          </div>

          <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-4">
            {completedExams}
          </p>

          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            Exams completed
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <Award className="w-5 h-5 text-blue-400" />
            </div>

            <span className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              Overall
            </span>
          </div>

          <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-4">
            {averageScore}%
          </p>

          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            Average score
          </p>
        </div>

        {/* Risk Score */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 ${riskStyle.bg} rounded-xl`}>
              <ShieldCheck className={`w-5 h-5 ${riskStyle.text}`} />
            </div>

            <span
              className={`text-xs font-medium ${riskStyle.text} ${riskStyle.bg} px-2.5 py-1 rounded-full`}
            >
              {riskStyle.label}
            </span>
          </div>

          <p className={`text-2xl font-bold ${riskStyle.text} mt-4`}>
            {riskScore}%
          </p>

          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            Proctoring risk score
          </p>
        </div>
      </div>

      {/* =========================================
      MAIN GRID
  ========================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* =====================================
        UPCOMING AND AVAILABLE EXAMS
    ===================================== */}

        <div className="xl:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-indigo-400/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
                Upcoming Exams
              </h2>

              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                Your scheduled and available exams
              </p>
            </div>

            <Link
              to="/student/exam-list"
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/40 rounded-xl p-4 hover:border-indigo-400/80 dark:hover:border-indigo-300/70 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl shrink-0">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] truncate">
                        {exam.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                        {exam.subject}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          {exam.questions} Questions
                        </span>

                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                          <Clock3 className="w-3.5 h-3.5 text-indigo-400" />
                          {exam.duration} Minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end items-center justify-between gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                        <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                        {exam.date}
                      </div>

                      <p className="text-xs font-medium text-slate-600 dark:text-[#CBD5E1] mt-1">
                        {exam.startTime}
                      </p>
                    </div>

                    {exam.status === "Available" ? (
                      <button
                        onClick={() => setSelectedExam(exam)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        Start
                      </button>
                    ) : (
                      <span className="px-3 py-2 bg-slate-200 dark:bg-slate-700/70 text-slate-500 dark:text-[#94A3B8] rounded-lg text-xs font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {loading ? "Fetching your exams..." : "No upcoming exams found."}
              </p>
            )}
          </div>
        </div>

        {/* =====================================
        PERFORMANCE
    ===================================== */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-indigo-400/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
                  Performance
                </h2>

                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">
                  Your recent progress
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-end justify-between h-44 gap-2">
              {performanceData.length > 0 ? performanceData.map((item, index) => (
                <div
                  key={`${item.month}-${index}`}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-[#94A3B8]">
                    {item.score}%
                  </span>

                  <div
                    className="w-full max-w-8 bg-indigo-500/10 rounded-t-lg overflow-hidden"
                    style={{
                      height: `${Math.max(0, Math.min(100, Number(item.score) || 0))}%`,
                    }}
                  >
                    <div className="w-full h-full bg-indigo-500 rounded-t-lg" />
                  </div>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {item.month}
                  </span>
                </div>
              )) : (
                <p className="w-full self-center text-center text-xs text-slate-500 dark:text-slate-400">
                  No performance data yet.
                </p>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-indigo-400/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  Current Average
                </p>

                <p className="text-lg font-bold text-slate-800 dark:text-[#F8FAFC] mt-1">
                  {averageScore}%
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <TrendingUp className="w-3.5 h-3.5" />
                Monthly average
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
      RECENT RESULTS
  ========================================= */}

      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-indigo-400/50">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Recent Results
            </h2>

            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
              Your latest exam performance
            </p>
          </div>

          <Link
            to="/student/prev-result"
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            View Results
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-indigo-400/30">
          {recentResults.length > 0 ? recentResults.map((result) => (
            <div
              key={result._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                    {result.exam?.title || "N/A"}
                  </h3>

                  <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-0.5">
                    {result.exam?.subject} • {result?.startedAt ? new Date(result.startedAt).toLocaleDateString() : "Date unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {result.status}
                </span>

                <span className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC] min-w-12 text-right">
                  {Number(result.percentage ?? result.score ?? 0).toFixed(1)}%
                </span>
                {/* // here we make navigation to specific exam */}
                <Link
                  to="/student/prev-result"
                  state={{ selectedResult: result }}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  aria-label={`View ${result.exam?.title || "exam"} result`}>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )) : (
            <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Fetching your results..." : "No completed exam results yet."}
            </p>
          )}
        </div>
      </div>

      {/* =========================================
      PROCTORING NOTICE
  ========================================= */}

      <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 dark:border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Before starting an exam
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-200/70 mt-1 leading-relaxed">
              Make sure your camera and microphone are working, you have a
              stable internet connection, and you are in a quiet, well-lit
              environment.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
      START EXAM MODAL
  ========================================= */}

      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-indigo-400/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-800 dark:text-[#F8FAFC]">
                    Start Exam
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                    Review the exam details before continuing.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedExam(null)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-100 dark:hover:text-[#F8FAFC] hover:bg-red-500 dark:hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-[#F8FAFC]">
                  {selectedExam.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
                  {selectedExam.subject}
                </p>
              </div>

              {/* Exam Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/30 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />

                    <p className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      Questions
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-2">
                    {selectedExam.questions}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/30 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-indigo-400" />

                    <p className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      Duration
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-2">
                    {selectedExam.duration} Minutes
                  </p>
                </div>
              </div>

              {/* Flow Notice */}
              <div className="bg-indigo-50 bg-opacity-10 border border-indigo-500 border-opacity-20 rounded-xl p-3 dark:bg-indigo-950/50 dark:border-indigo-400 dark:border-opacity-30">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0 dark:text-indigo-300" />
                  <p className="text-xs text-indigo-700 text-opacity-80 leading-relaxed dark:text-indigo-200 dark:text-opacity-90">
                    You will be redirected to the exam instructions, system
                    check, and face verification before the exam starts.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedExam(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-indigo-400/40 text-slate-600 dark:text-[#CBD5E1] rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#1E293B] transition-colors"
                >
                  Cancel
                </button>

                <Link
                  to={`/student/exam/${selectedExam._id ?? selectedExam.id}/instructions`}
                  onClick={() => setSelectedExam(null)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
