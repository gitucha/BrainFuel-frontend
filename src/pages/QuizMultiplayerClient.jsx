import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function QuizMultiplayerClient() {
  const { roomId } = useParams();
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [log, setLog] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const url = `${proto}://${host}${port}/ws/quiz/${roomId}/`;
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      setConnected(true);
      wsRef.current.send(JSON.stringify({ type: "join", room: roomId, username: "player-" + Math.floor(Math.random()*9999) }));
    };

    wsRef.current.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "user_joined") {
        setPlayers((p)=> [...p, d.user]);
      } else if (d.type === "answer_broadcast") {
        setLog((l)=> [...l, `${d.user} answered q:${d.question_id} -> ${d.option_id}`]);
      }
    };

    wsRef.current.onclose = () => setConnected(false);
    return () => wsRef.current && wsRef.current.close();
  }, [roomId]);

  const sendAnswer = (question_id, option_id) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "answer", room: roomId, question_id, option_id, username: "me" }));
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2">Multiplayer Room: {roomId} ({connected ? "connected" : "connecting..."})</h3>
      <div className="mb-4">
        <strong>Players:</strong> {players.join(", ")}
      </div>
      <div className="mb-4">
        <button onClick={()=>sendAnswer(1,2)} className="px-3 py-1 bg-blue-600 text-white rounded">Send test answer</button>
      </div>
      <div className="bg-white p-4 rounded shadow max-h-40 overflow-auto">
        {log.map((l,i)=> <div key={i} className="text-sm">{l}</div>)}
      </div>
    </div>
  );
}

export default QuizMultiplayerClient;
