import React, { useState } from "react";

function Minigames() {
  const [spinCount, setSpinCount] = useState(1);
  const [result, setResult] = useState("");

  const handleSpin = () => {
    if (spinCount <= 0) return;
    const prizes = ["+50 XP", "+100 Coins", "Try Again", "+200 XP", "Bonus Badge!"];
    const reward = prizes[Math.floor(Math.random() * prizes.length)];
    setResult(reward);
    setSpinCount(spinCount - 1);
  };

  const minigames = [
    { title: "Memory Match", desc: "Flip and find the pairs to test your memory!", xp: "+50 XP" },
    { title: "Word Scramble", desc: "Unscramble the words in record time!", xp: "+40 XP" },
    { title: "Quick Math", desc: "Solve math problems under pressure!", xp: "+60 XP" },
    { title: "Trivia Master", desc: "Prove your knowledge in random topics!", xp: "+75 XP" },
  ];

  const challenges = [
    { title: "History of Science", xp: "+200 XP" },
    { title: "World Geography", xp: "+220 XP" },
    { title: "Literary Classics", xp: "+180 XP" },
    { title: "Advanced Chemistry", xp: "+240 XP" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER */}
      <h2 className="text-3xl font-bold text-center mb-10">🎮 Minigames & Quizzes</h2>

      {/* DAILY SPIN SECTION */}
      <div className="bg-white p-8 rounded-xl shadow-sm text-center mb-12">
        <h3 className="text-xl font-semibold text-blue-700">Daily Spin & Rewards</h3>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          Spin the wheel for a chance to win amazing daily prizes and XP boosts!
        </p>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 border-[6px] border-blue-200 rounded-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
            <div className="text-2xl font-semibold text-blue-600">
              🎡 Spin!
            </div>
          </div>
          <button
            onClick={handleSpin}
            disabled={spinCount <= 0}
            className={`mt-6 px-6 py-2 rounded-md ${
              spinCount > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {spinCount > 0 ? "Spin Now" : "No Spins Left"}
          </button>

          {result && (
            <p className="mt-4 text-green-600 font-semibold text-lg">
               You won {result}!
            </p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Spins Left: {spinCount}
          </p>
        </div>
      </div>

      {/* AVAILABLE MINIGAMES */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Available Minigames
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {minigames.map((game, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="h-28 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center rounded-md text-4xl">
                🎲
              </div>
              <h4 className="font-semibold mt-4 text-blue-700">{game.title}</h4>
              <p className="text-sm text-gray-500 mt-2">{game.desc}</p>
              <p className="text-xs text-gray-400 mt-2">{game.xp}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Coming soon!
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGE QUIZZES */}
      <section>
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Challenge Quizzes
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((quiz, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="font-semibold text-gray-800">{quiz.title}</div>
              <p className="text-sm text-gray-500 mt-2">{quiz.xp}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Minigames;

