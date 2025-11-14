import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DifficultySelection() {
  const { name } = useParams();
  const navigate = useNavigate();

  const selectDifficulty = (difficulty) => {
    navigate(`/categories/${name}/${difficulty}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Select Difficulty for {name}
      </h1>

      <div className="grid gap-4">
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            onClick={() => selectDifficulty(d)}
            className="p-6 bg-white border rounded-xl shadow hover:shadow-md text-left"
          >
            <p className="text-lg font-semibold capitalize">{d}</p>
            <p className="text-gray-500 text-sm mt-1">
              {d === "easy" && "Warm-up questions."}
              {d === "medium" && "Balanced challenge."}
              {d === "hard" && "High difficulty."}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
