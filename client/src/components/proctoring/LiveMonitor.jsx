import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MonitorPlay,
  ShieldAlert,
  XCircle,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

import { liveMonitorExams } from "../../data/teacherMockData.js";

const LiveMonitor = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const refreshPage = () => {
    window.location.reload();
  }

  const exam = liveMonitorExams['EXM-001'];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /*
   * --------------------------------------------------
   * Exam Not Found
   * --------------------------------------------------
   */

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white">
        <div className="max-w-md w-full rounded-2xl border p-8 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-500">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <XCircle className="text-red-500" size={30} />
          </div>

          <h2 className="text-xl font-bold mb-2">
            Exam Not Found
          </h2>

          <p className="text-sm mb-6 text-slate-500 dark:text-slate-400">
            The exam you're trying to monitor does not exist or
            is no longer available.
          </p>

          <button
            onClick={() => navigate("/admin/exams")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * Stats
   * --------------------------------------------------
   */

  const totalStudents = exam.students.length;

  const activeStudents = exam.students.filter(
    (student) => student.status === "active"
  ).length;

  const warningStudents = exam.students.filter(
    (student) =>
      student.status === "warning" ||
      student.violations.length > 0
  ).length;

  const completedStudents = exam.students.filter(
    (student) => student.status === "completed"
  ).length;

  /*
   * --------------------------------------------------
   * Filter Students
   * --------------------------------------------------
   */

  const filteredStudents = useMemo(() => {
    return exam.students.filter((student) => {
      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.rollNo
          .toLowerCase()
          .includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "active") {
        matchesFilter = student.status === "active";
      }

      if (filter === "warning") {
        matchesFilter =
          student.status === "warning" ||
          student.violations.length > 0;
      }

      if (filter === "completed") {
        matchesFilter = student.status === "completed";
      }

      return matchesSearch && matchesFilter;
    });
  }, [exam.students, search, filter]);

  /*
   * --------------------------------------------------
   * Helpers
   * --------------------------------------------------
   */

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }

    if (status === "warning") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={13} />
          Warning
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
        <CheckCircle2 size={13} />
        Completed
      </span>
    );
  };

  const getViolationColor = (severity) => {
    if (severity === "high") {
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20";
    }

    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20";
  };

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <div className="min-h-screen p-4 md:p-6 transition-colors bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white">
      <div className="max-w-[1600px] mx-auto">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/admin/exams")}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold">
                  Live Monitor
                </h1>

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                {exam.title} • {exam.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <Clock3 size={16} />

              <span>
                {exam.startedAt} - {exam.endsAt}
              </span>
            </div>

            <button
              // onClick={refreshPage}
              className="w-10 h-10 rounded-xl border flex items-center justify-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {/* ==========================================
            Stats
        ========================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <StatCard
            icon={<Users size={20} />}
            title="Total Students"
            value={totalStudents}
            description="Enrolled in exam"
            iconClass="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          />

          <StatCard
            icon={<UserCheck size={20} />}
            title="Active Now"
            value={activeStudents}
            description="Currently attempting"
            iconClass="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            icon={<ShieldAlert size={20} />}
            title="Violations"
            value={warningStudents}
            description="Students flagged"
            iconClass="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            title="Completed"
            value={completedStudents}
            description="Finished exam"
            iconClass="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* ==========================================
            Exam Info
        ========================================== */}

        <div className="rounded-2xl border p-5 mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <MonitorPlay
                  size={18}
                  className="text-indigo-500"
                />

                <h2 className="font-semibold">
                  {exam.title}
                </h2>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {exam.subject} • {exam.type} •{" "}
                {exam.totalQuestions} Questions •{" "}
                {exam.duration} Minutes
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Exam ID:{" "}
                <span className="font-semibold">
                  {exam.id}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================
            Students Table
        ========================================== */}

        <div className="rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">

          {/* Table Header */}

          <div className="p-5 border-b border-slate-100 dark:border-slate-800">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

              <div>
                <h2 className="font-semibold text-lg">
                  Students Monitoring
                </h2>

                <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                  Monitor student progress and proctoring
                  violations in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}

                <div className="flex items-center gap-2 px-3 h-10 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <Search
                    size={17}
                    className="text-slate-400 dark:text-slate-500"
                  />

                  <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-44 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Filter */}

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="h-10 px-3 rounded-xl border outline-none text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  <option value="all">
                    All Students
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="warning">
                    Violations
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-250">

              <thead>
                <tr className="text-left text-xs uppercase tracking-wide bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">

                  <th className="px-5 py-4">
                    Student
                  </th>

                  <th className="px-5 py-4">
                    Roll No
                  </th>

                  <th className="px-5 py-4">
                    Progress
                  </th>

                  <th className="px-5 py-4">
                    Current Question
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Violations
                  </th>

                  <th className="px-5 py-4">
                    Last Activity
                  </th>

                  <th className="px-5 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredStudents.map((student) => {

                  const progress =
                    (student.solved /
                      student.totalQuestions) *
                    100;

                  return (
                    <tr
                      key={student.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >

                      {/* Student */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="relative">

                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />

                            {student.status === "active" && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-sm">
                              {student.name}
                            </p>

                            <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {student.rollNo}
                        </span>

                      </td>

                      {/* Progress */}

                      <td className="px-5 py-4">

                        <div className="w-32">

                          <div className="flex items-center justify-between mb-1.5">

                            <span className="text-xs font-medium">
                              {student.solved}/
                              {student.totalQuestions}
                            </span>

                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {Math.round(progress)}%
                            </span>

                          </div>

                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">

                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all"
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>
                        </div>
                      </td>

                      {/* Current Question */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Q{student.currentQuestion}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        {getStatusBadge(student.status)}
                      </td>

                      {/* Violations */}

                      <td className="px-5 py-4">

                        {student.violations.length === 0 ? (

                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">

                            <CheckCircle2 size={14} />

                            No violations

                          </span>

                        ) : (

                          <div className="space-y-1.5">

                            {student.violations.map(
                              (violation, index) => (

                                <div
                                  key={index}
                                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border text-xs font-medium ${getViolationColor(
                                    violation.severity
                                  )}`}
                                >

                                  <AlertTriangle
                                    size={13}
                                  />

                                  <span>
                                    {violation.type}
                                  </span>

                                  <span className="font-bold">
                                    × {violation.count}
                                  </span>

                                </div>
                              )
                            )}

                          </div>
                        )}

                      </td>

                      {/* Last Activity */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {student.lastActivity}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <button
                          className="w-9 h-9 rounded-lg flex items-center justify-center transition text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <MoreVertical size={17} />
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="py-16 text-center">

                <Users
                  size={36}
                  className="mx-auto mb-3 text-slate-300 dark:text-slate-700"
                />

                <p className="font-medium">
                  No students found
                </p>

                <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </div>

          {/* Footer */}

          <div className="px-5 py-4 border-t flex items-center justify-between border-slate-100 dark:border-slate-800">

            <p className="text-sm text-slate-400 dark:text-slate-500">

              Showing{" "}
              <span className="font-medium">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {totalStudents}
              </span>{" "}
              students

            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live updates enabled
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

/*
 * ======================================================
 * Stat Card
 * ======================================================
 */

const StatCard = ({
  icon,
  title,
  value,
  description,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="text-2xl font-bold mt-1">
            {value}
          </p>

          <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">
            {description}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default LiveMonitor;
