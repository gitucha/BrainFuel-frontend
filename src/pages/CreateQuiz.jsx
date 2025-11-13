import React, { useState } from "react";
import api from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ]);
  };

  const createQuizMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/quizzes/create/", payload);
      return data;
    },
    onSuccess: () => navigate("/dashboard"),
    onError: () => alert("Quiz creation failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createQuizMutation.mutate({
      title,
      description,
      category,
      questions,
    });
  };

  const updateQuestionText = (qi, text) => {
    const updated = [...questions];
    updated[qi].text = text;
    setQuestions(updated);
  };

  const updateOption = (qi, oi, field, value) => {
    const updated = [...questions];
    updated[qi].options[oi][field] = value;
    setQuestions(updated);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="border p-2 w-full rounded" placeholder="Quiz Title"
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <textarea className="border p-2 w-full rounded" placeholder="Description"
          value={description} onChange={(e) => setDescription(e.target.value)} />

        <input className="border p-2 w-full rounded" placeholder="Category"
          value={category} onChange={(e) => setCategory(e.target.value)} />

        <button type="button" onClick={addQuestion}
          className="px-4 py-2 bg-green-600 text-white rounded">
          + Add Question
        </button>

        {questions.map((q, qi) => (
          <div key={qi} className="border p-4 rounded mt-4 bg-gray-50">
            <input className="border p-2 w-full rounded mb-3"
              placeholder={`Question ${qi + 1}`}
              value={q.text}
              onChange={(e) => updateQuestionText(qi, e.target.value)}
            />

            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-3 mb-2">
                <input className="border p-2 flex-1 rounded" placeholder={`Option ${oi + 1}`}
                  value={opt.text}
                  onChange={(e) => updateOption(qi, oi, "text", e.target.value)}
                />
                <input type="checkbox" checked={opt.is_correct}
                  onChange={(e) => updateOption(qi, oi, "is_correct", e.target.checked)} />
                <span>Correct</span>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
