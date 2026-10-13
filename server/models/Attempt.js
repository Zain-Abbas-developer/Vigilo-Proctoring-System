import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    selectedOption: {
        type: Number,
        default: null,
    },
    isCorrect: {
        type: Boolean,
        default: null,
    },
    marksAwarded: {
        type: Number,
        default: 0,
    },
    answeredAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const attemptSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    submittedAt: Date,
    expiresAt: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["in_progress", "submitted", "auto_submitted" ,"expired"],
        default: "in_progress",
        index: true,
    },
    answers: {
        type: [answerSchema],
        default: [],
    },
    score: {
        type: Number,
        default: 0,
    },
    totalMarks: {
        type: Number,
        default: 0,
    },
    percentage: {
        type: Number,
        default: 0,
    },
    passed: {
        type: Boolean,
        default: false,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    wrongAnswers: {
        type: Number,
        default: 0,
    },
    unattempted: {
        type: Number,
        default: 0,
    },
    violationCount: {
        type: Number,
        default: 0,
        index: true,
    },
    ipAddress: String,
    userAgent: String,

}, { timestamps: true });

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;