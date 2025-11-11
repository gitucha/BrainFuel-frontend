import React from "react";

function Subscription() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-8">Premium Subscription</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Premium Plan</h3>
          <p className="mt-2 text-gray-600 text-sm">
            Unlock all quizzes, create unlimited challenges, and go ad-free.
          </p>
          <p className="mt-4 text-3xl font-bold text-blue-600">$19.99</p>
          <p className="text-sm text-gray-500 mb-4">per month</p>
          <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upgrade Now
          </button>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded shadow-sm">
          <h4 className="font-semibold mb-4">Payment History</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Oct 2025 — $19.99 — ✅ Successful</li>
            <li>Sep 2025 — $19.99 — ✅ Successful</li>
            <li>Aug 2025 — $19.99 — ✅ Successful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
