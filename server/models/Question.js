import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
});

const questionSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["mcq", "short_answer", "long_answer"],
        default: "mcq",
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [optionSchema],
        default: [],
    },
    correctAnswer: {
        type: Number,
        default: null,
    },
    marks: {
        type: Number,
        default: 1,
        min: 0,
    },
    negativeMarks: {
        type: Number,
        default: 0,
        min: 0,
    },
    explanation: {
        type: String,
        default: '',
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

questionSchema.methods.toStudentDTO = function () {
  return {
    _id: this._id,
    type: this.type,
    question: this.question,
    options: this.options.map((option) => ({
      text: option.text,
    })),
    marks: this.marks,
    order: this.order,
  };
};


const Question = mongoose.model('Question', questionSchema);
export default Question;