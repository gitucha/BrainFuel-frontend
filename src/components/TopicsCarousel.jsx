import React from "react";

const topics = [
  { name: "Mathematics", color: "bg-blue-200" },
  { name: "Science", color: "bg-green-200" },
  { name: "Geography", color: "bg-yellow-200" },
  { name: "History", color: "bg-red-200" },
  { name: "Computer Science", color: "bg-purple-200" },
];

function TopicsCarousel() {
  return (
    <div className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Explore Topics
      </h2>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {topics.map((t, i) => (
          <div
            key={i}
            className={`min-w-[180px] ${t.color} text-black p-6 rounded-xl shadow hover:scale-105 transition`}
          >
            <h3 className="font-bold text-lg">{t.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopicsCarousel;
