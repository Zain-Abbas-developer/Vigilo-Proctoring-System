import { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService.js';
import {
  FileText,
  Users,
  PlayCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle2,
} from 'lucide-react';


const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-500/50 dark:text-slate-400',
  flagged: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
};

const TeacherDashboard = () => {
  const [dashboard, setDashboard] = useState({
  stats: {
    totalExams: { value: 0, change: '', positive: true },
    totalStudents: { value: 0, change: '', positive: true },
    activeExams: { value: 0, change: '', positive: true },
    flagged: { value: 0, change: '', positive: false },
  },
  recentExams: [],
  recentAttempts: [],
});


  const [loading, setLoading]  = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await analyticsService.teacher();

      setDashboard({
        stats: data?.stats || {
          totalExams: { value: 0, change: '', positive: true },
          totalStudents: { value: 0, change: '', positive: true },
          activeExams: { value: 0, change: '', positive: true },
          flagged: { value: 0, change: '', positive: false },
        },
        recentExams: data?.recentExams || [],
        recentAttempts: data?.recentAttempts || [],
      });
    } catch (error) {
      console.error('Teacher dashboard error:', error);

      setError(
        error.response?.data?.message ||
          'Failed to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);


const stats = [
  {
    title: "Total Exams",
    value: dashboard.stats.totalExams?.value,
    change: dashboard.stats.totalExams.change,
    positive: dashboard.stats.totalExams.positive,
    icon: FileText,
    iconBg: "bg-indigo-50 dark:bg-indigo-900/60",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Total Students",
    value: dashboard.stats.totalStudents?.value,
    change: dashboard.stats.totalStudents?.change,
    positive: dashboard.stats.totalStudents?.positive,
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-500",
  },
  {
    title: "Active Exams",
    value: dashboard.stats.activeExams?.value,
    change: dashboard.stats.activeExams?.change,
    positive: dashboard.stats.activeExams?.positive,
    icon: PlayCircle,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Flagged Attempts",
    value: dashboard.stats.flagged?.value,
    change: dashboard.stats.flagged?.change,
    positive: dashboard.stats.flagged?.positive,
    icon: AlertTriangle,
    iconBg: "bg-red-50 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-500",
  },
];


  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC] mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4">
                {stat.positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}

                <span className="text-xs font-medium text-emerald-600">
                  {stat.change}
                </span>

                <span className="text-xs text-slate-400">
                  from last month
                </span>
              </div>
            </div>
          );
        })}

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Exams */}
        <div className="xl:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-indigo-400/60">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
                Recent Exams
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Your latest created exams
              </p>
            </div>

            <Link to="/teacher/exams" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500">
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-indigo-300">

            {dashboard.recentExams.map((exam) => (
              <Link to={"/teacher/exams/"} //+ exam.id
                key={exam._id}
                className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-indigo-900/50 transition-colors"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-600/50 rounded-xl">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC] truncate">
                      {exam.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 dark:text-slate-300">
                        {exam.subject}
                      </span>

                      <span className="text-xs text-slate-400">
                        •
                      </span>

                      <span className="text-xs text-slate-400 dark:text-slate-300 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {exam.students}
                      </span>

                      <span className="text-xs text-slate-400">
                        •
                      </span>

                      <span className="text-xs text-slate-400 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exam.duration}
                      </span>
                    </div>
                  </div>

                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[exam.status]}`}
                >
                  {exam.status}
                </span>

              </Link>
            ))}

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-5">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
            Quick Actions
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-300 mt-1">
            Frequently used teacher actions
          </p>

          <div className="space-y-3 mt-5">

            <Link to="/teacher/create-exam" className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-[#1E293B] hover:bg-indigo-100 dark:hover:bg-indigo-500/60 rounded-xl text-left transition-colors">
              <div className="p-2 bg-white dark:bg-indigo-600 rounded-lg">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                  Create New Exam
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-300">
                  Build a new examination
                </p>
              </div>
            </Link>

            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-[#1E293B] hover:bg-blue-100 dark:hover:bg-blue-600/50 rounded-xl text-left transition-colors">
              <div className="p-2 bg-white dark:bg-blue-600/80 rounded-lg">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-200" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                  Manage Students
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-300">
                  View enrolled students
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 dark:bg-[#1E293B] hover:bg-emerald-100 dark:hover:bg-emerald-600/50 rounded-xl text-left transition-colors">
              <div className="p-2 bg-white dark:bg-emerald-600/80 rounded-lg">
                <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-200" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                  Live Proctoring
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-300">
                  Monitor active exams
                </p>
              </div>
            </button>

          </div>
        </div>

      </div>

      {/* Recent Attempts */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 rounded-xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-indigo-400/60">

          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Recent Attempts
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-300 mt-1">
              Latest student examination activity
            </p>
          </div>

          <Link to='/teacher/attempts' className="text-xs font-medium text-indigo-600 dark:text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-600">
            View all
          </Link>

        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-indigo-900/50 border-b border-slate-200 dark:border-indigo-400/60 text-[10px] font-semibold text-slate-500 dark:text-slate-300 uppercase">
          <div className="col-span-3">Student</div>
          <div className="col-span-3">Exam</div>
          <div className="col-span-2">Score</div>
          <div className="col-span-2">Risk Score</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-indigo-400/60">

          {dashboard.recentAttempts.map((attempt) => (
            <Link to={"/teacher/attempts"}
              key={attempt.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-indigo-900/50 transition-colors"
            >

              <div className="md:col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-indigo-600">
                    {attempt.student.charAt(0)}
                  </span>
                </div>


                <span className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC]">
                  {attempt.student}
                </span>
              </div>

              <div className="md:col-span-3 text-sm text-slate-600 dark:text-[#F8FAFC]">
                {attempt.exam}
              </div>

              <div className="md:col-span-2">
                {attempt.score ? (
                  <span className="text-sm font-semibold text-slate-700 dark:text-[#F8FAFC]">
                    {attempt.score}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-300">
                    Pending
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <span
                  className={`text-sm font-semibold ${
                    attempt.risk >= 80
                      ? 'text-red-600'
                      : attempt.risk >= 50
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {attempt.risk}%
                </span>
              </div>

              <div className="md:col-span-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    attempt.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-200 text-emerald-700'
                      : attempt.status === 'flagged'
                      ? 'bg-red-100 dark:bg-red-200 text-red-700'
                      : 'bg-blue-100 dark:bg-blue-200 text-blue-700'
                  }`}
                >
                  {attempt.status === 'completed' && (
                    <CheckCircle2 className="w-3 h-3" />
                  )}

                  {attempt.status === 'flagged' && (
                    <AlertTriangle className="w-3 h-3" />
                  )}

                  {attempt.status}
                </span>
              </div>

            </Link>
          ))}

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
