import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function CategoryList() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/quizzes/categories/");
      return res.data.categories;
    },
  });

  if (isLoading) return <div className="p-6">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((cat) => (
          <Link
            key={cat}
            to={`/categories/${cat}`}
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition border"
          >
            <p className="font-semibold text-lg">{cat}</p>
            <p className="text-gray-500 text-sm mt-1">View quizzes →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
