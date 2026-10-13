import { useEffect, useState } from 'react';
import { violationService } from '../../services/violationService.js';
import ViolationReviewModal from '../../components/admin/ReviewModal';
import {
  AlertTriangle,
  Eye,
  Camera,
  Monitor,
  Smartphone,
  Volume2,
  Copy,
  Move,
  Users as UsersIcon,
  Filter,
  Search,
} from 'lucide-react';

const violationIcons = {
  face_not_detected: Camera,
  multiple_faces: UsersIcon,
  tab_switch: Monitor,
  phone_detected: Smartphone,
  noise_detected: Volume2,
  screen_share: Monitor,
  copy_paste: Copy,
  suspicious_movement: Move,
};

const severityColors = {
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 ',
    text: 'text-blue-700 dark:text-[#F8FAFC]',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700',
    text: 'text-amber-700 dark:text-[#F8FAFC]',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-700 border-orange-200 dark:border-orange-700',
    text: 'text-orange-700 dark:text-[#F8FAFC]',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
  },
  critical: {
    bg: 'bg-red-50 dark:bg-red-700 border-red-200 dark:border-red-700',
    text: 'text-red-700 dark:text-[#F8FAFC]',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
};

const Violations = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [violations, setViolations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const fetchViolations = async () => {
    try {
      const data = await violationService.list();

      console.log("Violation List: ", data);

      const normalizedViolations = data.map((violation) => ({
        id: violation._id || violation.id,
        severity: String(violation.severity || "low").toLowerCase(),
        type: violation.type || violation.violationType || "unknown",
        description:
          violation.description || "Violation detected",
        timestamp:
          violation.timestamp ||
          violation.createdAt ||
          new Date().toISOString(),
        studentName:
          violation.studentName ||
          violation.student?.name ||
          violation.user?.name ||
          "Unknown Student",
        studentAvatar:
          violation.studentAvatar ||
          violation.student?.avatar ||
          violation.user?.avatar ||
          null,
        studentId:
          violation.studentId ||
          violation.student?._id ||
          violation.user?._id,
        studentRisk: Number(
          violation.studentRisk ||
          violation.student?.riskScore ||
          violation.riskScore ||
          0
        ),
      }));

      setViolations(normalizedViolations);
    } catch (requestError) {
      console.error("Fetch violations error:", requestError);
      setError("Unable to load violations");
    } finally {
      setLoading(false);
    }
  };

  fetchViolations();
}, []);

const allViolations = violations
  .filter(
    (violation) =>
      severityFilter === "all" ||
      violation.severity === severityFilter
  )
  .filter((violation) => {
    const search = searchTerm.toLowerCase();

    return (
      violation.studentName.toLowerCase().includes(search) ||
      violation.description.toLowerCase().includes(search) ||
      violation.type.toLowerCase().includes(search)
    );
  })
  .sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

    const severityCounts = {
    low: allViolations.filter((v) => v.severity === 'low').length,
    medium: allViolations.filter((v) => v.severity === 'medium').length,
    high: allViolations.filter((v) => v.severity === 'high').length,
    critical: allViolations.filter((v) => v.severity === 'critical').length,
  };

  return (
    <div className='space-y-6'>
      {/* Severity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['low', 'medium', 'high', 'critical'].map((sev) => {
          const colors = severityColors[sev];
          return (
            <button
              key={sev}
              onClick={() => setSeverityFilter(severityFilter === sev ? 'all' : sev)}
              className={`p-4 rounded-xl border transition-all ${
                severityFilter === sev ? `${colors.bg} border-2` : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-indigo-400/60 hover:border-slate-300 hover:dark:border-indigo-400/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-[#F8FAFC] capitalize">{sev}</span>
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {severityCounts[sev]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#F8FAFC]" />
          <input
            type="text"
            placeholder="Search violations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E293B] dark:text-[#F8FAFC] border border-slate-200 dark:border-indigo-400/60 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-indigo-400/60 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 dark:text-[#F8FAFC] ml-2" />
            {['all', 'low', 'medium', 'high', 'critical'].map((f) => (
              <button
                key={f}
                onClick={() => setSeverityFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  severityFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#364058]'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>
      </div>

      {/* Violations List */}
      <div className="space-y-3">
        {allViolations.map((v) => {
          const Icon = violationIcons[v.type] || AlertTriangle;
          const colors = severityColors[v.severity];
          return (
            <div
              key={v.id}
              className={`bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-indigo-400/60 p-4 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">{v.description}</h4>
                      <p className="text-xs text-slate-500 dark:text-[#F8FAFC] mt-0.5">
                        Type: <span className="font-medium">{(v.type || '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                      {v.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={v.studentAvatar}
                          alt={v.studentName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-slate-600 dark:text-[whitesmoke]">{v.studentName}</span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-[#F8FAFC]">
                        Risk: <span className="font-semibold">{v.studentRisk}%</span>
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-[#F8FAFC]">
                        {new Date(v.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                     onClick={() => setSelectedViolation(v)}
                     className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500 text-indigo-600 dark:text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-indigo-100 hover:dark:bg-indigo-600 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allViolations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-600">No violations found</h3>
          <p className="text-sm text-slate-500 mt-1">All clear! No violations match your criteria</p>
        </div>
      )}

      {/* Review Modal */}
      {selectedViolation && (
        <ViolationReviewModal
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
        />
      )}
    </div>
  );
}
export default Violations
