import { useEffect, useState } from "react";
import api from "../../services/api.js";
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  Shield,
  Eye,
} from "lucide-react";

const statusBadge = (status) => {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    flagged: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    waiting: "bg-slate-100 text-slate-600",
    terminated: "bg-red-200 text-red-800",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

import DataTable from "../../components/common/DataTable";

const Users = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentView, setCurrentView] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("riskScore");
  const [sortDir, setSortDir] = useState("desc");
  const [students, setStudents] = useState([]);

  //api here we use
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/users");
        console.log("Students API Response:", response);
        console.log("User response Data: ", response.data);

        const userList = response.data?.data?.items || [];
        setStudents(
          userList.map((student) => ({
            ...student,
            riskScore: Number(student.riskScore) || 0,
            violations: Array.isArray(student.violations)
              ? student.violations
              : [],
            status: student.status || "active",
          })),
        );
      } catch (error) {
        console.error("Fetch students error:", error);
      }
    };

    fetchStudents();
  }, []);

  const totalFlagged = students.filter((s) => s.status === "flagged").length;
  const avgRisk = students.length
    ? Math.round(
        students.reduce(
          (sum, student) => sum + (Number(student.riskScore) || 0),
          0,
        ) / students.length,
      )
    : 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredStudents = students
    .filter((s) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        (s.name || "").toLowerCase().includes(search) ||
        (s.email || "").toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;

      switch (sortField) {
        case "name":
          return (a.name || "").localeCompare(b.name || "") * dir;

        case "riskScore":
          return ((a.riskScore || 0) - (b.riskScore || 0)) * dir;

        case "violations":
          return (
            ((a.violations?.length || 0) - (b.violations?.length || 0)) * dir
          );

        case "status":
          return (a.status || "").localeCompare(b.status || "") * dir;

        default:
          return 0;
      }
    });

  //columns with students, status, riskscore, violations, lastviolation and action
  const columns = [
    {
      header: "Student",
      accessor: "name",
      status: statusBadge,
      sortable: true,
    },
    { header: "Status", accessor: "status", sortable: true },
    { header: "Risk Score", accessor: "riskScore", sortable: true },
    { header: "Violations", accessor: "violations", sortable: true },
    { header: "Last Violation", accessor: "lastViolation", sortable: true },
    { header: "Action", accessor: "action", sortable: false },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">
              {students.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-[#F8FAFC]">
              Total Students
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl">
            <Eye className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">
              {students.filter((s) => s.status === "active").length}
            </p>
            <p className="text-xs text-slate-500 dark:text-[#F8FAFC]">
              Currently Active
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">
              {totalFlagged}
            </p>
            <p className="text-xs text-slate-500 dark:text-[#F8FAFC]">
              Flagged Students
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">
              {avgRisk}%
            </p>
            <p className="text-xs text-slate-500 dark:text-[#F8FAFC]">
              Avg Risk Score
            </p>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#F8FAFC]" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 text-slate-800 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#F8FAFC] rounded-xl text-sm w-72 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 dark:text-[#F8FAFC] ml-2" />
            {["all", "in-progress", "flagged", "completed", "terminated"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === f
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#364058]"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ),
            )}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-linear-to-r dark:from-purple-500/90 dark:to-indigo-500 border border-slate-200 dark:border-indigo-400 rounded-xl text-sm font-medium text-slate-600 dark:text-[#F8FAFC] hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <DataTable
        students={students}
        filteredStudents={filteredStudents}
        handleSort={handleSort}
        sortField={sortField}
        sortOrder={sortDir}
        statusBadge={statusBadge}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default Users;
