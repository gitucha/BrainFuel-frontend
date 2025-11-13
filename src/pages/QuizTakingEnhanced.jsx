import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import PostQuizModal from "../components/PostQuizModal";
import LevelUpModal from "../components/LevelUpModal";
import ThalerToast from "../components/ThalerToast";
import { useAuth } from "../hooks/useAuth";

const fetchQuiz = async (quizId) => {
  const { data } = await api.get(`/quizzes/${quizId}/`);
  return data;
};

function QuizTakingEnhanced() {
  const { id } = useParams();
  const quizId = id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const {
    data: quiz,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz(quizId),
    enabled: !!quizId,
  });

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const answersRef = useRef({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(null);
  const [thalerToast, setThalerToast] = useState(null);

  const submitMut = useMutation({
    mutationFn: async ({ payload }) => {
      const { data } = await api.post(`/quizzes/${quizId}/submit/`, payload);
      return data;
    },
    onSuccess: (data) => {
      setResultData(data);
      setShowResult(true);
      if (data?.xp_earned) {
        qc.invalidateQueries({ queryKey: ["me"] });
        setShowLevelUp(data.xp_earned);
      }
      if (data?.thalers_earned) {
        setThalerToast(data.thalers_earned);
      }
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      console.error(err);
      alert("Quiz submission failed");
    },
  });

  useEffect(() => {
    setSelected(null);
  }, [qIndex]);

  if (isLoading) return <div className="p-8">Loading quiz…</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load quiz</div>;
  if (!quiz) return null;

  const question = quiz.questions[qIndex];

  const handleNext = () => {
    if (selected !== null)
      answersRef.current[String(question.id)] = selected;

    if (qIndex === quiz.questions.length - 1) {
      const payload = { answers: answersRef.current };
      submitMut.mutate({ payload });
      return;
    }
    setQIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (qIndex > 0) setQIndex((i) => i - 1);
  };

  const handleQuickSubmit = () => {
    if (selected !== null)
      answersRef.current[String(question.id)] = selected;

    submitMut.mutate({ payload: { answers: answersRef.current } });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-500 text-sm">{quiz.description}</p>
          </div>
          <p className="text-gray-500 text-sm">
            {qIndex + 1}/{quiz.questions.length}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-lg font-medium mb-4">{question.text}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`p-4 rounded-lg border text-left transition ${
                  selected === opt.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={qIndex === 0}
            className="px-3 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleQuickSubmit}
              className="px-3 py-2 border rounded"
            >
              Submit Now
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {qIndex === quiz.questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PostQuizModal open={showResult} onClose={() => setShowResult(false)} result={resultData} />
      <LevelUpModal open={!!showLevelUp} xp={showLevelUp} onClose={() => setShowLevelUp(null)} />
      <ThalerToast amount={thalerToast} onClose={() => setThalerToast(null)} />
    </div>
  );
}

export default QuizTakingEnhanced;
