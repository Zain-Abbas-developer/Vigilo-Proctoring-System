import { useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Activity,
  TrendingUp,
  FileText,
  Award,
  Building2,
  Hash,
  UserCheck,
  CircleAlert,
} from "lucide-react";

const StudentProfileModal = ({ student, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!student) return null;

  // =========================================
  // MOCK / FALLBACK DATA
  // =========================================

  const subjects = student.subjects || [
    {
      name: "Mathematics",
      code: "MATH-101",
      score: 88,
      exams: 4,
      status: "Excellent",
    },
    {
      name: "English Language",
      code: "ENG-102",
      score: 82,
      exams: 3,
      status: "Good",
    },
    {
      name: "Computer Science",
      code: "CS-201",
      score: 94,
      exams: 5,
      status: "Excellent",
    },
    {
      name: "Database Systems",
      code: "DB-301",
      score: 76,
      exams: 2,
      status: "Good",
    },
  ];

  const attempts = student.recentAttempts || [
    {
      exam: "Mathematics Midterm",
      date: "Sep 08, 2026",
      score: 88,
      status: "Completed",
      risk: 12,
    },
    {
      exam: "English Language Proficiency",
      date: "Sep 06, 2026",
      score: 82,
      status: "Completed",
      risk: 18,
    },
    {
      exam: "Computer Science Final",
      date: "Sep 03, 2026",
      score: 94,
      status: "Completed",
      risk: 8,
    },
    {
      exam: "Database Systems Quiz",
      date: "Aug 29, 2026",
      score: 76,
      status: "Completed",
      risk: 31,
    },
  ];

  const totalExams = student.totalExams ?? 12;
  const totalAttempts = student.totalAttempts ?? 14;
  const averageScore = student.averageScore ?? 85;
  const passRate = student.passRate ?? 92;

  // =========================================
  // HELPERS
  // =========================================

  const getScoreStyle = (score) => {
    if (score >= 85) {
      return "text-emerald-600 dark:text-emerald-400";
    }

    if (score >= 70) {
      return "text-yellow-600 dark:text-yellow-400";
    }

    return "text-red-600 dark:text-red-400";
  };

  const getRiskStyle = (risk) => {
    if (risk >= 70) {
      return "text-red-600 dark:text-red-400";
    }

    if (risk >= 40) {
      return "text-yellow-600 dark:text-yellow-400";
    }

    return "text-emerald-600 dark:text-emerald-400";
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";

      case "inactive":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";

      case "suspended":
        return "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";

      default:
        return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/75"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl transition-colors dark:border-slate-700 dark:bg-[#111827] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================
            HEADER
        ========================================== */}

        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Student Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Detailed academic and examination information
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* =========================================
              PROFILE HEADER
          ========================================== */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-[#1e293b]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="relative">
                  <img
                    src={
                      student.avatar ||
                      "https://i.pravatar.cc/150?img=12"
                    }
                    alt={student.name || "Student"}
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-500/10"
                  />

                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-slate-50 bg-emerald-500 dark:border-[#1e293b]">
                    <CheckCircle2
                      size={14}
                      className="text-white"
                    />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {student.name || "John Doe"}
                    </h3>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                        student.status || "Active"
                      )}`}
                    >
                      {student.status || "Active"}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {student.email || "john.doe@example.com"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                      <Hash
                        size={14}
                        className="text-indigo-500"
                      />
                      {student.studentId || "STU-2026-001"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                      <Building2
                        size={14}
                        className="text-purple-500"
                      />
                      {student.department || "Computer Science"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                      <GraduationCap
                        size={14}
                        className="text-blue-500"
                      />
                      {student.program || "BBIT"}
                    </span>

                  </div>
                </div>

              </div>

              {/* VERIFIED */}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <ShieldCheck
                      size={20}
                      className="text-emerald-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      ACCOUNT VERIFICATION
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Verified Student
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>


          {/* =========================================
              STATISTICS
          ========================================== */}

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#1e293b]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Total Exams
                </span>

                <FileText
                  size={18}
                  className="text-indigo-500"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {totalExams}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Assigned exams
              </p>
            </div>


            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#1e293b]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Attempts
                </span>

                <Activity
                  size={18}
                  className="text-blue-500"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {totalAttempts}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Completed attempts
              </p>
            </div>


            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#1e293b]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Average Score
                </span>

                <Trophy
                  size={18}
                  className="text-yellow-500"
                />
              </div>

              <p
                className={`mt-2 text-2xl font-bold ${getScoreStyle(
                  averageScore
                )}`}
              >
                {averageScore}%
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Overall performance
              </p>
            </div>


            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#1e293b]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Pass Rate
                </span>

                <Target
                  size={18}
                  className="text-emerald-500"
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {passRate}%
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Successful exams
              </p>
            </div>

          </div>


          {/* =========================================
              ACADEMIC + CONTACT
          ========================================== */}

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Academic */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                  <GraduationCap
                    size={21}
                    className="text-indigo-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Academic Information
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Student academic details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                {[
                  [
                    "Department",
                    student.department || "Computer Science",
                  ],
                  [
                    "Program",
                    student.program || "BBIT",
                  ],
                  [
                    "Semester",
                    student.semester || "4th Semester",
                  ],
                  [
                    "Enrollment Year",
                    student.enrollmentYear || "2025",
                  ],
                  [
                    "Section",
                    student.section || "A",
                  ],
                  [
                    "Roll Number",
                    student.rollNumber || "BBIT-25-041",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}

              </div>
            </div>


            {/* Contact */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                  <User
                    size={21}
                    className="text-purple-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Contact Information
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Student contact details
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <Mail
                    size={17}
                    className="text-indigo-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {student.email ||
                        "john.doe@example.com"}
                    </p>
                  </div>
                </div>


                <div className="flex items-center gap-3">
                  <Phone
                    size={17}
                    className="text-emerald-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Phone
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {student.phone ||
                        "+92 300 1234567"}
                    </p>
                  </div>
                </div>


                <div className="flex items-center gap-3">
                  <MapPin
                    size={17}
                    className="text-red-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Location
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {student.location ||
                        "Lahore, Pakistan"}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>


          {/* =========================================
              SUBJECT PERFORMANCE
          ========================================== */}

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                  <BookOpen
                    size={21}
                    className="text-blue-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Subject Performance
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Performance across enrolled subjects
                  </p>
                </div>

              </div>

              <TrendingUp
                size={19}
                className="text-emerald-500"
              />

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {subjects.map((subject, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#273449]"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {subject.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {subject.code}
                      </p>
                    </div>

                    <span
                      className={`text-lg font-bold ${getScoreStyle(
                        subject.score
                      )}`}
                    >
                      {subject.score}%
                    </span>

                  </div>


                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{
                        width: `${subject.score}%`,
                      }}
                    />
                  </div>


                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {subject.exams} exams attempted
                    </span>

                    <span
                      className={`text-xs font-medium ${getScoreStyle(
                        subject.score
                      )}`}
                    >
                      {subject.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* =========================================
              RECENT ATTEMPTS
          ========================================== */}

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                  <FileText
                    size={21}
                    className="text-purple-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Recent Exam Attempts
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latest examination activity
                  </p>
                </div>

              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                Last 30 days
              </span>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-162.5">

                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">

                    <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                      EXAM
                    </th>

                    <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                      DATE
                    </th>

                    <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                      SCORE
                    </th>

                    <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                      RISK
                    </th>

                    <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">
                      STATUS
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {attempts.map((item, index) => (

                    <tr
                      key={index}
                      className="border-b border-slate-200 transition last:border-0 hover:bg-slate-100 dark:border-slate-700/70 dark:hover:bg-slate-800/50"
                    >

                      <td className="py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                            <FileText
                              size={15}
                              className="text-indigo-500"
                            />
                          </div>

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {item.exam}
                          </span>

                        </div>

                      </td>


                      <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                        {item.date}
                      </td>


                      <td className="py-4">

                        <span
                          className={`text-sm font-semibold ${getScoreStyle(
                            item.score
                          )}`}
                        >
                          {item.score}%
                        </span>

                      </td>


                      <td className="py-4">

                        <div className="flex items-center gap-2">

                          <ShieldAlert
                            size={15}
                            className={getRiskStyle(item.risk)}
                          />

                          <span
                            className={`text-sm font-medium ${getRiskStyle(
                              item.risk
                            )}`}
                          >
                            {item.risk}%
                          </span>

                        </div>

                      </td>


                      <td className="py-4">

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* =========================================
              PROCTORING + ACTIVITY
          ========================================== */}

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Proctoring */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                  <ShieldCheck
                    size={21}
                    className="text-emerald-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Proctoring Overview
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Examination integrity analysis
                  </p>
                </div>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#273449]">

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Violations
                  </p>

                  <p className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {student.totalViolations ?? 3}
                  </p>

                </div>


                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#273449]">

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Avg. Risk
                  </p>

                  <p
                    className={`mt-1 text-xl font-bold ${getRiskStyle(
                      student.averageRisk ?? 17
                    )}`}
                  >
                    {student.averageRisk ?? 17}%
                  </p>

                </div>


                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#273449]">

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Face Verification
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">

                    <CheckCircle2 size={15} />

                    Verified

                  </p>

                </div>


                <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#273449]">

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Identity Status
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">

                    <UserCheck size={15} />

                    Confirmed

                  </p>

                </div>

              </div>

            </div>


            {/* Activity */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#1e293b]">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                  <Activity
                    size={21}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Account Activity
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Recent student activity
                  </p>
                </div>

              </div>


              <div className="space-y-4">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    size={17}
                    className="text-indigo-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Joined On
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {student.joiningDate ||
                        "January 15, 2026"}
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-3">

                  <Clock
                    size={17}
                    className="text-blue-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Last Active
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {student.lastActive ||
                        "Today, 8:42 PM"}
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-3">

                  <Award
                    size={17}
                    className="text-yellow-500"
                  />

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Achievement
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      Top 10% Performer
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =========================================
              PERFORMANCE INSIGHT
          ========================================== */}

          <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/10">
                <TrendingUp
                  size={20}
                  className="text-indigo-500"
                />
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Performance Insight
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">

                  This student is currently performing above
                  the average class level with an overall score
                  of{" "}

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {averageScore}%
                  </span>

                  . Computer Science is the strongest subject,
                  while Database Systems has the most room for
                  improvement. Proctoring activity indicates a{" "}

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    low-risk
                  </span>

                  {" "}examination profile.

                </p>

              </div>

            </div>

          </div>


          {/* =========================================
              ADMIN NOTE
          ========================================== */}

          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-500/20 dark:bg-yellow-500/10">

            <div className="flex gap-3">

              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0 text-yellow-500"
              />

              <div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Admin Note
                </h3>

                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                  Student has maintained consistent exam
                  activity and good academic performance. No
                  major proctoring concerns have been detected.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =========================================
            FOOTER
        ========================================== */}

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-[#111827]">

          <div className="hidden items-center gap-2 sm:flex">

            <ShieldCheck
              size={16}
              className="text-emerald-500"
            />

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Student account is verified
            </span>

          </div>

          <button
            onClick={onClose}
            className="ml-auto rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default StudentProfileModal;
