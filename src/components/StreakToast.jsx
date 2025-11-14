import React from "react";

export default function StreakToast({ streak }) {
  if (!streak || streak < 2) return null;

  return (
    <div className="fixed top-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-bold animate-bounce z-50">
       Combo x{streak}! Keep going!
    </div>
  );
}
