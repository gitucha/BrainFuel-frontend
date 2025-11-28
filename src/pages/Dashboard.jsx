// src/pages/Dashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();

  // Local notifications (client-side only, plus count for UI)
  const STORAGE_KEY = "brainfuel_notifications";
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved)) {
      setNotifications(saved);
    } else {
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
      const next = prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
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
  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/quizzes/categories/");
        return data.categories || data;
      } catch {
        return ["General", "Science", "Math", "History", "Technology"];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recommended quizzes
  const {
    data: quizzes = [],
    isLoading: loadingQuizzes,
  } = useQuery({
    queryKey: ["recommended_quizzes"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/quizzes/?search=&premium=false");
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

  const featuredQuiz = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return null;
    const filtered = quizzes.filter((q) => {
      if (!user) return true;
      return q.created_by ? q.created_by !== user.id : true;
    });
    return filtered.length ? filtered[0] : quizzes[0];
  }, [quizzes, user]);

  const startQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const startNewQuiz = () => {
    navigate("/categories");
  };

  const goShop = () => navigate("/shop");
  const goAchievements = () => navigate("/achievements");
  const goNotifications = () => navigate("/notifications");
  const goSubscription = () => navigate("/subscription");
  const goMinigames = () => navigate("/minigames");
  const goHelp = () => navigate("/help");

  if (loadingUser) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* HERO SECTION – inspired by your screenshot */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: headline + CTAs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500 mb-3">
              Welcome back
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Fuel your brain with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                gamified quizzes.
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
              Pick a category, set your difficulty, and race against the clock.
              Earn XP, collect thalers, unlock achievements and keep your
              streak alive.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={startNewQuiz}
                className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Start a quiz
                <span className="ml-2 text-lg">▶</span>
              </button>

              {featuredQuiz && (
                <button
                  onClick={() => startQuiz(featuredQuiz.id)}
                  className="inline-flex items-center px-5 py-2.5 rounded-full border border-blue-200 bg-white/80 text-sm font-medium text-blue-700 hover:bg-white shadow-sm transition"
                >
                  Try: {featuredQuiz.title}
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Level {user?.level ?? 1} • {user?.xp ?? 0} XP •{" "}
                  {user?.thalers ?? 0} thalers
                </span>
              </div>
              <button
                onClick={goSubscription}
                className="underline-offset-4 hover:underline"
              >
                {user?.is_premium ? "Premium active" : "Upgrade to Premium"}
              </button>
            </div>
          </div>

          {/* Right: dashboard snapshot in a glass card */}
          <div className="relative">
            <div className="absolute -top-6 -right-8 w-32 h-32 bg-blue-200/40 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-indigo-200/40 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-3xl bg-white/70 border border-white/60 shadow-xl backdrop-blur-md overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Snapshot
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Today&apos;s learning
                  </p>
                </div>
                <button
                  onClick={goAchievements}
                  className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-medium"
                >
                  View achievements
                </button>
              </div>
              <div className="bg-linear-to-br from-blue-500/90 via-indigo-500/90 to-blue-700/90 px-4 py-6">
                <p className="text-xs text-blue-100 mb-1">
                  {user?.username || "Learner"}
                </p>
                <p className="text-lg font-semibold text-white mb-4">
                  Level {user?.level ?? 1} • {user?.xp ?? 0} XP
                </p>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mb-4">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${Math.min(
                        100,
                        ((user?.xp ?? 0) / ((user?.level ?? 1) * 100)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-blue-50">
                  <span>Thalers: {user?.thalers ?? 0}</span>
                  <span>Quizzes available: {quizzes?.length ?? 0}</span>
                </div>
              </div>
              {/* Motivational quote block — replaces preview image */}
              <div className="bg-slate-50 px-4 py-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-inner text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
                    “Every question you answer today
                    brings you closer to the learner
                    you're becoming tomorrow.”
                  </p>

                  <p className="mt-3 text-xs text-slate-500 tracking-wide">
                    Keep pushing. Your next level is waiting.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TOP STATS + NOTIFICATIONS SUMMARY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats column (same data, new style) */}
          {/* Weekly goals replacement card */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900">Weekly Goals</h3>

            <div>
              <p className="text-xs text-slate-500 mb-1">Quizzes to complete</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: "40%" }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">4 / 10 completed</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">XP to earn</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: "55%" }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">550 / 1000 XP</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate("/achievements")}
                className="px-4 py-2 w-full rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
              >
                View all challenges
              </button>
            </div>
          </div>


          {/* Notifications summary – instead of leaderboard preview */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
                    }`
                    : "You are all caught up."}
                </p>
              </div>
              <button
                onClick={goNotifications}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-black"
              >
                Open inbox
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {notifications.length === 0 && (
                <p className="text-xs text-slate-400">
                  No notifications yet. Complete quizzes to start getting
                  updates.
                </p>
              )}

              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between gap-3 rounded-2xl px-3 py-2 border ${n.is_read
                    ? "border-slate-100 bg-slate-50"
                    : "border-blue-100 bg-blue-50"
                    }`}
                >
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      {n.title || "Notification"}
                    </p>
                    <p className="text-[11px] text-slate-500">{n.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {!n.is_read && (
                      <button
                        onClick={() => markAsReadLocal(n.id)}
                        className="text-[10px] text-blue-700 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => dismissLocal(n.id)}
                      className="text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES STRIP */}
        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Browse categories
            </h3>
            <button
              onClick={() => navigate("/categories")}
              className="text-xs text-blue-600 hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto py-2">
            {loadingCategories ? (
              <div className="text-slate-500 text-sm px-2">
                Loading categories...
              </div>
            ) : (
              categories.map((c, idx) => (
                <button
                  key={c + "-" + idx}
                  onClick={() =>
                    navigate(
                      `/categories?category=${encodeURIComponent(
                        c
                      )}&difficulty=easy`
                    )
                  }
                  className="min-w-max px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </section>

        {/* QUIZ CARDS GRID */}
        <section className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              A new challenge awaits
            </h3>
            <div className="text-xs text-slate-500">
              {quizzes?.length ?? 0} quizzes
            </div>
          </div>

          {loadingQuizzes ? (
            <div className="p-6 text-slate-500 text-sm">
              Loading quizzes...
            </div>
          ) : quizzes.length === 0 ? (
            <div className="p-6 text-slate-500 text-sm">No quizzes found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.slice(0, 9).map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {q.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {q.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      {q.category || "General"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startQuiz(q.id)}
                        className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700"
                      >
                        Play
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/create-quiz?clone=${q.id}`)
                        }
                        className="px-2 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        Clone
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MINI-GAMES + QUICK LINKS + SUBSCRIPTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mini-games */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Mini-games
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Quick brain boosters to warm up.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">
                    Speed round
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Fast 10-question challenge
                  </div>
                </div>
                <button
                  onClick={() => navigate("/minigames/speed")}
                  className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] hover:bg-indigo-700"
                >
                  Coming soon!
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">
                    Memory match
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pair symbols with your memory
                  </div>
                </div>
                <button
                  onClick={() => navigate("/minigames/memory")}
                  className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] hover:bg-indigo-700"
                >
                  Coming soon!
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">
                    Daily duel
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Challenge friends — live
                  </div>
                </div>
                <button
                  onClick={() => navigate("/minigames/duel")}
                  className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] hover:bg-indigo-700"
                >
                  Coming soon!
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={goMinigames}
                className="text-[11px] text-blue-600 hover:underline"
              >
                See all mini-games
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900">
              Quick links
            </h4>

            <button
              onClick={goShop}
              className="w-full text-left px-4 py-3 rounded-2xl bg-yellow-50 text-xs font-medium text-slate-800 hover:bg-yellow-100"
            >
              Shop — buy thalers
            </button>

            <button
              onClick={goAchievements}
              className="w-full text-left px-4 py-3 rounded-2xl bg-emerald-50 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Achievements & progress
            </button>

            <button
              onClick={goNotifications}
              className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              Notifications ({unreadCount})
            </button>

            {/* <button
              onClick={goHelp}
              className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              
            </button> */}
          </div>

          {/* Subscription card */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Subscription
              </h4>
              <p className="text-xs text-slate-600 mt-2">
                {user?.is_premium
                  ? "You are on a Premium plan. Enjoy exclusive quizzes, extra rewards, and more."
                  : "Upgrade to unlock premium quizzes, extra rewards and priority access."}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={goSubscription}
                className="w-full px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                {user?.is_premium ? "Manage plan" : "Upgrade"}
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center py-4 text-xs text-slate-500">
          {" "}
          <button
            onClick={goHelp}
            className="text-blue-600 hover:underline"
          >
          </button>
        </section>
      </div>
    </div>
  );
}
