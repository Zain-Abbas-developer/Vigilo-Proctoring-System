import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from '../routes/AdminRoutes';
import TeacherRoute from '../routes/TeacherRoutes';
import StudentRoute from '../routes/StudentRoutes';
import ProtectedRoute from "../guards/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={[]}>
            <AdminRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute roles={[]}>
            <TeacherRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentRoute />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;