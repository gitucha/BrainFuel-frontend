import React from "react";

function LevelUpModal({ open, xp, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-2">Level Up</h2>
        <p className="text-gray-600 mb-4">You earned {xp} XP</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default LevelUpModal;
