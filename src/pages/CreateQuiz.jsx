import React, { useState } from "react";

function CreateQuiz() {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    questions: [{ text: "", options: ["", "", "", ""], correct: 0 }],
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { text: "", options: ["", "", "", ""], correct: 0 }],
    });
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...quiz.questions];
    updated[idx][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Create a Quiz</h2>

      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* Quiz Details */}
        <h3 className="font-semibold text-gray-800 mb-4">Quiz Details</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Quiz Title"
            className="border rounded px-4 py-2"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="border rounded px-4 py-2"
            value={quiz.category}
            onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="Difficulty"
            className="border rounded px-4 py-2"
            value={quiz.difficulty}
            onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Quiz Description"
          className="border rounded px-4 py-2 w-full mb-8"
          rows="3"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        ></textarea>

        {/* Questions */}
        <h3 className="font-semibold text-gray-800 mb-4">Quiz Questions</h3>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-8 border rounded-lg p-6 bg-gray-50">
            <h4 className="font-medium text-gray-700 mb-4">Question {idx + 1}</h4>
            <input
              type="text"
              placeholder="Question Text"
              className="border rounded px-4 py-2 w-full mb-4"
              value={q.text}
              onChange={(e) => handleQuestionChange(idx, "text", e.target.value)}
            />
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={q.correct === i}
                  onChange={() => handleQuestionChange(idx, "correct", i)}
                />
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="border rounded px-4 py-2 flex-1"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...q.options];
                    updated[i] = e.target.value;
                    handleQuestionChange(idx, "options", updated);
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 mb-6"
        >
          + Add New Question
        </button>

        <div className="flex gap-4">
          <button className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">
            Save Draft
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Publish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
