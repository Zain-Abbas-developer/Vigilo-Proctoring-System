import ViewAttemptModal from '../../components/admin/ViewAttempt';
import { attemptService } from '../../services/attemptService.js';
import { useState, useEffect }from 'react';
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FileText,
} from 'lucide-react';


const statusStyles = {
  completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-400/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    badge:
      'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    icon: CheckCircle2,
  },

  in_progress: {
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-400/30',
    text: 'text-blue-700 dark:text-blue-400',
    badge:
      'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
    icon: PlayCircle,
  },

  flagged: {
    bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-400/30',
    text: 'text-red-700 dark:text-red-400',
    badge:
      'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
    icon: AlertTriangle,
  },
};

const Attempts = () => {
  const [viewModal, setViewModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attempts, setAttempts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const loadAttempts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await attemptService.list();
      const records = response?.attempts || response?.items || response || [];

      setAttempts(records);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load exam attempts'
      );
    } finally {
      setLoading(false);
    }
  };

  loadAttempts();
}, []);


const normalizedAttempts = attempts.map((attempt) => ({
  ...attempt,
  id: attempt._id || attempt.id,
  student: {
    name:
      attempt.student?.name ||
      attempt.student?.fullName ||
      'Unknown student',
    avatar: attempt.student?.avatar || 'https://via.placeholder.com/40',
  },
  exam: attempt.exam?.title || attempt.exam?.name || 'Unknown exam',
  startedAt: attempt.startedAt || attempt.createdAt,
  submittedAt: attempt.submittedAt || null,
  score: attempt.score ?? null,
  riskScore: attempt.riskScore ?? 0,
  violations: Array.isArray(attempt.violations)
    ? attempt.violations.length
    : Number(attempt.violations || 0),
  status: attempt.status || 'in_progress',
}));

