import { createContext, useContext, useState } from "react";
import api from "../services/api.js";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all exams
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/exams");

      console.log("Exams API Response:", response.data);

      const data = response.data?.data;

      // Handle different possible backend response structures
      const examList =
        data?.exams ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setExams(examList);

      return examList;
    } catch (error) {
      console.error("Fetch exams error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to fetch exams.";

      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        loading,
        error,
        fetchExams,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error("useExam must be used inside ExamProvider");
  }

  return context;
};

export default ExamContext;