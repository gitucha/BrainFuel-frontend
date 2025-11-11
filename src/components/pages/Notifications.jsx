import React from "react";

function Notifications() {
  const notifications = [
    {
      title: "Quiz Completed",
      desc: "You finished 'React Basics' and earned 50 XP!",
      time: "2h ago",
    },
    {
      title: "Achievement Unlocked",
      desc: "You earned 'Knowledge Seeker' badge!",
      time: "1d ago",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="bg-white rounded shadow divide-y">
        {notifications.map((n, i) => (
          <div key={i} className="p-4 hover:bg-gray-50">
            <div className="font-semibold">{n.title}</div>
            <p className="text-sm text-gray-500">{n.desc}</p>
            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
