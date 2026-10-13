import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileQuestion,
  CircleAlert,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { questionService } from "../../services/questionService.js";

import AddQuestion from "../../components/exam/AddQuestionModal.jsx";
import ViewQuestion from "../../components/teacher/ViewQuestionModal";
import EditQuestion from "../../components/teacher/EditQuestionModal";
import DeleteQuestion from "../../components/teacher/DeleteQuestionModal";

const QuestionBank = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [viewQuestion, setViewQuestion] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteQuestion, setDeleteQuestion] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);


  // =========================
  // Fetch Questions
  // =========================
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await questionService.listBank();

      const questionList = response?.questions || [];

      setQuestions(questionList);
    } catch (error) {
      console.error("Fetch question bank error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load question bank"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // =========================
  // Filter Questions
  // =========================
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const search = searchTerm.toLowerCase().trim();

      const questionText =
        question?.question?.toLowerCase() || "";

      const examTitle =
        question?.exam?.title?.toLowerCase() || "";

      const subject =
        question?.exam?.subject?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        questionText.includes(search) ||
        examTitle.includes(search) ||
        subject.includes(search);

      const matchesType =
        typeFilter === "all" ||
        question?.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [questions, searchTerm, typeFilter]);

  // =========================
  // Recently Added
  // =========================
  const recentlyAdded = useMemo(() => {
    return [...questions]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [questions]);

  // =========================
  // Statistics
  // =========================
  const stats = useMemo(() => {
    return {
      total: questions.length,

      mcq: questions.filter(
        (question) => question.type === "mcq"
      ).length,

      shortAnswer: questions.filter(
        (question) => question.type === "short_answer"
      ).length,

      longAnswer: questions.filter(
        (question) => question.type === "long_answer"
      ).length,
    };
  }, [questions]);


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

  // =========================
  // Delete Question
  // =========================
  const handleDeleteQuestion = async (question) => {
    try {
      await questionService.remove(question._id);

      setQuestions((prev) =>
        prev.filter((item) => item._id !== question._id)
      );

      setDeleteQuestion(null);

      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Delete question error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete question"
      );
    }
  };

  // =========================
  // Update Question
  // =========================
  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      const questionId =
        editQuestion?._id || updatedQuestion?._id;

      if (!questionId) {
        toast.error("Question ID is missing");
        return;
      }

      const payload = {
        type: updatedQuestion.type,
        question: updatedQuestion.question,
        options: updatedQuestion.options || [],
        correctAnswer:
          updatedQuestion.correctAnswer ?? null,
        marks: Number(updatedQuestion.marks) || 0,
        negativeMarks:
          Number(updatedQuestion.negativeMarks) || 0,
        explanation:
          updatedQuestion.explanation || "",
      };

      const response = await questionService.update(
        questionId,
        payload
      );

      const updated =
        response?.question ||
        response ||
        updatedQuestion;

      setQuestions((prev) =>
        prev.map((item) =>
          item._id === questionId
            ? {
                ...item,
                ...updated,
              }
            : item
        )
      );

      setEditQuestion(null);

      toast.success("Question updated successfully");
    } catch (error) {
      console.error("Update question error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update question"
      );
    }
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // Format Question Type
  // =========================
  const getQuestionType = (type) => {
    switch (type) {
      case "mcq":
        return "MCQ";

      case "short_answer":
        return "Short Answer";

      case "long_answer":
        return "Long Answer";

      default:
        return "Unknown";
    }
  };

  const getTypeClasses = (type) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-700";

      case "short_answer":
        return "bg-purple-100 text-purple-700";

      case "long_answer":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="flex items-center justify-center min-h-125">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />

            <p className="text-sm text-gray-500">
              Loading question bank...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-4 md:p-6">
      {/* =========================================
          Header
      ========================================= */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white">
                <FileQuestion size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Question Bank
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage and review questions used in your exams
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddQuestion()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            Add Questions
          </button>
        </div>
      </div>

      {/* =========================================
          Statistics
      ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Questions
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileQuestion
                size={20}
                className="text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* MCQ */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                MCQ Questions
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.mcq}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle2
                size={20}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Short Answer */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Short Answer
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.shortAnswer}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileQuestion
                size={20}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Long Answer */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Long Answer
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.longAnswer}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <FileQuestion
                size={20}
                className="text-orange-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          Recently Added
      ========================================= */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock
              size={19}
              className="text-gray-700"
            />

            <div>
              <h2 className="font-semibold text-gray-900">
                Recently Added
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Your latest questions
              </p>
            </div>
          </div>
        </div>

        {recentlyAdded.length === 0 ? (
          <div className="p-8 text-center">
            <FileQuestion
              size={32}
              className="mx-auto text-gray-300 mb-2"
            />

            <p className="text-sm text-gray-500">
              No questions have been added yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentlyAdded.map((question) => (
              <div
                key={question._id}
                className="p-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {question.question}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeClasses(
                          question.type
                        )}`}
                      >
                        {getQuestionType(question.type)}
                      </span>

                      <span className="text-xs text-gray-500">
                        {question.marks || 0} marks
                      </span>

                      {question.exam?.title && (
                        <>
                          <span className="text-gray-300">
                            •
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <BookOpen size={13} />
                            {question.exam.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setViewQuestion(question)
                      }
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                      title="View"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditQuestion(question)
                      }
                      className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteQuestion(question)
                      }
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================
          All Questions
      ========================================= */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {/* Section Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Questions
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Search and manage questions across your exams
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search questions..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />

                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                  className="appearance-none w-full sm:w-44 pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                >
                  <option value="all">
                    All Types
                  </option>

                  <option value="mcq">
                    MCQ
                  </option>

                  <option value="short_answer">
                    Short Answer
                  </option>

                  <option value="long_answer">
                    Long Answer
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredQuestions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {questions.length}
            </span>{" "}
            questions
          </p>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center">
            {questions.length === 0 ? (
              <>
                <FileQuestion
                  size={42}
                  className="mx-auto text-gray-300 mb-3"
                />

                <h3 className="text-base font-semibold text-gray-800">
                  No questions yet
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add questions from an exam to see them
                  here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/teacher/exams")
                  }
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                >
                  <Plus size={17} />
                  Go to Exams
                </button>
              </>
            ) : (
              <>
                <CircleAlert
                  size={40}
                  className="mx-auto text-gray-300 mb-3"
                />

                <h3 className="text-base font-semibold text-gray-800">
                  No matching questions
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try changing your search or filter.
                </p>
              </>
            )}
          </div>
        ) : (
          /* =========================================
             Desktop Table
          ========================================= */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Question
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Exam
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Marks
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Added
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredQuestions.map((question) => (
                  <tr
                    key={question._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                  >
                    {/* Question */}
                    <td className="px-5 py-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <FileQuestion
                            size={16}
                            className="text-gray-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {question.question}
                          </p>

                          {question.explanation && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                              Explanation available
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Exam */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {question.exam?.title ||
                            "Unknown Exam"}
                        </p>

                        {question.exam?.subject && (
                          <p className="text-xs text-gray-400 mt-1">
                            {question.exam.subject}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getTypeClasses(
                          question.type
                        )}`}
                      >
                        {getQuestionType(question.type)}
                      </span>
                    </td>

                    {/* Marks */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {question.marks || 0}
                        </p>

                        {Number(question.negativeMarks) >
                          0 && (
                          <p className="text-xs text-red-500 mt-1">
                            -{question.negativeMarks}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Added */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {formatDate(
                          question.createdAt
                        )}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setViewQuestion(question)
                          }
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                          title="View Question"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditQuestion(question)
                          }
                          className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Question"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteQuestion(question)
                          }
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Question"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================
          View Question Modal
      ========================================= */}
      {viewQuestion && (
        <ViewQuestion
          question={viewQuestion}
          onClose={() => setViewQuestion(null)}
        />
      )}

      {/* =======================================
            Add Question Modal
      ========================================= */}
      <AddQuestion
        isOpen={showAddModal}
        onClose={() =>
          setShowAddModal(false)
        }
        onAdd={handleAddQuestion}
      />

      {/* =========================================
          Edit Question Modal
      ========================================= */}
      {editQuestion && (
        <EditQuestion
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onUpdate={handleUpdateQuestion}
        />
      )}

      {/* =========================================
          Delete Question Modal
      ========================================= */}
      {deleteQuestion && (
        <DeleteQuestion
          question={deleteQuestion}
          onClose={() => setDeleteQuestion(null)}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  );
};

export default QuestionBank;
