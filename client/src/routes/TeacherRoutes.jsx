import { Routes, Route } from "react-router-dom";
import TeacherLayout from "../Layout/TeacherLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import Dashboard from "../pages/Teacher/Dashboard";
import Exams from "../pages/Teacher/Exams";
import CreateExam from "../pages/Teacher/CreateExam";
import QuestionBank from "../pages/Teacher/QuestionBank";
import Question from "../pages/Teacher/Questions";
import Attempts from "../pages/Teacher/Attempts";
import Reports from "../pages/Teacher/Reports";
import Settings from "../pages/Settings/Setting";

const TeacherRoutes = (
  <Route path="/teacher" element={
    <ProtectedRoute role={["teacher"]}>
      <TeacherLayout/>
    </ProtectedRoute>
  }>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="exams" element={<Exams />} />
    <Route path="create-exam" element={<CreateExam />} />
    <Route path="exams/:examId/questions" element={<Question />} />
    <Route path="question-bank" element={<QuestionBank />} />
    <Route path="attempts" element={<Attempts />} />
    <Route path="reports" element={<Reports />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);

export default TeacherRoutes;
