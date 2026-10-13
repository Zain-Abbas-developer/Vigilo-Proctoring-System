import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
// =========protected route========= //
import ProtectedRoute from "../guards/ProtectedRoute";
import Dashboard from "../pages/Admin/Dashboard";
import Exams from "../pages/Admin/Exams";
import LiveMonitor from "../components/proctoring/LiveMonitor";
import Students from "../pages/Admin/Users";
import Violations from "../pages/Admin/Violations";
import Attempts from "../pages/Admin/Attempts";
import Analytics from "../pages/Admin/Analytics";
import Settings from "../pages/Settings/Setting";

//use protected routes in future
const AdminRoutes = (
  <Route path="/admin" element={<ProtectedRoute role={["admin"]}><AdminLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="exams" element={<Exams />} />
    <Route path="exams/:examId/live-monitor" element={<LiveMonitor />} />
    <Route path="students" element={<Students />} />
    <Route path="violations" element={<Violations />} />
    <Route path="attempts" element={<Attempts />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);

export default AdminRoutes;
