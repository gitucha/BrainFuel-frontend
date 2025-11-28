import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import brain from "../assets/brain.jpeg";

function HomePage() {
  const { user, loadingUser } = useAuth();

  // Tiny loader while auth is resolving
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:.15s]" />
          <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:.3s]" />
        </div>
      </div>
    );
  }

  // ==========================
  // LOGGED-IN VARIANT
  // ==========================
  if (user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#88acde] via-white to-[#264eb0]">
        {/* HERO / QUICK START */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">
            {/* Left: text + CTA */}
            <div className="lg:w-3/5 text-slate-900">
              <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                Welcome back, {user.username || "Learner"}.
              </h1>
              <p className="mt-4 text-slate-600 max-w-xl text-sm md:text-base">
                Pick up where you left off, smash a quick quiz, or chase a new achievement.
                Your progress, thalers, and streaks are all synced.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 text-sm transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/categories"
                  className="px-5 py-2 rounded-full border border-blue-200 text-sm text-blue-700 bg-white/70 backdrop-blur hover:bg-white shadow-sm transition-all"
                >
                  Browse Categories
                </Link>
                <Link
                  to="/shop"
                  className="px-5 py-2 rounded-full border border-blue-200 text-sm text-blue-700 bg-white/70 backdrop-blur hover:bg-white shadow-sm transition-all"
                >
                  Spend Thalers
                </Link>
              </div>
            </div>

            {/* Right: quick stats card */}
            <div className="lg:w-2/5">
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-6 text-slate-900 border border-white/60">
                <h2 className="text-sm font-semibold text-slate-500 mb-3">
                  Your Quick Snapshot
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Level</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {user.level ?? 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">XP</p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {user.xp ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Thalers</p>
                    <p className="text-2xl font-bold text-amber-500">
                      {user.thalers ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-slate-500 mb-1">XP to next level</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-linear-to-r from-blue-500 to-indigo-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((user?.xp ?? 0) / ((user?.level ?? 1) * 100)) * 100
                        ).toFixed(0)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 text-xs text-slate-500 flex justify-between">
                  <span>Member since</span>
                  <span>
                    {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECOND ROW: SHORTCUTS */}
        <section className="max-w-6xl mx-auto px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/minigames"
              className="bg-white rounded-3xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition"
            >
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                Warm up
              </p>
              <h3 className="mt-2 font-bold text-slate-900">
                Play a quick minigame
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Speed rounds and brain teasers to get you focused in under 5 minutes.
              </p>
            </Link>

            <Link
              to="/achievements"
              className="bg-white rounded-3xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition"
            >
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
                Achievements
              </p>
              <h3 className="mt-2 font-bold text-slate-900">
                Check what to unlock next
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                See earned achievements and remaining goals to hit your next milestone.
              </p>
            </Link>

            <Link
              to="/notifications"
              className="bg-white rounded-3xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition"
            >
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                Notifications
              </p>
              <h3 className="mt-2 font-bold text-slate-900">
                View your latest alerts
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                See quiz rewards, payment updates, and important messages in one place.
              </p>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // ==========================
  // LOGGED-OUT (MARKETING) VARIANT
  // ==========================
  return (
    <div className="min-h-screen bg-linear-to-br from-[#eef4ff] via-white to-[#dce6ff]">
      {/* HERO */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Unlock Your Brainpower with BrainFuel
              <span className="block text-blue-700 text-3xl mt-2">
                Gamified learning that actually sticks.
              </span>
            </h1>
            <p className="mt-6 text-slate-600 max-w-xl text-sm md:text-base">
              Join interactive quizzes, compete with friends, and climb the
              leaderboards. Learn faster, remember longer, and have fun doing it.
            </p>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="inline-block px-7 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 text-sm font-semibold"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="inline-block px-6 py-3 border rounded-full text-slate-700 bg-white/80 hover:bg-white text-sm"
              >
                Log In
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              No credit card required for sign-up • Designed for students, self-learners and teams.
            </p>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-lg w-full max-w-md mx-auto border border-white/60">
              <div className="h-56 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center text-blue-500 font-semibold overflow-hidden">
                <img
                  src={brain}
                  alt="BrainFuel illustration"
                  className="h-47 w-43 object-cover rounded-xl mb-2"
                />
                <p className="text-sm">We Make It Work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-semibold mb-4">
          Ignite Your Learning Journey
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8 text-sm">
          BrainFuel turns studying into a game: quizzes, streaks, XP, thalers,
          and achievements — all working together to keep you hooked.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              t: "Interactive Quizzes",
              d: "Dynamic question types, instant feedback, and clear explanations.",
            },
            {
              t: "Gamified Leaderboards",
              d: "Compete with friends and see where you rank globally.",
            },
            {
              t: "Personalized Progress",
              d: "Track your XP, level, and thalers to see steady improvement.",
            },
            {
              t: "Create Your Own Quizzes",
              d: "Design and share quizzes for school, work, or fun.",
            },
            {
              t: "Community Challenges",
              d: "Join weekly challenges and themed events to stay consistent.",
            },
            {
              t: "Smart Recommendations",
              d: "Get suggested quizzes based on performance and interests.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  ★
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{f.t}</h3>
                  <p className="text-sm text-slate-500 mt-1">{f.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-semibold">How BrainFuel Fits Into Your Day</h3>
          <p className="text-slate-500 mt-2 mb-8 text-sm">
            Quick, focused sessions you can complete between classes, work, or on the go.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 border rounded-2xl bg-slate-50">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <h4 className="mt-4 font-semibold">Sign Up & Explore</h4>
              <p className="text-sm text-slate-500 mt-2">
                Create your free account and browse quizzes by category and difficulty.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-slate-50">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <h4 className="mt-4 font-semibold">Play Short Sessions</h4>
              <p className="text-sm text-slate-500 mt-2">
                Finish 5–10 questions at a time and see instant XP and thaler rewards.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-slate-50">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <h4 className="mt-4 font-semibold">Level Up & Master Topics</h4>
              <p className="text-sm text-slate-500 mt-2">
                Climb levels, unlock achievements, and see your knowledge compound.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-linear-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold">
            Ready to supercharge your learning?
          </h3>
          <p className="text-slate-500 mt-2 mb-6 text-sm">
            Join BrainFuel and turn your study time into something you look forward to.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 text-sm font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 border rounded-full text-slate-700 hover:bg-white text-sm bg-white/80"
            >
              Existing User? Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
