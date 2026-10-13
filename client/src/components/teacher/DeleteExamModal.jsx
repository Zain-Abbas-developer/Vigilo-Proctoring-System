import React from "react";
import { X, Trash2, AlertTriangle, FileText } from "lucide-react";
const DeleteExamModal = ({ exam, onClose, onConfirm }) => {
  if (!exam) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {" "}
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              {" "}
              <Trash2 className="h-5 w-5 text-red-600" />{" "}
            </div>{" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-slate-800">
                {" "}
                Delete Exam{" "}
              </h2>{" "}
              <p className="text-xs text-slate-400">
                {" "}
                This action cannot be undone{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {" "}
            <X className="h-5 w-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="p-6">
          {" "}
          {/* Warning */}{" "}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            {" "}
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />{" "}
            <div>
              {" "}
              <p className="text-sm font-semibold text-amber-800">
                {" "}
                Are you sure?{" "}
              </p>{" "}
              <p className="mt-1 text-xs leading-5 text-amber-700">
                {" "}
                Deleting this exam will permanently remove it from the
                examination system.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Exam Info */}{" "}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                {" "}
                <FileText className="h-5 w-5 text-indigo-600" />{" "}
              </div>{" "}
              <div className="min-w-0">
                {" "}
                <p className="truncate text-sm font-semibold text-slate-800">
                  {" "}
                  {exam.title}{" "}
                </p>{" "}
                <p className="mt-0.5 text-xs text-slate-400">
                  {" "}
                  {exam.subject}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {" "}
              <div className="rounded-lg bg-white p-3">
                {" "}
                <p className="text-[11px] text-slate-400"> Questions </p>{" "}
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.questions}{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-lg bg-white p-3">
                {" "}
                <p className="text-[11px] text-slate-400"> Students </p>{" "}
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.students}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <p className="mt-4 text-center text-xs text-slate-400">
            {" "}
            Once deleted, this exam cannot be recovered.{" "}
          </p>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          {" "}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            type="button"
            onClick={() => onConfirm(exam)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {" "}
            <Trash2 className="h-4 w-4" /> Delete Exam{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default DeleteExamModal;
