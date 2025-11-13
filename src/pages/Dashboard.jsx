import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const recentQuizzes = [
    { title: "Algebra Fundamentals", progress: "85%", time: "2 days ago" },
    { title: "World History: Ancient Civilizations", progress: "92%", time: "4 days ago" },
    { title: "Introduction to Physics", progress: "78%", time: "6 days ago" },
    { title: "Literary Devices", progress: "88%", time: "1 week ago" },
  ];

  const topPlayers = [
    { name: "Emma", xp: 13500 },
    { name: "Liam", xp: 12000 },
    { name: "Olivia", xp: 11800 },
    { name: "Noah", xp: 11500 },
  ];

  const challenges = [
    "Advanced Calculus",
    "Renaissance Art",
    "Cybersecurity Basics",
    "Introduction to Chemistry",
  ];

   const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      
      <h2 className="text-3xl font-bold mb-8">Welcome, {user?.username}</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm flex flex-col items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h3 className="text-lg font-semibold">{user?.username}</h3>
          <p className="text-gray-500 text-sm">Level 7 Learner</p>

          <div className="mt-4 w-full">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">XP Progress</span>
              <span className="font-semibold">1350 / 2000</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-blue-600 w-[67%] rounded-full"></div>
            </div>
          </div>

          <Link
            to="/profile"
            className="mt-5 inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Profile
          </Link>
        </div>

        {/* Center - Ready to Learn */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Ready to Learn?</h4>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              to="/quizzes/"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start New Quiz
            </Link>
            <Link
              to="/quizzes/create"
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Create Quiz
            </Link>
          </div>

          {/* Recent Quizzes */}
          <h4 className="font-semibold mb-3">Recent Quizzes</h4>
          <div className="space-y-3 mb-8">
            {recentQuizzes.map((q, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{q.title}</p>
                  <p className="text-xs text-gray-500">{q.time}</p>
                </div>
                <span className="text-blue-600 font-semibold">{q.progress}</span>
              </div>
            ))}
          </div>

          {/* Top Players */}
          <h4 className="font-semibold mb-3">Top Players</h4>
          <div className="space-y-2">
            {topPlayers.map((p, i) => (
              <div key={i} className="flex justify-between text-sm border-b py-1">
                <span>{p.name}</span>
                <span className="text-blue-600 font-semibold">{p.xp} XP</span>
              </div>
            ))}
            <Link to="/leaderboard" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
              View Full Leaderboard →
            </Link>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="mt-10">
        <h4 className="font-semibold mb-3">New Challenges Await</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenges.map((c, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg p-5 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-gray-700">{c}</p>
              <button className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
