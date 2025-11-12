export function createQuizSocket(roomId, onMessage, onOpen, onClose) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const base = import.meta.env.VITE_WS_URL || `${protocol}://${window.location.host}`;
  const url = `${base}/ws/quiz/${roomId}/`;
  const token = localStorage.getItem("access");
  // If you need to pass token, some servers accept ?token=... query
  const ws = new WebSocket(`${url}?token=${token}`);

  ws.onopen = () => onOpen?.();
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (e) {
      console.error("WS parse err", e);
    }
  };
  ws.onclose = () => onClose?.();
  ws.onerror = (e) => console.error("WS error", e);

  return ws;
}
