import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function CategoryQuizzes() {
  const { name, difficulty } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["category_quizzes", name, difficulty],
    queryFn: async () => {
      const res = await api.get(
        `/quizzes/?category=${name}&difficulty=${difficulty}`
      );
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading quizzes...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {name} — {difficulty} quizzes
      </h1>

      <div className="grid gap-4">
        {data.length === 0 && (
          <p className="text-gray-500">No quizzes available.</p>
        )}

        {data.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quizzes/${quiz.id}`}
            className="block p-5 bg-white border rounded-xl shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-lg">{quiz.title}</h3>
            <p className="text-gray-500 mt-1">{quiz.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

