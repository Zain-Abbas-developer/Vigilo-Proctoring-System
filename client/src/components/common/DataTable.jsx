import React, { useMemo, useState } from "react";
import StudentView from '../admin/StudentView';
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  AlertTriangle,
  Eye,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const DataTable = ({
  students,
  filteredStudents = [],
  handleSort,
  sortField,
  sortOrder,
  statusBadge,
  selectedStudent,
  setSelectedStudent,
  setCurrentView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  // Total pages
  const totalPages = Math.ceil(
    filteredStudents.length / pageSize
  );

  // Reset page when filtered data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredStudents.length]);

  // Current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  // Sort Icon
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <span className="text-slate-300">
          ↕
        </span>
      );
    }

    return sortOrder === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 overflow-hidden">

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full">

          {/* Header */}
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-indigo-400/60">

              {/* Student */}
              <th className="px-5 py-3.5 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase hover:text-slate-700 dark:hover:text-[#acaeaf]"
                >
                  Student
                  <SortIcon field="name" />
                </button>
              </th>

              {/* Status */}
              <th className="px-5 py-3.5 text-left">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase hover:text-slate-700 dark:hover:text-[#acaeaf]"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>

              {/* Risk Score */}
              <th className="px-5 py-3.5 text-left">
                <button
                  onClick={() => handleSort("riskScore")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase hover:text-slate-700 dark:hover:text-[#acaeaf]"
                >
                  Risk Score
                  <SortIcon field="riskScore" />
                </button>
              </th>

              {/* Violations */}
              <th className="px-5 py-3.5 text-left">
                <button
                  onClick={() => handleSort("violations")}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase hover:text-slate-700 dark:hover:text-[#acaeaf]"
                >
                  Violations
                  <SortIcon field="violations" />
                </button>
              </th>

              {/* Last Violation */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase">
                Last Violation
              </th>

              {/* Actions */}
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#F8FAFC] uppercase">
                Actions
              </th>

            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-indigo-400/60">

            {paginatedData.length > 0 ? (
              paginatedData.map((student) => {

                const violations =
                  student.violations || [];

                const lastViolation =
                  violations[violations.length - 1];

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-[#0F172A] transition-colors"
                  >

                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-indigo-500"
                        />

                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">
                            {student.name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-[#F8FAFC] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          statusBadge(student.status)
                        }`}
                      >
                        {student.status
                          ?.replace("-", " ")
                          .toUpperCase()}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">

                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.riskScore <= 30
                                ? "bg-emerald-500"
                                : student.riskScore <= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${student.riskScore}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC]">
                          {student.riskScore}%
                        </span>

                      </div>
                    </td>

                    {/* Violations */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">

                        <AlertTriangle
                          className={`w-4 h-4 ${
                            violations.length > 3
                              ? "text-red-500"
                              : "text-slate-400"
                          }`}
                        />

                        <span className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                          {violations.length}
                        </span>

                      </div>
                    </td>

                    {/* Last Violation */}
                    <td className="px-5 py-4">

                      {lastViolation ? (
                        <div>

                          <p className="text-xs font-medium text-slate-700 dark:text-[#F8FAFC]">
                            {lastViolation.description}
                          </p>

                          <p className="text-[10px] text-slate-400 dark:text-[#F8FAFC] mt-0.5">
                            {new Date(
                              lastViolation.timestamp
                            ).toLocaleTimeString()}
                          </p>

                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No violations
                        </span>
                      )}

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setCurrentView("student-profile");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500 text-indigo-600 dark:text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                    </td>

                  </tr>
                );
              })
            ) : (

              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-10 text-center text-sm text-slate-400"
                >
                  No students found
                </td>
              </tr>

            )}

          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">

        {/* Showing */}
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {paginatedData.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {filteredStudents.length}
          </span>{" "}
          students
        </p>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">

            {/* Previous */}
            <button
              onClick={() =>
                setCurrentPage(
                  Math.max(1, currentPage - 1)
                )
              }
              disabled={currentPage === 1}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-white hover:bg-slate-800"
                }`}
              >
                {page}
              </button>

            ))}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    totalPages,
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={16} />
            </button>

          </div>
        )}

      </div>

      {/* ================= STUDENT PROFILE MODAL ================= */}
        <StudentView
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />

    </div>
  );
};

export default DataTable;
