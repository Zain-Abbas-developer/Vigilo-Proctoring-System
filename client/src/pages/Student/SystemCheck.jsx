import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Globe,
  Loader2,
  Mic,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Volume2,
  Wifi,
  XCircle,
} from "lucide-react";

const initialChecks = [
  {
    id: "camera",
    title: "Camera",
    description: "Checking camera availability and permission",
    icon: Camera,
    status: "checking",
  },
  {
    id: "microphone",
    title: "Microphone",
    description: "Checking microphone availability",
    icon: Mic,
    status: "checking",
  },
  {
    id: "internet",
    title: "Internet Connection",
    description: "Checking your network connection",
    icon: Wifi,
    status: "checking",
  },
  {
    id: "browser",
    title: "Browser",
    description: "Checking browser compatibility",
    icon: Globe,
    status: "checking",
  },
  {
    id: "audio",
    title: "Audio",
    description: "Checking audio output",
    icon: Volume2,
    status: "checking",
  },
  {
    id: "fullscreen",
    title: "Fullscreen",
    description: "Checking fullscreen capability",
    icon: Monitor,
    status: "checking",
  },
];

const SystemCheck = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const [checks, setChecks] = useState(initialChecks);
  const [isRunning, setIsRunning] = useState(true);
  const [internetLatency, setInternetLatency] = useState(null);
  const [internetMessage, setInternetMessage] = useState("");
  const [audioConfirmed, setAudioConfirmed] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // ----- Real check functions -----

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error) {
      console.warn("Camera check failed:", error.name, error.message);
      return false;
    }
  };

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error) {
      console.warn("Microphone check failed:", error.name, error.message);
      return false;
    }
  };

  const checkInternet = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const startedAt = performance.now();

    try {
      if (!navigator.onLine) {
        throw new Error("Your device appears to be offline.");
      }

      // This measures request completion, not bandwidth. Because the request
      // uses no-cors, the HTTP response status is not readable by JavaScript.
      await fetch("https://www.google.com/generate_204", {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
        signal: controller.signal,
      });

      const latency = Math.round(performance.now() - startedAt);
      setInternetLatency(latency);
      setInternetMessage(`Connection request completed in ${latency} ms.`);
      return true;
    } catch (error) {
      const message =
        error.name === "AbortError"
          ? "Connection timed out. Check your internet."
          : error.message || "Unable to reach the internet.";

      setInternetLatency(null);
      setInternetMessage(message);
      console.warn("Internet check failed:", message);
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const checkBrowser = () => {
    const hasMediaDevices = !!navigator.mediaDevices;
    const hasGetUserMedia = !!navigator.mediaDevices?.getUserMedia;
    const hasRTCPeerConnection = !!window.RTCPeerConnection;

    return (
      hasMediaDevices &&
      hasGetUserMedia &&
      hasRTCPeerConnection
    );
  };

  const checkAudio = () => {
    return Boolean(window.AudioContext || window.webkitAudioContext);
  };

  const playAudioTest = async () => {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      setAudioMessage("Audio output is not supported by this browser.");
      return;
    }

    setIsPlayingAudio(true);
    setAudioConfirmed(false);
    setAudioMessage("Playing test tone...");

    let audioContext;

    try {
      audioContext = new AudioContextClass();
      await audioContext.resume();

      if (audioContext.state !== "running") {
        throw new Error("Browser audio could not be started.");
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.1
      );
      gain.gain.setValueAtTime(0.12, audioContext.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 1
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);

      await new Promise((resolve) => {
        oscillator.onended = resolve;
      });

      setAudioMessage("Test tone played. Did you hear it?");
    } catch (error) {
      setAudioMessage(error.message || "Unable to play the test tone.");
      console.warn("Audio test failed:", error);
    } finally {
      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close().catch(() => {});
      }
      setIsPlayingAudio(false);
    }
  };

  const confirmAudio = () => {
    setAudioConfirmed(true);
    setAudioMessage("Audio output confirmed by you.");

    setChecks((current) =>
      current.map((check) =>
        check.id === "audio" ? { ...check, status: "passed" } : check
      )
    );
  };

  const checkFullscreen = () => {
    return document.fullscreenEnabled === true;
  };

  // ----- Main runner -----

  const runChecks = async () => {
    setIsRunning(true);
    setAudioConfirmed(false);
    setAudioMessage("");
    setInternetLatency(null);
    setInternetMessage("");

    setChecks((current) =>
      current.map((check) => ({ ...check, status: "checking" }))
    );

    try {
      const results = await Promise.all([
        checkCamera(),
        checkMicrophone(),
        checkInternet(),
        Promise.resolve(checkBrowser()),
        Promise.resolve(checkAudio()),
        Promise.resolve(checkFullscreen()),
      ]);

      setChecks((current) =>
        current.map((check, index) => ({
          ...check,
          // Audio needs a real playback test and student confirmation.
          status:
            index === 4
              ? results[index]
                ? "pending"
                : "failed"
              : results[index]
                ? "passed"
                : "failed",
        }))
      );

      if (!results[4]) {
        setAudioMessage("Audio is not supported by this browser.");
      }
    } catch (error) {
      console.error("System checks failed:", error);
      setChecks((current) =>
        current.map((check) =>
          check.status === "checking"
            ? { ...check, status: "failed" }
            : check
        )
      );
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runChecks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOffline = () => {
      setInternetLatency(null);
      setInternetMessage("Device is offline.");
      setChecks((current) =>
        current.map((check) =>
          check.id === "internet" ? { ...check, status: "failed" } : check
        )
      );
    };

    const handleOnline = async () => {
      setChecks((current) =>
        current.map((check) =>
          check.id === "internet" ? { ...check, status: "checking" } : check
        )
      );

      const passed = await checkInternet();
      setChecks((current) =>
        current.map((check) =>
          check.id === "internet"
            ? { ...check, status: passed ? "passed" : "failed" }
            : check
        )
      );
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- UI helpers -----

  const passedChecks = checks.filter(
    (check) => check.status === "passed"
  ).length;

  const failedChecks = checks.filter(
    (check) => check.status === "failed"
  ).length;

  const allPassed = passedChecks === checks.length;

  const handleContinue = () => {
    if (!allPassed) return;

    navigate(
      `/student/exam/${examId || 1}/face-verification`
    );
  };

  const getStatusContent = (status) => {
    if (status === "checking") {
      return {
        icon: Loader2,
        label: "Checking...",
        className:
          "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
        iconClass: "animate-spin",
      };
    }

    if (status === "pending") {
      return {
        icon: Volume2,
        label: "Test Required",
        className:
          "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
        iconClass: "",
      };
    }

    if (status === "passed") {
      return {
        icon: CheckCircle2,
        label: "Passed",
        className:
          "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
        iconClass: "",
      };
    }

    return {
      icon: XCircle,
      label: "Failed",
      className:
        "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
      iconClass: "",
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() =>
          navigate(
            `/student/exams/${examId || 1}/instructions`
          )
        }
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Instructions
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        {/* Header Banner */}
        <div className="p-6 sm:p-7 bg-indigo-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 mb-2">

                <span className="px-2.5 py-1 bg-white/15 text-white rounded-full text-[10px] font-semibold">
                  Step 1 of 2
                </span>

                <span className="px-2.5 py-1 bg-white/10 text-indigo-100 rounded-full text-[10px] font-semibold">
                  Pre-Exam Check
                </span>

              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                System Check
              </h1>

              <p className="text-sm text-indigo-100 mt-2 max-w-xl leading-relaxed">
                We need to make sure your device is ready before starting
                the proctored examination.
              </p>
            </div>

            <div className="hidden sm:flex w-14 h-14 items-center justify-center bg-white/10 rounded-2xl">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>

          </div>
        </div>

        {/* Progress */}
        <div className="p-5">

          <div className="flex items-center justify-between mb-2">

            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              System readiness
            </span>

            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {passedChecks}/{checks.length} checks passed
            </span>

          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: `${(passedChecks / checks.length) * 100}%`,
              }}
            />
          </div>

        </div>
      </div>

      {/* Status Message */}
      <div
        className={`rounded-2xl border p-4 ${
          allPassed
            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
            : failedChecks > 0
            ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
            : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20"
        }`}
      >

        <div className="flex items-start gap-3">

          <div
            className={`p-2 rounded-lg ${
              allPassed
                ? "bg-emerald-100 dark:bg-emerald-500/10"
                : failedChecks > 0
                ? "bg-red-100 dark:bg-red-500/10"
                : "bg-indigo-100 dark:bg-indigo-500/10"
            }`}
          >
            {allPassed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : failedChecks > 0 ? (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>

          <div>

            <h2
              className={`text-sm font-semibold ${
                allPassed
                  ? "text-emerald-800 dark:text-emerald-300"
                  : failedChecks > 0
                  ? "text-red-800 dark:text-red-300"
                  : "text-indigo-800 dark:text-indigo-300"
              }`}
            >
              {allPassed
                ? "Your system is ready!"
                : failedChecks > 0
                ? "Some checks need attention"
                : "Checking your system..."}
            </h2>

            <p
              className={`text-xs mt-1 leading-relaxed ${
                allPassed
                  ? "text-emerald-700 dark:text-emerald-400/80"
                  : failedChecks > 0
                  ? "text-red-700 dark:text-red-400/80"
                  : "text-indigo-700 dark:text-indigo-400/80"
              }`}
            >
              {allPassed
                ? "All required checks have passed. You can continue to face verification."
                : failedChecks > 0
                ? "Please resolve the failed checks and run the system check again."
                : "Please wait while we verify your device and browser."}
            </p>

          </div>

        </div>
      </div>

      {/* System Checks */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Device & Browser Checks
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every required component must pass before continuing.
          </p>

        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">

          {checks.map((check) => {
            const Icon = check.icon;
            const status = getStatusContent(check.status);
            const StatusIcon = status.icon;

            return (
              <div
                key={check.id}
                className="flex flex-col gap-3 p-4 bg-white dark:bg-[#111C33] border border-slate-200 dark:border-slate-700/70 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="p-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-slate-700/70 rounded-xl shrink-0">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>

                  <div className="min-w-0">

                    <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {check.title}
                    </h3>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {check.description}
                    </p>

                  </div>

                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0 ${status.className}`}
                >
                  <StatusIcon
                    className={`w-3.5 h-3.5 ${status.iconClass}`}
                  />

                  <span className="text-[10px] font-semibold">
                    {status.label}
                  </span>
                </div>

                {check.id === "internet" && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {internetMessage || "Checking connection..."}
                  </p>
                )}

                {check.id === "audio" && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {audioMessage ||
                        "Play a test tone, then confirm whether you can hear it."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={playAudioTest}
                        disabled={isPlayingAudio || isRunning || audioConfirmed}
                        className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {audioConfirmed
                          ? "Audio Confirmed"
                          : isPlayingAudio
                            ? "Playing..."
                            : "Play Test Sound"}
                      </button>

                      {audioMessage === "Test tone played. Did you hear it?" && (
                        <button
                          type="button"
                          onClick={confirmAudio}
                          className="px-3 py-2 rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                        >
                          Yes, I Can Hear It
                        </button>
                      )}
                    </div>

                    {audioConfirmed && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Audio output confirmed.
                      </p>
                    )}
                  </div>
                )}

              </div>
            );
          })}

        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">

          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Recommended Environment
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Follow these recommendations for a smooth examination.
          </p>

        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Laptop */}
          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Use a laptop or desktop
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Mobile devices are not recommended.
              </p>
            </div>

          </div>

          {/* Internet */}
          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Use a stable internet connection
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Avoid unstable or public networks.
              </p>
            </div>

          </div>

          {/* Camera */}
          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Allow camera and microphone
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Required for proctoring.
              </p>
            </div>

          </div>

          {/* Applications */}
          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Close unnecessary applications
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Keep only the required browser window open.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-sm dark:shadow-black/10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Status */}
          <div className="flex items-center gap-2">

            {allPassed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  All system checks passed
                </span>
              </>
            ) : (
              <>
                <Clock3 className="w-4 h-4 text-slate-400 dark:text-slate-500" />

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isRunning
                    ? "Please wait for the checks to complete..."
                    : "System check incomplete"}
                </span>
              </>
            )}

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Run Again */}
            <button
              onClick={runChecks}
              disabled={isRunning}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#111C33] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRunning ? "animate-spin" : ""
                }`}
              />

              Run Again
            </button>

            {/* Continue */}
            <button
              onClick={handleContinue}
              disabled={!allPassed}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Face Verification

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

export default SystemCheck;