import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Title */}
      <h1 className="text-xl font-semibold mb-6">User Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR – SAME AS YOUR ORIGINAL UI */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm">
          <nav className="flex flex-col gap-4 text-gray-600">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/my-quizzes" className="hover:text-blue-600">My Quizzes</Link>
            <Link to="/create-quiz" className="hover:text-blue-600">Create Quiz</Link>
            <Link to="/settings" className="hover:text-blue-600">Settings</Link>
          </nav>
        </aside>

        {/* MAIN AREA */}
        <main className="lg:col-span-3 flex flex-col gap-6">

          {/* TOP WELCOME / USER CARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* USER CARD */}
            <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-1">
              <div className="flex flex-col items-center text-center">
                <img
                  src={user?.profile_picture || "/assets/default-avatar.png"}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                  alt="avatar"
                />
                <h2 className="text-xl font-semibold">{user?.username}</h2>

                <div className="mt-4 text-sm text-gray-500">
                  <p>XP Progress</p>
                  <p className="font-semibold">{user?.xp} / {user?.level * 100}</p>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  <p>Level</p>
                  <p className="font-semibold">{user?.level}</p>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  <p>Thalers</p>
                  <p className="font-semibold">{user?.thalers}</p>
                </div>

                <Link
                  to="/categories"
                  className="px-4 py-2 rounded bg-blue-600 text-white shadow hover:bg-blue-700"
                >
                  Browse Categories
                </Link>

              </div>
            </div>

            {/* START QUIZ BOX */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm md:col-span-2 flex flex-col justify-between">
              <h3 className="text-lg font-semibold">Ready to Learn?</h3>

              <div className="flex gap-4 mt-6">
                <Link
                  to="/quizzes"
                  className="flex-1 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start New Quiz
                </Link>

                <Link
                  to="/create-quiz"
                  className="flex-1 py-3 text-center border rounded-lg bg-white hover:bg-gray-50"
                >
                  Create Quiz
                </Link>
              </div>
            </div>
          </div>

          {/* RECENT QUIZZES + TOP PLAYERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Quizzes */}
            <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2">
              <h3 className="font-semibold mb-4">Recent Quizzes</h3>
              <p className="text-gray-500 text-sm">Feature pending — backend hookup next.</p>
            </div>

            {/* Top Players */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Top Players</h3>
              <p className="text-gray-500 text-sm">Leaderboard coming after this.</p>
            </div>
          </div>

          {/* NEW CHALLENGES */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4">New Challenges Await!</h3>
            <p className="text-gray-500 text-sm">We plug actual quizzes here next.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
