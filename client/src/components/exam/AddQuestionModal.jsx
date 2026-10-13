import { X, Plus } from 'lucide-react';
import { useState } from 'react';

const AddQuestionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    question: '',
    subject: 'Mathematics',
    type: 'mcq',
    difficulty: 'easy',
    marks: 2,
    options: ['', '', '', ''],
    correctAnswer: '',
    expectedAnswer: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setFormData((prev) => {
      const options = [...prev.options];

      options[index] = value;

      return {
        ...prev,
        options,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      alert('Please enter a question.');
      return;
    }

    if (formData.type === 'mcq') {
      if (formData.options.some((option) => !option.trim())) {
        alert('Please fill all options.');
        return;
      }

      if (!formData.correctAnswer) {
        alert('Please select the correct answer.');
        return;
      }
    }

    if (
      formData.type === 'written' &&
      !formData.expectedAnswer.trim()
    ) {
      alert('Please enter the expected answer.');
      return;
    }

    onAdd({
      ...formData,
      id: Date.now(),
      marks: Number(formData.marks),
      usedIn: 0,
      status: 'draft',
    });

    setFormData({
      question: '',
      subject: 'Mathematics',
      type: 'mcq',
      difficulty: 'easy',
      marks: 2,
      options: ['', '', '', ''],
      correctAnswer: '',
      expectedAnswer: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Add New Question
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Create a question for your question bank
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Question */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question
            </label>

            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows="3"
              placeholder="Enter your question..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* Subject + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              >
                <option value="Mathematics">
                  Mathematics
                </option>

                <option value="Physics">
                  Physics
                </option>

                <option value="Biology">
                  Biology
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="English">
                  English
                </option>
              </select>

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Question Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              >

                <option value="mcq">
                  MCQ
                </option>

                <option value="written">
                  Short / Long Question
                </option>

              </select>

            </div>

          </div>

          {/* Difficulty + Marks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              >

                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Marks
              </label>

              <input
                type="number"
                name="marks"
                min="1"
                value={formData.marks}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
              />

            </div>

          </div>

          {/* MCQ */}
          {formData.type === 'mcq' && (

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">

              <h3 className="text-sm font-semibold text-slate-700">
                MCQ Options
              </h3>

              <p className="text-xs text-slate-400 mt-1 mb-4">
                Add four options and select the correct answer.
              </p>

              <div className="space-y-3">

                {formData.options.map((option, index) => {

                  const letter =
                    String.fromCharCode(65 + index);

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-500">
                        {letter}
                      </div>

                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${letter}`}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                      />

                    </div>
                  );
                })}

              </div>

              <div className="mt-4">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Correct Answer
                </label>

                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                >

                  <option value="">
                    Select correct answer
                  </option>

                  <option value="A">
                    Option A
                  </option>

                  <option value="B">
                    Option B
                  </option>

                  <option value="C">
                    Option C
                  </option>

                  <option value="D">
                    Option D
                  </option>

                </select>

              </div>

            </div>
          )}

          {/* Written */}
          {formData.type === 'written' && (

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected Answer / Guidelines
              </label>

              <textarea
                name="expectedAnswer"
                value={formData.expectedAnswer}
                onChange={handleChange}
                rows="5"
                placeholder="Enter expected answer or answer guidelines..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-indigo-400"
              />

            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddQuestionModal;