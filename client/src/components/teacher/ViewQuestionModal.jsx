import { X, CheckCircle2, BookOpen, Award, FileQuestion } from "lucide-react";

const ViewQuestionModal = ({ isOpen, onClose, question }) => {
  if (!isOpen || !question) return null;

  const isMCQ = question.type === "mcq";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              View Question
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Question details and answer
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          {/* Question */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FileQuestion className="h-4 w-4 text-indigo-600" />

              <span className="text-sm font-medium text-gray-700">
                Question
              </span>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-base font-medium leading-7 text-gray-900">
                {question.question}
              </p>
            </div>
          </div>

          {/* Question Information */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

            {/* Subject */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Subject
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {question.subject}
              </p>
            </div>

            {/* Type */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <FileQuestion className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Type
                </span>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  isMCQ
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {isMCQ ? "MCQ" : "Written"}
              </span>
            </div>

            {/* Difficulty */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-gray-500">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">
                  Difficulty
                </span>
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  question.difficulty === "easy"
                    ? "bg-green-100 text-green-700"
                    : question.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {question.difficulty}
              </span>
            </div>

            {/* Marks */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-2 text-xs font-medium text-gray-500">
                Marks
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {question.marks}
              </p>
            </div>
          </div>

          {/* MCQ Options */}
          {isMCQ && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Answer Options
              </h3>

              <div className="space-y-3">
                {question.options?.map((option, index) => {
                  const isCorrect =
                    option === question.correctAnswer;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        isCorrect
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                            isCorrect
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>

                        <span className="text-sm text-gray-800">
                          {option}
                        </span>
                      </div>

                      {isCorrect && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />

                          <span className="text-xs font-medium">
                            Correct
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Correct Answer */}
          {isMCQ && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Correct Answer
              </h3>

              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span className="text-sm font-medium text-green-800">
                  {question.correctAnswer}
                </span>
              </div>
            </div>
          )}

          {/* Written Answer */}
          {!isMCQ && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Expected Answer / Guidelines
              </h3>

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-purple-900">
                  {question.expectedAnswer ||
                    question.answer ||
                    "No expected answer provided."}
                </p>
              </div>
            </div>
          )}

          {/* Usage */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Used in Exams
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Number of exams using this question
                </p>
              </div>

              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm">
                {question.usedIn ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewQuestionModal;