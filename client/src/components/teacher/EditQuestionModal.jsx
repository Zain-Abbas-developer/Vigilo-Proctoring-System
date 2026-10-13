import { useEffect, useState } from "react";
import {
  X,
  FileQuestion,
  BookOpen,
  Award,
  SlidersHorizontal,
  Save,
} from "lucide-react";

const EditQuestionModal = ({ isOpen, onClose, question, onUpdate }) => {
  const [formData, setFormData] = useState({
    question: "",
    subject: "",
    type: "mcq",
    difficulty: "easy",
    marks: 1,
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || "",
        subject: question.subject || "",
        type: question.type || "mcq",
        difficulty: question.difficulty || "easy",
        marks: question.marks || 1,
      });
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "marks" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.question.trim()) return;
    if (!formData.subject.trim()) return;
    if (!formData.marks || formData.marks <= 0) return;

    const updatedQuestion = {
      ...question,
      ...formData,
    };

    onUpdate(updatedQuestion);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-indigo-400/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-600/15">
              <FileQuestion className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-[#F8FAFC]">
                Edit Question
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                Update question information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(90vh-145px)] overflow-y-auto p-6">
            {/* Question */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Question
                </h3>
              </div>

              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows={4}
                placeholder="Enter your question..."
                className="
                  w-full rounded-xl border border-slate-200
                  bg-white px-4 py-3 text-sm text-slate-700
                  placeholder:text-slate-400
                  focus:border-indigo-400 focus:outline-none
                  focus:ring-2 focus:ring-indigo-500/20
                  dark:border-indigo-400/30
                  dark:bg-[#1E293B]
                  dark:text-slate-100
                  dark:placeholder:text-slate-500
                "
              />
            </div>

            {/* Basic Information */}
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Question Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics"
                    className="
                      w-full rounded-xl border border-slate-200
                      bg-white px-4 py-2.5 text-sm text-slate-700
                      placeholder:text-slate-400
                      focus:border-indigo-400 focus:outline-none
                      focus:ring-2 focus:ring-indigo-500/20
                      dark:border-indigo-400/30
                      dark:bg-[#1E293B]
                      dark:text-slate-100
                    "
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Question Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200
                      bg-white px-4 py-2.5 text-sm text-slate-700
                      focus:border-indigo-400 focus:outline-none
                      focus:ring-2 focus:ring-indigo-500/20
                      dark:border-indigo-400/30
                      dark:bg-[#1E293B]
                      dark:text-slate-100
                    "
                  >
                    <option value="mcq">MCQ</option>
                    <option value="written">Short / Long</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Question Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Difficulty */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200
                      bg-white px-4 py-2.5 text-sm text-slate-700
                      focus:border-indigo-400 focus:outline-none
                      focus:ring-2 focus:ring-indigo-500/20
                      dark:border-indigo-400/30
                      dark:bg-[#1E293B]
                      dark:text-slate-100
                    "
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Marks */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Award className="h-3.5 w-3.5" />
                    Marks
                  </label>

                  <input
                    type="number"
                    name="marks"
                    min="1"
                    value={formData.marks}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200
                      bg-white px-4 py-2.5 text-sm text-slate-700
                      focus:border-indigo-400 focus:outline-none
                      focus:ring-2 focus:ring-indigo-500/20
                      dark:border-indigo-400/30
                      dark:bg-[#1E293B]
                      dark:text-slate-100
                    "
                  />
                </div>
              </div>
            </div>

            {/* Current Question Info */}
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-400/20 dark:bg-indigo-600/10">
              <div className="flex items-start gap-3">
                <FileQuestion className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />

                <div>
                  <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                    Editing Question #{question.id}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-indigo-600 dark:text-indigo-400">
                    Update the fields above and save your changes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-indigo-400/20 dark:bg-[#111C2E]">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl border border-slate-300
                bg-white px-4 py-2.5 text-sm font-medium
                text-slate-600 hover:bg-slate-100
                transition-colors
                dark:border-slate-600
                dark:bg-[#1E293B]
                dark:text-slate-300
                dark:hover:bg-slate-700
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                inline-flex items-center gap-2
                rounded-xl border border-indigo-500
                bg-indigo-500 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-indigo-600 hover:border-indigo-600
                transition-colors
              "
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
