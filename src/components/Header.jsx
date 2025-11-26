import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left — Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          BrainFuel
        </Link>

        {/* Center — Main Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">

          {/* Always visible */}
          <Link to="/" className="hover:text-blue-600">Home</Link>

          {user && (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link to="/shop" className="hover:text-blue-600">Shop</Link>
              <Link to="/achievements" className="hover:text-blue-600">Achievements</Link>
              <Link to="/notifications" className="hover:text-blue-600">Notifications</Link>
              <Link to="/subscription" className="hover:text-blue-600">Subscriptions</Link>
            </>
          )}

        </nav>

        {/* Right — Auth Buttons */}
        <div className="flex items-center gap-4">

          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {user?.is_staff && (
            <Link to="/admin" className="font-medium hover:text-blue-600">
              Admin Panel
            </Link>
          )}


          {user && (
            <>
              <span className="text-gray-600 hidden sm:inline">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
