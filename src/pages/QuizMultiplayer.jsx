import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createQuizSocket } from "../lib/multiplayer";

function LiveRanking({ ranking }) {
  return (
    <aside className="w-80 bg-white rounded-lg shadow-sm p-4 sticky top-20 h-[70vh] overflow-auto">
      <h4 className="font-semibold mb-3">Live Rankings</h4>
      <ul className="space-y-2">
        {ranking.map((p, i) => (
          <li key={p.user_id || i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-medium">{p.username}</div>
                <div className="text-xs text-gray-500">{p.status}</div>
              </div>
            </div>
            <div className="font-semibold text-blue-600">{p.score}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function QuizMultiplayer() {
  const { roomId } = useParams();
  const [ranking, setRanking] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [statusMsg, setStatusMsg] = useState("Connecting...");
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting, connected, disconnected
  const wsRef = useRef(null);

  // reusable connect logic
  const connectSocket = () => {
    setConnectionStatus("connecting");
    setStatusMsg("Reconnecting...");

    const socket = createQuizSocket(
      roomId,
      (msg) => {
        switch (msg.type) {
          case "ranking":
            setRanking(msg.payload);
            break;
          case "question":
            setQuestion(msg.payload);
            setSelectedIdx(null);
            break;
          case "info":
            setStatusMsg(msg.payload?.message || "Update received");
            break;
          default:
            console.warn("Unknown WS message", msg);
        }
      },
      () => {
        setStatusMsg("Connected");
        setConnectionStatus("connected");
      },
      () => {
        setStatusMsg("Disconnected");
        setConnectionStatus("disconnected");
      }
    );

    wsRef.current = socket;
  };

  // first connection
  useEffect(() => {
    if (!roomId) return;
    connectSocket();
    return () => {
      wsRef.current?.close();
      setConnectionStatus("disconnected");
    };
  }, [roomId]);

  const sendAnswer = (questionId, answerIndex) => {
    const socket = wsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert("Connection lost. Please reconnect.");
      return;
    }

    const message = {
      type: "answer",
      payload: { question_id: questionId, selected_index: answerIndex },
    };
    socket.send(JSON.stringify(message));
    setSelectedIdx(answerIndex);
  };

  // determine dot color / animation
  const connectionClasses = {
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    connecting: "bg-gray-400 animate-pulse",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Connection indicator */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${connectionClasses[connectionStatus]}`}
                title={`Status: ${connectionStatus}`}
              />
              <div>
                <h3 className="text-xl font-semibold">Live Multiplayer</h3>
                <p className="text-sm text-gray-500">
                  Room: {roomId} • {statusMsg}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Players: {ranking.length}
              </div>

              {connectionStatus === "disconnected" && (
                <button
                  onClick={connectSocket}
                  className="text-sm px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>

          {question ? (
            <>
              <div className="mb-6">
                <div className="text-lg font-semibold">{question.text}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendAnswer(question.id, idx)}
                      disabled={selectedIdx !== null}
                      className={`p-4 rounded-lg border text-left transition ${
                        isSelected
                          ? "bg-blue-50 border-blue-400"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="font-medium">{opt}</div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              Waiting for the next question…
            </div>
          )}
        </div>
      </div>

      <LiveRanking ranking={ranking} />
    </div>
  );
}
