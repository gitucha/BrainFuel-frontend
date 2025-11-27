import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export default function Achievements() {
  const { data, isLoading } = useQuery({
    queryKey: ["achievements_overview"],
    queryFn: async () => {
      const res = await api.get("/achievements/overview/");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading achievements...</div>;
  if (!data) return <div className="p-6">No data.</div>;

  const { user, achievements } = data;
  const earnedCount = achievements.filter((a) => a.is_unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Your Achievements</h2>

      {/* Overview row */}
      <div className="flex justify-around mb-10 text-center">
        <div>
          <p className="text-4xl font-bold text-blue-600">{earnedCount}</p>
          <p className="text-sm text-gray-500">Achievements Earned</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-blue-600">{user.xp ?? 0}</p>
          <p className="text-sm text-gray-500">Total XP</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-blue-600">{user.level ?? 1}</p>
          <p className="text-sm text-gray-500">Current Level</p>
        </div>
      </div>

      {/* Vertical list with progress bars */}
      <div className="space-y-4">
        {achievements.map((a) => {
          const pct =
            a.target > 0 ? Math.min(100, Math.round((a.progress / a.target) * 100)) : 0;

          return (
            <div
              key={a.id}
              className={`p-4 rounded-lg shadow-sm border bg-white flex gap-4 items-center ${
                a.is_unlocked ? "border-green-500" : "border-gray-200"
              }`}
            >
              {/* Icon */}
              <div className="text-3xl">
                {a.is_unlocked ? (a.icon || "🏆") : "🔒"}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  <span className="text-xs text-gray-500">
                    +{a.xp_reward} XP
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {a.description || a.requirement}
                </p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        a.is_unlocked ? "bg-green-600" : "bg-blue-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {a.is_unlocked
                        ? "Unlocked"
                        : `${a.progress}/${a.target} progress`}
                    </span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
