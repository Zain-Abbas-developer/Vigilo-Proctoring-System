import { useState, useEffect } from "react";
import { examService } from "../../services/examService.js";
import ViewExam from "../../components/teacher/ViewExamModal";
import EditExam from "../../components/teacher/EditExamModal";
import DeleteExam from "../../components/teacher/DeleteExamModal";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Users,
  Clock,
  CalendarDays,
  MoreVertical,
  ListChecks,
  CirclePlus,
} from "lucide-react";
import toast from "react-hot-toast";

const statusStyles = {
  draft:
    "bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",

  published:
    "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-500/20",

  active:
    "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/20",

  completed:
    "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-500/20",

  cancelled:
    "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-500/20",
};

const STATUS_FILTERS = ["all", "scheduled", "active", "completed"];

const TeacherExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [editExam, setEditExam] = useState(null);
  const [deleteExam, setDeleteExam] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------- Fetch ----------------
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await examService.list();
        // setExams(data || []);

        console.log("Fetched exams:", data);

        const examList = data?.items || [];
        setExams(examList);
      } catch (err) {
        console.error("Teacher exams error:", err);
        setError(err.response?.data?.message || "Failed to load exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // ---------------- Filter ----------------
  const filteredExams = exams
    .filter((exam) => statusFilter === "all" || exam.status === statusFilter)
    .filter((exam) => {
      const term = searchTerm.toLowerCase();
      return (
        exam.title?.toLowerCase().includes(term) ||
        exam.subject?.toLowerCase().includes(term)
      );
    });

  // ---------------- Counts ----------------
  const counts = {
    all: exams.length,
    scheduled: exams.filter((e) => e.status === "scheduled").length,
    active: exams.filter((e) => e.status === "active").length,
    completed: exams.filter((e) => e.status === "completed").length,
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ---------------- Handlers ----------------
  const handleViewExam = (exam) => setSelectedExam(exam);

  const handleUpdateExam = async (updatedExam) => {
    try {
      const updatedData = await examService.update(
        updatedExam._id,
        updatedExam,
      );
      console.log("Updated exam data:", updatedData);
      setExams((prev) =>
        prev.map((exam) => (exam._id === updatedExam._id ? updatedData : exam)),
      );
      setEditExam(null);
      toast.success("Exam updated successfully!");
    } catch (err) {
      console.error("Update exam failed:", err);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update exam.",
      );
    }
  };

  const handleDeleteExam = async (exam) => {
    try {
      await examService.remove(exam._id);
      setExams((prev) => prev.filter((e) => e._id !== exam._id));
      setDeleteExam(null);
      toast.success("Exam deleted successfully!");
    } catch (err) {
      console.error("Delete exam failed:", err);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete exam.",
      );
    }
  };

  // ---------------- Render ----------------
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Loading exams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            key: "all",
            title: "Total Exams",
            value: counts.all,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-900/40",
          },
          {
            key: "scheduled",
            title: "Scheduled",
            value: counts.scheduled,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/40",
          },
          {
            key: "active",
            title: "Active",
            value: counts.active,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/40",
          },
          {
            key: "completed",
            title: "Completed",
            value: counts.completed,
            color: "text-slate-600 dark:text-slate-400",
            bg: "bg-slate-100 dark:bg-slate-800",
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`text-left bg-white dark:bg-[#0F172A] border rounded-xl p-4 transition-all ${
              statusFilter === item.key
                ? "border-indigo-400 dark:border-indigo-400/70 ring-2 ring-indigo-500/10"
                : "border-slate-200 dark:border-indigo-400/40 hover:border-indigo-300 dark:hover:border-indigo-400/60"
            }`}
          >
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
              {item.title}
            </p>
            <div
              className={`inline-flex items-center mt-3 px-2 py-1 rounded-lg ${item.bg}`}
            >
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search exams or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/50 rounded-xl text-sm text-slate-700 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/50 rounded-xl p-1 w-fit overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-2 shrink-0" />
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-[#1E293B] border-b border-slate-200 dark:border-indigo-400/50 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
          <div className="col-span-3">Exam</div>
          <div className="col-span-2">Marks</div>
          <div className="col-span-2">Students</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-slate-100 dark:divide-indigo-400/30">
          {filteredExams.map((exam) => (
            <div
              key={exam._id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-indigo-900/20 transition-colors items-center"
            >
              {/* Exam */}
              <div className="lg:col-span-3 flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-transparent dark:border-indigo-400/20">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] truncate">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {exam.subject}
                  </p>
                </div>
              </div>

              {/* Marks */}
              <div className="lg:col-span-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {exam.totalMarks ?? 0}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Passing: {exam.passingMarks ?? 0}
                </p>
              </div>

              {/* Students */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {exam.assignedStudents?.length ?? 0}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Assigned
                </p>
              </div>

              {/* Schedule */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(exam.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {exam.duration} min
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="lg:col-span-1">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    statusStyles[exam.status] ?? statusStyles.draft
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 flex items-center lg:justify-end gap-1">
                <button
                  onClick={() => handleViewExam(exam)}
                  title="View Exam"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setEditExam(exam)}
                  title="Edit Exam"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/teacher/exams/${exam._id}/questions`)
                  }
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-600/15 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Add More Questions"
                >
                  <CirclePlus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteExam(exam)}
                  title="Delete Exam"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  title="More"
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-indigo-400/50">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">
            No exams found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            Try changing your search or filter
          </p>
        </div>
      )}

      {/* Modals */}
      {selectedExam && (
        <ViewExam exam={selectedExam} onClose={() => setSelectedExam(null)} />
      )}

      {editExam && (
        <EditExam
          exam={editExam}
          onClose={() => setEditExam(null)}
          onSave={handleUpdateExam}
        />
      )}

      {deleteExam && (
        <DeleteExam
          exam={deleteExam}
          onClose={() => setDeleteExam(null)}
          onConfirm={handleDeleteExam}
        />
      )}
    </div>
  );
};

export default TeacherExams;
