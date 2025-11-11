import React from "react";

function Achievements() {
  const badges = [
    { title: "First Quiz", desc: "Completed your first quiz", xp: 50 },
    { title: "Knowledge Seeker", desc: "Earned 1000 XP", xp: 100 },
    { title: "Streak Starter", desc: "Played 5 days straight", xp: 200 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-8">Achievements & Badges</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {badges.map((b, i) => (
          <div key={i} className="bg-white p-6 rounded shadow hover:shadow-md">
            <div className="font-semibold text-blue-600">{b.title}</div>
            <p className="text-sm text-gray-500">{b.desc}</p>
            <p className="text-xs text-gray-400 mt-2">+{b.xp} XP</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
