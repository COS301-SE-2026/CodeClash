

import type { ClientMessage, ServerMessage } from "../../../backend/src/Matchmaking Service/matchmaking.dto";



const WS_URL = "ws://localhost:3001";






//below is socket (singleton), currently only one and is shared across app - created upon bridge startup or restart
//MUST REIMPLEMENT AFTER DEMO
let socket: WebSocket | null = null;
const listeners = new Set<(msg: ServerMessage) => void>();




function getSocket(): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;




  socket = new WebSocket(WS_URL);




  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data as string) as ServerMessage;
      listeners.forEach((fn) => fn(msg));
    } catch {
      console.error("[socket] Failed to parse message", event.data);
    }
  };




  socket.onerror = (e) => console.error("[socket] error", e);
  socket.onclose = () => console.log("[socket] disconnected");




  return socket;
}


