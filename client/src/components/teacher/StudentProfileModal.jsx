// import {

//   X,
//   User,
//   Mail,
//   Phone,
//   GraduationCap,
//   CalendarDays,
//   FileText,
//   Clock,
//   ShieldAlert,
//   Trophy,
//   AlertTriangle,
//   CheckCircle2,
// } from "lucide-react";

// const StudentProfileModal = ({ isOpen, onClose, attempt }) => {
//   if (!isOpen || !attempt) return null;

//   const initials = attempt?.student
//     ?.split(" ")
//     .map((name) => name[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   const riskColor =
//     attempt.risk >= 80
//       ? "text-red-600"
//       : attempt.risk >= 50
//       ? "text-amber-600"
//       : "text-emerald-600";

//   const riskBg =
//     attempt.risk >= 80
//       ? "bg-red-50 border-red-200"
//       : attempt.risk >= 50
//       ? "bg-amber-50 border-amber-200"
//       : "bg-emerald-50 border-emerald-200";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

//         {/* Header */}
//         <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
//           <div>
//             <h2 className="text-lg font-semibold text-slate-800">
//               Student Profile
//             </h2>

//             <p className="mt-1 text-xs text-slate-500">
//               Student profile and examination attempt details
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-6 p-6">

//           {/* Student Profile Card */}
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

//               {/* Avatar */}
//               <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100">
//                 <span className="text-lg font-bold text-indigo-600">
//                   {initials}
//                 </span>
//               </div>

//               {/* Name */}
//               <div className="flex-1">
//                 <h3 className="text-xl font-semibold text-slate-800">
//                   {attempt.student}
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Student ID: STU-{String(attempt.id).padStart(4, "0")}
//                 </p>
//               </div>

//               {/* Status */}
//               <div>
//                 <span
//                   className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase ${
//                     attempt.status === "completed"
//                       ? "bg-emerald-100 text-emerald-700"
//                       : attempt.status === "flagged"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-blue-100 text-blue-700"
//                   }`}
//                 >
//                   {attempt.status === "completed" && (
//                     <CheckCircle2 className="h-3.5 w-3.5" />
//                   )}

//                   {attempt.status === "flagged" && (
//                     <AlertTriangle className="h-3.5 w-3.5" />
//                   )}

//                   {attempt.status === "in progress" && (
//                     <Clock className="h-3.5 w-3.5" />
//                   )}

//                   {attempt.status}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Student Information */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-slate-800">
//               Student Information
//             </h3>

//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

//               <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
//                 <div className="rounded-lg bg-indigo-50 p-2">
//                   <Mail className="h-4 w-4 text-indigo-600" />
//                 </div>

//                 <div>
//                   <p className="text-[11px] text-slate-400">
//                     Email
//                   </p>

//                   <p className="text-sm font-medium text-slate-700">
//                     {attempt.email || "john.doe@example.com"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
//                 <div className="rounded-lg bg-blue-50 p-2">
//                   <Phone className="h-4 w-4 text-blue-600" />
//                 </div>

//                 <div>
//                   <p className="text-[11px] text-slate-400">
//                     Phone
//                   </p>

//                   <p className="text-sm font-medium text-slate-700">
//                     {attempt.phone || "+92 300 1234567"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
//                 <div className="rounded-lg bg-purple-50 p-2">
//                   <GraduationCap className="h-4 w-4 text-purple-600" />
//                 </div>

//                 <div>
//                   <p className="text-[11px] text-slate-400">
//                     Class / Program
//                   </p>

//                   <p className="text-sm font-medium text-slate-700">
//                     {attempt.program || "Computer Science"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
//                 <div className="rounded-lg bg-amber-50 p-2">
//                   <CalendarDays className="h-4 w-4 text-amber-600" />
//                 </div>

//                 <div>
//                   <p className="text-[11px] text-slate-400">
//                     Enrollment Date
//                   </p>

//                   <p className="text-sm font-medium text-slate-700">
//                     {attempt.enrollmentDate || "Jan 15, 2026"}
//                   </p>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Exam Details */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-slate-800">
//               Exam Attempt
//             </h3>

//             <div className="rounded-xl border border-slate-200">

//               <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

//                 <div className="p-4">
//                   <p className="text-[11px] text-slate-400">
//                     Exam
//                   </p>

//                   <div className="mt-1 flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-indigo-500" />

//                     <p className="text-sm font-medium text-slate-700">
//                       {attempt.exam}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <p className="text-[11px] text-slate-400">
//                     Started
//                   </p>

//                   <div className="mt-1 flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-slate-400" />

