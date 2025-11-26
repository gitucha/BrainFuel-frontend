import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

/**
 * Dashboard.jsx
 * Option 3: OG layout + upgraded features
 *
 * Drop into src/pages/Dashboard.jsx (replace existing Dashboard if any)
 */

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();

  // Local notifications (client-side only)
  const STORAGE_KEY = "brainfuel_notifications";
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved)) {
      setNotifications(saved);
    } else {
      // default if none
      const defaults = [
        {
          id: 1,
          title: "Welcome to BrainFuel",
          message: "Tip: try the daily challenge to earn extra thalers!",
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      setNotifications(defaults);
    }
  }, []);

  const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

  const markAsReadLocal = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const dismissLocal = (id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/quizzes/categories/");
        return data.categories || data; // accept {categories: [...]} or raw list
      } catch {
        // fallback: simple static categories if backend not ready
        return ["General", "Science", "Math", "History", "Technology"];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recommended quizzes (top recent approved)
  const { data: quizzes = [], isLoading: loadingQuizzes } = useQuery({
    queryKey: ["recommended_quizzes"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/quizzes/?search=&premium=false");
        // backend likely returns paginated, so normalize
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        if (Array.isArray(data.data)) return data.data;
        return [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60,
  });

  // pick featured quiz for Ready-to-Learn card
  const featuredQuiz = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return null;
    // prefer quizzes created_by !== user to surface public quizzes
    const filtered = quizzes.filter((q) => {
      if (!user) return true;
      return q.created_by ? q.created_by !== user.id : true;
    });
    return filtered.length ? filtered[0] : quizzes[0];
  }, [quizzes, user]);

  // helper: start quiz (go to quiz taking enhanced)
  const startQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  // start new quiz - go to categories page (user picks category & difficulty)
  const startNewQuiz = () => {
    navigate("/categories");
  };

  // nav quick links
  const goShop = () => navigate("/shop");
  const goAchievements = () => navigate("/achievements");
  const goNotifications = () => navigate("/notifications");
  const goSubscription = () => navigate("/subscription");
  const goMinigames = () => navigate("/minigames");

  if (loadingUser) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Row: welcome + stats + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Welcome / Ready card (big) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back{user?.username ? `, ${user.username}` : ""} 👋
                </h1>
                <p className="text-gray-600 mt-2">
                  Ready to learn? Pick a category or jump into a recommended quiz.
                </p>

                {/* Dynamic CTA */}
                <div className="mt-6 flex gap-4 items-center">
                  <button
                    onClick={startNewQuiz}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                  >
                    Start a New Quiz
                  </button>

                  {featuredQuiz && (
                    <button
                      onClick={() => startQuiz(featuredQuiz.id)}
                      className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Try featured: {featuredQuiz.title}
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications & subscription quick */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={goNotifications}
                    className="relative px-3 py-2 bg-white border rounded-full hover:shadow-sm"
                    aria-label="Notifications"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={goSubscription}
                    className="px-3 py-2 bg-white border rounded-md hover:shadow-sm text-sm"
                  >
                    {user?.is_premium ? "Premium" : "Free"} • Manage
                  </button>
                </div>

                <div className="text-right text-sm text-gray-500">
                  <div>
                    <span className="font-semibold text-gray-800">
                      {user?.username || "Learner"}
                    </span>
                  </div>
                  <div>Member since: {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-500">Level</div>
              <div className="text-xl font-bold">{user?.level ?? 1}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">XP</div>
              <div className="text-xl font-bold">{user?.xp ?? 0}</div>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="h-2 rounded bg-blue-600"
                  style={{
                    width: `${Math.min(100, ((user?.xp ?? 0) / ((user?.level ?? 1) * 100)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Thalers</div>
              <div className="text-xl font-bold">{user?.thalers ?? 0}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={goShop} className="px-3 py-2 bg-yellow-100 rounded-md">
                  Buy Thalers
                </button>
                <button onClick={goAchievements} className="px-3 py-2 bg-green-50 rounded-md">
                  Achievements
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories strip */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Browse Categories</h3>
            <button
              onClick={() => navigate("/categories")}
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto py-2">
            {loadingCategories ? (
              <div className="text-gray-500 px-2">Loading categories...</div>
            ) : (
              categories.map((c, idx) => (
                <button
                  key={c + "-" + idx}
                  onClick={() => navigate(`/categories?category=${encodeURIComponent(c)}&difficulty=easy`)}
                  className="min-w-max px-4 py-2 bg-white border rounded-xl shadow-sm hover:shadow-md"
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>

        {/* New challenge awaits - cards carousel */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">A New Challenge Awaits</h3>
            <div className="text-sm text-gray-500">{quizzes?.length ?? 0} quizzes</div>
          </div>

          {loadingQuizzes ? (
            <div className="p-6 text-gray-500">Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div className="p-6 text-gray-500">No quizzes found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.slice(0, 9).map((q) => (
                <div key={q.id} className="p-4 border rounded-lg bg-white flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{q.title}</h4>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{q.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">{q.category || "General"}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startQuiz(q.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => navigate(`/create-quiz?clone=${q.id}`)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        Clone
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini-games & utilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h4 className="font-semibold mb-3">Mini-Games</h4>
            <p className="text-sm text-gray-500 mb-3">Quick brain boosters to warm up.</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Speed Round</div>
                  <div className="text-xs text-gray-500">Fast 10-question challenge</div>
                </div>
                <button onClick={() => navigate("/minigames/speed")} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
                  Play
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Memory Match</div>
                  <div className="text-xs text-gray-500">Pair symbols with your memory</div>
                </div>
                <button onClick={() => navigate("/minigames/memory")} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
                  Play
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Daily Duel</div>
                  <div className="text-xs text-gray-500">Challenge friends — live</div>
                </div>
                <button onClick={() => navigate("/minigames/duel")} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
                  Play
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button onClick={goMinigames} className="text-sm text-blue-600 hover:underline">See all minigames</button>
            </div>
          </div>

          {/* Quick links: Shop / Achievements / Notifications */}
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col gap-3">
            <h4 className="font-semibold">Quick Links</h4>

            <button onClick={goShop} className="w-full text-left px-4 py-3 bg-yellow-50 rounded-md">
              Shop — Buy Thalers
            </button>

            <button onClick={goAchievements} className="w-full text-left px-4 py-3 bg-green-50 rounded-md">
              Achievements & Progress
            </button>

            <button onClick={goNotifications} className="w-full text-left px-4 py-3 bg-white border rounded-md">
              Notifications ({unreadCount})
            </button>
          </div>

          {/* Subscription / Promo card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-semibold">Subscription</h4>
              <p className="text-sm text-gray-600 mt-2">
                {user?.is_premium ? "You are on a Premium plan. Enjoy exclusive quizzes." : "Upgrade to unlock premium quizzes & perks."}
              </p>
            </div>

            <div className="mt-4">
              <button onClick={goSubscription} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">
                {user?.is_premium ? "Manage Plan" : "Upgrade"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer small CTA */}
        <div className="text-center py-6 text-gray-500">
          <div>Need help? Visit our <button onClick={() => navigate("/help")} className="text-blue-600 hover:underline">Help Center</button></div>
        </div>
      </div>
    </div>
  );
}
