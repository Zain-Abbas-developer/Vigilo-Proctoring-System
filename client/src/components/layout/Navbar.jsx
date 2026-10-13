import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Search,
  Bell,
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

const notifIcons = {
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
};

const notifColors = {
  warning: 'text-amber-500 bg-amber-500/10',
  error: 'text-red-500 bg-red-500/10',
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
};

const Navbar = ({
  notifications,
  searchQuery,
  setSearchQuery,
  title,
  removeNotification = () => {},
}) => {

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-indigo-400/60 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div>
          {title && (
            <h2
            className="text-xl font-bold text-slate-800 dark:text-[#F8FAFC]">
            {title}
          </h2>
          )}
          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search students, exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-[#1E293B] border border-transparent dark:border-indigo-400/60 dark:text-[#F8FAFC] rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#1E293B] focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-indigo-600 transition-colors dark:border-indigo-400/60 "
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-[#F8FAFC]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((notif) => {
                    const Icon = notifIcons[notif.type];
                    const colorClass = notifColors[notif.type];
                    return (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                          !notif.read ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${colorClass} shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        <button
                          onClick={() => removeNotification(notif.id)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
