// src/pages/QuizMultiplayer.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { createQuizSocket } from "../lib/multiplayer";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

export default function QuizMultiplayer() {
  const { roomId } = useParams(); // this is the room code
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const roomCode = useMemo(() => (roomId || "").toUpperCase(), [roomId]);
  const spectatorParam = searchParams.get("spectator");
  const joinAsSpectator = spectatorParam === "1";

  const [room, setRoom] = useState(null);
  const [question, setQuestion] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [status, setStatus] = useState("waiting"); // waiting | active | finished
  const [selectedOption, setSelectedOption] = useState(null);
  const [locked, setLocked] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [isSpectator, setIsSpectator] = useState(joinAsSpectator);
  const [connecting, setConnecting] = useState(true);
  const [wsError, setWsError] = useState(null);

  const wsRef = useRef(null);

  // --- REST helpers -------------------------------------------------

  const joinRoom = useCallback(
    async (code, spectatorFlag) => {
      await api.post(`/multiplayer/rooms/${code}/join/`, {
        is_spectator: spectatorFlag,
      });
    },
    []
  );

  const fetchRoom = useCallback(async (code) => {
    const { data } = await api.get(`/multiplayer/rooms/${code}/`);
    setRoom(data);
    setStatus(data.status || "waiting");
  }, []);

  // --- WebSocket setup ----------------------------------------------

  useEffect(() => {
    if (!roomCode) return;

    let cancelled = false;

    (async () => {
      try {
        setConnecting(true);
        setWsError(null);

        // 1) join via REST
        await joinRoom(roomCode, joinAsSpectator);

        // 2) fetch room meta
        await fetchRoom(roomCode);

        // 3) open WS
        const ws = createQuizSocket(roomCode, (msg) => {
          if (!msg || cancelled) return;

          switch (msg.type) {
            case "state_update": {
              const data = msg.data || {};
              const started = !!data.started;
              setStatus(started ? "active" : "waiting");

              // Update participants + host in room object
              setRoom((prev) => ({
                ...(prev || {}),
                host_id: data.host,
                participants: data.players || [],
                questionIndex: data.questionIndex,
                totalQuestions: data.totalQuestions,
              }));
              break;
            }

            case "question": {
              // msg: { type: "question", question, index, total }
              setQuestion(msg.question || null);
              setSelectedOption(null);
              setLocked(false);
              setStatus("active");
              break;
            }

            case "results": {
              // msg.payload: { summary, ranking }
              const payload = msg.payload || {};
              setFinalResults(payload);
              setRanking(payload.ranking || []);
              setStatus("finished");
              break;
            }

            default:
              break;
          }
        });

        wsRef.current = ws;
        setIsSpectator(joinAsSpectator);
        setConnecting(false);
      } catch (err) {
        console.error("WS init / join error:", err);
        setConnecting(false);
        setWsError("Failed to connect to multiplayer room.");
      }
    })();

    return () => {
      cancelled = true;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [roomCode, joinAsSpectator, joinRoom, fetchRoom]);

  const isHost = room && user && room.host_id === user.id;
  const participants = room?.participants || [];
  const roomTitle = room?.quiz_title || "Multiplayer quiz";

  // --- Answer handling ----------------------------------------------

  const handleAnswer = (optionId) => {
    if (!question || !optionId) return;
    if (locked || isSpectator) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready, cannot send answer");
      return;
    }

    try {
      ws.send(
        JSON.stringify({
          type: "answer",
          option_id: optionId,
        })
      );
    } catch (err) {
      console.warn("WS send answer error:", err);
    }

    setSelectedOption(optionId);
    setLocked(true);
  };

  // --- Host actions -------------------------------------------------

  const handleStartMatch = async () => {
    if (!roomCode || !isHost) return;

    try {
      // 1) REST: mark room active / allow audits/admin
      await api.post(`/multiplayer/rooms/${roomCode}/start/`);

      // 2) WS: actually trigger question loading
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "start_game",
          })
        );
      }

      showToast({
        title: "Match started",
        message: "Questions will appear live.",
        variant: "success",
      });
    } catch (err) {
      console.error("Start match error:", err);
      showToast({
        title: "Error",
        message: "Could not start the match.",
        variant: "error",
      });
    }
  };

  const handleRematch = async () => {
    if (!roomCode || !isHost) return;
    try {
      await api.post(`/multiplayer/rooms/${roomCode}/rematch/`);

      // tell WS to restart game
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "start_game",
          })
        );
      }

      setFinalResults(null);
      setSelectedOption(null);
      setLocked(false);
      setStatus("waiting");

      showToast({
        title: "Rematch requested",
        message: "Players remain in the room for a new round.",
        variant: "info",
      });
    } catch (err) {
      console.error("Rematch error:", err);
      showToast({
        title: "Error",
        message: "Could not trigger rematch.",
        variant: "error",
      });
    }
  };

  const handleBackToLobby = () => {
    navigate("/multiplayer");
  };

  // --- Render states ------------------------------------------------

  if (!roomCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-600">No room code provided.</div>
      </div>
    );
  }

  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
        <div className="flex items-center gap-3 bg-white/80 border border-white/60 rounded-3xl px-6 py-4 shadow-md">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:.15s]" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:.3s]" />
          <span className="text-xs text-slate-700">
            Connecting to room {roomCode}…
          </span>
        </div>
      </div>
    );
  }

  if (wsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow p-6 max-w-sm text-center">
          <p className="text-sm text-red-600 mb-3">{wsError}</p>
          <button
            onClick={handleBackToLobby}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Back to lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500">
              Room {roomCode}
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {roomTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {isSpectator
                ? "You are spectating this match."
                : "Answer in real time and climb the leaderboard."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold">
              Status: {status}
            </span>
            {isSpectator && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                Spectator mode
              </span>
            )}
            <button
              onClick={handleBackToLobby}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Lobby
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question + options */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Live question
              </h2>
              {isHost && status === "waiting" && (
                <button
                  onClick={handleStartMatch}
                  className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700"
                >
                  Start match
                </button>
              )}
            </div>

            {!question ? (
              <p className="text-xs text-slate-500">
                Waiting for the next question…
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  {question.text}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options?.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const base =
                      "w-full text-left px-4 py-3 rounded-2xl border text-xs font-medium transition";

                    let styles =
                      "border-slate-200 bg-slate-50 hover:bg-slate-100";

                    if (isSpectator) {
                      styles =
                        "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed";
                    } else if (isSelected) {
                      styles =
                        "border-blue-500 bg-blue-50 text-blue-900 shadow-sm";
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={locked || isSpectator}
                        onClick={() => handleAnswer(opt.id)}
                        className={`${base} ${styles}`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {status === "finished" && (
              <div className="mt-4 text-xs text-emerald-700">
                Match finished. See results on the right.
              </div>
            )}
          </div>

          {/* Right column: participants + results + rematch */}
          <div className="space-y-4">
            {/* Participants / scoreboard */}
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Players & ranking
                </h3>
                <span className="text-[11px] text-slate-500">
                  {participants.length} in room
                </span>
              </div>

              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {ranking.length === 0 && participants.length === 0 && (
                  <p className="text-xs text-slate-500">
                    Waiting for players…
                  </p>
                )}

                {(ranking.length ? ranking : participants).map(
                  (entry, idx) => {
                    const username =
                      entry.username ?? entry.user?.username ?? "Player";

                    const score = entry.score ?? 0;
                    const you =
                      user &&
                      (entry.user_id === user.id ||
                        entry.id === user.id ||
                        entry.username === user.username);

                    return (
                      <div
                        key={entry.user_id || entry.username || idx}
                        className={`flex items-center justify-between rounded-2xl px-3 py-1.5 text-[11px] ${
                          you
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-slate-50 border border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 w-4 text-right">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {username}
                          </span>
                          {you && (
                            <span className="text-[10px] text-blue-600">
                              (you)
                            </span>
                          )}
                          {entry.is_spectator && (
                            <span className="text-[10px] text-slate-400">
                              spectator
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {score} pts
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Final results + rematch */}
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Match summary
                </h3>
                {status === "finished" && isHost && (
                  <button
                    onClick={handleRematch}
                    className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold hover:bg-black"
                  >
                    Rematch
                  </button>
                )}
              </div>

              {status !== "finished" && !finalResults && (
                <p className="text-xs text-slate-500">
                  Results will appear here when the match ends.
                </p>
              )}

              {finalResults && (finalResults.ranking || []).length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {finalResults.ranking.map((r, idx) => {
                    const username =
                      r.username ?? r.user?.username ?? "Player";
                    const score = r.score ?? 0;
                    const correct = r.correct ?? r.correct_count ?? null;

                    const you =
                      user &&
                      (r.user_id === user.id ||
                        r.id === user.id ||
                        r.username === user.username);

                    return (
                      <div
                        key={r.user_id || r.username || idx}
                        className={`flex items-center justify-between rounded-2xl px-3 py-1.5 text-[11px] ${
                          idx === 0
                            ? "bg-amber-50 border border-amber-200"
                            : "bg-slate-50 border border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 w-4 text-right">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {username}
                          </span>
                          {you && (
                            <span className="text-[10px] text-blue-600">
                              (you)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {correct != null && (
                            <span className="text-[10px] text-slate-500">
                              {correct} correct
                            </span>
                          )}
                          <span className="font-semibold text-slate-900">
                            {score} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
