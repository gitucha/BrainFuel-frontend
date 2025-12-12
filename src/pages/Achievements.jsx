// src/pages/Achievements.jsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function Achievements() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [earnedEntries, setEarnedEntries] = useState([]); // array of UserAchievement objects (may contain nested achievement)
  const [allAchievements, setAllAchievements] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (user) {
          // Authenticated: prefer /achievements/my/ which returns { earned: [...], locked: [...] }
          const myRes = await api.get("/achievements/my/");
          if (!mounted) return;

          // myRes.data might be { earned: [...], locked: [...] }
          const earned = Array.isArray(myRes.data.earned) ? myRes.data.earned : [];
          const lockedFromMy = Array.isArray(myRes.data.locked) ? myRes.data.locked : [];

          setEarnedEntries(earned);

          // To get canonical full list we should prefer /achievements/all/ if available,
          // otherwise combine earned + locked returned by the my endpoint
          try {
            const allRes = await api.get("/achievements/all/");
            if (!mounted) return;
            setAllAchievements(Array.isArray(allRes.data) ? allRes.data : []);
          } catch (errAll) {
            // fallback: construct all list from earned + locked from myRes
            const combined = [
              ...earned.map((ua) => (ua.achievement ? ua.achievement : { id: ua.achievement_id, title: ua.title } )),
              ...lockedFromMy,
            ];
            setAllAchievements(combined);
          }

          // optional overview endpoint (may not exist)
          try {
            const ov = await api.get("/achievements/overview/");
            if (!mounted) return;
            setOverview(ov.data);
          } catch (_) {
            // ignore
            setOverview(null);
          }
        } else {
          // Not authenticated: fetch all achievements
          const allRes = await api.get("/achievements/all/");
          if (!mounted) return;
          setAllAchievements(Array.isArray(allRes.data) ? allRes.data : []);
          setEarnedEntries([]); // none
          // optional overview
          try {
            const ov = await api.get("/achievements/overview/");
            if (!mounted) return;
            setOverview(ov.data);
          } catch (_) {
            setOverview(null);
          }
        }
      } catch (err) {
        console.error("Achievements fetch error:", err);
        if (!mounted) {
          return;
        }
        const msg =
          err?.response?.data?.detail ||
          (err?.response
            ? JSON.stringify(err.response.data).slice(0, 200)
            : "Could not load achievements right now.");
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Build canonical unlocked list and locked list.
  // earnedEntries may be list of UserAchievement objects with .achievement nested
  const unlockedFromEarned = earnedEntries
    .map((ua) => {
      if (!ua) return null;
      if (ua.achievement) return ua.achievement;
      // support alternative shape: { achievement_id } or { achievementId }
      if (ua.achievement_id) {
        // try to find the achievement object in allAchievements by id
        const found = allAchievements.find((a) => +a.id === +ua.achievement_id);
        if (found) return found;
        // fallback minimal placeholder
        return { id: ua.achievement_id, title: ua.title || "Achievement" };
      }
      return null;
    })
    .filter(Boolean);

  // When backend provided locked list directly within /my/ we'd also have used it to build allAchievements fallback.
  // Build sets
  const unlockedIds = new Set(unlockedFromEarned.map((a) => +a.id));
  const unlocked = unlockedFromEarned;
  const locked = allAchievements.filter((a) => !unlockedIds.has(+a.id));

  const total = allAchievements.length;
  const unlockedCount = unlocked.length;
  const lockedCount = locked.length;
  const percentUnlocked = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
        <div className="flex items-center gap-3 bg-white/80 border border-white/60 rounded-3xl px-6 py-4 shadow-md">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:.15s]" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:.3s]" />
          <span className="text-xs text-slate-700">Loading your achievements…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-3xl shadow p-6 max-w-sm text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <p className="text-xs text-slate-500">Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* HERO / OVERVIEW */}
        <section className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500">Achievements</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your achievement journey</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {user?.username || "Learner"}, unlock badges by completing quizzes, earning XP and keeping your streak alive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Achievements earned</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-700">{unlockedCount}</p>
              <p className="text-[11px] text-slate-500 mt-1">out of {total || 0}</p>
            </div>

            <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Progress</p>
              <div className="mt-3 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" style={{ width: `${percentUnlocked}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">{percentUnlocked}% of achievements unlocked</p>
            </div>

            <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">XP from achievements</p>
              <p className="mt-2 text-3xl font-extrabold text-indigo-700">{overview?.xp_from_achievements ?? 0}</p>
              <p className="text-[11px] text-slate-500 mt-1">bonus XP</p>
            </div>

            <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Next milestone</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                Unlock {Math.max(1, 3 - (unlockedCount % 3))} more to hit your next tier.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Play quizzes daily to progress faster.</p>
            </div>
          </div>
        </section>

        {/* UNLOCKED vs LOCKED */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UNLOCKED */}
          <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Unlocked achievements</h2>
                <p className="text-[11px] text-slate-500">These are the badges you’ve already earned.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700">{unlockedCount} unlocked</span>
            </div>

            {unlocked.length === 0 ? (
              <p className="text-xs text-slate-500">You haven't unlocked any achievements yet. Play a quiz to earn your first badge.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {unlocked.map((a) => {
                  // find earned entry for earned_at
                  const earnedMeta = earnedEntries.find(
                    (ua) =>
                      (ua.achievement && +ua.achievement.id === +a.id) ||
                      ua.achievement_id === +a.id
                  );
                  const earnedAt = earnedMeta?.earned_at;

                  return (
                    <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">🏆</div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                          <p className="text-[11px] text-slate-600 mt-0.5">{a.description || a.requirement}</p>
                          <p className="text-[10px] text-emerald-700 mt-1">+{a.xp_reward || 0} XP</p>
                          {earnedAt && <p className="text-[10px] text-slate-400 mt-0.5">Earned on {new Date(earnedAt).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LOCKED */}
          <div className="bg-white/80 border border-white/70 rounded-3xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Locked achievements</h2>
                <p className="text-[11px] text-slate-500">See what you need to do to unlock the next badges.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-[11px] font-semibold text-white">{lockedCount} locked</span>
            </div>

            {locked.length === 0 ? (
              <p className="text-xs text-slate-500">You have unlocked all available achievements. More are coming soon.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {locked.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">🔒</div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                        <p className="text-[11px] text-slate-600 mt-0.5">{a.requirement || a.description}</p>
                        <p className="text-[10px] text-blue-600 mt-1">Reward: {a.xp_reward || 0} XP</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tip: play quizzes regularly to unlock this faster.</p>
                      </div>
                    </div>
                    <div className="w-28">
                      <div className="text-[11px] text-slate-500 mb-1">Progress</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full">
                        {/* we don't have per-achievement progress tracking server-side; show 0% placeholder */}
                        <div className="h-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" style={{ width: `0%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
