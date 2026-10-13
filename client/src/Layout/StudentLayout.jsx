import { useState } from "react"
import Navbar from '../components/layout/Navbar'
import Sidebar from "../components/layout/Sidebar"
import { Outlet, useLocation } from "react-router-dom"

const routeTitles = {
  '/student/dashboard': 'Student Dashboard',
  '/student/exam-list': 'Available Exams',
  '/student/exam': 'Exam',
  '/student/prev-result': 'Result',
  '/student/setting': 'Settings',
}


const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Vigilo';

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

export default StudentLayout
