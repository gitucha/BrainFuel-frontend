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

  // --- QUERY ---
  const { data: quiz, isFetching } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => fetchQuiz(id),
    enabled: !!id,
  });

  // --- STATES ---
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [xpGained, setXpGained] = useState(0);
  const [thalersEarned, setThalersEarned] = useState(0);
  const [streakPopup, setStreakPopup] = useState(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [coinAmount, setCoinAmount] = useState(0);

  // --- SUBMIT ---
  const submitQuiz = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/quizzes/${id}/submit/`, payload);
      return data;
    },
    onSuccess: (data) => {
      setHasSubmitted(true);

      setXpGained(data.xp_earned || 0);
      setThalersEarned(data.thalers_earned || 0);
      setCoinAmount(data.thalers_earned || 0);
      if (data.streak) setStreakPopup(data.streak);

      if (data.leveled_up) {
        setNewLevel(data.new_level);
        setLevelUpOpen(true);
      }

      qc.invalidateQueries(["me"]);
      setTimeout(() => navigate("/dashboard"), 1800);
    },
    onError: (err) => {
      console.error("Submit error:", err);
      alert("Submission failed.");
    },
  });

  // --- TIMER INIT ---
  useEffect(() => {
    if (!quiz) return;
    if (typeof quiz.time_limit === "number") {
      setTimeLeft(quiz.time_limit);
      return;
    }
    const diffMap = { easy: 90, medium: 120, hard: 180 };
    const diff = (quiz.difficulty || "easy").toLowerCase();
    setTimeLeft(diffMap[diff] || 90);
  }, [quiz]);

  // --- TIMER LOOP ---
  useEffect(() => {
    if (!quiz || !quiz.questions) return;
    if (hasSubmitted) return;
    if (typeof timeLeft !== "number") return;

    if (timeLeft <= 0) {
      if (!submitQuiz.isLoading) submitQuiz.mutate({ answers });
      return;
    }

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, hasSubmitted, quiz, answers, submitQuiz]);

  // --- ENSURE INDEX IN RANGE ---
  useEffect(() => {
    if (quiz && quiz.questions && index >= quiz.questions.length) {
      setIndex(quiz.questions.length - 1);
    }
  }, [index, quiz]);

  // --- RESET STATE ON QUESTION CHANGE ---
  useEffect(() => {
    setSelected(null);
    setLocked(false);
  }, [index]);

  // ----------------------------
  // NOW the RETURNS can appear
  // ----------------------------

  if (isFetching) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6">Quiz not found.</div>;
  if (!quiz.questions || quiz.questions.length === 0)
    return <div className="p-6 text-red-600">No questions.</div>;


  // ---------------- CURRENT QUESTION ----------------
  const q = quiz.questions[index];
  const correctOptionId = q?.options?.find((o) => o.is_correct)?.id ?? null;

  // reset state when entering new question


  // ---------------- HANDLERS ----------------
  const handlePick = (optionId) => {
    if (locked || submitQuiz.isLoading || hasSubmitted) return;

    setSelected(optionId);
    setLocked(true);

    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionId,
    }));

    // auto-next
    setTimeout(() => {
      if (index === quiz.questions.length - 1) {
        if (!submitQuiz.isLoading && !hasSubmitted) {
          submitQuiz.mutate({ answers });
        }
        return;
      }

      setIndex((i) => i + 1);
    }, 900);
  };

  const handleNext = () => {
    if (!selected || locked) return;

    if (index === quiz.questions.length - 1) {
      submitQuiz.mutate({ answers });
      return;
    }

    setIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (index > 0 && !submitQuiz.isLoading) {
      setIndex((i) => i - 1);
    }
  };

  const formatTime = (s) => {
    if (typeof s !== "number") return "--:--";
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;
  };

  // ---------------- UI ----------------
  return (
    <div className="relative min-h-screen bg-linear-to-b from-indigo-50 to-white p-6">

      {/* Background avatar */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <img
          src={user?.profile_picture || "/assets/default-avatar.png"}
          className="w-96 h-96 rounded-full object-cover blur-md"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Timer */}
        <div className="flex justify-center mb-4">
          <div className="px-6 py-2 bg-red-600 text-white rounded-full text-lg font-bold">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-500 mb-3">
            Question {index + 1} / {quiz.questions.length}
          </div>

          <h2 className="text-2xl font-bold mb-6">{q.text}</h2>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt) => {
              const isCorrect = opt.id === correctOptionId;
              const isSelected = selected === opt.id;

              let bg = "bg-gray-50 border-gray-300";

              if (locked) {
                if (isCorrect) bg = "bg-green-100 border-green-600";
                else if (isSelected) bg = "bg-red-100 border-red-600";
              } else if (isSelected) {
                bg = "bg-yellow-100 border-yellow-500 scale-[1.02]";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt.id)}
                  disabled={locked}
                  className={`p-4 rounded-lg border transition transform ${bg}
                    ${locked ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.01]"}
                  `}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={index === 0 || locked}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!selected}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow disabled:bg-gray-300"
            >
              {index === quiz.questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Rewards */}
      {xpGained > 0 && <XpProgress amount={xpGained} />}
      {thalersEarned > 0 && <ThalerToast amount={thalersEarned} />}
      {coinAmount > 0 && (
        <CoinBurst amount={coinAmount} onDone={() => setCoinAmount(0)} />
      )}
      {streakPopup && (
        <StreakToast streak={streakPopup} onClose={() => setStreakPopup(null)} />
      )}
      <LevelUpModal
        open={levelUpOpen}
        level={newLevel}
        onClose={() => setLevelUpOpen(false)}
      />
    </div>
  );
}
