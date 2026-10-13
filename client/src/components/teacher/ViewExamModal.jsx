import React from "react";
import {
  X,
  FileText,
  Users,
  Clock,
  CalendarDays,
  BookOpen,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
const ViewExamModal = ({ exam, onClose }) => {
  if (!exam) return null;
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {" "}
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          {" "}
          <div className="flex items-center gap-3 min-w-0">
            {" "}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              {" "}
              <FileText className="h-5 w-5 text-indigo-600" />{" "}
            </div>{" "}
            <div className="min-w-0">
              {" "}
              <h2 className="text-lg font-bold text-slate-800 truncate">
                {" "}
                Exam Details{" "}
              </h2>{" "}
              <p className="text-xs text-slate-400">
                {" "}
                View complete exam information{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            {" "}
            <X className="h-5 w-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="max-h-[calc(90vh-135px)] overflow-y-auto p-6">
          {" "}
          {/* Exam Hero */}{" "}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            {" "}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {" "}
              <div className="min-w-0">
                {" "}
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {" "}
                  {exam.subject}{" "}
                </p>{" "}
                <h1 className="mt-1 text-2xl font-bold text-slate-800 wrap-break-word">
                  {" "}
                  {exam.title}{" "}
                </h1>{" "}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {" "}
                  {exam.description || "No description available."}{" "}
                </p>{" "}
              </div>{" "}
              <span
                className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${statusStyles[exam.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {" "}
                <span className="h-1.5 w-1.5 rounded-full bg-current" />{" "}
                {exam.status}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Stats */}{" "}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {" "}
            <div className="rounded-xl border border-slate-200 p-4">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <ClipboardList className="h-4 w-4 text-indigo-500" />{" "}
                <span className="text-xs text-slate-400"> Questions </span>{" "}
              </div>{" "}
              <p className="mt-2 text-xl font-bold text-slate-800">
                {" "}
                {exam.questions}{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-xl border border-slate-200 p-4">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <Users className="h-4 w-4 text-blue-500" />{" "}
                <span className="text-xs text-slate-400"> Students </span>{" "}
              </div>{" "}
              <p className="mt-2 text-xl font-bold text-slate-800">
                {" "}
                {exam.students}{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-xl border border-slate-200 p-4">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <Clock className="h-4 w-4 text-amber-500" />{" "}
                <span className="text-xs text-slate-400"> Duration </span>{" "}
              </div>{" "}
              <p className="mt-2 text-xl font-bold text-slate-800">
                {" "}
                {exam.duration}{" "}
                <span className="ml-1 text-xs font-medium text-slate-400">
                  {" "}
                  min{" "}
                </span>{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-xl border border-slate-200 p-4">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <BookOpen className="h-4 w-4 text-emerald-500" />{" "}
                <span className="text-xs text-slate-400"> Subject </span>{" "}
              </div>{" "}
              <p className="mt-2 truncate text-sm font-bold text-slate-800">
                {" "}
                {exam.subject}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Schedule */}{" "}
          <div className="mt-6">
            {" "}
            <div className="mb-3 flex items-center gap-2">
              {" "}
              <CalendarDays className="h-4 w-4 text-indigo-600" />{" "}
              <h3 className="text-sm font-bold text-slate-800">
                {" "}
                Exam Schedule{" "}
              </h3>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {" "}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                {" "}
                <p className="text-xs text-slate-400">
                  {" "}
                  Start Date & Time{" "}
                </p>{" "}
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {" "}
                  {formatDate(exam.startDate)}{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                {" "}
                <p className="text-xs text-slate-400"> End Date & Time </p>{" "}
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {" "}
                  {formatDate(exam.endDate)}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Exam Information */}{" "}
          <div className="mt-6">
            {" "}
            <h3 className="mb-3 text-sm font-bold text-slate-800">
              {" "}
              Exam Information{" "}
            </h3>{" "}
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {" "}
              <div className="flex items-center justify-between px-4 py-3">
                {" "}
                <span className="text-sm text-slate-500"> Exam ID </span>{" "}
                <span className="text-sm font-semibold text-slate-700">
                  {" "}
                  #{exam.id}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center justify-between px-4 py-3">
                {" "}
                <span className="text-sm text-slate-500"> Subject </span>{" "}
                <span className="text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.subject}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center justify-between px-4 py-3">
                {" "}
                <span className="text-sm text-slate-500">
                  {" "}
                  Total Questions{" "}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.questions}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center justify-between px-4 py-3">
                {" "}
                <span className="text-sm text-slate-500">
                  {" "}
                  Enrolled Students{" "}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.students}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex items-center justify-between px-4 py-3">
                {" "}
                <span className="text-sm text-slate-500"> Duration </span>{" "}
                <span className="text-sm font-semibold text-slate-700">
                  {" "}
                  {exam.duration} minutes{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Ready Status */}{" "}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            {" "}
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{" "}
            <div>
              {" "}
              <p className="text-sm font-semibold text-emerald-800">
                {" "}
                Exam is {exam.status}{" "}
              </p>{" "}
              <p className="mt-0.5 text-xs leading-5 text-emerald-700">
                {" "}
                This exam is currently marked as{" "}
                <span className="font-semibold"> {exam.status} </span> in the
                examination system.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-2">
          {" "}
          <button
            onClick={onClose}
            className="rounded-xl border border-indigo-400 bg-indigo-400 text-white px-4 py-2.5 text-sm font-medium hover:bg-indigo-500 hover:border-indigo-500 transition-colors"
          >
            {" "}
            Close{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ViewExamModal;
