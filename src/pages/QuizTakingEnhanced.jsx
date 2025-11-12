import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import PostQuizModal from "../components/PostQuizModal";

const FETCH_QUIZ = async (quizId) => {
  const { data } = await api.get(`/quizzes/${quizId}/`);
  return data;
};

// autosave endpoint - adjust if your backend has different route
const AUTOSAVE_ATTEMPT = async ({ quizId, payload }) => {
  const { data } = await api.post(`/quizattempts/partial/`, {
    quiz_id: quizId,
    ...payload,
  });
  return data;
};

const SUBMIT_ANSWER = async ({ quizId, payload }) => {
  const { data } = await api.post(`/quizzes/${quizId}/submit/`, payload);
  return data;
};

export default function QuizTakingEnhanced({ quizIdProp }) {
  const { id: quizIdParam } = useParams();
  const quizId = quizIdProp || quizIdParam;
  const qc = useQueryClient();

  // fetch quiz
  const { data: quiz, isLoading, error } = useQuery(["quiz", quizId], () =>
    FETCH_QUIZ(quizId)
);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  

  // store answers locally: { question_id: selected_option_index }
  const answersRef = useRef({});

  // Autosave mutation
  const autosaveMut = useMutation(AUTOSAVE_ATTEMPT, {
    onError: (err) => console.error("Autosave failed", err),
  });

  // Submit mutation
  const submitMut = useMutation(SUBMIT_ANSWER, {
    onSuccess: (data) => {
      // optional: invalidate quiz-related queries or refetch user profile
      qc.invalidateQueries(["quiz", quizId]);
      // if backend returns final result & quiz finished, show modal
      if (data?.finished) {
        setFinalResult(data);
        setOpenResult(true);
      }
    },
    onError: (err) => {
      console.error("Submit failed", err);
      alert("Submit failed — check network or try again.");
    },
  });

  // Setup autosave timer (every 15s)
  useEffect(() => {
    const id = setInterval(() => {
      if (!quiz) return;
      const payload = {
        answers: Object.entries(answersRef.current).map(([question_id, option_idx]) => ({
          question_id,
          selected_option: option_idx,
        })),
        current_index: qIndex,
        // optionally include elapsed time etc.
      };
      autosaveMut.mutate({ quizId, payload });
    }, 15000);

    return () => clearInterval(id);
  }, [quiz, qIndex, autosaveMut, quizId]);

  if (isLoading) return <div className="p-8">Loading quiz...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load quiz.</div>;
  if (!quiz) return null;

  const question = quiz.questions[qIndex];

  const handleSelect = (optionIdx) => {
    setSelected(optionIdx);
  };

  const handleSubmit = async () => {
    if (selected === null) return;
    // mark in local answers
    answersRef.current[question.id] = selected;

    // payload for this submission (backend expects an array or single)
    const payload = {
      answers: [{ question_id: question.id, selected_option: selected }],
      // optional: elapsed_time etc.
    };

    // optimistic UI: mark selected as submitted (visual)
    submitMut.mutate(
      { quizId, payload },
      {
        onSuccess: (data) => {
          // If backend returns feedback for this question, we could display
          // If returned finished flag, show final result
          if (data?.finished) {
            setFinalResult(data);
            setOpenResult(true);
          } else {
            // after short delay, go to next question automatically
            setTimeout(() => {
              goNext();
            }, 700);
          }
        },
      }
    );
  };

  const goNext = () => {
    if (qIndex < quiz.questions.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setQIndex((v) => v + 1);
        setSelected(null);
        setTransitioning(false);
      }, 350);
    } else {
      // final submit of whole attempt if backend requires it
      finishAttempt();
    }
  };

  const finishAttempt = async () => {
    try {
      // submit all answers to finalize attempt
      const payload = {
        answers: Object.entries(answersRef.current).map(([question_id, option_idx]) => ({
          question_id,
          selected_option: option_idx,
        })),
      };
      const { data } = await api.post(`/quizzes/${quizId}/submit/`, payload);
      setFinalResult(data);
      setOpenResult(true);
      // optionally invalidate user/me to refresh xp
      qc.invalidateQueries(["me"]);
    } catch (err) {
      console.error("Finish attempt failed", err);
      alert("Final submission failed");
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-10">
      {/* Background avatar (light) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <img
          src={quiz.creator?.avatar_url || "/default-avatar.png"}
          alt="bg avatar"
          className="opacity-8 max-h-[420px] object-contain"
          style={{ opacity: 0.08, transform: "scale(1.12)" }}
        />
      </div>

      <div className="relative z-10">
        <div className="bg-white rounded-xl shadow p-6">
          {/* podium / header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500">Quiz</div>
              <div className="text-lg font-semibold text-gray-800">{quiz.title}</div>
            </div>
            <div className="text-sm text-gray-500">
              {qIndex + 1}/{quiz.questions.length} • XP: {quiz.xp || 0}
            </div>
          </div>

          {/* question area */}
          <div className={`transition-transform duration-300 ${transitioning ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}>
            <div className="text-lg font-semibold text-gray-800 mb-4">
              {question.text}
            </div>
          </div>

          {/* answers 2x2 */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 transition-transform duration-300 ${transitioning ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"}`}>
            {question.options.map((opt, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-lg text-left border transition ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div className="font-medium text-gray-800">{opt}</div>
                </button>
              );
            })}
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">Time Left: {quiz.time_limit || "—"}</div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className={`px-4 py-2 rounded ${selected === null ? "bg-gray-200 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Submit
              </button>

              <button
                onClick={goNext}
                className="px-3 py-2 border rounded text-sm"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      <PostQuizModal
        open={openResult}
        onClose={() => setOpenResult(false)}
        result={finalResult}
      />
    </div>
  );
}