//                     <p className="text-sm font-medium text-slate-700">
//                       {attempt.started}
//                     </p>
//                   </div>
//                 </div>

//               </div>

//               <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-2">

//                 <div className="p-4">
//                   <p className="text-[11px] text-slate-400">
//                     Submitted
//                   </p>

//                   <p className="mt-1 text-sm font-medium text-slate-700">
//                     {attempt.submitted || "Not submitted yet"}
//                   </p>
//                 </div>

//                 <div className="p-4">
//                   <p className="text-[11px] text-slate-400">
//                     Attempt ID
//                   </p>

//                   <p className="mt-1 text-sm font-medium text-slate-700">
//                     ATT-{String(attempt.id).padStart(5, "0")}
//                   </p>
//                 </div>

//               </div>
//             </div>
//           </div>

//           {/* Performance */}
//           <div>
//             <h3 className="mb-3 text-sm font-semibold text-slate-800">
//               Performance
//             </h3>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

//               {/* Score */}
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-slate-500">
//                     Score
//                   </span>

//                   <Trophy className="h-4 w-4 text-amber-500" />
//                 </div>

//                 <p
//                   className={`mt-2 text-2xl font-bold ${
//                     attempt.score >= 80
//                       ? "text-emerald-600"
//                       : attempt.score >= 60
//                       ? "text-amber-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {attempt.score !== null
//                     ? `${attempt.score}%`
//                     : "Pending"}
//                 </p>
//               </div>

//               {/* Risk */}
//               <div className={`rounded-xl border p-4 ${riskBg}`}>
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-slate-500">
//                     Proctoring Risk
//                   </span>

//                   <ShieldAlert className={`h-4 w-4 ${riskColor}`} />
//                 </div>

//                 <p className={`mt-2 text-2xl font-bold ${riskColor}`}>
//                   {attempt.risk}%
//                 </p>
//               </div>

//               {/* Violations */}
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-slate-500">
//                     Violations
//                   </span>

//                   <AlertTriangle className="h-4 w-4 text-red-500" />
//                 </div>

//                 <p className="mt-2 text-2xl font-bold text-slate-700">
//                   {attempt.violations}
//                 </p>
//               </div>

//             </div>
//           </div>

//           {/* Risk Summary */}
//           <div
//             className={`rounded-xl border p-4 ${riskBg}`}
//           >
//             <div className="flex gap-3">

//               <ShieldAlert
//                 className={`mt-0.5 h-5 w-5 shrink-0 ${riskColor}`}
//               />

//               <div>
//                 <h3 className="text-sm font-semibold text-slate-800">
//                   Proctoring Summary
//                 </h3>

//                 <p className="mt-1 text-sm leading-6 text-slate-600">
//                   {attempt.violations === 0
//                     ? "No proctoring violations were detected during this examination attempt."
//                     : `${attempt.violations} proctoring violation${
//                         attempt.violations > 1 ? "s" : ""
//                       } were detected during this examination attempt. Review the attempt before final approval.`}
//                 </p>
//               </div>

//             </div>
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default StudentProfileModal;


