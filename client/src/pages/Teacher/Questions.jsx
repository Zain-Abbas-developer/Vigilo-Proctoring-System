
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { examService } from "../../services/examService.js";

import AddQuestion from "../../components/exam/AddQuestionModal";
import ViewQuestion from "../../components/teacher/ViewQuestionModal";
import EditQuestion from "../../components/teacher/EditQuestionModal";
import DeleteQuestion from "../../components/teacher/DeleteQuestionModal";

import {
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileQuestion,
  CircleAlert,
} from "lucide-react";

const typeStyles = {
  mcq: "bg-indigo-500 border-indigo-300/70 text-white/90 dark:bg-indigo-900/30 dark:text-indigo-400 border dark:border-indigo-400/20",

  short_answer:
    "bg-violet-700 border-violet-300/70 text-white/90 dark:bg-violet-900/30 dark:text-violet-400 border dark:border-violet-400/20",

  long_answer:
    "bg-violet-700 border-violet-300/70 text-white/90 dark:bg-violet-900/30 dark:text-violet-400 border dark:border-violet-400/20",
};

const Questions = () => {
  const { examId } = useParams();
  console.log("Exam Id: ", examId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // ================= FETCH QUESTIONS =================

  useEffect(() => {
    if (!examId) {
      setError("Exam ID is missing.");
      setLoading(false);
      return;
    }

    fetchQuestions();
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await examService.listQuestions(examId);

      console.log("Questions API Response:", response);

      const questionList = response?.questions || [];

      setQuestions(questionList);
    } catch (error) {
      console.error("Fetch questions error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================

  const filteredQuestions = questions.filter((question) => {
    const questionText = question?.question || "";

    const matchesSearch = questionText
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || question.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // ================= COUNTS =================

  const counts = {
    total: questions.length,

    mcq: questions.filter(
      (q) => q.type === "mcq"
    ).length,

    shortAnswer: questions.filter(
      (q) => q.type === "short_answer"
    ).length,

    longAnswer: questions.filter(
      (q) => q.type === "long_answer"
    ).length,
  };

  // ================= ADD QUESTION =================

  const handleAddQuestion = async (newQuestion) => {
    try {
      const payload = {
        question: newQuestion.question,

        type: newQuestion.type || "mcq",

        marks: Number(newQuestion.marks) || 1,

        negativeMarks:
          Number(newQuestion.negativeMarks) || 0,

        explanation:
          newQuestion.explanation || "",
      };

      // MCQ options
      if (payload.type === "mcq") {
        payload.options = (newQuestion.options || []).map(
          (option) => {
            if (typeof option === "string") {
              return { text: option };
            }

            return option;
          }
        );

        payload.correctAnswer =
          typeof newQuestion.correctAnswer === "number"
            ? newQuestion.correctAnswer
            : 0;
      } else {
        payload.options = [];
        payload.correctAnswer = null;
      }

      console.log("Create Question Payload:", payload);

      const response = await examService.addQuestion(
        examId,
        payload
      );

      console.log("Created Question Response:", response);

      const createdQuestion =
        response?.question || response;

      setQuestions((prev) => [
        ...prev,
        createdQuestion,
      ]);

      setShowAddModal(false);
    } catch (error) {
      console.error("Create question error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create question."
      );
    }
  };

  // ================= VIEW QUESTION =================

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };

  // ================= EDIT QUESTION =================

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  // ================= UPDATE QUESTION =================

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      const questionId =
        updatedQuestion._id || updatedQuestion.id;

      const payload = {
        question: updatedQuestion.question,

        type:
          updatedQuestion.type || "mcq",

        marks:
          Number(updatedQuestion.marks) || 1,

        negativeMarks:
          Number(updatedQuestion.negativeMarks) || 0,

        explanation:
          updatedQuestion.explanation || "",
      };

      if (payload.type === "mcq") {
        payload.options = (
          updatedQuestion.options || []
        ).map((option) => {
          if (typeof option === "string") {
            return { text: option };
          }

          return option;
        });

        payload.correctAnswer =
          typeof updatedQuestion.correctAnswer === "number"
            ? updatedQuestion.correctAnswer
            : 0;
      } else {
        payload.options = [];
        payload.correctAnswer = null;
      }

      console.log("Update Question Payload:", payload);

      const response = await examService.updateQuestion(
        questionId,
        payload
      );

      console.log("Updated Question Response:", response);

      const updated =
        response?.question || response;

      setQuestions((prev) =>
        prev.map((question) =>
          question._id === questionId
            ? updated
            : question
        )
      );

      setShowEditModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Update question error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to update question."
      );
    }
  };

  // ================= DELETE QUESTION =================

  const handleDeleteQuestion = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteQuestion = async (question) => {
    try {
      const questionId =
        question._id || question.id;

      await examService.deleteQuestion(questionId);

      setQuestions((prev) =>
        prev.filter(
          (item) => item._id !== questionId
        )
      );

      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Delete question error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete question."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading questions...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="text-center py-16">
        <CircleAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />

        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
          Failed to load questions
        </h3>

        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchQuestions}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/40 rounded-xl p-4 transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Questions
          </p>

          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {counts.total}
          </p>
        </div>

        {/* MCQ */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/40 rounded-xl p-4 transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            MCQs
          </p>

          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {counts.mcq}
          </p>
        </div>

        {/* Short */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/40 rounded-xl p-4 transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Short Answer
          </p>

          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1">
            {counts.shortAnswer}
          </p>
        </div>

        {/* Long */}

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-indigo-400/40 rounded-xl p-4 transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Long Answer
          </p>

          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1">
            {counts.longAnswer}
          </p>
        </div>

      </div>

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-[#F8FAFC]">
            Questions
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage questions for this examination
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>

      </div>

      {/* ================= SEARCH & FILTERS ================= */}

      <div className="flex flex-col lg:flex-row gap-3">

        {/* Search */}

        <div className="relative flex-1 max-w-lg">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="
              w-full pl-10 pr-4 py-2.5
              bg-white dark:bg-[#1E293B]
              border border-slate-200 dark:border-indigo-400/40
              rounded-xl
              text-sm
              text-slate-700 dark:text-[#F8FAFC]
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-500/20
              transition-colors
            "
          />

        </div>

        {/* Type */}

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="
            px-4 py-2.5
            bg-white dark:bg-[#1E293B]
            border border-slate-200 dark:border-indigo-400/40
            rounded-xl
            text-sm
            text-slate-600 dark:text-slate-300
            focus:outline-none
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-500/20
            transition-colors
          "
        >
          <option value="all">
            All Types
          </option>

          <option value="mcq">
            MCQs
          </option>

          <option value="short_answer">
            Short Answer
          </option>

          <option value="long_answer">
            Long Answer
          </option>
        </select>

        {/* Filter */}

        <div
          className="
            flex items-center gap-1
            bg-white dark:bg-[#1E293B]
            border border-slate-200 dark:border-indigo-400/40
            rounded-xl p-1
          "
        >
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-2" />

          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`
              px-3 py-1.5 rounded-lg
              text-xs font-medium
              transition-colors
              ${
                typeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }
            `}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("mcq")}
            className={`
              px-3 py-1.5 rounded-lg
              text-xs font-medium
              transition-colors
              ${
                typeFilter === "mcq"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }
            `}
          >
            MCQ
          </button>
        </div>

      </div>

      {/* ================= QUESTIONS LIST ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/40
          rounded-xl overflow-hidden
          transition-colors
        "
      >

        {/* Table Header */}

        <div
          className="
            hidden lg:grid
            grid-cols-12 gap-4
            px-5 py-3
            bg-slate-50 dark:bg-[#111C2E]
            border-b border-slate-200 dark:border-indigo-400/30
            text-[10px]
            font-semibold
            text-slate-500 dark:text-slate-400
            uppercase
          "
        >
          <div className="col-span-7">
            Question
          </div>

          <div className="col-span-2">
            Type
          </div>

          <div className="col-span-1">
            Marks
          </div>

          <div className="col-span-2">
            Actions
          </div>
        </div>

        {/* Questions */}

        <div className="divide-y divide-slate-100 dark:divide-indigo-400/10">

          {filteredQuestions.map((question, index) => (

            <div
              key={question._id || index}
              className="
                grid grid-cols-1 lg:grid-cols-12
                gap-4
                px-5 py-4
                items-center
                hover:bg-slate-50 dark:hover:bg-[#111C2E]
                transition-colors
              "
            >

              {/* Question */}

              <div className="lg:col-span-7 flex items-start gap-3">

                <div
                  className="
                    p-2.5
                    bg-indigo-50 dark:bg-indigo-600/15
                    rounded-xl
                    shrink-0
                  "
                >
                  <FileQuestion className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div>

                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {question.question}
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Question #{index + 1}
                  </p>

                </div>

              </div>

              {/* Type */}

              <div className="lg:col-span-2">

                <span
                  className={`
                    inline-flex
                    px-2 py-1
                    rounded-full
                    text-[10px]
                    font-semibold
                    uppercase
                    ${
                      typeStyles[question.type] ||
                      typeStyles.mcq
                    }
                  `}
                >
                  {question.type === "mcq"
                    ? "MCQ"
                    : question.type === "short_answer"
                    ? "Short Answer"
                    : "Long Answer"}
                </span>

              </div>

              {/* Marks */}

              <div className="lg:col-span-1">

                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {question.marks}
                </span>

              </div>

              {/* Actions */}

              <div className="lg:col-span-2 flex items-center gap-1">

                {/* View */}

                <button
                  type="button"
                  onClick={() =>
                    handleViewQuestion(question)
                  }
                  className="
                    p-2 rounded-lg
                    text-slate-400 dark:text-slate-500
                    hover:bg-indigo-50 dark:hover:bg-indigo-600/15
                    hover:text-indigo-600 dark:hover:text-indigo-400
                    transition-colors
                  "
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Edit */}

                <button
                  type="button"
                  onClick={() =>
                    handleEditQuestion(question)
                  }
                  className="
                    p-2 rounded-lg
                    text-slate-400 dark:text-slate-500
                    hover:bg-blue-50 dark:hover:bg-blue-600/15
                    hover:text-blue-600 dark:hover:text-blue-400
                    transition-colors
                  "
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteQuestion(question)
                  }
                  className="
                    p-2 rounded-lg
                    text-slate-400 dark:text-slate-500
                    hover:bg-red-50 dark:hover:bg-red-600/15
                    hover:text-red-600 dark:hover:text-red-400
                    transition-colors
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= EMPTY STATE ================= */}

      {filteredQuestions.length === 0 && (

        <div
          className="
            text-center
            py-16
            bg-white dark:bg-[#0F172A]
            rounded-xl
            border border-slate-200 dark:border-indigo-400/40
          "
        >

          <CircleAlert
            className="
              w-12 h-12
              text-slate-300 dark:text-slate-600
              mx-auto mb-3
            "
          />

          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">
            No questions found
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try changing your search or filters
          </p>

        </div>

      )}

      {/* ================= VIEW MODAL ================= */}

      <ViewQuestion
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
      />

      {/* ================= ADD MODAL ================= */}

      <AddQuestion
        isOpen={showAddModal}
        onClose={() =>
          setShowAddModal(false)
        }
        onAdd={handleAddQuestion}
      />

      {/* ================= EDIT MODAL ================= */}

      <EditQuestion
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onUpdate={handleUpdateQuestion}
      />

      {/* ================= DELETE MODAL ================= */}

      <DeleteQuestion
        isOpen={showDeleteModal}
        question={questionToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setQuestionToDelete(null);
        }}
        onConfirm={handleConfirmDeleteQuestion}
      />

    </div>
  );
};

export default Questions;
