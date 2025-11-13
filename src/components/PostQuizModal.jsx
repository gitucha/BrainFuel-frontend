import React from "react";

function PostQuizModal({ open, onClose, result }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">Quiz Results</h2>

        {result ? (
          <div className="space-y-3">
            <p>Score: <strong>{result.score}</strong></p>
            <p>Correct: <strong>{result.correct}</strong> / {result.total}</p>
            <p>XP Earned: <strong>{result.xp_earned}</strong></p>
            <p>Thalers Earned: <strong>{result.thalers_earned}</strong></p>
          </div>
        ) : (
          <p>Loading result...</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostQuizModal;
