import profileDemi from "../../assets/profileDemi.png";
import { NavLink, useNavigate } from "react-router-dom";
import shieldCheck from '../../../public/shield-check.svg';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Megaphone,
  ClipboardPenLine,
  MessageCircleQuestion,
  Repeat,
  ChartPieIcon,
  NotebookText,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from "../../constant/roles";

const menuItems = {
  [ROLES.ADMIN]: [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/exams",
      label: "Exams",
      icon: BookOpen,
    },
    {
      path: "/admin/students",
      label: "Students",
      icon: Users,
    },
    {
      path: "/admin/violations",
      label: "Violations",
      icon: AlertTriangle,
    },
    {
      path: "/admin/attempts",
      label: "Attempts",
      icon: Megaphone,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ],

  [ROLES.TEACHER]: [
    {
      path: "/teacher/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/teacher/exams",
      label: "Exams",
      icon: BookOpen,
    },
    {
      path: "/teacher/create-exam",
      label: "Create Exam",
      icon: ClipboardPenLine,
    },
    {
      path: "/teacher/question-bank", //here we make changing for work
      label: "Questions",
      icon: MessageCircleQuestion,
    },
    {
      path: "/teacher/attempts",
      label: "Attempts",
      icon: Repeat,
    },
    {
      path: "/teacher/reports",
      label: "Reports",
      icon: ChartPieIcon,
    },
    {
      path: "/teacher/settings",
      label: "Settings",
      icon: Settings,
    },
  ],

  [ROLES.STUDENT]: [
    { path: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard,},
    {
      path: "/student/exam-list",
      label: "Exams",
      icon: ClipboardCheck,
    },
    {
      path: "/student/exam",
      label: "Exam",
      icon: NotebookText,
    },
    {
      path: "/student/prev-result",
      label: "Result",
      icon: GraduationCap,
    },
    {
      path: "/student/setting",
      label: "Settings",
      icon: Settings,
    }
  ],
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || ROLES.STUDENT;
  const items = menuItems[role] || [];

  //handle logout
  const handleLogout = () => {
    logout();
    // Optionally, you can redirect the user to the login page after logout
    // For example, using react-router's useNavigate:
    navigate('/login');
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-40 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* ================= LOGO ================= */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/50">
        {/* <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div> */}
        <img src={shieldCheck} alt="" className="w-10 h-10 rounded-xl"/>

        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Vigilo
            </h1>

            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Exam System
            </p>
          </div>
        )}
      </div>

      {/* ================= TOGGLE ================= */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>

      {/* ================= MENU ================= */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center ${
                  sidebarOpen ? "gap-3" : "justify-center"
                } px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 shadow-lg shadow-indigo-500/10"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />

                  {/* Label */}
                  {sidebarOpen && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ================= USER PROFILE ================= */}
      <div className="border-t border-slate-700/50 p-3">
        <div
          className={`flex items-center ${
            sidebarOpen ? "gap-3" : "justify-center"
          } px-2 py-2`}
        >
          <img
            src={user?.avatar || profileDemi}
            alt={user?.name || "User"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
          />

          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {user?.role}
              </p>
            </div>
          )}

          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
