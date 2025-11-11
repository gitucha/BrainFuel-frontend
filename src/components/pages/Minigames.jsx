import React from "react";

function Minigames() {
  const games = [
    { title: "Memory Match", desc: "Test your recall skills!" },
    { title: "Word Scramble", desc: "Unscramble the words for XP!" },
    { title: "Trivia Time", desc: "General knowledge challenge!" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Mini Games</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {games.map((g) => (
          <div key={g.title} className="bg-white p-6 rounded shadow hover:shadow-md">
            <div className="font-semibold text-blue-600">{g.title}</div>
            <p className="text-sm text-gray-500">{g.desc}</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Minigames;
