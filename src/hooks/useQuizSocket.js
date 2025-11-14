// src/hooks/useQuizSocket.js
import { useEffect, useRef, useState } from "react";

export default function useQuizSocket(roomId, handlers = {}) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("access");
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const url = `${protocol}://${host}/ws/quiz/${roomId}/?token=${token || ""}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setConnected(true);
      // send join immediately
      ws.send(JSON.stringify({ type: "join", room: roomId, username: localStorage.getItem("username") || "Guest" }));
    });

    ws.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        // dispatch to handlers
        const t = data.type;
        if (t && handlers[t]) handlers[t](data);
      } catch (err) {
        console.error("WS parse error", err);
      }
    });

    ws.addEventListener("close", () => setConnected(false));
    ws.addEventListener("error", (e) => console.error("WS error", e));

    return () => {
      try {
        ws.close();
      } catch {err}
    };
  }, [roomId]);

  const send = (payload) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    wsRef.current.send(JSON.stringify(payload));
    return true;
  };

  return { send, connected, ws: wsRef.current };
}
