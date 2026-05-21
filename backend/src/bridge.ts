import { WebSocketServer, WebSocket } from "ws";
import { matchmaking, enqueue, dequeue } from "./Matchmaking Service/matchmaking.service";
import matchmakingBus from "./events/matchmaking.events";
import { getMockUser, MOCK_QUEUE_OPPONENT_MATH, MOCK_QUEUE_OPPONENT_PROG } from "./mock/matchmaking.mock";
import { buildMatchDto } from "./Matchmaking Service/matchmaking.dto";
import type { ClientMessage, ServerMessage } from "./Matchmaking Service/matchmaking.dto";


const PORT = 3001;


const wss = new WebSocketServer({ port: PORT });



const connections = new Map<number, WebSocket>(); //for storing a map of userIds with associated web socket connection



console.log(`[bridge] WebSocket server running on ws://localhost:${PORT}`);

// seed function to seed a mock opponent into the redis queue when the bridge is started up
async function seed() {
  await enqueue(MOCK_QUEUE_OPPONENT_MATH, "math");
  await enqueue(MOCK_QUEUE_OPPONENT_PROG, "prog");
  console.log("[bridge] Mock opponent (Diso, id=2, elo=900) seeded into math + prog queues");
}



seed();

