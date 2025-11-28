// src/pages/MultiplayerLobby.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function MultiplayerLobby() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [joinCode, setJoinCode] = useState("");

  // ----- FETCH QUIZZES (for host form) -----
  const {
    data: quizzes = [],
    isLoading: loadingQuizzes,
    isError: errorQuizzes,
  } = useQuery({
    queryKey: ["all-quizzes-for-mp"],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/?premium=false");
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.results)) return data.results;
      return [];
    },
    staleTime: 1000 * 60,
  });

  // ----- FETCH PUBLIC ROOMS -----
  const {
    data: publicRooms = [],
    isLoading: loadingRooms,
    refetch: refetchLobby,
  } = useQuery({
    queryKey: ["public-lobby"],
    queryFn: async () => {
      const { data } = await api.get("/multiplayer/lobby/");
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 10_000, // auto-refresh every 10s
  });

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!selectedQuizId) {
      showToast({
        title: "Select a quiz",
        message: "Choose a quiz to host a room.",
        variant: "error",
      });
      return;
    }

    try {
      const payload = {
        quiz_id: selectedQuizId,
        is_public: true,
        difficulty,
        question_count: questionCount,
        max_players: maxPlayers,
      };
      const { data } = await api.post("/multiplayer/rooms/", payload);
      showToast({
        title: "Room created",
        message: `Share code ${data.code} with your friends.`,
        variant: "success",
      });
      navigate(`/multiplayer/${data.code}`);
    } catch (err) {
      console.error("Create room error:", err);
      const msg =
        err?.response?.data?.detail ||
        "Failed to create room. Please try again.";
      showToast({ title: "Error", message: msg, variant: "error" });
    }
  };

  const handleJoinByCode = (spectator = false) => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      showToast({
        title: "Enter a code",
        message: "Type a room code to join.",
        variant: "error",
      });
      return;
    }
    navigate(`/multiplayer/${code}?spectator=${spectator ? "1" : "0"}`);
  };

  const handleJoinRoomFromLobby = (code, spectator = false) => {
    navigate(`/multiplayer/${code}?spectator=${spectator ? "1" : "0"}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Multiplayer Lobby
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Host a room, join with a code, or jump into a public lobby.
            </p>
          </div>
          <button
            onClick={refetchLobby}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh lobby
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Host a room */}
          <section className="lg:col-span-1 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Host a new room
            </h2>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 font-medium text-slate-700">
                  Quiz
                </label>
                {loadingQuizzes ? (
                  <div className="text-slate-500 text-xs">Loading quizzes…</div>
                ) : errorQuizzes ? (
                  <div className="text-red-500 text-xs">
                    Failed to load quizzes.
                  </div>
                ) : (
                  <select
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                  >
                    <option value="">Select a quiz</option>
                    {quizzes.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}{" "}
                        {q.category ? `(${q.category})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Difficulty
                  </label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Questions
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={questionCount}
                    onChange={(e) =>
                      setQuestionCount(
                        Math.max(
                          1,
                          Math.min(10, Number(e.target.value) || 1)
                        )
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-slate-700">
                  Max players
                </label>
                <input
                  type="number"
                  min={2}
                  max={16}
                  value={maxPlayers}
                  onChange={(e) =>
                    setMaxPlayers(
                      Math.max(
                        2,
                        Math.min(16, Number(e.target.value) || 2)
                      )
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex justify-center items-center px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700"
              >
                Host room
              </button>
            </form>
          </section>

          {/* Join by code */}
          <section className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Join by code
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Got a room code from a friend? Enter it here to jump in.
            </p>

            <div className="flex flex-col gap-3 text-xs">
              <input
                type="text"
                maxLength={10}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs tracking-[0.25em] uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ROOMCODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleJoinByCode(false)}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  Join as player
                </button>
                <button
                  type="button"
                  onClick={() => handleJoinByCode(true)}
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black"
                >
                  Join as spectator
                </button>
              </div>
            </div>
          </section>

          {/* Public lobby list */}
          <section className="lg:col-span-1 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Public lobby
              </h2>
              <span className="text-[11px] text-slate-500">
                {publicRooms.length} room
                {publicRooms.length === 1 ? "" : "s"}
              </span>
            </div>

            {loadingRooms ? (
              <div className="text-xs text-slate-500">
                Loading public rooms…
              </div>
            ) : publicRooms.length === 0 ? (
              <div className="text-xs text-slate-500">
                No public rooms right now. Host one and invite others.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
                {publicRooms.map((room) => (
                  <div
                    key={room.code}
                    className="border border-slate-100 rounded-2xl px-3 py-2.5 bg-slate-50/60 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {room.quiz_title || "Quiz room"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {room.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Host:{" "}
                        <span className="font-medium">
                          {room.host_username || "Unknown"}
                        </span>{" "}
                        • {room.difficulty || "mixed"} •{" "}
                        {room.question_count || 5} questions
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Status: {room.status}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleJoinRoomFromLobby(room.code, false)
                        }
                        className="px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700"
                      >
                        Join
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleJoinRoomFromLobby(room.code, true)
                        }
                        className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold hover:bg-black"
                      >
                        Watch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
