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



// below is connection handler for websocket
wss.on("connection", (ws: WebSocket) => {
  let connectedUserId: number | null = null;


  ws.on("message", async (raw) => {
    let msg: ClientMessage;


    try {
      msg = JSON.parse(raw.toString()) as ClientMessage;
    } catch {
      send(ws, { type: "ERROR", message: "Invalid message format" });
      return;
    }


    // if a player joins the queue:
    if (msg.type === "JOIN") {
      const { userId, gameMode } = msg;
      connectedUserId = userId;
      connections.set(userId, ws);


      const userRecord = getMockUser(userId);
      if (!userRecord) {
        send(ws, { type: "ERROR", message: `User ${userId} not found` });
        return;
      }


      const userDto = {
        id: userRecord.id,
        elo: userRecord.elo,
        game_mode: gameMode,
        joined_at: Date.now(),
        match_attempt: 1,
      };


      matchmakingBus.emit("player:joined", userDto);
      console.log(`[bridge] JOIN  userId=${userId} gameMode=${gameMode} elo=${userRecord.elo}`);



      // if a player is in queue already, the player joining is paired with them, if queue is empty, joining player is added
      const result = await matchmaking(userDto);



      if (!result) {
        // No opponent yet
        send(ws, { type: "WAITING" });
        matchmakingBus.emit("match:searching", userDto);
        return;
      }



      //Match found
      const p1 = getMockUser(result.player_1_id);
      const p2 = getMockUser(result.player_2_id);





      const match = buildMatchDto("1",
        result.player_1_id, p1?.elo ?? userRecord.elo,
        result.player_2_id, p2?.elo ?? userRecord.elo,
        gameMode
      );



      matchmakingBus.emit("match:found", result.player_1_id, result.player_2_id);
      matchmakingBus.emit("match:created", match);



      console.log(`[bridge] MATCHED  ${result.player_1_id} vs ${result.player_2_id}  diff=${match.difficulty}`);



      // both players will received MATCHED as a console message when real players are in queue (not now for demo)
      const p1ws = connections.get(result.player_1_id);
      const p2ws = connections.get(result.player_2_id);




      const matchMsg: ServerMessage = { type: "MATCHED", match };
      if (p1ws) send(p1ws, matchMsg);
      if (p2ws) send(p2ws, matchMsg);
    }




   
    if (msg.type === "LEAVE") {
      const { userId } = msg;
      await dequeue(userId, "math").catch(() => {});
      await dequeue(userId, "prog").catch(() => {});




      // if (userId !== 2) { //for demo
      //   await dequeue(userId, "math").catch(() => {});
      //   await dequeue(userId, "prog").catch(() => {});
      // }
      connections.delete(userId);
      connectedUserId = null;
      console.log(`[bridge] LEAVE  userId=${userId}`);
    }
  });




  // clean up if the browser tab closes
  ws.on("close", async () => {
    // if (connectedUserId !== null && connectedUserId !== 2) {
      if (connectedUserId !== null){
      await dequeue(connectedUserId, "math").catch(() => {});
      await dequeue(connectedUserId, "prog").catch(() => {});
      connections.delete(connectedUserId);
      console.log(`[bridge] disconnected  userId=${connectedUserId}`);
    }
  });
});




//Event listeners
matchmakingBus.on("player:joined", (u) => console.log(`[event] player:joined  id=${u.id}`));
matchmakingBus.on("match:searching", (u) => console.log(`[event] match:searching  id=${u.id} attempt=${u.match_attempt}`));
matchmakingBus.on("match:found", (p1, p2) => console.log(`[event] match:found  ${p1} vs ${p2}`));
matchmakingBus.on("match:created", (m) => console.log(`[event] match:created  id=${m.match_id} diff=${m.difficulty} time=${m.time_limit}s`));




//Helpers
function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}
