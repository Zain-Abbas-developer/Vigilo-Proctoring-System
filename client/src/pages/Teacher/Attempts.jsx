import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentView from "../../components/teacher/StudentProfileModal";

import {
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  FileText,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { attemptService } from "../../services/attemptService.js";

const Attempts = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showprofileModal, setShowProfileModal] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // ================= FETCH ATTEMPTS =================

  const fetchAttempts = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await attemptService.list({
        page: 1,
        limit: 100,
      });

      console.log("Attempts API Response:", response);

      const attemptList =
        response?.items ||
        response?.attempts ||
        [];

      setAttempts(attemptList);
    } catch (error) {
      console.error("Fetch attempts error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load attempts"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  // ================= STATUS HELPERS =================

  const normalizeStatus = (status) => {
    switch (status) {
      case "submitted":
      case "auto-submitted":
        return "completed";

      case "in-progress":
        return "in progress";

      case "flagged":
        return "flagged";

      default:
        return status || "unknown";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "submitted":
        return "Completed";

      case "auto-submitted":
        return "Auto Submitted";

      case "in-progress":
        return "In Progress";

      case "flagged":
        return "Flagged";

      default:
        return status || "Unknown";
    }
  };

  // ================= RISK =================
  // Backend currently doesn't provide a direct risk field.
  // So we calculate a simple risk percentage from violations.
  // This can later be replaced by actual AI risk score.

  const getRisk = (attempt) => {
    if (typeof attempt.risk === "number") {
      return attempt.risk;
    }

    if (
      typeof attempt.riskScore === "number"
    ) {
      return attempt.riskScore;
    }

    const violations =
      attempt.violationsCount ??
      attempt.violationCount ??
      attempt.violations?.length ??
      0;

    return Math.min(violations * 10, 100);
  };

  // ================= VIOLATIONS =================

  const getViolations = (attempt) => {
    if (typeof attempt.violations === "number") {
      return attempt.violations;
    }

    if (
      typeof attempt.violationCount === "number"
    ) {
      return attempt.violationCount;
    }

    if (typeof attempt.violationsCount === "number") {
      return attempt.violationsCount;
    }

    if (Array.isArray(attempt.violations)) {
      return attempt.violations.length;
    }

    return 0;
  };

  // ================= DATE FORMAT =================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ================= STUDENT NAME =================

  const getStudentName = (attempt) => {
    if (attempt.student?.name) {
      return attempt.student.name;
    }

    if (typeof attempt.student === "string") {
      return attempt.student;
    }

    return "Unknown Student";
  };

  // ================= EXAM NAME =================

  const getExamName = (attempt) => {
    if (attempt.exam?.title) {
      return attempt.exam.title;
    }

    if (typeof attempt.exam === "string") {
      return attempt.exam;
    }

    return "Unknown Exam";
  };

  // ================= SCORE =================

  const getScore = (attempt) => {
    if (typeof attempt.score === "number") {
      return attempt.score;
    }

    return null;
  };

  // ================= FILTER =================

  const filteredAttempts = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return attempts
      .filter((attempt) => {
        const normalizedStatus =
          normalizeStatus(attempt.status);

        return (
          statusFilter === "all" ||
          normalizedStatus === statusFilter
        );
      })
      .filter((attempt) => {
        const student = getStudentName(
          attempt
        ).toLowerCase();

        const exam = getExamName(
          attempt
        ).toLowerCase();

        return (
          !search ||
          student.includes(search) ||
          exam.includes(search)
        );
      });
  }, [
    attempts,
    statusFilter,
    searchTerm,
  ]);

  // ================= COUNTS =================

  const counts = useMemo(() => {
    return {
      all: attempts.length, // here we see changes in future for the time we just use it.

      completed: attempts.filter((attempt) =>
        ["completed", "auto-submitted"].includes(
          attempt.status
        )
      ).length,

      inProgress: attempts.filter(
        (attempt) =>
          attempt.status === "in-progress"
      ).length,

      flagged: attempts.filter(
        (attempt) =>
          attempt.status === "flagged"
      ).length,
    };
  }, [attempts]);

  // ================= VIEW ATTEMPT =================

  const handleViewAttempt = (attempt) => {
    setSelectedAttempt(attempt);
    setShowProfileModal(true);
  };

  // ================= REFRESH =================

  const handleRefresh = () => {
    fetchAttempts(false);
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="space-y-6">
        <div
          className="
            flex flex-col
            items-center
            justify-center
            min-h-100
            bg-white dark:bg-[#0F172A]
            rounded-xl
            border
            border-slate-200
            dark:border-indigo-400/40
          "
        >
          <Loader2
            className="
              w-8 h-8
              animate-spin
              text-indigo-600
              dark:text-indigo-400
            "
          />

          <p className="
            mt-3
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            Loading attempts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= PAGE HEADER ================= */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-3
      ">
        <div>
          {/* <h1 className="
            text-2xl
            font-bold
            text-slate-800
            dark:text-white
          ">
            Attempts
          </h1> */}

          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
            mt-1
          ">
            Monitor and review student exam attempts
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-indigo-600
            hover:bg-indigo-700
            disabled:opacity-60
            text-white
            text-sm
            font-medium
            transition-colors
          "
        >
          <RefreshCw
            className={`w-4 h-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total */}

        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`
            text-left p-4 rounded-xl border
            transition-all
            ${
              statusFilter === "all"
                ? "bg-indigo-50 dark:bg-indigo-600/15 border-indigo-300 dark:border-indigo-400/60"
                : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-indigo-400/40"
            }
          `}
        >
          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            Total Attempts
          </p>

          <p className="
            text-2xl
            font-bold
            text-indigo-600
            dark:text-indigo-400
            mt-1
          ">
            {counts.all}
          </p>
        </button>

        {/* Completed */}

        <button
          type="button"
          onClick={() =>
            setStatusFilter("completed")
          }
          className={`
            text-left p-4 rounded-xl border
            transition-all
            ${
              statusFilter === "completed"
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-400/50"
                : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-indigo-400/40"
            }
          `}
        >
          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            Completed
          </p>

          <p className="
            text-2xl
            font-bold
            text-emerald-600
            dark:text-emerald-400
            mt-1
          ">
            {counts.completed}
          </p>
        </button>

        {/* In Progress */}

        <button
          type="button"
          onClick={() =>
            setStatusFilter("in progress")
          }
          className={`
            text-left p-4 rounded-xl border
            transition-all
            ${
              statusFilter === "in progress"
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-400/50"
                : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-indigo-400/40"
            }
          `}
        >
          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            In Progress
          </p>

          <p className="
            text-2xl
            font-bold
            text-blue-600
            dark:text-blue-400
            mt-1
          ">
            {counts.inProgress}
          </p>
        </button>

        {/* Flagged */}

        <button
          type="button"
          onClick={() =>
            setStatusFilter("flagged")
          }
          className={`
            text-left p-4 rounded-xl border
            transition-all
            ${
              statusFilter === "flagged"
                ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-400/50"
                : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-indigo-400/40"
            }
          `}
        >
          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
          ">
            Flagged
          </p>

          <p className="
            text-2xl
            font-bold
            text-red-600
            dark:text-red-400
            mt-1
          ">
            {counts.flagged}
          </p>
        </button>

      </div>

      {/* ================= SEARCH / FILTER ================= */}

      <div className="flex flex-col md:flex-row gap-3">

        {/* Search */}

        <div className="relative flex-1 max-w-md">

          <Search
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-400
              dark:text-slate-500
            "
          />

          <input
            type="text"
            placeholder="Search student or exam..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              bg-white
              dark:bg-[#1E293B]
              border
              border-slate-200
              dark:border-indigo-400/40
              rounded-xl
              text-sm
              text-slate-700
              dark:text-[#F8FAFC]
              placeholder:text-slate-400
              dark:placeholder:text-slate-500
              focus:outline-none
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-500/20
              transition-colors
            "
          />

        </div>

        {/* Status Filter */}

        <div className="
          flex
          items-center
          gap-1
          bg-white
          dark:bg-[#1E293B]
          border
          border-slate-200
          dark:border-indigo-400/40
          rounded-xl
          p-1
          overflow-x-auto
        ">

          <Filter
            className="
              w-4
              h-4
              text-slate-400
              dark:text-slate-500
              ml-2
              shrink-0
            "
          />

          {[
            "all",
            "completed",
            "in progress",
            "flagged",
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(status)
              }
              className={`
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-medium
                capitalize
                whitespace-nowrap
                transition-colors
                ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }
              `}
            >
              {status}
            </button>
          ))}

        </div>

      </div>

      {/* ================= ATTEMPTS TABLE ================= */}

      <div className="
        bg-white
        dark:bg-[#0F172A]
        border
        border-slate-200
        dark:border-indigo-400/40
        rounded-xl
        overflow-hidden
        transition-colors
      ">

        {/* Table Header */}

        <div className="
          hidden
          lg:grid
          grid-cols-12
          gap-4
          px-5
          py-3
          bg-slate-50
          dark:bg-[#111C2E]
          border-b
          border-slate-200
          dark:border-indigo-400/30
          text-[10px]
          font-semibold
          text-slate-500
          dark:text-slate-400
          uppercase
        ">

          <div className="col-span-2">
            Student
          </div>

          <div className="col-span-2">
            Exam
          </div>

          <div className="col-span-2">
            Started
          </div>

          <div className="col-span-1">
            Score
          </div>

          <div className="col-span-1">
            Risk
          </div>

          <div className="col-span-1">
            Violations
          </div>

          <div className="col-span-2">
            Status
          </div>

          <div className="col-span-1">
            Action
          </div>

        </div>

        {/* Attempts */}

        <div className="
          divide-y
          divide-slate-100
          dark:divide-indigo-400/10
        ">

          {filteredAttempts.map((attempt) => {
            const studentName =
              getStudentName(attempt);

            const examName =
              getExamName(attempt);

            const score =
              getScore(attempt);

            const risk =
              getRisk(attempt);

            const violations =
              getViolations(attempt);

            const status =
              normalizeStatus(
                attempt.status
              );

            return (
              <div
                key={attempt._id}
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-12
                  gap-4
                  px-5
                  py-4
                  items-center
                  hover:bg-slate-50
                  dark:hover:bg-[#111C2E]
                  transition-colors
                "
              >

                {/* Student */}

                <div className="
                  lg:col-span-2
                  flex
                  items-center
                  gap-2
                ">

                  <div className="
                    w-8
                    h-8
                    rounded-full
                    bg-indigo-100
                    dark:bg-indigo-600/20
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">
                    <span className="
                      text-xs
                      font-semibold
                      text-indigo-600
                      dark:text-indigo-400
                    ">
                      {studentName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                      block
                      truncate
                    ">
                      {studentName}
                    </span>

                    {attempt.student?.rollNumber && (
                      <span className="
                        text-[10px]
                        text-slate-400
                        dark:text-slate-500
                      ">
                        {attempt.student.rollNumber}
                      </span>
                    )}
                  </div>

                </div>

                {/* Exam */}

                <div className="lg:col-span-2">

                  <p className="
                    text-sm
                    text-slate-600
                    dark:text-slate-300
                    truncate
                  ">
                    {examName}
                  </p>

                  {attempt.exam?.subject && (
                    <p className="
                      text-[10px]
                      text-slate-400
                      dark:text-slate-500
                      mt-1
                    ">
                      {attempt.exam.subject}
                    </p>
                  )}

                </div>

                {/* Started */}

                <div className="lg:col-span-2">

                  <p className="
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                    flex
                    items-center
                    gap-1
                  ">
                    <Clock className="w-3 h-3" />

                    {formatDate(
                      attempt.startedAt
                    )}
                  </p>

                </div>

                {/* Score */}

                <div className="lg:col-span-1">

                  {score !== null ? (
                    <span
                      className={`
                        text-sm
                        font-bold
                        ${
                          score >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : score >= 60
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        }
                      `}
                    >
                      {score}%
                    </span>
                  ) : (
                    <span className="
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    ">
                      Pending
                    </span>
                  )}

                </div>

                {/* Risk */}

                <div className="lg:col-span-1">

                  <span
                    className={`
                      text-sm
                      font-bold
                      ${
                        risk >= 80
                          ? "text-red-600 dark:text-red-400"
                          : risk >= 50
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                      }
                    `}
                  >
                    {risk}%
                  </span>

                </div>

                {/* Violations */}

                <div className="
                  lg:col-span-1
                  flex
                  items-center
                  gap-1
                ">

                  {violations > 0 && (
                    <AlertTriangle
                      className={`
                        w-3.5
                        h-3.5
                        ${
                          violations >= 5
                            ? "text-red-500"
                            : "text-amber-500"
                        }
                      `}
                    />
                  )}

                  <span className="
                    text-sm
                    font-semibold
                    text-slate-600
                    dark:text-slate-300
                  ">
                    {violations}
                  </span>

                </div>

                {/* Status */}

                <div className="lg:col-span-2">

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      uppercase
                      ${
                        status === "completed"
                          ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/20"
                          : status === "flagged"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-400/20"
                            : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-400/20"
                      }
                    `}
                  >

                    {status === "completed" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}

                    {status === "flagged" && (
                      <AlertTriangle className="w-3 h-3" />
                    )}

                    {status === "in progress" && (
                      <PlayCircle className="w-3 h-3" />
                    )}

                    {getStatusLabel(
                      attempt.status
                    )}

                  </span>

                </div>

                {/* Action */}

                <div className="lg:col-span-1">

                  <button
                    type="button"
                    onClick={() =>
                      handleViewAttempt(
                        attempt
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-1
                      px-3
                      py-1.5
                      bg-indigo-50
                      dark:bg-indigo-600/15
                      text-indigo-600
                      dark:text-indigo-400
                      rounded-lg
                      text-xs
                      font-medium
                      hover:bg-indigo-100
                      dark:hover:bg-indigo-600/25
                      transition-colors
                    "
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* ================= EMPTY STATE ================= */}

      {filteredAttempts.length === 0 && (
        <div className="
          text-center
          py-16
          bg-white
          dark:bg-[#0F172A]
          rounded-xl
          border
          border-slate-200
          dark:border-indigo-400/40
        ">

          <FileText className="
            w-12
            h-12
            text-slate-300
            dark:text-slate-600
            mx-auto
            mb-3
          " />

          <h3 className="
            text-lg
            font-medium
            text-slate-600
            dark:text-slate-300
          ">
            No attempts found
          </h3>

          <p className="
            text-sm
            text-slate-500
            dark:text-slate-400
            mt-1
          ">
            No attempts match your current filters
          </p>

        </div>
      )}

      {/* ================= STUDENT VIEW MODAL ================= */}

      <StudentView
        isOpen={showprofileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedAttempt(null);
        }}
        attempt={selectedAttempt}
      />

    </div>
  );
};

export default Attempts;