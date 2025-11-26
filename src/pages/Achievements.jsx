import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

function Achievements() {
  const badges = [
    { title: "First Quiz Master", desc: "Completed your first quiz", xp: "500 XP", date: "2025-09-01" },
    { title: "Knowledge Seeker", desc: "Earned 10,000 XP", xp: "10,000 XP", date: "2025-10-10" },
    { title: "Daily Habit", desc: "Logged in 7 days straight", xp: "700 XP", date: "2025-11-01" },
    { title: "Top Performer", desc: "Ranked Top 10% in Leaderboard", xp: "5,000 XP", date: "2025-11-07" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8"> Your Achievements</h2>

      {/* Overview */}
      <div className="flex justify-around mb-12 text-center">
        <div>
          <p className="text-4xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">Badges Earned</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-blue-600">500</p>
          <p className="text-sm text-gray-500">Total XP</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-blue-600">1</p>
          <p className="text-sm text-gray-500">Current Level</p>
        </div>
      </div>

      {/* Badges */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {badges.map((b, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition">
            <div className="w-16 h-16 mx-auto bg-blue-50 text-3xl flex items-center justify-center rounded-full mb-3">
              🏆
            </div>
            <h3 className="font-semibold text-gray-800">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
            <p className="text-xs text-gray-400 mt-1">{b.xp}</p>
            <p className="text-xs text-gray-400">{b.date}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-semibold mb-3 text-gray-800">Your Progress & Next Goals</h4>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="font-medium text-gray-700 mb-2">
              Complete 10 Quizzes this week
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="w-2/3 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">67% complete</p>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">
              Earn 2000 XP in a single day
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="w-1/2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">50% complete</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <h5 className="font-semibold text-blue-700 mb-1">
             Grand Master Scholar
          </h5>
          <p className="text-sm text-gray-600">
            Achieve ultimate mastery and become a true BrainFuel Grand Master!
          </p>
          <Link to={Dashboard} >
          <button className="mt-3 px-4  py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View Your Progress
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
