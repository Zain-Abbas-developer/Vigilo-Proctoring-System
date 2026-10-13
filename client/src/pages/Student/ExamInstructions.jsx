import { useNavigate, useParams } from "react-router-dom";
import {examService} from '../../services/examService.js';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Maximize,
  Mic,
  Monitor,
  ShieldCheck,
  Smartphone,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";

const proctoringRules = [
  "Keep your face clearly visible to the camera.",
  "Stay alone in a quiet and well-lit environment.",
  "Do not switch browser tabs or windows.",
  "Do not use your mobile phone or other unauthorized devices.",
  "Do not communicate with another person during the exam.",
  "Avoid unnecessary movement away from your screen.",
  "Keep your camera and microphone enabled.",
];

const ExamInstructions = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalQuestions = exam?.questionCount ?? 0;
const totalAttempts = exam?.attemptsAllowed ?? 1;
  

  const currentExamId = examId || exam?._id;

  const handleContinue = () => {
    if(!currentExamId) return;
    navigate(`/student/exam/${currentExamId}/system-check`);
  };

  // we call api here
  useEffect(() => {
  let cancelled = false;

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await examService.list();
      const payload = response?.data ?? response;

      const examList = Array.isArray(payload)
        ? payload
        : payload?.items ??
          payload?.data?.items ??
          payload?.data?.data?.items ??
          (Array.isArray(payload?.data) ? payload.data : []);

      const selectedExam = examList.find(
        (item) =>
          String(item._id ?? item.id) === String(examId)
      );

      if (!selectedExam) {
        throw new Error(
          "Exam not found. Make sure it is assigned to your account."
        );
      }

      if (!cancelled) {
        setExam(selectedExam);
        setQuestionCount(
          selectedExam.questionCount ??
          selectedExam.questionsCount ??
          selectedExam.questions?.length ??
          0
        );
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load exam."
        );
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  if (!examId) {
    setError("Exam ID is missing from the URL.");
    setLoading(false);
    return;
  }

  fetchExam();

  return () => {
    cancelled = true;
  };
}, [examId]);

//here we call instruction components
  const instructions = exam ? [
  {
    icon: Clock3,
    title: "Time Limit",
    description: `You will have ${exam.duration} minutes to complete the exam. The timer starts as soon as the exam begins.`,
  },
  {
    icon: UserCheck,
    title: "Attempts",
    description: `You are allowed ${totalAttempts} attempt(s) at this exam.`,
  },
  {
    icon: FileQuestion,
    title: "Questions",
    description: `There are ${totalQuestions} questions. Make sure you review your answers before submitting the exam.`,
  },
  {
    icon: Maximize,
    title: "Fullscreen Mode",
    description:
      "The exam must be completed in fullscreen mode. Leaving fullscreen may be recorded as a violation.",
  },
  {
    icon: Camera,
    title: "Camera Monitoring",
    description:
      "Your camera must remain enabled throughout the examination for proctoring purposes.",
  },
  {
    icon: Mic,
    title: "Microphone Monitoring",
    description:
      "Your microphone may be monitored during the exam to detect suspicious sounds or activities.",
  },
  {
    icon: Smartphone,
    title: "No Mobile Devices",
    description:
      "Mobile phones and other unauthorized devices are not allowed during the examination.",
  },
] : [];


if (loading) {
  return <div className="p-8 text-center">Loading exam...</div>;
}

if (error || !exam) {
  return (
    <div className="p-8 text-center">
      <p className="text-red-500">
        {error || "Exam not found."}
      </p>
      <button
        onClick={() => navigate("/student/exam-list")}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Back to Exams
      </button>
    </div>
  );
}

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate("/student/exam-list")}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exams
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        {/* Header Banner */}
        <div className="bg-indigo-600 dark:bg-indigo-600 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-white/15 text-white rounded-full text-[10px] font-semibold">
                  {exam.subject}
                </span>

                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-100 rounded-full text-[10px] font-semibold">
                  Ready to Start
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {exam.title}
              </h1>

              <p className="text-sm text-indigo-100 mt-2 max-w-2xl leading-relaxed">
                {exam.description}
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Exam Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-800">

          {/* Questions */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <FileQuestion className="w-4 h-4" />
              <span className="text-xs">Questions</span>
            </div>

            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {totalQuestions}
            </p>
          </div>

          {/* Duration */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Clock3 className="w-4 h-4" />
              <span className="text-xs">Duration</span>
            </div>

            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {exam.duration} min
            </p>
          </div>

          {/* Total Marks */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">Total Marks</span>
            </div>

            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {exam.totalMarks}
            </p>
          </div>

          {/* Attempt */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs">Attempt</span>
            </div>

            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {exam.attemptNumber}/{exam.attemptsAllowed}
            </p>
          </div>

        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">

          <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Please read before continuing
            </h2>

            <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-1 leading-relaxed">
              This is a proctored examination. Your camera, microphone,
              screen activity and exam behavior may be monitored throughout
              the assessment.
            </p>
          </div>

        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Exam Instructions
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please understand the following requirements before starting.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

          {instructions.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-[#111C33] border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
              >
                <div className="p-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-lg shrink-0">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Proctoring Rules */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">

            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Proctoring Rules
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Violating these rules may affect your exam result.
              </p>
            </div>

          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {proctoringRules.map((rule, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Before You Start
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Make sure you have everything ready.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Camera */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#111C33] border border-slate-200 dark:border-slate-700/70 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-sm dark:hover:shadow-black/10 transition-all duration-300">

            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Camera
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Required
              </p>
            </div>

          </div>

          {/* Microphone */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#111C33] border border-slate-200 dark:border-slate-700/70 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-sm dark:hover:shadow-black/10 transition-all duration-300">

            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Microphone
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Required
              </p>
            </div>

          </div>

          {/* Browser */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#111C33] border border-slate-200 dark:border-slate-700/70 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-sm dark:hover:shadow-black/10 transition-all duration-300">

            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Monitor className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Stable Browser
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Required
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Agreement */}
      <div className="bg-slate-50 dark:bg-[#111C33] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <div className="mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Ready to continue?
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              By continuing, you acknowledge that you have read and
              understood the exam instructions and agree to follow the
              proctoring rules.
            </p>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-5">

          {/* Cancel */}
          <button
            onClick={() => navigate("/student/exam-list")}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {/* Continue */}
          <button
            onClick={handleContinue}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            I'm Ready
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};

export default ExamInstructions;