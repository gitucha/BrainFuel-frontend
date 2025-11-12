import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideNav() {
  const { pathname } = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Quizzes", path: "/quiz-taking" },
    { name: "Create Quiz", path: "/create-quiz" },
    { name: "Leaderboards", path: "/leaderboard" },
    { name: "Achievements", path: "/achievements" },
    { name: "Shop", path: "/shop" },
    { name: "Minigames", path: "/minigames" },
    { name: "Notifications", path: "/notifications" },
  ];

  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div className="bg-white rounded shadow-sm p-4 sticky top-24">
        <h3 className="font-semibold text-gray-700 mb-4">Navigation</h3>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block px-3 py-2 rounded text-sm ${
                  pathname === link.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default SideNav;
