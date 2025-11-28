// src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const baseNavLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Quizzes" },
  { to: "/multiplayer", label: "Multiplayer" },
  { to: "/achievements", label: "Achievements" },
  { to: "/shop", label: "Shop" },
  { to: "/subscription", label: "Subscription" },

];

function Header() {
  const { user, logout } = useAuth();

  // Build nav dynamically so we append admin link only for admins
  const navLinks = [...baseNavLinks];

  if (user?.is_admin || user?.is_staff) {
    navLinks.push({
      to: "/admin",
      label: "Admin Panel",
    });
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur-md bg-white/60 border-b border-white/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500
              flex items-center justify-center text-white text-xs font-extrabold shadow">
              BF
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                BrainFuel
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Gamified Learning
              </span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 rounded-full px-1 py-1 border border-white/60 shadow-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "px-3.5 py-1.5 text-xs font-medium rounded-full transition",
                    isActive
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Username + Plan */}
                <span className="hidden sm:flex flex-col items-end text-[11px] leading-tight text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {user.username}
                  </span>

                  <span>
                    {user.is_premium ? "Premium Plan" : "Free Plan"}
                  </span>
                </span>

                {/* Dashboard button */}
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow hover:bg-blue-700"
                >
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="text-[11px] text-slate-500 hover:text-slate-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
