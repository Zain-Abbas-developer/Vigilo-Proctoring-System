import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        index: true,
    },
    attempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt',
        index: true,
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scope: {
        type: String,
        enum: ["exam", "attempt", "student", "system"],
        default: "exam",
    },
    title: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    format: {
        type: String,
        enum: ["json", "csv", "pdf"],
        default: "json",
    },
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;