import {
  X,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  FileText,
  Clock,
  ShieldAlert,
  Trophy,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const StudentProfileModal = ({ isOpen, onClose, attempt }) => {
  if (!isOpen || !attempt) return null;

  // =========================
  // Backend-compatible data
  // =========================

  const studentName =
    typeof attempt.student === "string"
      ? attempt.student
      : attempt.student?.name || "Unknown Student";

  const studentEmail =
    typeof attempt.student === "object"
      ? attempt.student?.email
      : attempt.email;

  const rollNumber =
    typeof attempt.student === "object"
      ? attempt.student?.rollNumber
      : attempt.rollNumber;

  const examName =
    typeof attempt.exam === "string"
      ? attempt.exam
      : attempt.exam?.title || "Unknown Exam";

  const examSubject =
    typeof attempt.exam === "object"
      ? attempt.exam?.subject
      : null;

  const attemptId = attempt._id || attempt.id;

  const initials = studentName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // =========================
  // Status
  // =========================

  const status =
    attempt.status === "submitted" ||
    attempt.status === "auto-submitted"
      ? "completed"
      : attempt.status === "in-progress"
      ? "in progress"
      : attempt.status;

  // =========================
  // Score
  // =========================

  const score =
    typeof attempt.score === "number"
      ? attempt.score
      : attempt.score !== null && attempt.score !== undefined
      ? Number(attempt.score)
      : null;

  // =========================
  // Violations
  // =========================

  const violations = Array.isArray(attempt.violations)
    ? attempt.violations.length
    : Number(attempt.violations || 0);

  // =========================
  // Risk
  // =========================

  const risk =
    typeof attempt.risk === "number"
      ? attempt.risk
      : typeof attempt.riskScore === "number"
      ? attempt.riskScore
      : Math.min(violations * 10, 100);

  const riskColor =
    risk >= 80
      ? "text-red-600"
      : risk >= 50
      ? "text-amber-600"
      : "text-emerald-600";

  const riskBg =
    risk >= 80
      ? "bg-red-50 border-red-200"
      : risk >= 50
      ? "bg-amber-50 border-amber-200"
      : "bg-emerald-50 border-emerald-200";

  // =========================
  // Dates
  // =========================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  const startedAt = attempt.startedAt || attempt.started;

  const submittedAt = attempt.submittedAt || attempt.submitted;

  // =========================
  // Status icon
  // =========================

  const renderStatusIcon = () => {
    if (status === "completed") {
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    }

    if (status === "flagged") {
      return <AlertTriangle className="h-3.5 w-3.5" />;
    }

    if (status === "in progress") {
      return <Clock className="h-3.5 w-3.5" />;
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Student Profile
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Student profile and examination attempt details
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          {/* Student Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-lg font-bold text-indigo-600">
                  {initials || "ST"}
                </span>
              </div>

              {/* Name */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800">
                  {studentName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {rollNumber
                    ? `Roll Number: ${rollNumber}`
                    : `Attempt ID: ${String(attemptId || "").slice(-8)}`}
                </p>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase ${
                    status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : status === "flagged"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {renderStatusIcon()}

                  {status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Student Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Email */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Email
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {studentEmail || "Not available"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {attempt.phone || "Not available"}
                  </p>
                </div>
              </div>

              {/* Class / Program */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="rounded-lg bg-purple-50 p-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Class / Program
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {attempt.program ||
                      attempt.student?.department ||
                      "Not available"}
                  </p>
                </div>
              </div>

              {/* Enrollment Date */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="rounded-lg bg-amber-50 p-2">
                  <CalendarDays className="h-4 w-4 text-amber-600" />
                </div>

                <div>
                  <p className="text-[11px] text-slate-400">
                    Enrollment Date
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {attempt.enrollmentDate
                      ? formatDate(attempt.enrollmentDate)
                      : "Not available"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Exam Details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Exam Attempt
            </h3>

            <div className="rounded-xl border border-slate-200">

              <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

                {/* Exam */}
                <div className="p-4">
                  <p className="text-[11px] text-slate-400">
                    Exam
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {examName}
                      </p>

                      {examSubject && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {examSubject}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Started */}
                <div className="p-4">
                  <p className="text-[11px] text-slate-400">
                    Started
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />

                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(startedAt)}
                    </p>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-2">

                {/* Submitted */}
                <div className="p-4">
                  <p className="text-[11px] text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {submittedAt
                      ? formatDate(submittedAt)
                      : "Not submitted yet"}
                  </p>
                </div>

                {/* Attempt ID */}
                <div className="p-4">
                  <p className="text-[11px] text-slate-400">
                    Attempt ID
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {attemptId
                      ? `ATT-${String(attemptId).slice(-8).toUpperCase()}`
                      : "N/A"}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Performance
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Score */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Score
                  </span>

                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    score >= 80
                      ? "text-emerald-600"
                      : score >= 60
                      ? "text-amber-600"
                      : score !== null
                      ? "text-red-600"
                      : "text-slate-500"
                  }`}
                >
                  {score !== null && !Number.isNaN(score)
                    ? `${score}%`
                    : "Pending"}
                </p>
              </div>

              {/* Risk */}
              <div className={`rounded-xl border p-4 ${riskBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Proctoring Risk
                  </span>

                  <ShieldAlert className={`h-4 w-4 ${riskColor}`} />
                </div>

                <p className={`mt-2 text-2xl font-bold ${riskColor}`}>
                  {risk}%
                </p>
              </div>

              {/* Violations */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Violations
                  </span>

                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>

                <p className="mt-2 text-2xl font-bold text-slate-700">
                  {violations}
                </p>
              </div>

            </div>
          </div>

          {/* Risk Summary */}
          <div className={`rounded-xl border p-4 ${riskBg}`}>
            <div className="flex gap-3">

              <ShieldAlert
                className={`mt-0.5 h-5 w-5 shrink-0 ${riskColor}`}
              />

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Proctoring Summary
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {violations === 0
                    ? "No proctoring violations were detected during this examination attempt."
                    : `${violations} proctoring violation${
                        violations > 1 ? "s" : ""
                      } were detected during this examination attempt. Review the attempt before final approval.`}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfileModal;