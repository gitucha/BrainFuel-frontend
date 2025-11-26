import React, { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function QuizStart() {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  const start = async () => {
    try {
      const params = new URLSearchParams({ category, difficulty, count });
      const { data } = await api.get(`/quizzes/start/?${params.toString()}`);
      // store generated quiz temporarily (localStorage or state) and navigate to gamified page
      localStorage.setItem("generated_quiz", JSON.stringify(data));
      navigate("/quizzes/generated");
    } catch (err) {
      alert("Failed to start quiz");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Start Quiz</h2>
      <div className="space-y-3">
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g. Science)" className="w-full p-2 border rounded" />
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input type="number" value={count} min={1} max={20} onChange={(e)=>setCount(e.target.value)} className="w-full p-2 border rounded" />
        <button onClick={start} className="px-4 py-2 bg-blue-600 text-white rounded">Start</button>
      </div>
    </div>
  );
}
