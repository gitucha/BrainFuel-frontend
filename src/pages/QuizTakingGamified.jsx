import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

// reward components
import CoinBurst from "../components/CoinBurst";
import StreakToast from "../components/StreakToast";
import ThalerToast from "../components/ThalerToast";
import XpProgress from "../components/xpProgress";
import LevelUpModal from "../components/Levelupmodal";

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const fetchQuizSession = async (id, numQuestions, difficultyParam) => {
  const params = new URLSearchParams();
  params.set("num_questions", String(numQuestions));
  if (difficultyParam && difficultyParam !== "any") {
    params.set("difficulty", difficultyParam);
  }

  const { data } = await api.get(
    `/quizzes/${id}/questions/?${params.toString()}`
  );
  return data; // { quiz, num_questions, difficulty, questions }
};

export default function QuizTakingGamified() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const qp = useQueryParams();
  const { showToast } = useToast();

  // Read filters from URL (with sane defaults & clamping)
  const urlNumQuestions = (() => {
    const raw = qp.get("num_questions");
    const n = raw ? parseInt(raw, 10) : 10;
    if (Number.isNaN(n)) return 10;
    return Math.min(10, Math.max(1, n));
  })();

  const urlDifficulty = (qp.get("difficulty") || "any").toLowerCase();

  // --- QUERY: limited question set for this session ---
  const { data, isFetching } = useQuery({
    queryKey: ["quiz_session", id, urlNumQuestions, urlDifficulty],
    queryFn: () => fetchQuizSession(id, urlNumQuestions, urlDifficulty),
    enabled: !!id,
  });

  const quiz = data?.quiz;
  const questions = data?.questions || [];

  // --- STATES ---
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timerFired, setTimerFired] = useState(false);

  const [xpGained, setXpGained] = useState(0);
  const [thalersEarned, setThalersEarned] = useState(0);
  const [streakPopup, setStreakPopup] = useState(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [coinAmount, setCoinAmount] = useState(0);

  // --- SUBMIT MUTATION ---
  const { mutate, isLoading: isSubmitting } = useMutation({
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

      // Build a summary string for toast
      const parts = [];
      if (data.xp_earned) parts.push(`${data.xp_earned} XP`);
      if (data.thalers_earned) parts.push(`${data.thalers_earned} Thalers`);

      if (parts.length > 0) {
        showToast({
          title: "Quiz complete",
          message: `You earned ${parts.join(" and ")}.`,
          variant: "success",
        });
      } else {
        showToast({
          title: "Quiz complete",
          message: "Results saved.",
          variant: "info",
        });
      }

      qc.invalidateQueries(["me"]);
      setTimeout(() => navigate("/dashboard"), 1800);
    },
    onError: (err) => {
      console.error("Submit error:", err?.response || err);
      const msg =
        err?.response?.data?.detail ||
        "Quiz submission failed. Please try again.";

      showToast({
        title: "Error",
        message: msg,
        variant: "error",
      });

      // allow retry
      setHasSubmitted(false);
    },
  });

  // Safe submit wrapper to avoid double-submits
  const doSubmit = useCallback(
    (finalAnswers) => {
      if (hasSubmitted || isSubmitting) return;
      setHasSubmitted(true);
      mutate({ answers: finalAnswers });
    },
    [hasSubmitted, isSubmitting, mutate]
  );

  // --- TIMER INIT ---
  useEffect(() => {
    if (!quiz) return;

    // If backend ever provides a time_limit, respect it
    if (typeof quiz.time_limit === "number") {
      setTimeLeft(quiz.time_limit);
      return;
    }

    // Use URL difficulty if provided, otherwise quiz.difficulty
    const effectiveDifficulty =
      urlDifficulty !== "any"
        ? urlDifficulty
        : (quiz.difficulty || "easy").toLowerCase();

    const diffMap = { easy: 90, medium: 120, hard: 180 };
    setTimeLeft(diffMap[effectiveDifficulty] || 90);
    setTimerFired(false);
  }, [quiz, urlDifficulty]);

  // --- TIMER LOOP ---
  useEffect(() => {
    if (!quiz || questions.length === 0) return;
    if (typeof timeLeft !== "number") return;

    if (timeLeft <= 0) {
      if (!timerFired) {
        setTimerFired(true);
        doSubmit(answers);
      }
      return;
    }

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, quiz, questions.length, answers, timerFired, doSubmit]);

  // --- ENSURE INDEX IN RANGE ---
  useEffect(() => {
    if (questions.length > 0 && index >= questions.length) {
      setIndex(questions.length - 1);
    }
  }, [index, questions.length]);

  // --- RESET STATE ON QUESTION CHANGE ---
  useEffect(() => {
    setSelected(null);
    setLocked(false);
  }, [index]);

  // ---------------- GUARDS ----------------
  if (isFetching) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6">Quiz not found.</div>;
  if (!questions || questions.length === 0)
    return <div className="p-6 text-red-600">No questions for this session.</div>;

  // ---------------- CURRENT QUESTION ----------------
  const q = questions[index];
  const correctOptionId =
    q?.options?.find((o) => o.is_correct)?.id ?? null;

  // ---------------- HANDLERS ----------------
  const handlePick = (optionId) => {
    if (locked || isSubmitting || hasSubmitted) return;

    const newAnswers = {
      ...answers,
      [q.id]: optionId,
    };

    setSelected(optionId);
    setLocked(true);
    setAnswers(newAnswers);

    // auto-next after short delay
    setTimeout(() => {
      if (index === questions.length - 1) {
        if (!isSubmitting && !hasSubmitted) {
          doSubmit(newAnswers);
        }
        return;
      }

      setIndex((i) => i + 1);
    }, 900);
  };

  const handleNext = () => {
    if (!selected || locked) return;

    if (index === questions.length - 1) {
      doSubmit(answers);
      return;
    }

    setIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (index > 0 && !isSubmitting) {
      setIndex((i) => i - 1);
    }
  };

  const formatTime = (s) => {
    if (typeof s !== "number") return "--:--";
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ---------------- UI ----------------
  return (
    <div className="relative min-h-screen bg-linear-to-b from-indigo-50 to-white p-6">
      {/* Background avatar */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <img
          src={user?.profile_picture || "/assets/default-avatar.png"}
          className="w-96 h-96 rounded-full object-cover blur-md"
          alt="Avatar"
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
            Question {index + 1} / {questions.length}
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
                    ${locked ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.01]"}`}
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
              {index === questions.length - 1 ? "Finish" : "Next"}
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
        <StreakToast
          streak={streakPopup}
          onClose={() => setStreakPopup(null)}
        />
      )}
      <LevelUpModal
        open={levelUpOpen}
        level={newLevel}
        onClose={() => setLevelUpOpen(false)}
      />
    </div>
  );
}
