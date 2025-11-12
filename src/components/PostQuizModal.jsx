import React from "react";

export default function PostQuizModal({ open, onClose, result }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Quiz Summary</h3>

        {result ? (
          <div className="space-y-3">
            <p className="text-gray-700">
              Score: <span className="font-semibold">{result.score}</span>
            </p>
            <p className="text-gray-700">
              Correct: <span className="font-semibold">{result.correct_count}</span>
            </p>
            <p className="text-gray-700">
              XP Earned: <span className="font-semibold">{result.xp_earned}</span>
            </p>
            {result.feedback && (
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                {result.feedback}
              </div>
            )}
          </div>
        ) : (
          <div>Loading results…</div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-blue-600 text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
