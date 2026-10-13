import {useState} from "react";
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import {Outlet, useLocation} from "react-router-dom";

const routeTitles = {
  "/teacher/dashboard": "Teacher Dashboard",
  "/teacher/exams": "Exams",
  "/teacher/create-exam": "Create Exam",
  "/teacher/exams/:examId/questions": "Add Questions",
  "/teacher/question-bank": "Question Bank",
  "/teacher/attempts": "Attempts",
  "/teacher/reports": "Analytics & Reports",
  "/teacher/settings": "Settings"
};


// =========== AI Help function ====================
function compile(pattern) {
  const keys = [];
  const source = pattern
    .replace(/\/+$/, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return "([^/]+)";
    });
  return { regex: new RegExp(`^${source}/?$`), keys };
}

const compiledRoutes = Object.entries(routeTitles)
  .map(([pattern, title]) => ({ pattern, title, ...compile(pattern) }))
  // zyada specific routes pehle (jaise /exams/new se pehle /exams/:examId)
  .sort((a, b) => b.keys.length - a.keys.length);

function resolveTitle(pathname) {
  for (const { title, regex, keys } of compiledRoutes) {
    const match = pathname.match(regex);
    if (!match) continue;

    const params = Object.fromEntries(
      keys.map((k, i) => [k, decodeURIComponent(match[i + 1])])
    );

    return typeof title === "function" ? title(params) : title;
  }
  return "Dashboard"; // fallback
}

const TeacherLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const title = resolveTitle(location.pathname);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen} 
      />
      <div
        className={`transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Navbar title={title} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default TeacherLayout
