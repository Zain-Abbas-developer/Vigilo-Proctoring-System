import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Maximize,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { attemptService } from "../../services/attemptService.js";

const getMessage = (error) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const getAttempt = (response) => response?.attempt ?? response;

const getQuestionId = (question) => question?._id ?? question?.id;

const getOptionText = (option) =>
  typeof option === "string" ? option : (option?.text ?? "");

const Exam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  const submitLock = useRef(false);
  const answerQueue = useRef(Promise.resolve());

  const question = questions[currentQuestion];

  const answeredCount = questions.filter((item) => {
    const answer = answers[getQuestionId(item)];
    if (!answer) return false;

    return answer.selectedOption != null || Boolean(answer.textAnswer?.trim());
  }).length;

  const markedCount = markedQuestions.length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeft]);

  const timerWarning = timeLeft <= 5 * 60;

  // Load or resume attempt, then fetch the real exam paper.
  useEffect(() => {
    let cancelled = false;

    const loadExam = async () => {
      setLoading(true);
      setError("");
      setSaveError("");

      try {
        if (!examId) {
          throw new Error("Exam ID is missing from the URL.");
        }

        console.log("Loading exam:", examId);

        // 1. Check for an existing attempt.
        const activeResponse = await attemptService.active(examId);

        if (cancelled) return;

        let attempt = getAttempt(activeResponse);

        // 2. Start an attempt if none exists.
        if (!attempt?._id) {
          console.log("No active attempt found. Starting one...");

          const startResponse = await attemptService.start(examId);

          if (cancelled) return;

          attempt = getAttempt(startResponse);

          console.log("New attempt response:", startResponse);
        }

        // 3. Validate the attempt.
        if (!attempt?._id) {
          throw new Error("The server did not return a valid exam attempt.");
        }

        if (!attempt.status) {
          throw new Error("The attempt response is missing its status.");
        }

        // 4. Redirect only for a terminal attempt.
        const terminalStatuses = ["submitted", "auto_submitted", "expired"];

        if (terminalStatuses.includes(attempt.status)) {
          navigate(`/student/exam/${examId}/result`, {
            replace: true,
            state: { attemptId: attempt._id },
          });
          return;
        }

        if (attempt.status !== "in_progress") {
          throw new Error(`Unsupported attempt status: ${attempt.status}`);
        }

        // 5. Fetch the exam paper.
        const paperResponse = await attemptService.paper(examId);

        if (cancelled) return;

        const examData = paperResponse?.exam;
        const questionList = paperResponse?.questions;

        if (!examData || !Array.isArray(questionList)) {
          console.error("Unexpected paper response:", paperResponse);

          throw new Error("The exam paper response has an invalid format.");
        }

        // 6. Store attempt and exam details.
        setAttemptId(attempt._id);
        setExpiresAt(attempt.expiresAt ?? null);
        setExam(examData);
        setQuestions(questionList);

        // 7. Restore previously saved answers.
        const restoredAnswers = {};

        for (const saved of attempt.answers ?? []) {
          const questionId = saved.question?._id ?? saved.question;

          if (!questionId) continue;

          restoredAnswers[String(questionId)] = {
            selectedOption: saved.selectedOption ?? null,
            textAnswer: saved.textAnswer ?? "",
          };
        }

        setAnswers(restoredAnswers);
        setCurrentQuestion(0);
        setMarkedQuestions([]);

        console.log("Attempt loaded:", attempt._id);
        console.log("Exam loaded:", examData.title);
        console.log("Questions loaded:", questionList.length);
      } catch (loadError) {
        console.error("Exam loading failed:", loadError);

        if (!cancelled) {
          setError(getMessage(loadError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadExam();

    return () => {
      cancelled = true;
    };
  }, [examId, navigate]);

  // Use the server expiry time instead of restarting the full duration.
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!attemptId || submitLock.current) return;

      submitLock.current = true;
      setSubmitting(true);
      setShowSubmitModal(false);
      setError("");

      try {
        // Wait for any queued answer saves before final submission.
        await answerQueue.current;

        const response = await attemptService.submit(attemptId, auto);
        const submittedAttempt = getAttempt(response);

        navigate(`/student/exam/${examId}/result`, {
          replace: true,
          state: {
            attemptId,
            attempt: submittedAttempt,
            autoSubmitted: auto,
          },
        });
      } catch (submitError) {
        submitLock.current = false;
        setError(getMessage(submitError));
        setShowSubmitModal(true);
      } finally {
        setSubmitting(false);
      }
    },
    [attemptId, examId, navigate],
  );

  
  // Automatically submit only when the actual expiry timestamp has passed.
  useEffect(() => {
    if (!expiresAt || loading || !attemptId || submitLock.current) {
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();

    if (!Number.isFinite(expiryTime)) {
      console.error("Invalid attempt expiry time:", expiresAt);
      return;
    }

    // Check the real timestamp instead of potentially stale timeLeft state.
    if (Date.now() >= expiryTime) {
      handleSubmit(true);
    }
  }, [expiresAt, loading, timeLeft, attemptId, handleSubmit]);

  const saveAnswer = useCallback(
    (questionId, answer) => {
      if (!attemptId || !questionId || submitLock.current) {
        return;
      }

      // Update the UI immediately.
      setAnswers((previous) => ({
        ...previous,
        [questionId]: answer,
      }));

      setSaveError("");
      setSavingAnswer(true);

      // Queue saves so requests execute in order.
      answerQueue.current = answerQueue.current
        .catch(() => {})
        .then(async () => {
          await attemptService.saveAnswer(attemptId, {
            questionId,
            selectedOption: answer.selectedOption,
            textAnswer: answer.textAnswer ?? "",
          });
        })
        .catch((saveError) => {
          console.error("Answer save failed:", saveError);
          setSaveError(getMessage(saveError));
        })
        .finally(() => {
          setSavingAnswer(false);
        });
    },
    [attemptId],
  );

  const handleOptionSelect = (optionIndex) => {
    if (!question) return;

    saveAnswer(String(getQuestionId(question)), {
      selectedOption: optionIndex,
      textAnswer: "",
    });
  };

  const handleTextAnswer = (textAnswer) => {
    if (!question) return;

    saveAnswer(String(getQuestionId(question)), {
      selectedOption: null,
      textAnswer,
    });
  };

  const toggleMark = () => {
    if (!question) return;

    const id = String(getQuestionId(question));

    setMarkedQuestions((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (fullscreenError) {
      console.error("Fullscreen error:", fullscreenError);
    }
  };

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", updateFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Loading your examination...
          </p>
        </div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-9 h-9 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4">
            Unable to Load Exam
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error}
          </p>
          <button
            onClick={() => navigate("/student/exam-list")}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white dark:bg-[#0F172A] rounded-2xl p-8">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-4">
            No Questions Available
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            This exam paper does not contain any questions.
          </p>
          <button
            onClick={() => navigate("/student/exam-list")}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const questionId = String(getQuestionId(question));
  const currentAnswer = answers[questionId] ?? {};
  const isTextQuestion =
    question.type === "short_answer" || question.type === "long_answer";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A]">
      <header className="sticky top-0 z-20 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {exam?.title ?? "Examination"}
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {exam?.subject ?? "Proctored Exam"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border ${
              timerWarning
                ? "bg-red-50 dark:bg-red-500/10 border-red-200 text-red-600"
                : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 text-indigo-700"
            }`}
          >
            <Clock3 className="w-4 h-4" />
            <div>
              <p className="text-[9px] opacity-70">Time Remaining</p>
              <p className="text-sm font-bold tabular-nums">{formattedTime}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              Exam Active
            </span>
          </div>

          <button
            onClick={handleFullscreen}
            className="hidden sm:flex p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          <section className="space-y-5">
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-indigo-600">
                    Question {currentQuestion + 1}
                  </p>
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                    {answeredCount} of {questions.length} answered
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-[#111C33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    {currentQuestion + 1}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Question · {question.marks ?? 1} mark(s)
                    </p>
                    <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1 leading-relaxed">
                      {question.question}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={toggleMark}
                  className={`p-2 rounded-lg shrink-0 ${
                    markedQuestions.includes(questionId)
                      ? "bg-amber-50 text-amber-600"
                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  title="Mark for review"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-7 space-y-3">
                {isTextQuestion ? (
                  <textarea
                    value={currentAnswer.textAnswer ?? ""}
                    onChange={(event) => handleTextAnswer(event.target.value)}
                    rows={question.type === "long_answer" ? 7 : 3}
                    placeholder="Type your answer here..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111C33] p-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  />
                ) : (
                  (question.options ?? []).map((option, index) => {
                    const selected = currentAnswer.selectedOption === index;
                    const optionText = getOptionText(option);

                    return (
                      <button
                        key={`${questionId}-${index}`}
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full flex items-center gap-4 p-4 text-left border rounded-xl transition-all ${
                          selected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                            : "border-slate-200 dark:border-slate-700/70 hover:border-indigo-300"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                            selected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-[#111C33] text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span
                          className={`text-sm ${
                            selected
                              ? "font-semibold text-indigo-700 dark:text-indigo-300"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {optionText}
                        </span>
                        {selected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto" />
                        )}
                      </button>
                    );
                  })
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {savingAnswer
                      ? "Saving answer..."
                      : saveError
                        ? "Answer not saved"
                        : "Answer status: ready"}
                  </span>
                  {saveError && (
                    <button
                      onClick={() => {
                        if (currentAnswer.selectedOption != null) {
                          handleOptionSelect(currentAnswer.selectedOption);
                        } else if (currentAnswer.textAnswer) {
                          handleTextAnswer(currentAnswer.textAnswer);
                        }
                      }}
                      className="text-indigo-600 font-semibold"
                    >
                      Retry save
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-4 flex items-center justify-between gap-3">
              <button
                onClick={() =>
                  setCurrentQuestion((value) => Math.max(0, value - 1))
                }
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={toggleMark}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              >
                <Flag className="w-4 h-4" />
                {markedQuestions.includes(questionId)
                  ? "Marked"
                  : "Mark for Review"}
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                >
                  Submit Exam <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestion((value) =>
                      Math.min(questions.length - 1, value + 1),
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <UserRound className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  Student
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Exam attempt in progress
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Questions
                </h2>
                <p className="text-[10px] text-slate-500 mt-1">
                  Select a question to navigate
                </p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((item, index) => {
                    const id = String(getQuestionId(item));
                    const answer = answers[id];
                    const answered =
                      answer &&
                      (answer.selectedOption != null ||
                        Boolean(answer.textAnswer?.trim()));
                    const marked = markedQuestions.includes(id);
                    const active = index === currentQuestion;

                    return (
                      <button
                        key={id}
                        onClick={() => setCurrentQuestion(index)}
                        className={`relative h-9 rounded-lg text-[10px] font-semibold ${
                          active
                            ? "bg-indigo-600 text-white"
                            : answered
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 border border-emerald-200"
                              : "bg-slate-50 dark:bg-[#111C33] text-slate-500 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {index + 1}
                        {marked && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-2 text-[10px] text-slate-500">
                  <p>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 mr-2" />
                    Current
                  </p>
                  <p>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
                    Answered
                  </p>
                  <p>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
                    Marked for review
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Proctoring
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Exam session active
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">
                This indicator reflects the exam session only; it does not
                itself verify that the camera is running.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Exam Progress
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Answered</span>
                  <strong className="text-emerald-600">{answeredCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unanswered</span>
                  <strong>{unansweredCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marked</span>
                  <strong className="text-amber-600">{markedCount}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Submit Examination?
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to submit? You will not be able to change
                your answers afterward.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-5 text-center">
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-emerald-600">
                    {answeredCount}
                  </p>
                  <p className="text-[9px] text-emerald-700">Answered</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-slate-600">
                    {unansweredCount}
                  </p>
                  <p className="text-[9px] text-slate-500">Unanswered</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-lg font-bold text-amber-600">
                    {markedCount}
                  </p>
                  <p className="text-[9px] text-amber-700">Marked</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#111C33] border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting || timeLeft === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-xl text-xs disabled:opacity-40"
              >
                <X className="w-4 h-4" /> Continue Exam
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
