import React from "react";
import { useNavigate } from "react-router-dom";

function Minigames() {
  const navigate = useNavigate();

  const goMode = (mode) => {
    // You can switch behaviour per mode here
    if (mode === "speed") {
      // small, fast quiz
      navigate("/categories?mode=speed&num_questions=5&difficulty=easy");
    } else if (mode === "endurance") {
      navigate(
        "/categories?mode=endurance&num_questions=15&difficulty=medium"
      );
    } else if (mode === "hardcore") {
      navigate("/categories?mode=hardcore&num_questions=10&difficulty=hard");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* HERO */}
        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500">
            Minigames
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Quick modes to warm up your brain
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Jump into short, focused sessions: speed rounds, endurance quizzes
            and hardcore challenges — all powered by the same BrainFuel
            question engine.
          </p>
        </section>

        {/* CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Speed round */}
          <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-500">
                Warm up
              </p>
              <h2 className="mt-2 text-sm font-semibold text-slate-900">
                Speed round
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                5 quick questions on easy difficulty. Perfect for a 2-minute
                focus boost.
              </p>
            </div>
            <button
              onClick={() => goMode("speed")}
              className="mt-4 w-full px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600"
            >
              Play speed round
            </button>
          </div>

          {/* Endurance mode */}
          <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-indigo-500">
                Stay sharp
              </p>
              <h2 className="mt-2 text-sm font-semibold text-slate-900">
                Endurance quiz
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                15 questions on mixed difficulty. Great for longer practice
                sessions.
              </p>
            </div>
            <button
              onClick={() => goMode("endurance")}
              className="mt-4 w-full px-4 py-2 rounded-full bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600"
            >
              Play endurance mode
            </button>
          </div>

          {/* Hardcore mode */}
          <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-red-500">
                Challenge
              </p>
              <h2 className="mt-2 text-sm font-semibold text-slate-900">
                Hardcore challenge
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                10 hard-level questions with higher XP and thaler rewards.
              </p>
            </div>
            <button
              onClick={() => goMode("hardcore")}
              className="mt-4 w-full px-4 py-2 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
            >
              Play hardcore
            </button>
          </div>
        </section>

        <section className="text-xs text-slate-500">
          Tip: all minigames use the same XP and thaler system, so they still
          count towards your level and achievements.
        </section>
      </div>
    </div>
  );
}

export default Minigames;
