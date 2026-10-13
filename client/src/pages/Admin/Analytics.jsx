import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  PieChart as PieIcon,
} from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e', '#f97316'];

const radarData = [
  { subject: 'Tab Switch', A: 34, fullMark: 40 },
  { subject: 'Face Missing', A: 18, fullMark: 40 },
  { subject: 'Multi Face', A: 8, fullMark: 40 },
  { subject: 'Phone', A: 5, fullMark: 40 },
  { subject: 'Copy Paste', A: 12, fullMark: 40 },
  { subject: 'Noise', A: 22, fullMark: 40 },
  { subject: 'Movement', A: 15, fullMark: 40 },
];

//mock data for students and exams
const students = [
  { id: 1, name: 'John Doe', violations: ['Tab Switch', 'Face Missing'], riskScore: 75 },
  { id: 2, name: 'Jane Smith', violations: ['Multi Face', 'Phone'], riskScore: 65 },
  { id: 3, name: 'Bob Johnson', violations: ['Copy Paste', 'Noise'], riskScore: 80 },
];
const exams = [
  { id: 1, name: 'Math Exam', status: 'completed' },
  { id: 2, name: 'Science Exam', status: 'completed' },
  { id: 3, name: 'History Exam', status: 'in-progress' },
];

//mock chart data
const chartData = {
  weeklyTrend: [
    { day: 'Mon', exams: 5, violations: 2 },
    { day: 'Tue', exams: 3, violations: 1 },
    { day: 'Wed', exams: 4, violations: 3 },
    { day: 'Thu', exams: 6, violations: 2 },
    { day: 'Fri', exams: 2, violations: 1 },
    {day: 'Sat', exams: 1, violations: 0},
    {day: 'Sun', exams: 0, violations: 0},
  ],
  violationsByType: [
    { type: 'Tab Switch', count: 34 },
    { type: 'Face Missing', count: 18 },
    { type: 'Multi Face', count: 8 },
    { type: 'Phone', count: 5 },
    { type: 'Copy Paste', count: 12 },
    { type: 'Noise', count: 22 },
  ],
  riskDistribution: [
    { range: '0-20', students: 5 },
    { range: '21-40', students: 10 },
    { range: '41-60', students: 15 },
    { range: '61-80', students: 8 },
    { range: '81-100', students: 2 },
  ],
};

const Analytics = () => {
  const completedExams = exams.filter((e) => e.status === 'completed');
  const totalViolations = students.reduce((acc, s) => acc + s.violations.length, 0);
  const avgViolationsPerStudent = (totalViolations / students.length).toFixed(1);
  const highRiskStudents = students.filter((s) => s.riskScore > 60).length;
  return (
    <div className="space-y-6">
      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm">Total Reports</p>
              <p className="text-3xl font-bold mt-1">{completedExams.length}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-indigo-200 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+2 this week</span>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Violations</p>
              <p className="text-3xl font-bold mt-1">{totalViolations}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-purple-200 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>{avgViolationsPerStudent} per student</span>
          </div>
        </div>

        <div className="bg-linear-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm">Students Analyzed</p>
              <p className="text-3xl font-bold mt-1">{students.length}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-cyan-200 text-xs">
            <span>{highRiskStudents} high risk</span>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm">Integrity Score</p>
              <p className="text-3xl font-bold mt-1">87%</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <PieIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-amber-200 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+3% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Weekly Trends</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#94A3B8]">Exams vs violations this week</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-indigo-500 rounded-lg text-xs font-medium text-slate-600 dark:text-[#F8FAFC] hover:bg-slate-200 hover:dark:bg-indigo-600 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="exams"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="violations"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Violation Types Pie */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Violation Distribution</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#94A3B8]">Breakdown by violation type</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData.violationsByType}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="count"
                nameKey="type"
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {(chartData.violationsByType || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Violation Radar</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#94A3B8]">Multi-dimensional violation analysis</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <Radar
                name="Violations"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Distribution Bar */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200/60 dark:border-indigo-400/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Risk Score Distribution</h3>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-[#94A3B8]">Students grouped by risk level</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Bar dataKey="students" radius={[8, 8, 0, 0]} barSize={40}>
                {(chartData.riskDistribution || []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Analytics
