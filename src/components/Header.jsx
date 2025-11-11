import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          BrainFuel
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/leaderboard" className="hover:text-blue-600">
            Leaderboard
          </Link>
          <Link to="/achievements" className="hover:text-blue-600">
            Achievements
          </Link>
          <Link to="/shop" className="hover:text-blue-600">
            Shop
          </Link>
          <Link to="/subscription" className="hover:text-blue-600">
            Premium
          </Link>
        </nav>

        <Link
          to="/login"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          Login
        </Link>
      </div>
    </header>
  );
}

export default Header;
