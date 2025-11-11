import React from "react";

function Leaderboard() {
  const data = [
    { rank: 1, name: "Alex J.", xp: 12000 },
    { rank: 2, name: "Mary P.", xp: 11700 },
    { rank: 3, name: "James L.", xp: 11050 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      <div className="bg-white rounded shadow-sm p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Rank</th>
              <th className="py-2">User</th>
              <th className="py-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.rank} className="border-b hover:bg-gray-50">
                <td className="py-2 font-bold text-blue-600">{p.rank}</td>
                <td>{p.name}</td>
                <td>{p.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
