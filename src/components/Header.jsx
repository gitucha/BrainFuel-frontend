import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const { pathname } = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Achievements", path: "/achievements" },
    { name: "Shop", path: "/shop" },
    { name: "Minigames", path: "/minigames" },
    { name: "Subscription", path: "/subscription" },
    { name: "Notifications", path: "/notifications" },
    { name: "Dashboard", path: "/dashboard" },
    {}
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          BrainFuel
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-blue-600 ${
                pathname === link.path ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
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
