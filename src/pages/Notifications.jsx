import React, { useState } from "react";

function Notifications() {
  const tabs = ["All", "Quizzes", "Rewards", "Challenges", "System"];
  const [activeTab, setActiveTab] = useState("All");

  const notifications = [
    { type: "Quiz", msg: 'You completed "Mechanical Basics Quiz"!', time: "1 hour ago" },
    { type: "Reward", msg: "You unlocked the 'Streak Starter' achievement!", time: "2 hours ago" },
    { type: "Challenge", msg: "Player Two challenged you to 'History Master'!", time: "1 day ago" },
    { type: "System", msg: "New feature update — try Minigames today!", time: "3 days ago" },
    { type: "Reward", msg: "You earned +200 XP for completing a quiz!", time: "4 days ago" },
  ];

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">🔔 Notification Center</h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {filtered.map((n, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-5 flex flex-col sm:flex-row justify-between sm:items-center shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                {n.type[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">{n.msg}</p>
                <p className="text-xs text-gray-500">{n.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button className="text-sm text-blue-600 hover:underline">
                Mark as Read
              </button>
              <button className="text-sm text-gray-500 hover:text-red-500">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
