// src/pages/Categories.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const DIFFICULTY_LABELS = {
  any: "Any difficulty",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function Categories() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("any");
  const [numQuestions, setNumQuestions] = useState(10);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Load categories from backend
  const { data: categoryData } = useQuery({
    queryKey: ["quiz_categories"],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/categories/");
      // backend returns { categories: [...] }
      return data?.categories || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(() => {
    const base = categoryData || [];
    return base;
  }, [categoryData]);

  // Load quizzes with filters
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes", { search, selectedCategory, difficulty, showPremiumOnly }],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (difficulty !== "any") params.append("difficulty", difficulty);

      if (showPremiumOnly) {
        params.append("premium", "true");
      }

      const { data } = await api.get(`/quizzes/?${params.toString()}`);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.results)) return data.results;
      return data;
    },
    staleTime: 60 * 1000,
  });

  const handleStartQuiz = (quizId) => {
    const params = new URLSearchParams();
    params.set("num_questions", String(numQuestions));
    if (difficulty !== "any") params.set("difficulty", difficulty);

    navigate(`/quizzes/${quizId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Find a Quiz</h1>
          <p className="text-gray-600 text-sm">
            Search by name, choose a category, pick difficulty, and select how many questions (max 10).
          </p>
        </div>

        {/* Controls card */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Search quizzes
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-100"
              />
            </div>

            {/* Premium toggle */}
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Premium only
              </label>
            </div>
          </div>

          {/* Category / difficulty / numQuestions */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* Category chips */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  All
                </button>
                {(categories || []).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-white"
              >
                {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of questions slider */}
            <div className="w-full md:w-64">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Number of questions (1–10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold w-8 text-right">
                  {numQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz list */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Available Quizzes</h2>
            <span className="text-xs text-gray-500">
              {quizzes?.length ?? 0} found
            </span>
          </div>

          {isLoading ? (
            <div className="p-4 text-gray-500 text-sm">Loading quizzes...</div>
          ) : !quizzes || quizzes.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              No quizzes match your filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="border rounded-xl p-4 bg-white flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{q.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {q.description}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                      {q.category && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100">
                          {q.category}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-gray-100">
                        {DIFFICULTY_LABELS[q.difficulty] || q.difficulty}
                      </span>
                      {typeof q.question_count !== "undefined" && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100">
                          {q.question_count} questions
                        </span>
                      )}
                      {q.is_premium && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(q.id)}
                    className="mt-4 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
