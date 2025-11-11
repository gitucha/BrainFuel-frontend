import React, { useState } from "react";

function QuizTaking() {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return alert("Please select an answer!");
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded shadow-sm">
        <h2 className="text-xl font-bold text-blue-600 text-center">
          BrainFuel Quiz Challenge
        </h2>

        <div className="mt-6">
          <p className="text-sm text-gray-600">XP: 0 • Time Left: 07:00</p>

          <div className="mt-4 border rounded p-6">
            <div className="font-semibold mb-4">
              Which data structure operates on a Last-In, First-Out (LIFO) principle?
            </div>

            {["Queue", "Stack", "Linked List", "Tree"].map((option) => (
              <label
                key={option}
                className={`block border p-3 rounded mb-2 cursor-pointer ${
                  selected === option ? "bg-blue-50 border-blue-400" : ""
                }`}
              >
                <input
                  type="radio"
                  name="q1"
                  value={option}
                  checked={selected === option}
                  onChange={(e) => setSelected(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}

            <button
              onClick={handleSubmit}
              className={`mt-4 px-4 py-2 rounded ${
                submitted
                  ? "bg-gray-300 text-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={submitted}
            >
              {submitted ? "Submitted!" : "Submit"}
            </button>

            {submitted && (
              <div className="mt-3 text-green-600 font-medium">✅ Correct! +50 XP</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizTaking;
