import React from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  FileQuestion,
} from "lucide-react";

const DeleteQuestionModal = ({ question, onClose, onConfirm }) => {
  if (!question) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Delete Question
              </h2>

              <p className="text-xs text-slate-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Warning */}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Are you sure?
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Deleting this question will permanently remove it from the
                question collection.
              </p>
            </div>
          </div>

          {/* Question Info */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                <FileQuestion className="h-5 w-5 text-indigo-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-slate-800">
                  {question.question}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Question #{question.id}
                </p>
              </div>
            </div>

            {/* Question Details */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-400">
                  Subject
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                  {question.subject}
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-400">
                  Type
                </p>

                <p className="mt-1 text-sm font-semibold uppercase text-slate-700">
                  {question.type === "mcq"
                    ? "MCQ"
                    : "Short / Long"}
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-400">
                  Difficulty
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                  {question.difficulty}
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-400">
                  Marks
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {question.marks}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Once deleted, this question cannot be recovered.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(question)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuestionModal;
