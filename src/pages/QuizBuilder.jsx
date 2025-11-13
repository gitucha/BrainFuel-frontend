import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import QuestionBlock from "../components/QuestionBlock";

function QuizBuilder() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions((q) => [
      ...q,
      { id: Date.now(), text: "", options: [], correct: null },
    ]);
  };

  const saveQuestionMut = useMutation({
    mutationFn: async ({ quizId, text }) => {
      const { data } = await api.post(`/quizzes/${quizId}/add-question/`, {
        text,
      });
      return data; // returns new question ID
    },
  });

  const saveOptionMut = useMutation({
    mutationFn: async ({ quizId, questionId, text, is_correct }) => {
      const { data } = await api.post(
        `/quizzes/${quizId}/questions/${questionId}/add-option/`,
        { text, is_correct }
      );
      return data;
    },
  });

  const handleSave = async () => {
    for (let q of questions) {
      if (!q.text) continue;

      // Save question
      const savedQuestion = await saveQuestionMut.mutateAsync({
        quizId,
        text: q.text,
      });

      const newId = savedQuestion.id;

      // Save options
      for (let opt of q.options) {
        await saveOptionMut.mutateAsync({
          quizId,
          questionId: newId,
          text: opt.text,
          is_correct: opt.is_correct,
        });
      }
    }

    alert("Quiz saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-6">Quiz Builder</h2>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <QuestionBlock
            key={q.id}
            index={idx}
            data={q}
            update={(newQ) =>
              setQuestions((old) =>
                old.map((item) => (item.id === q.id ? newQ : item))
              )
            }
          />
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={addQuestion}
          className="px-4 py-2 border rounded"
        >
          Add Question
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizBuilder;
