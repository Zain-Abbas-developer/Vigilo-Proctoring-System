import mongoose from 'mongoose';

export const VIOLATION_TYPES = [
  'TAB_SWITCH','FULLSCREEN_EXIT','FACE_NOT_DETECTED','MULTIPLE_FACES',
  'PHONE_DETECTED','NOISE_DETECTED','SCREEN_SHARE_STOPPED','COPY_PASTE',
  'SUSPICIOUS_MOVEMENT','CAMERA_DISABLED','MICROPHONE_DISABLED',
  'CONNECTION_LOST','FACE_MISMATCH',
];

const violationSchema = new mongoose.Schema({
    attempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
        index: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: VIOLATION_TYPES,
        required: true,
        index: true,
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: 'low',
        index: true,
    },
    description: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    reviewed: {
        type: Boolean,
        default: false,
        index: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    reviewedAt: Date,
    reviewNote: String,
}, {timestamps: true });

violationSchema.index({ exam: 1, severity: 1, createdAt: -1, });

const Violation = mongoose.model('Violation', violationSchema);
export default Violation;