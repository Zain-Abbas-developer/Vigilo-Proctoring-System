import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { examService } from "../../services/examService.js";
import { toast } from "react-hot-toast";
import {
  FileText,
  CalendarDays,
  Clock,
  ShieldCheck,
  Camera,
  Smartphone,
  Monitor,
  Volume2,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

const PROCTORING_OPTIONS = [
  {
    key: "faceDetection",
    title: "Face Detection",
    description: "Verify student identity",
    icon: Camera,
  },
  {
    key: "multipleFaces",
    title: "Multiple Face Detection",
    description: "Detect additional faces",
    icon: Users,
  },
  {
    key: "tabSwitch",
    title: "Tab Switch Detection",
    description: "Monitor browser tab changes",
    icon: Monitor,
  },
  {
    key: "phoneDetection",
    title: "Phone Detection",
    description: "Detect mobile phones",
    icon: Smartphone,
  },
  {
    key: "noiseDetection",
    title: "Noise Detection",
    description: "Monitor surrounding noise",
    icon: Volume2,
  },
  {
    key: "screenMonitoring",
    title: "Screen Monitoring",
    description: "Record student screen",
    icon: Monitor,
  },
  {
    key: "copyPaste",
    title: "Copy/Paste Blocking",
    description: "Prevent copying exam content",
    icon: ShieldCheck,
  },
  {
    key: "suspiciousMovement",
    title: "Suspicious Movement",
    description: "Detect unusual movements",
    icon: ShieldCheck,
  },
];

const CreateExam = () => {
  const navigate = useNavigate();
  const [proctoring, setProctoring] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: 60,
    totalMarks: 100,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    instructions: "",
  });

  // ================= QUESTIONS =================

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      type: "mcq",
      marks: 5,
      options: ["", "", "", ""],
      correctAnswer: "",
      answer: "",
    },
  ]);

  const [showQuestionType, setShowQuestionType] = useState(false);

  // ================= SETTINGS =================

  const [settings, setSettings] = useState({
    faceDetection: true,
    multipleFaces: true,
    tabSwitch: true,
    phoneDetection: true,
    noiseDetection: true,
    screenMonitoring: true,
    copyPaste: true,
    suspiciousMovement: true,
  });

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SETTINGS =================

  const handleSettingChange = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ================= ADD QUESTION =================

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      type,
      marks: 5,
      options: type === "mcq" ? ["", "", "", ""] : [],
      correctAnswer: "",
      answer: "",
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setShowQuestionType(false);
  };

  // ================= REMOVE QUESTION =================

  const removeQuestion = (id) => {
    if (questions.length === 1) return;

    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  // ================= UPDATE QUESTION =================

  const updateQuestion = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );
  };

  // ================= UPDATE OPTION =================

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;

        const options = [...question.options];
        options[optionIndex] = value;

        return {
          ...question,
          options,
        };
      }),
    );
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();

    if (loading) return;

    // ================= VALIDATION =================

    if (!formData.title.trim()) {
      toast.error("Please enter exam title.");
      return;
    }

    if (!formData.subject) {
      toast.error("Please select a subject.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      toast.error("Duration must be greater than 0.");
      return;
    }

    if (
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime
    ) {
      toast.error("Please select exam start and end date/time.");
      return;
    }

    // Convert local date + time into Date objects.
    const startTime = new Date(`${formData.startDate}T${formData.startTime}`);

    const endTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      toast.error("Invalid exam date or time.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    // ================= QUESTION VALIDATION =================

    if (questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        toast.error("Please enter all questions.");
        return;
      }

      if (
        !Number.isFinite(Number(question.marks)) ||
        Number(question.marks) <= 0
      ) {
        toast.error("Question marks must be greater than 0.");
        return;
      }

      if (question.type === "mcq") {
        const hasEmptyOption = question.options.some(
          (option) => !option.trim(),
        );

        if (hasEmptyOption) {
          toast.error("Please fill all MCQ options.");
          return;
        }

        if (!question.correctAnswer) {
          toast.error("Please select the correct answer for every MCQ.");
          return;
        }
      }
    }

    const calculatedTotalMarks = questions.reduce(
      (total, question) => total + Number(question.marks),
      0,
    );

    try {
      setLoading(true);

      // ================= PROCTORING MAPPING =================

      const proctoring = {
        // issue is the proctoring state while iam using in handlesubmit state
        webcamRequired: settings.faceDetection,
        faceVerification: settings.faceDetection,
        multipleFaces: settings.multipleFaces,
        tabSwitchDetection: settings.tabSwitch,
        phoneDetection: settings.phoneDetection,
        noiseDetection: settings.noiseDetection,
        fullscreenRequired: true,
        copyPasteBlocked: settings.copyPaste,
        suspiciousMovement: settings.suspiciousMovement,
        recordScreen: settings.screenMonitoring,
        maxViolations: 5,
      };

      // ================= CREATE EXAM =================

      const examPayload = {
        title: formData.title.trim(),
        subject: formData.subject,
        description: formData.description.trim(),

        duration: Number(formData.duration),
        totalMarks: calculatedTotalMarks,

        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),

        instructions: formData.instructions.trim(),

        status: saveAsDraft ? "draft" : "scheduled",

        settings: {
          shuffleQuestions: false,
          shuffleOptions: false,
          negativeMarking: false,
          negativeMarkValue: 0,
          showResultImmediately: true,
          allowReview: true,
        },

        proctoring,
      };

      // const examResponse = await api.post("/exams", examPayload);

      // const examId = examResponse.data?.exam?._id;

      const examResponse = await examService.create(examPayload);
      navigate(`/teacher/exams/${examResponse._id}/questions`);

      console.log("Respomse: ", examResponse);

      const examId = examResponse?._id;

      console.log("examId: ", examId);
      console.log("Created exam data: ", examResponse);

      if (!examId) {
        throw new Error(
          "Exam was created, but the server did not return its ID.",
        );
      }

      // ================= CREATE QUESTIONS =================

      // const questionPayload = {
      //   examId,

      //   questions: questions.map((question, index) => ({
      //     type: question.type,
      //     question: question.question.trim(),
      //     marks: Number(question.marks),
      //     order: index + 1,

      //     ...(question.type === "mcq"
      //       ? {
      //           options: question.options.map((option) => option.trim()),
      //           correctAnswer: question.correctAnswer,
      //         }
      //       : {
      //           answer: question.answer.trim(),
      //         }),
      //   })),
      // };

      // await api.post("/questions/bulk", questionPayload);

      const questionPayload = questions.map((question, index) => ({
        type: question.type,
        question: question.question.trim(),
        marks: Number(question.marks),
        order: index + 1,
        ...(question.type === "mcq"
          ? {
              options: question.options.map((option) => option.trim()),
              correctAnswer: question.correctAnswer,
            }
          : {
              answer: question.answer.trim(),
            }),
      }));

      await examService.bulkQuestions(examId, questionPayload);

      // ================= SUCCESS =================

      toast.success(
        saveAsDraft ? "Exam saved as draft!" : "Exam created successfully!",
      );

      navigate("/teacher/exams");
    } catch (error) {
      console.error("Create exam error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create exam.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-3">
        <Link
          to="/teacher/exams"
          className="
             flex gap-2 items-center p-2 rounded-lg
            text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-[#1E293B]
            hover:text-indigo-600 dark:hover:text-indigo-400
            transition-colors
          "
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </Link>
      </div>

      {/* ================= BASIC INFORMATION ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/60
          rounded-xl p-5
        "
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              p-2.5 rounded-xl
              bg-indigo-50 dark:bg-indigo-600/20
              border border-transparent dark:border-indigo-400/20
            "
          >
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Basic Information
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Provide the basic details of your exam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exam Title */}

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Exam Title
            </label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mathematics Final Exam"
              required
              className="
                w-full px-3.5 py-2.5
                bg-white dark:bg-[#1E293B]
                border border-slate-200 dark:border-indigo-400/40
                rounded-xl text-sm
                text-slate-700 dark:text-[#F8FAFC]
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none
                focus:border-indigo-400
                focus:ring-2 focus:ring-indigo-500/20
              "
            />
          </div>

          {/* Subject */}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Subject
            </label>

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="
                w-full px-3.5 py-2.5
                bg-white dark:bg-[#1E293B]
                border border-slate-200 dark:border-indigo-400/40
                rounded-xl text-sm
                text-slate-700 dark:text-[#F8FAFC]
                focus:outline-none
                focus:border-indigo-400
                focus:ring-2 focus:ring-indigo-500/20
              "
            >
              <option value="">Select subject</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="computer-science">Computer Science</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Duration */}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Duration
            </label>

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />

              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className="
                  w-full pl-10 pr-16 py-2.5
                  bg-white dark:bg-[#1E293B]
                  border border-slate-200 dark:border-indigo-400/40
                  rounded-xl text-sm
                  text-slate-700 dark:text-[#F8FAFC]
                  focus:outline-none
                  focus:border-indigo-400
                  focus:ring-2 focus:ring-indigo-500/20
                "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
                minutes
              </span>
            </div>
          </div>

          {/* Total Marks */}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Total Marks
            </label>

            <input
              type="number"
              name="totalMarks"
              min="1"
              value={formData.totalMarks}
              onChange={handleChange}
              className="
                w-full px-3.5 py-2.5
                bg-white dark:bg-[#1E293B]
                border border-slate-200 dark:border-indigo-400/40
                rounded-xl text-sm
                text-slate-700 dark:text-[#F8FAFC]
                focus:outline-none
                focus:border-indigo-400
                focus:ring-2 focus:ring-indigo-500/20
              "
            />
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the purpose and scope of this exam..."
              className="
                w-full px-3.5 py-2.5
                bg-white dark:bg-[#1E293B]
                border border-slate-200 dark:border-indigo-400/40
                rounded-xl text-sm
                text-slate-700 dark:text-[#F8FAFC]
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                resize-none
                focus:outline-none
                focus:border-indigo-400
                focus:ring-2 focus:ring-indigo-500/20
              "
            />
          </div>
        </div>
      </div>

      {/* ================= SCHEDULE ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/60
          rounded-xl p-5
        "
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              p-2.5 rounded-xl
              bg-blue-50 dark:bg-blue-600/20
              border border-transparent dark:border-blue-400/20
            "
          >
            <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Exam Schedule
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Set when students can take the exam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["startDate", "Start Date", "date"],
            ["startTime", "Start Time", "time"],
            ["endDate", "End Date", "date"],
            ["endTime", "End Time", "time"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                {label}
              </label>

              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="
                  w-full px-3.5 py-2.5
                  bg-white dark:bg-[#1E293B]
                  border border-slate-200 dark:border-indigo-400/40
                  rounded-xl text-sm
                  text-slate-700 dark:text-[#F8FAFC]
                  focus:outline-none
                  focus:border-indigo-400
                  focus:ring-2 focus:ring-indigo-500/20
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= QUESTIONS ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/60
          rounded-xl p-5
        "
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Questions
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add questions for your examination
            </p>
          </div>

          {/* ADD QUESTION */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuestionType(!showQuestionType)}
              className="
                inline-flex items-center gap-2
                px-3 py-2
                bg-indigo-50 dark:bg-indigo-600/20
                text-indigo-600 dark:text-indigo-400
                border border-transparent dark:border-indigo-400/20
                rounded-lg
                text-xs font-medium
                hover:bg-indigo-100 dark:hover:bg-indigo-500/30
                transition-colors
              "
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>

            {/* QUESTION TYPE MENU */}

            {showQuestionType && (
              <div
                className="
                  absolute right-0 top-11 z-30 w-64
                  bg-white dark:bg-[#1E293B]
                  border border-slate-200 dark:border-indigo-400/50
                  rounded-xl shadow-xl
                  p-2
                "
              >
                {/* MCQ */}

                <button
                  type="button"
                  onClick={() => addQuestion("mcq")}
                  className="
                    w-full text-left px-3 py-3
                    rounded-lg
                    hover:bg-indigo-50 dark:hover:bg-indigo-500/20
                    transition-colors
                  "
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    MCQs
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Multiple choice question with options
                  </p>
                </button>

                {/* WRITTEN */}

                <button
                  type="button"
                  onClick={() => addQuestion("written")}
                  className="
                    w-full text-left px-3 py-3
                    rounded-lg
                    hover:bg-indigo-50 dark:hover:bg-indigo-500/20
                    transition-colors
                  "
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Short / Long Question
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Question that requires a written answer
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QUESTIONS LIST */}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="
                border border-slate-200 dark:border-indigo-400/40
                bg-slate-50/50 dark:bg-[#111C2E]
                rounded-xl p-4
              "
            >
              {/* QUESTION HEADER */}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Question {index + 1}
                  </span>

                  <span
                    className="
                      px-2 py-1
                      bg-slate-100 dark:bg-slate-800
                      text-slate-500 dark:text-slate-400
                      rounded-md
                      text-[10px] font-medium
                    "
                  >
                    {question.type === "mcq" ? "MCQ" : "Short / Long"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="
                    p-1.5
                    text-slate-400 dark:text-slate-500
                    hover:text-red-500 dark:hover:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-500/10
                    rounded-lg
                    transition-colors
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* QUESTION + MARKS */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Question
                  </label>

                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, "question", e.target.value)
                    }
                    rows="2"
                    placeholder="Enter your question..."
                    className="
                      w-full px-3.5 py-2.5
                      bg-white dark:bg-[#1E293B]
                      border border-slate-200 dark:border-indigo-400/40
                      rounded-xl text-sm
                      text-slate-700 dark:text-[#F8FAFC]
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      resize-none
                      focus:outline-none
                      focus:border-indigo-400
                      focus:ring-2 focus:ring-indigo-500/20
                    "
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={question.marks}
                    onChange={(e) =>
                      updateQuestion(question.id, "marks", e.target.value)
                    }
                    className="
                      w-full px-3.5 py-2.5
                      bg-white dark:bg-[#1E293B]
                      border border-slate-200 dark:border-indigo-400/40
                      rounded-xl text-sm
                      text-slate-700 dark:text-[#F8FAFC]
                      focus:outline-none
                      focus:border-indigo-400
                      focus:ring-2 focus:ring-indigo-500/20
                    "
                  />
                </div>
              </div>

              {/* ================= MCQ ================= */}

              {question.type === "mcq" && (
                <>
                  {/* OPTIONS */}

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
                      Answer Options
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="
                                w-7 h-7 shrink-0
                                flex items-center justify-center
                                bg-slate-100 dark:bg-slate-800
                                rounded-lg
                                text-xs font-semibold
                                text-slate-500 dark:text-slate-400
                              "
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>

                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                optionIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + optionIndex,
                            )}`}
                            className="
                                flex-1 px-3.5 py-2.5
                                bg-white dark:bg-[#1E293B]
                                border border-slate-200 dark:border-indigo-400/40
                                rounded-xl text-sm
                                text-slate-700 dark:text-[#F8FAFC]
                                placeholder:text-slate-400 dark:placeholder:text-slate-500
                                focus:outline-none
                                focus:border-indigo-400
                                focus:ring-2 focus:ring-indigo-500/20
                              "
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CORRECT ANSWER */}

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      Correct Answer
                    </label>

                    <select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          e.target.value,
                        )
                      }
                      className="
                        w-full md:w-1/2
                        px-3.5 py-2.5
                        bg-white dark:bg-[#1E293B]
                        border border-slate-200 dark:border-indigo-400/40
                        rounded-xl text-sm
                        text-slate-700 dark:text-[#F8FAFC]
                        focus:outline-none
                        focus:border-indigo-400
                        focus:ring-2 focus:ring-indigo-500/20
                      "
                    >
                      <option value="">Select correct answer</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </>
              )}

              {/* ================= WRITTEN ================= */}

              {question.type === "written" && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Expected Answer / Answer Guidelines
                  </label>

                  <textarea
                    value={question.answer}
                    onChange={(e) =>
                      updateQuestion(question.id, "answer", e.target.value)
                    }
                    rows="4"
                    placeholder="Enter expected answer or answer guidelines..."
                    className="
                      w-full px-3.5 py-2.5
                      bg-white dark:bg-[#1E293B]
                      border border-slate-200 dark:border-indigo-400/40
                      rounded-xl text-sm
                      text-slate-700 dark:text-[#F8FAFC]
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      resize-none
                      focus:outline-none
                      focus:border-indigo-400
                      focus:ring-2 focus:ring-indigo-500/20
                    "
                  />

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                    This answer can be used as a reference when evaluating the
                    student's response.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= PROCTORING SETTINGS ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/60
          rounded-xl p-5
        "
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              p-2.5 rounded-xl
              bg-emerald-50 dark:bg-emerald-600/20
              border border-transparent dark:border-emerald-400/20
            "
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">
              Proctoring Settings
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Configure AI-powered exam monitoring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PROCTORING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const enabled = settings[option.key];

            return (
              <div
                key={option.key}
                className={`
                  flex items-center justify-between gap-4
                  p-4 rounded-xl border
                  transition-colors
                  ${
                    enabled
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-400/30"
                      : "bg-slate-50 dark:bg-[#111C2E] border-slate-200 dark:border-indigo-400/30"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      p-2 rounded-lg
                      bg-white dark:bg-[#1E293B]
                      border border-transparent dark:border-slate-700
                    "
                  >
                    <Icon
                      className={`
                        w-4 h-4
                        ${
                          enabled
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                        }
                      `}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {option.title}
                    </p>

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSettingChange(option.key)}
                  className={`
                    relative flex items-center
                    w-10 h-5
                    rounded-full
                    transition-colors
                    ${
                      enabled
                        ? "bg-emerald-500"
                        : "bg-slate-300 dark:bg-slate-700"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute left-0.5
                      w-4 h-4
                      bg-white rounded-full shadow
                      transition-transform
                      ${enabled ? "translate-x-5" : "translate-x-0"}
                    `}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= INSTRUCTIONS ================= */}

      <div
        className="
          bg-white dark:bg-[#0F172A]
          border border-slate-200 dark:border-indigo-400/60
          rounded-xl p-5
        "
      >
        <h2 className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] mb-1">
          Student Instructions
        </h2>

        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Instructions students will see before starting the exam
        </p>

        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows="5"
          placeholder="Enter exam instructions..."
          className="
            w-full px-3.5 py-2.5
            bg-white dark:bg-[#1E293B]
            border border-slate-200 dark:border-indigo-400/40
            rounded-xl text-sm
            text-slate-700 dark:text-[#F8FAFC]
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            resize-none
            focus:outline-none
            focus:border-indigo-400
            focus:ring-2 focus:ring-indigo-500/20
          "
        />
      </div>

      {/* ================= BOTTOM ACTIONS ================= */}

      <div className="flex items-center justify-end gap-3 pb-6">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
          className="
            px-4 py-2.5
            bg-white dark:bg-[#0F172A]
            border border-slate-200 dark:border-indigo-400/50
            text-slate-600 dark:text-slate-300
            rounded-xl
            text-sm font-medium
            hover:bg-slate-50 dark:hover:bg-[#1E293B]
            transition-colors
          "
        >
          {loading ? "Saving..." : "Save as Draft"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5
            bg-indigo-600
            text-white
            rounded-xl
            text-sm font-medium
            hover:bg-indigo-700
            shadow-sm
            transition-colors
          "
        >
          <Save className="w-4 h-4" />
          {loading ? "Creating..." : "Create Exam"}
        </button>
      </div>
    </form>
  );
};

export default CreateExam;
