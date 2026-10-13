import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { aiService } from "../../services/aiService.js";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

const FaceVerification = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresEnrollment, setRequiresEnrollment] = useState(false);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [cameraStatus, setCameraStatus] = useState("checking");
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  // ----- Camera -----

  const startCamera = async () => {
    try {
      setError("");
      setCameraStatus("checking");
      setIsCameraReady(false);
      setVerificationStatus("idle");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported by your browser.");
      }

      // Stop existing tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        setCameraStatus("passed");
        setIsCameraReady(true);

        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Play in background failed:", playErr.message);

          setTimeout(async () => {
            try {
              if (videoRef.current && streamRef.current?.active) {
                await videoRef.current.play();
              }
            } catch (_) {
              // Ignore second attempt
            }
          }, 500);
        }
      }
    } catch (err) {
      console.error("Camera error:", err);

      setCameraStatus("failed");
      setIsCameraReady(false);

      if (err.name === "NotAllowedError") {
        setError(
          "Camera permission was denied. Please allow camera access from your browser settings.",
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera was found. Please connect a camera and try again.");
      } else {
        setError(err.message || "Unable to access your camera.");
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // ----- Temporary verification simulation -----

  const captureWebcamImage = () => {
    const video = videoRef.current;

    if (
      !video ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      throw new Error("Camera image is not ready. Please try again.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to capture the camera image.");
    }

    // Capture the actual webcam frame.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const startVerification = async () => {
    if (!isCameraReady || isSubmitting) return;

    setIsSubmitting(true);
    setVerificationStatus("verifying");
    setError("");

    try {
      const verificationImage = captureWebcamImage();

      const result = await aiService.verifyFace({
        verificationImage,
      });

      if (result?.verified !== true) {
        throw new Error(
          result?.message ||
            "Your face could not be verified. Please try again.",
        );
      }

      setRequiresEnrollment(false);
      setEnrollmentComplete(false);
      setVerificationStatus("passed");
      setError("");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.data?.message ||
        err?.message ||
        "Face verification failed. Please try again.";

      console.error("Face verification failed:", err);

      // Enrollment is needed only when the backend explicitly says so.
      if (message.toLowerCase().includes("face enrollment is required")) {
        setRequiresEnrollment(true);
      }

      setVerificationStatus("failed");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //face enrollment addition
  const startEnrollment = async () => {
    if (!isCameraReady || isSubmitting) return;

    setIsSubmitting(true);
    setVerificationStatus("verifying");
    setError("");

    try {
      const image = captureWebcamImage();

      const result = await aiService.enrollFace({ image });

      if (result?.faceEnrolled !== true) {
        throw new Error(
          result?.message || "Face enrollment could not be completed.",
        );
      }

      setRequiresEnrollment(false);
      setEnrollmentComplete(true);
      setVerificationStatus("idle");
      setError("");
    } catch (err) {
      console.error("Face enrollment failed:", err);

      setVerificationStatus("failed");
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          err?.message ||
          "Face enrollment failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----- Continue -----

  const handleContinue = () => {
    if (verificationStatus !== "passed" || !examId) return;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    navigate(`/student/exam/${examId}/start`);
  };

  // ----- Back -----

  const handleBack = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    navigate(`/student/exam/${examId || 1}/system-check`);
  };

  // ----- Verification message -----

  const getVerificationMessage = () => {
    if (verificationStatus === "verifying") {
      return {
        title: "Verifying your face...",
        description: "Please look directly at the camera and remain still.",
      };
    }

    if (verificationStatus === "passed") {
      return {
        title: "Face verification successful",
        description:
          "Your face has been successfully verified. You can continue to the examination.",
      };
    }

    if (verificationStatus === "failed") {
      return {
        title: "Verification failed",
        description:
          "We could not verify your face. Please ensure good lighting and try again.",
      };
    }

    if (requiresEnrollment) {
      return {
        title: "Face registration required",
        description:
          "Register your face securely before verifying your identity for this examination.",
      };
    }

    if (enrollmentComplete) {
      return {
        title: "Face registered successfully",
        description:
          "Your face has been registered. Verify your identity to continue to the examination.",
      };
    }

    return {
      title: "Position your face",
      description: "Make sure your face is clearly visible inside the frame.",
    };
  };

  const message = getVerificationMessage();

  const progress =
    verificationStatus === "passed"
      ? "100%"
      : verificationStatus === "verifying"
        ? "50%"
        : "0%";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to System Check
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">
        {/* Header Banner */}
        <div className="p-6 sm:p-7 bg-indigo-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-white/15 text-white rounded-full text-[10px] font-semibold">
                  Step 2 of 2
                </span>

                <span className="px-2.5 py-1 bg-white/10 text-indigo-100 rounded-full text-[10px] font-semibold">
                  Identity Verification
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Face Verification
              </h1>

              <p className="text-sm text-indigo-100 mt-2 max-w-xl leading-relaxed">
                Verify your identity before entering the proctored examination.
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
              Verification progress
            </span>

            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {progress}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: progress }}
            />
          </div>
        </div>
      </div>

      {/* Identity Verification */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Identity Verification
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Look directly at the camera and keep your face inside the
            verification frame.
          </p>
        </div>

        <div className="p-5">
          {/* Camera */}
          <div className="relative max-w-2xl mx-auto aspect-video bg-slate-950 rounded-2xl overflow-hidden">
            {cameraStatus === "failed" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Camera className="w-7 h-7 text-red-400" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Camera unavailable
                </h3>

                <p className="text-xs text-slate-400 mt-2 max-w-sm">{error}</p>

                <button
                  onClick={startCamera}
                  className="mt-5 flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Face Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`relative w-52 h-64 sm:w-60 sm:h-72 rounded-[48%] border-2 transition-colors duration-300 ${
                      verificationStatus === "passed"
                        ? "border-emerald-400"
                        : verificationStatus === "verifying"
                          ? "border-indigo-400"
                          : "border-white/80"
                    }`}
                  >
                    <div className="absolute top-1/2 left-0 right-0 border-t border-white/20" />

                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/20" />
                  </div>
                </div>

                {/* Camera Status */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cameraStatus === "passed"
                          ? "bg-emerald-400"
                          : "bg-yellow-400 animate-pulse"
                      }`}
                    />

                    <span className="text-[10px] font-medium text-white">
                      {cameraStatus === "passed"
                        ? "Camera Ready"
                        : "Connecting Camera..."}
                    </span>
                  </div>
                </div>

                {/* Verifying Overlay */}
                {verificationStatus === "verifying" && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passed Overlay */}
                {verificationStatus === "passed" && (
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Failed Overlay */}
                {verificationStatus === "failed" && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                        <XCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Verification Message */}
          <div className="mt-5 text-center">
            <div className="flex items-center justify-center gap-2">
              {verificationStatus === "passed" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : verificationStatus === "verifying" ? (
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              ) : verificationStatus === "failed" ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <UserRound className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}

              <h3
                className={`text-sm font-semibold ${
                  verificationStatus === "passed"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : verificationStatus === "verifying"
                      ? "text-indigo-700 dark:text-indigo-400"
                      : verificationStatus === "failed"
                        ? "text-red-700 dark:text-red-400"
                        : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {message.title}
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {message.description}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Guidelines */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/10">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Verification Guidelines
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Follow these guidelines for successful verification.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Direct Camera */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Face the camera directly
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Keep your face centered inside the frame.
              </p>
            </div>
          </div>

          {/* Lighting */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Ensure good lighting
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Avoid dark rooms and strong backlighting.
              </p>
            </div>
          </div>

          {/* Face coverings */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Remove face coverings
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Your complete face should be visible.
              </p>
            </div>
          </div>

          {/* Remain Still */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Remain still
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Keep your head steady during verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && verificationStatus === "failed" && (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />

            <div>
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                Verification Error
              </h3>

              <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700/70 rounded-2xl p-5 shadow-sm dark:shadow-black/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            {verificationStatus === "passed" ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Identity verified successfully
                </span>
              </>
            ) : verificationStatus === "failed" ? (
              <>
                <XCircle className="w-4 h-4 text-red-500" />

                <span className="text-xs font-medium text-red-700 dark:text-red-400">
                  Verification failed – please try again
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" />

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Camera verification is required before starting the exam
                </span>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Restart Camera */}
            <button
              onClick={startCamera}
              disabled={verificationStatus === "verifying"}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-[#111C33] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restart Camera
            </button>

            {/* Verification / Continue */}
            {verificationStatus !== "passed" ? (
              <button
                onClick={
                  requiresEnrollment ? startEnrollment : startVerification
                }
                disabled={
                  !isCameraReady ||
                  isSubmitting ||
                  verificationStatus === "verifying" ||
                  cameraStatus === "failed"
                }
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {verificationStatus === "verifying" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {requiresEnrollment
                      ? "Registering Face..."
                      : "Verifying..."}
                  </>
                ) : requiresEnrollment ? (
                  <>
                    Register My Face
                    <Camera className="w-4 h-4" />
                  </>
                ) : verificationStatus === "failed" ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Retry Verification
                  </>
                ) : (
                  <>
                    {enrollmentComplete ? "Verify My Face" : "Verify My Face"}
                    <Camera className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-500 transition-colors"
              >
                Continue to Exam
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;
