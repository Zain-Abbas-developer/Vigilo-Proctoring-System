import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import {examService} from '../../services/examService.js';

import {
  Search,
  Clock,
  Users,
  BookOpen,
  Calendar,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  FileText,
  Filter,
} from "lucide-react";

const statusColors = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  live: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusIcons = {
  draft: "📝",
  scheduled: "📅",
  live: "🔴",
  completed: "✅",
};

const Exams = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);

  // =========================
  // Fetch Exams
  // =========================
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);

        const response = await examService.list();

        console.log("Exams API Response:", response);

        const examList = response?.items || [];

        setExams(examList);

        console.log("Fetched Exams:", examList);
      } catch (error) {
        console.error("Fetch exams error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // =========================
  // Search + Filter
  // =========================
  const filteredExams = exams.filter((exam) => {
    const title = exam.title || "";
    const subject = exam.subject || "";
    const status = exam.status || "draft";

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(search) ||
      subject.toLowerCase().includes(search);

    const matchesFilter =
      filter === "all" || status === filter;

    return matchesSearch && matchesFilter;
  });

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // Format Time
  // =========================
  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // =========================
  // Loading Skeleton
  // =========================
  const ExamCardSkeleton = () => {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/60 dark:border-indigo-400/60 overflow-hidden animate-pulse">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-7 w-7 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>

          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />

          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />

          <div className="grid grid-cols-2 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-slate-100 dark:bg-slate-700/60 rounded-lg p-3"
              >
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-600 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-600 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 dark:bg-[#1E293B] border-t border-slate-100 dark:border-indigo-400 flex justify-between">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* =========================
          Header Actions
      ========================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#F8FAFC]" />

            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] dark:text-[#F8FAFC] dark:border dark:border-indigo-400/60 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-1 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 dark:text-[#F8FAFC] ml-2 shrink-0" />

            {["all", "draft", "scheduled", "live", "completed"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 dark:text-[#F8FAFC] hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-[#31415c]"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Loading
      ========================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ExamCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        /* =========================
            Empty State
        ========================= */
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/60 dark:border-indigo-400/60">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-4">
            <FileText className="w-7 h-7 text-indigo-600" />
          </div>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F8FAFC]">
            No exams found
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
            {searchTerm
              ? "Try changing your search or filter."
              : "There are no exams available yet."}
          </p>
        </div>
      ) : (
        /* =========================
            Exam Cards
        ========================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const examId = exam._id;

            const status = exam.status || "draft";

            const studentsCount =
              exam.assignedStudents?.length || 0;

            // Backend currently does not return totalQuestions
            const totalQuestions =
              exam.totalQuestions ?? exam.questions?.length ?? 0;

            return (
              <div
                key={examId}
                className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/60 dark:border-indigo-400/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="p-5">
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        statusColors[status] ||
                        statusColors.draft
                      }`}
                    >
                      <span>
                        {statusIcons[status] || "📝"}
                      </span>

                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </span>

                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === examId
                              ? null
                              : examId
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#31415c] text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {menuOpen === examId && (
                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-200 dark:border-indigo-400/60 py-1.5 z-20">

                          {/* Monitor */}
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/exams/${examId}/live-monitor`
                              );
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#31415c]"
                          >
                            <Eye className="w-4 h-4" />
                            Monitor
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/exams/${examId}/edit`
                              );
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#31415c]"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>

                          {/* Report */}
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/exams/${examId}/report`
                              );
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#31415c]"
                          >
                            <FileText className="w-4 h-4" />
                            Report
                          </button>

                          <hr className="my-1 border-slate-100 dark:border-slate-700" />

                          {/* Delete */}
                          <button
                            onClick={() => {
                              console.log(
                                "Delete exam:",
                                examId
                              );
                              setMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-slate-800 dark:text-[#abacad] mb-1 group-hover:text-indigo-700 dark:group-hover:text-[#F8FAFC] transition-colors line-clamp-2">
                    {exam.title}
                  </h3>

                  {/* Subject */}
                  <p className="text-sm text-slate-500 dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {exam.subject || "No subject"}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {/* Duration */}
                    <div className="bg-slate-50 dark:bg-[#1E293B] rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#F8FAFC]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          Duration
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-0.5">
                        {exam.duration ?? 0} min
                      </p>
                    </div>

                    {/* Students */}
                    <div className="bg-slate-50 dark:bg-[#1E293B] rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#F8FAFC]">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          Students
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-0.5">
                        {studentsCount}
                      </p>
                    </div>

                    {/* Questions */}
                    <div className="bg-slate-50 dark:bg-[#1E293B] rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#F8FAFC]">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          Questions
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-0.5">
                        {totalQuestions}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="bg-slate-50 dark:bg-[#1E293B] rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#F8FAFC]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          Date
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] mt-0.5">
                        {formatDate(exam.startTime)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                    {formatTime(exam.startTime)} -{" "}
                    {formatTime(exam.endTime)}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-[#1E293B] border-t border-slate-100 dark:border-indigo-400 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-[#F8FAFC]">
                    Total Marks:{" "}
                    <span className="font-semibold text-slate-700 dark:text-[#F8FAFC]">
                      {exam.totalMarks ?? 0}
                    </span>
                  </span>

                  {status === "live" && (
                    <button
                      onClick={() => {
                        navigate(
                          `/admin/exams/${examId}/live-monitor`
                        );
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Live Monitor
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Exams;