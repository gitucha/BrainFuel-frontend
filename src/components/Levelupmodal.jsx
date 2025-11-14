import React from "react";

function LevelUpModal({ isOpen, level, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-10 shadow-lg text-center max-w-sm mx-auto">
        <h2 className="text-4xl font-bold text-green-600">Level Up!</h2>
        <p className="mt-4 text-gray-700 text-lg">
          Congratulations! You reached <span className="font-bold">Level {level}</span>.
        </p>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default LevelUpModal;
