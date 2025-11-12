import React from "react";

function Leaderboard() {
  const data = [
    { rank: 1, name: "Player One", xp: "12,500", category: "Overall" },
    { rank: 2, name: "Brain Master", xp: "11,200", category: "Overall" },
    { rank: 3, name: "Quiz Legend", xp: "10,950", category: "Overall" },
    { rank: 4, name: "Data Genius", xp: "9,800", category: "Science" },
    { rank: 5, name: "Word Wizard", xp: "9,400", category: "Literature" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Global Leaderboard </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-500">Sort by:</label>
            <select className="border rounded px-3 py-2 text-sm">
              <option>All Players</option>
              <option>Friends</option>
              <option>Category</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search players..."
            className="border rounded px-3 py-2 text-sm w-56"
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3">Rank</th>
              <th>Player</th>
              <th>XP</th>
              <th>Category</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 font-semibold text-blue-600">{p.rank}</td>
                <td>{p.name}</td>
                <td>{p.xp}</td>
                <td>{p.category}</td>
                <td className="text-right pr-4">
                  <button className="text-blue-600 text-sm hover:underline">
                    Challenge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;

