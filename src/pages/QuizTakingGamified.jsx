import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";

// reward components
import CoinBurst from "../components/CoinBurst";
import StreakToast from "../components/StreakToast";
import ThalerToast from "../components/ThalerToast";
import XpProgress from "../components/xpProgress";
import LevelUpModal from "../components/Levelupmodal";

const fetchQuiz = async (id) => {
  const { data } = await api.get(`/quizzes/${id}/`);
  return data;
};

export default function QuizTakingGamified() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  // quiz data
  const { data: quiz, isPending } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => fetchQuiz(id),
    enabled: !!id,
  });

  // quiz UI states
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  // reward states
  const [xpGained, setXpGained] = useState(0);
  const [thalersEarned, setThalersEarned] = useState(0);
  const [streakPopup, setStreakPopup] = useState(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  // coin animation amount
  const [coinAmount, setCoinAmount] = useState(0);

  // submit quiz mutation
  const submitQuiz = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/quizzes/${id}/submit/`, payload);
      return data;
    },
    onSuccess: (data) => {
      // XP
      setXpGained(data.xp_earned || 0);

      // Thalers
      setThalersEarned(data.thalers_earned || 0);
      setCoinAmount(data.thalers_earned || 0);

      // Streak
      if (data.streak) setStreakPopup(data.streak);

      // Level up
      if (data.leveled_up) {
        setNewLevel(data.new_level);
        setLevelUpOpen(true);
      }

      // Refresh user XP + thalers
      qc.invalidateQueries(["me"]);

      // Redirect after short animation
      setTimeout(() => navigate("/dashboard"), 1800);
    },
    onError: () => {
      alert("Quiz submission failed.");
    },
  });

  // reset selected option when moving to next question
  useEffect(() => {
    setSelected(null);
  }, [index]);

  if (isPending) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6">Quiz not found.</div>;

  const q = quiz.questions[index];

  const handlePick = (optionId) => {
    setSelected(optionId);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (index === quiz.questions.length - 1) {
      submitQuiz.mutate({ answers });
      return;
    }
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-indigo-50 to-white p-6">
      {/* Avatar background */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <img
          src={user?.profile_picture || "/assets/default-avatar.png"}
          alt="avatar-bg"
          className="w-96 h-96 rounded-full object-cover blur-md"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-500 mb-3">
            Question {index + 1} / {quiz.questions.length}
          </div>

          <h2 className="text-2xl font-bold mb-6">{q.text}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePick(opt.id)}
                className={`p-4 rounded-lg text-left border transition transform
                  ${
                    selected === opt.id
                      ? "bg-yellow-100 border-yellow-500 scale-[1.02]"
                      : "bg-gray-50 border-gray-200 hover:scale-[1.01]"
                  }
                `}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
            >
              {index === quiz.questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Reward animations */}
      {xpGained > 0 && <XpProgress amount={xpGained} />}
      {thalersEarned > 0 && <ThalerToast amount={thalersEarned} />}
      {coinAmount > 0 && (
        <CoinBurst amount={coinAmount} onDone={() => setCoinAmount(0)} />
      )}

      {streakPopup && (
        <StreakToast
          streak={streakPopup}
          onClose={() => setStreakPopup(null)}
        />
      )}

      {/* Level-up modal */}
      <LevelUpModal
        open={levelUpOpen}
        level={newLevel}
        onClose={() => setLevelUpOpen(false)}
      />
    </div>
  );
}
