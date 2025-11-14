import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useQuizSocket from "../hooks/useQuizSocket";
import api from "../lib/api";

const QuizMultiplayer = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({}); // {username: score}
  const [messages, setMessages] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  // handlers for websocket events
  const handlers = {
    joined: (data) => {
      setMessages((m) => [...m, { system: true, text: `${data.username} joined room ${data.room}` }]);
    },
    user_joined: (data) => {
      const u = data.user;
      setPlayers((p) => ({ ...p, [u]: p[u] || 0 }));
      setMessages((m) => [...m, { system: true, text: `${u} joined` }]);
    },
    answer_broadcast: (data) => {
      const u = data.user;
      const delta = data.score_delta || 10; // default 10
      setPlayers((p) => ({ ...p, [u]: (p[u] || 0) + delta }));
      setMessages((m) => [...m, { system: false, text: `${u} answered Q${data.question_id}` }]);
    },
  };

  const { send, connected } = useQuizSocket(roomId, handlers);

  useEffect(() => {
    // load quiz for the room if you have endpoint mapping; else demo load first approved quiz
    (async () => {
      try {
        const { data } = await api.get(`/quizzes/?limit=1`); // get first quiz (adjust as needed)
        if (data.results && data.results.length) setQuiz(data.results[0]);
      } catch (err) {
        console.error("Failed load quiz", err);
      }
    })();
  }, []);

  const handleAnswer = (optionId) => {
    if (!quiz) return;
    const q = quiz.questions ? quiz.questions[currentQuestionIndex] : null;
    const payload = {
      type: "answer",
      room: roomId,
      question_id: q ? q.id : currentQuestionIndex,
      option_id: optionId,
      score_delta: 10,
    };
    send(payload);
    setSelected(optionId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Multiplayer Room: {roomId}</h2>
          <div className="mb-4 text-sm text-gray-500">Status: {connected ? "Connected" : "Connecting..."}</div>

          {!quiz && <div>Loading quiz for room...</div>}

          {quiz && (
            <>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Question {currentQuestionIndex + 1}</div>
                <h3 className="text-lg font-bold">{quiz.questions[currentQuestionIndex].text}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quiz.questions[currentQuestionIndex].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    className={`p-3 rounded border text-left ${
                      selected === opt.id ? "bg-yellow-100 border-yellow-500" : "bg-gray-50"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                  className="px-3 py-2 border rounded"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex((i) => Math.min(quiz.questions.length - 1, i + 1))}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
                <button onClick={() => navigate("/dashboard")} className="px-3 py-2 border rounded">
                  Exit
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Live Activity</h4>
          <div className="space-y-2 max-h-48 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={`${m.system ? "text-gray-500 text-sm" : ""}`}>{m.text}</div>
            ))}
          </div>
        </div>
      </div>

      <aside>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h4 className="font-semibold mb-2">Players</h4>
          <div className="space-y-2">
            {Object.entries(players).length === 0 && <div className="text-gray-500">No players yet</div>}
            {Object.entries(players).map(([u, s]) => (
              <div key={u} className="flex justify-between">
                <div>{u}</div>
                <div className="font-semibold">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Room Controls</h4>
          <div className="flex flex-col gap-2">
            <button onClick={() => send({ type: "join", room: roomId, username: localStorage.getItem("username") || "Guest" })} className="px-3 py-2 bg-green-600 text-white rounded">Join Room</button>
            <button onClick={() => send({ type: "leave", room: roomId })} className="px-3 py-2 border rounded">Leave Room</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default QuizMultiplayer;
