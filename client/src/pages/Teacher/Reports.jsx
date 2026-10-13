import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Award,
  AlertTriangle,
  BarChart3,
  Download,
  CalendarDays,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { reportService } from "../../services/reportService.js";

const AnalyticsReports = () => {
  const [dataRange, setDataRange] = useState(30);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ANALYTICS
  // =========================

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await reportService.getAnalytics(dataRange);

        console.log("Analytics Report API Response:", data);

        setAnalyticsData(data);
      } catch (err) {
        console.error("Analytics report fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load analytics report."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dataRange]);

  // =========================
  // DATA
  // =========================

  const overview = analyticsData?.overview || {};

  const summary = analyticsData?.summary || {};

  const scoreDistribution =
    analyticsData?.scoreDistribution || [];

  const examPerformance =
    analyticsData?.examPerformance || [];

  const topStudents =
    analyticsData?.topStudents || [];

  const averageScore = Number(
    overview.averageScore || 0
  );

  const passRate = Number(
    overview.passRate || 0
  );

  const activeStudents = Number(
    overview.activeStudents || 0
  );

  const averageRisk = Number(
    overview.averageRisk || 0
  );

  const totalExams = Number(
    summary.totalExams || 0
  );

  const totalAttempts = Number(
    summary.totalAttempts || 0
  );

  const passed = Number(
    summary.passed || 0
  );

  const flagged = Number(
    summary.flagged || 0
  );

  // =========================
  // DATE RANGE
  // =========================

  const handleDateChange = (e) => {
    setDataRange(Number(e.target.value));
  };

  const rangeLabel =
    dataRange === 7
      ? "Last 7 Days"
      : dataRange === 15
        ? "Last 15 Days"
        : "Last 30 Days";

  // =========================
  // EXPORT PDF
  // =========================

  const exportReport = () => {
    if (!analyticsData) return;

    const doc = new jsPDF();

    const today =
      new Date().toLocaleDateString();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Analytics & Reports", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Exam performance and student activity report",
      14,
      27
    );

    doc.text(
      `Date Range: ${rangeLabel}`,
      14,
      34
    );

    doc.text(
      `Generated: ${today}`,
      14,
      40
    );

    // =========================
    // OVERVIEW
    // =========================

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Overview Statistics",
      14,
      52
    );

    autoTable(doc, {
      startY: 57,

      head: [
        ["Metric", "Value"],
      ],

      body: [
        [
          "Average Score",
          `${averageScore.toFixed(1)}%`,
        ],
        [
          "Pass Rate",
          `${passRate.toFixed(1)}%`,
        ],
        [
          "Active Students",
          activeStudents.toLocaleString(),
        ],
        [
          "Average Risk",
          `${averageRisk.toFixed(1)}%`,
        ],
      ],

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fontStyle: "bold",
      },
    });

    // =========================
    // SCORE DISTRIBUTION
    // =========================

    let currentY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Performance Overview",
      14,
      currentY
    );

    currentY += 5;

    autoTable(doc, {
      startY: currentY,

      head: [
        [
          "Score Range",
          "Percentage",
          "Students",
        ],
      ],

      body: scoreDistribution.map(
        (item) => [
          item.label,
          `${Number(item.value || 0).toFixed(1)}%`,
          item.students || 0,
        ]
      ),

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fontStyle: "bold",
      },
    });

    // =========================
    // EXAM SUMMARY
    // =========================

    currentY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Exam Summary",
      14,
      currentY
    );

    currentY += 5;

    autoTable(doc, {
      startY: currentY,

      head: [
        ["Activity", "Count"],
      ],

      body: [
        [
          "Total Exams",
          totalExams.toLocaleString(),
        ],
        [
          "Total Attempts",
          totalAttempts.toLocaleString(),
        ],
        [
          "Passed",
          passed.toLocaleString(),
        ],
        [
          "Flagged",
          flagged.toLocaleString(),
        ],
      ],

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },

      headStyles: {
        fontStyle: "bold",
      },
    });

    // =========================
    // EXAM PERFORMANCE
    // =========================

    currentY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Exam Performance",
      14,
      currentY
    );

    currentY += 5;

    autoTable(doc, {
      startY: currentY,

      head: [
        [
          "Exam",
          "Attempts",
          "Average",
          "Pass Rate",
          "Risk",
        ],
      ],

      body: examPerformance.map(
        (exam) => [
          exam.exam,
          exam.attempts,
          `${Number(
            exam.average || 0
          ).toFixed(1)}%`,
          `${Number(
            exam.passRate || 0
          ).toFixed(1)}%`,
          `${Number(
            exam.risk || 0
          ).toFixed(1)}%`,
        ]
      ),

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 70,
        },

        1: {
          cellWidth: 25,
        },

        2: {
          cellWidth: 25,
        },

        3: {
          cellWidth: 25,
        },

        4: {
          cellWidth: 25,
        },
      },
    });

    // =========================
    // TOP STUDENTS
    // =========================

    currentY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
      "Top Performing Students",
      14,
      currentY
    );

    currentY += 5;

    autoTable(doc, {
      startY: currentY,

      head: [
        [
          "Rank",
          "Student",
          "Exams Completed",
          "Average",
          "Risk",
        ],
      ],

      body: topStudents.map(
        (student, index) => [
          `#${index + 1}`,
          student.name,
          student.exams,
          `${Number(
            student.average || 0
          ).toFixed(1)}%`,
          `${Number(
            student.risk || 0
          ).toFixed(1)}%`,
        ]
      ),

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fontStyle: "bold",
      },
    });

    // =========================
    // FOOTER
    // =========================

    const pageCount =
      doc.internal.getNumberOfPages();

    for (
      let i = 1;
      i <= pageCount;
      i++
    ) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Analytics & Reports | ${rangeLabel}`,
        14,
        doc.internal.pageSize.height - 10
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(
      `analytics-report-${rangeLabel
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Loading analytics...
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-md text-slate-500 dark:text-[#94A3B8] mt-1">
              Analyze exam performance and student activity
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="inline-flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 text-slate-600 dark:text-[#CBD5E1] rounded-xl text-xs font-medium">

              <CalendarDays className="w-4 h-4 text-indigo-500" />

              <select
                value={dataRange}
                onChange={handleDateChange}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-700 dark:text-[#F8FAFC]"
              >
                <option
                  value="7"
                  className="bg-white dark:bg-[#0F172A]"
                >
                  Last 7 Days
                </option>

                <option
                  value="15"
                  className="bg-white dark:bg-[#0F172A]"
                >
                  Last 15 Days
                </option>

                <option
                  value="30"
                  className="bg-white dark:bg-[#0F172A]"
                >
                  Last 30 Days
                </option>
              </select>

            </div>

          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-400/40 rounded-xl p-5">

          <div className="flex items-center gap-3">

            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />

            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Failed to load analytics
              </p>

              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-md text-slate-500 dark:text-[#94A3B8] mt-1">
            Analyze exam performance and student activity
          </p>

        </div>

        <div className="flex items-center gap-2">

          {/* Date Range */}

          <div className="inline-flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 text-slate-600 dark:text-[#CBD5E1] rounded-xl text-xs font-medium">

            <CalendarDays className="w-4 h-4 text-indigo-500" />

            <select
              value={dataRange}
              onChange={handleDateChange}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 dark:text-[#F8FAFC]"
            >

              <option
                value="7"
                className="bg-white dark:bg-[#0F172A]"
              >
                Last 7 Days
              </option>

              <option
                value="15"
                className="bg-white dark:bg-[#0F172A]"
              >
                Last 15 Days
              </option>

              <option
                value="30"
                className="bg-white dark:bg-[#0F172A]"
              >
                Last 30 Days
              </option>

            </select>

          </div>

          {/* Export */}

          <button
            onClick={exportReport}
            disabled={!analyticsData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-medium transition-colors"
          >

            <Download className="w-4 h-4" />

            Export Report

          </button>

        </div>

      </div>

      {/* Overview Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Average Score */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
                Average Score
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-2">
                {averageScore.toFixed(1)}%
              </p>

            </div>

            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/60 rounded-xl">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>

          </div>

          <div className="flex items-center gap-1 mt-4">

            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />

            <span className="text-xs font-medium text-emerald-500">
              Current
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              {rangeLabel}
            </span>

          </div>

        </div>

        {/* Pass Rate */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
                Pass Rate
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-2">
                {passRate.toFixed(1)}%
              </p>

            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl">

              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />

            </div>

          </div>

          <div className="flex items-center gap-1 mt-4">

            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />

            <span className="text-xs font-medium text-emerald-500">
              Current
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              {rangeLabel}
            </span>

          </div>

        </div>

        {/* Active Students */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
                Active Students
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-2">
                {activeStudents.toLocaleString()}
              </p>

            </div>

            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/50 rounded-xl">

              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />

            </div>

          </div>

          <div className="flex items-center gap-1 mt-4">

            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />

            <span className="text-xs font-medium text-emerald-500">
              Current
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              Active accounts
            </span>

          </div>

        </div>

        {/* Average Risk */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
                Average Risk
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-2">
                {averageRisk.toFixed(1)}%
              </p>

            </div>

            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/50 rounded-xl">

              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />

            </div>

          </div>

          <div className="flex items-center gap-1 mt-4">

            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />

            <span className="text-xs font-medium text-emerald-500">
              Current
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              {rangeLabel}
            </span>

          </div>

        </div>

      </div>

      {/* Performance Overview */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Score Distribution */}

        <div className="xl:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
                Performance Overview
              </h2>

              <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-1">
                Student score distribution
              </p>

            </div>

            <BarChart3 className="w-5 h-5 text-slate-400 dark:text-indigo-400" />

          </div>

          <div className="mt-6 space-y-5">

            {scoreDistribution.length > 0 ? (
              scoreDistribution.map((item) => (

                <div key={item.label}>

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-xs font-medium text-slate-600 dark:text-[#CBD5E1]">
                      {item.label}
                    </span>

                    <span className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      {item.students || 0} students
                    </span>

                  </div>

                  <div className="h-2 bg-slate-100 dark:bg-[#1E293B] rounded-full overflow-hidden">

                    <div
                      className="h-full bg-indigo-500 dark:bg-indigo-500 rounded-full"
                      style={{
                        width: `${Number(item.value || 0)}%`,
                      }}
                    />

                  </div>

                </div>

              ))
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                No score data available for this period.
              </p>
            )}

          </div>

        </div>

        {/* Exam Summary */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
            Exam Summary
          </h2>

          <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-1">
            Overall examination activity
          </p>

          <div className="space-y-4 mt-6">

            {/* Total Exams */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/60 rounded-lg">

                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />

                </div>

                <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                  Total Exams
                </span>

              </div>

              <span className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">
                {totalExams.toLocaleString()}
              </span>

            </div>

            {/* Attempts */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">

                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />

                </div>

                <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                  Total Attempts
                </span>

              </div>

              <span className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC]">
                {totalAttempts.toLocaleString()}
              </span>

            </div>

            {/* Passed */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg">

                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />

                </div>

                <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                  Passed
                </span>

              </div>

              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {passed.toLocaleString()}
              </span>

            </div>

            {/* Flagged */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="p-2 bg-red-50 dark:bg-red-900/50 rounded-lg">

                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />

                </div>

                <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                  Flagged
                </span>

              </div>

              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {flagged.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Exam Performance */}

      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 dark:border-indigo-400/60">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
            Exam Performance
          </h2>

          <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-1">
            Performance breakdown by examination
          </p>

        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-indigo-900/40 border-b border-slate-200 dark:border-indigo-400/60 text-[10px] font-semibold text-slate-500 dark:text-slate-300 uppercase">

          <div className="col-span-4">
            Exam
          </div>

          <div className="col-span-2">
            Attempts
          </div>

          <div className="col-span-2">
            Average
          </div>

          <div className="col-span-2">
            Pass Rate
          </div>

          <div className="col-span-2">
            Risk
          </div>

        </div>

        <div className="divide-y divide-slate-100 dark:divide-indigo-400/40">

          {examPerformance.length > 0 ? (
            examPerformance.map((exam) => (

              <div
                key={exam.exam}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-indigo-900/30 transition-colors"
              >

                <div className="md:col-span-4">

                  <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                    {exam.exam}
                  </p>

                </div>

                <div className="md:col-span-2">

                  <span className="text-sm text-slate-600 dark:text-[#CBD5E1]">
                    {exam.attempts}
                  </span>

                </div>

                <div className="md:col-span-2">

                  <span
                    className={`text-sm font-bold ${
                      exam.average >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : exam.average >= 60
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {Number(
                      exam.average || 0
                    ).toFixed(1)}
                    %
                  </span>

                </div>

                <div className="md:col-span-2">

                  <span className="text-sm font-semibold text-slate-700 dark:text-[#CBD5E1]">
                    {Number(
                      exam.passRate || 0
                    ).toFixed(1)}
                    %
                  </span>

                </div>

                <div className="md:col-span-2">

                  <span
                    className={`text-sm font-semibold ${
                      exam.risk >= 40
                        ? "text-red-600 dark:text-red-400"
                        : exam.risk >= 25
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {Number(
                      exam.risk || 0
                    ).toFixed(1)}
                    %
                  </span>

                </div>

              </div>

            ))
          ) : (
            <div className="px-5 py-10 text-center">

              <p className="text-sm text-slate-400 dark:text-slate-500">
                No exam performance data available for this period.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Top Students */}

      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 dark:border-indigo-400/60">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
            Top Performing Students
          </h2>

          <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-1">
            Students with the highest average scores
          </p>

        </div>

        <div className="divide-y divide-slate-100 dark:divide-indigo-400/40">

          {topStudents.length > 0 ? (
            topStudents.map((student, index) => (

              <div
                key={`${student.name}-${index}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-indigo-900/30 transition-colors"
              >

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/60 flex items-center justify-center">

                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      #{index + 1}
                    </span>

                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                      {student.name}
                    </p>

                    <p className="text-xs text-slate-400 dark:text-[#94A3B8] mt-0.5">
                      {student.exams} exams completed
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-8">

                  <div>

                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] uppercase">
                      Average
                    </p>

                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {Number(
                        student.average || 0
                      ).toFixed(1)}
                      %
                    </p>

                  </div>

                  <div>

                    <p className="text-[10px] text-slate-400 dark:text-[#94A3B8] uppercase">
                      Risk
                    </p>

                    <p
                      className={`text-sm font-bold mt-0.5 ${
                        student.risk >= 50
                          ? "text-red-600 dark:text-red-400"
                          : student.risk >= 25
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {Number(
                        student.risk || 0
                      ).toFixed(1)}
                      %
                    </p>

                  </div>

                </div>

              </div>

            ))
          ) : (
            <div className="px-5 py-10 text-center">

              <p className="text-sm text-slate-400 dark:text-slate-500">
                No student performance data available for this period.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AnalyticsReports;
