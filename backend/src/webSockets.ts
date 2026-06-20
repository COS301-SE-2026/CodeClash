import WebSocket from "ws";
import UserDto from "./Matchmaking Service/matchmaking.dto";

const clientList = new Map<WebSocket, UserDto>();


export const registerConnection = (ws : WebSocket, userId : string) =>
    clientList.set(ws,userId);

export const removeConnection = (ws : WebSocket) =>
    clientList.delete(ws);

export const getClient = (ws : WebSocket) =>
    clientList.get(ws);

export default clientList;