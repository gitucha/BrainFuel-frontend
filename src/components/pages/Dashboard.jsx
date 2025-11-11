import React from "react";
import SideNav from "../components/SideNav";

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <SideNav />
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Welcome, Alex Johnson!</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="font-semibold mb-2">Your Progress</div>
            <div className="w-full bg-gray-100 h-2 rounded">
              <div className="bg-blue-500 h-2 rounded" style={{ width: "60%" }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Level 7 — 65% to next level</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm lg:col-span-2">
            <h3 className="font-semibold mb-4">Recent Quizzes</h3>
            <ul className="space-y-3">
              {["Math Basics", "World History", "Intro to Python"].map((quiz) => (
                <li key={quiz} className="p-3 border rounded hover:shadow-sm flex justify-between">
                  <span>{quiz}</span>
                  <span className="text-blue-500 text-sm cursor-pointer hover:underline">View</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
