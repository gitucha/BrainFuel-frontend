import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Link } from "react-router-dom";

function QuizCarousel() {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["featured_quizzes"],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/?limit=10");
      return data;
    },
  });

  if (isLoading) return <div className="p-6">Loading quizzes…</div>;

  return (
    <div className="py-12 px-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Featured Quizzes
      </h2>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {quizzes?.results?.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quizzes/${quiz.id}`}
            className="min-w-[250px] bg-white shadow rounded-lg p-4 hover:scale-105 transform transition"
          >
            <h3 className="font-semibold text-lg">{quiz.title}</h3>
            <p className="text-sm text-gray-500">{quiz.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuizCarousel;
