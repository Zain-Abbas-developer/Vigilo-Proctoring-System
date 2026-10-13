import React, { useEffect, useState } from "react";
import {
  X,
  FileText,
  BookOpen,
  Users,
  Clock,
  CalendarDays,
  Save,
} from "lucide-react";
const EditExamModal = ({ exam, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    students: 0,
    questions: 0,
    duration: 60,
    startDate: "",
    endDate: "",
    status: "scheduled",
  });
  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || "",
        subject: exam.subject || "",
        description: exam.description || "",
        students: exam.students || 0,
        questions: exam.questions || 0,
        duration: exam.duration || 60,
        startDate: exam.startDate ? exam.startDate.slice(0, 16) : "",
        endDate: exam.endDate ? exam.endDate.slice(0, 16) : "",
        status: exam.status || "scheduled",
      });
    }
  }, [exam]);
  if (!exam) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExam = {
      ...exam,
      ...formData,
      students: Number(formData.students),
      questions: Number(formData.questions),
      duration: Number(formData.duration),
    };
    onSave(updatedExam);
  };
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100";
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
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
          <div className="flex min-w-0 items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              {" "}
              <FileText className="h-5 w-5 text-indigo-600" />{" "}
            </div>{" "}
            <div className="min-w-0">
              {" "}
              <h2 className="truncate text-lg font-bold text-slate-800">
                {" "}
                Edit Exam{" "}
              </h2>{" "}
              <p className="text-xs text-slate-400">
                {" "}
                Update exam information{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {" "}
            <X className="h-5 w-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="max-h-[calc(90vh-135px)] overflow-y-auto p-6">
            {" "}
            {/* Basic Information */}{" "}
            <div>
              {" "}
              <div className="mb-4 flex items-center gap-2">
                {" "}
                <BookOpen className="h-4 w-4 text-indigo-600" />{" "}
                <h3 className="text-sm font-bold text-slate-800">
                  {" "}
                  Basic Information{" "}
                </h3>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {" "}
                {/* Title */}{" "}
                <div className="sm:col-span-2">
                  {" "}
                  <label className={labelClass}> Exam Title </label>{" "}
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter exam title"
                    className={inputClass}
                    required
                  />{" "}
                </div>{" "}
                {/* Subject */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> Subject </label>{" "}
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className={inputClass}
                    required
                  />{" "}
                </div>{" "}
                {/* Status */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> Status </label>{" "}
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {" "}
                    <option value="scheduled"> Scheduled </option>{" "}
                    <option value="active"> Active </option>{" "}
                    <option value="completed"> Completed </option>{" "}
                  </select>{" "}
                </div>{" "}
                {/* Description */}{" "}
                <div className="sm:col-span-2">
                  {" "}
                  <label className={labelClass}> Description </label>{" "}
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter exam description"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Exam Settings */}{" "}
            <div className="mt-7">
              {" "}
              <div className="mb-4 flex items-center gap-2">
                {" "}
                <FileText className="h-4 w-4 text-indigo-600" />{" "}
                <h3 className="text-sm font-bold text-slate-800">
                  {" "}
                  Exam Settings{" "}
                </h3>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {" "}
                {/* Questions */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> Total Questions </label>{" "}
                  <div className="relative">
                    {" "}
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{" "}
                    <input
                      type="number"
                      name="questions"
                      min="1"
                      value={formData.questions}
                      onChange={handleChange}
                      className={`${inputClass} pl-9`}
                      required
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Students */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> Enrolled Students </label>{" "}
                  <div className="relative">
                    {" "}
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{" "}
                    <input
                      type="number"
                      name="students"
                      min="0"
                      value={formData.students}
                      onChange={handleChange}
                      className={`${inputClass} pl-9`}
                    />{" "}
                  </div>{" "}
                </div>{" "}
                {/* Duration */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}>
                    {" "}
                    Duration (Minutes){" "}
                  </label>{" "}
                  <div className="relative">
                    {" "}
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{" "}
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      className={`${inputClass} pl-9`}
                      required
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Schedule */}{" "}
            <div className="mt-7">
              {" "}
              <div className="mb-4 flex items-center gap-2">
                {" "}
                <CalendarDays className="h-4 w-4 text-indigo-600" />{" "}
                <h3 className="text-sm font-bold text-slate-800">
                  {" "}
                  Exam Schedule{" "}
                </h3>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {" "}
                {/* Start */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> Start Date & Time </label>{" "}
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />{" "}
                </div>{" "}
                {/* End */}{" "}
                <div>
                  {" "}
                  <label className={labelClass}> End Date & Time </label>{" "}
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Preview */}{" "}
            <div className="mt-7 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              {" "}
              <p className="text-xs font-semibold text-indigo-600">
                {" "}
                Exam Preview{" "}
              </p>{" "}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                {" "}
                <span>
                  {" "}
                  <strong>{formData.questions}</strong> Questions{" "}
                </span>{" "}
                <span>
                  {" "}
                  <strong>{formData.students}</strong> Students{" "}
                </span>{" "}
                <span>
                  {" "}
                  <strong>{formData.duration}</strong> Minutes{" "}
                </span>{" "}
                <span className="capitalize">
                  {" "}
                  Status: <strong>{formData.status}</strong>{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
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
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              {" "}
              <Save className="h-4 w-4" /> Save Changes{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
export default EditExamModal;
