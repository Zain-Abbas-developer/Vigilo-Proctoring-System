import { Routes, Route } from "react-router-dom";
import StudentLayout from "../Layout/StudentLayout";
import ProtectedRoute from "../guards/ProtectedRoute";

import StudentDashboard from "../pages/Student/Dashboard";
// actual-exam-page
import StudentExam from "../pages/Student/Exam";
//available-exams-list
import ExamList from "../pages/Student/Exams";
//in exam student result
import StudentResult from "../pages/Student/Result";
//while checking previous exam result
import PrevResult from '../pages/Student/CheckPrevResult';
import StudentSetting from "../pages/Student/StdSetting";

// ===========Exam redirect page============//
import ExamRedirect from "../components/student/examRedirect";

//========== System Requirements ===========//
import Instructions from "../pages/Student/ExamInstructions";
import SystemCheck from "../pages/Student/SystemCheck";
import FaceVerification from "../pages/Student/FaceVerification";

const StudentRoutes = (
      <Route path="/student" element={
        <ProtectedRoute role={["student"]}>
          <StudentLayout/>
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />

        {/* Exam Redirect */}
        <Route path="exam" element={<ExamRedirect />} />

        {/* Available Exams */}
        <Route path="exam-list" element={<ExamList />} />

        {/* Actual Exam */}
        <Route path="exam/:examId">
          
          {/* Actual Exam */}
          <Route index element={<StudentExam />} />

          {/* Exam Preparation Flow */}
          <Route path="instructions" element={<Instructions />} />

          <Route path="system-check" element={<SystemCheck />} />

          <Route
            path="face-verification"
            element={<FaceVerification />}
          />

          {/* Exam page */}
          <Route path="start" element={<StudentExam />} />

          {/* Individual Exam Result */}
          <Route path="result" element={<StudentResult />} />
        </Route>

        {/* Past Results */}
        <Route path="prev-result" element={<PrevResult />} />

        {/* Settings */}
        <Route path="setting" element={<StudentSetting />} />

      </Route>
);

export default StudentRoutes;
