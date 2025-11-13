import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import CoinBurst from "../components/CoinBurst";
import LevelUpModal from "../components/LevelUpModal";
import ThalerToast from "../components/ThalerToast";
import { useAuth } from "../hooks/useAuth";

const fetchQuiz = async (id) => {
  const { data } = await api.get(`/quizzes/${id}/`);
  return data;
};

function QuizTakingGamified() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: quiz, isPending: loading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => fetchQuiz(id),
    enabled: !!id,
  });

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showCoin, setShowCoin] = useState(0);
  const [levelXp, setLevelXp] = useState(null);
  const [thalerToast, setThalerToast] = useState(null);

  const submitMut = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/quizzes/${id}/submit/`, payload);
      return data;
    },
    onSuccess: (data) => {
      if (data.thalers_earned) setShowCoin(data.thalers_earned);
      if (data.xp_earned) setLevelXp(data.xp_earned);
      if (data.thalers_earned) setThalerToast(data.thalers_earned);

      qc.invalidateQueries({ queryKey: ["me"] });

      // Delay so animations show before redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    },

    onError: () => alert("Submit failed"),
  });

  useEffect(() => { setSelected(null); }, [index]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!quiz) return null;

  const q = quiz.questions[index];

  const handlePick = (optId) => {
    setSelected(optId);
    setAnswers((a) => ({ ...a, [q.id]: optId }));
  };

  const next = () => {
    if (index >= quiz.questions.length - 1) {
      // submit
      submitMut.mutate({ answers });
      return;
    }
    setIndex((i) => i + 1);
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  // layout: avatar background + podium image + q top + 4 answers in 2x2 grid
  return (
    <div className="relative min-h-screen bg-linear-to-b from-indigo-50 to-white p-6">
      {/* Avatar background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <img src={user?.profile_picture || "/assets/default-avatar.png"} alt="avatar" className="w-96 h-96 rounded-full object-cover filter blur-sm" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* podium */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
            <div className="text-sm text-gray-500 mb-3">Question {index + 1} / {quiz.questions.length}</div>
            <h3 className="text-2xl font-semibold mb-4">{q.text}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options.map(opt => (
                <button key={opt.id} onClick={() => handlePick(opt.id)}
                  className={`p-4 rounded-lg border text-left transition transform ${selected === opt.id ? "border-yellow-500 bg-yellow-50 scale-102" : "border-gray-200 hover:scale-101"
                    }`}>
                  {opt.text}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button onClick={prev} disabled={index === 0} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Difficulty: {quiz.difficulty}</div>
                <button onClick={next} className="px-6 py-2 bg-blue-600 text-white rounded">{index === quiz.questions.length - 1 ? "Finish" : "Next"}</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Coin burst */}
      <CoinBurst amount={showCoin} onDone={() => setShowCoin(0)} />

      {/* Thaler toast */}
      <ThalerToast amount={thalerToast} onClose={() => setThalerToast(null)} />

      {/* Level up */}
      <LevelUpModal open={!!levelXp} xp={levelXp} onClose={() => setLevelXp(null)} />
    </div>
  );
}

export default QuizTakingGamified;
