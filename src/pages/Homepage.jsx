import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <section className="bg-linear-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Unlock Your Brainpower with BrainFuel 🚀
            </h1>
            <p className="mt-6 text-gray-600">
              Dive into interactive quizzes, challenge friends, and climb leaderboards.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Get Started
              </Link>
              <Link to="/login" className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
                Login
              </Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-white shadow rounded-lg p-8 h-48 flex items-center justify-center text-blue-400">
              Learning. Reinvented.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
