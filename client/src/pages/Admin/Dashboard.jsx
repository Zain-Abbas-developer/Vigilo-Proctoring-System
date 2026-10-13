import { useEffect, useState } from "react";
import { analyticsService } from '../../services/analyticsService.js';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import {
  BookOpen,
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";


//real case
const COLORS = ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'];

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true; // To prevent state updates on unmounted component

    analyticsService.admin()
    .then((data) => {
      if (active) setAnalytics(data);
    })
    .catch(() => {
      if (active) setError("Unable to load Dashboard analytics");
    })
    .finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false; // Cleanup function to set active to false when component unmounts
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const dashboardStats = {
    totalExams: analytics?.totalExams ?? 0,
    activeExams: analytics?.activeExams ?? 0,
    totalStudents: analytics?.totalStudents ?? 0,
    flaggedStudents: analytics?.flaggedStudents ?? 0,
    violationsToday: analytics?.violationsToday ?? 0,
    avgRiskScore: analytics?.avgRiskScore ?? 0,
    liveExams: analytics?.liveExams ?? [],
    recentViolations: analytics?.recentViolations ?? [],
  };

  const chartData = {
    violationsByHour: analytics?.violationsByHour ?? [],
    violationsByType: analytics?.violationsByType ?? [],
    riskDistribution: analytics?.riskDistribution ?? [],
    weeklyTrend: analytics?.weeklyTrend ?? [],
  };

  const statCards = [
  {
    label: "Total Exams",
    value: dashboardStats.totalExams,
    icon: BookOpen,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    change: "+3",
    trend: "up",
  },
  {
    label: "Active Exams",
    value: dashboardStats.activeExams,
    icon: Activity,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    change: "+1",
    trend: "up",
  },
  {
    label: "Total Students",
    value: dashboardStats.totalStudents,
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    change: "+28",
    trend: "up",
  },
  {
    label: "Flagged Students",
    value: dashboardStats.flaggedStudents,
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    change: "-2",
    trend: "down",
  },
  {
    label: "Violations Today",
    value: dashboardStats.violationsToday,
    icon: Shield,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    change: "+12",
    trend: "up",
  },
  {
    label: "Avg Risk Score",
    value: `${dashboardStats.avgRiskScore}%`,
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    change: "-5%",
    trend: "down",
  },
];


  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-indigo-400/60 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-indigo-300 dark:hover:shadow-sm transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-[#F8FAFC]">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 dark:text-[#F8FAFC]">{stat.label}</p>
            </div>
          );
        })}
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violations Timeline */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Violations Timeline</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#F8FAFC]">Real-time violation tracking</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData.violationsByHour}>
              <defs>
                <linearGradient id="violationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="violations"
                stroke="#6366f1"
                fill="url(#violationGradient)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Violations by Type */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Violations by Type</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#F8FAFC]">Breakdown of violation categories</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.violationsByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} stroke="#94a3b8" width={110} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                {chartData.violationsByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartData.violationsByType[index].fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">Risk Distribution</h3>
          <p className="text-sm text-slate-500 dark:text-[#F8FAFC] mb-4">Student risk score breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData.riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="students"
                nameKey="range"
                paddingAngle={3}
              >
                {chartData.riskDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => <span className="text-slate-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Live Exams */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Live Exams</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#F8FAFC]">{dashboardStats.liveExams?.length} exams in progress</p>
            </div>
            <button
              onClick={() => setCurrentView('live-monitor')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 dark:text-indigo-500 dark:hover:text-indigo-500/70 transition-all duration-100"
            >
              <Eye className="w-3.5 h-3.5" />
              Monitor
            </button>
          </div>
          <div className="space-y-3">
            {dashboardStats.liveExams.map((exam) => (
              <div
                key={exam.id}
                className="p-3.5 bg-linear-to-r from-indigo-50 to-purple-50 dark:bg-linear-to-r dark:from-purple-500/60 dark:to-indigo-500 rounded-xl border border-indigo-100 dark:border-indigo-400/60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-800 dark:text-[#F8FAFC]">{exam.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 dark:text-[#F8FAFC]">{exam.subject}</p>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#F8FAFC]">
                    <Users className="w-3.5 h-3.5" />
                    {exam.studentsEnrolled} students
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#F8FAFC]">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.duration} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Violations */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Recent Violations</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#F8FAFC]">Latest detected issues</p>
            </div>
            <button
              onClick={() => setCurrentView('violations')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 dark:text-indigo-500 dark:hover:text-indigo-500/70 transition-all duration-100"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardStats.recentViolations.map((v) => {
              const severityColors = {
                low: 'bg-blue-100 text-blue-700',
                medium: 'bg-amber-100 text-amber-700',
                high: 'bg-orange-100 text-orange-700',
                critical: 'bg-red-100 text-red-700',
              };
              return (
                <div key={v.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#31415c] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC] truncate">{v.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5 dark:text-[#F8FAFC]">{v.studentName}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${severityColors[v.severity]}`}>
                    {v.severity.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
