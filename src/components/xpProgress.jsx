import React from "react";

export default function XpProgress({ currentXp, level }) {
  const maxXp = level * 100;
  const progress = (currentXp / maxXp) * 100;

  return (
    <div className="w-full mt-4">
      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1 text-center">
        {currentXp}/{maxXp} XP
      </p>
    </div>
  );
}
