import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function CreateQuiz() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy",
    is_premium: false,
  });
  const [error, setError] = useState("");

  const createMut = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/quizzes/create/", payload);
      return data;
    },
    onSuccess: (quiz) => {
      navigate(`/quiz-builder/${quiz.id}`);
    },
    onError: () => setError("Could not create quiz."),
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMut.mutate(form);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create Quiz</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_premium"
            checked={form.is_premium}
            onChange={handleChange}
          />
          <span className="text-sm">Premium Quiz</span>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Create & Continue
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
