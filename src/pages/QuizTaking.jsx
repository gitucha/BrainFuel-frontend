import React, { useState } from "react";

function QuizTaking() {
  const questions = [
    {
      id: 1,
      question:
        "Which of the following data structures operates on a Last-In, First-Out (LIFO) principle?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      answer: "Stack",
    },
  ];

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
         BrainFuel Quiz Challenge
      </h2>

      <div className="bg-white shadow-sm rounded-lg p-8">
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
          <span> Time Left: 07:00</span>
          <span> XP: 0</span>
        </div>

        {/* Question Card */}
        <div>
          {questions.map((q) => (
            <div key={q.id}>
              <h3 className="font-semibold text-gray-800 mb-4">
                Question {q.id}: {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
                      selected === opt
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={selected === opt}
                      onChange={() => setSelected(opt)}
                      className="text-blue-600"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selected || submitted}
                className={`mt-6 px-6 py-2 rounded-md ${
                  submitted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {submitted ? "Submitted!" : "Submit Answer"}
              </button>

              {submitted && (
                <p className="mt-4 text-green-600 font-semibold">
                  Correct! The answer is {q.answer}.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizTaking;