const filteredAttempts = normalizedAttempts
  .filter(
    (attempt) =>
      statusFilter === 'all' || attempt.status === statusFilter
  )
  .filter(
    (attempt) =>
      attempt.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.exam.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort(
    (a, b) =>
      new Date(b.startedAt).getTime() -
      new Date(a.startedAt).getTime()
  );

  const statusCounts = {
    all: attempts.length,
    completed: attempts.filter(
      (attempt) => attempt.status === 'completed'
    ).length,
    in_progress: attempts.filter(
      (attempt) => attempt.status === 'in_progress'
    ).length,
    flagged: attempts.filter(
      (attempt) => attempt.status === 'flagged'
    ).length,
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-6">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border transition-all text-left ${
            statusFilter === 'all'
              ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-400/60 border-2'
              : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-indigo-400/60 hover:border-slate-300 dark:hover:border-indigo-300/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-[#CBD5E1]">
                Total Attempts
              </p>

              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-1">
                {statusCounts.all}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </button>

        {/* Completed */}
        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'completed' ? 'all' : 'completed'
            )
          }
          className={`p-4 rounded-xl border transition-all text-left ${
            statusFilter === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-400/60 border-2'
              : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-indigo-400/60 hover:border-slate-300 dark:hover:border-emerald-300/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-[#CBD5E1]">
                Completed
              </p>

              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {statusCounts.completed}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </button>

        {/* In Progress */}
        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'in_progress' ? 'all' : 'in_progress'
            )
          }
          className={`p-4 rounded-xl border transition-all text-left ${
            statusFilter === 'in_progress'
              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-400/60 border-2'
              : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-indigo-400/60 hover:border-slate-300 dark:hover:border-blue-300/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-[#CBD5E1]">
                In Progress
              </p>

              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                {statusCounts.in_progress}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </button>

        {/* Flagged */}
        <button
          onClick={() =>
            setStatusFilter(
              statusFilter === 'flagged' ? 'all' : 'flagged'
            )
          }
          className={`p-4 rounded-xl border transition-all text-left ${
            statusFilter === 'flagged'
              ? 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-400/60 border-2'
              : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-indigo-400/60 hover:border-slate-300 dark:hover:border-red-300/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-[#CBD5E1]">
                Flagged
              </p>

              <p className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">
                {statusCounts.flagged}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </button>
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#94A3B8]" />

          <input
            type="text"
            placeholder="Search student or exam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5
              bg-white dark:bg-[#1E293B]
              border border-slate-200 dark:border-indigo-400/60
              rounded-xl text-sm
              text-slate-800 dark:text-[#F8FAFC]
              placeholder:text-slate-400 dark:placeholder:text-[#94A3B8]
              focus:outline-none
              focus:border-indigo-400 dark:focus:border-indigo-400
              focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20
            "
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-1">

          <Filter className="w-4 h-4 text-slate-400 dark:text-[#94A3B8] ml-2" />

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449]'
            }`}
          >
            All ({statusCounts.all})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449]'
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'in_progress'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449]'
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setStatusFilter('flagged')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'flagged'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#263449]'
            }`}
          >
            Flagged
          </button>

        </div>
      </div>

      {/* ================= ATTEMPTS TABLE ================= */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 overflow-hidden">

        {/* Table Header */}
        <div className="
          hidden lg:grid grid-cols-12 gap-4
          px-5 py-3
          bg-slate-50 dark:bg-[#172033]
          border-b border-slate-200 dark:border-slate-700
          text-xs font-semibold
          text-slate-500 dark:text-[#CBD5E1]
          uppercase
        ">
          <div className="col-span-3">Student</div>
          <div className="col-span-2">Exam</div>
          <div className="col-span-2">Started</div>
          <div className="col-span-1">Score</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-1">Violations</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/70">

          {filteredAttempts.map((attempt) => {
            const status = statusStyles[attempt.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={attempt.id}
                className="
                  grid grid-cols-1 lg:grid-cols-12 gap-4
                  px-5 py-4
                  hover:bg-slate-50 dark:hover:bg-[#263449]
                  dark:hover:border-indigo-400/60
                  transition-colors
                  items-center
                "
              >

                {/* Student */}
                <div className="lg:col-span-3 flex items-center gap-3">

                  <img
                    src={attempt.student.avatar}
                    alt={attempt.student.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] truncate">
                      {attempt.student.name}
                    </p>

                    <p className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      Attempt #{attempt.id}
                    </p>
                  </div>

                </div>

                {/* Exam */}
                <div className="lg:col-span-2">

                  <p className="text-sm font-medium text-slate-700 dark:text-[#E2E8F0] truncate">
                    {attempt.exam}
                  </p>

                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-[#94A3B8]" />

                    <span className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      {attempt.duration}
                    </span>
                  </div>

                </div>

                {/* Started */}
                <div className="lg:col-span-2">

                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">
                    {formatDate(attempt.startedAt)}
                  </p>

                  {attempt.submittedAt && (
                    <p className="text-[11px] text-slate-400 dark:text-[#94A3B8] mt-1">
                      Submitted: {formatDate(attempt.submittedAt)}
                    </p>
                  )}

                </div>

                {/* Score */}
                <div className="lg:col-span-1">

                  {attempt.score !== null ? (
                    <span
                      className={`text-sm font-bold ${
                        attempt.score >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : attempt.score >= 60
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {attempt.score}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-[#94A3B8]">
                      Pending
                    </span>
                  )}

                </div>

                {/* Risk */}
                <div className="lg:col-span-1">

                  <span
                    className={`text-sm font-bold ${
                      attempt.riskScore >= 80
                        ? 'text-red-600 dark:text-red-400'
                        : attempt.riskScore >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {attempt.riskScore}%
                  </span>

                </div>

                {/* Violations */}
                <div className="lg:col-span-1">

                  <div className="flex items-center gap-1.5">

                    {attempt.violations > 0 && (
                      <AlertTriangle
                        className={`w-3.5 h-3.5 ${
                          attempt.violations >= 5
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-amber-500 dark:text-amber-400'
                        }`}
                      />
                    )}

                    <span
                      className={`text-sm font-semibold ${
                        attempt.violations >= 5
                          ? 'text-red-600 dark:text-red-400'
                          : attempt.violations > 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {attempt.violations}
                    </span>

                  </div>

                </div>

                {/* Status */}
                <div className="lg:col-span-1">

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${status.badge}`}
                  >
                    <StatusIcon className="w-3 h-3" />

                    {attempt.status.replace('_', ' ')}
                  </span>

                </div>

                {/* Action */}
                <div className="lg:col-span-1">

                  <button
                    onClick={() => setViewModal(attempt)}
                    className="
                      flex items-center gap-1
                      px-3 py-1.5
                      bg-indigo-50 dark:bg-indigo-500
                      text-indigo-600 dark:text-[#F8FAFC]
                      rounded-lg text-xs font-medium
                      hover:bg-indigo-100 dark:hover:bg-indigo-600
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
          text-center py-16
          bg-white dark:bg-[#1E293B]
          rounded-xl
          border border-slate-200 dark:border-indigo-400/60
        ">

          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />

          <h3 className="text-lg font-medium text-slate-600 dark:text-[#CBD5E1]">
            No attempts found
          </h3>

          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1">
            No exam attempts match your search or filter
          </p>

        </div>
      )}

      {viewModal && (
      <ViewAttemptModal
        attempt={viewModal}
        onClose={() => setViewModal(null)}
      />
    )}

    </div>
  );
};

export default Attempts;
