import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"
import { Outlet, useLocation } from "react-router-dom"

const routeTitles = {
  '/admin/dashboard': "Admin Dashboard",
  '/admin/exams': 'Exams',
  '/admin/students': 'Students',
  '/admin/violations': 'Violations',
  '/admin/attempts': 'Attempts',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
}


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Dashboard';
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
        <Navbar title={title}/>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
