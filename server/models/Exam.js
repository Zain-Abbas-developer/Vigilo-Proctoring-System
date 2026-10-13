import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    negativeMarking: { type: Boolean, default: false },
    negativeMarkValue: { type: Number, default: 0, min: 0 },
    faceDetection: { type: Boolean, default: true },
    multipleFaces: { type: Boolean, default: true },
    tabSwitch: { type: Boolean, default: true },
    phoneDetection: { type: Boolean, default: false },
    noiseDetection: { type: Boolean, default: false },
    screenMonitoring: { type: Boolean, default: false },
    copyPaste: { type: Boolean, default: true },
    suspiciousMovement: { type: Boolean, default: false },
    requireFaceVerification: { type: Boolean, default: true },
    verificationInterval: { type: Number, default: 60 },
    monitoringInterval: { type: Number, default: 30 },
    allowMultipleAttempts: { type: Boolean, default: false },
  },
  { _id: false },
);

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      index: true,
    },
    instructions: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    passingMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

examSchema.index({ createdBy: 1, status: 1 });
examSchema.index({ startTime: 1, endTime: 1 });

examSchema.methods.deriveStatus = function (now = new Date()) {
  if (this.status === "scheduled" || this.status === "cancelled")
    return this.status;
  if (now < this.startTime) return "scheduled";
  if (now >= this.startTime && now <= this.endTime) return "active";
  return "completed";
};
examSchema.methods.toDTO = function (now = new Date()) {
  const o = this.toObject();
  o.status = this.deriveStatus(now);
  return o;
};

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
