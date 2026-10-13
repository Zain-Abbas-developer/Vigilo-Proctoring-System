import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  Filter,
  PlayCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileQuestion,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { examService } from "../../services/examService.js";
import { analyticsService } from "../../services/analyticsService.js";

const statusConfig = {
  available: {
    label: "Available",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "Upcoming",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/20",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/20",
    dot: "bg-blue-500",
  },
};

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

const getDate = (exam) => {
  const value = exam.startDate ?? exam.startTime ?? exam.startAt ?? exam.scheduledAt;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeStatus = (exam, now = new Date()) => {
  const raw = String(exam.status ?? "").toLowerCase();
  if (["completed", "ended", "closed"].includes(raw)) return "completed";
  if (["scheduled", "upcoming", "draft"].includes(raw)) return "upcoming";
  if (["active", "available", "published", "in progress"].includes(raw)) {
    const start = getDate(exam);
    const endValue = exam.endTime ?? exam.endDate ?? exam.endAt;
    const end = endValue ? new Date(endValue) : null;
    if (start && start > now) return "upcoming";
    if (end && !Number.isNaN(end.getTime()) && end < now) return "completed";
    return "available";
  }

  const start = getDate(exam);
  const endValue = exam.endTime ?? exam.endDate ?? exam.endAt;
  const end = endValue ? new Date(endValue) : null;
  if (start && start > now) return "upcoming";
  if (end && !Number.isNaN(end.getTime()) && end < now) return "completed";
  return "available";
};

const Exams = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadExams = async () => {
      setLoading(true);
      setError("");
      try {
        const [examResponse, analyticsResponse] = await Promise.all([
          examService.list(),
          analyticsService.student().catch(() => null),
        ]);
        if (ignore) return;

        const examPayload = unwrap(examResponse);
        const analyticsPayload = unwrap(analyticsResponse);
        const list = Array.isArray(examPayload)
          ? examPayload
          : Array.isArray(examPayload.items)
            ? examPayload.items
            : Array.isArray(examPayload.exams)
              ? examPayload.exams
              : [];

        const analyticsExams = [
          ...(analyticsPayload.activeExams ?? []),
          ...(analyticsPayload.upcomingExams ?? []),
          ...(analyticsPayload.completedExams ?? []),
        ];
        // Prefer the student-scoped analytics lists when available; they contain
        // the backend-derived status and question count for assigned exams.
        const sourceExams = analyticsExams.length ? analyticsExams : list;
        const attemptList = Array.isArray(analyticsPayload.recentAttempts)
          ? analyticsPayload.recentAttempts
          : [];

        const attemptsByExam = new Map();
        for (const attempt of attemptList) {
          const examId = String(attempt.exam?._id ?? attempt.exam?.id ?? attempt.exam ?? "");
          if (!examId) continue;
          const current = attemptsByExam.get(examId) ?? [];
          current.push(attempt);
          attemptsByExam.set(examId, current);
        }

        const normalized = sourceExams.map((exam) => {
          const id = String(exam._id ?? exam.id ?? "");
          const examAttempts = attemptsByExam.get(id) ?? [];
          const latestAttempt = examAttempts[0];
          const status = normalizeStatus(exam);
          const startDate = getDate(exam);
          const scoreValue = latestAttempt?.percentage ?? latestAttempt?.score;
          const score = scoreValue == null ? null : Number(scoreValue);
          const attemptNumber = Number(exam.attemptNumber ?? examAttempts.length ?? 0);
          const attemptsAllowed = Number(exam.attemptsAllowed ?? exam.maxAttempts ?? 1);

          return {
            ...exam,
            id,
            _id: id,
            title: exam.title ?? "Untitled Exam",
            subject: exam.subject ?? "General",
            description: exam.description ?? "No description provided.",
            questions: Number(exam.totalQuestions ?? exam.questionsCount ?? exam.questionCount ?? (Array.isArray(exam.questions) ? exam.questions.length : 0)),
            duration: Number(exam.duration ?? 0),
            attempts: examAttempts,
            attemptNumber,
            attemptsAllowed,
            score: Number.isFinite(score) ? score : null,
            status,
            date: startDate ? startDate.toLocaleDateString() : "Date not set",
            time: startDate ? startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Time not set",
          };
        });

        setExams(normalized);
        setAttempts(attemptList);
      } catch (err) {
        if (!ignore) setError(err?.response?.data?.message ?? err?.message ?? "Unable to load exams. Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadExams();
    return () => { ignore = true; };
  }, []);

  const counts = useMemo(() => ({
    all: exams.length,
    available: exams.filter((exam) => exam.status === "available").length,
    upcoming: exams.filter((exam) => exam.status === "upcoming").length,
    completed: exams.filter((exam) => exam.status === "completed").length,
  }), [exams]);

  const filteredExams = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesTab = activeTab === "all" || exam.status === activeTab;
      const matchesSearch = exam.title.toLowerCase().includes(search) || exam.subject.toLowerCase().includes(search);
      return matchesTab && matchesSearch;
    });
  }, [exams, activeTab, searchTerm]);

  const handleStartExam = (exam) => {
    if (exam.id) navigate(`/student/exam/${exam.id}/instructions`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Exams</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View your available, upcoming and completed exams.</p>
        </div>
        <div className="flex items-center gap-2 w-fit px-3 py-2 rounded-xl border bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{counts.available} exam{counts.available !== 1 ? "s" : ""} ready</span>
        </div>
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300" role="alert">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 font-medium hover:underline"><RefreshCw className="w-3.5 h-3.5" /> Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: "available", label: "Available Exams", Icon: FileQuestion, iconClass: "bg-indigo-50 dark:bg-indigo-500/10", colorClass: "text-indigo-600 dark:text-indigo-400" },
          { key: "upcoming", label: "Upcoming Exams", Icon: Clock3, iconClass: "bg-amber-50 dark:bg-amber-500/10", colorClass: "text-amber-600 dark:text-amber-400" },
          { key: "completed", label: "Completed Exams", Icon: CheckCircle2, iconClass: "bg-emerald-50 dark:bg-emerald-500/10", colorClass: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ key, label, Icon, iconClass, colorClass }) => (
          <div key={key} className="group bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${iconClass} rounded-xl`}><Icon className={`w-5 h-5 ${colorClass}`} /></div>
              <div><p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{counts[key]}</p><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search exams or subjects..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-1 overflow-x-auto">
          <div className="flex items-center px-2"><Filter className="w-4 h-4 text-slate-400" /></div>
          {[{ key: "all", label: "All" }, { key: "available", label: "Available" }, { key: "upcoming", label: "Upcoming" }, { key: "completed", label: "Completed" }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-200"}`}>
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0F172A]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExams.map((exam) => {
            const status = statusConfig[exam.status] ?? statusConfig.upcoming;
            const canStart = exam.status === "available" && exam.attemptNumber < exam.attemptsAllowed;
            return (
              <div key={exam.id || exam._id} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"><BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                    <div className="min-w-0"><h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{exam.title}</h2><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{exam.subject}</p></div>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${status.bg} ${status.text} ${status.border}`}><span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">{exam.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  {[
                    { label: "Questions", value: exam.questions || 0 },
                    { label: "Duration", value: `${exam.duration} min` },
                    { label: "Attempts", value: `${exam.attemptNumber}/${exam.attemptsAllowed}` },
                    { label: "Score", value: exam.score == null ? "—" : `${exam.score}%`, score: exam.score },
                  ].map((detail) => <div key={detail.label} className="bg-slate-50 dark:bg-[#111C33] border border-transparent dark:border-slate-800 rounded-xl p-2.5"><p className="text-[10px] text-slate-400 dark:text-slate-500">{detail.label}</p><p className={`text-xs font-semibold mt-1 ${detail.label === "Score" && detail.score != null ? (detail.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400") : "text-slate-700 dark:text-slate-200"}`}>{detail.value}</p></div>)}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs text-slate-500 dark:text-slate-400">{exam.date}</span></div>
                  <span className="text-xs text-slate-300">•</span>
                  <div className="flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs text-slate-500 dark:text-slate-400">{exam.time}</span></div>
                </div>
                <div className="mt-4">
                  {canStart ? <button onClick={() => handleStartExam(exam)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all"><PlayCircle className="w-4 h-4" />Start Exam<ArrowRight className="w-3.5 h-3.5" /></button> : exam.status === "upcoming" ? <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/70 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium cursor-not-allowed"><Lock className="w-3.5 h-3.5" />Exam Not Started</button> : exam.status === "completed" ? <button onClick={() => navigate(`/student/results/${exam.id}`)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/15 transition-all"><CheckCircle2 className="w-4 h-4" />View Result<ArrowRight className="w-3.5 h-3.5" /></button> : <p className="text-center text-xs text-slate-500">Attempt limit reached.</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredExams.length === 0 && !error && (
        <div className="text-center py-16 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-700/70">
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800"><BookOpen className="w-7 h-7 text-slate-300 dark:text-slate-600" /></div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No exams found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try changing your search or filter.</p>
        </div>
      )}

      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4">
        <div className="flex items-start gap-3"><div className="shrink-0 p-2 bg-indigo-100 dark:bg-indigo-500/15 rounded-lg"><svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg></div><div><h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Proctored Exam</h3><p className="text-xs text-indigo-700 dark:text-indigo-300/80 mt-1 leading-relaxed">Before starting an available exam, read the instructions, complete the system check, and verify your face.</p></div></div>
      </div>
    </div>
  );
};

export default Exams;
