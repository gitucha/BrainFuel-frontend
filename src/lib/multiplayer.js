// src/lib/multiplayer.js
export function createQuizSocket(roomCode, onMessage) {
  const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsScheme}://${window.location.host}/ws/quiz/${roomCode}/`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("[WS] connected to room", roomCode);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // data will look like:
      // { type: "state_update", data: {...} }
      // { type: "question", question: {...}, index, total }
      // { type: "results", payload: {...} }
      if (onMessage) onMessage(data);
    } catch (err) {
      console.warn("[WS] parse error", err);
    }
  };

  ws.onerror = (event) => {
    console.warn("[WS] error", event);
  };

  ws.onclose = () => {
    console.log("[WS] closed for room", roomCode);
  };

  return ws;
}
